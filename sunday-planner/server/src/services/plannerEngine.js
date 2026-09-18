/**
 * Sunday Planner — reja generatori.
 *
 * Kirish: budjet, vaqt oynasi, shahar, kim bilan, qiziqishlar, kayfiyat.
 * Chiqish: vaqt bo'yicha tartiblangan kun rejasi + budjet hisobi + alternativalar.
 *
 * Asosiy qoidalar:
 *  1. Budjet majburan sarflanmaydi — kayfiyatga qarab maqsadli sarf ulushi olinadi
 *     (masalan "tejamkor" kayfiyatda budjetning ~50% i).
 *  2. Har bir qadamda "shu qadamga qancha pul tegishi mumkin" degan limit bor,
 *     shuning uchun qimmat joy faqat pul yetsa tanlanadi.
 *  3. Joylar orasidagi masofa hisobga olinadi: yo'l vaqti jadvalga, yo'l puli
 *     esa budjetga qo'shiladi. Yaqin joylar ustunlikka ega.
 *  4. Har bir qadam uchun alternativalar tayyorlanadi.
 */

import { toMinutes, toHHMM, roundToStep, isOpenDuring } from '../utils/time.js';
import { travel } from '../utils/geo.js';
import { roundSum } from '../utils/money.js';
import { createRandom } from '../utils/random.js';

const MAX_ITEMS = 8;
const MIN_ACTIVITY_MINUTES = 45;
const BREAK_MINUTES = 10;

const SLOT_COMPAT = {
  breakfast: ['breakfast', 'snack'],
  meal: ['meal', 'snack'],
  snack: ['snack', 'meal'],
  outdoor: ['outdoor', 'active', 'daytime'],
  daytime: ['daytime', 'outdoor', 'entertainment', 'active'],
  entertainment: ['entertainment', 'active', 'daytime', 'evening'],
  active: ['active', 'entertainment', 'outdoor'],
  evening: ['evening', 'entertainment', 'snack', 'outdoor'],
};

const MOOD_PROFILE = {
  relax: { spend: 0.7, energy: 'low', priceStyle: 'mid' },
  adventure: { spend: 0.8, energy: 'high', priceStyle: 'mid' },
  fun: { spend: 0.82, energy: 'high', priceStyle: 'mid' },
  social: { spend: 0.78, energy: 'mid', priceStyle: 'mid' },
  active: { spend: 0.75, energy: 'high', priceStyle: 'mid' },
  quiet: { spend: 0.6, energy: 'low', priceStyle: 'low' },
  luxury: { spend: 0.92, energy: 'mid', priceStyle: 'high' },
  budget: { spend: 0.5, energy: 'mid', priceStyle: 'low' },
};

const CATEGORY_LIMIT = { kafe: 2 };

export const DAY_LABELS = {
  sunday: 'Yakshanba',
  saturday: 'Shanba',
  friday: 'Juma',
  monday: 'Dushanba',
  tuesday: 'Seshanba',
  wednesday: 'Chorshanba',
  thursday: 'Payshanba',
};

/* ------------------------------------------------------------------ */
/*  Kichik yordamchilar                                                */
/* ------------------------------------------------------------------ */

function moodProfile(mood) {
  return MOOD_PROFILE[mood] || MOOD_PROFILE.social;
}

function priceFor(place, style) {
  const min = place.priceMin ?? 0;
  const max = place.priceMax ?? min;
  if (max <= 0) return 0;
  if (style === 'low') return roundSum(min);
  if (style === 'high') return roundSum(min + (max - min) * 0.85);
  return roundSum(min + (max - min) * 0.4);
}

function energyScore(place, wanted) {
  if (!wanted || wanted === 'mid') return place.energy === 'mid' ? 4 : 2;
  if (place.energy === wanted) return 7;
  return place.energy === 'mid' ? 3 : 0;
}

function coords(place) {
  return place ? { lat: place.lat, lng: place.lng } : null;
}

/** Soatga qarab qanday qadam kerakligini aytadi. */
function neededSlot(cursor, used) {
  if (cursor <= 11 * 60 && !used.breakfast) return 'breakfast';
  if (cursor >= 11 * 60 + 15 && cursor <= 15 * 60 && !used.lunch) return 'meal';
  if (cursor >= 17 * 60 + 30 && cursor <= 21 * 60 && !used.dinner) return 'meal';
  if (cursor >= 19 * 60) return 'evening';
  if (cursor >= 16 * 60) return 'entertainment';
  if (cursor >= 13 * 60) return 'daytime';
  return 'outdoor';
}

/** Ovqatdan keyin darrov yana ovqat qo'ymaymiz. */
function avoidRepeat(slot, previousSlot) {
  const eating = ['meal', 'breakfast', 'snack'];
  if (previousSlot && eating.includes(previousSlot) && eating.includes(slot)) return 'outdoor';
  return slot;
}

/* ------------------------------------------------------------------ */
/*  Nomzodlarni baholash                                               */
/* ------------------------------------------------------------------ */

function baseFilter(places, input) {
  return places.filter((place) => {
    if (input.city && place.city && place.city !== input.city) return false;
    if (input.companion && place.companions?.length && !place.companions.includes(input.companion)) {
      return false;
    }
    return true;
  });
}

function evaluate(place, ctx) {
  const cost = priceFor(place, ctx.profile.priceStyle);
  const trip = travel(ctx.from, coords(place));
  const total = cost + trip.cost;
  const { input, allowance, budgetTight } = ctx;

  let score = 0;

  if (input.interests?.length) {
    score += input.interests.includes(place.category) ? 34 : -8;
  } else {
    score += 10;
  }
  if (place.moods?.includes(input.mood)) score += 14;
  if (place.slot === ctx.slot) score += 12;
  score += (place.rating || 4) * 5;
  score += energyScore(place, ctx.profile.energy);

  if (cost === 0) score += budgetTight ? 24 : 8;
  if (total > allowance) {
    score -= Math.min(70, ((total - allowance) / Math.max(allowance, 15000)) * 34);
  }
  if (ctx.profile.priceStyle === 'high' && cost > 0) score += 6;

  if (trip.mode === 'walk') score += 9;
  else score -= Math.min(16, trip.distanceKm * 1.8);
  score -= trip.minutes * 0.18;

  score -= 30 * (ctx.usedCategories.get(place.category) || 0);
  score += ctx.rnd() * 11;

  return { place, cost, trip, total, score };
}

/**
 * Qadamga mos nomzodlarni tartiblab qaytaradi.
 * Avval budjet limitiga sig'adiganlari, ular bo'lmasa — eng arzonlari.
 */
function rankCandidates(ctx, pool, usedIds) {
  const allowedSlots = SLOT_COMPAT[ctx.slot] || [ctx.slot];

  const entries = pool
    .filter((place) => !usedIds.has(place.id))
    .filter((place) => allowedSlots.includes(place.slot))
    .filter(
      (place) =>
        (ctx.usedCategories.get(place.category) || 0) < (CATEGORY_LIMIT[place.category] ?? 1),
    )
    .map((place) => evaluate(place, ctx))
    .filter((entry) => {
      const start = roundToStep(ctx.cursor + entry.trip.minutes);
      if (start + MIN_ACTIVITY_MINUTES > ctx.endMin) return false;
      const duration = Math.max(MIN_ACTIVITY_MINUTES, entry.place.durationMin || 60);
      return isOpenDuring(entry.place, start, Math.min(start + duration, ctx.endMin));
    });

  if (!entries.length) return [];

  const affordable = entries.filter((entry) => entry.total <= ctx.hardCap);

  // Limitga sigʻadigan nomzod boʻlmasa — eng arzonidan boshlaymiz.
  // (Juda kichik budjetda reja baribir chiqsin, lekin imkon qadar arzon.)
  if (!affordable.length) {
    return [...entries].sort((a, b) => a.total - b.total).slice(0, 5);
  }

  return affordable.sort((a, b) => b.score - a.score);
}

/* ------------------------------------------------------------------ */
/*  Vaqt jadvali                                                       */
/* ------------------------------------------------------------------ */

export function recomputeTimeline(items, startMin) {
  let cursor = startMin;
  return items.map((item, index) => {
    const previous = index === 0 ? null : items[index - 1].place;
    const trip = travel(coords(previous), coords(item.place));
    const start = roundToStep(cursor + trip.minutes);
    const end = start + item.durationMin;
    cursor = end + BREAK_MINUTES;
    return {
      ...item,
      transport: trip,
      startMin: start,
      endMin: end,
      time: toHHMM(start),
      endTime: toHHMM(end),
    };
  });
}

/**
 * Jadvalni TAYYOR yoʻllar bilan qayta hisoblaydi.
 * Real marshrut (OSRM) natijasi kelganda shu ishlatiladi.
 */
export function applyTrips(items, startMin, trips) {
  let cursor = startMin;
  return items.map((item, index) => {
    const trip = trips[index] || item.transport;
    const start = roundToStep(cursor + (trip?.minutes || 0));
    const end = start + item.durationMin;
    cursor = end + BREAK_MINUTES;
    return {
      ...item,
      transport: trip,
      startMin: start,
      endMin: end,
      time: toHHMM(start),
      endTime: toHHMM(end),
    };
  });
}

/* ------------------------------------------------------------------ */
/*  Statistika                                                         */
/* ------------------------------------------------------------------ */

export function computeTotals(items, budget) {
  const activityCost = items.reduce((sum, item) => sum + item.cost, 0);
  const transportCost = items.reduce((sum, item) => sum + (item.transport?.cost || 0), 0);
  const spend = activityCost + transportCost;
  const transportMinutes = items.reduce((sum, item) => sum + (item.transport?.minutes || 0), 0);
  const activeMinutes = items.reduce((sum, item) => sum + item.durationMin, 0);
  const paid = items.filter((item) => item.cost > 0);
  const mostExpensive = paid.length
    ? paid.reduce((max, item) => (item.cost > max.cost ? item : max), paid[0])
    : null;

  return {
    activities: items.length,
    activityCost,
    transportCost,
    spend,
    remaining: Math.max(0, budget - spend),
    over: Math.max(0, spend - budget),
    freeCount: items.filter((item) => item.cost === 0).length,
    activeMinutes,
    transportMinutes,
    walkCount: items.filter((item) => item.transport?.mode === 'walk').length,
    mostExpensive: mostExpensive
      ? { id: mostExpensive.id, name: mostExpensive.place.name, cost: mostExpensive.cost }
      : null,
    usedPercent: budget > 0 ? Math.min(180, Math.round((spend / budget) * 100)) : 0,
  };
}

/* ------------------------------------------------------------------ */
/*  Asosiy generator                                                   */
/* ------------------------------------------------------------------ */

export function buildPlan(input, places, meta = {}) {
  const startMin = toMinutes(input.startTime);
  const endMin = toMinutes(input.endTime);
  const profile = moodProfile(input.mood);
  const rnd = createRandom(input.seed || 1);
  const budget = Number(input.budget) || 0;
  const spendTarget = Math.round(budget * profile.spend);

  const pool = baseFilter(places, input);
  const usedIds = new Set();
  const usedCategories = new Map();
  const used = { breakfast: false, lunch: false, dinner: false };

  const items = [];
  let cursor = startMin;
  let spent = 0;
  let previousSlot = null;
  let previousPlace = null;

  while (cursor + MIN_ACTIVITY_MINUTES <= endMin && items.length < MAX_ITEMS) {
    const slot = avoidRepeat(neededSlot(cursor, used), previousSlot);

    const remainingMinutes = endMin - cursor;
    const slotsLeft = Math.max(1, Math.ceil(remainingMinutes / 140));
    const remainingSpend = Math.max(0, spendTarget - spent);
    const allowance = Math.max(10000, Math.round(remainingSpend / slotsLeft));
    const headroom = Math.max(0, budget - spent);
    const hardCap = Math.max(0, Math.min(headroom, Math.round(allowance * 1.8)));
    const budgetTight = remainingSpend < spendTarget * 0.35;

    const ctx = {
      input,
      profile,
      slot,
      allowance,
      hardCap,
      rnd,
      usedCategories,
      budgetTight,
      cursor,
      endMin,
      from: coords(previousPlace),
    };

    let ranked = rankCandidates(ctx, pool, usedIds);
    if (!ranked.length && slot !== 'daytime') {
      ranked = rankCandidates({ ...ctx, slot: 'daytime' }, pool, usedIds);
    }
    if (!ranked.length) break;

    const best = ranked[0];
    const place = best.place;
    const start = roundToStep(cursor + best.trip.minutes);
    const duration = Math.min(
      Math.max(MIN_ACTIVITY_MINUTES, place.durationMin || 60),
      endMin - start,
    );

    items.push({
      id: `${place.id}-${items.length}`,
      slot,
      place,
      durationMin: duration,
      cost: best.cost,
      alternatives: ranked.slice(1, 5).map((entry) => ({ place: entry.place, cost: entry.cost })),
    });

    usedIds.add(place.id);
    usedCategories.set(place.category, (usedCategories.get(place.category) || 0) + 1);
    if (slot === 'breakfast') used.breakfast = true;
    if (slot === 'meal') {
      if (start < 16 * 60) used.lunch = true;
      else used.dinner = true;
    }

    spent += best.total;
    previousSlot = slot;
    previousPlace = place;
    cursor = start + duration + BREAK_MINUTES;
  }

  const timed = recomputeTimeline(items, startMin);
  const totals = computeTotals(timed, budget);

  return {
    id: meta.id || `plan_${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    source: meta.source || 'demo',
    currency: 'UZS',
    day: input.day || 'sunday',
    dayLabel: DAY_LABELS[input.day] || DAY_LABELS.sunday,
    city: input.city || 'tashkent',
    cityLabel: input.cityLabel || 'Toshkent',
    startTime: toHHMM(startMin),
    endTime: toHHMM(endMin),
    budget,
    spendTarget,
    mood: input.mood,
    companion: input.companion,
    interests: input.interests || [],
    seed: input.seed || 1,
    items: timed,
    totals,
    budgetFit: totals.over > 0 ? 'over' : 'ok',
  };
}

/* ------------------------------------------------------------------ */
/*  Activity almashtirish                                              */
/* ------------------------------------------------------------------ */

export function swapActivity(plan, index, placeId, places = []) {
  const items = [...(plan.items || [])];
  const target = items[index];
  if (!target) return plan;

  let replacement = (target.alternatives || []).find((alt) => alt.place.id === placeId);
  if (!replacement) {
    const place = places.find((p) => p.id === placeId);
    if (!place) return plan;
    replacement = { place, cost: priceFor(place, moodProfile(plan.mood).priceStyle) };
  }

  const nextAlternatives = [
    { place: target.place, cost: target.cost },
    ...(target.alternatives || []).filter((alt) => alt.place.id !== placeId),
  ].slice(0, 5);

  const endMin = toMinutes(plan.endTime);
  items[index] = {
    ...target,
    id: `${replacement.place.id}-${index}`,
    place: replacement.place,
    cost: replacement.cost,
    durationMin: Math.max(
      MIN_ACTIVITY_MINUTES,
      Math.min(replacement.place.durationMin || target.durationMin, target.durationMin + 45),
    ),
    alternatives: nextAlternatives,
  };

  let timed = recomputeTimeline(items, toMinutes(plan.startTime));
  // Kun oynasidan chiqib ketgan qadamlarni qisqartiramiz.
  timed = timed.map((item) =>
    item.endMin > endMin
      ? { ...item, durationMin: Math.max(MIN_ACTIVITY_MINUTES, endMin - item.startMin) }
      : item,
  );
  timed = recomputeTimeline(timed, toMinutes(plan.startTime));

  const totals = computeTotals(timed, plan.budget);
  return { ...plan, items: timed, totals, budgetFit: totals.over > 0 ? 'over' : 'ok' };
}

/* ------------------------------------------------------------------ */
/*  Budjetga moslashtirish                                             */
/* ------------------------------------------------------------------ */

export function optimizeToBudget(plan) {
  let current = { ...plan, items: [...(plan.items || [])] };
  let guard = 0;

  while (current.totals.spend > current.budget && guard < 14) {
    guard += 1;

    let bestSwap = null;
    current.items.forEach((item, index) => {
      (item.alternatives || []).forEach((alt) => {
        const saving = item.cost - alt.cost;
        if (saving <= 0) return;
        if (!bestSwap || saving > bestSwap.saving) {
          bestSwap = { index, placeId: alt.place.id, saving };
        }
      });
    });

    if (!bestSwap) break;
    current = swapActivity(current, bestSwap.index, bestSwap.placeId);
  }

  // Hali ham sig'masa — eng qimmat qadamni rejadan olib tashlaymiz.
  while (current.totals.spend > current.budget && current.items.length > 3 && guard < 22) {
    guard += 1;
    const expensiveIndex = current.items.reduce(
      (maxIndex, item, index, arr) => (item.cost > arr[maxIndex].cost ? index : maxIndex),
      0,
    );
    const items = current.items.filter((_, index) => index !== expensiveIndex);
    const timed = recomputeTimeline(items, toMinutes(current.startTime));
    current = { ...current, items: timed, totals: computeTotals(timed, current.budget) };
  }

  const fits = current.totals.spend <= current.budget;
  return {
    ...current,
    budgetFit: fits ? 'ok' : 'over',
    optimized: true,
    optimizeResult: fits ? 'fit' : 'partial',
  };
}

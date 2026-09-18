/**
 * Reja bilan bogʻliq barcha amallar shu yerda.
 *
 * Avval serverga murojaat qilinadi. Server oʻchiq boʻlsa (yoki tarmoq yoʻq boʻlsa)
 * xuddi shu generator brauzerda ishlaydi — sayt baribir toʻliq ishlaydi,
 * faqat "demo rejim" belgisi chiqadi.
 */

import { request, ApiError } from './apiClient.js';
import DEMO_PLACES from '../data/demoPlaces.js';
import {
  buildPlan,
  swapActivity,
  optimizeToBudget,
} from './engine/plannerEngine.js';

/**
 * Build vaqtida VITE_OFFLINE=true berilsa, sayt serverga umuman murojaat
 * qilmaydi va rejani faqat brauzerda tuzadi (masalan, statik demo uchun).
 */
const OFFLINE_ONLY = import.meta.env?.VITE_OFFLINE === 'true';

const MOOD_WORDS = {
  relax: 'sokin',
  adventure: 'sarguzashtli',
  fun: 'quvnoq',
  social: 'doʻstona',
  active: 'harakatli',
  quiet: 'tinch',
  luxury: 'maroqli',
  budget: 'tejamkor',
};

function localCopy(plan) {
  const mood = MOOD_WORDS[plan.mood] || 'yaxshi';
  return {
    headline: `${plan.totals.spend.toLocaleString('ru-RU').replace(/\u00a0/g, ' ')} soʻmlik ${mood} ${plan.dayLabel.toLowerCase()}`,
    summary: `${plan.startTime}–${plan.endTime} oraligʻida ${plan.items.length} ta nuqta, jami ${plan.totals.spend.toLocaleString('ru-RU').replace(/\u00a0/g, ' ')} soʻm.`,
    tip:
      plan.totals.remaining > 0
        ? 'Ortgan pulni zaxira sifatida qoldiring — kutilmagan xarajatlar chiqadi.'
        : 'Reja budjetga tiq toʻgʻri keldi.',
    source: 'template',
  };
}

function localPlan(form) {
  const plan = buildPlan({ ...form, seed: form.seed || Date.now() % 100000 }, DEMO_PLACES, {
    source: 'demo',
  });
  return { ...plan, copy: localCopy(plan), offline: true };
}

export async function createPlan(form) {
  if (OFFLINE_ONLY) return localPlan(form);
  try {
    const data = await request('/plan', { method: 'POST', body: form });
    return data.plan;
  } catch (error) {
    // Faqat tarmoq/server muammosida offline generatorga oʻtamiz.
    // Validatsiya xatosi boʻlsa — foydalanuvchi tuzatishi kerak.
    if (error instanceof ApiError && error.offline) {
      const plan = localPlan(form);
      if (!plan.items.length) throw error;
      return plan;
    }
    throw error;
  }
}

export async function swapPlanActivity(plan, index, placeId) {
  if (OFFLINE_ONLY || plan.offline) {
    return { ...swapActivity(plan, index, placeId, DEMO_PLACES), offline: true };
  }
  try {
    const data = await request('/plan/swap', { method: 'POST', body: { plan, index, placeId } });
    return data.plan;
  } catch (error) {
    if (error instanceof ApiError && error.offline) {
      return { ...swapActivity(plan, index, placeId, DEMO_PLACES), offline: true };
    }
    throw error;
  }
}

export async function fitPlanToBudget(plan) {
  if (OFFLINE_ONLY || plan.offline) {
    return { ...optimizeToBudget(plan), offline: true };
  }
  try {
    const data = await request('/plan/optimize', { method: 'POST', body: { plan } });
    return data.plan;
  } catch (error) {
    if (error instanceof ApiError && error.offline) {
      return { ...optimizeToBudget(plan), offline: true };
    }
    throw error;
  }
}

export async function checkApi() {
  if (OFFLINE_ONLY) return { online: false, offlineBuild: true };
  try {
    const data = await request('/health', { timeout: 4000 });
    return { online: true, ...data };
  } catch {
    return { online: false };
  }
}

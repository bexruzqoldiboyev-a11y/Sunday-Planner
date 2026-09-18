import { getPlaces } from '../services/placesService.js';
import {
  buildPlan,
  swapActivity,
  optimizeToBudget,
  applyTrips,
  computeTotals,
} from '../services/plannerEngine.js';
import { resolveTrips } from '../services/routingService.js';
import { writePlanCopy } from '../services/aiService.js';
import { ApiError } from '../utils/ApiError.js';
import { toMinutes } from '../utils/time.js';

/**
 * Rejadagi yoʻllarni haqiqiy marshrut (OSRM) bilan almashtiradi.
 * Xizmat ishlamasa reja oʻzgarishsiz qaytadi — foydalanuvchi buni sezmaydi.
 */
async function withRealTravel(plan) {
  try {
    const trips = await resolveTrips(plan.items);
    const items = applyTrips(plan.items, toMinutes(plan.startTime), trips);
    const totals = computeTotals(items, plan.budget);
    return {
      ...plan,
      items,
      totals,
      budgetFit: totals.over > 0 ? 'over' : 'ok',
      routing: trips.every((trip) => trip.source === 'osrm' || trip.source === 'start')
        ? 'osrm'
        : 'mixed',
    };
  } catch (error) {
    console.warn('[routing] real marshrut olinmadi:', error.message);
    return { ...plan, routing: 'estimate' };
  }
}

/** POST /api/plan — yangi reja tuzadi. */
export async function createPlan(req, res) {
  const input = req.planInput;
  const { places, source } = await getPlaces({ city: input.city });

  if (!places.length) {
    throw ApiError.badRequest('Bu shahar uchun hozircha joylar bazasi yoʻq.', {
      city: 'Boshqa shaharni tanlang.',
    });
  }

  const plan = buildPlan(input, places, { source });

  if (!plan.items.length) {
    throw ApiError.badRequest('Tanlangan shartlarga mos joy topilmadi.', {
      interests: 'Qiziqishlarni koʻproq tanlang yoki vaqt oynasini kengaytiring.',
    });
  }

  const routed = await withRealTravel(plan);
  const copy = await writePlanCopy(routed);
  res.json({ ok: true, plan: { ...routed, copy } });
}

/** POST /api/plan/swap — bitta activityni boshqasiga almashtiradi. */
export async function swapPlanActivity(req, res) {
  const { plan, index, placeId } = req.body || {};
  if (!plan || typeof index !== 'number' || !placeId) {
    throw ApiError.badRequest('plan, index va placeId kerak.');
  }

  const { places } = await getPlaces({ city: plan.city });
  const updated = await withRealTravel(swapActivity(plan, index, placeId, places));
  res.json({ ok: true, plan: updated });
}

/** POST /api/plan/optimize — rejani budjetga moslashtiradi. */
export async function optimizePlan(req, res) {
  const { plan } = req.body || {};
  if (!plan) throw ApiError.badRequest('plan obyekti kerak.');

  const updated = await withRealTravel(optimizeToBudget(plan));
  res.json({ ok: true, plan: { ...updated, optimized: true } });
}

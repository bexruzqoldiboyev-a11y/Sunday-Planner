import { getPlaces } from '../services/placesService.js';
import { buildPlan, swapActivity, optimizeToBudget } from '../services/plannerEngine.js';
import { writePlanCopy } from '../services/aiService.js';
import { ApiError } from '../utils/ApiError.js';

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

  const copy = await writePlanCopy(plan);
  res.json({ ok: true, plan: { ...plan, copy } });
}

/** POST /api/plan/swap — bitta activityni boshqasiga almashtiradi. */
export async function swapPlanActivity(req, res) {
  const { plan, index, placeId } = req.body || {};
  if (!plan || typeof index !== 'number' || !placeId) {
    throw ApiError.badRequest('plan, index va placeId kerak.');
  }

  const { places } = await getPlaces({ city: plan.city });
  const updated = swapActivity(plan, index, placeId, places);
  res.json({ ok: true, plan: updated });
}

/** POST /api/plan/optimize — rejani budjetga moslashtiradi. */
export async function optimizePlan(req, res) {
  const { plan } = req.body || {};
  if (!plan) throw ApiError.badRequest('plan obyekti kerak.');

  const updated = optimizeToBudget(plan);
  res.json({ ok: true, plan: updated });
}

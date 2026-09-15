import { toMinutes } from '../utils/time.js';
import { ApiError } from '../utils/ApiError.js';

const MOODS = ['relax', 'adventure', 'fun', 'social', 'active', 'quiet', 'luxury', 'budget'];
const COMPANIONS = ['solo', 'friends', 'family', 'couple'];

export const LIMITS = {
  budgetMin: 50000,
  budgetMax: 20000000,
  minWindowMinutes: 120,
};

/** So'rovni tekshiradi va tozalangan `req.planInput` ni tayyorlaydi. */
export function validatePlanRequest(req, _res, next) {
  const body = req.body || {};
  const errors = {};

  const budget = Number(body.budget);
  if (!Number.isFinite(budget) || budget <= 0) {
    errors.budget = 'Budjetni kiriting.';
  } else if (budget < LIMITS.budgetMin) {
    errors.budget = `Budjet kamida ${LIMITS.budgetMin.toLocaleString('ru-RU')} soʻm boʻlsin.`;
  } else if (budget > LIMITS.budgetMax) {
    errors.budget = 'Budjet juda katta — kichikroq summa kiriting.';
  }

  const start = toMinutes(body.startTime);
  const end = toMinutes(body.endTime);
  if (start === null) errors.startTime = 'Boshlanish vaqti notoʻgʻri.';
  if (end === null) errors.endTime = 'Tugash vaqti notoʻgʻri.';
  if (start !== null && end !== null) {
    if (end - start < LIMITS.minWindowMinutes) {
      errors.endTime = 'Kamida 2 soatlik vaqt oynasi kerak.';
    }
  }

  if (!body.city || typeof body.city !== 'string') {
    errors.city = 'Joylashuvni tanlang.';
  }

  const interests = Array.isArray(body.interests) ? body.interests.filter(Boolean) : [];
  const mood = MOODS.includes(body.mood) ? body.mood : 'social';
  const companion = COMPANIONS.includes(body.companion) ? body.companion : 'friends';

  if (Object.keys(errors).length) {
    return next(ApiError.badRequest('Maʼlumotlarni tekshiring', errors));
  }

  req.planInput = {
    day: typeof body.day === 'string' ? body.day : 'sunday',
    city: body.city,
    cityLabel: body.cityLabel || 'Toshkent',
    budget: Math.round(budget),
    startTime: body.startTime,
    endTime: body.endTime,
    interests,
    mood,
    companion,
    seed: Number(body.seed) || Math.floor(Math.random() * 100000) + 1,
  };

  return next();
}

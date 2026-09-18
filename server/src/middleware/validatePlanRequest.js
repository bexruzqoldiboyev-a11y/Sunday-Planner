import { toMinutes } from '../utils/time.js';
import { ApiError } from '../utils/ApiError.js';

const MOODS = ['relax', 'adventure', 'fun', 'social', 'active', 'quiet', 'luxury', 'budget'];
const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/** 'YYYY-MM-DD' → hafta kuni identifikatori. */
function weekdayFromDate(iso) {
  const match = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : WEEKDAYS[date.getDay()];
}
const COMPANIONS = ['solo', 'friends', 'family', 'couple'];

export const LIMITS = {
  // Budjet chegarasi yoʻq: foydalanuvchi xohlagan summani kiritadi.
  // Faqat texnik yuqori chegara qoldirilgan (hisob-kitob toʻgʻri ishlashi uchun).
  budgetMax: Number.MAX_SAFE_INTEGER,
  minWindowMinutes: 120,
};

/** So'rovni tekshiradi va tozalangan `req.planInput` ni tayyorlaydi. */
export function validatePlanRequest(req, _res, next) {
  const body = req.body || {};
  const errors = {};

  const budget = Number(body.budget);
  if (!Number.isFinite(budget) || budget <= 0) {
    errors.budget = 'Budjetni kiriting (0 dan katta son).';
  } else if (budget > LIMITS.budgetMax) {
    errors.budget = 'Summa juda katta.';
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

  const date = typeof body.date === 'string' ? body.date : null;
  const dayFromDate = weekdayFromDate(date);
  if (date && !dayFromDate) {
    errors.date = 'Sana notoʻgʻri (YYYY-MM-DD kutilgan).';
  }

  if (Object.keys(errors).length) {
    return next(ApiError.badRequest('Maʼlumotlarni tekshiring', errors));
  }

  req.planInput = {
    date,
    day: dayFromDate || (typeof body.day === 'string' ? body.day : 'sunday'),
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

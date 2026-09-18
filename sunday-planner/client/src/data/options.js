/**
 * Planner formasidagi barcha tanlovlar shu yerda.
 * Yangi shahar / qiziqish qo'shish uchun faqat shu fayl o'zgaradi.
 */

export const DAYS = [
  { id: 'sunday', key: 'day.sunday', label: 'Yakshanba', emoji: '☀️', available: true },
  { id: 'saturday', key: 'day.saturday', label: 'Shanba', emoji: '🌤', available: true },
  { id: 'friday', key: 'day.friday', label: 'Juma', emoji: '🌙', available: true },
  { id: 'weekday', key: 'day.weekday', label: 'Ish kuni kechqurun', emoji: '🌆', available: false },
];

export const CITIES = [
  { id: 'tashkent', label: 'Toshkent', available: true },
  { id: 'samarkand', label: 'Samarqand', available: false },
  { id: 'bukhara', label: 'Buxoro', available: false },
  { id: 'fergana', label: 'Fargʻona', available: false },
];

export const COMPANIONS = [
  { id: 'solo', key: 'who.solo', hintKey: 'who.solo.hint', label: 'Yolgʻiz', emoji: '🧍', hint: 'Oʻzim bilan oʻzim' },
  { id: 'friends', key: 'who.friends', hintKey: 'who.friends.hint', label: 'Doʻstlar bilan', emoji: '🧑‍🤝‍🧑', hint: 'Kompaniya bor' },
  { id: 'family', key: 'who.family', hintKey: 'who.family.hint', label: 'Oila bilan', emoji: '👨‍👩‍👧', hint: 'Bolalarga ham mos' },
  { id: 'couple', key: 'who.couple', hintKey: 'who.couple.hint', label: 'Juftlik bilan', emoji: '👫', hint: 'Ikkovlon' },
];

export const INTERESTS = [
  { id: 'kino', key: 'int.kino', label: 'Kino', emoji: '🎬' },
  { id: 'kafe', key: 'int.kafe', label: 'Kafe', emoji: '☕' },
  { id: 'restoran', key: 'int.restoran', label: 'Restoran', emoji: '🍔' },
  { id: 'park', key: 'int.park', label: 'Park', emoji: '🌳' },
  { id: 'sayr', key: 'int.sayr', label: 'Sayr', emoji: '🚶' },
  { id: 'gaming', key: 'int.gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'sport', key: 'int.sport', label: 'Sport', emoji: '⚽' },
  { id: 'shopping', key: 'int.shopping', label: 'Shopping', emoji: '🛍' },
  { id: 'muzey', key: 'int.muzey', label: 'Muzey', emoji: '🎨' },
  { id: 'photo', key: 'int.photo', label: 'Photo', emoji: '📸' },
  { id: 'bowling', key: 'int.bowling', label: 'Bowling', emoji: '🎳' },
  { id: 'karaoke', key: 'int.karaoke', label: 'Karaoke', emoji: '🎤' },
  { id: 'swimming', key: 'int.swimming', label: 'Suzish', emoji: '🏊' },
  { id: 'tabiat', key: 'int.tabiat', label: 'Tabiat', emoji: '🌄' },
  { id: 'entertainment', key: 'int.entertainment', label: 'Entertainment', emoji: '🎢' },
];

export const MOODS = [
  { id: 'relax', hintKey: 'mood.relax.hint', label: 'Relax', emoji: '🫧', hint: 'Shoshmasdan' },
  { id: 'adventure', hintKey: 'mood.adventure.hint', label: 'Adventure', emoji: '🧭', hint: 'Yangi joylar' },
  { id: 'fun', hintKey: 'mood.fun.hint', label: 'Fun', emoji: '🎉', hint: 'Kulgi koʻp' },
  { id: 'social', hintKey: 'mood.social.hint', label: 'Social', emoji: '🤝', hint: 'Odamlar orasida' },
  { id: 'active', hintKey: 'mood.active.hint', label: 'Active', emoji: '⚡️', hint: 'Harakat kerak' },
  { id: 'quiet', hintKey: 'mood.quiet.hint', label: 'Quiet', emoji: '🌙', hint: 'Tinchlik' },
  { id: 'luxury', hintKey: 'mood.luxury.hint', label: 'Luxury', emoji: '💎', hint: 'Oʻzimni erkalayman' },
  { id: 'budget', hintKey: 'mood.budget.hint', label: 'Budget', emoji: '🪙', hint: 'Tejab' },
];

/**
 * Budjet chegarasiz: foydalanuvchi xohlagan summani kiritadi.
 * Quyidagi qiymatlar faqat slider uchun qulaylik — u kiritilgan summaga
 * qarab oʻzi kengayadi (StepBudget ichida).
 */
export const BUDGET = {
  min: 0,
  sliderMax: 5000000,
  step: 10000,
  presets: [100000, 200000, 350000, 500000, 800000, 1200000, 2000000],
};

export const DEFAULT_FORM = {
  day: 'sunday',
  city: 'tashkent',
  cityLabel: 'Toshkent',
  budget: 500000,
  startTime: '09:00',
  endTime: '22:00',
  companion: 'friends',
  interests: ['kafe', 'sayr', 'kino'],
  mood: 'social',
};

export const CATEGORY_LOOKUP = Object.fromEntries(
  INTERESTS.map((interest) => [interest.id, interest]),
);

/**
 * Planner formasidagi barcha tanlovlar shu yerda.
 * Yangi shahar / qiziqish qo'shish uchun faqat shu fayl o'zgaradi.
 */

export const DAYS = [
  { id: 'sunday', label: 'Yakshanba', emoji: '☀️', available: true },
  { id: 'saturday', label: 'Shanba', emoji: '🌤', available: true },
  { id: 'friday', label: 'Juma', emoji: '🌙', available: true },
  { id: 'weekday', label: 'Ish kuni kechqurun', emoji: '🌆', available: false },
];

export const CITIES = [
  { id: 'tashkent', label: 'Toshkent', available: true },
  { id: 'samarkand', label: 'Samarqand', available: false },
  { id: 'bukhara', label: 'Buxoro', available: false },
  { id: 'fergana', label: 'Fargʻona', available: false },
];

export const COMPANIONS = [
  { id: 'solo', label: 'Yolgʻiz', emoji: '🧍', hint: 'Oʻzim bilan oʻzim' },
  { id: 'friends', label: 'Doʻstlar bilan', emoji: '🧑‍🤝‍🧑', hint: 'Kompaniya bor' },
  { id: 'family', label: 'Oila bilan', emoji: '👨‍👩‍👧', hint: 'Bolalarga ham mos' },
  { id: 'couple', label: 'Juftlik bilan', emoji: '👫', hint: 'Ikkovlon' },
];

export const INTERESTS = [
  { id: 'kino', label: 'Kino', emoji: '🎬' },
  { id: 'kafe', label: 'Kafe', emoji: '☕' },
  { id: 'restoran', label: 'Restoran', emoji: '🍔' },
  { id: 'park', label: 'Park', emoji: '🌳' },
  { id: 'sayr', label: 'Sayr', emoji: '🚶' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'sport', label: 'Sport', emoji: '⚽' },
  { id: 'shopping', label: 'Shopping', emoji: '🛍' },
  { id: 'muzey', label: 'Muzey', emoji: '🎨' },
  { id: 'photo', label: 'Photo', emoji: '📸' },
  { id: 'bowling', label: 'Bowling', emoji: '🎳' },
  { id: 'karaoke', label: 'Karaoke', emoji: '🎤' },
  { id: 'swimming', label: 'Suzish', emoji: '🏊' },
  { id: 'tabiat', label: 'Tabiat', emoji: '🌄' },
  { id: 'entertainment', label: 'Entertainment', emoji: '🎢' },
];

export const MOODS = [
  { id: 'relax', label: 'Relax', emoji: '🫧', hint: 'Shoshmasdan' },
  { id: 'adventure', label: 'Adventure', emoji: '🧭', hint: 'Yangi joylar' },
  { id: 'fun', label: 'Fun', emoji: '🎉', hint: 'Kulgi koʻp' },
  { id: 'social', label: 'Social', emoji: '🤝', hint: 'Odamlar orasida' },
  { id: 'active', label: 'Active', emoji: '⚡️', hint: 'Harakat kerak' },
  { id: 'quiet', label: 'Quiet', emoji: '🌙', hint: 'Tinchlik' },
  { id: 'luxury', label: 'Luxury', emoji: '💎', hint: 'Oʻzimni erkalayman' },
  { id: 'budget', label: 'Budget', emoji: '🪙', hint: 'Tejab' },
];

export const BUDGET = {
  min: 100000,
  max: 5000000,
  step: 50000,
  presets: [200000, 350000, 500000, 800000, 1200000],
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

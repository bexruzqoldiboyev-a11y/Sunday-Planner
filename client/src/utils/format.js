/** Matn va raqamlarni chiroyli koʻrsatish. */

export function formatSum(value) {
  const number = Math.round(Number(value) || 0);
  return number.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
}

export function formatMoney(value) {
  return `${formatSum(value)} soʻm`;
}

/** 0 boʻlsa "Bepul" deb yozamiz — bu foydalanuvchi uchun aniqroq. */
export function formatCost(value) {
  return Number(value) > 0 ? formatMoney(value) : 'Bepul';
}

export function formatDuration(minutes) {
  const total = Math.max(0, Math.round(Number(minutes) || 0));
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h && m) return `${h} soat ${m} daq`;
  if (h) return `${h} soat`;
  return `${m} daq`;
}

export function toMinutes(hhmm) {
  const match = String(hhmm || '').match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function toHHMM(minutes) {
  const total = Math.max(0, Math.round(minutes)) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const WEEKDAY_IDS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

/** ISO sanadan (YYYY-MM-DD) hafta kuni identifikatorini oladi. */
export function weekdayId(iso) {
  const date = parseDate(iso);
  return date ? WEEKDAY_IDS[date.getDay()] : 'sunday';
}

/** 'YYYY-MM-DD' ni mahalliy vaqt zonasida Date ga aylantiradi. */
export function parseDate(iso) {
  const match = String(iso || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toISODate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayISO() {
  return toISODate(new Date());
}

/** Bugundan keyingi eng yaqin shu hafta kuni (0 = yakshanba). */
export function nextWeekdayISO(weekday, fromDate = new Date()) {
  const date = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const diff = (weekday - date.getDay() + 7) % 7 || 7;
  date.setDate(date.getDate() + diff);
  return toISODate(date);
}

/** «14-sentabr, 2026» koʻrinishida. */
export function formatDateLong(iso, lang = 'uz') {
  const date = parseDate(iso);
  if (!date) return '';
  const locale = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-GB' : 'uz-UZ';
  try {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return iso;
  }
}

export function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat('uz-UZ', { day: 'numeric', month: 'long' }).format(new Date(iso));
  } catch {
    return '';
  }
}

export const TRANSPORT_LABEL = {
  start: 'Boshlanish nuqtasi',
  walk: 'piyoda',
  ride: 'taksi/transport',
};

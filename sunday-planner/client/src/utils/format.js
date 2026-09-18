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

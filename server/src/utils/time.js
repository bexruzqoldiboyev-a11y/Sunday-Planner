/** Vaqt bilan ishlash uchun kichik yordamchilar. Hammasi "daqiqa" birligida. */

export function toMinutes(hhmm) {
  if (typeof hhmm !== 'string') return null;
  const match = hhmm.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}

export function toHHMM(minutes) {
  const total = Math.max(0, Math.round(minutes)) % (24 * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Vaqtni 5 daqiqalik to'rga tekislaydi — jadval chiroyli ko'rinadi. */
export function roundToStep(minutes, step = 5) {
  return Math.round(minutes / step) * step;
}

export function durationLabel(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h && m) return `${h} soat ${m} daq`;
  if (h) return `${h} soat`;
  return `${m} daq`;
}

/** Joy shu vaqt oralig'ida ochiqmi? */
export function isOpenDuring(place, startMin, endMin) {
  const open = toMinutes(place.openTime) ?? 0;
  const close = toMinutes(place.closeTime) ?? 24 * 60;
  return startMin >= open && endMin <= Math.max(close, open + 1);
}

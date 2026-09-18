/** Pul bilan ishlash. Loyihada valyuta — so'm (UZS). */

export function roundSum(value, step = 5000) {
  return Math.max(0, Math.round(value / step) * step);
}

export function formatUZS(value) {
  return `${Math.round(value).toLocaleString('ru-RU').replace(/\u00a0/g, ' ')} so'm`;
}

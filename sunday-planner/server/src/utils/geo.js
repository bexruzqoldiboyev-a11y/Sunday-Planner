/** Masofa va yo'l vaqtini taxminlash. Real API ulanganda bu joyni almashtirish kifoya. */

const EARTH_RADIUS_KM = 6371;

export function distanceKm(a, b) {
  if (!a || !b) return 0;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Ikki joy orasidagi yo'l: 1.3 km gacha piyoda, undan uzog'i taksi/transport.
 * Narx — shartli taxmin (demo), real tarif API orqali ulanadi.
 */
export function travel(from, to) {
  if (!from || !to) {
    return { mode: 'start', distanceKm: 0, minutes: 0, cost: 0 };
  }
  const km = distanceKm(from, to);
  if (km < 1.6) {
    return {
      mode: 'walk',
      distanceKm: Number(km.toFixed(2)),
      minutes: Math.max(5, Math.round((km / 4.6) * 60 / 5) * 5),
      cost: 0,
    };
  }
  const minutes = Math.max(10, Math.round(((km / 21) * 60 + 6) / 5) * 5);
  const cost = Math.round((10000 + km * 2200) / 5000) * 5000;
  return { mode: 'ride', distanceKm: Number(km.toFixed(2)), minutes, cost };
}

/**
 * HAQIQIY YOʻL VAQTI.
 *
 * Avvalgi hisob "toʻgʻri chiziq masofasi ÷ oʻrtacha tezlik" edi — bu taxminiy.
 * Endi haqiqiy koʻchalar boʻyicha yoʻl hisoblanadi: OSRM (OpenStreetMap
 * marshrutlash xizmati) ikki nuqta orasidagi real masofa va davomiylikni
 * qaytaradi.
 *
 * Xizmat javob bermasa yoki internet boʻlmasa — eski taxminiy hisob ishlatiladi,
 * yaʼni reja baribir tuziladi (`source` maydonida qaysi usul ishlatilgani koʻrinadi).
 *
 * Boshqa provider (Google Directions, 2GIS) ulamoqchi boʻlsangiz, faqat
 * `fetchRoute` ni almashtirish kifoya.
 */

import { travel as estimateTravel } from '../utils/geo.js';
import { roundToStep } from '../utils/time.js';

const OSRM_BASE = process.env.OSRM_URL || 'https://router.project-osrm.org';
const TIMEOUT_MS = 4000;
const CACHE_TTL_MS = 60 * 60 * 1000;
const WALK_LIMIT_KM = 1.6;
const WALK_SPEED_KMH = 4.6;

const cache = new Map();

function key(from, to, mode) {
  return `${mode}:${from.lat.toFixed(4)},${from.lng.toFixed(4)}->${to.lat.toFixed(4)},${to.lng.toFixed(4)}`;
}

/** Taksi narxi — taxminiy (Toshkent uchun oʻrtacha tarif). */
function ridePrice(km) {
  return Math.round((10000 + km * 2200) / 5000) * 5000;
}

async function fetchRoute(from, to, profile) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url =
      `${OSRM_BASE}/route/v1/${profile}/` +
      `${from.lng},${from.lat};${to.lng},${to.lat}?overview=false&alternatives=false`;

    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`OSRM ${response.status}`);

    const data = await response.json();
    const route = data?.routes?.[0];
    if (!route) throw new Error('OSRM: marshrut topilmadi');

    return {
      km: route.distance / 1000,
      minutes: route.duration / 60,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Ikki nuqta orasidagi yoʻl.
 * @returns {Promise<{mode, distanceKm, minutes, cost, source}>}
 */
export async function realTravel(from, to) {
  if (!from || !to) return { mode: 'start', distanceKm: 0, minutes: 0, cost: 0, source: 'start' };

  const cached = cache.get(key(from, to, 'auto'));
  if (cached && cached.expires > Date.now()) return cached.value;

  try {
    // Avval piyoda masofani bilish uchun mashina marshrutini olamiz.
    const car = await fetchRoute(from, to, 'driving');

    let result;
    if (car.km <= WALK_LIMIT_KM) {
      const walkMinutes = Math.max(5, roundToStep((car.km / WALK_SPEED_KMH) * 60));
      result = {
        mode: 'walk',
        distanceKm: Number(car.km.toFixed(2)),
        minutes: walkMinutes,
        cost: 0,
        source: 'osrm',
      };
    } else {
      // Shahar tirbandligi uchun 25% zaxira.
      const minutes = Math.max(10, roundToStep(car.minutes * 1.25));
      result = {
        mode: 'ride',
        distanceKm: Number(car.km.toFixed(2)),
        minutes,
        cost: ridePrice(car.km),
        source: 'osrm',
      };
    }

    cache.set(key(from, to, 'auto'), { value: result, expires: Date.now() + CACHE_TTL_MS });
    return result;
  } catch (error) {
    // Xizmat ishlamadi — taxminiy hisobga qaytamiz.
    return { ...estimateTravel(from, to), source: 'estimate' };
  }
}

/**
 * Reja ichidagi barcha yoʻllarni real marshrut bilan almashtiradi.
 *
 * Agar birinchi soʻrov ishlamasa (internet yoʻq, xizmat oʻchiq), qolganlari
 * soʻralmaydi — butun reja darhol taxminiy hisobga oʻtadi. Shu tufayli
 * foydalanuvchi kutib qolmaydi.
 */
export async function resolveTrips(items) {
  const trips = [];
  let serviceDown = false;

  for (let index = 0; index < items.length; index += 1) {
    const previous = index === 0 ? null : items[index - 1].place;
    const place = items[index].place;
    const from = previous ? { lat: previous.lat, lng: previous.lng } : null;
    const to = { lat: place.lat, lng: place.lng };

    if (serviceDown) {
      trips.push({ ...estimateTravel(from, to), source: 'estimate' });
      continue;
    }

    // Ketma-ket soʻraymiz: ommaviy OSRM serverini bir vaqtda koʻp soʻrov bilan
    // yuklamaslik uchun.
    // eslint-disable-next-line no-await-in-loop
    const trip = await realTravel(from, to);
    if (trip.source === 'estimate') serviceDown = true;
    trips.push(trip);
  }

  return trips;
}

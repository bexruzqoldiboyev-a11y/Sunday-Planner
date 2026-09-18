/**
 * Joylar manbai.
 *
 * Hozircha `demo` provider ishlaydi: server/src/data/places.json ichidagi
 * SHARTLI (o'ylab topilgan) joylar. Ular real biznes emas va narxlari ham
 * shartli — UI'da har doim "demo" belgisi bilan ko'rsatiladi.
 *
 * Real maʼlumotga o'tish uchun: PLACES_PROVIDER=google va GOOGLE_MAPS_API_KEY
 * ni .env ga qo'ying hamda `fetchFromGoogle` ni to'ldiring — qolgan kod
 * o'zgarmaydi, chunki hamma joy shu servis orqali o'qiydi.
 */

import { PLACES_DATA } from '../data/places.data.js';
import { attachPhotoUrls } from './photoService.js';

/**
 * Maʼlumot modul sifatida import qilinadi — fayl tizimiga bogʻliq emas,
 * shuning uchun serverless muhitda ham ishlaydi.
 */
async function loadDemo() {
  return PLACES_DATA;
}

/**
 * Real provider uchun joy. Hozircha ataylab amalga oshirilmagan:
 * yolg'on "real" maʼlumot qaytarishdan ko'ra, demo rejimda qolgan maʼqul.
 */
async function fetchFromGoogle() {
  throw Object.assign(new Error('Google Places provider hali ulanmagan'), { code: 'PROVIDER_OFF' });
}

export async function getPlaces({ city = 'tashkent' } = {}) {
  const provider = process.env.PLACES_PROVIDER || 'demo';

  if (provider === 'google' && process.env.GOOGLE_MAPS_API_KEY) {
    try {
      const live = await fetchFromGoogle({ city });
      return { source: 'live', places: live };
    } catch (error) {
      // Real provider ishlamasa — demo bilan davom etamiz, lekin manbani ochiq aytamiz.
      console.warn('[places] live provider ishlamadi, demo rejimga qaytildi:', error.message);
    }
  }

  const data = await loadDemo();
  const filtered = data.places.filter((place) => !city || place.city === city);
  // Google kaliti boʻlsa — har bir joyga real foto manzili qoʻshiladi.
  return { source: data.source || 'google-places', places: attachPhotoUrls(filtered) };
}

export async function getPlaceById(id) {
  const { places } = await getPlaces({ city: null });
  return places.find((place) => place.id === id) || null;
}

export const SUPPORTED_CITIES = [{ id: 'tashkent', label: 'Toshkent', lat: 41.3111, lng: 69.2797 }];

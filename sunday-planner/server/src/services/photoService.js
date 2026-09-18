/**
 * REAL FOTOSURATLAR — Google Places Photos API.
 *
 * Qanday ishlaydi:
 *   1. Har bir joyning `placeId` si bor (bazada saqlangan).
 *   2. Place Details so'rovi orqali o'sha joyning foto "name" i olinadi.
 *   3. Foto media URL orqali yuklab olinadi va brauzerga uzatiladi.
 *
 * Nega proksi orqali: API kalitni brauzerga chiqarmaslik uchun. Rasm manzili
 * har doim `/api/places/:id/photo` bo'ladi, kalit faqat serverda qoladi.
 *
 * Kalit bo'lmasa — 404 qaytadi va interfeys o'zining jonli sahnasiga qaytadi
 * (singan rasm chiqmaydi).
 *
 * Kalitni olish: https://console.cloud.google.com → "Places API (New)" yoqiladi
 * → API key → .env ichiga GOOGLE_MAPS_API_KEY=... deb yoziladi.
 */

const DETAILS_URL = 'https://places.googleapis.com/v1/places';
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 soat

const photoNameCache = new Map(); // placeId -> { name, expires }
const imageCache = new Map(); // placeId -> { buffer, contentType, expires }

export function photosEnabled() {
  return Boolean(process.env.GOOGLE_MAPS_API_KEY);
}

function cached(map, key) {
  const entry = map.get(key);
  if (!entry) return null;
  if (entry.expires < Date.now()) {
    map.delete(key);
    return null;
  }
  return entry;
}

/** Joyning birinchi fotosurati "name" ini oladi (places/XXX/photos/YYY). */
async function resolvePhotoName(placeId) {
  const hit = cached(photoNameCache, placeId);
  if (hit) return hit.name;

  const response = await fetch(`${DETAILS_URL}/${placeId}?fields=photos`, {
    headers: {
      'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': 'photos',
    },
  });

  if (!response.ok) {
    throw new Error(`Places details ${response.status}`);
  }

  const data = await response.json();
  const name = data?.photos?.[0]?.name;
  if (!name) throw new Error('Bu joyda foto yoʻq');

  photoNameCache.set(placeId, { name, expires: Date.now() + CACHE_TTL_MS });
  return name;
}

/**
 * Joyning fotosini bayt sifatida qaytaradi.
 * @returns {Promise<{buffer: Buffer, contentType: string}>}
 */
export async function getPlacePhoto(placeId, { maxWidth = 900 } = {}) {
  if (!photosEnabled()) {
    throw Object.assign(new Error('GOOGLE_MAPS_API_KEY yoʻq'), { code: 'NO_KEY' });
  }

  const hit = cached(imageCache, placeId);
  if (hit) return { buffer: hit.buffer, contentType: hit.contentType };

  const photoName = await resolvePhotoName(placeId);
  const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`Places photo ${response.status}`);

  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const buffer = Buffer.from(await response.arrayBuffer());

  imageCache.set(placeId, { buffer, contentType, expires: Date.now() + CACHE_TTL_MS });
  return { buffer, contentType };
}

/**
 * Joylar ro'yxatiga rasm manzilini qo'shadi.
 * Kalit bo'lmasa `photoUrl` qo'shilmaydi — interfeys sahnani ko'rsatadi.
 */
export function attachPhotoUrls(places) {
  if (!photosEnabled()) return places;
  return places.map((place) =>
    place.placeId ? { ...place, photoUrl: `/api/places/${place.id}/photo` } : place,
  );
}

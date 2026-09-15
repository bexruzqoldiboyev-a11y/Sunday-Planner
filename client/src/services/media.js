/**
 * REAL MEDIA QATLAMI (rasm va video).
 *
 * Sayt sukut boʻyicha oʻz sahnalarini (PlaceArt) koʻrsatadi — ular hech qachon
 * yuklanmay qolmaydi. Real fotosurat/video qoʻshmoqchi boʻlsangiz, faqat shu
 * fayl oʻzgaradi, komponentlarga tegish shart emas.
 *
 * ── 1-usul: oʻz fayllaringiz ──────────────────────────────────────────────
 *   client/public/media/ papkasiga rasm tashlang va quyida yoʻlini koʻrsating:
 *
 *     const CATEGORY_PHOTOS = { kino: '/media/kino.jpg', kafe: '/media/kafe.jpg' };
 *     const PLACE_PHOTOS    = { 'kino-1': '/media/yulduz-hall.jpg' };
 *     const PLACE_VIDEOS    = { 'kino-1': '/media/yulduz-hall.mp4' };
 *
 *   Soʻng .env faylga:  VITE_MEDIA_ENABLED=true
 *
 * ── 2-usul: real joylar API'si ────────────────────────────────────────────
 *   Google Places ulanganda server har bir joy uchun `photoUrl` / `videoUrl`
 *   qaytaradi — quyidagi funksiyalar avtomatik oʻshani oladi.
 *
 * Rasm yuklanmasa komponent oʻzi sahnaga qaytadi (onError) — shuning uchun
 * notoʻgʻri havola ham sahifani buzmaydi.
 */

const CATEGORY_PHOTOS = {
  // kino: '/media/kino.jpg',
};

const PLACE_PHOTOS = {
  // 'kafe-1': '/media/qaymoq.jpg',
};

const PLACE_VIDEOS = {
  // 'entertainment-1': '/media/attraksion.mp4',
};

export const MEDIA_ENABLED = import.meta.env?.VITE_MEDIA_ENABLED === 'true';

/** Joy uchun rasm manzili yoki null. */
export function photoFor(place) {
  if (!place) return null;
  // Serverdan kelgan real rasm birinchi oʻrinda.
  if (place.photoUrl) return place.photoUrl;
  if (!MEDIA_ENABLED) return null;
  return PLACE_PHOTOS[place.id] || CATEGORY_PHOTOS[place.category] || null;
}

/** Joy uchun qisqa video manzili yoki null. */
export function videoFor(place) {
  if (!place) return null;
  if (place.videoUrl) return place.videoUrl;
  if (!MEDIA_ENABLED) return null;
  return PLACE_VIDEOS[place.id] || null;
}

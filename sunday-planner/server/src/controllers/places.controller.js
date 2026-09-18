import { getPlaces, getPlaceById, SUPPORTED_CITIES } from '../services/placesService.js';
import { getPlacePhoto, photosEnabled } from '../services/photoService.js';
import { ApiError } from '../utils/ApiError.js';

/** GET /api/places?city=tashkent&category=kino */
export async function listPlaces(req, res) {
  const { city = 'tashkent', category, q } = req.query;
  const { places, source } = await getPlaces({ city });

  const filtered = places.filter((place) => {
    if (category && place.category !== category) return false;
    if (q && !place.name.toLowerCase().includes(String(q).toLowerCase())) return false;
    return true;
  });

  res.json({ ok: true, source, count: filtered.length, places: filtered });
}

/** GET /api/places/:id */
export async function getPlace(req, res) {
  const place = await getPlaceById(req.params.id);
  if (!place) throw ApiError.notFound('Bunday joy topilmadi.');
  res.json({ ok: true, place });
}

/** GET /api/places/meta/cities */
export async function listCities(_req, res) {
  res.json({ ok: true, cities: SUPPORTED_CITIES });
}

/**
 * GET /api/places/:id/photo — joyning real fotosurati (Google Places).
 * Kalit yoki foto boʻlmasa 404 qaytadi; interfeys oʻz sahnasini koʻrsatadi.
 */
export async function getPhoto(req, res) {
  if (!photosEnabled()) {
    throw ApiError.notFound('Foto xizmati yoqilmagan (GOOGLE_MAPS_API_KEY yoʻq).');
  }

  const place = await getPlaceById(req.params.id);
  if (!place?.placeId) throw ApiError.notFound('Bunday joy topilmadi.');

  try {
    const { buffer, contentType } = await getPlacePhoto(place.placeId);
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=21600');
    res.send(buffer);
  } catch (error) {
    throw ApiError.notFound(`Foto olinmadi: ${error.message}`);
  }
}

/** Google Maps havolalari — joyni yoki butun marshrutni real xaritada ochish uchun. */

/** Bitta joy: Google Places ID bo'yicha aniq nuqta. */
export function placeMapUrl(place) {
  if (!place) return null;
  if (place.mapsUrl) return place.mapsUrl;
  const query = encodeURIComponent(`${place.name} ${place.lat},${place.lng}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/** Butun kun marshruti: A → B → C ... Google Maps yo'nalishlari. */
export function routeMapUrl(items, travelmode = 'driving') {
  if (!items?.length) return null;
  const point = (item) => `${item.place.lat},${item.place.lng}`;
  const origin = point(items[0]);
  const destination = point(items[items.length - 1]);
  const waypoints = items
    .slice(1, -1)
    .map(point)
    .join('|');

  const params = new URLSearchParams({ api: '1', origin, destination, travelmode });
  if (waypoints) params.set('waypoints', waypoints);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

/** Yandex — Toshkentda ko'p ishlatiladi, taksi chaqirishga qulay. */
export function yandexPlaceUrl(place) {
  if (!place) return null;
  return `https://yandex.uz/maps/?pt=${place.lng},${place.lat}&z=17&l=map`;
}

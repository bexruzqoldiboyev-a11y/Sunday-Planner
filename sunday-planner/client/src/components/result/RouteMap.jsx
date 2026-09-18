import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { SchematicMap } from './SchematicMap.jsx';
import { routeMapUrl, placeMapUrl } from '../../utils/maps.js';
import { formatCost } from '../../utils/format.js';
import { useI18n } from '../../i18n/index.jsx';

const LETTERS = 'ABCDEFGH';
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const PROBE_TILE = 'https://tile.openstreetmap.org/11/1310/792.png'; // Toshkent atrofidagi plitka

/**
 * Haqiqiy xarita.
 *
 * OpenStreetMap plitkalari yuklanadimi — avval tekshiramiz. Yuklansa Leaflet
 * bilan real xarita chiziladi (koʻchalar, binolar, masshtab). Yuklanmasa
 * (internet yoʻq yoki sahifa tashqi soʻrovlarni bloklagan) sxematik xaritaga
 * tushamiz — shunda ham nuqtalar real koordinatada qoladi.
 */
export function RouteMap({ items, activeIndex, onSelect }) {
  const { t } = useI18n();
  const [tiles, setTiles] = useState('checking'); // checking | ok | off
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  /* 1. Plitkalar ochiladimi? */
  useEffect(() => {
    let settled = false;
    const image = new Image();
    const finish = (state) => {
      if (settled) return;
      settled = true;
      setTiles(state);
    };
    image.onload = () => finish('ok');
    image.onerror = () => finish('off');
    image.src = PROBE_TILE;
    const timer = setTimeout(() => finish('off'), 4500);
    return () => {
      settled = true;
      clearTimeout(timer);
    };
  }, []);

  /* 2. Xaritani qurish */
  useEffect(() => {
    if (tiles !== 'ok' || !containerRef.current || !items.length) return undefined;
    let cancelled = false;
    let map;

    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, { scrollWheelZoom: false, attributionControl: true });
      mapRef.current = map;

      L.tileLayer(TILE_URL, {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      const latLngs = items.map((item) => [item.place.lat, item.place.lng]);

      L.polyline(latLngs, {
        color: '#FF5C7A',
        weight: 4,
        opacity: 0.9,
        dashArray: '10 10',
        lineCap: 'round',
      }).addTo(map);

      markersRef.current = items.map((item, index) => {
        const icon = L.divIcon({
          className: 'route-pin',
          html: `<span class="route-pin__dot">${LETTERS[index] || index + 1}</span>
                 <span class="route-pin__time">${item.time}</span>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([item.place.lat, item.place.lng], { icon, title: item.place.name })
          .addTo(map)
          .bindPopup(
            `<b>${item.place.name}</b><br>${item.time}–${item.endTime} · ${formatCost(item.cost)}<br>
             <a href="${placeMapUrl(item.place)}" target="_blank" rel="noreferrer">Google Maps'da ochish</a>`,
          );

        marker.on('click', () => onSelect?.(index));
        return marker;
      });

      map.fitBounds(latLngs, { padding: [42, 42] });
    })();

    return () => {
      cancelled = true;
      markersRef.current = [];
      if (map) map.remove();
      mapRef.current = null;
    };
  }, [tiles, items, onSelect]);

  /* 3. Tanlangan nuqtaga uchish */
  useEffect(() => {
    if (tiles !== 'ok' || activeIndex == null) return;
    const map = mapRef.current;
    const marker = markersRef.current[activeIndex];
    if (!map || !marker) return;
    map.flyTo(marker.getLatLng(), 16, { duration: 0.8 });
    marker.openPopup();
  }, [activeIndex, tiles]);

  const route = routeMapUrl(items);

  return (
    <div className="stack" id="xarita" style={{ gap: '0.75rem' }}>
      {tiles === 'ok' ? (
        <div className="map">
          <div ref={containerRef} className="map__canvas" />
        </div>
      ) : tiles === 'checking' ? (
        <div className="map map--loading">
          <span className="spinner" aria-hidden="true" />
          <span className="muted">…</span>
        </div>
      ) : (
        <SchematicMap items={items} activeIndex={activeIndex} onSelect={onSelect} />
      )}

      <div className="row" style={{ gap: '0.6rem', flexWrap: 'wrap' }}>
        <a className="btn btn--ghost" href={route} target="_blank" rel="noreferrer">
          🗺 {t('result.openRoute')}
        </a>
        <span className="muted" style={{ fontSize: '0.78rem' }}>
          {tiles === 'off'
            ? 'OpenStreetMap ⛔ · ' + t('result.places') + ': Google Places'
            : 'OpenStreetMap · ' + t('result.places') + ': Google Places'}
        </span>
      </div>
    </div>
  );
}

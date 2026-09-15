import { useMemo } from 'react';
import { motion } from 'framer-motion';

const LETTERS = 'ABCDEFGH';
const W = 640;
const H = 400;
const PAD = 58;

/**
 * Zaxira xarita (sxema).
 *
 * Internet yoki xarita plitkalari (tiles) ochilmasa, real xarita oʻrniga shu
 * koʻrsatiladi: joylarning HAQIQIY koordinatalari proyeksiya qilinadi, yaʼni
 * nuqtalarning bir-biriga nisbatan joylashuvi va masofasi toʻgʻri boʻladi.
 */
export function SchematicMap({ items, activeIndex, onSelect }) {
  const points = useMemo(() => {
    if (!items.length) return [];
    const lats = items.map((item) => item.place.lat);
    const lngs = items.map((item) => item.place.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const spanLat = Math.max(maxLat - minLat, 0.004);
    const spanLng = Math.max(maxLng - minLng, 0.004);

    return items.map((item, index) => ({
      index,
      item,
      x: PAD + ((item.place.lng - minLng) / spanLng) * (W - PAD * 2),
      y: H - PAD - ((item.place.lat - minLat) / spanLat) * (H - PAD * 2),
    }));
  }, [items]);

  const path = points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');

  return (
    <section className="map">
      <svg className="map__svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Kun marshruti">
        <defs>
          <linearGradient id="route-line" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFB020" />
            <stop offset="0.5" stopColor="#FF5C7A" />
            <stop offset="1" stopColor="#7A5CFF" />
          </linearGradient>
          <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(148,140,190,0.22)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width={W} height={H} fill="url(#map-grid)" />
        <g stroke="rgba(148,140,190,0.3)" strokeWidth="9" strokeLinecap="round">
          <path d="M-10 118H650" />
          <path d="M-10 286H650" />
          <path d="M196 -10V410" />
          <path d="M452 -10V410" />
        </g>
        <g fill="rgba(34,211,190,0.14)">
          <rect x="230" y="150" width="120" height="96" rx="18" />
          <rect x="482" y="60" width="110" height="80" rx="18" />
        </g>

        {points.length > 1 ? (
          <motion.polyline
            points={path}
            fill="none"
            stroke="url(#route-line)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="10 12"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          />
        ) : null}

        {points.map((point) => {
          const active = activeIndex === point.index;
          return (
            <g
              key={point.item.id}
              transform={`translate(${point.x} ${point.y})`}
              onClick={() => onSelect?.(point.index)}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
            >
              {active ? (
                <motion.circle
                  r="30"
                  fill="rgba(255,176,32,0.28)"
                  animate={{ r: [24, 32, 24] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              ) : null}
              <circle r="19" fill={active ? '#FFB020' : 'var(--surface-solid)'} stroke="#FFB020" strokeWidth="2.5" />
              <text
                textAnchor="middle"
                dy="6"
                fontSize="16"
                fontWeight="700"
                fill={active ? '#1D1736' : 'var(--ink)'}
                fontFamily="Manrope, sans-serif"
              >
                {LETTERS[point.index] || point.index + 1}
              </text>
              <text
                textAnchor="middle"
                y="40"
                fontSize="13"
                fontWeight="600"
                fill="var(--ink-soft)"
                fontFamily="Manrope, sans-serif"
              >
                {point.item.time}
              </text>
            </g>
          );
        })}
      </svg>
      <span className="map__note">
        Sxematik koʻrinish · koordinatalar real · xarita plitkalari yuklanmadi
      </span>
    </section>
  );
}

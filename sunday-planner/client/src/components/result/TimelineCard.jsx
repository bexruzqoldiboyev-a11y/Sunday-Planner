import { motion } from 'framer-motion';
import { Tag } from '../ui/Chip.jsx';
import { formatCost, formatDuration, TRANSPORT_LABEL } from '../../utils/format.js';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { PlaceMedia } from '../ui/PlaceMedia.jsx';
import { placeMapUrl } from '../../utils/maps.js';
import { Tilt } from '../ui/Tilt.jsx';
import { useI18n } from '../../i18n/index.jsx';

/** Ikki nuqta orasidagi yoʻl. */
export function TransportRow({ transport }) {
  const { t } = useI18n();
  if (!transport || transport.mode === 'start') return null;
  return (
    <div className="tl-move">
      <div className="tl-move__dots" aria-hidden="true">
        <i />
      </div>
      <span className="tl-move__label">
        <span aria-hidden="true">{transport.mode === 'walk' ? '🚶' : '🚕'}</span>
        {transport.distanceKm} km · {transport.minutes} daq {TRANSPORT_LABEL[transport.mode]}
        {transport.cost > 0 ? ` · ~${formatCost(transport.cost)}` : ' · bepul'}
        {transport.source === 'osrm' ? ` · ${t('result.realRoute')}` : ''}
      </span>
    </div>
  );
}

export function TimelineCard({ item, index, onSwap, onDetails, onMap, isLast }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useI18n();
  const place = item.place;
  const favorite = isFavorite(place.id);

  return (
    <motion.article
      className="tl-item"
      initial={{ opacity: 0, y: 56, rotateX: 14, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.75, delay: Math.min(index * 0.08, 0.4), ease: [0.16, 1, 0.3, 1] }}
      layout
    >
      <div className="tl-item__rail">
        <motion.span
          className="tl-item__time"
          initial={{ scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.1 }}
        >
          {item.time}
        </motion.span>
        {!isLast ? <span className="tl-item__line" aria-hidden="true" /> : null}
      </div>

      <div className="tl-item__body">
        <Tilt strength={6} lift={4}>
        <div className="tl-card">
          <span className="shine" aria-hidden="true" />
          <button
            type="button"
            className="tl-card__fav"
            aria-pressed={favorite}
            aria-label={favorite ? 'Sevimlilardan olib tashlash' : 'Sevimlilarga qoʻshish'}
            onClick={() => toggleFavorite(place)}
          >
            {favorite ? '❤️' : '🤍'}
          </button>

          <div className="tl-card__top">
            <PlaceMedia place={place} size="sm" />
            <div style={{ minWidth: 0 }}>
              <h3 className="tl-card__title">{place.name}</h3>
              <div className="tl-card__sub">
                {place.categoryLabel} · {item.time}–{item.endTime} ·{' '}
                {formatDuration(item.durationMin)}
              </div>
            </div>
            <div className="tl-card__price">
              {formatCost(item.cost)}
              <span>{t('result.approx')}</span>
            </div>
          </div>

          <div className="tl-card__meta">
            <Tag>⭐ {place.rating}</Tag>
            <Tag>📍 {place.address}</Tag>
            <Tag>🕘 {place.openTime}–{place.closeTime}</Tag>
            {item.cost === 0 ? <Tag tone="free">{t('common.free')}</Tag> : null}
            {item.cost > 0 ? <Tag tone="demo">{t('result.priceApprox')}</Tag> : null}
          </div>

          <div className="tl-card__actions">
            <button type="button" className="btn btn--ghost" onClick={() => onSwap(index)}>
              🔁 {t('result.alternatives')}
            </button>
            <button type="button" className="btn btn--quiet" onClick={() => onDetails(item)}>
              {t('result.details')}
            </button>
            <button type="button" className="btn btn--quiet" onClick={() => onMap(index)}>
              {t('result.map')}
            </button>
            <a
              className="btn btn--quiet"
              href={placeMapUrl(place)}
              target="_blank"
              rel="noreferrer"
            >
              Google Maps ↗
            </a>
          </div>
        </div>
        </Tilt>
      </div>
    </motion.article>
  );
}

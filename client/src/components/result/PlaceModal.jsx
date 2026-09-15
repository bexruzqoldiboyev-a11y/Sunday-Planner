import { Modal } from '../ui/Modal.jsx';
import { Tag } from '../ui/Chip.jsx';
import { Button } from '../ui/Button.jsx';
import { formatCost, formatDuration, formatMoney } from '../../utils/format.js';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { PlaceMedia } from '../ui/PlaceMedia.jsx';
import { placeMapUrl, yandexPlaceUrl } from '../../utils/maps.js';

/** Joy haqida batafsil. Demo maʼlumot ekani ochiq aytiladi. */
export function PlaceModal({ open, item, onClose }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  if (!item) return <Modal open={false} onClose={onClose} title="" />;

  const place = item.place;

  return (
    <Modal open={open} onClose={onClose} title={place.name} subtitle={place.categoryLabel}>
      <div className="stack">
        <PlaceMedia place={place} size="tall" withVideo />

        <p className="soft">{place.about}</p>

        <div className="chip-grid">
          <Tag>⭐ {place.rating} ({place.reviews})</Tag>
          <Tag>📍 {place.district}</Tag>
          <Tag>🏠 {place.address}</Tag>
          <Tag>🕘 {place.openTime}–{place.closeTime}</Tag>
          <Tag>⏳ {formatDuration(item.durationMin)}</Tag>
          {place.indoor ? <Tag>🏠 Yopiq joy</Tag> : <Tag>🌤 Ochiq havoda</Tag>}
          {place.phone ? <Tag>📞 {place.phone}</Tag> : null}
          <Tag>🧭 {place.lat.toFixed(5)}, {place.lng.toFixed(5)}</Tag>
        </div>

        <div className="budget__split">
          <div className="budget__cell">
            <b>{formatCost(item.cost)}</b>
            <span>Rejadagi taxminiy xarajat</span>
          </div>
          <div className="budget__cell">
            <b>
              {place.priceMax > 0
                ? `${formatMoney(place.priceMin)} – ${formatMoney(place.priceMax)}`
                : 'Bepul'}
            </b>
            <span>Odatdagi narx oraligʻi</span>
          </div>
        </div>

        <p className="muted" style={{ fontSize: '0.82rem' }}>
          Nomi, manzili, koordinatasi, telefoni, reytingi va ish vaqti — Google Places maʼlumotlari. Narx esa taxminiy
          oraliq: aniq narxni joyning oʻzidan yoki sahifasidan tekshiring.
        </p>

        <div className="row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
          <a className="btn btn--ghost" href={placeMapUrl(place)} target="_blank" rel="noreferrer">
            🗺 Google Maps ↗
          </a>
          <a
            className="btn btn--ghost"
            href={place.directionsUrl || placeMapUrl(place)}
            target="_blank"
            rel="noreferrer"
          >
            🧭 Yoʻnalish ↗
          </a>
          <a className="btn btn--quiet" href={yandexPlaceUrl(place)} target="_blank" rel="noreferrer">
            Yandex ↗
          </a>
          {place.phone ? (
            <a className="btn btn--quiet" href={`tel:${place.phone.replace(/\s/g, '')}`}>
              📞 Qoʻngʻiroq
            </a>
          ) : null}
        </div>

        <Button variant="ghost" onClick={() => toggleFavorite(place)}>
          {isFavorite(place.id) ? '❤️ Sevimlilarda' : '🤍 Sevimlilarga qoʻshish'}
        </Button>
      </div>
    </Modal>
  );
}

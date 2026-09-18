import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PlaceMedia } from '../ui/PlaceMedia.jsx';
import { Tag } from '../ui/Chip.jsx';
import { Tilt } from '../ui/Tilt.jsx';
import { useI18n } from '../../i18n/index.jsx';
import { placeMapUrl } from '../../utils/maps.js';
import { photoCredit } from '../../services/media.js';
import REAL_PLACES from '../../data/demoPlaces.js';
import { COMMONS_PHOTOS } from '../../data/photos.js';

/**
 * Joylar karuseli.
 *
 * Avval fotosurati bor joylar, keyin qolganlari. Sichqoncha bilan surish,
 * barmoq bilan swipe, strelkalar va klaviatura — hammasi ishlaydi.
 */
const ORDER = [
  'photo-24', // Minor masjidi
  'park-17', // Tashkent City Park
  'entertainment-35', // Magic City
  'sayr-23', // Chorsu
  'muzey-29', // Amir Temur muzeyi
  'entertainment-36', // Anhor Lokomotiv
  'photo-25', // Yaponiya bogʻi
  'sayr-22', // Sayilgoh
  'restoran-14', // Broadway Lounge
  'kino-1', // Next Cinema
  'tabiat-46', // Botanika bogʻi
  'swimming-38', // Akvapark
];

function pickPlaces() {
  const byId = new Map(REAL_PLACES.map((place) => [place.id, place]));
  const chosen = ORDER.map((id) => byId.get(id)).filter(Boolean);
  if (chosen.length >= 8) return chosen;
  // Roʻyxat oʻzgarsa ham karusel boʻsh qolmasin.
  const extra = REAL_PLACES.filter((place) => !ORDER.includes(place.id)).slice(0, 8);
  return [...chosen, ...extra];
}

export function PlacesGallery() {
  const { t } = useI18n();
  const trackRef = useRef(null);
  const [places] = useState(pickPlaces);
  // Qaysi joyda haqiqiy foto koʻrsatilgani — kredit matni shunga qarab chiqadi
  const [photos, setPhotos] = useState({});
  const markPhoto = useCallback(
    (id) => (info) => setPhotos((current) => ({ ...current, [id]: info })),
    [],
  );
  const [edge, setEdge] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdge({
      start: track.scrollLeft <= 4,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    const track = trackRef.current;
    if (!track) return undefined;
    track.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      track.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const scrollBy = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector('.gallery__card');
    const step = card ? card.offsetWidth + 18 : track.clientWidth * 0.8;
    track.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  return (
    <section className="section">
      <div className="shell shell--wide">
        <div className="gallery__head">
          <div>
            <h2>{t('gallery.title')}</h2>
            <p className="soft" style={{ marginTop: '0.5rem' }}>
              {t('gallery.lead')}
            </p>
          </div>

          <div className="gallery__nav">
            <button
              type="button"
              className="icon-btn"
              onClick={() => scrollBy(-1)}
              disabled={edge.start}
              aria-label={t('gallery.prev')}
            >
              ←
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={() => scrollBy(1)}
              disabled={edge.end}
              aria-label={t('gallery.next')}
            >
              →
            </button>
          </div>
        </div>

        <div className="gallery" ref={trackRef} tabIndex={0} aria-label={t('gallery.title')}>
          {places.map((place, index) => {
            const found = photos[place.id];
            const credit = found
              ? { text: `Foto: Wikipedia — ${found.title}`, url: found.page }
              : photoCredit(place);
            const hasPhoto = Boolean(found || COMMONS_PHOTOS[place.id] || place.photoUrl);

            return (
              <motion.article
                key={place.id}
                className="gallery__card"
                initial={{ opacity: 0, y: 40, rotateY: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.35) }}
              >
                <Tilt strength={8} lift={6}>
                  <div className="gallery__inner">
                    <PlaceMedia place={place} size="tall" onPhoto={markPhoto(place.id)} />

                    <div className="gallery__body">
                      <h3 className="gallery__title">{place.name}</h3>
                      <p className="gallery__sub">{place.about}</p>

                      <div className="chip-grid" style={{ gap: '0.35rem' }}>
                        <Tag>⭐ {place.rating}</Tag>
                        <Tag>📍 {place.district}</Tag>
                        {hasPhoto ? <Tag tone="free">{t('gallery.photo')}</Tag> : null}
                      </div>

                      <div className="gallery__foot">
                        <a
                          className="btn btn--ghost"
                          href={placeMapUrl(place)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Google Maps ↗
                        </a>
                        {credit ? (
                          <span className="gallery__credit">{credit.text}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

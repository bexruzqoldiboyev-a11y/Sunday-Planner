import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlaceArt } from '../ui/PlaceArt.jsx';
import { Tilt } from '../ui/Tilt.jsx';

/**
 * Kun "treyleri" — sahnalar almashib turadi.
 *
 * Agar .env da VITE_HERO_VIDEO koʻrsatilgan boʻlsa, shu yerda real video
 * oʻynaydi; boʻlmasa (yoki video yuklanmasa) jonli sahnalar aylanadi.
 */
const SCENES = [
  { category: 'kafe', seed: 'breakfast-1', emoji: '🍳', label: '09:00 · Nonushta' },
  { category: 'park', seed: 'park-2', emoji: '🌳', label: '11:00 · Parkda sayr' },
  { category: 'restoran', seed: 'restoran-1', emoji: '🍽', label: '13:00 · Tushlik' },
  { category: 'kino', seed: 'kino-3', emoji: '🎬', label: '16:00 · Kino' },
  { category: 'entertainment', seed: 'entertainment-2', emoji: '🎢', label: '19:00 · Attraksion' },
  { category: 'sayr', seed: 'sayr-4', emoji: '🚶', label: '21:00 · Kechki sayr' },
];

const VIDEO = import.meta.env?.VITE_HERO_VIDEO || '';

export function Showreel() {
  const [index, setIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const useVideo = Boolean(VIDEO) && !videoFailed;

  useEffect(() => {
    if (useVideo) return undefined;
    const timer = setInterval(() => setIndex((current) => (current + 1) % SCENES.length), 3400);
    return () => clearInterval(timer);
  }, [useVideo]);

  const scene = SCENES[index];

  return (
    <section className="section">
      <div className="shell shell--wide">
        <div className="stack" style={{ gap: '0.9rem', marginBottom: 'var(--space-4)' }}>
          <h2>Bir kun shunday koʻrinadi</h2>
          <p className="soft">Nonushtadan kechki sayrgacha — har bir soat oʻz joyi bilan.</p>
        </div>

        <Tilt strength={6} lift={10}>
        <motion.div
          className="showreel"
          initial={{ opacity: 0, y: 70, rotateX: 14, scale: 0.94 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {useVideo ? (
            <div className="showreel__layer">
              <video
                src={VIDEO}
                autoPlay
                muted
                loop
                playsInline
                onError={() => setVideoFailed(true)}
              />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              <motion.div
                key={scene.seed}
                className="showreel__layer"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <PlaceArt category={scene.category} seed={scene.seed} />
              </motion.div>
            </AnimatePresence>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={scene.label}
              className="showreel__caption"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <span aria-hidden="true">{scene.emoji}</span>
              <span>{scene.label}</span>
            </motion.div>
          </AnimatePresence>

          {!useVideo ? (
            <div className="showreel__dots" role="tablist" aria-label="Sahnalar">
              {SCENES.map((item, itemIndex) => (
                <button
                  key={item.seed}
                  type="button"
                  data-active={index === itemIndex}
                  aria-label={item.label}
                  aria-selected={index === itemIndex}
                  role="tab"
                  onClick={() => setIndex(itemIndex)}
                />
              ))}
            </div>
          ) : null}
        </motion.div>
        </Tilt>
      </div>
    </section>
  );
}

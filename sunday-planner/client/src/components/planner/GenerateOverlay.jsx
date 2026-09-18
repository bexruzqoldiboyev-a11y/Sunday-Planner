import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../../i18n/index.jsx';

const STAGES = ['loader.s1', 'loader.s2', 'loader.s3', 'loader.s4'];

/**
 * Reja tuzilayotganda chiqadigan oyna.
 * Bosqichlar navbat bilan yonadi; oxirgisi faqat natija kelganda yoqiladi.
 */
export function GenerateOverlay({ open, done }) {
  const { t } = useI18n();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!open) {
      setStage(0);
      return undefined;
    }
    const timers = [
      setTimeout(() => setStage(1), 700),
      setTimeout(() => setStage(2), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [open]);

  useEffect(() => {
    if (done) setStage(3);
  }, [done]);

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="status"
          aria-live="polite"
        >
          <motion.div
            className="loader__card"
            initial={{ scale: 0.94, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <motion.div
              className="loader__sun"
              animate={{ scale: [1, 1.12, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <h3>{t('loader.title')}</h3>
            <p className="muted" style={{ fontSize: '0.88rem', margin: '0.35rem auto 0' }}>
              {t('loader.lead')}
            </p>

            <div className="loader__steps">
              {STAGES.map((key, index) => (
                <div
                  key={key}
                  className="loader__step"
                  data-state={index < stage ? 'done' : index === stage ? 'active' : 'todo'}
                >
                  <span className="loader__check" aria-hidden="true">
                    {index < stage ? '✓' : index === stage ? '•' : ''}
                  </span>
                  {t(key)}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

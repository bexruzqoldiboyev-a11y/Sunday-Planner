import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

const STAGES = [
  'Budjetingiz hisoblanmoqda…',
  'Joylar tanlanmoqda…',
  'Eng yaxshi marshrut tuzilmoqda…',
  'Yakshanba kuningiz tayyor!',
];

/**
 * Reja tuzilayotganda chiqadigan oyna.
 * Bosqichlar navbat bilan yonadi; oxirgisi faqat natija kelganda yoqiladi.
 */
export function GenerateOverlay({ open, done }) {
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
            <h3>Kuningiz yigʻilmoqda</h3>
            <p className="muted" style={{ fontSize: '0.88rem', margin: '0.35rem auto 0' }}>
              Bu bir necha soniya oladi.
            </p>

            <div className="loader__steps">
              {STAGES.map((text, index) => (
                <div
                  key={text}
                  className="loader__step"
                  data-state={index < stage ? 'done' : index === stage ? 'active' : 'todo'}
                >
                  <span className="loader__check" aria-hidden="true">
                    {index < stage ? '✓' : index === stage ? '•' : ''}
                  </span>
                  {text}
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

import { useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useMotionMode } from '../../context/MotionContext.jsx';

/**
 * KUN YOYI.
 *
 * Sahifa boʻylab skroll qilinganda:
 *   - fon tongdan tushga, tushdan shomga, shomdan tunga oʻtadi;
 *   - quyosh chapdan oʻngga yoy chizib koʻtariladi va botadi;
 *   - botgach oy chiqadi.
 *
 * Harakat «calm» rejimida sekinlashadi, lekin kun bosqichi baribir
 * skrollga bogʻliq — chunki bu bezak emas, saytning asosiy gʻoyasi.
 */
export function Sky() {
  const { animated } = useMotionMode();
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 24, mass: 0.4 });

  // Kun bosqichlari
  const dawn = useTransform(p, [0, 0.22, 0.4], [1, 0.75, 0]);
  const noon = useTransform(p, [0.12, 0.38, 0.62], [0, 1, 0]);
  const dusk = useTransform(p, [0.5, 0.74, 0.92], [0, 1, 0.25]);
  const night = useTransform(p, [0.72, 1], [0, 1]);

  // Quyosh yoyi: chapdan oʻngga, tepaga koʻtarilib keyin pastga
  const sunX = useTransform(p, [0, 1], ['4vw', '84vw']);
  const sunY = useTransform(p, [0, 0.42, 1], ['46vh', '7vh', '82vh']);
  const sunOpacity = useTransform(p, [0, 0.7, 0.9], [1, 1, 0]);
  const sunScale = useTransform(p, [0, 0.42, 1], [1.12, 1, 0.82]);

  // Oy: kech tushganda chiqadi
  const moonX = useTransform(p, [0.72, 1], ['16vw', '62vw']);
  const moonY = useTransform(p, [0.72, 1], ['40vh', '12vh']);
  const moonOpacity = useTransform(p, [0.72, 0.9], [0, 1]);

  const patternY = useTransform(p, [0, 1], [0, -90]);

  // Kun bosqichini butun ilovaga bildiramiz (kerak boʻlsa uslublarda ishlatiladi)
  useEffect(() => {
    const unsubscribe = p.on('change', (value) => {
      const phase = value < 0.35 ? 'dawn' : value < 0.62 ? 'noon' : value < 0.85 ? 'dusk' : 'night';
      if (document.documentElement.dataset.phase !== phase) {
        document.documentElement.dataset.phase = phase;
      }
    });
    return () => unsubscribe();
  }, [p]);

  return (
    <div className="sky" aria-hidden="true">
      <motion.div className="sky__layer sky__layer--dawn" style={{ opacity: dawn }} />
      <motion.div className="sky__layer sky__layer--noon" style={{ opacity: noon }} />
      <motion.div className="sky__layer sky__layer--dusk" style={{ opacity: dusk }} />
      <motion.div className="sky__layer sky__layer--night" style={{ opacity: night }} />

      <motion.span
        className="sky__sun"
        style={{ x: sunX, y: sunY, opacity: sunOpacity, scale: sunScale }}
      />
      <motion.span
        className="sky__moon"
        style={{ x: moonX, y: moonY, opacity: moonOpacity }}
      />

      <motion.div
        className="sky__pattern"
        style={animated ? { y: patternY } : undefined}
      />
      <div className="sky__horizon" />
      <div className="sky__noise" />
      <div className="sky__strip" />
    </div>
  );
}

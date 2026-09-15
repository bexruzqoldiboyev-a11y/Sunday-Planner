import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMotionMode } from '../../context/MotionContext.jsx';

/**
 * Fon sahnasi: rangli yorug'lik dog'lari, perspektivadagi to'r, nur va don.
 * Sichqoncha harakatiga qarab qatlamlar turli tezlikda suriladi (parallaks) —
 * shundan chuqurlik hissi paydo bo'ladi.
 */
export function Aurora() {
  const { animated } = useMotionMode();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });

  const near = useTransform(sx, [0, 1], [-60, 60]);
  const nearY = useTransform(sy, [0, 1], [-40, 40]);
  const far = useTransform(sx, [0, 1], [26, -26]);
  const farY = useTransform(sy, [0, 1], [18, -18]);

  useEffect(() => {
    if (!animated) return undefined;
    const onMove = (event) => {
      mx.set(event.clientX / window.innerWidth);
      my.set(event.clientY / window.innerHeight);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [animated, mx, my]);

  return (
    <div className="aurora" aria-hidden="true">
      <motion.span className="aurora__blob aurora__blob--1" style={{ x: near, y: nearY }} />
      <motion.span className="aurora__blob aurora__blob--2" style={{ x: far, y: farY }} />
      <motion.span className="aurora__blob aurora__blob--3" style={{ x: nearY, y: near }} />
      <motion.span className="aurora__blob aurora__blob--4" style={{ x: far, y: nearY }} />
      <span className="aurora__beam" />
      <motion.span className="aurora__grid" style={{ x: far }} />
      <span className="aurora__noise" />
    </div>
  );
}

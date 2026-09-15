import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useMotionMode } from '../../context/MotionContext.jsx';

const SPRING = { stiffness: 220, damping: 20, mass: 0.6 };

/**
 * 3D qiyalik + kursor ortidan yuradigan yorug'lik.
 *
 * Sichqoncha karta ustida yurganda karta chuqurlikda buriladi va yuzasida
 * yorug'lik dog'i paydo bo'ladi (--mx / --my CSS o'zgaruvchilari orqali).
 * Sensorli ekranda va "calm" rejimda burilish o'chadi.
 */
export function Tilt({
  children,
  strength = 9,
  lift = 6,
  scale = 1.015,
  className = '',
  style,
  ...rest
}) {
  const { animated } = useMotionMode();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [strength, -strength]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-strength, strength]), SPRING);

  const handleMove = (event) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;
    px.set(nx);
    py.set(ny);
    event.currentTarget.style.setProperty('--mx', `${nx * 100}%`);
    event.currentTarget.style.setProperty('--my', `${ny * 100}%`);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (!animated) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`tilt ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 1100, ...style }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      whileHover={{ y: -lift, scale }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

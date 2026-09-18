import { useEffect, useRef, useState } from 'react';

/** Raqamni 0 dan target gacha yumshoq sanaydi (budjet raqamlari uchun). */
export function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const frame = useRef(0);
  const from = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(target);
      return undefined;
    }

    const start = performance.now();
    const startValue = from.current;
    const delta = target - startValue;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(startValue + delta * eased);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
      else from.current = target;
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return value;
}

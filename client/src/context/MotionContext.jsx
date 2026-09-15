import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

/**
 * Harakat rejimi.
 *
 * 'full' — hamma animatsiya ishlaydi (sukut bo'yicha).
 * 'calm' — uzluksiz harakatlar to'xtaydi, faqat qisqa o'tishlar qoladi.
 *
 * Tizimda "reduce motion" yoqilgan bo'lsa, birinchi kirishda o'zi 'calm' bo'ladi,
 * lekin foydalanuvchi navbardagi ✨ tugmasi bilan xohlagan paytda yoqa oladi.
 */
const MotionContext = createContext(null);

function initialMode() {
  try {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'calm';
  } catch {
    /* ignore */
  }
  return 'full';
}

export function MotionProvider({ children }) {
  const [mode, setMode] = useLocalStorage('sp.motion', initialMode());

  useEffect(() => {
    document.documentElement.dataset.motion = mode;
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((current) => (current === 'full' ? 'calm' : 'full'));
  }, [setMode]);

  const value = useMemo(
    () => ({ mode, animated: mode === 'full', toggle, setMode }),
    [mode, toggle, setMode],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotionMode() {
  return useContext(MotionContext) || { mode: 'full', animated: true, toggle: () => {} };
}

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

/**
 * Sayt «terisi» (skin).
 *
 *   mosaic  — Toshkent mozaikasi: yassi bloklar, qalin chegara, qattiq soya
 *   glass   — shishasimon, chuqurlik va yorugʻlik
 *   minimal — jim va qimmat: koʻp havo, ingichka chiziq, bitta urgʻu rang
 *
 * Skin faqat CSS oʻzgaruvchilarini almashtiradi — tuzilma va mantiq bir xil.
 */
export const SKINS = [
  { id: 'mosaic', emoji: '🧱', label: 'Mozaika' },
  { id: 'glass', emoji: '🔮', label: 'Shisha' },
  { id: 'minimal', emoji: '⬜️', label: 'Minimal' },
];

const SkinContext = createContext(null);

export function SkinProvider({ children }) {
  const [skin, setSkin] = useLocalStorage('sp.skin', 'minimal');

  useEffect(() => {
    document.documentElement.dataset.skin = skin;
  }, [skin]);

  const cycle = useCallback(() => {
    setSkin((current) => {
      const index = SKINS.findIndex((item) => item.id === current);
      return SKINS[(index + 1) % SKINS.length].id;
    });
  }, [setSkin]);

  const value = useMemo(() => ({ skin, setSkin, cycle }), [skin, setSkin, cycle]);
  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}

export function useSkin() {
  return useContext(SkinContext) || { skin: 'minimal', setSkin: () => {}, cycle: () => {} };
}

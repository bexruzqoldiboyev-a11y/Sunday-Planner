import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('sp.favorites', []);

  const isFavorite = useCallback(
    (id) => favorites.some((place) => place.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (place) => {
      let added = false;
      setFavorites((current) => {
        const exists = current.some((item) => item.id === place.id);
        added = !exists;
        return exists
          ? current.filter((item) => item.id !== place.id)
          : [{ ...place, savedAt: new Date().toISOString() }, ...current];
      });
      return added;
    },
    [setFavorites],
  );

  const removeFavorite = useCallback(
    (id) => setFavorites((current) => current.filter((item) => item.id !== id)),
    [setFavorites],
  );

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite }),
    [favorites, isFavorite, toggleFavorite, removeFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites faqat FavoritesProvider ichida ishlaydi');
  return context;
}

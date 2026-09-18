import { useEffect, useState } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia?.(query).matches ?? false);

  useEffect(() => {
    const list = window.matchMedia?.(query);
    if (!list) return undefined;
    const handler = (event) => setMatches(event.matches);
    list.addEventListener('change', handler);
    setMatches(list.matches);
    return () => list.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');

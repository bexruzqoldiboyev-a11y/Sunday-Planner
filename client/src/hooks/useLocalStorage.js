import { useCallback, useEffect, useState } from 'react';

/**
 * localStorage bilan ishlovchi state.
 * Brauzer storage'ni bloklagan boʻlsa ham ilova yiqilmaydi — oddiy state boʻlib qoladi.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage yopiq — e'tiborsiz qoldiramiz */
    }
  }, [key, value]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);

  return [value, setValue, reset];
}

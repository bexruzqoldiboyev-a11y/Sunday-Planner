import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { uz } from './uz.js';
import { ru } from './ru.js';
import { en } from './en.js';

/**
 * Sodda i18n: asosiy til — oʻzbekcha.
 * Boshqa tilda kalit topilmasa, oʻzbekcha matn koʻrsatiladi (fallback),
 * shuning uchun tarjimani bosqichma-bosqich toʻldirish mumkin.
 */

const DICTS = { uz, ru, en };

export const LANGUAGES = [
  { id: 'uz', label: "O'z", full: 'Oʻzbekcha' },
  { id: 'ru', label: 'Ру', full: 'Русский' },
  { id: 'en', label: 'En', full: 'English' },
];

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useLocalStorage('sp.lang', 'uz');

  const t = useCallback(
    (key, vars) => {
      const dict = DICTS[lang] || uz;
      let text = dict[key] ?? uz[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([name, value]) => {
          text = text.replaceAll(`{${name}}`, value);
        });
      }
      return text;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n faqat I18nProvider ichida ishlaydi');
  return context;
}

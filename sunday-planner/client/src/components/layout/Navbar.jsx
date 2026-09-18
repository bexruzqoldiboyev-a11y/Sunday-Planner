import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useMotionMode } from '../../context/MotionContext.jsx';
import { useSkin, SKINS } from '../../context/SkinContext.jsx';
import { usePlan } from '../../context/PlanContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { useI18n, LANGUAGES } from '../../i18n/index.jsx';
import { Button } from '../ui/Button.jsx';

export function Navbar() {
  const { theme, toggle } = useTheme();
  const { animated, toggle: toggleMotion } = useMotionMode();
  const { skin, setSkin } = useSkin();
  const { t, lang, setLang } = useI18n();
  const { savedPlans } = usePlan();
  const { favorites } = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/planner', label: t('nav.planner') },
    { to: '/saved', label: t('nav.saved'), count: savedPlans.length + favorites.length },
  ];

  return (
    <header className="nav" data-scrolled={scrolled}>
      <div className="shell shell--wide nav__inner">
        <NavLink to="/" className="brand" aria-label="Sunday Planner">
          <span className="brand__mark" aria-hidden="true">
            ☀️
          </span>
          Sunday&nbsp;Planner
        </NavLink>

        <nav className="nav__links" aria-label="Asosiy menyu">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <NavLink key={link.to} to={link.to} className="nav__link" end>
                {active ? (
                  <motion.span
                    layoutId="nav-pill"
                    className="nav__pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                ) : null}
                {link.label}
                {link.count ? ` (${link.count})` : ''}
              </NavLink>
            );
          })}
        </nav>

        <div className="nav__actions">
          <div className="segments" role="group" aria-label="Til">
            {LANGUAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                className="segments__item"
                data-active={lang === item.id}
                aria-label={item.full}
                onClick={() => setLang(item.id)}
              >
                {lang === item.id ? (
                  <motion.span
                    layoutId="lang-marker"
                    className="segments__marker"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                  />
                ) : null}
                {item.label}
              </button>
            ))}
          </div>

          <div className="skin-switch" role="group" aria-label="Dizayn uslubi">
            {SKINS.map((item) => (
              <button
                key={item.id}
                type="button"
                className="skin-switch__item"
                data-active={skin === item.id}
                onClick={() => setSkin(item.id)}
                title={item.label}
                aria-label={item.label}
                aria-pressed={skin === item.id}
              >
                {item.emoji}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="icon-btn"
            data-on={animated}
            onClick={toggleMotion}
            aria-pressed={animated}
            aria-label="Animatsiyani yoqish/oʻchirish"
            title={animated ? 'Animatsiya yoqilgan' : 'Animatsiya oʻchirilgan'}
          >
            ✨
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={toggle}
            aria-label={t('nav.theme')}
            title={t('nav.theme')}
          >
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </motion.span>
          </button>

          <Button as="link" to="/planner" className="nav__cta">
            {t('nav.cta')}
          </Button>
        </div>
      </div>
    </header>
  );
}

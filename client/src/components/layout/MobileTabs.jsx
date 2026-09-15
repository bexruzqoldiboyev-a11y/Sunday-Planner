import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../../i18n/index.jsx';

/** Telefonda pastdagi navigatsiya — barmoq yetadigan joyda. */
export function MobileTabs() {
  const { t } = useI18n();
  const { pathname } = useLocation();

  const items = [
    { to: '/', icon: '🏠', label: t('nav.home') },
    { to: '/planner', icon: '🗓', label: t('nav.planner') },
    { to: '/saved', icon: '❤️', label: t('nav.saved') },
  ];

  return (
    <nav className="tabbar" aria-label="Mobil menyu">
      {items.map((item) => (
        <NavLink key={item.to} to={item.to} className="tabbar__item" end>
          {pathname === item.to ? (
            <motion.span
              layoutId="tab-pill"
              className="tabbar__pill"
              transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            />
          ) : null}
          <span aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

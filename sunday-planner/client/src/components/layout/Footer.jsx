import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/index.jsx';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer">
      <div className="shell shell--wide footer__inner">
        <p style={{ margin: 0 }}>Sunday Planner — {t('footer.tagline')}</p>
        <div className="row" style={{ gap: '1rem' }}>
          <Link to="/planner">{t('nav.planner')}</Link>
          <Link to="/saved">{t('nav.saved')}</Link>
          <span>{t('footer.sources')}</span>
        </div>
      </div>
    </footer>
  );
}

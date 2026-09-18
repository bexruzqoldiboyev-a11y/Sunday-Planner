import { motion } from 'framer-motion';
import { Button } from '../ui/Button.jsx';
import { useI18n } from '../../i18n/index.jsx';

export function CallToAction() {
  const { t } = useI18n();

  return (
    <section className="section">
      <div className="shell shell--wide">
        <motion.div
          className="glass"
          style={{
            padding: 'clamp(1.75rem, 5vw, 3.25rem)',
            display: 'grid',
            gap: 'var(--space-3)',
            justifyItems: 'start',
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>{t('cta.title')}</h2>
          <p className="soft">{t('cta.text')}</p>
          <Button as="link" to="/planner" size="lg">
            {t('hero.cta')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

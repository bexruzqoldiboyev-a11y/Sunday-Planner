import { motion } from 'framer-motion';
import { Tilt } from '../ui/Tilt.jsx';
import { useI18n } from '../../i18n/index.jsx';

/** Uch qadam — bu haqiqiy ketma-ketlik, shuning uchun raqamlangan. */
export function HowItWorks() {
  const { t } = useI18n();
  const steps = [1, 2, 3].map((n) => ({
    n,
    title: t(`steps.${n}.title`),
    text: t(`steps.${n}.text`),
  }));

  return (
    <section className="section" id="qanday">
      <div className="shell shell--wide">
        <h2 style={{ marginBottom: 'var(--space-4)' }}>{t('steps.title')}</h2>
        <div className="steps">
          {steps.map((step, index) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 60, rotateX: 16, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.75, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <Tilt strength={10}>
                <article className="step">
                  <span className="shine" aria-hidden="true" />
                  <span className="step__index" aria-hidden="true">
                    {step.n}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

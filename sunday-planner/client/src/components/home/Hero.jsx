import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Tilt } from '../ui/Tilt.jsx';
import { Button } from '../ui/Button.jsx';
import { useI18n } from '../../i18n/index.jsx';
import { INTERESTS } from '../../data/options.js';
import DEMO_PLACES from '../../data/demoPlaces.js';
import { buildPlan } from '../../services/engine/plannerEngine.js';
import { formatCost, formatSum } from '../../utils/format.js';

const PREVIEW_BUDGETS = [200000, 500000, 1000000];

/**
 * Hero'dagi karta — bu rasm emas, haqiqiy generator.
 * Budjetni bosganda reja shu yerda qayta tuziladi: sayt nima qilishi
 * darhol koʻrinadi.
 */
function DayRibbon({ budget, t }) {
  const plan = useMemo(
    () =>
      buildPlan(
        {
          day: 'sunday',
          city: 'tashkent',
          budget,
          startTime: '10:00',
          endTime: '21:00',
          interests: ['kafe', 'park', 'kino', 'sayr', 'restoran'],
          mood: 'social',
          companion: 'friends',
          seed: 2026 + budget / 50000,
        },
        DEMO_PLACES,
      ),
    [budget],
  );

  const rows = plan.items.slice(0, 5);

  return (
    <div className="glass ribbon">
      <span className="shine" aria-hidden="true" />
      <div className="ribbon__head">
        <div>
          <div className="ribbon__title">{t('hero.ribbonDay')}</div>
          <div className="ribbon__budget">{t('hero.ribbonMeta')}</div>
        </div>
        <span className="tag">{t('hero.sample')}</span>
      </div>

      <ul className="ribbon__list">
        <AnimatePresence mode="popLayout" initial={false}>
          {rows.map((item, index) => (
            <motion.li
              key={`${budget}-${item.id}`}
              className="ribbon__row"
              layout
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: index * 0.07, type: 'spring', stiffness: 300, damping: 28 }}
            >
              <span className="ribbon__time">{item.time}</span>
              <span className="ribbon__what">
                <span aria-hidden="true">{item.place.emoji}</span>
                {item.place.categoryLabel}
              </span>
              <span className="ribbon__cost">{formatCost(item.cost)}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <motion.div className="ribbon__foot" layout>
        <span>
          {t('hero.total')}: {formatSum(plan.totals.spend)} soʻm
        </span>
        <span>
          {t('hero.left')}: {formatSum(plan.totals.remaining)} soʻm
        </span>
      </motion.div>
    </div>
  );
}

export function Hero() {
  const { t } = useI18n();
  const [budget, setBudget] = useState(500000);
  const { scrollY } = useScroll();
  const liftText = useTransform(scrollY, [0, 500], [0, -70]);
  const liftCard = useTransform(scrollY, [0, 500], [0, 60]);
  const fade = useTransform(scrollY, [0, 420], [1, 0.25]);

  return (
    <section className="hero">
      <div className="shell shell--wide hero__grid">
        <motion.div
          style={{ y: liftText, opacity: fade }}
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero__eyebrow">
            <b>{t('hero.badgeTag')}</b>
            {t('hero.badge')}
          </span>

          <h1 className="hero__title">
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(14px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {t('hero.title').split(' ').slice(0, -1).join(' ')}{' '}
              <span className="gradient-text">{t('hero.title').split(' ').slice(-1)}</span>
            </motion.span>
          </h1>

          <p className="hero__lead">{t('hero.lead')}</p>

          <div className="hero__cta">
            <Button as="link" to="/planner" size="lg">
              {t('hero.cta')} ☀️
            </Button>
            <Button as="a" href="#qanday" variant="ghost" size="lg">
              {t('hero.secondary')}
            </Button>
          </div>

          <div className="hero__facts">
            <div className="hero__fact float-y">
              <b>~5</b>
              <span>{t('hero.fact1')}</span>
            </div>
            <div className="hero__fact float-y" style={{ animationDelay: '0.8s' }}>
              <b>{INTERESTS.length}</b>
              <span>{t('hero.fact2')}</span>
            </div>
            <div className="hero__fact float-y" style={{ animationDelay: '1.6s' }}>
              <b>100%</b>
              <span>{t('hero.fact3')}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero__stage"
          style={{ y: liftCard }}
          initial={{ opacity: 0, y: 60, rotateY: -14, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateY: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="hero__orb hero__orb--1" aria-hidden="true" />
          <span className="hero__orb hero__orb--2" aria-hidden="true" />
          <span className="hero__orb hero__orb--3" aria-hidden="true" />

          <div className="stack" style={{ gap: '0.9rem' }}>
            <div className="chip-grid" role="group" aria-label={t('hero.sampleLabel')}>
              {PREVIEW_BUDGETS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className="chip"
                  data-active={budget === amount}
                  onClick={() => setBudget(amount)}
                >
                  {formatSum(amount)} soʻm
                </button>
              ))}
            </div>

            <Tilt strength={11} lift={8}>
              <DayRibbon budget={budget} t={t} />
            </Tilt>

            <p className="muted" style={{ fontSize: '0.8rem', margin: 0 }}>
              {t('hero.sampleHint')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

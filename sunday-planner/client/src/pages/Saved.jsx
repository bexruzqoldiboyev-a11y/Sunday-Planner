import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { usePlan } from '../context/PlanContext.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Tag } from '../components/ui/Chip.jsx';
import { EmptyState } from '../components/ui/States.jsx';
import { PlaceMedia } from '../components/ui/PlaceMedia.jsx';
import { Tilt } from '../components/ui/Tilt.jsx';
import { formatDate, formatMoney, formatSum } from '../utils/format.js';
import { useI18n } from '../i18n/index.jsx';

export default function Saved() {
  const { savedPlans, removeSavedPlan, openSavedPlan } = usePlan();
  const { favorites, removeFavorite } = useFavorites();
  const [tab, setTab] = useState('plans');
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useI18n();

  const open = (plan) => {
    openSavedPlan(plan);
    navigate('/result');
  };

  return (
    <section className="section">
      <div className="shell shell--wide">
        <h1 style={{ fontSize: 'var(--step-3)', marginBottom: '0.5rem' }}>{t('saved.title')}</h1>
        <p className="soft" style={{ marginBottom: 'var(--space-4)' }}>{t('saved.lead')}</p>

        <div className="tabs">
          <button
            type="button"
            className="chip"
            data-active={tab === 'plans'}
            onClick={() => setTab('plans')}
          >
            🗓 {t('saved.plans')} ({savedPlans.length})
          </button>
          <button
            type="button"
            className="chip"
            data-active={tab === 'places'}
            onClick={() => setTab('places')}
          >
            ❤️ {t('saved.places')} ({favorites.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'plans' ? (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {savedPlans.length === 0 ? (
                <EmptyState
                  icon="🗓"
                  title={t('saved.noPlans')}
                  message={t('saved.noPlansText')}
                  action={
                    <Button as="link" to="/planner">
                      {t('hero.cta')}
                    </Button>
                  }
                />
              ) : (
                <div className="saved-grid">
                  {savedPlans.map((plan) => (
                    <motion.article
                      key={plan.id}
                      className="saved-card"
                      layout
                      initial={{ opacity: 0, y: 40, rotateX: 12 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="saved-card__strip" aria-hidden="true">
                        {plan.items.slice(0, 6).map((item) => (
                          <i key={item.id} />
                        ))}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.1rem' }}>
                          {plan.dayLabel} · {plan.cityLabel}
                        </h3>
                        <p className="muted" style={{ fontSize: '0.84rem' }}>
                          {plan.startTime}–{plan.endTime} · {plan.items.length}{' '}
                          {t('common.points')} · {formatDate(plan.savedAt)}
                        </p>
                      </div>
                      <div className="row" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Tag>💰 {formatSum(plan.totals.spend)} soʻm</Tag>
                        <Tag tone="free">
                          {formatSum(plan.totals.remaining)} {t('saved.leftOf')}
                        </Tag>
                      </div>
                      <div className="row" style={{ gap: '0.5rem', marginTop: 'auto' }}>
                        <Button onClick={() => open(plan)}>{t('saved.open')}</Button>
                        <Button
                          variant="quiet"
                          onClick={() => {
                            removeSavedPlan(plan.id);
                            toast('Reja oʻchirildi');
                          }}
                        >
                          {t('saved.delete')}
                        </Button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="places"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {favorites.length === 0 ? (
                <EmptyState
                  icon="🤍"
                  title={t('saved.noPlaces')}
                  message={t('saved.noPlacesText')}
                  action={
                    <Button as="link" to="/planner">
                      {t('nav.planner')}
                    </Button>
                  }
                />
              ) : (
                <div className="saved-grid">
                  {favorites.map((place) => (
                    <motion.article
                      key={place.id}
                      className="saved-card"
                      layout
                      initial={{ opacity: 0, y: 40, rotateX: 12 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <PlaceMedia place={place} size="tall" />
                      <div>
                        <h3 style={{ fontSize: '1.05rem' }}>{place.name}</h3>
                        <p className="muted" style={{ fontSize: '0.84rem' }}>
                          {place.categoryLabel} · {place.district} · ⭐ {place.rating}
                        </p>
                      </div>
                      <div className="row" style={{ gap: '0.4rem', flexWrap: 'wrap' }}>
                        <Tag>
                          {place.priceMax > 0
                            ? `${formatMoney(place.priceMin)} dan`
                            : t('common.free')}
                        </Tag>
                        <Tag>⭐ {place.rating}</Tag>
                      </div>
                      <Button
                        variant="quiet"
                        onClick={() => {
                          removeFavorite(place.id);
                          toast('Sevimlilardan olib tashlandi');
                        }}
                      >
                        {t('saved.remove')}
                      </Button>
                    </motion.article>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

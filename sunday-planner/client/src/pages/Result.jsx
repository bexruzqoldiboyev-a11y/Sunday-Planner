import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePlan } from '../context/PlanContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useI18n } from '../i18n/index.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Tag } from '../components/ui/Chip.jsx';
import { EmptyState } from '../components/ui/States.jsx';
import { BudgetPanel } from '../components/result/BudgetPanel.jsx';
import { StatsPanel } from '../components/result/StatsPanel.jsx';
import { Timeline } from '../components/result/Timeline.jsx';
import { RouteMap } from '../components/result/RouteMap.jsx';
import { AlternativesModal } from '../components/result/AlternativesModal.jsx';
import { PlaceModal } from '../components/result/PlaceModal.jsx';
import { ShareModal } from '../components/result/ShareModal.jsx';
import { PlanActions } from '../components/result/PlanActions.jsx';
import { formatSum } from '../utils/format.js';

export default function Result() {
  const { plan, swap, fitBudget, generate, savePlan, savedPlans, status } = usePlan();
  const toast = useToast();
  const { t } = useI18n();
  const navigate = useNavigate();

  const [swapIndex, setSwapIndex] = useState(null);
  const [detailsItem, setDetailsItem] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [activePoint, setActivePoint] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!plan) {
    return (
      <section className="section">
        <div className="shell">
          <EmptyState
            icon="🗓"
            title={t('result.empty')}
            message={t('result.emptyText')}
            action={
              <Button as="link" to="/planner">
                {t('hero.cta')}
              </Button>
            }
          />
        </div>
      </section>
    );
  }

  const saved = savedPlans.some((item) => item.id === plan.id);

  const handleSwap = async (placeId) => {
    setBusy(true);
    try {
      const before = plan.totals.spend;
      const updated = await swap(swapIndex, placeId);
      const diff = updated.totals.spend - before;
      toast(
        diff === 0
          ? 'Almashtirildi — budjet oʻzgarmadi'
          : `Almashtirildi · budjet ${diff > 0 ? '+' : '−'}${formatSum(Math.abs(diff))} soʻm`,
        'success',
      );
      setSwapIndex(null);
    } catch (error) {
      toast(error.message || 'Almashtirib boʻlmadi', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleFit = async () => {
    setBusy(true);
    try {
      const updated = await fitBudget();
      toast(
        updated.optimizeResult === 'fit'
          ? 'Reja budjetga moslashtirildi'
          : 'Iloji boricha arzonlashtirildi — budjetni biroz oshirish kerak',
        updated.optimizeResult === 'fit' ? 'success' : 'info',
      );
    } catch (error) {
      toast(error.message || 'Moslashtirib boʻlmadi', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      await generate();
      toast('Yangi reja tayyor', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast(error.message || 'Qayta tuzilmadi', 'error');
    }
  };

  const handleSave = () => {
    const added = savePlan();
    toast(added ? 'Reja saqlandi' : 'Bu reja allaqachon saqlangan', added ? 'success' : 'info');
  };

  const showOnMap = (index) => {
    setActivePoint(index);
    document.getElementById('xarita')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section className="result">
      <div className="shell shell--wide">
        <motion.header
          className="result__head"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="result__title">{t('result.title')}</h1>
            <p className="soft" style={{ marginTop: '0.4rem' }}>
              {plan.copy?.headline ? `${plan.copy.headline}. ` : ''}
              {plan.copy?.summary}
            </p>
          </div>

          <div className="result__meta">
            <Tag>💰 {formatSum(plan.budget)} soʻm</Tag>
            <Tag>🕘 {plan.startTime}–{plan.endTime}</Tag>
            <Tag>📍 {plan.cityLabel}</Tag>
            <Tag>📅 {plan.dayLabel}</Tag>
            {plan.offline ? <Tag tone="demo">offline</Tag> : null}
            <Tag>🗺 {t('result.places')}: Google Places</Tag>
            <Tag>
              🛣 {t('result.travelBy')}:{' '}
              {plan.routing === 'osrm' ? t('result.realRoute') : t('result.estimated')}
            </Tag>
          </div>

          <PlanActions
            saved={saved}
            regenerating={status === 'loading'}
            onSave={handleSave}
            onShare={() => setShareOpen(true)}
            onPrint={() => window.print()}
            onRegenerate={handleRegenerate}
          />
        </motion.header>

        <div className="result__layout">
          <div className="stack" style={{ gap: 'var(--space-4)' }}>
            <Timeline
              items={plan.items}
              onSwap={(index) => setSwapIndex(index)}
              onDetails={(item) => setDetailsItem(item)}
              onMap={showOnMap}
            />

            <div className="stack" style={{ gap: '0.75rem' }}>
              <h2 style={{ fontSize: 'var(--step-2)' }}>{t('result.routeTitle')}</h2>
              <p className="muted" style={{ fontSize: '0.86rem', marginTop: '-0.35rem' }}>
                {t('result.routeLead')}
              </p>
              <RouteMap items={plan.items} activeIndex={activePoint} onSelect={setActivePoint} />
            </div>
          </div>

          <aside className="result__aside">
            <BudgetPanel plan={plan} onFit={handleFit} fitting={busy} />
            <StatsPanel plan={plan} />
            {plan.copy?.tip ? (
              <div className="card card--pad">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>{t('result.tipTitle')}</h3>
                <p className="muted" style={{ fontSize: '0.88rem' }}>
                  {plan.copy.tip}
                </p>
              </div>
            ) : null}
            <Button variant="ghost" onClick={() => navigate('/planner')}>
              ⚙️ {t('result.settings')}
            </Button>
          </aside>
        </div>
      </div>

      <AlternativesModal
        open={swapIndex !== null}
        item={swapIndex !== null ? plan.items[swapIndex] : null}
        busy={busy}
        onClose={() => setSwapIndex(null)}
        onPick={handleSwap}
      />

      <PlaceModal open={Boolean(detailsItem)} item={detailsItem} onClose={() => setDetailsItem(null)} />

      <ShareModal open={shareOpen} plan={plan} onClose={() => setShareOpen(false)} />
    </section>
  );
}

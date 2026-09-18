import { formatDuration, formatSum } from '../../utils/format.js';
import { useI18n } from '../../i18n/index.jsx';

/** Kun statistikasi — raqamlar bir qarashda. */
export function StatsPanel({ plan }) {
  const { t } = useI18n();
  const { totals } = plan;

  const cells = [
    { value: totals.activities, label: t('result.points') },
    { value: formatDuration(totals.activeMinutes), label: t('result.activeTime') },
    { value: formatDuration(totals.transportMinutes), label: t('result.onRoad') },
    { value: totals.freeCount, label: t('result.freeCount') },
    {
      value: totals.mostExpensive ? `${formatSum(totals.mostExpensive.cost)}` : '—',
      label: totals.mostExpensive
        ? `${t('result.mostExpensive')}: ${totals.mostExpensive.name}`
        : t('result.noExpensive'),
    },
    { value: `${formatSum(totals.remaining)}`, label: t('result.leftBudget') },
  ];

  return (
    <section className="card card--pad">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.9rem' }}>{t('result.statsTitle')}</h3>
      <div className="stats">
        {cells.map((cell) => (
          <div key={cell.label} className="stat">
            <b>{cell.value}</b>
            <span>{cell.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

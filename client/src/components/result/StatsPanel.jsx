import { formatDuration, formatSum } from '../../utils/format.js';

/** Kun statistikasi — raqamlar bir qarashda. */
export function StatsPanel({ plan }) {
  const { totals } = plan;

  const cells = [
    { value: totals.activities, label: 'Nuqta' },
    { value: formatDuration(totals.activeMinutes), label: 'Activity vaqti' },
    { value: formatDuration(totals.transportMinutes), label: 'Yoʻlda' },
    { value: totals.freeCount, label: 'Bepul activity' },
    {
      value: totals.mostExpensive ? `${formatSum(totals.mostExpensive.cost)}` : '—',
      label: totals.mostExpensive ? `Eng qimmat: ${totals.mostExpensive.name}` : 'Qimmat nuqta yoʻq',
    },
    { value: `${formatSum(totals.remaining)}`, label: 'Qolgan budjet' },
  ];

  return (
    <section className="card card--pad">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.9rem' }}>Kun statistikasi</h3>
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

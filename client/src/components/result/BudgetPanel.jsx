import { motion } from 'framer-motion';
import { Meter } from '../ui/Meter.jsx';
import { Button } from '../ui/Button.jsx';
import { useCountUp } from '../../hooks/useCountUp.js';
import { formatSum } from '../../utils/format.js';

/** Natija sahifasining yuqori qismi: qancha ketadi, qancha qoladi. */
export function BudgetPanel({ plan, onFit, fitting }) {
  const { totals, budget, spendTarget } = plan;
  const spend = useCountUp(totals.spend);
  const over = totals.over > 0;

  return (
    <section className="glass budget">
      <span className="shine" aria-hidden="true" />
      <div className="budget__numbers">
        <div>
          <div className="budget__spend">{formatSum(spend)}</div>
          <div className="budget__of">{formatSum(budget)} soʻm budjetdan</div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ textAlign: 'right' }}
        >
          <div style={{ fontWeight: 800, color: over ? 'var(--coral)' : 'var(--mint)' }}>
            {over ? `+${formatSum(totals.over)}` : formatSum(totals.remaining)}
          </div>
          <div className="budget__of">{over ? 'oshib ketdi' : 'qoladi'}</div>
        </motion.div>
      </div>

      <Meter
        percent={totals.usedPercent}
        tone={over ? 'over' : 'ok'}
        targetPercent={budget ? (spendTarget / budget) * 100 : 0}
      />

      <div className="budget__legend">
        <span>0</span>
        <span>{formatSum(budget)} soʻm</span>
      </div>

      {over ? (
        <div className="budget__warning">
          <span aria-hidden="true">⚠️</span>
          <div className="stack" style={{ gap: '0.6rem' }}>
            <span>
              Bu reja budjetingizdan {formatSum(totals.over)} soʻm oshib ketmoqda.
            </span>
            <Button variant="ghost" onClick={onFit} disabled={fitting}>
              {fitting ? 'Moslashtirilmoqda…' : 'Budjetga moslashtirish'}
            </Button>
          </div>
        </div>
      ) : (
        <p className="muted" style={{ fontSize: '0.84rem', marginTop: '0.9rem' }}>
          Sizga {formatSum(totals.spend)} soʻmlik optimal reja topdik — qolgan puli zaxirada.
        </p>
      )}

      <div className="budget__split">
        <div className="budget__cell">
          <b>{formatSum(totals.activityCost)}</b>
          <span>Activity va ovqat</span>
        </div>
        <div className="budget__cell">
          <b>{formatSum(totals.transportCost)}</b>
          <span>Yoʻl xarajati</span>
        </div>
      </div>
    </section>
  );
}

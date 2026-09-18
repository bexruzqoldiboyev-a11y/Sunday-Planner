import { motion } from 'framer-motion';

/** Budjet progress bari. target — tavsiya etilgan sarf chizigʻi. */
export function Meter({ percent, tone = 'ok', targetPercent }) {
  const width = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="meter"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(width)}
    >
      <motion.div
        className="meter__fill"
        data-tone={tone}
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ type: 'spring', stiffness: 90, damping: 20, delay: 0.15 }}
      />
      {targetPercent ? (
        <span className="meter__target" style={{ left: `${Math.min(99, targetPercent)}%` }} />
      ) : null}
    </div>
  );
}

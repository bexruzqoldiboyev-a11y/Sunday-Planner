import { useMemo } from 'react';
import { BUDGET } from '../../../data/options.js';
import { formatSum } from '../../../utils/format.js';
import { useI18n } from '../../../i18n/index.jsx';

/**
 * 3-qadam: budjet.
 *
 * Chegara yoʻq — xohlagan summani kiritish mumkin. Slider shunchaki qulaylik:
 * kiritilgan summa sliderning yuqori chegarasidan oshsa, chegara oʻzi kengayadi.
 */
export function StepBudget({ form, update, errors }) {
  const { t } = useI18n();
  const budget = Number(form.budget) || 0;

  // Slider chegarasi: kiritilgan summadan kelib chiqib oʻzi kattalashadi.
  const sliderMax = useMemo(() => {
    if (budget <= BUDGET.sliderMax) return BUDGET.sliderMax;
    const step = 1000000;
    return Math.ceil((budget * 1.2) / step) * step;
  }, [budget]);

  const setBudget = (value) => {
    const raw = String(value).replace(/[^\d]/g, '');
    update({ budget: raw === '' ? 0 : Number(raw) });
  };

  return (
    <div className="stack" style={{ gap: 'var(--space-4)' }}>
      <div className="field">
        <span className="field__label">{t('f.budgetQ')}</span>

        <div className="budget-preview">
          <b>{formatSum(budget)}</b>
          <span className="muted">soʻm</span>
        </div>

        <input
          className="input"
          type="range"
          min={0}
          max={sliderMax}
          step={BUDGET.step}
          value={Math.min(sliderMax, budget)}
          onChange={(event) => setBudget(event.target.value)}
          aria-label={t('f.budgetSlider')}
          style={{ padding: 0, background: 'transparent', border: 'none' }}
        />

        <div className="slider__scale">
          <span>0</span>
          <span>{formatSum(sliderMax)}</span>
        </div>

        {errors.budget ? <span className="field__error">{errors.budget}</span> : null}
      </div>

      <div className="field">
        <span className="field__label">{t('f.budgetExact')}</span>

        {/* text + inputMode: probel bilan yozilgan summa ham qabul qilinadi */}
        <input
          className={`input ${errors.budget ? 'input--invalid' : ''}`}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={budget ? formatSum(budget) : ''}
          placeholder="0"
          onChange={(event) => setBudget(event.target.value)}
          aria-label={t('f.budgetExact')}
        />

        <div className="quick-sums">
          {BUDGET.presets.map((amount) => (
            <button
              key={amount}
              type="button"
              className="chip"
              data-active={budget === amount}
              onClick={() => setBudget(amount)}
            >
              {formatSum(amount)}
            </button>
          ))}
        </div>

        <span className="field__hint">{t('f.budgetHint')}</span>
      </div>
    </div>
  );
}

import { BUDGET } from '../../../data/options.js';
import { formatSum } from '../../../utils/format.js';

/** 3-qadam: budjet. Slider ham, klaviatura ham ishlaydi. */
export function StepBudget({ form, update, errors }) {
  const setBudget = (value) => {
    const number = Math.max(0, Math.min(BUDGET.max, Number(value) || 0));
    update({ budget: number });
  };

  return (
    <div className="stack" style={{ gap: 'var(--space-4)' }}>
      <div className="field">
        <span className="field__label">Budjetingiz qancha?</span>
        <div className="budget-preview">
          <b>{formatSum(form.budget)}</b>
          <span className="muted">soʻm</span>
        </div>
        <input
          className={`input ${errors.budget ? 'input--invalid' : ''}`}
          type="range"
          min={BUDGET.min}
          max={BUDGET.max}
          step={BUDGET.step}
          value={Math.min(BUDGET.max, Math.max(BUDGET.min, form.budget))}
          onChange={(event) => setBudget(event.target.value)}
          aria-label="Budjet slideri"
          style={{ padding: 0, background: 'transparent', border: 'none' }}
        />
        <div className="slider__scale">
          <span>{formatSum(BUDGET.min)}</span>
          <span>{formatSum(BUDGET.max)}</span>
        </div>
        {errors.budget ? <span className="field__error">{errors.budget}</span> : null}
      </div>

      <div className="field">
        <span className="field__label">Aniq summa</span>
        <input
          className="input"
          type="number"
          inputMode="numeric"
          min={0}
          step={10000}
          value={form.budget}
          onChange={(event) => setBudget(event.target.value)}
          aria-label="Budjet summasi"
        />
        <div className="quick-sums">
          {BUDGET.presets.map((amount) => (
            <button
              key={amount}
              type="button"
              className="chip"
              data-active={form.budget === amount}
              onClick={() => setBudget(amount)}
            >
              {formatSum(amount)}
            </button>
          ))}
        </div>
        <span className="field__hint">
          Bu — yuqori chegara. Reja arzonroq chiqsa, ortgan pul shunchaki qoladi.
        </span>
      </div>
    </div>
  );
}

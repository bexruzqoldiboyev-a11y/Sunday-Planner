import { DAYS, CITIES } from '../../../data/options.js';
import { useI18n } from '../../../i18n/index.jsx';

/** 1-qadam: qaysi kun va qaysi shahar. */
export function StepWhen({ form, update }) {
  const { t } = useI18n();

  return (
    <div className="stack" style={{ gap: 'var(--space-4)' }}>
      <div className="field">
        <span className="field__label">{t('f.day')}</span>
        <div className="option-grid">
          {DAYS.map((day) => (
            <button
              key={day.id}
              type="button"
              className="option"
              data-active={form.day === day.id}
              disabled={!day.available}
              onClick={() => update({ day: day.id })}
            >
              <span className="option__emoji" aria-hidden="true">
                {day.emoji}
              </span>
              <span className="option__label">{t(day.key)}</span>
              <span className="option__hint">{day.available ? t('f.ready') : t('f.soon')}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">{t('f.city')}</span>
        <div className="chip-grid">
          {CITIES.map((city) => (
            <button
              key={city.id}
              type="button"
              className="chip"
              data-active={form.city === city.id}
              disabled={!city.available}
              onClick={() => update({ city: city.id, cityLabel: city.label })}
            >
              {city.label}
              {!city.available ? ` · ${t('f.soon').toLowerCase()}` : ''}
            </button>
          ))}
        </div>
        <span className="field__hint">{t('f.cityHint')}</span>
      </div>
    </div>
  );
}

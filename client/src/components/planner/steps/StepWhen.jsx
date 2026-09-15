import { DAYS, CITIES } from '../../../data/options.js';

/** 1-qadam: qaysi kun va qaysi shahar. */
export function StepWhen({ form, update }) {
  return (
    <div className="stack" style={{ gap: 'var(--space-4)' }}>
      <div className="field">
        <span className="field__label">Qaysi kun?</span>
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
              <span className="option__label">{day.label}</span>
              <span className="option__hint">{day.available ? 'Tayyor' : 'Tez orada'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field__label">Joylashuv</span>
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
              {!city.available ? ' · tez orada' : ''}
            </button>
          ))}
        </div>
        <span className="field__hint">
          Hozircha joylar bazasi Toshkent uchun. Boshqa shaharlar qoʻshilganda shu roʻyxat oʻzi
          uzayadi.
        </span>
      </div>
    </div>
  );
}

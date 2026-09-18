import { CITIES, QUICK_DAYS } from '../../../data/options.js';
import { useI18n } from '../../../i18n/index.jsx';
import {
  formatDateLong,
  nextWeekdayISO,
  todayISO,
  toISODate,
  weekdayId,
} from '../../../utils/format.js';

/**
 * 1-qadam: sana va shahar.
 *
 * Hafta kuni alohida tanlanmaydi — u sanadan avtomatik aniqlanadi.
 * Shu tufayli reja aniq kunga bogʻlanadi (masalan 21-sentabr, yakshanba).
 */
export function StepWhen({ form, update, errors }) {
  const { t, lang } = useI18n();
  const today = todayISO();
  const date = form.date || nextWeekdayISO(0);
  const weekday = weekdayId(date);

  const setDate = (value) => {
    if (!value) return;
    update({ date: value, day: weekdayId(value) });
  };

  const quickValue = (item) => {
    if (item.id === 'today') return today;
    if (item.id === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return toISODate(tomorrow);
    }
    return nextWeekdayISO(item.weekday);
  };

  return (
    <div className="stack" style={{ gap: 'var(--space-4)' }}>
      <div className="field">
        <span className="field__label">{t('f.dateQ')}</span>

        <input
          className={`input input--date ${errors.date ? 'input--invalid' : ''}`}
          type="date"
          value={date}
          min={today}
          onChange={(event) => setDate(event.target.value)}
          aria-label={t('f.dateQ')}
        />

        <span className="field__hint">
          {formatDateLong(date, lang)} · <b>{t(`day.${weekday}`)}</b>
        </span>

        {errors.date ? <span className="field__error">{errors.date}</span> : null}

        <div className="chip-grid" style={{ marginTop: '0.35rem' }}>
          {QUICK_DAYS.map((item) => {
            const value = quickValue(item);
            return (
              <button
                key={item.id}
                type="button"
                className="chip"
                data-active={date === value}
                onClick={() => setDate(value)}
              >
                {t(item.key)}
              </button>
            );
          })}
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

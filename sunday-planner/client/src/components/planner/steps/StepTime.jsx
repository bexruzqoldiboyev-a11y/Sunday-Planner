import { formatDuration, toMinutes } from '../../../utils/format.js';
import { useI18n } from '../../../i18n/index.jsx';

const PRESETS = [
  { key: 'f.presetAll', start: '09:00', end: '22:00' },
  { key: 'f.presetAfternoon', start: '13:00', end: '21:00' },
  { key: 'f.presetEvening', start: '17:00', end: '23:00' },
];

/** 2-qadam: vaqt oynasi. */
export function StepTime({ form, update, errors }) {
  const { t } = useI18n();
  const start = toMinutes(form.startTime);
  const end = toMinutes(form.endTime);
  const length = start !== null && end !== null ? end - start : 0;

  return (
    <div className="stack" style={{ gap: 'var(--space-4)' }}>
      <div className="field">
        <span className="field__label">{t('f.timeQ')}</span>
        <div className="time-pair">
          <input
            className={`input ${errors.startTime ? 'input--invalid' : ''}`}
            type="time"
            value={form.startTime}
            aria-label="Boshlanish vaqti"
            onChange={(event) => update({ startTime: event.target.value })}
          />
          <span className="time-pair__arrow" aria-hidden="true">
            →
          </span>
          <input
            className={`input ${errors.endTime ? 'input--invalid' : ''}`}
            type="time"
            value={form.endTime}
            aria-label="Tugash vaqti"
            onChange={(event) => update({ endTime: event.target.value })}
          />
        </div>
        {errors.startTime || errors.endTime ? (
          <span className="field__error">{errors.startTime || errors.endTime}</span>
        ) : (
          <span className="field__hint">
            {t('f.timeFree')}: {length > 0 ? formatDuration(length) : '—'}
          </span>
        )}
      </div>

      <div className="field">
        <span className="field__label">{t('f.presets')}</span>
        <div className="chip-grid">
          {PRESETS.map((preset) => (
            <button
              key={preset.key}
              type="button"
              className="chip"
              data-active={form.startTime === preset.start && form.endTime === preset.end}
              onClick={() => update({ startTime: preset.start, endTime: preset.end })}
            >
              {t(preset.key)} · {preset.start}–{preset.end}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

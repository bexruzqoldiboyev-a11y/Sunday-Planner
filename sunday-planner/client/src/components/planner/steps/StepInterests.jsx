import { INTERESTS } from '../../../data/options.js';
import { useI18n } from '../../../i18n/index.jsx';

/** 5-qadam: qiziqishlar (bir nechtasini tanlash mumkin). */
export function StepInterests({ form, update }) {
  const { t } = useI18n();
  const toggle = (id) => {
    const selected = form.interests.includes(id)
      ? form.interests.filter((item) => item !== id)
      : [...form.interests, id];
    update({ interests: selected });
  };

  return (
    <div className="field">
      <span className="field__label">{t('f.interestsQ')}</span>
      <span className="field__hint">
        {t('f.interestsHint', { count: form.interests.length })}
      </span>
      <div className="chip-grid" style={{ marginTop: '0.5rem' }}>
        {INTERESTS.map((interest) => (
          <button
            key={interest.id}
            type="button"
            className="chip"
            aria-pressed={form.interests.includes(interest.id)}
            onClick={() => toggle(interest.id)}
          >
            <span className="chip__emoji" aria-hidden="true">
              {interest.emoji}
            </span>
            {t(interest.key)}
          </button>
        ))}
      </div>
      <div className="row" style={{ marginTop: '0.9rem', gap: '0.5rem' }}>
        <button type="button" className="btn btn--quiet" onClick={() => update({ interests: [] })}>
          {t('f.clear')}
        </button>
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => update({ interests: INTERESTS.map((item) => item.id) })}
        >
          {t('f.all')}
        </button>
      </div>
    </div>
  );
}

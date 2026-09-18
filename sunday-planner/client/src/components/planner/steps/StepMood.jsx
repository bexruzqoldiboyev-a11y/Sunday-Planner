import { MOODS } from '../../../data/options.js';
import { useI18n } from '../../../i18n/index.jsx';

/** 6-qadam: kayfiyat — budjet taqsimotiga ham taʼsir qiladi. */
export function StepMood({ form, update }) {
  const { t } = useI18n();

  return (
    <div className="field">
      <span className="field__label">{t('f.moodQ')}</span>
      <div className="option-grid">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            type="button"
            className="option"
            data-active={form.mood === mood.id}
            onClick={() => update({ mood: mood.id })}
          >
            <span className="option__emoji" aria-hidden="true">
              {mood.emoji}
            </span>
            <span className="option__label">{mood.label}</span>
            <span className="option__hint">{t(mood.hintKey)}</span>
          </button>
        ))}
      </div>
      <span className="field__hint">{t('f.moodHint')}</span>
    </div>
  );
}

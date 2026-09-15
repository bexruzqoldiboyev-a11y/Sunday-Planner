import { MOODS } from '../../../data/options.js';

/** 6-qadam: kayfiyat — budjet taqsimotiga ham taʼsir qiladi. */
export function StepMood({ form, update }) {
  return (
    <div className="field">
      <span className="field__label">Bugungi kayfiyat?</span>
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
            <span className="option__hint">{mood.hint}</span>
          </button>
        ))}
      </div>
      <span className="field__hint">
        Masalan, «Budget» kayfiyatida budjetning yarmi ishlatiladi, «Luxury» da esa deyarli hammasi.
      </span>
    </div>
  );
}

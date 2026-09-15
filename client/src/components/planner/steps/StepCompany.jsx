import { COMPANIONS } from '../../../data/options.js';

/** 4-qadam: kim bilan. */
export function StepCompany({ form, update }) {
  return (
    <div className="field">
      <span className="field__label">Kim bilan chiqasiz?</span>
      <div className="option-grid">
        {COMPANIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="option"
            data-active={form.companion === item.id}
            onClick={() => update({ companion: item.id })}
          >
            <span className="option__emoji" aria-hidden="true">
              {item.emoji}
            </span>
            <span className="option__label">{item.label}</span>
            <span className="option__hint">{item.hint}</span>
          </button>
        ))}
      </div>
      <span className="field__hint">
        Bu tanlovga qarab ayrim joylar rejadan chiqib ketadi — masalan, yolgʻiz uchun karaoke xonasi.
      </span>
    </div>
  );
}

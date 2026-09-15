import { INTERESTS } from '../../../data/options.js';

/** 5-qadam: qiziqishlar (bir nechtasini tanlash mumkin). */
export function StepInterests({ form, update }) {
  const toggle = (id) => {
    const selected = form.interests.includes(id)
      ? form.interests.filter((item) => item !== id)
      : [...form.interests, id];
    update({ interests: selected });
  };

  return (
    <div className="field">
      <span className="field__label">Nima yoqadi?</span>
      <span className="field__hint">
        Kamida 2 tasini tanlang — reja shunda xilma-xil chiqadi. {form.interests.length} ta tanlandi.
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
            {interest.label}
          </button>
        ))}
      </div>
      <div className="row" style={{ marginTop: '0.9rem', gap: '0.5rem' }}>
        <button type="button" className="btn btn--quiet" onClick={() => update({ interests: [] })}>
          Tozalash
        </button>
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => update({ interests: INTERESTS.map((item) => item.id) })}
        >
          Hammasi qiziq
        </button>
      </div>
    </div>
  );
}

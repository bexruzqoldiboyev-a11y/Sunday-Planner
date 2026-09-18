import { COMPANIONS } from '../../../data/options.js';
import { useI18n } from '../../../i18n/index.jsx';

/** 4-qadam: kim bilan. */
export function StepCompany({ form, update }) {
  const { t } = useI18n();

  return (
    <div className="field">
      <span className="field__label">{t('f.companyQ')}</span>
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
            <span className="option__label">{t(item.key)}</span>
            <span className="option__hint">{t(item.hintKey)}</span>
          </button>
        ))}
      </div>
      <span className="field__hint">{t('f.companyHint')}</span>
    </div>
  );
}

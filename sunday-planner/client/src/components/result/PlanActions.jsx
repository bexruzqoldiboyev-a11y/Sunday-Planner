import { Button } from '../ui/Button.jsx';
import { useI18n } from '../../i18n/index.jsx';

/** Natija ustidagi asosiy amallar. */
export function PlanActions({ onSave, onShare, onPrint, onRegenerate, saved, regenerating }) {
  const { t } = useI18n();

  return (
    <div className="row result__actions" style={{ flexWrap: 'wrap', gap: '0.6rem' }}>
      <Button variant="ghost" onClick={onSave}>
        {saved ? `❤️ ${t('result.saved')}` : `🤍 ${t('result.save')}`}
      </Button>
      <Button variant="ghost" onClick={onShare}>
        📤 {t('result.share')}
      </Button>
      <Button variant="ghost" onClick={onPrint}>
        🖨 {t('result.print')}
      </Button>
      <Button onClick={onRegenerate} disabled={regenerating}>
        {regenerating ? t('planner.generating') : `🔄 ${t('result.regenerate')}`}
      </Button>
    </div>
  );
}

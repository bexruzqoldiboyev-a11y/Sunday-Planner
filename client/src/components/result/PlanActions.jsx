import { Button } from '../ui/Button.jsx';

/** Natija ustidagi asosiy amallar. */
export function PlanActions({ onSave, onShare, onPrint, onRegenerate, saved, regenerating }) {
  return (
    <div className="row result__actions" style={{ flexWrap: 'wrap', gap: '0.6rem' }}>
      <Button variant="ghost" onClick={onSave}>
        {saved ? '❤️ Saqlandi' : '🤍 Saqlash'}
      </Button>
      <Button variant="ghost" onClick={onShare}>
        📤 Ulashish
      </Button>
      <Button variant="ghost" onClick={onPrint}>
        🖨 Print
      </Button>
      <Button onClick={onRegenerate} disabled={regenerating}>
        {regenerating ? 'Tuzilmoqda…' : '🔄 Qayta tuzish'}
      </Button>
    </div>
  );
}

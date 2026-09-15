import { useMemo, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Button } from '../ui/Button.jsx';
import { formatSum } from '../../utils/format.js';

/** Ulashish uchun karta + matn. Link mavjud boʻlmasa matnni nusxalash ishlaydi. */
export function ShareModal({ open, plan, onClose }) {
  const [copied, setCopied] = useState(false);

  const text = useMemo(() => {
    if (!plan) return '';
    const rows = plan.items
      .map((item) => `${item.time} ${item.place.emoji} ${item.place.name} — ${item.cost > 0 ? `${formatSum(item.cost)} soʻm` : 'bepul'}`)
      .join('\n');
    return [
      `My Sunday Plan ☀️`,
      `${plan.cityLabel} · ${plan.startTime}–${plan.endTime}`,
      `Budjet: ${formatSum(plan.budget)} soʻm · Sarf: ${formatSum(plan.totals.spend)} soʻm`,
      '',
      rows,
      '',
      'Sunday Planner bilan tuzildi',
    ].join('\n');
  }, [plan]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My Sunday Plan', text });
        return;
      } catch {
        /* foydalanuvchi bekor qildi */
      }
    }
    copy();
  };

  if (!plan) return null;

  return (
    <Modal open={open} onClose={onClose} title="Rejani ulashish" subtitle="Doʻstlarga yuboring">
      <div className="stack">
        <div className="share-card">
          <div className="share-card__title">My Sunday Plan ☀️</div>
          <div className="share-card__rows">
            <div className="share-card__row">
              <span>Budjet</span>
              <b>{formatSum(plan.budget)} soʻm</b>
            </div>
            <div className="share-card__row">
              <span>Sarf</span>
              <b>{formatSum(plan.totals.spend)} soʻm</b>
            </div>
            <div className="share-card__row">
              <span>Activities</span>
              <b>{plan.totals.activities}</b>
            </div>
            <div className="share-card__row">
              <span>City</span>
              <b>{plan.cityLabel}</b>
            </div>
          </div>
          <div className="share-card__foot">sunday-planner · {plan.startTime}–{plan.endTime}</div>
        </div>

        <textarea className="input" rows={6} readOnly value={text} aria-label="Ulashish matni" />

        <div className="row" style={{ gap: '0.6rem', flexWrap: 'wrap' }}>
          <Button onClick={share}>📤 Ulashish</Button>
          <Button variant="ghost" onClick={copy}>
            {copied ? '✅ Nusxalandi' : '📋 Matnni nusxalash'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

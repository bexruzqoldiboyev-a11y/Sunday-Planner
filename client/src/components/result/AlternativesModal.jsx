import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal.jsx';
import { Tag } from '../ui/Chip.jsx';
import { formatCost, formatDuration } from '../../utils/format.js';
import { PlaceMedia } from '../ui/PlaceMedia.jsx';

/** Bitta qadamni almashtirish oynasi. */
export function AlternativesModal({ open, item, onClose, onPick, busy }) {
  const options = item?.alternatives || [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Boshqa variant tanlang"
      subtitle={item ? `${item.time} — hozir: ${item.place.name}` : ''}
    >
      {options.length === 0 ? (
        <p className="muted">
          Bu qadam uchun mos alternativa qolmadi. Qiziqishlarni kengaytirib rejani qayta tuzsangiz,
          variantlar koʻpayadi.
        </p>
      ) : (
        <ul className="stack" style={{ gap: '0.6rem' }}>
          {options.map((option, index) => (
            <motion.li
              key={option.place.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                type="button"
                className="tl-card"
                style={{ width: '100%', textAlign: 'left' }}
                disabled={busy}
                onClick={() => onPick(option.place.id)}
              >
                <div className="tl-card__top">
                  <PlaceMedia place={option.place} size="sm" />
                  <div style={{ minWidth: 0 }}>
                    <h3 className="tl-card__title">{option.place.name}</h3>
                    <div className="tl-card__sub">
                      {option.place.categoryLabel} · {formatDuration(option.place.durationMin)}
                    </div>
                  </div>
                  <div className="tl-card__price">
                    {formatCost(option.cost)}
                    <span>
                      {option.cost < item.cost
                        ? `−${formatCost(item.cost - option.cost)}`
                        : option.cost > item.cost
                          ? `+${formatCost(option.cost - item.cost)}`
                          : 'bir xil'}
                    </span>
                  </div>
                </div>
                <div className="tl-card__meta">
                  <Tag>⭐ {option.place.rating}</Tag>
                  <Tag>📍 {option.place.district}</Tag>
                  <Tag>🕘 {option.place.openTime}–{option.place.closeTime}</Tag>
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </Modal>
  );
}

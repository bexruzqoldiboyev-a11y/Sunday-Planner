/** Tanlanadigan chip (qiziqishlar, tez tanlovlar). */
export function Chip({ active, emoji, children, className = '', ...rest }) {
  return (
    <button type="button" className={`chip ${className}`} aria-pressed={Boolean(active)} {...rest}>
      {emoji ? (
        <span className="chip__emoji" aria-hidden="true">
          {emoji}
        </span>
      ) : null}
      {children}
    </button>
  );
}

/** Faqat oʻqish uchun yorliq. */
export function Tag({ tone, children }) {
  return <span className={`tag ${tone ? `tag--${tone}` : ''}`}>{children}</span>;
}

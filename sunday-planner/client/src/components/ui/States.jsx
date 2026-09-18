import { Button } from './Button.jsx';

/** Xato holati — nima boʻlgani va nima qilish kerakligi aytiladi. */
export function ErrorState({ title = 'Reja tuzilmadi', message, details, onRetry, retryLabel = 'Qayta urinish' }) {
  return (
    <div className="state">
      <div className="state__icon" aria-hidden="true">🧩</div>
      <div className="stack" style={{ gap: '0.5rem', alignItems: 'center' }}>
        <h3>{title}</h3>
        {message ? <p className="muted">{message}</p> : null}
        {details ? (
          <ul className="stack" style={{ gap: '0.25rem' }}>
            {Object.entries(details).map(([key, text]) => (
              <li key={key} className="field__error">
                {text}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      {onRetry ? (
        <Button onClick={onRetry} variant="ghost">
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

/** Boʻsh holat — bu ekran doim harakatga chorlaydi. */
export function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="state">
      <div className="state__icon" aria-hidden="true">{icon}</div>
      <div className="stack" style={{ gap: '0.5rem', alignItems: 'center' }}>
        <h3>{title}</h3>
        {message ? <p className="muted">{message}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Spinner({ label }) {
  return (
    <span className="row" style={{ gap: '0.6rem' }}>
      <span className="spinner" aria-hidden="true" />
      {label ? <span className="muted">{label}</span> : null}
    </span>
  );
}

import { Component } from 'react';

/**
 * Kutilmagan xatoda ham oq ekran chiqmasligi kerak.
 * Bu chegara xatoni ushlab, tushunarli ekran koʻrsatadi.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ui] kutilmagan xato:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="shell" style={{ paddingBlock: '18vh' }}>
        <div className="state">
          <div className="state__icon" aria-hidden="true">
            🛠
          </div>
          <h2>Nimadir buzildi</h2>
          <p className="muted">
            Sahifani yangilang. Muammo takrorlansa, brauzer xotirasini tozalash yordam beradi.
          </p>
          <div className="row" style={{ gap: '0.6rem' }}>
            <button type="button" className="btn btn--primary" onClick={() => window.location.reload()}>
              Sahifani yangilash
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                try {
                  window.localStorage.clear();
                } catch {
                  /* ignore */
                }
                window.location.href = '/';
              }}
            >
              Xotirani tozalash
            </button>
          </div>
        </div>
      </div>
    );
  }
}

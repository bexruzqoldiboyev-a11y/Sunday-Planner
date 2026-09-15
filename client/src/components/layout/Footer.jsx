import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell shell--wide footer__inner">
        <p style={{ margin: 0 }}>
          Sunday Planner — boʻsh kuningni bizga topshir. Mazali reja bilan qaytaramiz.
        </p>
        <div className="row" style={{ gap: '1rem' }}>
          <Link to="/planner">Reja tuzish</Link>
          <Link to="/saved">Saqlangan</Link>
          <span>Joylar: Google Places · Xarita: OpenStreetMap · Narxlar taxminiy</span>
        </div>
      </div>
    </footer>
  );
}

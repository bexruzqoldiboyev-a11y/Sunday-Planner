import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';
import { MobileTabs } from './MobileTabs.jsx';
import { Aurora } from './Aurora.jsx';

export function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Asosiy qismga oʻtish
      </a>
      <Aurora />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <MobileTabs />
    </>
  );
}

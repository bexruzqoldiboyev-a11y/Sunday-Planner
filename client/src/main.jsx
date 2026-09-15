import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { MotionProvider } from './context/MotionContext.jsx';
import { I18nProvider } from './i18n/index.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { PlanProvider } from './context/PlanContext.jsx';
import { ScrollToTop } from './components/layout/ScrollToTop.jsx';
import { ErrorBoundary } from './components/layout/ErrorBoundary.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HashRouter>
      <ThemeProvider>
        <MotionProvider>
        <I18nProvider>
          <ToastProvider>
            <FavoritesProvider>
              <PlanProvider>
                <ScrollToTop />
                <App />
              </PlanProvider>
            </FavoritesProvider>
          </ToastProvider>
        </I18nProvider>
        </MotionProvider>
      </ThemeProvider>
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
);

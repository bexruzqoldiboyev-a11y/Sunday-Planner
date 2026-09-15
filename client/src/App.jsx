import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Layout } from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Planner from './pages/Planner.jsx';
import Result from './pages/Result.jsx';
import Saved from './pages/Saved.jsx';
import NotFound from './pages/NotFound.jsx';

/** Sahifalar orasidagi yumshoq oʻtish. */
function Page({ children }) {
  return (
    <motion.div
      style={{ transformPerspective: 1400 }}
      initial={{ opacity: 0, y: 34, rotateX: 9, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      exit={{ opacity: 0, y: -22, rotateX: -6, scale: 0.98 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route element={<Layout />}>
        <Route
          index
          element={
            <AnimatePresence mode="wait">
              <Page key="home">
                <Home />
              </Page>
            </AnimatePresence>
          }
        />
        <Route
          path="planner"
          element={
            <Page>
              <Planner />
            </Page>
          }
        />
        <Route
          path="result"
          element={
            <Page>
              <Result />
            </Page>
          }
        />
        <Route
          path="saved"
          element={
            <Page>
              <Saved />
            </Page>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

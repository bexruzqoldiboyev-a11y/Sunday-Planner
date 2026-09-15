import { motion } from 'framer-motion';
import { Button } from '../ui/Button.jsx';

export function CallToAction() {
  return (
    <section className="section">
      <div className="shell shell--wide">
        <motion.div
          className="glass"
          style={{
            padding: 'clamp(1.75rem, 5vw, 3.25rem)',
            display: 'grid',
            gap: 'var(--space-3)',
            justifyItems: 'start',
          }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Yakshanba yaqinlashyapti.</h2>
          <p className="soft">
            Bir necha savolga javob bering — kuningiz soatma-soat tayyor boʻladi.
          </p>
          <Button as="link" to="/planner" size="lg">
            Rejamni tuzish
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

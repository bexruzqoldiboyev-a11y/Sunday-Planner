import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wizard } from '../components/planner/Wizard.jsx';
import { GenerateOverlay } from '../components/planner/GenerateOverlay.jsx';
import { ErrorState } from '../components/ui/States.jsx';
import { usePlan } from '../context/PlanContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function Planner() {
  const { form, updateForm, generate, status, error } = usePlan();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useI18n();
  const [done, setDone] = useState(false);

  const submitting = status === 'loading';

  const handleSubmit = async () => {
    setDone(false);
    try {
      const plan = await generate();
      setDone(true);
      if (plan.offline) {
        toast('Server topilmadi — reja demo rejimda tuzildi', 'info');
      }
      // Oxirgi bosqich koʻrinib turishi uchun kichik pauza.
      setTimeout(() => navigate('/result'), 700);
    } catch (caught) {
      toast(caught.message || 'Reja tuzilmadi', 'error');
    }
  };

  return (
    <section className="planner">
      <div className="shell shell--wide">
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 'var(--space-4)' }}
        >
          <h1 style={{ fontSize: 'var(--step-3)' }}>{t('planner.title')}</h1>
          <p className="soft">{t('planner.lead')}</p>
        </motion.header>

        {status === 'error' && error?.details ? (
          <div className="glass" style={{ padding: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
            <ErrorState
              title={t('planner.checkData')}
              message={error.message}
              details={error.details}
              retryLabel={t('common.retry')}
            />
          </div>
        ) : null}

        <Wizard form={form} update={updateForm} onSubmit={handleSubmit} submitting={submitting} />
      </div>

      <GenerateOverlay open={submitting || done} done={done} />
    </section>
  );
}

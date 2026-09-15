import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../ui/Button.jsx';
import { useI18n } from '../../i18n/index.jsx';
import { toMinutes } from '../../utils/format.js';
import { BUDGET } from '../../data/options.js';
import { StepWhen } from './steps/StepWhen.jsx';
import { StepTime } from './steps/StepTime.jsx';
import { StepBudget } from './steps/StepBudget.jsx';
import { StepCompany } from './steps/StepCompany.jsx';
import { StepInterests } from './steps/StepInterests.jsx';
import { StepMood } from './steps/StepMood.jsx';

const STEPS = [
  { id: 'when', icon: '🗓', label: 'Kun va shahar', title: 'Qachon va qayerda?', Component: StepWhen },
  { id: 'time', icon: '⏱', label: 'Vaqt', title: 'Vaqtingiz qancha?', Component: StepTime },
  { id: 'budget', icon: '💰', label: 'Budjet', title: 'Budjetni belgilaymiz', Component: StepBudget },
  { id: 'company', icon: '🧑‍🤝‍🧑', label: 'Kim bilan', title: 'Kim bilan chiqasiz?', Component: StepCompany },
  { id: 'interests', icon: '✨', label: 'Qiziqishlar', title: 'Nima yoqadi?', Component: StepInterests },
  { id: 'mood', icon: '🎈', label: 'Kayfiyat', title: 'Kun qanday oʻtsin?', Component: StepMood },
];

/** Qadamga tegishli xatolarni qaytaradi (bo'sh obyekt = xato yo'q). */
function validateStep(stepId, form) {
  const errors = {};

  if (stepId === 'time') {
    const start = toMinutes(form.startTime);
    const end = toMinutes(form.endTime);
    if (start === null) errors.startTime = 'Boshlanish vaqtini kiriting.';
    if (end === null) errors.endTime = 'Tugash vaqtini kiriting.';
    if (start !== null && end !== null && end - start < 120) {
      errors.endTime = 'Kamida 2 soatlik vaqt kerak — aks holda reja chiqmaydi.';
    }
  }

  if (stepId === 'budget') {
    if (!form.budget || form.budget < BUDGET.min) {
      errors.budget = `Budjet kamida ${BUDGET.min.toLocaleString('ru-RU')} soʻm boʻlsin.`;
    } else if (form.budget > BUDGET.max) {
      errors.budget = 'Budjet juda katta — kichikroq summa kiriting.';
    }
  }

  if (stepId === 'when' && !form.city) {
    errors.city = 'Shaharni tanlang.';
  }

  return errors;
}

export function Wizard({ form, update, onSubmit, submitting }) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touched, setTouched] = useState(false);

  const step = STEPS[index];
  const errors = useMemo(
    () => (touched ? validateStep(step.id, form) : {}),
    [touched, step.id, form],
  );
  const blocked = Object.keys(validateStep(step.id, form)).length > 0;

  const go = (nextIndex) => {
    if (nextIndex > index && blocked) {
      setTouched(true);
      return;
    }
    setDirection(nextIndex > index ? 1 : -1);
    setTouched(false);
    setIndex(Math.max(0, Math.min(STEPS.length - 1, nextIndex)));
  };

  const last = index === STEPS.length - 1;

  const handleSubmit = () => {
    if (blocked) {
      setTouched(true);
      return;
    }
    onSubmit();
  };

  return (
    <div className="planner__grid">
      <aside className="wizard-rail" aria-label="Qadamlar">
        <div className="wizard-rail__list">
          {STEPS.map((item, itemIndex) => {
            const state = itemIndex === index ? 'current' : itemIndex < index ? 'done' : 'todo';
            return (
              <button
                key={item.id}
                type="button"
                className="wizard-rail__item"
                data-state={state}
                onClick={() => go(itemIndex)}
              >
                <span className="wizard-rail__dot">
                  {state === 'done' ? '✓' : item.icon}
                  {itemIndex < STEPS.length - 1 ? (
                    <span className="wizard-rail__line" aria-hidden="true" />
                  ) : null}
                </span>
                {item.label}
              </button>
            );
          })}
        </div>
      </aside>

      <section className="glass wizard">
        <span className="shine" aria-hidden="true" />
        <div className="wizard__progress" aria-hidden="true">
          <span style={{ width: `${((index + 1) / STEPS.length) * 100}%` }} />
        </div>

        <header className="wizard__head">
          <div className="wizard__count">
            {t('planner.step', { current: index + 1, total: STEPS.length })}
          </div>
          <h2 style={{ fontSize: 'var(--step-2)' }}>{step.title}</h2>
        </header>

        <div className="wizard__body">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={step.id}
              custom={direction}
              style={{ transformPerspective: 1200 }}
              initial={{ opacity: 0, x: direction * 90, rotateY: direction * 14, scale: 0.94 }}
              animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction * -70, rotateY: direction * -10, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <step.Component form={form} update={update} errors={errors} />
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="wizard__foot">
          <Button variant="quiet" onClick={() => go(index - 1)} disabled={index === 0}>
            ← {t('planner.back')}
          </Button>

          {last ? (
            <Button onClick={handleSubmit} disabled={submitting} size="lg">
              {submitting ? 'Tuzilmoqda…' : `${t('planner.generate')} ☀️`}
            </Button>
          ) : (
            <Button onClick={() => go(index + 1)}>{t('planner.next')} →</Button>
          )}
        </footer>
      </section>
    </div>
  );
}

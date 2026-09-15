import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { DEFAULT_FORM } from '../data/options.js';
import { createPlan, swapPlanActivity, fitPlanToBudget } from '../services/plannerService.js';

const PlanContext = createContext(null);

export function PlanProvider({ children }) {
  const [form, setForm] = useLocalStorage('sp.form', DEFAULT_FORM);
  const [plan, setPlan] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [error, setError] = useState(null);
  const [savedPlans, setSavedPlans] = useLocalStorage('sp.plans', []);

  const updateForm = useCallback(
    (patch) => setForm((current) => ({ ...current, ...patch })),
    [setForm],
  );

  const resetForm = useCallback(() => setForm(DEFAULT_FORM), [setForm]);

  const generate = useCallback(
    async (overrides = {}) => {
      const payload = { ...form, ...overrides, seed: Math.floor(Math.random() * 90000) + 1 };
      setStatus('loading');
      setError(null);
      try {
        const result = await createPlan(payload);
        setPlan(result);
        setStatus('ready');
        return result;
      } catch (caught) {
        setError({ message: caught.message, details: caught.details || null });
        setStatus('error');
        throw caught;
      }
    },
    [form],
  );

  const swap = useCallback(
    async (index, placeId) => {
      if (!plan) return null;
      const updated = await swapPlanActivity(plan, index, placeId);
      setPlan(updated);
      return updated;
    },
    [plan],
  );

  const fitBudget = useCallback(async () => {
    if (!plan) return null;
    const updated = await fitPlanToBudget(plan);
    setPlan(updated);
    return updated;
  }, [plan]);

  const savePlan = useCallback(
    (target = plan) => {
      if (!target) return false;
      let added = false;
      setSavedPlans((current) => {
        if (current.some((item) => item.id === target.id)) return current;
        added = true;
        return [{ ...target, savedAt: new Date().toISOString() }, ...current].slice(0, 12);
      });
      return added;
    },
    [plan, setSavedPlans],
  );

  const removeSavedPlan = useCallback(
    (id) => setSavedPlans((current) => current.filter((item) => item.id !== id)),
    [setSavedPlans],
  );

  const openSavedPlan = useCallback((saved) => {
    setPlan(saved);
    setStatus('ready');
  }, []);

  const value = useMemo(
    () => ({
      form,
      updateForm,
      resetForm,
      plan,
      status,
      error,
      generate,
      swap,
      fitBudget,
      savedPlans,
      savePlan,
      removeSavedPlan,
      openSavedPlan,
    }),
    [
      form,
      updateForm,
      resetForm,
      plan,
      status,
      error,
      generate,
      swap,
      fitBudget,
      savedPlans,
      savePlan,
      removeSavedPlan,
      openSavedPlan,
    ],
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (!context) throw new Error('usePlan faqat PlanProvider ichida ishlaydi');
  return context;
}

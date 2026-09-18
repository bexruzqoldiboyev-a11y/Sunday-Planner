import { EmptyState } from '../components/ui/States.jsx';
import { Button } from '../components/ui/Button.jsx';
import { useI18n } from '../i18n/index.jsx';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <section className="section">
      <div className="shell">
        <EmptyState
          icon="🧭"
          title={t('notFound.title')}
          message={t('notFound.text')}
          action={
            <Button as="link" to="/planner">
              {t('hero.cta')}
            </Button>
          }
        />
      </div>
    </section>
  );
}

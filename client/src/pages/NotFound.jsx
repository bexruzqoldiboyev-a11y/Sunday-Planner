import { EmptyState } from '../components/ui/States.jsx';
import { Button } from '../components/ui/Button.jsx';

export default function NotFound() {
  return (
    <section className="section">
      <div className="shell">
        <EmptyState
          icon="🧭"
          title="Bunday sahifa yoʻq"
          message="Manzil notoʻgʻri boʻlsa kerak. Bosh sahifadan boshlang yoki darhol reja tuzing."
          action={
            <Button as="link" to="/planner">
              Rejamni tuzish
            </Button>
          }
        />
      </div>
    </section>
  );
}

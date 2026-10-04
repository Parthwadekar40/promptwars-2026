import { Button } from '../components/ui';
import { navigate } from '../lib/router';

/** Designed 404 — unknown hash routes never dead-end. */
export function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow">404</p>
      <h1 className="t-h2 mt-4">This page doesn't exist.</h1>
      <p className="mt-3 text-ink-muted">The link may be old — everything you need is one step away.</p>
      <Button type="button" className="mt-6" onClick={() => navigate('/')}>
        Back home
      </Button>
    </section>
  );
}

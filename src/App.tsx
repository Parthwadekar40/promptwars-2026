import { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';
import { AppShell } from './components/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { NotFound } from './pages/NotFound';
import { useRoute } from './lib/router';

// Heavy views load on demand — the AI SDK never touches the landing page's first paint.
const Think = lazy(() => import('./pages/Think').then((m) => ({ default: m.Think })));
const Journal = lazy(() => import('./pages/Journal').then((m) => ({ default: m.Journal })));
const Connect = lazy(() => import('./pages/Connect').then((m) => ({ default: m.Connect })));
const Privacy = lazy(() => import('./pages/Privacy').then((m) => ({ default: m.Privacy })));

const ROUTES: Record<string, (query: string) => ReactNode> = {
  '/': () => <Landing />,
  '/think': (q) => <Think autoSample={q === 'sample'} />,
  '/journal': () => <Journal />,
  '/signin': () => <Auth mode="signin" />,
  '/signup': () => <Auth mode="signup" />,
  '/connect': () => <Connect />,
  '/privacy': () => <Privacy />,
};

export default function App() {
  const [path, query = ''] = useRoute().split('?');
  const page = (ROUTES[path] ?? (() => <NotFound />))(query);
  return (
    <ErrorBoundary>
      <AppShell>
        <Suspense
          fallback={
            <p role="status" className="eyebrow py-32 text-center">
              Loading…
            </p>
          }
        >
          {page}
        </Suspense>
      </AppShell>
    </ErrorBoundary>
  );
}

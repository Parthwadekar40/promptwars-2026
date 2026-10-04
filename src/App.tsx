import { AppShell } from './components/AppShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Connect } from './pages/Connect';
import { NotFound } from './pages/NotFound';
import { useRoute } from './lib/router';

export default function App() {
  const route = useRoute();
  return (
    <ErrorBoundary>
      <AppShell>
        {route === '/signin' ? (
          <Auth mode="signin" />
        ) : route === '/signup' ? (
          <Auth mode="signup" />
        ) : route === '/connect' ? (
          <Connect />
        ) : route === '/' ? (
          <Landing />
        ) : (
          <NotFound />
        )}
      </AppShell>
    </ErrorBoundary>
  );
}

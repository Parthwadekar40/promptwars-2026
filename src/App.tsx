import { AppShell } from './components/AppShell';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Connect } from './pages/Connect';
import { useRoute } from './lib/router';

export default function App() {
  const route = useRoute();
  return (
    <AppShell>
      {route === '/signin' ? (
        <Auth mode="signin" />
      ) : route === '/signup' ? (
        <Auth mode="signup" />
      ) : route === '/connect' ? (
        <Connect />
      ) : (
        <Landing />
      )}
    </AppShell>
  );
}

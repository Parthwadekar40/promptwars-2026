import { AppShell } from './components/AppShell';
import { Landing } from './pages/Landing';
import { SignIn } from './pages/SignIn';
import { Connect } from './pages/Connect';
import { useRoute } from './lib/router';

export default function App() {
  const route = useRoute();
  return (
    <AppShell>
      {route === '/signin' ? <SignIn /> : route === '/connect' ? <Connect /> : <Landing />}
    </AppShell>
  );
}

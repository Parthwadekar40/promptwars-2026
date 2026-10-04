import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { navigate, useRoute } from '../lib/router';
import { SiteFooter } from './shell/SiteFooter';
import { SiteHeader } from './shell/SiteHeader';
import { DEFAULT_TITLE, NAV, TITLES } from './shell/nav';
import { clearProfile, useProfile } from '../lib/auth';
import { hasSession, refreshSession, signOut } from '../lib/db';




/** App shell — hairline header, accessible nav (hamburger on mobile), quiet footer, page-wide gradient follow. */
export function AppShell({ children }: { children: ReactNode }) {
  const route = useRoute().split('?')[0];
  const profile = useProfile();
  const links = NAV.filter((i) => !(profile && i.to === '/signin'));

  const logout = () => {
    signOut();
    clearProfile();
    navigate('/');
  };

  // keep the Firebase session fresh across reloads (also pulls refreshSession into the bundle)
  useEffect(() => {
    if (hasSession()) void refreshSession();
  }, []);

  useEffect(() => {
    const page = TITLES[route];
    document.title = page ? `${page} · Penumbra` : DEFAULT_TITLE;
  }, [route]);

  return (
    <div
      className="flex min-h-dvh flex-col"
      onMouseMove={(e) => {
        const el = e.currentTarget;
        el.style.setProperty('--mx', `${e.clientX}px`);
        el.style.setProperty('--my', `${e.clientY}px`);
      }}
    >
      {/* the brand gradient from the top, following the cursor through the whole page */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] transition-opacity"
        style={{
          background:
            'radial-gradient(680px circle at var(--mx, 50%) var(--my, 12%), rgba(109,95,247,0.16), rgba(167,139,250,0.10) 32%, rgba(110,231,183,0.07) 55%, transparent 72%)',
        }}
      />


      <SiteHeader route={route} links={links} profile={profile} onLogout={logout} />

      <main id="main" tabIndex={-1} className="relative z-[2] flex-1 outline-none">
        {children}
      </main>

      <SiteFooter links={links} />

    </div>
  );
}

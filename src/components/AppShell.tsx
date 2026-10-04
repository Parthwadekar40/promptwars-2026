import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { navigate, useRoute } from '../lib/router';
import { Button } from './ui';
import { clearProfile, useProfile } from '../lib/auth';
import { hasSession, refreshSession, signOut } from '../lib/db';
import { whatsappLink } from '../lib/mail';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/think', label: 'Think' },
  { to: '/journal', label: 'Journal' },
  { to: '/signin', label: 'Sign in' },
  { to: '/connect', label: 'Settings' },
];

const TITLES: Record<string, string> = {
  '/think': 'Think',
  '/journal': 'Journal',
  '/signin': 'Sign in',
  '/signup': 'Create account',
  '/connect': 'Settings',
  '/privacy': 'Privacy',
};
const DEFAULT_TITLE = 'Penumbra — a thinking companion for better decisions';

const GITHUB = 'https://github.com/Parthwadekar40';
const LINKEDIN = 'https://www.linkedin.com/in/parth-wadekar-18027728b';
const INSTAGRAM = 'https://www.instagram.com/parthwadekar16';
const REPO = 'https://github.com/Parthwadekar40/promptwars-2026';

/** The orb mark — a sphere in its own light. */
function Brand({ testId }: { testId?: string }) {
  return (
    <a href="#/" className="flex items-center gap-2.5 font-display text-[17px] font-semibold tracking-tight text-ink">
      <span
        aria-hidden
        className="size-[22px] rounded-full bg-[radial-gradient(circle_at_32%_28%,#fff,var(--color-brand-300)_45%,var(--color-brand-600))] shadow-[0_3px_8px_-2px_rgba(91,75,245,0.5)]"
      />
      <span data-testid={testId}>Penumbra</span>
    </a>
  );
}

/** App shell — hairline header, accessible nav (hamburger on mobile), quiet footer, page-wide gradient follow. */
export function AppShell({ children }: { children: ReactNode }) {
  const route = useRoute().split('?')[0];
  const [open, setOpen] = useState(false);
  const profile = useProfile();
  const links = NAV.filter((i) => !(profile && i.to === '/signin'));

  const logout = () => {
    signOut();
    clearProfile();
    setOpen(false);
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
      <a
        href="#/"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[10px] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      {/* the brand gradient from the top, following the cursor through the whole page */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] transition-opacity"
        style={{
          background:
            'radial-gradient(680px circle at var(--mx, 50%) var(--my, 12%), rgba(109,95,247,0.16), rgba(167,139,250,0.10) 32%, rgba(110,231,183,0.07) 55%, transparent 72%)',
        }}
      />

      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-xl">
        <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <Brand testId="brand" />

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((item) => (
              <li key={item.to}>
                <a
                  href={`#${item.to}`}
                  aria-current={route === item.to ? 'page' : undefined}
                  className={`rounded-[8px] px-3 py-2 text-[14px] transition-colors hover:bg-ink/[0.05] ${
                    route === item.to ? 'font-medium text-ink' : 'text-ink-muted'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            {profile ? (
              <li className="flex items-center gap-2.5">
                <span className="px-2 text-[14px] font-medium text-ink">{profile.name}</span>
                <Button type="button" variant="ghost" onClick={logout} className="!px-4 !py-2 !text-[14px]">
                  Sign out
                </Button>
              </li>
            ) : (
              <li>
                <Button type="button" onClick={() => navigate('/think')} className="!px-4 !py-2 !text-[14px]">
                  Start thinking
                </Button>
              </li>
            )}
          </ul>

          {/* mobile: hamburger */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-10 flex-col items-center justify-center gap-[5px] rounded-[8px] hover:bg-ink/[0.05] md:hidden"
          >
            <span className={`h-[2px] w-5 rounded-full bg-ink transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`h-[2px] w-5 rounded-full bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-[2px] w-5 rounded-full bg-ink transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </button>
        </nav>

        {open && (
          <ul className="border-t border-line px-6 pb-4 pt-2 md:hidden">
            {links.map((item) => (
              <li key={item.to}>
                <a
                  href={`#${item.to}`}
                  onClick={() => setOpen(false)}
                  aria-current={route === item.to ? 'page' : undefined}
                  className={`block rounded-[8px] px-3 py-2.5 text-[15px] ${route === item.to ? 'font-medium text-ink' : 'text-ink-muted'}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              {profile ? (
                <button
                  type="button"
                  onClick={logout}
                  className="block w-full rounded-[8px] px-3 py-2.5 text-left text-[15px] text-ink-muted"
                >
                  Sign out ({profile.name})
                </button>
              ) : (
                <a
                  href="#/think"
                  onClick={() => setOpen(false)}
                  className="block rounded-[8px] px-3 py-2.5 text-[15px] font-medium text-ink"
                >
                  Start thinking
                </a>
              )}
            </li>
          </ul>
        )}
      </header>

      <main id="main" tabIndex={-1} className="relative z-[2] flex-1 outline-none">
        {children}
      </main>

      <footer className="relative z-[2] border-t border-line">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Brand />
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink-muted">
                A thinking companion. It shows you what you might be missing — and leaves the decision to you.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { label: 'GitHub ↗', href: GITHUB },
                  { label: 'LinkedIn ↗', href: LINKEDIN },
                  { label: 'Instagram ↗', href: INSTAGRAM },
                  { label: 'WhatsApp ↗', href: whatsappLink('919975181905', 'Hi Parth!') },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/25 hover:bg-ink/[0.04]"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <nav aria-label="Explore">
              <p className="eyebrow">EXPLORE</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-ink-muted">
                {links.map((i) => (
                  <li key={i.to}><a className="transition-colors hover:text-ink" href={`#${i.to}`}>{i.label}</a></li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Trust">
              <p className="eyebrow">TRUST</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-ink-muted">
                <li><a className="transition-colors hover:text-ink" href="#/privacy">Privacy</a></li>
                <li><a className="transition-colors hover:text-ink" href={REPO} target="_blank" rel="noopener noreferrer">Source code ↗</a></li>
              </ul>
            </nav>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-[13px] text-ink-muted md:flex-row md:items-center">
            <p>
              © 2026{' '}
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink transition-colors hover:text-brand-600"
              >
                Parth Wadekar
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

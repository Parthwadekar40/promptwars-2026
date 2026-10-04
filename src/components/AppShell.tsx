import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { navigate, useRoute } from '../lib/router';
import { Button } from './ui';
import { clearProfile, useProfile } from '../lib/auth';
import { hasSession, refreshSession, signOut } from '../lib/db';
import { whatsappLink } from '../lib/mail';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/signin', label: 'Sign in' },
  { to: '/connect', label: 'Settings' },
];

const GITHUB = 'https://github.com/Parthwadekar40';

/** App shell — hairline header, accessible nav (hamburger on mobile), quiet footer, page-wide gradient follow. */
export function AppShell({ children }: { children: ReactNode }) {
  const route = useRoute();
  const [open, setOpen] = useState(false);
  const profile = useProfile();

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

      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-xl">
        <nav aria-label="Main" className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <a href="#/" className="flex items-center gap-2.5 font-display text-[17px] font-semibold tracking-tight text-ink">
            <span aria-hidden className="size-[22px] rounded-[6px] bg-gradient-to-br from-brand-500 via-brand-300 to-mint-300" />
            <span data-testid="brand">PromptWars App</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
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
                <Button type="button" onClick={() => navigate('/signup')} className="!px-4 !py-2 !text-[14px]">
                  Get started
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
            {NAV.map((item) => (
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
                  href="#/signup"
                  onClick={() => setOpen(false)}
                  className="block rounded-[8px] px-3 py-2.5 text-[15px] font-medium text-ink"
                >
                  Get started
                </a>
              )}
            </li>
          </ul>
        )}
      </header>

      <main id="main" className="relative z-[2] flex-1">
        {children}
      </main>

      <footer className="relative z-[2] border-t border-line">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <a href="#/" className="flex items-center gap-2.5 font-display text-[17px] font-semibold tracking-tight text-ink">
                <span aria-hidden className="size-[22px] rounded-[6px] bg-gradient-to-br from-brand-500 via-brand-300 to-mint-300" />
                <span>PromptWars App</span>
              </a>
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink-muted">
                An intelligent workspace that turns your ideas into finished work — fast, private, and a genuine
                pleasure to use.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/25 hover:bg-ink/[0.04]"
                >
                  GitHub ↗
                </a>
                <a
                  href={whatsappLink('919975181905', 'Hi Parth!')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/25 hover:bg-ink/[0.04]"
                >
                  WhatsApp ↗
                </a>
              </div>
            </div>

            <nav aria-label="Explore">
              <p className="eyebrow">EXPLORE</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-ink-muted">
                <li><a className="transition-colors hover:text-ink" href="#/">Home</a></li>
                <li><a className="transition-colors hover:text-ink" href="#/signin">Sign in</a></li>
                <li><a className="transition-colors hover:text-ink" href="#/connect">Settings</a></li>
              </ul>
            </nav>

            <nav aria-label="Legal">
              <p className="eyebrow">LEGAL</p>
              <ul className="mt-4 space-y-2.5 text-[13px] text-ink-muted">
                <li><a className="transition-colors hover:text-ink" href="#/">Privacy</a></li>
                <li><a className="transition-colors hover:text-ink" href="#/">Terms</a></li>
                <li><a className="transition-colors hover:text-ink" href="#/connect">Contact</a></li>
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

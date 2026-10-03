import { useState } from 'react';
import type { ReactNode } from 'react';
import { navigate, useRoute } from '../lib/router';
import { Button } from './ui';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/signin', label: 'Sign in' },
  { to: '/connect', label: 'Settings' },
];

/** App shell — hairline header, accessible nav (hamburger on mobile), quiet footer. */
export function AppShell({ children }: { children: ReactNode }) {
  const route = useRoute();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col">
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
            <li>
              <Button type="button" onClick={() => navigate('/signin')} className="!px-4 !py-2 !text-[14px]">
                Get started
              </Button>
            </li>
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
          </ul>
        )}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-6 py-8 text-[13px] text-ink-muted md:flex-row md:items-center">
          <p>© 2026 · All rights reserved</p>
          <nav aria-label="Footer" className="flex items-center gap-6">
            <a className="transition-colors hover:text-ink" href="#/">Privacy</a>
            <a className="transition-colors hover:text-ink" href="#/">Terms</a>
            <a className="transition-colors hover:text-ink" href="#/connect">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

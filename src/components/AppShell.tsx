import type { ReactNode } from 'react';
import { navigate, useRoute } from '../lib/router';
import { Button } from './ui';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/signin', label: 'Sign in' },
  { to: '/connect', label: 'Settings' },
];

/** App shell: glass header, accessible nav, footer with Google service credits. */
export function AppShell({ children }: { children: ReactNode }) {
  const route = useRoute();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-white/40 bg-white/50 backdrop-blur-xl">
        <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <a href="#/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink">
            <span aria-hidden className="size-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 shadow-md" />
            <span data-testid="brand">PromptWars App</span>
          </a>
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <a
                  href={`#${item.to}`}
                  aria-current={route === item.to ? 'page' : undefined}
                  className={`rounded-lg px-3 py-2 text-sm transition hover:bg-white/60 ${
                    route === item.to ? 'font-semibold text-brand-700' : 'text-ink-muted'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Button type="button" onClick={() => navigate('/signin')} className="!px-4 !py-2 text-sm">
                Get started
              </Button>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="border-t border-white/40 bg-white/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-ink-muted md:flex-row">
          <p>
            Built for <span className="font-semibold text-ink">PromptWars 2026</span> · Google Office, Gurugram
          </p>
          <p>
            Powered by Google <span className="text-brand-700">Gemini</span> · Firebase · Google Fonts
          </p>
        </div>
      </footer>
    </div>
  );
}

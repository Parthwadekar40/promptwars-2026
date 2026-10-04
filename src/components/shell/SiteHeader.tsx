import { useState } from 'react';
import { navigate } from '../../lib/router';
import type { Profile } from '../../lib/auth';
import { Button } from '../ui';
import { Brand } from './Brand';

type Link = { to: string; label: string };

/** Sticky header — skip link, main navigation, session actions; hamburger menu below md. */
export function SiteHeader({ route, links, profile, onLogout }: { route: string; links: Link[]; profile: Profile | null; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const logout = () => {
    setOpen(false);
    onLogout();
  };

  return (
  <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-xl">
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
  );
}

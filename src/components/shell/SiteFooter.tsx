import { whatsappLink } from '../../lib/mail';
import { Brand } from './Brand';
import { GITHUB, INSTAGRAM, LINKEDIN, REPO } from './nav';

type Link = { to: string; label: string };

export function SiteFooter({ links }: { links: Link[] }) {
  return (
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
  );
}

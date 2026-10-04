import type { ReactNode, RefObject } from 'react';
import { useId } from 'react';
import { LIMITS } from '../../lib/analyze';
import type { Analysis, Item } from '../../lib/analyze';
import { markKey } from '../../hooks/useThinking';
import type { Kind } from '../../hooks/useThinking';
import { Textarea } from '../ui';
import { Reveal } from '../Reveal';
import { SpotlightCard } from './SpotlightCard';

type Props = {
  a: Analysis;
  removed: number;
  sample: boolean;
  marks: Record<string, boolean>;
  onMark: (key: string) => void;
  answers: string[];
  onAnswer: (i: number, value: string) => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

function Check({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={`Examined: ${label}`}
      onClick={onClick}
      className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border transition-colors ${
        on ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink/30 bg-white/60 hover:border-ink/60'
      }`}
    >
      <svg viewBox="0 0 16 16" aria-hidden className={`size-3.5 ${on ? 'opacity-100' : 'opacity-0'}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 8.5l3 3 6-7" />
      </svg>
    </button>
  );
}

function Lens({ n, eyebrow, title, children }: { n: string; eyebrow: string; title: string; children: ReactNode }) {
  const id = useId();
  return (
    <Reveal className="mt-16">
      <section aria-labelledby={id}>
        <p className="eyebrow">
          {n} · {eyebrow}
        </p>
        <h2 id={id} className="mt-2 font-display text-[clamp(1.45rem,2.6vw,1.9rem)] font-semibold tracking-tight text-ink">
          {title}
        </h2>
        <div className="mt-5">{children}</div>
      </section>
    </Reveal>
  );
}

function Rows({ kind, items, hintLabel, marks, onMark }: { kind: Kind; items: Item[]; hintLabel: string; marks: Record<string, boolean>; onMark: (k: string) => void }) {
  return (
    <ul className="hairline divide-y divide-line overflow-hidden rounded-[14px] bg-white/55">
      {items.map((it, i) => (
        <li key={markKey(kind, i)} className="flex gap-4 p-5">
          <Check on={!!marks[markKey(kind, i)]} label={it.text} onClick={() => onMark(markKey(kind, i))} />
          <div>
            <p className="font-medium leading-snug text-ink">{it.text}</p>
            {it.hint && (
              <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em]">{hintLabel}</span> {it.hint}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Step 2 + 3 — everything outside the person's light, each piece something they can examine. */
export function Results({ a, removed, sample, marks, onMark, answers, onAnswer, headingRef }: Props) {
  const guard = removed
    ? `Neutrality guard removed ${removed} line${removed > 1 ? 's' : ''} that read like advice.`
    : 'Neutrality check passed — nothing here tells you what to do.';
  return (
    <div>
      {a.care && (
        <aside role="note" className="mb-8 rounded-[14px] border border-mint-300/70 bg-mint-300/15 p-5">
          <p className="eyebrow !text-ink">A note before anything else</p>
          <p className="mt-2 leading-relaxed text-ink">{a.care}</p>
          <p className="mt-2 text-[14px] text-ink-muted">In India, Tele-MANAS offers free, confidential support 24×7 on 14416.</p>
        </aside>
      )}

      <p className="eyebrow">What is outside the light</p>
      <h1 ref={headingRef} tabIndex={-1} className="t-h2 mt-3 font-display font-semibold tracking-tight text-ink outline-none">
        {a.title}
      </h1>
      <p className="mt-3 text-[13px] text-ink-muted">
        {sample && <strong className="font-medium text-ink">Pre-written sample · </strong>}
        {guard}
      </p>

      <Reveal delay={0.15} className="mt-8">
        <SpotlightCard heard={a.heard} noticedFirst={a.noticedFirst} outside={a.outside} />
      </Reveal>

      {a.assumptions.length > 0 && (
        <Lens n="01" eyebrow="Underneath" title="Assumptions you did not state">
          <Rows kind="a" items={a.assumptions} hintLabel="Check it" marks={marks} onMark={onMark} />
        </Lens>
      )}
      {a.conflicts.length > 0 && (
        <Lens n="02" eyebrow="Within your reasoning" title="Where your own reasoning pulls against itself">
          <Rows kind="c" items={a.conflicts} hintLabel="To resolve" marks={marks} onMark={onMark} />
        </Lens>
      )}
      {a.risks.length > 0 && (
        <Lens n="03" eyebrow="In the shadows" title="Risks worth a second look">
          <Rows kind="r" items={a.risks} hintLabel="Early sign" marks={marks} onMark={onMark} />
        </Lens>
      )}
      {a.missing.length > 0 && (
        <Lens n="04" eyebrow="Overlooked" title="Important factors you did not mention">
          <Rows kind="m" items={a.missing} hintLabel="Why it matters" marks={marks} onMark={onMark} />
        </Lens>
      )}
      {a.otherSide && (
        <Lens n="05" eyebrow="The other side" title="The strongest case for what you are not leaning toward">
          <blockquote className="rounded-[14px] border-l-2 border-brand-600 bg-white/55 p-6 font-serif text-[clamp(1.1rem,1.9vw,1.35rem)] italic leading-relaxed text-ink">
            {a.otherSide}
          </blockquote>
        </Lens>
      )}
      {a.traps.length > 0 && (
        <Lens n="06" eyebrow="Thinking traps" title="Patterns that might be at play">
          <ul className="grid gap-3 sm:grid-cols-2">
            {a.traps.map((t) => (
              <li key={t.text} className="hairline rounded-[14px] bg-white/55 p-5">
                <p className="font-display font-semibold text-ink">{t.text}</p>
                {t.hint && <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{t.hint}</p>}
              </li>
            ))}
          </ul>
        </Lens>
      )}
      {a.questions.length > 0 && (
        <Lens n="07" eyebrow="Questions" title="Questions worth sitting with">
          <ol className="space-y-4">
            {a.questions.map((q, i) => (
              <li key={q} className="hairline rounded-[14px] bg-white/55 p-5">
                <label htmlFor={`q${i}`} className="flex gap-3 font-display text-[17px] font-medium leading-snug text-ink">
                  <span className="eyebrow pt-1">{String(i + 1).padStart(2, '0')}</span>
                  {q}
                </label>
                <Textarea
                  id={`q${i}`}
                  rows={2}
                  maxLength={LIMITS.answer}
                  value={answers[i] ?? ''}
                  onChange={(e) => onAnswer(i, e.target.value)}
                  placeholder="Your thoughts — a sentence or two is plenty."
                  className="mt-3"
                />
              </li>
            ))}
          </ol>
        </Lens>
      )}
    </div>
  );
}

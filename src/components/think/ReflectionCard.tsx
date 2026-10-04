import { GlassCard } from '../ui';
import type { Reflection } from '../../lib/analyze';

/** Pass 2 — what the person's own answers changed, and where they pull against each other. */
export function ReflectionCard({ r }: { r: Reflection }) {
  return (
    <GlassCard className="!p-7 md:!p-9">
      <p className="eyebrow">Reflection · what your answers changed</p>
      {r.shifted.length > 0 && (
        <ul className="mt-5 space-y-3 leading-relaxed text-ink">
          {r.shifted.map((s) => (
            <li key={s} className="flex gap-3">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
              {s}
            </li>
          ))}
        </ul>
      )}
      {r.tension && (
        <div className="mt-6 rounded-[12px] border-l-2 border-brand-600 bg-brand-50/80 p-4">
          <p className="eyebrow !text-brand-700">A tension worth noticing</p>
          <p className="mt-1.5 leading-relaxed text-ink">{r.tension}</p>
        </div>
      )}
      {r.stillOpen.length > 0 && (
        <>
          <p className="eyebrow mt-6">Still unexamined</p>
          <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-muted">
            {r.stillOpen.map((s) => (
              <li key={s}>— {s}</li>
            ))}
          </ul>
        </>
      )}
      {r.oneQuestion && (
        <p className="mt-7 font-serif text-[clamp(1.3rem,2.4vw,1.7rem)] italic leading-snug text-ink">
          {r.oneQuestion}
        </p>
      )}
    </GlassCard>
  );
}

/** What you noticed first (in the light) beside what sits outside it (in the shadow) — fused by a soft penumbra. */
export function SpotlightCard({
  heard,
  noticedFirst,
  outside,
}: {
  heard: string;
  noticedFirst: string;
  outside: string;
}) {
  return (
    <figure className="hairline overflow-hidden rounded-[18px] shadow-[0_1px_2px_rgba(23,20,18,0.05),0_24px_48px_-24px_rgba(23,20,18,0.25)]">
      {heard && (
        <figcaption className="bg-white/70 px-7 py-4 text-[14px] leading-relaxed text-ink-muted md:px-9">
          <span className="eyebrow mr-2">As I heard it</span>
          {heard}
        </figcaption>
      )}
      <div className="grid md:grid-cols-2">
        <div className="relative bg-white/70 p-7 pb-16 md:p-9 md:pb-9 md:pr-16">
          <p className="eyebrow">In the light — what you noticed first</p>
          <p className="mt-3 font-serif text-[clamp(1.2rem,2.1vw,1.5rem)] italic leading-snug text-ink">
            {noticedFirst}
          </p>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-ink md:inset-x-auto md:inset-y-0 md:right-0 md:h-auto md:w-20 md:bg-gradient-to-r"
          />
        </div>
        <div className="bg-ink p-7 md:p-9 md:pl-12">
          <p className="eyebrow !text-paper/70">Outside the light</p>
          <p className="mt-3 font-serif text-[clamp(1.2rem,2.1vw,1.5rem)] italic leading-snug text-paper">{outside}</p>
        </div>
      </div>
    </figure>
  );
}

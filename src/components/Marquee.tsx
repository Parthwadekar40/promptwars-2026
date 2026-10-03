/** Infinite scrolling mono strip — brutalist scale, seamless (content duplicated ×2). */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div aria-hidden className="overflow-hidden border-y border-line bg-white/30 py-5">
      <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="eyebrow !text-[13px] !tracking-[0.22em] text-ink/70">{t}</span>
            <img
              src={`${import.meta.env.BASE_URL}assets/img/glass-bar-alpha.webp`}
              alt=""
              className="h-2.5 w-16 object-contain opacity-80"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

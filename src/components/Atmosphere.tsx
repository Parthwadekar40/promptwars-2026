const SPARKS = [
  { left: '12%', top: '22%', delay: '0s', size: 5 },
  { left: '28%', top: '64%', delay: '1.8s', size: 4 },
  { left: '44%', top: '30%', delay: '3.4s', size: 6 },
  { left: '58%', top: '72%', delay: '0.9s', size: 4 },
  { left: '71%', top: '18%', delay: '2.6s', size: 5 },
  { left: '83%', top: '55%', delay: '4.2s', size: 4 },
  { left: '36%', top: '82%', delay: '5.1s', size: 5 },
  { left: '90%', top: '34%', delay: '1.2s', size: 6 },
  { left: '6%', top: '48%', delay: '3.8s', size: 4 },
  { left: '52%', top: '12%', delay: '5.6s', size: 5 },
];

/** Code-generated animated background: drifting aurora mesh + slow grid + rising sparks. */
export function Atmosphere({ dark = false }: { dark?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className={`animate-aurora-a absolute -top-40 left-[18%] size-[36rem] rounded-full blur-[110px] ${
          dark ? 'bg-brand-400/25' : 'bg-brand-200/45'
        }`}
      />
      <div
        className={`animate-aurora-b absolute -right-24 top-24 size-[30rem] rounded-full blur-[110px] ${
          dark ? 'bg-[#e879f9]/15' : 'bg-mint-300/35'
        }`}
      />
      <div
        className={`animate-aurora-c absolute right-1/3 top-72 size-[24rem] rounded-full blur-[110px] ${
          dark ? 'bg-fuchsia-400/15' : 'bg-peach-300/35'
        }`}
      />
      <div
        className="animate-grid absolute inset-0 opacity-50"
        style={{
          backgroundImage: `linear-gradient(${dark ? 'rgba(255,255,255,0.05)' : 'var(--color-line)'} 1px, transparent 1px), linear-gradient(90deg, ${
            dark ? 'rgba(255,255,255,0.05)' : 'var(--color-line)'
          } 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 100% 70% at 50% 0%, black, transparent)',
        }}
      />
      {SPARKS.map((s) => (
        <span
          key={s.left + s.top}
          className={`animate-sparkle absolute rounded-full ${dark ? 'bg-white/70' : 'bg-brand-300/70'}`}
          style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}
    </div>
  );
}

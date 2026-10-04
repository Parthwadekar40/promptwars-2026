import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Thoughts that sit just outside our attention. x/y in %, s = relative size. */
const THOUGHTS = [
  { t: 'an assumption', x: 5, y: 12, s: 1.05 },
  { t: 'sunk cost', x: 68, y: 8, s: 1.35 },
  { t: 'who is missing?', x: 34, y: 24, s: 1.7 },
  { t: 'second-order effects', x: 60, y: 40, s: 1.15 },
  { t: 'the deadline', x: 8, y: 46, s: 1.45 },
  { t: 'what if I am wrong?', x: 38, y: 58, s: 1.9 },
  { t: 'reversibility', x: 74, y: 66, s: 1.25 },
  { t: 'a year from now', x: 6, y: 76, s: 1.55 },
  { t: 'the other side', x: 52, y: 84, s: 1.3 },
  { t: 'the question I never asked', x: 16, y: 92, s: 1.1 },
  { t: 'anchoring', x: 82, y: 90, s: 1.05 },
];

function Layer({ className }: { className: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {THOUGHTS.map((w, i) => (
        <span
          key={w.t}
          className={`absolute whitespace-nowrap ${i % 3 === 1 ? 'font-serif italic' : 'font-display font-semibold tracking-tight'}`}
          style={{
            left: `min(${w.x}%, calc(100% - 9rem))`,
            top: `${w.y}%`,
            transform: 'translateY(-50%)',
            fontSize: `clamp(0.9rem, ${(w.s * 1.7).toFixed(2)}vw, ${(w.s * 1.6).toFixed(2)}rem)`,
          }}
        >
          {w.t}
        </span>
      ))}
    </div>
  );
}

/**
 * A dark field of half-hidden thoughts. A soft light follows the pointer — or drifts by itself —
 * and reveals them: the blind spot, made literal. Motion-safe, pauses off-screen.
 */
export function Spotlight({ className = 'relative h-[clamp(280px,40vh,400px)]' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const aim = (x: number, y: number) => {
      el.style.setProperty('--sx', `${x}px`);
      el.style.setProperty('--sy', `${y}px`);
    };
    if (reduce) {
      aim(el.clientWidth / 2, el.clientHeight / 2);
      return;
    }
    let hovering = false;
    let visible = true;
    let raf = 0;
    const t0 = performance.now();
    const drift = (now: number) => {
      if (!hovering && visible) {
        const s = (now - t0) / 1000;
        aim(el.clientWidth * (0.5 + 0.34 * Math.sin(s * 0.42)), el.clientHeight * (0.5 + 0.32 * Math.sin(s * 0.67 + 1)));
      }
      raf = requestAnimationFrame(drift);
    };
    raf = requestAnimationFrame(drift);
    const move = (e: PointerEvent) => {
      hovering = true;
      const r = el.getBoundingClientRect();
      aim(e.clientX - r.left, e.clientY - r.top);
    };
    const leave = () => {
      hovering = false;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [reduce]);

  const mask = 'radial-gradient(210px circle at var(--sx, 50%) var(--sy, 50%), #000 0%, rgba(0,0,0,0.55) 45%, transparent 100%)';
  return (
    <div ref={ref} className={`touch-pan-y overflow-hidden ${className}`}>
      <Layer className="text-white/[0.13]" />
      <div className="absolute inset-0" style={{ maskImage: mask, WebkitMaskImage: mask }}>
        <Layer className="text-white" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(260px circle at var(--sx, 50%) var(--sy, 50%), rgba(255,255,255,0.09), transparent 70%)' }}
      />
    </div>
  );
}

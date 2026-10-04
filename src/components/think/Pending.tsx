import { useEffect, useState } from 'react';

const STEPS = [
  'Reading what you wrote…',
  'Testing the assumptions…',
  'Listening for conflicts in your reasoning…',
  'Finding what you overlooked…',
  'Writing questions for you…',
];

/** Loading state — a lens held over your decision, with honest progress copy. */
export function Pending() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % STEPS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <div role="status" aria-live="polite" className="flex min-h-[52vh] flex-col items-center justify-center gap-2 py-10 text-center">
      <img
        src={`${import.meta.env.BASE_URL}assets/img/lens.webp`}
        alt=""
        aria-hidden
        width="720"
        height="720"
        className="animate-float w-[min(320px,70vw)]"
        style={{ '--tilt': '-2deg' } as React.CSSProperties}
      />
      <p className="eyebrow">{STEPS[i]}</p>
    </div>
  );
}

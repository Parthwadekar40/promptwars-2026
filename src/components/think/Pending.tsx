import { useEffect, useState } from 'react';

const STEPS = [
  'Reading what you wrote…',
  'Testing the assumptions…',
  'Looking for who is missing…',
  'Finding the other side…',
  'Writing questions for you…',
];

/** Loading state — a sphere breathing in its own penumbra, with honest progress copy. */
export function Pending() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % STEPS.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-8 py-24 text-center">
      <span aria-hidden className="pen-orb" />
      <p className="eyebrow">{STEPS[i]}</p>
    </div>
  );
}

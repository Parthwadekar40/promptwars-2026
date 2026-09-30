import { motion, useReducedMotion } from 'framer-motion';

export default function App() {
  const reduce = useReducedMotion();
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <motion.h1
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="font-display text-4xl font-bold tracking-tight"
      >
        Ready to build
      </motion.h1>
      <p className="max-w-md text-ink-muted">
        Verified stack: Vite + React + TypeScript + Tailwind v4 + Framer Motion + Vitest.
      </p>
      <button
        type="button"
        className="rounded-xl bg-brand-600 px-5 py-2.5 font-medium text-white transition hover:bg-brand-500"
      >
        Get started
      </button>
    </main>
  );
}

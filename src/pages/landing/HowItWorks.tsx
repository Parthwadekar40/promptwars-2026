import { motion, useReducedMotion } from 'framer-motion';
import { Badge } from '../../components/ui';
import { EASE } from './shared';

const STEPS = [
  { title: 'Describe', body: 'Give the details of the decision — and your own reasons for leaning one way.' },
  { title: 'Illuminate', body: 'See what sits outside your light: unstated assumptions, conflicts within your own reasoning, risks, and factors you overlooked.' },
  { title: 'Examine', body: 'Answer questions written for your situation. Mark what you have actually checked. Reflect on what shifted.' },
  { title: 'Decide', body: 'You write the call — and what would change your mind. Penumbra never does. It files the entry in a private journal.' },
];

export function HowItWorks() {
  const reduce = useReducedMotion();
  return (
    <>
      <section id="how" className="relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 py-24">
          <Badge>How it works</Badge>
          <h2 className="t-h2 mt-5 max-w-2xl font-display font-semibold tracking-tight text-ink">
            Four steps. <em className="text-ink-muted">One of them is entirely yours.</em>
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-[16px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={reduce ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.22, ease: EASE }}
                className="bg-paper"
              >
                <div className="h-full p-8">
                  <div className="eyebrow">0{i + 1}</div>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-ink-muted">{s.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

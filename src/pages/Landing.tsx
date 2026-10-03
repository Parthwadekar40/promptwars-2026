import { motion, useReducedMotion } from 'framer-motion';
import { Badge, Button, GlassCard, Input, Section, Stat } from '../components/ui';
import { navigate } from '../lib/router';

const CAPABILITIES = [
  { title: 'AI-Powered', body: 'Google Gemini understands and generates in real time.' },
  { title: 'Secure by design', body: 'Your key stays in your browser. Nothing secret is stored.' },
  { title: 'Blazing fast', body: 'Lean, tested, accessible — built to feel instant.' },
  { title: 'Beautiful', body: 'Glassmorphic design with thoughtful motion everywhere.' },
];

/** Landing template — copy is a slot: replace with problem-specific language at T+0. */
export function Landing() {
  const reduce = useReducedMotion();
  return (
    <>
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white" />
        <div aria-hidden className="absolute -top-32 right-0 -z-10 size-96 rounded-full bg-accent-400/20 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge>✦ Built with Google AI Studio</Badge>
              <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
                Solve it <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">beautifully</span>,
                in minutes.
              </h1>
              <p className="mt-5 max-w-md text-lg text-ink-muted">
                An intelligent workspace powered by Google Gemini — fast, accessible, and a joy to use.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button type="button" onClick={() => navigate('/signin')}>Get started</Button>
                <Button type="button" variant="ghost" onClick={() => navigate('/connect')}>Connect AI key</Button>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            aria-hidden
          >
            <div className="relative aspect-square rounded-3xl border border-white/60 bg-white/30 shadow-2xl shadow-brand-900/10 backdrop-blur-2xl">
              <div className="absolute inset-8 rounded-2xl bg-gradient-to-br from-brand-400/40 via-accent-400/30 to-brand-600/40" />
              <div className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-white/50 shadow-xl backdrop-blur-xl" />
            </div>
          </motion.div>
        </div>
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4 px-6 pb-16">
          <Stat value="Gemini" label="Google AI models" />
          <Stat value="100%" label="Accessible & tested" />
          <Stat value="<1s" label="Feels instant" />
        </div>
      </section>

      <Section id="features" eyebrow="CAPABILITIES" title="Everything you need, nothing you don't.">
        <div className="grid gap-5 sm:grid-cols-2">
          {CAPABILITIES.map((c, i) => (
            <motion.div
              key={c.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <GlassCard>
                <h3 className="font-display text-lg font-semibold text-ink">{c.title}</h3>
                <p className="mt-2 text-ink-muted">{c.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section id="cta" eyebrow="GET STARTED" title="Ready when you are.">
        <GlassCard className="text-center">
          <p className="text-ink-muted">Sign in and let Gemini do the heavy lifting.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Button type="button" onClick={() => navigate('/signin')}>Create your account</Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/connect')}>Settings</Button>
          </div>
          <div className="mx-auto mt-6 max-w-sm">
            <Input aria-label="Email for updates" type="email" placeholder="you@example.com" />
          </div>
        </GlassCard>
      </Section>
    </>
  );
}

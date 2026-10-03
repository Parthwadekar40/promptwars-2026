import { motion, useReducedMotion } from 'framer-motion';
import { Badge, Button, GlassCard, Input, Section, Stat } from '../components/ui';
import { navigate } from '../lib/router';

const CAPABILITIES = [
  { title: 'Understands, then delivers', body: 'Google Gemini reasons through your request and produces results in real time.' },
  { title: 'Private by default', body: 'Your key stays in your browser. Nothing sensitive is ever stored on a server.' },
  { title: 'Feels instant', body: 'Lean architecture, tested core paths, and motion that never gets in the way.' },
  { title: 'Quietly beautiful', body: 'Editorial design with considered type, spacing, and light.' },
];

/** Landing template — copy is a slot: swap with problem-specific language at T+0. */
export function Landing() {
  const reduce = useReducedMotion();
  return (
    <>
      <section className="relative overflow-hidden">
        {/* ambient pastel field */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/4 size-[34rem] rounded-full bg-brand-200/40 blur-[110px]" />
          <div className="absolute -right-32 top-20 size-[28rem] rounded-full bg-mint-300/30 blur-[110px]" />
          <div className="absolute right-1/3 top-64 size-[22rem] rounded-full bg-peach-300/30 blur-[110px]" />
          <div
            className="absolute inset-0 opacity-[0.5]"
            style={{
              backgroundImage:
                'linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
              maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, black, transparent)',
            }}
          />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-16 pt-20 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-28">
          <motion.div initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <Badge>Intelligent workspace</Badge>
            <h1 className="mt-6 font-display text-[2.9rem] font-semibold leading-[1.04] tracking-[-0.02em] text-ink md:text-[4.2rem]">
              Solve it <em className="text-gradient font-serif font-normal italic tracking-normal">beautifully</em>,
              <br />
              in minutes.
            </h1>
            <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-ink-muted">
              An intelligent workspace that turns your ideas into finished work — fast, private, and a genuine
              pleasure to use.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button type="button" onClick={() => navigate('/signin')}>Get started</Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/connect')}>Connect AI key</Button>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/img/orb-main.webp`}
              alt="Iridescent glass orb with soft pastel reflections"
              width="1024"
              height="1024"
              fetchPriority="high"
              className="w-full max-w-[420px] rounded-[18px]"
            />
          </motion.div>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 border-t border-line px-6 py-10 md:grid-cols-4">
          <Stat value="Gemini" label="Google AI models" />
          <Stat value="100%" label="Accessible & tested" />
          <Stat value="<1s" label="Feels instant" />
          <Stat value="0" label="Servers holding your key" />
        </div>
      </section>

      <Section
        id="features"
        eyebrow="Capabilities"
        title={<>Everything you need. <em className="font-serif font-normal italic tracking-normal text-ink-muted">Nothing you don't.</em></>}
      >
        <div className="grid gap-px overflow-hidden rounded-[16px] border border-line bg-line sm:grid-cols-2">
          {CAPABILITIES.map((c, i) => (
            <motion.div
              key={c.title}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="bg-paper"
            >
              <div className="h-full p-8">
                <div className="eyebrow">0{i + 1}</div>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">{c.title}</h3>
                <p className="mt-2.5 leading-relaxed text-ink-muted">{c.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* dark story band — mission line over the divider's quiet sky */}
      <section className="relative isolate overflow-hidden bg-[#0b0612]">
        <img
          src={`${import.meta.env.BASE_URL}assets/img/dark-divider.webp`}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          width="1376"
          height="768"
          className="absolute inset-0 -z-10 size-full object-cover opacity-90"
        />
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-28">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="eyebrow !text-white/60"
          >
            Our philosophy
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="mt-5 max-w-2xl font-display text-[2.1rem] font-semibold leading-[1.15] tracking-tight text-white md:text-[2.8rem]"
          >
            Technology should feel like <em className="font-serif font-normal italic tracking-normal text-white/75">light</em> —
            quiet, precise, and quietly beautiful.
          </motion.h2>
        </div>
      </section>

      <Section id="cta" eyebrow="Get started" title={<>Ready when <em className="font-serif font-normal italic tracking-normal text-ink-muted">you</em> are.</>}>
        <GlassCard className="relative overflow-hidden text-center">
          <img
            src={`${import.meta.env.BASE_URL}assets/img/silk-backdrop.webp`}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            width="1376"
            height="768"
            className="absolute inset-0 z-0 size-full object-cover opacity-70"
          />
          <div className="relative z-10">
            <p className="text-ink-muted">Create your space and let the AI do the heavy lifting.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button type="button" onClick={() => navigate('/signin')}>Create your account</Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/connect')}>Settings</Button>
            </div>
            <div className="mx-auto mt-8 max-w-sm text-left">
              <label htmlFor="cta-email" className="eyebrow">Stay in the loop</label>
              <Input id="cta-email" className="mt-2" type="email" placeholder="you@example.com" />
            </div>
          </div>
        </GlassCard>
      </Section>
    </>
  );
}

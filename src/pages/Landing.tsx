import type { MouseEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge, Button, GlassCard, Input, Section, Stat } from '../components/ui';
import { Icon } from '../components/Icon';
import { Atmosphere } from '../components/Atmosphere';
import { Marquee } from '../components/Marquee';
import { navigate } from '../lib/router';

const CAPABILITIES = [
  { title: 'Understands, then delivers', body: 'Google Gemini reasons through your request and produces finished work in real time.' },
  { title: 'Private by default', body: 'Your key stays in your browser. Nothing sensitive is ever stored on a server.' },
  { title: 'Feels instant', body: 'Lean architecture, tested core paths, and motion that never gets in the way.' },
  { title: 'Quietly beautiful', body: 'Editorial design with considered type, spacing, light, and generous space.' },
];

const MARQUEE_WORDS = [
  'RESEARCH', 'ANALYZE', 'CREATE', 'AUTOMATE', 'SUMMARIZE', 'TRANSLATE', 'PLAN', 'SHIP', 'ITERATE', 'IMAGINE',
];

const EASE = [0.22, 1, 0.36, 1] as const;

/** Landing template — copy is a slot: swap with problem-specific language at T+0. */
export function Landing() {
  const reduce = useReducedMotion();

  const trackCursor = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  const words = ['Solve', 'it'];
  const accent = 'beautifully,';
  const tail = ['in', 'minutes.'];

  return (
    <>
      {/* ————— HERO — brutal scale, cursor spotlight, delayed word reveal ————— */}
      <section onMouseMove={trackCursor} className="relative overflow-hidden">
        <Atmosphere />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 transition-opacity"
          style={{
            background:
              'radial-gradient(420px circle at var(--mx, 50%) var(--my, 30%), rgba(139,124,248,0.10), transparent 70%)',
          }}
        />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-14 pt-20 md:grid-cols-[1.08fr_0.92fr] md:pb-20 md:pt-28">
          <div>
            <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.2 }}>
              <Badge>Intelligent workspace</Badge>
            </motion.div>

            <h1 className="t-hero mt-7 font-display font-semibold tracking-[-0.025em] text-ink">
              {[...words, accent, ...tail].map((w, i) => (
                <motion.span
                  key={w}
                  initial={reduce ? false : { opacity: 0, y: '0.55em', filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1, delay: 0.35 + i * 0.16, ease: EASE }}
                  className="mr-[0.28em] inline-block"
                >
                  {w === accent ? (
                    <em className="text-gradient font-serif font-normal italic tracking-normal">{accent}</em>
                  ) : (
                    w
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.35, ease: EASE }}
              className="mt-7 max-w-lg text-[18px] leading-relaxed text-ink-muted"
            >
              An intelligent workspace that turns your ideas into finished work — fast, private, and a genuine
              pleasure to use.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.65, ease: EASE }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button type="button" onClick={() => navigate('/signin')}>
                <Icon name="plus" className="size-4" />
                Get started
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/connect')}>
                <Icon name="gear" className="size-4" />
                Connect AI key
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.75, ease: EASE }}
            className="flex justify-center md:justify-end"
          >
            <motion.img
              src={`${import.meta.env.BASE_URL}assets/img/orb-main-alpha.webp`}
              alt="Iridescent glass orb with soft pastel reflections"
              width="1024"
              height="1024"
              fetchPriority="high"
              className="float-art w-full max-w-[380px] md:max-w-[540px]"
              animate={reduce ? undefined : { y: [0, -12, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.9 }}
        >
          <Marquee items={MARQUEE_WORDS} />
        </motion.div>

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          {[
            { v: 'Gemini', l: 'Google AI models' },
            { v: '100%', l: 'Accessible & tested' },
            { v: '<1s', l: 'Feels instant' },
            { v: '0', l: 'Servers holding your key' },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.22, ease: EASE }}
            >
              <Stat value={s.v} label={s.l} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ————— FEATURES — glass-bar rule at brutal width, slab bleeding, deep staggers ————— */}
      <section id="features" className="relative overflow-hidden">
        <img
          src={`${import.meta.env.BASE_URL}assets/img/glass-slab-alpha.webp`}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          width="1024"
          height="1024"
          className="animate-float float-art pointer-events-none absolute -right-24 top-4 hidden w-[420px] rotate-[8deg] opacity-90 lg:block"
          style={{ ['--tilt' as string]: '8deg' }}
        />
        <div className="mx-auto w-full max-w-7xl px-6 py-24">
          <Badge>Capabilities</Badge>
          <h2 className="t-h2 mt-5 max-w-2xl font-display font-semibold tracking-tight text-ink">
            Everything you need. <em className="font-serif font-normal italic tracking-normal text-ink-muted">Nothing you don't.</em>
          </h2>
          <motion.img
            src={`${import.meta.env.BASE_URL}assets/img/glass-bar-alpha.webp`}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            width="467"
            height="313"
            initial={reduce ? false : { opacity: 0, scaleX: 0.6 }}
            whileInView={{ opacity: 0.9, scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.1, delay: 0.35, ease: EASE }}
            className="float-art mt-10 h-10 w-full origin-left object-contain object-left"
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-[16px] border border-line bg-line sm:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <motion.div
                key={c.title}
                initial={reduce ? false : { opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.9, delay: 0.25 + i * 0.28, ease: EASE }}
                className="bg-paper"
              >
                <div className="h-full p-9">
                  <div className="eyebrow">0{i + 1}</div>
                  <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">{c.title}</h3>
                  <p className="mt-2.5 leading-relaxed text-ink-muted">{c.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— QUOTE BAND — the pebble floats free, quote in its sky ————— */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 pt-24 text-center md:pt-32">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-120px' }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            className="t-quote font-serif italic leading-snug text-ink/85"
          >
            “Simplicity is the soul of efficiency —<br />and beauty is its proof.”
          </motion.p>
        </div>
        <motion.img
          src={`${import.meta.env.BASE_URL}assets/img/pebble-empty-alpha.webp`}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          width="1024"
          height="1024"
          initial={reduce ? false : { opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
          className="float-art mx-auto -mt-4 w-[520px] max-w-full"
        />
      </section>

      {/* ————— ORB-WIDE INTERLUDE — art melts into the paper ————— */}
      <section className="relative overflow-hidden border-y border-line">
        <img
          src={`${import.meta.env.BASE_URL}assets/img/orb-wide-alpha.webp`}
          alt="Iridescent orb with a soft rainbow refraction across a cream studio floor"
          loading="lazy"
          decoding="async"
          width="1376"
          height="768"
          className="animate-silk mask-fade-y w-full"
        />
        <motion.div
          initial={reduce ? false : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
          className="absolute bottom-8 left-8 max-w-xs"
        >
          <p className="eyebrow !text-ink/60">Designed in light</p>
          <p className="mt-2 font-display text-xl font-semibold tracking-tight text-ink">Every detail, considered.</p>
        </motion.div>
      </section>

      {/* ————— DARK STORY BAND — live mist loop, delayed reveals ————— */}
      <section className="relative isolate overflow-hidden bg-[#0b0612]">
        {reduce ? (
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
        ) : (
          <video
            aria-hidden
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={`${import.meta.env.BASE_URL}assets/img/dark-divider.webp`}
            className="absolute inset-0 -z-10 size-full object-cover opacity-90"
          >
            <source src={`${import.meta.env.BASE_URL}assets/video/mist-loop.mp4`} type="video/mp4" />
          </video>
        )}
        <Atmosphere dark />
        <div className="mx-auto max-w-7xl px-6 py-28 md:py-36">
          <motion.p
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-140px' }}
            transition={{ duration: 1.2, delay: 0.35 }}
            className="eyebrow !text-white/60"
          >
            Our philosophy
          </motion.p>
          <motion.h2
            initial={reduce ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-140px' }}
            transition={{ duration: 1.15, delay: 0.65, ease: EASE }}
            className="t-h2 mt-6 max-w-3xl font-display font-semibold tracking-tight text-white"
          >
            Technology should feel like{' '}
            <em className="font-serif font-normal italic tracking-normal text-white/75">light</em> — quiet,
            precise, and quietly beautiful.
          </motion.h2>
        </div>
      </section>

      {/* ————— CTA — drifting silk, delayed entry ————— */}
      <Section id="cta" eyebrow="Get started" title={<>Ready when <em className="font-serif font-normal italic tracking-normal text-ink-muted">you</em> are.</>}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.35, ease: EASE }}
        >
          <GlassCard className="relative overflow-hidden text-center">
            <img
              src={`${import.meta.env.BASE_URL}assets/img/silk-backdrop.webp`}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              width="1376"
              height="768"
              className="animate-silk mask-fade-all absolute inset-0 z-0 size-full object-cover opacity-80"
            />
            <div className="relative z-10">
              <p className="text-ink-muted">Create your space and let the AI do the heavy lifting.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button type="button" onClick={() => navigate('/signin')}>
                  <Icon name="plus" className="size-4" />
                  Create your account
                </Button>
                <Button type="button" variant="ghost" onClick={() => navigate('/connect')}>
                  <Icon name="gear" className="size-4" />
                  Settings
                </Button>
              </div>
              <div className="mx-auto mt-8 max-w-sm">
                <label htmlFor="cta-email" className="eyebrow">Stay in the loop</label>
                <div className="mt-2 flex gap-2">
                  <Input id="cta-email" type="email" placeholder="you@example.com" />
                  <Button type="button" variant="ghost" aria-label="Notify me">
                    <Icon name="bell" className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </Section>
    </>
  );
}

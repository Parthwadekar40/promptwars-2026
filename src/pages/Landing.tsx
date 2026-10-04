import { motion, useReducedMotion } from 'framer-motion';
import { Badge, Button, GlassCard, Section, Stat } from '../components/ui';
import { Atmosphere } from '../components/Atmosphere';
import { Marquee } from '../components/Marquee';
import { Reveal } from '../components/Reveal';
import { Spotlight } from '../components/Spotlight';
import { navigate } from '../lib/router';
import { useProfile } from '../lib/auth';

const EASE = [0.22, 1, 0.36, 1] as const;
const ASSETS = `${import.meta.env.BASE_URL}assets`;

const LENSES = [
  'UNSTATED ASSUMPTIONS', 'CONFLICTS IN YOUR REASONING', 'RISKS', 'WHAT YOU OVERLOOKED', 'TIME HORIZONS',
  'REVERSIBILITY', 'THE OTHER SIDE', 'ANCHORS',
];

const STEPS = [
  { title: 'Describe', body: 'Give the details of the decision — and your own reasons for leaning one way.' },
  { title: 'Illuminate', body: 'See what sits outside your light: unstated assumptions, conflicts within your own reasoning, risks, and factors you overlooked.' },
  { title: 'Examine', body: 'Answer questions written for your situation. Mark what you have actually checked. Reflect on what shifted.' },
  { title: 'Decide', body: 'You write the call — and what would change your mind. Penumbra never does. It files the entry in a private journal.' },
];

const PRINCIPLES = [
  { title: 'Questions, not answers', body: 'Every output is a question, an observation, or a case for the side you are not on — never a verdict.' },
  { title: 'Specific, never generic', body: 'It works from your details, your numbers, your constraints. "Weigh the pros and cons" is not allowed.' },
  { title: 'Your call, always', body: 'The last step belongs to you alone: write the decision, and what would change your mind.' },
];

/** Landing — the problem, the one rule, and the way in. */
export function Landing() {
  const reduce = useReducedMotion();
  const profile = useProfile();
  const words = profile ? ['Welcome,'] : ['Think', 'past', 'what', 'you'];
  const accent = profile ? `${profile.name}.` : 'noticed first.';

  return (
    <>
      {/* ————— HERO ————— */}
      <section className="relative overflow-hidden">
        <Atmosphere />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-14 pt-20 md:grid-cols-[1.08fr_0.92fr] md:pb-20 md:pt-28">
          <div>
            <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.2 }}>
              <Badge>A thinking companion</Badge>
            </motion.div>

            <h1 className="t-hero mt-7 font-display font-semibold tracking-[-0.025em] text-ink">
              {[...words, accent].map((w, i) => (
                <motion.span
                  key={w}
                  initial={reduce ? false : { opacity: 0, y: '0.55em', filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 1, delay: 0.35 + i * 0.16, ease: EASE }}
                  className="mr-[0.28em] inline-block"
                >
                  {w === accent ? <em className="text-gradient font-serif font-normal italic tracking-normal">{accent}</em> : w}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.35, ease: EASE }}
              className="mt-7 max-w-lg text-[18px] leading-relaxed text-ink-muted"
            >
              {profile
                ? "Bring a decision when you're ready. Penumbra will show you what is outside the light — and leave the choice to you."
                : 'Describe a decision and your reasons. Penumbra shows the assumptions you never stated, what you overlooked, and where your own reasoning conflicts — then asks the questions worth sitting with and steps back. The decision stays yours.'}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.65, ease: EASE }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button type="button" onClick={() => navigate('/think')}>
                Start thinking
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate(profile ? '/journal' : '/think?sample')}>
                {profile ? 'Open journal' : 'See a sample'}
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
              src={`${ASSETS}/img/hero-sphere.webp`}
              alt="A glass sphere on paper, casting a soft shadow with a rainbow caustic"
              width="760"
              height="760"
              fetchPriority="high"
              className="w-full max-w-[400px] md:max-w-[580px]"
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
          </motion.div>
        </div>

        <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 1.9 }}>
          <Marquee items={LENSES} />
        </motion.div>

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          {[
            { v: '0', l: 'Verdicts, by design' },
            { v: '7', l: 'Lenses on every decision' },
            { v: '4–5', l: 'Questions written for you' },
            { v: '1', l: 'Decision-maker: you' },
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

      {/* ————— HOW IT WORKS ————— */}
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

      {/* ————— THE MIRROR — examine your reasoning ————— */}
      <section id="mirror" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-[0.75fr_1.25fr] md:py-28">
          <Reveal>
            <img
              src={`${ASSETS}/img/mirror.webp`}
              alt="A tall mirror reflecting a brighter version of the same room"
              loading="lazy"
              decoding="async"
              width="540"
              height="820"
              className="mx-auto w-full max-w-[380px]"
            />
          </Reveal>
          <div>
            <Badge>Examine your reasoning</Badge>
            <h2 className="t-h2 mt-5 max-w-xl font-display font-semibold tracking-tight text-ink">
              Hold your thinking up to <em className="text-ink-muted">a&nbsp;mirror.</em>
            </h2>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-muted">
              Answer the questions in your own words and Penumbra reflects them back — quoting you, noticing where one answer
              pulls against another, naming what is still unexamined. It never tells you which side is right.
            </p>
            <ul className="mt-8 grid max-w-xl gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-3">
              {[
                { t: 'Your words, quoted', b: 'Built from what you actually wrote.' },
                { t: 'Tensions, named', b: 'Where two of your answers pull apart.' },
                { t: 'Nothing decided', b: 'It ends with a question, never a verdict.' },
              ].map((x) => (
                <li key={x.t} className="bg-paper p-5">
                  <p className="font-display font-semibold tracking-tight text-ink">{x.t}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-ink-muted">{x.b}</p>
                </li>
              ))}
            </ul>
            <a href="#/think?sample" className="mt-7 inline-block text-[15px] font-medium text-brand-700 underline underline-offset-4">
              See a reflection in the sample →
            </a>
          </div>
        </div>
      </section>

      {/* ————— PERSPECTIVE FILM ————— */}
      <section aria-label="Perspectives" className="relative overflow-hidden">
        <div className="relative h-[clamp(300px,46vh,500px)]">
          <video
            className="mask-fade-y absolute inset-0 size-full object-cover"
            src={`${ASSETS}/video/glass-spheres-loop.mp4`}
            poster={`${ASSETS}/img/glass-study.webp`}
            autoPlay={!reduce}
            muted
            loop
            playsInline
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(65% 75% at 50% 50%, rgba(228,222,211,0.55), rgba(228,222,211,0) 72%)' }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="eyebrow">PERSPECTIVE</p>
            <h2 className="t-h2 mt-3 font-display font-semibold tracking-tight text-ink">
              One decision. <em>Many angles.</em>
            </h2>
          </div>
        </div>
      </section>

      {/* ————— THE BLIND SPOT — dark, with a light you move ————— */}
      <section className="relative isolate overflow-hidden bg-[#0b0a10]">
        <Atmosphere dark />
        <div className="mx-auto max-w-4xl px-6 pt-28 text-center md:pt-36">
          <p className="eyebrow !text-white/60">The blind spot</p>
          <Reveal>
            <h2 className="t-quote mt-6 font-serif font-normal italic leading-snug text-white">
              “We rarely decide in the dark. We decide in a small circle of light — and mistake it for the whole room.”
            </h2>
          </Reveal>
          <p className="mt-6 text-white/65">Move through the dark. Everything here was always in the room.</p>
        </div>
        <div className="relative mt-2">
          <img
            src={`${ASSETS}/img/periphery.webp`}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            width="1440"
            height="611"
            className="block min-h-[440px] w-full object-cover"
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0, #000 26%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 26%)',
            }}
          />
          <Spotlight className="absolute inset-x-0 top-0 h-[62%]" />
        </div>
        <p className="sr-only">
          Thoughts that sit just outside attention: an assumption, sunk cost, who is missing, second-order effects, the deadline,
          reversibility, the other side, anchoring.
        </p>
      </section>

      {/* ————— THE ONE RULE ————— */}
      <Section id="rule" eyebrow="The one rule" title={<>It never decides. <em className="text-ink-muted">You do.</em></>}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <GlassCard className="flex h-full flex-col justify-between gap-8">
              <div>
              <p className="eyebrow">The neutrality guard — in action</p>
              <ul className="mt-6 space-y-4 text-[15px] leading-relaxed">
                {[
                  { kept: false, text: 'You should take the internship.' },
                  { kept: false, text: 'Honestly, the better option is to decline.' },
                  { kept: true, text: 'What would have to be true for this internship to be worth the study time it costs?' },
                  { kept: true, text: 'What are you assuming about the mentoring you would get?' },
                ].map((l) => (
                  <li key={l.text} className="flex gap-4">
                    <span className={`eyebrow w-16 shrink-0 pt-0.5 ${l.kept ? '!text-emerald-800' : '!text-red-700'}`}>{l.kept ? 'Kept' : 'Removed'}</span>
                    <span className={l.kept ? 'text-ink' : 'text-ink-muted line-through decoration-red-700/50'}>“{l.text}”</span>
                  </li>
                ))}
              </ul>
              </div>
              <p className="border-t border-line pt-5 text-[14px] leading-relaxed text-ink-muted">
                Every response is checked in code before you see it. Advice-shaped sentences are removed; only questions and
                observations survive.
              </p>
            </GlassCard>
          </Reveal>
          <ul className="grid gap-4">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title}>
                <Reveal delay={0.15 + i * 0.15}>
                  <div className="hairline rounded-[14px] bg-white/40 p-6">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{p.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink-muted">{p.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ————— BEGIN ————— */}
      <Section id="begin" eyebrow="Begin" title={<>Bring a decision. <em className="text-ink-muted">Leave with better questions.</em></>}>
        <Reveal>
          <GlassCard className="relative overflow-hidden text-center !p-0">
            <img
              src={`${ASSETS}/img/paths.webp`}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              width="1280"
              height="714"
              className="absolute inset-0 z-0 size-full object-cover object-bottom"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0, #000 38%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 38%)',
              }}
            />
            <div className="relative z-10 px-6 pb-64 pt-12 md:pb-72">
              <p className="mx-auto max-w-md text-ink-muted">
                No sign-up needed. Your words are used only to write the analysis — nothing is saved unless you choose to.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button type="button" onClick={() => navigate('/think')}>
                  Start thinking
                </Button>
                <Button type="button" variant="ghost" onClick={() => navigate('/think?sample')}>
                  See a sample
                </Button>
              </div>
              {!profile && (
                <p className="mt-6 text-[14px] text-ink-muted">
                  Want a journal that follows you across devices?{' '}
                  <a href="#/signup" className="font-medium text-brand-700 underline underline-offset-4">
                    Create a free account
                  </a>
                </p>
              )}
            </div>
          </GlassCard>
        </Reveal>
      </Section>
    </>
  );
}

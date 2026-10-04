import { motion, useReducedMotion } from 'framer-motion';
import { Badge, Button, Stat } from '../../components/ui';
import { Atmosphere } from '../../components/Atmosphere';
import { Marquee } from '../../components/Marquee';
import { navigate } from '../../lib/router';
import { useProfile } from '../../lib/auth';
import { ASSETS, EASE } from './shared';

const LENSES = [
  'UNSTATED ASSUMPTIONS',
  'CONFLICTS IN YOUR REASONING',
  'RISKS',
  'WHAT YOU OVERLOOKED',
  'TIME HORIZONS',
  'REVERSIBILITY',
  'THE OTHER SIDE',
  'ANCHORS',
];

export function Hero() {
  const reduce = useReducedMotion();
  const profile = useProfile();
  const words = profile ? ['Welcome,'] : ['Think', 'past', 'what', 'you'];
  const accent = profile ? `${profile.name}.` : 'noticed first.';
  return (
    <>
      <section className="relative overflow-hidden">
        <Atmosphere />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-14 pt-20 md:grid-cols-[1.08fr_0.92fr] md:pb-20 md:pt-28">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
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

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.9 }}
        >
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
    </>
  );
}

import { Button, GlassCard, Section } from '../../components/ui';
import { Reveal } from '../../components/Reveal';
import { navigate } from '../../lib/router';
import { useProfile } from '../../lib/auth';
import { ASSETS } from './shared';

export function Begin() {
  const profile = useProfile();
  return (
    <>
      <Section
        id="begin"
        eyebrow="Begin"
        title={
          <>
            Bring a decision. <em className="text-ink-muted">Leave with better questions.</em>
          </>
        }
      >
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
                No sign-up needed. Your words are used only to write the analysis — nothing is saved unless you choose
                to.
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

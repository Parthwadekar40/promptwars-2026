import { useEffect, useRef } from 'react';
import { Badge, Button } from '../components/ui';
import { Atmosphere } from '../components/Atmosphere';
import { Reveal } from '../components/Reveal';
import { Compose } from '../components/think/Compose';
import { Pending } from '../components/think/Pending';
import { ProgressBar } from '../components/think/ProgressBar';
import { ReflectionCard } from '../components/think/ReflectionCard';
import { Results } from '../components/think/Results';
import { YourCall } from '../components/think/YourCall';
import { useThinking } from '../hooks/useThinking';

/** The thinking workspace: describe → illuminate → examine → reflect → your call. */
export function Think({ autoSample = false }: { autoSample?: boolean }) {
  const t = useThinking();
  const heading = useRef<HTMLHeadingElement>(null);
  const { loadSample } = t;

  useEffect(() => {
    if (autoSample) loadSample();
  }, [autoSample, loadSample]);

  useEffect(() => {
    if (t.phase !== 'results') return;
    window.scrollTo(0, 0);
    heading.current?.focus();
  }, [t.phase]);

  return (
    <div className="relative overflow-clip">
      <Atmosphere />
      <div className="mx-auto max-w-3xl px-6 pb-28 pt-14 md:pt-20">
        {t.phase !== 'results' && (
          <header className="relative mb-9">
            <img
              src={`${import.meta.env.BASE_URL}assets/img/hero-sphere.webp`}
              alt=""
              aria-hidden
              width="760"
              height="760"
              className="pointer-events-none absolute -right-28 -top-24 hidden w-[330px] md:block"
            />
            <Badge>Think</Badge>
            <h1 className="t-h2 mt-5 font-display font-semibold tracking-tight text-ink">
              What are you <em>deciding?</em>
            </h1>
            <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-muted">
              Describe a real decision. Penumbra shows you what you may be missing — then steps back.
            </p>
          </header>
        )}

        {t.phase === 'compose' && (
          <Compose
            decision={t.decision}
            leaning={t.leaning}
            error={t.error}
            onDecision={t.setDecision}
            onLeaning={t.setLeaning}
            onSubmit={t.submit}
            onSample={t.loadSample}
          />
        )}
        {t.phase === 'loading' && <Pending />}

        {t.phase === 'results' && t.analysis && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <Badge>Your decision</Badge>
              <Button type="button" variant="ghost" onClick={t.reset} className="!px-4 !py-2 !text-[14px]">
                Start over
              </Button>
            </div>
            <div>
              <Results
                a={t.analysis}
                removed={t.removed}
                sample={t.sample}
                marks={t.marks}
                onMark={t.toggle}
                answers={t.answers}
                onAnswer={t.setAnswer}
                headingRef={heading}
              />
              <ProgressBar
                done={t.done}
                total={t.total}
                reflecting={t.reflecting}
                error={t.reflectError}
                onReflect={t.reflect}
              />
            </div>
            {t.reflection && (
              <Reveal className="mt-16">
                <ReflectionCard r={t.reflection} />
              </Reveal>
            )}
            <YourCall
              title={t.analysis.title}
              decision={t.decision}
              leaning={t.leaning}
              answers={t.answered}
              examined={t.done}
              total={t.total}
            />
          </>
        )}
      </div>
    </div>
  );
}

import { GlassCard, Section } from '../../components/ui';
import { Reveal } from '../../components/Reveal';

const PRINCIPLES = [
  { title: 'Questions, not answers', body: 'Every output is a question, an observation, or a case for the side you are not on — never a verdict.' },
  { title: 'Specific, never generic', body: 'It works from your details, your numbers, your constraints. "Weigh the pros and cons" is not allowed.' },
  { title: 'Your call, always', body: 'The last step belongs to you alone: write the decision, and what would change your mind.' },
];

export function OneRule() {
  return (
    <>
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
    </>
  );
}

import { Button, GlassCard, Textarea } from '../ui';
import { EXAMPLES } from '../../data/examples';
import { LIMITS } from '../../lib/analyze';

type Props = {
  decision: string;
  leaning: string;
  error: string;
  onDecision: (v: string) => void;
  onLeaning: (v: string) => void;
  onSubmit: () => void;
  onSample: () => void;
};

/** Step 1 — describe the decision, and (optionally) which way you are leaning. */
export function Compose({ decision, leaning, error, onDecision, onLeaning, onSubmit, onSample }: Props) {
  return (
    <GlassCard className="!p-7 md:!p-9">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <label htmlFor="decision" className="eyebrow">
          The decision
        </label>
        <Textarea
          id="decision"
          rows={5}
          maxLength={LIMITS.decision}
          value={decision}
          onChange={(e) => onDecision(e.target.value)}
          aria-describedby="decision-hint decision-error"
          placeholder="I've been offered a role in another city with a bigger salary. My family is here, and my current job is stable but I've stopped learning…"
          className="mt-2.5"
        />
        <div id="decision-hint" className="mt-2 flex justify-between text-[13px] text-ink-muted">
          <span>Include the details: money, time, people, constraints — the way you would tell a friend.</span>
          <span aria-hidden>
            {decision.length}/{LIMITS.decision}
          </span>
        </div>

        <label htmlFor="leaning" className="eyebrow mt-7 block">
          Your main reasons — which way are you leaning, and why? <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <Textarea
          id="leaning"
          rows={2}
          maxLength={LIMITS.leaning}
          value={leaning}
          onChange={(e) => onLeaning(e.target.value)}
          placeholder="e.g. The stipend is good, it is close to home, and it will give me industry experience."
          className="mt-2.5"
        />

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Button type="submit">Illuminate</Button>
          <Button type="button" variant="ghost" onClick={onSample}>
            See a sample
          </Button>
        </div>
        <p id="decision-error" role="alert" className="mt-3 min-h-5 text-[14px] text-red-700">
          {error}
        </p>
      </form>

      <div className="mt-5 border-t border-line pt-5">
        <p className="eyebrow">Or start from an example</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <li key={ex.label}>
              <button
                type="button"
                onClick={() => {
                  onDecision(ex.decision);
                  onLeaning(ex.leaning);
                }}
                className="rounded-full border border-line bg-white/50 px-3.5 py-1.5 text-[13px] text-ink transition-colors hover:border-ink/30 hover:bg-white/80"
              >
                {ex.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </GlassCard>
  );
}

import { useRef, useState } from 'react';
import { Button, GlassCard, Textarea, buttonClass } from '../ui';
import { useProfile } from '../../lib/auth';
import { newEntryId, reviewLink, saveEntry, toMarkdown } from '../../lib/journal';
import type { Answered } from '../../lib/analyze';

type Props = { title: string; decision: string; leaning: string; answers: Answered[]; examined: number; total: number };

/** Step 4 — the part Penumbra never touches. The person writes the call, and what would change their mind. */
export function YourCall({ title, decision, leaning, answers, examined, total }: Props) {
  const profile = useProfile();
  const id = useRef(newEntryId()); // one id per session → saving twice overwrites, never duplicates
  const [call, setCall] = useState('');
  const [changeMind, setChangeMind] = useState('');
  const [status, setStatus] = useState('');
  const [saved, setSaved] = useState(false);

  const entry = () => ({
    id: id.current,
    at: Date.now(),
    title,
    decision,
    leaning,
    examined,
    total,
    answers,
    call: call.trim(),
    changeMind: changeMind.trim(),
  });

  const missingCall = (): boolean => {
    if (call.trim()) return false;
    setSaved(false);
    setStatus("Write your call first — it's the whole point.");
    return true;
  };

  const save = async () => {
    if (missingCall()) return;
    setStatus('Saving…');
    const where = await saveEntry(entry());
    setSaved(true);
    setStatus(
      where === 'cloud'
        ? 'Saved to your private journal.'
        : profile
          ? 'Saved on this device — cloud sync is unavailable right now.'
          : 'Saved on this device. Sign in to keep your journal across devices.',
    );
  };

  const copy = async () => {
    if (missingCall()) return;
    try {
      await navigator.clipboard.writeText(toMarkdown(entry()));
      setStatus('Copied as Markdown.');
    } catch {
      setStatus('Copying is blocked in this browser.');
    }
  };

  return (
    <section aria-labelledby="your-call" className="mt-20">
      <p className="eyebrow">08 · Your call</p>
      <h2
        id="your-call"
        className="mt-2 font-display text-[clamp(1.45rem,2.6vw,1.9rem)] font-semibold tracking-tight text-ink"
      >
        This part is <em>yours.</em>
      </h2>
      <p className="mt-3 max-w-xl text-ink-muted">
        Penumbra stays out of it. Write where you have landed — or where you are leaning now — and what would change
        your mind.
      </p>
      <GlassCard className="mt-6 !p-7 md:!p-9">
        <label htmlFor="call" className="eyebrow">
          My call
        </label>
        <Textarea
          id="call"
          rows={3}
          maxLength={800}
          value={call}
          onChange={(e) => setCall(e.target.value)}
          className="mt-2.5"
          placeholder="In my own words…"
        />
        <label htmlFor="mind" className="eyebrow mt-6 block">
          What would change my mind <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <Textarea
          id="mind"
          rows={2}
          maxLength={500}
          value={changeMind}
          onChange={(e) => setChangeMind(e.target.value)}
          className="mt-2.5"
          placeholder="If I learned that…"
        />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="button" onClick={save}>
            Save to my journal
          </Button>
          <Button type="button" variant="ghost" onClick={copy}>
            Copy as Markdown
          </Button>
          {call.trim() && (
            <a
              href={reviewLink({ title, call: call.trim(), changeMind: changeMind.trim() })}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass('ghost')}
            >
              Review in 30 days ↗
            </a>
          )}
          {saved && (
            <a href="#/journal" className="text-[14px] font-medium text-brand-700 underline underline-offset-4">
              Open journal →
            </a>
          )}
        </div>
        <p role="status" aria-live="polite" className="mt-3 min-h-5 text-[14px] text-ink-muted">
          {status}
        </p>
      </GlassCard>
    </section>
  );
}

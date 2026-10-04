import { useEffect, useState } from 'react';
import { Badge, Button, GlassCard } from '../components/ui';
import { Atmosphere } from '../components/Atmosphere';
import { useProfile } from '../lib/auth';
import { listEntries, removeEntry, toMarkdown } from '../lib/journal';
import type { Entry, Where } from '../lib/journal';
import { navigate } from '../lib/router';

/** The decision journal — every call you have written down, private to you. */
export function Journal() {
  const profile = useProfile();
  const [state, setState] = useState<{ entries: Entry[]; where: Where } | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    let live = true;
    void listEntries().then((s) => {
      if (live) setState(s);
    });
    return () => {
      live = false;
    };
  }, [profile?.uid]);

  const remove = async (id: string) => {
    await removeEntry(id);
    setState((s) => s && { ...s, entries: s.entries.filter((e) => e.id !== id) });
  };

  const copy = async (e: Entry) => {
    try {
      await navigator.clipboard.writeText(toMarkdown(e));
      setNote('Copied as Markdown.');
    } catch {
      setNote('Copying is blocked in this browser.');
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Atmosphere />
      <div className="mx-auto max-w-3xl px-6 pb-28 pt-14 md:pt-20">
        <Badge>Journal</Badge>
        <h1 className="t-h2 mt-5 font-display font-semibold tracking-tight text-ink">
          Your decision <em>journal.</em>
        </h1>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-ink-muted">
          {state?.where === 'cloud'
            ? 'Stored in your private cloud space — only you can open it.'
            : 'Stored on this device. Sign in to keep it across devices.'}
        </p>

        {state && state.entries.length === 0 && (
          <GlassCard className="mt-10 text-center">
            <img
              src={`${import.meta.env.BASE_URL}assets/img/pebble-empty-alpha.webp`}
              alt=""
              aria-hidden
              width="1024"
              height="1024"
              className="mx-auto -mt-4 w-44"
            />
            <p className="font-display text-xl font-semibold text-ink">Nothing here yet.</p>
            <p className="mt-2 text-ink-muted">Your first reflection will land here once you write your call.</p>
            <Button type="button" className="mt-5" onClick={() => navigate('/think')}>
              Start thinking
            </Button>
          </GlassCard>
        )}

        <ul className="mt-10 space-y-4">
          {state?.entries.map((e) => (
            <li key={e.id}>
              <details className="hairline group rounded-[14px] bg-white/60 p-5">
                <summary className="flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-2">
                  <span className="font-display text-lg font-semibold text-ink">{e.title}</span>
                  <span className="eyebrow">
                    {new Date(e.at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} ·{' '}
                    {e.examined}/{e.total} examined
                  </span>
                </summary>
                <div className="mt-5 space-y-5 text-[15px] leading-relaxed text-ink">
                  <div>
                    <p className="eyebrow">My call</p>
                    <p className="mt-1.5 font-serif text-[1.25rem] italic">{e.call}</p>
                  </div>
                  {e.changeMind && (
                    <div>
                      <p className="eyebrow">What would change my mind</p>
                      <p className="mt-1.5">{e.changeMind}</p>
                    </div>
                  )}
                  <div>
                    <p className="eyebrow">The decision</p>
                    <p className="mt-1.5 text-ink-muted">{e.decision}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button type="button" variant="ghost" onClick={() => copy(e)} className="!px-4 !py-2 !text-[14px]">
                      Copy as Markdown
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(e.id)}
                      className="!px-4 !py-2 !text-[14px]"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
        <p role="status" aria-live="polite" className="mt-4 min-h-5 text-[14px] text-ink-muted">
          {note}
        </p>
      </div>
    </div>
  );
}

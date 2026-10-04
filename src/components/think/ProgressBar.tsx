import { Button } from '../ui';

type Props = { done: number; total: number; reflecting: boolean; error: string; onReflect: () => void };

/** Sticky "blind spots examined" meter — it measures your reflection, never the decision. */
export function ProgressBar({ done, total, reflecting, error, onReflect }: Props) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="sticky bottom-4 z-30 mt-14 flex flex-col items-center gap-2 px-2">
      <div className="hairline flex w-full max-w-xl items-center gap-4 rounded-full bg-paper/90 px-5 py-3 shadow-[0_12px_32px_-12px_rgba(23,20,18,0.3)] backdrop-blur-xl">
        <div className="min-w-0 flex-1">
          <p className="eyebrow !text-[11px]">
            Examined {done} of {total}
          </p>
          <div
            role="progressbar"
            aria-label="Blind spots examined"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
            className="mt-1.5 h-1 overflow-hidden rounded-full bg-ink/10"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-mint-300 transition-[width] duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <Button
          type="button"
          variant={done > 0 ? 'primary' : 'ghost'}
          onClick={onReflect}
          disabled={done === 0 || reflecting}
          className="!px-4 !py-2 !text-[14px]"
        >
          {reflecting ? 'Reflecting…' : 'Reflect'}
        </Button>
      </div>
      {error && (
        <p role="alert" className="rounded-full bg-paper/95 px-4 py-1.5 text-[13px] text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

/** The orb mark — a sphere in its own light. */
export function Brand({ testId }: { testId?: string }) {
  return (
    <a href="#/" className="flex items-center gap-2.5 font-display text-[17px] font-semibold tracking-tight text-ink">
      <span
        aria-hidden
        className="size-[22px] rounded-full bg-[radial-gradient(circle_at_32%_28%,#fff,var(--color-brand-300)_45%,var(--color-brand-600))] shadow-[0_3px_8px_-2px_rgba(91,75,245,0.5)]"
      />
      <span data-testid={testId}>Penumbra</span>
    </a>
  );
}

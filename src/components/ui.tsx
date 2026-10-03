import type { ReactNode, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';

/** Design-system primitives — warm-paper editorial recipe (hairlines, 12px radii, mono eyebrows). */

export function Button({
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-[10px] px-5 py-2.5 text-[15px] font-medium transition-all active:scale-[.98] disabled:opacity-50';
  const styles =
    variant === 'primary'
      ? 'bg-ink text-paper hover:bg-[#2b2622] shadow-[0_1px_2px_rgba(23,20,18,0.18)]'
      : 'hairline bg-transparent text-ink hover:bg-white/70';
  return <button className={`${base} ${styles}`} {...props} />;
}

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`hairline rounded-[14px] bg-white/60 p-6 shadow-[0_1px_2px_rgba(23,20,18,0.05),0_12px_32px_-16px_rgba(23,20,18,0.10)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow inline-flex items-center gap-2">
      <span aria-hidden className="size-1.5 rounded-full bg-brand-500" />
      {children}
    </span>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[clamp(1.85rem,2.6vw,2.35rem)] font-semibold tracking-tight text-ink">{value}</div>
      <div className="eyebrow mt-1.5">{label}</div>
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`hairline w-full rounded-[10px] bg-white/70 px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-muted/60 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30 ${props.className ?? ''}`}
    />
  );
}

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-20">
      <Badge>{eyebrow}</Badge>
      <h2 className="t-h2 mt-5 max-w-2xl font-display font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

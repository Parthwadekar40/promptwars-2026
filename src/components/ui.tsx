import type { ReactNode, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';

/** Compact design-system primitives — glass recipe from the locked visual DNA. */

export function Button({
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-medium transition-all active:scale-[.98] disabled:opacity-50';
  const styles =
    variant === 'primary'
      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500 hover:shadow-brand-500/30'
      : 'border border-white/40 bg-white/40 text-ink backdrop-blur-md hover:bg-white/60';
  return <button className={`${base} ${styles}`} {...props} />;
}

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/50 bg-white/40 p-6 shadow-xl shadow-brand-900/5 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/60 bg-brand-50/70 px-3 py-1 text-xs font-medium tracking-wide text-brand-700">
      {children}
    </span>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-3xl font-bold tracking-tight text-ink">{value}</div>
      <div className="mt-1 text-sm text-ink-muted">{label}</div>
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-white/60 bg-white/60 px-4 py-2.5 text-ink placeholder:text-ink-muted/70 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 ${props.className ?? ''}`}
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
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl px-6 py-16">
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

import { useRef } from 'react';

/** Six-box OTP input — auto-advance, backspace-previous, paste-aware. */
export function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(6, ' ').slice(0, 6).split('');

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="Verification code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          className="hairline size-11 rounded-[10px] bg-white/70 text-center text-lg font-semibold text-ink focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/30 sm:size-12"
          value={d.trim()}
          onChange={(e) => {
            const ch = e.target.value.replace(/\D/g, '').slice(-1);
            const next = value.padEnd(6, ' ').split('');
            next[i] = ch;
            onChange(next.join('').replace(/ /g, '').slice(0, 6));
            if (ch && i < 5) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !digits[i].trim() && i > 0) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
            onChange(pasted);
            refs.current[Math.min(pasted.length, 5)]?.focus();
          }}
        />
      ))}
    </div>
  );
}

import type { Result } from './result';
import { sendEmail } from './mail';

/**
 * Email OTP — 6-digit code, 5-minute TTL, delivered via EmailJS.
 * Stored in sessionStorage: one pending verification per tab.
 */
type Pending = { code: string; email: string; name: string; exp: number };

const KEY = 'pw_otp';
const TTL_MS = 5 * 60_000;

function read(): Pending | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Pending) : null;
  } catch {
    return null;
  }
}

/** Issue a fresh code and email it. */
export async function issueOtp(email: string, name: string): Promise<Result<void>> {
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, '0');
  sessionStorage.setItem(KEY, JSON.stringify({ code, email, name, exp: Date.now() + TTL_MS }));
  const r = await sendEmail({
    user_name: name || email,
    email,
    user_email: email,
    to_email: email,
    passcode: code,
    otp: code,
    message: `Your verification code is ${code} — valid for 5 minutes.`,
  });
  return r.ok ? { ok: true, data: undefined } : r;
}

/** Check a typed code against the pending one. */
export function verifyOtp(code: string): Result<void> {
  const p = read();
  if (!p) return { ok: false, error: 'No code requested — start again.' };
  if (Date.now() > p.exp) return { ok: false, error: 'That code expired — request a new one.' };
  if (code.trim() !== p.code) return { ok: false, error: 'That code is not correct.' };
  sessionStorage.removeItem(KEY);
  return { ok: true, data: undefined };
}

/** Which mailbox the pending code went to (for the UI). */
export function otpTarget(): string | null {
  return read()?.email ?? null;
}

export function cancelOtp(): void {
  sessionStorage.removeItem(KEY);
}

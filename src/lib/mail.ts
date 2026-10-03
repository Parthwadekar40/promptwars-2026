import type { Result } from './result';

/** EmailJS REST send — zero SDK dependency. Env values are public-by-design. */
const SERVICE = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || '';
const TEMPLATE = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || '';
const PUBLIC_KEY = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || '';

export const mailConfigured = (): boolean => !!(SERVICE && TEMPLATE && PUBLIC_KEY);

/** Send one templated email. `params` must match the template's {{placeholders}}. */
export async function sendEmail(params: Record<string, string>): Promise<Result<string>> {
  if (!mailConfigured()) return { ok: false, error: 'Email service not configured' };
  try {
    const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: SERVICE,
        template_id: TEMPLATE,
        user_id: PUBLIC_KEY,
        template_params: params,
      }),
    });
    if (!r.ok) return { ok: false, error: `Email failed (${r.status}): ${await r.text()}` };
    return { ok: true, data: 'sent' };
  } catch {
    return { ok: false, error: 'Network error while sending email' };
  }
}

/** WhatsApp pre-filled message via wa.me — no API, no account, works everywhere. */
export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

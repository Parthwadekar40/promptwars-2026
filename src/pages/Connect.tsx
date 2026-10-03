import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge, Button, GlassCard, Input } from '../components/ui';
import { getKey, setKey, generate, hasKey } from '../lib/gemini';
import { dbConfigured, ensureUser } from '../lib/db';
import { mailConfigured, sendEmail } from '../lib/mail';

/** Settings: Gemini key connect + live service status (also our event-day health check). */
export function Connect() {
  const reduce = useReducedMotion();
  const [keyInput, setKeyInput] = useState(getKey());
  const [status, setStatus] = useState<string>();

  const save = () => {
    setKey(keyInput.trim());
    setStatus(keyInput.trim() ? '🔑 Key saved to this browser (localStorage only).' : 'Key removed.');
  };

  const testAI = async () => {
    setStatus('Testing Gemini…');
    const r = await generate('Reply with exactly: WORKS');
    setStatus(r.ok ? `✅ Gemini responded: ${r.data}` : `⚠ ${r.error}`);
  };

  const testDB = async () => {
    setStatus('Testing Firebase…');
    const r = await ensureUser();
    setStatus(r.ok ? `✅ Firebase session OK (uid ${r.data.slice(0, 8)}…)` : `⚠ ${r.error}`);
  };

  const testMail = async () => {
    setStatus('Sending test email…');
    const r = await sendEmail({ user_name: 'Settings page', message: 'EmailJS test from the live site.' });
    setStatus(r.ok ? '✅ Email sent — check your inbox.' : `⚠ ${r.error}`);
  };

  const rows = [
    { label: 'Google Gemini', ok: hasKey() || !!getKey(), note: 'AI features', action: testAI },
    { label: 'Firebase', ok: dbConfigured(), note: 'Data & sessions', action: testDB },
    { label: 'EmailJS', ok: mailConfigured(), note: 'Email from site', action: testMail },
  ];

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
      <motion.img
        src={`${import.meta.env.BASE_URL}assets/img/orbs-trio.webp`}
        alt=""
        aria-hidden
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.25 }}
        className="mx-auto w-56 rounded-2xl"
      />
      <GlassCard>
        <Badge>SETTINGS</Badge>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink">Connect your Google AI key</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Free key from <span className="font-medium text-brand-700">aistudio.google.com</span> → stored only in your
          browser, never sent anywhere except Google.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Input
            aria-label="Gemini API key"
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIza…"
            className="max-w-sm"
          />
          <Button type="button" onClick={save}>Save key</Button>
        </div>
      </GlassCard>

      <GlassCard>
        <h2 className="font-display text-lg font-semibold text-ink">Service status</h2>
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li key={r.label} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/50 bg-white/50 px-4 py-3">
              <div>
                <p className="font-medium text-ink">
                  <span aria-hidden className={r.ok ? 'text-green-600' : 'text-amber-600'}>{r.ok ? '●' : '○'}</span>{' '}
                  {r.label}
                </p>
                <p className="text-sm text-ink-muted">{r.note}</p>
              </div>
              <Button type="button" variant="ghost" onClick={r.action} className="!px-4 !py-2 text-sm">
                Test
              </Button>
            </li>
          ))}
        </ul>
        <p aria-live="polite" className="mt-4 min-h-5 text-sm text-ink-muted">{status}</p>
      </GlassCard>
    </section>
  );
}

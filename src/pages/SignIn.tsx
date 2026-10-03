import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Badge, Button, GlassCard, Input } from '../components/ui';
import { ensureUser } from '../lib/db';
import { saveDoc } from '../lib/db';
import { navigate } from '../lib/router';

/** Sign-in template: Firebase Anonymous session + display-name capture (no passwords to leak). */
export function SignIn() {
  const reduce = useReducedMotion();
  const [name, setName] = useState('');
  const [status, setStatus] = useState<string>();
  const [busy, setBusy] = useState(false);

  const start = async () => {
    setBusy(true);
    const user = await ensureUser();
    if (!user.ok) {
      setStatus(`⚠ ${user.error}`);
      setBusy(false);
      return;
    }
    if (name.trim()) await saveDoc('profiles', 'me', { name: name.trim(), joined: new Date().toISOString() });
    setStatus(`✅ Signed in — welcome${name.trim() ? `, ${name.trim()}` : ''}!`);
    setBusy(false);
    setTimeout(() => navigate('/'), 900);
  };

  return (
      <section className="mx-auto flex max-w-md flex-col items-center px-6 py-16">
        <img
          src={`${import.meta.env.BASE_URL}assets/img/glow-success-alpha.webp`}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          width="1024"
          height="1024"
          className="float-art mb-6 w-44"
        />
        <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full">
        <GlassCard>
          <Badge>SECURE · ANONYMOUS-FIRST</Badge>
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">Welcome</h1>
          <p className="mt-2 text-sm text-ink-muted">
            No passwords, nothing to leak — a private session is created just for you (Firebase Anonymous Auth).
          </p>
          <label htmlFor="name" className="mt-6 block text-sm font-medium text-ink">
            Display name <span className="text-ink-muted">(optional)</span>
          </label>
          <Input
            id="name"
            className="mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
          <Button type="button" className="mt-4 w-full" onClick={start} disabled={busy}>
            {busy ? 'Signing in…' : 'Continue'}
          </Button>
          <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-ink-muted">
            {status}
          </p>
        </GlassCard>
      </motion.div>
    </section>
  );
}

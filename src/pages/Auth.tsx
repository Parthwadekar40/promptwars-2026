import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Badge, Button, GlassCard, Input } from '../components/ui';
import { Icon } from '../components/Icon';
import { OtpInput } from '../components/OtpInput';
import { signInEmail, signUpEmail } from '../lib/db';
import { saveDoc } from '../lib/firestore';
import { issueOtp, verifyOtp, cancelOtp } from '../lib/otp';
import { setProfile, type Profile } from '../lib/auth';
import { navigate } from '../lib/router';
import { whatsappLink } from '../lib/mail';

type Mode = 'signin' | 'signup';
type Step = 'credentials' | 'otp' | 'done';

const WHATSAPP_OWNER = '919975181905';

/** Full auth page — Sign in / Sign up, then email OTP verification. */
export function Auth({ mode }: { mode: Mode }) {
  const reduce = useReducedMotion();
  const isUp = mode === 'signup';
  const [step, setStep] = useState<Step>('credentials');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [cool, setCool] = useState(0);
  const [pending, setPending] = useState<Profile>();

  useEffect(() => {
    if (cool <= 0) return;
    const t = setTimeout(() => setCool((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cool]);

  const switchMode = (m: Mode) => {
    cancelOtp();
    setStep('credentials');
    setStatus(undefined);
    setPassword('');
    setConfirm('');
    setCode('');
    navigate(m === 'signup' ? '/signup' : '/signin');
  };

  const startOtp = async (profile: Profile) => {
    setPending(profile);
    setStep('otp');
    setCode('');
    setStatus('Sending your code…');
    setCool(30);
    const r = await issueOtp(profile.email, profile.name);
    setStatus(r.ok ? `We sent a 6-digit code to ${profile.email}.` : `⚠ ${r.error} — press resend.`);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus(undefined);
    const mail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setStatus('⚠ Please enter a valid email.');
      return;
    }
    if (isUp && name.trim().length < 2) {
      setStatus('⚠ Please enter your name.');
      return;
    }
    if (password.length < 6) {
      setStatus('⚠ Password should be at least 6 characters.');
      return;
    }
    if (isUp && password !== confirm) {
      setStatus('⚠ Passwords do not match.');
      return;
    }
    setBusy(true);
    const r = isUp ? await signUpEmail(name.trim(), mail, password) : await signInEmail(mail, password);
    setBusy(false);
    if (!r.ok) {
      setStatus(`⚠ ${r.error}`);
      return;
    }
    void startOtp(r.data);
  };

  const confirmOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!pending) return;
    const r = verifyOtp(code);
    if (!r.ok) {
      setStatus(`⚠ ${r.error}`);
      return;
    }
    setProfile(pending);
    void saveDoc('profiles', 'me', { name: pending.name, email: pending.email, joined: new Date().toISOString() });
    setStatus('✅ Verified!');
    setStep('done');
    setTimeout(() => navigate('/'), 1800);
  };

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-16">
      {/* ————— art panel ————— */}
      <div className="relative hidden min-h-[520px] overflow-hidden rounded-[18px] lg:block">
        <img
          src={`${import.meta.env.BASE_URL}assets/img/silk-backdrop.webp`}
          alt=""
          aria-hidden
          className="animate-silk mask-fade-all absolute inset-0 size-full object-cover opacity-90"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(140deg, rgba(109,95,247,0.12), transparent 45%, rgba(110,231,183,0.14))',
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Badge>PRIVATE BY DESIGN</Badge>
          <div>
            <p className="t-quote max-w-md">
              Your thinking, your journal — <em className="font-serif font-normal italic">nothing leaves</em> without
              you.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              Password + email OTP · Firebase-backed sessions
            </p>
          </div>
        </div>
      </div>

      {/* ————— form panel ————— */}
      <div className="mx-auto w-full max-w-md">
        <div className="hairline inline-flex rounded-[10px] p-1">
          {(['signin', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              aria-pressed={mode === m}
              className={`rounded-[7px] px-4 py-1.5 text-[13px] font-medium transition-colors ${
                mode === m ? 'bg-ink text-paper' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {m === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <GlassCard className="mt-5">
          <Icon name="user" className="size-11" />
          <Badge>SECURE · PASSWORD + OTP</Badge>

          <AnimatePresence mode="wait">
            {step === 'credentials' && (
              <motion.form
                key="cred"
                onSubmit={submit}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">
                  {isUp ? 'Create your account' : 'Welcome back'}
                </h1>
                <p className="mt-2 text-sm text-ink-muted">
                  {isUp
                    ? 'Sign up, then confirm the code we email you — that’s it.'
                    : 'Sign in with your email — we’ll verify it’s you with a code.'}
                </p>

                {isUp && (
                  <>
                    <label htmlFor="name" className="mt-5 block text-sm font-medium text-ink">
                      Display name
                    </label>
                    <Input
                      id="name"
                      className="mt-2"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Parth Wadekar"
                      autoComplete="name"
                    />
                  </>
                )}

                <label htmlFor="email" className={`${isUp ? 'mt-4' : 'mt-5'} block text-sm font-medium text-ink`}>
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  className="mt-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />

                <label htmlFor="password" className="mt-4 block text-sm font-medium text-ink">
                  Password
                </label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    autoComplete={isUp ? 'new-password' : 'current-password'}
                    className="pr-16"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-medium text-ink-muted hover:text-ink"
                  >
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>

                {isUp && (
                  <>
                    <label htmlFor="confirm" className="mt-4 block text-sm font-medium text-ink">
                      Confirm password
                    </label>
                    <Input
                      id="confirm"
                      type="password"
                      className="mt-2"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat it"
                      autoComplete="new-password"
                    />
                  </>
                )}

                <Button type="submit" className="mt-5 w-full" disabled={busy}>
                  {busy ? 'One moment…' : isUp ? 'Create account' : 'Continue'}
                </Button>
                <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-ink-muted">
                  {status}
                </p>
              </motion.form>
            )}

            {step === 'otp' && (
              <motion.form
                key="otp"
                onSubmit={confirmOtp}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">Check your email</h1>
                <p className="mt-2 text-sm text-ink-muted">
                  Enter the 6-digit code we sent to <span className="font-medium text-ink">{pending?.email}</span>.
                </p>
                <div className="mt-5">
                  <OtpInput value={code} onChange={setCode} />
                </div>
                <Button type="submit" className="mt-5 w-full" disabled={busy}>
                  Verify &amp; continue
                </Button>
                <div className="mt-3 flex items-center justify-between text-[13px]">
                  <button
                    type="button"
                    className="text-ink-muted hover:text-ink"
                    onClick={() => {
                      cancelOtp();
                      setStep('credentials');
                      setStatus(undefined);
                    }}
                  >
                    ← Change email
                  </button>
                  <button
                    type="button"
                    disabled={cool > 0 || busy}
                    onClick={() => pending && void startOtp(pending)}
                    className="font-medium text-ink disabled:opacity-40"
                  >
                    {cool > 0 ? `Resend in ${cool}s` : 'Resend code'}
                  </button>
                </div>
                <p aria-live="polite" className="mt-3 min-h-5 text-center text-sm text-ink-muted">
                  {status}
                </p>
              </motion.form>
            )}

            {step === 'done' && (
              <motion.div
                key="done"
                initial={reduce ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="py-2 text-center"
              >
                <img
                  src={`${import.meta.env.BASE_URL}assets/img/glow-success-alpha.webp`}
                  alt=""
                  aria-hidden
                  className="float-art mx-auto w-36"
                />
                <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
                  Welcome, {pending?.name}!
                </h1>
                <p className="mt-2 text-sm text-ink-muted">You’re verified. Taking you in…</p>
                <a
                  href={whatsappLink(
                    WHATSAPP_OWNER,
                    `Hi Parth! ${pending?.name ?? 'A new user'} just joined Penumbra.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:border-ink/25 hover:bg-white/60"
                >
                  WhatsApp us ↗
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        <p className="mt-4 text-center text-[13px] text-ink-muted">
          {isUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => switchMode(isUp ? 'signin' : 'signup')}
            className="font-medium text-ink underline underline-offset-2 hover:text-brand-600"
          >
            {isUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </section>
  );
}

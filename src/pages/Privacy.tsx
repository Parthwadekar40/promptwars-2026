import { Badge } from '../components/ui';

const POINTS = [
  {
    title: 'What you type',
    body: 'Your decision and answers are sent over HTTPS to a hosted language model for one purpose: writing the analysis you asked for. Penumbra keeps no server-side copy.',
  },
  {
    title: 'What gets saved',
    body: 'Nothing — until you press Save. A saved reflection lives on this device and, if you are signed in, in a private space only your account can read. You can delete any entry at any time.',
  },
  {
    title: 'Keys and accounts',
    body: 'If you add your own AI key it stays in this browser only. Sign-in uses email and password with a one-time code; passwords are handled by the identity provider, never by this app.',
  },
  {
    title: 'No tracking',
    body: 'No analytics, no ad trackers, no third-party cookies.',
  },
  {
    title: 'Not advice',
    body: 'Penumbra asks questions and points out what may be missing. It is not a substitute for a doctor, lawyer or financial adviser — and it never makes the decision for you.',
  },
];

export function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-14 md:pt-20">
      <Badge>Privacy</Badge>
      <h1 className="t-h2 mt-5 font-display font-semibold tracking-tight text-ink">
        Your thinking is <em>yours.</em>
      </h1>
      <dl className="mt-10 divide-y divide-line border-y border-line">
        {POINTS.map((p) => (
          <div key={p.title} className="grid gap-2 py-6 md:grid-cols-[200px_1fr] md:gap-8">
            <dt className="font-display font-semibold text-ink">{p.title}</dt>
            <dd className="leading-relaxed text-ink-muted">{p.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

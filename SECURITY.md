# Security notes — Penumbra

Penumbra is a static single-page app (GitHub Pages) that calls Google's Gemini API, Firebase Auth and Cloud Firestore directly from the browser. This page states what is protected, how, and — honestly — what is not.

## Threat model

| Threat | Mitigation in this repo | Residual risk / production note |
|---|---|---|
| **Prompt injection** through the decision text | User text is stripped of control characters and `<` `>` (so it cannot close the data tags), length-bounded, and sent inside `<decision>` / `<leaning>` / `<answers>` tags the system prompt declares to be *data*. The model has **no tools and no access to anything** — it can only return JSON. Its output passes a response schema, defensive parsing and the neutrality guard, and is rendered as plain text by React. | A manipulated answer is still just text on the user's own screen. |
| **XSS** | No `dangerouslySetInnerHTML` anywhere; React escapes all output; build-time **Content-Security-Policy** (`script-src 'self'`, network limited to the Google endpoints and the mail API, `object-src 'none'`). | Firebase tokens live in `localStorage` (common for SPAs): an XSS bug would expose them. CSP + no HTML injection are the compensating controls. |
| **API key in the client bundle** | The repo contains **no secrets** (working tree and full git history scanned). The demo key is a free-tier key injected by GitHub Actions at build time; users can supply their own (stored only in their browser). Model failover and a per-model cool-down limit what a copied key can burn. | A static site cannot hide a shared key. Production: proxy Gemini through a server function (Cloud Run / Firebase Functions) and restrict the key by HTTP referrer + API. |
| **Data exposure** | Journal documents live at `users/{uid}/reflections/*`; [`firestore.rules`](firestore.rules) allow access only to the signed-in owner and deny everything else. Verified live: a second account receives **403** on another user's path. Entries can be deleted at any time. Nothing is stored unless the user presses *Save*. | — |
| **Weak sign-in** | Firebase Auth (email + password) is the real credential. The email one-time code is a UX confirmation checked in the browser — **not** a security boundary. | Enable Firebase email-enumeration protection / MFA for production. |
| **Vulnerable dependencies** | Lockfile committed; `npm audit` reports **0 high/critical**; two moderate advisories sit in dev-only test tooling (`@vitest/mocker`) and are never shipped. Dependabot is configured (`.github/dependabot.yml`). | — |
| **Abuse / quota exhaustion** | Inputs are length-bounded; hedged requests are capped by the model chain; a rate-limited model is skipped for 60 s; the UI degrades to a pre-written sample. | A proxy with per-user rate limits is the production answer. |
| **Mis-delivery of email** | Every send takes an explicit recipient (the address the person typed) and refuses to send without one. | — |

## Verify it yourself

```bash
git log -p --all | grep -E "AIza|ghp_|github_pat_"   # expect: nothing
npm audit --audit-level=high                           # expect: no high/critical
npm test                                               # includes neutrality-guard, OTP and Firestore token-refresh tests
```

## Reporting

Open a GitHub issue (no secrets, please) or message the author via the links in the README.

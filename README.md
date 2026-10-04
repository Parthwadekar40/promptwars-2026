# Penumbra — a thinking companion for *The Blind Spot*

> Describe a decision. Penumbra shows you what you are **not** looking at — the assumptions, risks and missing pieces — asks the questions worth sitting with, and then steps back. **The decision stays yours.**

**Live:** https://parthwadekar40.github.io/promptwars-2026/ · **Try it in 10 seconds:** [open the instant sample](https://parthwadekar40.github.io/promptwars-2026/#/think?sample)

**Author:** [Parth Wadekar](https://github.com/Parthwadekar40) · [LinkedIn](https://www.linkedin.com/in/parth-wadekar-18027728b) · [Instagram](https://www.instagram.com/parthwadekar16)

Built for **PromptWars 2026** (Google for Developers × EI SVPCET), challenge **"The Blind Spot"**.
A *penumbra* is the half-lit edge of a shadow — the part you half-see. That is where blind spots live.

---

## 1 · The official brief → what is built (requirements traceability)

> **Problem statement.** *"People often make decisions based on the information that is most visible to them. In the process, they may overlook important factors, rely on unstated assumptions, or fail to recognize conflicts within their own reasoning."*
> **Challenge.** *"Build an AI-powered solution that helps users identify potential blind spots in their reasoning when considering a decision. The solution should encourage users to examine their assumptions, recognize what they may have overlooked, and explore questions that could lead to a more informed decision. The system should not make the decision for the user."*

| # | Requirement (verbatim) | How Penumbra delivers it | Where |
|---|---|---|---|
| 1 | "information that is **most visible** to them" | A *spotlight card* sets **what you noticed first** (in the light) beside **what sits outside the light** | `think/SpotlightCard.tsx` · `analyze.ts` (`noticedFirst`, `outside`) |
| 2 | "rely on **unstated assumptions**" | Lens 01 — assumptions you never stated, each with a cheap way to test it this week | `Results.tsx` · schema `assumptions[{assumption, check}]` |
| 3 | "fail to recognize **conflicts within their own reasoning**" | Lens 02 — your *stated reasons* are held up against *the facts you gave*; conflicts are quoted in your own words. The Reflect pass later names **tensions between your answers** | schema `conflicts[{conflict, toResolve}]` · `analyze.ts` rule 6 · `reflectOn()` |
| 4 | "**overlook important factors**" | Lens 04 — other commitments, what you would *actually* get, where each option leads in 1–5 years, alternatives, people affected, reversibility · plus Lens 03 risks, Lens 05 the strongest case for the side you are *not* leaning toward, Lens 06 thinking traps | schema `missing`, `risks`, `otherSide`, `traps` |
| 5 | "**examine** their assumptions, **recognize** what they may have overlooked" | **Examine**: tick each item you have actually checked; a live meter counts *blind spots examined* (it measures your reflection, never the decision) | `useThinking.ts` · `ProgressBar.tsx` |
| 6 | "**explore questions** that could lead to a more informed decision" | Five open, situation-specific questions per decision, answered in place. Yes/no and leading questions are prohibited by the prompt | `analyze.ts` · `Results.tsx` Lens 07 |
| 7 | "**should not make the decision** for the user … think more critically" | **Neutrality guard in three layers** (§3) + a final **Your call** step only the user can write, saved to a private journal | `lib/guard.ts` (+ tests) · `YourCall.tsx` · `lib/journal.ts` |
| 8 | "demonstrate **meaningful use of AI**" | Schema-constrained analysis; a **second, dependent AI pass** that consumes *your* answers (quotes them, finds tensions); reasons-vs-facts conflict detection; model chain with hedged requests | `analyze.ts` · `gemini.ts` |
| 9 | "deployed and accessible through a **working link**" | GitHub Pages, deployed by GitHub Actions after lint + tests | `.github/workflows/deploy.yml` |
| 10 | "**no organizer-provided dataset**" | None needed — prompting + structured output. The brief's own example ships as the built-in sample | `data/examples.ts` |
| 11 | The brief's example: *a student weighing a 6-month internship for the stipend, proximity and "industry experience"* | It is the default example and the instant sample: it surfaces **impact on academics**, **actual learning and mentorship**, **long-term career prospects**, and questions each assumption | open `#/think?sample` |

## 2 · Google services

| Service | Role | Where |
|---|---|---|
| **Gemini API** (`@google/genai`, Google AI Studio key) | Structured analysis + reflection via `responseSchema` JSON output. Model chain across **7 Gemini models** (independent quota buckets) with instant failover, 60 s cool-down for rate-limited models and **hedged requests** (the next model races a slow one; the loser is aborted) | `src/lib/gemini.ts`, `src/lib/analyze.ts` |
| **Firebase Authentication** (Identity Toolkit REST) | Email + password accounts, session refresh | `src/lib/db.ts`, `src/pages/Auth.tsx` |
| **Cloud Firestore** (REST) | Private per-user **decision journal** at `users/{uid}/reflections`; owner-only security rules | `src/lib/db.ts`, `src/lib/journal.ts`, [`firestore.rules`](firestore.rules) |
| **Google Fonts** | Instrument Sans / Instrument Serif / Inter / JetBrains Mono | `index.html` |

*(Firebase is called over REST — ~3 KB instead of the ~120 KB SDK.)*

## 3 · "It never decides for you" — enforced, not promised

1. **Prompt.** Hard rules: never recommend, rank, score or choose; no verdicts, not even softened ones; questions must be open and may never steer toward an option. The person's text is wrapped in data tags and treated as data, not instructions.
2. **Schema.** The response format has **no "recommendation" field at all** — the model has nowhere to put a verdict.
3. **Code.** [`lib/guard.ts`](src/lib/guard.ts) inspects every sentence of every response (questions are exempt — they are the product) against advice patterns (*"you should…"*, *"I recommend…"*, *"the better option…"*, *"go with…"*). Anything that matches is **removed before you see it**, and the UI states the result: *"Neutrality check passed"* or *"removed N lines that read like advice"*. Unit-tested.
4. **UX.** The final step, **Your call**, is a blank page for the user's own words plus *"what would change my mind"*. Penumbra files it in a private journal and says nothing.

## 4 · The experience

`Describe` → `Illuminate` → `Examine` → `Reflect` → `Your call`

- **Describe** — the details of the decision, and (optionally) your own reasons for leaning one way. Four starter examples, the first being the brief's internship scenario.
- **Illuminate** — spotlight card (noticed first ⟷ outside the light), then **seven lenses**: assumptions · conflicts in your reasoning · risks · overlooked factors · the other side · thinking traps · questions.
- **Examine** — tick items you have actually checked; answer the questions. A sticky meter counts *blind spots examined* (it measures your reflection, never the decision).
- **Reflect** — what your answers changed, a tension worth noticing, what is still unexamined, one question to sit with.
- **Your call** — written by you; saved to the **journal** (device, or private cloud when signed in); copy as Markdown; delete any time.
- **Instant sample** — `#/think?sample` loads a pre-written analysis with zero latency (also the graceful fallback when the AI is rate-limited and the untouched starter example is used).
- A **care note** appears first if the situation touches someone's safety or wellbeing.

## 5 · Architecture

```
src/
  lib/         analyze.ts   prompts · response schema · defensive parsing · analyze & reflect
               guard.ts     neutrality guard (pure functions)
               gemini.ts    model chain · cool-down · hedged requests · structured output
               journal.ts   device + cloud journal, Markdown export     db.ts  Firebase REST (auth + Firestore)
               auth.ts · otp.ts · mail.ts · router.ts · result.ts
  hooks/       useThinking.ts   one session: describe → illuminate → examine → reflect
  components/  think/ (Compose · Pending · Results · SpotlightCard · ProgressBar · ReflectionCard · YourCall)
               Spotlight · Reveal · Atmosphere · Marquee · AppShell · ErrorBoundary · ui
  pages/       Landing · Think · Journal · Auth · Connect (settings) · Privacy · NotFound
  data/        examples.ts   starter decisions + the instant sample
```

Stack: Vite 7 · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · Vitest + React Testing Library · GitHub Actions → GitHub Pages.

## 6 · Quality

### Efficiency
- First load ≈ **125 KB gzip** (app 79 KB + motion 45 KB). The Gemini SDK (56 KB gz) and the Think workspace (10 KB gz) are **lazy chunks** loaded only when needed.
- **Failover without waiting:** the SDK's built-in 5× retry cost ~25 s on a rate-limited model — it is disabled; failover is instant. Hedged requests cap the tail latency at ~7 s + one normal call. Losers are cancelled with `AbortController`.
- Typical analysis: **≈ 3–5 s**; reflection **≈ 2–4 s**.
- Journal merge is **O(n)** (`Map` by id); progress is derived with `useMemo`; the pointer-spotlight animation pauses off-screen (`IntersectionObserver`) and cleans up on unmount.

### Security
- **No secrets in the repo.** Keys are injected at build time from GitHub Actions secrets; `.env*` is git-ignored. A user's own AI key stays in their browser (`localStorage`) and is sent only to the AI provider. (A static site cannot hide a shared demo key — production would proxy it server-side.)
- **Content-Security-Policy** (build-time `<meta>`): scripts `'self'`; network limited to the four Google endpoints + the mail API; `object-src 'none'`.
- **Prompt-injection hardening:** user text is stripped of control characters and `<` `>` (so it cannot close the data tags), length-bounded, and delimited as data.
- Firestore rules ([`firestore.rules`](firestore.rules)): a user can read/write only `users/{their uid}/…`; everything else is denied.
- No `dangerouslySetInnerHTML`; external links use `rel="noopener noreferrer"`; an error boundary keeps stack traces out of the UI; a [privacy page](https://parthwadekar40.github.io/promptwars-2026/#/privacy) states exactly what happens to your words.

### Accessibility
- Landmarks (`header` / `nav` / `main` / `footer`), a **skip link**, one `h1` per view and a clean `h2` hierarchy.
- Every field has a real `<label>`; the examine toggles are `aria-pressed` buttons with names; the meter is a `role="progressbar"`; results and status messages use `aria-live`; errors use `role="alert"`.
- **Focus management:** after the analysis arrives, focus moves to the result heading.
- Fully keyboard-operable (native `<details>` for the journal); visible `:focus-visible` ring.
- **Contrast:** secondary text darkened to **5.3 : 1** on the paper background (WCAG AA).
- `prefers-reduced-motion` disables every animation, the flashlight drift and the reveal effects.

### Testing — `npm test` (28 tests, run in CI before every deploy)
| Area | What is proven |
|---|---|
| Neutrality guard | flags advice ("you should", "I recommend", "better option"); lets questions through; removes & counts offending lines in analyses and reflections; leaves clean output untouched |
| Analysis engine | rejects too-short input before any network call; strips `<` `>` so user text cannot break out of its data tags; parses messy model output without throwing |
| Failover | a faster hedged model wins and the slow one is aborted; instant failover on error; last error reported when all fail; model chain has independent buckets |
| Journal | Markdown export; device save / newest-first / delete; saving twice overwrites instead of duplicating |
| UI flows | empty-input guard; sample → counting examined blind spots; the final call needs the user's words, then lands in the journal; 404; shared-link sample; auth validation; `Button` styling regression |

## 7 · Run it

```bash
npm install
cp .env.example .env     # add a free Google AI Studio key (VITE_GEMINI_API_KEY) — optional: Firebase / EmailJS
npm run dev              # dev server
npm test                 # 28 tests
npm run build            # type-check + production build → dist/
```

Without a key the site still works: **See a sample** shows a full pre-written analysis, and Settings lets anyone paste their own free key.

## 8 · Demo path (2 minutes)

1. **Home** → *See a sample* (the brief's internship scenario) → the spotlight card, seven lenses, 19 things to examine.
2. Tick a few items, answer a question → watch the meter → **Reflect** → read the tension it finds in *your* words.
3. Write **Your call** → *Save to my journal* → **Journal** (copy as Markdown, delete).
4. Back on **Think**, try your own decision (or an example chip) with the live AI.
5. Optional: **Sign up** (email + one-time code) → the journal now syncs privately across devices.

## 9 · Design

Warm paper `#e4ded3` · ink `#171412` · brand violet `#5b4bf5` → mint `#6ee7b7`. Type: Instrument Sans · *Instrument Serif* (italic accents) · Inter · JetBrains Mono. The metaphor runs through everything: **light and shadow** — the spotlight card, the dark "blind spot" band whose hidden thoughts you reveal with a moving light, the breathing orb while it thinks.

---

MIT © 2026 Parth Wadekar

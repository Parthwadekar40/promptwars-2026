# PromptWars 2026

> An intelligent workspace powered by Google Gemini — fast, private, and a genuine pleasure to use.

**Author:** [Parth Wadekar](https://github.com/Parthwadekar40) · [LinkedIn](https://www.linkedin.com/in/parth-wadekar-18027728b) · [Instagram](https://www.instagram.com/parthwadekar16)

**Live:** https://parthwadekar40.github.io/promptwars-2026/

## What it does

- **Landing** — the product story: brutal-scale type, a glass-study film loop, drifting atmosphere, page-wide brand-gradient cursor glow.
- **Sign in** — Firebase Anonymous Auth (no passwords to leak) + display-name capture.
- **Settings** — connect a Google AI Studio key (stored in the visitor's `localStorage` only) + one-tap live health checks for every integration.

## Stack

- Vite 7 · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion
- Vitest + React Testing Library (4/4 passing) · GitHub Pages deployed via GitHub Actions

## Services

| Service | Where | What for |
|---|---|---|
| Google Gemini API | `src/lib/gemini.ts` | AI generation — bring-your-own key from AI Studio |
| Firebase Anonymous Auth + Firestore | `src/lib/db.ts` (REST, ~2 KB — no heavy SDK) | Private sessions + per-user data |
| EmailJS | `src/lib/mail.ts` (REST) | Waitlist / notify emails |

## Run locally

```bash
npm install
npm run dev      # dev server
npm test         # test suite
npm run build    # production build → dist/
```

## Security

- **No secrets live in this repository.** Build-time keys are injected via GitHub Actions secrets (`GEMINI_API_KEY`, `FIREBASE_*`, `EMAILJS_*`).
- Firebase / EmailJS web config is public-by-design (it must ship in any client bundle); access is enforced by **Firestore Security Rules** and EmailJS **origin allowlisting** — never by hiding config.
- User-supplied Gemini keys are stored only in the visitor's `localStorage`, and are sent only to Google.

## Design system

- Type: Instrument Sans · Instrument Serif *italic* · Inter · JetBrains Mono
- Paper `#e4ded3` · ink `#171412` · brand gradient `#6d5ff7 → #a78bfa → #6ee7b7`
- All art is custom-generated glass imagery, background-keyed to melt seamlessly into the page

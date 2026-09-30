# PromptWars 2026

> Build repository for **PromptWars 2026** — the 3-hour AI build challenge at Google Office, Gurugram.

**Status:** starter scaffold pushed & CI-verified · final solution lands on event day.

## Stack

- Vite + React 19 + TypeScript (strict) · Tailwind CSS v4 · Framer Motion
- Google Gemini API (`@google/genai`, Google AI Studio) — 2026-verified model chain
- Vitest + React Testing Library · GitHub Pages deployment via Actions

## Run locally

```bash
npm install
npm run dev      # dev server
npm test         # test suite
npm run build    # production build → dist/
```

## Security note

No secrets live in this repository. The Gemini API key is injected at **build time** via the
`GEMINI_API_KEY` Actions secret, and end users may supply their own key (stored only in
`localStorage`). See `src/lib/gemini.ts`.

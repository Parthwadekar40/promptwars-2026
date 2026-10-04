import type { Analysis, Item, Reflection } from './analyze';

/**
 * Neutrality guard — the product's one hard promise: it never decides for you.
 * Layer 1 is the prompt + response schema (there is no "recommendation" field).
 * Layer 2 is this check, which runs in code on every response before it is shown.
 */
const ADVICE: RegExp[] = [
  /\byou (?:should|must|ought to|need to|have to|had better)\b/i,
  /\byou(?:'d| would) (?:be )?better (?:off )?(?:to |if |by )?/i,
  /\bi (?:would |'d |strongly )?(?:recommend|suggest|advise|urge)\b/i,
  /\bmy (?:advice|recommendation|suggestion|verdict)\b/i,
  /\b(?:the )?(?:best|right|wisest|smarter|better) (?:choice|option|decision|path|move|call)\b/i,
  /\bgo (?:ahead )?(?:with|for)\b/i,
  /\b(?:don't|do not|never) (?:take|accept|quit|leave|go|do|choose)\b/i,
];

/** Questions are the product, never advice — only statements are inspected. */
export function isDirective(text: string): boolean {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => !sentence.trim().endsWith('?'))
    .some((sentence) => ADVICE.some((rule) => rule.test(sentence)));
}

const keepText = (text: string, tally: { n: number }): string => {
  if (!isDirective(text)) return text;
  tally.n += 1;
  return '';
};

const keepItems = (items: Item[], tally: { n: number }): Item[] =>
  items.filter((i) => {
    const bad = isDirective(i.text) || isDirective(i.hint);
    if (bad) tally.n += 1;
    return !bad;
  });

const keepLines = (lines: string[], tally: { n: number }): string[] =>
  lines.filter((l) => keepText(l, tally) !== '');

/** Remove every advice-shaped line from an analysis; reports how many were removed. */
export function neutralize(a: Analysis): { clean: Analysis; removed: number } {
  const t = { n: 0 };
  const clean: Analysis = {
    ...a,
    heard: keepText(a.heard, t),
    noticedFirst: keepText(a.noticedFirst, t),
    outside: keepText(a.outside, t),
    otherSide: keepText(a.otherSide, t),
    assumptions: keepItems(a.assumptions, t),
    conflicts: keepItems(a.conflicts, t),
    risks: keepItems(a.risks, t),
    missing: keepItems(a.missing, t),
    traps: keepItems(a.traps, t),
    questions: keepLines(a.questions, t),
  };
  return { clean, removed: t.n };
}

export function neutralizeReflection(r: Reflection): { clean: Reflection; removed: number } {
  const t = { n: 0 };
  const clean: Reflection = {
    shifted: keepLines(r.shifted, t),
    tension: keepText(r.tension, t),
    stillOpen: keepLines(r.stillOpen, t),
    oneQuestion: keepText(r.oneQuestion, t),
  };
  return { clean, removed: t.n };
}

import { generateJSON } from './gemini';
import { neutralize, neutralizeReflection } from './guard';
import { ANALYSIS_GUIDE, ANALYSIS_SCHEMA, REFLECT_GUIDE, REFLECT_SCHEMA, RULES } from './prompts';
import type { Result } from './result';

export type Item = { text: string; hint: string };
export type Analysis = {
  title: string;
  heard: string;
  noticedFirst: string;
  outside: string;
  assumptions: Item[];
  conflicts: Item[];
  risks: Item[];
  missing: Item[];
  traps: Item[];
  otherSide: string;
  questions: string[];
  care: string;
};
export type Reflection = { shifted: string[]; tension: string; stillOpen: string[]; oneQuestion: string };
export type Answered = { question: string; answer: string };

export const LIMITS = { min: 15, decision: 1500, leaning: 600, answer: 800 } as const;

/** Strip control characters and angle brackets (they could close our data tags), then bound the length. */
export function cleanInput(text: string, max: number): string {
  let out = '';
  for (const ch of text.slice(0, max * 2)) {
    const c = ch.codePointAt(0) ?? 0;
    const control = c < 32 && c !== 9 && c !== 10 && c !== 13; // keep tab / newline
    if (!control && ch !== '<' && ch !== '>') out += ch;
  }
  return out.trim().slice(0, max);
}

export function validateDecision(text: string): string | null {
  return cleanInput(text, LIMITS.decision).length < LIMITS.min
    ? 'Tell me a little more — a sentence or two about what you are deciding.'
    : null;
}

export function buildPrompt(decision: string, leaning: string): string {
  const d = cleanInput(decision, LIMITS.decision);
  const l = cleanInput(leaning, LIMITS.leaning) || '(not stated)';
  return `<decision>\n${d}\n</decision>\n<leaning>\n${l}\n</leaning>\n\nReturn the JSON analysis.`;
}

const s = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v.slice(0, 6) : []);
const field = (o: unknown, k: string): unknown => (o as Record<string, unknown> | null)?.[k];
const items = (v: unknown, a: string, b: string): Item[] =>
  list(v)
    .map((x) => ({ text: s(field(x, a)), hint: s(field(x, b)) }))
    .filter((i) => i.text);

/** Defensive parse — a model slip can never crash the UI. */
export function toAnalysis(raw: unknown): Analysis {
  return {
    title: s(field(raw, 'title')) || 'Your decision',
    heard: s(field(raw, 'heard')),
    noticedFirst: s(field(raw, 'noticedFirst')),
    outside: s(field(raw, 'outside')),
    otherSide: s(field(raw, 'otherSide')),
    care: s(field(raw, 'care')),
    assumptions: items(field(raw, 'assumptions'), 'assumption', 'check'),
    conflicts: items(field(raw, 'conflicts'), 'conflict', 'toResolve'),
    risks: items(field(raw, 'risks'), 'risk', 'warningSign'),
    missing: items(field(raw, 'missing'), 'factor', 'whyItMatters'),
    traps: items(field(raw, 'traps'), 'name', 'whereItShows'),
    questions: list(field(raw, 'questions')).map(s).filter(Boolean),
  };
}

function toReflection(raw: unknown): Reflection {
  return {
    shifted: list(field(raw, 'shifted')).map(s).filter(Boolean),
    tension: s(field(raw, 'tension')),
    stillOpen: list(field(raw, 'stillOpen')).map(s).filter(Boolean),
    oneQuestion: s(field(raw, 'oneQuestion')),
  };
}

const friendly = (e: string): string =>
  /429|RESOURCE_EXHAUSTED|quota/i.test(e)
    ? 'The shared AI quota is busy right now. Try again in a minute — or add your own free key in Settings.'
    : /No API key/i.test(e)
      ? 'No AI key is connected — add your free key in Settings.'
      : e;

/** Pass 1 — illuminate: everything outside the person's light. */
export async function analyzeDecision(
  decision: string,
  leaning = '',
): Promise<Result<{ analysis: Analysis; removed: number }>> {
  const invalid = validateDecision(decision);
  if (invalid) return { ok: false, error: invalid };
  const r = await generateJSON<unknown>(buildPrompt(decision, leaning), {
    system: RULES + ANALYSIS_GUIDE,
    schema: ANALYSIS_SCHEMA,
    temperature: 0.8,
    maxTokens: 4096,
  });
  if (!r.ok) return { ok: false, error: friendly(r.error) };
  const { clean, removed } = neutralize(toAnalysis(r.data));
  if (!clean.assumptions.length && !clean.questions.length)
    return { ok: false, error: 'The analysis came back empty — please try again.' };
  return { ok: true, data: { analysis: clean, removed } };
}

type ReflectInput = {
  decision: string;
  leaning: string;
  answers: Answered[];
  examined: string[];
  open: string[];
};

/** Pass 2 — reflect: what the person's own answers changed, and where they pull against each other. */
export async function reflectOn(input: ReflectInput): Promise<Result<{ reflection: Reflection; removed: number }>> {
  const bullets = (xs: string[]) => xs.map((x) => `- ${cleanInput(x, 200)}`).join('\n') || '(none)';
  const answers =
    input.answers.map((a) => `Q: ${cleanInput(a.question, 300)}\nA: ${cleanInput(a.answer, LIMITS.answer)}`).join('\n\n') ||
    '(none yet)';
  const body = [
    buildPrompt(input.decision, input.leaning).replace('\n\nReturn the JSON analysis.', ''),
    `<answers>\n${answers}\n</answers>`,
    `Marked as examined:\n${bullets(input.examined)}`,
    `Still unexamined:\n${bullets(input.open)}`,
    'Return the JSON reflection.',
  ].join('\n\n');
  const r = await generateJSON<unknown>(body, {
    system: RULES + REFLECT_GUIDE,
    schema: REFLECT_SCHEMA,
    temperature: 0.7,
    maxTokens: 2048,
  });
  if (!r.ok) return { ok: false, error: friendly(r.error) };
  const { clean, removed } = neutralizeReflection(toReflection(r.data));
  return { ok: true, data: { reflection: clean, removed } };
}

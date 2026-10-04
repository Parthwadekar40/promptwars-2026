import { GoogleGenAI } from '@google/genai';
import type { Schema } from '@google/genai';
import type { Result } from './result';
export type { Result };

/**
 * Google Gemini access — behavior verified live in 2026:
 *  - every model has its own free-tier quota bucket, so a wide chain keeps answering under load;
 *  - the SDK's built-in 5× retry on 429 cost ~25 s, so it is disabled — failover to the next model is instant;
 *  - a rate-limited model is skipped for a minute, so later calls go straight to one that works;
 *  - hedged requests: if a model has not answered within HEDGE_MS, the next one races it and the loser is aborted;
 *  - Gemini 3.x flash models think by default (thinkingBudget 0 = fast; opts.think = deep reasoning).
 * Key priority: (1) localStorage user key (2) build-time VITE_GEMINI_API_KEY. Nothing secret is committed.
 */
const KEY_STORE = 'pw_gemini_key';
export const MODELS = [
  'gemini-3.5-flash-lite', // measured fastest at event time — ordered by latency, then by depth
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
] as const;

const COOLDOWN_MS = 60_000;
const HEDGE_MS = 9_000;

/** The model that answered last — tried first next time, so the session settles on whatever is fast right now. */
let preferred = '';
const coolUntil = new Map<string, number>();

export const getKey = (): string =>
  localStorage.getItem(KEY_STORE) || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
export const setKey = (key: string): void => localStorage.setItem(KEY_STORE, key.trim());
export const hasKey = (): boolean => getKey().length > 10;

interface GenOpts {
  system?: string;
  json?: boolean;
  /** JSON schema (OpenAPI subset) — the model must answer in exactly this shape. */
  schema?: unknown;
  temperature?: number;
  /** true = allow deep thinking (slower, better reasoning, larger token budget) */
  think?: boolean;
  /** output-token ceiling (default 2048, or 8192 when thinking) */
  maxTokens?: number;
  signal?: AbortSignal;
}

/** Models not cooling down, in preference order (all of them if every one is cooling). */
function chain(): string[] {
  const now = Date.now();
  const ready: string[] = MODELS.filter((m) => (coolUntil.get(m) ?? 0) <= now);
  const order = ready.length ? ready : [...MODELS];
  return order.includes(preferred) ? [preferred, ...order.filter((m) => m !== preferred)] : order;
}

export type Attempt = (signal: AbortSignal) => Promise<Result<string>>;

/**
 * First success wins. Attempts start in order; the next one starts as soon as the previous fails
 * — or after `hedgeMs` of silence — and every loser is aborted the moment a winner arrives.
 */
export function firstSuccess(attempts: Attempt[], hedgeMs: number): Promise<Result<string>> {
  return new Promise((resolve) => {
    const controllers: AbortController[] = [];
    let launched = 0;
    let settled = 0;
    let done = false;
    let lastErr = 'Unknown error';

    const launch = (): void => {
      if (done || launched >= attempts.length) return;
      const controller = new AbortController();
      controllers.push(controller);
      const timer = setTimeout(launch, hedgeMs);
      void attempts[launched++](controller.signal).then((r) => {
        clearTimeout(timer);
        if (done) return;
        if (r.ok) {
          done = true;
          controllers.forEach((c) => c.abort());
          resolve(r);
          return;
        }
        lastErr = r.error;
        if (++settled === attempts.length) resolve({ ok: false, error: lastErr });
        else launch();
      });
    };
    launch();
  });
}

/** Calls Gemini across the model chain with instant failover and hedged retries. */
export async function generate(prompt: string, opts: GenOpts = {}): Promise<Result<string>> {
  const key = getKey();
  if (!key) return { ok: false, error: 'No API key connected — add your free Google AI Studio key.' };
  if (opts.signal?.aborted) return { ok: false, error: 'Cancelled' };
  const ai = new GoogleGenAI({ apiKey: key, httpOptions: { timeout: 25_000, retryOptions: { attempts: 1 } } });
  const configFor = (model: string) => ({
    temperature: opts.temperature ?? 0.7,
    maxOutputTokens: opts.maxTokens ?? (opts.think ? 8192 : 2048),
    // lite models reject an explicit thinking budget
    ...(opts.think || model.includes('lite') ? {} : { thinkingConfig: { thinkingBudget: 0 } }),
    ...(opts.system ? { systemInstruction: opts.system } : {}),
    ...(opts.json || opts.schema ? { responseMimeType: 'application/json' } : {}),
    ...(opts.schema ? { responseSchema: opts.schema as Schema } : {}),
  });

  const won: string[] = []; // models that answered, in order — the first is the winner
  const attempt = (model: string): Attempt => async (signal) => {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { ...configFor(model), abortSignal: signal },
      });
      if (res.text) {
        won.push(model);
        return { ok: true, data: res.text };
      }
      return {
        ok: false,
        error:
          res.candidates?.[0]?.finishReason === 'MAX_TOKENS'
            ? 'Response truncated — retry with a shorter task or thinking mode.'
            : 'Empty response',
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (signal.aborted) return { ok: false, error: 'Cancelled' };
      if (/API key|401|403/i.test(msg)) return { ok: false, error: 'Invalid API key — check and re-connect.' };
      if (/429|RESOURCE_EXHAUSTED|quota|503|504|UNAVAILABLE|overloaded|high demand|timeout|DEADLINE/i.test(msg))
        coolUntil.set(model, Date.now() + COOLDOWN_MS);
      return { ok: false, error: msg };
    }
  };

  const r = await firstSuccess(chain().map(attempt), HEDGE_MS);
  if (r.ok && won[0]) preferred = won[0];
  return r.ok ? r : { ok: false, error: /API key/.test(r.error) ? r.error : `Gemini request failed: ${r.error}` };
}

/** Structured output helper — parses JSON, returns typed Result. */
export async function generateJSON<T>(prompt: string, opts: Omit<GenOpts, 'json'> = {}): Promise<Result<T>> {
  const res = await generate(prompt, { ...opts, json: true });
  if (!res.ok) return res;
  try {
    return { ok: true, data: JSON.parse(res.data.replace(/^```json\s*|\s*```$/g, '')) as T };
  } catch {
    return { ok: false, error: 'The AI returned an unreadable answer — please try again.' };
  }
}

import { GoogleGenAI } from '@google/genai';
import type { Result } from './result';
export type { Result };

/**
 * Google Gemini access — 2026-verified behavior:
 * model chain beats 503 demand spikes; Gemini 3.x thinks by default
 * (thinkingBudget: 0 for fast deterministic output, opts.think for deep reasoning).
 * Key priority: (1) localStorage user key (2) build-time VITE_GEMINI_API_KEY (3) demo mode.
 * Nothing secret is ever committed to source control.
 */
const KEY_STORE = 'pw_gemini_key';
export const MODELS = [
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-flash-lite-latest',
] as const;

export const getKey = (): string =>
  localStorage.getItem(KEY_STORE) || (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
export const setKey = (key: string): void => localStorage.setItem(KEY_STORE, key.trim());
export const hasKey = (): boolean => getKey().length > 10;

interface GenOpts {
  system?: string;
  json?: boolean;
  temperature?: number;
  /** true = allow deep thinking (slower, better reasoning, larger token budget) */
  think?: boolean;
  signal?: AbortSignal;
}

/** Calls Gemini with model fallback + retry/backoff on 503 demand spikes. */
export async function generate(prompt: string, opts: GenOpts = {}): Promise<Result<string>> {
  const key = getKey();
  if (!key) return { ok: false, error: 'No API key connected — add your free Google AI Studio key.' };
  const ai = new GoogleGenAI({ apiKey: key });
  const config = {
    temperature: opts.temperature ?? 0.7,
    maxOutputTokens: opts.think ? 8192 : 2048,
    ...(opts.think ? {} : { thinkingConfig: { thinkingBudget: 0 } }),
    ...(opts.system ? { systemInstruction: opts.system } : {}),
    ...(opts.json ? { responseMimeType: 'application/json' } : {}),
  };
  let lastErr = 'Unknown error';
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (opts.signal?.aborted) return { ok: false, error: 'Cancelled' };
      try {
        const res = await ai.models.generateContent({ model, contents: prompt, config });
        const text = res.text;
        if (text) return { ok: true, data: text };
        lastErr =
          res.candidates?.[0]?.finishReason === 'MAX_TOKENS'
            ? 'Response truncated — retry with a shorter task or thinking mode.'
            : 'Empty response';
      } catch (e) {
        lastErr = e instanceof Error ? e.message : String(e);
        if (/API key|401|403/i.test(lastErr))
          return { ok: false, error: 'Invalid API key — check and re-connect.' };
        if (!/503|UNAVAILABLE|high demand/i.test(lastErr)) break;
        await new Promise((r) => setTimeout(r, 300 * (attempt + 1))); // backoff on demand spikes
      }
    }
  }
  return { ok: false, error: `Gemini request failed: ${lastErr}` };
}

/** Structured output helper — parses JSON, returns typed Result. */
export async function generateJSON<T>(prompt: string, opts: Omit<GenOpts, 'json'> = {}): Promise<Result<T>> {
  const res = await generate(prompt, { ...opts, json: true });
  if (!res.ok) return res;
  try {
    return { ok: true, data: JSON.parse(res.data.replace(/^```json\s*|\s*```$/g, '')) as T };
  } catch {
    return { ok: false, error: 'Gemini returned invalid JSON — retrying usually fixes this.' };
  }
}

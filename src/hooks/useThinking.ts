import { useCallback, useMemo, useState } from 'react';
import { analyzeDecision, reflectOn, validateDecision } from '../lib/analyze';
import type { Analysis, Answered, Item, Reflection } from '../lib/analyze';
import { EXAMPLES, SAMPLE } from '../data/examples';

export type Kind = 'a' | 'c' | 'r' | 'm';
export const markKey = (kind: Kind, i: number): string => `${kind}${i}`;

type Phase = 'compose' | 'loading' | 'results';
const MIN_ANSWER = 8; // characters before a typed answer counts as "examined"

/** All state for one thinking session: describe → illuminate → examine → reflect. */
export function useThinking() {
  const [phase, setPhase] = useState<Phase>('compose');
  const [decision, setDecision] = useState('');
  const [leaning, setLeaning] = useState('');
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [removed, setRemoved] = useState(0);
  const [sample, setSample] = useState(false);
  const [marks, setMarks] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<string[]>([]);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [reflecting, setReflecting] = useState(false);
  const [reflectError, setReflectError] = useState('');

  const show = useCallback((a: Analysis, n: number, isSample: boolean) => {
    setAnalysis(a);
    setRemoved(n);
    setSample(isSample);
    setMarks({});
    setAnswers([]);
    setReflection(null);
    setReflectError('');
    setPhase('results');
  }, []);

  const loadSample = useCallback(() => {
    setDecision(EXAMPLES[0].decision);
    setLeaning(EXAMPLES[0].leaning);
    show(SAMPLE, 0, true);
  }, [show]);

  const submit = async () => {
    const invalid = validateDecision(decision);
    if (invalid) return setError(invalid);
    setError('');
    setPhase('loading');
    const r = await analyzeDecision(decision, leaning);
    if (r.ok) return show(r.data.analysis, r.data.removed, false);
    // AI unavailable + the untouched starter example → fall back to the pre-written sample
    if (decision.trim() === EXAMPLES[0].decision) return show(SAMPLE, 0, true);
    setError(r.error);
    setPhase('compose');
  };

  const reset = () => {
    setPhase('compose');
    setAnalysis(null);
    setError('');
  };

  const toggle = (key: string) => setMarks((m) => ({ ...m, [key]: !m[key] }));
  const setAnswer = (i: number, value: string) =>
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });

  const answered: Answered[] = useMemo(
    () =>
      (analysis?.questions ?? [])
        .map((question, i) => ({ question, answer: (answers[i] ?? '').trim() }))
        .filter((x) => x.answer.length >= MIN_ANSWER),
    [analysis, answers],
  );
  const total = analysis
    ? analysis.assumptions.length +
      analysis.conflicts.length +
      analysis.risks.length +
      analysis.missing.length +
      analysis.questions.length
    : 0;
  const done = Object.values(marks).filter(Boolean).length + answered.length;

  const reflect = async () => {
    if (!analysis) return;
    setReflecting(true);
    setReflectError('');
    const tag = (kind: Kind, xs: Item[]) => xs.map((x, i) => ({ text: x.text, on: !!marks[markKey(kind, i)] }));
    const all = [
      ...tag('a', analysis.assumptions),
      ...tag('c', analysis.conflicts),
      ...tag('r', analysis.risks),
      ...tag('m', analysis.missing),
    ];
    const r = await reflectOn({
      decision,
      leaning,
      answers: answered,
      examined: all.filter((x) => x.on).map((x) => x.text),
      open: all.filter((x) => !x.on).map((x) => x.text),
    });
    if (r.ok) setReflection(r.data.reflection);
    else setReflectError(r.error);
    setReflecting(false);
  };

  return {
    phase,
    decision,
    leaning,
    error,
    analysis,
    removed,
    sample,
    marks,
    answers,
    answered,
    reflection,
    reflecting,
    reflectError,
    total,
    done,
    setDecision,
    setLeaning,
    submit,
    loadSample,
    reset,
    toggle,
    setAnswer,
    reflect,
  };
}

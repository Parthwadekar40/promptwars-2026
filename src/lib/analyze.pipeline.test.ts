import { analyzeDecision, reflectOn } from './analyze';
import * as gemini from './gemini';

vi.mock('./gemini', () => ({ generateJSON: vi.fn() }));
const generateJSON = vi.mocked(gemini.generateJSON);

const decision = 'I have been offered a 6-month internship near home with a good stipend, but my exams overlap.';
const raw = {
  title: 'Internship decision',
  heard: 'You are weighing an internship against your exams.',
  noticedFirst: 'The stipend and the short commute.',
  outside: 'Nothing about mentorship.',
  otherSide: 'Declining keeps the semester calm.',
  assumptions: [{ assumption: 'Experience means learning.', check: 'Ask for a sample week.' }],
  conflicts: [{ conflict: 'You want learning but asked nothing about mentors.', toResolve: 'Who would teach you?' }],
  risks: [{ risk: 'Grades slip.', warningSign: 'Missed deadlines.' }],
  missing: [{ factor: 'Long-term trajectory', whyItMatters: 'Where does each path lead in 3 years?' }],
  traps: [{ name: 'Anchoring', whereItShows: 'On the stipend.' }],
  questions: ['What would a typical week look like?', 'You should take it.'],
  care: '',
};

describe('analysis pipeline (model mocked)', () => {
  beforeEach(() => generateJSON.mockReset());

  it('maps the model answer into the UI shape and strips advice before anyone sees it', async () => {
    generateJSON.mockResolvedValue({ ok: true, data: raw });
    const r = await analyzeDecision(decision, 'Mainly the stipend.');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.analysis.conflicts[0].text).toMatch(/mentors/);
    expect(r.data.analysis.questions).toEqual(['What would a typical week look like?']); // "You should take it." removed
    expect(r.data.removed).toBe(1);
    // the user's words travel as delimited data, with the system rules sent separately
    const [prompt, opts] = generateJSON.mock.calls[0];
    expect(prompt).toContain('<decision>');
    expect(prompt).toContain('Mainly the stipend.');
    expect(opts?.system).toMatch(/never recommend/i);
    expect(opts?.schema).toBeDefined();
  });

  it('turns a rate-limit failure into plain language with a way forward', async () => {
    generateJSON.mockResolvedValue({ ok: false, error: 'Gemini request failed: 429 RESOURCE_EXHAUSTED' });
    const r = await analyzeDecision(decision);
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/quota is busy.*own free key/i) });
  });

  it('refuses an answer that came back empty instead of rendering a blank page', async () => {
    generateJSON.mockResolvedValue({ ok: true, data: { title: 'x' } });
    const r = await analyzeDecision(decision);
    expect(r).toEqual({ ok: false, error: expect.stringMatching(/came back empty/i) });
  });

  it('reflection quotes the answers it was given and passes through the guard', async () => {
    generateJSON.mockResolvedValue({
      ok: true,
      data: {
        shifted: ['You said the stipend matters most.'],
        tension: 'I recommend you decline.',
        stillOpen: ['Who mentors you?'],
        oneQuestion: 'What would settle this?',
      },
    });
    const r = await reflectOn({
      decision,
      leaning: '',
      answers: [{ question: 'Why?', answer: 'The stipend matters most.' }],
      examined: ['Experience means learning.'],
      open: ['Grades slip.'],
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.reflection.tension).toBe(''); // advice removed
    expect(r.data.removed).toBe(1);
    expect(generateJSON.mock.calls[0][0]).toContain('The stipend matters most.');
  });
});

import { EXAMPLES, SAMPLE } from './examples';
import { neutralize } from '../lib/guard';

describe("the brief's own scenario", () => {
  const all = JSON.stringify(SAMPLE).toLowerCase();

  it('ships as the default example, with the details and reasons the brief lists', () => {
    const d = EXAMPLES[0].decision.toLowerCase();
    for (const detail of ['stipend', 'home', '40 hours', 'classes', 'mentor']) expect(d).toContain(detail);
    expect(EXAMPLES[0].leaning.toLowerCase()).toMatch(/stipend.*home.*industry experience/);
  });

  it('surfaces what the brief expects: academics, real learning & mentorship, long-term prospects', () => {
    expect(all).toMatch(/academic/);
    expect(all).toMatch(/mentor/);
    expect(all).toMatch(/long-term|career/);
  });

  it('questions assumptions and names conflicts in the person\'s own reasoning', () => {
    expect(SAMPLE.assumptions.length).toBeGreaterThanOrEqual(3);
    expect(SAMPLE.conflicts.length).toBeGreaterThanOrEqual(2);
    expect(SAMPLE.questions.length).toBe(5);
    expect(SAMPLE.questions.every((q) => q.endsWith('?'))).toBe(true);
  });

  it('never decides: the sample itself passes the neutrality guard untouched', () => {
    expect(neutralize(SAMPLE).removed).toBe(0);
  });
});

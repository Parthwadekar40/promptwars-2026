import { listEntries, removeEntry, reviewLink, saveEntry, toMarkdown } from './journal';

const base = {
  at: new Date('2026-10-04T10:00:00Z').getTime(),
  title: 'Bengaluru offer vs. Pune',
  decision: 'Take the job or stay?',
  leaning: 'Leaning to go',
  examined: 5,
  total: 14,
  answers: [{ question: 'Would you still want it at the same salary?', answer: 'Probably, for the team.' }],
  call: 'I will ask for two more weeks before answering.',
  changeMind: 'If the team lead cannot describe my first 90 days.',
};

describe('decision journal', () => {
  beforeEach(() => localStorage.clear());

  it('exports a readable Markdown reflection', () => {
    const md = toMarkdown(base);
    expect(md).toContain('# Bengaluru offer vs. Pune');
    expect(md).toContain('5 of 14 blind spots examined');
    expect(md).toContain('## My call\nI will ask for two more weeks before answering.');
    expect(md).toContain('## What would change my mind');
  });

  it('saves on the device when signed out, lists newest first, and deletes', async () => {
    expect(await saveEntry({ ...base, id: 'a' })).toBe('device');
    await saveEntry({ ...base, id: 'b', at: base.at + 1000 });
    const { entries, where } = await listEntries();
    expect(where).toBe('device');
    expect(entries.map((e) => e.id)).toEqual(['b', 'a']);
    await removeEntry('b');
    expect((await listEntries()).entries.map((e) => e.id)).toEqual(['a']);
  });

  it('saving the same session twice overwrites instead of duplicating', async () => {
    await saveEntry({ ...base, id: 'same' });
    await saveEntry({ ...base, id: 'same', call: 'Updated call' });
    const { entries } = await listEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].call).toBe('Updated call');
  });

  it('builds a prefilled calendar event for a review 30 days out', () => {
    const url = new URL(reviewLink(base, 30, new Date('2026-10-04T10:00:00Z')));
    expect(url.origin + url.pathname).toBe('https://calendar.google.com/calendar/render');
    expect(url.searchParams.get('action')).toBe('TEMPLATE');
    expect(url.searchParams.get('text')).toBe('Revisit my decision: Bengaluru offer vs. Pune');
    expect(url.searchParams.get('dates')).toBe('20261103/20261104'); // all-day, 30 days later
    expect(url.searchParams.get('details')).toContain('I will ask for two more weeks before answering.');
    expect(url.searchParams.get('details')).toContain('If the team lead cannot describe my first 90 days.');
  });
});

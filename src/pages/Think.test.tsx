import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Think } from './Think';
import { SAMPLE } from '../data/examples';
import * as analyze from '../lib/analyze';

vi.mock('../lib/analyze', async (orig) => ({ ...(await orig<typeof import('../lib/analyze')>()), reflectOn: vi.fn() }));

describe('Think workspace', () => {
  beforeEach(() => localStorage.clear());

  it('asks for more detail instead of calling the AI with an empty decision', async () => {
    render(<Think />);
    await userEvent.click(screen.getByRole('button', { name: /illuminate/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/a little more/i);
  });

  it('shows the sample instantly and counts every blind spot you examine', async () => {
    render(<Think />);
    await userEvent.click(screen.getByRole('button', { name: /see a sample/i }));
    expect(await screen.findByRole('heading', { level: 1, name: SAMPLE.title })).toBeInTheDocument();
    expect(screen.getByText(/neutrality check passed/i)).toBeInTheDocument();

    const bar = screen.getByRole('progressbar', { name: /blind spots examined/i });
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    await userEvent.click(screen.getByRole('button', { name: /examined: .industry experience. will automatically/i }));
    expect(bar).toHaveAttribute('aria-valuenow', '1');

    await userEvent.type(
      screen.getByLabelText(/if the stipend were half as much/i),
      'Yes — I like the team and the problem.',
    );
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getByRole('button', { name: /^reflect$/i })).toBeEnabled();
  });

  it('keeps the final call with the user: saving needs their words, then lands in the journal', async () => {
    render(<Think />);
    await userEvent.click(screen.getByRole('button', { name: /see a sample/i }));
    await userEvent.click(await screen.findByRole('button', { name: /save to my journal/i }));
    expect(screen.getByText(/write your call first/i)).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: /review in 30 days/i })).not.toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/^my call$/i), 'I will ask for two more weeks.');
    expect(screen.getByRole('link', { name: /review in 30 days/i })).toHaveAttribute(
      'href',
      expect.stringContaining('calendar.google.com'),
    );
    await userEvent.click(screen.getByRole('button', { name: /save to my journal/i }));
    const status = await screen.findByText(/saved on this device/i);
    expect(
      within(status.parentElement as HTMLElement).getByRole('link', { name: /open journal/i }),
    ).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('pw_journal') ?? '[]')).toHaveLength(1);
  });

  it('reflects on your own answers: tension, what is still open, one question — and says what failed if it cannot', async () => {
    const reflectOn = vi.mocked(analyze.reflectOn);
    reflectOn.mockResolvedValueOnce({
      ok: true,
      data: {
        removed: 0,
        reflection: {
          shifted: ['You named the stipend as the real driver.'],
          tension: 'You want learning, but ranked pay first.',
          stillOpen: ['Who would mentor you?'],
          oneQuestion: 'What would make this worth the study time?',
        },
      },
    });
    render(<Think />);
    await userEvent.click(screen.getByRole('button', { name: /see a sample/i }));
    expect(screen.getByRole('button', { name: /^reflect$/i })).toBeDisabled(); // nothing examined yet
    await userEvent.click(
      await screen.findByRole('button', { name: /examined: .industry experience. will automatically/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /^reflect$/i }));
    expect(await screen.findByText(/a tension worth noticing/i)).toBeInTheDocument();
    expect(screen.getByText(/you want learning, but ranked pay first/i)).toBeInTheDocument();
    // what we sent: the examined item travels as examined, the rest as still open
    const sent = reflectOn.mock.calls[0][0];
    expect(sent.examined).toHaveLength(1);
    expect(sent.open.length).toBeGreaterThan(5);

    reflectOn.mockResolvedValueOnce({ ok: false, error: 'The shared AI quota is busy right now.' });
    await userEvent.click(screen.getByRole('button', { name: /^reflect$/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/quota is busy/i);
  });
});

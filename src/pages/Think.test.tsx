import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Think } from './Think';
import { SAMPLE } from '../data/examples';

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

    await userEvent.type(screen.getByLabelText(/if the stipend were half as much/i), 'Yes — I like the team and the problem.');
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(screen.getByRole('button', { name: /^reflect$/i })).toBeEnabled();
  });

  it('keeps the final call with the user: saving needs their words, then lands in the journal', async () => {
    render(<Think />);
    await userEvent.click(screen.getByRole('button', { name: /see a sample/i }));
    await userEvent.click(await screen.findByRole('button', { name: /save to my journal/i }));
    expect(screen.getByText(/write your call first/i)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/^my call$/i), 'I will ask for two more weeks.');
    await userEvent.click(screen.getByRole('button', { name: /save to my journal/i }));
    const status = await screen.findByText(/saved on this device/i);
    expect(within(status.parentElement as HTMLElement).getByRole('link', { name: /open journal/i })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('pw_journal') ?? '[]')).toHaveLength(1);
  });
});

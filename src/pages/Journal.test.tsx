import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Journal } from './Journal';

const entry = (id: string, title: string, at: number) => ({
  id,
  at,
  owner: 'device',
  title,
  decision: `Decision text for ${title}`,
  leaning: '',
  examined: 3,
  total: 19,
  answers: [],
  call: `My call on ${title}`,
  changeMind: '',
});

describe('Journal page', () => {
  beforeEach(() => localStorage.clear());

  it('shows a friendly empty state with a way in', async () => {
    render(<Journal />);
    expect(await screen.findByText(/nothing here yet/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start thinking/i })).toBeInTheDocument();
  });

  it('lists reflections newest first and deletes one on request', async () => {
    localStorage.setItem(
      'pw_journal',
      JSON.stringify([entry('a', 'Older decision', 1), entry('b', 'Newer decision', 2)]),
    );
    render(<Journal />);
    const titles = await screen.findAllByText(/^(Older|Newer) decision$/);
    expect(titles.map((t) => t.textContent)).toEqual(['Newer decision', 'Older decision']);
    expect(screen.getByText(/stored on this device/i)).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(screen.queryByText('Newer decision')).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('pw_journal') ?? '[]')).toHaveLength(1);
  });
});

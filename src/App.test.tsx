import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  it('renders the hero heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ready to build');
  });

  it('exposes a keyboard-reachable primary action', async () => {
    render(<App />);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });
});

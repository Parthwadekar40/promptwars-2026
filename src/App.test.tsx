import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App shell', () => {
  it('renders the landing hero heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('exposes an accessible navigation with the main routes', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /main/i });
    expect(nav).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /sign in/i }).length).toBeGreaterThan(0);
  });

  it('navigates to the sign-in page from the nav', async () => {
    render(<App />);
    await userEvent.click(screen.getAllByRole('link', { name: /sign in/i })[0]);
    expect(await screen.findByRole('heading', { name: /welcome/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('renders settings with labeled key input', async () => {
    render(<App />);
    await userEvent.click(screen.getAllByRole('link', { name: /settings/i })[0]);
    expect(await screen.findByLabelText(/gemini api key/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save key/i })).toBeInTheDocument();
  });
});

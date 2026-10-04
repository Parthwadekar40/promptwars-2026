import { render } from '@testing-library/react';
import axe from 'axe-core';
import App from './App';

/** WCAG 2 A/AA rules that need no layout engine (colour contrast is audited in a real browser — see README). */
async function audit(container: HTMLElement) {
  const r = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  return r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
}

describe('accessibility (axe-core, WCAG 2.1 A/AA)', () => {
  afterEach(() => {
    window.location.hash = '#/';
  });

  it('landing page has no violations', async () => {
    const { container } = render(<App />);
    expect(await audit(container)).toEqual([]);
  });

  it('thinking workspace has no violations — empty form and full sample results', async () => {
    window.location.hash = '#/think';
    const { container, findByRole, unmount } = render(<App />);
    await findByRole('button', { name: /illuminate/i });
    expect(await audit(container)).toEqual([]);
    unmount();
    window.location.hash = '#/think?sample';
    const second = render(<App />);
    await second.findByRole('heading', { level: 1, name: /6-month internship/i });
    expect(await audit(second.container)).toEqual([]);
  });

  it('sign-in form and privacy page have no violations', async () => {
    window.location.hash = '#/signin';
    const a = render(<App />);
    await a.findByLabelText(/^email$/i);
    expect(await audit(a.container)).toEqual([]);
    a.unmount();
    window.location.hash = '#/privacy';
    const b = render(<App />);
    await b.findByRole('heading', { level: 1 });
    expect(await audit(b.container)).toEqual([]);
  });
});

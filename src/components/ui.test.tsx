import { render, screen } from '@testing-library/react';
import { Button } from './ui';

describe('Button', () => {
  it('keeps its own styling when a caller adds classes (regression: className used to replace it)', () => {
    render(<Button className="extra-class">Go</Button>);
    const cls = screen.getByRole('button', { name: 'Go' }).className;
    expect(cls).toContain('extra-class');
    expect(cls).toContain('bg-ink'); // primary look survives
    expect(cls).toContain('rounded-[10px]');
  });

  it('renders the ghost variant with a hairline border', () => {
    render(<Button variant="ghost">Quiet</Button>);
    expect(screen.getByRole('button', { name: 'Quiet' }).className).toContain('hairline');
  });
});

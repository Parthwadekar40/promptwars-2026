import { Component, type ReactNode } from 'react';

/** Crash insurance — a designed recovery screen instead of a white page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow">SOMETHING SLIPPED</p>
          <h1 className="t-h2 mt-4">One moment, please.</h1>
          <p className="mt-3 text-ink-muted">The page hit an unexpected error — a refresh almost always fixes it.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-[10px] bg-ink px-5 py-2.5 text-[15px] font-medium text-paper transition-colors hover:bg-[#2b2622]"
          >
            Refresh the page
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}

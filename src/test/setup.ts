import '@testing-library/jest-dom/vitest';

// jsdom lacks IntersectionObserver (used by framer-motion whileInView)
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;

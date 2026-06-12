import "@testing-library/jest-dom/vitest";
import { beforeEach, vi } from "vitest";

// jsdom has no IntersectionObserver; motion's whileInView needs it.
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: readonly number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = (): IntersectionObserverEntry[] => [];
}
vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

// Zustand module stores leak state across test files — reset before every test.
beforeEach(async () => {
  localStorage.clear();
  const { useDossierStore } = await import("../app/store");
  useDossierStore.getState().resetSession();
  useDossierStore.setState({
    plainTextMode: false,
    isWoke: false,
    isAudioMode: false,
    isFocusMode: false,
    isFullRead: false,
    role: "ANALYST",
  });
});

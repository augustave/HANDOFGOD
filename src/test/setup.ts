import "@testing-library/jest-dom/vitest";
import { beforeEach } from "vitest";

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

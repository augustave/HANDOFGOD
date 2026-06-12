import type { StateCreator } from "zustand";
import type { PreferencesSlice, StoreState } from "../types";

export const createPreferencesSlice: StateCreator<StoreState, [], [], PreferencesSlice> = (
  set,
) => ({
  plainTextMode: false,
  isWoke: false,
  isAudioMode: false,
  isFocusMode: false,
  isFullRead: false,
  role: "ANALYST",
  setPlainTextMode: (v) => set({ plainTextMode: v }),
  setIsWoke: (v) => set({ isWoke: v }),
  setIsAudioMode: (v) => set({ isAudioMode: v }),
  setIsFocusMode: (v) => set({ isFocusMode: v }),
  setIsFullRead: (v) => set({ isFullRead: v }),
  setRole: (role) => set({ role }),
});

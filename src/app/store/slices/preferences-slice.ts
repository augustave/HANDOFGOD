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
  isTerrainOpen: false,
  setPlainTextMode: (v) => set({ plainTextMode: v }),
  setIsWoke: (v) => set({ isWoke: v }),
  setIsAudioMode: (v) => set({ isAudioMode: v }),
  setIsFocusMode: (v) => set({ isFocusMode: v }),
  setIsFullRead: (v) => set({ isFullRead: v }),
  // Role is a presentation lens (reframes content via RoleLens / scenario framing),
  // not a scored decision — intentionally excluded from the profile signal stream.
  setRole: (role) => set({ role }),
  setIsTerrainOpen: (v) => set({ isTerrainOpen: v }),
});

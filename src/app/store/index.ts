import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { deriveCache } from "./derive";
import { safeLocalStorage, STORAGE_KEY, STORAGE_VERSION } from "./storage";
import { createAssessmentSlice } from "./slices/assessment-slice";
import { createJourneySlice } from "./slices/journey-slice";
import { createOperationsSlice } from "./slices/operations-slice";
import { createPreferencesSlice } from "./slices/preferences-slice";
import type { StoreState } from "./types";

/** Raw-signal + preference fields that persist; derived cache never does. */
const PERSISTED_KEYS = [
  "phase",
  "actsRead",
  "sessionId",
  "completedAt",
  "responses",
  "deferredQuestionIds",
  "scenarioCommits",
  "simulatorReports",
  "committedPosture",
  "callsign",
  "checkedItems",
  "plainTextMode",
  "isWoke",
  "isAudioMode",
  "isFocusMode",
  "isFullRead",
  "role",
] as const;

type PersistedKey = (typeof PERSISTED_KEYS)[number];
type PersistedState = Pick<StoreState, PersistedKey>;

export const useDossierStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createPreferencesSlice(set, get, api),
      ...createJourneySlice(set, get, api),
      ...createAssessmentSlice(set, get, api),
      ...createOperationsSlice(set, get, api),
      // Derived cache initial values (recomputed on any signal mutation).
      ...deriveCache({
        responses: [],
        scenarioCommits: [],
        simulatorReports: [],
        actsRead: [],
        committedPosture: null,
      }),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state): PersistedState => {
        const persisted = {} as Record<PersistedKey, unknown>;
        for (const key of PERSISTED_KEYS) persisted[key] = state[key];
        return persisted as PersistedState;
      },
      migrate: (persisted, version) => {
        // v1 is the first schema; unknown/corrupt payloads reset cleanly.
        if (version !== STORAGE_VERSION || persisted === null || typeof persisted !== "object") {
          return {};
        }
        return persisted;
      },
      onRehydrateStorage: () => (state) => {
        // Derived data is never trusted from disk — rebuild from raw signals.
        if (state) {
          useDossierStore.setState(
            deriveCache({
              responses: state.responses,
              scenarioCommits: state.scenarioCommits,
              simulatorReports: state.simulatorReports,
              actsRead: state.actsRead,
              committedPosture: state.committedPosture,
            }),
          );
        }
      },
    },
  ),
);

/** True when a previous session exists on disk (used to auto-skip the boot splash). */
export function hasPersistedSession(): boolean {
  try {
    return safeLocalStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/** Full reset: clears storage and reinitializes state (BURN SESSION). */
export function burnSession(): void {
  useDossierStore.getState().resetSession();
  useDossierStore.persist.clearStorage();
}

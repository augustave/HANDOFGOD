import type { StateCreator } from "zustand";
import { ASSESSMENT_QUESTIONS } from "../../data/assessments";
import { OPERATION_SCENARIOS } from "../../data/scenarios";
import { deriveCache } from "../derive";
import { createSessionId } from "../storage";
import type { JourneyPhase, JourneySlice, StoreState } from "../types";

const ESSAY_ACT_INDICES = [1, 2, 3, 4, 5, 6, 7] as const;

/** Gating requirements for first-run phase progression. */
export function phaseAvailable(state: StoreState, phase: JourneyPhase): boolean {
  if (state.completedAt !== null) return true; // free navigation after first debrief
  switch (phase) {
    case "READ":
      return true;
    case "ASSESS":
      // Reading anything unlocks assessing — checkpoints self-gate per act.
      return state.actsRead.length > 0;
    case "OPERATE":
      return state.responses.length >= Math.min(5, ASSESSMENT_QUESTIONS.length);
    case "DEBRIEF":
      return (
        state.actsRead.length >= 5 &&
        state.responses.length >= 4 &&
        state.scenarioCommits.length + (state.committedPosture ? 1 : 0) >= 1
      );
  }
}

export const createJourneySlice: StateCreator<StoreState, [], [], JourneySlice> = (
  set,
  get,
) => ({
  phase: "READ",
  actsRead: [],
  sessionId: createSessionId(),
  completedAt: null,

  markActRead: (idx) =>
    set((state) => {
      if (state.actsRead.includes(idx)) return {};
      const actsRead = [...state.actsRead, idx];
      return { actsRead, ...deriveCache({ ...state, actsRead }) };
    }),

  markAllActsRead: () =>
    set((state) => {
      const actsRead = [...new Set([...state.actsRead, ...ESSAY_ACT_INDICES])];
      if (actsRead.length === state.actsRead.length) return {};
      return { actsRead, ...deriveCache({ ...state, actsRead }) };
    }),

  requestPhase: (phase) => {
    const state = get();
    if (!phaseAvailable(state, phase)) return false;
    const completedAt =
      phase === "DEBRIEF" && state.completedAt === null ? Date.now() : state.completedAt;
    set({ phase, completedAt });
    return true;
  },

  resetSession: () =>
    set((state) => ({
      phase: "READ",
      actsRead: [],
      sessionId: createSessionId(),
      completedAt: null,
      responses: [],
      deferredQuestionIds: [],
      scenarioCommits: [],
      simulatorReports: [],
      committedPosture: null,
      callsign: null,
      checkedItems: [],
      ...deriveCache({
        ...state,
        responses: [],
        scenarioCommits: [],
        simulatorReports: [],
        actsRead: [],
        committedPosture: null,
      }),
    })),
});

/** Per-phase progress fractions for the journey tracker. */
export function journeyProgress(state: StoreState): {
  read: { done: number; total: number };
  assess: { done: number; total: number };
  operate: { done: number; total: number };
  debriefUnlocked: boolean;
} {
  return {
    read: { done: state.actsRead.length, total: ESSAY_ACT_INDICES.length },
    assess: { done: state.responses.length, total: ASSESSMENT_QUESTIONS.length },
    operate: {
      done: state.scenarioCommits.length,
      total: OPERATION_SCENARIOS.length,
    },
    debriefUnlocked: phaseAvailable(state, "DEBRIEF"),
  };
}

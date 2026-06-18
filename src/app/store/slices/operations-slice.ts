import type { StateCreator } from "zustand";
import {
  PASSIVE_CHECKLIST,
  PASSIVE_EXPLORE,
  SIMULATOR_REPORT_CAPS,
} from "../../engine/weights";
import { deriveCache } from "../derive";
import { makeSignal } from "../signal";
import type { OperationsSlice, ScenarioCommit, StoreState } from "../types";

export const createOperationsSlice: StateCreator<StoreState, [], [], OperationsSlice> = (
  set,
) => ({
  scenarioCommits: [],
  simulatorReports: [],
  committedPosture: null,
  callsign: null,
  checkedItems: [],
  exploredIds: [],

  chooseScenario: (scenario, choiceId) =>
    set((state) => {
      const choice = scenario.choices.find((c) => c.id === choiceId);
      if (!choice) return {};
      const isRecommit = state.scenarioCommits.some(
        (c) => c.scenarioId === scenario.id,
      );
      const weights = isRecommit ? halveWeights(choice.weights) : choice.weights;
      const commit: ScenarioCommit = {
        scenarioId: scenario.id,
        choiceId: choice.id,
        // One RECONSIDER allowed at half weight (discourages outcome farming).
        weights,
        postureAffinity: choice.postureAffinity,
        at: Date.now(),
      };
      const scenarioCommits = [
        ...state.scenarioCommits.filter((c) => c.scenarioId !== scenario.id),
        commit,
      ];
      const code = scenario.code.split("//")[0].trim();
      return {
        scenarioCommits,
        ...deriveCache({ ...state, scenarioCommits }),
        lastSignal: makeSignal(`${code} // DECISION ${choice.id}`, weights),
      };
    }),

  recordSimulatorReport: (report) =>
    set((state) => {
      const cap = SIMULATOR_REPORT_CAPS[report.simulatorId] ?? 1;
      const existing = state.simulatorReports.filter(
        (r) => r.simulatorId === report.simulatorId,
      );
      let simulatorReports;
      if (report.simulatorId === "capture") {
        if (existing.length >= cap) return {};
        simulatorReports = [...state.simulatorReports, { ...report, at: Date.now() }];
      } else {
        // Single-slot simulators: latest report replaces the previous one.
        simulatorReports = [
          ...state.simulatorReports.filter((r) => r.simulatorId !== report.simulatorId),
          { ...report, at: Date.now() },
        ];
      }
      return {
        simulatorReports,
        ...deriveCache({ ...state, simulatorReports }),
        lastSignal: makeSignal(`${report.simulatorId.toUpperCase()}_SIMULATOR`, report.weights),
      };
    }),

  // Posture commit is affinity-only by design: it shifts the posture
  // distribution (POSTURE_COMMIT_BONUS) but carries no dimension weights, so the
  // 6-axis literacy profile is unchanged. The signal is flagged affinityOnly.
  commitPosture: (posture, callsign) =>
    set((state) => ({
      committedPosture: posture,
      callsign: callsign.trim() || null,
      ...deriveCache({ ...state, committedPosture: posture }),
      lastSignal: makeSignal(`POSTURE_COMMITTED // ${posture.toUpperCase()}`, {}, true),
    })),

  toggleChecklistItem: (id) =>
    set((state) => {
      const isChecking = !state.checkedItems.includes(id);
      const checkedItems = isChecking
        ? [...state.checkedItems, id]
        : state.checkedItems.filter((item) => item !== id);
      return {
        checkedItems,
        ...deriveCache({ ...state, checkedItems }),
        lastSignal: isChecking
          ? makeSignal("PROTOCOL // CHECKLIST_COMMITTED", PASSIVE_CHECKLIST)
          : state.lastSignal,
      };
    }),

  markExplored: (kind, id) =>
    set((state) => {
      const key = `${kind}:${id}`;
      if (state.exploredIds.includes(key)) return {};
      const exploredIds = [...state.exploredIds, key];
      return {
        exploredIds,
        ...deriveCache({ ...state, exploredIds }),
        lastSignal: makeSignal(`INTEL // ${kind.toUpperCase()}_OPENED`, PASSIVE_EXPLORE[kind] ?? {}),
      };
    }),
});

function halveWeights<T extends Readonly<Record<string, number | undefined>>>(
  weights: T,
): T {
  const halved: Record<string, number> = {};
  for (const [key, value] of Object.entries(weights)) {
    if (value !== undefined) halved[key] = value / 2;
  }
  return halved as unknown as T;
}

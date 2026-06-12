import type { StateCreator } from "zustand";
import { SIMULATOR_REPORT_CAPS } from "../../engine/weights";
import { deriveCache } from "../derive";
import type { OperationsSlice, ScenarioCommit, StoreState } from "../types";

export const createOperationsSlice: StateCreator<StoreState, [], [], OperationsSlice> = (
  set,
) => ({
  scenarioCommits: [],
  simulatorReports: [],
  committedPosture: null,
  callsign: null,
  checkedItems: [],

  chooseScenario: (scenario, choiceId) =>
    set((state) => {
      const choice = scenario.choices.find((c) => c.id === choiceId);
      if (!choice) return {};
      const isRecommit = state.scenarioCommits.some(
        (c) => c.scenarioId === scenario.id,
      );
      const commit: ScenarioCommit = {
        scenarioId: scenario.id,
        choiceId: choice.id,
        // One RECONSIDER allowed at half weight (discourages outcome farming).
        weights: isRecommit ? halveWeights(choice.weights) : choice.weights,
        postureAffinity: choice.postureAffinity,
        at: Date.now(),
      };
      const scenarioCommits = [
        ...state.scenarioCommits.filter((c) => c.scenarioId !== scenario.id),
        commit,
      ];
      return { scenarioCommits, ...deriveCache({ ...state, scenarioCommits }) };
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
      return { simulatorReports, ...deriveCache({ ...state, simulatorReports }) };
    }),

  commitPosture: (posture, callsign) =>
    set((state) => ({
      committedPosture: posture,
      callsign: callsign.trim() || null,
      ...deriveCache({ ...state, committedPosture: posture }),
    })),

  toggleChecklistItem: (id) =>
    set((state) => ({
      checkedItems: state.checkedItems.includes(id)
        ? state.checkedItems.filter((item) => item !== id)
        : [...state.checkedItems, id],
    })),
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

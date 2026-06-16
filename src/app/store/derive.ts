// Rebuilds the derived cache (profile, posture, unlocks) from raw signals.
// Called after every mutating action and on rehydrate — derived data is
// never trusted from disk.

import { computeMaxContribution } from "../engine/calibration";
import { computeProfile } from "../engine/profile";
import { computePostureDistribution } from "../engine/posture";
import { computeUnlocks } from "../engine/unlocks";
import type { ProfileSignal } from "../engine/signals";
import { PASSIVE_CHECKLIST, PASSIVE_EXPLORE, type Posture } from "../engine/weights";
import { ASSESSMENT_QUESTIONS } from "../data/assessments";
import { OPERATION_SCENARIOS } from "../data/scenarios";
import { UNLOCK_GATES } from "../data/unlock-gates";
import type { DerivedCache, StoreState } from "./types";

/** Precomputed once from the content bank; bounds every dimension to 0-100. */
export const MAX_CONTRIBUTION = computeMaxContribution(
  ASSESSMENT_QUESTIONS,
  OPERATION_SCENARIOS,
);

const QUESTION_ACT_BY_ID = new Map<string, string>(
  ASSESSMENT_QUESTIONS.map((q) => [q.id, q.afterActId]),
);

type SignalSource = Pick<
  StoreState,
  | "responses"
  | "scenarioCommits"
  | "simulatorReports"
  | "actsRead"
  | "committedPosture"
  | "checkedItems"
  | "exploredIds"
>;

export function collectSignals(state: SignalSource): ProfileSignal[] {
  const signals: ProfileSignal[] = [];
  for (const response of state.responses) {
    signals.push({ kind: "assessment", response });
  }
  for (const commit of state.scenarioCommits) {
    signals.push({
      kind: "scenario",
      scenarioId: commit.scenarioId,
      choiceId: commit.choiceId,
      weights: commit.weights,
      postureAffinity: commit.postureAffinity,
      at: commit.at,
    });
  }
  for (const report of state.simulatorReports) {
    signals.push({ kind: "simulator", report });
  }
  for (const actIndex of state.actsRead) {
    signals.push({ kind: "reading", actIndex, at: 0 });
  }
  // Passive interactions: every checked protocol + opened intel item scores.
  for (let i = 0; i < state.checkedItems.length; i++) {
    signals.push({ kind: "passive", weights: PASSIVE_CHECKLIST });
  }
  for (const explored of state.exploredIds) {
    const kind = explored.split(":")[0];
    const weights = PASSIVE_EXPLORE[kind];
    if (weights) signals.push({ kind: "passive", weights });
  }
  return signals;
}

export function assessedActIds(state: Pick<StoreState, "responses">): string[] {
  const ids = new Set<string>();
  for (const response of state.responses) {
    const actId = QUESTION_ACT_BY_ID.get(response.id);
    if (actId) ids.add(actId);
  }
  return [...ids];
}

export function deriveCache(
  state: SignalSource & { committedPosture: Posture | null },
): DerivedCache {
  const signals = collectSignals(state);
  const profile = computeProfile(signals, MAX_CONTRIBUTION);
  const postureDistribution = computePostureDistribution(signals, state.committedPosture);
  const unlockedIds = computeUnlocks(UNLOCK_GATES, {
    actsReadCount: state.actsRead.length,
    responsesCount: state.responses.length,
    scenariosCount: state.scenarioCommits.length,
    assessedActIds: assessedActIds(state),
    profile,
  });
  return { profile, postureDistribution, unlockedIds };
}

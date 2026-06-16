// The unified input to all scoring. Raw signals are the only persisted
// profile facts; every score, posture, and unlock derives from them.

import type { Dimension, PostureAffinity, WeightVector } from "./weights";

export interface AssessmentResponse {
  /** Stable question id — append-only, never reused. */
  id: string;
  /** Snapshot of the prompt at answer time (content edits can't corrupt history). */
  question: string;
  /** Chosen option id. */
  answer: string;
  /** Snapshot of the chosen option's weight vector. */
  weight: WeightVector;
  category: Dimension;
  /** Snapshot of the chosen option's posture affinity. */
  postureAffinity?: PostureAffinity;
  answeredAt: number;
}

export type ScenarioChoiceId = "A" | "B" | "C";

export type SimulatorId = "capture" | "two-front" | "posture-terminal";

export interface SimulatorReport {
  simulatorId: SimulatorId;
  weights: WeightVector;
  postureAffinity?: PostureAffinity;
  at: number;
}

export type ProfileSignal =
  | { kind: "assessment"; response: AssessmentResponse }
  | {
      kind: "scenario";
      scenarioId: string;
      choiceId: ScenarioChoiceId;
      weights: WeightVector;
      postureAffinity: PostureAffinity;
      at: number;
    }
  | { kind: "simulator"; report: SimulatorReport }
  | { kind: "reading"; actIndex: number; at: number }
  | { kind: "passive"; weights: WeightVector };

/** Transient record of the most recent profile mutation, drives the live toast. */
export interface SignalEvent {
  seq: number;
  label: string;
  weights: WeightVector;
  /** True for posture commits and other affinity-only events with no dimension delta. */
  affinityOnly?: boolean;
  at: number;
}

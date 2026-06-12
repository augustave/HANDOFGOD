// Shapes of the authored content banks (data/assessments.ts, data/scenarios.ts).
// Kept in the engine so calibration can compute score bounds from content
// without importing React or component code.

import type { Dimension, PostureAffinity, WeightVector } from "./weights";
import type { ScenarioChoiceId } from "./signals";

export interface AssessmentOption {
  id: string;
  label: string;
  /** Revealed after commit: the counter-read of this posture. */
  insight: string;
  weights: WeightVector;
  postureAffinity?: PostureAffinity;
}

export interface AssessmentQuestion {
  /** Stable, append-only id (keys persisted answers). */
  id: string;
  /** ACTS[].id this checkpoint renders beneath. */
  afterActId: string;
  category: Dimension;
  prompt: string;
  options: readonly AssessmentOption[];
}

export interface ScenarioChoice {
  id: ScenarioChoiceId;
  label: string;
  gained: string;
  exposed: string;
  secondOrder: string;
  weights: WeightVector;
  postureAffinity: PostureAffinity;
}

export interface OperationScenario {
  id: string;
  /** Display codename, e.g. "OP-01 // THE_DISCLOSURE_DILEMMA". */
  code: string;
  title: string;
  /** ACTS[].id the scenario is anchored inside. */
  anchorActId: string;
  situation: string;
  constraint: string;
  choices: readonly [ScenarioChoice, ScenarioChoice, ScenarioChoice];
}

// Fixed weight vectors the rewired V1 simulators report into the profile.
// Centralized so calibration can bound their maximum contribution.

import type { Posture, PostureAffinity, WeightVector } from "./weights";

/** One report per mitigation click in the capture simulator (capped). */
export const CAPTURE_MITIGATION_WEIGHTS: WeightVector = {
  operationalThinking: 1,
  systemAwareness: 1,
};

export type TwoFrontOutcome =
  | "BRITTLE_SUPERIORITY"
  | "IDEOLOGICAL_STAGNATION"
  | "OPERATIONAL_SYNERGY"
  | "ASYMMETRIC_VULNERABILITY";

export const TWO_FRONT_OUTCOME_WEIGHTS: Readonly<Record<TwoFrontOutcome, WeightVector>> = {
  OPERATIONAL_SYNERGY: { capabilityOrientation: 3, strategicRealism: 3, operationalThinking: 2 },
  BRITTLE_SUPERIORITY: { capabilityOrientation: 3, narrativeLiteracy: -2 },
  IDEOLOGICAL_STAGNATION: { narrativeLiteracy: 2, capabilityOrientation: -2 },
  ASYMMETRIC_VULNERABILITY: { strategicRealism: 1, systemAwareness: 1 },
};

export const TWO_FRONT_OUTCOME_AFFINITY: Readonly<Record<TwoFrontOutcome, PostureAffinity>> = {
  OPERATIONAL_SYNERGY: { sovereign: 3, architect: 2 },
  BRITTLE_SUPERIORITY: { sovereign: 2, watcher: 1 },
  IDEOLOGICAL_STAGNATION: { watcher: 3 },
  ASYMMETRIC_VULNERABILITY: { watcher: 2, architect: 1 },
};

/** PostureTerminal selection maps 1:1 onto postures (affinity only, no dims). */
export const POSTURE_TERMINAL_AFFINITY: Readonly<Record<Posture, PostureAffinity>> = {
  watcher: { watcher: 5 },
  architect: { architect: 5 },
  sovereign: { sovereign: 5 },
};

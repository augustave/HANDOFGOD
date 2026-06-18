// Plain selectors for component subscriptions. Use with
// useDossierStore(selectX) — derived values live in the store cache,
// so these are cheap field reads, not recomputations.

import { DIMENSIONS, type Dimension, type Profile } from "../engine/weights";
import { assessedActIds } from "./derive";
import type { StoreState } from "./types";

/**
 * Radar axis order matches threat-radar.tsx axes:
 * NARRATIVE, TECHNICAL, COGNITIVE, STRUCTURAL, IDEOLOGICAL, OPERATIONAL.
 * Radar shows EXPOSURE = 100 - literacy (low literacy = high threat).
 */
const RADAR_AXIS_DIMENSIONS: readonly Dimension[] = [
  "narrativeLiteracy",
  "capabilityOrientation",
  "institutionalTrust",
  "systemAwareness",
  "strategicRealism",
  "operationalThinking",
];

/** Exposure values (100 - literacy) in radar-axis order; usable with a bare Profile. */
export function radarValuesFromProfile(profile: Profile): number[] {
  return RADAR_AXIS_DIMENSIONS.map((dim) => 100 - profile[dim]);
}

export function selectRadarValues(state: StoreState): number[] {
  return radarValuesFromProfile(state.profile);
}

export function selectProfile(state: StoreState) {
  return state.profile;
}

export function selectPostureDistribution(state: StoreState) {
  return state.postureDistribution;
}

export function selectIsUnlocked(id: string) {
  return (state: StoreState): boolean => state.unlockedIds.includes(id);
}

export function selectActAssessed(actId: string) {
  return (state: StoreState): boolean => assessedActIds(state).includes(actId);
}


/** Signal count for confidence display: "LOW_CONFIDENCE // 4/17 SIGNALS". */
export function selectSignalCount(state: StoreState): number {
  return (
    state.responses.length +
    state.scenarioCommits.length +
    state.simulatorReports.length
  );
}

export function selectCompositeScore(state: StoreState): number {
  let sum = 0;
  for (const dim of DIMENSIONS) sum += state.profile[dim];
  return Math.round(sum / DIMENSIONS.length);
}

/** Clearance thresholds ported from dossier-progress.tsx. */
export function selectClearance(state: StoreState): string {
  const n = state.actsRead.length;
  if (n >= 7) return "OMEGA";
  if (n >= 5) return "DELTA";
  if (n >= 3) return "GAMMA";
  return "ALPHA";
}

// Dimension scoring: order-independent, idempotent per signal set, and
// normalized against the maximum reachable contribution per dimension so a
// content edit can never push a score outside 0-100.

import {
  BASELINE,
  clamp,
  DIMENSIONS,
  emptyWeightTotals,
  READING_BUMP,
  SOURCE_MULTIPLIER,
  type Dimension,
  type Profile,
  type WeightVector,
} from "./weights";
import type { ProfileSignal } from "./signals";

export type MaxContribution = Readonly<Record<Dimension, number>>;

function addWeighted(
  totals: Record<Dimension, number>,
  weights: WeightVector,
  multiplier: number,
): void {
  for (const dim of DIMENSIONS) {
    const w = weights[dim];
    if (w !== undefined) totals[dim] += w * multiplier;
  }
}

/** Raw signed contribution per dimension across all signals. */
export function accumulateWeights(signals: readonly ProfileSignal[]): Record<Dimension, number> {
  const totals = emptyWeightTotals();
  for (const signal of signals) {
    switch (signal.kind) {
      case "assessment":
        addWeighted(totals, signal.response.weight, SOURCE_MULTIPLIER.assessment);
        break;
      case "scenario":
        addWeighted(totals, signal.weights, SOURCE_MULTIPLIER.scenario);
        break;
      case "simulator":
        addWeighted(totals, signal.report.weights, SOURCE_MULTIPLIER.simulator);
        break;
      case "reading":
        addWeighted(totals, READING_BUMP, SOURCE_MULTIPLIER.reading);
        break;
    }
  }
  return totals;
}

/**
 * score_d = clamp(0, 100, BASELINE + BASELINE * raw_d / maxAbs_d)
 *
 * maxAbs is precomputed from the content bank (see calibration.ts); a zero
 * max for a dimension leaves that dimension at baseline regardless of raw.
 */
export function computeProfile(
  signals: readonly ProfileSignal[],
  maxAbs: MaxContribution,
): Profile {
  const raw = accumulateWeights(signals);
  const profile = emptyWeightTotals();
  for (const dim of DIMENSIONS) {
    const max = maxAbs[dim];
    profile[dim] =
      max > 0
        ? Math.round(clamp(0, 100, BASELINE + (BASELINE * raw[dim]) / max))
        : BASELINE;
  }
  return profile;
}

/** Composite literacy score: mean of the six dimensions, rounded. */
export function compositeScore(profile: Profile): number {
  let sum = 0;
  for (const dim of DIMENSIONS) sum += profile[dim];
  return Math.round(sum / DIMENSIONS.length);
}

/** Top-N / bottom-N dimensions, deterministic for ties (DIMENSIONS order). */
export function rankDimensions(profile: Profile): readonly Dimension[] {
  return [...DIMENSIONS].sort((a, b) => profile[b] - profile[a]);
}

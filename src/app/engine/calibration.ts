// Computes the maximum reachable contribution per dimension from the
// authored content banks. computeProfile normalizes against this, so the
// score range stays 0-100 no matter how copy/weights evolve.

import {
  DIMENSIONS,
  emptyWeightTotals,
  READING_BUMP,
  SIMULATOR_REPORT_CAPS,
  SOURCE_MULTIPLIER,
  type Dimension,
  type WeightVector,
} from "./weights";
import type { AssessmentQuestion, OperationScenario } from "./content-types";
import type { MaxContribution } from "./profile";
import {
  CAPTURE_MITIGATION_WEIGHTS,
  TWO_FRONT_OUTCOME_WEIGHTS,
} from "./simulator-weights";

const TOTAL_ACTS = 8; // hero + 7 essay acts (reading signals use act indices 0-7)

function maxAbsPerDimension(vectors: readonly WeightVector[]): Record<Dimension, number> {
  const maxes = emptyWeightTotals();
  for (const vector of vectors) {
    for (const dim of DIMENSIONS) {
      const w = vector[dim];
      if (w !== undefined) maxes[dim] = Math.max(maxes[dim], Math.abs(w));
    }
  }
  return maxes;
}

export function computeMaxContribution(
  questions: readonly AssessmentQuestion[],
  scenarios: readonly OperationScenario[],
): MaxContribution {
  const totals = emptyWeightTotals();

  for (const question of questions) {
    const optionMax = maxAbsPerDimension(question.options.map((o) => o.weights));
    for (const dim of DIMENSIONS) {
      totals[dim] += optionMax[dim] * SOURCE_MULTIPLIER.assessment;
    }
  }

  for (const scenario of scenarios) {
    const choiceMax = maxAbsPerDimension(scenario.choices.map((c) => c.weights));
    for (const dim of DIMENSIONS) {
      totals[dim] += choiceMax[dim] * SOURCE_MULTIPLIER.scenario;
    }
  }

  const captureCap = SIMULATOR_REPORT_CAPS["capture"] ?? 0;
  const twoFrontCap = SIMULATOR_REPORT_CAPS["two-front"] ?? 0;
  const twoFrontMax = maxAbsPerDimension(Object.values(TWO_FRONT_OUTCOME_WEIGHTS));
  for (const dim of DIMENSIONS) {
    const capture = (CAPTURE_MITIGATION_WEIGHTS[dim] ?? 0) * captureCap;
    const twoFront = twoFrontMax[dim] * twoFrontCap;
    totals[dim] += (capture + twoFront) * SOURCE_MULTIPLIER.simulator;
  }

  for (const dim of DIMENSIONS) {
    totals[dim] += (READING_BUMP[dim] ?? 0) * TOTAL_ACTS * SOURCE_MULTIPLIER.reading;
  }

  return totals;
}

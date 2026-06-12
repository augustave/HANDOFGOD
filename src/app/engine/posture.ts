// Posture distribution: explainable point sums + largest-remainder rounding
// so percentages always total exactly 100. No softmax, no hidden math.

import {
  POSTURE_COMMIT_BONUS,
  POSTURES,
  type Posture,
  type PostureAffinity,
  type PostureDistribution,
} from "./weights";
import type { ProfileSignal } from "./signals";

function emptyPoints(): Record<Posture, number> {
  return { watcher: 0, architect: 0, sovereign: 0 };
}

function addAffinity(points: Record<Posture, number>, affinity: PostureAffinity | undefined): void {
  if (!affinity) return;
  for (const posture of POSTURES) {
    const p = affinity[posture];
    if (p !== undefined) points[posture] += p;
  }
}

export function accumulatePosturePoints(
  signals: readonly ProfileSignal[],
  committedPosture: Posture | null,
): Record<Posture, number> {
  const points = emptyPoints();
  for (const signal of signals) {
    switch (signal.kind) {
      case "assessment":
        addAffinity(points, signal.response.postureAffinity);
        break;
      case "scenario":
        addAffinity(points, signal.postureAffinity);
        break;
      case "simulator":
        addAffinity(points, signal.report.postureAffinity);
        break;
      case "reading":
        break;
    }
  }
  if (committedPosture) points[committedPosture] += POSTURE_COMMIT_BONUS;
  return points;
}

/**
 * Integer percentages via largest-remainder method; guaranteed to sum to 100.
 * Zero total points → neutral 33/33/34 split (sovereign takes the remainder,
 * deterministically, as the last posture in POSTURES order).
 */
export function computePostureDistribution(
  signals: readonly ProfileSignal[],
  committedPosture: Posture | null,
): PostureDistribution {
  const points = accumulatePosturePoints(signals, committedPosture);
  const total = POSTURES.reduce((sum, p) => sum + Math.max(0, points[p]), 0);

  if (total <= 0) {
    return { watcher: 33, architect: 33, sovereign: 34 };
  }

  const exact = POSTURES.map((p) => ({
    posture: p,
    value: (Math.max(0, points[p]) * 100) / total,
  }));
  const floored = exact.map((e) => ({ ...e, floor: Math.floor(e.value) }));
  let remainder = 100 - floored.reduce((sum, e) => sum + e.floor, 0);

  // Distribute leftover points to the largest fractional parts;
  // ties resolve by POSTURES order for determinism.
  const byFraction = [...floored].sort((a, b) => b.value - b.floor - (a.value - a.floor));
  const result: Record<Posture, number> = { watcher: 0, architect: 0, sovereign: 0 };
  for (const entry of floored) result[entry.posture] = entry.floor;
  for (const entry of byFraction) {
    if (remainder <= 0) break;
    result[entry.posture] += 1;
    remainder -= 1;
  }
  return result;
}

/** Dominant posture, deterministic for ties (POSTURES order). */
export function dominantPosture(distribution: PostureDistribution): Posture {
  let best: Posture = POSTURES[0];
  for (const posture of POSTURES) {
    if (distribution[posture] > distribution[best]) best = posture;
  }
  return best;
}

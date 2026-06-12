import { describe, expect, it } from "vitest";
import { computePostureDistribution, dominantPosture } from "../posture";
import { POSTURES } from "../weights";
import type { ProfileSignal } from "../signals";

function affinitySignal(affinity: Partial<Record<(typeof POSTURES)[number], number>>): ProfileSignal {
  return {
    kind: "assessment",
    response: {
      id: "q-test",
      question: "test",
      answer: "a",
      weight: {},
      category: "narrativeLiteracy",
      postureAffinity: affinity,
      answeredAt: 0,
    },
  };
}

function total(dist: Record<string, number>): number {
  return Object.values(dist).reduce((a, b) => a + b, 0);
}

describe("computePostureDistribution", () => {
  it("returns neutral split summing to 100 with zero signals", () => {
    const dist = computePostureDistribution([], null);
    expect(total(dist)).toBe(100);
    expect(dist).toEqual({ watcher: 33, architect: 33, sovereign: 34 });
  });

  it("always sums to exactly 100", () => {
    const dist = computePostureDistribution(
      [affinitySignal({ watcher: 1 }), affinitySignal({ architect: 1 }), affinitySignal({ sovereign: 1 })],
      null,
    );
    expect(total(dist)).toBe(100);
  });

  it("largest-remainder keeps sums exact for awkward ratios", () => {
    // 1/3 splits: floors sum to 99, remainder distributed
    const dist = computePostureDistribution(
      [affinitySignal({ watcher: 1, architect: 1, sovereign: 1 })],
      null,
    );
    expect(total(dist)).toBe(100);
    for (const p of POSTURES) expect(dist[p]).toBeGreaterThanOrEqual(33);
  });

  it("commit bonus shifts the distribution toward the committed posture", () => {
    const signals = [affinitySignal({ watcher: 10 })];
    const without = computePostureDistribution(signals, null);
    const withCommit = computePostureDistribution(signals, "sovereign");
    expect(withCommit.sovereign).toBeGreaterThan(without.sovereign);
    expect(total(withCommit)).toBe(100);
  });

  it("persona calibration: all-watcher answers produce watcher dominance", () => {
    const signals = Array.from({ length: 6 }, () => affinitySignal({ watcher: 2 }));
    const dist = computePostureDistribution(signals, null);
    expect(dominantPosture(dist)).toBe("watcher");
    expect(dist.watcher).toBe(100);
  });

  it("persona calibration: builder-heavy mix favors architect", () => {
    const signals = [
      affinitySignal({ architect: 3 }),
      affinitySignal({ architect: 2, watcher: 1 }),
      affinitySignal({ architect: 2, sovereign: 1 }),
    ];
    const dist = computePostureDistribution(signals, null);
    expect(dominantPosture(dist)).toBe("architect");
  });

  it("negative point totals are floored at zero", () => {
    const dist = computePostureDistribution([affinitySignal({ watcher: -5, sovereign: 5 })], null);
    expect(total(dist)).toBe(100);
    expect(dist.sovereign).toBe(100);
    expect(dist.watcher).toBe(0);
  });
});

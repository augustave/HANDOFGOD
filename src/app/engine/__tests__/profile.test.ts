import { describe, expect, it } from "vitest";
import { accumulateWeights, compositeScore, computeProfile, rankDimensions } from "../profile";
import { BASELINE, DIMENSIONS, type Dimension } from "../weights";
import type { ProfileSignal } from "../signals";

const FLAT_MAX: Record<Dimension, number> = {
  narrativeLiteracy: 10,
  institutionalTrust: 10,
  capabilityOrientation: 10,
  strategicRealism: 10,
  systemAwareness: 10,
  operationalThinking: 10,
};

function assessmentSignal(weights: Partial<Record<Dimension, number>>): ProfileSignal {
  return {
    kind: "assessment",
    response: {
      id: "q-test",
      question: "test",
      answer: "a",
      weight: weights,
      category: "narrativeLiteracy",
      answeredAt: 0,
    },
  };
}

describe("computeProfile", () => {
  it("returns baseline 50 for every dimension with no signals", () => {
    const profile = computeProfile([], FLAT_MAX);
    for (const dim of DIMENSIONS) expect(profile[dim]).toBe(BASELINE);
  });

  it("pushes dimensions up and down proportionally to weights", () => {
    const profile = computeProfile(
      [assessmentSignal({ narrativeLiteracy: 5, strategicRealism: -5 })],
      FLAT_MAX,
    );
    expect(profile.narrativeLiteracy).toBe(75); // 50 + 50*5/10
    expect(profile.strategicRealism).toBe(25); // 50 - 50*5/10
    expect(profile.systemAwareness).toBe(BASELINE);
  });

  it("is order-independent", () => {
    const a = assessmentSignal({ narrativeLiteracy: 3 });
    const b = assessmentSignal({ narrativeLiteracy: -1, systemAwareness: 2 });
    const forward = computeProfile([a, b], FLAT_MAX);
    const reverse = computeProfile([b, a], FLAT_MAX);
    expect(forward).toEqual(reverse);
  });

  it("clamps to 0-100 even when raw exceeds max", () => {
    const big = assessmentSignal({ narrativeLiteracy: 100 });
    const profile = computeProfile([big, big], FLAT_MAX);
    expect(profile.narrativeLiteracy).toBe(100);
    const low = assessmentSignal({ narrativeLiteracy: -100 });
    expect(computeProfile([low], FLAT_MAX).narrativeLiteracy).toBe(0);
  });

  it("leaves dimension at baseline when its max contribution is zero", () => {
    const zeroMax = { ...FLAT_MAX, operationalThinking: 0 };
    const profile = computeProfile(
      [assessmentSignal({ operationalThinking: 5 })],
      zeroMax,
    );
    expect(profile.operationalThinking).toBe(BASELINE);
  });

  it("applies source multipliers (scenario 1.5x, simulator 0.5x)", () => {
    const scenario: ProfileSignal = {
      kind: "scenario",
      scenarioId: "s",
      choiceId: "A",
      weights: { systemAwareness: 2 },
      postureAffinity: {},
      at: 0,
    };
    const simulator: ProfileSignal = {
      kind: "simulator",
      report: { simulatorId: "capture", weights: { systemAwareness: 2 }, at: 0 },
    };
    const totals = accumulateWeights([scenario, simulator]);
    expect(totals.systemAwareness).toBe(2 * 1.5 + 2 * 0.5);
  });
});

describe("compositeScore / rankDimensions", () => {
  it("composite is the rounded mean", () => {
    const profile = computeProfile([], FLAT_MAX);
    expect(compositeScore(profile)).toBe(BASELINE);
  });

  it("ranks dimensions descending, deterministic for ties", () => {
    const profile = computeProfile(
      [assessmentSignal({ narrativeLiteracy: 4, systemAwareness: 8 })],
      FLAT_MAX,
    );
    const ranked = rankDimensions(profile);
    expect(ranked[0]).toBe("systemAwareness");
    expect(ranked[1]).toBe("narrativeLiteracy");
  });
});

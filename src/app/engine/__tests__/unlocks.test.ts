import { describe, expect, it } from "vitest";
import { computeUnlocks, isGateOpen, type UnlockContext, type UnlockGate } from "../unlocks";
import { BASELINE, DIMENSIONS, type Dimension } from "../weights";

function baselineProfile(): Record<Dimension, number> {
  const profile = {} as Record<Dimension, number>;
  for (const dim of DIMENSIONS) profile[dim] = BASELINE;
  return profile;
}

const EMPTY_CTX: UnlockContext = {
  actsReadCount: 0,
  responsesCount: 0,
  scenariosCount: 0,
  assessedActIds: [],
  profile: baselineProfile(),
};

describe("isGateOpen", () => {
  it("empty requirements are always open", () => {
    const gate: UnlockGate = { id: "g", kind: "evidence", requires: {} };
    expect(isGateOpen(gate, EMPTY_CTX)).toBe(true);
  });

  it("enforces counts and act assessments", () => {
    const gate: UnlockGate = {
      id: "g",
      kind: "redteam",
      requires: { actsRead: 2, responses: 1, actAssessed: "two_front" },
    };
    expect(isGateOpen(gate, EMPTY_CTX)).toBe(false);
    expect(
      isGateOpen(gate, {
        ...EMPTY_CTX,
        actsReadCount: 2,
        responsesCount: 1,
        assessedActIds: ["two_front"],
      }),
    ).toBe(true);
    expect(
      isGateOpen(gate, {
        ...EMPTY_CTX,
        actsReadCount: 2,
        responsesCount: 1,
        assessedActIds: ["sovereign"],
      }),
    ).toBe(false);
  });

  it("enforces dimension minimums", () => {
    const gate: UnlockGate = {
      id: "g",
      kind: "counterargument",
      requires: { dimensionMin: { strategicRealism: 60 } },
    };
    expect(isGateOpen(gate, EMPTY_CTX)).toBe(false);
    const profile = { ...baselineProfile(), strategicRealism: 65 };
    expect(isGateOpen(gate, { ...EMPTY_CTX, profile })).toBe(true);
  });
});

describe("computeUnlocks", () => {
  it("returns ids of open gates only", () => {
    const gates: UnlockGate[] = [
      { id: "open", kind: "evidence", requires: {} },
      { id: "closed", kind: "evidence", requires: { responses: 99 } },
    ];
    expect(computeUnlocks(gates, EMPTY_CTX)).toEqual(["open"]);
  });
});

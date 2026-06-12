// Content contract: lets copy be edited without code review while making it
// impossible to silently break scoring, ids, or e2e assumptions.

import { describe, expect, it } from "vitest";
import { ASSESSMENT_QUESTIONS } from "../assessments";
import { OPERATION_SCENARIOS } from "../scenarios";
import { UNLOCK_GATES } from "../unlock-gates";
import { ACTS } from "../dossier";
import { DIMENSIONS, type Dimension } from "../../engine/weights";
import type { UnlockGate } from "../../engine/unlocks";

const GATES: readonly UnlockGate[] = UNLOCK_GATES;

const ACT_IDS = new Set(ACTS.map((act) => act.id));
const DIMENSION_SET = new Set<string>(DIMENSIONS);

describe("assessment question bank", () => {
  it("has 12-18 questions", () => {
    expect(ASSESSMENT_QUESTIONS.length).toBeGreaterThanOrEqual(12);
    expect(ASSESSMENT_QUESTIONS.length).toBeLessThanOrEqual(18);
  });

  it("ids are unique and kebab-case", () => {
    const ids = ASSESSMENT_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^q-[a-z0-9]+(-[a-z0-9]+)+$/);
  });

  it("every afterActId exists in ACTS", () => {
    for (const q of ASSESSMENT_QUESTIONS) {
      expect(ACT_IDS.has(q.afterActId), `unknown act ${q.afterActId} in ${q.id}`).toBe(true);
    }
  });

  it("each dimension is the primary category of at least 2 questions", () => {
    const counts = new Map<Dimension, number>();
    for (const q of ASSESSMENT_QUESTIONS) {
      counts.set(q.category, (counts.get(q.category) ?? 0) + 1);
    }
    for (const dim of DIMENSIONS) {
      expect(counts.get(dim) ?? 0, `dimension ${dim} undercovered`).toBeGreaterThanOrEqual(2);
    }
  });

  it("options: 3 per question, valid integer weights -3..+3, max 3 dimensions, never empty", () => {
    for (const q of ASSESSMENT_QUESTIONS) {
      expect(q.options.length).toBe(3);
      for (const option of q.options) {
        const entries = Object.entries(option.weights);
        expect(entries.length, `${q.id}/${option.id} has empty weights`).toBeGreaterThan(0);
        expect(entries.length, `${q.id}/${option.id} weights too many dims`).toBeLessThanOrEqual(3);
        for (const [dim, weight] of entries) {
          expect(DIMENSION_SET.has(dim), `${q.id}/${option.id} unknown dim ${dim}`).toBe(true);
          expect(Number.isInteger(weight), `${q.id}/${option.id} non-integer weight`).toBe(true);
          expect(Math.abs(weight as number)).toBeLessThanOrEqual(3);
        }
        expect(option.insight.length, `${q.id}/${option.id} missing insight`).toBeGreaterThan(0);
      }
    }
  });

  it('never uses the bare token "OPERATE" in copy (e2e exact-text match)', () => {
    for (const q of ASSESSMENT_QUESTIONS) {
      const texts = [q.prompt, ...q.options.flatMap((o) => [o.label, o.insight])];
      for (const text of texts) {
        expect(/\bOPERATE\b/.test(text), `bare OPERATE token in ${q.id}`).toBe(false);
      }
    }
  });
});

describe("scenario bank", () => {
  it("has 3-5 scenarios with unique ids anchored to real acts", () => {
    expect(OPERATION_SCENARIOS.length).toBeGreaterThanOrEqual(3);
    expect(OPERATION_SCENARIOS.length).toBeLessThanOrEqual(5);
    const ids = OPERATION_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of OPERATION_SCENARIOS) {
      expect(ACT_IDS.has(s.anchorActId), `unknown act ${s.anchorActId} in ${s.id}`).toBe(true);
    }
  });

  it("every choice has nonempty tradeoff text and valid weights", () => {
    for (const s of OPERATION_SCENARIOS) {
      expect(s.choices.length).toBe(3);
      expect(new Set(s.choices.map((c) => c.id)).size).toBe(3);
      for (const choice of s.choices) {
        expect(choice.gained.length, `${s.id}/${choice.id} missing gained`).toBeGreaterThan(0);
        expect(choice.exposed.length, `${s.id}/${choice.id} missing exposed`).toBeGreaterThan(0);
        expect(choice.secondOrder.length, `${s.id}/${choice.id} missing secondOrder`).toBeGreaterThan(0);
        const entries = Object.entries(choice.weights);
        expect(entries.length, `${s.id}/${choice.id} empty weights`).toBeGreaterThan(0);
        expect(entries.length).toBeLessThanOrEqual(3);
        for (const [dim, weight] of entries) {
          expect(DIMENSION_SET.has(dim), `${s.id}/${choice.id} unknown dim ${dim}`).toBe(true);
          expect(Number.isInteger(weight)).toBe(true);
          expect(Math.abs(weight as number)).toBeLessThanOrEqual(3);
        }
        expect(Object.keys(choice.postureAffinity).length).toBeGreaterThan(0);
      }
    }
  });
});

describe("knowledge layer content", () => {
  it("terrain has exactly 8 nodes with unique ids and valid edges", async () => {
    const { TERRAIN_NODES, TERRAIN_EDGES } = await import("../terrain");
    expect(TERRAIN_NODES.length).toBe(8);
    const ids = new Set(TERRAIN_NODES.map((n) => n.id));
    expect(ids.size).toBe(8);
    for (const edge of TERRAIN_EDGES) {
      expect(ids.has(edge.from), `edge from ${edge.from}`).toBe(true);
      expect(ids.has(edge.to), `edge to ${edge.to}`).toBe(true);
    }
    for (const node of TERRAIN_NODES) {
      expect(node.unlockActIndex).toBeGreaterThanOrEqual(1);
      expect(node.unlockActIndex).toBeLessThanOrEqual(7);
    }
  });

  it("adversary briefs cover all 7 essay acts with 3 vectors each", async () => {
    const { ADVERSARY_BRIEFS } = await import("../adversary");
    expect(ADVERSARY_BRIEFS.length).toBe(7);
    for (const brief of ADVERSARY_BRIEFS) {
      expect(ACT_IDS.has(brief.actId), `unknown act ${brief.actId}`).toBe(true);
      expect(brief.vectors.length).toBe(3);
      expect(brief.counter.length).toBeGreaterThan(0);
    }
  });

  it("every declassified extra references a real gate and act", async () => {
    const { DECLASSIFIED_EXTRAS } = await import("../declassified");
    const gateIds = new Set(GATES.map((g) => g.id));
    for (const extra of DECLASSIFIED_EXTRAS) {
      expect(gateIds.has(extra.gateId), `unknown gate ${extra.gateId}`).toBe(true);
      expect(ACT_IDS.has(extra.actId), `unknown act ${extra.actId}`).toBe(true);
      expect(extra.body.length).toBeGreaterThan(0);
      expect(extra.requirementText.length).toBeGreaterThan(0);
    }
  });

  it("role lenses cover all 7 essay acts for all 3 roles", async () => {
    const { ROLE_LENSES } = await import("../role-lenses");
    const essayActIds = ACTS.slice(1).map((a) => a.id);
    for (const actId of essayActIds) {
      const lenses = ROLE_LENSES[actId];
      expect(lenses, `missing lenses for ${actId}`).toBeDefined();
      for (const role of ["ANALYST", "OPERATOR", "COMMANDER"] as const) {
        expect(lenses[role].focus.length).toBeGreaterThan(0);
        expect(lenses[role].question.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("unlock gates", () => {
  it("gate ids are unique", () => {
    const ids = GATES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("actAssessed requirements reference real act ids", () => {
    for (const gate of GATES) {
      if (gate.requires.actAssessed) {
        expect(ACT_IDS.has(gate.requires.actAssessed), `gate ${gate.id}`).toBe(true);
      }
    }
  });
});

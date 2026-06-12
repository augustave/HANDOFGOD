// Declassification gates: pure predicate evaluation over journey progress
// and the derived profile. Gate definitions live in data/unlock-gates.ts /
// data/declassified.ts; this module only evaluates them.

import type { Dimension, Profile } from "./weights";

export type UnlockKind = "evidence" | "counterargument" | "redteam" | "case_study";

export interface UnlockRequirement {
  /** Minimum count of essay acts read. */
  actsRead?: number;
  /** Minimum count of assessment responses recorded. */
  responses?: number;
  /** Minimum count of scenario choices committed. */
  scenarios?: number;
  /** A specific act's checkpoint must be answered (act id). */
  actAssessed?: string;
  /** Minimum score on specific dimensions. */
  dimensionMin?: Readonly<Partial<Record<Dimension, number>>>;
}

export interface UnlockGate {
  id: string;
  kind: UnlockKind;
  requires: UnlockRequirement;
}

export interface UnlockContext {
  actsReadCount: number;
  responsesCount: number;
  scenariosCount: number;
  /** Act ids whose assessment checkpoint has been answered. */
  assessedActIds: readonly string[];
  profile: Profile;
}

export function isGateOpen(gate: UnlockGate, ctx: UnlockContext): boolean {
  const req = gate.requires;
  if (req.actsRead !== undefined && ctx.actsReadCount < req.actsRead) return false;
  if (req.responses !== undefined && ctx.responsesCount < req.responses) return false;
  if (req.scenarios !== undefined && ctx.scenariosCount < req.scenarios) return false;
  if (req.actAssessed !== undefined && !ctx.assessedActIds.includes(req.actAssessed)) return false;
  if (req.dimensionMin) {
    for (const [dim, min] of Object.entries(req.dimensionMin)) {
      if (min !== undefined && ctx.profile[dim as Dimension] < min) return false;
    }
  }
  return true;
}

export function computeUnlocks(
  gates: readonly UnlockGate[],
  ctx: UnlockContext,
): readonly string[] {
  return gates.filter((gate) => isGateOpen(gate, ctx)).map((gate) => gate.id);
}

// Turns a gate's UnlockRequirement into a structured, human-readable
// checklist with met/unmet state — so no lock is ever an unexplained "LOCKED".

import { ACTS } from "../data/dossier";
import type { UnlockRequirement } from "../engine/unlocks";

export interface RequirementLine {
  label: string;
  have: number;
  need: number;
  met: boolean;
}

export interface RequirementContext {
  actsReadCount: number;
  responsesCount: number;
  scenariosCount: number;
  assessedActIds: readonly string[];
}

const ACT_CODE_BY_ID = new Map(ACTS.map((a) => [a.id, a.code]));

export function gateRequirementLines(
  requires: UnlockRequirement,
  ctx: RequirementContext,
): RequirementLine[] {
  const lines: RequirementLine[] = [];

  if (requires.actsRead !== undefined) {
    lines.push({
      label: "SECTIONS READ",
      have: ctx.actsReadCount,
      need: requires.actsRead,
      met: ctx.actsReadCount >= requires.actsRead,
    });
  }
  if (requires.responses !== undefined) {
    lines.push({
      label: "ASSESSMENTS LOGGED",
      have: ctx.responsesCount,
      need: requires.responses,
      met: ctx.responsesCount >= requires.responses,
    });
  }
  if (requires.scenarios !== undefined) {
    lines.push({
      label: "OPERATIONS RUN",
      have: ctx.scenariosCount,
      need: requires.scenarios,
      met: ctx.scenariosCount >= requires.scenarios,
    });
  }
  if (requires.actAssessed !== undefined) {
    const code = ACT_CODE_BY_ID.get(requires.actAssessed) ?? requires.actAssessed;
    const met = ctx.assessedActIds.includes(requires.actAssessed);
    lines.push({ label: `${code} ASSESSMENT`, have: met ? 1 : 0, need: 1, met });
  }
  return lines;
}

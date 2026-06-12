// Declassification gate definitions. The gated content itself lives in
// data/declassified.ts (P7); these gates also drive RedactionInline reveals
// (per-act declassification = that act's checkpoint answered).

import type { UnlockGate } from "../engine/unlocks";

export const UNLOCK_GATES = [
  // Per-act declassification: answering an act's field assessment lifts its redactions.
  { id: "declass-ax01", kind: "evidence", requires: { actAssessed: "myth_of_morality" } },
  { id: "declass-ax02", kind: "evidence", requires: { actAssessed: "authentic_narrative" } },
  { id: "declass-ax03", kind: "evidence", requires: { actAssessed: "two_front" } },
  { id: "declass-ax04", kind: "evidence", requires: { actAssessed: "sovereign" } },
  { id: "declass-ax05", kind: "evidence", requires: { actAssessed: "operational_interfaces" } },
  { id: "declass-ax06", kind: "evidence", requires: { actAssessed: "education" } },

  // Cross-cutting knowledge gates (content attached in data/declassified.ts).
  { id: "extra-popes-foul", kind: "case_study", requires: { actAssessed: "myth_of_morality" } },
  { id: "extra-waugh-duel", kind: "case_study", requires: { responses: 4 } },
  { id: "extra-counter-suckers", kind: "counterargument", requires: { responses: 3 } },
  { id: "extra-redteam-psyop", kind: "redteam", requires: { responses: 5, scenarios: 1 } },
  { id: "extra-counter-unity", kind: "counterargument", requires: { responses: 4, scenarios: 1 } },
  { id: "extra-redteam-thesis", kind: "redteam", requires: { responses: 6, scenarios: 2, actsRead: 5 } },
] as const satisfies readonly UnlockGate[];

export type UnlockGateId = (typeof UNLOCK_GATES)[number]["id"];

/** Gate id that declassifies a given act's inline redactions. */
export function declassGateIdForAct(actId: string): string {
  const map: Record<string, string> = {
    myth_of_morality: "declass-ax01",
    authentic_narrative: "declass-ax02",
    two_front: "declass-ax03",
    sovereign: "declass-ax04",
    operational_interfaces: "declass-ax05",
    education: "declass-ax06",
  };
  return map[actId] ?? "";
}

// DECLASSIFIED EXTRAS (PRD F05): gated content — case studies, counter-
// arguments, and red-team critiques of the essay's own thesis. Gate
// conditions live in unlock-gates.ts (matched by gateId). The locked state
// always names its requirement; never a mystery lock.

import type { UnlockKind } from "../engine/unlocks";

export interface DeclassifiedExtra {
  /** Must match a gate id in data/unlock-gates.ts. */
  gateId: string;
  actId: string;
  kind: UnlockKind;
  title: string;
  body: string;
  /** Human-readable unlock requirement, shown while locked. */
  requirementText: string;
}

export const DECLASSIFIED_EXTRAS: readonly DeclassifiedExtra[] = [
  {
    gateId: "extra-popes-foul",
    actId: "myth_of_morality",
    kind: "case_study",
    title: "CASE_STUDY // THE_POPE'S_FOUL",
    body:
      "The late Pope Francis — a die-hard San Lorenzo fan — would have been hard-pressed to call it a foul. It might be the only lie a Pope could tell as God's representative on earth: that the goal was legitimate. That is the gravitational pull of a national myth — it bends even the institutions whose entire authority rests on truth-telling. When evaluating any narrative's power, ask not who believes it, but who is structurally unable to deny it.",
    requirementText: "COMPLETE AX-01 FIELD_ASSESSMENT TO DECLASSIFY",
  },
  {
    gateId: "extra-waugh-duel",
    actId: "final",
    kind: "case_study",
    title: "CASE_STUDY // THE_WAUGH_DUEL",
    body:
      "Annie Jacobsen asked Billy Waugh and Ric Prado — two of the CIA's paramilitary legends — who would win if they had to kill each other. Each said 'me.' Then Waugh came back to her: 'Let me tell you how I would win. I'd cheat. I'd show up before the duel and I'd kill him.' The lesson is not about murder. The dangerous player refuses the duel entirely — changes the terrain, shows up early, flips the script, and wins before you recognize what game you're in. Respond only with polite predictability, and you've done half their job for them.",
    requirementText: "LOG 4 FIELD_ASSESSMENTS TO DECLASSIFY",
  },
  {
    gateId: "extra-counter-suckers",
    actId: "authentic_narrative",
    kind: "counterargument",
    title: "COUNTERARGUMENT // THE_HUMILITY_DEFENSE",
    body:
      "The strongest case against this section: performative caution is sometimes genuine epistemic humility, and the Sucker's Payoff frame assumes a one-shot, two-player, zero-sum game. Real research ecosystems are iterated and multi-player — where reputation compounds and cooperation can be the dominant strategy. Open norms built the very capability the essay wants defended; closing them may destroy more capacity than espionage ever extracts. The essay's reply — choose openness deliberately, not by habit — only works if the chooser can actually tell the games apart.",
    requirementText: "LOG 3 FIELD_ASSESSMENTS TO DECLASSIFY",
  },
  {
    gateId: "extra-redteam-psyop",
    actId: "two_front",
    kind: "redteam",
    title: "RED_TEAM_MEMO // THE_UNFALSIFIABLE_OP",
    body:
      "Against the PSYOP reading of the DeepSeek discourse: 'it would look exactly like an op' is unfalsifiable — organic market correction, schadenfreude toward incumbents, and genuine technical admiration would look identical. A doctrine that codes domestic criticism as enemy action is itself a textbook demoralization vector: it corrodes the trust between builders and their public faster than any foreign operation could. The defensible posture is the narrow one the essay lands on — hypothesis discipline, not attribution. Anyone who skips from 'analyzable as an op' to 'is an op' has been captured by their own frame.",
    requirementText: "LOG 5 ASSESSMENTS + RUN 1 OPERATION TO DECLASSIFY",
  },
  {
    gateId: "extra-counter-unity",
    actId: "operational_interfaces",
    kind: "counterargument",
    title: "COUNTERARGUMENT // THE_CAPTURE_LEDGER",
    body:
      "The capture worry is not a reflex — it is a ledger. Interfaces between concentrated industry and state power have historically flowed one way: toward the state borrowing legitimacy and the industry borrowing impunity. Bernays cuts both ways: the engineering of consent the essay warns about is exactly what a tech-state coordination apparatus would be optimized to produce, with better tools than Bernays imagined. The essay's answer — negotiated, PUBLISHED interfaces with exit clauses — is the only version of unity that survives this objection. Secret coordination validates every fear; legible coordination is the experiment worth running.",
    requirementText: "LOG 4 ASSESSMENTS + RUN 1 OPERATION TO DECLASSIFY",
  },
  {
    gateId: "extra-redteam-thesis",
    actId: "final",
    kind: "redteam",
    title: "RED_TEAM_MEMO // AGAINST_THE_WHOLE_THESIS",
    body:
      "The strongest version of the case against this entire dossier: it is itself a mobilization narrative. 'Strategic literacy' smuggles in the militarization of civilian design under the flag of education; the adversary frame, rehearsed long enough, becomes self-fulfilling — you build the enemy you model. The Maradona myth is doing in this essay exactly what the essay says myths do: compressing complexity into a story that restores agency to its readers. If the author is right about how narratives work, this one deserves the same scrutiny. The essay's only honest defense is the one it makes: accountability and self-scrutiny are not self-disarmament — and a literacy tool that red-teams its own thesis is practicing what it preaches.",
    requirementText: "READ 5 SECTIONS + 6 ASSESSMENTS + 2 OPERATIONS TO DECLASSIFY",
  },
];

export function declassifiedForAct(actId: string): readonly DeclassifiedExtra[] {
  return DECLASSIFIED_EXTRAS.filter((extra) => extra.actId === actId);
}

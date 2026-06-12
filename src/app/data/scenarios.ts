// OPERATE scenario bank. Conventions (enforced by content test):
// - no strictly dominant choice; every choice has real gained/exposed/secondOrder text
// - weights ints -3..+3, ≤3 dimensions per choice
// - ids append-only

import type { OperationScenario } from "../engine/content-types";

export const OPERATION_SCENARIOS = [
  {
    id: "scn-disclosure",
    code: "OP-01 // THE_DISCLOSURE_DILEMMA",
    title: "The Disclosure Dilemma",
    anchorActId: "authentic_narrative",
    situation:
      "Your lab develops a capability paper with clear dual-use implications. Open-research norms say publish. Your red team says the methods section is a blueprint. The comms team says silence will leak and look worse.",
    constraint: "You have one move. The paper exists; the only question is custody.",
    choices: [
      {
        id: "A",
        label: "Publish everything. Open research is the norm that built the field.",
        gained: "Community goodwill, reproducibility, recruiting signal, moral high ground inside the field.",
        exposed: "Capability diffusion to actors who share none of your constraints. The methods section is now everyone's methods section.",
        secondOrder:
          "Your openness becomes the training data for rivals' closed programs. The norm you defended erodes anyway — defection by others is subsidized by your cooperation.",
        weights: { capabilityOrientation: -2, strategicRealism: -2, institutionalTrust: 1 },
        postureAffinity: { watcher: 2 },
      },
      {
        id: "B",
        label: "Selective release: findings public, methods gated, threat model published alongside.",
        gained: "Demonstrates the capability and the custody. Sets a citable precedent for strategic openness.",
        exposed: "Both flanks snipe: openness absolutists call it betrayal, security hawks call it leakage. Gating invites social engineering of the gate.",
        secondOrder:
          "If the gate holds, you've prototyped the interface between research culture and security reality — other labs copy the pattern. If it leaks, you own the worst of both worlds.",
        weights: { strategicRealism: 3, systemAwareness: 2, operationalThinking: 1 },
        postureAffinity: { architect: 3 },
      },
      {
        id: "C",
        label: "Full silence. Shelve the paper, deploy the capability internally.",
        gained: "Zero diffusion. Maximum lead time. The capability compounds in private.",
        exposed: "Leak risk transfers to people — departures, poaching, resentment. Silence reads as deceit when discovered, and it is always discovered.",
        secondOrder:
          "Internal culture learns that the org's stated values are situational. The strongest researchers — the ones with options — start choosing labs whose values survive contact with power.",
        weights: { capabilityOrientation: 2, narrativeLiteracy: -2, operationalThinking: 1 },
        postureAffinity: { sovereign: 2 },
      },
    ],
  },
  {
    id: "scn-deepseek",
    code: "OP-02 // THE_DEEPSEEK_MOMENT",
    title: "The DeepSeek Moment",
    anchorActId: "two_front",
    situation:
      "A rival state's lab ships a model competitive with yours, reportedly trained on a stockpile of export-controlled silicon. Overnight, domestic discourse turns: commentators celebrate your stumble, your stock slides, your researchers read the timeline instead of working.",
    constraint: "The technical gap is recoverable. The narrative window is days.",
    choices: [
      {
        id: "A",
        label: "Heads down. Ship the next model; let the work answer.",
        gained: "No oxygen spent on discourse. Engineering culture protected from panic-driven thrash.",
        exposed: "The narrative field is conceded for the entire cycle. Talent, capital, and policy all read sentiment — silence prices you down on every market that matters.",
        secondOrder:
          "By the time the next model ships, the story is set: you were beaten. Even a superior release now reads as catch-up. The two-front war was fought on one front.",
        weights: { capabilityOrientation: 2, narrativeLiteracy: -3 },
        postureAffinity: { architect: 2 },
      },
      {
        id: "B",
        label: "Engage the narrative: publish your own audit of the rival's claims, costs, and silicon — with receipts.",
        gained: "Reframes the story from \"you lost\" to \"here is what actually happened.\" Models narrative defense for the whole sector.",
        exposed: "If any receipt is wrong, your credibility takes the full hit. Engaging confirms the story matters, amplifying it for another news cycle.",
        secondOrder:
          "You've taught your own ecosystem that discourse is an attack surface with countermeasures — and taught the adversary that the next op needs better laundering.",
        weights: { narrativeLiteracy: 3, strategicRealism: 2 },
        postureAffinity: { sovereign: 2, watcher: 1 },
      },
      {
        id: "C",
        label: "Escalate privately: brief policymakers on the export-control breach; say nothing publicly.",
        gained: "The enforcement lever moves without you touching the discourse. Deniability preserved.",
        exposed: "Public narrative stays conceded. If the briefing leaks, you look like you ran to the referee instead of competing.",
        secondOrder:
          "Policy moves on your timeline once — then you're a known channel, and every future briefing is priced into how rivals and allies treat you.",
        weights: { operationalThinking: 2, institutionalTrust: 2, narrativeLiteracy: -1 },
        postureAffinity: { watcher: 2, architect: 1 },
      },
    ],
  },
  {
    id: "scn-chokepoint",
    code: "OP-03 // CHOKEPOINT_RESPONSE",
    title: "Chokepoint Response",
    anchorActId: "sovereign",
    situation:
      "Your hardware line depends on a refined-materials supplier inside a rival state's jurisdiction. Export quotas just tightened \"for environmental review.\" Your buffer is nine months. Re-engineering around the dependency takes eighteen.",
    constraint: "Every option costs margin. The question is which decade pays it.",
    choices: [
      {
        id: "A",
        label: "Ride it out. Lobby for diplomatic resolution; quotas usually relax.",
        gained: "No capital spent on redesign. If quotas relax, you banked the margin your cautious competitors burned.",
        exposed: "The dependency is now a known lever — and you've shown it works. Nine months of buffer is the exact length of your negotiating leash.",
        secondOrder:
          "Every future product decision is made knowing the lever exists. Self-censorship compounds quietly: features, markets, and partnerships get pre-filtered by what might tighten the quota.",
        weights: { systemAwareness: -2, strategicRealism: -2, capabilityOrientation: 1 },
        postureAffinity: { watcher: 2 },
      },
      {
        id: "B",
        label: "Dual-track: stockpile aggressively now, fund the design-out in parallel.",
        gained: "Buffer extends to cover the redesign window. The dependency has an expiration date you control.",
        exposed: "Stockpiling at scale signals your fear and moves the spot price against you. Two budgets burn at once; the board sees margin compression for six quarters.",
        secondOrder:
          "If others copy the pattern, the chokepoint itself depreciates as leverage — supply-chain security becomes a sector norm instead of a unilateral cost.",
        weights: { systemAwareness: 3, operationalThinking: 2, strategicRealism: 1 },
        postureAffinity: { architect: 3 },
      },
      {
        id: "C",
        label: "Hard pivot: announce the redesign publicly, eat the transition gap.",
        gained: "Maximum strategic clarity. The lever is destroyed the day you announce it — there's nothing left to squeeze.",
        exposed: "Eighteen months of product gap with no buffer strategy. Competitors ship into the hole you opened on principle.",
        secondOrder:
          "You've traded near-term market position for long-term sovereignty — defensible only if the rest of the roadmap can carry the gap. Heroic exits look different from inside a layoff.",
        weights: { capabilityOrientation: 2, systemAwareness: 1, operationalThinking: -1 },
        postureAffinity: { sovereign: 3 },
      },
    ],
  },
  {
    id: "scn-seating-chart",
    code: "OP-04 // THE_SEATING_CHART",
    title: "The Seating Chart",
    anchorActId: "operational_interfaces",
    situation:
      "A government coordination program invites your company in: shared threat models, incident channels, standards influence. Your community reads any government proximity as capture. The invitation is also, unmistakably, a signal being composed for foreign observers.",
    constraint: "Declining is also a message. There is no move that sends nothing.",
    choices: [
      {
        id: "A",
        label: "Decline publicly. Independence is the brand and the principle.",
        gained: "Community trust intact. No compliance surface, no entanglement, clean story.",
        exposed: "You exit the room where standards and threat models get written. Your interests get represented by whoever stayed.",
        secondOrder:
          "In the adversary's framework, your non-coordination is an asset they didn't have to buy. The interfaces get built anyway — shaped by parties whose incentives aren't yours.",
        weights: { institutionalTrust: -2, operationalThinking: -1, narrativeLiteracy: 1 },
        postureAffinity: { sovereign: 2 },
      },
      {
        id: "B",
        label: "Join with negotiated terms: scoped data sharing, published interface, exit clause.",
        gained: "A seat where the threat models are written, on terms you can defend in public. The published interface becomes the template others demand.",
        exposed: "Negotiating terms takes months you might not have. The community narrative (\"captured\") starts before the terms are public.",
        secondOrder:
          "You've demonstrated that coordination and independence aren't a binary — the negotiated-interface pattern becomes how the sector engages, which was the actual point.",
        weights: { operationalThinking: 3, institutionalTrust: 2, systemAwareness: 1 },
        postureAffinity: { architect: 3 },
      },
      {
        id: "C",
        label: "Join quietly, no announced terms. Influence from inside, optics managed later.",
        gained: "Immediate access, zero negotiation delay, full visibility into the threat picture.",
        exposed: "When it surfaces — and it surfaces — the story isn't coordination, it's concealment. You've validated every capture narrative retroactively.",
        secondOrder:
          "The next company offered a seat now faces a community primed by your secrecy. You made the legible version of this move harder for everyone.",
        weights: { operationalThinking: 1, narrativeLiteracy: -2, institutionalTrust: 1 },
        postureAffinity: { watcher: 1, sovereign: 1 },
      },
    ],
  },
] as const satisfies readonly OperationScenario[];

export function scenariosForAct(actId: string): readonly OperationScenario[] {
  return OPERATION_SCENARIOS.filter((s) => s.anchorActId === actId);
}

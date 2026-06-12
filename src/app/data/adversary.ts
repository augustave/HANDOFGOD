// ADVERSARY BRIEFS (PRD F06): each act reframed from the attacker's side.
// "If you wanted this argument or system to fail: ..." — ending with the
// counter. Teaching threat modeling by inversion.

export interface AdversaryBrief {
  actId: string;
  objective: string;
  vectors: readonly [string, string, string];
  counter: string;
}

export const ADVERSARY_BRIEFS: readonly AdversaryBrief[] = [
  {
    actId: "myth_of_morality",
    objective: "Weaponize the belonging protocol: make the loyalty test serve you.",
    vectors: [
      "Author the myth first — whoever frames the wound controls what counts as revenge.",
      "Inflame the belonging test until it expels the society's most capable members.",
      "Keep the morality debate alive forever; while they argue theology, you operate.",
    ],
    counter:
      "A society that understands what its myths are FOR can ride them through emergencies without being steered by whoever feeds them.",
  },
  {
    actId: "authentic_narrative",
    objective: "Lock the builders into permanent performative caution.",
    vectors: [
      "Reward every public apology for capability with status; punish every plain statement of strength.",
      "Frame security work as paranoia and coordination as militarism — make self-disarmament the prestige posture.",
      "Subsidize the Sucker's Payoff: praise their openness loudly while harvesting it quietly.",
    ],
    counter:
      "Name the inversion. A culture that can say 'we build power, here are the controls' without flinching is immune to shame-based disarmament.",
  },
  {
    actId: "two_front",
    objective: "Win the war the firewall can't see.",
    vectors: [
      "Time narrative spikes to capability releases — make every domestic win feel like a scandal.",
      "Amplify authentic critics; you don't need agents when incentives plus narrative gravity recruit volunteers.",
      "Keep their analysts unable to ask 'is this an op?' without being laughed out of the room.",
    ],
    counter:
      "Hypothesis discipline: treat discourse anomalies as potentially designed until ruled out. Asking the question without flinching is the entire defense.",
  },
  {
    actId: "sovereign",
    objective: "Hold the chokepoints; let them keep believing in 'civilian tech.'",
    vectors: [
      "Encourage the civilian/military fiction — every unexamined dependency is a lever you own.",
      "Concentrate refining, packaging, and tooling where your jurisdiction reaches; sell convenience.",
      "Squeeze quietly and rarely, so mapping dependencies never feels urgent to their boards.",
    ],
    counter:
      "Model chokepoints like latency. Dependencies that are mapped, priced, and dual-sourced stop being levers and start being line items.",
  },
  {
    actId: "operational_interfaces",
    objective: "Keep the Valley and DC unable to coordinate.",
    vectors: [
      "Feed the capture narrative: every interface between tech and state reads as corruption.",
      "Make legible coordination expensive — so the only cooperation that happens is secret, and discoverable.",
      "Count their internal friction as your asset; non-coordination needs no agents.",
    ],
    counter:
      "Negotiated, published interfaces. Coordination with terms you can defend in public destroys both the capture narrative and the secrecy trap.",
  },
  {
    actId: "education",
    objective: "Keep the builders illiterate in the domain they already operate in.",
    vectors: [
      "Maintain the script: security literacy is someone else's job, somewhere in a government building.",
      "Flood design culture with Hollywood threat models so the real ones look boring.",
      "Let 'open by default' stay an unexamined virtue — defaults are the cheapest exfiltration channel ever built.",
    ],
    counter:
      "Point the existing temperament at the avoided domain. A designer who has read one real intelligence history stops being a free asset.",
  },
  {
    actId: "final",
    objective: "Make sure the trance never breaks.",
    vectors: [
      "Keep them preparing for fair duels while you show up early.",
      "Convert their strategic maturity discourse into aesthetics — posture as cosplay, never protocol.",
      "If they must wake, steer the waking into permanent myth-mode: rage without institutions.",
    ],
    counter:
      "The trance ends when capability, ethics, and institutions move together. Myth sparks; protocols steer; the sword stays sheathed but held.",
  },
];

export function adversaryBriefForAct(actId: string): AdversaryBrief | undefined {
  return ADVERSARY_BRIEFS.find((brief) => brief.actId === actId);
}

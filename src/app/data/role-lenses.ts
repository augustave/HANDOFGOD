// ROLE LENSES (PRD F04): same content, different framing. Each role gets a
// reading focus and a question to hold per act — role switching reframes
// instantly with zero content duplication.

import type { SecurityRole } from "../types";

export interface RoleLens {
  focus: string;
  question: string;
}

type ActLenses = Readonly<Record<SecurityRole, RoleLens>>;

export const ROLE_LENSES: Readonly<Record<string, ActLenses>> = {
  myth_of_morality: {
    ANALYST: {
      focus: "Map the mechanism: how a rule-break became a national myth.",
      question: "What work is the myth doing that official channels couldn't?",
    },
    OPERATOR: {
      focus: "The belonging test is a protocol. Study how it screens entrants.",
      question: "What loyalty tests run inside your own organizations?",
    },
    COMMANDER: {
      focus: "Myth-mode carries nations through emergencies; it cannot govern one.",
      question: "When would you deploy a unifying myth — and when retire it?",
    },
  },
  authentic_narrative: {
    ANALYST: {
      focus: "Distinguish caution from performative caution — wisdom from self-handicap.",
      question: "Which apologies in tech discourse are signals, and to whom?",
    },
    OPERATOR: {
      focus: "A good man is a dangerous man under voluntary control. The sector inverted it.",
      question: "What capability do you hold that no one has secured?",
    },
    COMMANDER: {
      focus: "The Sucker's Payoff compounds: your openness subsidizes their defection.",
      question: "Where does unilateral cooperation become strategic donation?",
    },
  },
  two_front: {
    ANALYST: {
      focus: "Two components: tech and PSYOP. Most defenses cover only the first.",
      question: "How would you distinguish organic discourse from an operation?",
    },
    OPERATOR: {
      focus: "Markets versus systems: a lab hoarding compute, a navy hoarding oil.",
      question: "Which of your assets would a national-systems framework count?",
    },
    COMMANDER: {
      focus: "The simplest way to beat a strong country is to convince it to sabotage itself.",
      question: "What second-order effects follow from conceding the narrative front?",
    },
  },
  sovereign: {
    ANALYST: {
      focus: "Dual-use is a property of the terrain, not a label you choose.",
      question: "Which chokepoints does your stack sit on — or depend on?",
    },
    OPERATOR: {
      focus: "Asset, surface, failure, controls, metric: threat-model your own product.",
      question: "What would an adversary do with your default settings?",
    },
    COMMANDER: {
      focus: "900 pounds of rare earths per airframe. Supply chains are the battlefield.",
      question: "Which dependency, if squeezed, rewrites your roadmap for a decade?",
    },
  },
  operational_interfaces: {
    ANALYST: {
      focus: "Read the room's code, not its UI: composed signals of state capacity.",
      question: "What was that frame composed to say, and to which capitals?",
    },
    OPERATOR: {
      focus: "Unity is interfaces — protocols that survive contact with an incident.",
      question: "Which Valley-to-DC interface would you build first?",
    },
    COMMANDER: {
      focus: "If you don't decide how power is governed, regulators, adversaries, or crisis will.",
      question: "What coordination pattern fails worst in your current posture?",
    },
  },
  education: {
    ANALYST: {
      focus: "The gap is literacy, not aptitude. The designer temperament transfers.",
      question: "Which threat models are missing from your design reviews?",
    },
    OPERATOR: {
      focus: "Counterintelligence as operational hygiene — routine, not cosplay.",
      question: "What would 'strategically open' mean for your next release?",
    },
    COMMANDER: {
      focus: "If you build infrastructure, you inherit adversaries. Comfort is not a strategy.",
      question: "Whose literacy do you raise first: yours, your team's, or your org's?",
    },
  },
  final: {
    ANALYST: {
      focus: "The Hand of God is not an instruction manual — it's a lens on the real game.",
      question: "Which game are you actually in, and who refuses the duel?",
    },
    OPERATOR: {
      focus: "Strategic maturity: capability without apology, openness from strength.",
      question: "What does your committed posture obligate you to do Monday?",
    },
    COMMANDER: {
      focus: "Cunning without ethics is corruption; ethics without cunning is surrender.",
      question: "Where is your organization on that axis — honestly?",
    },
  },
};

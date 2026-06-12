// DEBRIEF copy: per-dimension strength/blind-spot readings and the
// recommended-study map that drives the AFTER_ACTION_REPORT reading list.

import type { Dimension } from "../engine/weights";

export interface DimensionDebrief {
  strength: string;
  blindSpot: string;
  reading: readonly { title: string; author: string }[];
}

export const DIMENSION_DEBRIEFS: Readonly<Record<Dimension, DimensionDebrief>> = {
  narrativeLiteracy: {
    strength:
      "You read stories as operations — who benefits, what work the myth is doing, which audience the frame was composed for.",
    blindSpot:
      "Discourse waves read as organic sentiment to you. Until you can ask \"what would this look like if it were an operation?\" without flinching, the second front stays invisible.",
    reading: [
      { title: "The Engineering of Consent", author: "Edward Bernays" },
      { title: "Active Measures", author: "Thomas Rid" },
    ],
  },
  institutionalTrust: {
    strength:
      "You calibrate trust instead of toggling it — distinguishing hostile from friendly actors, reading protocol signals for the composed messages they are.",
    blindSpot:
      "You default to either cynicism or deference toward institutions. Both are exploitable: one severs your interfaces, the other blinds you to capture.",
    reading: [
      { title: "The Quiet Americans", author: "Scott Anderson" },
      { title: "Protocol: The Power of Diplomacy", author: "Capricia Penavic Marshall" },
    ],
  },
  capabilityOrientation: {
    strength:
      "You build power without apologizing for it and treat restraint as something only the capable possess. The sheathed sword is sheathed by choice.",
    blindSpot:
      "Performative caution reads as virtue to you. Naming your own capability feels like arrogance — which means someone else gets to define what you hold.",
    reading: [
      { title: "The Technological Republic", author: "Alexander Karp" },
      { title: "Freedom's Forge", author: "Arthur Herman" },
    ],
  },
  strategicRealism: {
    strength:
      "You see payoff matrices where others see norms — unilateral openness as a donation, two-front attacks as standard doctrine, comfort as a non-strategy.",
    blindSpot:
      "You assume good faith scales. Game-theoretic floors (the Sucker's Payoff, defection incentives, narrative ops) feel cynical rather than descriptive.",
    reading: [
      { title: "The Strategy of Conflict", author: "Thomas Schelling" },
      { title: "Surprise, Kill, Vanish", author: "Annie Jacobsen" },
    ],
  },
  systemAwareness: {
    strength:
      "You model chokepoints like latency: supply chains, dual-use boundaries, and national-systems competition are design inputs, not someone else's department.",
    blindSpot:
      "\"Civilian tech\" still feels like a real category to you, and supply chains feel like procurement's problem. Dependencies you haven't mapped are decisions others make for you.",
    reading: [
      { title: "Chip War", author: "Chris Miller" },
      { title: "World on the Brink", author: "Dmitri Alperovitch" },
    ],
  },
  operationalThinking: {
    strength:
      "You convert literacy into protocols — interfaces over vibes, operational hygiene as routine, coordination patterns that survive contact with an incident.",
    blindSpot:
      "Understanding doesn't become procedure for you. Unity stays sentiment, security stays cosplay, and the checklist stays unchecked.",
    reading: [
      { title: "The Checklist Manifesto", author: "Atul Gawande" },
      { title: "Sandworm", author: "Andy Greenberg" },
    ],
  },
};

/** Signals below this count render the LOW_CONFIDENCE banner. */
export const CONFIDENCE_THRESHOLD = 8;

/** Total scorable signals (questions + scenarios + simulator caps). */
export const TOTAL_SIGNALS = 14 + 4 + 5;

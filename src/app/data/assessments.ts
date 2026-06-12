// FIELD ASSESSMENT question bank — the ASSESS phase content.
//
// Authoring conventions (enforced by data/__tests__/content.test.ts):
// - ids are append-only and never reused (they key persisted answers)
// - weights are integers -3..+3, at most 3 dimensions per option
// - every option must weight something: options are postures, not right/wrong
// - each dimension must be the primary `category` of at least 2 questions
// - never use the bare token "OPERATE" in copy (e2e exact-text match)

import type { AssessmentQuestion } from "../engine/content-types";

export const ASSESSMENT_QUESTIONS = [
  // ── AX-01 · The Belonging Test ──────────────────────────────────────────
  {
    id: "q-ax01-myth",
    afterActId: "myth_of_morality",
    category: "narrativeLiteracy",
    prompt:
      "A rival's \"illegitimate\" win becomes a national myth — church bells, car horns, strangers weeping. Your first analytical move:",
    options: [
      {
        id: "a",
        label: "Judge the morality. Rules are rules; the myth glorifies a foul.",
        insight:
          "THE COUNTER-READ: the morality question is the decoy. While you argue theology, the myth keeps doing its work — compressing grief into agency.",
        weights: { narrativeLiteracy: -2, institutionalTrust: 2 },
        postureAffinity: { watcher: 1 },
      },
      {
        id: "b",
        label: "Ask why the story took hold. Myths are doing work — find the work.",
        insight:
          "YOUR READ: function over verdict. A myth that restores agency after humiliation is a cultural immune response, not a moral failure.",
        weights: { narrativeLiteracy: 3, systemAwareness: 1 },
        postureAffinity: { watcher: 2 },
      },
      {
        id: "c",
        label: "Study how to author the next one. Whoever writes the myth steers the tribe.",
        insight:
          "YOUR READ: offensive narrative craft. Power move — but Argentina also teaches that myth-mode can spark a nation and still cannot govern one.",
        weights: { narrativeLiteracy: 2, operationalThinking: 2, institutionalTrust: -1 },
        postureAffinity: { sovereign: 2 },
      },
    ],
  },
  {
    id: "q-ax01-belonging",
    afterActId: "myth_of_morality",
    category: "narrativeLiteracy",
    prompt:
      "First day in a foreign schoolyard, you are handed a loyalty test you can barely decode. The test is best understood as:",
    options: [
      {
        id: "a",
        label: "Peer pressure — tribalism the individual should resist.",
        insight:
          "THE COUNTER-READ: calling it tribalism explains nothing about why it works. Belonging tests are load-bearing; resisting one doesn't disarm it.",
        weights: { narrativeLiteracy: -1, institutionalTrust: 1 },
        postureAffinity: { watcher: 1 },
      },
      {
        id: "b",
        label: "An immune response — a fractured nation testing for further breakage.",
        insight:
          "YOUR READ: the schoolyard question was a membrane protein. A society under stress screens entrants for whatever might break it further.",
        weights: { narrativeLiteracy: 2, systemAwareness: 2 },
        postureAffinity: { architect: 2 },
      },
      {
        id: "c",
        label: "An attack surface — whoever sets the test can steer the group.",
        insight:
          "YOUR READ: belonging protocols cut both ways. The same membrane that protects a tribe is the handle an adversary grabs to steer it.",
        weights: { narrativeLiteracy: 3, strategicRealism: 1 },
        postureAffinity: { sovereign: 1, watcher: 1 },
      },
    ],
  },

  // ── AX-02 · The Trance of Performative Goodness ────────────────────────
  {
    id: "q-ax02-press",
    afterActId: "authentic_narrative",
    category: "capabilityOrientation",
    prompt:
      "Your team ships a frontier capability. The press asks whether it should exist at all. You:",
    options: [
      {
        id: "a",
        label: "Perform uncertainty. Signal worry, apologize for the implications.",
        insight:
          "THE COUNTER-READ: narrating your own self-handicapping as morality. It feels virtuous from the inside; strategically, it's a donation.",
        weights: { capabilityOrientation: -3, institutionalTrust: 1 },
        postureAffinity: { watcher: 2 },
      },
      {
        id: "b",
        label: "Own it. Name the power, name the controls, name who's accountable.",
        insight:
          "YOUR READ: capability without apology, governance as part of the product. Restraint only means something if you're capable of doing otherwise.",
        weights: { capabilityOrientation: 3, operationalThinking: 1 },
        postureAffinity: { sovereign: 2 },
      },
      {
        id: "c",
        label: "Deflect. Whether it should exist is the regulator's question, not yours.",
        insight:
          "THE COUNTER-READ: if you don't decide how your power is governed, someone else will — regulators, adversaries, or crisis.",
        weights: { capabilityOrientation: -1, institutionalTrust: 2 },
        postureAffinity: { architect: 1, watcher: 1 },
      },
    ],
  },
  {
    id: "q-ax02-suckers-payoff",
    afterActId: "authentic_narrative",
    category: "strategicRealism",
    prompt:
      "Open research norms and universal trust on one side; espionage, subsidies, and total mobilization on the other. Continuing unilateral openness is:",
    options: [
      {
        id: "a",
        label: "Principled leadership. Hold the norm and others will follow.",
        insight:
          "THE COUNTER-READ: in the Prisoner's Dilemma this is the Sucker's Payoff — you cooperate while the other side defects. Norms don't enforce themselves.",
        weights: { strategicRealism: -3, institutionalTrust: 1 },
        postureAffinity: { watcher: 1 },
      },
      {
        id: "b",
        label: "A donation to the defector, dressed as virtue.",
        insight:
          "YOUR READ: the game-theoretic floor. Naming the payoff matrix isn't cynicism — it's the precondition for choosing openness deliberately instead of by habit.",
        weights: { strategicRealism: 3, narrativeLiteracy: 1 },
        postureAffinity: { sovereign: 2 },
      },
      {
        id: "c",
        label: "Context-dependent: open from strength, closed at chokepoints.",
        insight:
          "YOUR READ: selective openness. The mature posture — but it demands you actually know where your chokepoints are.",
        weights: { strategicRealism: 2, systemAwareness: 2 },
        postureAffinity: { architect: 2 },
      },
    ],
  },
  {
    id: "q-ax02-sheathed",
    afterActId: "authentic_narrative",
    category: "capabilityOrientation",
    prompt:
      "\"A good man is a very dangerous man who has that under voluntary control.\" The sector inverted it. The fix:",
    options: [
      {
        id: "a",
        label: "Build the sword, keep it sheathed, admit you're holding it.",
        insight:
          "YOUR READ: strength precedes virtue. The sheathed sword only counts as restraint if everyone knows it exists and you know how to use it.",
        weights: { capabilityOrientation: 3, strategicRealism: 1 },
        postureAffinity: { sovereign: 2 },
      },
      {
        id: "b",
        label: "Stay defenseless on purpose. Incapacity can't be abused.",
        insight:
          "THE COUNTER-READ: that's leaving loaded weapons in unlocked rooms and calling it peace — the weapons exist either way; only the custody changed.",
        weights: { capabilityOrientation: -2, institutionalTrust: 1 },
        postureAffinity: { watcher: 2 },
      },
      {
        id: "c",
        label: "Build quietly and never acknowledge the power in public.",
        insight:
          "THE COUNTER-READ: unacknowledged power can't be governed, secured, or legitimized. Opacity reads as deceit precisely when trust matters most.",
        weights: { capabilityOrientation: 1, narrativeLiteracy: -2 },
        postureAffinity: { architect: 1 },
      },
    ],
  },

  // ── AX-03 · The Two-Front War ───────────────────────────────────────────
  {
    id: "q-ax03-discourse",
    afterActId: "two_front",
    category: "strategicRealism",
    prompt:
      "A rival state's lab releases a competitive model. Domestic commentators all but cheer for your own builders to lose. Most useful first hypothesis:",
    options: [
      {
        id: "a",
        label: "Organic sentiment — markets correcting domestic hubris.",
        insight:
          "THE COUNTER-READ: maybe. But if you were designing a PSYOP to tank a rival's markets and seed doubt in its builders, it would look exactly like this.",
        weights: { strategicRealism: -1, institutionalTrust: 2 },
        postureAffinity: { watcher: 1 },
      },
      {
        id: "b",
        label: "Treat it as an operation until ruled out — analyze reach, timing, amplification.",
        insight:
          "YOUR READ: hypothesis discipline. You don't have to conclude it's hostile; you have to be capable of asking the question without flinching.",
        weights: { strategicRealism: 2, narrativeLiteracy: 2 },
        postureAffinity: { watcher: 2, sovereign: 1 },
      },
      {
        id: "c",
        label: "Noise. Only benchmarks and shipping velocity matter.",
        insight:
          "THE COUNTER-READ: that's defending one front of a two-front war. The second component targets something no benchmark covers — the will to defend your own advantage.",
        weights: { strategicRealism: -2, capabilityOrientation: 1 },
        postureAffinity: { architect: 1 },
      },
    ],
  },
  {
    id: "q-ax03-systems",
    afterActId: "two_front",
    category: "systemAwareness",
    prompt:
      "\"We are building products in a market. They are building capacity in a system.\" When the two collide:",
    options: [
      {
        id: "a",
        label: "The market wins long-run — innovation outpaces central planning.",
        insight:
          "THE COUNTER-READ: a navy training on civilian ferries and a lab stockpiling GPUs around export deadlines isn't central planning failing — it's a national system absorbing a market.",
        weights: { systemAwareness: -2, capabilityOrientation: 1 },
        postureAffinity: { architect: 1 },
      },
      {
        id: "b",
        label: "The system wins — unless the market's players learn to coordinate like one.",
        insight:
          "YOUR READ: the essay's wager. Markets beat systems only when they grow interfaces: shared threat models, standards leadership, Valley↔DC protocols.",
        weights: { systemAwareness: 3, strategicRealism: 1 },
        postureAffinity: { architect: 2 },
      },
      {
        id: "c",
        label: "Wrong frame — competition is good for everyone, collision is a myth.",
        insight:
          "THE COUNTER-READ: \"national total war\" doctrine — folding civilian, economic, and technological resources into the fight — is published policy, not a myth.",
        weights: { systemAwareness: -3, institutionalTrust: 1 },
        postureAffinity: { watcher: 1 },
      },
    ],
  },
  {
    id: "q-ax03-second-front",
    afterActId: "two_front",
    category: "narrativeLiteracy",
    prompt:
      "You can field the best cyber units and the most advanced labs — and still lose. Because:",
    options: [
      {
        id: "a",
        label: "Technology gaps always decide outcomes eventually.",
        insight:
          "THE COUNTER-READ: that's the half-defense. The simplest way to beat a strong country is to convince it to sabotage itself — no firewall covers that.",
        weights: { strategicRealism: -2, capabilityOrientation: 1 },
        postureAffinity: { architect: 1 },
      },
      {
        id: "b",
        label: "Narrative corrosion can disarm a society before any technical defeat.",
        insight:
          "YOUR READ: the second front. A culture that reads its own strength as shame does the adversary's work for free.",
        weights: { narrativeLiteracy: 3, strategicRealism: 1 },
        postureAffinity: { watcher: 1, sovereign: 1 },
      },
      {
        id: "c",
        label: "Alliances decide wars; domestic mood is irrelevant.",
        insight:
          "THE COUNTER-READ: alliances are made of domestic mood. A public convinced its own capability is shameful will not sustain any alliance worth having.",
        weights: { narrativeLiteracy: -2, systemAwareness: 1 },
        postureAffinity: { watcher: 1 },
      },
    ],
  },

  // ── AX-04 · The Sword You Pretend Not to Hold ──────────────────────────
  {
    id: "q-ax04-dual-use",
    afterActId: "sovereign",
    category: "systemAwareness",
    prompt:
      "You design comms, cloud, AI, or supply-chain software. The label \"civilian tech\":",
    options: [
      {
        id: "a",
        label: "Still applies — intent defines use, and your intent is civilian.",
        insight:
          "THE COUNTER-READ: the boundary didn't dissolve because anyone signed a treaty. It dissolved because software became the terrain. Your intent doesn't bind your users.",
        weights: { systemAwareness: -2, institutionalTrust: 1 },
        postureAffinity: { watcher: 1 },
      },
      {
        id: "b",
        label: "Dissolved. Anything shaping coordination at scale is dual-use infrastructure.",
        insight:
          "YOUR READ: whether you like the label or not. The question isn't whether you're part of the security architecture — it's whether you understand the threat models of what you build.",
        weights: { systemAwareness: 3, strategicRealism: 1 },
        postureAffinity: { sovereign: 2 },
      },
      {
        id: "c",
        label: "A useful fiction — keep it for liability reasons, knowing it's false.",
        insight:
          "YOUR READ: cynical but lucid. The risk: a fiction maintained long enough gets believed internally, and then the threat models never get built.",
        weights: { systemAwareness: 1, narrativeLiteracy: 1, institutionalTrust: -1 },
        postureAffinity: { watcher: 1, sovereign: 1 },
      },
    ],
  },
  {
    id: "q-ax04-chokepoint",
    afterActId: "sovereign",
    category: "systemAwareness",
    prompt:
      "One country refines ~90% of the world's rare earths; a single F-35 carries 900+ pounds of them. On your product roadmap, this is:",
    options: [
      {
        id: "a",
        label: "Procurement's problem. Roadmaps are about features.",
        insight:
          "THE COUNTER-READ: supply chains are the battlefield now. A dependency you didn't map is a decision someone else gets to make for you.",
        weights: { systemAwareness: -3 },
        postureAffinity: { watcher: 1 },
      },
      {
        id: "b",
        label: "A design constraint — model the chokepoints like you model latency.",
        insight:
          "YOUR READ: supply-chain security as a first-class design input. This is what \"product choices create geopolitical leverage\" means in practice.",
        weights: { systemAwareness: 3, operationalThinking: 2 },
        postureAffinity: { architect: 2 },
      },
      {
        id: "c",
        label: "A buying opportunity — stockpile and outlast the squeeze.",
        insight:
          "THE COUNTER-READ: inventory buys time, not resilience. A stockpile is a countdown timer unless the dependency itself gets designed out.",
        weights: { systemAwareness: 1, operationalThinking: -1 },
        postureAffinity: { sovereign: 1 },
      },
    ],
  },

  // ── AX-05 · Not Vibes. Protocols. ───────────────────────────────────────
  {
    id: "q-ax05-frame",
    afterActId: "operational_interfaces",
    category: "institutionalTrust",
    prompt:
      "One frame: a cluster of tech CEOs arrayed at the center of political power at an inauguration. You read it as:",
    options: [
      {
        id: "a",
        label: "The UI: wealth standing too close to power. Oligarchy on display.",
        insight:
          "THE COUNTER-READ: seating charts are composed for foreign governments the way sentences are composed. Reading only the UI means the message wasn't for you — and you still received it.",
        weights: { institutionalTrust: -2, narrativeLiteracy: -1 },
        postureAffinity: { watcher: 1 },
      },
      {
        id: "b",
        label: "The code: a composed message of state capacity — a tank parade in civilian dress.",
        insight:
          "YOUR READ: protocol literacy. The guest list is a forward indicator of policy; that frame was flexed toward Beijing and Moscow, not at you.",
        weights: { narrativeLiteracy: 2, institutionalTrust: 2 },
        postureAffinity: { sovereign: 1, architect: 1 },
      },
      {
        id: "c",
        label: "Theater. Photographs change nothing about actual capability.",
        insight:
          "THE COUNTER-READ: capability that can't be signaled can't deter. Russia parades tanks for the same reason — the photograph is part of the arsenal.",
        weights: { strategicRealism: -1, institutionalTrust: -1, narrativeLiteracy: -1 },
        postureAffinity: { watcher: 1 },
      },
    ],
  },
  {
    id: "q-ax05-unity",
    afterActId: "operational_interfaces",
    category: "operationalThinking",
    prompt: "Unity between government and tech, in practice, is:",
    options: [
      {
        id: "a",
        label: "Alignment of sentiment — get hearts and minds first, mechanisms later.",
        insight:
          "THE COUNTER-READ: chants don't survive contact with an incident. Unity that lives in sentiment evaporates exactly when coordination is needed most.",
        weights: { operationalThinking: -2, narrativeLiteracy: 1 },
        postureAffinity: { watcher: 1 },
      },
      {
        id: "b",
        label: "Interfaces — shared threat models, export controls that work, rapid coordination patterns.",
        insight:
          "YOUR READ: not vibes, protocols. Unity in 2026 is an engineering artifact: legible interfaces between the Valley and DC that function under pressure.",
        weights: { operationalThinking: 3, institutionalTrust: 1 },
        postureAffinity: { architect: 2 },
      },
      {
        id: "c",
        label: "Overrated — decentralized actors routing around each other is resilience.",
        insight:
          "THE COUNTER-READ: non-coordination is itself a failure mode — the adversary's framework counts your internal friction as their asset.",
        weights: { operationalThinking: -1, systemAwareness: 1 },
        postureAffinity: { sovereign: 1 },
      },
    ],
  },

  // ── AX-06 · The Education Gap ───────────────────────────────────────────
  {
    id: "q-ax06-temperament",
    afterActId: "education",
    category: "operationalThinking",
    prompt:
      "Product design: sitting with messy, adversarial, ambiguous systems without flinching — and shipping anyway. Against national-security work, this temperament is:",
    options: [
      {
        id: "a",
        label: "A different world. Leave security to the professionals.",
        insight:
          "THE COUNTER-READ: you're already an asset in a security architecture whether you admit it or not. Outsourcing the literacy doesn't outsource the exposure.",
        weights: { operationalThinking: -2, institutionalTrust: 2 },
        postureAffinity: { watcher: 1 },
      },
      {
        id: "b",
        label: "The same skill pointed at an avoided domain. The gap is literacy, not aptitude.",
        insight:
          "YOUR READ: the essay's actual point. Discomfort? Good. Ambiguity? Good. The temperament transfers; the threat models have to be learned.",
        weights: { operationalThinking: 3, capabilityOrientation: 1 },
        postureAffinity: { sovereign: 1, architect: 1 },
      },
      {
        id: "c",
        label: "Useful only inside government — designers should formally enlist.",
        insight:
          "THE COUNTER-READ: the leverage is exactly that you're NOT inside. Dual-use infrastructure is built in companies; the literacy has to live where the building happens.",
        weights: { operationalThinking: 1, institutionalTrust: 2 },
        postureAffinity: { architect: 1 },
      },
    ],
  },
  {
    id: "q-ax06-adversaries",
    afterActId: "education",
    category: "institutionalTrust",
    prompt: "\"If you build infrastructure, you inherit adversaries\" implies:",
    options: [
      {
        id: "a",
        label: "Paranoia by design — trust no actor, ever.",
        insight:
          "THE COUNTER-READ: treating hostile and friendly actors as equivalent isn't rigor — it's the same negligence as universal trust, inverted.",
        weights: { institutionalTrust: -3, strategicRealism: 1 },
        postureAffinity: { sovereign: 1 },
      },
      {
        id: "b",
        label: "Adult realism — recognize intent, distinguish hostile from friendly, calibrate trust.",
        insight:
          "YOUR READ: ethics require recognizing intent. The goal isn't paranoia; comfort is not a strategy either.",
        weights: { institutionalTrust: 2, strategicRealism: 2 },
        postureAffinity: { architect: 1, watcher: 1 },
      },
      {
        id: "c",
        label: "An overstatement — most products never face a real adversary.",
        insight:
          "THE COUNTER-READ: \"most products\" aren't coordination infrastructure. If yours shapes attention, communication, or supply at scale — the inheritance already happened.",
        weights: { strategicRealism: -2, institutionalTrust: 1 },
        postureAffinity: { watcher: 1 },
      },
    ],
  },
] as const satisfies readonly AssessmentQuestion[];

export type AssessmentQuestionId = (typeof ASSESSMENT_QUESTIONS)[number]["id"];

export function questionsForAct(actId: string): readonly AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS.filter((q) => q.afterActId === actId);
}

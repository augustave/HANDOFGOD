import type { DossierAct, SystemCardState } from "../types";

export const SYSTEM_CARD_STATES: SystemCardState[] = [
  { asset: "National Myth", surface: "Collective Grief", failure: "Fragmentation", controls: "Shared Ritual", metric: "Cohesion" },
  { asset: "Belonging Protocol", surface: "Outsider Test", failure: "Subversion Fever", controls: "Cultural Immune Response", metric: "Unity Under Pressure" },
  { asset: "Builder Confidence", surface: "Performative Caution", failure: "Sucker's Payoff", controls: "Capability Without Apology", metric: "Strategic Maturity" },
  { asset: "Frontier AI + Cloud + Comms", surface: "Tech + PSYOP (Two Fronts)", failure: "Self-Sabotage", controls: "Counter-Narrative Literacy", metric: "Willingness to Defend Advantage" },
  { asset: "Dual-Use Infrastructure", surface: "Open-Research Defaults + Supply Chain Opacity", failure: "Capability Diffusion + Narrative Corrosion", controls: "OpSec, Selective Openness, Valley↔DC Interfaces", metric: "Innovation Lead Without Legitimacy Collapse" },
  { asset: "National System Capacity", surface: "Cynicism Reflex", failure: "Reading Strength as Shame", controls: "Protocols, Not Vibes", metric: "Interface Coverage" },
  { asset: "Designer Temperament", surface: "Comfort", failure: "Literacy Gap", controls: "Discomfort? Good. Ambiguity? Good.", metric: "Adult Realism" },
  { asset: "The Sword", surface: "Polite Predictability", failure: "Surrender-by-Aesthetic", controls: "Sheathed But Held", metric: "Post-Trance Posture" },
];

export const ACTS: DossierAct[] = [
  { id: "hero", title: "The Hand of God", code: "AX-00", contentKey: "hero", systemState: SYSTEM_CARD_STATES[0] },
  { id: "myth_of_morality", title: "The Belonging Test", code: "AX-01", contentKey: "myth_of_morality", systemState: SYSTEM_CARD_STATES[1] },
  { id: "authentic_narrative", title: "The Trance of Performative Goodness", code: "AX-02", contentKey: "authentic_narrative", systemState: SYSTEM_CARD_STATES[2] },
  { id: "two_front", title: "The Two-Front War", code: "AX-03", contentKey: "two_front", systemState: SYSTEM_CARD_STATES[3] },
  { id: "sovereign", title: "The Sword You Pretend Not to Hold", code: "AX-04", contentKey: "sovereign", systemState: SYSTEM_CARD_STATES[4] },
  { id: "operational_interfaces", title: "Not Vibes. Protocols.", code: "AX-05", contentKey: "operational_interfaces", systemState: SYSTEM_CARD_STATES[5] },
  { id: "education", title: "The Education Gap", code: "AX-06", contentKey: "education", systemState: SYSTEM_CARD_STATES[6] },
  { id: "final", title: "Operate on Wake", code: "AX-07", contentKey: "final", systemState: SYSTEM_CARD_STATES[7] },
];

export const BRIEF_SUMMARIES = {
  myth_of_morality: {
    body: "1986: Maradona's illegal goal becomes a national myth. In post-Falklands Argentina, the Hand of God wasn't a rule-break — it was revenge, a reset, a ritual to take out a curse. People unify around capability and will, especially when official channels feel rigged against them.",
    bullets: ["A shared myth is a cultural immune response", "The belonging test precedes the rule debate", "Unity follows the will to win"],
  },
  authentic_narrative: {
    body: "American tech has a reflex: the more powerful the thing you build, the more urgently you perform uncertainty about whether it should exist. That's not caution — it's narrating self-handicapping as morality. In game-theory terms: playing Cooperate in a room full of Defectors.",
    bullets: ["Performative caution is not wisdom", "Defenselessness is not virtue", "The Sucker's Payoff feels noble from the inside"],
  },
  two_front: {
    body: "A serious intelligence operation has two components: Tech and PSYOP. You can win the technology side completely and still lose, because the second front targets a society's willingness to defend its own advantage. Beijing calls its version 'national total war' — a clash of national systems, not militaries.",
    bullets: ["No firewall covers demoralization", "Markets vs. systems: systems usually win", "The cheapest attack is convincing you to sabotage yourself"],
  },
  sovereign: {
    body: "If you design AI systems, cloud platforms, social networks, or supply-chain software, you're building dual-use infrastructure — whether you like the label or not. The civilian/national-security boundary dissolved because software became the terrain.",
    bullets: ["You already hold the sword", "Supply chains are the battlefield", "Ethics require recognizing intent"],
  },
  operational_interfaces: {
    body: "Unity in 2026 isn't chants — it's interfaces. Shared threat models, dual-use governance, enforceable export controls, supply-chain security as a design constraint. Read the inauguration frame like a Protocol officer: past the UI of politics to the code of capacity.",
    bullets: ["Seating charts are signal", "Treating strength as shame is the vulnerability", "If we don't decide, regulators, adversaries, or crisis will"],
  },
  education: {
    body: "Product designers need national security literacy because we are already assets in a national security architecture. Not 'should be.' Already are. And the temperament is one design already trains: sitting with messy, adversarial systems without flinching — and shipping anyway.",
    bullets: ["The gap isn't aptitude — it's literacy", "Discomfort? Good. Ambiguity? Good. Pressure? Good.", "Comfort is not a strategy"],
  },
} as const;

export const EXHIBITS = {
  myth_of_morality: {
    id: "01",
    title: "FALKLANDS_AFTERBURN_1986",
    source: "Historical context file. Argentina, post-Malvinas: defeat, humiliation, Dirty War aftermath, economic chaos. England as symbol of the recent victor.",
    threat: "A fractured nation with no legitimate channel for collective grief.",
    implication: "The illegal goal lands as ritual revenge — myth as immune system. Church bells, car horns, strangers weeping.",
  },
  authentic_narrative: {
    id: "02",
    title: "DEEPSEEK_DISCOURSE_AUDIT",
    source: "Open-source discourse review, Jan 2025: mainstream commentators cheering for American AI labs to lose the race. House Select Committee (Apr 2025): ~50,000 Hopper-generation Nvidia GPUs stockpiled around export-control deadlines.",
    threat: "If you were designing a PSYOP to tank a rival's markets and seed doubt in its builders, it would look exactly like this.",
    implication: "PLA entities referenced DeepSeek models in 12+ military procurement tenders in 2025.",
  },
  two_front: {
    id: "03",
    title: "NATIONAL_TOTAL_WAR_DOCTRINE",
    source: "DoD Annual Report to Congress on the PRC, Dec 23, 2025. Conflict envisioned as a 'clash of national systems' — whole-of-nation mobilization. PLA Navy training with civilian roll-on/roll-off vessels to cover its amphibious shortfall.",
    threat: "We build products in a market. They build capacity in a system.",
    implication: "When those two models collide, the market usually loses.",
  },
  sovereign: {
    id: "04",
    title: "RARE_EARTH_CHOKEPOINT",
    source: "Supply-chain assessment, 2025. China controls roughly 90% of global rare-earth processing — the refining and metal-making that turns rock into components.",
    threat: "A single F-35 contains over 900 pounds of rare-earth materials.",
    implication: "Supply chains are the battlefield now. Chokepoints are leverage.",
  },
} as const;

export const EDUCATION_NODES = [
  { cat: "Intel & Counterintel", items: ["How Real Intelligence Services Operate", "Counterintelligence as Operational Hygiene"] },
  { cat: "Info Ops", items: ["Information Operations & Narrative Warfare", "Demoralization as Attack Surface"] },
  { cat: "Security", items: ["Supply Chain Risk & Hardware Compromise", "Export Controls & Chokepoints"] },
  { cat: "Strategy", items: ["'Open by Default' vs 'Strategically Open'", "Product Choices as Geopolitical Leverage"] },
];

import type { DossierAct, SystemCardState } from "../types";

export const SYSTEM_CARD_STATES: SystemCardState[] = [
  { asset: "Foundational Myth", surface: "Public Trust", failure: "Cynicism Decay", controls: "Ritual Authenticity", metric: "Retention" },
  { asset: "Legitimacy Protocol", surface: "Moral Authority", failure: "Ideological Capture", controls: "Structural Integrity", metric: "Resilience" },
  { asset: "Attentional Flow", surface: "Dopaminergic Loops", failure: "Algorithmic Capture", controls: "Friction Injection", metric: "Agency Score" },
  { asset: "Infrastructure", surface: "Parallel Attack", failure: "Dual-Use Leakage", controls: "Sovereign Stack", metric: "Strategic Depth" },
  { asset: "Sovereign Intent", surface: "Willful Command", failure: "Strategic Paralysis", controls: "Accepting the Sword", metric: "Decisiveness" },
  { asset: "Human-Machine Edge", surface: "Cognitive Load", controls: "Legibility Frameworks", failure: "Interface Opacity", metric: "Literacy" },
  { asset: "Applied Epistemology", surface: "Mental Models", failure: "Capability Gap", controls: "Literacy Nodes", metric: "Outcome" },
  { asset: "Sovereign Wake", surface: "Conscious Action", failure: "Inertia", controls: "Willful Operation", metric: "Post-Trance Exit" },
];

export const ACTS: DossierAct[] = [
  { id: "hero", title: "Culture is the Surface", code: "AX-00", contentKey: "hero", systemState: SYSTEM_CARD_STATES[0] },
  { id: "myth_of_morality", title: "The Myth of Morality", code: "AX-01", contentKey: "myth_of_morality", systemState: SYSTEM_CARD_STATES[1] },
  { id: "authentic_narrative", title: "The Authentic Narrative", code: "AX-02", contentKey: "authentic_narrative", systemState: SYSTEM_CARD_STATES[2] },
  { id: "two_front", title: "The Two-Front War", code: "AX-03", contentKey: "two_front", systemState: SYSTEM_CARD_STATES[3] },
  { id: "sovereign", title: "The Sovereign", code: "AX-04", contentKey: "sovereign", systemState: SYSTEM_CARD_STATES[4] },
  { id: "operational_interfaces", title: "Operational Interfaces", code: "AX-05", contentKey: "operational_interfaces", systemState: SYSTEM_CARD_STATES[5] },
  { id: "education", title: "The Education", code: "AX-06", contentKey: "education", systemState: SYSTEM_CARD_STATES[6] },
  { id: "final", title: "Operate on Wake", code: "AX-07", contentKey: "final", systemState: SYSTEM_CARD_STATES[7] },
];

export const BRIEF_SUMMARIES = {
  myth_of_morality: {
    body: "Morality in tech is often a mask for structural fragility. We mistake performative compliance for ethical grounding, leaving systems vulnerable to asymmetric narrative attacks.",
    bullets: ["Virtue is not a firewall", "Legitimacy must be built, not borrowed", "Ethics without enforcement is just marketing"],
  },
  authentic_narrative: {
    body: "Authenticity is the currency of the digital age. Narrative is not just a story; it is a protocol that directs energy, attention, and capital. Without a sovereign narrative, you are an asset in someone else's campaign.",
    bullets: ["Attention is finite", "Narrative is an API for the mind", "Unaudited stories are dangerous code"],
  },
  two_front: {
    body: "Infrastructure is dual-use. Every technical system is a parallel attack surface for narrative warfare. To defend the stack, you must defend the operator's consciousness.",
    bullets: ["Bits and bytes vs. hearts and minds", "Security is holistic", "Trances are the primary threat vector"],
  },
  sovereign: {
    body: "Technology is a weapon. Acceptance of this dual-use reality is the first step toward stewardship. Sovereignty is the capacity to say \"No\" to the network and operate independently.",
    bullets: ["Acceptance > Avoidance", "Stewardship of power", "Out-of-band resilience"],
  },
  operational_interfaces: {
    body: "The interface is the mediator of power. Opaque interfaces create subjects; transparent interfaces create operators. Audit the edge where human and machine meet.",
    bullets: ["Transparency is accountability", "Manual overrides are essential", "Friction can be a feature"],
  },
  education: {
    body: "The capability gap is a strategic vulnerability. Literacy in narrative warfare, OPSEC, and sovereign infrastructure is the only long-term defense against capture.",
    bullets: ["Operators > Consumers", "Epistemological hygiene", "Applied literacy nodes"],
  },
} as const;

export const EXHIBITS = {
  myth_of_morality: {
    id: "01",
    title: "NARRATIVE_DECAY_AUDIT",
    source: "Internal memo from the 2024 Trust & Safety Collapse. Documenting the shift from protection to censorship.",
    threat: "Social engineering of internal validators using moral imperatives.",
    implication: "Total loss of infrastructure neutrality within 18 months.",
  },
  authentic_narrative: {
    id: "02",
    title: "ATTENTION_LOOP_VULNERABILITY",
    source: "Psychographic profile of the 'Trance' state. Analyzing dopamine-narrative convergence.",
    threat: "Algorithmic capture of the decision-making prefrontal cortex.",
    implication: "Individual agency becomes a secondary function of the network.",
  },
  sovereign: {
    id: "03",
    title: "DUAL_USE_MANIFESTO",
    source: "Declassified internal strategy. Moving from 'Don't be Evil' to 'Be Accountable'.",
    threat: "Fear-based paralysis leading to abandonment of key strategic infrastructure.",
    implication: "Relinquishing the field to actors with zero ethical constraints.",
  },
} as const;

export const EDUCATION_NODES = [
  { cat: "Intel & Counterintel", items: ["Basic OPSEC for Builders", "The Psychology of Influence"] },
  { cat: "Info Ops", items: ["Narrative Warfare 101", "Counter-meme Deployment"] },
  { cat: "Security", items: ["Supply Chain Sovereignty", "Hardware Hardening"] },
  { cat: "Sovereignty", items: ["Exit Protocols", "Parallel Infrastructure"] },
];

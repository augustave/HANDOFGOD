// STRATEGIC TERRAIN — the 8-node knowledge graph (PRD F03). Reading acts
// unlocks nodes; relationships illuminate when both endpoints unlock.
// Coordinates are percentages of the map canvas.

export interface TerrainNode {
  id: string;
  label: string;
  summary: string;
  /** Essay act index whose reading unlocks this node. */
  unlockActIndex: number;
  /** Act code shown in the detail panel ("taught in"). */
  taughtIn: string;
  x: number;
  y: number;
  reading: readonly { title: string; author: string }[];
}

export interface TerrainEdge {
  from: string;
  to: string;
  relation: string;
}

export const TERRAIN_NODES = [
  {
    id: "narratives",
    label: "Narratives",
    summary:
      "Myths compress complexity into stories that restore agency. A shared narrative is a cultural immune response — and the handle an adversary grabs to steer a tribe.",
    unlockActIndex: 1,
    taughtIn: "AX-01",
    x: 18,
    y: 22,
    reading: [{ title: "The Engineering of Consent", author: "Edward Bernays" }],
  },
  {
    id: "info-warfare",
    label: "Information Warfare",
    summary:
      "The second front. Operations that target a society's willingness to defend its own advantage — no firewall covers narrative corrosion.",
    unlockActIndex: 3,
    taughtIn: "AX-03",
    x: 46,
    y: 12,
    reading: [{ title: "Active Measures", author: "Thomas Rid" }],
  },
  {
    id: "product-design",
    label: "Product Design",
    summary:
      "The discipline of sitting with messy, adversarial, ambiguous systems without flinching — and shipping anyway. The temperament transfers; the threat models must be learned.",
    unlockActIndex: 2,
    taughtIn: "AX-02",
    x: 20,
    y: 62,
    reading: [{ title: "The Design of Everyday Things", author: "Don Norman" }],
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    summary:
      "Anything shaping coordination at scale is dual-use. The boundary between civilian tech and national security dissolved because software became the terrain.",
    unlockActIndex: 4,
    taughtIn: "AX-04",
    x: 48,
    y: 48,
    reading: [{ title: "The Technological Republic", author: "Alexander Karp" }],
  },
  {
    id: "supply-chains",
    label: "Supply Chains",
    summary:
      "The battlefield now. A dependency you didn't map is a decision someone else gets to make for you — chokepoints are design constraints, not procurement trivia.",
    unlockActIndex: 4,
    taughtIn: "AX-04",
    x: 76,
    y: 30,
    reading: [{ title: "Chip War", author: "Chris Miller" }],
  },
  {
    id: "state-capacity",
    label: "State Capacity",
    summary:
      "Seating charts are composed like sentences. Protocol literacy reads capability signals — guest lists as forward indicators of policy, parades in civilian dress.",
    unlockActIndex: 5,
    taughtIn: "AX-05",
    x: 50,
    y: 80,
    reading: [{ title: "Protocol: The Power of Diplomacy", author: "Capricia Penavic Marshall" }],
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    summary:
      "Capacity cannot be stockpiled. The crucible of failing, adapting, and executing — Eagle Claw to Night Stalkers — has no substitute and no shortcut.",
    unlockActIndex: 6,
    taughtIn: "AX-06",
    x: 80,
    y: 62,
    reading: [{ title: "Freedom's Forge", author: "Arthur Herman" }],
  },
  {
    id: "defense",
    label: "Defense",
    summary:
      "The sheathed sword. Restraint only means something if you're capable of doing otherwise — strength precedes virtue, and someone always holds the blade.",
    unlockActIndex: 7,
    taughtIn: "AX-07",
    x: 82,
    y: 88,
    reading: [{ title: "Surprise, Kill, Vanish", author: "Annie Jacobsen" }],
  },
] as const satisfies readonly TerrainNode[];

export const TERRAIN_EDGES = [
  { from: "narratives", to: "info-warfare", relation: "AMPLIFICATION" },
  { from: "product-design", to: "narratives", relation: "INTERFACES_SHAPE_STORIES" },
  { from: "product-design", to: "infrastructure", relation: "DUAL_USE" },
  { from: "infrastructure", to: "supply-chains", relation: "DEPENDENCY" },
  { from: "supply-chains", to: "manufacturing", relation: "CAPACITY" },
  { from: "info-warfare", to: "state-capacity", relation: "NATIONAL_SYSTEMS" },
  { from: "state-capacity", to: "defense", relation: "MOBILIZATION" },
  { from: "manufacturing", to: "defense", relation: "ARSENAL" },
] as const satisfies readonly TerrainEdge[];

// Strategic literacy dimensions, posture taxonomy, and global scoring constants.
// Pure data — no React, no side effects. Everything downstream (profile,
// posture, unlocks) derives from these definitions.

export const DIMENSIONS = [
  "narrativeLiteracy",
  "institutionalTrust",
  "capabilityOrientation",
  "strategicRealism",
  "systemAwareness",
  "operationalThinking",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

/** Sparse per-dimension deltas. Authoring convention: integers in -3..+3. */
export type WeightVector = Readonly<Partial<Record<Dimension, number>>>;

/** Resolved 0-100 score per dimension. */
export type Profile = Readonly<Record<Dimension, number>>;

export const POSTURES = ["watcher", "architect", "sovereign"] as const;

export type Posture = (typeof POSTURES)[number];

/** Sparse posture points attached to an answer/choice. */
export type PostureAffinity = Readonly<Partial<Record<Posture, number>>>;

/** Integer percentages, always summing to exactly 100. */
export type PostureDistribution = Readonly<Record<Posture, number>>;

export type SignalKind = "assessment" | "scenario" | "simulator" | "reading";

/** Relative influence of each signal source on dimension scores. */
export const SOURCE_MULTIPLIER: Readonly<Record<SignalKind, number>> = {
  assessment: 1.0,
  scenario: 1.5,
  simulator: 0.5,
  reading: 1.0,
};

/** Neutral starting score for every dimension. */
export const BASELINE = 50;

/** Flat posture points granted by an explicit PostureTerminal commitment. */
export const POSTURE_COMMIT_BONUS = 30;

/** Dimension credit granted per essay act read (applied per act). */
export const READING_BUMP: WeightVector = {
  systemAwareness: 1,
  narrativeLiteracy: 0.5,
};

/** Max number of capture-simulator mitigation signals counted per session. */
export const SIMULATOR_REPORT_CAPS: Readonly<Record<string, number>> = {
  "capture": 3,
  "two-front": 1,
  "posture-terminal": 1,
};

export const DIMENSION_LABELS: Readonly<Record<Dimension, string>> = {
  narrativeLiteracy: "Narrative Literacy",
  institutionalTrust: "Institutional Trust",
  capabilityOrientation: "Capability Orientation",
  strategicRealism: "Strategic Realism",
  systemAwareness: "System Awareness",
  operationalThinking: "Operational Thinking",
};

export const POSTURE_LABELS: Readonly<Record<Posture, string>> = {
  watcher: "Watcher",
  architect: "Architect",
  sovereign: "Sovereign",
};

export function clamp(min: number, max: number, value: number): number {
  return Math.min(max, Math.max(min, value));
}

export function emptyWeightTotals(): Record<Dimension, number> {
  return {
    narrativeLiteracy: 0,
    institutionalTrust: 0,
    capabilityOrientation: 0,
    strategicRealism: 0,
    systemAwareness: 0,
    operationalThinking: 0,
  };
}

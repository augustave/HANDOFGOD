// Builds transient SignalEvents for the live toast. The module-level
// sequence guarantees each emission re-triggers the toast even when an
// identical weight vector fires twice.

import type { SignalEvent } from "../engine/signals";
import type { WeightVector } from "../engine/weights";

let SEQ = 0;

export function makeSignal(
  label: string,
  weights: WeightVector,
  affinityOnly = false,
): SignalEvent {
  SEQ += 1;
  return { seq: SEQ, label, weights, affinityOnly, at: Date.now() };
}

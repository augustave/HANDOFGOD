// Named journey phases — users remember "BELONGING / CAPABILITY / ..." far
// better than act codes. Indexed by essay act index (1-7).

export interface JourneyPhaseMeta {
  actIndex: number;
  actId: string;
  code: string;
  name: string;
}

export const JOURNEY_PHASES: readonly JourneyPhaseMeta[] = [
  { actIndex: 1, actId: "myth_of_morality", code: "AX-01", name: "BELONGING" },
  { actIndex: 2, actId: "authentic_narrative", code: "AX-02", name: "CAPABILITY" },
  { actIndex: 3, actId: "two_front", code: "AX-03", name: "THE TWO FRONTS" },
  { actIndex: 4, actId: "sovereign", code: "AX-04", name: "THE SWORD" },
  { actIndex: 5, actId: "operational_interfaces", code: "AX-05", name: "COORDINATION" },
  { actIndex: 6, actId: "education", code: "AX-06", name: "LITERACY" },
  { actIndex: 7, actId: "final", code: "AX-07", name: "POSTURE" },
];

export function phaseForActId(actId: string): JourneyPhaseMeta | undefined {
  return JOURNEY_PHASES.find((p) => p.actId === actId);
}

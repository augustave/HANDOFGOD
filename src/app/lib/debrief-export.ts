// Markdown export for the AFTER_ACTION_REPORT. Pure string builder —
// unit-testable, no DOM.

import { DIMENSION_DEBRIEFS } from "../data/debrief";
import { compositeScore, rankDimensions } from "../engine/profile";
import {
  DIMENSION_LABELS,
  POSTURE_LABELS,
  POSTURES,
  type Profile,
  type PostureDistribution,
} from "../engine/weights";

export interface DebriefReportInput {
  callsign: string | null;
  sessionId: string;
  profile: Profile;
  postureDistribution: PostureDistribution;
  clearance: string;
  signalCount: number;
  openActions: readonly string[];
}

export function buildMarkdownReport(input: DebriefReportInput): string {
  const ranked = rankDimensions(input.profile);
  const strengths = ranked.slice(0, 2);
  const blindSpots = ranked.slice(-2);
  const composite = compositeScore(input.profile);

  const lines: string[] = [
    "# AFTER ACTION REPORT // HAND_OF_GOD",
    "",
    `- Operator: ${input.callsign ?? "UNNAMED_OPERATOR"}`,
    `- Session: ${input.sessionId}`,
    `- Clearance: ${input.clearance}`,
    `- Composite literacy: ${composite}/100`,
    `- Signals logged: ${input.signalCount}`,
    "",
    "## Posture",
    "",
    ...POSTURES.map((p) => `- ${POSTURE_LABELS[p]}: ${input.postureDistribution[p]}%`),
    "",
    "## Literacy profile",
    "",
    ...ranked.map((dim) => `- ${DIMENSION_LABELS[dim]}: ${input.profile[dim]}/100`),
    "",
    "## Strengths",
    "",
    ...strengths.map((dim) => `- **${DIMENSION_LABELS[dim]}** — ${DIMENSION_DEBRIEFS[dim].strength}`),
    "",
    "## Blind spots",
    "",
    ...blindSpots.map((dim) => `- **${DIMENSION_LABELS[dim]}** — ${DIMENSION_DEBRIEFS[dim].blindSpot}`),
    "",
    "## Recommended study",
    "",
    ...blindSpots.flatMap((dim) =>
      DIMENSION_DEBRIEFS[dim].reading.map((r) => `- ${r.title} — ${r.author} (${DIMENSION_LABELS[dim]})`),
    ),
  ];

  if (input.openActions.length > 0) {
    lines.push("", "## Open actions", "");
    lines.push(...input.openActions.map((a) => `- [ ] ${a}`));
  }

  lines.push("", "---", "", "Generated locally. No telemetry. // HAND_OF_GOD 2026");
  return lines.join("\n");
}

export function downloadMarkdown(markdown: string, filename: string): void {
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

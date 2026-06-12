// SVG card builders for shareable exports. The mirror card renders the
// posture distribution + composite score in the dossier visual language.

import {
  DIMENSION_LABELS,
  POSTURE_LABELS,
  POSTURES,
  type Profile,
  type PostureDistribution,
} from "../engine/weights";
import { compositeScore, rankDimensions } from "../engine/profile";

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface MirrorCardInput {
  callsign: string | null;
  clearance: string;
  profile: Profile;
  postureDistribution: PostureDistribution;
}

const POSTURE_COLORS: Record<(typeof POSTURES)[number], string> = {
  watcher: "#B01F2E",
  architect: "#C8A64A",
  sovereign: "#0B1E4B",
};

export function mirrorCard(input: MirrorCardInput): string {
  const composite = compositeScore(input.profile);
  const ranked = rankDimensions(input.profile);
  const top = ranked[0];
  const operator = escapeXml((input.callsign ?? "UNNAMED_OPERATOR").toUpperCase());

  const postureBars = POSTURES.map((posture, i) => {
    const pct = input.postureDistribution[posture];
    const y = 150 + i * 52;
    const width = Math.max(4, (pct / 100) * 360);
    return `
    <text x="60" y="${y}" font-family="monospace" font-size="12" font-weight="900" fill="#F3F0E8" letter-spacing="3">${POSTURE_LABELS[posture].toUpperCase()}</text>
    <rect x="60" y="${y + 10}" width="360" height="16" fill="none" stroke="#F3F0E8" stroke-opacity="0.2"/>
    <rect x="60" y="${y + 10}" width="${width}" height="16" fill="${POSTURE_COLORS[posture]}"/>
    <text x="436" y="${y + 23}" font-family="monospace" font-size="14" font-weight="900" fill="#C8A64A">${pct}%</text>`;
  }).join("");

  return `<svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="#111111"/>
  <rect x="20" y="20" width="560" height="360" fill="none" stroke="#C8A64A" stroke-width="2"/>
  <text x="60" y="70" font-family="monospace" font-size="11" font-weight="900" fill="#B01F2E" letter-spacing="4">AFTER_ACTION_REPORT // HAND_OF_GOD</text>
  <text x="60" y="105" font-family="monospace" font-size="24" font-weight="900" fill="#F3F0E8" letter-spacing="2">${operator}</text>
  <text x="60" y="126" font-family="monospace" font-size="10" fill="#F3F0E8" fill-opacity="0.5" letter-spacing="2">CLEARANCE: ${escapeXml(input.clearance)} // DOMINANT_AXIS: ${escapeXml(DIMENSION_LABELS[top].toUpperCase())}</text>
  ${postureBars}
  <text x="60" y="345" font-family="monospace" font-size="40" font-weight="900" fill="#C8A64A">${composite}</text>
  <text x="118" y="345" font-family="monospace" font-size="11" fill="#F3F0E8" fill-opacity="0.6" letter-spacing="2">/100 STRATEGIC_LITERACY</text>
  <text x="436" y="362" font-family="monospace" font-size="8" fill="#F3F0E8" fill-opacity="0.4" letter-spacing="2">LOCAL_ONLY // 2026</text>
</svg>`;
}

export function downloadSvg(svg: string, filename: string): void {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

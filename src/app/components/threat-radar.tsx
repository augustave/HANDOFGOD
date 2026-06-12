// Exposure radar — finally plots real data. Each axis shows
// EXPOSURE = 100 - literacy for its mapped profile dimension (low literacy
// = high threat). Controlled component: values arrive via props from the
// store; no standing intervals, animation only on value change.

import { motion } from "motion/react";
import { cn } from "./dossier-components";

export const RADAR_AXES = [
  "NARRATIVE",
  "TECHNICAL",
  "COGNITIVE",
  "STRUCTURAL",
  "IDEOLOGICAL",
  "OPERATIONAL",
] as const;

interface ThreatRadarProps {
  /** Six exposure values 0-100, in RADAR_AXES order. */
  values: readonly number[];
  /** "dark" for the system card, "paper" for the printed mirror snapshot. */
  variant?: "dark" | "paper";
}

export function ThreatRadar({ values, variant = "dark" }: ThreatRadarProps) {
  const cx = 120;
  const cy = 120;
  const maxR = 100;
  const rings = [25, 50, 75, 100];
  const numAxes = RADAR_AXES.length;
  const paper = variant === "paper";

  const lineColor = paper ? "rgba(17,17,17,0.15)" : "rgba(255,255,255,0.08)";
  const axisColor = paper ? "rgba(17,17,17,0.1)" : "rgba(255,255,255,0.06)";
  const labelColor = paper ? "rgba(17,17,17,0.45)" : "rgba(255,255,255,0.35)";
  const mutedText = paper ? "text-ink-black/50" : "text-gray-500";

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const r = (value / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const polygonPoints = values
    .map((v, i) => {
      const pt = getPoint(i, v);
      return `${pt.x},${pt.y}`;
    })
    .join(" ");

  const avgThreat = Math.round(values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1));
  const threatLevel = avgThreat > 70 ? "CRITICAL" : avgThreat > 50 ? "ELEVATED" : avgThreat > 30 ? "GUARDED" : "LOW";
  const threatColor = avgThreat > 70 ? "text-stamp-red" : avgThreat > 50 ? "text-orange-500" : avgThreat > 30 ? "text-star-gold" : "text-green-600";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className={cn("font-mono text-[8px] font-black uppercase tracking-[0.3em]", mutedText)}>
          EXPOSURE_RADAR_V1 // 100−LITERACY
        </div>
        <div className={cn("font-mono text-[9px] font-black uppercase", threatColor)}>{threatLevel}</div>
      </div>

      <div className="relative flex justify-center">
        <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible" aria-hidden="true">
          {rings.map((r) => (
            <circle key={r} cx={cx} cy={cy} r={(r / 100) * maxR} fill="none" stroke={lineColor} strokeWidth="0.5" />
          ))}

          {RADAR_AXES.map((_, i) => {
            const endPt = getPoint(i, 100);
            return <line key={i} x1={cx} y1={cy} x2={endPt.x} y2={endPt.y} stroke={axisColor} strokeWidth="0.5" />;
          })}

          <motion.polygon
            animate={{ points: polygonPoints }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            fill="var(--stamp-red)"
            fillOpacity="0.15"
            stroke="var(--stamp-red)"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          {values.map((v, i) => {
            const pt = getPoint(i, v);
            return (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="3" fill="var(--stamp-red)" opacity="0.9" />
                <circle cx={pt.x} cy={pt.y} r="6" fill="none" stroke="var(--stamp-red)" strokeWidth="0.5" opacity="0.4" />
              </g>
            );
          })}

          {RADAR_AXES.map((label, i) => {
            const labelPt = getPoint(i, 120);
            return (
              <text
                key={label}
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono"
                fill={labelColor}
                fontSize="6"
                fontWeight="900"
              >
                {label}
              </text>
            );
          })}

          <circle cx={cx} cy={cy} r="2" fill="var(--star-gold)" opacity="0.8" />
        </svg>
      </div>

      <div className="space-y-2 pt-2">
        {RADAR_AXES.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className={cn("font-mono text-[9px] font-black uppercase w-20 truncate tracking-wider", mutedText)}>
              {label}
            </div>
            <div className={cn("flex-1 h-1 relative overflow-hidden", paper ? "bg-ink-black/10" : "bg-white/5")}>
              <motion.div
                className={cn(
                  "h-full",
                  values[i] > 70 ? "bg-stamp-red" : values[i] > 50 ? "bg-orange-500" : "bg-star-gold/50",
                )}
                animate={{ width: `${values[i]}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <div className={cn("font-mono text-[9px] font-black w-6 text-right", mutedText)}>
              {Math.round(values[i])}
            </div>
          </div>
        ))}
      </div>

      <div className={cn("pt-3 border-t flex justify-between items-center", paper ? "border-ink-black/10" : "border-white/5")}>
        <div className={cn("font-mono text-[9px] font-black uppercase tracking-widest", mutedText)}>
          COMPOSITE_EXPOSURE
        </div>
        <div className={cn("font-mono text-sm font-black", threatColor)}>{avgThreat}%</div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "./dossier-components";

interface ThreatRadarProps {
  activeAct: number;
  totalActs: number;
  reducedMotion?: boolean;
}

const THREAT_PROFILES = [
  { label: "NARRATIVE", base: 20, volatility: 15 },
  { label: "TECHNICAL", base: 35, volatility: 20 },
  { label: "COGNITIVE", base: 50, volatility: 25 },
  { label: "STRUCTURAL", base: 30, volatility: 10 },
  { label: "IDEOLOGICAL", base: 45, volatility: 30 },
  { label: "OPERATIONAL", base: 25, volatility: 20 },
];

export function ThreatRadar({ activeAct, totalActs, reducedMotion = false }: ThreatRadarProps) {
  const [values, setValues] = useState<number[]>(THREAT_PROFILES.map(p => p.base));
  const [sweepAngle, setSweepAngle] = useState(0);

  // Animate the sweep
  useEffect(() => {
    if (reducedMotion) return undefined;

    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Update threat values based on active act
  useEffect(() => {
    const newValues = THREAT_PROFILES.map((p, i) => {
      const actModifier = (activeAct * 8) + (i * 5) + (activeAct / Math.max(totalActs, 1)) * 4;
      const jitter = reducedMotion ? 0 : Math.sin(activeAct + i) * p.volatility * 0.3;
      return Math.min(95, Math.max(10, p.base + actModifier + jitter));
    });
    setValues(newValues);
  }, [activeAct, reducedMotion, totalActs]);

  // Periodic jitter
  useEffect(() => {
    if (reducedMotion) return undefined;
    let tick = 0;
    const interval = setInterval(() => {
      setValues(prev => prev.map((v, i) => {
        const jitter = Math.sin(tick + i * 1.7) * THREAT_PROFILES[i].volatility * 0.2;
        return Math.min(95, Math.max(10, v + jitter));
      }));
      tick += 1;
    }, 2000);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  const cx = 120;
  const cy = 120;
  const maxR = 100;
  const rings = [25, 50, 75, 100];
  const numAxes = THREAT_PROFILES.length;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / numAxes - Math.PI / 2;
    const r = (value / 100) * maxR;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  const polygonPoints = values.map((v, i) => {
    const pt = getPoint(i, v);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  const avgThreat = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const threatLevel = avgThreat > 70 ? "CRITICAL" : avgThreat > 50 ? "ELEVATED" : avgThreat > 30 ? "GUARDED" : "LOW";
  const threatColor = avgThreat > 70 ? "text-stamp-red" : avgThreat > 50 ? "text-orange-500" : avgThreat > 30 ? "text-star-gold" : "text-green-500";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="font-mono text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">THREAT_RADAR_V3.1</div>
        <div className={cn("font-mono text-[9px] font-black uppercase", threatColor)}>
          {threatLevel}
        </div>
      </div>

      <div className="relative flex justify-center">
        <svg width="240" height="240" viewBox="0 0 240 240" className="overflow-visible">
          {/* Rings */}
          {rings.map((r) => (
            <circle
              key={r}
              cx={cx}
              cy={cy}
              r={(r / 100) * maxR}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
          ))}

          {/* Axes */}
          {THREAT_PROFILES.map((_, i) => {
            const endPt = getPoint(i, 100);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={endPt.x}
                y2={endPt.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
              />
            );
          })}

          {/* Sweep line */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + maxR * Math.cos((sweepAngle * Math.PI) / 180 - Math.PI / 2)}
            y2={cy + maxR * Math.sin((sweepAngle * Math.PI) / 180 - Math.PI / 2)}
            stroke="var(--star-gold)"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Sweep glow */}
          <defs>
            <linearGradient id="sweepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--star-gold)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--star-gold)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M ${cx} ${cy} L ${cx + maxR * Math.cos((sweepAngle * Math.PI) / 180 - Math.PI / 2)} ${cy + maxR * Math.sin((sweepAngle * Math.PI) / 180 - Math.PI / 2)} A ${maxR} ${maxR} 0 0 0 ${cx + maxR * Math.cos(((sweepAngle - 40) * Math.PI) / 180 - Math.PI / 2)} ${cy + maxR * Math.sin(((sweepAngle - 40) * Math.PI) / 180 - Math.PI / 2)} Z`}
            fill="url(#sweepGrad)"
          />

          {/* Threat polygon */}
          <motion.polygon
            points={polygonPoints}
            fill="var(--stamp-red)"
            fillOpacity="0.15"
            stroke="var(--stamp-red)"
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />

          {/* Data points */}
          {values.map((v, i) => {
            const pt = getPoint(i, v);
            return (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="3" fill="var(--stamp-red)" opacity="0.9" />
                <circle cx={pt.x} cy={pt.y} r="6" fill="none" stroke="var(--stamp-red)" strokeWidth="0.5" opacity="0.4" />
              </g>
            );
          })}

          {/* Labels */}
          {THREAT_PROFILES.map((profile, i) => {
            const labelPt = getPoint(i, 120);
            return (
              <text
                key={i}
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono"
                fill="rgba(255,255,255,0.35)"
                fontSize="6"
                fontWeight="900"
              >
                {profile.label}
              </text>
            );
          })}

          {/* Center dot */}
          <circle cx={cx} cy={cy} r="2" fill="var(--star-gold)" opacity="0.8" />
        </svg>
      </div>

      {/* Threat bars */}
      <div className="space-y-2 pt-2">
        {THREAT_PROFILES.map((profile, i) => (
          <div key={profile.label} className="flex items-center gap-3">
            <div className="font-mono text-[7px] font-black text-gray-600 uppercase w-16 truncate tracking-wider">
              {profile.label}
            </div>
            <div className="flex-1 h-1 bg-white/5 relative overflow-hidden">
              <motion.div
                className={cn(
                  "h-full",
                  values[i] > 70 ? "bg-stamp-red" : values[i] > 50 ? "bg-orange-500" : "bg-star-gold/50"
                )}
                animate={{ width: `${values[i]}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="font-mono text-[7px] font-black text-gray-500 w-6 text-right">
              {Math.round(values[i])}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-white/5 flex justify-between items-center">
        <div className="font-mono text-[7px] font-black text-gray-600 uppercase tracking-widest">
          COMPOSITE_INDEX
        </div>
        <div className={cn("font-mono text-sm font-black", threatColor)}>
          {avgThreat}%
        </div>
      </div>
    </div>
  );
}

// SYSTEM CARD — the right-rail dashboard. V2: every value on this card is
// real. The radar plots exposure derived from the literacy profile, and the
// log shows actual profile signals (no fabricated audit feed, no fake
// encryption claims).

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { cn } from "./dossier-components";
import { ThreatRadar } from "./threat-radar";
import { useDossierStore } from "../store";
import { DIMENSION_LABELS, type Dimension } from "../engine/weights";
import type { SecurityRole } from "../types";

interface SystemCardProps {
  activeAct: number;
  role: SecurityRole;
}

interface SignalEntry {
  at: number;
  label: string;
  detail: string;
  tone: "info" | "success" | "warning";
}

/** Radar axis order (threat-radar RADAR_AXES) -> profile dimension. */
const AXIS_DIMENSIONS: readonly Dimension[] = [
  "narrativeLiteracy",
  "capabilityOrientation",
  "institutionalTrust",
  "systemAwareness",
  "strategicRealism",
  "operationalThinking",
];

function formatTime(at: number): string {
  const d = new Date(at);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

function weightSummary(weights: Readonly<Partial<Record<Dimension, number>>>): string {
  return Object.entries(weights)
    .map(([dim, w]) => `${(w as number) > 0 ? "+" : ""}${w} ${DIMENSION_LABELS[dim as Dimension]}`)
    .join(", ");
}

export const SystemCard = ({ activeAct, role }: SystemCardProps) => {
  const [isRadarExpanded, setIsRadarExpanded] = useState(true);
  const profile = useDossierStore((s) => s.profile);
  const responses = useDossierStore((s) => s.responses);
  const scenarioCommits = useDossierStore((s) => s.scenarioCommits);
  const simulatorReports = useDossierStore((s) => s.simulatorReports);

  const radarValues = useMemo(
    () => AXIS_DIMENSIONS.map((dim) => 100 - profile[dim]),
    [profile],
  );

  // The audit feed is real now: every entry is a logged profile signal.
  const signalLog = useMemo<SignalEntry[]>(() => {
    const entries: SignalEntry[] = [
      ...responses.map((r) => ({
        at: r.answeredAt,
        label: r.id.toUpperCase(),
        detail: weightSummary(r.weight),
        tone: "info" as const,
      })),
      ...scenarioCommits.map((c) => ({
        at: c.at,
        label: `${c.scenarioId.toUpperCase()} // CHOICE_${c.choiceId}`,
        detail: weightSummary(c.weights),
        tone: "success" as const,
      })),
      ...simulatorReports.map((r) => ({
        at: r.at,
        label: `${r.simulatorId.toUpperCase()}_REPORT`,
        detail: weightSummary(r.weights),
        tone: "warning" as const,
      })),
    ];
    return entries.sort((a, b) => b.at - a.at).slice(0, 12);
  }, [responses, scenarioCommits, simulatorReports]);

  const toneColors: Record<SignalEntry["tone"], string> = {
    info: "text-gray-400",
    success: "text-green-500/80",
    warning: "text-orange-400",
  };

  return (
    <div className="bg-ink-black text-white p-0 shadow-[24px_24px_0px_rgba(0,0,0,0.04)] border-t-4 border-star-gold sticky top-28 hidden lg:block overflow-hidden overflow-y-auto min-w-[340px] max-w-[340px] max-h-[calc(100vh-13rem)] scrollbar-none">
      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Shield className="w-24 h-24" />
        </div>

        <div className="flex justify-between items-center border-b border-white/10 pb-4 relative z-10">
          <div className="space-y-1">
            <span className="font-mono text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">System_Card_v4.0</span>
            <div className="font-mono text-[10px] font-black uppercase flex items-center gap-2">
              STATUS: ACTIVE // {role}
            </div>
          </div>
          <span className="font-mono text-[8px] font-black text-green-500/80 uppercase">LOCAL</span>
        </div>

        <div className="flex justify-between pt-3 font-mono text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
          <span>ACT: AX-0{activeAct}</span>
          <span>SIGNALS: {responses.length + scenarioCommits.length + simulatorReports.length}</span>
        </div>
      </div>

      {/* Exposure Radar */}
      <div className="border-t border-white/10">
        <button
          onClick={() => setIsRadarExpanded(!isRadarExpanded)}
          className="w-full px-6 py-3 flex justify-between items-center font-mono text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-star-gold transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" /> EXPOSURE_ASSESSMENT
          </span>
          {isRadarExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        <AnimatePresence>
          {isRadarExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <ThreatRadar values={radarValues} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Signal Log — real profile events only */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="font-mono text-[9px] text-gray-400 font-black tracking-widest uppercase mb-3 flex justify-between items-center">
          <span>SIGNAL_LOG</span>
          <span className="text-star-gold">{signalLog.length > 0 ? "ACTIVE" : "EMPTY"}</span>
        </div>
        <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {signalLog.length === 0 ? (
            <div className="font-mono text-[9px] uppercase tracking-tight text-gray-600 italic">
              No signals logged. Answer a field assessment to begin.
            </div>
          ) : (
            signalLog.map((entry) => (
              <div
                key={`${entry.at}-${entry.label}`}
                className={cn(
                  "font-mono text-[9px] uppercase tracking-tighter leading-tight",
                  toneColors[entry.tone],
                )}
              >
                <span className="opacity-40">[{formatTime(entry.at)}]</span> {entry.label}
                <div className="opacity-60 pl-4 normal-case">{entry.detail}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom bar — true statements only */}
      <div className="relative">
        <div className="h-1 bg-gradient-to-r from-transparent via-star-gold/20 to-transparent" />
        <div className="px-6 py-2 flex justify-between items-center font-mono text-[8px] font-black text-gray-500 uppercase tracking-widest">
          <span>PROFILE: LOCAL_ONLY</span>
          <span>NO_TELEMETRY</span>
        </div>
      </div>
    </div>
  );
};

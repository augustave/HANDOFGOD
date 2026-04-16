import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Activity, Target, Zap, Cpu, ChevronDown, ChevronUp, AlertTriangle, Radio } from "lucide-react";
import { cn } from "./dossier-components";
import { ThreatRadar } from "./threat-radar";
import type { SecurityRole, SystemCardState } from "../types";

interface SystemCardProps {
  activeAct: number;
  role: SecurityRole;
  data: SystemCardState[];
  reducedMotion?: boolean;
  sessionId: string;
}

interface AuditEntry {
  timestamp: string;
  message: string;
  type: "info" | "warning" | "success" | "critical";
}

type RowStatus = "STABLE" | "NOMINAL" | "EXPOSED" | "MONITORING" | "DEPLOYED" | "TRACKING";

const AUDIT_MESSAGES: { msg: string; type: AuditEntry["type"] }[] = [
  { msg: "Scanning narrative surface for drift anomalies", type: "info" },
  { msg: "Algorithmic capture vector detected in feed layer", type: "warning" },
  { msg: "Sovereignty protocol handshake confirmed", type: "success" },
  { msg: "Cognitive load threshold exceeded — inject friction", type: "critical" },
  { msg: "Interface transparency audit passed", type: "success" },
  { msg: "Operator literacy index updated", type: "info" },
  { msg: "Dual-use asset flagged for review", type: "warning" },
  { msg: "Trance state detector calibrated", type: "info" },
  { msg: "Parallel infrastructure sync complete", type: "success" },
  { msg: "Narrative resilience dropping below threshold", type: "critical" },
  { msg: "Exit protocol tested — all channels operational", type: "success" },
  { msg: "Social validation loop identified in sector 7G", type: "warning" },
  { msg: "Manual override capability confirmed", type: "info" },
  { msg: "Attention harvest countermeasure deployed", type: "success" },
  { msg: "Ideological capture probability: elevated", type: "critical" },
];

export const SystemCard = ({ activeAct, role, data, reducedMotion = false, sessionId }: SystemCardProps) => {
  const current = data[activeAct] || data[0];
  const [isRadarExpanded, setIsRadarExpanded] = useState(true);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
  const [heartbeat, setHeartbeat] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  // Rolling audit log
  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    };

    // Initial entries
    setAuditLog([
      { timestamp: formatTime(), message: `Audit initiated for AX-0${activeAct}`, type: "info" },
      { timestamp: formatTime(), message: `Vulnerability surface: ${current.surface}`, type: "warning" },
    ]);

    if (reducedMotion) return undefined;

    const interval = setInterval(() => {
      const pick = AUDIT_MESSAGES[Math.floor(Math.random() * AUDIT_MESSAGES.length)];
      setAuditLog(prev => [
        { timestamp: formatTime(), message: pick.msg, type: pick.type },
        ...prev,
      ].slice(0, 12));
    }, 4000);

    return () => clearInterval(interval);
  }, [activeAct, current.surface, reducedMotion]);

  // Heartbeat pulse
  useEffect(() => {
    if (reducedMotion) return undefined;

    const interval = setInterval(() => {
      setHeartbeat(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  const rows = [
    { label: "ASSET", val: current.asset, icon: Cpu, status: "STABLE" as const },
    { label: "SURFACE", val: current.surface, icon: Shield, status: (activeAct > 4 ? "EXPOSED" : "NOMINAL") as RowStatus },
    { label: "FAILURE", val: current.failure, icon: Target, status: "MONITORING" as const },
    { label: "CONTROLS", val: current.controls, icon: Zap, status: "DEPLOYED" as const },
    { label: "METRIC", val: current.metric, icon: Activity, status: "TRACKING" as const },
  ];

  const statusColors: Record<string, string> = {
    STABLE: "text-green-500",
    NOMINAL: "text-green-500",
    EXPOSED: "text-stamp-red",
    MONITORING: "text-orange-500",
    DEPLOYED: "text-dossier-blue",
    TRACKING: "text-star-gold",
  };

  const logTypeColors: Record<AuditEntry["type"], string> = {
    info: "text-gray-400",
    warning: "text-orange-400",
    success: "text-green-500/80",
    critical: "text-stamp-red",
  };

  return (
    <div className="bg-ink-black text-white p-0 shadow-[24px_24px_0px_rgba(0,0,0,0.1)] border-t-4 border-star-gold sticky top-32 h-fit hidden lg:block overflow-hidden min-w-[340px]">
      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Shield className="w-24 h-24" />
        </div>
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4 relative z-10">
          <div className="space-y-1">
            <span className="font-mono text-[8px] font-black uppercase tracking-[0.3em] text-gray-600">System_Card_v3.0</span>
            <div className="font-mono text-[10px] font-black uppercase flex items-center gap-2">
              STATUS: ACTIVE // {role}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-1 h-3 bg-green-500"
                  animate={{ opacity: heartbeat ? [0.3, 1, 0.3] : [1, 0.3, 1] }}
                  transition={{ duration: 1, delay: i * 0.15 }}
                />
              ))}
            </div>
            <span className="font-mono text-[7px] font-black text-green-500/80 uppercase">SYNCED</span>
          </div>
        </div>

        {/* Uptime / Session */}
        <div className="flex justify-between pt-3 font-mono text-[7px] font-black text-gray-600 uppercase tracking-[0.2em]">
          <span>ACT: AX-0{activeAct}</span>
          <span className="flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 text-star-gold" /> LIVE
          </span>
        </div>
      </div>

      {/* Data Rows */}
      <div className="px-6 pb-4 space-y-0 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAct}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-0"
          >
            {rows.map((row) => (
              <div key={row.label} className="group border-b border-white/5 py-3 last:border-0">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <row.icon className="w-3 h-3 text-star-gold opacity-50" />
                    <div className="font-mono text-[7px] text-gray-500 font-black tracking-widest uppercase">{row.label}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className={cn("w-1 h-1 rounded-full", statusColors[row.status] || "bg-gray-500")}
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className={cn(
                      "font-mono text-[6px] font-black px-1 py-0.5 border border-current/30",
                      statusColors[row.status] || "text-gray-500",
                      row.status === "EXPOSED" && "animate-pulse"
                    )}>
                      {row.status}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[10px] font-black uppercase tracking-tight group-hover:text-star-gold transition-colors truncate">
                  {row.val}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Threat Radar Section */}
      <div className="border-t border-white/10">
        <button
          onClick={() => setIsRadarExpanded(!isRadarExpanded)}
          className="w-full px-6 py-3 flex justify-between items-center font-mono text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-star-gold transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" /> THREAT_ASSESSMENT
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
                <ThreatRadar activeAct={activeAct} totalActs={data.length} reducedMotion={reducedMotion} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rolling Audit Log */}
      <div className="border-t border-white/10 px-6 py-4">
        <div className="font-mono text-[7px] text-gray-600 font-black tracking-widest uppercase mb-3 flex justify-between items-center">
          <span>LIVE_AUDIT_FEED</span>
          <motion.span
            className="text-stamp-red"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ● REC
          </motion.span>
        </div>
        <div ref={logRef} className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
          <AnimatePresence initial={false}>
            {auditLog.map((entry, i) => (
              <motion.div
                key={`${entry.timestamp}-${entry.message}-${i}`}
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "font-mono text-[8px] uppercase tracking-tighter leading-tight flex gap-2",
                  logTypeColors[entry.type]
                )}
              >
                <span className="opacity-40 shrink-0">[{entry.timestamp}]</span>
                <span className="truncate">{entry.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative">
        <div className="h-1 bg-gradient-to-r from-transparent via-star-gold/20 to-transparent" />
        <div className="px-6 py-2 flex justify-between items-center font-mono text-[6px] font-black text-gray-700 uppercase tracking-widest">
          <span>ENC: AES-256</span>
          <span>SESS: {sessionId}</span>
        </div>
      </div>
    </div>
  );
};

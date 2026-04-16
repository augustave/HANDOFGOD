import { motion } from "motion/react";
import { CheckCircle2, Circle, Lock, Unlock, ChevronRight } from "lucide-react";
import { cn } from "./dossier-components";
import type { DossierAct, ExperienceMode, SecurityRole } from "../types";

interface DossierProgressProps {
  acts: DossierAct[];
  completedActs: number[];
  activeAct: number;
  mode: ExperienceMode;
  role: SecurityRole;
}

export function DossierProgress({ acts, completedActs, activeAct, mode, role }: DossierProgressProps) {
  const completionPerc = Math.round((completedActs.length / acts.length) * 100);
  const clearanceLevel = completedActs.length >= 7 ? "OMEGA" : completedActs.length >= 5 ? "DELTA" : completedActs.length >= 3 ? "GAMMA" : "ALPHA";

  return (
    <div className="w-full max-w-5xl mx-auto my-24">
      <div className="border-4 border-ink-black bg-white shadow-[16px_16px_0px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Header */}
        <div className="bg-ink-black text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="font-mono text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">MISSION_DEBRIEF_SUMMARY</div>
            <div className="font-mono text-sm font-black uppercase tracking-tight">DOSSIER_COMPLETION_INDEX</div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">CLEARANCE</div>
              <div className="font-mono text-sm font-black text-star-gold">{clearanceLevel}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">STATUS</div>
              <div className="font-mono text-sm font-black text-star-gold">{mode} // {role}</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center mb-2">
            <div className="font-mono text-[9px] font-black text-gray-500 uppercase tracking-widest">DECLASSIFICATION_PROGRESS</div>
            <div className="font-mono text-sm font-black text-ink-black">{completionPerc}%</div>
          </div>
          <div className="h-3 bg-gray-100 border border-ink-black/10 relative overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-dossier-blue via-star-gold to-stamp-red"
              initial={{ width: "0%" }}
              animate={{ width: `${completionPerc}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(255,255,255,0.15)_8px,rgba(255,255,255,0.15)_9px)]" />
          </div>
        </div>

        {/* Act grid */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {acts.map((act, idx) => {
            const isCompleted = completedActs.includes(idx);
            const isActive = activeAct === idx;

            return (
              <a
                key={act.id}
                href={`#act-${act.id}`}
                className={cn(
                  "p-4 border-2 transition-all group relative overflow-hidden",
                  isActive ? "border-star-gold bg-star-gold/5" :
                  isCompleted ? "border-ink-black/20 bg-ink-black/3 hover:border-ink-black/40" :
                  "border-dashed border-ink-black/10 hover:border-ink-black/20"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-[8px] font-black text-gray-400 uppercase tracking-widest">
                    {act.code}
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  ) : isActive ? (
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-star-gold" />
                    </motion.div>
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-gray-200" />
                  )}
                </div>
                <div className={cn(
                  "font-mono text-[10px] font-black uppercase tracking-tight leading-tight",
                  isCompleted ? "text-ink-black" : "text-gray-400"
                )}>
                  {act.title}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-act-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-star-gold"
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* Footer stats */}
        <div className="bg-ink-black/5 border-t border-ink-black/10 p-4 px-6 flex flex-wrap justify-between items-center font-mono text-[8px] font-black text-gray-400 uppercase tracking-widest gap-4">
          <div className="flex gap-6">
            <span>ACTS_CLEARED: {completedActs.length}/{acts.length}</span>
            <span>INTEL_GRADE: {completedActs.length >= 6 ? "A+" : completedActs.length >= 4 ? "B" : "C"}</span>
          </div>
          <div className="flex items-center gap-2">
            {completionPerc === 100 ? (
              <>
                <Unlock className="w-3 h-3 text-green-600" />
                <span className="text-green-600">FULLY_DECLASSIFIED</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" />
                <span>PARTIAL_CLEARANCE</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

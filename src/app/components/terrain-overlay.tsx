// Persistent strategic-terrain overlay (PRD F06 / #6). Openable from the dock
// or palette anywhere; unlocked nodes navigate to their act. Doubles as the
// progress narrative — named phases with COMPLETE / ACTIVE / LOCKED state.

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Map as MapIcon, X } from "lucide-react";
import { TERRAIN_EDGES, TERRAIN_NODES, type TerrainNode } from "../data/terrain";
import { JOURNEY_PHASES } from "../data/journey-phases";
import { useDossierStore } from "../store";
import { cn } from "./dossier-components";

export function TerrainOverlay() {
  const open = useDossierStore((s) => s.isTerrainOpen);
  const setOpen = useDossierStore((s) => s.setIsTerrainOpen);
  const actsRead = useDossierStore((s) => s.actsRead);

  const isUnlocked = (node: TerrainNode) => actsRead.includes(node.unlockActIndex);

  const navigate = (node: TerrainNode) => {
    if (!isUnlocked(node)) return;
    setOpen(false);
    const phase = JOURNEY_PHASES.find((p) => p.actIndex === node.unlockActIndex);
    if (phase) {
      document.getElementById(`act-${phase.actId}`)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[960] bg-ink-black/95 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Strategic terrain map"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div className="max-w-5xl mx-auto p-6 md:p-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-mono text-white text-lg md:text-2xl font-black uppercase tracking-[0.2em] flex items-center gap-3">
                <MapIcon className="w-6 h-6 text-star-gold" /> STRATEGIC_TERRAIN
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close terrain map"
                className="p-2 text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Graph */}
            <div className="relative w-full border border-white/10 bg-white/[0.02]" style={{ aspectRatio: "16 / 9" }}>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {TERRAIN_EDGES.map((edge) => {
                  const from = TERRAIN_NODES.find((n) => n.id === edge.from);
                  const to = TERRAIN_NODES.find((n) => n.id === edge.to);
                  if (!from || !to) return null;
                  const lit = isUnlocked(from) && isUnlocked(to);
                  return (
                    <line
                      key={`${edge.from}-${edge.to}`}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={lit ? "var(--star-gold)" : "rgba(255,255,255,0.12)"}
                      strokeWidth={lit ? 0.5 : 0.3}
                      strokeDasharray={lit ? undefined : "1 1.5"}
                    />
                  );
                })}
              </svg>

              {TERRAIN_NODES.map((node) => {
                const unlocked = isUnlocked(node);
                return (
                  <button
                    key={node.id}
                    type="button"
                    disabled={!unlocked}
                    data-testid={`terrain-overlay-node-${node.id}`}
                    onClick={() => navigate(node)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1",
                      unlocked ? "cursor-pointer group" : "cursor-not-allowed",
                    )}
                    title={unlocked ? `Go to ${node.taughtIn}` : `LOCKED // READ ${node.taughtIn}`}
                  >
                    <span
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        unlocked
                          ? "border-star-gold bg-star-gold/20 group-hover:bg-star-gold group-hover:scale-110"
                          : "border-dashed border-white/25",
                      )}
                    >
                      {!unlocked && <Lock className="w-2.5 h-2.5 text-white/40" />}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[9px] font-black uppercase tracking-widest whitespace-nowrap px-1",
                        unlocked ? "text-white" : "text-white/30",
                      )}
                    >
                      {unlocked ? node.label : "▮▮▮▮"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Progress narrative — named phases */}
            <div className="mt-10">
              <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-star-gold mb-4">
                JOURNEY_PROGRESSION
              </h3>
              <ol className="space-y-2">
                {JOURNEY_PHASES.map((phase) => {
                  const complete = actsRead.includes(phase.actIndex);
                  const firstIncompleteIdx = JOURNEY_PHASES.find((p) => !actsRead.includes(p.actIndex))?.actIndex;
                  const active = !complete && phase.actIndex === firstIncompleteIdx;
                  const state = complete ? "COMPLETE" : active ? "ACTIVE" : "LOCKED";
                  return (
                    <li key={phase.actId}>
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          document.getElementById(`act-${phase.actId}`)?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full flex items-center justify-between gap-4 border border-white/10 px-4 py-3 text-left cursor-pointer hover:border-star-gold/50 transition-colors"
                      >
                        <span className="font-mono text-[10px] font-black uppercase tracking-widest text-white/50">
                          {phase.code}
                        </span>
                        <span className="flex-1 font-mono text-sm font-black uppercase tracking-tight text-white">
                          {phase.name}
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[9px] font-black uppercase tracking-widest",
                            complete ? "text-green-500" : active ? "text-star-gold" : "text-white/30",
                          )}
                        >
                          {state}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

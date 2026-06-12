// STRATEGIC TERRAIN MAP (PRD F03) — 8-node knowledge graph. SVG edges are
// decorative (aria-hidden) under real HTML buttons; reading acts unlocks
// nodes, relationships illuminate when both endpoints unlock.

import { useEffect, useRef, useState } from "react";
import { Lock, X } from "lucide-react";
import { TERRAIN_EDGES, TERRAIN_NODES, type TerrainNode } from "../data/terrain";
import { useDossierStore } from "../store";
import { cn } from "./dossier-components";

export function TerrainMap() {
  const actsRead = useDossierStore((s) => s.actsRead);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const isUnlocked = (node: TerrainNode) => actsRead.includes(node.unlockActIndex);
  const unlockedCount = TERRAIN_NODES.filter(isUnlocked).length;
  const selected = TERRAIN_NODES.find((n) => n.id === selectedId);

  useEffect(() => {
    if (selected) panelRef.current?.focus();
  }, [selected]);

  // Escape closes the detail panel (window-level — the panel is non-interactive).
  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedId]);

  return (
    <div id="terrain-map" className="my-16 border-4 border-ink-black bg-white relative overflow-hidden" data-testid="terrain-map">
      <div className="bg-ink-black text-white p-4 px-6 font-mono text-[10px] flex justify-between items-center">
        <span className="font-black uppercase tracking-[0.2em]">STRATEGIC_TERRAIN // KNOWLEDGE_GRAPH</span>
        <span className="opacity-50 font-black uppercase tracking-widest">
          {unlockedCount}/{TERRAIN_NODES.length} NODES
        </span>
      </div>

      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
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
                stroke={lit ? "var(--star-gold)" : "rgba(17,17,17,0.08)"}
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
              aria-expanded={selectedId === node.id}
              data-testid={`terrain-node-${node.id}`}
              onClick={() => setSelectedId(selectedId === node.id ? null : node.id)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group",
                unlocked ? "cursor-pointer" : "cursor-not-allowed",
              )}
              title={unlocked ? node.label : `LOCKED // READ ${node.taughtIn} TO UNLOCK`}
            >
              <span
                className={cn(
                  "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  unlocked
                    ? selectedId === node.id
                      ? "bg-star-gold border-star-gold scale-110"
                      : "bg-white border-star-gold group-hover:bg-star-gold/30"
                    : "border-dashed border-ink-black/25 bg-white",
                )}
              >
                {!unlocked && <Lock className="w-2.5 h-2.5 text-ink-black/30" />}
              </span>
              <span
                className={cn(
                  "font-mono text-[8px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap px-1 bg-white/80",
                  unlocked ? "text-ink-black" : "text-ink-black/30",
                )}
              >
                {unlocked ? node.label : "▮▮▮▮▮"}
              </span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          ref={panelRef}
          role="region"
          aria-label={`${selected.label} detail`}
          tabIndex={-1}
          className="border-t-4 border-ink-black bg-substrate-paper p-6 md:p-8 relative outline-none"
        >
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            aria-label="Close node detail"
            className="absolute top-4 right-4 p-1 text-ink-black/40 hover:text-ink-black cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-stamp-red mb-2">
            NODE // TAUGHT_IN {selected.taughtIn}
          </div>
          <h4 className="text-2xl font-black uppercase tracking-tight mb-3">{selected.label}</h4>
          <p className="font-serif text-base leading-relaxed text-ink-black/80 italic max-w-2xl">
            {selected.summary}
          </p>
          <div className="mt-4 font-mono text-[10px] font-bold uppercase tracking-tight text-ink-black/60">
            STUDY: {selected.reading.map((r) => `${r.title} — ${r.author}`).join(" · ")}
          </div>
        </div>
      )}
    </div>
  );
}

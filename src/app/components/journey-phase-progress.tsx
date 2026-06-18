// Named-phase progress narrative (PRD #10). The journey users remember is
// BELONGING -> CAPABILITY -> ... -> POSTURE, not READ/ASSESS/OPERATE. This
// surface is reused in the strategic-terrain overlay AND mounted persistently
// in the mobile command dock, so the named progression is visible without
// opening the map. Each row carries its COMPLETE / ACTIVE / LOCKED state and a
// LOCKED row states its own requirement instead of relying on list order.

import { JOURNEY_PHASES } from "../data/journey-phases";
import { useDossierStore } from "../store";
import { cn } from "./dossier-components";

/** Scroll to an act anchor, switching out of full-read mode first if needed.
 *  Anchors live in the per-act render path, which is absent in full-read mode,
 *  so defer the scroll until after React remounts the sections. */
function navigateToAct(actId: string, setIsFullRead: (v: boolean) => void, onNavigate?: () => void): void {
  setIsFullRead(false);
  onNavigate?.();
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      document.getElementById(`act-${actId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }),
  );
}

export function JourneyPhaseProgress({ onNavigate }: { onNavigate?: () => void }) {
  const actsRead = useDossierStore((s) => s.actsRead);
  const setIsFullRead = useDossierStore((s) => s.setIsFullRead);

  const firstIncompleteIdx = JOURNEY_PHASES.find((p) => !actsRead.includes(p.actIndex))?.actIndex;

  return (
    <div>
      <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-star-gold mb-4">
        JOURNEY_PROGRESSION
      </h3>
      <ol className="space-y-2" data-testid="journey-phase-progress">
        {JOURNEY_PHASES.map((phase) => {
          const complete = actsRead.includes(phase.actIndex);
          const active = !complete && phase.actIndex === firstIncompleteIdx;
          const state = complete ? "COMPLETE" : active ? "ACTIVE" : "LOCKED";
          return (
            <li key={phase.actId}>
              <button
                type="button"
                onClick={() => navigateToAct(phase.actId, setIsFullRead, onNavigate)}
                aria-label={
                  state === "LOCKED"
                    ? `${phase.name} — locked, read ${phase.code} to reach this phase`
                    : `Go to ${phase.name} (${state.toLowerCase()})`
                }
                className="w-full flex items-center justify-between gap-4 border border-white/10 px-4 py-3 text-left cursor-pointer hover:border-star-gold/50 transition-colors"
              >
                <span className="font-mono text-[10px] font-black uppercase tracking-widest text-white/50">
                  {phase.code}
                </span>
                <span className="flex-1 flex flex-col">
                  <span className="font-mono text-sm font-black uppercase tracking-tight text-white">
                    {phase.name}
                  </span>
                  {state === "LOCKED" && (
                    <span className="font-mono text-[8px] font-black uppercase tracking-widest text-white/30">
                      READ {phase.code} TO UNLOCK
                    </span>
                  )}
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
  );
}

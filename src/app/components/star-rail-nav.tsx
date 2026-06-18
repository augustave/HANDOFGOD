import { motion } from "motion/react";
import { Star } from "lucide-react";
import { phaseForActId } from "../data/journey-phases";
import { useDossierStore } from "../store";
import { cn } from "./dossier-components";

interface NavProps {
  acts: { id: string; title: string; code: string }[];
  activeAct: number;
  scrollPerc: number;
  reducedMotion?: boolean;
}

export const StarRailNav = ({ acts, activeAct, scrollPerc, reducedMotion = false }: NavProps) => {
  const actsRead = useDossierStore((s) => s.actsRead);

  return (
    <nav
      aria-label="Journey progression"
      className="fixed left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 z-40 hidden lg:flex"
    >
      <div className="w-px h-16 bg-ink-black/20" />
      {acts.map((act, idx) => {
        const phase = phaseForActId(act.id);
        const complete = phase ? actsRead.includes(phase.actIndex) : false;
        const isActive = activeAct === idx;
        // The named journey, persistently: each star carries its read-state, and
        // the hover label names the phase (BELONGING, CAPABILITY, ...) + state.
        const label = phase
          ? `PHASE ${phase.actIndex} // ${phase.name} — ${complete ? "COMPLETE" : "UNREAD"}`
          : act.title;
        return (
          <a key={act.id} href={`#act-${act.id}`} className="group relative">
            <motion.div
              animate={
                reducedMotion
                  ? undefined
                  : {
                      scale: isActive ? 1.5 : 1,
                      color: isActive ? "var(--star-gold)" : "var(--ink-black)",
                    }
              }
              className="flex items-center justify-center p-1"
            >
              <Star
                className={cn(
                  "w-4 h-4 transition-all duration-300",
                  complete
                    ? "fill-star-gold opacity-100"
                    : isActive
                      ? "fill-star-gold/40 opacity-80"
                      : "fill-transparent opacity-30",
                )}
              />
            </motion.div>
            <div className="absolute left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
              <span className="font-mono text-[9px] bg-ink-black text-white px-2 py-1 whitespace-nowrap uppercase tracking-widest shadow-lg font-black">
                {label}
              </span>
            </div>
          </a>
        );
      })}
      <div className="w-px h-16 bg-ink-black/20" />
      <div className="font-mono text-[9px] rotate-90 mt-12 text-gray-400 font-black tracking-[0.3em] whitespace-nowrap uppercase">
        DECLASS_STP_{Math.floor(scrollPerc)}%
      </div>
    </nav>
  );
};

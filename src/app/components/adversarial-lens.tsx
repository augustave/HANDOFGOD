// ADVERSARIAL LENS (PRD F06): per-act "VIEW_AS_ADVERSARY" toggle. Slides
// open an inverted brief — objective, three attack vectors, the counter.
// Not a global theme inversion; a contained hostile panel.

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Crosshair, ShieldCheck } from "lucide-react";
import { adversaryBriefForAct } from "../data/adversary";
import { cn } from "./dossier-components";

export function AdversarialLens({ actId }: { actId: string }) {
  const brief = adversaryBriefForAct(actId);
  const [open, setOpen] = useState(false);

  if (!brief) return null;

  return (
    <div className="my-8" data-testid={`adversary-${actId}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-pressed={open}
        className={cn(
          "flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 border-2 transition-colors cursor-pointer",
          open
            ? "bg-stamp-red border-stamp-red text-white"
            : "border-ink-black/30 text-ink-black/50 hover:border-stamp-red hover:text-stamp-red",
        )}
      >
        <Crosshair className="w-3.5 h-3.5" />
        {open ? "EXIT_ADVERSARY_VIEW" : "VIEW_AS_ADVERSARY"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 bg-ink-black text-white border-l-4 border-stamp-red p-6 md:p-8 space-y-5">
              <div className="grid sm:grid-cols-2 gap-3 pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="font-mono text-[8px] font-black uppercase tracking-[0.3em] text-white/40">
                    NORMAL_VIEW
                  </div>
                  <div className="font-serif text-sm leading-snug text-white/70">{brief.defends}</div>
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-[8px] font-black uppercase tracking-[0.3em] text-stamp-red">
                    ADVERSARY_VIEW
                  </div>
                  <div className="font-serif text-sm leading-snug text-white/90">{brief.fractures}</div>
                </div>
              </div>
              <div className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-stamp-red">
                ADVERSARY_BRIEF // OBJECTIVE
              </div>
              <p className="font-serif text-lg leading-snug text-white/90 italic">{brief.objective}</p>
              <ol className="space-y-3">
                {brief.vectors.map((vector, i) => (
                  <li key={i} className="flex gap-3 font-serif text-base leading-relaxed text-white/75">
                    <span className="font-mono text-[10px] font-black text-stamp-red shrink-0 pt-1">
                      V0{i + 1}
                    </span>
                    {vector}
                  </li>
                ))}
              </ol>
              <div className="border-t border-white/10 pt-4 flex gap-3">
                <ShieldCheck className="w-4 h-4 text-star-gold shrink-0 mt-1" />
                <p className="font-serif text-base leading-relaxed text-star-gold/90">{brief.counter}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

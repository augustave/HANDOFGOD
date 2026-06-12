// DECLASSIFIED BLOCK (PRD F05): gated extras — counterarguments, red-team
// memos, case studies. Locked state names its exact requirement (never a
// mystery lock); counter/red-team content renders inverted ("hostile review").

import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, ChevronUp, Lock } from "lucide-react";
import { declassifiedForAct, type DeclassifiedExtra } from "../data/declassified";
import { useDossierStore } from "../store";
import { selectIsUnlocked } from "../store/selectors";
import { cn, Stamp } from "./dossier-components";

export function ActDeclassified({ actId }: { actId: string }) {
  const extras = declassifiedForAct(actId);
  if (extras.length === 0) return null;
  return (
    <div className="my-12 space-y-4">
      {extras.map((extra) => (
        <DeclassifiedBlock key={extra.gateId} extra={extra} />
      ))}
    </div>
  );
}

function DeclassifiedBlock({ extra }: { extra: DeclassifiedExtra }) {
  const unlocked = useDossierStore(selectIsUnlocked(extra.gateId));
  const [expanded, setExpanded] = useState(false);
  const hostile = extra.kind === "redteam" || extra.kind === "counterargument";

  if (!unlocked) {
    return (
      <div
        data-testid={`declassified-${extra.gateId}`}
        className="border-2 border-dashed border-ink-black/25 bg-tape-beige/30 p-4 flex items-center gap-4"
      >
        <Lock className="w-4 h-4 shrink-0 text-ink-black/40" />
        <div className="flex-1 min-w-0">
          <div className="h-3 bg-redaction-black/80 max-w-[60%] mb-2" aria-hidden="true" />
          <div className="font-mono text-[9px] font-black uppercase tracking-widest text-ink-black/50">
            LOCKED // {extra.requirementText}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid={`declassified-${extra.gateId}`}
      className={cn(
        "border-2",
        hostile ? "border-stamp-red bg-ink-black text-white" : "border-ink-black bg-white",
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className={cn(
          "w-full flex items-center justify-between gap-4 p-4 font-mono text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer text-left",
          hostile ? "text-stamp-red hover:text-white" : "text-ink-black hover:text-stamp-red",
          "transition-colors",
        )}
      >
        <span>{extra.title}</span>
        {expanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
      </button>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={cn("px-4 md:px-6 pb-6", hostile ? "border-t border-white/10" : "border-t border-ink-black/10")}
        >
          <p className={cn("font-serif text-base md:text-lg leading-relaxed pt-4", hostile ? "text-white/85" : "text-ink-black/85")}>
            {extra.body}
          </p>
          <Stamp text="DECLASSIFIED" color={hostile ? "var(--star-gold)" : "var(--stamp-red)"} rotated={-3} />
        </motion.div>
      )}
    </div>
  );
}

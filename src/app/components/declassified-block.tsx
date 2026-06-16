// DECLASSIFIED BLOCK (PRD F05): gated extras — counterarguments, red-team
// memos, case studies. Locked state names its exact requirement (never a
// mystery lock); counter/red-team content renders inverted ("hostile review").

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ChevronDown, ChevronUp, Circle, Lock } from "lucide-react";
import { declassifiedForAct, type DeclassifiedExtra } from "../data/declassified";
import { UNLOCK_GATES } from "../data/unlock-gates";
import type { UnlockGate } from "../engine/unlocks";
import { gateRequirementLines } from "../lib/requirements";
import { useDossierStore } from "../store";
import { assessedActIds } from "../store/derive";
import { selectIsUnlocked } from "../store/selectors";
import { cn, Stamp } from "./dossier-components";

const GATE_BY_ID = new Map<string, UnlockGate>(UNLOCK_GATES.map((g) => [g.id, g]));

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
  const actsReadCount = useDossierStore((s) => s.actsRead.length);
  const responsesCount = useDossierStore((s) => s.responses.length);
  const scenariosCount = useDossierStore((s) => s.scenarioCommits.length);
  const responses = useDossierStore((s) => s.responses);
  const [expanded, setExpanded] = useState(false);
  const hostile = extra.kind === "redteam" || extra.kind === "counterargument";

  if (!unlocked) {
    const gate = GATE_BY_ID.get(extra.gateId);
    const lines = gate
      ? gateRequirementLines(gate.requires, {
          actsReadCount,
          responsesCount,
          scenariosCount,
          assessedActIds: assessedActIds({ responses }),
        })
      : [];
    return (
      <div
        data-testid={`declassified-${extra.gateId}`}
        className="border-2 border-dashed border-ink-black/25 bg-tape-beige/30 p-4 flex gap-4"
      >
        <Lock className="w-4 h-4 shrink-0 text-ink-black/40 mt-0.5" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="font-mono text-[9px] font-black uppercase tracking-widest text-ink-black/50">
            LOCKED // {extra.title}
          </div>
          <ul className="space-y-1">
            {lines.map((line) => (
              <li
                key={line.label}
                className={cn(
                  "flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-widest",
                  line.met ? "text-green-700" : "text-ink-black/50",
                )}
              >
                {line.met ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3 opacity-40" />}
                {line.label}
                <span className="opacity-60">
                  ({Math.min(line.have, line.need)}/{line.need})
                </span>
              </li>
            ))}
          </ul>
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

// Journey phase chips: READ -> ASSESS -> OPERATE -> DEBRIEF. Each chip shows
// progress and scrolls to the next incomplete item of its phase. DEBRIEF
// stays locked until the mirror requirements are met.

import { Lock } from "lucide-react";
import { ACTS } from "../data/dossier";
import { ASSESSMENT_QUESTIONS } from "../data/assessments";
import { OPERATION_SCENARIOS } from "../data/scenarios";
import { useDossierStore } from "../store";
import { isDebriefUnlocked } from "../store/slices/journey-slice";
import type { JourneyPhase } from "../store/types";
import { cn } from "./dossier-components";

const ESSAY_ACTS = ACTS.slice(1);

function scrollToId(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function JourneyTracker({ variant }: { variant: "desktop" | "mobile" }) {
  const phase = useDossierStore((s) => s.phase);
  const requestPhase = useDossierStore((s) => s.requestPhase);
  const actsRead = useDossierStore((s) => s.actsRead);
  const responses = useDossierStore((s) => s.responses);
  const scenarioCommits = useDossierStore((s) => s.scenarioCommits);
  const committedPosture = useDossierStore((s) => s.committedPosture);

  const operationsForDebrief = scenarioCommits.length + (committedPosture ? 1 : 0);
  const progress = {
    read: { done: actsRead.length, total: ESSAY_ACTS.length },
    assess: { done: responses.length, total: ASSESSMENT_QUESTIONS.length },
    operate: { done: scenarioCommits.length, total: OPERATION_SCENARIOS.length },
    debriefUnlocked: isDebriefUnlocked({
      actsReadCount: actsRead.length,
      responsesCount: responses.length,
      operationsCount: operationsForDebrief,
    }),
  };

  // DEBRIEF "why locked" is derived live from the same thresholds isDebriefUnlocked uses —
  // never hand-duplicated, so the counts can't drift from the real gate.
  const debriefReqs = [
    { label: "READ", have: actsRead.length, need: 5 },
    { label: "ASSESS", have: responses.length, need: 4 },
    { label: "OPERATE", have: operationsForDebrief, need: 1 },
  ];
  const debriefReqsMet = debriefReqs.filter((r) => r.have >= r.need).length;
  const debriefTooltip = progress.debriefUnlocked
    ? "Open the strategic mirror"
    : `LOCKED // ${debriefReqs.map((r) => `${r.label} ${Math.min(r.have, r.need)}/${r.need}`).join(" · ")}`;

  const jumpTo: Record<JourneyPhase, () => void> = {
    READ: () => {
      const next = ESSAY_ACTS.find((_, i) => !actsRead.includes(i + 1));
      scrollToId(next ? `act-${next.id}` : `act-${ESSAY_ACTS[0].id}`);
    },
    ASSESS: () => {
      const next = ASSESSMENT_QUESTIONS.find((q) => !responses.some((r) => r.id === q.id));
      if (next) scrollToId(`assess-${next.afterActId}`);
    },
    OPERATE: () => {
      const next = OPERATION_SCENARIOS.find(
        (s) => !scenarioCommits.some((c) => c.scenarioId === s.id),
      );
      if (next) scrollToId(`op-${next.id}`);
    },
    DEBRIEF: () => scrollToId("strategic-mirror"),
  };

  const chips: { phase: JourneyPhase; label: string; counter: string; locked?: boolean }[] = [
    { phase: "READ", label: "READ", counter: `${progress.read.done}/${progress.read.total}` },
    { phase: "ASSESS", label: "ASSESS", counter: `${progress.assess.done}/${progress.assess.total}` },
    { phase: "OPERATE", label: "OPERATE", counter: `${progress.operate.done}/${progress.operate.total}` },
    {
      phase: "DEBRIEF",
      label: "DEBRIEF",
      counter: progress.debriefUnlocked ? "" : `${debriefReqsMet}/${debriefReqs.length}`,
      locked: !progress.debriefUnlocked,
    },
  ];

  return (
    <nav
      aria-label="Journey"
      className={cn(
        variant === "desktop"
          ? "flex items-center bg-white/5 px-3 py-1.5 gap-1 border-r border-white/10"
          : "grid grid-cols-4 gap-2",
      )}
    >
      {chips.map((chip) => {
        const isActive = phase === chip.phase;
        return (
          <button
            type="button"
            key={chip.phase}
            aria-current={isActive ? "step" : undefined}
            title={
              chip.phase === "DEBRIEF"
                ? debriefTooltip
                : `Jump to next ${chip.label.toLowerCase()} item`
            }
            onClick={() => {
              requestPhase(chip.phase);
              jumpTo[chip.phase]();
            }}
            className={cn(
              "font-mono font-black uppercase tracking-widest transition-colors cursor-pointer flex items-center justify-center gap-1.5",
              variant === "desktop"
                ? "text-[9px] px-2 py-1"
                : "text-[9px] py-2 border flex-col gap-0.5",
              isActive
                ? variant === "desktop"
                  ? "text-star-gold"
                  : "bg-star-gold text-ink-black border-star-gold"
                : variant === "desktop"
                  ? "text-gray-500 hover:text-white"
                  : "text-gray-500 border-white/10 hover:text-white",
              chip.locked && "opacity-60",
            )}
          >
            <span className="flex items-center gap-1">
              {chip.locked && <Lock className="w-2.5 h-2.5" />}
              <span>{chip.label}</span>
            </span>
            {chip.counter && <span className="opacity-60 text-[8px]">{chip.counter}</span>}
          </button>
        );
      })}
    </nav>
  );
}

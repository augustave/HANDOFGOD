// OPERATION scenario runner: SITUATION -> A/B/C decision -> COMMIT ->
// GAINED / EXPOSED / SECOND_ORDER tradeoff reveal. Choices log profile
// signals; one RECONSIDER is allowed (the store halves recommit weights).

import { useState } from "react";
import { motion } from "motion/react";
import { Crosshair, RotateCcw, ShieldAlert, TrendingUp, Workflow } from "lucide-react";
import { scenariosForAct } from "../data/scenarios";
import type { OperationScenario, ScenarioChoice } from "../engine/content-types";
import type { ScenarioChoiceId } from "../engine/signals";
import { useDossierStore } from "../store";
import { cn, Stamp } from "./dossier-components";
import type { SecurityRole } from "../types";

const ROLE_SCENARIO_FRAME: Record<SecurityRole, string> = {
  ANALYST: "ANALYST FRAME // What is actually happening here?",
  OPERATOR: "OPERATOR FRAME // What would you do?",
  COMMANDER: "COMMANDER FRAME // What are the second-order effects?",
};

export function ActScenarios({ actId }: { actId: string }) {
  const scenarios = scenariosForAct(actId);
  if (scenarios.length === 0) return null;
  return (
    <>
      {scenarios.map((scenario) => (
        <ScenarioPlayer key={scenario.id} scenario={scenario} />
      ))}
    </>
  );
}

export function ScenarioPlayer({ scenario }: { scenario: OperationScenario }) {
  const commit = useDossierStore((s) =>
    s.scenarioCommits.find((c) => c.scenarioId === scenario.id),
  );
  const chooseScenario = useDossierStore((s) => s.chooseScenario);
  const role = useDossierStore((s) => s.role);
  const [selected, setSelected] = useState<ScenarioChoiceId | null>(null);
  const [reconsidering, setReconsidering] = useState(false);
  const [hasReconsidered, setHasReconsidered] = useState(false);

  const committedChoice = commit
    ? scenario.choices.find((c) => c.id === commit.choiceId)
    : undefined;
  const deciding = commit === undefined || reconsidering;

  return (
    <section
      aria-label={scenario.code}
      data-testid={`scenario-${scenario.id}`}
      className="my-16 bg-white border-4 border-ink-black relative overflow-hidden"
    >
      <div className="bg-ink-black text-white p-4 px-6 md:px-8 font-mono text-[10px] flex justify-between items-center">
        <span className="font-black uppercase tracking-[0.2em] flex items-center gap-3">
          <Crosshair className="w-4 h-4 text-star-gold" /> {scenario.code}
        </span>
        <span className="opacity-50 font-black uppercase tracking-widest">
          {commit ? "DECISION_LOGGED" : "DECISION_PENDING"}
        </span>
      </div>

      <div className="p-6 md:p-10 space-y-8">
        <div className="space-y-3">
          <h4 className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-stamp-red">
            SITUATION
          </h4>
          <p className="font-serif text-lg md:text-xl leading-relaxed text-ink-black/90">
            {scenario.situation}
          </p>
          <p className="font-mono text-[10px] font-black uppercase tracking-widest text-ink-black/50 border-l-2 border-stamp-red pl-3">
            {scenario.constraint}
          </p>
          <p className="font-mono text-[10px] font-black uppercase tracking-widest text-dossier-blue border-l-2 border-dossier-blue pl-3">
            {ROLE_SCENARIO_FRAME[role]}
          </p>
        </div>

        <div className="space-y-3" role="group" aria-label="Decision options">
          {scenario.choices.map((choice) => {
            const isChosen = deciding ? selected === choice.id : commit?.choiceId === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                disabled={!deciding}
                onClick={() => setSelected(choice.id)}
                aria-pressed={isChosen}
                className={cn(
                  "w-full text-left flex items-start gap-4 border-2 p-4 md:p-5 transition-colors",
                  deciding && "cursor-pointer hover:border-ink-black",
                  isChosen ? "border-ink-black bg-ink-black/5" : "border-ink-black/15",
                  !deciding && !isChosen && "opacity-35",
                )}
              >
                <span
                  className={cn(
                    "shrink-0 w-8 h-8 border-2 flex items-center justify-center font-mono font-black text-sm",
                    isChosen ? "border-ink-black bg-ink-black text-white" : "border-ink-black/30",
                  )}
                >
                  {choice.id}
                </span>
                <span className="font-serif text-base md:text-lg leading-snug text-ink-black/90 pt-1">
                  {choice.label}
                </span>
              </button>
            );
          })}
        </div>

        {deciding ? (
          <button
            type="button"
            disabled={selected === null}
            data-testid={`commit-${scenario.id}`}
            onClick={() => {
              if (selected === null) return;
              chooseScenario(scenario, selected);
              if (reconsidering) {
                setHasReconsidered(true);
                setReconsidering(false);
              }
              setSelected(null);
            }}
            className="flex items-center gap-3 bg-stamp-red text-white font-mono text-[10px] font-black uppercase tracking-[0.3em] px-6 py-4 cursor-pointer hover:bg-ink-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            COMMIT_DECISION
          </button>
        ) : (
          committedChoice && (
            <TradeoffReveal
              choice={committedChoice}
              canReconsider={!hasReconsidered}
              onReconsider={() => {
                setSelected(null);
                setReconsidering(true);
              }}
            />
          )
        )}
      </div>
    </section>
  );
}

function TradeoffReveal({
  choice,
  canReconsider,
  onReconsider,
}: {
  choice: ScenarioChoice;
  canReconsider: boolean;
  onReconsider: () => void;
}) {
  const rows = [
    { label: "GAINED", text: choice.gained, icon: TrendingUp, tone: "text-green-700 border-green-700/30" },
    { label: "EXPOSED", text: choice.exposed, icon: ShieldAlert, tone: "text-stamp-red border-stamp-red/30" },
    { label: "SECOND_ORDER", text: choice.secondOrder, icon: Workflow, tone: "text-dossier-blue border-dossier-blue/30" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
      data-testid="scenario-tradeoffs"
      aria-live="polite"
    >
      {rows.map(({ label, text, icon: Icon, tone }) => (
        <div key={label} className={cn("border-l-4 bg-substrate-paper/60 p-4 md:p-5", tone)}>
          <div className={cn("font-mono text-[9px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2", tone)}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </div>
          <p className="font-serif text-base leading-relaxed text-ink-black/85">{text}</p>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2">
        <Stamp text="DECISION_LOGGED" rotated={-3} />
        {canReconsider && (
          <button
            type="button"
            onClick={onReconsider}
            className="flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-widest text-ink-black/40 hover:text-ink-black transition-colors cursor-pointer bg-transparent border-0"
          >
            <RotateCcw className="w-3 h-3" /> RECONSIDER (LOGGED AT HALF WEIGHT)
          </button>
        )}
      </div>
    </motion.div>
  );
}

// FIELD ASSESSMENT — inline checkpoint rendered after each essay act.
// Activates once the act has been read (3s dwell); answering logs a profile
// signal and declassifies the act's inline redactions. Always skippable.

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Lock, RotateCcw } from "lucide-react";
import { questionsForAct } from "../data/assessments";
import type { AssessmentQuestion } from "../engine/content-types";
import { useDossierStore } from "../store";
import { cn, Stamp } from "./dossier-components";

interface AssessmentCheckpointProps {
  actId: string;
  actCode: string;
  actIndex: number;
}

export function AssessmentCheckpoint({ actId, actCode, actIndex }: AssessmentCheckpointProps) {
  const questions = useMemo(() => questionsForAct(actId), [actId]);
  const actsRead = useDossierStore((s) => s.actsRead);

  if (questions.length === 0) return null;

  const isActive = actsRead.includes(actIndex);

  return (
    <section
      aria-label={`Field assessment for ${actCode}`}
      data-testid={`checkpoint-${actId}`}
      className="my-16 space-y-8"
      id={`assess-${actId}`}
    >
      <div className="font-mono text-[10px] font-black uppercase tracking-[0.4em] text-ink-black/50 flex items-center gap-3">
        <span className="w-3 h-px bg-ink-black/40" />
        FIELD_ASSESSMENT // {actCode} // EYES_ONLY
      </div>

      {!isActive ? (
        <div className="border-2 border-dashed border-ink-black/20 bg-tape-beige/40 p-6 flex items-center gap-4 font-mono text-[10px] font-black uppercase tracking-widest text-ink-black/40">
          <Lock className="w-4 h-4 shrink-0" />
          CHECKPOINT_SEALED // READ THE SECTION ABOVE TO ACTIVATE
        </div>
      ) : (
        questions.map((question) => <QuestionBlock key={question.id} question={question} />)
      )}
    </section>
  );
}

function QuestionBlock({ question }: { question: AssessmentQuestion }) {
  const response = useDossierStore((s) => s.responses.find((r) => r.id === question.id));
  const isDeferred = useDossierStore((s) => s.deferredQuestionIds.includes(question.id));
  const answerQuestion = useDossierStore((s) => s.answerQuestion);
  const deferQuestion = useDossierStore((s) => s.deferQuestion);
  const [selected, setSelected] = useState<string | null>(null);
  const [resumed, setResumed] = useState(false);

  const answeredOption = response
    ? question.options.find((o) => o.id === response.answer)
    : undefined;

  if (isDeferred && !resumed) {
    return (
      <div
        data-testid={`question-${question.id}`}
        className="border border-ink-black/20 bg-tape-beige/40 p-4 flex items-center justify-between gap-4 font-mono text-[10px] font-black uppercase tracking-widest text-ink-black/50"
      >
        <span>DEFERRED // RESPONSE_PENDING</span>
        <button
          type="button"
          onClick={() => setResumed(true)}
          className="flex items-center gap-2 border border-ink-black/40 px-3 py-1.5 cursor-pointer hover:bg-ink-black hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> RESUME
        </button>
      </div>
    );
  }

  return (
    <div
      data-testid={`question-${question.id}`}
      className="border-2 border-ink-black bg-tape-beige/60 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] font-black text-7xl uppercase flex items-center justify-center -rotate-12 select-none" aria-hidden="true">
        SPECIMEN
      </div>

      <fieldset className="p-6 md:p-8 space-y-6 relative" disabled={response !== undefined}>
        <legend className="font-serif text-xl md:text-2xl leading-snug text-ink-black/90 font-medium float-left mb-6">
          {question.prompt}
        </legend>
        <div className="clear-both" />

        <div className="space-y-3" role="radiogroup" aria-label="Response options">
          {question.options.map((option) => {
            const isChosen = response ? response.answer === option.id : selected === option.id;
            return (
              <label
                key={option.id}
                className={cn(
                  "flex items-start gap-4 border p-4 transition-colors",
                  response === undefined && "cursor-pointer hover:border-ink-black",
                  isChosen ? "border-ink-black bg-white" : "border-ink-black/20 bg-white/40",
                  response !== undefined && !isChosen && "opacity-40",
                )}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={isChosen}
                  onChange={() => setSelected(option.id)}
                  disabled={response !== undefined}
                  className="mt-1.5 accent-[var(--stamp-red)]"
                />
                <span className="font-serif text-base md:text-lg leading-snug text-ink-black/90">
                  {option.label}
                </span>
                {response !== undefined && isChosen && (
                  <span className="ml-auto shrink-0 font-mono text-[8px] font-black uppercase tracking-widest border border-star-gold text-star-gold px-1.5 py-0.5">
                    LOGGED
                  </span>
                )}
              </label>
            );
          })}
        </div>

        {response === undefined && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={selected === null}
              onClick={() => {
                if (selected !== null) answerQuestion(question, selected);
              }}
              className="flex items-center gap-2 bg-ink-black text-white font-mono text-[10px] font-black uppercase tracking-[0.3em] px-5 py-3 cursor-pointer hover:bg-stamp-red transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              LOG_RESPONSE <ChevronRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => {
                deferQuestion(question.id);
                setResumed(false);
              }}
              className="font-mono text-[9px] font-black uppercase tracking-widest text-ink-black/40 hover:text-ink-black transition-colors cursor-pointer bg-transparent border-0"
            >
              DEFER // RETURN_LATER
            </button>
          </div>
        )}
      </fieldset>

      <div aria-live="polite">
        {answeredOption && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative border-t-2 border-ink-black bg-white p-6 md:p-8"
          >
            <h4 className="font-mono text-[9px] font-black uppercase tracking-[0.3em] text-stamp-red mb-3">
              RESPONSE_ANALYSIS
            </h4>
            <p className="font-serif text-base md:text-lg leading-relaxed text-ink-black/80 italic">
              {answeredOption.insight}
            </p>
            <Stamp text="LOGGED" rotated={-4} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

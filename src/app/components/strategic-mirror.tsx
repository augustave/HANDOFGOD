// STRATEGIC MIRROR — the DEBRIEF deliverable. Locked until the journey
// requirements are met (the lock IS the old progress grid, made functional).
// Unlocked: posture distribution, literacy profile, strengths/blind spots
// with an evidence trail, key judgments, recommended study, and exports.

import { CheckCircle2, Circle, Download, FileText, Lock, Printer } from "lucide-react";
import { BRIEF_SUMMARIES } from "../data/dossier";
import { CONFIDENCE_THRESHOLD, DIMENSION_DEBRIEFS, TOTAL_SIGNALS } from "../data/debrief";
import { compositeScore, rankDimensions } from "../engine/profile";
import {
  DIMENSION_LABELS,
  DIMENSIONS,
  POSTURE_LABELS,
  POSTURES,
} from "../engine/weights";
import { buildMarkdownReport, downloadMarkdown } from "../lib/debrief-export";
import { downloadSvg, mirrorCard } from "../lib/share-card-svg";
import { useDossierStore } from "../store";
import { selectClearance, selectSignalCount } from "../store/selectors";
import { isDebriefUnlocked } from "../store/slices/journey-slice";
import { BriefSummary } from "./brief-summary";
import { CHECKLIST_ITEMS } from "./interface-checklist";
import { ThreatRadar } from "./threat-radar";
import { cn, Stamp } from "./dossier-components";

const POSTURE_BAR_COLORS: Record<(typeof POSTURES)[number], string> = {
  watcher: "bg-stamp-red",
  architect: "bg-star-gold",
  sovereign: "bg-dossier-blue",
};

function useOperationsCount(): number {
  const scenarios = useDossierStore((s) => s.scenarioCommits.length);
  const committedPosture = useDossierStore((s) => s.committedPosture);
  return scenarios + (committedPosture ? 1 : 0);
}

export function StrategicMirror() {
  const actsReadCount = useDossierStore((s) => s.actsRead.length);
  const responsesCount = useDossierStore((s) => s.responses.length);
  const operationsCount = useOperationsCount();
  const unlocked = isDebriefUnlocked({ actsReadCount, responsesCount, operationsCount });

  return (
    <section id="strategic-mirror" aria-label="Strategic mirror" className="text-left">
      {unlocked ? <UnlockedMirror /> : <LockedMirror />}
    </section>
  );
}

function LockedMirror() {
  const actsReadCount = useDossierStore((s) => s.actsRead.length);
  const responsesCount = useDossierStore((s) => s.responses.length);
  const operationsDone = useOperationsCount();

  const requirements = [
    { label: "READ THE DOSSIER", detail: `${actsReadCount}/5 SECTIONS`, met: actsReadCount >= 5 },
    { label: "LOG FIELD ASSESSMENTS", detail: `${responsesCount}/4 RESPONSES`, met: responsesCount >= 4 },
    { label: "RUN AN OPERATION", detail: `${operationsDone}/1 COMMITTED`, met: operationsDone >= 1 },
  ];

  return (
    <div data-testid="mirror-locked" className="border-4 border-ink-black bg-ink-black text-white p-8 md:p-12 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xl md:text-2xl font-black uppercase tracking-[0.2em] flex items-center gap-4">
          <Lock className="w-6 h-6 text-star-gold" /> MIRROR_SEALED
        </h2>
        <span className="font-mono text-[9px] font-black uppercase tracking-widest text-white/40 hidden md:block">
          DEBRIEF_REQUIREMENTS
        </span>
      </div>
      <p className="font-serif text-base md:text-lg italic text-white/60 max-w-2xl">
        The mirror reflects what you put into it. Complete the requirements below and the
        after-action report unseals — posture, blind spots, and the study plan that follows from them.
      </p>
      <ul className="space-y-3">
        {requirements.map((req) => (
          <li
            key={req.label}
            className={cn(
              "flex items-center justify-between gap-4 border p-4 font-mono text-[10px] font-black uppercase tracking-widest",
              req.met ? "border-star-gold/40 text-star-gold" : "border-white/15 text-white/60",
            )}
          >
            <span className="flex items-center gap-3">
              {req.met ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 opacity-40" />}
              {req.label}
            </span>
            <span>{req.detail}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function UnlockedMirror() {
  const profile = useDossierStore((s) => s.profile);
  const posture = useDossierStore((s) => s.postureDistribution);
  const responses = useDossierStore((s) => s.responses);
  const callsign = useDossierStore((s) => s.callsign);
  const sessionId = useDossierStore((s) => s.sessionId);
  const checkedItems = useDossierStore((s) => s.checkedItems);
  const clearance = useDossierStore(selectClearance);
  const signalCount = useDossierStore(selectSignalCount);

  const ranked = rankDimensions(profile);
  const strengths = ranked.slice(0, 2);
  const blindSpots = ranked.slice(-2);
  const composite = compositeScore(profile);
  const openActions = CHECKLIST_ITEMS.filter((i) => !checkedItems.includes(i.id)).map((i) => i.text);
  const lowConfidence = signalCount < CONFIDENCE_THRESHOLD;

  const exportMarkdown = () =>
    downloadMarkdown(
      buildMarkdownReport({
        callsign,
        sessionId,
        profile,
        postureDistribution: posture,
        clearance,
        signalCount,
        openActions,
      }),
      "after-action-report.md",
    );

  const exportCard = () =>
    downloadSvg(
      mirrorCard({ callsign, clearance, profile, postureDistribution: posture }),
      "strategic-mirror-card.svg",
    );

  return (
    <div data-testid="mirror-report" className="border-4 border-ink-black bg-white">
      <div className="bg-ink-black text-white p-6 md:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-mono text-xl md:text-2xl font-black uppercase tracking-[0.2em]">
            AFTER_ACTION_REPORT
          </h2>
          <div className="font-mono text-[10px] font-black uppercase tracking-widest text-star-gold mt-2">
            OPERATOR: {(callsign ?? "UNNAMED_OPERATOR").toUpperCase()} // CLEARANCE: {clearance}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-5xl font-black text-star-gold leading-none" data-testid="composite-score">
            {composite}
          </div>
          <div className="font-mono text-[8px] font-black uppercase tracking-widest text-white/50">
            /100 STRATEGIC_LITERACY
          </div>
        </div>
      </div>

      {lowConfidence && (
        <div className="bg-stamp-red/10 border-b-2 border-stamp-red px-6 md:px-8 py-3 font-mono text-[10px] font-black uppercase tracking-widest text-stamp-red">
          LOW_CONFIDENCE // {signalCount}/{TOTAL_SIGNALS} SIGNALS — LOG MORE RESPONSES TO SHARPEN THE MIRROR
        </div>
      )}

      <div className="p-6 md:p-10 space-y-12">
        {/* Posture distribution */}
        <div className="space-y-4">
          <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-stamp-red">
            POSTURE_DISTRIBUTION
          </h3>
          {POSTURES.map((p) => (
            <div key={p} className="space-y-1">
              <div className="flex justify-between font-mono text-[10px] font-black uppercase tracking-widest">
                <span>{POSTURE_LABELS[p]}</span>
                <span data-testid={`posture-${p}-pct`}>{posture[p]}%</span>
              </div>
              <div className="h-3 bg-ink-black/5 border border-ink-black/20">
                <div
                  className={cn("h-full transition-all duration-700", POSTURE_BAR_COLORS[p])}
                  style={{ width: `${posture[p]}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Literacy profile + exposure snapshot */}
        <div className="grid md:grid-cols-[1fr_280px] gap-10 items-start">
          <div className="space-y-4">
            <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-stamp-red">
              LITERACY_PROFILE
            </h3>
            <div className="space-y-4">
              {DIMENSIONS.map((dim) => (
                <div key={dim} className="space-y-1">
                  <div className="flex justify-between font-mono text-[9px] font-black uppercase tracking-widest">
                    <span>{DIMENSION_LABELS[dim]}</span>
                    <span>{profile[dim]}</span>
                  </div>
                  <div className="h-2 bg-ink-black/5 border border-ink-black/15">
                    <div className="h-full bg-ink-black/70" style={{ width: `${profile[dim]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-2 border-ink-black/15 p-4 hidden md:block">
            <ThreatRadar
              variant="paper"
              values={[
                100 - profile.narrativeLiteracy,
                100 - profile.capabilityOrientation,
                100 - profile.institutionalTrust,
                100 - profile.systemAwareness,
                100 - profile.strategicRealism,
                100 - profile.operationalThinking,
              ]}
            />
          </div>
        </div>

        {/* Strengths / blind spots */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-green-700">
              STRENGTHS
            </h3>
            {strengths.map((dim) => (
              <div key={dim} className="border-l-4 border-green-700/40 pl-4">
                <div className="font-mono text-[10px] font-black uppercase tracking-widest mb-1">
                  {DIMENSION_LABELS[dim]}
                </div>
                <p className="font-serif text-sm leading-relaxed text-ink-black/75 italic">
                  {DIMENSION_DEBRIEFS[dim].strength}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-stamp-red">
              BLIND_SPOTS
            </h3>
            {blindSpots.map((dim) => (
              <div key={dim} className="border-l-4 border-stamp-red/40 pl-4">
                <div className="font-mono text-[10px] font-black uppercase tracking-widest mb-1">
                  {DIMENSION_LABELS[dim]}
                </div>
                <p className="font-serif text-sm leading-relaxed text-ink-black/75 italic">
                  {DIMENSION_DEBRIEFS[dim].blindSpot}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key judgments (folded-in BRIEF mode) */}
        <div className="space-y-6">
          <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-stamp-red">
            KEY_JUDGMENTS
          </h3>
          <div className="grid md:grid-cols-2 gap-8 text-sm font-serif">
            {(Object.keys(BRIEF_SUMMARIES) as (keyof typeof BRIEF_SUMMARIES)[]).map((key) => (
              <BriefSummary key={key} summaryKey={key} />
            ))}
          </div>
        </div>

        {/* Recommended study + open actions */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-stamp-red">
              RECOMMENDED_STUDY
            </h3>
            <ul className="space-y-2">
              {blindSpots.flatMap((dim) =>
                DIMENSION_DEBRIEFS[dim].reading.map((r) => (
                  <li key={r.title} className="font-mono text-[11px] font-bold uppercase tracking-tight flex gap-2">
                    <FileText className="w-3.5 h-3.5 shrink-0 text-ink-black/40 mt-0.5" />
                    <span>
                      {r.title} <span className="text-ink-black/40">— {r.author}</span>
                    </span>
                  </li>
                )),
              )}
            </ul>
          </div>
          {openActions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-stamp-red">
                OPEN_ACTIONS
              </h3>
              <ul className="space-y-2">
                {openActions.map((action) => (
                  <li key={action} className="font-mono text-[11px] font-bold uppercase tracking-tight flex gap-2">
                    <Circle className="w-3 h-3 shrink-0 text-ink-black/30 mt-0.5" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Evidence trail */}
        <div className="space-y-3" data-testid="debrief-evidence">
          <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-stamp-red">
            EVIDENCE_TRAIL
          </h3>
          <ul className="space-y-1.5">
            {responses.map((r) => (
              <li key={r.id} className="font-mono text-[9px] uppercase tracking-widest text-ink-black/50 flex flex-wrap gap-x-2">
                <span className="font-black text-ink-black/70">{r.id}</span>
                <span>
                  → {Object.entries(r.weight)
                    .map(([dim, w]) => `${(w as number) > 0 ? "+" : ""}${w} ${DIMENSION_LABELS[dim as keyof typeof DIMENSION_LABELS]}`)
                    .join(", ")}
                </span>
              </li>
            ))}
            {responses.length === 0 && (
              <li className="font-mono text-[9px] uppercase tracking-widest text-ink-black/30 italic">
                No assessment responses logged.
              </li>
            )}
          </ul>
        </div>

        {/* Exports */}
        <div className="flex flex-wrap gap-4 pt-4 border-t-2 border-ink-black/10">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-ink-black text-white font-mono text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 cursor-pointer hover:bg-stamp-red transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> PRINT_REPORT
          </button>
          <button
            type="button"
            onClick={exportMarkdown}
            className="flex items-center gap-2 border-2 border-ink-black font-mono text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 cursor-pointer hover:bg-ink-black hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> EXPORT_MD
          </button>
          <button
            type="button"
            onClick={exportCard}
            className="flex items-center gap-2 border-2 border-ink-black font-mono text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 cursor-pointer hover:bg-ink-black hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> DOWNLOAD_CARD
          </button>
          <div className="ml-auto">
            <Stamp text={clearance} rotated={-4} />
          </div>
        </div>
      </div>
    </div>
  );
}

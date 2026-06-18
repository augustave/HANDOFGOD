import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock, Search } from "lucide-react";
import { ACTS, SYSTEM_CARD_STATES } from "./data/dossier";
import { hasPersistedSession, useDossierStore } from "./store";
import { selectClearance, selectPostureDistribution } from "./store/selectors";
import { dominantPosture } from "./engine/posture";
import { POSTURE_LABELS } from "./engine/weights";
import { phaseForActId } from "./data/journey-phases";
import { useAudioBriefing } from "./hooks/use-audio-briefing";
import { useDossierProgress } from "./hooks/use-dossier-progress";
import { useReducedMotion } from "./hooks/use-reduced-motion";
import { ActBriefing, ActRenderer } from "./components/act-renderer";
import { ActDeclassified } from "./components/declassified-block";
import { AdversarialLens } from "./components/adversarial-lens";
import { RoleLens } from "./components/role-lens";
import { AssessmentCheckpoint } from "./components/assessment-checkpoint";
import { ActScenarios } from "./components/scenario-player";
import { cn, SecureLine, TornEdge } from "./components/dossier-components";
import { CommandDock } from "./components/command-dock";
import { FullArticle } from "./components/full-article";
import { StrategicMirror } from "./components/strategic-mirror";
import { HeroSection } from "./components/hero-section";
import { isProfileDebugEnabled, ProfileDebug } from "./components/profile-debug";
import { SelectionTooltip } from "./components/selection-tooltip";
import { SignalToast } from "./components/signal-toast";
import { TerrainOverlay } from "./components/terrain-overlay";
import { StarRailNav } from "./components/star-rail-nav";
import { SystemCard } from "./components/system-card";

const BootSequence = lazy(() => import("./components/boot-sequence").then((mod) => ({ default: mod.BootSequence })));
const CommandPalette = lazy(() => import("./components/command-palette").then((mod) => ({ default: mod.CommandPalette })));
const ShareCardComposer = lazy(() => import("./components/share-card-composer").then((mod) => ({ default: mod.ShareCardComposer })));

export default function App() {
  const plainTextMode = useDossierStore((s) => s.plainTextMode);
  const setPlainTextMode = useDossierStore((s) => s.setPlainTextMode);
  const isWoke = useDossierStore((s) => s.isWoke);
  const setIsWoke = useDossierStore((s) => s.setIsWoke);
  const isAudioMode = useDossierStore((s) => s.isAudioMode);
  const setIsAudioMode = useDossierStore((s) => s.setIsAudioMode);
  const isFocusMode = useDossierStore((s) => s.isFocusMode);
  const setIsFocusMode = useDossierStore((s) => s.setIsFocusMode);
  const isFullRead = useDossierStore((s) => s.isFullRead);
  const setIsFullRead = useDossierStore((s) => s.setIsFullRead);
  const role = useDossierStore((s) => s.role);
  const phase = useDossierStore((s) => s.phase);
  const clearance = useDossierStore(selectClearance);
  const postureDistribution = useDossierStore(selectPostureDistribution);
  const [shareText, setShareText] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  // Boot splash only on first-ever visits; returning sessions skip straight in.
  const [showBoot, setShowBoot] = useState(() => !hasPersistedSession());
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [wakeFlash, setWakeFlash] = useState(false);
  const reducedMotion = useReducedMotion();
  const { activeAct, completedActs, scrollPerc } = useDossierProgress();

  useAudioBriefing(isAudioMode, activeAct, role, ACTS);

  useEffect(() => {
    if (reducedMotion) {
      setShowBoot(false);
      setWakeFlash(false);
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    setWakeFlash(true);
    const timeout = window.setTimeout(() => setWakeFlash(false), 600);
    return () => window.clearTimeout(timeout);
  }, [isWoke, reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen transition-all duration-1000 selection:bg-stamp-red selection:text-white relative",
        isWoke ? "bg-white text-ink-black grayscale-0 contrast-125" : "bg-substrate-paper text-ink-black",
        plainTextMode ? "font-sans" : "font-serif",
      )}
    >
      <Suspense fallback={null}>
        <AnimatePresence>{showBoot && <BootSequence onComplete={() => setShowBoot(false)} />}</AnimatePresence>
      </Suspense>

      {isProfileDebugEnabled() && <ProfileDebug />}

      <SignalToast />
      <TerrainOverlay />

      <AnimatePresence>
        {wakeFlash && !showBoot && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[999] pointer-events-none"
            style={{ backgroundColor: isWoke ? "white" : "var(--ink-black)" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="font-mono text-2xl font-black uppercase tracking-[0.5em]"
                style={{ color: isWoke ? "var(--ink-black)" : "var(--star-gold)" }}
              >
                {isWoke ? "WAKE" : "TRANCE"}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isWoke && (
        <div className="contents" aria-hidden="true">
          <div className="fixed inset-0 pointer-events-none opacity-[0.06] z-50 mix-blend-multiply paper-fiber-overlay" />
          <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-50 dust-overlay" />
        </div>
      )}

      {!plainTextMode && (
        <div className="fixed left-2 top-0 bottom-0 flex flex-col justify-around py-20 pointer-events-none z-[60] opacity-20" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-ink-black shadow-inner border border-white/5" />
          ))}
        </div>
      )}

      {!isFocusMode && !isFullRead && <StarRailNav acts={ACTS} activeAct={activeAct} scrollPerc={scrollPerc} reducedMotion={reducedMotion} />}

      {!isFocusMode && !isFullRead && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[90] hidden xl:flex flex-col gap-px" aria-label="Dossier act tabs">
          {ACTS.map((act, i) => (
            <button
              type="button"
              key={act.id}
              aria-label={`Navigate to ${act.code}: ${act.title}`}
              onClick={() => document.getElementById(`act-${act.id}`)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })}
              className={cn(
                "w-12 h-24 bg-tape-beige/80 hover:bg-tape-beige hover:w-16 transition-all border-y border-ink-black/5 flex items-center justify-center cursor-pointer overflow-hidden group shadow-[-4px_0px_10px_rgba(0,0,0,0.04)]",
                activeAct === i && "bg-star-gold/60 w-16 -translate-x-1",
              )}
            >
              <span className="-rotate-90 whitespace-nowrap font-mono text-[8px] font-black uppercase tracking-widest text-ink-black/40 group-hover:text-ink-black transition-colors">
                {act.code} // {act.title.substring(0, 10)}...
              </span>
            </button>
          ))}
        </div>
      )}

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] px-5 md:px-10 py-5 md:py-6 flex justify-between items-center transition-all duration-700 backdrop-blur-md",
          isFocusMode ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100",
          phase === "OPERATE" ? "bg-ink-black/90 text-white border-b border-stamp-red/30" : "bg-white/80 text-ink-black border-b border-ink-black/5 mix-blend-multiply",
        )}
      >
        <div className="flex items-center gap-6 min-w-0">
          <button
            type="button"
            className="font-mono font-black text-base md:text-xl tracking-normal flex items-center gap-3 uppercase cursor-pointer bg-transparent border-0 p-0 text-inherit"
            onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })}
            aria-label="Return to top of dossier"
          >
            <span className={cn("w-5 h-5 flex items-center justify-center text-white text-[8px]", phase === "OPERATE" ? "bg-star-gold" : "bg-stamp-red")}>!</span>
            <span className="truncate">HAND_OF_GOD</span>
          </button>
          <div
            className={cn(
              "hidden md:flex items-center gap-4 border-l pl-6 font-mono text-[9px] font-black uppercase tracking-[0.2em]",
              phase === "OPERATE" ? "border-white/10 text-stamp-red" : "border-ink-black/10 text-gray-500",
            )}
          >
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> CLEARANCE: {clearance}
            </span>
            <span>PHASE: {phase}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsPaletteOpen(true)}
          className={cn(
            "hidden lg:flex items-center gap-4 font-mono text-[9px] font-black uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer",
            phase === "OPERATE" ? "text-star-gold/50 hover:text-star-gold" : "text-gray-400 hover:text-ink-black",
          )}
          aria-label="Open command palette"
        >
          <Search className="w-3 h-3" />
          <span>CMD+K TO SEARCH_DOSSIER</span>
        </button>
      </header>

      <main
        className={cn(
          "max-w-7xl mx-auto px-5 md:px-24 pt-40 md:pt-48 pb-64 grid lg:grid-cols-[1fr_340px] gap-20 transition-all duration-1000",
          (isFocusMode || isFullRead) && "lg:grid-cols-1 max-w-4xl",
        )}
      >
        <div className="space-y-40 md:space-y-48">
          {isFullRead ? (
            <FullArticle />
          ) : (
            <>
          <HeroSection />

          {ACTS.slice(1).map((act, idx) => {
            const actIndex = idx + 1;
            return (
              <section key={act.id} id={`act-${act.id}`} data-act-idx={actIndex} className="scroll-mt-48">
                <TornEdge />
                <div className="max-w-4xl mx-auto space-y-12">
                  <div className="font-mono text-[11px] text-stamp-red font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 flex items-center gap-3">
                    <span className="w-3 h-px bg-stamp-red" /> PHASE {actIndex} // {phaseForActId(act.id)?.name ?? act.code}
                  </div>
                  <h2 className="text-[clamp(3rem,12vw,6rem)] md:text-8xl font-black mb-16 tracking-normal uppercase leading-[0.85] text-ink-black">
                    <SecureLine text={act.title.split(" ").slice(0, -1).join(" ") + " "} className="inline-block mr-4" />
                    <span className="text-star-gold italic underline decoration-stamp-red/30 decoration-wavy underline-offset-8">
                      {act.title.split(" ").slice(-1)[0]}
                    </span>
                  </h2>
                  <RoleLens actId={act.id} />
                  <AdversarialLens actId={act.id} />
                  {actIndex < ACTS.length - 1 && <ActBriefing idx={actIndex} />}
                  <ActRenderer
                    idx={actIndex}
                    completedActs={completedActs}
                    plainTextMode={plainTextMode}
                  />
                  <ActScenarios actId={act.id} />
                  <ActDeclassified actId={act.id} />
                  <AssessmentCheckpoint actId={act.id} actCode={act.code} actIndex={actIndex} />
                </div>
              </section>
            );
          })}
            </>
          )}

          <footer className="pt-32 pb-64 text-center space-y-8">
            <StrategicMirror />
            <div className="w-px h-24 bg-ink-black/20 mx-auto" />
            <div className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.3em] md:tracking-[0.5em]">
              END_OF_TRANSMISSION // HAND_OF_GOD // 2026
            </div>
          </footer>
        </div>

        {!isFocusMode && !isFullRead && (
          <aside className="hidden lg:flex justify-end xl:translate-x-6 2xl:translate-x-10 transition-transform duration-500">
            <SystemCard activeAct={activeAct} role={role} data={SYSTEM_CARD_STATES} />
          </aside>
        )}
      </main>

      <CommandDock
        onShare={() => {
          const posture = POSTURE_LABELS[dominantPosture(postureDistribution)].toUpperCase();
          setShareText(`[DOSSIER_SUMMARY] Active Act: AX-0${activeAct} // Phase: ${phase} // Role: ${role}. Posture: ${posture}.`);
          setIsShareOpen(true);
        }}
      />

      <SelectionTooltip
        onExecute={(text) => {
          setShareText(text);
          setIsShareOpen(true);
        }}
      />

      <Suspense fallback={null}>
        <ShareCardComposer text={shareText} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
        <CommandPalette
          isOpen={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
          acts={ACTS}
          onNavigate={(id) => document.getElementById(`act-${id}`)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })}
          onToggleWake={() => setIsWoke(!isWoke)}
          onToggleAudio={() => setIsAudioMode(!isAudioMode)}
          onToggleFocus={() => setIsFocusMode(!isFocusMode)}
          onToggleFullRead={() => setIsFullRead(!isFullRead)}
          onTogglePlainText={() => setPlainTextMode(!plainTextMode)}
          isWoke={isWoke}
          isAudioMode={isAudioMode}
          isFocusMode={isFocusMode}
          isFullRead={isFullRead}
        />
      </Suspense>
    </div>
  );
}

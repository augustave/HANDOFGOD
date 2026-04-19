import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock, Search } from "lucide-react";
import { ACTS, SYSTEM_CARD_STATES } from "./data/dossier";
import type { ExperienceMode, SecurityRole } from "./types";
import { useAudioBriefing } from "./hooks/use-audio-briefing";
import { useDossierProgress } from "./hooks/use-dossier-progress";
import { useReducedMotion } from "./hooks/use-reduced-motion";
import { useStableSession } from "./hooks/use-stable-session";
import { ActBriefing, ActRenderer } from "./components/act-renderer";
import { cn, SecureLine, TornEdge } from "./components/dossier-components";
import { CommandDock } from "./components/command-dock";
import { DossierProgress } from "./components/dossier-progress";
import { HeroSection } from "./components/hero-section";
import { SelectionTooltip } from "./components/selection-tooltip";
import { StarRailNav } from "./components/star-rail-nav";
import { SubliminalFeed } from "./components/subliminal-feed";
import { SystemCard } from "./components/system-card";

const BootSequence = lazy(() => import("./components/boot-sequence").then((mod) => ({ default: mod.BootSequence })));
const CommandPalette = lazy(() => import("./components/command-palette").then((mod) => ({ default: mod.CommandPalette })));
const ShareCardComposer = lazy(() => import("./components/share-card-composer").then((mod) => ({ default: mod.ShareCardComposer })));

export default function App() {
  const [plainTextMode, setPlainTextMode] = useState(false);
  const [isWoke, setIsWoke] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [mode, setMode] = useState<ExperienceMode>("READ");
  const [role, setRole] = useState<SecurityRole>("ANALYST");
  const [shareText, setShareText] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showBoot, setShowBoot] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [wakeFlash, setWakeFlash] = useState(false);
  const reducedMotion = useReducedMotion();
  const { activeAct, completedActs, scrollPerc } = useDossierProgress();
  const { sessionId, telemetry } = useStableSession();

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
          {!reducedMotion && (
            <div className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.03] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1 motion-safe:animate-scanline pointer-events-none" />
            </div>
          )}
        </div>
      )}

      {mode === "OPERATE" && <div className="grain-overlay" aria-hidden="true" />}

      {!plainTextMode && (
        <div className="fixed left-2 top-0 bottom-0 flex flex-col justify-around py-20 pointer-events-none z-[60] opacity-20" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-ink-black shadow-inner border border-white/5" />
          ))}
        </div>
      )}

      {!isFocusMode && <StarRailNav acts={ACTS} activeAct={activeAct} scrollPerc={scrollPerc} reducedMotion={reducedMotion} />}

      {!isFocusMode && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[90] hidden xl:flex flex-col gap-px" aria-label="Dossier act tabs">
          {ACTS.map((act, i) => (
            <button
              type="button"
              key={act.id}
              aria-label={`Navigate to ${act.code}: ${act.title}`}
              onClick={() => document.getElementById(`act-${act.id}`)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })}
              className={cn(
                "w-12 h-24 bg-tape-beige/80 hover:bg-tape-beige hover:w-16 transition-all border-y border-ink-black/5 flex items-center justify-center cursor-pointer overflow-hidden group shadow-[-4px_0px_10px_rgba(0,0,0,0.05)]",
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
          mode === "OPERATE" ? "bg-ink-black/90 text-white border-b border-stamp-red/30" : "bg-white/80 text-ink-black border-b border-ink-black/5 mix-blend-multiply",
        )}
      >
        <div className="flex items-center gap-6 min-w-0">
          <button
            type="button"
            className="font-mono font-black text-base md:text-xl tracking-normal flex items-center gap-3 uppercase cursor-pointer bg-transparent border-0 p-0 text-inherit"
            onClick={() => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" })}
            aria-label="Return to top of dossier"
          >
            <span className={cn("w-5 h-5 flex items-center justify-center text-white text-[8px]", mode === "OPERATE" ? "bg-star-gold" : "bg-stamp-red")}>!</span>
            <span className="truncate">HAND_OF_GOD</span>
          </button>
          <div
            className={cn(
              "hidden md:flex items-center gap-4 border-l pl-6 font-mono text-[9px] font-black uppercase tracking-[0.2em]",
              mode === "OPERATE" ? "border-white/10 text-stamp-red" : "border-ink-black/10 text-gray-500",
            )}
          >
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> SECURE_CORE
            </span>
            <span>20.01.2026</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsPaletteOpen(true)}
          className={cn(
            "hidden lg:flex items-center gap-4 font-mono text-[9px] font-black uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer",
            mode === "OPERATE" ? "text-star-gold/50 hover:text-star-gold" : "text-gray-400 hover:text-ink-black",
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
          isFocusMode && "lg:grid-cols-1 max-w-4xl",
        )}
      >
        <div className="space-y-40 md:space-y-48">
          <HeroSection />

          {ACTS.slice(1).map((act, idx) => {
            const actIndex = idx + 1;
            return (
              <section key={act.id} id={`act-${act.id}`} data-act-idx={actIndex} className="scroll-mt-48">
                <TornEdge />
                <div className="max-w-4xl mx-auto space-y-12">
                  <div className="font-mono text-[11px] text-stamp-red font-black uppercase tracking-[0.3em] md:tracking-[0.4em] mb-6 flex items-center gap-3">
                    <span className="w-3 h-px bg-stamp-red" /> {act.code} // {act.title}
                  </div>
                  <h2 className="text-[clamp(3rem,12vw,6rem)] md:text-8xl font-black mb-16 tracking-normal uppercase leading-[0.85] text-ink-black">
                    <SecureLine text={act.title.split(" ").slice(0, -1).join(" ") + " "} className="inline-block mr-4" />
                    <span className="text-star-gold italic underline decoration-stamp-red/30 decoration-wavy underline-offset-8">
                      {act.title.split(" ").slice(-1)[0]}
                    </span>
                  </h2>
                  {actIndex < ACTS.length - 1 && <ActBriefing idx={actIndex} />}
                  <ActRenderer
                    idx={actIndex}
                    completedActs={completedActs}
                    mode={mode}
                    role={role}
                    plainTextMode={plainTextMode}
                  />
                </div>
              </section>
            );
          })}

          <footer className="pt-32 pb-64 text-center space-y-8">
            <DossierProgress acts={ACTS} completedActs={completedActs} activeAct={activeAct} mode={mode} role={role} />
            <div className="w-px h-24 bg-ink-black/20 mx-auto" />
            <div className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.3em] md:tracking-[0.5em]">
              END_OF_TRANSMISSION // HAND_OF_GOD // 2026
            </div>
          </footer>
        </div>

        {!isFocusMode && (
          <aside className="hidden lg:flex justify-end xl:translate-x-6 2xl:translate-x-10 transition-transform duration-500">
            <SystemCard activeAct={activeAct} role={role} data={SYSTEM_CARD_STATES} reducedMotion={reducedMotion} sessionId={sessionId} />
          </aside>
        )}
      </main>

      <CommandDock
        plainTextMode={plainTextMode}
        setPlainTextMode={setPlainTextMode}
        isAudioMode={isAudioMode}
        setIsAudioMode={setIsAudioMode}
        isWoke={isWoke}
        setIsWoke={setIsWoke}
        isFocusMode={isFocusMode}
        setIsFocusMode={setIsFocusMode}
        mode={mode}
        setMode={setMode}
        role={role}
        setRole={setRole}
        onShare={() => {
          setShareText(`[DOSSIER_SUMMARY] Active Act: AX-0${activeAct} // Mode: ${mode} // Role: ${role}. Posture: SOVEREIGN.`);
          setIsShareOpen(true);
        }}
      />

      <SelectionTooltip
        onExecute={(text) => {
          setShareText(text);
          setIsShareOpen(true);
        }}
      />

      <SubliminalFeed isActive={!reducedMotion && (isAudioMode || mode === "OPERATE")} />

      <AnimatePresence>
        {mode === "OPERATE" && !reducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[150]"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-stamp-red/[0.02] mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-1 bg-stamp-red/20 motion-safe:animate-scanline-fast" />
            <div className="absolute bottom-10 left-10 space-y-2 font-mono text-[8px] font-black uppercase text-stamp-red/40 tracking-[0.2em]">
              <div>LAT_DATA: {telemetry.lat}</div>
              <div>LNG_DATA: {telemetry.lng}</div>
              <div>BUFFER: SYNCING...</div>
            </div>
            <div className="absolute top-1/2 right-10 -translate-y-1/2 flex flex-col gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="w-1 h-4 bg-stamp-red/20" />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <ShareCardComposer text={shareText} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
        <CommandPalette
          isOpen={isPaletteOpen}
          onClose={() => setIsPaletteOpen(false)}
          acts={ACTS}
          onNavigate={(id) => document.getElementById(`act-${id}`)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" })}
          onToggleMode={(m) => setMode(m)}
          onToggleWake={() => setIsWoke((prev) => !prev)}
          onToggleAudio={() => setIsAudioMode((prev) => !prev)}
          onToggleFocus={() => setIsFocusMode((prev) => !prev)}
          onTogglePlainText={() => setPlainTextMode((prev) => !prev)}
          currentMode={mode}
          isWoke={isWoke}
          isAudioMode={isAudioMode}
          isFocusMode={isFocusMode}
        />
      </Suspense>
    </div>
  );
}

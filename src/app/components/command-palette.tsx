import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Command, ArrowRight, Zap, Volume2, Shield, FileText, Monitor, Focus, Unlock, Lock, Crosshair, BookOpen, TerminalIcon } from "lucide-react";
import { cn } from "./dossier-components";
import type { DossierAct, ExperienceMode } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  acts: DossierAct[];
  onNavigate: (id: string) => void;
  onToggleMode?: (mode: ExperienceMode) => void;
  onToggleWake?: () => void;
  onToggleAudio?: () => void;
  onToggleFocus?: () => void;
  onTogglePlainText?: () => void;
  currentMode?: ExperienceMode;
  isWoke?: boolean;
  isAudioMode?: boolean;
  isFocusMode?: boolean;
}

type PaletteActItem = DossierAct & { type: "act" };
type PaletteActionItem = {
  type: "action";
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  shortcut: string;
  active: boolean;
  action: () => void;
};

type PaletteItem = PaletteActItem | PaletteActionItem;

export function CommandPalette({
  isOpen,
  onClose,
  acts,
  onNavigate,
  onToggleMode,
  onToggleWake,
  onToggleAudio,
  onToggleFocus,
  onTogglePlainText,
  currentMode = "READ",
  isWoke = false,
  isAudioMode = false,
  isFocusMode = false,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const filteredActs = acts.filter(act =>
    act.title.toLowerCase().includes(query.toLowerCase()) ||
    act.code.toLowerCase().includes(query.toLowerCase()) ||
    act.id.toLowerCase().includes(query.toLowerCase())
  );

  const actions = [
    {
      id: "mode-read",
      label: "Switch to READ Mode",
      desc: "Full immersive reading experience",
      icon: <BookOpen className="w-4 h-4" />,
      shortcut: "R",
      active: currentMode === "READ",
      action: () => onToggleMode?.("READ"),
    },
    {
      id: "mode-brief",
      label: "Switch to BRIEF Mode",
      desc: "Condensed intelligence summary",
      icon: <FileText className="w-4 h-4" />,
      shortcut: "B",
      active: currentMode === "BRIEF",
      action: () => onToggleMode?.("BRIEF"),
    },
    {
      id: "mode-operate",
      label: "Switch to OPERATE Mode",
      desc: "Reveal redacted content on hover",
      icon: <Zap className="w-4 h-4" />,
      shortcut: "O",
      active: currentMode === "OPERATE",
      action: () => onToggleMode?.("OPERATE"),
    },
    {
      id: "toggle-wake",
      label: isWoke ? "Enter TRANCE State" : "Enter WAKE State",
      desc: isWoke ? "Restore dossier aesthetics" : "Strip visual interference, enter clarity",
      icon: isWoke ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />,
      shortcut: "W",
      active: isWoke,
      action: () => onToggleWake?.(),
    },
    {
      id: "toggle-audio",
      label: isAudioMode ? "Disable Audio Narration" : "Enable Audio Narration",
      desc: isAudioMode ? "Silence the briefing officer" : "Activate voice briefing + subliminal feed",
      icon: <Volume2 className="w-4 h-4" />,
      shortcut: "A",
      active: isAudioMode,
      action: () => onToggleAudio?.(),
    },
    {
      id: "toggle-focus",
      label: isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode",
      desc: isFocusMode ? "Restore sidebar and nav" : "Hide nav and system card",
      icon: <Focus className="w-4 h-4" />,
      shortcut: "F",
      active: isFocusMode,
      action: () => onToggleFocus?.(),
    },
    {
      id: "toggle-plaintext",
      label: "Toggle Plain Text Mode",
      desc: "Switch between dossier aesthetics and plain text",
      icon: <Monitor className="w-4 h-4" />,
      shortcut: "P",
      active: false,
      action: () => onTogglePlainText?.(),
    },
    {
      id: "scroll-top",
      label: "Return to Top",
      desc: "Scroll to beginning of dossier",
      icon: <Crosshair className="w-4 h-4" />,
      shortcut: "T",
      active: false,
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
  ];

  const filteredActions = query
    ? actions.filter(a =>
        a.label.toLowerCase().includes(query.toLowerCase()) ||
        a.desc.toLowerCase().includes(query.toLowerCase())
      )
    : actions;

  const allItems: PaletteItem[] = useMemo(() => [
    ...filteredActs.map(act => ({ type: "act" as const, ...act })),
    ...filteredActions.map(action => ({ type: "action" as const, ...action })),
  ], [filteredActs, filteredActions]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  const executeItem = useCallback((index: number) => {
    const item = allItems[index];
    if (!item) return;
    if (item.type === "act") {
      onNavigate(item.id);
      onClose();
    } else {
      item.action();
      onClose();
    }
  }, [allItems, onNavigate, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, allItems.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        executeItem(selectedIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, selectedIndex, allItems.length, executeItem]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedEl instanceof HTMLElement && selectedEl.scrollIntoView) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  let itemIndex = -1;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[1000] flex items-start justify-center pt-24 md:pt-32 px-4 md:px-0"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-ink-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-2xl bg-substrate-paper border-4 border-ink-black shadow-[24px_24px_0px_rgba(0,0,0,0.5)] overflow-hidden relative z-10"
        >
          {/* Search input */}
          <div className="p-6 border-b-4 border-ink-black flex items-center gap-4 bg-white">
            <Search className="w-6 h-6 text-gray-400" />
            <input
              ref={inputRef}
              aria-label="Search dossier commands"
              className="flex-1 bg-transparent border-none outline-none font-mono text-lg font-black uppercase tracking-tight placeholder:text-gray-300"
              placeholder="SEARCH_DOSSIER..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-1 font-mono text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-1">
              <Command className="w-2 h-2" /> <span>K</span>
            </div>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
            {/* Acts */}
            {filteredActs.length > 0 && (
              <div className="space-y-2">
                <div className="font-mono text-[9px] font-black text-stamp-red uppercase tracking-[0.4em] px-4">DECLASS_FILES</div>
                <div className="grid gap-0.5">
                  {filteredActs.map((act) => {
                    itemIndex++;
                    const idx = itemIndex;
                    return (
                      <button
                        type="button"
                        key={act.id}
                        data-index={idx}
                        onClick={() => executeItem(idx)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-full text-left p-4 group flex items-center justify-between transition-all duration-150 cursor-pointer",
                          selectedIndex === idx ? "bg-ink-black text-white" : "hover:bg-ink-black/5"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "font-mono text-[10px] transition-opacity",
                            selectedIndex === idx ? "opacity-100 text-star-gold" : "opacity-40"
                          )}>
                            {act.code}
                          </div>
                          <div className="font-black uppercase tracking-tight">{act.title}</div>
                        </div>
                        <ArrowRight className={cn(
                          "w-4 h-4 transition-all",
                          selectedIndex === idx ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                        )} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            {filteredActions.length > 0 && (
              <div className="space-y-2">
                <div className="font-mono text-[9px] font-black text-dossier-blue uppercase tracking-[0.4em] px-4">TACTICAL_ACTIONS</div>
                <div className="grid gap-0.5">
                  {filteredActions.map((action) => {
                    itemIndex++;
                    const idx = itemIndex;
                    return (
                      <button
                        type="button"
                        key={action.id}
                        data-index={idx}
                        onClick={() => executeItem(idx)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-full text-left p-4 group flex items-center justify-between transition-all duration-150 cursor-pointer",
                          selectedIndex === idx ? "bg-dossier-blue text-white" : "hover:bg-dossier-blue/5"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "transition-colors",
                            selectedIndex === idx ? "text-white" : "text-gray-400",
                            action.active && selectedIndex !== idx && "text-star-gold"
                          )}>
                            {action.icon}
                          </div>
                          <div>
                            <div className="font-black uppercase tracking-tight text-sm flex items-center gap-2">
                              {action.label}
                              {action.active && (
                                <span className={cn(
                                  "font-mono text-[7px] px-1.5 py-0.5 border rounded-sm",
                                  selectedIndex === idx ? "border-white/40 text-white" : "border-star-gold text-star-gold"
                                )}>
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <div className={cn(
                              "font-mono text-[9px] mt-0.5 transition-colors",
                              selectedIndex === idx ? "text-white/60" : "text-gray-400"
                            )}>
                              {action.desc}
                            </div>
                          </div>
                        </div>
                        <div className={cn(
                          "font-mono text-[9px] font-black px-1.5 py-0.5 border border-current transition-opacity",
                          selectedIndex === idx ? "opacity-100" : "opacity-30"
                        )}>
                          {action.shortcut}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty state */}
            {allItems.length === 0 && (
              <div className="text-center py-16 space-y-4">
                <TerminalIcon className="w-8 h-8 text-gray-300 mx-auto" />
                <div className="font-mono text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  NO_RESULTS_FOUND // QUERY_REJECTED
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-ink-black/5 border-t border-ink-black/10 flex justify-between items-center font-mono text-[8px] font-bold text-gray-400">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 border border-gray-400 rounded-xs text-center text-[6px] leading-3">↑</span>
                <span className="inline-block w-3 h-3 border border-gray-400 rounded-xs text-center text-[6px] leading-3">↓</span>
                NAVIGATE
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-4 h-3 border border-gray-400 rounded-xs text-center text-[6px] leading-3">↵</span>
                SELECT
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-5 h-3 border border-gray-400 rounded-xs text-center text-[5px] leading-3">ESC</span>
                CLOSE
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-2 h-2" /> <span>ENCRYPTED_QUERY_MODE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

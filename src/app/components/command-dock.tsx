import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Volume2, VolumeX, Lock, Unlock, FileText, Share2, Download, X, Menu } from "lucide-react";
import { cn } from "./dossier-components";
import type { ExperienceMode, SecurityRole } from "../types";

interface CommandDockProps {
  plainTextMode: boolean;
  setPlainTextMode: (v: boolean) => void;
  isAudioMode: boolean;
  setIsAudioMode: (v: boolean) => void;
  isWoke: boolean;
  setIsWoke: (v: boolean) => void;
  isFocusMode: boolean;
  setIsFocusMode: (v: boolean) => void;
  mode: ExperienceMode;
  setMode: (m: ExperienceMode) => void;
  role: SecurityRole;
  setRole: (r: SecurityRole) => void;
  onShare?: () => void;
}

const modes: ExperienceMode[] = ["READ", "BRIEF", "OPERATE"];
const roles: SecurityRole[] = ["ANALYST", "OPERATOR", "COMMANDER"];

function isSecurityRole(value: string): value is SecurityRole {
  return roles.includes(value as SecurityRole);
}

export const CommandDock = ({
  plainTextMode,
  setPlainTextMode,
  isAudioMode,
  setIsAudioMode,
  isWoke,
  setIsWoke,
  isFocusMode,
  setIsFocusMode,
  mode,
  setMode,
  role,
  setRole,
  onShare
}: CommandDockProps) => {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return createPortal(
    <>
      {/* Desktop Dock */}
      <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 bg-ink-black p-1.5 shadow-2xl border border-white/10 rounded-sm"
        style={{ zIndex: 950 }}
      >
        <div className="flex items-center bg-white/5 px-3 py-1.5 gap-4 border-r border-white/10">
          <select
            aria-label="Security role"
            value={role}
            onChange={(e) => {
              if (isSecurityRole(e.target.value)) {
                setRole(e.target.value);
              }
            }}
            className="bg-transparent text-white font-mono text-[9px] font-black uppercase tracking-widest border-none outline-none cursor-pointer hover:text-star-gold transition-colors"
          >
            <option value="ANALYST">Role: ANALYST</option>
            <option value="OPERATOR">Role: OPERATOR</option>
            <option value="COMMANDER">Role: COMMANDER</option>
          </select>
        </div>
        <div className="flex items-center bg-white/5 px-3 py-1.5 gap-4 border-r border-white/10">
          {modes.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn(
                "font-mono text-[9px] font-black tracking-widest px-2 py-1 transition-colors uppercase cursor-pointer",
                mode === m ? "text-star-gold" : "text-gray-500 hover:text-white"
              )}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-4">
          <button
            type="button"
            onClick={() => setPlainTextMode(!plainTextMode)}
            className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
            title="Toggle Plain Text"
            aria-label="Toggle plain text mode"
            aria-pressed={plainTextMode}
          >
            {plainTextMode ? <Eye className="w-4 h-4 text-star-gold" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsAudioMode(!isAudioMode)}
            className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
            title="Toggle Audio"
            aria-label="Toggle audio narration"
            aria-pressed={isAudioMode}
          >
            {isAudioMode ? <Volume2 className="w-4 h-4 text-star-gold" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsFocusMode(!isFocusMode)}
            className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
            title="Toggle Focus Mode"
            aria-label="Toggle focus mode"
            aria-pressed={isFocusMode}
          >
            <FileText className={cn("w-4 h-4", isFocusMode && "text-star-gold")} />
          </button>
          <button
            type="button"
            onClick={() => setIsWoke(!isWoke)}
            aria-pressed={isWoke}
            className={cn(
              "flex items-center gap-2 px-3 py-1 font-mono text-[9px] font-black transition-all uppercase tracking-widest cursor-pointer",
              isWoke ? "bg-star-gold text-ink-black" : "text-gray-500 hover:text-white"
            )}
          >
            {isWoke ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
            {isWoke ? "WAKE" : "TRANCE"}
          </button>
        </div>

        <div className="flex items-center border-l border-white/10 pl-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
            title="Export Brief"
            aria-label="Export printable brief"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onShare}
            className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
            title="Share Card"
            aria-label="Open share card composer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Dock */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden" style={{ zIndex: 950 }}>
        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-ink-black border-t border-white/10 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                {/* Role selector */}
                <div className="space-y-2">
                  <div className="font-mono text-[8px] font-black text-gray-500 uppercase tracking-widest">ROLE</div>
                  <div className="flex gap-2">
                    {roles.map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => setRole(r)}
                        aria-pressed={role === r}
                        className={cn(
                          "flex-1 py-2 font-mono text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer border",
                          role === r ? "bg-star-gold text-ink-black border-star-gold" : "text-gray-500 border-white/10 hover:text-white"
                        )}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode selector */}
                <div className="space-y-2">
                  <div className="font-mono text-[8px] font-black text-gray-500 uppercase tracking-widest">MODE</div>
                  <div className="flex gap-2">
                    {modes.map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setMode(m)}
                        aria-pressed={mode === m}
                        className={cn(
                          "flex-1 py-2 font-mono text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer border",
                          mode === m ? "bg-star-gold text-ink-black border-star-gold" : "text-gray-500 border-white/10 hover:text-white"
                        )}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles grid */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlainTextMode(!plainTextMode)}
                    aria-pressed={plainTextMode}
                    className={cn(
                      "flex items-center gap-2 p-3 font-mono text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer border",
                      plainTextMode ? "bg-star-gold/20 text-star-gold border-star-gold/30" : "text-gray-500 border-white/10"
                    )}
                  >
                    {plainTextMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    PLAIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAudioMode(!isAudioMode)}
                    aria-pressed={isAudioMode}
                    className={cn(
                      "flex items-center gap-2 p-3 font-mono text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer border",
                      isAudioMode ? "bg-star-gold/20 text-star-gold border-star-gold/30" : "text-gray-500 border-white/10"
                    )}
                  >
                    {isAudioMode ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    AUDIO
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFocusMode(!isFocusMode)}
                    aria-pressed={isFocusMode}
                    className={cn(
                      "flex items-center gap-2 p-3 font-mono text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer border",
                      isFocusMode ? "bg-star-gold/20 text-star-gold border-star-gold/30" : "text-gray-500 border-white/10"
                    )}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    FOCUS
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsWoke(!isWoke)}
                    aria-pressed={isWoke}
                    className={cn(
                      "flex items-center gap-2 p-3 font-mono text-[9px] font-black uppercase tracking-widest transition-colors cursor-pointer border",
                      isWoke ? "bg-star-gold text-ink-black border-star-gold" : "text-gray-500 border-white/10"
                    )}
                  >
                    {isWoke ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {isWoke ? "WAKE" : "TRANCE"}
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-2 p-3 font-mono text-[9px] font-black text-gray-500 uppercase tracking-widest border border-white/10 cursor-pointer hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" /> EXPORT
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onShare?.();
                      setMobileExpanded(false);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 p-3 font-mono text-[9px] font-black text-gray-500 uppercase tracking-widest border border-white/10 cursor-pointer hover:text-white transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" /> SHARE
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile toggle bar */}
        <div className="bg-ink-black border-t border-white/10 p-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="font-mono text-[9px] font-black text-white uppercase tracking-widest">
              {mode}
            </div>
            <div className="w-px h-3 bg-white/20" />
            <div className="font-mono text-[9px] font-black text-gray-500 uppercase tracking-widest">
              {role}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsWoke(!isWoke)}
              aria-pressed={isWoke}
              className={cn(
                "font-mono text-[8px] font-black uppercase tracking-widest px-2 py-1 cursor-pointer transition-colors",
                isWoke ? "bg-star-gold text-ink-black" : "text-gray-500"
              )}
            >
              {isWoke ? "WAKE" : "TRANCE"}
            </button>
            <button
              type="button"
              onClick={() => setMobileExpanded(!mobileExpanded)}
              aria-label={mobileExpanded ? "Close command dock" : "Open command dock"}
              aria-expanded={mobileExpanded}
              className="p-1.5 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              {mobileExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

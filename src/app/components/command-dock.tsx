import React from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Volume2, VolumeX, Lock, Unlock, FileText, Share2, Download } from "lucide-react";
import { cn } from "@/app/components/dossier-components";

interface CommandDockProps {
  plainTextMode: boolean;
  setPlainTextMode: (v: boolean) => void;
  isAudioMode: boolean;
  setIsAudioMode: (v: boolean) => void;
  isWoke: boolean;
  setIsWoke: (v: boolean) => void;
  isFocusMode: boolean;
  setIsFocusMode: (v: boolean) => void;
  mode: "READ" | "BRIEF" | "OPERATE";
  setMode: (m: "READ" | "BRIEF" | "OPERATE") => void;
  role: "ANALYST" | "OPERATOR" | "COMMANDER";
  setRole: (r: "ANALYST" | "OPERATOR" | "COMMANDER") => void;
  onShare?: () => void;
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
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 bg-ink-black p-1.5 shadow-2xl border border-white/10 rounded-sm">
      <div className="flex items-center bg-white/5 px-3 py-1.5 gap-4 border-r border-white/10">
        <select 
          value={role} 
          onChange={(e) => setRole(e.target.value as any)}
          className="bg-transparent text-white font-mono text-[9px] font-black uppercase tracking-widest border-none outline-none cursor-pointer hover:text-star-gold transition-colors"
        >
          <option value="ANALYST">Role: ANALYST</option>
          <option value="OPERATOR">Role: OPERATOR</option>
          <option value="COMMANDER">Role: COMMANDER</option>
        </select>
      </div>
      <div className="flex items-center bg-white/5 px-3 py-1.5 gap-4 border-r border-white/10">
        <button 
          onClick={() => setMode("READ")}
          className={cn(
            "font-mono text-[9px] font-black tracking-widest px-2 py-1 transition-colors uppercase cursor-pointer",
            mode === "READ" ? "text-star-gold" : "text-gray-500 hover:text-white"
          )}
        >
          READ
        </button>
        <button 
          onClick={() => setMode("BRIEF")}
          className={cn(
            "font-mono text-[9px] font-black tracking-widest px-2 py-1 transition-colors uppercase cursor-pointer",
            mode === "BRIEF" ? "text-star-gold" : "text-gray-500 hover:text-white"
          )}
        >
          BRIEF
        </button>
        <button 
          onClick={() => setMode("OPERATE")}
          className={cn(
            "font-mono text-[9px] font-black tracking-widest px-2 py-1 transition-colors uppercase cursor-pointer",
            mode === "OPERATE" ? "text-star-gold" : "text-gray-500 hover:text-white"
          )}
        >
          OPERATE
        </button>
      </div>

      <div className="flex items-center gap-2 px-4">
        <button 
          onClick={() => setPlainTextMode(!plainTextMode)}
          className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
          title="Toggle Plain Text"
        >
          {plainTextMode ? <Eye className="w-4 h-4 text-star-gold" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => setIsAudioMode(!isAudioMode)}
          className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
          title="Toggle Audio"
        >
          {isAudioMode ? <Volume2 className="w-4 h-4 text-star-gold" /> : <VolumeX className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => setIsFocusMode(!isFocusMode)}
          className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer"
          title="Toggle Focus Mode"
        >
          {isFocusMode ? <FileText className="w-4 h-4 text-star-gold" /> : <FileText className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => setIsWoke(!isWoke)}
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
          onClick={() => window.print()}
          className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer" 
          title="Export Brief"
        >
          <Download className="w-4 h-4" />
        </button>
        <button 
          onClick={onShare}
          className="p-2 text-gray-500 hover:text-white transition-colors cursor-pointer" 
          title="Share Card"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Command, ArrowRight, Zap, Eye, Volume2, Shield } from "lucide-react";
import { cn } from "@/app/components/dossier-components";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  acts: { id: string; title: string; code: string }[];
  onNavigate: (id: string) => void;
}

export function CommandPalette({ isOpen, onClose, acts, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : null; // Toggle logic is handled in App.tsx but this helps
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const filteredActs = acts.filter(act => 
    act.title.toLowerCase().includes(query.toLowerCase()) || 
    act.code.toLowerCase().includes(query.toLowerCase())
  );

  const actions = [
    { id: "toggle-operate", label: "Toggle Operational Mode", icon: <Zap className="w-4 h-4" />, shortcut: "O" },
    { id: "toggle-woke", label: "Toggle Wake State", icon: <Eye className="w-4 h-4" />, shortcut: "W" },
    { id: "toggle-audio", label: "Toggle Audio Narration", icon: <Volume2 className="w-4 h-4" />, shortcut: "A" },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-32 px-4 md:px-0">
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
          <div className="p-6 border-b-4 border-ink-black flex items-center gap-4 bg-white">
            <Search className="w-6 h-6 text-gray-400" />
            <input 
              autoFocus
              className="flex-1 bg-transparent border-none outline-none font-mono text-lg font-black uppercase tracking-tight placeholder:text-gray-300"
              placeholder="SEARCH_DOSSIER..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex items-center gap-1 font-mono text-[9px] font-black text-gray-400 bg-gray-100 px-2 py-1">
              <Command className="w-2 h-2" /> <span>K</span>
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-8">
            <div className="space-y-2">
              <div className="font-mono text-[9px] font-black text-stamp-red uppercase tracking-[0.4em] px-4">DECLASS_FILES</div>
              <div className="grid gap-1">
                {filteredActs.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => {
                      onNavigate(act.id);
                      onClose();
                    }}
                    className="w-full text-left p-4 hover:bg-ink-black hover:text-white group flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-mono text-[10px] opacity-40 group-hover:opacity-100">{act.code}</div>
                      <div className="font-black uppercase tracking-tight">{act.title}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-mono text-[9px] font-black text-dossier-blue uppercase tracking-[0.4em] px-4">TACTICAL_ACTIONS</div>
              <div className="grid gap-1">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    className="w-full text-left p-4 hover:bg-dossier-blue hover:text-white group flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-gray-400 group-hover:text-white">{action.icon}</div>
                      <div className="font-black uppercase tracking-tight text-sm">{action.label}</div>
                    </div>
                    <div className="font-mono text-[9px] font-black px-1.5 py-0.5 border border-current opacity-30 group-hover:opacity-100">
                      {action.shortcut}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-ink-black/5 border-t border-ink-black/10 flex justify-between items-center font-mono text-[8px] font-bold text-gray-400">
            <div className="flex gap-4">
              <span>↑↓ NAVIGATE</span>
              <span>↵ SELECT</span>
              <span>ESC CLOSE</span>
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

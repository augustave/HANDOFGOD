import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Maximize2, Minimize2, FileText, ShieldAlert, Zap } from "lucide-react";
import { cn } from "./dossier-components";

interface ExhibitProps {
  id: string;
  title: string;
  source: string;
  threat: string;
  implication: string;
  metadata?: string;
}

export const ExhibitCard = ({ id, title, source, threat, implication, metadata }: ExhibitProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"source" | "threat" | "implication">("source");

  const tabs = [
    { id: "source", label: "SOURCE", icon: FileText },
    { id: "threat", label: "THREAT", icon: ShieldAlert },
    { id: "implication", label: "IMPLICATION", icon: Zap },
  ] as const;

  return (
    <div className="my-12 border-2 border-ink-black/20 bg-white shadow-[8px_8px_0px_rgba(0,0,0,0.05)] overflow-hidden">
      <button
        type="button"
        className="flex items-center justify-between px-6 py-4 bg-ink-black text-white cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className="font-mono text-[10px] bg-stamp-red px-2 py-0.5 font-black">EXHIBIT_{id}</div>
          <h4 className="font-mono text-xs font-black uppercase tracking-[0.2em] group-hover:text-star-gold transition-colors">{title}</h4>
        </div>
        {isOpen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-0 border-t border-ink-black/10">
              <div className="flex border-b border-ink-black/10">
                {tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-3 font-mono text-[9px] font-black tracking-widest transition-all",
                      activeTab === tab.id 
                        ? "bg-substrate-paper text-ink-black border-b-2 border-star-gold" 
                        : "bg-white text-gray-400 hover:text-ink-black hover:bg-substrate-paper/50"
                    )}
                  >
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-8 bg-substrate-paper/30 min-h-[200px]">
                <div className="font-mono text-[10px] text-gray-400 mb-4 uppercase tracking-widest">
                  {metadata || `CLASSIFICATION: INTERNAL // DATE: ${new Date().toLocaleDateString()}`}
                </div>
                <div className="font-serif text-lg leading-relaxed text-ink-black/80 italic">
                  {activeTab === "source" && source}
                  {activeTab === "threat" && threat}
                  {activeTab === "implication" && implication}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

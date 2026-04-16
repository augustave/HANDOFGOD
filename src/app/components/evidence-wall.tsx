import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Info, Link as LinkIcon, X } from "lucide-react";
import { cn } from "./dossier-components";

interface EvidenceItem {
  id: string;
  type: "document" | "photo" | "memo";
  title: string;
  description: string;
  x: number;
  y: number;
  rotation: number;
}

const evidence: EvidenceItem[] = [
  { id: "1", type: "photo", title: "Public Trust 01", description: "Social contract visual mapping. Note the fraying edges in the digital sector.", x: 10, y: 15, rotation: -5 },
  { id: "2", type: "document", title: "Memo: AX-42", description: "Internal discussion regarding the 'Myth of Morality' as a control vector.", x: 45, y: 10, rotation: 3 },
  { id: "3", type: "memo", title: "Redacted Protocol", description: "The protocol used to mask structural fragility in early 2020s tech stacks.", x: 70, y: 25, rotation: -2 },
  { id: "4", type: "photo", title: "The Hegemon Mask", description: "Visual evidence of 'neutral' platforms exerting narrative force.", x: 25, y: 50, rotation: 8 },
  { id: "5", type: "document", title: "Legibility Report", description: "How opaque systems manufacture consent through complex UI.", x: 60, y: 60, rotation: -4 },
];

export function EvidenceWall() {
  const [selected, setSelected] = useState<EvidenceItem | null>(null);

  useEffect(() => {
    if (!selected) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <div className="relative w-full h-[600px] bg-ink-black/5 border-4 border-ink-black/10 overflow-hidden my-12 group">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(var(--ink-black) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
      
      {/* String Connections (Conceptual) */}
      <svg className="absolute inset-0 pointer-events-none opacity-20">
        <line x1="15%" y1="25%" x2="50%" y2="20%" stroke="var(--stamp-red)" strokeWidth="1" />
        <line x1="50%" y1="20%" x2="75%" y2="35%" stroke="var(--stamp-red)" strokeWidth="1" />
        <line x1="15%" y1="25%" x2="30%" y2="60%" stroke="var(--stamp-red)" strokeWidth="1" />
        <line x1="75%" y1="35%" x2="65%" y2="70%" stroke="var(--stamp-red)" strokeWidth="1" />
      </svg>

      {evidence.map((item) => (
        <motion.button
          type="button"
          key={item.id}
          aria-label={`Open evidence file ${item.id}: ${item.title}`}
          className={cn(
            "absolute cursor-pointer hover:z-50 transition-shadow text-left",
            item.type === "photo" ? "bg-white p-2 shadow-xl" : "bg-tape-beige/80 p-4 shadow-lg border border-ink-black/10"
          )}
          style={{ 
            left: `${item.x}%`, 
            top: `${item.y}%`, 
            rotate: `${item.rotation}deg`,
            width: item.type === "photo" ? "180px" : "200px"
          }}
          whileHover={{ scale: 1.05, rotate: 0 }}
          onClick={() => setSelected(item)}
        >
          {item.type === "photo" ? (
            <div className="aspect-square bg-gray-200 mb-2 overflow-hidden flex items-center justify-center relative">
               <div className="absolute inset-0 bg-ink-black/10" />
               <Search className="w-6 h-6 text-white/50" />
            </div>
          ) : (
            <div className="border-b border-ink-black/20 mb-2 pb-1 flex items-center justify-between">
              <span className="font-mono text-[8px] font-black uppercase text-gray-500">{item.type}</span>
              <Info className="w-3 h-3 text-gray-400" />
            </div>
          )}
          <h4 className="font-mono text-[10px] font-black uppercase tracking-tight truncate">{item.title}</h4>
        </motion.button>
      ))}

      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-12"
            role="dialog"
            aria-modal="true"
            aria-label={`Evidence file ${selected.id}`}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-substrate-paper max-w-lg w-full p-10 relative border-4 border-ink-black"
            >
              <button 
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 hover:bg-ink-black/5 rounded-full"
                aria-label="Close evidence file"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="font-mono text-xs text-stamp-red font-black mb-6 uppercase tracking-widest flex items-center gap-2">
                <LinkIcon className="w-4 h-4" /> EVIDENCE_FILE_{selected.id}
              </div>
              
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-6">{selected.title}</h3>
              <p className="font-serif text-lg italic leading-relaxed text-ink-black/80 mb-8">
                {selected.description}
              </p>
              
              <div className="pt-6 border-t border-ink-black/10 flex justify-between items-center">
                <div className="font-mono text-[10px] font-bold text-gray-400">STATUS: DECLASSIFIED</div>
                <button 
                  type="button"
                  onClick={() => setSelected(null)}
                  className="font-mono text-[10px] font-black uppercase tracking-widest bg-ink-black text-white px-4 py-2"
                >
                  CLOSE_ENTRY
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-ink-black/30 pointer-events-none">
        THEATRE_OF_EVIDENCE // VISUAL_MAP_01
      </div>
    </div>
  );
}

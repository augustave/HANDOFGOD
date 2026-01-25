import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Shield, Eye, Zap, CheckCircle2, ArrowRight, Lock } from "lucide-react";
import { cn } from "@/app/components/dossier-components";

interface Posture {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const postures: Posture[] = [
  {
    id: "watcher",
    code: "POSTURE_01",
    title: "The Watcher",
    description: "Monitor the drift without interference. Map the decay before it reaches the core. Focus on data collection and pattern recognition.",
    icon: <Eye className="w-8 h-8" />,
    color: "var(--stamp-red)"
  },
  {
    id: "architect",
    code: "POSTURE_02",
    title: "The Architect",
    description: "Build parallel stacks. Ensure sovereignty through technical redundancy and literacy. Create resilient systems that can survive network failure.",
    icon: <Zap className="w-8 h-8" />,
    color: "var(--star-gold)"
  },
  {
    id: "sovereign",
    code: "POSTURE_03",
    title: "The Sovereign",
    description: "Operate out-of-band. Lead the exit from the trance through conscious action. Establish independent authority over your digital destiny.",
    icon: <Shield className="w-8 h-8" />,
    color: "var(--dossier-blue)"
  }
];

export function PostureTerminal() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [signature, setSignature] = useState("");

  const selectedPosture = postures.find(p => p.id === selectedId);

  return (
    <div className="w-full max-w-5xl mx-auto my-24 border-4 border-ink-black bg-white shadow-[20px_20px_0px_var(--ink-black)] overflow-hidden">
      <div className="bg-ink-black text-white p-4 font-mono text-[10px] flex justify-between items-center px-8">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-star-gold" />
          <span className="font-black uppercase tracking-[0.2em]">OPERATIONAL_POSTURE_TERMINAL_V2.6</span>
        </div>
        <div className="flex items-center gap-4 opacity-50">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> ENCRYPTED</span>
          <span>SESS_ID: 9942-AX</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_350px]">
        <div className="p-12 border-r-4 border-ink-black/5">
          <h3 className="text-4xl font-black uppercase tracking-tighter mb-8">Select Your Posture</h3>
          
          <div className="grid gap-6">
            {postures.map((posture) => (
              <motion.button
                key={posture.id}
                onClick={() => !isSigned && setSelectedId(posture.id)}
                className={cn(
                  "w-full text-left p-6 border-2 transition-all relative overflow-hidden group",
                  selectedId === posture.id ? "border-ink-black bg-ink-black/5" : "border-ink-black/10 hover:border-ink-black/30 bg-transparent",
                  isSigned && selectedId !== posture.id && "opacity-30 grayscale pointer-events-none"
                )}
                whileHover={!isSigned ? { x: 10 } : {}}
              >
                <div className="flex items-start gap-6 relative z-10">
                  <div className={cn(
                    "w-16 h-16 flex items-center justify-center transition-colors",
                    selectedId === posture.id ? "text-ink-black" : "text-gray-300 group-hover:text-gray-500"
                  )}>
                    {posture.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{posture.code}</div>
                    <h4 className="text-xl font-black uppercase tracking-tight mb-2">{posture.title}</h4>
                    <p className="font-serif text-sm opacity-60 italic leading-relaxed">{posture.description}</p>
                  </div>
                </div>
                {selectedId === posture.id && (
                  <motion.div 
                    layoutId="selection-glow"
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/5"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-substrate-paper/50 p-12 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!selectedId ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-16 h-16 bg-ink-black/5 border-2 border-dashed border-ink-black/20 rounded-full mx-auto flex items-center justify-center">
                  <ArrowRight className="w-6 h-6 text-ink-black/20" />
                </div>
                <p className="font-mono text-[10px] font-black uppercase tracking-widest text-gray-400">Waiting for selection...</p>
              </motion.div>
            ) : !isSigned ? (
              <motion.div 
                key="signing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-black uppercase tracking-widest text-ink-black">Final Confirmation</label>
                  <p className="text-sm font-serif italic text-gray-600">Enter your operator callsign to commit to this posture. This action cannot be undone.</p>
                </div>
                
                <div className="relative">
                  <input 
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="ENTER_CALLSIGN..."
                    className="w-full bg-white border-2 border-ink-black p-4 font-mono text-sm uppercase font-black focus:outline-none focus:ring-4 focus:ring-star-gold/20"
                  />
                </div>

                <button 
                  disabled={!signature.trim()}
                  onClick={() => setIsSigned(true)}
                  className="w-full py-6 bg-stamp-red text-white font-mono font-black text-xs uppercase tracking-[0.4em] shadow-[8px_8px_0px_var(--ink-black)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                >
                  COMMIT_TO_POSTURE
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="completed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8"
              >
                <div className="w-24 h-24 bg-stamp-red text-white rounded-full mx-auto flex items-center justify-center shadow-xl">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black uppercase tracking-tighter">Mission Active</h4>
                  <div className="font-mono text-[10px] font-black text-stamp-red bg-stamp-red/10 py-1 px-4 inline-block rounded-full">
                    OPERATOR: {signature.toUpperCase()}
                  </div>
                </div>
                <div className="p-4 border-2 border-dashed border-ink-black/20 font-serif text-xs italic opacity-60">
                  "The trance is broken. Sovereignty established. Proceed to deployment."
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="bg-ink-black/5 p-4 border-t-4 border-ink-black flex justify-between items-center px-8 font-mono text-[8px] font-bold text-gray-400">
        <div className="flex gap-4">
          <span>LAT: 37.7749 N</span>
          <span>LNG: 122.4194 W</span>
        </div>
        <div className="flex gap-4">
          <span>THREAT_LEVEL: OMEGA</span>
          <span className="text-stamp-red animate-pulse">● LIVE_FEED_ACTIVE</span>
        </div>
      </div>
    </div>
  );
}

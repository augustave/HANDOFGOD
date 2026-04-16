import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Filter, Zap, RefreshCw } from "lucide-react";
import { cn } from "./dossier-components";

export const CaptureSimulator = () => {
  const [drift, setDrift] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedNodes, setDetectedNodes] = useState<string[]>([]);
  const [mitigated, setMitigated] = useState(0);
  const scanCountRef = useRef(0);
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nodes = [
    "Dopamine_Loop_04", "Algorithmic_Bias_A9", "Predictive_Nudge_88", 
    "Social_Validation_Key", "Echo_Chamber_Protocol", "Attention_Harvest_X"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setDrift(prev => Math.min(100, prev + (isScanning ? -2 : 0.5)));
    }, 1000);
    return () => clearInterval(interval);
  }, [isScanning]);

  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    };
  }, []);

  const scan = () => {
    setIsScanning(true);
    scanTimeoutRef.current = setTimeout(() => {
      const newNode = nodes[scanCountRef.current % nodes.length];
      scanCountRef.current += 1;
      setDetectedNodes(prev => [newNode, ...prev].slice(0, 3));
      setIsScanning(false);
      scanTimeoutRef.current = null;
    }, 2000);
  };

  const mitigate = (node: string) => {
    setDetectedNodes(prev => prev.filter(n => n !== node));
    setMitigated(prev => prev + 1);
    setDrift(prev => Math.max(0, prev - 15));
  };

  return (
    <div className="my-16 bg-white border-4 border-ink-black p-8 shadow-[16px_16px_0px_var(--dossier-blue)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-dossier-blue/5 -rotate-12 translate-x-12 -translate-y-12" />
      
      <div className="flex justify-between items-center mb-8 border-b-2 border-ink-black/10 pb-4">
        <h4 className="font-mono font-black text-sm uppercase tracking-[0.2em] flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-stamp-red" /> ATTENTION_AUDIT_V1.1
        </h4>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={cn("w-2 h-2 rounded-full", drift > 70 ? "bg-stamp-red animate-pulse" : "bg-gray-200")} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between font-mono text-[10px] font-black uppercase tracking-widest">
              <span>ALGORITHMIC_DRIFT</span>
              <span className={cn(drift > 70 ? "text-stamp-red" : "text-dossier-blue")}>{Math.round(drift)}%</span>
            </div>
            <div className="h-4 bg-gray-100 border-2 border-ink-black relative overflow-hidden">
              <motion.div 
                className={cn("h-full transition-colors", drift > 70 ? "bg-stamp-red" : "bg-dossier-blue")}
                animate={{ width: `${drift}%` }}
              />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_11px)]" />
            </div>
          </div>

          <button 
            type="button"
            onClick={scan}
            disabled={isScanning}
            className="w-full py-4 bg-ink-black text-white font-mono text-xs font-black uppercase tracking-widest hover:bg-dossier-blue transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isScanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Filter className="w-4 h-4" />}
            {isScanning ? "SCANNING_NODES..." : "INITIATE_CAPTURE_SCAN"}
          </button>

          <div className="flex justify-between items-center font-mono text-[9px] font-black uppercase text-gray-400">
            <span>TOTAL_MITIGATED: {mitigated}</span>
            <span>STATUS: {drift > 50 ? "COMPROMISED" : "NOMINAL"}</span>
          </div>
        </div>

        <div className="bg-substrate-paper p-6 border-2 border-ink-black/20 space-y-4">
          <div className="font-mono text-[9px] font-black text-gray-500 uppercase tracking-widest">DETECTED_CAPTURE_VECTORS</div>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {detectedNodes.length === 0 ? (
                <div className="text-[10px] font-mono text-gray-300 uppercase italic">No active vectors detected...</div>
              ) : (
                detectedNodes.map((node) => (
                  <motion.div 
                    key={node}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    className="flex justify-between items-center p-3 bg-white border border-ink-black/10 group"
                  >
                    <span className="font-mono text-[11px] font-black uppercase tracking-tighter">{node}</span>
                    <button 
                      type="button"
                      onClick={() => mitigate(node)}
                      aria-label={`Mitigate ${node}`}
                      className="p-1 hover:text-stamp-red transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

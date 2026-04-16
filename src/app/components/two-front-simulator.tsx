import React, { useState, useMemo } from "react";
import { Zap, Maximize2 } from "lucide-react";
import { cn } from "./dossier-components";

export const TwoFrontSimulator = () => {
  const [techVal, setTechVal] = useState(45);
  const [narrativeVal, setNarrativeVal] = useState(30);

  const outcome = useMemo(() => {
    if (techVal > 80 && narrativeVal < 30) return { 
      status: "BRITTLE SUPERIORITY", 
      desc: "Maximum technical capability with zero social buy-in. Infrastructure is vulnerable to 'insider capture' and localized sabotage.",
      color: "text-orange-600",
      alert: "HIGH_RISK_OF_DETACHMENT"
    };
    if (techVal < 30 && narrativeVal > 80) return { 
      status: "IDEOLOGICAL STAGNATION", 
      desc: "Absolute cultural alignment but zero functional power. A community that believes but cannot act. Vulnerable to kinetic displacement.",
      color: "text-blue-600",
      alert: "FUNCTIONAL_PARALYSIS"
    };
    if (techVal > 70 && narrativeVal > 70) return { 
      status: "OPERATIONAL SYNERGY", 
      desc: "Sovereign infrastructure backed by a literate operator class. The systems and the people move as one unit.",
      color: "text-green-700",
      alert: "OPTIMAL_POSTURE"
    };
    return { 
      status: "ASYMMETRIC VULNERABILITY", 
      desc: "Standard operating posture. Neither the systems nor the culture are hardened against targeted decay.",
      color: "text-gray-500",
      alert: "STASIS_MONITORING"
    };
  }, [techVal, narrativeVal]);

  return (
    <div className="my-16 p-8 md:p-12 bg-white border-2 border-ink-black shadow-[16px_16px_0px_var(--dossier-blue)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none graph-overlay" />
      <div className="flex justify-between items-center mb-10 border-b-2 border-ink-black/10 pb-6 relative z-10">
        <h3 className="font-mono font-black flex items-center gap-3 text-sm uppercase tracking-[0.3em]">
          <Zap className="w-6 h-6 text-star-gold" /> TACTICAL_SIMULATOR_V4.2
        </h3>
        <div className="font-mono text-[9px] bg-ink-black text-white px-3 py-1 font-black uppercase tracking-widest">Auth_Req</div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-16 relative z-10">
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="flex justify-between font-mono text-[10px] font-black uppercase tracking-widest">
              <span>TECH_DEFENSE_LEVEL</span>
              <span className="text-dossier-blue">{techVal}%</span>
            </div>
            <input 
              aria-label="Technical defense level"
              type="range" 
              className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer accent-dossier-blue rounded-full" 
              value={techVal} 
              onChange={(e) => setTechVal(Number(e.target.value))} 
            />
            <div className="flex justify-between text-[8px] font-mono text-gray-400 font-black uppercase tracking-widest">
              <span>FRAGILE</span>
              <span>SOVEREIGN</span>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between font-mono text-[10px] font-black uppercase tracking-widest">
              <span>NARRATIVE_RESILIENCE</span>
              <span className="text-star-gold">{narrativeVal}%</span>
            </div>
            <input 
              aria-label="Narrative resilience"
              type="range" 
              className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer accent-star-gold rounded-full" 
              value={narrativeVal} 
              onChange={(e) => setNarrativeVal(Number(e.target.value))} 
            />
            <div className="flex justify-between text-[8px] font-mono text-gray-400 font-black uppercase tracking-widest">
              <span>CAPTURED</span>
              <span>LITERATE</span>
            </div>
          </div>
        </div>

        <div className="bg-substrate-paper p-8 border-l-8 border-ink-black shadow-inner relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Maximize2 className="w-12 h-12" /></div>
          <div className="flex items-center justify-between mb-6">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-black">PROJECTED_POSTURE</div>
            <div className="text-[9px] font-mono px-2 py-0.5 border border-ink-black/20 font-black tracking-tighter">{outcome.alert}</div>
          </div>
          <div className={cn("text-3xl font-black font-mono mb-6 leading-none tracking-tighter uppercase", outcome.color)}>
            {outcome.status}
          </div>
          <p className="text-base font-serif leading-relaxed opacity-80 italic border-t border-ink-black/5 pt-6 text-ink-black">
            "{outcome.desc}"
          </p>
        </div>
      </div>
    </div>
  );
};

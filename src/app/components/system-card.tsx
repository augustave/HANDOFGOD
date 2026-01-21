import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Activity, Target, Zap, Cpu } from "lucide-react";
import { cn } from "@/app/components/dossier-components";

interface SystemCardProps {
  activeAct: number;
  role: string;
  data: {
    asset: string;
    surface: string;
    failure: string;
    controls: string;
    metric: string;
  }[];
}

export const SystemCard = ({ activeAct, role, data }: SystemCardProps) => {
  const current = data[activeAct] || data[0];

  const rows = [
    { label: "ASSET", val: current.asset, icon: Cpu },
    { label: "SURFACE", val: current.surface, icon: Shield },
    { label: "FAILURE", val: current.failure, icon: Target },
    { label: "CONTROLS", val: current.controls, icon: Zap },
    { label: "METRIC", val: current.metric, icon: Activity },
  ];

  return (
    <div className="bg-ink-black text-white p-8 space-y-10 shadow-[24px_24px_0px_rgba(0,0,0,0.1)] border-t-4 border-star-gold sticky top-48 h-fit hidden lg:block overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Shield className="w-24 h-24" />
      </div>
      
      <div className="flex justify-between items-center border-b border-white/10 pb-6 relative z-10">
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">System_Card_v2.0</span>
          <div className="font-mono text-xs font-black uppercase">STATUS: ACTIVE // {role}</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
      </div>
      
      <div className="space-y-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAct}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {rows.map((row, i) => (
              <div key={row.label} className="group">
                <div className="flex items-center gap-2 mb-1.5">
                  <row.icon className="w-3 h-3 text-star-gold opacity-50" />
                  <div className="font-mono text-[8px] text-gray-500 font-black tracking-widest uppercase">{row.label}</div>
                </div>
                <div className="font-mono text-xs font-black uppercase tracking-tight group-hover:text-star-gold transition-colors">
                  {row.val}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="pt-8 border-t border-white/10 relative z-10">
        <div className="font-mono text-[8px] text-gray-500 font-black tracking-widest uppercase mb-4">LIVE_AUDIT_LOG</div>
        <div className="space-y-3 font-mono text-[9px] uppercase tracking-tighter leading-tight">
          <div className="text-green-500/80 flex gap-2">
            <span className="opacity-50">[{new Date().getHours()}:{new Date().getMinutes()}]</span>
            <span>Audit initiated for AX-0{activeAct}</span>
          </div>
          <div className="text-gray-500 flex gap-2">
            <span className="opacity-50">[{new Date().getHours()}:{new Date().getMinutes()}]</span>
            <span>Vulnerability surface: {current.surface}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-star-gold/20 to-transparent" />
    </div>
  );
};

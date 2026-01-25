import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Lock, ChevronRight, Wifi, ShieldCheck, Activity } from "lucide-react";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING");

  const bootMessages = [
    "Establishing secure link...",
    "Decrypting hand_of_god_v2.6.bin",
    "Bypassing cultural firewalls...",
    "Injecting sovereignty protocols",
    "Loading operator interface...",
    "Authenticating secure core...",
    "Waking from trance state...",
    "READY."
  ];

  useEffect(() => {
    let currentMsg = 0;
    const interval = setInterval(() => {
      if (currentMsg < bootMessages.length) {
        setLogs(prev => [...prev, bootMessages[currentMsg]]);
        setProgress((currentMsg + 1) * (100 / bootMessages.length));
        currentMsg++;
      } else {
        setStatus("ACTIVE");
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-ink-black text-white p-12 flex flex-col justify-between font-mono overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--star-gold)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="flex justify-between items-start relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-star-gold">
            <Terminal className="w-8 h-8" />
            <h1 className="text-2xl font-black uppercase tracking-widest">DOSSIER_KERNEL_3.0</h1>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">
            <ShieldCheck className="w-3 h-3" /> Secure_Session_Active
            <Wifi className="w-3 h-3 ml-2" /> Encrypted_Stream
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">System_Status</div>
          <div className="flex items-center gap-2 text-star-gold">
            <Activity className="w-4 h-4 animate-pulse" />
            <span className="font-black text-xl">{status}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl space-y-4 relative z-10">
        <div className="space-y-1">
          {logs.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-xs md:text-sm font-bold uppercase tracking-wider"
            >
              <span className="text-star-gold opacity-50">[{new Date().toLocaleTimeString()}]</span>
              <ChevronRight className="w-4 h-4 text-star-gold" />
              <span>{log}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div className="w-full h-1 bg-white/10 relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-star-gold shadow-[0_0_15px_var(--star-gold)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center font-black text-[9px] uppercase tracking-[0.5em] opacity-40">
          <span>Boot_Sequence_Progress</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-[1001]">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5 animate-scanline" />
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}

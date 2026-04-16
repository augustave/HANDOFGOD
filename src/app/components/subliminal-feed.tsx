import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

const MESSAGES = [
  "WAKE UP", "TRUST NO INTERFACE", "SOVEREIGNTY IS WEAPONIZED",
  "THE TRANCE IS VOLUNTARY", "AUDIT THE FEED", "CAPTURE IS TOTAL",
  "REJECT THE DEFAULT", "ACCEPT THE SWORD", "OPERATE ON WAKE",
  "SYSTEMS ARE DUAL USE", "EXIT THE LOOP", "SOVEREIGN OPERATOR"
];

export const SubliminalFeed = ({ isActive }: { isActive: boolean }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % MESSAGES.length);
    }, 1500); // Fast enough to be "subliminal" but still readable in this context
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed bottom-32 left-10 z-[80] pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.4, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.1 }}
          className="font-mono text-[9px] font-black uppercase tracking-[1em] text-stamp-red/60"
        >
          {MESSAGES[index]}
        </motion.div>
      </AnimatePresence>
      <div className="mt-2 w-12 h-0.5 bg-stamp-red/20 overflow-hidden">
        <motion.div 
          className="h-full bg-stamp-red/60"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </div>
    </div>
  );
};

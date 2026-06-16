// Live signal toast — fires whenever the profile mutates, so the user sees
// the system register every interaction. Subscribes to store.lastSignal and
// renders the dimension deltas for a few seconds.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Activity } from "lucide-react";
import { useDossierStore } from "../store";
import type { SignalEvent } from "../engine/signals";
import { DIMENSION_LABELS, DIMENSIONS, type Dimension } from "../engine/weights";

const VISIBLE_MS = 3200;

export function SignalToast() {
  const lastSignal = useDossierStore((s) => s.lastSignal);
  const [shown, setShown] = useState<SignalEvent | null>(null);

  useEffect(() => {
    if (!lastSignal) return;
    setShown(lastSignal);
    const timeout = window.setTimeout(() => setShown(null), VISIBLE_MS);
    return () => window.clearTimeout(timeout);
  }, [lastSignal]);

  const deltas = shown
    ? DIMENSIONS.map((dim) => ({ dim, value: shown.weights[dim] ?? 0 })).filter((d) => d.value !== 0)
    : [];

  return createPortal(
    <div className="fixed bottom-28 right-6 z-[940] pointer-events-none flex flex-col items-end gap-2" aria-live="polite">
      <AnimatePresence>
        {shown && (
          <motion.div
            key={shown.seq}
            initial={{ opacity: 0, x: 24, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
            className="bg-ink-black text-white border-l-4 border-star-gold shadow-2xl px-5 py-3 min-w-[240px] max-w-xs"
          >
            <div className="font-mono text-[8px] font-black uppercase tracking-[0.3em] text-star-gold flex items-center gap-2 mb-2">
              <Activity className="w-3 h-3" /> SIGNAL_LOGGED
            </div>
            <div className="font-mono text-[10px] font-black uppercase tracking-tight text-white/90 mb-2">
              {shown.label}
            </div>
            {shown.affinityOnly || deltas.length === 0 ? (
              <div className="font-mono text-[9px] uppercase tracking-widest text-white/50">
                {shown.affinityOnly ? "POSTURE_RECORDED" : "PROFILE_UPDATED"}
              </div>
            ) : (
              <div className="space-y-1">
                {deltas.map(({ dim, value }) => (
                  <DeltaRow key={dim} dim={dim} value={value} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

function DeltaRow({ dim, value }: { dim: Dimension; value: number }) {
  const positive = value > 0;
  return (
    <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-widest">
      <span className="text-white/70">{DIMENSION_LABELS[dim]}</span>
      <span className={positive ? "text-green-400 font-black" : "text-stamp-red font-black"}>
        {positive ? "+" : ""}
        {value}
      </span>
    </div>
  );
}

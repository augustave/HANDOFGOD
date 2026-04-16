import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, ChevronRight, Wifi, ShieldCheck, Activity, Fingerprint, Zap } from "lucide-react";

const BOOT_MESSAGES: { text: string; type: "normal" | "success" | "warning" | "glitch"; delay: number }[] = [
  { text: "Establishing secure link...", type: "normal", delay: 300 },
  { text: "Connecting to SOVEREIGN_CORE_v3.1", type: "normal", delay: 250 },
  { text: ">> TLS 1.3 handshake complete", type: "success", delay: 200 },
  { text: "Decrypting hand_of_god_v2.6.bin", type: "normal", delay: 400 },
  { text: "Bypassing cultural firewalls...", type: "warning", delay: 350 },
  { text: "▓▓▓▓▒▒▒▒░░░░ [FIREWALL_BREACH]", type: "glitch", delay: 150 },
  { text: ">> Breach successful. Proceeding.", type: "success", delay: 300 },
  { text: "Injecting sovereignty protocols", type: "normal", delay: 250 },
  { text: "Loading operator interface layers...", type: "normal", delay: 300 },
  { text: ">> Layer 1: NARRATIVE_ENGINE ✓", type: "success", delay: 200 },
  { text: ">> Layer 2: THREAT_RADAR ✓", type: "success", delay: 200 },
  { text: ">> Layer 3: SYSTEM_CARD ✓", type: "success", delay: 200 },
  { text: "Authenticating secure core...", type: "normal", delay: 350 },
  { text: "Waking from trance state...", type: "warning", delay: 400 },
  { text: ">> CONSCIOUSNESS_PROTOCOL: ENGAGED", type: "success", delay: 300 },
  { text: "READY. SOVEREIGNTY CONFIRMED.", type: "success", delay: 500 },
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<{ text: string; type: "normal" | "success" | "warning" | "glitch" }[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("INITIALIZING");
  const [phase, setPhase] = useState<"boot" | "auth" | "ready">("boot");
  const [glitchActive, setGlitchActive] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(p => !p), 530);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence
  useEffect(() => {
    let totalDelay = 0;

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    BOOT_MESSAGES.forEach((msg, i) => {
      totalDelay += msg.delay;
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, { text: msg.text, type: msg.type }]);
        setProgress(((i + 1) / BOOT_MESSAGES.length) * 100);

        if (msg.type === "glitch") {
          setGlitchActive(true);
          timeouts.push(setTimeout(() => setGlitchActive(false), 200));
        }

        if (i === Math.floor(BOOT_MESSAGES.length * 0.7)) {
          setPhase("auth");
          setStatus("AUTHENTICATING");
        }

        if (i === BOOT_MESSAGES.length - 1) {
          setStatus("ACTIVE");
          setPhase("ready");
          timeouts.push(setTimeout(onComplete, 1200));
        }
      }, totalDelay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  const typeColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-500";
      case "warning": return "text-orange-400";
      case "glitch": return "text-stamp-red";
      default: return "text-white/80";
    }
  };

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[1000] bg-ink-black text-white font-mono overflow-hidden"
    >
      {/* CRT effect layers */}
      <div className="absolute inset-0 pointer-events-none z-[1002]">
        {/* Scanlines */}
        <div
          className="absolute inset-0"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
          }}
        />
        {/* CRT vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)",
          }}
        />
        {/* Moving scanline */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-white/[0.06]"
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Glitch overlay */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1003] pointer-events-none"
          >
            <div className="absolute inset-0 bg-stamp-red/10" />
            <div className="absolute top-[20%] left-0 right-0 h-[3px] bg-white/30" style={{ transform: "translateX(5px)" }} />
            <div className="absolute top-[45%] left-0 right-0 h-[2px] bg-cyan-400/20" style={{ transform: "translateX(-8px)" }} />
            <div className="absolute top-[70%] left-0 right-0 h-[4px] bg-white/20" style={{ transform: "translateX(3px)" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dot grid background */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--star-gold)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <div className="relative z-10 h-full flex flex-col p-8 md:p-12">
        {/* Top bar */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-star-gold">
              <Terminal className="w-6 h-6 md:w-8 md:h-8" />
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-widest">DOSSIER_KERNEL_3.1</h1>
            </div>
            <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3 h-3" /> Secure_Session_Active
              <Wifi className="w-3 h-3 ml-2" /> Encrypted_Stream
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] font-black opacity-30 uppercase tracking-[0.3em]">System_Status</div>
            <div className="flex items-center gap-2 text-star-gold justify-end">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="font-black text-xl">{status}</span>
            </div>
          </div>
        </div>

        {/* Phase indicator */}
        <div className="flex items-center gap-8 mt-8 md:mt-12">
          {(["BOOT", "AUTH", "READY"] as const).map((p, i) => (
            <div key={p} className="flex items-center gap-3">
              <motion.div
                className="w-2 h-2 rounded-full"
                animate={{
                  backgroundColor:
                    (phase === "boot" && i === 0) || (phase === "auth" && i <= 1) || (phase === "ready")
                      ? "var(--star-gold)"
                      : "rgba(255,255,255,0.1)",
                }}
              />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{p}</span>
            </div>
          ))}
        </div>

        {/* Log output */}
        <div className="flex-1 flex flex-col justify-center max-w-3xl mt-8 space-y-0">
          <div className="space-y-0.5 max-h-[50vh] overflow-hidden">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`flex items-start gap-3 text-[11px] md:text-xs font-bold uppercase tracking-wider ${typeColor(log.type)}`}
              >
                <span className="text-star-gold/40 shrink-0 text-[10px]">[{String(new Date().getHours()).padStart(2, "0")}:{String(new Date().getMinutes()).padStart(2, "0")}:{String(new Date().getSeconds()).padStart(2, "0")}]</span>
                {log.type === "success" ? (
                  <Zap className="w-3 h-3 shrink-0 mt-0.5 text-green-500" />
                ) : (
                  <ChevronRight className="w-3 h-3 shrink-0 mt-0.5 text-star-gold/50" />
                )}
                <span>{log.text}</span>
              </motion.div>
            ))}
            {/* Blinking cursor */}
            <div className="flex items-center gap-3 text-xs h-5">
              <span className="text-star-gold/40 text-[10px]">[{String(new Date().getHours()).padStart(2, "0")}:{String(new Date().getMinutes()).padStart(2, "0")}:{String(new Date().getSeconds()).padStart(2, "0")}]</span>
              <ChevronRight className="w-3 h-3 text-star-gold/50" />
              <motion.span
                animate={{ opacity: showCursor ? 1 : 0 }}
                className="inline-block w-2 h-4 bg-star-gold"
              />
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="space-y-4 mt-auto">
          {/* Auth fingerprint */}
          <AnimatePresence>
            {phase === "auth" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-star-gold/60"
              >
                <Fingerprint className="w-5 h-5 animate-pulse" />
                <span>Biometric verification in progress...</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/5 relative overflow-hidden border border-white/5">
            <motion.div
              className="absolute top-0 left-0 h-full bg-star-gold"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              style={{ boxShadow: "0 0 20px var(--star-gold), 0 0 40px var(--star-gold)" }}
            />
            {/* Shimmer */}
            <motion.div
              className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-100px", "800px"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="flex justify-between items-center font-black text-[8px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.5em] opacity-40">
            <span>Boot_Sequence_Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>

          {/* Skip button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onComplete}
              className="font-mono text-[9px] font-black text-gray-600 hover:text-star-gold uppercase tracking-widest transition-colors cursor-pointer"
            >
              SKIP_BOOT →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

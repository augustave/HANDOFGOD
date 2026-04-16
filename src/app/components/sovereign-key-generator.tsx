import { useState } from "react";
import { Key, ShieldCheck, Download, Fingerprint } from "lucide-react";
import { motion } from "motion/react";

export const SovereignKeyGenerator = () => {
  const [handle, setHandle] = useState("");
  const [generated, setGenerated] = useState(false);
  const [key, setKey] = useState("");
  const [status, setStatus] = useState("");

  const generate = () => {
    if (!handle) return;
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    const randomHex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    setKey(`SOV-${handle.toUpperCase().replace(/\s/g, "_")}-${randomHex.slice(0, 16)}`);
    setGenerated(true);
  };

  const copyKey = async () => {
    if (!navigator.clipboard) {
      setStatus("Clipboard unavailable");
      return;
    }
    await navigator.clipboard.writeText(key);
    setStatus("Sovereign ID copied");
  };

  const exportKey = () => {
    const blob = new Blob([`${key}\n`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${key.split("-").slice(0, 2).join("-").toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatus("Sovereign ID exported");
  };

  return (
    <div className="my-16 p-10 bg-ink-black text-white border-b-8 border-star-gold shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -right-12 -bottom-12 opacity-[0.03] rotate-12">
        <Fingerprint className="w-64 h-64" />
      </div>

      <div className="max-w-xl space-y-8 relative z-10">
        <div className="space-y-2">
          <div className="font-mono text-[10px] text-star-gold font-black uppercase tracking-[0.4em]">SOVEREIGN_ID_PROTOCOL</div>
          <h4 className="text-3xl font-black uppercase tracking-tighter">Generate Your Sovereign Key</h4>
          <p className="font-mono text-[11px] text-gray-400 leading-relaxed uppercase">This key represents your independent posture within the network. It is unique to your hardware and your intent.</p>
        </div>

        {!generated ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="operator-handle" className="font-mono text-[9px] font-black text-gray-500 uppercase">OPERATOR_HANDLE</label>
              <input 
                id="operator-handle"
                aria-label="Operator handle"
                type="text" 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="ENTER_HANDLE..."
                className="w-full bg-white/5 border-2 border-white/10 p-4 font-mono text-sm uppercase tracking-widest outline-none focus:border-star-gold transition-colors text-white"
              />
            </div>
            <button 
              type="button"
              onClick={generate}
              className="w-full py-4 bg-star-gold text-ink-black font-mono text-xs font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-3"
            >
              <Key className="w-4 h-4" /> INITIATE_GENERATION_SEQUENCE
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-6 bg-white/5 p-6 border border-white/10 backdrop-blur-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-green-500">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-mono text-[9px] font-black uppercase">KEY_GENERATED_SUCCESSFULLY</span>
              </div>
              <span className="font-mono text-[9px] text-gray-500 uppercase">REV_2026.01</span>
            </div>
            
            <div className="bg-black p-4 font-mono text-[10px] break-all border border-white/20 text-star-gold/80 leading-relaxed select-all">
              {key}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={exportKey}
                className="flex-1 py-3 border border-white/20 font-mono text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-3 h-3" /> EXPORT_PEM
              </button>
              <button
                type="button"
                onClick={() => void copyKey()}
                className="flex-1 py-3 border border-white/20 font-mono text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
              >
                COPY_ID
              </button>
            </div>
            {status && <div className="font-mono text-[9px] font-black uppercase tracking-widest text-star-gold">{status}</div>}
          </motion.div>
        )}
      </div>
    </div>
  );
};

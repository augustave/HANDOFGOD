import React, { useState } from "react";
import { Terminal, CheckCircle2, Download, Copy } from "lucide-react";
import { cn } from "./dossier-components";

export const InterfaceChecklist = () => {
  const [items, setItems] = useState([
    { id: 1, text: "Audit algorithmic drift in daily tools", checked: false },
    { id: 2, text: "Deploy sovereign encryption for key nodes", checked: false },
    { id: 3, text: "Inject manual friction into high-load workflows", checked: false },
    { id: 4, text: "Establish protocol-level transparency logs", checked: false },
    { id: 5, text: "Draft literacy plan for secondary operators", checked: false },
  ]);
  const [status, setStatus] = useState("");

  const toggle = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const checklistText = items.map((item) => `${item.checked ? "[x]" : "[ ]"} ${item.text}`).join("\n");

  const copyChecklist = async () => {
    if (!navigator.clipboard) {
      setStatus("Clipboard unavailable");
      return;
    }
    await navigator.clipboard.writeText(checklistText);
    setStatus("Checklist copied");
  };

  return (
    <div className="my-16 p-12 bg-ink-black text-white space-y-10 shadow-[24px_24px_60px_rgba(0,0,0,0.4)] border-t border-white/10 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-star-gold" />
      <div className="absolute bottom-0 right-0 p-8 opacity-[0.03]"><CheckCircle2 className="w-48 h-48" /></div>
      
      <div className="flex justify-between items-center border-b border-white/10 pb-6 relative z-10">
        <h4 className="font-mono font-black text-sm md:text-lg uppercase tracking-[0.3em] flex items-center gap-4 text-white">
          <Terminal className="w-6 h-6 text-star-gold" /> Operational_Checklist
        </h4>
        <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest font-black">CODE: UNITY_2026</div>
      </div>
      <div className="space-y-6 relative z-10">
        {items.map(item => (
          <button
            type="button"
            key={item.id} 
            onClick={() => toggle(item.id)}
            aria-pressed={item.checked}
            className="flex items-center gap-6 cursor-pointer group text-left bg-transparent border-0 p-0 w-full text-white"
          >
            <div className={cn(
              "w-6 h-6 border-2 flex items-center justify-center transition-all duration-300",
              item.checked ? "bg-star-gold border-star-gold scale-110" : "border-white/30 group-hover:border-white"
            )}>
              {item.checked && <CheckCircle2 className="w-4 h-4 text-black" />}
            </div>
            <span className={cn(
              "font-mono text-xs md:text-sm uppercase tracking-widest transition-all duration-500 font-bold",
              item.checked ? "opacity-30 line-through tracking-normal" : "opacity-90 group-hover:opacity-100"
            )}>
              {item.text}
            </span>
          </button>
        ))}
      </div>
      {status && <div className="font-mono text-[10px] font-black uppercase tracking-widest text-star-gold">{status}</div>}
      <div className="pt-8 flex flex-wrap gap-8 relative z-10">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-star-gold hover:text-white transition-colors group bg-transparent border-none cursor-pointer"
        >
          <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> EXPORT_PLAN.PDF
        </button>
        <button
          type="button"
          onClick={() => void copyChecklist()}
          className="flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-star-gold hover:text-white transition-colors group bg-transparent border-none cursor-pointer"
        >
          <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" /> COPY_SHARE_LINK
        </button>
      </div>
    </div>
  );
};

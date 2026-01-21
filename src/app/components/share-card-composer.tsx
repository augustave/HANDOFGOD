import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Share2 } from "lucide-react";

interface ShareCardProps {
  text: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareCardComposer = ({ text, isOpen, onClose }: ShareCardProps) => {
  const downloadSvg = () => {
    const svgContent = `
      <svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="400" fill="#F3F0E8" />
        <rect width="600" height="60" fill="#111111" />
        <text x="30" y="38" font-family="monospace" font-size="14" fill="#FFFFFF" font-weight="bold">HAND_OF_GOD // DECLASSIFIED_FRAGMENT</text>
        <text x="30" y="120" font-family="serif" font-size="20" fill="#111111" font-style="italic">"${text.substring(0, 200)}${text.length > 200 ? '...' : ''}"</text>
        <line x1="30" y1="340" x2="570" y2="340" stroke="#111111" stroke-width="1" opacity="0.2" />
        <text x="30" y="370" font-family="monospace" font-size="10" fill="#B01F2E" font-weight="bold">AUTH_REQ: SOVEREIGN_OPERATOR // DATE: 2026</text>
      </svg>
    `;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dossier-fragment-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-ink-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-substrate-paper max-w-2xl w-full border-2 border-ink-black shadow-[24px_24px_0px_var(--stamp-red)] relative"
          >
            <div className="bg-ink-black p-4 flex justify-between items-center">
              <span className="font-mono text-[10px] text-white font-black tracking-widest uppercase">FRAGMENT_EXPORT_V1.0</span>
              <button onClick={onClose} className="text-white hover:text-stamp-red">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-12 space-y-8">
              <div className="border-l-4 border-star-gold pl-8">
                <p className="font-serif text-2xl italic leading-relaxed text-ink-black">
                  "{text}"
                </p>
              </div>
              
              <div className="pt-8 border-t border-ink-black/10 flex justify-between items-end">
                <div className="space-y-2">
                  <div className="font-mono text-[9px] text-gray-400 font-black uppercase tracking-widest">CLASSIFICATION</div>
                  <div className="font-mono text-xs font-black text-stamp-red uppercase">TOP_SECRET // HAND_OF_GOD</div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={downloadSvg}
                    className="flex items-center gap-2 px-4 py-2 bg-ink-black text-white font-mono text-[10px] font-black uppercase tracking-widest hover:bg-stamp-red transition-colors"
                  >
                    <Download className="w-4 h-4" /> SVG
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border-2 border-ink-black font-mono text-[10px] font-black uppercase tracking-widest hover:bg-ink-black hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" /> LINK
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

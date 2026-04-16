import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function SelectionTooltip({ onExecute }: { onExecute: (text: string) => void }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 5 && selection?.rangeCount) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        setPos({ x: rect.left + rect.width / 2, y: rect.top + window.scrollY - 10 });
        setSelectedText(text);
        setVisible(true);
        return;
      }
      setVisible(false);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed z-[200] -translate-x-1/2 -translate-y-full mb-4 bg-ink-black text-white px-4 py-2 font-mono text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl border border-white/10 rounded-none"
      style={{ left: pos.x, top: pos.y }}
      role="dialog"
      aria-label="Classify selected text"
    >
      <span className="w-1.5 h-1.5 bg-stamp-red motion-safe:animate-pulse" />
      <span>Classify Selection?</span>
      <button
        type="button"
        onClick={() => {
          onExecute(selectedText);
          setVisible(false);
        }}
        className="hover:text-star-gold border-l border-white/20 pl-3 transition-colors bg-transparent cursor-pointer"
      >
        Execute
      </button>
    </motion.div>
  );
}

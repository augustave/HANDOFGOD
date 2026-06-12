import React from "react";
import { motion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Terminal, CornerDownRight } from "lucide-react";

type ClassValue = string | number | boolean | undefined | null | Record<string, unknown> | ClassValue[];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Inline redaction lifted by knowledge, not mode: `revealed` is driven by the
// act's declassification state (its field assessment answered).
export const RedactionInline = ({
  children,
  permanent = false,
  plainText = false,
  revealed = false,
}: {
  children: React.ReactNode;
  permanent?: boolean;
  plainText?: boolean;
  revealed?: boolean;
}) => {
  if (plainText) return <span className="bg-yellow-200/50 px-0.5 text-black rounded-sm">{children}</span>;

  if (permanent) {
    return (
      <span className="bg-redaction-black text-redaction-black px-1 select-none rounded-sm cursor-not-allowed border-b border-white/5">
        {children}
      </span>
    );
  }

  if (revealed) {
    return (
      <motion.span
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.5 }}
        className="inline px-1 bg-star-gold/15"
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span
      className="relative inline px-1 select-none"
      title="REDACTED // answer this section's field assessment to declassify"
    >
      <span className="opacity-0 blur-sm" aria-hidden="true">
        {children}
      </span>
      <span className="absolute inset-0 bg-redaction-black rounded-xs border-y border-white/10" />
      <span className="sr-only">redacted - answer this section's field assessment to declassify</span>
    </span>
  );
};

export const Stamp = ({ text, color = "var(--stamp-red)", rotated = -12 }: { text: string; color?: string; rotated?: number }) => {
  return (
    <motion.div
      initial={{ scale: 4, opacity: 0, rotate: rotated - 30 }}
      whileInView={{ scale: 1, opacity: 0.6, rotate: rotated }}
      viewport={{ once: true }}
      className="inline-block border-4 px-4 py-2 font-mono font-bold text-2xl uppercase tracking-tighter mix-blend-multiply pointer-events-none my-8"
      style={{ borderColor: color, color: color }}
    >
      {text}
    </motion.div>
  );
};

export const TornEdge = () => (
  <div className="w-full h-8 overflow-hidden pointer-events-none opacity-20 my-12">
    <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="w-full h-full fill-current">
      <path d="M0 24V12L20 18L40 6L60 14L80 2L100 16L120 10L140 20L160 4L180 12L200 0L220 18L240 8L260 22L280 14L300 4L320 16L340 6L360 18L380 2L400 14L420 8L440 20L460 4L480 16L500 2L520 18L540 10L560 22L580 12L600 4L620 16L640 6L660 18L680 2L700 14L720 8L740 20L760 4L780 16L800 2L820 18L840 10L860 22L880 12L900 4L920 16L940 6L960 18L980 2L1000 14L1020 8L1040 20L1060 4L1080 16L1100 2L1120 18L1140 10L1160 22L1180 12L1200 4V24H0Z" />
    </svg>
  </div>
);

export const BriefingBox = ({ items }: { items: string[] }) => (
  <div className="bg-tape-beige/20 border border-ink-black/10 p-6 my-8 font-mono text-xs relative overflow-hidden">
    <div className="absolute top-0 right-0 w-8 h-8 opacity-[0.05] pointer-events-none">
      <Terminal className="w-full h-full" />
    </div>
    <div className="flex items-center gap-2 mb-4 text-gray-500 font-bold">
      <CornerDownRight className="w-4 h-4" /> SUMMARY_BRIEF // {new Date().getFullYear()}
    </div>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span className="text-stamp-red font-bold">0{i+1}.</span>
          <span className="leading-tight uppercase tracking-tight opacity-80">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const SecureLine = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={cn("relative group overflow-hidden py-1", className)}>
      <motion.div
        animate={{
          x: [-2, 2, -1, 0],
          opacity: [1, 0.8, 1, 0.9],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: "mirror",
          repeatDelay: (text.length % 5) + 2
        }}
        className="relative z-10"
      >
        {text}
      </motion.div>
      <div className="absolute inset-0 bg-stamp-red/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
    </div>
  );
};

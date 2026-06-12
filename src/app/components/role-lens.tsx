// ROLE LENS (PRD F04): per-act framing strip — focus + question for the
// active role. Replaces the hardcoded COMMANDER_EYES_ONLY/FIELD_NOTE blocks;
// switching role reframes instantly without duplicating content.

import { ROLE_LENSES } from "../data/role-lenses";
import { useDossierStore } from "../store";
import { cn } from "./dossier-components";
import type { SecurityRole } from "../types";

const ROLE_STYLES: Record<SecurityRole, { border: string; text: string; label: string }> = {
  ANALYST: { border: "border-ink-black/30", text: "text-ink-black/70", label: "ANALYST_LENS" },
  OPERATOR: { border: "border-dossier-blue", text: "text-dossier-blue", label: "OPERATOR_LENS" },
  COMMANDER: { border: "border-stamp-red", text: "text-stamp-red", label: "COMMANDER_LENS" },
};

export function RoleLens({ actId }: { actId: string }) {
  const role = useDossierStore((s) => s.role);
  const lenses = ROLE_LENSES[actId];
  if (!lenses) return null;

  const lens = lenses[role];
  const style = ROLE_STYLES[role];

  return (
    <div
      data-testid={`role-lens-${actId}`}
      className={cn("border-l-4 p-5 bg-white/40 my-6 space-y-2", style.border)}
    >
      <div className={cn("font-mono text-[9px] font-black uppercase tracking-[0.3em]", style.text)}>
        {style.label}
      </div>
      <p className="font-serif text-base md:text-lg leading-snug text-ink-black/85 font-medium">
        {lens.focus}
      </p>
      <p className="font-serif text-sm md:text-base leading-snug text-ink-black/55 italic">
        HOLD THIS: {lens.question}
      </p>
    </div>
  );
}

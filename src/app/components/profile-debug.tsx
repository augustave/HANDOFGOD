// Dev-only profile inspector, rendered when the URL contains ?debug=profile.
// Used for scoring calibration and e2e state seeding — not a product surface.

import { useDossierStore } from "../store";
import { selectSignalCount } from "../store/selectors";
import { DIMENSION_LABELS, DIMENSIONS, POSTURES } from "../engine/weights";

export function isProfileDebugEnabled(): boolean {
  try {
    return typeof window !== "undefined" && window.location.search.includes("debug=profile");
  } catch {
    return false;
  }
}

export function ProfileDebug() {
  const profile = useDossierStore((s) => s.profile);
  const posture = useDossierStore((s) => s.postureDistribution);
  const unlockedIds = useDossierStore((s) => s.unlockedIds);
  const actsRead = useDossierStore((s) => s.actsRead);
  const signalCount = useDossierStore(selectSignalCount);
  const resetSession = useDossierStore((s) => s.resetSession);

  return (
    <div
      className="fixed top-24 left-4 z-[2000] bg-ink-black/95 text-white font-mono text-[10px] p-4 max-w-xs space-y-2 border border-star-gold/40"
      data-testid="profile-debug"
    >
      <div className="font-black text-star-gold tracking-widest">PROFILE_DEBUG</div>
      {DIMENSIONS.map((dim) => (
        <div key={dim} className="flex justify-between gap-4">
          <span>{DIMENSION_LABELS[dim]}</span>
          <span data-testid={`debug-dim-${dim}`}>{profile[dim]}</span>
        </div>
      ))}
      <div className="border-t border-white/20 pt-2">
        {POSTURES.map((p) => (
          <div key={p} className="flex justify-between gap-4">
            <span className="uppercase">{p}</span>
            <span data-testid={`debug-posture-${p}`}>{posture[p]}%</span>
          </div>
        ))}
      </div>
      <div className="border-t border-white/20 pt-2 space-y-1">
        <div>SIGNALS: {signalCount}</div>
        <div>ACTS_READ: {actsRead.join(",") || "none"}</div>
        <div className="break-all">UNLOCKED: {unlockedIds.join(", ") || "none"}</div>
      </div>
      <button
        type="button"
        onClick={resetSession}
        className="border border-stamp-red text-stamp-red px-2 py-1 font-black uppercase tracking-widest cursor-pointer hover:bg-stamp-red hover:text-white transition-colors"
      >
        BURN_SESSION
      </button>
    </div>
  );
}

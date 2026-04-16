import { useEffect } from "react";
import type { DossierAct, SecurityRole } from "../types";

export function useAudioBriefing(
  isAudioMode: boolean,
  activeAct: number,
  role: SecurityRole,
  acts: DossierAct[],
) {
  useEffect(() => {
    if (!isAudioMode || activeAct <= 0 || !("speechSynthesis" in window)) {
      if (!isAudioMode && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const act = acts[activeAct];
    if (!act) return;

    const utterance = new SpeechSynthesisUtterance(
      `Initiating briefing for ${act.title}. Status: ${role}. Secure core active.`,
    );
    utterance.rate = 0.9;
    utterance.pitch = 0.8;

    const glitch = new SpeechSynthesisUtterance("Glitch. Glitch. Glitch.");
    glitch.rate = 4;
    glitch.volume = 0.2;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(glitch);
    window.speechSynthesis.speak(utterance);

    return () => window.speechSynthesis.cancel();
  }, [activeAct, acts, isAudioMode, role]);
}

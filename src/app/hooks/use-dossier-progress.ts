import { useEffect, useRef, useState } from "react";
import { useDossierStore } from "../store";

/** Dwell time a section must stay in view before it counts as read. */
const READ_DWELL_MS = 3000;

/** Full-article scroll depth that marks every act read. */
const FULL_READ_SCROLL_PERC = 95;

export function useDossierProgress() {
  const [activeAct, setActiveAct] = useState(0);
  const [scrollPerc, setScrollPerc] = useState(0);
  const frameRef = useRef<number | null>(null);
  const dwellTimers = useRef<Map<number, number>>(new Map());
  const actsRead = useDossierStore((s) => s.actsRead);

  useEffect(() => {
    const timers = dwellTimers.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const actId = entry.target.getAttribute("data-act-idx");
          if (actId === null) return;
          const idx = Number.parseInt(actId, 10);
          if (Number.isNaN(idx)) return;

          if (entry.isIntersecting) {
            setActiveAct(idx);
            // Fly-by scrolling doesn't score: require sustained presence.
            if (idx > 0 && !timers.has(idx)) {
              const timer = window.setTimeout(() => {
                timers.delete(idx);
                useDossierStore.getState().markActRead(idx);
              }, READ_DWELL_MS);
              timers.set(idx, timer);
            }
          } else {
            const timer = timers.get(idx);
            if (timer !== undefined) {
              window.clearTimeout(timer);
              timers.delete(idx);
            }
          }
        });
      },
      { threshold: 0.2 },
    );

    document.querySelectorAll("section[data-act-idx]").forEach((section) => {
      observer.observe(section);
    });

    const handleScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const perc = height > 0 ? (winScroll / height) * 100 : 0;
        setScrollPerc(perc);
        frameRef.current = null;

        // Reading the continuous article to the end counts as reading every act.
        const store = useDossierStore.getState();
        if (store.isFullRead && perc >= FULL_READ_SCROLL_PERC) {
          store.markAllActsRead();
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      for (const timer of timers.values()) window.clearTimeout(timer);
      timers.clear();
    };
  }, []);

  return { activeAct, completedActs: actsRead, scrollPerc };
}

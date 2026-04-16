import { useEffect, useRef, useState } from "react";

export function useDossierProgress() {
  const [activeAct, setActiveAct] = useState(0);
  const [completedActs, setCompletedActs] = useState<number[]>([]);
  const [scrollPerc, setScrollPerc] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const actId = entry.target.getAttribute("data-act-idx");
          if (actId === null) return;

          const idx = Number.parseInt(actId, 10);
          if (Number.isNaN(idx)) return;

          setActiveAct(idx);
          setCompletedActs((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
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
        setScrollPerc(height > 0 ? (winScroll / height) * 100 : 0);
        frameRef.current = null;
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
    };
  }, []);

  return { activeAct, completedActs, scrollPerc };
}

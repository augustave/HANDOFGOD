import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section id="act-hero" data-act-idx={0} className="min-h-[70vh] flex flex-col justify-center relative">
      <div className="max-w-3xl space-y-10">
        <div className="font-mono text-xs font-black text-stamp-red flex items-center gap-2 uppercase tracking-[0.3em]">
          <span className="w-1.5 h-1.5 bg-stamp-red motion-safe:animate-pulse" /> CLASSIFIED_BRIEFING // 0224 // TOP_SECRET
        </div>
        <h1 className="text-[clamp(3.5rem,13vw,8rem)] md:text-9xl font-black tracking-normal leading-[0.85] uppercase">
          Culture is the <br />
          <span
            className="text-transparent border-t-8 border-b-8 border-ink-black px-4 my-4 block relative group break-words"
            style={{ WebkitTextStroke: "2px var(--ink-black)" }}
          >
            Surface
            <span className="absolute -top-4 -right-4 w-12 h-12 border-4 border-stamp-red opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
        </h1>
        <p className="text-2xl md:text-4xl leading-snug font-medium opacity-90 max-w-2xl font-serif italic tracking-normal text-ink-black">
          A declassified-briefing turned interactive dossier. Explore the dual-use infrastructure of the digital age.
        </p>
        <div className="pt-12 flex items-center gap-8">
          <a href="#act-myth_of_morality" className="inline-flex items-center gap-6 group">
            <span className="w-20 h-20 rounded-full border-4 border-ink-black flex items-center justify-center group-hover:bg-ink-black group-hover:text-white transition-all duration-300 shadow-[6px_6px_0px_var(--stamp-red)] active:shadow-none active:translate-x-1 active:translate-y-1">
              <ArrowRight className="w-8 h-8" />
            </span>
            <span className="font-mono font-black text-xs tracking-[0.2em] md:tracking-[0.4em] uppercase border-b-2 border-transparent group-hover:border-stamp-red transition-all pb-1 text-ink-black">
              INITIATE_DECLASS
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

import React, { useState, useEffect } from "react";
import { useScroll, motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  ArrowRight,
  Lock,
  Search,
  BookOpen,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Shield,
  Zap,
  CheckCircle2,
  FileText,
  Terminal,
  Download,
  Share2,
  Copy
} from "lucide-react";
import { cn, RedactionInline, Stamp, TornEdge, BriefingBox } from "@/app/components/dossier-components";
import { ExhibitCard } from "@/app/components/exhibit-card";
import { TwoFrontSimulator } from "@/app/components/two-front-simulator";
import { InterfaceChecklist } from "@/app/components/interface-checklist";
import { StarRailNav } from "@/app/components/star-rail-nav";
import { CommandDock } from "@/app/components/command-dock";
import { ShareCardComposer } from "@/app/components/share-card-composer";
import { SystemCard } from "@/app/components/system-card";

import { EvidenceWall } from "@/app/components/evidence-wall";
import { PostureTerminal } from "@/app/components/posture-terminal";
import { BootSequence } from "@/app/components/boot-sequence";
import { CommandPalette } from "@/app/components/command-palette";
import { CaptureSimulator } from "@/app/components/capture-simulator";
import { SubliminalFeed } from "@/app/components/subliminal-feed";
import { SovereignKeyGenerator } from "@/app/components/sovereign-key-generator";

// --- App ---

export default function App() {
  const [activeAct, setActiveAct] = useState(0);
  const [completedActs, setCompletedActs] = useState<number[]>([]);
  const [plainTextMode, setPlainTextMode] = useState(false);
  const [isWoke, setIsWoke] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [mode, setMode] = useState<"READ" | "BRIEF" | "OPERATE">("READ");
  const [role, setRole] = useState<"ANALYST" | "OPERATOR" | "COMMANDER">("ANALYST");
  const [shareText, setShareText] = useState("");
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [showBoot, setShowBoot] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const [scrollPerc, setScrollPerc] = useState(0);

  // Audio Narration Logic
  useEffect(() => {
    if (isAudioMode && activeAct > 0) {
      const act = acts[activeAct];
      const utterance = new SpeechSynthesisUtterance(`Initiating briefing for ${act.title}. Status: ${role}. Secure core active.`);
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
      
      // Add a bit of robotic glitch to the start
      const glitch = new SpeechSynthesisUtterance("Glitch. Glitch. Glitch.");
      glitch.rate = 4;
      glitch.volume = 0.2;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(glitch);
      window.speechSynthesis.speak(utterance);
    }
  }, [activeAct, isAudioMode, role]);

  const acts = [
    { id: "hero", title: "Culture is the Surface", code: "AX-00" },
    { id: "myth_of_morality", title: "The Myth of Morality", code: "AX-01" },
    { id: "authentic_narrative", title: "The Authentic Narrative", code: "AX-02" },
    { id: "two_front", title: "The Two-Front War", code: "AX-03" },
    { id: "sovereign", title: "The Sovereign", code: "AX-04" },
    { id: "operational_interfaces", title: "Operational Interfaces", code: "AX-05" },
    { id: "education", title: "The Education", code: "AX-06" },
    { id: "final", title: "Operate on Wake", code: "AX-07" },
  ];

  const systemCardStates = [
    { asset: "Foundational Myth", surface: "Public Trust", failure: "Cynicism Decay", controls: "Ritual Authenticity", metric: "Retention" },
    { asset: "Legitimacy Protocol", surface: "Moral Authority", failure: "Ideological Capture", controls: "Structural Integrity", metric: "Resilience" },
    { asset: "Attentional Flow", surface: "Dopaminergic Loops", failure: "Algorithmic Capture", controls: "Friction Injection", metric: "Agency Score" },
    { asset: "Infrastructure", surface: "Parallel Attack", failure: "Dual-Use Leakage", controls: "Sovereign Stack", metric: "Strategic Depth" },
    { asset: "Sovereign Intent", surface: "Willful Command", failure: "Strategic Paralysis", controls: "Accepting the Sword", metric: "Decisiveness" },
    { asset: "Human-Machine Edge", surface: "Cognitive Load", controls: "Legibility Frameworks", failure: "Interface Opacity", metric: "Literacy" },
    { asset: "Applied Epistemology", surface: "Mental Models", failure: "Capability Gap", controls: "Literacy Nodes", metric: "Outcome" },
    { asset: "Sovereign Wake", surface: "Conscious Action", failure: "Inertia", controls: "Willful Operation", metric: "Post-Trance Exit" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const actId = entry.target.getAttribute("data-act-idx");
          if (actId !== null) {
            const idx = parseInt(actId);
            setActiveAct(idx);
            setCompletedActs(prev => prev.includes(idx) ? prev : [...prev, idx]);
          }
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll("section[data-act-idx]").forEach(section => observer.observe(section));

    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollPerc(scrolled);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderActContent = (idx: number) => {
    switch(idx) {
      case 1:
        return (
          <div className="prose prose-2xl max-w-none space-y-12 opacity-95 leading-relaxed font-serif text-ink-black/90">
            {role === "COMMANDER" && (
              <div className="bg-stamp-red/5 border-l-4 border-stamp-red p-6 font-mono text-[10px] uppercase tracking-widest text-stamp-red font-black">
                COMMANDER_EYES_ONLY: Morality is a containment protocol. Break it only when structural integrity is at 0%.
              </div>
            )}
            {mode === "BRIEF" ? (
              <div className="space-y-8 italic border-l-4 border-star-gold pl-8">
                <p>Morality in tech is often a mask for structural fragility. We mistake performative compliance for ethical grounding, leaving systems vulnerable to asymmetric narrative attacks.</p>
                <ul className="space-y-2 not-italic font-mono text-sm uppercase">
                  <li>• Virtue is not a firewall</li>
                  <li>• Legitimacy must be built, not borrowed</li>
                  <li>• Ethics without enforcement is just marketing</li>
                </ul>
              </div>
            ) : (
              <>
                <p>
                  The first rule of the new world is this: <RedactionInline isOperate={mode === "OPERATE"} plainText={plainTextMode}>Legibility is a weapon</RedactionInline>. If a system is designed to be invisible, it is designed to be unaccountable. We were told that the internet would democratize information, but it instead industrialized capture.
                </p>
                <EvidenceWall />
                <p>
                  What we call "morality" in the digital sphere is often just a set of <RedactionInline isOperate={mode === "OPERATE"} permanent plainText={plainTextMode}>unilateral constraints</RedactionInline> that only the honest follow. This creates a massive, unmonitored surface area for bad actors to exploit.
                </p>
                <ExhibitCard 
                  id="01"
                  title="NARRATIVE_DECAY_AUDIT"
                  source="Internal memo from the 2024 Trust & Safety Collapse. Documenting the shift from protection to censorship."
                  threat="Social engineering of internal validators using moral imperatives."
                  implication="Total loss of infrastructure neutrality within 18 months."
                />
              </>
            )}
            {completedActs.includes(1) && <Stamp text="VERIFIED" rotated={-5} />}
          </div>
        );
      case 2:
        return (
          <div className="prose prose-2xl max-w-none space-y-12 opacity-95 leading-relaxed font-serif text-ink-black/90">
            {role !== "ANALYST" && (
              <div className="bg-dossier-blue/5 border-l-4 border-dossier-blue p-6 font-mono text-[10px] uppercase tracking-widest text-dossier-blue font-black">
                FIELD_NOTE: Attention loops are most vulnerable during low-latency synchronization events.
              </div>
            )}
            {mode === "BRIEF" ? (
              <div className="space-y-8 italic border-l-4 border-star-gold pl-8">
                <p>Authenticity is the currency of the digital age. Narrative is not just a story; it is a protocol that directs energy, attention, and capital. Without a sovereign narrative, you are an asset in someone else's campaign.</p>
                <ul className="space-y-2 not-italic font-mono text-sm uppercase">
                  <li>• Attention is finite</li>
                  <li>• Narrative is an API for the mind</li>
                  <li>• Unaudited stories are dangerous code</li>
                </ul>
              </div>
            ) : (
              <>
                <p>
                  In a world of infinite data, <RedactionInline isOperate={mode === "OPERATE"} plainText={plainTextMode}>Attention is the only finite resource</RedactionInline>. Narrative is the API we use to access it. If you do not control the narrative layer of your stack, you are effectively running code you haven't audited.
                </p>
                <p>
                  Authenticity cannot be faked, but it can be <RedactionInline isOperate={mode === "OPERATE"} permanent plainText={plainTextMode}>harvested</RedactionInline>. The modern attention economy is a giant combine harvester, stripping the meaning from genuine human connection and turning it into engagement metrics.
                </p>
                <CaptureSimulator />
                <ExhibitCard 
                  id="02"
                  title="ATTENTION_LOOP_VULNERABILITY"
                  source="Psychographic profile of the 'Trance' state. Analyzing dopamine-narrative convergence."
                  threat="Algorithmic capture of the decision-making prefrontal cortex."
                  implication="Individual agency becomes a secondary function of the network."
                />
              </>
            )}
            {completedActs.includes(2) && <Stamp text="CLASSIFIED" rotated={3} />}
          </div>
        );
      case 3:
        return (
          <div className="prose prose-2xl max-w-none space-y-12 opacity-95 leading-relaxed font-serif text-ink-black/90">
            {mode === "BRIEF" ? (
              <div className="space-y-8 italic border-l-4 border-star-gold pl-8">
                <p>Infrastructure is dual-use. Every technical system is a parallel attack surface for narrative warfare. To defend the stack, you must defend the operator's consciousness.</p>
                <ul className="space-y-2 not-italic font-mono text-sm uppercase">
                  <li>• Bits and bytes vs. Hearts and minds</li>
                  <li>• Security is holistic</li>
                  <li>• trances are the primary threat vector</li>
                </ul>
              </div>
            ) : (
              <>
                <p>
                  We are fighting a war on two fronts: the technical and the psychological. One is about bits and bytes; the other is about hearts and minds. You cannot win one without the other.
                </p>
                <TwoFrontSimulator />
                <p className="text-xl opacity-70 border-l-4 border-stamp-red pl-8 italic font-black leading-tight uppercase tracking-tight py-4 bg-stamp-red/5 text-ink-black">
                  "The most secure server in the world is useless if the operator is under a trance."
                </p>
              </>
            )}
          </div>
        );
      case 4:
        return (
          <div className="prose prose-2xl max-w-none space-y-12 opacity-95 leading-relaxed font-serif text-ink-black/90">
            {mode === "BRIEF" ? (
              <div className="space-y-8 italic border-l-4 border-star-gold pl-8">
                <p>Technology is a weapon. Acceptance of this dual-use reality is the first step toward stewardship. Sovereignty is the capacity to say "No" to the network and operate independently.</p>
                <ul className="space-y-2 not-italic font-mono text-sm uppercase">
                  <li>• Acceptance &gt; Avoidance</li>
                  <li>• Stewardship of power</li>
                  <li>• Out-of-band resilience</li>
                </ul>
              </div>
            ) : (
              <>
                <p>
                  Technology is not a tool; it is a weapon. Every piece of code is a dual-use asset. To build is to create power, and power is never neutral. We must accept the sword to wield the shield.
                </p>
                <ExhibitCard 
                  id="03"
                  title="DUAL_USE_MANIFESTO"
                  source="Declassified internal strategy. Moving from 'Don't be Evil' to 'Be Accountable'."
                  threat="Fear-based paralysis leading to abandonment of key strategic infrastructure."
                  implication="Relinquishing the field to actors with zero ethical constraints."
                />
                <p>
                  Sovereignty is the ability to say "No" to the network. It is the capacity to operate <RedactionInline isOperate={mode === "OPERATE"} permanent plainText={plainTextMode}>out of band</RedactionInline> when the primary channels are compromised.
                </p>
                <SovereignKeyGenerator />
              </>
            )}
            {completedActs.includes(4) && <Stamp text="SOVEREIGN" rotated={-10} />}
          </div>
        );
      case 5:
        return (
          <div className="prose prose-2xl max-w-none space-y-12 opacity-95 leading-relaxed font-serif text-ink-black/90">
            {mode === "BRIEF" ? (
              <div className="space-y-8 italic border-l-4 border-star-gold pl-8">
                <p>The interface is the mediator of power. Opaque interfaces create subjects; transparent interfaces create operators. Audit the edge where human and machine meet.</p>
                <ul className="space-y-2 not-italic font-mono text-sm uppercase">
                  <li>• Transparency is accountability</li>
                  <li>• Manual overrides are essential</li>
                  <li>• Friction can be a feature</li>
                </ul>
              </div>
            ) : (
              <>
                <p>
                  The interface is the point of contact between the system and the human. It is where power is mediated. If the interface is opaque, the user is a subject. If it is transparent, the user is an operator.
                </p>
                <InterfaceChecklist />
              </>
            )}
          </div>
        );
      case 6:
        return (
          <div className="prose prose-2xl max-w-none space-y-12 opacity-95 leading-relaxed font-serif text-ink-black/90">
            {mode === "BRIEF" ? (
              <div className="space-y-8 italic border-l-4 border-star-gold pl-8">
                <p>The capability gap is a strategic vulnerability. Literacy in narrative warfare, OPSEC, and sovereign infrastructure is the only long-term defense against capture.</p>
                <ul className="space-y-2 not-italic font-mono text-sm uppercase">
                  <li>• Operators &gt; Consumers</li>
                  <li>• Epistemological hygiene</li>
                  <li>• Applied literacy nodes</li>
                </ul>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-12 my-12">
                  {[
                    { cat: "Intel & Counterintel", items: ["Basic OPSEC for Builders", "The Psychology of Influence"] },
                    { cat: "Info Ops", items: ["Narrative Warfare 101", "Counter-meme Deployment"] },
                    { cat: "Security", items: ["Supply Chain Sovereignty", "Hardware Hardening"] },
                    { cat: "Sovereignty", items: ["Exit Protocols", "Parallel Infrastructure"] }
                  ].map(cat => (
                    <div key={cat.cat} className="p-8 border border-ink-black/10 bg-white/50 backdrop-blur-sm">
                      <h5 className="font-mono text-xs font-black uppercase tracking-[0.2em] mb-4 text-stamp-red flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> {cat.cat}
                      </h5>
                      <ul className="space-y-3 font-mono text-[10px] uppercase font-bold tracking-tight text-ink-black/60">
                        {cat.items.map(i => <li key={i} className="flex gap-2 text-ink-black"><span className="text-star-gold">»</span> {i}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
                <p>
                  We are raising a generation of consumers, not operators. Literacy is the first line of defense. Without it, the most secure infrastructure will eventually be handed over to the adversary.
                </p>
              </>
            )}
          </div>
        );
      case 7:
        return (
          <div className="space-y-16">
            <div className="prose prose-2xl max-w-none opacity-95 leading-relaxed font-serif text-ink-black/90 text-center">
              <p className="text-2xl font-medium max-w-2xl mx-auto italic opacity-80 text-ink-black">
                The trance is a choice. The wake is a responsibility. Choose your posture.
              </p>
            </div>
            <PostureTerminal />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-all duration-1000 selection:bg-stamp-red selection:text-white relative",
      isWoke ? "bg-white text-ink-black grayscale-0 contrast-125" : "bg-substrate-paper text-ink-black",
      plainTextMode ? "font-sans" : "font-serif"
    )}>
      <AnimatePresence>
        {showBoot && <BootSequence onComplete={() => setShowBoot(false)} />}
      </AnimatePresence>

      {!isWoke && (
        <div className="contents">
          <div className="fixed inset-0 pointer-events-none opacity-[0.06] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] z-50 mix-blend-multiply" />
          <div className="fixed inset-0 pointer-events-none opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/dust.png')] z-50" />
          <div className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.03] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1 animate-scanline pointer-events-none" />
          </div>
        </div>
      )}

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline {
          animation: scanline 10s linear infinite;
        }
      `}</style>

      {!plainTextMode && (
        <div className="fixed left-2 top-0 bottom-0 flex flex-col justify-around py-20 pointer-events-none z-[60] opacity-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-ink-black shadow-inner border border-white/5" />
          ))}
        </div>
      )}

      {!isFocusMode && <StarRailNav acts={acts} activeAct={activeAct} scrollPerc={scrollPerc} />}

      <header className="fixed top-0 left-0 right-0 z-[100] px-10 py-6 flex justify-between items-center mix-blend-multiply border-b border-ink-black/5 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="font-mono font-black text-xl tracking-tighter flex items-center gap-3 uppercase cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-5 h-5 bg-stamp-red flex items-center justify-center text-white text-[8px]">!</div>
            HAND_OF_GOD
          </div>
          <div className="hidden md:flex items-center gap-4 border-l border-ink-black/10 pl-6 font-mono text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">
            <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SECURE_CORE</span>
            <span>20.01.2026</span>
          </div>
        </div>
        <button 
          onClick={() => setIsPaletteOpen(true)}
          className="hidden lg:flex items-center gap-4 font-mono text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-ink-black transition-colors bg-transparent border-none cursor-pointer"
        >
          <Search className="w-3 h-3" />
          <span>CMD+K TO SEARCH_DOSSIER</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-10 md:px-24 pt-48 pb-64 grid lg:grid-cols-[1fr_340px] gap-20">
        <div className="space-y-48">
          {/* Act 0: Hero */}
          <section id="act-hero" data-act-idx={0} className="min-h-[70vh] flex flex-col justify-center relative">
            <div className="max-w-3xl space-y-10">
              <div className="font-mono text-xs font-black text-stamp-red flex items-center gap-2 uppercase tracking-[0.3em]">
                <span className="w-1.5 h-1.5 bg-stamp-red animate-pulse" /> CLASSIFIED_BRIEFING // 0224 // TOP_SECRET
              </div>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                Culture is the <br /> 
                <span className="text-transparent border-t-8 border-b-8 border-ink-black px-4 my-4 block relative group" style={{ WebkitTextStroke: "2px var(--ink-black)" }}>
                  Surface
                  <div className="absolute -top-4 -right-4 w-12 h-12 border-4 border-stamp-red opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              </h1>
              <p className="text-2xl md:text-4xl leading-snug font-medium opacity-90 max-w-2xl font-serif italic tracking-tight text-ink-black">
                A declassified-briefing turned interactive dossier. Explore the dual-use infrastructure of the digital age.
              </p>
              <div className="pt-12 flex items-center gap-8">
                <a href="#act-myth_of_morality" className="inline-flex items-center gap-6 group">
                  <div className="w-20 h-20 rounded-full border-4 border-ink-black flex items-center justify-center group-hover:bg-ink-black group-hover:text-white transition-all duration-300 shadow-[6px_6px_0px_var(--stamp-red)] active:shadow-none active:translate-x-1 active:translate-y-1">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                  <span className="font-mono font-black text-xs tracking-[0.4em] uppercase border-b-2 border-transparent group-hover:border-stamp-red transition-all pb-1 text-ink-black">INITIATE_DECLASS</span>
                </a>
              </div>
            </div>
          </section>

          {acts.slice(1).map((act, idx) => (
            <section key={act.id} id={`act-${act.id}`} data-act-idx={idx + 1} className="scroll-mt-48">
              <TornEdge />
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="font-mono text-[11px] text-stamp-red font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                  <span className="w-3 h-px bg-stamp-red" /> {act.code} // {act.title}
                </div>
                <h2 className="text-6xl md:text-8xl font-black mb-16 tracking-tighter uppercase leading-[0.85] text-ink-black">
                  {act.title.split(' ').map((w, i) => i === act.title.split(' ').length - 1 ? <span key={i} className="text-star-gold italic underline decoration-stamp-red/30 decoration-wavy underline-offset-8">{w}</span> : w + ' ')}
                </h2>
                {idx + 1 < acts.length - 1 && (
                  <BriefingBox items={[
                    `Identify the primary ${systemCardStates[idx+1].surface} vulnerability.`,
                    `Deploy ${systemCardStates[idx+1].controls} to mitigate ${systemCardStates[idx+1].failure}.`,
                    `Audit the system via the ${systemCardStates[idx+1].metric} benchmark.`
                  ]} />
                )}
                {renderActContent(idx + 1)}
              </div>
            </section>
          ))}
          
          <footer className="pt-32 pb-64 text-center space-y-8">
            <div className="w-px h-24 bg-ink-black/20 mx-auto" />
            <div className="font-mono text-[10px] text-gray-400 uppercase tracking-[0.5em]">
              END_OF_TRANSMISSION // HAND_OF_GOD // 2026
            </div>
            <div className="flex justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all">
              <div className="w-12 h-12 bg-ink-black/10 rounded-full" />
              <div className="w-12 h-12 bg-ink-black/10 rounded-full" />
              <div className="w-12 h-12 bg-ink-black/10 rounded-full" />
            </div>
          </footer>
        </div>

        {!isFocusMode && (
          <aside className="hidden lg:block">
            <SystemCard activeAct={activeAct} role={role} data={systemCardStates} />
          </aside>
        )}
      </main>

      <CommandDock 
        plainTextMode={plainTextMode}
        setPlainTextMode={setPlainTextMode}
        isAudioMode={isAudioMode}
        setIsAudioMode={setIsAudioMode}
        isWoke={isWoke}
        setIsWoke={setIsWoke}
        isFocusMode={isFocusMode}
        setIsFocusMode={setIsFocusMode}
        mode={mode}
        setMode={setMode}
        role={role}
        setRole={setRole}
        onShare={() => {
          setShareText(`[DOSSIER_SUMMARY] Active Act: AX-0${activeAct} // Mode: ${mode} // Role: ${role}. Posture: SOVEREIGN.`);
          setIsShareOpen(true);
        }}
      />

      <SelectionTooltip onExecute={(text) => {
        setShareText(text);
        setIsShareOpen(true);
      }} />

      <SubliminalFeed isActive={isAudioMode} />

      <ShareCardComposer 
        text={shareText} 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
      />

      <CommandPalette 
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        acts={acts}
        onNavigate={(id) => {
          const el = document.getElementById(`act-${id}`);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

const SelectionTooltip = ({ onExecute }: { onExecute: (text: string) => void }) => {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState("");

  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 5) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        if (rect) {
          setPos({ x: rect.left + rect.width / 2, y: rect.top + window.scrollY - 10 });
          setSelectedText(text);
          setVisible(true);
        }
      } else {
        setVisible(false);
      }
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
    >
      <div className="w-1.5 h-1.5 bg-stamp-red animate-pulse" />
      <span>Classify Selection?</span>
      <button 
        onClick={() => {
          onExecute(selectedText);
          setVisible(false);
        }}
        className="hover:text-star-gold border-l border-white/20 pl-3 transition-colors bg-transparent border-none cursor-pointer"
      >
        Execute
      </button>
    </motion.div>
  );
};

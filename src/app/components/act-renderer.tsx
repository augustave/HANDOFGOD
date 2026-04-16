import { BookOpen } from "lucide-react";
import { EDUCATION_NODES, EXHIBITS } from "../data/dossier";
import type { ExperienceMode, SecurityRole } from "../types";
import { BriefingBox, RedactionInline, Stamp } from "./dossier-components";
import { EvidenceWall } from "./evidence-wall";
import { ExhibitCard } from "./exhibit-card";
import { InterfaceChecklist } from "./interface-checklist";
import { PostureTerminal } from "./posture-terminal";
import { CaptureSimulator } from "./capture-simulator";
import { SovereignKeyGenerator } from "./sovereign-key-generator";
import { TwoFrontSimulator } from "./two-front-simulator";
import { BriefSummary } from "./brief-summary";

interface ActRendererProps {
  idx: number;
  completedActs: number[];
  mode: ExperienceMode;
  role: SecurityRole;
  plainTextMode: boolean;
}

const proseClass = "prose prose-2xl max-w-none space-y-12 opacity-95 leading-relaxed font-serif text-ink-black/90";

export function ActRenderer({ idx, completedActs, mode, role, plainTextMode }: ActRendererProps) {
  switch (idx) {
    case 1:
      return (
        <div className={proseClass}>
          {role === "COMMANDER" && (
            <div className="bg-stamp-red/5 border-l-4 border-stamp-red p-6 font-mono text-[10px] uppercase tracking-widest text-stamp-red font-black">
              COMMANDER_EYES_ONLY: Morality is a containment protocol. Break it only when structural integrity is at 0%.
            </div>
          )}
          {mode === "BRIEF" ? (
            <BriefSummary summaryKey="myth_of_morality" />
          ) : (
            <>
              <p>
                The first rule of the new world is this:{" "}
                <RedactionInline isOperate={mode === "OPERATE"} plainText={plainTextMode}>Legibility is a weapon</RedactionInline>.
                If a system is designed to be invisible, it is designed to be unaccountable. We were told that the internet would
                democratize information, but it instead industrialized capture.
              </p>
              <EvidenceWall />
              <p>
                What we call "morality" in the digital sphere is often just a set of{" "}
                <RedactionInline isOperate={mode === "OPERATE"} permanent plainText={plainTextMode}>unilateral constraints</RedactionInline>{" "}
                that only the honest follow. This creates a massive, unmonitored surface area for bad actors to exploit.
              </p>
              <ExhibitCard {...EXHIBITS.myth_of_morality} />
            </>
          )}
          {completedActs.includes(1) && <Stamp text="VERIFIED" rotated={-5} />}
        </div>
      );
    case 2:
      return (
        <div className={proseClass}>
          {role !== "ANALYST" && (
            <div className="bg-dossier-blue/5 border-l-4 border-dossier-blue p-6 font-mono text-[10px] uppercase tracking-widest text-dossier-blue font-black">
              FIELD_NOTE: Attention loops are most vulnerable during low-latency synchronization events.
            </div>
          )}
          {mode === "BRIEF" ? (
            <BriefSummary summaryKey="authentic_narrative" />
          ) : (
            <>
              <p>
                In a world of infinite data,{" "}
                <RedactionInline isOperate={mode === "OPERATE"} plainText={plainTextMode}>Attention is the only finite resource</RedactionInline>.
                Narrative is the API we use to access it. If you do not control the narrative layer of your stack, you are effectively
                running code you haven't audited.
              </p>
              <p>
                Authenticity cannot be faked, but it can be{" "}
                <RedactionInline isOperate={mode === "OPERATE"} permanent plainText={plainTextMode}>harvested</RedactionInline>.
                The modern attention economy is a giant combine harvester, stripping the meaning from genuine human connection and
                turning it into engagement metrics.
              </p>
              <CaptureSimulator />
              <ExhibitCard {...EXHIBITS.authentic_narrative} />
            </>
          )}
          {completedActs.includes(2) && <Stamp text="CLASSIFIED" rotated={3} />}
        </div>
      );
    case 3:
      return (
        <div className={proseClass}>
          {mode === "BRIEF" ? (
            <BriefSummary summaryKey="two_front" />
          ) : (
            <>
              <p>
                We are fighting a war on two fronts: the technical and the psychological. One is about bits and bytes; the other is
                about hearts and minds. You cannot win one without the other.
              </p>
              <TwoFrontSimulator />
              <p className="text-xl opacity-70 border-l-4 border-stamp-red pl-8 italic font-black leading-tight uppercase tracking-normal py-4 bg-stamp-red/5 text-ink-black">
                "The most secure server in the world is useless if the operator is under a trance."
              </p>
            </>
          )}
        </div>
      );
    case 4:
      return (
        <div className={proseClass}>
          {mode === "BRIEF" ? (
            <BriefSummary summaryKey="sovereign" />
          ) : (
            <>
              <p>
                Technology is not a tool; it is a weapon. Every piece of code is a dual-use asset. To build is to create power, and
                power is never neutral. We must accept the sword to wield the shield.
              </p>
              <ExhibitCard {...EXHIBITS.sovereign} />
              <p>
                Sovereignty is the ability to say "No" to the network. It is the capacity to operate{" "}
                <RedactionInline isOperate={mode === "OPERATE"} permanent plainText={plainTextMode}>out of band</RedactionInline>{" "}
                when the primary channels are compromised.
              </p>
              <SovereignKeyGenerator />
            </>
          )}
          {completedActs.includes(4) && <Stamp text="SOVEREIGN" rotated={-10} />}
        </div>
      );
    case 5:
      return (
        <div className={proseClass}>
          {mode === "BRIEF" ? (
            <BriefSummary summaryKey="operational_interfaces" />
          ) : (
            <>
              <p>
                The interface is the point of contact between the system and the human. It is where power is mediated. If the interface
                is opaque, the user is a subject. If it is transparent, the user is an operator.
              </p>
              <InterfaceChecklist />
            </>
          )}
        </div>
      );
    case 6:
      return (
        <div className={proseClass}>
          {mode === "BRIEF" ? (
            <BriefSummary summaryKey="education" />
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-12 my-12">
                {EDUCATION_NODES.map((cat) => (
                  <div key={cat.cat} className="p-8 border border-ink-black/10 bg-white/50 backdrop-blur-sm">
                    <h5 className="font-mono text-xs font-black uppercase tracking-[0.2em] mb-4 text-stamp-red flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> {cat.cat}
                    </h5>
                    <ul className="space-y-3 font-mono text-[10px] uppercase font-bold tracking-normal text-ink-black/60">
                      {cat.items.map((item) => (
                        <li key={item} className="flex gap-2 text-ink-black">
                          <span className="text-star-gold">-</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p>
                We are raising a generation of consumers, not operators. Literacy is the first line of defense. Without it, the most
                secure infrastructure will eventually be handed over to the adversary.
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
}

export function ActBriefing({ idx }: { idx: number }) {
  const state = EXHIBIT_BRIEFING_STATES[idx];
  if (!state) return null;
  return <BriefingBox items={state} />;
}

const EXHIBIT_BRIEFING_STATES: Record<number, string[]> = {
  1: [
    "Identify the primary Moral Authority vulnerability.",
    "Deploy Structural Integrity to mitigate Ideological Capture.",
    "Audit the system via the Resilience benchmark.",
  ],
  2: [
    "Identify the primary Dopaminergic Loops vulnerability.",
    "Deploy Friction Injection to mitigate Algorithmic Capture.",
    "Audit the system via the Agency Score benchmark.",
  ],
  3: [
    "Identify the primary Parallel Attack vulnerability.",
    "Deploy Sovereign Stack to mitigate Dual-Use Leakage.",
    "Audit the system via the Strategic Depth benchmark.",
  ],
  4: [
    "Identify the primary Willful Command vulnerability.",
    "Deploy Accepting the Sword to mitigate Strategic Paralysis.",
    "Audit the system via the Decisiveness benchmark.",
  ],
  5: [
    "Identify the primary Cognitive Load vulnerability.",
    "Deploy Legibility Frameworks to mitigate Interface Opacity.",
    "Audit the system via the Literacy benchmark.",
  ],
  6: [
    "Identify the primary Mental Models vulnerability.",
    "Deploy Literacy Nodes to mitigate Capability Gap.",
    "Audit the system via the Outcome benchmark.",
  ],
};

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
              COMMANDER_EYES_ONLY: The late Pope Francis — a die-hard San Lorenzo fan — would have been hard-pressed to call it a foul. The only lie a Pope could tell as God's representative on earth.
            </div>
          )}
          {mode === "BRIEF" ? (
            <BriefSummary summaryKey="myth_of_morality" />
          ) : (
            <>
              <p>
                In 1986, Diego Maradona scored the most infamous goal in football history. Argentina vs. England, World Cup
                quarterfinal. The ball dropped into the box, Maradona rose, and it went in—off a hand the referee didn't see.
                Later he called it <em>La Mano de Dios</em>: the Hand of God. People still argue about that moment like it's
                theology. But the interesting question isn't the morality. It's{" "}
                <RedactionInline isOperate={mode === "OPERATE"} plainText={plainTextMode}>why it became a national myth</RedactionInline>.
              </p>
              <p>
                I learned that the hard way. First day of school in Buenos Aires, where my father had just been posted as a
                diplomat. I had maybe two sentences of Spanish, and recess was a wall of noise I couldn't parse. A kid walked up
                and asked—in words I could barely decode but whose meaning was unmistakable—whether Maradona's goal was valid.
                Was I pro-English, or else? It wasn't a debate about rules. It was{" "}
                <RedactionInline isOperate={mode === "OPERATE"} permanent plainText={plainTextMode}>a belonging test</RedactionInline>.
              </p>
              <EvidenceWall />
              <p>
                The uncomfortable insight isn't "cheating is good." It's that people unify around capability and will—especially
                when official channels feel rigged against them. A shared myth can work like a cultural immune response: it
                compresses complexity into a story that restores agency.
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
              FIELD_NOTE: A good man is a very dangerous man who has that under voluntary control. The sector inverted it.
            </div>
          )}
          {mode === "BRIEF" ? (
            <BriefSummary summaryKey="authentic_narrative" />
          ) : (
            <>
              <p>
                There's a peculiar reflex in American tech: the faster someone builds something powerful, the more urgently they
                perform uncertainty about whether it should exist at all. Caution is wisdom.{" "}
                <RedactionInline isOperate={mode === "OPERATE"} plainText={plainTextMode}>Performative caution is something else</RedactionInline>
                —narrating your own self-handicapping as morality, treating defenselessness as virtue and calling it "principle."
              </p>
              <p>
                We built extraordinary power, then refused to acknowledge it, secure it, or wield it. That's not virtue. That's{" "}
                <RedactionInline isOperate={mode === "OPERATE"} permanent plainText={plainTextMode}>leaving loaded weapons in unlocked rooms</RedactionInline>{" "}
                and calling it peace. In the Prisoner's Dilemma, the worst outcome isn't mutual conflict—it's the Sucker's Payoff:
                you cooperate while the other side defects. It feels virtuous from the inside. Strategically, it's a donation.
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
                A serious intelligence operation has at least two components: Tech, and PSYOP. We can field the best cyberwarfare
                units in the world and run the most advanced AI labs—win the technology side completely—and still lose, because
                the second front targets something no firewall covers: a society's willingness to defend its own advantage.
              </p>
              <TwoFrontSimulator />
              <ExhibitCard {...EXHIBITS.two_front} />
              <p className="text-xl opacity-70 border-l-4 border-stamp-red pl-8 italic font-black leading-tight uppercase tracking-normal py-4 bg-stamp-red/5 text-ink-black">
                "The simplest way to beat a strong country is to convince it to sabotage itself."
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
                If you're designing communication infrastructure, cloud platforms, AI systems, social networks, supply chain
                software—anything that shapes coordination at scale—you are not "just" building a product. You're building{" "}
                <RedactionInline isOperate={mode === "OPERATE"} plainText={plainTextMode}>dual-use infrastructure</RedactionInline>.
                The boundary between "civilian tech" and "national security" didn't dissolve because anyone signed a treaty. It
                dissolved because software became the terrain.
              </p>
              <ExhibitCard {...EXHIBITS.sovereign} />
              <p>
                The question isn't whether product designers are part of the national security architecture. We already are. The
                question is whether we understand the threat models of what we're building. Ethics require{" "}
                <RedactionInline isOperate={mode === "OPERATE"} permanent plainText={plainTextMode}>recognizing intent</RedactionInline>.
                Treating hostile and friendly actors as morally equivalent isn't sophistication. It's negligence dressed as purity.
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
                My father worked Protocol in the Foreign Service. Seating charts were his chess. Positions at an inauguration
                aren't made off-the-cuff; they're composed—for foreign governments—the way a sentence is composed. Putting that
                stack of tech CEOs in the frame was a message: AI is a state priority now. It was the equivalent of{" "}
                <RedactionInline isOperate={mode === "OPERATE"} plainText={plainTextMode}>parading a new tank through Red Square</RedactionInline>.
              </p>
              <p>
                Look past the user interface of politics to the code underneath. The UI was wealth standing too close to power.
                The code was capacity. If your culture treats its strongest capabilities as moral stains by default, you don't
                need foreign enemies—you've already done their work. Unity in 2026 isn't chants. It's interfaces.
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
                Product designers need national security literacy because we are already assets in a national security
                architecture. Not "should be." Already are. And this is the skill we already have, pointed at a domain we've been
                avoiding: sitting with messy, adversarial, ambiguous systems without flinching—and shipping anyway. Discomfort?
                Good. Ambiguity? Good. Pressure? Good. The gap isn't aptitude. It's literacy. Comfort is not a strategy.
              </p>
            </>
          )}
        </div>
      );
    case 7:
      return (
        <div className="space-y-16">
          {role === "COMMANDER" && (
            <div className="bg-stamp-red/5 border-l-4 border-stamp-red p-6 font-mono text-[10px] uppercase tracking-widest text-stamp-red font-black">
              COMMANDER_EYES_ONLY: Jacobsen asked Waugh and Prado who would win if they had to kill each other. Each said "me."
              Then Waugh came back: "Let me tell you how I would win. I'd cheat. I'd show up before the duel and I'd kill him."
            </div>
          )}
          <div className="prose prose-2xl max-w-none opacity-95 leading-relaxed font-serif text-ink-black/90 text-center">
            <p className="text-2xl font-medium max-w-2xl mx-auto italic opacity-80 text-ink-black">
              Restraint only means something if you're capable of doing otherwise. The myth can spark; it can't steer. The trance
              ends when we accept the sword in our hands.
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
    "Identify the Outsider Test vulnerability in the belonging protocol.",
    "Deploy the Cultural Immune Response to mitigate Subversion Fever.",
    "Audit the system via the Unity Under Pressure benchmark.",
  ],
  2: [
    "Identify the Performative Caution vulnerability in builder confidence.",
    "Deploy Capability Without Apology to avoid the Sucker's Payoff.",
    "Audit the system via the Strategic Maturity benchmark.",
  ],
  3: [
    "Identify the second front: PSYOP targeting the will to defend advantage.",
    "Deploy Counter-Narrative Literacy to mitigate Self-Sabotage.",
    "Audit the system via the Willingness to Defend Advantage benchmark.",
  ],
  4: [
    "Identify open-research defaults and supply chain opacity as attack surface.",
    "Deploy OpSec, Selective Openness, and Valley↔DC interfaces.",
    "Audit via Innovation Lead Without Legitimacy Collapse.",
  ],
  5: [
    "Identify the Cynicism Reflex: reading national capacity as shame.",
    "Deploy Protocols, Not Vibes — shared threat models, export controls, supply-chain security.",
    "Audit the system via the Interface Coverage benchmark.",
  ],
  6: [
    "Identify Comfort as the vulnerability in designer temperament.",
    "Deploy literacy nodes: intel, info ops, supply chain, strategy.",
    "Audit the system via the Adult Realism benchmark.",
  ],
};

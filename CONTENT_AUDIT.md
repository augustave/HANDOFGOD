# Content Audit — Site ("The Case File") vs Essay (FINAL_DRAFT v3)

Audited June 6, 2026. Verdict per act: **PORT** (replace with essay content) · **KEEP** (component/structure stays) · **CUT** (copy retired).

## The headline problem
The site shares the essay's vocabulary (trance, sword, dual-use, wake) but none of its substance. Zero occurrences in src/ or dist/ of: Maradona, Buenos Aires, Falklands, Bezmenov, DeepSeek, Pentagon, rare earths, Waugh, the inauguration. The April build froze an abstract iteration of the argument; the essay matured past it. The fix is a content swap — the 8-act skeleton, interaction modes, and simulators map almost perfectly onto the final essay.

## Act-by-act mapping

| Act | Site (April) | Essay (June) | Decision |
|---|---|---|---|
| AX-00 hero | "Culture is the Surface" — generic dossier intro | Title + hook: "The Hand of God" | **PORT** — retitle hero, new subtitle |
| AX-01 | "The Myth of Morality" — "legibility is a weapon," internet-capture copy | **The Belonging Test** — Maradona, recess scene, cultural immune response | **PORT** — the essay's irreplaceable opening was entirely absent |
| AX-02 | "The Authentic Narrative" — attention-economy copy + CaptureSimulator | **The Trance of Performative Goodness** + Sucker's Payoff | **PORT** — CaptureSimulator **KEEP** (fits the trance perfectly) |
| AX-03 | "The Two-Front War" — generic bits-vs-minds + TwoFrontSimulator | **The Two-Part Attack** — Tech + PSYOP, Pentagon "national total war," DeepSeek evidence | **PORT** — title **KEEP** (a unit test asserts it); simulator **KEEP**; add evidence exhibit |
| AX-04 | "The Sovereign" — "say No to the network" + key generator | **The Sword You Pretend Not to Hold** — dual-use, threat model, rare earths | **PORT** — the site's system-card shape (Asset/Surface/Failure/Controls/Metric) is literally the essay's table; fill it with the real one |
| AX-05 | "Operational Interfaces" — opaque-vs-transparent UI copy + InterfaceChecklist | **What Unity Actually Looks Like** — the Protocol-officer inauguration read + "Not vibes. Protocols." | **PORT** — checklist **KEEP** (the essay's protocol list IS a checklist) |
| AX-06 | "The Education" — generic literacy nodes ("Counter-meme Deployment") | **The Education Gap** — the real literacy list + CPO cadence | **PORT** — replace node content |
| AX-07 | "Operate on Wake" — "the trance is a choice" + PostureTerminal | **Hand of God ≠ Instruction Manual + Strength Precedes Virtue** — Waugh story, guardrails, indictment ending | **PORT** — PostureTerminal **KEEP** |

## Supporting data structures (all in `src/app/data/dossier.ts`)

- **SYSTEM_CARD_STATES** — abstract entries ("Foundational Myth / Cynicism Decay") → **PORT**: essay-grounded threat models per act.
- **EXHIBITS** — three fabricated documents ("2024 Trust & Safety Collapse memo," "psychographic profile") → **PORT**: replace with *verified* evidence from FACTCHECK.md (Falklands context, House Select Committee/DeepSeek, rare-earth chokepoint, Pentagon report). The site currently presents invented exhibits as documentary fact — same failure mode the essay's fact-check caught.
- **BRIEF_SUMMARIES** — abstract → **PORT** from essay sections.
- **EDUCATION_NODES** — "Counter-meme Deployment," "Exit Protocols" → **PORT**: the essay's actual literacy list.
- **Eyes-only / field notes** — "Morality is a containment protocol" → **PORT**: Pope Francis aside (COMMANDER), Bezmenov (field note), Waugh quote (COMMANDER, final act).

## Constraints respected
- `command-palette.test.tsx` asserts the act title "The Two-Front War" → title kept.
- `capture-simulator.test.tsx` asserts internal component strings → component untouched.
- BRIEF_SUMMARIES/EXHIBITS object keys kept stable (only values changed) so no type/import breakage.

## What I should remember
- The site's *interactions* were always right — simulators, redactions, role-gated notes map one-to-one onto the essay's ideas. Only the words were placeholders.
- The site repeated the swarm's failure mode: invented exhibits presented as evidence. Post-sync, every exhibit traces to FACTCHECK.md.

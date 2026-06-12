# HAND_OF_GOD: Strategic Literacy Engine

**HAND_OF_GOD** is an interactive essay that evaluates its reader. V1 was a "declassified dossier" reading experience; V2 turns it into a **Strategic Literacy Simulator**: the doctrine doesn't just present itself — it assesses your understanding, adapts to your choices, and debriefs you with a personalized posture report. Everything is computed locally; no telemetry.

## 🧭 The Journey: READ → ASSESS → OPERATE → DEBRIEF

The dock tracks four phases. Nothing blocks the essay — phases are progress tracks, and only the final report is earned:

- **READ** — The 8-act essay ("The Hand of God Problem"). Sections count as read after sustained presence (no fly-by scoring). READ ALL renders the full continuous article.
- **ASSESS** — Field assessments after each act: three postures per question, no right answers. Committing logs hidden dimension weights, reveals the counter-read, and **declassifies that act's inline redactions**.
- **OPERATE** — Four operation scenarios (the Disclosure Dilemma, the DeepSeek Moment, Chokepoint Response, the Seating Chart): situation → A/B/C → GAINED / EXPOSED / SECOND_ORDER tradeoffs. The simulators report real signals: the two-front sliders log projections, capture mitigations score operational thinking, and the posture terminal's commitment finally lands somewhere.
- **DEBRIEF** — The **Strategic Mirror** unseals after reading 5 sections, logging 4 assessments, and running 1 operation: posture distribution (Watcher / Architect / Sovereign), 6-dimension literacy profile with exposure radar, strengths and blind spots with study recommendations, key judgments, an evidence trail of every scored response, and exports (print / Markdown / SVG card).

## 📊 The Profile Engine

Six dimensions, scored 0–100 from raw signals (assessments ×1.0, scenarios ×1.5, simulators ×0.5, reading ×1.0), normalized against the content bank so scores can never leave range:

`Narrative Literacy · Institutional Trust · Capability Orientation · Strategic Realism · System Awareness · Operational Thinking`

The **exposure radar** in the system card plots `100 − literacy` per axis — the threat readout is finally real data. Raw signals persist to `localStorage` (versioned, migration-safe); derived scores are recomputed on every load and never trusted from disk. `BURN SESSION` (command palette) erases everything.

## 🗺 Knowledge Layer

- **Strategic Terrain** (act 6): an 8-node knowledge graph — Narratives, Information Warfare, Product Design, Infrastructure, Supply Chains, State Capacity, Manufacturing, Defense. Reading acts unlocks nodes; relationships illuminate when both endpoints unlock.
- **Declassified extras**: case studies, counterarguments, and red-team memos against the essay's own thesis, gated behind explicit, named requirements — never a mystery lock.
- **Adversarial lens**: every act has a `VIEW_AS_ADVERSARY` toggle — objective, three attack vectors, and the counter. Threat modeling by inversion.
- **Role lenses**: ANALYST (understanding) / OPERATOR (action) / COMMANDER (second-order effects) reframe each act with a focus and a question to hold — same content, different lens, instant switching.

## 🛠 Development

```bash
pnpm dev        # local dev server
pnpm check      # typecheck + lint + unit tests + build (deploy gate)
pnpm test:e2e   # Playwright smoke + journey tests
```

Deploys to GitHub Pages on push to `main`, gated on all checks. Append `?debug=profile` to inspect the live profile, posture distribution, and unlock state.

## 💻 Tech Stack

- **Framework**: React 18 + TypeScript (strict) + Vite
- **State**: Zustand v5 with versioned localStorage persistence; pure scoring engine under `src/app/engine/`
- **Content**: TS data modules under `src/app/data/` — questions, scenarios, terrain, lenses, adversary briefs — compile-checked and contract-tested so copy edits can't break scoring
- **Styling**: Tailwind CSS v4 (`@theme` CSS variables), dossier visual identity: paper textures, stamps, torn edges, redaction bars
- **Animation**: `motion/react` — user-triggered reveals only; zero standing intervals

---
**LOCAL_ONLY // NO_TELEMETRY** // **HAND_OF_GOD** // 2026

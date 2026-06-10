# Document Map — "Hand of God" Working Doc

**Source:** [Google Doc](https://docs.google.com/document/d/1wvjJZDbhZl-KItpKzfQ3HoC_Vy67Sy27Y5mzeNbRa4Y/edit)
**Size:** ~68,000 words · 45 sections · 12 full article drafts
**Purpose (stated in doc):** Portfolio piece for Palantir/Anduril applications + Substack publication.

---

## The one-paragraph summary

This doc is the full production history of one essay — *"The Hand of God Problem: Why Product Designers Need to Learn National Security"* — drafted and redrafted across Claude, GPT-5, Gemini (AI Studio), and a custom "Cicero" agent swarm. The drafts cluster into **four families** (Origin, Claude, GPT-5, Cicero/swarm), surrounded by a research layer (China/Pentagon, Bernays, Bezmenov, Ukraine drones, Prisoner's Dilemma), editorial notes, and the code/plan for the swarm itself.

---

## Draft families & lineage

Similarity below = share of overlapping 6-word phrases between two drafts (100% = identical text, ~50% = same skeleton with heavy rewrites, <10% = different essay).

### Family O — Origin (Jan, "Tech, Unity, and the New Rules of Power")
The first full draft, before the title settled. Maradona opening is born here.
- **§3** — Peterson quotes + *First draft (full article)* (~1,500 w)
- **§11 — RAW - CLAUDE 22/01** (~8,600 w) — first draft + the raw Claude working session around it. Mostly standalone (≤10% overlap with later families); it's the ancestor, not a sibling.

### Family A — Claude lineage
- **§5 — Tab 2 / Claude 1** (1,618 w) — early Claude rewrite. 53% overlap with §8.
- **§6 — "Hybrid" version** (1,712 w) — Karp-voice experiment: same content, Alex Karp's cadence. Partial draft.
- **§8 — Tab 6** (2,911 w) — expanded Claude version.
- **§15 — Claude T7** (2,909 w) — the mature Claude draft.
- **§18 — C-T7-ANT-CRRT** (2,932 w) — corrected T7. **69% overlap with §15 → these two are the same draft, one revision apart.**

### Family B — GPT-5 lineage (the "de-risked" branch)
Distinct essay from Family A (<8% overlap). Reframes "delusion" → "myth-making," softens the subversion section ("Use Carefully").
- **§19 — C-T7-GPT5** (241 w) — change log explaining the revision logic (responds to your neon-yellow skepticism + bracket notes).
- **§20 — GPT-5 revised draft** (1,792 w)
- **§22 — C-T7-GPT5-C** (1,446 w) — cleaned. **81% overlap with §20.**
- **§41 — "#2" model-test draft** (1,830 w) — 79% overlap with §22. Same branch.

### Family C — Cicero swarm lineage
Output of the custom agent swarm. Distinct from A and B (<25% overlap).
- **§32 — Cicero AA** (1,330 w)
- **§36 — Cicero AC-F1** (1,314 w) — **99% identical to §32** (duplicate; keep one).
- **§34 — Cicero AB-F draft** (2,482 w) — the longer swarm draft, ~58% overlap with the other two.
- **§35 — Analysis AB-F** — verdict on the swarm (Jan 27, 2026): improved argument density, but let through one high-confidence overclaim ("Tit-for-Tat — the only mathematically proven strategy…").

### Compilation
- **§43 — Compiled Art #1** (9,578 w) — GAS1 session (checksum J555OHN) comparing versions to decide which is superior. Pulls most heavily from Family A (§15/§18, ~45–48% overlap).

---

## Full section index

| § | Title | Words | Type |
|---|-------|------:|------|
| 0 | 🗺 Documentation | 170 | Link hub: countervalue targeting, Ukraine, Entebbe, ASML, Pentagon China report, Bernays, Bezmenov, playground docs (RAIDERS, Stalingrad/Akin, La mano de Dios), AI chat links |
| 1 | Kelly | 401 | Kelly Johnson's 14 Skunk Works rules (full text) |
| 2 | Tab 1 | — | Tab marker |
| 3 | "A good man is a very dangerous man…" | 1,500 | Peterson quotes + **Origin first draft** |
| 4 | Tab 2 - Claude 1 | — | Tab marker |
| 5 | Hand of God Problem | 1,618 | **DRAFT — Family A** |
| 6 | "Hybrid" version | 1,712 | **DRAFT (partial) — Karp-voice variant of A** |
| 7 | Tab 6 | — | Tab marker |
| 8 | Hand of God Problem | 2,911 | **DRAFT — Family A** |
| 9 | F-Tab - 6 | 877 | Feedback on your notes (diplomat's-kid story, church bells passage — flagged as "GOLD") |
| 10 | ▪️ Raw - GAS #1 | 7,489 | Raw Gemini AI Studio session JSON (research dump, 22 links) |
| 11 | RAW - CLAUDE 22/01 | 8,646 | **Origin draft + raw Claude session** |
| 12 | Prompt - DEUS | 408 | Image-generation prompt (vintage t-shirt design) — unrelated to essay |
| 13 | Tab 8 | 151 | Process note: PDF iteration workflow |
| 14 | Claude - T7 | — | Tab marker |
| 15 | Hand of God Problem | 2,909 | **DRAFT — Family A (T7)** |
| 16 | CPO | 1,156 | Published Substack essay: *My First CPO* (Ebenz Augustave, Sep 17, 2025) — voice reference |
| 17 | SPY | 736 | Substack piece: *A Spy at the Bar / The Kindling Glass* (Aug 28, 2025) — voice reference |
| 18 | C - T7 - ANT - CRRT | 2,932 | **DRAFT — Family A (T7 corrected)** |
| 19 | C - T7 - GPT5 | 241 | GPT-5 change log (the "de-risking" rationale) |
| 20 | Hand of God Problem | 1,792 | **DRAFT — Family B** |
| 21 | C - T7 - GPT5 - C | — | Tab marker |
| 22 | Hand of God Problem | 1,446 | **DRAFT — Family B (clean)** |
| 23 | GAS-N-1 | 71 | Synthesis note: the three threads (Metaphor / History / Threat) |
| 24 | "…Why Product Design Is Now National Security" | 1,108 | Draft variant with retitled thesis (partial) |
| 25 | Notes - N - 1 | 1,233 | Raw editorial notes (Rare Earth, Billy Waugh, Von Neumann, Peterson sword quote…) |
| 26 | Claude N - 1 | 838 | Analysis: how the Pentagon "National Total War" report fits the argument |
| 27 | Tab 21 | 111 | Research question: Ukraine drone warfare (UKR: SALVA) |
| 28 | Cicero | 451 | Plan: build a national-security-writer agent swarm from Meta's Cicero |
| 29 | 🗺 Documentation 02 | — | Tab marker |
| 30 | Tab 22 | 1,817 | Pasted Meta Cicero announcement article (reference) |
| 31 | Writer | 6,358 | **ANTIGRAVITY swarm** — code scaffold + prompts for the writer swarm |
| 32 | Cicero AA | 1,330 | **DRAFT — Family C** |
| 33 | ⭕ Cicero AB-F | — | Tab marker |
| 34 | Working draft (AB-F) | 2,482 | **DRAFT — Family C (long)** |
| 35 | Analysis - AB-F | 809 | Swarm evaluation: "did Cicero work?" (yes-but; one overclaim leaked) |
| 36 | 🔁 Cicero - AC - F1 | 1,314 | **DRAFT — Family C (duplicate of §32, 99%)** |
| 37 | Prisoners | 1,158 | Research: Prisoner's Dilemma × political ideology |
| 38–40 | #1-A Model Test / #2 / prompt | 60 | Test prompt: "review the project directory, prepare a refined draft" |
| 41 | Hand of God Problem | 1,830 | **DRAFT — Family B (model test output)** |
| 42 | Tab 28 | 296 | Research synthesis: "Project LA MANO" knowledge-base digest |
| 43 | Compiled Art #1 | 9,578 | **Compilation/judging session** — which version is superior (GAS1, J555OHN) |
| 44 | Tab | — | Tab marker |

---

## The canonical argument skeleton (stable across all families)

1. Maradona / La Mano de Dios opening (1986)
2. The Trance of Performative Goodness
3. The Sword You Pretend Not to Hold
4. Demoralization / Ideological Subversion as an Attack Surface *(B-family adds "Use Carefully")*
5. What Unity Actually Looks Like (Now)
6. The Education Gap *(B-family: "My Actual Point")*
7. The Hand of God Isn't an Instruction Manual
8. Strength Precedes Virtue

---

## What I should remember

- **Latest distinct endpoints:** Family A → **§18** (C-T7-ANT-CRRT) · Family B → **§22/§41** · Family C → **§34** (AB-F). Any "final draft" decision is really a choice among these three.
- **§32 and §36 are 99% identical** — one is redundant.
- The families genuinely diverge (<10% overlap A↔B): this isn't one essay with edits, it's **three competing essays** sharing a skeleton.
- §16 (*My First CPO*) and §17 (*Spy at the Bar*) are the published voice benchmarks — useful as the tone target for any merge.
- The §35 analysis flagged a factual overclaim about Tit-for-Tat that survived the swarm — re-verify game-theory claims before publishing.
- Stated goal: portfolio piece for Palantir/Anduril + Substack (§43).

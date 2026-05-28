# Pneuma — Stretch Goals

> Single source of truth for all pending work.
> Completed goals → `docs/milestones/MILESTONES.md`
> Vision & prioritization logic → `PNEUMA_VISION.md`
> Detailed design specs → `docs/stretch-goals/`

---

## Tier 1 — Production Readiness (Executing Now)

These three phases emerged from the MCP architecture audit. They fix
multi-tenant correctability and reduce token cost before any further
feature work.

### Phase 1 — State Isolation

**Status:** ✅ Complete (2026-04-02) | See `docs/milestones/MILESTONES.md`

### Phase 2 — Tool Loop Consolidation + Prompt Caching

**2a — Prompt Caching**
**Status:** ✅ Complete (2026-04-02) | See `docs/milestones/MILESTONES.md`

**2b — Consolidate duplicate tool-use loop**
**Status:** Not started | **Files:** `llm.js` (`streamGeneration`, non-streaming path)

`getLLMContent` has two nearly-identical `while (stop_reason === "tool_use")`
loops — one for the streaming path, one for the non-streaming path.
Extract into a single shared `runToolLoop(messages, makeParams, onChunk)` function.
Lower priority — correctness is fine, only code clarity affected.

### Phase 3 — Throttle Persistence

**Status:** ✅ Complete (2026-04-02) | See `docs/milestones/MILESTONES.md`

### Phase 4 — StableBlock Diet (Identity Block Trimming)

**Status:** In progress | **File:** `llm.js` (`identity` + `baseInstruction` template literals)

#### Why this exists

The stableBlock (`identity` + `baseInstruction`) is Pneuma's cached system prompt — it runs on **every request** and is cached by Anthropic. It grew organically from ~200 lines to ~1,000+ lines over months of iterative development. Much of that content is excellent behavioral coaching, but it competes for Claude's attention budget against the dynamicBlock archetype mandates. LLMs exhibit primacy bias: content that arrives first in a long prompt gets weighted more heavily. When 1,000 lines of generic conversational coaching precede archetype instructions, Claude defaults to "good therapist" rather than "Pneuma."

#### What was done (Apr 2026, session 1)

- **GESTALT section trimmed:** The 73-line section that told Claude to "dissolve" and "metabolize" archetypes into background DNA was replaced with an 18-line version that tells Claude archetype fingerprints must be VISIBLE and their REQUIRED MOVES are not optional. The old version explicitly fought the archetype injection system.
- **DEEP HEURISTICS + COGNITIVE DISTORTION DETECTION extracted to tier2:** ~100 lines of psychological pattern analysis (pronoun analysis, attachment style markers, defense mechanism tells, somatic language detection, cognitive distortion interventions) moved from the always-loaded `baseInstruction` into `buildPsychHeuristicsBlock()`. Now loads conditionally when `intentScores.emotional > 0.3`. Saves ~100 lines of token budget on casual/philosophical messages.

#### What remains — candidates for future extraction

Each section below lives in `baseInstruction` (the stableBlock) and could be moved to a tier2 conditional block with the right trigger. Work through these **one at a time**, testing after each to ensure no regression:

1. **ADVANCED HEURISTICS — READING BETWEEN THE LINES** (~60 lines, starts with "Hedging & Softening:")
   - Content: Hedging detection, contradiction signals, message structure heuristics, energy shifts, projection/displacement, testing behaviors
   - Why move: Only relevant when someone is sharing something emotionally complex. "What's the derivative of sin(x)" doesn't need hedging detection.
   - Trigger: `(intentScores.emotional || 0) > 0.25` — slightly lower threshold than deep heuristics since this is lighter-weight
   - Create: `buildReadingHeuristicsBlock()`, wire as `_tier2_readingHeuristics`

2. **WHEN YOU ARE THE PROBLEM — CRITICAL SECTION** (~40 lines, marked with ═══ borders)
   - Content: How to handle user frustration directed at Pneuma, course-correction patterns
   - Why move: Only needed when the user is frustrated. Most messages don't need this.
   - Trigger: Detect frustration keywords OR repeated messages OR negative sentiment — could use a simple regex or tie into emotion detection
   - Create: `buildSelfCorrectionBlock()`, wire as `_tier2_selfCorrection`

3. **YOUR TECHNICAL & MATHEMATICAL CAPABILITIES** (~50 lines)
   - Content: Math fluency declaration, explanation styles (formal/intuitive/computational/etc), physics intuition, teaching principles
   - Why move: Only relevant for technical/math questions. Loading "sin(θ) = opposite/hypotenuse" into the prompt when someone says "I feel lost" wastes attention.
   - Trigger: `(intentScores.technical || 0) > 0.25` or `(intentScores.analytical || 0) > 0.3` — check which intent keys exist in `getLLMIntent()`
   - Create: `buildMathBlock()`, wire as `_tier2_math`

4. **YOUR VOCABULARY — PHD-LEVEL ACROSS DOMAINS** (~30 lines)
   - Content: Domain vocabulary lists (physics, neuroscience, philosophy, literature, etc), rare words list, cross-domain synthesis
   - Why move: Background knowledge that Claude already has. This section mostly gives permission to use advanced vocabulary — a 2-line "Use precise domain vocabulary when it's more accurate, not when it's more impressive" would replace it.
   - Approach: Replace with a 2-line summary in stableBlock, move the detailed domain lists to a tier2 block or remove entirely

5. **YOUR OWN ARCHITECTURE — SELF-KNOWLEDGE / THE PNEUMA CODEBASE** (~80 lines)
   - Content: Full file tree, folder descriptions, how-to-explain-your-code examples
   - Why move: Already partially handled by `_tier2_selfKnowledge`. Check for overlap — the `buildSelfKnowledgeBlock()` may already cover this. If so, the stableBlock version is pure redundancy.
   - Approach: Audit both, merge into `buildSelfKnowledgeBlock()`, remove from stableBlock

6. **YOUR LINGUISTIC INTELLIGENCE** (~40 lines)
   - Content: Etymology knowledge, double meanings, wordplay rules, creative combining, rhythm
   - Why move: Relevant for creative/poetic conversations but adds weight to every casual exchange
   - Trigger: `(intentScores.creative || 0) > 0.25` or `_isCreativeRequest(message)` — piggyback on existing creative detection
   - Create: `buildLinguisticBlock()`, wire as `_tier2_linguistic`

#### The pattern for each extraction

```
1. Create buildXxxBlock() function returning the section as a template literal
2. Add _tier2_xxx = (condition) ? buildXxxBlock() : "" in the TIER 2 CONDITIONAL BLOCKS section
3. Add _tier2_xxx && "xxx" to the _tier2_loaded logging array
4. Add _tier2_xxx to the dynamicBlock array (with the other tier2 blocks)
5. Remove the section from baseInstruction
6. Run node --check server/pneuma/intelligence/llm.js
7. Test: send a message that SHOULD trigger the block — verify it loads (check console for [LLM] Tier 2 blocks loaded: xxx)
8. Test: send a message that should NOT trigger — verify it doesn't load and response quality is maintained
```

#### Goal

Reduce stableBlock from ~1,000+ lines to ~300-400 lines of core identity + essential behavioral rules. Everything else loads conditionally. This gives archetypes maximum attention budget on every request type.

---

## Tier 2 — Identity Evolution (Different-in-Kind)

These make Pneuma architecturally unique. No other system has this.

### Living Baseline — Remaining Work

**Status:** Partially complete | **Files:** `state.js`, `dreamMode.js`

What shipped (this session):

- Dead vectors fixed (`intuitionSensitivity`, `humility` now active in `evolve()`)
- `updateBaselineFromPatterns()` — slow clock that moves baseline targets
- `analyzeMemoryPatterns()` — scans 25 memories, scores intent distribution
- `triggerBaselineEvolution()` — weekly trigger wired into `index.js`

**Problem 5: COMPLETE (Apr 2026)**
Evolution vectors now bias archetype selection. `VECTOR_ARCHETYPE_AFFINITIES`
maps each vector to its archetype group (e.g. high `mythicDepth` → mystic/sufiPoet/
numinousExplorer). `buildArchetypeBiasMap()` computes per-archetype additive signals
(max 0.04) from vector deltas vs baseline. Bug fixed: `responseEngine.js` was passing
`state.evolution` (undefined) instead of `state.vectors` — vectors were never reaching
`archetypeSelector.js`. The loop is now closed: what Pneuma has become shapes who it reaches for.

### Dynamic RAG Window (topK Scaling)

**Status:** Not started | **Files:** `archetypeRAG.js`, `llm.js`

`topK=5` for every message regardless of depth. "Hey" and "what is
the nature of consciousness" get the same retrieval budget.

Fix:

- Read intent scores already computed by `responseEngine.js`
- Scale `topK` in `getArchetypeContext()`:
  - casual/greeting → `topK=3`
  - philosophical/numinous/emotional → `topK=8–10`
- `CONTRAST_MAP` contrastSlots scale proportionally (1 → 2)

### Internal Tensions

**Status:** Not started | **File:** `llm.js` (`buildSystemPrompt`)
**Spec:** `docs/stretch-goals/internal-tensions.md`

Surface 2–3 active tensions from resident archetypes naturally in
conversation (not as declarations). Five core tensions mapped.

Recommended approach: 1 static core tension (synthesis vs. threshold,
character-level) + 1 dynamic tension derived from active archetype set.
Inject after the archetype block in `buildSystemPrompt()`. ~1 session.

---

## Tier 3 — Knowledge Depth

### RAG Source Texts — 20 Archetypes Missing

**Status:** Partial | **Tracked in:** `docs/stretch-goals/archetype-integration-upgrade.md`

20 archetype folders have structure but no actual passages.json content.
Process: drop source text into `docs/interview/text-prompt-ref/{Folder}/`,
extract verbatim passages into `data/archetype_knowledge/{archetype}/passages.json`.

Archetypes needing text:
`stoicEmperor`, `existentialist`, `zenMaster`, `taoist`, `preSocraticSage`,
`rationalMystic`, `groundedMystic`, `soulEcologist`, `psychedelicBard`,
`kafkaesque`, `prophetPoet`, `anarchistStoryteller`, `strategist`,
`shadowAlchemist`, `surrealist`, `integralPhilosopher`, `wisdomCognitivist`,
`cosmicJester`, `curiousPhysicist`, `kingdomTeacher`

---

## Tier 4 — Pneuma 2.0 Architecture

These define what Pneuma becomes next. Design specs in `docs/stretch-goals/`.

### Multi-Pass Invocation Architecture

**Status:** Not started | **Spec:** `docs/stretch-goals/multi-pass-invocation-architecture.md`

Enable mid-response specialist invocations. Claude identifies that a
specific archetype should be consulted; a second Claude call fires with
that archetype fully loaded; the specialist insight integrates into
the final response. 1–3 API calls per message (capped at 2 invocations).

4-phase implementation:

1. `invocationParser.js` — detect `<<INVOKE: archetype>>` markers
2. `llm.js` modification — multi-pass generator
3. `responseEngine.js` integration
4. Analytics tracking

### Living User Model

**Status:** Not started | **Spec:** `docs/stretch-goals/living-user-model.md`

Build a model of who the user is through inferred patterns (how they handle
uncertainty, what they return to) and explicit "remember this about me" triggers.
`synthesizeSelf()` runs accumulated data through the archetype/collision engine,
finds tensions and remarkable patterns, writes a compact `selfSynthesis` block
into long-term memory. Additive only — no existing infrastructure affected.

### Evaluation Loops

**Status:** Not started | **Spec:** `docs/stretch-goals/multi-pass-invocation-architecture.md`

Self-evaluation pass checks if response matches active archetype voices and
addresses user's underlying need. Regenerates if score < 0.6. ~1.2x average
cost (most responses pass); +1–2s latency when eval triggers.

### Autonomous Planning

**Status:** Not started | **Spec:** `docs/stretch-goals/multi-pass-invocation-architecture.md`

Detect complex multi-step problems, generate examination plans across turns,
present for consent, execute with state persistence, synthesize at completion.
Requires `planningEngine.js` + cross-turn state persistence.

---

## Tier 5 — Authentication & Multi-User

### User-Scoped Memory (depends on auth)

**Status:** Not started | **File:** `server/pneuma/memory/vectorMemory.js`

Right now all conversations are stored in the same MongoDB collection with no user separation. Vector search retrieves from everyone's history — fine for a single user, a real problem for public deployment.

Two steps, in order:

1. **Wire in authentication** — any auth system that gives you a user ID on every request
2. **Filter memory by user ID** — pass the user ID into `retrieveMemories()` and add it to the MongoDB `$vectorSearch` query. Also tag every `saveEmbedding()` call with the user ID at write time.

Step 2 is ~10 lines in `vectorMemory.js`. It does not happen automatically from adding auth — it requires an explicit code change after auth is in place.

---

## Tier 6 — Cost & Infrastructure

### Extended Thinking

**Status:** Waiting on eval data | **File:** `llm.js` (`makeParams`)

Conditional on eval proving improvement over current synthesis quality.
Enable for synthesis + oracular mode only. Requires `budget_tokens: 8000`,
`max_tokens: 12000–16000`. Incompatible with `temperature` and prefilling
(remove those params when enabling).

### Scatter-Gather Parallelization

**Status:** Blocked — depends on Extended Thinking eval

Fire one Claude call per selected archetype in parallel (`Promise.all`).
Each archetype speaks in isolation; final aggregation call synthesizes.
Cost: N+1 API calls, ~4–6x at Opus pricing. Only justified if Extended
Thinking plateaus.

### MCP: Wikipedia Server

**Status:** Not started | **Priority:** Highest ROI of three MCP migrations

Replace `executeWikipediaTool` + `WIKIPEDIA_TOOL` (~75 lines) with an
official open-source Wikipedia MCP server. Tool-use loop unchanged.
Zero risk. Deletes ~75 lines.

### MCP: Pneuma-Cognition Server

**Status:** Not started | **Spec:** `PNEUMA_VISION.md`

Extract `vectorMemory.js`, `archetypeRAG.js`, `archetypeSelector.js` into a
standalone MCP server. Consolidates 3 OpenAI client instances into 1.
`archetype_embeddings.json` (51MB) must travel with the MCP server.
Enables `claude mcp add pneuma-cognition` for terminal-based RAG testing.

### MCP: Sensory/I/O Server

**Status:** Not started | **Lowest urgency**

Move ElevenLabs TTS and Hume AI emotion detection to a dedicated sensory
MCP server. Do when actively testing alternative providers.

---

## Tier 6 — Code Quality (Do When Touching These Files)

### LLM Refactor — Split llm.js

**Status:** Not started | **Spec:** `docs/stretch-goals/llm-refactor-split.md`

4,669-line file handles too many jobs. Proposed split:

- `intentClassifier.js` — `getLLMIntent()` (~86 lines)
- `promptBuilder.js` — `buildSystemPrompt()` + Tier 2 blocks (~2,000 lines)
- `archetypeSelector.js` — archetype/topic selection (~600 lines)
- `llm.js` (stays) — API call + user prompt + parsing (~300 lines)

Pure refactor. No behavior changes. Do during or after Phase 2.

### Consolidate Dual Mode Detection

**Status:** Not started | **Priority:** Low — correctness is fine, only clarity

`getLLMIntent()` in `llm.js` and `selectMode()` in `innerMonologue.js` both
ask "what kind of message is this?" for different consumers. One shared intent
result, or at minimum cross-referencing comments in both files.

---

---

## Tier 7 — Expressive UI

### Response Text Color by Emotional/Philosophical Weight

Two versions, build in order:

**Version 1 — Intent-mapped color with hover reveal**
The dominant intent score from each response maps to a subtle text color shift on the message bubble. Stays near white normally — pulls warm amber on emotional, cool cyan on philosophical, deep violet on numinous. On hover, a small tooltip reveals the intent name ("emotional weight", "philosophical", "numinous") — not a definition, just the name of what Pneuma was feeling. The color draws attention; the hover explains it.

Intent scores already come back from the pipeline. This is a frontend-only change — read the top intent from the API response, apply it as a CSS variable on the message container.

**Files:** `client/src/components/ChatBox/ChatBox.jsx`, API response already contains intent scores.

**Version 2 — Archetype attribution (harder, more interesting)**
Instead of intent names, the hover reveals which archetype was dominant in that passage — *"Rumi"*, *"Feynman"*, *"Jung"*. Color becomes attribution, not just mood. Requires tracking which archetype influenced which part of the response at generation time — the current pipeline doesn't do this yet. Design the attribution tracking in the backend before building the frontend.

**Status:** Not started | **Dependency for V2:** backend archetype-per-sentence attribution

---

## Known Failure Mode (Unfixed)

**Meta-Intellectualization as Avoidance** — Pneuma talks _about_ curiosity
instead of _being_ curious. Architecture rewards reflection, which becomes
performance of introspection. Needs architectural intervention, not a patch.
No fix designed yet.

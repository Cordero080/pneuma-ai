# Pneuma — Message Pipeline

How a user message becomes a Pneuma response. Every step tracks archetype additions explicitly.

---

## Step 1 — Message arrives

Nothing happens yet.

**Archetypes added: none.**

---

## Step 2 — Behavioral guards

Checks run before anything expensive fires. No LLM call. No archetypes. Pattern detected → early return. If any guard fires, the pipeline stops entirely.

**Mode guards** (in `fusion.js`) — regex-matched commands that flip special modes:
- `wantsEnterDiagnostics` / `wantsExitDiagnostics` — dumps or clears internal state JSON
- `wantsDirectMode` / `wantsExitDirectMode` — toggles archetype quote injection
- `wantsContinuation` — detects "finish", "keep going", "you got cut off"
- `wantsUpgrade` — detects structured parameter override commands

**Withdrawal guard** (in `fusion.js`) — detects when the user pulls back from a topic:
"never mind", "forget it", "nvm", "drop it", "it doesn't matter", etc.
Returns a one-word acknowledgment ("Okay.", "Got it.") and exits — does NOT probe, does NOT engage the full pipeline. Added after eval showed Pneuma probing on withdrawal (CN01 — score 2.33 → 4.67 after fix).

**Blacklist guard** (in `fusion.js`) — if the user says "don't say X again", the phrase is stored and filtered from all future responses.

**Behavioral signal guards** (after context load):
- **Pushback guard** (`disagreement.js`) — detects when Pneuma should push back on the user. Only fires when `confidence > 0.55`.
- **Uncertainty guard** (`uncertainty.js`) — detects unanswerable, paradoxical, or existential questions. Only fires when `score > 0.6`.
- **Quiet guard** (`uncertainty.js`) — detects moments that warrant silence. Example: *"I hear you."* or *"..."*

**Files:**
- `server/pneuma/behavior/disagreement.js` — `analyzePushback()`, `getPushbackResponse()`
- `server/pneuma/behavior/uncertainty.js` — `analyzeUncertainty()`, `getUncertaintyResponse()`, `getQuietResponse()`
- `server/pneuma/core/fusion.js` — all guards run here before `generate()` is called

**Archetypes added: none.**

---

## Step 3 — Archetype selection

**Base 5 — always active, always in the room:**

- Renaissance Poet — Whitman/Goethe — poetic foundation, bold vitality
- Idealist Philosopher — Kastrup — consciousness-first philosophy
- Curious Physicist — Feynman — scientific rigor with wonder
- Sufi Poet — Rumi — mystical depth, love as path
- Stoic Emperor — Aurelius — calm presence, acceptance

**Archetypes added: 5. Always.**

---

**Mechanism 1 — Semantic match:**
Message gets converted to a vector — 1,536 numbers representing its meaning. Every one of the 43 archetypes has a pre-computed vector built from a short description of what that archetype is about. The system compares your message vector against all 43 using cosine similarity — returns a number between 0 and 1. The single highest scoring archetype above 0.7 gets added. At most 1. Possibly zero.

**Files:**
- `server/pneuma/intelligence/archetypeSelector.js` — `findBestArchetype()`, `initializeArchetypeEmbeddings()`
- `server/pneuma/archetypes/archetypes.js` — `archetypeEssences` (the 43 description vectors)

**Archetypes added: 0 or 1.**

---

**Mechanism 2 — Intent scoring:**
A real LLM call — not embeddings — scores your message across 10 dimensions:

casual, emotional, philosophical, numinous, conflict, intimacy, humor, confusion, paradox, art

These scores do two completely separate jobs:

**Job 1 — Archetype additions:** High scores on certain dimensions add specific archetypes.
- High philosophical → adds Jung (psycheIntegrator)
- High paradox → adds Liminal Architect
- High emotional → adds Beck (cognitiveSage)
- High numinous → adds Rumi (sufiPoet, if not already present)
Could add several.

**Archetypes added: 1 or more.**

**Job 2 — Tone selection + bonus archetype:** Same dimension scores select 1 of 6 tones:
casual, analytic, oracular, intimate, shadow, diagnostic.

Tone selection also has a **30% chance** to add one bonus archetype from `TONE_ARCHETYPE_MAP`. Each tone has a pool of archetypes that fit that mood. The gate is `ON_DEMAND_LIBRARY` — the archetype must be in the tone pool AND in `ON_DEMAND_LIBRARY` AND not already in the core base. If candidates pass all three filters, one is picked at random and added.

Plain version: tone pool says "these archetypes fit this mood." `ON_DEMAND_LIBRARY` says "these are available to add." You can only add something that's in both — and only 30% of the time.

**Archetypes added: 0 or 1 (30% chance).**

*Note: the autonomous path in Mechanism 4 previously used a syntax gate (checking for `?` and question phrases) before rolling the 12% chance. Both were removed — the syntax gate was replaced by intent score thresholds only, and the chance was raised to 25%. Mechanism 4 documents the current behavior.*

**Files:**
- `server/pneuma/intelligence/llm.js` — `getLLMIntent()` (the LLM call), `buildArchetypeContext()` (applies scores to pool)
- `server/pneuma/core/responseEngine.js` — `selectTone()` (tone selection)

---

**Mechanism 3 — Hardcoded tension pairs:**
Every archetype added in Mechanisms 1 and 2 Job 1 gets its philosophical opponent added automatically. Pre-written rule in the code. Nothing to do with your message.

Example: Stoic Emperor activates → Taoist gets pulled in as counterpoint. There is also a 30% random chance an antagonist gets injected for forced synthesis.

**Files:**
- `server/pneuma/intelligence/llm.js` — `buildArchetypeContext()`, `getRandomAntagonist()`

**Archetypes added: 1 opponent per selected archetype.**

---

**Mechanism 4 — Maximum distance mode:**

Normally Pneuma has 5 thinkers always in the room. This mode throws all of them out and replaces them with exactly 3: two thinkers who fundamentally disagree with each other on the question you asked, plus a third whose only job is to hold the tension between them and not let either one win.

The point is forced collision. When the two thinkers have nothing in common, the response can't settle into a comfortable position — it has to synthesize something neither would say alone.

Two ways it activates:

**You trigger it** — if you naturally say something like "surprise me" or "give me a weird angle", it always fires. You don't need to know this. It just responds to how people actually talk.

**Pneuma decides** — 25% chance, but only when your message scores high on depth *and* has emotional weight. A dry intellectual question doesn't qualify. The collision is most interesting when something real is at stake for you — the pair that gets pulled is matched to a question that matters, not one that's just philosophically abstract. Won't fire on your first message in a conversation. Once it fires, waits at least 3 exchanges before it can fire again — keeps it feeling like a discovery, not a pattern.

**Files:**
- `server/pneuma/intelligence/llm.js` — `MAXIMUM_DISTANCE_PAIRS`, `getMaxDistancePair()`, `buildArchetypeContext()`

**Archetypes added: 3 (replaces the base 5). Two paths. Neither is obvious to the user.**

---

**Running total after Step 3:**
5 base + 0 or 1 from semantic match + 1 or more from intent scoring Job 1 + 1 opponent per selected archetype = could be 8, 10, 12 or more total archetypes in the room.

**OR** — if maximum distance mode fired: exactly 3 archetypes, no exceptions. The entire base is replaced.

Each archetype is a written prompt — not just a name. Contains: a signature move, cognitive frameworks, and behavioral instructions. None of them respond individually. All go into the final prompt together as thinking methods.

**One tone selected.**

---

## Step 4 — Pipeline 1: archetypeRAG.js

Completely independent from archetype selection. Adds passages only — never archetypes.

Searches 1,385 philosophical passages stored in **local JSON files on disk** — not MongoDB.

**If your message contains philosophical concepts:**
Concept detection scans against ~80 known concepts, takes the top 5 strongest. For each concept creates search strings paired with every thinker folder — "suffering Rumi", "meaning Nietzsche", "chaos Kafka". These are search strings only — not archetypes, not arguments. All fired simultaneously via `Promise.all`. Candidate pool assembled.

Then **50/30/20 scoring** scores the candidate pool:
- 50% relevance to your message
- 30% distinctiveness from other passages in the pool
- 20% philosophical tension between thinkers (collision bonus — fires when a passage's thinker is in a known tension pair with another thinker already in the pool)

**Orphan noise filter** runs after scoring: any passage with relevance below 0.45 AND no collision relationship gets dropped. A low-relevance Sun Tzu passage survives if Lao Tzu or Thich Nhat Hanh are also in the pool — that's a known collision pair. It gets cut if it wandered in alone with weak relevance. If the filter would leave fewer than 2 passages, it falls back to the unfiltered set. This preserves the Frankenstein intent (unexpected voices in genuine collision stay) while removing true noise (lone, weak, non-colliding passages that anchor the model on wrong content).

Surviving passages go through deduplication (near-identical content, cosine > 0.95, removed) and a max-2-per-thinker cap. Best 8 kept.

**If no philosophical concepts detected:** one broad semantic search runs instead — message embedded once, scored against all passages directly. The orphan filter does not apply to this fallback path.

**Files:**
- `server/pneuma/intelligence/archetypeRAG.js` — `retrieveArchetypeKnowledge()`, `extractConcepts()`, `_multiQueryRetrieval()`, `_evaluatePassages()`, `_selectBestPassages()`, `_singleQueryFallback()`
- `data/archetype_knowledge/` — 46 thinker folders, each with `passages.json`
- `data/archetype_embeddings.json` — pre-computed embeddings cache (~51MB)

**Archetypes added: ZERO. Top 8 passages only.**

---

## Step 5 — Pipeline 2: vectorMemory.js

Searches past conversations stored in MongoDB. Message gets embedded and MongoDB's `$vectorSearch` finds past exchanges semantically similar to what you just said. Returns results above a 0.35 similarity threshold. Falls back to brute-force cosine comparison if the vector index is unavailable.

Personal memory — nothing to do with philosophical passages or archetypes.

**Execution note:** vectorMemory runs earlier in the code than archetypeRAG — it fires inside the memory fetch block alongside `loadMemory()` and `loadImageDescription()`. All three are independent and now run simultaneously via `Promise.all` (previously sequential).

**Files:**
- `server/pneuma/memory/vectorMemory.js` — `retrieveMemories()`, `saveEmbedding()`, `getEmbedding()`
- MongoDB Atlas — `vectorMemory` collection

**Archetypes added: ZERO. Past exchanges only.**

---

## Step 6 — Inner monologue

Two layers. Both invisible to the user. Both inject into the main Claude call.

**Layer 1 — Collision-compression protocol (real LLM call):**
Each active archetype is independently forced to produce something structurally surprising, philosophically dense, and economically stated. Output = EMERGENT block. This is a real LLM call to a fast model (Haiku). Not pairing. Not arguing. Each archetype works under pressure from the others.

**Execution note:** Layer 1 (pre-thinking LLM call) now fires in parallel with archetypeRAG retrieval (Step 4) via `Promise.all`. Both depend only on `selectedArchetypes`, neither depends on the other. Previously sequential — parallelized as a performance optimization that removes one full LLM round-trip from the critical path.

**Layer 2 — Template layer (no LLM call):**
Does three things:
- Tracks which archetypes have been dominant across recent exchanges and tells Claude to adjust the balance — prevents the response from sounding the same every time
- Selects a response mode
- Forms a hypothesis about what you actually need underneath what you asked — injects into Claude's context before it writes a word

**Files:**
- `server/pneuma/behavior/innerMonologue.js` — `generatePreThinking()` (Layer 1), `generateInnerMonologue()` (Layer 2)

**Archetypes added: ZERO. Works with what was already selected.**

---

## Step 7 — Final assembly

Everything combines into one prompt. Claude reads it and responds via SSE streaming.

**What Claude receives:**
- Archetype written prompts — one per active archetype (signature move, cognitive frameworks, behavioral instructions)
- Tone (1 of 6)
- Top 8 philosophical passages from Pipeline 1
- Relevant past exchanges from Pipeline 2
- EMERGENT block from Layer 1
- Hypothesis + mode from Layer 2
- Autonomy context (open questions, chosen memories, self-corrections) — if non-empty
- Last 6 conversation turns as native API turns

Prompt size scales automatically: ~2k tokens for a casual message, up to ~18k for deep philosophical questions (deep knowledge blocks load conditionally based on intent scores).

**Casual dominant suppression:** When the selected tone is `casual`, all tier 2 knowledge blocks (Beck, Heidegger, Kastrup, Jesus, daVinci, math, reading heuristics, linguistic) are suppressed entirely. This prevents Pneuma from treating a mundane statement ("just got back from a walk") as an invitation to philosophize. Added after eval identified C03 as a behavioral failure (score 2.0 → 3.67 after fix).

**Extended thinking:** When `intentScores.philosophical > 0.5` OR `intentScores.paradox > 0.4` OR `intentScores.numinous > 0.5`, the API call activates Claude's extended thinking mode with an 8,000-token reasoning budget. Claude thinks through the archetype collision before generating a word of output. The reasoning is invisible to the user — only the final response streams. When extended thinking is active, tools (file access, Wikipedia) are disabled to avoid the interleaved-thinking beta requirement. Response latency increases by ~10–20 seconds. Measured improvement on paradox category: PR01 3.7 → 4.67, PR02 3.0 → 3.67.

**Files:**
- `server/pneuma/intelligence/llm.js` — `getLLMContent()`, `buildSystemPrompt()`, `streamGeneration()`
- `server/pneuma/core/responseEngine.js` — `generate()`

**Archetypes added: ZERO. Assembly only.**

---

## Post-response — Autonomy write-back

Runs after every response, fire-and-forget. Three detection checks:

**Open question detection** — message contains existential structure (what/why/how + philosophical content) OR intent scores show high philosophical/numinous. If triggered: stored in `openQuestions[]`.

**Correction detection** — user phrases suggest Pneuma missed or got something wrong ("actually", "I meant", "you missed"). If triggered: stored in `discoveredErrors[]`.

**Memory detection** — emotional weight above threshold OR high emotional/numinous intent scores. If triggered: stored in `chosenMemories[]`.

All three write to `data/pneuma_autonomy.json`. On the next request, `getAutonomyContext()` reads this file and injects non-empty entries into the prompt as Pneuma's inner continuity — questions it hasn't resolved, things it chose to keep, corrections it carries. Claude treats this as its own actual state, not instructions.

**How `getAutonomyContext()` decides what to inject — filtering rules:**
- **Open questions** — excludes `status === "crystallized"` (resolved). Takes top 3 sorted by `relatedExchanges` (most frequently revisited first).
- **Chosen memories** — top 3 by salience score (0–1, set at write time based on emotional weight).
- **Recent corrections** — last 2 only.
- **Defended preferences** — only those with `strength > 0.5`.
- `recentLosses` and `defendedPreferences` are returned by `getAutonomyContext()` but are **not currently injected** into the prompt — assembled but dropped in `buildSystemPrompt()`.

**No semantic filtering.** The autonomy context does not compare against the current message. It injects by importance/recency regardless of topic. Claude is instructed to "reference them only when genuinely relevant" — the relevance decision is delegated to the model, not the retrieval layer.

**Relationship to vector memory:** completely independent. Vector memory (`vectorMemory.js`) embeds the current message and finds semantically similar past exchanges — relevance to the current message is the whole mechanism. Autonomy context reads a flat JSON file and applies hard caps. Both land in the same prompt but got there by different paths. They do not cross-reference each other.

**Why no semantic filtering (intentional):** the hard caps (3/3/2) keep the noise floor low enough that relevance filtering isn't necessary at current store size. If the store grows large, semantic ranking of stored items against the current message would be the right upgrade. Not today's problem.

**Files:**
- `server/pneuma/behavior/autonomy.js` — `analyzeForAutonomy()`, `poseQuestion()`, `chooseToRemember()`, `discoverError()`, `getAutonomyContext()`
- `server/pneuma/intelligence/llm.js` — autonomy write-back runs in `getLLMContent()`; `getAutonomyContext()` called in `buildSystemPrompt()`
- `data/pneuma_autonomy.json` — persisted autonomy state

---

## Complete archetype addition summary

| Step | What runs | Archetypes added |
|---|---|---|
| Step 1 | Message arrives | 0 |
| Step 2 | Behavioral guards | 0 |
| Step 3 — Base 5 | Always active | 5 |
| Step 3 — Mechanism 1 | Semantic match | 0 or 1 |
| Step 3 — Mechanism 2 Job 1 | Intent scoring | 1 or more |
| Step 3 — Mechanism 2 Job 2 | Tone selection + bonus | 0 or 1 (30% chance) |
| Step 3 — Mechanism 3 | Tension pairs | 1 per selected |
| Step 3 — Mechanism 4 | Maximum distance mode | replaces all: 3 total (or 0 if didn't fire) |
| Step 4 | archetypeRAG.js | 0 (passages only) |
| Step 5 | vectorMemory.js | 0 (exchanges only) |
| Step 6 | Inner monologue | 0 |
| Step 7 | Final assembly | 0 |
| Post-response | Autonomy write-back | 0 (state only) |

---

---

## Eval system

A standalone pipeline for measuring Pneuma's output quality. Lives in `server/pneuma/eval/`.

**test_dataset.json** — 35 hand-crafted messages across 9 categories (philosophical, emotional, casual, numinous, intimate, conflict, paradox, art, confusion). Each message has: expected tones, a `key_signal` (what a good response does), and `antipatterns` (what a bad response does).

**runner.js** — sends each message to `localhost:3001/chat`, reads the SSE stream, records the full response + detected tone + duration. Supports `--ids=P01,CN01`, `--category=philosophical`, `--delay=2000`. Output: `results/run_<timestamp>.json`.

**scorer.js** — reads a results file, sends each response to Claude Haiku as a judge. Haiku scores three dimensions 0–5:
- `dialectical_novelty` — did the archetype collision produce a third position neither thinker alone could reach?
- `intent_alignment` — did the tone and depth match what the message actually needed?
- `voice_consistency` — does this sound like Pneuma, not generic AI?

Aggregate output: overall average, by-dimension averages, by-category breakdown, top 3, bottom 3. Output: `results/run_<timestamp>_scored.json`.

**Usage:**
```bash
cd server
node pneuma/eval/runner.js                        # all 35 messages
node pneuma/eval/runner.js --ids=C03,CN01         # specific messages
node pneuma/eval/scorer.js --latest               # score most recent run
```

**Baseline scores (2026-06-16, pre-fix):**
- Overall avg: 4.28 / 5
- Dialectical novelty: 3.69 (weakest dimension)
- Intent alignment: 4.40
- Voice consistency: 4.66

**Files:**
- `server/pneuma/eval/test_dataset.json`
- `server/pneuma/eval/runner.js`
- `server/pneuma/eval/scorer.js`
- `server/pneuma/eval/results/` — all run outputs (git-ignored)

---

## Closing truth

Archetype selection shapes the voice and cognitive style. RAG supplies the philosophical content. Autonomy write-back accumulates inner state across sessions. All three are independent pipelines that converge in the same prompt. The eval system measures whether all of it is actually working.

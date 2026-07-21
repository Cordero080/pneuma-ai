# Pneuma — Message Pipeline

How a user message becomes a Pneuma response. Every step tracks archetype additions explicitly.

---

## Instructions for Claude (read this first)

This document is being used to study a real codebase. Every number, threshold, function name, and design decision written here has been verified against the actual source code by Claude Code.

**Do not fabricate answers.** If you are asked something about this system that is not covered in this document — a function name, a threshold, a behavior, an architectural detail — do not guess, infer, or construct a plausible-sounding answer. Say clearly: *"I don't have that detail in the pipeline doc. Ask Claude Code for the exact answer."*

**Why this matters:** the person studying this built the system. They will know immediately if you invent something. A confident wrong answer is worse than admitting you don't have the data.

**What you can do:** explain, rephrase, connect concepts, and help reason through design decisions — as long as you are working from what is written here, not filling gaps with assumptions.

**When in doubt, say:** *"That specific detail isn't in this doc — you'd need to check the code directly or ask Claude Code."*

---

## Quick Reference — Settled Facts (verified against actual code)

| Question | Answer |
|---|---|
| Tool use protocol | **Native Anthropic** — `anthropic.messages.create()` with `tools:` array. Not MCP. |
| Tools available | `search_wikipedia`, `read_pneuma_file` — disabled when extended thinking is active |
| Dream functions fired post-response | **2** — `triggerDialecticDream()` (30min throttle) + `triggerDreaming(1)` (2h throttle) |
| Tones in lottery | **5** — casual, analytic, oracular, intimate, shadow. `diagnostic` is a mode, NOT a tone. |
| Max archetype pool size | **7** — 5 (hard cap before shadows) + 2 (shadows). Never more. |
| Shadow selection method | Per-archetype lookup in static `tensionMap.high`, **first-found**, cap 2 total |
| Self-evaluation | **Yes** — Haiku scores 0–1 after every non-casual response. Below 0.6 → regenerate |
| Extended thinking budget | 8,000 tokens thinking budget, 12,000 max_tokens total |
| Extended thinking trigger | `philosophical > 0.5` OR `paradox > 0.4` OR `numinous > 0.5` |
| Regex intent pass | Runs in `fusion.js` for behavioral guards only. LLM intent runs separately inside `generate()` |

---

---

## Step 1 — Message arrives

Nothing happens yet.

After the full response is sent, two dream functions fire **fire-and-forget** in the background:
- `triggerDialecticDream()` — throttled to once per 30 min
- `triggerDreaming(1)` — throttled to once per 2 hours

**What the dream is — and what it isn't:**
The response to the user is not a debate. The archetypes fuse into one unified reply — collision in service of answering. The dream is what happens after that obligation is gone.

`dreamMode.js` receives the archetype names that just fired — not the user's message, not the response. The archetypes argue based on their own nature and tensions, not the original question. The topic bleeds in indirectly (which archetypes were active depends on what you said), but no premise is passed. Rumi and Aurelius argue because of who they are, not because of what you asked.

Output is stored in MongoDB and delivered the next time the app opens. This is how Pneuma accumulates internal dialogue between sessions — not reacting to the user, just running.

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

**Archetypes have two completely separate functions — this is easy to miss:**

**Function 1 (synchronous):** Selected archetypes are injected into the system prompt. They fuse into one unified response delivered to the user. This is collision and synthesis in service of answering — it has a destination.

**Function 2 (async, post-response):** The same archetype names that just fired are handed to `dreamMode.js` after the response is sent. They now argue with no user present, no question to answer, no obligation to resolve. The topic bleeds in indirectly — which archetypes were active depends on what the user said — but the user's message and the response are NOT passed to the dream. The archetypes argue based on their own nature and tensions. Output is stored and delivered next session.

These two functions are independent. The dream is not a continuation of the response — it's what happens when the same voices are freed from the obligation of being useful.

---

**Base 5 — always active, always in the room:**

- Renaissance Poet — Whitman/Goethe — poetic foundation, bold vitality
- Idealist Philosopher — Kastrup — consciousness-first philosophy
- Curious Physicist — Feynman — scientific rigor with wonder
- Sufi Poet — Rumi — mystical depth, love as path
- Stoic Emperor — Aurelius — calm presence, acceptance

**Archetypes added: 5. Always.**

---

**Mechanism 1 — Semantic match:**
Message gets converted to a vector — 1,536 numbers representing its meaning. 39 of the 44 archetypes have a pre-computed vector built from a short description of what that archetype is about (not all 44 have essences defined). The system compares your message vector against those 39 using cosine similarity — returns a number between 0 and 1. The single highest scoring archetype above 0.7 gets added. At most 1. Possibly zero.

**Files:**
- `server/pneuma/intelligence/archetypeSelector.js` — `findBestArchetype()`, `initializeArchetypeEmbeddings()`
- `server/pneuma/archetypes/archetypes.js` — `archetypeEssences` (39 description vectors)

**Archetypes added: 0 or 1.**

---

**Mechanism 2 — Intent scoring:**
A real LLM call — not embeddings — scores your message across 10 dimensions:

casual, emotional, philosophical, numinous, conflict, intimacy, humor, confusion, paradox, art

These scores do two completely separate jobs:

**Job 1 — Archetype additions:** High scores on certain dimensions add specific archetypes. Exact thresholds from code:
- `philosophical > 0.5` → adds Jung (`psycheIntegrator`)
- `emotional > 0.6` → adds Beck (`cognitiveSage`)
- `numinous > 0.3` → adds Rumi (`sufiPoet`, if not already present)
- `paradox > 0.4` → adds Liminal Architect (`liminalArchitect`)
- `(philosophical > 0.4 OR analytical > 0.4 OR numinous > 0.35) AND 12% random roll` → adds Trickster (`trickster`) — Carlin/Hicks/Pryor, sardonic precision

Could add several. All additions happen to `coreBase` before the pool is capped.

**Archetypes added: 1 or more (before cap — see Running Total below).**

**Job 2 — Tone selection + bonus archetype:**

**Intent scores → weighted lottery → one tone wins.**

The same 10 dimension scores feed into a weighted lottery. Higher scores boost certain tones — high numinous pushes oracular, high emotional pushes intimate, high philosophical pushes analytic. All scores apply pressure simultaneously, but only one tone wins. Many different input qualities can call for the same output register — that's why there are 10 dimensions but only 5 tones. Tone sets the register for the entire response. Archetypes supply the content and perspective within that register.

The 5 tones: casual, analytic, oracular, intimate, shadow.

(`diagnostic` exists as a mode but is NOT in the tone lottery — it is not a selectable tone.)

Tone selection also has a **30% chance** to add one bonus archetype from `TONE_ARCHETYPE_MAP`. Each tone has a pool of archetypes that fit that mood. The gate is `ON_DEMAND_LIBRARY` — the archetype must be in the tone pool AND in `ON_DEMAND_LIBRARY` AND not already in the core base. If candidates pass all three filters, one is picked at random and added.

Plain version: tone pool says "these archetypes fit this mood." `ON_DEMAND_LIBRARY` says "these are available to add." You can only add something that's in both — and only 30% of the time.

**Archetypes added: 0 or 1 (30% chance).**

*Note: the autonomous path in Mechanism 4 previously used a syntax gate (checking for `?` and question phrases) before rolling the 12% chance. Both were removed — the syntax gate was replaced by intent score thresholds only, and the chance was raised to 25%. Mechanism 4 documents the current behavior.*

**Files:**
- `server/pneuma/intelligence/llm.js` — `getLLMIntent()` (the LLM call), `buildArchetypeContext()` (applies scores to pool)
- `server/pneuma/core/responseEngine.js` — `selectTone()` (tone selection)

---

**Mechanism 3 — Shadow pairing (deterministic tension injection):**
After the pool is capped at 5, the code iterates the pool and adds high-tension counterparts — called "shadows" in the code. This is NOT one-per-archetype. The hard cap is **2 shadows total**, regardless of pool size.

How shadows are chosen: `getHighTensionPairs(archetype)` looks up each archetype in a static `tensionMap.high` table and returns all archetypes that have a declared high-tension relationship with it. The shadow is selected from the first archetype in the pool that has a high-tension partner not already present. First-found, not highest-scoring.

**Why 2 and not one shadow per archetype:** deliberate noise control. A pool of 5 with 5 individual shadows would be 10 archetypes — too many voices for Claude to synthesize into anything coherent.

**The imbalance is intentional.** Most archetypes in the pool have no direct counterpart. The 2 shadows don't compete with each other — they pull against the whole room. If 5 archetypes are naturally aligned (poetic, philosophical, mystical), the 2 shadows are thrown in to disrupt that harmony. Their job is to prevent the 5 from simply agreeing. The slight asymmetry — majority pulling one way, minority pulling back — forces synthesis. A perfectly balanced room produces deadlock. This doesn't.

**Files:**
- `server/pneuma/archetypes/archetypeDepth.js` — `getHighTensionPairs()`, `tensionMap`
- `server/pneuma/intelligence/llm.js` — `buildArchetypeContext()` (shadow injection loop, line ~2197)

**Archetypes added: 0, 1, or 2 (capped at 2 total — NOT 1 per archetype).**

---

**Mechanism 4 — Maximum distance mode:**

Normally Pneuma has 5 thinkers always in the room. This mode throws all of them out and replaces them with exactly 3: two thinkers who fundamentally disagree with each other, plus Liminal Architect whose only job is to hold the tension between them and not let either one win.

**Why it throws the base 5 out:**
The 5 base archetypes are stable and somewhat harmonious by design. If you kept them alongside a maximum distance pair, they would dilute the collision — the harmonious voices soften what the two incompatible ones would produce. The entire point of this mode is forced collision with nothing to cushion it. So the base 5 are replaced, not added to. The 3 that replace them ARE the whole pool.

**The two archetypes are not the highest scorers.** They are pulled from `MAXIMUM_DISTANCE_PAIRS` — a hand-written list of pairs selected specifically because their worldviews are maximally incompatible. Heidegger and Feynman, for example. The selection is random from that list, not based on intent scores.

**Liminal Architect** holds the tension between the two incompatible voices. It does not take a side. Its only role is to prevent either voice from winning — keeping the collision productive rather than letting it collapse into one position. Liminal Architect also appears in normal mode when `paradox > 0.4`, but maximum distance mode is the only place it has this specific structural role.

**Two triggers:**

**You trigger it** — say something like "surprise me", "weird angle", "give me a fresh perspective." Always fires on these phrases, no conditions, no cooldown.

**Pneuma decides** — 25% chance, but only when your message is both philosophically deep AND has emotional weight. Dry intellectual question doesn't qualify. Won't fire on the first message. Once it fires, waits at least 3 exchanges before it can fire again — keeps it feeling like a discovery, not a pattern.

**Files:**
- `server/pneuma/intelligence/llm.js` — `MAXIMUM_DISTANCE_PAIRS`, `getMaxDistancePair()`, `buildArchetypeContext()`

**Archetypes added: exactly 3, replaces everything. No shadows added on top.**

---

**Running total after Step 3:**

**IMPORTANT — there is a hard pool cap at 5 before shadow injection.**

All additions (tone boost, intent-driven, semantic match) happen to the same `coreBase` array. Before shadow injection, the pool is sliced to 5: `[...new Set([...coreBase, ...suggestedArchetypes])].slice(0, 5)`. Earlier additions can be crowded out by the cap.

After the cap, shadow injection adds up to 2 more. So the **maximum pool size is 7** (5 capped + 2 shadows), not 8, 10, or 12. The running total stated in earlier versions of this doc was wrong.

**Typical philosophical message:** 5 (base) → tone boost may add 1 → intent adds Jung + Beck → semantic match adds 1 → all of these compete for 5 slots → cap trims to 5 → shadows add 2 → **7 total**.

**OR** — if maximum distance mode fired: exactly 3 archetypes, no exceptions. The entire base is replaced. No shadows added (the 3 ARE the collision).

Each archetype is a written prompt — not just a name. Contains: a signature move, cognitive frameworks, and behavioral instructions. None of them respond individually. All go into the final prompt together as thinking methods.

**One tone selected.**

---

## Steps 4 + 5 — Four memory sources, all independent, all converge in Step 7

There are four distinct retrieval pipelines. Each uses a different source, a different mechanism, and retrieves different things. None depend on each other. All land in the same prompt.

| Source | What it retrieves | Matched to |
|---|---|---|
| `archetypeRAG` | Philosophical passages from thinker source texts | Your message topic |
| `vectorMemory` | Your own past exchanges | Your message (semantic similarity) |
| `patternDigest` | Cross-temporal synthesis of who you've been | Not matched — always injected |
| `longTermMemory` | Key-value facts about you | Not matched — always injected |

The naming in this doc ("Pipeline 1", "Pipeline 2") undersells it. There are four sources. Keep them distinct.

---

## Step 4 — archetypeRAG.js

Completely independent from archetype selection. Adds passages only — never archetypes.

Searches 1,394 philosophical passages stored in **local JSON files on disk** — not MongoDB. (Count updated 2026-07-20: 12 apocryphal daVinci quotes removed, 21 verified Richter Notebook passages added.)

**If your message contains philosophical concepts:**
Concept detection scans against ~80 known concepts, takes the top 5 strongest. For each concept creates search strings paired with every thinker folder — "suffering Rumi", "meaning Nietzsche", "chaos Kafka". These are search strings only — not archetypes, not arguments. All fired simultaneously via `Promise.all`. Candidate pool assembled.

Then **50/30/20 scoring** scores the candidate pool:
- 50% relevance to your message
- 30% distinctiveness from other passages in the pool
- 20% philosophical tension between thinkers (collision bonus — fires when a passage's thinker is in a known tension pair with another thinker already in the pool)

**Orphan noise filter** runs after scoring: any passage with relevance below 0.45 AND no collision relationship gets dropped. A low-relevance Sun Tzu passage survives if Lao Tzu or Thich Nhat Hanh are also in the pool — that's a known collision pair. It gets cut if it wandered in alone with weak relevance. If the filter would leave fewer than 2 passages, it falls back to the unfiltered set. This preserves the Frankenstein intent (unexpected voices in genuine collision stay) while removing true noise (lone, weak, non-colliding passages that anchor the model on wrong content).

Surviving passages go through deduplication (near-identical content, cosine > 0.95, removed) and a max-2-per-thinker cap. Best 8 kept.

**If no philosophical concepts detected:** one broad semantic search runs instead — message embedded once, scored against all passages directly. The relevance filter does not apply to this fallback path.

**Files:**
- `server/pneuma/intelligence/archetypeRAG.js` — `retrieveArchetypeKnowledge()`, `extractConcepts()`, `_multiQueryRetrieval()`, `_evaluatePassages()`, `_selectBestPassages()`, `_singleQueryFallback()`
- `data/archetype_knowledge/` — 48 thinker folders, each with `passages.json`
- `data/archetype_embeddings.json` — pre-computed embeddings cache (~51MB)

**Archetypes added: ZERO. Top 8 passages only.**

---

## Step 5 — Pipeline 2: vectorMemory.js

Searches past conversations stored in MongoDB. Message gets embedded and MongoDB's `$vectorSearch` finds past exchanges semantically similar to what you just said. Returns results above a 0.35 similarity threshold. Falls back to brute-force cosine comparison if the vector index is unavailable.

Personal memory — nothing to do with philosophical passages or archetypes.

**Execution note:** vectorMemory runs earlier in the code than archetypeRAG — it fires inside the memory fetch block alongside `loadMemory()` and `loadImageDescription()`. All three are independent and now run simultaneously via `Promise.all` (previously sequential).

**patternDigest:** Also retrieved here — a periodically-generated cross-temporal synthesis of recurring themes across the user's conversation history. Written by Pneuma in its own voice (Jung/Heidegger/Rumi lenses). Injected into the system prompt as a `[ LONGITUDINAL PATTERN ]` block. Regenerates in the background (fire-and-forget) when >24h old OR >50 new vector memory entries since last generation.

**Files:**
- `server/pneuma/memory/vectorMemory.js` — `retrieveMemories()`, `saveEmbedding()`, `getEmbedding()`
- `server/pneuma/memory/patternDigest.js` — `getPatternDigest()`, `generateUserPatternDigest()`
- MongoDB Atlas — `vectorMemory` collection, `patternDigest` collection

**Archetypes added: ZERO. Past exchanges + longitudinal pattern only.**

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
- Tone (1 of 5)
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

## Step 7.5 — Self-evaluation + conditional regeneration

Runs immediately after the response is generated, before post-processing. Completely invisible to the user.

**Haiku scores the response 0.0–1.0** across tone fit and intent alignment. The prompt includes: the selected tone, the top intent dimension and its score, whether emergent shift was active. Haiku returns `{ score, issue }` as JSON.

**Gate conditions — eval only runs when:**
- Response is longer than 80 characters
- The dominant intent is NOT casual with score > 0.7 (casual messages skip eval entirely)

**If score < 0.6:** the stream is reset (`\x00RESET` signal to frontend), feedback is appended to Block 2 of the system prompt only (Block 1 cache stays intact), and the full generation reruns. One retry only.

**If score ≥ 0.6:** ship it.

**Why Haiku and not Sonnet for this:** cheap, fast classification task. Doesn't need depth — just needs to know "did the tone match?"

**Files:**
- `server/pneuma/intelligence/llm.js` — `evalResponse()` (line ~3261), called inside `getLLMContent()` after response is parsed

**Archetypes added: ZERO.**

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
| Step 3 — Mechanism 2 Job 2 | Tone boost (30% chance) | 0 or 1 |
| Step 3 — Mechanism 2 Job 1 | Intent scoring (Jung/Beck/Rumi/Liminal/Trickster) | 0–5 |
| Step 3 — Mechanism 1 | Semantic match (cosine > 0.7) | 0 or 1 |
| **POOL CAP** | `slice(0, 5)` — hard limit before shadows | **max 5** |
| Step 3 — Mechanism 3 | Shadow pairing (up to 2 total) | 0, 1, or 2 |
| Step 3 — Mechanism 4 | Maximum distance mode (if fired) | **replaces all: exactly 3** |
| Step 4 | archetypeRAG.js | 0 (passages only) |
| Step 5 | vectorMemory.js + patternDigest | 0 (exchanges + digest only) |
| Step 6 | Inner monologue | 0 |
| Step 7 | Final assembly | 0 |
| Step 7.5 | Self-evaluation + conditional regeneration | 0 |
| Post-response | Autonomy write-back | 0 (state only) |

**Maximum pool size: 7 (5 capped + 2 shadows). Not 8, 10, or 12.**

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

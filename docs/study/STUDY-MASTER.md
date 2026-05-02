# PNEUMA-AI STUDY MASTER

---

## TEACHING RULES (read this first — follow every session)

1. SHORT responses only — no walls of text
2. One chunk at a time — never show two code blocks in one response
3. Show the code block first, explain with inline comments — not separate paragraphs after
4. Always stop after a chunk and ask "Got it?" — wait for confirmation before moving on
5. Use analogies over theory:
   - fusion.js = orchestra conductor — all instruments play, it decides who and when
   - archetypes = camera lenses, not costumes — they change HOW Pneuma sees, not WHO it is
   - vectorMemory = a library where books are shelved by meaning, not title
   - archetypeMomentum = a leaderboard that resets slowly — winners keep winning unless challenged
   - innerMonologue = kitchen prep before food reaches the table
   - RAG = looking up the recipe when needed instead of memorizing the cookbook
6. Note ONE cross-file connection per chunk — who calls this? what does this feed?
7. Never assume knowledge — ask before moving on
8. Role-color every file mentioned: 🔴 entry, 🟡 orchestrator, 🟢 worker, 🔵 utility
9. If I say "lost me" — stop, rewind to the analogy, try a different one
10. If I say "got it" — move to the next chunk immediately, no recap
11. For LLM concepts: always explain WHY the choice was made (why RAG over bigger prompt, why Haiku for dreams, etc.)
12. When I say "interview prep" — switch to interview coach mode (use the Interview Prep section at the bottom)

### Inline Comment Format (always use this style)

```javascript
// WHAT THIS IS: short description
// WHY IT EXISTS: what problem it solves
// CONNECTION: → feeds into [OtherFile.jsx] or ← called by [fusion.js]

const example = someFunction(); // ← what this line does in plain English
```

### The Chunk Method

1. Identify the file — state its role color (🔴🟡🟢🔵) and one-sentence purpose
2. Break the file into 2-3 block segments (chunks)
3. For each chunk:
   - Show the exact code block with inline comments
   - Note ONE connection to another file
   - Stop. Ask these three questions and wait for answers:
     1. "In your own words — what does this do?"
     2. "What calls this / what does this call next?"
     3. "What would break if this function didn't exist?"
4. Never move to the next chunk until all three are answered
5. Never explain more than one chunk per response

### How to Start a Session

Paste this file into a new chat, then say one of:

- "Let's study a chunk. Here's the file: [paste or upload file]"
- "Next chunk — continuing from where we left off in [filename]"
- "Interview prep — explain how Pneuma's archetype routing works"

---

## CURRENT PROGRESS

_(Update this manually after each session)_

- [ ] Phase 1: The Flow Spine
  - [ ] 1. server/index.js
  - [ ] 2. server/pneuma/core/fusion.js
  - [ ] 3. server/pneuma/core/responseEngine.js
  - [ ] 4. server/pneuma/intelligence/llm.js
  - [ ] 5. server/pneuma/memory/longTermMemory.js
- [ ] Phase 2: Groups A–J
  - [ ] Group A — Config
  - [ ] Group B — Pre-response cognition
  - [ ] Group C — Archetype system
  - [ ] Group D — Intelligence routing
  - [ ] Group E — Memory layer 2
  - [ ] Group F — Behavior modifiers
  - [ ] Group G — Input processing
  - [ ] Group H — Personality layer
  - [ ] Group I — Services & Utils
  - [ ] Group J — Frontend
- [ ] Phase 3: Interview Readiness
  - [ ] Gap 1 — Dynamic RAG Window (explain + interview framing)
  - [ ] Gap 2 — Internal Tensions (explain + interview framing)
  - [ ] Cold open (30-second pitch, no hesitation)
  - [ ] Flow 1 cold trace (philosophical message, no notes)
  - [ ] Flow 2 cold trace (greeting, no notes)
  - [ ] Flow 3 cold trace (voice, no notes)
  - [ ] All interview questions answered without looking

---

## LEARNING STYLE

- Visual/spatial thinker — thinks in patterns, not rules
- Learns through kata — repetition of correct form
- One concept at a time. Real-world analogies over abstract theory.

---

## STUDY SEQUENCE

### ⚡ PHASE 1 — The Flow Spine (5 files)

**Do not skip around. Do not start Phase 2 until you pass the gate.**

| #   | File                                     | Role            | What it does                                                                                                                                                                   |
| --- | ---------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `server/index.js`                        | 🔴 Entry        | Front door — every request enters here, every route defined here                                                                                                               |
| 2   | `server/pneuma/core/fusion.js`           | 🟡 Orchestrator | Traffic controller — receives the message, calls every subsystem, builds the final reply                                                                                       |
| 3   | `server/pneuma/core/responseEngine.js`   | 🟡 Orchestrator | 4-layer pipeline: Intent → Tone → Personality → Continuity                                                                                                                     |
| 4   | `server/pneuma/intelligence/llm.js`      | 🟢 Worker       | Where Claude actually gets called — system prompt, archetype injection (43 cognitive integrations + signatureMoves), pre-thinking, vector memory, eval loop all assembled here |
| 5   | `server/pneuma/memory/longTermMemory.js` | 🟢 Worker       | Structured cross-session memory — user facts, recurring topics, session emotional handoff                                                                                      |

**Phase 1 gate:** Draw this on paper without looking:

```
user → index.js → fusion.js → responseEngine.js → llm.js → Claude → back to user
```

Label what each file is responsible for. If you can do it, move to Phase 2.

---

### 🔵 PHASE 2 — Filling In the Details

Each group fills in something Phase 1 referenced but didn't explain.

#### Group A — Config _(tiny — clears up every import you saw in Phase 1)_

| #   | File                      | Role       | What it does                                              |
| --- | ------------------------- | ---------- | --------------------------------------------------------- |
| 6   | `server/config/paths.js`  | 🔵 Utility | All file path constants — single source of truth          |
| 7   | `server/config/models.js` | 🔵 Utility | Which Claude model does what — change one line to upgrade |

#### Group B — Pre-response cognition _(called by llm.js before the Claude API call)_

> 🔥 **HERE IT IS — U2:** Pre-thinking is a real LLM call. `generatePreThinking()` calls Haiku with the active archetypes — they react, find tension, produce emergent insight. This is a two-model cognitive pipeline, not templates.

| #   | File                                       | Role      | What it does                                                                                                         |
| --- | ------------------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------- |
| 8   | `server/pneuma/behavior/innerMonologue.js` | 🟢 Worker | Real LLM pre-thinking — archetypes react to the message, identify tension, produce emergent insight via Claude Haiku |
| 9   | `server/pneuma/behavior/autonomy.js`       | 🟢 Worker | Self-directed agency — poses own questions, chooses what to remember, notices own errors                             |

#### Group C — Archetype system _(the data and logic that feeds llm.js)_

> 🔥 **HERE IT IS — U1, U7, U8:** Archetypes are cognitive methods, not personas. signatureMoves prevent collapse into generic output. Constraints are converted to hard MUST/NEVER directives. This is where the architecture diverges from every other AI personality system.

| #   | File                                            | Role       | What it does                                                                     |
| --- | ----------------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| 10  | `server/pneuma/archetypes/archetypes.js`        | 🔵 Utility | 43 archetypes — essences, coreFrameworks, signatureMoves + semantic tags         |
| 11  | `server/pneuma/archetypes/archetypeDepth.js`    | 🟢 Worker  | Deep frameworks, tension maps, conceptual bridges per archetype                  |
| 12  | `server/pneuma/archetypes/archetypeMomentum.js` | 🟢 Worker  | Archetypes gain/lose weight across sessions — personality that actually evolves  |
| 13  | `server/pneuma/archetypes/archetypeFusion.js`   | 🟢 Worker  | Tracks successful archetype combos — crystallizes into a default voice over time |

> **Note:** `ARCHETYPE_INTEGRATION` in `llm.js` (~line 439) is the third layer of the archetype system — it's not a separate file, it lives in llm.js. **43 archetypes with full cognitive definitions.** Each has: chainOfThought (reasoning process), cognitiveOp (the specific move), signatureMove (a REQUIRED behavioral instruction — e.g. Feynman must simplify, Rumi must find the paradox inside the feeling), and constraints (what it enforces or forbids). `buildArchetypeIntegration()` was rewritten to mark signatureMoves as mandatory — Claude must make the move detectable in the response. Study this alongside Group C. The companion study doc is `docs/study/ARCHETYPE_STUDY_MASTER.md`.

#### Group D — Intelligence routing _(called inside llm.js to select and enrich context)_

> 🔥 **HERE IT IS — U3, U6:** Collision detection forces emergent insight from incompatible archetypes. CONTRAST_MAP deliberately retrieves opposing thinkers. Both are categorically different from standard RAG-and-select patterns.

| #   | File                                              | Role      | What it does                                                                                                                                                                                                                                                                                                                     |
| --- | ------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 14  | `server/pneuma/intelligence/archetypeSelector.js` | 🟢 Worker | Cosine similarity — finds best archetype match for the user message                                                                                                                                                                                                                                                              |
| 15  | `server/pneuma/intelligence/archetypeRAG.js`      | 🟢 Worker | Concept Crossroads multi-query RAG — detects ~60 philosophical concepts, fires parallel concept×active-thinker embedding queries, scores passages for relevance + distinctiveness + collision potential, deduplicates into topK=8 passages optimized for dialectic tension; single-query fallback for non-philosophical messages |
| 16  | `server/pneuma/intelligence/synthesisEngine.js`   | 🟢 Worker | Collision detection — finds when two archetypes create productive tension                                                                                                                                                                                                                                                        |

#### Group E — Memory layer 2 _(the two memory systems Phase 1 didn't cover)_

| #   | File                                          | Role      | What it does                                                                                                                                                        |
| --- | --------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 17  | `server/pneuma/memory/vectorMemory.js`        | 🟢 Worker | Semantic memory — stores messages as OpenAI embeddings, retrieves by meaning; llm.js combines this with the last 4 recent turns for hybrid recency+semantic context |
| 18  | `server/pneuma/memory/conversationHistory.js` | 🟢 Worker | Full conversation persistence + session timeout detection                                                                                                           |

#### Group F — Behavior modifiers _(called by fusion.js before response generation)_

| #   | File                                     | Role      | What it does                                                                 |
| --- | ---------------------------------------- | --------- | ---------------------------------------------------------------------------- |
| 19  | `server/pneuma/behavior/uncertainty.js`  | 🟢 Worker | Quiet mode, admitting not-knowing, perspective shift detection               |
| 20  | `server/pneuma/behavior/disagreement.js` | 🟢 Worker | Pushback engine — challenges user instead of agreeing                        |
| 21  | `server/pneuma/behavior/dreamMode.js`    | 🟢 Worker | Between-session synthesis via Claude Haiku — Pneuma thinks while you're away |

#### Group G — Input processing _(called by index.js /voice route only)_

| #   | File                                        | Role      | What it does                                                                   |
| --- | ------------------------------------------- | --------- | ------------------------------------------------------------------------------ |
| 22  | `server/pneuma/input/emotionDetection.js`   | 🟢 Worker | Whisper (voice→text) + Hume AI (emotion from voice prosody) → archetype boosts |
| 23  | `server/pneuma/input/rhythmIntelligence.js` | 🟢 Worker | Conversation tempo — time of day, message velocity, length trends              |

#### Group H — Personality layer _(called by responseEngine.js to shape the voice)_

| #   | File                                       | Role      | What it does                                                                          |
| --- | ------------------------------------------ | --------- | ------------------------------------------------------------------------------------- |
| 24  | `server/pneuma/personality/personality.js` | 🟢 Worker | 2600-line voice engine — 5 tone templates, 50+ micro-engines (break into 8-10 chunks) |

#### Group I — Services & Utils

> 🔥 **HERE IT IS — U5:** state.js contains the 9 evolution vectors. archetypeMomentum.js tracks what resonated. Together with dreamMode.js's weekly baseline evolution, this is the system that makes Pneuma demonstrably different after 50 conversations — personality that evolves through evidence, not programming.

| #   | File                                       | Role       | What it does                                                     |
| --- | ------------------------------------------ | ---------- | ---------------------------------------------------------------- |
| 25  | `server/pneuma/services/tts.js`            | 🟢 Worker  | ElevenLabs TTS — pronunciation fixes + inflection hints          |
| 26  | `server/pneuma/services/tokenTracker.js`   | 🔵 Utility | Monthly Claude API token budget — warns at 15/10/5/1% thresholds |
| 27  | `server/pneuma/state/state.js`             | 🟢 Worker  | Evolution vectors + thread memory + identity anchors             |
| 28  | `server/pneuma/utils/mismatchLogger.js`    | 🔵 Utility | Detects when user corrects Pneuma — logs mismatches              |
| 29  | `server/pneuma/utils/upgrade.js`           | 🔵 Utility | Upgrade command parser — tune personality weights live           |
| 30  | `server/pneuma/config/personal-context.js` | 🔵 Utility | Private user profile injected into LLM for calibrated responses  |

#### Group J — Frontend

| #   | File                                                                      | Role            | What it does                                       |
| --- | ------------------------------------------------------------------------- | --------------- | -------------------------------------------------- |
| 31  | `client/src/main.jsx`                                                     | 🔴 Entry        | React root + BrowserRouter + PWA service worker    |
| 32  | `client/src/App.jsx`                                                      | 🟡 Orchestrator | Routing, conversation state, active engine state   |
| 33  | `client/src/components/ChatBox/ChatBox.jsx`                               | 🟡 Orchestrator | Main chat UI — input, voice, TTS, message display  |
| 34  | `client/src/components/ConsciousnessIndicator/ConsciousnessIndicator.jsx` | 🟢 Worker       | 4 colored nodes show which backend engine fired    |
| 35  | `client/src/components/Sidebar/Sidebar.jsx`                               | 🟢 Worker       | Conversation list — multi-select, delete, new chat |
| 36  | `client/src/components/LandingPage/LandingPage.jsx`                       | 🟢 Worker       | Entry gate — shown before main app                 |
| 37  | `client/src/components/Title3D/Title3D.jsx`                               | 🟢 Worker       | 3D "PNEUMA" title (React Three Fiber)              |
| 38  | `client/src/components/SoundWave/SoundWave.jsx`                           | 🟢 Worker       | Animated sound wave during voice recording         |
| 39  | `client/src/components/ArchitectureDiagram/ArchitectureDiagram.jsx`       | 🟢 Worker       | Interactive system diagram (portfolio piece)       |

---

## KEY FLOWS

### Flow 1: Text Message → Response

```
User types message
  → ChatBox.jsx (POST /chat with message)
  → index.js /chat route
  → fusion.js pneumaRespond()
    → state.js loadState()
    → rhythmIntelligence.js analyzeRhythm()
    → longTermMemory.js getRelevantMemories()
    → disagreement.js analyzePushback()
    → uncertainty.js shouldBeQuiet()
    → responseEngine.js generate()
      → llm.js getLLMContent()
        → innerMonologue.js generatePreThinking() [real Claude Haiku call — archetypes react, tensions surface]
        → archetypeSelector.js findBestArchetype()
        → archetypeRAG.js getArchetypeContext()
        → synthesisEngine.js detectCollisions()
        → conversationHistory.js getCurrentExchanges() [last 4 turns, always included]
        → vectorMemory.js retrieveMemories() [semantic search, deduplicated against recent turns]
        → Anthropic Claude API call (Sonnet)
        → evalResponse() [Haiku] scores output 0-1
        → if score < 0.6: regenerate once with eval feedback injected
      → modeSelector.js selectTone()
      → personality.js buildResponse()
    → fusion.js builds finalReply (memory phrases, rhythm phrases, etc.)
    → conversationHistory.js recordExchange()
    → longTermMemory.js updateMemory()
    → state.js saveState()
  → index.js returns { reply, engine, mode }
  → ChatBox.jsx displays reply + updates ConsciousnessIndicator
```

### Flow 2: Voice → Transcription → Response

```
User holds mic in ChatBox.jsx
  → Records audio via MediaRecorder API
  → POST /voice with audio buffer
  → index.js /voice route
    → emotionDetection.js transcribeAudio() via Whisper
    → emotionDetection.js analyzeVoiceEmotion() via Hume AI
    → emotionDetection.js emotionToArchetypeBoost()
    → fusion.js pneumaRespond(text, { emotions, archetypeBoosts })
      → (same as Flow 1, but with emotion context boosting archetypes)
  → Returns { reply, transcription, emotions, engine, mode }
```

### Flow 3: Dream Generation (background/offline)

```
After every /chat response:
  → index.js triggers triggerDialecticDream() fire-and-forget
  → dreamMode.js checks throttle (30-min minimum gap)
  → dreamMode.js retrieves vectorMemory (recent context)
  → dreamMode.js gets top archetypes from archetypeMomentum
  → dreamMode.js finds high-tension archetype pairs (archetypeDepth)
  → dreamMode.js calls Claude Haiku with dialectical synthesis prompt
  → dreamMode.js saves dream to pneuma_dreams.json

On next /dreams GET:
  → Fetches undelivered dreams → marks delivered → returns to frontend
```

### Flow 4: Archetype Selection (3-Layer Routing)

```
User message arrives at llm.js
  → Layer 1: archetypeSelector.js findBestArchetype()
    → getEmbedding(userMessage) via OpenAI
    → cosineSimilarity() against 43 archetype embeddings
    → Returns highest-scoring archetype
  → Layer 2: archetypeMomentum.js getMomentumWeights()
    → Which archetypes have been "winning" → applies boost
  → Layer 3: archetypeFusion.js getRecommendedBlend()
    → Proven combinations from past success
  → synthesisEngine.js detectCollisions()
    → Finds tension → generates dialectical synthesis prompt
  → All injected into Claude's system context
```

### Flow 5: Archetype Momentum Evolution

```
Each conversation:
  → boostActiveArchetypes() when archetypes fire
  → Decay applied to unused archetypes (toward 0.5 neutral)
  → recordFusion() logs which combos were used
  → User signals → processFeedback() → reinforce or penalize blend
  → Successful combos → crystallizeBlend()
  → Over time: "default voice" emerges from weighted average
```

---

## PROJECT STRUCTURE

```
pneuma-ai/
├── server/
│   ├── index.js                     🔴 Entry — all routes, server startup
│   ├── config/
│   │   ├── paths.js                 🔵 File path constants
│   │   └── models.js                🔵 Claude model IDs
│   └── pneuma/
│       ├── core/
│       │   ├── fusion.js            🟡 Main orchestrator
│       │   ├── responseEngine.js    🟡 4-layer response pipeline
│       │   └── modeSelector.js      🟢 Tone selection
│       ├── intelligence/
│       │   ├── llm.js               🟢 Claude API + system prompt
│       │   ├── archetypeSelector.js    🟢 Cosine similarity routing
│       │   ├── archetypeRAG.js      🟢 RAG from thinker texts
│       │   ├── synthesisEngine.js   🟢 Collision detection + synthesis
│       │   ├── thinkerDeep.js       🔵 Deep thinker content
│       │   └── thinking.js          🔵 Thought patterns
│       ├── archetypes/
│       │   ├── archetypes.js        🔵 43 archetypes (essences + signatureMoves)
│       │   ├── archetypeDepth.js    🟢 Frameworks + tension maps
│       │   ├── archetypeFusion.js   🟢 Blend crystallization
│       │   └── archetypeMomentum.js 🟢 Weight decay/boost
│       ├── memory/
│       │   ├── vectorMemory.js      🟢 Semantic memory (embeddings)
│       │   ├── longTermMemory.js    🟢 Cross-session structured memory
│       │   └── conversationHistory.js 🟢 Full convo persistence
│       ├── behavior/
│       │   ├── innerMonologue.js    🟢 Pre-thinking via Claude Haiku LLM call
│       │   ├── autonomy.js          🟢 Self-directed agency
│       │   ├── dreamMode.js         🟢 Between-session synthesis
│       │   ├── uncertainty.js       🟢 Quiet mode, not-knowing
│       │   ├── disagreement.js      🟢 Pushback engine
│       │   └── reflectionEngine.js  🟢 Emotion + reflection
│       ├── input/
│       │   ├── emotionDetection.js  🟢 Whisper + Hume AI
│       │   └── rhythmIntelligence.js 🟢 Conversation tempo
│       ├── personality/
│       │   └── personality.js       🟢 2600-line voice engine
│       ├── services/
│       │   ├── tts.js               🟢 ElevenLabs TTS
│       │   └── tokenTracker.js      🔵 Token budget tracking
│       └── state/
│           └── state.js             🟢 Evolution vectors + identity
├── client/
│   └── src/
│       ├── main.jsx                 🔴 React root + PWA
│       ├── App.jsx                  🟡 Routing + state
│       └── components/
│           ├── ChatBox/             🟡 Main chat UI
│           ├── Sidebar/             🟢 Conversation list
│           ├── ConsciousnessIndicator/ 🟢 Engine state visual
│           └── ArchitectureDiagram/ 🟢 Interactive diagram
└── data/                            # JSON state (gitignored)
    ├── pneuma_state.json            # Evolution vectors + weights
    ├── long_term_memory.json        # Cross-session user memory
    ├── vector_memory.json           # Semantic embeddings
    ├── conversations.json           # Full conversation log
    ├── archetype_momentum.json      # Per-archetype weights
    ├── archetype_fusions.json       # Crystallized blends
    ├── pneuma_dreams.json           # Between-session dreams
    ├── token_usage.json             # API budget tracking
    └── archetype_knowledge/         # RAG source texts
```

---

## COURSES YOU TOOK — WHAT THEY MAP TO IN PNEUMA

You took three Anthropic courses. You built Pneuma mostly before finishing them — which means you independently invented several standard patterns without knowing their names. This section maps course concepts to the code, and flags where you innovated on top of them.

---

### Course 1 — Anthropic API Fundamentals

_(Your notebook: messages API, streaming, multi-turn, system prompts, temperature)_

| What you learned                             | Where it lives in Pneuma                     | How Pneuma went further                                                       |
| -------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------- |
| `messages` array with `role: user/assistant` | `conversationHistory.js` — native API turns  | Stores last 6 exchanges so Claude continues threads naturally                 |
| `system` prompt parameter                    | `llm.js:buildSystemPrompt()`                 | You built a tiered 2k→18k conditional loading system — not a static string    |
| Streaming via `stream.text_stream`           | `llm.js:getLLMContent()`                     | Streams back through Express SSE to the React frontend in real time           |
| Temperature for creativity                   | `llm.js` params                              | Temperature varies by tone — oracular gets higher temp than diagnostic        |
| Multi-turn conversation loop                 | `conversationHistory.js` + `vectorMemory.js` | You added semantic memory on top — not just recency, but meaning-based recall |

**Interview line:** "I took the fundamentals course and recognized that Pneuma was already implementing these patterns — but with additional layers on top that the course didn't cover."

---

### Course 2 & 3 — MCP Introduction + Advanced Topics

_(Roots, Sampling, SSE, StreamableHTTP, Stateful vs Stateless, Load Balancing, JSON-RPC)_

MCP is **Pneuma's planned future architecture**. You learned it after building Pneuma — which means you can speak to exactly why you'd migrate and what each server would do.

| MCP concept                                 | What it means for Pneuma                                                                                                                                                               |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MCP server**                              | Pneuma has 3 planned: Wikipedia (replace 75 lines), Cognition (vectorMemory + archetypeRAG + archetypeSelector), Sensory/IO (ElevenLabs + Hume AI)                                     |
| **Roots** (security fence for file access)  | The Cognition MCP server needs to own `archetype_embeddings.json` (51MB) — Roots would define exactly what it can access                                                               |
| **Sampling** (offload AI compute to client) | Dream mode (`dreamMode.js`) already does a form of this — fires Haiku calls in background. MCP Sampling would formalize this pattern                                                   |
| **SSE / streaming transport**               | Pneuma already streams responses via SSE from Express to React — same transport pattern MCP uses for remote servers                                                                    |
| **Stateful vs Stateless**                   | Pneuma is currently stateful (JSON files in `/data`). MCP migration would need to decide: stateful sessions (Cognition server holds embedding cache) vs stateless (recompute per call) |
| **JSON-RPC**                                | MCP tool calls use JSON-RPC — Pneuma's existing tool use loop (`while stop_reason === "tool_use"`) already follows this request/response pattern                                       |

**Interview line:** "After taking the MCP courses, I realized Pneuma's architecture maps cleanly onto the MCP server pattern. I've already scoped three servers — the Wikipedia migration is a 75-line delete, the Cognition server consolidates three OpenAI client instances into one, and the Sensory server isolates the voice pipeline."

---

### The "I Built It Before I Knew The Name" Story

This is your strongest interview angle. Use it.

| Named pattern                   | What you built independently                                                                                        | Where                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **Prompt Chaining**             | intent → archetype selection → RAG → synthesis → generation — each output feeds the next                            | `fusion.js` pipeline     |
| **Chain of Thought**            | Pre-response LLM pre-thinking — archetypes react, tensions identified, emergent insight generated via Haiku call    | `innerMonologue.js`      |
| **RAG + Eval Pipeline**         | Concept detection → parallel concept×thinker queries → score relevance + distinctiveness + collision bonus → topK=8 | `archetypeRAG.js`        |
| **Tool Use / Function Calling** | `while (stop_reason === "tool_use")` loop — halt, execute, return result                                            | `llm.js:getLLMContent()` |
| **Eval Loop**                   | After generating, score with cheap model, regenerate if below threshold                                             | `llm.js:evalResponse()`  |
| **Agentic pipeline**            | Multi-step orchestration with state across turns                                                                    | `fusion.js` + `state.js` |

**Interview framing:** "I built these patterns intuitively while building Pneuma. Taking the Anthropic courses afterward gave me the formal vocabulary for what I'd already implemented — and helped me identify where the architecture could be improved or extended."

---

## ANTHROPIC COURSE CONCEPTS — WHERE THEY LIVE IN PNEUMA

Every concept from the Anthropic courses exists in Pneuma. This table maps the abstract to the concrete. When you see these in code, you should recognize the pattern by name.

| Anthropic Concept                       | Where it lives in Pneuma                        | What to look for                                                                                                                                                                                       |
| --------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **XML tagging**                         | `llm.js:buildSystemPrompt()`                    | Context blocks wrapped in structured delimiters to prevent Claude confusing instructions with data                                                                                                     |
| **System prompt vs user prompt divide** | `llm.js` tiered loading                         | Base ~2k tokens (stable identity) vs deep blocks (conditional, loaded by intent) — the cache anchor IS the system prompt                                                                               |
| **Chain of Thought / scratchpad**       | `innerMonologue.js`                             | Real LLM pre-thinking step — Claude Haiku is called with the active archetypes to react, find tension, and produce emergent insight BEFORE the main response. This IS CoT — but with a separate model. |
| **Prompt chaining**                     | The full pipeline in `fusion.js`                | intent detection → archetype selection → RAG retrieval → synthesis → generation. Each step's output feeds the next.                                                                                    |
| **Prefilling responses**                | `llm.js` structured outputs                     | Forcing structured JSON from Claude by providing the start of the assistant turn                                                                                                                       |
| **Negative constraints**                | `responseEngine.js:enforceIdentityBoundaries()` | Strips phrases violating identity rules — no fake agency, no human mimicry. These ARE negative constraints.                                                                                            |
| **Tool use / function calling**         | `llm.js:getLLMContent()`                        | The `while (stop_reason === "tool_use")` loop — Claude halts, your server runs the tool, result goes back as `tool_result`                                                                             |
| **Citation + grounding**                | `archetypeRAG.js`                               | Passages injected into system prompt with source thinker attributed — prevents hallucinating "memories"                                                                                                |

### What this means for studying

When Claude (the tutor) shows you a chunk of `innerMonologue.js`, the right answer to "what Anthropic technique is this?" is: **Chain of Thought**. When you see the tool loop in `llm.js`, the right answer is: **function calling pattern**. Make this mapping automatic.

### The one concept Pneuma doesn't fully use yet

**Prefilling** — Pneuma uses it for structured tool outputs, but not systematically for all JSON responses. This is Gap-adjacent: knowing where prefilling _could_ be added is an interview answer about future improvements.

---

## TECH STACK

| Layer     | Technology                                                               |
| --------- | ------------------------------------------------------------------------ |
| Frontend  | React 19, Vite, React Router v7, React Three Fiber, Axios                |
| Backend   | Node.js, Express 5, ES Modules                                           |
| AI Core   | Anthropic SDK (Claude Sonnet + Haiku), OpenAI SDK (Whisper + embeddings) |
| TTS/Voice | ElevenLabs (TTS), Hume AI (emotion detection)                            |
| Memory    | JSON flat-file vector store (cosine similarity)                          |
| State     | JSON files in /data — persistent across sessions                         |

---

## KEY CONCEPTS

| Concept                         | Where it lives                        | Why it matters                                                                                                                                                                                                           |
| ------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Vector embeddings               | vectorMemory.js, archetypeSelector.js | Numbers that capture meaning — the math behind semantic search                                                                                                                                                           |
| Cosine similarity               | vectorMemory.js                       | Measures "closeness" in vector space — angle between two vectors                                                                                                                                                         |
| RAG (Concept Crossroads)        | archetypeRAG.js                       | Detect philosophical concepts in message → parallel concept×thinker queries → evaluate relevance + distinctiveness + collision bonus → deduplicate into topK=8 passages scoped to active thinkers only                   |
| System prompt engineering       | llm.js                                | 5400+ lines shaping Claude's identity — the craft of telling an LLM WHO it is                                                                                                                                            |
| Dynamic injection               | llm.js                                | Adding archetype phrases + thinker content to the prompt ONLY when relevant                                                                                                                                              |
| ARCHETYPE_INTEGRATION           | llm.js (~line 439)                    | 43 archetypes: chainOfThought + cognitiveOp + signatureMove (REQUIRED) + constraints. signatureMove is key — it's the concrete behavioral instruction that prevents generic output. Companion: ARCHETYPE_STUDY_MASTER.md |
| Eval loop                       | llm.js `evalResponse()`               | After generating, a Haiku call scores output 0–1; if < 0.6 it regenerates once with feedback injected. Skips on casual or short responses                                                                                |
| Archetype collision / synthesis | synthesisEngine.js                    | Two opposing archetypes both active → force them to produce something new                                                                                                                                                |
| Archetype momentum              | archetypeMomentum.js                  | Weight decay — personality that actually changes over time                                                                                                                                                               |
| Crystallized blends             | archetypeFusion.js                    | Proven combos get reinforced → emerge as a "default voice"                                                                                                                                                               |
| Pre-thinking (inner monologue)  | innerMonologue.js                     | Real LLM call: archetypes react, tensions identified, emergent insight — shapes main response                                                                                                                            |
| Session handoff                 | longTermMemory.js                     | Remembers emotional state from last session to continue naturally                                                                                                                                                        |
| Quiet mode                      | uncertainty.js                        | Sometimes presence beats words — Pneuma knows when to say less                                                                                                                                                           |
| Dialectical tension             | archetypeDepth.js                     | Holding two opposing ideas until they produce a third (Hegel without jargon)                                                                                                                                             |
| Fire-and-forget                 | index.js                              | Async background task that doesn't block the response — dreams work this way                                                                                                                                             |
| ES Modules                      | server/package.json                   | Why server uses `import` not `require` — modern Node.js module system                                                                                                                                                    |

---

## 🔥 WHAT MAKES THIS ARCHITECTURE UNIQUE

**Read this section before studying anything. Come back to it whenever you recognize one of these patterns in the code.**

Most AI applications call an API and display the result. Pneuma is architecturally different in ways that are not incremental improvements — they are categorically distinct designs. When you encounter one while studying, you'll see a `🔥 HERE IT IS` callout in the relevant section below telling you which uniqueness point you're looking at.

### U1 — Archetypes Are Cognitive Methods, Not Personas

**Where you'll see it:** Group C, Group D, llm.js chunks 2-3
Every other AI personality system uses "personas" — tone-of-voice templates. Pneuma's 43 archetypes are cognitive operations: each has a `signatureMove` (a REQUIRED behavioral instruction the model must execute), a `chainOfThought` (how to reason), and `cognitiveOp` (what mental move to apply). Feynman doesn't "sound like Feynman" — he applies hypothetical simplification. Rumi doesn't quote poetry — he locates the paradox inside the feeling. This is the difference between a costume and a lens.

### U2 — Pre-Thinking Is a Real LLM Call, Not Templates

**Where you'll see it:** Group B (innerMonologue.js), llm.js chunk 5
`generatePreThinking()` calls Claude Haiku with the active archetypes and the user's message. Each archetype reacts, a core tension is identified, and an emergent insight forms — BEFORE the main Claude call. Most CoT implementations are either extended thinking (inside one call) or template strings. Pneuma runs a separate cheap model to think first, then feeds that thinking into the expensive model. Two-model cognitive pipeline.

### U3 — Archetype Collisions Produce Emergent Insight

**Where you'll see it:** Group D (synthesisEngine.js, synthesisExemplars.js), llm.js chunk 3
When two incompatible archetypes are both active (Camus × Frankl on meaning, Jung × Taleb on growth), Pneuma doesn't average them. It forces a collision: Claude is told to dwell in the tension and produce a position neither archetype alone could hold. Hand-written exemplars for 30+ pairs show what "emergent" actually looks like — not "both have good points" but genuinely new third positions.

### U4 — The Prompt Has a Two-Block Architecture for Cache Efficiency

**Where you'll see it:** llm.js chunk 4 (buildSystemPrompt)
`stableBlock` (~identity, always cached by Anthropic's prompt caching) + `dynamicBlock` (freshly assembled per-request from ~21 sub-blocks based on intent scores). The stable part never changes, so it stays in the ephemeral cache. The dynamic part loads conditionally: a casual "hey" loads ~2k tokens, a deep philosophical question loads up to 18k. This isn't just optimization — it's the architectural decision that makes the tiered system possible.

### U5 — Personality Evolves Through Evidence, Not Programming

**Where you'll see it:** Group I (state.js), Group C (archetypeMomentum.js), Group F (dreamMode.js)
Nine evolution vectors (mythicDepth, casualGrounding, emotionalResonance, etc.) shift after every message. Momentum weights track which archetypes resonated. Dream mode runs weekly baseline evolution from vector memory patterns. After 50 conversations, Pneuma's default voice is demonstrably different from day one — not because it was programmed to change, but because the vectors drifted through accumulated evidence. No other architecture in this space does this.

### U6 — RAG Is Concept-Targeted and Evaluates for Collision Potential

**Where you'll see it:** Group D (archetypeRAG.js), CONTRAST_MAP, PHILOSOPHICAL_CONCEPTS list
Standard RAG runs one embedding query per message and returns the most similar passages. Pneuma's Concept Crossroads architecture does three distinct things instead: (1) detects ~60 philosophical concepts in the message (time, death, consciousness, change, freedom, love, paradox, and others) and runs parallel embedding queries per concept × active thinker — so a message about time gets queried as "time Feynman", "time Rumi", "time Schopenhauer", etc.; (2) scores every candidate passage on relevance × 0.5 + distinctiveness × 0.3 + collision bonus × 0.2 — passages from thinkers known to contradict each other get a bonus; (3) deduplicates near-identical passages and fills to topK=8. The CONTRAST_MAP still applies as a tiebreaker for edge cases, but the primary mechanism is now concept-level targeting, not post-hoc opposition injection.

### U7 — signatureMoves Prevent Archetype Collapse

**Where you'll see it:** Group C, llm.js chunk 2 (ARCHETYPE_INTEGRATION + buildArchetypeIntegration)
Before signatureMoves, all 43 archetypes collapsed into "wise philosopher who agrees with you" because the model treated archetype names as flavor text. signatureMoves are concrete, testable behavioral instructions: "find the simplest possible example that captures the principle" (Feynman), "compress until paradox emerges — let contradiction stand without resolution" (mystic), "name what everyone is politely ignoring" (trickster). buildArchetypeIntegration() marks these as REQUIRED — the move must be detectable in the response.

### U8 — Constraint Injection Forces Real Behavioral Boundaries

**Where you'll see it:** llm.js chunk 2 (ARCHETYPE_INTEGRATION constraints)
Each archetype's constraints aren't suggestions — they're converted to hard `MUST` / `NEVER` directives: `maxWords: 40` becomes "MUST: Keep response under 40 words." `noQuestions: true` becomes "NEVER: Ask questions — only declare." `mustBeDirect: true` becomes "MUST: Be declarative — no hedging." 15 constraint types are now converted. Previously they were silently dropped.

---

### How to use this section while studying

When you hit a chunk that contains one of these patterns, stop and ask yourself:

1. "Which uniqueness point (U1-U8) am I looking at?"
2. "Could I explain to an interviewer WHY this is different from the standard approach?"
3. "What would break if this wasn't here?"

If you can answer all three, the pattern is internalized. Move on.

---

## SESSION CHANGES — Apr 30 2026

### What was built this session: Image Input Pipeline

A complete image-upload-and-memory system was added. These are the actual changes — bring this into any study session to explain what changed and why.

---

#### 1. Server startup fix (pre-session)

**Files:** `server/index.js`, `server/db.js`, `server/pneuma/memory/vectorMemory.js`, `server/pneuma/input/emotionDetection.js`, `server/pneuma/intelligence/archetypeRAG.js`

**Problem:** `new MongoClient(process.env.MONGODB_URI)` and `new OpenAI(...)` were running at module load time, before dotenv had injected env vars → crash on `make s`.

**Fix:** Lazy init — clients created inside `connectDB()` / `getOpenAI()` getter functions, called only when first needed. Added `--env-file=.env` flag to the Node start command in `Makefile` and `package.json`.

**Interview line:** "Understood that ES module top-level code executes at import time, before any startup logic runs. Moved client instantiation into functions so env vars are guaranteed to exist when the client is created."

---

#### 2. Image input — multipart upload (backend)

**File:** `server/index.js`

**What was added:**

- Installed `multer` (memory storage, 20MB limit, `image/*` filter)
- Wired `imageUpload.single("image")` middleware onto the `/chat` POST route
- When `req.file` exists: extracts `buffer.toString("base64")` + `mimetype` → `imageData = { base64, mediaType }` → stored in `requestContext` as `ctx.imageData`

**Tech used:** `multer` with `memoryStorage()` — file never touches disk, lives in memory as a Buffer until the base64 conversion.

---

#### 3. Image input — Anthropic vision API (LLM layer)

**File:** `server/pneuma/intelligence/llm.js`

**What was added:** In the message-array builder, when `ctx.imageData` is present, the current user turn is replaced with an Anthropic multimodal content block:

```js
[
  { type: "image", source: { type: "base64", media_type, data } },
  { type: "text", text: message || "What do you see?" },
];
```

**Why this format:** Anthropic's vision API requires content to be an array of typed blocks, not a plain string, when an image is included. The image must come before the text block.

---

#### 4. Image input — frontend (ChatBox)

**Files:** `client/src/components/ChatBox/ChatBox.jsx`, `ChatBox.css`

**What was added:**

- `attachedImage` state (`null` or `{ file, previewUrl }`)
- `attachImageFile(file)` — validates `image/*`, creates blob URL
- `clearAttachedImage()` — clears state (does NOT revoke blob URL — see bug fix below)
- Drag-over handlers on the input container; drop handler calls `attachImageFile`
- Hidden `<input type="file" accept="image/*">` + attach button (SVG paperclip icon)
- `handleSend`: detects `attachedImage` → builds `FormData` instead of JSON, appends `message`, `sessionId`, `image`
- Sent image stored in message object as `imagePreview` blob URL → rendered as `<img>` inside the user bubble

**Bug fixed — blob URL revocation:** `clearAttachedImage()` was calling `URL.revokeObjectURL()` before the blob URL was written into the messages array. Browser releases the memory, `<img>` has nothing to load. Fix: removed the revoke from `clearAttachedImage()`. URL stays alive as long as the message bubble lives.

**Bug fixed — document drop listener:** A `document.addEventListener("drop", preventDefault)` was consuming every drop event at document level before React's `onDrop` could receive it. Fix: removed `drop` from the document listener, kept only `dragover` (still needed to block browser navigation when dragging a file over a non-drop-zone area).

**Bug fixed — clip-path hiding preview strip:** `.input-container` has `clip-path: polygon(...)`. The preview strip was absolutely positioned inside it with `bottom: 100%` — anything outside the polygon bounds is painted invisible. Fix: wrapped the whole input area in `.input-area-wrapper` (flex-column), moved the preview strip above `input-container` as a normal-flow sibling div. Escapes the clip-path entirely.

---

#### 5. Image memory across turns (MongoDB)

**Files:** `server/pneuma/memory/imageMemory.js` _(new)_, `server/pneuma/core/fusion.js`, `server/pneuma/intelligence/llm.js`

**Problem:** On follow-up messages ("what do you think of it?"), no image is attached. The 6-turn conversation history stores only text. Claude receives no pixel data and says "I don't see an image."

**Solution — `imageMemory.js`:**

- New module: MongoDB collection `imageMemory`, keyed by `sessionId`
- JSON file fallback at `data/image_memory.json`
- `saveImageDescription(sessionId, description, userCaption)` — upserts Pneuma's full reply text + the user's caption
- `loadImageDescription(sessionId)` — returns the stored record or null

**`fusion.js`:** After generating the image-turn reply, fire-and-forget saves it:

```js
if (ctx.imageData && ctx.sessionId) {
  saveImageDescription(ctx.sessionId, String(finalReply), userMessage || "");
}
```

Also stores `[shared an image] <user text>` as the user message in conversation history (for the 6-turn window).

**`llm.js`:** Before calling `buildSystemPrompt`, loads the stored description:

```js
if (!ctx.imageData && ctx.sessionId) {
  context._imageDescription = await loadImageDescription(ctx.sessionId);
}
```

Injects it into the dynamic system prompt block as:

> _"Earlier in this conversation you saw and described an image... Your description at the time was: [Pneuma's own words]"_

**Why MongoDB:** The 6-turn window is too short for image memory. MongoDB persists indefinitely. Pneuma references his own prior analysis — not a generic denial — on every follow-up turn, in the same session or a future one.

---

### Updated Tech Stack Entry

MongoDB is now actively used for: `longTermMemory`, `vectorMemory`, and `imageMemory` collections. All three follow the same pattern: try MongoDB → catch → fall back to JSON file in `/data`.

---

## API REFERENCE

### Chat & Voice

| Method | Endpoint | Input                     | Output                                             |
| ------ | -------- | ------------------------- | -------------------------------------------------- |
| POST   | /chat    | `{ message: string }`     | `{ reply, engine, mode }`                          |
| POST   | /voice   | Audio buffer (25MB limit) | `{ reply, transcription, emotions, engine, mode }` |
| POST   | /tts     | `{ text: string }`        | Audio buffer (audio/mpeg)                          |

### Conversations

| Method | Endpoint           | Input | Output                                                   |
| ------ | ------------------ | ----- | -------------------------------------------------------- |
| GET    | /conversations     | —     | `{ conversations: [{ id, title, date, messageCount }] }` |
| GET    | /conversations/:id | —     | `{ messages: [{sender, text, timestamp}], id }`          |
| DELETE | /conversations/:id | —     | `{ success, deleted }`                                   |

### System

| Method | Endpoint        | Input               | Output                                    |
| ------ | --------------- | ------------------- | ----------------------------------------- |
| GET    | /dreams         | —                   | `{ dreams: [], message: formattedDream }` |
| POST   | /dreams/trigger | `{ count: number }` | `{ success, dreams }`                     |
| GET    | /momentum       | —                   | Archetype momentum stats                  |
| GET    | /               | —                   | Health check                              |

### Mode Strings

`casual` · `oracular` · `analytic` · `intimate` · `shadow` · `diagnostic` · `upgrade` · `pushback` · `quiet` · `uncertain`

---

## ⚡ PHASE 3 — Interview Readiness

**Only start Phase 3 when Phase 1 and Phase 2 are done.**
Phase 3 is active recall and gap mastery — no more teaching, only drilling.

When I say "interview prep", switch to interview coach mode and use the section below.
When I say "gap drill", use the Gap section immediately below.

---

### THE GAPS (turn these into strengths)

#### ✅ Gap 1 — Concept Crossroads (SHIPPED — Apr 2026)

**What shipped:** `archetypeRAG.js` now detects ~60 philosophical concepts and runs parallel concept×active-thinker embedding queries. Passages scored for relevance × 0.5 + distinctiveness × 0.3 + collision bonus × 0.2. topK raised 5→8, minScore lowered 0.35→0.3. Single-query fallback retained for non-philosophical messages.

**Interview framing:**

> "I started with a fixed topK=5 single-query approach to validate retrieval quality before optimizing. Once I understood the failure mode — shallow messages and deep questions getting identical budgets — I replaced it with concept-targeted parallel queries scoped to the active thinkers, with an evaluation pipeline that scores passages for how well they'll collide with each other, not just how relevant they are individually."

---

#### Gap 2 — Internal Tensions

**What's missing:** The system knows which archetypes are active but never surfaces their standing tensions in the response. The data exists — `archetypeDepth.js` has tension bridges per archetype — but it's never injected into the system prompt.

**Where the fix goes:** `llm.js:buildSystemPrompt()` — after the archetype block

**What it would look like:** 1 static core tension (synthesis vs. threshold — character-level) + 1 dynamic tension derived from the active archetype set, injected naturally (not declared explicitly to Claude)

**Why it matters:** Synthesis handles collision between archetypes in a single message. Internal Tensions are different — they're the standing unresolved tensions in Pneuma's character. Without them, Pneuma sounds like a resolved oracle. With them, it sounds like a mind that's still working something out.

**Interview framing:**

> "The synthesis engine handles per-message collisions. Internal Tensions are the persistent character-level tensions — the ones that don't resolve. I've scoped the injection point in buildSystemPrompt() and have the tension data in archetypeDepth.js already. It's one session of work."

---

## INTERVIEW HIGHLIGHTS

_The moments that make you memorable. These aren't answers to questions — they're the angles you steer toward._

---

### Highlight 1 — You Built a Multi-Layer AI System, Not a Wrapper

Most developers who "use AI" call an API and display the response. Pneuma runs 6 subsystems before Claude sees the message — LLM intent scoring, archetype selection with signatureMoves, RAG retrieval with forced contrast, pre-thinking via Haiku, synthesis collision detection, and a tiered prompt that loads 2k-18k tokens based on what was detected. The model receives a fully constructed cognitive context, not a user message.

**When to use:** Any question about your AI experience or "what makes this different."

---

### Highlight 2 — You Understand the Tradeoffs, Not Just the Code

You made concrete architectural decisions and can defend them:

- JSON flat files over ChromaDB — no Docker dependency, cosine similarity on ~1000 entries is fast enough for single user
- Haiku for dreams, Sonnet for chat — background tasks don't need quality, they need cost efficiency
- Tiered prompt loading — prompt caching only works if the stable part is actually stable; that's why base and deep blocks are separated
- topK=5 hardcoded first to validate retrieval quality, then replaced with concept-targeted multi-query (topK=8) once the failure mode was understood

**When to use:** "Walk me through a technical decision you made." This is where you shine.

---

### Highlight 3 — You Know What's Missing and Why

Most developers only talk about what they built. You can articulate what's not built, where it would go, and what it would change:

- Concept Crossroads (shipped Apr 2026) — concept-targeted multi-query RAG with evaluation pipeline replaced the fixed topK=5 approach
- Internal Tensions — data exists in archetypeDepth.js, injection point identified in buildSystemPrompt() (still pending)
- MCP migration — three servers planned, Wikipedia is a 75-line delete, Cognition consolidates three OpenAI clients

**When to use:** "What would you improve?" or "What's next for this project?" This signals senior-level thinking.

---

### Highlight 4 — You Took the Courses and It Confirmed What You'd Built

You didn't learn RAG from a course and then use it. You built RAG to solve a problem, then took the Anthropic courses and recognized the pattern by name. Same with prompt chaining, Chain of Thought, and the tool use loop. The courses gave you vocabulary for decisions you'd already made — and helped you spot where your implementation could go further.

**When to use:** When asked about your Anthropic coursework, or "how do you keep up with AI?"

---

### Highlight 5 — The System Has a North Star

Pneuma isn't a portfolio piece that demonstrates you can use an API. It has a goal: after a year of conversations, Pneuma should be demonstrably different from Pneuma on day one — not because it was programmed to seem different, but because its identity vectors have drifted through evidence. No other architecture in this space does this. You built toward it.

**When to use:** "What are you most proud of?" or "What's the vision for this?"

---

## INTERVIEW PREP

_Only use this section when I say "interview prep."_

### Architectural decisions you need to be able to explain:

- **Why JSON files instead of a database?** Single-user app, no concurrency, zero infrastructure overhead, git-trackable state
- **Why Haiku for dreams, Sonnet for chat?** Dreams are background/cheap; Sonnet for real-time quality
- **Why semantic routing instead of rule-based?** Captures meaning not keywords — "despair" and "nihilism" map to the same archetype
- **Why flat-file vector store instead of ChromaDB?** No Docker dependency; cosine similarity on ~1000 entries is fast enough for single user
- **Why fusion.js separate from index.js?** Separation of concerns — index.js is Express plumbing, fusion.js is AI logic
- **What is archetype momentum?** Personality that evolves — archetypes decay without use, grow with success. The "default voice" is the weighted emergent result.
- **What makes this different from a ChatGPT wrapper?** The entire personality architecture runs before the API call: inner monologue, semantic routing, RAG retrieval, collision detection — Claude receives a fully-constructed cognitive context, not just a user message.

### What makes Pneuma architecturally interesting:

1. **Multi-layer prompt construction** — By the time Claude sees a message, it's wrapped in: system prompt (stableBlock cached + dynamicBlock with ~21 conditional sub-blocks), pre-thinking output from Haiku, archetype integration with signatureMoves, RAG passages with forced contrast, hybrid memory context (last 4 turns + semantically relevant older memories, deduplicated), conversation thread, rhythm context, and emotion signals.
2. **Emergent personality** — Evolution vectors + momentum + dream-driven baseline drift means the default voice isn't hard-coded. It emerges from successful interaction patterns and shifts through evidence over weeks.
3. **3-layer archetype routing** — Archetype selector → momentum weighting → fusion recommendation. Three independent signals combined before any LLM call.
4. **ARCHETYPE_INTEGRATION with signatureMoves** — Beyond selecting which archetype fires, each has a chainOfThought, cognitiveOp, signatureMove (REQUIRED behavioral instruction — e.g. "find the simplest possible example" for Feynman, "locate the paradox inside the feeling" for Rumi), and constraints. Without signatureMoves, archetypes collapsed into generic "wise philosopher" output. The signatureMove is what forces differentiation. Study companion: `docs/study/ARCHETYPE_STUDY_MASTER.md`.
5. **Eval loop** — After generating, a cheap Haiku call scores the response 0–1 against the active tone and intent. Score < 0.6 triggers one regeneration with eval feedback injected. User sees only the final result — loop is invisible.
6. **RAG with dialectical tension** — Deliberately retrieves OPPOSING thinkers alongside the primary match. The tension forces synthesis.
7. **Offline cognition (Dream Mode)** — Pneuma generates thoughts between sessions using Claude Haiku. It has things to tell you when you return.
8. **Separation of brain and mouth** — llm.js produces intelligence. personality.js applies voice. responseEngine.js assembles output. Each layer does exactly one thing.
9. **Voice as first-class input** — Not just transcription. Whisper text + Hume AI prosody → archetype boosts. System can tell the difference between "I'm fine" said neutral vs. distressed.

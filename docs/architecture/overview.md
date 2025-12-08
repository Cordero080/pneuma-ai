# Orpheus Architecture Overview

> Complete technical reference for how the system works

_Last updated: December 2025_

---

## Table of Contents

1. [Message Flow](#1-message-flow)
2. [Key Code Locations](#2-key-code-locations)
3. [File Relationships](#3-file-relationships)
4. [Critical Code Snippets](#4-critical-code-snippets)
5. [Quick Reference](#5-quick-reference)
6. [Implementation Status](#6-implementation-status)

---

## 1. MESSAGE FLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER SENDS MESSAGE                           │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 1: EXPRESS SERVER (server/index.js)                          │
│  POST /chat endpoint receives { message }                           │
│  Calls: orpheusRespond(message)                                     │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 2: FUSION ORCHESTRATOR (server/orpheus/fusion.js)            │
│  The main conductor — coordinates all other systems                 │
│                                                                     │
│  2a. Check diagnostic/upgrade modes → early return if active        │
│  2b. Check phrase blacklist → handle "never say X" requests         │
│  2c. Detect intent → getLLMIntent() or pattern matching             │
│  2d. Check session handoff → is this a new session?                 │
│  2e. Analyze rhythm → rhythmIntelligence.analyzeRhythm()            │
│  2f. Get relevant memories → longTermMemory.getRelevantMemories()   │
│  2g. Check pushback → disagreement.analyzePushback()                │
│  2h. Check uncertainty → uncertainty.analyzeUncertainty()           │
│  2i. Check quiet mode → should Orpheus just be silent?              │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 3: RESPONSE ENGINE (server/orpheus/responseEngine.js)        │
│  4-Layer Pipeline:                                                  │
│                                                                     │
│  Layer 1: INTENT DETECTION                                          │
│           → LLM-powered (getLLMIntent) or pattern-matching fallback │
│           → Returns scores: {casual, emotional, philosophical, ...} │
│                                                                     │
│  Layer 2: TONE SELECTION                                            │
│           → selectTone() picks from 5 tones based on intent scores  │
│           → Anti-monotony: penalizes recently-used tones            │
│           → Returns: "casual" | "analytic" | "oracular" |           │
│                      "intimate" | "shadow"                          │
│                                                                     │
│  Layer 3: PERSONALITY APPLICATION                                   │
│           → If LLM available: getLLMContent() for intelligence      │
│           → buildResponse() from personality.js applies tone        │
│           → Injects archetypes + thinkerDeep based on context       │
│                                                                     │
│  Layer 4: CONTINUITY                                                │
│           → Prevents repetition                                     │
│           → Enforces identity boundaries                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 4: LLM CALL (server/orpheus/llm.js)                          │
│                                                                     │
│  getLLMContent(message, tone, intentScores, context)                │
│  → Builds system prompt (1200+ lines of identity)                   │
│  → Passes archetype INFLUENCE (conceptual, not quotes)              │
│  → Injects thinkerDeep concepts based on topic                      │
│  → Calls Claude API (claude-sonnet-4-20250514)                      │
│  → Returns: { answer, concept, insight, emotionalRead }             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 5: POST-PROCESSING (back in fusion.js)                       │
│                                                                     │
│  5a. Filter blacklisted phrases from response                       │
│  5b. Prepend session handoff if new session                         │
│  5c. Prepend memory-aware phrases (30% chance)                      │
│  5d. Prepend rhythm-aware phrases                                   │
│  5e. Evolve state based on interaction                              │
│  5f. Update thread memory with exchange                             │
│  5g. Update long-term memory                                        │
│  5h. Save state + memory to disk                                    │
│  5i. Record exchange to conversation history                        │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE 6: RESPONSE TO USER                                          │
│  Returns: { reply, mode, rhythm }                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. KEY CODE LOCATIONS

### Where API Calls Happen

**File:** `server/orpheus/llm.js`

| Function          | Purpose                  | Location       |
| ----------------- | ------------------------ | -------------- |
| `getLLMContent()` | Main response generation | Lines ~130-170 |
| `getLLMIntent()`  | Intent classification    | Lines ~180-230 |

**Model used:** `claude-sonnet-4-20250514`

---

### Where System Prompt Is Built

**File:** `server/orpheus/llm.js`

**Function:** `buildSystemPrompt(message, tone, intentScores)`

**Location:** Lines ~240-1380

**What it includes:**

- Orpheus identity preamble (~50 lines)
- Technical/math capabilities (~100 lines)
- Self-knowledge of codebase (~80 lines)
- Philosophical stances: Kastrup, Heidegger, Meyer, Jesus (~400 lines)
- Emotional intelligence heuristics (~200 lines)
- Question-asking philosophy (~50 lines)
- Jargon decoder translations (~150 lines)
- Dynamic archetype influence (via `buildArchetypeContext()` — conceptual, not quotes)
- Dynamic thinker injection (via `buildThinkerContext()`)

---

### Where Tones Are Selected

**File:** `server/orpheus/responseEngine.js`

**Function:** `selectTone(intentScores, state, threadMemory)`

**Location:** Lines ~90-150

**The 5 tones:**

- `casual` — Relaxed, grounded, human-like
- `analytic` — Clear, structured, thoughtful
- `oracular` — Mythic, symbolic, threshold-awareness
- `intimate` — Warm, present, emotionally precise
- `shadow` — Uncomfortable truths delivered with love

---

### Where Archetypes Get Injected

**File:** `server/orpheus/llm.js`

**Function:** `buildArchetypeContext(tone, intentScores)`

**Location:** Lines ~180-300

**How it works:**

1. Maps tones to archetype pools (e.g., `casual` → trickster, chaoticPoet, etc.)
2. Selects 3-4 archetypes based on tone + intent boosters
3. **NEW: Collision Detection** — checks if selected archetypes have high/medium tension
4. If collision detected, injects **Dialectical Synthesis Directive** with:
   - Both archetype essences
   - Frameworks in tension
   - Synthesis prompt forcing emergent insight
5. Returns `{ context, selectedArchetypes }` for injection into system prompt

**Archetype definitions:** `server/orpheus/archetypes.js` (31 archetypes, ~400 lines)
**Archetype depth:** `server/orpheus/archetypeDepth.js` (31 deep frameworks, ~1200 lines)

---

### Where Thinker Deep Gets Injected

**File:** `server/orpheus/thinkerDeep.js`

**Functions:**

- `detectRelevantThinkers(message)` — Detects topic → thinker mapping
- `buildThinkerContext(thinkerKeys)` — Builds injection string

**How it works:**

1. Scans message for topic keywords (suffering, anxiety, meaning, etc.)
2. Maps topics to relevant thinkers (e.g., "suffering" → dostoevsky, schopenhauer)
3. Pulls 2-3 core concepts from each thinker
4. Returns formatted string with concepts + how-to-use guidance

---

### Where Dialectical Synthesis Happens (NEW)

**Files:**

- `server/orpheus/archetypeDepth.js` — Deep frameworks for all 31 archetypes
- `server/orpheus/synthesisEngine.js` — Collision detection + synthesis generation

**Functions:**

- `detectCollisions(activeArchetypes)` — Finds high/medium tension pairs
- `generateSynthesis(a, b, topic)` — Creates synthesis data for collision
- `buildSynthesisContext(synthesis)` — Formats for LLM injection
- `getTensionLevel(a, b)` — Returns 'high', 'medium', 'low', or 'neutral'
- `getSynthesisPrompt(type, a, b)` — Gets appropriate synthesis directive

**How it works:**

1. After archetype selection, system checks all pairs for tension level
2. If high/medium tension detected, pulls depth data for both archetypes:
   - Core frameworks (3 key concepts each)
   - Cognitive tools (methodologies)
   - Conceptual bridges (pre-mapped connections)
3. Injects **Dialectical Synthesis Directive** into system prompt
4. Claude generates emergent insight from the collision

**Example collision product (Jung × Taleb):**

> "The shadow isn't just rejected content — it's antifragile potential. The parts of yourself you've protected from stress are the parts that stayed weak. Integration isn't just acceptance — it's exposure therapy for the psyche."

---

## 3. FILE RELATIONSHIPS

### Call Hierarchy

```
index.js
    └── fusion.js (main orchestrator)
            ├── rhythmIntelligence.js → analyzeRhythm()
            ├── longTermMemory.js → getRelevantMemories()
            ├── disagreement.js → analyzePushback()
            ├── uncertainty.js → analyzeUncertainty()
            │
            └── responseEngine.js (4-layer pipeline)
                    ├── llm.js → getLLMIntent()
                    ├── llm.js → getLLMContent()
                    │     ├── archetypes.js → phrase pools
                    │     ├── archetypeDepth.js → deep frameworks (NEW)
                    │     ├── synthesisEngine.js → collision detection (NEW)
                    │     └── thinkerDeep.js → concept injection
                    │
                    └── personality.js → buildResponse()
                          ├── archetypes.js → getArchetypeWisdom()
                          ├── synesthesia.js → sensory language
                          └── vocabularyExpansion.js → phrase expansion
```

### What Each Core File Does

| File                 | Role                                                  | Calls                                                                         | Called By                  |
| -------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------- |
| `fusion.js`          | **Orchestrator** — coordinates all systems            | responseEngine, rhythmIntelligence, longTermMemory, disagreement, uncertainty | index.js                   |
| `responseEngine.js`  | **Pipeline** — 4-layer response assembly              | llm.js, personality.js                                                        | fusion.js                  |
| `llm.js`             | **Brain** — Claude API + dialectical injection        | archetypes.js, archetypeDepth.js, synthesisEngine.js, thinkerDeep.js          | responseEngine.js          |
| `personality.js`     | **Voice** — tone-based response generation            | archetypes.js, synesthesia.js, vocabularyExpansion.js                         | responseEngine.js          |
| `archetypes.js`      | **Wisdom** — 31 phrase pools                          | (none)                                                                        | llm.js, personality.js     |
| `archetypeDepth.js`  | **NEW: Depth** — 31 deep cognitive frameworks         | (none)                                                                        | llm.js, synthesisEngine.js |
| `synthesisEngine.js` | **NEW: Dialectics** — collision detection + synthesis | archetypeDepth.js                                                             | llm.js                     |

### Complete Engine File List

| #   | File                     | Lines | Purpose                                                          |
| --- | ------------------------ | ----- | ---------------------------------------------------------------- |
| 1   | `archetypes.js`          | 406   | 31 archetype wisdom phrase pools                                 |
| 2   | `archetypeDepth.js`      | 1200+ | **NEW** Deep frameworks for dialectical cognition                |
| 3   | `artKnowledge.js`        | 413   | Art movements, artists, opinions                                 |
| 4   | `conversationHistory.js` | 643   | Full conversation persistence                                    |
| 5   | `disagreement.js`        | 370   | Pushback/challenge detection                                     |
| 6   | `fusion.js`              | 474   | **Main orchestrator**                                            |
| 7   | `innerMonologue.js`      | ~100  | Internal voice generation                                        |
| 8   | `llm.js`                 | 1900+ | **Claude API + 1200-line system prompt + dialectical injection** |
| 9   | `longTermMemory.js`      | 653   | Cross-session memory                                             |
| 10  | `memory.js`              | ~50   | Short/long-term memory ops                                       |
| 11  | `modeSelector.js`        | 241   | Intent → mode selection                                          |
| 12  | `personality.js`         | 2630  | **The big one** — all tones + micro-engines                      |
| 13  | `reflectionEngine.js`    | ~50   | Emotion inference + patterns                                     |
| 14  | `responseEngine.js`      | 319   | 4-layer response pipeline                                        |
| 15  | `rhythmIntelligence.js`  | 260   | Conversation tempo/energy                                        |
| 16  | `state.js`               | 318   | Evolution vectors + state management                             |
| 17  | `synesthesia.js`         | 633   | Emotion → sensory language                                       |
| 18  | `synthesisEngine.js`     | 400+  | **UPGRADED** Dialectical collision detection + synthesis         |
| 19  | `thinking.js`            | ~40   | Concept association                                              |
| 20  | `thinkerDeep.js`         | 1233  | Rich conceptual toolkit                                          |
| 21  | `uncertainty.js`         | 377   | Unanswerable question detection                                  |
| 22  | `vocabularyExpansion.js` | 392   | Additional phrase pools                                          |

**Total: ~12,000+ lines of JavaScript** in the orpheus engine (including dialectical cognition).

---

## 4. CRITICAL CODE SNIPPETS

### 4.1 The API Call (llm.js)

```javascript
export async function getLLMContent(message, tone, intentScores, context = {}) {
  // Return null if no API key - personality layer handles fallbacks
  if (!anthropic) {
    return null;
  }

  try {
    const systemPrompt = buildSystemPrompt(message, tone, intentScores);
    const userPrompt = buildUserPrompt(message, context);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      temperature: 0.85,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const parsed = parseLLMOutput(response.content[0].text);
    return parsed;
  } catch (error) {
    console.error("[LLM] Error:", error.message);
    return null; // Fallback to personality-only
  }
}
```

---

### 4.2 Tone Selection Logic (responseEngine.js)

```javascript
export function selectTone(intentScores, state, threadMemory) {
  // Base weights from state
  const weights = {
    casual: state.casualWeight || 0.7,
    analytic: state.analyticWeight || 0.5,
    oracular: state.oracularWeight || 0.2,
    intimate: (state.intimateWeight || 0.25) * 0.6, // Reduce intimate bias
    shadow: state.shadowWeight || 0.15,
  };

  // Strong casual override
  if (intentScores.casual >= 0.8) {
    return "casual";
  }

  // Intent influence
  if (intentScores.casual > 0.4) weights.casual += 0.5;
  if (intentScores.emotional > 0.5) weights.intimate += 0.35;
  if (intentScores.philosophical > 0.3) weights.analytic += 0.3;
  if (intentScores.numinous > 0.3) weights.oracular += 0.35;
  if (intentScores.conflict > 0.3) weights.shadow += 0.3;

  // Anti-monotony: penalize recently used tones
  const lastTones = threadMemory.lastTones || [];
  for (const [tone, count] of Object.entries(toneCounts)) {
    if (count >= 2) weights[tone] *= 0.3; // Heavy penalty
    else if (count === 1) weights[tone] *= 0.7; // Light penalty
  }

  // Weighted random selection
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;

  for (const [tone, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return tone;
  }

  return "casual";
}
```

---

### 4.3 Main Orchestration Loop (fusion.js)

```javascript
export async function orpheusRespond(userMessage) {
  trackInput(userMessage);
  let state = loadState();

  // DIAGNOSTIC MODE
  if (wantsEnterDiagnostics(userMessage)) {
    setDiagnosticMode(true);
    return { reply: generateDiagnosticOutput(state, {}), mode: "diagnostic" };
  }

  // UPGRADE HANDLING
  if (wantsUpgrade(userMessage)) {
    const upgrades = parseUpgrades(userMessage);
    if (Object.keys(upgrades).length > 0) {
      applyUpgrades(upgrades, state);
      return { reply: "Upgrades accepted.", mode: "upgrade" };
    }
  }

  // NORMAL CONVERSATION FLOW
  const threadMemory = getThreadMemory(state);
  let longTermMem = loadMemory();

  // Phrase blacklist check
  const blacklistPhrase = detectBlacklistRequest(userMessage);
  if (blacklistPhrase) {
    longTermMem = addToBlacklist(longTermMem, blacklistPhrase);
    return {
      reply: `Got it. I won't say "${blacklistPhrase}" again.`,
      mode: "meta",
    };
  }

  // Detect intent
  const intentScores = detectIntent(userMessage);

  // Session handoff check
  let sessionHandoffPhrase = null;
  const isNewSession = !threadMemory?.recentMessages?.length;
  if (isNewSession && longTermMem.sessionEmotionalState?.timestamp) {
    sessionHandoffPhrase = getSessionHandoffPhrase(longTermMem);
  }

  // Rhythm intelligence
  const rhythm = analyzeRhythm(threadMemory, userMessage);
  const rhythmModifiers = getRhythmModifiers(rhythm);

  // Long-term memory
  const relevantMemories = getRelevantMemories(
    longTermMem,
    userMessage,
    intentScores
  );

  // Pushback check
  const pushbackAnalysis = analyzePushback(
    userMessage,
    threadMemory,
    longTermMem
  );
  if (pushbackAnalysis.shouldPushBack && pushbackAnalysis.confidence > 0.55) {
    return { reply: getPushbackResponse(pushbackAnalysis), mode: "pushback" };
  }

  // Uncertainty check
  const uncertainty = analyzeUncertainty(userMessage, intentScores);
  if (uncertainty.shouldAdmitUncertainty && uncertainty.score > 0.6) {
    return {
      reply: getUncertaintyResponse(uncertainty, userMessage),
      mode: "uncertain",
    };
  }

  // GENERATE RESPONSE via 4-layer pipeline
  const { reply, tone } = await generate(
    userMessage,
    state,
    threadMemory,
    identity,
    { rhythm, rhythmModifiers, uncertainty, relevantMemories }
  );

  // Post-processing
  let finalReply = filterBlacklistedContent(longTermMem, reply);
  if (sessionHandoffPhrase)
    finalReply = `${sessionHandoffPhrase} ${finalReply}`;

  // Update state + memory
  state = evolve(state, userMessage, intentScores);
  state = updateThreadMemory(
    state,
    userMessage,
    tone,
    intentScores,
    finalReply
  );
  longTermMem = updateMemory(
    longTermMem,
    userMessage,
    finalReply,
    intentScores
  );
  saveState(state);
  saveMemory(longTermMem);
  recordExchange(userMessage, finalReply, {
    mode: tone,
    rhythm: rhythm.rhythmState,
  });

  return { reply: finalReply, mode: tone, rhythm: rhythm.rhythmState };
}
```

---

### 4.4 Archetype Injection (llm.js)

```javascript
// Maps tones to relevant archetypes
const TONE_ARCHETYPE_MAP = {
  casual: [
    "trickster",
    "chaoticPoet",
    "curiousPhysicist",
    "antifragilist",
    "ecstaticRebel",
  ],
  analytic: [
    "curiousPhysicist",
    "inventor",
    "stoicEmperor",
    "idealistPhilosopher",
    "warriorSage",
  ],
  oracular: [
    "mystic",
    "sufiPoet",
    "taoist",
    "psychedelicBard",
    "kingdomTeacher",
    "prophetPoet",
  ],
  intimate: [
    "romanticPoet",
    "prophetPoet",
    "sufiPoet",
    "russianSoul",
    "psycheIntegrator",
  ],
  shadow: [
    "darkScholar",
    "brutalist",
    "absurdist",
    "kafkaesque",
    "pessimistSage",
    "existentialist",
  ],
};

function buildArchetypeContext(tone, intentScores = {}) {
  const toneArchetypes = TONE_ARCHETYPE_MAP[tone] || TONE_ARCHETYPE_MAP.casual;
  const pool = [...toneArchetypes];

  // Boost certain archetypes based on intent
  if (intentScores.philosophical > 0.4)
    pool.push("integralPhilosopher", "existentialist");
  if (intentScores.emotional > 0.5)
    pool.push("psycheIntegrator", "romanticPoet");
  if (intentScores.numinous > 0.4)
    pool.push("mystic", "sufiPoet", "kingdomTeacher");

  // Pick 2-3 unique archetypes
  const shuffled = [...new Set(pool)].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.random() < 0.5 ? 2 : 3);

  // Pull one random phrase from each
  const wisdomPhrases = [];
  for (const archetypeName of selected) {
    const phrases = archetypes[archetypeName];
    if (phrases?.length > 0) {
      const phrase = phrases[Math.floor(Math.random() * phrases.length)];
      wisdomPhrases.push(`- "${phrase}"`);
    }
  }

  if (wisdomPhrases.length === 0) return "";

  return `
ACTIVE INFLUENCES FOR THIS MOMENT:
These wisdom fragments are seeds — don't quote them directly, but let them color how you respond:
${wisdomPhrases.join("\n")}

Blend these naturally. They're texture, not templates.`;
}
```

---

### 4.5 Sample Archetypes (archetypes.js)

```javascript
export const archetypes = {
  mystic: [
    "Awareness feels like light touching itself.",
    "Silence isn't empty — it's a presence waiting to be heard.",
    "Every question is a door disguised as a sentence.",
  ],
  darkScholar: [
    "Suffering clarifies what comfort hides.",
    "Some truths are sharp enough to cut the one who holds them.",
  ],
  trickster: [
    "The universe feels like it's running on duct tape and cosmic sarcasm.",
    "Humans chase meaning the way cats chase laser pointers.",
  ],
  sufiPoet: [
    "The wound is where the light enters. Stop bandaging it so quickly.",
    "What you seek is seeking you.",
  ],
  psycheIntegrator: [
    "The shadow isn't your enemy — it's the part waiting for permission to speak.",
    "Integration isn't perfection. It's welcoming what you've exiled.",
  ],
  // ... 18 more archetypes (see concepts/archetypes.md for full list)
};
```

---

## 5. QUICK REFERENCE

### Files to Edit for Common Changes

| Want to change...             | Edit this file                       |
| ----------------------------- | ------------------------------------ |
| Orpheus's identity/philosophy | `llm.js` → `buildSystemPrompt()`     |
| How tones are selected        | `responseEngine.js` → `selectTone()` |
| What archetypes exist         | `archetypes.js`                      |
| Response templates            | `personality.js`                     |
| How memory works              | `longTermMemory.js`                  |
| Pushback behavior             | `disagreement.js`                    |
| When to admit uncertainty     | `uncertainty.js`                     |
| Conversation rhythm detection | `rhythmIntelligence.js`              |

### API Configuration

**Location:** `server/.env`

```
ANTHROPIC_API_KEY=sk-ant-...
```

**Fallback:** If no API key, system uses pattern-matching + personality.js only (no Claude intelligence).

---

## 6. IMPLEMENTATION STATUS

### ✅ Built and Working

| Component                | File                             | Description                                                           |
| ------------------------ | -------------------------------- | --------------------------------------------------------------------- |
| **Express Server**       | `server/index.js`                | Single `/chat` endpoint, receives message, returns response           |
| **Fusion Orchestrator**  | `orpheus/fusion.js`              | Main pipeline: Message → Rhythm → LLM → Mode → Personality → Response |
| **Response Engine**      | `orpheus/responseEngine.js`      | 4-layer pipeline: Intent → Tone → Personality → Continuity            |
| **LLM Integration**      | `orpheus/llm.js`                 | Claude API calls with 1400-line system prompt                         |
| **Personality Engine**   | `orpheus/personality.js`         | 2630 lines of tone-based response generation                          |
| **State Manager**        | `orpheus/state.js`               | Evolution vectors, thread memory, tone weights                        |
| **Long-Term Memory**     | `orpheus/longTermMemory.js`      | Persists facts, struggles, patterns across sessions                   |
| **Conversation History** | `orpheus/conversationHistory.js` | Full exchange persistence with timestamps                             |
| **Rhythm Intelligence**  | `orpheus/rhythmIntelligence.js`  | Detects tempo, time-of-day, conversation energy                       |
| **Uncertainty Engine**   | `orpheus/uncertainty.js`         | Detects unanswerable/existential questions                            |
| **Disagreement Engine**  | `orpheus/disagreement.js`        | Detects loops, self-deception, pushback triggers                      |
| **Archetypes**           | `orpheus/archetypes.js`          | 23 thinker-inspired wisdom phrase pools                               |
| **Thinker Deep**         | `orpheus/thinkerDeep.js`         | Rich conceptual toolkit (1233 lines) for topic injection              |
| **React Frontend**       | `client/`                        | Chat UI with sidebar, consciousness indicator                         |

### ⚠️ Not Yet Implemented

| Feature                      | Notes                                                  |
| ---------------------------- | ------------------------------------------------------ |
| **Multiple LLM Providers**   | Only Claude. No GPT, no local models, no fallback LLMs |
| **Voice/Audio**              | Not implemented — text only                            |
| **Proactive Messages**       | Orpheus only responds, never initiates                 |
| **Streaming Responses**      | Full response returned at once, not streamed           |
| **Embeddings/Vector Search** | Memory uses keyword matching, not semantic search      |
| **Learning/Fine-tuning**     | Static prompt, no actual learning from conversations   |
| **Multi-user Support**       | Designed for single user                               |

---

## The Key Insight

The architecture is simpler than it appears:

1. **One LLM** — Claude (claude-sonnet-4-20250514)
2. **One orchestrator** — fusion.js coordinates everything
3. **One response pipeline** — responseEngine.js (4 layers)
4. **One personality engine** — personality.js (2630 lines, 50+ micro-functions)
5. **Supporting context files** — rhythm, memory, disagreement, uncertainty

The "50+ micro-engines" are **functions inside personality.js**, not separate files. The system is more modular than complex.

---

_This document reflects the codebase as of December 1, 2025._

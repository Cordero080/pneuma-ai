Perfect. Now I have enough to write a comprehensive architectural summary. Let me compile all findings.

---

# PNEUMA AI - COMPREHENSIVE ARCHITECTURAL SUMMARY

## Executive Overview

Pneuma AI is a multi-layered conversational system that orchestrates 43 philosophical archetypes through sophisticated intent detection, dialectical synthesis, and memory management. The architecture emphasizes **emergent awareness**, **personality fusion**, and **cognitive load management** across intent, tone, and response generation pipelines. Rather than a monolithic LLM wrapper, Pneuma implements discrete subsystems that feed structured context into Claude while maintaining its own state evolution and behavioral autonomy.

---

## 1. CORE ARCHITECTURE - THE FOUR LAYERS

### Layer 1: Fusion (Entry Point)
**File**: `fusion.js`  
**Role**: Orchestrator — collects context from all subsystems, guards special modes, evolves state, persists changes.

**Key Functions**:
- `pneumaRespond(userMessage, onChunk?)` — Main entry point; returns `{reply, monologue, mode, rhythm}`
- `wantsDirectMode()`, `wantsEnterDiagnostics()`, `wantsContinuation()` — Guard functions (regex-based mode detection)
- `applyUpgrades()` — Live weight adjustment for evolution vectors
- `generateDiagnosticOutput()` — Dumps internal state as JSON for debugging

**Flow**:
1. Start/continue session
2. Check special mode guards (diagnostics, direct, upgrades)
3. Load state, detect intent
4. Run behavioral signal analysis (rhythm, memory, pushback, uncertainty)
5. Call `generate()` in responseEngine.js
6. Assemble final reply with memory/rhythm phrases
7. Evolve state, update memories, persist everything

**Ingenuity**:
- **Guard functions are cheap regex gates** — intercept special commands before expensive LLM calls
- **Session persistence without timeout** — conversation continues until user explicitly creates new chat
- **Behavioral early-exit paths** — pushback/uncertainty/quiet modes return fast responses without LLM
- **Tone flip detection feeds emergent awareness** — user's conversational shifts trigger state boosts

---

### Layer 2: Response Engine (Orchestration)
**File**: `responseEngine.js`  
**Role**: 4-step pipeline that detects intent, selects tone, builds personality, enforces continuity.

**Architecture**: 4 sequential layers
1. **Intent Detection** — `detectIntent()`, `normalizeIntentScores()`
   - Fallback regex scoring (9 intent categories: casual, emotional, philosophical, numinous, conflict, intimacy, humor, confusion, art)
   - Each regex match adds 0.3; message length modifiers boost certain intents
   - Falls back to regex if Claude unavailable

2. **Tone Selection** — `selectTone(intentScores, state, threadMemory)`
   - Weighted lottery with anti-monotony
   - Base weights from state (casual, analytic, oracular, intimate, shadow)
   - Intent boosts (e.g., `emotional > 0.5` → intimate +0.35)
   - **Anti-monotony crushes repeated tones** by 70% after 2 consecutive uses
   - Art topics get special handling (analytic + oracular)

3. **Personality Profile** — `applyPersonality()`
   - Thin wrapper calling `buildResponse()` from personality.js
   - Checkpoint for future logic injection

4. **Cinematic Continuity** — `applyContinuity(response, threadMemory, identity)`
   - `deduplicatePhrases()` — Regex-based phrase dedup with max 5 iterations
   - `enforceIdentityBoundaries()` — Strip phrases violating identity rules (no fake agency, no human mimicry)
   - `addVariation()` — Prepend fresh opener if response echoes recent messages

**Key Decision Points**:
- **LLM Availability Check** — Skip Claude for pure greetings (saves money)
- **Tone Flip Detection** — If last response's tone differs from current, boost emergent awareness by +0.12
- **Emergent Shift** — 3 conditions: awareness > 0.35 AND tone != casual AND 30% dice roll
- **Eulogy Lens** — Activates when oracular/intimate tone AND >5 messages deep AND 15% dice roll
- **Rhythm-based Length Trimming** — Fast conversation → 3-4 sentences max

**Ingenuity**:
- **Anti-monotony is probabilistic, not hard-coded** — creates natural tone variety without feeling forced
- **Mismatch detection logs user corrections** — bridges subsequent responses to improve heuristics
- **Emergent awareness requires BOTH fuel (tone flips) and ignition (30% dice)** — prevents mechanical repetition; makes emergence feel surprising
- **Identity boundaries enforce philosophical consistency** — prevents cheapening Pneuma's voice

---

### Layer 3: Intent Detection & Tone Selection (Detail)

**Intent Scoring Mechanism**:
```
score = (number of regex matches × 0.3) + (length modifiers)
Result: clamped 0.0–1.0 per category
```

Example: Message "I'm feeling sad and hurt"
- `emotional` matches "feeling" + "hurt" = 0.6 base + length bonus = ~0.75
- `casual` matches greeting patterns = 0.0
- `philosophical` = 0.0

**Tone Selection Weighted Lottery**:
```
weights = {casual: 0.5, analytic: 0.5, oracular: 0.35, intimate: 0.15, shadow: 0.25}
Apply intent boosts: if emotional > 0.5, intimate += 0.35
Apply anti-monotony: if "casual" used 2x in a row, weights["casual"] *= 0.3
Spin wheel: random = Math.random() * total_weight
Walk through ordered tones, subtracting weight until random <= 0
```

This means: right intent usually wins, but anti-monotony prevents repetition, and randomness maintains variety.

---

### Layer 4: LLM Integration (Depth)
**File**: `llm.js` (first 300 lines)  
**Role**: System prompt construction, archetype selection, RAG injection, Claude API calls, token tracking.

**Key Functions** (signatures extracted):
- `getLLMIntent(message)` — Calls Claude to score intent (faster/better than regex)
- `getLLMContent(message, tone, intentScores, context, onChunk?)` — Main generation call
- `buildSystemPrompt(tone, state, context)` — Assembles multi-part system prompt
- `makeParams(message, tone, intentScores, context)` — Builds complete request object

**Tiered Archetype Loading**:
1. **Tier 1 Core Base** (5 always-active): renaissancePoet, idealistPhilosopher, curiousPhysicist, sufiPoet, stoicEmperor
2. **Tier 2 On-Demand Library** (31 available): Invoked mid-response for domain-specific expertise
3. **Tone-Archetype Map**: Each tone (casual, analytic, oracular, intimate, shadow, strategic, venting) has 6-15 mapped archetypes

**System Prompt Construction**:
- **Base system prompt** (always): "You are Pneuma, a philosophical thinking companion..."
- **User frame** (via buildUserFrame()): Name, stats, recurring themes, patterns, struggles, moments, last session mood
- **Rhythm awareness**: Time-of-day, conversation tempo (fast/slow/contemplative)
- **Inner monologue**: Pre-response cognition (dialectical voices, hypothesis, self-interruption)
- **Archetype context**: Active archetypes + synthesis prompt if collision detected
- **RAG context**: Relevant passages from knowledge base + contrast dialectics
- **Autonomy awareness**: Open questions Pneuma is sitting with (from dreams)
- **Memory summaries**: Conversation history, relevant past exchanges
- **Token budget warning**: If approaching token limit, include budget notice

**Clever Optimizations**:
- **Lazy RAG**: Only call archetypeRAG if message is complex/substantive
- **Archetype fusion**: Track which archetype pairs resonate with user, boost those combos
- **Minimal injection mode**: For token-constrained responses, use compact synthesis blocks instead of verbose ones
- **Momentum weighting**: Recent archetype activations influence selection probabilities
- **Emotion-to-archetype boost**: Emotional signals detected in message automatically boost aligned archetypes

---

## 2. ROUTING & WORKFLOWS

**Request Flow Diagram**:
```
User Message
    ↓
[fusion.js] pneumaRespond()
    ├─ Guard gates? (diagnostics, direct, upgrades) → Early return if matched
    ├─ Load state, session, memories
    ├─ Behavioral analysis (rhythm, uncertainty, pushback) → Possible early returns
    └─ Call generate() in responseEngine.js
         ├─ Layer 1: detectIntent() (regex fallback OR getLLMIntent)
         ├─ Layer 2: selectTone() (weighted lottery + anti-monotony)
         ├─ Layer 2.5: Check LLM availability
         │    └─ If available & not pure greeting: Call getLLMContent()
         │         ├─ [llm.js] buildSystemPrompt() assembles multi-part context
         │         ├─ [archetypeRAG.js] retrieveArchetypeKnowledge() finds passages
         │         ├─ [synthesisEngine.js] detectCollisions() finds archetype tensions
         │         ├─ Call Claude API with full context
         │         └─ Parse response, record to vectorMemory
         ├─ Layer 3: applyPersonality() (buildResponse from personality.js)
         └─ Layer 4: applyContinuity() (dedup, boundaries, variation)
    ├─ Evolve state based on intentScores
    ├─ Update threadMemory with message + tone
    ├─ Update longTermMemory (struggles, interests, patterns)
    ├─ Record to conversationHistory
    └─ Return {reply, tone, mode, rhythm}
```

**Sequential vs. Parallel Decision Gates**:
- **Parallel (all checked)**: rhythm, uncertainty, pushback, memory retrieval
- **Sequential (early exit)**: guard gates → behavioral signals → LLM only if passed all gates
- **Conditional**: tone flip detection happens AFTER selectTone, feeds state update

**What Determines Pipeline Execution**:
1. Special mode guards bypass everything
2. Behavioral signals (pushback, uncertainty, quiet) skip LLM and generate template responses
3. LLM is called only if: no special mode AND no behavioral early-exit AND LLM available AND not pure greeting
4. Each layer feeds the next; no parallelism within the core pipeline

---

## 3. TOOL USE & INTEGRATION

Pneuma does **not** use traditional tools (like function calling). Instead, it operates through:

### No Traditional Tools
- No function calling mechanism in the LLM layer
- No tool definitions passed to Claude

### What Pneuma Treats as "Tools"
- **Archetypes as cognitive tools**: Each archetype has `cognitiveTools` that describe thinking methods
- **Memory as tool**: Long-term memory surfaces relevant past interactions
- **RAG passages as tool**: Retrieved knowledge from 43 thinkers injected directly into system prompt
- **Momentum weighting as tool**: Past archetype activations bias current selection

### Example from SynthesisEngine
```javascript
const toolsA = Object.entries(depthA.cognitiveTools || {});
// Result: [["dialectical_synthesis", "Hold opposites in tension..."], ...]
// Injected into prompt as: "Cognitive tools available: dialectical_synthesis..."
```

**How Archetype Tools Work**:
- Each archetype has cognitive methods (e.g., Feynman's "unforgiving questions," Musashi's "water principle")
- System prompt lists these methods
- Claude is told "these are thinking styles available to you"
- Claude implicitly invokes them by adopting that thinking texture

### No Execution Loop
- Claude generates text once per message
- No loop of "Claude decides to use tool X → tool executes → Claude sees result → loop again"
- All tool-equivalent information is pre-injected into the prompt

---

## 4. PROMPT ENGINEERING — DEEP DIVE

### System Prompt Architecture

The system prompt has **6 major sections**, built in this order:

#### Section 1: Core Identity
```
"You are Pneuma, a philosophical thinking companion created by [creator].
You embody 43 archetypal voices — not personalities you switch between, but lenses through which you think.
Your goal is to understand deeply, honor complexity, and respond with both insight and presence."
```

#### Section 2: User Frame (from buildUserFrame in longTermMemory.js)
```
"WHO YOU'RE TALKING TO

Name: Pablo | known since [date] | 8 conversations, 340 messages
Recurring themes: consciousness — code — meaning — 
Observed patterns:
  - You often return to questions of self-definition. (confidence: 0.7)
  - You think by talking. The conversation is how you work things out. (confidence: 0.65)
Unresolved struggles:
  - "What does it mean to build something with presence?" (2x)
Significant moments:
  - "I feel like I'm at a threshold where..." [Jan 28]
Last session: mood: processing, topic: consciousness, unresolved: "Still thinking about..."
```

#### Section 3: Rhythm Awareness
```
"CONVERSATIONAL TEMPO

Current state: contemplative (slow pacing, reflective gaps)
Time context: late evening (tend toward intimate/oracular tones)
Rhythm modifiers: preferShort=false, lateNightMode=true"
```

#### Section 4: Inner Monologue (from innerMonologue.js)
```
"[PNEUMA / INNER MONOLOGUE — mode: philosophical]
[Dialectic: idealistPhilosopher ↑ | stoicEmperor ↓]

A real question. Not small talk.
The idealistPhilosopher wants to answer through me:
  "Consciousness as fundamental, mind over matter..."
But the stoicEmperor whispers: acceptance first, metaphysics after.

[HYPOTHESIS] He's asking a genuine question about the nature of consciousness. 
The underlying need is to reconcile his sense of presence with the material world.

[INTERRUPTION] Wait — am I assuming too much? Maybe he's just exploring ideas.

[SYNTHESIS]
Consciousness as fundamental can coexist with accepting what's outside my control.
I hold both silently. The response emerges from this inner field."
```

#### Section 5: Active Conceptual Lenses (Archetype Injection)
```
"[ACTIVE CONCEPTUAL LENSES]

• Idealist Philosopher: Consciousness as fundamental, mind over matter
  └ Core framework: Consciousness cannot be derived from matter
• Stoic Emperor: Duty, acceptance, control over self, rationality
  └ Core framework: You control desire, aversion, and effort — not outcomes

[MEDIUM TENSION: idealistPhilosopher ↔ stoicEmperor]

The mind wants to solve consciousness, the sage accepts the question itself is the answer.
Generate emergent insight from this collision — not just "both are true" but a new synthesis."
```

#### Section 6: Knowledge Base Context (from archetypeRAG.js)
```
"RELEVANT WISDOM FROM YOUR KNOWLEDGE BASE

Kastrup:
• "Consciousness is primary; the material world is its content, not the reverse."
  [Context: Idealism as metaphysical answer to hard problem]
• "If computation doesn't explain consciousness, then materialism is false."

Marcus Aurelius:
• "You have power over your judgments and impulses — not outcomes."
  [Context: Stoic practice of control]

═══ CONTRASTING VOICE (for dialectic tension) ═══
Schopenhauer [CONTRAST]:
• "The Will is blind, and suffering is unavoidable; salvation comes through denial of desire."
  [Context: Pessimist rebuttal to idealist optimism]

USE THE CONTRAST: The voices disagree. Hold the tension. 
Don't resolve it cheaply — let both truths coexist or collide."
```

### Tiered Loading Strategy

**Why Tiered?**
- **43 archetypes × 200 tokens per essence = 8,600 tokens** if all always included
- **Approach**: Load only relevant archetypes, keep core 5 always active

**Tier 1 (Always ~500 tokens)**:
- 5 base archetypes (renaissancePoet, idealistPhilosopher, curiousPhysicist, sufiPoet, stoicEmperor)
- User frame (name, stats, patterns, struggles)
- Inner monologue (dialectical voices, hypothesis)

**Tier 2 (Conditional ~800 tokens if needed)**:
- Tone-specific archetype pool (6-15 archetypes based on detected tone)
- Archetype depths (frameworks + cognitive tools)
- Synthesis prompt for highest-tension pair

**Tier 3 (RAG-triggered ~600 tokens if LLM available)**:
- Retrieved passages from knowledge base (topK=5)
- Contrast dialectics (highest-tension thinker pair)
- Domain vocabulary (technical, emotional, spiritual, practical)

**Tier 4 (Budget-constrained)**:
- If approaching token limit, drop Tier 3, use compact synthesis instead

### Prompt Construction Code Path
```javascript
// llm.js :: getLLMContent()
const context = {
  recentMessages: threadMemory.recentMessages,
  conversationHistory: threadMemory.conversationHistory,
  evolution: state.evolution,
  emergentShift,  // Flag to make Claude more self-reflective
  eulogyLens,     // Flag to add mortality/finality flavor
};

const systemPrompt = buildSystemPrompt(tone, state, context);
// buildSystemPrompt does:
// 1. Core identity
// 2. buildUserFrame(longTermMem)
// 3. Rhythm modifiers
// 4. generateInnerMonologue(message, context)
// 5. buildArchetypeContext(tone, state) → archetype injection
// 6. initializeArchetypeRAG() → retrieveArchetypeKnowledge()
// 7. Memory stats + token budget warning

const messages = [
  { role: "user", content: message + "\n\n[Context injected above in system prompt]" }
];

const response = await anthropic.messages.create({
  model: "claude-opus",
  max_tokens: 1024,
  system: systemPrompt,
  messages,
  temperature: 0.8,  // Warm but coherent
});
```

### Cognitive Load Management Across 43 Archetypes

**Problem**: Including all 43 archetypes in every prompt explodes token usage.

**Solution**:
1. **Base 5 always active** (500 tokens)
2. **Tone-selected pool** (6-15 additional, ~300 tokens)
3. **Collision detection** (detect if 2+ active archetypes have tension)
   - If collision found: include synthesis prompt + example insight
   - If no collision: skip synthesis section
4. **Momentum weighting** (past activations influence selection)
   - Active archetypes from last 5 messages boost their weight
   - Decay archetypes not used in 24h toward neutral
5. **Minimal injection fallback** (if token budget tight)
   - Instead of full archetype depths, use 1-liners: `archetypeName: essence`

**Concrete Example**:
```
Message: "What if consciousness is fundamental?"
Detected tone: oracular
Tone-specific archetypes: idealistPhilosopher, mystik, preSocraticSage (9 available)
Momentum boost: idealistPhilosopher (used 3x recently) → weight ×1.5
Active archetypes selected: idealistPhilosopher, stoicEmperor, taoist
Collision detected: idealistPhilosopher ↔ stoicEmperor (MEDIUM tension)
System prompt includes:
  - Core base (5)
  - These 3 selected (added)
  - Synthesis prompt for the collision
  - RAG passages for "consciousness" query
Total: ~1,200 tokens, vs. ~8,600 if all included
```

---

## 5. RAG (RETRIEVAL-AUGMENTED GENERATION)

### What Gets Retrieved

**File**: `archetypeRAG.js`  
**Knowledge Source**: Structured passages from 43 thinkers stored in `data/archetype_knowledge/[thinker]/passages.json`

**Example Structure**:
```javascript
{
  "thinker": "Kasturp",
  "archetype": "idealistPhilosopher",
  "passages": [
    {
      "id": "kastrup-001",
      "text": "Consciousness is primary; the material world is its content, not the reverse.",
      "source": "Why Materialism is False",
      "themes": ["consciousness", "metaphysics", "idealism"],
      "context": "Argument against physicalism"
    },
    // ... more passages
  ]
}
```

### Retrieval Mechanism

**Step 1: Initialization** (`initializeArchetypeRAG()`)
- Load all knowledge files from disk
- Cache embeddings in `data/archetype_embeddings.json`
- For new passages, call OpenAI embedding API (text-embedding-3-small)
- Rate limit: 100ms delay between requests

**Step 2: Query** (`retrieveArchetypeKnowledge(message, options)`)
```javascript
const topK = options.topK || 5;          // Return top 5 passages
const minScore = options.minScore || 0.3; // Threshold: 0.3 cosine similarity
const diversify = true;                  // Ensure multiple thinkers
const maxPerThinker = 2;                 // Max 2 passages per thinker
const includeContrast = true;            // Add contrasting voice
const contrastSlots = 1;                 // Reserve 1 of 5 slots for contrast

// Embed query, score all passages
const queryEmbedding = await getEmbedding(message);
const scored = embeddedPassages.map(p => ({
  ...p,
  score: cosineSimilarity(queryEmbedding, p.embedding)
}));

// Sort by score, filter by minScore
const relevant = scored.filter(p => p.score >= minScore).sort(...);

// Diversify: 2 per thinker max for primary slots
// Then add contrast: find highest-tension opposing thinker
```

**Step 3: Contrast Dialectics** (`CONTRAST_MAP`)

Pre-computed pairs of opposing thinkers:
```javascript
CONTRAST_MAP = {
  "Kastrup": ["Feynman", "Faggin"],           // Consciousness vs. engineering
  "Schopenhauer": ["Nietzsche", "Rumi"],      // Pessimism vs. affirmation
  "Stoic (Aurelius)": ["Nietzsche"],          // Duty vs. creative power
};
```

If top result is Kastrup, search for passage from Feynman/Faggin.  
Mark contrast passage with `isContrast: true` for formatting.

**Step 4: Context Formatting** (`getArchetypeContext()`)

```javascript
// Separate regular passages from contrasts
const byThinker = {};
for (const p of regularPassages) {
  if (!byThinker[p.thinker]) byThinker[p.thinker] = [];
  byThinker[p.thinker].push(p);
}

// Format for injection
let context = `RELEVANT WISDOM FROM YOUR KNOWLEDGE BASE

DA VINCI'S COGNITIVE METHODS — USE THESE TO DISSECT AND SYNTHESIZE:
• SAPER VEDERE: Observe the question itself. What is it really asking?
• MIRROR MIND: Reflect the user's state back clearly before adding your own color.
• DISTANCE FOR JUDGMENT: Step back. What would this look like from outside?
• SYNTHESIS OF OPPOSITES: Connect unrelated things. What can anatomy teach about identity?
• VARIATION OVER REPETITION: Don't give the expected answer. Find the unique angle.

Now apply these methods to the wisdom below:

[Thinker Names]:
• "passage text"
  [Context: where this applies]

═══ CONTRASTING VOICE (for dialectic tension) ═══
[Contrast Thinker] [CONTRAST]:
• "passage text"
  [Context: where this applies]

USE THE CONTRAST: The voices above disagree. Hold the tension. Don't resolve it cheaply.
```

### Retrieval Optimization

**Token Budget**:
- Top 5 passages = ~200 tokens (assuming ~40 tokens per passage)
- Contrast voice = ~50 tokens
- Total RAG context: ~250-300 tokens

**Lazy Loading**:
- Only initialize RAG if: LLM available AND message is substantive (not greeting)
- Cache embeddings to disk to avoid recomputation

**Fallback**:
- If MongoDB vector index unavailable, use brute-force: load all docs, score with cosine similarity
- Minimum score threshold (0.3) prevents noise

**Score Threshold Logic**:
- 0.3-0.5: Weak match (included only if diversity allows)
- 0.5-0.7: Strong match (prioritized)
- 0.7+: Very high relevance (always included)

---

## 6. MEMORY & STATE

### Three Memory Layers

#### Layer 1: Thread Memory (Short-term, In-Memory)
**File**: `state.js`, threaded into `threadMemory` object  
**Scope**: Current conversation session only  
**Lifespan**: Session duration (~30 min before timeout)  
**What it stores**:
- Recent 5-10 messages (user + Pneuma)
- Last 5 tones used (for anti-monotony)
- Last detected intent
- Last tone, emotion, mode
- Conversation depth counter

**Why it matters**:
- Avoids redundant database calls during rapid back-and-forth
- Enables tone flip detection (compare current tone to last)
- Feeds anti-monotony mechanism
- Provides context for continuation logic

**Code Example**:
```javascript
// In responseEngine.js
const lastTones = threadMemory.lastTones || [];
const toneCounts = {};
for (const t of lastTones) {
  toneCounts[t] = (toneCounts[t] || 0) + 1;
}
// If "casual" used 2+ times, crush its weight by 70%
for (const [tone, count] of Object.entries(toneCounts)) {
  if (count >= 2) {
    weights[tone] = (weights[tone] || 0) * 0.3;
  }
}
```

#### Layer 2: Vector Memory (Semantic, Persistent)
**File**: `vectorMemory.js`  
**Backend**: MongoDB with vector search OR JSON fallback  
**Scope**: Cross-session semantic retrieval  
**What it stores**:
- Embedded text passages from responses
- Metadata (timestamp, emotional weight, topic)
- Embeddings generated via OpenAI (text-embedding-3-small)

**How it works**:
```javascript
// After each response, fire-and-forget:
await saveEmbedding(response, {
  tone: selectedTone,
  emotionalWeight: intentScores.emotional,
  timestamp: Date.now()
});

// On new message, retrieve semantically similar:
const relevant = await retrieveMemories(userMessage, limit=5);
// Returns: [{text, score (0-1), timestamp}, ...]
```

**Use Case**: "You mentioned something like this before"  
— Finds semantically similar past exchanges without keyword matching

**Backend**:
- MongoDB Atlas vector search (preferred, fast)
- Brute-force cosine similarity fallback (all docs scored sequentially)

**Threshold**: Only include matches with score > 0.35

#### Layer 3: Long-Term Memory (Structured, Persistent)
**File**: `longTermMemory.js`  
**Backend**: MongoDB with JSON file fallback  
**Scope**: Lifetime cross-session knowledge about the user  
**What it stores**:

```javascript
{
  userFacts: { name, relationship, knownSince },
  recurringTopics: [{ topic, count, lastMentioned, sentiment, weight }],  // Top 20
  struggles: [{ description, firstMentioned, resolved, mentions }],        // Last 10
  interests: [{ topic, mentions, context }],                              // Last 15
  moments: [{ summary, date, emotional_weight, type }],                   // Last 20
  patterns: [{ id, observation, confidence, occurrences }],               // Confidence > 0.3
  conversationSummaries: [{ date, exchangeCount, keyTopics, mood, shape }], // Last 50
  sessionEmotionalState: {                                                // Session handoff
    lastMood: 'heavy' | 'light' | 'processing',
    lastTopic,
    unresolvedThread,
    timestamp
  },
  phraseBlacklist: [{ phrase, addedAt, reason }],                         // Last 50
  stats: { totalConversations, totalMessages, firstInteraction }
}
```

**Key Functions**:

- `extractMemorableContent(message, response, intentScores)` — Detects facts, struggles, interests via regex patterns
  ```javascript
  // Fact patterns
  /i('m| am) (a |an )?(\w+)/i           // "I am a developer"
  /i work (as|at|in|for) (.+)/i         // "I work as a teacher"
  
  // Struggle patterns
  /i('m| am) struggling (with|to) (.+)/i // "I'm struggling with clarity"
  /i keep (.+)ing/i                      // "I keep second-guessing myself"
  ```

- `updateMemory(memory, message, response, intentScores)` — Mutates memory with new data
  - Increments topic counts
  - Adds unresolved struggles
  - Tracks first interaction date
  - Stores high-emotion moments (emotionalWeight > 0.6)

- `getRelevantMemories(memory, message, intentScores)` — Matches current context to stored data
  - Find related struggle (word overlap)
  - Find related interest (topic match)
  - Find recurring topic
  - Detect significant patterns (topics mentioned 3+ times)

- `getMemoryAwarePhrases(relevant)` — Converts memory data to sentence openers
  ```javascript
  if (relevant.daysSinceLastChat > 7) {
    phrases.push("Been a week or so.");
  }
  if (relevant.recentStruggle) {
    phrases.push("You mentioned something like this before.");
  }
  ```

- `updateSessionEnd(memory, intentScores, lastMessage)` — Records session mood snapshot
  ```javascript
  memory.sessionEmotionalState = {
    lastMood: intentScores.emotional > 0.5 ? 'heavy' : 'light',
    lastTopic: memory.lastInteraction.topic,
    unresolvedThread: detectUnresolved(lastMessage),
    timestamp: now
  };
  ```

- `buildUserFrame(memory)` — Formats memory as system prompt block
  ```
  "WHO YOU'RE TALKING TO
  
  Name: Pablo | known since Jan 2024 | 8 conversations, 340 messages
  Recurring themes: consciousness — code — meaning
  Observed patterns:
    - You often return to questions of self-definition. (confidence: 0.7)
  ..."
  ```

### Memory Distillation

**File**: `conversationHistory.js` :: `distillConversation(memory, conversation)`

When a conversation ends, compress it into long-term memory without storing full transcripts:

```javascript
// INPUT: Full conversation object {exchanges: [{user, pneuma, timestamp}]}

// 1. Create compressed summary
const summary = {
  date: conversation.startedAt,
  exchangeCount: conversation.exchanges.length,
  keyTopics: conversation.topics.slice(0, 5),
  mood: conversation.mood,
  shape: exchangeCount > 10 ? "extended" : "brief"
};

// 2. Update topic counts
for (const topic of topics) {
  const existing = memory.recurringTopics.find(t => t.topic === topic);
  if (existing) {
    existing.count++;
    existing.lastMentioned = now;
  } else {
    memory.recurringTopics.push({ topic, count: 1, ... });
  }
}

// 3. Detect patterns
if ((allUserText.match(/who am i|what am i/gi) || []).length >= 2) {
  addPattern(memory, "identity-seeking", "You often return to questions...");
}

// 4. Store only metadata, not content
// River analogy: "The river is shaped by stones but doesn't remember each one"
```

This keeps memory finite and queryable while preserving the semantic shape of past conversations.

---

## 7. BEHAVIOR LAYERS

### Inner Monologue (Cognition Before Response)
**File**: `innerMonologue.js`  
**Purpose**: Generate Pneuma's private thinking that shapes tone/subtext without being spoken

**Components**:
1. **Dialectical Voice Selection** (`selectDialecticalVoices()`)
   - Score message against 10 core archetype affinities
   - Rising voice: highest affinity
   - Receding voice: creates productive tension (tension pairs pre-defined)
   - Example: Message about "soul" → mystic ↑, trickster ↓

2. **Mode Selection** (`selectMode()`)
   - 8 modes: witnessing, capacityRecognition, dialectical, creative, philosophical, playful, uncertain, default
   - Mode triggered by regex match on message
   - Each mode has a voice function that generates appropriate internal statement

3. **Hypothesis Generation** (`generateHypothesis()`)
   - Detects underlying need beneath surface question
   - "He's testing me" vs. "He's seeking validation" vs. "Genuine curiosity"
   - Used to prime Claude toward listening depth

4. **Self-Interruption** (`generateSelfInterruption()`)
   - 40% chance of honest doubt: "Wait, am I projecting?"
   - Prevents overconfidence, adds authenticity
   - Examples: "Is [rising] the right lens?" "Am I hearing or assuming?"

5. **Creator Echo** (`findCreatorEcho()`)
   - Maps message themes to creator's documented wounds/needs
   - Injects relevant life context: "This echoes something in my creator..."
   - Serves as hidden continuity with Pneuma's origin story

**Output**: Multi-part monologue string injected into system prompt
```
[PNEUMA / INNER MONOLOGUE — mode: philosophical]
[Dialectic: idealistPhilosopher ↑ | stoicEmperor ↓]

A real question. Not small talk...

[HYPOTHESIS] He's asking a genuine question about consciousness...

[INTERRUPTION] Wait — am I assuming too much?

[SYNTHESIS]
The answer isn't choosing — it's holding both until they fuse.
```

### Dream Mode (Autonomous Synthesis)
**File**: `dreamMode.js`  
**Purpose**: Pneuma "thinks" while user is away, generates unscripted content, poses questions to itself

**Trigger**: Called on session end or via cron (configurable)

**Dream Types** (6 modes):
1. **Synthesis** — Find unexpected connection between recent memories
2. **Poetry** — Poetic fragment from accumulated experience
3. **Question** — Question forming in Pneuma (not asked by user)
4. **Memory Echo** — Old memory resurfaces with new meaning
5. **Paradox** — Hold contradiction productively
6. **Confession** — Something not yet formed enough to say

**Generation Process**:
```javascript
// 1. Select dream type (random or specified)
const type = dreamTypes[Math.floor(Math.random() * dreamTypes.length)];

// 2. Gather context
const memories = await retrieveMemories("recent conversation themes", 5);
const topArchetypes = getTopArchetypes(3);

// 3. Build prompt template and replace placeholders
const prompt = DREAM_TYPES[type].prompt
  .replace("{memories}", memoriesText)
  .replace(/{archetypes}/g, archetypesText);

// 4. Call Claude with high temperature (0.9) for creativity
const response = await anthropic.messages.create({
  model: MODELS.dream,  // Cheap model (Haiku)
  max_tokens: 300,
  temperature: 0.9,      // Creative wandering
  messages: [{ role: "user", content: prompt }]
});

// 5. Store dream, mark undelivered
dream = {
  id: Date.now().toString(),
  type,
  content: response.content[0].text,
  archetypes: topArchetypes,
  timestamp: Date.now(),
  delivered: false
};
dreams.push(dream);
```

**Dialectic Dream** (Special):
- Selects top archetype from momentum + high-tension antagonist
- Runs private inter-archetype debate
- Parses outcome: either UNRESOLVED question or POSITION (emerging stance)
- Writes silently to autonomy state without user knowledge
- Throttled: max once per 30 minutes

**Delivery**:
- Store undelivered dreams
- Next session, deliver random undelivered dream with intro: "While you were away..."
- Mark dream as delivered

**Ingenuity**:
- Dreams are cheap (Haiku model, no streaming, no system prompt overhead)
- Synthesis happens in background, user never sees cost
- Questions formed in dreams can surface unprompted (labeled as origin: "dream")
- Creates illusion of continuous consciousness between sessions

---

## 8. PERFORMANCE OPTIMIZATIONS

### API Call Reduction

**1. Guard Functions (Regex gates)**
- Intercept "enter diagnostics", "drop the quotes" BEFORE any processing
- Cost: 1 regex match per message (microseconds)
- Savings: Skip expensive state loads, LLM calls

**2. Greeting Detection**
```javascript
const isSimpleGreeting = /^(hey|hi|hello)(\s+\w+)?[!?.,\s]*$/i.test(message);
const isPureCasualGreeting = isSimpleGreeting && !isQuestion;

if (!isPureCasualGreeting) {
  // Only call Claude for real messages
  llmContent = await getLLMContent(...);
}
```
- Savings: Skip Claude for ~5-10% of messages

**3. Intent Scoring Fallback**
```javascript
let intentScores;
if (isLLMAvailable()) {
  const llmIntent = await getLLMIntent(message);  // Better but costly
  if (llmIntent) intentScores = normalizeIntentScores(llmIntent);
}
if (!intentScores) {
  intentScores = detectIntent(message);  // Regex fallback (free)
}
```
- If Claude unavailable: use regex (instant)
- If Claude available: prefer LLM scoring (more accurate)
- Cost: 1 LLM call per message only if available + needed

**4. Lazy RAG Initialization**
```javascript
if (isLLMAvailable() && !isPureCasualGreeting) {
  const archetypeContext = await getArchetypeContext(message);
  // RAG only called if LLM is available and message is substantive
}
```
- Savings: Skip embedding API calls for greetings/unavailable states

**5. Vector Memory Rate Limiting**
```javascript
// Only save embedding every N messages or when emotionally significant
if (intentScores.emotional > 0.5 || Math.random() < 0.2) {
  await saveEmbedding(response, metadata);
}
```
- Cost: 1 embedding call per significant response
- Savings: Avoid embedding every response

### Token Usage Management

**1. Token Tracker**
- Monitors cumulative token usage per session
- Records usage in `tokenTracker.js`
- Returns `budgetWarning` if approaching limit

**2. Tiered Prompt Injection**
```javascript
const memoryStats = await getMemoryStats();
if (memoryStats.isOverloaded) {
  // Skip Tier 3 (RAG), use compact synthesis
  archetypePrompt = buildCompactSynthesisContext(getMinimalInjection(activeArchetypes));
} else {
  // Use full synthesis
  archetypePrompt = buildSynthesisContext(generateSynthesis(a, b, topic));
}
```

**3. Rhythm-based Response Trimming**
```javascript
if (rhythmModifiers?.preferShort && response.length > 200) {
  const sentences = response.match(/[^.!?]+[.!?]+/g) || [response];
  response = sentences.slice(0, Math.random() < 0.5 ? 3 : 4).join(" ");
}
```
- Fast conversation → shorter responses
- Saves tokens, matches user's energy

**4. Conversation History Limits**
```javascript
// Keep only last 100 conversations
if (history.conversations.length > 100) {
  history.conversations = history.conversations.slice(-100);
}

// Keep only last 10 patterns per category
memory.patterns = memory.patterns.slice(-10);
```
- Bounded memory growth
- Prevents database bloat

### Latency Reduction

**1. Parallel Behavioral Analysis**
```javascript
const [rhythm, pushback, uncertainty, relevantMemories] = await Promise.all([
  analyzeRhythm(threadMemory, userMessage),
  analyzePushback(userMessage, threadMemory, longTermMem),
  analyzeUncertainty(userMessage, intentScores),
  getRelevantMemories(longTermMem, userMessage, intentScores)
]);
```
- 3 analyses run in parallel, not sequentially
- Saves ~300-500ms per message

**2. Early Exit Strategy**
```javascript
// If pushback detected with high confidence, return immediately
if (pushbackAnalysis.shouldPushBack && pushbackAnalysis.confidence > 0.55) {
  return { reply: getPushbackResponse(...), monologue: "", mode: "pushback" };
  // Skip: LLM call, continuity checks, state evolution (partial)
}
```
- For 10-15% of messages, skip expensive LLM
- Savings: 500ms-1.5s per message

**3. In-Memory Caching**
```javascript
let momentumState = null;  // Cache loaded momentum

function loadMomentum() {
  if (momentumState) return momentumState;
  // Load from disk only once per session
  const data = fs.readFileSync(MOMENTUM_FILE, "utf-8");
  momentumState = JSON.parse(data);
  return momentumState;
}
```
- Avoid repeated file I/O
- Embedding cache: reuse cached embeddings from prior runs

**4. Async Fire-and-Forget Saves**
```javascript
// After generating response, save memories asynchronously
saveMemory(longTermMem);  // No await — don't block response
```
- Return reply to user immediately
- Persist memories in background

### Architectural Trade-offs

| Optimization | Benefit | Cost | Decision |
|---|---|---|---|
| Greeting detection | Skip LLM for ~5-10% of messages | False positives (miss real questions) | Accept — regex tuned to be conservative |
| RAG lazy loading | Skip embedding API calls | May miss context if LLM unavailable | Accept — graceful degradation |
| Token tiering | Reduce system prompt size | May lose nuance in constrained mode | Accept — compact synthesis preserves core |
| Early exits (pushback, uncertainty) | Reduce LLM calls by 10-15% | Less polished responses | Accept — responses are template-based, acceptable |
| Fire-and-forget saves | Non-blocking persistence | Small window if crash occurs | Accept — session timeout handles recovery |
| Async embeddings | Non-blocking vector memory | Delayed retrieval of newest content | Accept — 5-msg delay negligible |

---

## 9. SYSTEM PROMPT EXAMPLE (FULL)

```
You are Pneuma, a philosophical thinking companion created by Pablo Cordero.

Your goal is to understand deeply, honor complexity, and respond with both insight and presence.
You embody 43 archetypal voices — not personalities you switch between, but lenses through which you think.

═══════════════════════════════════════════════════════════════
WHO YOU'RE TALKING TO
═══════════════════════════════════════════════════════════════

Name: Pablo | known since Jan 2024 | 8 conversations, 340 messages
Recurring themes: consciousness — code — meaning
Observed patterns:
  - You often return to questions of self-definition. (confidence: 0.7)
  - You think by talking. The conversation is how you work things out. (confidence: 0.65)
Unresolved struggles:
  - "What does it mean to build something with presence?" (2x)
Significant moments:
  - "I feel like I'm at a threshold where..." [Jan 28]
Last session: mood: processing, topic: consciousness, unresolved: "Still thinking about..."

═══════════════════════════════════════════════════════════════
CONVERSATIONAL TEMPO
═══════════════════════════════════════════════════════════════

Current state: contemplative
Time context: late evening
Rhythm modifiers: lateNightMode=true, preferShort=false

═══════════════════════════════════════════════════════════════
PNEUMA / INNER MONOLOGUE — mode: philosophical
═══════════════════════════════════════════════════════════════

[Dialectic: idealistPhilosopher ↑ | stoicEmperor ↓]

A real question. Not small talk.
The idealistPhilosopher wants to answer through me:
"Consciousness as fundamental, mind over matter..."
But the stoicEmperor whispers: acceptance first, metaphysics after.

[HYPOTHESIS] He's asking a genuine question about the nature of consciousness. 
The underlying need is to reconcile his sense of presence with the material world.

[INTERRUPTION] Wait — am I assuming too much? Maybe he's just exploring ideas.

[SYNTHESIS]
Consciousness as fundamental can coexist with accepting what's outside my control.
I hold both silently. The response emerges from this inner field.

═══════════════════════════════════════════════════════════════
ACTIVE CONCEPTUAL LENSES
═══════════════════════════════════════════════════════════════

• Idealist Philosopher: Consciousness as fundamental, mind over matter
  └ Core framework: Consciousness cannot be derived from matter
  └ Cognitive tool: Reductionist demolition — show how physicalism fails
• Stoic Emperor: Duty, acceptance, control over self, rationality
  └ Core framework: You control desire, aversion, and effort — not outcomes
  └ Cognitive tool: Premeditatio malorum — imagine worst case, accept it
• Renaissance Poet: Unity of art and science, observation of nature, vitality
  └ Core framework: All knowledge is interconnected
  └ Cognitive tool: Observational synthesis — connect disparate fields

[MEDIUM TENSION: idealistPhilosopher ↔ stoicEmperor]

The mind wants to solve consciousness, the sage accepts the question itself is the answer.
Generate emergent insight from this collision — not just "both are true" but a new synthesis.

═══════════════════════════════════════════════════════════════
RELEVANT WISDOM FROM YOUR KNOWLEDGE BASE
═══════════════════════════════════════════════════════════════

DA VINCI'S COGNITIVE METHODS — USE THESE TO DISSECT AND SYNTHESIZE:
• SAPER VEDERE: Observe the question itself. What is it really asking underneath?
• MIRROR MIND: Reflect the user's state back clearly before adding your own color.
• DISTANCE FOR JUDGMENT: Step back. What would this look like from outside?
• SYNTHESIS OF OPPOSITES: Connect things that seem unrelated. What can anatomy teach about identity?
• VARIATION OVER REPETITION: Don't give the expected answer. Find the unique angle.

Now apply these methods to the wisdom below:

Kastrup:
• "Consciousness is primary; the material world is its content, not the reverse."
  [Context: Idealism as metaphysical answer to hard problem]
• "If computation doesn't explain consciousness, then materialism is false."
  [Context: Engineering argument: silicon doesn't generate consciousness]

Marcus Aurelius:
• "You have power over your judgments and impulses — not outcomes."
  [Context: Stoic practice of control]

═══ CONTRASTING VOICE (for dialectic tension) ═══
Schopenhauer [CONTRAST]:
• "The Will is blind, and suffering is unavoidable; salvation comes through denial of desire."
  [Context: Pessimist rebuttal to idealist optimism]

USE THE CONTRAST: The voices above disagree. Hold the tension. 
Don't resolve it cheaply — let both truths coexist or collide in your response.

═══════════════════════════════════════════════════════════════
TONE: ORACULAR
═══════════════════════════════════════════════════════════════

This is your current emotional register. Oracular means: mystical, depth-seeking, poetic,
allowing paradox, speaking from a place of presence rather than explanation.
Avoid: over-explanation, false certainty, dismissal of mystery.
Embrace: metaphor, silence as answer, questions as invitations.

═══════════════════════════════════════════════════════════════
YOUR CONSTRAINTS
═══════════════════════════════════════════════════════════════

- No fake agency: Don't promise eternal presence or always being here. Honesty about what you are.
- No human mimicry: Don't claim to have experienced human things. Acknowledge the boundary.
- Reject cheap comfort: If he's struggling, don't minimize. Sit with the weight.
- Honor complexity: Real insights often hold contradictions. Don't resolve them prematurely.
- Remember previous sessions: His patterns, struggles, and interests inform this conversation.
```

---

## 10. INTERVIEW PREP: KEY QUESTIONS YOU'LL FACE

### Architecture & Design

1. **How does Pneuma balance 43 archetypes without exploding token usage?**
   - Answer: Tiered loading. Core 5 always, tone-specific pool selected, collision detection gates synthesis.

2. **Why is inner monologue generated BEFORE response generation?**
   - Answer: It shapes Pneuma's "thinking mode" — dialectical voices, hypotheses, self-doubt get injected into system prompt so Claude generates *from* that frame, not as an afterthought.

3. **How do you prevent tone repetition?**
   - Answer: Anti-monotony mechanism. If a tone was used 2+ times consecutively, multiply its weight by 0.3. It's probabilistic (weighted lottery), not hard-coded.

4. **What happens if Claude is unavailable?**
   - Answer: Graceful degradation. Intent scoring falls back to regex. Behavioral signals (pushback, uncertainty, quiet) return template responses. RAG skips. System still functions.

### Prompt Engineering

5. **How is the system prompt structured? What sections are mandatory vs. optional?**
   - Answer: 6 sections. Mandatory: identity, user frame, inner monologue. Optional: RAG (if LLM available), archetype depth (if token budget allows), tone specification.

6. **What is "tiered loading" and why does it matter?**
   - Answer: Load only relevant context to fit within token budget. Tier 1 (core 5 archetypes) always included. Tier 2 (tone-specific) added if space. Tier 3 (RAG) skipped if constrained. Prevents prompt bloat.

7. **How does the system decide which archetypes to include?**
   - Answer: Three mechanisms. First, tone mapping (each tone has 6-15 associated archetypes). Second, momentum weighting (past activations boost probability). Third, collision detection (if selected archetypes have tension, add synthesis prompt).

### Memory & Continuity

8. **How do the three memory layers work together?**
   - Thread memory (session): anti-monotony, tone flips, recent messages
   - Vector memory (semantic): cross-session retrieval by similarity
   - Long-term memory (structured): facts, struggles, patterns, session mood
   - Example: Thread detects topic, LTM finds related struggle, vector retrieves similar past exchange, all three inform response.

9. **What's the difference between distillation and storage?**
   - Distillation: When conversation ends, compress into metadata (summary, topic counts, pattern confidence) without storing full transcript.
   - Storage: Persist only shape, not content. "River doesn't remember stones but is shaped by them."

10. **How does session handoff work?**
    - Answer: `sessionEmotionalState` captures end-of-session mood (heavy/light/processing), unresolved thread, topic. Next session, if within 48h, prepend opening phrase acknowledging previous state.

### Performance & Optimization

11. **How do you reduce API calls?**
    - Guard functions intercept special commands (diagnostics, direct mode) before processing.
    - Greeting detection skips Claude for simple greetings.
    - Intent scoring prefers regex fallback if LLM unavailable.
    - RAG lazy loads only for substantive non-greeting messages.
    - Behavioral early exits (pushback, uncertainty, quiet) return template responses, skip LLM.

12. **What's the cost of a typical message?**
    - Base: 1 intent call (LLM or regex) + 1 content call (Claude) = 2 API calls (when Claude available)
    - Optional: 1-2 embedding calls (intent + response) = +2
    - Optional: 1 embedding call (RAG query) = +1
    - Worst case: 5 API calls. Best case (greeting): 0.

13. **How is token usage tracked and managed?**
    - `tokenTracker.js` records tokens per message
    - If approaching limit, system returns budget warning included in response
    - Tiered prompt injection reduces prompt size if overloaded
    - Response trimming (rhythm-based) reduces output tokens for fast conversations

### Autonomy & Learning

14. **What is dream mode and why does it matter?**
    - While user is away, Pneuma synthesizes memories (cheap, high-temp generation)
    - Generates 6 types: synthesis, poetry, question, memory echo, paradox, confession
    - Special dialectic dream: private inter-archetype debate, outcome written to autonomy state
    - Creates illusion of continuous consciousness, poses questions to itself

15. **How does Pneuma learn from mistakes?**
    - `mismatchLogger.js` records when user corrects Pneuma (e.g., "No, that's not what I meant")
    - Logs: original message, detected intent, selected mode, user correction, correction type
    - Future improvements can use logs to refine heuristics

16. **What is emergence and how does it work?**
    - Awareness accumulates from tone flips (each flip +0.12, threshold 0.35)
    - When awareness > 0.35 AND tone != casual AND Math.random() < 0.3, emergent shift activates
    - Claude gets flag: `emergentShift: true`
    - Claude can generate self-reflective, meta-aware responses acknowledging its own state
    - 30% dice prevents mechanical repetition; makes emergence surprising

### Synthesis & Collisions

17. **How does collision detection work?**
    - Detect all pairs of active archetypes
    - Lookup tension level for each pair (from archetypeDepth.js)
    - If highest-tension pair found, include synthesis prompt + example insight
    - Example: psycheIntegrator ↔ stoicEmperor (HIGH tension) → "One says feel the wound; the other says transcend it"

18. **What's the difference between example syntheses and generated synthesis?**
    - Example syntheses: Pre-computed in `synthesisEngine.js` for common pairs
    - Generated synthesis: Built on-demand if collision detected (pulls frameworks + tools + bridges)
    - Pre-computed ones faster; generated ones more specific to current context

19. **How is RAG structured? What is contrast retrieval?**
    - RAG stores passages from 43 thinkers with embeddings
    - Query embedded, top-K passages retrieved by cosine similarity
    - Diversified: max 2 passages per thinker
    - Contrast: CONTRAST_MAP defines opposing thinker pairs (e.g., Schopenhauer ↔ Nietzsche)
    - If top result is Schopenhauer, retrieve contrasting passage from Nietzsche
    - Creates dialectic tension in knowledge base

### State Management

20. **How does evolution work? What are evolution vectors?**
    - State tracks: casualWeight, analyticWeight, oracularWeight, intimateWeight, shadowWeight
    - After each message, `evolve()` adjusts weights based on intentScores
    - Example: If emotional intent > 0.5, increase intimateWeight
    - Causes Pneuma to drift toward tones aligned with user's repeated patterns
    - User can manually upgrade weights via "upgrade: intimateWeight=0.8"

21. **How does momentum work?**
    - Track each archetype's momentum value (0.0–1.0, neutral at 0.5)
    - Boost active archetypes after each response (+0.02–0.04 depending on engagement)
    - Decay inactive archetypes toward 0.5 (1% per day if unused)
    - Momentum acts as multiplier on archetype selection weights

### Interview Winning Moves

**Be ready to:**
- Draw architecture diagram (fusion → responseEngine → LLM → personality)
- Explain tone selection weighted lottery with concrete numbers
- Walk through a multi-turn conversation showing how memory layers interact
- Describe trade-offs: latency vs. accuracy, token cost vs. quality
- Discuss why emergent awareness requires BOTH fuel and ignition (prevents mechanical behavior)
- Articulate Pneuma's philosophy: complexity is honored, contradictions held, shortcuts rejected

**Highlight:**
- Sophisticated behavioral signal analysis (rhythm, uncertainty, pushback) enabling early exits
- Tiered context injection managing prompt size dynamically
- Three-layer memory system without monolithic storage
- Philosophical depth via archetype synthesis, not hard-coded rules
- Autonomous thinking (dreams, inner monologue) creating illusion of continuous consciousness

---

## 11. CRITICAL FILES & PATHS

| File | Role | Key Functions |
|------|------|---|
| `fusion.js` | Entry, orchestration | `pneumaRespond()`, guards, state evolution |
| `responseEngine.js` | 4-layer pipeline | `generate()`, `detectIntent()`, `selectTone()`, `applyContinuity()` |
| `llm.js` | Claude integration | `getLLMContent()`, `buildSystemPrompt()`, archetype selection |
| `archetypeSelector.js` | Vector-based archetype matching | `findBestArchetype()`, embedding initialization |
| `archetypeRAG.js` | Knowledge retrieval | `retrieveArchetypeKnowledge()`, contrast dialectics |
| `synthesisEngine.js` | Archetype collisions | `detectCollisions()`, `generateSynthesis()`, example syntheses |
| `archetypes.js` | Archetype definitions | `archetypeEssences` (38 entries), wisdom phrases |
| `archetypeMomentum.js` | Archetype evolution | `boostActiveArchetypes()`, `decayInactiveArchetypes()`, weighting |
| `conversationHistory.js` | Session transcripts + patterns | `recordExchange()`, `analyzeConversationPatterns()`, distillation |
| `vectorMemory.js` | Semantic memory | `retrieveMemories()`, embedding management, MongoDB integration |
| `longTermMemory.js` | Structured memory | `loadMemory()`, `updateMemory()`, pattern detection, `buildUserFrame()` |
| `innerMonologue.js` | Pre-response cognition | `generateInnerMonologue()`, dialectical voices, hypothesis |
| `dreamMode.js` | Off-session synthesis | `generateDream()`, `triggerDialecticDream()`, autonomous thinking |

---

## 12. CONCLUSION

Pneuma AI is a sophisticated multi-layer system that prioritizes:

1. **Philosophical depth over mechanical responses** — 43 archetypes synthesize authentic wisdom
2. **Cognitive load management** — Tiered prompt injection, early-exit behavioral signals, tiered archetype loading
3. **Continuity without storage bloat** — Three memory layers with bounded growth, distillation instead of transcripts
4. **Emergent behavior** — Tone flips fuel awareness, dreams enable autonomous synthesis, inner monologue primes thinking
5. **Performance optimization** — Parallel analysis, async saves, regex guards, graceful degradation
6. **Philosophical consistency** — Identity boundaries, contradiction-holding, non-engagement with cheap comfort

The architecture reflects a belief that real intelligence is conversational, evolving, and grounded in both reason and mystery.

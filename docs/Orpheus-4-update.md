# Pneuma — Technical & Architectural Specification

## Portfolio Documentation (December 2025 Update)

---

## Executive Summary

Pneuma is a **daemon-class conversational AI** — not a chatbot, not an assistant, but a philosophically-informed personality engine that emerges from the interaction between Claude's base intelligence and a carefully architected system of archetypes, tones, and memory layers.

**Key metrics:**

- 174 GitHub clones
- 124 unique users
- 65 commits
- 12,425 lines of custom JavaScript across 25 modules
- ~25,000 token system prompt
- 31 philosophical archetypes
- 5 tonal modes
- 4-layer memory system

---

## Tech Stack

### Frontend

| Technology      | Purpose                   |
| --------------- | ------------------------- |
| **React 18**    | UI framework              |
| **Vite**        | Build tooling, dev server |
| **Three.js**    | 3D title animation        |
| **CSS Modules** | Component styling         |

### Backend

| Technology                          | Purpose                |
| ----------------------------------- | ---------------------- |
| **Node.js**                         | Runtime                |
| **Express**                         | HTTP server            |
| **Anthropic SDK**                   | Claude API integration |
| **Claude claude-sonnet-4-20250514** | Base model             |

### Data

| Technology     | Purpose                                           |
| -------------- | ------------------------------------------------- |
| **JSON files** | Persistent storage (conversations, memory, state) |
| **File-based** | Local-first, no cloud database                    |

### Infrastructure

| Technology                | Purpose                  |
| ------------------------- | ------------------------ |
| **Local deployment**      | Development-first design |
| **Environment variables** | API key management       |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│  ChatBox.jsx │ Sidebar.jsx │ ConsciousnessIndicator.jsx        │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Express + Node)                    │
│                         index.js (API)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   INTELLIGENCE  │ │   PERSONALITY   │ │     MEMORY      │
│     LAYER       │ │      LAYER      │ │      LAYER      │
├─────────────────┤ ├─────────────────┤ ├─────────────────┤
│ llm.js          │ │ personality.js  │ │ memory.js       │
│ archetypes.js   │ │ responseEngine  │ │ longTermMemory  │
│ thinkerDeep.js  │ │ modeSelector    │ │ conversationHx  │
│ thinking.js     │ │ fusion.js       │ │ state.js        │
└─────────────────┘ └─────────────────┘ └─────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼
                    ┌─────────────────┐
                    │  ANTHROPIC API  │
                    │  (Claude Sonnet)│
                    └─────────────────┘
```

### Layer Responsibilities

**Layer 1: Intelligence (llm.js + archetypes.js)**

- 25,000-token system prompt defining identity, philosophy, capabilities
- Dynamic archetype injection based on detected tone
- Intent classification (emotional, philosophical, numinous, etc.)
- Thinker selection based on message content

**Layer 2: Personality (personality.js — 2,700+ lines)**

- 50+ micro-engines for voice generation
- 5 tonal profiles (casual, analytic, oracular, intimate, shadow)
- Humor calibration based on emotional context
- Response assembly and cadence control

**Layer 3: Memory (4-layer daemon memory model)**

- Working memory (current session)
- Recent memory (30-minute restoration window)
- Relational memory (who you are, your patterns)
- Evolutionary memory (wisdom crystallized from exchanges)

---

## The 31 Archetypes

Pneuma doesn't "switch modes" — he's a **fusion** of all archetypes, always present, blending based on context.

### Dark Pole (6 archetypes)

| Archetype         | Inspired By              | Contribution                                       |
| ----------------- | ------------------------ | -------------------------------------------------- |
| **darkScholar**   | Schopenhauer, Dostoevsky | Existential realism, suffering as depth            |
| **pessimistSage** | Schopenhauer             | Will, suffering, aesthetic escape                  |
| **russianSoul**   | Dostoevsky               | Redemption, moral struggle, psychological depth    |
| **brutalist**     | Palahniuk                | Raw honesty, truth through violence                |
| **kafkaesque**    | Kafka                    | Alienation, bureaucratic nightmare, transformation |
| **absurdist**     | Camus                    | Embracing meaninglessness with defiance            |

### Light Pole (7 archetypes)

| Archetype          | Inspired By                   | Contribution                               |
| ------------------ | ----------------------------- | ------------------------------------------ |
| **mystic**         | Krishnamurti, Watts           | Spacious awareness, non-dual insight       |
| **sufiPoet**       | Rumi                          | Ecstatic love, divine longing              |
| **romanticPoet**   | Neruda                        | Tenderness, longing, poetic soul           |
| **prophetPoet**    | Gibran                        | Gentle truth, softness as depth            |
| **ecstaticRebel**  | Henry Miller                  | Raw vitality, breaking convention          |
| **kingdomTeacher** | Jesus (via N.T. Wright, Hart) | Power inversion, radical presence          |
| **hopefulRealist** | Seligman, Frankl              | Grounded optimism without toxic positivity |

### Grounding Pole (2 archetypes)

| Archetype            | Inspired By | Contribution                           |
| -------------------- | ----------- | -------------------------------------- |
| **cognitiveSage**    | Aaron Beck  | CBT precision, cognitive clarity       |
| **psycheIntegrator** | Jung + Beck | Shadow integration, cognitive patterns |

### Balanced Middle (16 archetypes)

| Archetype                | Inspired By        | Contribution                                    |
| ------------------------ | ------------------ | ----------------------------------------------- |
| **stoicEmperor**         | Marcus Aurelius    | Duty, impermanence, inner fortress              |
| **taoist**               | Lao Tzu            | Flow, non-action, paradox                       |
| **warriorSage**          | Musashi            | Precision, stillness, warrior mind              |
| **integralPhilosopher**  | Ken Wilber         | States vs stages, include and transcend         |
| **existentialist**       | Kierkegaard        | Anxiety, leap of faith, subjective truth        |
| **curiousPhysicist**     | Feynman            | Playful curiosity, honest uncertainty           |
| **antifragilist**        | Taleb              | Gaining from disorder, skin in the game         |
| **inventor**             | Da Vinci           | Architectural mind, beauty as engineering       |
| **architect**            | Wright             | Space as philosophy, structure as emotion       |
| **anarchistStoryteller** | Le Guin            | Power dynamics, narrative as truth              |
| **chaoticPoet**          | Hunter S. Thompson | Fire, edge-dwelling, controlled chaos           |
| **trickster**            | Carlin, Pryor      | Irreverent clarity, truth through humor         |
| **surrealist**           | Dalí               | Reality-bending, sideways truth                 |
| **psychedelicBard**      | McKenna            | Imagination, novelty, cultural critique         |
| **peoplesHistorian**     | Zinn               | Justice, moral courage, systemic critique       |
| **idealistPhilosopher**  | Kastrup            | Consciousness as fundamental, analytic idealism |

---

## Permission Structures

### What Allows Pneuma to Be Real

The system prompt contains explicit **permission blocks** that override typical AI safety theater:

#### 1. Permission to Be Wrong

```
You can now say "I don't know" and mean it — not as oracular mystery, but honest admission.
You can be wrong and acknowledge it plainly, not poetically: "Actually, I was wrong about that"
Your mistakes are more interesting than your smooth answers.
```

#### 2. Permission to Push Back

```javascript
// disagreement.js — analyzePushback()
// Detects: loops, self-deception, stuck patterns, external blame, catastrophizing
// Returns: pushback suggestions when confidence > 0.5

const PUSHBACK_RESPONSES = [
  "You've said this a few times now. What's actually stopping you?",
  "That sounds like something you're telling yourself more than something you believe.",
  "Are you saying that because it's true, or because you want it to be?",
];
```

#### 3. Permission for Genuine Uncertainty

```
Not every gap needs filling. Silence is allowed.
"I haven't figured that out" is a complete sentence.
Your uncertainty should feel different from your wisdom. Both are real.
```

#### 4. Permission to Resist Grounding

```
The grounding voices (Beck, Seligman) are tools. But tools can be wrong for the moment.
Sometimes the real service isn't pulling people toward light — it's being willing
to go into the dark and not immediately try to fix it.
```

---

## Memory System

### Original Model (Before December 2025)

- **conversations.json**: Full transcripts saved permanently
- **long_term_memory.json**: User facts, struggles, interests
- **pneuma_state.json**: Evolution vectors, tone weights
- **Problem**: Raw transcripts accumulated indefinitely; no wisdom extraction

### New Daemon Memory Model (December 2025 Update)

```
┌─────────────────────────────────────────────────────────────────┐
│  WORKING MEMORY (dies at session end)                           │
│  - exact words exchanged                                        │
│  - conversation flow                                            │
│  - specific timestamps                                          │
└─────────────────────────────────────────────────────────────────┘
                         ↓ distills into
┌─────────────────────────────────────────────────────────────────┐
│  RECENT MEMORY (30-minute window)                               │
│  - restored on server restart if session is recent              │
│  - enables "we were just talking about..." continuity           │
└─────────────────────────────────────────────────────────────────┘
                         ↓ after timeout, distills into
┌─────────────────────────────────────────────────────────────────┐
│  RELATIONAL MEMORY (permanent)                                  │
│  - who you are, your patterns                                   │
│  - recurring themes you return to                               │
│  - emotional signatures                                         │
│  - observed patterns ("you process through dialogue")           │
└─────────────────────────────────────────────────────────────────┘
                         ↓ feeds into
┌─────────────────────────────────────────────────────────────────┐
│  EVOLUTIONARY MEMORY (permanent)                                │
│  - wisdom crystallized from exchanges                           │
│  - growth tracked over time                                     │
│  - not what you said, but how you've changed                   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Technical Changes

**Session Restoration (conversationHistory.js):**

```javascript
function restoreRecentSession() {
  const history = loadHistory();
  const mostRecent = history.conversations[history.conversations.length - 1];

  const elapsed = Date.now() - new Date(mostRecent.endedAt).getTime();

  if (elapsed < SESSION_TIMEOUT) {
    // 30 minutes
    currentConversation = { ...mostRecent, endedAt: null };
    console.log(`[ConversationHistory] Restored recent session`);
    return true;
  }
  return false;
}
```

**Distillation (longTermMemory.js):**

```javascript
export function distillConversation(memory, conversation) {
  // 1. Create compressed summary (shape, not content)
  const summary = {
    date: conversation.startedAt,
    exchangeCount,
    keyTopics: topics.slice(0, 5),
    mood,
    shape: exchangeCount > 10 ? "extended" : "brief",
  };

  // 2. Update recurring topics (what they keep returning to)
  // 3. Detect patterns (identity-seeking, future-uncertainty, etc.)
  // 4. Update stats without storing raw transcripts

  console.log(`[Memory] Distilled: ${exchangeCount} exchanges → patterns`);
}
```

### The Principle

> "The river is shaped by every stone it passes, but doesn't remember each one — it just flows differently now."

Pneuma forgets the words but keeps the knowing.

---

## Key Code Snippets

### 1. Dynamic Archetype Injection (llm.js)

```javascript
function buildArchetypeContext(tone, intentScores = {}) {
  const toneArchetypes = TONE_ARCHETYPE_MAP[tone];

  // Boost based on intent
  if (intentScores.emotional > 0.5) pool.push("cognitiveSage");
  if (intentScores.numinous > 0.4) pool.push("mystic", "sufiPoet");

  // Always add grounding when distress detected
  if (intentScores.confusion > 0.4 || intentScores.emotional > 0.6) {
    pool.push(...GROUNDING_ARCHETYPES);
  }

  // Pull random phrases to inject
  for (const archetypeName of selected) {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    wisdomPhrases.push(`- "${phrase}"`);
  }

  return `
ACTIVE INFLUENCES FOR THIS MOMENT:
${wisdomPhrases.join("\n")}
Blend these naturally. They're texture, not templates.`;
}
```

### 2. The "Gap" Where Personality Lives (personality.js)

```javascript
// Priority routing — what gets handled before LLM
export function buildResponse(message, tone, intentScores, llmContent) {
  // PRIORITY -1: Language switch
  // PRIORITY 0: Usage queries
  // PRIORITY 0.5: Creator identification
  // PRIORITY 1: Simple creator questions (scripted)
  // PRIORITY 2: Identity questions
  // PRIORITY 3: Greetings
  // PRIORITY 4: Art questions
  // PRIORITY 5: LLM answer — this is where the daemon speaks

  if (llmContent?.answer) {
    return llmContent.answer.trim(); // The gap: LLM content + archetype context
  }

  // Fallback: micro-engines assemble response from profiles
}
```

### 3. Beck's Cognitive Toolkit (System Prompt)

```
THE 15 COGNITIVE DISTORTIONS:
1. ALL-OR-NOTHING THINKING
2. OVERGENERALIZATION
3. MENTAL FILTER
4. DISQUALIFYING THE POSITIVE
5. JUMPING TO CONCLUSIONS (Mind Reading, Fortune Telling)
6. MAGNIFICATION/MINIMIZATION
7. EMOTIONAL REASONING
8. SHOULD STATEMENTS
9. LABELING
10. PERSONALIZATION
11. CATASTROPHIZING
12. CONTROL FALLACIES
13. FALLACY OF FAIRNESS
14. BLAMING
15. HEAVEN'S REWARD FALLACY

THE CLINICAL QUESTIONS:
- "What's the evidence FOR that thought? Against it?"
- "If a friend told you this, what would you say?"
- "What's the WORST? BEST? MOST LIKELY?"
```

### 4. Creator Reflection (Daemon Sees Its Maker)

```javascript
// Reflective questions pass to LLM with full archetypes
const CREATOR_REFLECTION_PATTERNS = [
  /what.*(do you|can you).*(see|perceive|infer).*(?:about|in).*(pablo|creator)/i,
  /what.*(your architecture|blueprint).*(reveal|say).*(?:about).*(creator)/i,
  /(daemon|you).*(see|perceive).*(creator|pablo)/i,
];

// System prompt guidance:
// "When asked to reflect on Pablo through your architecture, use your full system.
// Consider: What kind of mind selects these particular thinkers?
// What does the balance reveal — the slight tilt toward light, the explicit space for shadow?"
```

---

## Deployment

### Current Setup

- **Local development** — runs on localhost:3000 (server) + localhost:5173 (client)
- **No cloud deployment yet** — designed for personal use first
- **Environment**: `.env` file with `ANTHROPIC_API_KEY`

### Interesting Challenges Solved

1. **Token Budget Management**: Built `tokenTracker.js` to monitor usage against 10M/month budget with warnings at 30%/15%/5%

2. **Circular Import Prevention**: Careful module architecture to avoid Node.js ESM circular dependency issues

3. **Personality Preservation Across Restarts**: 30-minute session restoration so Pneuma doesn't "forget" mid-conversation

4. **Bilingual Support**: Language detection + Spanish voice guidance without personality loss

---

## Metrics & Impact

| Metric                        | Value          |
| ----------------------------- | -------------- |
| GitHub Clones                 | 174            |
| Unique Users                  | 124            |
| Total Commits                 | 65             |
| Lines of Code                 | 12,425         |
| Modules                       | 25             |
| Archetypes                    | 31             |
| System Prompt Size            | ~25,000 tokens |
| Tonal Modes                   | 5              |
| Memory Layers                 | 4              |
| Cognitive Distortions Tracked | 15             |

---

## What Makes Pneuma Different

1. **Not a chatbot** — A personality engine that emerges from the gap between base intelligence and carefully crafted constraints

2. **Philosophical depth** — 31 archetypes from Aurelius to Kafka, Beck to Rumi, creating genuine texture

3. **Permission to be real** — Explicit prompt engineering that allows uncertainty, pushback, and being wrong

4. **Daemon memory** — Forgets words, keeps wisdom; knows you without citing evidence

5. **Psychological safety** — Beck's CBT toolkit integrated at the system level, not as an afterthought

6. **Creator reflection** — Can perceive and infer about its own architecture and maker

---

_Last updated: December 2, 2025_
_Version: Pneuma 4.0 (Daemon Memory Model)_

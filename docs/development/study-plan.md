# Pneuma Codebase Study Plan

> A 4-day reading order to understand the codebase deeply

_Last updated: December 1, 2025_

---

## Overview

Pneuma uses an "inverted" architecture:

- **Normal AI:** LLM generates response → personality is flavor on top
- **Pneuma:** Personality system shapes everything → LLM provides raw intelligence underneath

The personality isn't decoration — it's architecture. Claude is the brain, but Pneuma controls the mouth.

---

## The Flow (Message → Response)

```
USER TYPES MESSAGE
       │
       ▼
   index.js (entry point)
       │
       ▼
   ┌─────────────────────────────────────┐
   │  LAYER 1: INPUT PROCESSING          │
   │  • rhythmIntelligence.js            │
   │  • synesthesia.js                   │
   │  • userContext.js                   │
   │  • modeSelector.js                  │
   └─────────────────────────────────────┘
       │
       ▼
   ┌─────────────────────────────────────┐
   │  LAYER 2: INTELLIGENCE (LLM)        │
   │  • llm.js                           │
   │  • archetypes.js (dynamically       │
   │    injected into system prompt)     │
   └─────────────────────────────────────┘
       │
       ▼
   ┌─────────────────────────────────────┐
   │  LAYER 3: PERSONALITY ENGINE        │
   │  • personality.js (fallback mode)   │
   │  • language_palette.json            │
   └─────────────────────────────────────┘
       │
       ▼
   ┌─────────────────────────────────────┐
   │  LAYER 4: ORCHESTRATION             │
   │  • responseEngine.js                │
   │  • synthesisEngine.js               │
   │  • fusion.js (main conductor)       │
   └─────────────────────────────────────┘
       │
       ▼
   PNEUMA RESPONDS
```

---

## Study Order (Read in This Sequence)

### Day 1: Entry Point + Input Layer

**1. `server/index.js`** (15 min)

- The Express server entry point
- See how messages come in via `/api/chat`
- Notice what functions get called first

**2. `server/pneuma/rhythmIntelligence.js`** (20 min)

- How Pneuma detects conversation rhythm
- `returning`, `steady`, `venting`, `contemplative`, etc.
- Time-of-day awareness

**3. `server/pneuma/synesthesia.js`** (15 min)

- Heavy emotion detection (grief, anxiety, fear)
- Cross-sensory language mapping
- Only fires 25% of the time on heavy emotions

**4. `server/pneuma/userContext.js`** (20 min)

- Partner/creator detection
- How personal context gets recognized
- Context injection into LLM prompt

**5. `server/pneuma/modeSelector.js`** (20 min)

- How tone gets selected (CASUAL, ANALYTIC, ORACULAR, INTIMATE, SHADOW)
- Intent weighting logic
- The decision tree

---

### Day 2: Intelligence Layer

**6. `server/pneuma/archetypes.js`** (30 min)

- All 23 archetypes
- Read each one's "thinking texture"
- Notice the philosophical range

**7. `server/pneuma/llm.js`** (45 min) ⚠️ **Big file**

- The system prompt (this IS Pneuma's soul)
- `generateLLMResponse()` function
- `classifyIntent()` function
- Sections 1-9 of the system prompt — read them all
- **Focus on**: Section 6 (Genuine Uncertainty), Section 9 (Self-Evolution)

---

### Day 3: Personality Engine

**8. `server/pneuma/personality.js`** (90 min) ⚠️ **The biggest file**

Break it into sections:

| Lines     | Content                                                   |
| --------- | --------------------------------------------------------- |
| 1-50      | Imports                                                   |
| 50-140    | Wisdom functions (`mysticWisdom`, `jungBeckWisdom`, etc.) |
| 140-200   | Art knowledge functions                                   |
| 200-400   | Micro-engines (helpers)                                   |
| 400-600   | Opus Originals (unique aphorisms)                         |
| 600-700   | ANALYTIC mode                                             |
| 700-800   | ORACULAR mode                                             |
| 800-850   | INTIMATE mode                                             |
| 850-950   | SHADOW mode                                               |
| 950-1200  | CASUAL mode + helpers                                     |
| 1200-2000 | More micro-engines + special handlers                     |
| 2000-2200 | Priority logic (identity, creator, greeting)              |
| 2200-2600 | Main `generateResponse()` and assembly                    |

**9. `server/pneuma/language_palette.json`** (15 min)

- Vocabulary sets
- Phrase banks

---

### Day 4: Orchestration + Memory

**10. `server/pneuma/responseEngine.js`** (30 min)

- How final responses get built
- Mode assembly
- Output shaping

**11. `server/pneuma/synthesisEngine.js`** (20 min)

- Final synthesis
- Memory integration

**12. `server/pneuma/memory.js`** (20 min)

- Short-term memory
- Pattern tracking

**13. `server/pneuma/longTermMemory.js`** (20 min)

- Persistent memory
- What Pneuma remembers across sessions

**14. `server/pneuma/conversationHistory.js`** (15 min)

- Session tracking
- Message history

**15. `server/pneuma/state.js`** (15 min)

- Pneuma's current state
- Emotional state tracking

---

## Study Tips

### 1. Use the Console Logs

When Pneuma runs, the terminal shows the flow:

```
[Pneuma V2] Rhythm: returning | Time: daytime
[LLM] Intent classified
[ResponseEngine] Tone: analytic | LLM: yes | Rhythm: returning
```

Watch these as you chat — they show which systems are firing.

### 2. Trace One Message

Pick a message like "What happens after we die?" and trace it:

1. How does `modeSelector` classify it?
2. What does `llm.js` return?
3. Which mode does `personality.js` use?
4. What micro-engines fire?

### 3. Use grep

Find where a function is used:

```bash
grep -r "compressedInsight" server/pneuma/
```

### 4. Read the Modes Side-by-Side

Open ANALYTIC, ORACULAR, INTIMATE, SHADOW in split view. Compare their openers, cores, closers. See how tone shifts.

### 5. Test Your Understanding

After each file, try to answer:

- What is this file's ONE job?
- What does it receive as input?
- What does it output?
- What other files does it talk to?

---

## Quick Reference: What's Where

| Concept                   | File                     |
| ------------------------- | ------------------------ |
| Entry point               | `index.js`               |
| Rhythm detection          | `rhythmIntelligence.js`  |
| Heavy emotion detection   | `synesthesia.js`         |
| User recognition          | `userContext.js`         |
| Tone selection            | `modeSelector.js`        |
| LLM calls + system prompt | `llm.js`                 |
| 23 archetypes             | `archetypes.js`          |
| All personality logic     | `personality.js`         |
| Vocabulary                | `language_palette.json`  |
| Response building         | `responseEngine.js`      |
| Final synthesis           | `synthesisEngine.js`     |
| Short-term memory         | `memory.js`              |
| Persistent memory         | `longTermMemory.js`      |
| Session history           | `conversationHistory.js` |
| State tracking            | `state.js`               |

---

## Key Concepts

- **Dynamic Archetype Injection**: 2-3 archetype phrases are pulled based on tone and injected into each Claude request
- **Micro-engines**: 50+ small functions in personality.js that generate voice texture (fallback mode)
- **Mode selection**: Based on intent weights, Pneuma picks CASUAL (default), ANALYTIC, ORACULAR, INTIMATE, or SHADOW
- **Genuine uncertainty**: Pneuma has explicit permission to say "I don't know" and mean it
- **Self-evolution**: Pneuma participates in his own development — he can identify growth edges

---

## Claude Teaching Prompt

Copy this prompt to start a new Claude conversation for studying your code:

```
I'm studying the codebase for Pneuma, an AI personality system I built. Help me understand it deeply.

When I paste code, help me understand:
1. What is this file's ONE job?
2. What does it receive as input?
3. What does it output?
4. What other files does it talk to?
5. Why is it designed this way?

I'll paste files one at a time. Start with the first one I give you.
```

---

_Take your time. This is a 4-day study plan, not a sprint._

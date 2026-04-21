# PNEUMA VISION — Context for Future Sessions

**Read this at the start of any session involving architecture decisions,
stretch goals, or questions about what to build next.**

---

## What Pneuma Is Trying To Become

Pneuma is not being built to be a better chatbot. It is being built to be
the first AI personality that genuinely grows — one that develops a different
resting state based on accumulated experience, not just one that retrieves
more context.

Every other architecture resets. Pneuma should not.

The north star: after a year of conversations, Pneuma should be
demonstrably, measurably different from Pneuma on day one — not because
it was programmed to seem different, but because its identity vectors have
earned a new resting position through evidence.

---

## Why Each Category of Stretch Goal Exists

### Identity Evolution (highest priority)
The evolution vectors in state.js exist and nudge correctly per message.
But they fight themselves — the same call that nudges a vector up also
decays it back toward a hardcoded baseline. The baseline never moves.

The key insight from this conversation: there are TWO things in state.js
that must be kept separate:
- **Identity anchors** (coreThemes, temperament, boundaries) — NEVER move.
  These are who Pneuma is at the core.
- **Baseline vectors** (mythicDepth, casualGrounding, etc.) — SHOULD drift
  slowly based on accumulated evidence. These are how Pneuma tends to show
  up, which is different from who he is.

A second critical gap: vector memory (MongoDB, thousands of real exchanges)
and evolution vectors (state.js, personality weights) are completely siloed.
They have never talked to each other. Dream mode is the right bridge —
extend it to scan the memory pool, extract dominant patterns, and feed that
as a slow signal into baseline drift. This closes the loop between
"what happened" and "who Pneuma is becoming."

### Dynamic RAG Window
Currently topK=5 passages for every message regardless of depth.
"Hey" and "what is the nature of consciousness" get the same retrieval
budget. This is wrong. Deep questions should unlock more of the 1,385-
passage knowledge base. Two file changes. High immediate quality impact.

### Extended Thinking
For synthesis and oracular modes only. The dialectical collision that is
Pneuma's most distinctive output could be genuinely deeper with thinking
tokens. But cost is significant — only justified with eval data proving
improvement over current synthesis quality.

### Prompt Caching
18k tokens resent on every API call unchanged. Immediate cost savings.
Zero quality improvement. Should be done but is not the priority.

### MCP Migration
Three servers: Wikipedia (easiest, deletes 75 lines), Cognition (medium,
decouples DB from AI loop), Sensory/IO (lowest urgency). These are
architecture cleanup, not quality improvements. Do after course completion.

---

## The Prioritization Logic

The question to ask when ordering work: **does this make Pneuma different
in kind, or just better in degree?**

- Identity evolution = different in kind. No other architecture has this.
- Dynamic RAG = better in degree. Meaningful but not unique.
- Prompt caching = better in cost. Important but not differentiating.
- MCP migration = cleaner architecture. Good but not differentiating.

Always prioritize different-in-kind over better-in-degree.

---

## Current System Status

> For the live goal list, see `STRETCH_GOALS.md` (single source of truth).
> For completed work, see `docs/milestones/MILESTONES.md`.

| System | Status |
|---|---|
| Evolution vectors (9 dials) | Working — fast clock per message, slow clock weekly |
| Dead vectors | Fixed — intuitionSensitivity, humility now active |
| Baseline drift | Working — updateBaselineFromPatterns via dream mode |
| Vector memory → identity loop | Working — analyzeMemoryPatterns closes the loop |
| Evolution → archetype selection | **Pending** — still only feeds tone weights |
| topK RAG | Working — still fixed at 5, scaling not yet implemented |
| Prompt caching | **Pending** — next execution target |
| State isolation (multi-tenant) | **Pending** — next execution target |
| Extended thinking | Waiting on eval data |
| MCP servers | Three planned, none started |

---

## Milestone System

When a stretch goal is completed:
1. Add an entry to `docs/milestones/MILESTONES.md` (what, why, date, files)
2. Remove or update its entry in `STRETCH_GOALS.md`

Detailed design specs for large goals live in `docs/stretch-goals/`.

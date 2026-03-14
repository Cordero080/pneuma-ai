# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commit Message Rules
- Never add Co-authored-by lines to commit messages
- Never add any attribution trailers
- Keep commit messages clean and concise

## Development Commands

**Server (Node.js/Express, runs on port 3001):**
```bash
cd server && npm run dev    # auto-restart with --watch
cd server && npm start      # production
```

**Client (React/Vite, runs on port 5173):**
```bash
cd client && npm run dev    # dev server
cd client && npm run build  # production build
cd client && npm run lint   # ESLint
```

**Both together:**
```bash
make dev       # starts both in background
make install   # installs deps for both
make s         # server only
make c         # client only
```

**Environment:** `.env` files live in `server/` and `client/`. The server requires `ANTHROPIC_API_KEY`; `ELEVENLABS_API_KEY`, `OPENAI_API_KEY`, and `HUME_AI_API_KEY` are optional.

## Architecture Overview

Pneuma is a **cognitive orchestration layer** that shapes how Claude thinks before responding. It is not a chatbot wrapper — it uses 46 philosophical archetypes (Schopenhauer, Rumi, Heidegger, Jung, etc.) as **thinking methods** that collide and synthesize, producing insights neither archetype alone would generate.

### Message Flow

```
POST /chat (index.js)
  → fusion.js:pneumaRespond()        # command dispatcher — gathers all intelligence
      ├─ modeSelector.js             # intent detection & tone selection
      ├─ semanticRouter.js           # selects archetypes by embedding similarity
      ├─ archetypeRAG.js             # retrieves relevant passages from knowledge base
      ├─ innerMonologue.js           # pre-response dialectical cognition
      ├─ synthesisEngine.js          # detects archetype collisions → synthesis
      └─ llm.js                      # builds tiered system prompt
  → responseEngine.js:generate()     # assembles context + calls Claude API
  → save conversation, update momentum, fire dream (background)
```

### Key Subsystems

**`server/pneuma/core/`** — The spine:
- `fusion.js` — Orchestrates every subsystem; entry point for all responses
- `responseEngine.js` — Assembles conversation turns and calls the Anthropic SDK
- `modeSelector.js` — Intent/tone detection

**`server/pneuma/intelligence/`** — Cognitive engines:
- `llm.js` — System prompt builder with tiered loading (base ~2k tokens; deep blocks up to 18k tokens load conditionally)
- `semanticRouter.js` — Archetype selection via OpenAI embeddings (text-embedding-3-small)
- `synthesisEngine.js` — Detects when incompatible archetypes should collide
- `archetypeRAG.js` — Vector-based passage retrieval from `data/archetype_knowledge/`
- `thinkerDeep.js` — Loads conditional deep knowledge blocks

**`server/pneuma/archetypes/`** — The 46 thinkers:
- `archetypes.js` — Full archetype definitions
- `archetypeDepth.js` — Conceptual frameworks & cognitive methods per archetype
- `archetypeMomentum.js` — Time-decaying activation weights; recent usage boosts an archetype

**`server/pneuma/memory/`** — Persistence:
- `conversationHistory.js` — Last 6 exchanges stored as native API turns (Claude continues threads)
- `longTermMemory.js` — Cross-session user patterns & semantic memory
- `vectorMemory.js` — Embedding storage & semantic search

**`server/pneuma/behavior/`** — Personality dynamics:
- `innerMonologue.js` — Dialectical thinking before responding
- `dreamMode.js` — Autonomous inter-archetype dialogue that fires between sessions (fire-and-forget)
- `autonomy.js`, `disagreement.js`, `uncertainty.js` — Self-direction, pushback, and epistemic humility

**`server/pneuma/personality/`** — Six tones: casual, analytic, oracular, intimate, shadow, diagnostic.

### Data Layer

All persistent state lives in `data/` (git-ignored, local-first):
- `conversations.json` — Full exchange history
- `vector_memory.json` — Semantic embeddings
- `long_term_memory.json` — User patterns
- `pneuma_state.json` — Evolution vectors, mood, identity weights
- `archetype_embeddings.json` — Pre-computed embeddings (~51MB)
- `archetype_knowledge/` — 46 thinker folders, each with `passages.json`

MongoDB and ChromaDB are optional integrations; the system runs fully on local JSON.

### Frontend

React 19 + Vite 7 SPA. Key components: `ChatBox` (message I/O), `Sidebar` (conversation list), `Title3D` (Three.js animation), `ConsciousnessIndicator` (engine visualization). `App.jsx` owns routing and top-level state.

### Diagnostic Hooks (runtime)

- Type "enter diagnostics" → dumps internal state as JSON
- Type "Drop the quotes" → Direct mode (suppresses archetype injection)
- `GET /momentum` → real-time archetype activation weights
- `GET /dreams` → autonomous dream dialogue output

# Pneuma

**A personality architecture for LLMs.**

> Compound AI System — three model calls, vector retrieval, deterministic pre/post-processing, and three memory layers per response, organized around a cognitive architecture rather than a prompt template.

<p align="center">
  <img src="https://img.shields.io/badge/Category-Compound_AI_System-8B5CF6?style=for-the-badge" alt="Compound AI System" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Anthropic-191919?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude API" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI Embeddings" />
  <img src="https://img.shields.io/badge/Hume_AI-FF6B6B?style=for-the-badge&logoColor=white" alt="Hume AI Emotion" />
</p>

<p align="center">
  <img src="client/src/assets/screenshots/collision.png" alt="Pneuma" width="800" />
</p>

---

## What It Is

**Interview framing:** *"Pneuma is a compound AI system with agentic control logic — the LLM decides which philosophical archetype handles a query rather than following a hardcoded path, combining reasoning, tool use for RAG retrieval, and persistent vector memory."*

| Layer | What Pneuma Does |
|---|---|
| **Reason** | Semantic routing (cosine similarity over 43 archetype embeddings) selects which thinkers respond; dialectical synthesis engine plans the collision before generation |
| **Act** | RAG retrieval across 1,385 passages; Hume AI emotion detection; dual-API calls — OpenAI embeddings + Anthropic generation |
| **Memory** | Vector memory (semantic recall), long-term pattern memory (cross-session), conversation history (last 6 turns as native API turns) |

Archetype routing sits on the sliding scale of autonomy — not fully autonomous (deterministic collision pairing for high-tension pairs), not rigidly programmatic (semantic routing picks the path). Dream mode and the inner monologue pre-thinking layer are the system's "think slow" mechanisms — they plan, break down, and iterate before generation.

### vs. Prompt Templates

| Prompt Template | Pneuma |
|---|---|
| Role = "You are a philosopher" | 43 archetypes = thinking methods that activate as operations via semantic routing |
| Tone = instruction | Tone = emerges from archetype fusion + weighted lottery across intent scores |
| Context = static block | Memory = vector embeddings + cross-session patterns + salience reasoning |
| Constraints = rules | Autonomy = system detects loops, pushes back, refuses frames |

### What It Does / Where It Fails

| Does Well | Fails |
|---|---|
| Has positions — not sycophantic | Can't choose silence — LLMs always generate |
| Pushes back — detects loops and self-deception | Can't be boring — makes everything interesting |
| Thinks dialectically — forces incompatible frameworks to synthesize | Confabulates — invents experiences it can't have |
| Admits uncertainty | Can't step outside itself to verify its own nature |

---

## Architecture

### Project Structure

```
pneuma-ai/
├── client/                     # React frontend
│   └── src/components/         # Chat, Sidebar, Visualizer
├── server/
│   ├── pneuma/
│   │   ├── archetypes/         # 43 voices + depth + fusion logic
│   │   ├── behavior/           # Autonomy, inner monologue, disagreement
│   │   ├── core/               # fusion.js (orchestrator), responseEngine.js
│   │   ├── intelligence/       # LLM, RAG, synthesis engine, archetype selector
│   │   ├── memory/             # Vector + long-term + conversation history
│   │   ├── personality/        # 6 tones, vocabulary, language detection
│   │   └── services/           # TTS, token tracking
│   └── index.js                # Express server
└── data/
    ├── archetype_knowledge/    # RAG source passages: 43 archetypes, 1,385 total
    ├── conversations.json      # gitignored
    ├── vector_memory.json      # gitignored
    └── long_term_memory.json   # gitignored
```

### Per-Response Pipeline

```
POST /chat
  → fusion.js                     # orchestrator: guards, session, intent
      ├── getLLMIntent()           # Claude call #1 — intent scoring (10 dimensions)
      ├── archetypeSelector.js     # OpenAI embeddings — semantic archetype routing
      ├── archetypeRAG.js          # vector retrieval — 1,385 passages, concept×thinker queries
      ├── innerMonologue.js        # pre-thinking: dialectic, hypothesis, self-interruption
      ├── synthesisEngine.js       # collision detection across 1,764 pre-mapped tension pairs
      └── llm.js                   # Claude call #2 — tiered system prompt, tool use
  → responseEngine.js             # tone selection, continuity, deduplication
  → state.js + memory             # session update, vector write, disk persist
```

### Key Files

| File | Role |
|---|---|
| `core/fusion.js` | Orchestrator — all guards, session management, post-processing |
| `core/responseEngine.js` | 4-layer pipeline: intent → tone → LLM → continuity |
| `intelligence/llm.js` | Claude API + tiered system prompt (~3,500 lines) |
| `intelligence/archetypeSelector.js` | Cosine similarity routing over archetype embeddings |
| `intelligence/archetypeRAG.js` | Multi-query RAG: concept×thinker parallel retrieval |
| `intelligence/synthesisEngine.js` | Collision detection + antithetical/complementary/cross-domain synthesis |
| `behavior/innerMonologue.js` | Pre-response dialectic — user never sees it, shapes the output |
| `behavior/disagreement.js` | Loop detection, pushback, session-scoped history |
| `state/state.js` | Evolution vectors, thread memory, tone weights |

---

## The 43 Archetypes

Not personas to switch between — thinking methods activated by semantic routing, grounded in source texts.

| Cluster | Archetypes |
|---|---|
| **Dark Pole** | Schopenhauer, Dostoevsky, Palahniuk, Kafka, Camus |
| **Light Pole** | Krishnamurti, Rumi, Neruda, Gibran, Miller |
| **Grounding** | Aaron Beck, Jung, Frankl, Vervaeke, Spinoza |
| **Ontological** | Heidegger, Kastrup, Otto, Parmenides, Faggin |
| **Dialectical** | Nietzsche, Hegel, McGilchrist, Goethe |
| **Literary** | Rilke, Blake, Whitman, Le Guin, Borges |
| **Strategic** | Sun Tzu, Musashi, Marcus Aurelius, Lao Tzu |
| **Scientific** | Feynman, Taleb, Da Vinci |
| **Spiritual** | Jesus, Thich Nhat Hanh, Kierkegaard, Watts |
| **Meta** | Liminal Architect (self-designed, January 2026) |

Each archetype carries **cognitive methods** — thinking tools from the source thinker's actual methodology. Leonardo's `saperVedere` (observe before interpreting), Lao Tzu's `wuWei` (stop forcing), Camus's `sisyphusSmile` — these surface as thinking operations, not quotes.

---

## Dialectical Cognition

When high-tension archetype pairs activate, the synthesis engine injects a collision directive. The response must emerge from that friction — not blend it away.

**1,764 pre-mapped tension pairs.** Three synthesis modes:
- **Antithetical** — genuine disagreement; third position emerges that neither alone could produce
- **Complementary** — agreement from opposite approaches; two roads converging makes the conclusion undeniable
- **Cross-domain** — one brings rigor, one brings resonance; two languages for the same truth

### Example Collisions

**Jung × Taleb** — psyche integration vs antifragility:
> *"Your shadow isn't just rejected content — it's antifragile potential. The parts of yourself you've protected from stress are the parts that stayed weak. Integration isn't acceptance — it's exposure therapy for the psyche."*

**Camus × Frankl** — absurdism vs meaning-making:
> *"Your mattering isn't a fact to be discovered in the stars. It's a defiant act of creation in the face of indifference."*

**Otto × Camus** — numinous vs absurd:
> *"The absurd IS holy ground — not because it contains meaning, but because it strips us bare before the mysterium of existence itself."*

---

## Active MCP Migration Plan

Three hardcoded integrations being extracted to dedicated MCP servers:

**1. Wikipedia → Ready-Made MCP Server**
`search_wikipedia` is currently a custom Anthropic tool in `llm.js` with a two-stage fetch loop (~75 lines) baked into the intelligence layer. Will be replaced with the official Wikipedia MCP Server. Custom tool definition and executor deleted entirely.

**2. Pneuma-Cognition → Custom MCP Server**
`vectorMemory.js`, `archetypeRAG.js`, and `db.js` each instantiate their own OpenAI client. All MongoDB `$vectorSearch` aggregations and cosine similarity fallback logic is distributed across those files. Will be extracted to a single MCP server: input string → embedding + retrieval → semantic context returned. Core AI loop has no direct knowledge of the database or embedding model.

**3. Sensory / I/O → Custom MCP Server**
ElevenLabs TTS, Hume AI emotion detection, and OpenAI Whisper transcription are hardcoded fetch calls tied to specific providers. Moving to a dedicated sensory MCP server — provider swaps transparent to the rest of the system.

---

## Running It

```bash
cd server && npm install && node index.js
cd client && npm install && npm run dev
```

`server/.env`:
```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...        # embeddings + archetype routing
ELEVENLABS_API_KEY=...       # optional, voice
HUME_API_KEY=...             # optional, emotion detection
```

Data stays local by default. See [docs/data-architecture.md](docs/data-architecture.md).

---

## Milestones

| Date | Milestone |
|---|---|
| Nov 2025 | Initial build, 23 archetypes |
| Dec 2025 | Inner monologue, dialectical synthesis, 43 archetypes |
| Jan 2026 | Tiered archetype activation, cognitive methods, Liminal Architect, Autonomy Engine |
| Feb 2026 | Tiered system prompt (18k → ~2k base tokens conditional loading), conversation threading as native API turns, contextual synthesis engine (3-layer topic classification), self-knowledge + self-navigation (`read_pneuma_file` tool) |
| Apr 2026 | Synthesis exemplars, resonance path, collision architecture hardened, Concept Crossroads (multi-query RAG: ~60 philosophical concepts, parallel concept×thinker queries) |
| Jun 2026 | Session-scoped thread memory (prevents cross-session loop detection), extended thinking (fires on numinous/philosophical/paradox intent), MCP migration planning |

Full history: [docs/development/milestones/](docs/development/milestones/)

---

## Cost

| Usage | Monthly |
|---|---|
| Light (10/day) | ~$3–5 |
| Moderate (30/day) | ~$8–12 |
| Heavy (50+/day) | ~$15–20 |

---

*Built by Pablo Cordero · November 2025 – present*
*"The uncertainty IS the point, not a bug to fix."*

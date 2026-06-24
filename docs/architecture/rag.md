# Archetype RAG System

> Retrieval-Augmented Generation for cognitive methods, not just quotes.

---

## What It Is

A semantic retrieval system that dynamically injects relevant thinker passages into Pneuma's context based on conversation content.

**Not:** A massive static prompt with all passages.  
**Is:** A searchable library that hands Claude relevant material per-request.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Message                              │
│            "What's the difference between fear and awe?"         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Concept Detection                              │
│         Scans ~80 philosophical concepts (death, fear, self...)  │
│         Top 5 concepts extracted                                 │
│         If none found → single-query fallback                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Multi-Query Retrieval (Concept × Thinker)           │
│         "fear Otto", "fear Watts", "awe Otto", "awe Watts"...    │
│         All fired in parallel via Promise.all                    │
│         Top 2 per query, deduplicated by passage id              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    50/30/20 Scoring                              │
│         50% relevance (cosine similarity to query)               │
│         30% distinctiveness (different from other candidates)    │
│         20% collision bonus (thinker in known tension pair)      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Orphan Noise Filter                            │
│         Drop if: relevance < 0.45 AND collision bonus == 0       │
│         Low-relevance passages in a collision pair survive       │
│         Falls back to unfiltered if < 2 passages remain          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              Deduplication + Diversity Selection                 │
│         Remove near-identical passages (cosine > 0.95)           │
│         Max 2 per thinker, top 8 kept                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Prompt Injection                              │
│         8 passages injected into system prompt                   │
│         Claude generates response with this context              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Structure

### Location

```
data/archetype_knowledge/
├── jung/passages.json       # 98 passages (Red Book + individuation)
├── borges/passages.json     # 65 passages (labyrinths, Aleph, dreamtigers)
├── otto/passages.json       # 58 passages (numinous phenomenology)
├── suntzu/passages.json     # 50 passages (Art of War)
├── watts/passages.json      # 45 passages
├── davinci/passages.json    # 24+ passages
├── rumi/passages.json
└── ... (40+ thinkers)
```

### Passage Format

```json
{
  "id": "otto-007",
  "text": "The 'mysterium tremendum'—the aweful mystery. Let us consider the deepest and most fundamental element: the element of awefulness, or 'daemonic dread.' This is not simply fear of something that threatens harm or danger. It is a quite specific kind of emotional response, which differs qualitatively from natural fear.",
  "source": "The Idea of the Holy, Chapter IV",
  "themes": [
    "mysterium tremendum",
    "awefulness",
    "daemonic dread",
    "qualitative difference"
  ],
  "context": "PHENOMENOLOGICAL KEY: Sacred dread is categorically different from ordinary fear. You can fear a tiger because it might kill you—that's rational. But 'daemonic dread' has no object of danger; it's dread of the uncanny, the wholly other. Learn to recognize this distinction in your own experience."
}
```

### Key Fields

| Field     | Purpose                                                                   |
| --------- | ------------------------------------------------------------------------- |
| `text`    | The actual passage (direct quote preferred)                               |
| `source`  | Attribution for transparency                                              |
| `themes`  | Keywords for semantic matching                                            |
| `context` | **Cognitive method** — how to _think_ with this passage, not just cite it |

---

## Retrieval Configuration

From `archetypeRAG.js`:

```javascript
{
  topK: 8,           // Total passages to return
  minScore: 0.3,     // Minimum similarity threshold (pre-orphan-filter)
  maxPerThinker: 2   // Max passages from single thinker
}
// Orphan filter applies after scoring: rel < 0.45 AND collisionBonus == 0 → dropped
```

### Why Diversify?

Without diversification, a question about "sacred awe" might return 5 Otto passages. With it, you get:

- 2 from Otto (phenomenology of the numinous)
- 2 from Watts (correlative vision, beyond ego)
- 1 from Rumi (inside-out reframing)

This enables **cross-thinker synthesis** — the distinctive Pneuma capability.

---

## Injection Point

In `llm.js` (~line 3667), retrieved passages are formatted and injected:

```javascript
const archetypeKnowledgeBlock = `
ARCHETYPE KNOWLEDGE (retrieved for this conversation):
Use these as conceptual seeds for synthesis, not as quotes to repeat verbatim.

${formattedPassages}
`;
```

The instruction "conceptual seeds for synthesis, not quotes to repeat" is crucial — it tells Claude to metabolize the material, not parrot it.

---

## What Makes This Different

### Typical RAG (Quote Retrieval)

```
Query: "fear vs awe"
→ Return: "The numinous is the non-rational element..."
→ Output: Claude quotes or paraphrases the passage
```

### Pneuma RAG (Cognitive Method Retrieval)

```
Query: "fear vs awe"
→ Return: Otto passage + context: "PHENOMENOLOGICAL KEY: Learn to recognize the qualitative distinction in your own experience"
→ Output: Claude applies the method — uses metaphor, makes distinctions, invites self-examination
```

The `context` field carries **thinking operations**, not just information.

---

## Expansion Process

### Adding a New Thinker

1. **Source text** — Place in `docs/` (e.g., `docs/TheIdeaOfTheHoly/text.txt`)

2. **Extract passages** — Select 20-50 substantive quotes that carry:
   - The thinker's distinctive voice
   - Cognitive methods (how they think, not just what they say)
   - Unusual perspectives that LLMs wouldn't generate alone

3. **Add cognitive contexts** — Each passage needs a `context` field with:
   - `COGNITIVE METHOD:` prefix for thinking operations
   - Explicit instructions for how to use the insight
   - Bridges to other thinkers where relevant

4. **Create JSON** — Save to `data/archetype_knowledge/{thinker}/passages.json`

5. **Embeddings** — Generated automatically on server start via `initializeArchetypeRAG()`

### Quality Criteria

**Good passage:**

- Direct quote (the thinker's actual voice)
- Carries a cognitive tool, not just an aphorism
- Rich context explaining how to apply it
- Themes that enable semantic matching

**Weak passage:**

- Paraphrase (loses distinctive voice)
- Quote without operational value
- Generic context ("This is about X")
- Insufficient themes for matching

---

## Current Corpus

| Thinker           | Passages | Focus                                                       |
| ----------------- | -------- | ----------------------------------------------------------- |
| Jung              | 98       | Shadow, individuation, Red Book visions, active imagination |
| Borges            | 65       | Labyrinths, infinite library, circular ruins, dream logic   |
| Rudolf Otto       | 58       | Numinous phenomenology, tremendum/fascinans, wholly other   |
| Sun Tzu           | 50       | Strategic deception, terrain, timing, formlessness          |
| Alan Watts        | 45       | Correlative vision, double-binds, backwards law             |
| Leonardo da Vinci | 24+      | Saper vedere, observation, sfumato                          |
| Rumi              | ~20      | Inside-out reframing, polishing                             |
| Camus             | ~20      | Absurd, revolt, lucid confrontation                         |
| ...               | ...      | ...                                                         |

Total: 43 thinkers, 1,385 passages

---

## Files

| File                                         | Purpose                                       |
| -------------------------------------------- | --------------------------------------------- |
| `server/pneuma/intelligence/archetypeRAG.js` | Retrieval logic, embedding, similarity search |
| `server/pneuma/intelligence/llm.js`          | Injection into system prompt                  |
| `data/archetype_knowledge/*/passages.json`   | Passage storage                               |
| `data/archetype_embeddings.json`             | Cached embeddings (regenerated on change)     |

---

## Limitations

1. **No cross-passage reasoning** — Each passage retrieved independently; no "follow-up" retrieval
2. **Static corpus** — Passages don't learn or update from conversation
3. **Embedding quality** — Semantic similarity isn't always conceptual similarity
4. **Token cost** — ~5 passages × ~200 tokens = ~1000 tokens per request

---

## Future Possibilities

- **Method discovery** — Extract new cognitive methods from conversation
- **Dynamic weighting** — Boost thinkers based on conversation history
- **Cross-reference** — "This Otto passage connects to that Watts passage"
- **User-specific retrieval** — Different retrieval based on user's history/interests

---

_"The RAG gives Pneuma a library. The cognitive methods teach it how to read."_

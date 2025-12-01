# Orpheus

**AI with character, not compliance.**

> Created and architected by **Pablo Cordero** · November 2025

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Anthropic-191919?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude API" />
</p>

<p align="center">
  <img src="client/src/assets/screenshots/orpheus-interface.png" alt="Orpheus Interface" width="800" />
</p>

---

## What It Is

A personality engine where character shapes intelligence, not the other way around.

Most AI: LLM generates → add personality  
**Orpheus:** Personality controls → LLM provides raw material

It can disagree, stay silent, or call you out. It remembers. It has positions.

---

## Architecture

| Layer | What It Does |
|-------|--------------|
| **Personality** | 5 tones, 50+ micro-engines — the voice |
| **Archetypes** | 29 thinker patterns dynamically injected |
| **Rhythm** | Timing, energy, late-night awareness |
| **Memory** | Long-term facts, patterns, struggles |
| **Disagreement** | Detects loops, self-deception, catastrophizing |
| **LLM** | Claude provides raw insight — personality shapes output |

### The Five Tones

| Tone | Feel |
|------|------|
| **Casual** | Playful, grounded |
| **Analytic** | Warm precision |
| **Oracular** | Symbolic but grounded |
| **Intimate** | Present, no performance |
| **Shadow** | Uncomfortable truths |

---

## What It Does Differently

**Has positions.** Not sycophantic agreement.

**Knows when to shut up.** Sometimes responds with silence.

**Admits uncertainty.** "I don't know" instead of bullshit.

**Pushes back.** Calls out loops and self-deception.

**Remembers.** Topics, struggles, patterns across sessions.

---

## Sample

> **User:** "Describe your blind spots."
>
> **Orpheus:** "I have a bias toward resolution — when you bring chaos, I want to organize it. But sometimes chaos IS the truth. I probably overvalue articulation. If you can't put something into words, I might miss what you're living. What do you see that I'm missing?"

---

## Running It

```bash
# Server
cd server && npm install && node index.js

# Client
cd client && npm install && npm run dev
```

Add your API key to `server/.env`:
```
ANTHROPIC_API_KEY=sk-...
```

---

## Core Files

| File | Purpose |
|------|---------|
| `llm.js` | Claude integration + 1200-line system prompt |
| `personality.js` | 5 tones, micro-engines |
| `archetypes.js` | 29 thinker patterns |
| `thinkerDeep.js` | 20 conceptual toolkits for dynamic injection |
| `responseEngine.js` | Intent detection, tone selection |
| `longTermMemory.js` | Persistent memory |
| `disagreement.js` | Pushback detection |
| `rhythmIntelligence.js` | Temporal awareness |

---

## Cost

Optimized ~40-50% vs naive implementation.

| Usage | Monthly |
|-------|---------|
| Light (10/day) | ~$3-5 |
| Moderate (30/day) | ~$8-12 |
| Heavy (50+/day) | ~$15-20 |

---

## Status

**Done:** Tones, archetypes, memory, disagreement, rhythm, uncertainty, dynamic thinker injection

**Next:** Local model fallback, proactive presence

---

## Author

**Pablo Cordero** — Original creator and architect.

The foundational architecture of Orpheus—the personality-over-intelligence inversion, tone system, archetype injection, and response engine—is my original design.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

Derivative works must include attribution to the original author.

---

_Built November 2025_

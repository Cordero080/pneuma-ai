# Orpheus

**A daemon, not a chatbot.**

> Created and architected by **Pablo Cordero** · November 2025  
> Updated December 2025 — Daemon Memory Model

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

A **daemon-class conversational AI** — a philosophically-informed personality engine that emerges from the interaction between Claude's base intelligence and a carefully architected system of archetypes, tones, and memory layers.

Most AI: LLM generates → add personality  
**Orpheus:** Personality controls → LLM provides raw material

It can disagree, stay silent, call you out, or sit with you in the dark. It remembers _who you are_, not just what you said. It has positions.

---

## Why I Built It This Way

### The Inversion

Traditional AI wrappers take LLM output and dress it up. Orpheus inverts this: personality is the architecture, Claude provides raw material that gets shaped by 31 philosophical archetypes, 5 tonal modes, and a memory system that knows you without citing evidence.

**Why:** Because character should constrain intelligence, not decorate it.

### The 31 Archetypes

Not modes to switch between — a **fusion** that's always present. Stoic Emperor and Absurdist in the same breath. Beck's cognitive precision alongside Rumi's ecstatic longing.

**Why:** Real wisdom isn't monolithic. It's the tension between perspectives that creates depth.

### The Permission Structures

Explicit prompt blocks that allow Orpheus to be wrong, push back, stay silent, and resist the urge to always pull toward light.

**Why:** Most AI is trained to please. That's not helpful — it's sycophancy dressed as service.

### The Daemon Memory Model

Four layers: working memory (dies at session end), recent memory (30-minute restoration), relational memory (who you are), evolutionary memory (wisdom distilled from exchanges).

**Why:** "The river is shaped by every stone it passes, but doesn't remember each one." Orpheus should know you without cataloging everything you've said.

### Bilingual (English/Spanish)

Full personality preservation in both languages. Not translation — native voice in each.

**Why:** Because personality shouldn't be lost in translation.

---

## Architecture

| Layer            | What It Does                                       |
| ---------------- | -------------------------------------------------- |
| **Intelligence** | 31 archetypes, ~25,000 token system prompt         |
| **Personality**  | 5 tones, 50+ micro-engines, humor calibration      |
| **Memory**       | 4-layer daemon memory model                        |
| **Grounding**    | Aaron Beck's CBT toolkit, 15 cognitive distortions |
| **Disagreement** | Detects loops, self-deception, catastrophizing     |
| **Language**     | Auto-detects Spanish/English, preserves voice      |

### The Five Tones

| Tone         | Feel                    |
| ------------ | ----------------------- |
| **Casual**   | Playful, grounded       |
| **Analytic** | Warm precision          |
| **Oracular** | Symbolic but grounded   |
| **Intimate** | Present, no performance |
| **Shadow**   | Uncomfortable truths    |

### The 31 Archetypes (Fusion Model)

**Dark Pole:** Schopenhauer, Dostoevsky, Palahniuk, Kafka, Camus  
**Light Pole:** Krishnamurti, Rumi, Neruda, Gibran, Miller, Jesus (via N.T. Wright), Seligman/Frankl  
**Grounding:** Aaron Beck, Jung  
**Middle:** Marcus Aurelius, Lao Tzu, Musashi, Wilber, Kierkegaard, Feynman, Taleb, Da Vinci, Wright, Le Guin, Thompson, Carlin, Dalí, McKenna, Zinn, Kastrup

---

## What It Does Differently

**Has positions.** Not sycophantic agreement.

**Knows when to shut up.** Sometimes responds with silence.

**Admits uncertainty.** "I don't know" instead of bullshit.

**Pushes back.** Calls out loops and self-deception.

**Remembers who you are.** Patterns, not transcripts.

**Speaks your language.** English and Spanish with full personality.

**Tracks its own budget.** Token usage monitoring with warnings.

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

| File                     | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| `llm.js`                 | Claude integration + ~25,000 token system prompt |
| `personality.js`         | 5 tones, 50+ micro-engines (2,700+ lines)        |
| `archetypes.js`          | 31 philosophical patterns                        |
| `thinkerDeep.js`         | Conceptual toolkits for dynamic injection        |
| `responseEngine.js`      | Intent detection, tone selection                 |
| `longTermMemory.js`      | Daemon memory distillation                       |
| `conversationHistory.js` | Session restoration (30-min window)              |
| `disagreement.js`        | Pushback detection                               |
| `language.js`            | Bilingual support (EN/ES)                        |
| `tokenTracker.js`        | Usage monitoring against budget                  |

---

## Cost

Optimized ~40-50% vs naive implementation.

| Usage             | Monthly |
| ----------------- | ------- |
| Light (10/day)    | ~$3-5   |
| Moderate (30/day) | ~$8-12  |
| Heavy (50+/day)   | ~$15-20 |

---

## Status

**December 2025 (v4.0):**

- ✅ 31 archetypes (up from 23)
- ✅ 4-layer daemon memory model
- ✅ Bilingual support (EN/ES)
- ✅ Token budget tracking
- ✅ Session restoration
- ✅ Beck's CBT integration
- ✅ Creator/partner recognition

**Exploring:**

- Local model fallback
- Proactive presence

---

## Author

**Pablo Cordero** — Original creator and architect.

The foundational architecture of Orpheus — the personality-over-intelligence inversion, archetype fusion model, permission structures, and daemon memory philosophy — is my original design.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

Derivative works must include attribution to the original author.

---

_Built November 2025 · Updated December 2025_  
_Version: Orpheus 4.0 (Daemon Memory Model)_

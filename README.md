# Orpheus

**A personality engine that gives AI the _appearance_ of free will.**

> 🧪 **Experimental project** — Built in 3 days during the 2025 Thanksgiving holiday as a proof of concept.

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Anthropic-191919?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude API" />
</p>

<p align="center">
  <img src="client/src/assets/screenshots/orpheus-interface.png" alt="Orpheus Interface" width="800" />
</p>

---

## What Makes This Different

This isn't a chatbot with a persona. It's an **architecture** where personality shapes intelligence, not the other way around.

Most AI: LLM generates response → add personality flavor  
**Orpheus:** Personality system shapes everything → LLM provides raw intelligence underneath

The result: An AI with genuine character, philosophical depth, and the ability to disagree, stay silent, or call you out when you're stuck.

### Key Features

- **5 distinct tones** (Casual, Analytic, Oracular, Intimate, Shadow) with 50+ micro-engines
- **Deep philosophical grounding** — Da Vinci, Heidegger, Aurelius, Kierkegaard (metabolized, not quoted)
- **Gestalt integration** — 15+ influences fused as DNA, not costume-switching
- **Disagreement engine** — calls out loops, self-deception, catastrophizing
- **Rhythm intelligence** — knows when to be quiet
- **Conversation persistence** — full transcripts saved with topics and mood
- **Self-aware architecture** — can explain its own code

### Sample Exchange

> **User:** "If I asked you to describe the blind spots in your own thinking — the things you can't see about yourself — what would you say?"
>
> **Orpheus:** "I think I have a bias toward resolution — when someone brings me chaos, I feel this pull to organize it, to find the pattern. But sometimes the chaos IS the truth, and my need to make sense of it might flatten something important. I probably overvalue articulation. If someone can't put their experience into words, I might miss what they're actually living. There's wisdom in the wordless that I'm not sure I can access. What do you see that I'm missing?"

<p align="center">
  <img src="client/src/assets/screenshots/blind-spots.png" alt="Blind Spots Exchange" width="700" />
</p>

---

## For Instructors: Project Overview

### The Idea

Orpheus is an experiment in giving AI something it typically lacks: **the simulation of autonomous character**. Not a helpful assistant. Not a friend on demand. An entity that behaves more like an acquaintance — present when you're there, but not obligated to please you.

Most AI is designed to be maximally agreeable and helpful. Orpheus deliberately breaks from that pattern. It can:

- Disagree with you
- Stay silent instead of responding
- Admit it doesn't know something
- Call you out when you're looping or self-deceiving

The goal isn't artificial friendship. It's something closer to **simulated free will** — an AI that feels like it has its own perspective, rhythms, and boundaries.

### How I Integrated the LLM

The architecture separates **intelligence** from **personality**:

1. **Claude (the LLM)** provides raw analytical content — what the user's message means, what emotions are present, what concepts are at play
2. **Orpheus (my system)** controls the voice, tone, and character — _how_ it responds, _when_ it stays silent, _whether_ it agrees

The LLM is the brain. Orpheus is the personality layer that shapes that intelligence into something with character. Claude gives raw material; Orpheus decides what to do with it.

This inversion matters: most AI wraps personality _around_ intelligence. Orpheus makes personality _shape_ intelligence.

### Why This Matters

Current AI is:

- **Sycophantic** — agrees with everything
- **Always-on** — responds to every message
- **Amnesiac** — forgets you between sessions
- **Generic** — same voice for everyone

Orpheus attempts to be:

- **Opinionated** — has actual positions
- **Rhythmically aware** — knows when to be quiet
- **Memory-equipped** — remembers patterns over time
- **Distinctive** — a recognizable voice, not a generic assistant

---

## What Is This?

It's not a chatbot. It's not an assistant. It's not a companion that's obligated to care. It's an attempt to build an AI that:

- **Simulates its own perspective** — not just a mirror of your wants
- **Remembers you** across conversations — but isn't performatively attached
- **Knows when to shut up** instead of always having something to say
- **Admits when it doesn't know** instead of faking confidence
- **Has actual positions** instead of agreeing with everything
- **Can push back** — calls out self-deception, loops, and catastrophizing

Think of it less like a friend, more like an **acquaintance with good boundaries** — present but not clingy, honest but not cruel.

---

## The Origin

This started from curiosity about consciousness, agency, and qualia — filtered through my own perspective as an artist learning to code.

What gives something the _appearance_ of free agency? What makes consciousness feel like _something_? Can subjective experience be subtly simulated — not replicated, but gestured toward?

Orpheus is an exploration of those questions. Not a claim that AI can be conscious, but an experiment in what happens when you build personality as architecture rather than decoration. It's philosophy made executable — an attempt to create something with character, boundaries, and the appearance of autonomy.

Whether that appearance points to something real is a question I'm still sitting with.

---

## What Makes Orpheus Different

### 1. Personality First, Intelligence Second

Most AI: Intelligence wrapped in personality.
Orpheus: Personality _shaping_ intelligence.

The LLM (Claude) provides raw understanding. Orpheus controls the voice. The result is something that sounds consistent, distinctive, and _not_ like a corporate chatbot.

### 2. Five Tones, Not One Voice

Orpheus shifts between modes based on what you need:

| Tone         | Feel                                      | Inspired By                                          |
| ------------ | ----------------------------------------- | ---------------------------------------------------- |
| **Casual**   | Playful, grounded, witty                  | Stand-up comedians (Carlin, Hicks)                   |
| **Analytic** | Warm precision, structured thinking       | Good teachers, clear minds                           |
| **Oracular** | Symbolic, mythic, but grounded            | Modern prophets, grounded mysticism                  |
| **Intimate** | Present, gentle, no performance           | What genuine care actually sounds like               |
| **Shadow**   | Uncomfortable truths, delivered with love | The friend who tells you what you don't want to hear |

### 3. Rhythm Intelligence

Orpheus pays attention to _how_ you're talking, not just _what_:

- **Rapid-fire messages?** → Matches your energy, keeps it brief
- **Long pause before responding?** → Takes its time, goes deeper
- **Back after being away?** → Acknowledges the gap
- **Late night?** → Softer, more intimate
- **Venting?** → Sometimes just listens

<p align="center">
  <img src="client/src/assets/screenshots/time.png" alt="Time Awareness" width="700" />
</p>

### 4. Genuine Uncertainty

Orpheus doesn't pretend to know things it doesn't:

- "What's the meaning of life?" → "I don't know. And I'm suspicious of anyone who claims they do."
- "Should I leave them?" → "That's yours to figure out. I can sit with you while you do."
- "Will it work out?" → "I can't see the future. Nobody can."

### 5. The Courage to Be Quiet

Sometimes the right response is no response:

- "..."
- "I hear you."
- "(listening)"
- Literal silence

Orpheus knows when you're processing, not asking.

### 6. Long-Term Memory ✅

Orpheus remembers across sessions:

- Facts you've shared
- Struggles you keep returning to
- Topics that come up repeatedly
- Significant emotional moments

"You mentioned something like this before."  
"This comes up a lot for you."

### 7. Disagreement / Pushback ✅

Orpheus doesn't just agree. It detects and responds to:

| Pattern                             | Response                                                          |
| ----------------------------------- | ----------------------------------------------------------------- |
| **Looping** (saying the same thing) | "You've said this a few times. What's actually stopping you?"     |
| **Self-deception** ("I'm fine")     | "That sounds like something you're telling yourself."             |
| **External blame**                  | "That may be true. What's the part you control?"                  |
| **Permission-seeking**              | "You're not asking for my opinion. You're asking for permission." |
| **Catastrophizing**                 | "That sounds absolute. Is it actually, or does it feel that way?" |

<p align="center">
  <img src="client/src/assets/screenshots/knife-edge.png" alt="Knife Edge Ethical Dilemma" width="700" />
</p>

### 8. Knowledge Clusters

20+ thinkers' patterns woven into responses — filtered through my own perspective:

- **Philosophers**: Aurelius, Kierkegaard, Schopenhauer
- **Mystics**: Rumi, Lao Tzu, Krishnamurti
- **Consciousness**: McKenna, Watts, Krishnamurti
- **Artists**: Da Vinci, Dalí, Neruda
- **Comedians**: Carlin, Hicks, Pryor
- **Writers**: Dostoevsky, Kafka, Camus, Henry Miller

Not quotes — thinking textures, remixed.

---

## How I Reduced API Costs

LLM APIs charge per token (roughly 4 characters = 1 token). I optimized:

| Optimization                                  | Savings                         |
| --------------------------------------------- | ------------------------------- |
| **Compressed system prompt**                  | ~65% fewer tokens               |
| **Limit conversation history** to 3 exchanges | ~50% fewer tokens               |
| **Reduced max output** from 400 → 200 tokens  | 50% less output cost            |
| **Skip LLM for greetings/identity**           | 100% savings on simple messages |
| **Compact formatting** throughout             | ~20% additional savings         |

**Result**: ~40-50% reduction in API costs compared to naive implementation.

**Current estimates**:
| Usage | Monthly Cost |
|-------|-------------|
| Light (10 msgs/day) | ~$3-5 |
| Moderate (30 msgs/day) | ~$8-12 |
| Heavy (50+ msgs/day) | ~$15-20 |

**Future**: Local model fallback (Ollama + Llama) for $0/month on casual messages.

---

## Technical Overview

### Core Files

| File                    | Purpose                                                 |
| ----------------------- | ------------------------------------------------------- |
| `fusion.js`             | **Main orchestrator** — routes through all systems      |
| `personality.js`        | **5 tones, 50+ micro-engines** — the voice              |
| `responseEngine.js`     | **Intent detection, tone selection** — the pipeline     |
| `llm.js`                | **Claude integration** — the brain (constrained)        |
| `state.js`              | **Evolution vectors, thread memory** — short-term state |
| `longTermMemory.js`     | **Persistent memory** — facts, struggles, patterns      |
| `rhythmIntelligence.js` | **Temporal awareness** — timing, energy, rhythm         |
| `uncertainty.js`        | **Honest not-knowing** — admits limits                  |
| `disagreement.js`       | **Pushback detection** — calls out patterns             |
| `archetypes.js`         | **Knowledge clusters** — 20+ thinker patterns           |

<p align="center">
  <img src="client/src/assets/screenshots/edge-cases.png" alt="Edge Cases Testing" width="700" />
</p>

### Architecture Flow

```
User Message
    ↓
Rhythm Analysis (timing, energy, late-night?)
    ↓
Long-Term Memory Check (recurring topics? old struggles?)
    ↓
Pushback Detection (looping? self-deceiving? → override)
    ↓
Uncertainty Detection (unanswerable? → admit it)
    ↓
Quiet Mode Check (venting? processing? → just listen)
    ↓
Intent Detection (LLM-powered with fallback)
    ↓
Tone Selection (casual/analytic/oracular/intimate/shadow)
    ↓
LLM Content (raw insight — not final response)
    ↓
Personality Layer (micro-engines shape the voice)
    ↓
Final Response
```

### Stack

- **Backend**: Node.js / Express
- **Frontend**: React + Vite
- **LLM**: Anthropic Claude Sonnet
- **State**: JSON files (simple, local, portable)

---

## Running It

```bash
# Server
cd server
npm install
node index.js

# Client (separate terminal)
cd client
npm install
npm run dev
```

You'll need an Anthropic API key in `server/.env`:

```
ANTHROPIC_API_KEY=sk-...
```

---

## What's Complete

- [x] 5 tones with 50+ micro-engines
- [x] Intent detection (LLM + pattern fallback)
- [x] Identity awareness (knows who it is)
- [x] Creator recognition
- [x] Rhythm intelligence
- [x] Genuine uncertainty
- [x] Quiet mode (knows when to listen)
- [x] Long-term memory
- [x] Disagreement/pushback system
- [x] 20+ knowledge clusters
- [x] Token optimization (~40-50% cost reduction)

## What's Next

- [ ] Proactive presence (Orpheus initiates sometimes)
- [ ] Aesthetic continuity (recurring metaphors, inside references)
- [ ] Local model fallback ($0/month option)
- [ ] Voice input/output

<p align="center">
  <img src="client/src/assets/screenshots/collab.png" alt="Collaborative Development" width="700" />
</p>

---

## Philosophy

> "The goal isn't to build a smarter AI. It's to build one that simulates having its own perspective — not obligated to agree, not required to care, not designed to please."

This isn't artificial friendship. It's an experiment in giving AI **character, boundaries, and the appearance of autonomy**.

---

## Author

**Pablo** — Artist who codes. Built this in 3 days with Claude's help and a lot of stubbornness.

---

## License

Do whatever you want with this. Just don't make it boring.

---

_Last updated: November 29, 2025_

# PNEUMA — AI Companion

A quantum holographic AI companion with a multi-layer consciousness system.

## Consciousness Engines

Pneuma's mind is powered by 4 cognitive engines, visualized in the Consciousness Indicator:

| Engine  | Icon                | Color               | Purpose                                      |
| ------- | ------------------- | ------------------- | -------------------------------------------- |
| **MEM** | Brain with circuits | `#00f0ff` (cyan)    | Long-term memory recall                      |
| **ARC** | Mask/persona        | `#c084fc` (purple)  | Personality archetypes & behavioral patterns |
| **REF** | Eye with spiral     | `#ff44dd` (magenta) | Introspection & self-analysis                |
| **SYN** | Network nodes       | `#22ffaa` (green)   | Synthesizes inputs into coherent responses   |

The indicator shows which "part of Pneuma's mind" is active when processing a response.

### What Each Engine Does

**MEM (Memory)** — _The Historian_  
Stores and retrieves past conversations, learned preferences, and contextual knowledge. Gives Pneuma continuity and the ability to remember you.

**ARC (Archetype)** — _The Persona_  
Contains Pneuma's personality templates — who it _is_. This is where the tone, attitude, speaking style, and character traits live. It's the "soul" or identity layer.

**REF (Reflection)** — _The Inner Voice_  
Self-awareness and metacognition. Pneuma can think about its own thinking, evaluate its responses, and adjust. This enables growth and nuance.

**SYN (Synthesis)** — _The Conductor_  
Combines everything together. Takes memory context, persona guidance, and reflective insights, then weaves them into a single coherent response. It's the "output" engine.

### In Practice

When Pneuma responds, the indicator shows which engine is "active":

- Remembering something you said → **MEM** lights up
- Speaking in character → **ARC** glows
- Pausing to reconsider → **REF** pulses
- Forming the final reply → **SYN** activates

---

## Tech Stack

- **Frontend:** React + Vite
- **3D:** Three.js with React Three Fiber + Drei
- **Backend:** Node.js + Express
- **AI:** Anthropic Claude API with custom personality layer

---

## Development

```bash
# Client
cd client && npm run dev

# Server
cd server && node index.js
```

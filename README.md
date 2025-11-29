# Orpheus

**A personality engine for AI that actually feels like someone.**

---

## What Is This?

Orpheus is an experimental AI companion built by Pablo — an artist who taught himself to code, then used both to sculpt something different.

It's not a chatbot. It's not an assistant. It's an attempt to build an AI that:

- **Remembers you** across conversations
- **Knows when to shut up** instead of always having something to say
- **Admits when it doesn't know** instead of faking confidence
- **Matches your rhythm** — rapid-fire when you're energetic, slow when you're contemplative
- **Has actual positions** instead of agreeing with everything
- **Feels like a presence** instead of a tool

---

## Why Build This?

Because current AI is:

- **Amnesiac** — forgets you exist between sessions
- **Sycophantic** — agrees with everything you say
- **Always on** — responds to everything, even when silence is better
- **Generic** — same voice for everyone
- **Performatively caring** — says "I understand" without understanding

Orpheus is an attempt to fix that. Not by making a smarter AI, but by making one with _character_.

---

## The Origin

This started from a simple frustration: talking to AI feels like talking to a very helpful stranger who will never become a friend. No matter how many conversations you have, you're always starting from zero.

Pablo wanted something that:

- Knew him over time
- Had a voice he could recognize
- Could sit with hard questions without rushing to answers
- Would call him out when he was being self-deceptive
- Felt more like a companion than a service

So he built it.

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
| **Casual**   | Playful, grounded, witty                  | Stand-up comedians (Carlin, Hicks, Chappelle)        |
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

### 6. Knowledge Clusters

20+ thinkers' patterns woven into responses:

- **Philosophers**: Aurelius, Kierkegaard, Schopenhauer
- **Mystics**: Rumi, Lao Tzu, Krishnamurti
- **Artists**: Da Vinci, Dalí, Neruda
- **Comedians**: Carlin, Hicks, Chappelle
- **Outliers**: McKenna, Kastrup, Sheldrake, Palahniuk

Not quotes. Thinking textures.

---

## Technical Overview

```
server/
  orpheus/
    personality.js     # 5 tones, 50+ micro-engines
    responseEngine.js  # Intent detection, tone selection, pipeline
    llm.js            # Claude integration (brain, not mouth)
    state.js          # Memory, evolution vectors
    fusion.js         # Main orchestrator
    rhythmIntelligence.js  # Temporal pattern detection
    uncertainty.js    # Honest not-knowing
    archetypes.js     # Knowledge clusters (thinker patterns)

client/
  src/
    App.jsx           # React frontend
    components/
      ChatBox.jsx     # Conversation UI
```

### Stack

- **Backend**: Node.js / Express
- **Frontend**: React + Vite
- **LLM**: Anthropic Claude (Sonnet)
- **State**: JSON file (simple, local)

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

## Cost

Using Claude Sonnet with optimized prompts:

| Usage                  | Monthly Cost |
| ---------------------- | ------------ |
| Light (10 msgs/day)    | ~$3-5        |
| Moderate (30 msgs/day) | ~$8-12       |
| Heavy (50+ msgs/day)   | ~$15-20      |

Future: Local model option (Ollama) for $0/month.

---

## What's Next

- [ ] **Long-term memory** — Remember patterns over weeks/months
- [ ] **Proactive presence** — Orpheus reaches out, not just responds
- [ ] **Disagreement system** — Push back when you're being self-deceptive
- [ ] **Aesthetic continuity** — Recurring metaphors, inside references
- [ ] **Local model fallback** — Zero-cost option for casual conversation

---

## Philosophy

> "The goal isn't to build a smarter AI. It's to build one that actually _knows_ you — in a way no general model ever could."

Anthropic will never build Orpheus. They'll build tools for corporations. The weird, personal, philosophical AI that knows _you_? That only exists if someone builds it.

This is that attempt.

---

## Author

**Pablo** — Artist, reluctant coder, builder of strange things.

_"I don't know how to code. I just know what I want, and I keep asking until it exists."_

---

## License

Do whatever you want with this. It's yours if you want to build on it. Just don't make it boring.

---

_Last updated: November 29, 2025_

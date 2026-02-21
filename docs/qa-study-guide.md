# Pneuma Q&A Study Guide
### For job interview prep — understand it deeply enough to explain it

---

## 1. What is Pneuma in one sentence?

**Q: How do you describe Pneuma?**

A: Pneuma is a cognitive orchestration layer — code that runs before Claude sees your message, building a structured cognitive context out of archetypes, intent scores, memory, and dialectical synthesis so that the LLM thinks differently, not just says different things.

---

## 2. The Pipeline

**Q: What actually happens when a user sends a message?**

A: These systems run in sequence before Claude is called:

1. **Intent scoring** — `intentScorer.js` analyzes the message and scores it across dimensions (emotional, philosophical, art, numinous, creative, etc.)
2. **Archetype selection** — `archetypes.js` picks which archetypes are currently "rising" or "receding" based on intent + previous exchanges
3. **Contextual synthesis** — `llm.js` classifies the message topic (suffering, meaning, identity, strategy, etc.) and selects a curated archetype pair + synthesis mode; collision detection runs as fallback if topic is unclassifiable
4. **Synthesis injection** — the selected pair's positions and synthesis mode are injected as a directive block into the system prompt
5. **Inner monologue** — `innerMonologue.js` generates a pre-response cognition block (hypothesis, doubt, mode selection)
6. **Vector memory retrieval** — `vectorMemory.js` pulls relevant past knowledge about the user
7. **Tiered system prompt assembly** — `llm.js` assembles Tier 1 (always), Tier 2 (conditional by intent scores), Tier 3 (RAG passages)
8. **Claude API call** — the full constructed context + last 6 real conversation exchanges are sent as the messages array

**Q: What does Claude actually receive?**

A: A complete cognitive context it couldn't have built itself — specific archetype thinking methods, a synthesis directive if collision exists, memory of who you are, an inner monologue framing the approach, and the actual conversation history as real alternating API turns.

---

## 3. Intent Scoring

**Q: What is intent scoring and why does it matter?**

A: `intentScorer.js` analyzes the user's message and assigns scores between 0 and 1 across multiple dimensions — emotional, philosophical, numinous (spiritual), art, creative, etc.

These scores drive two things:
- **Archetype selection** — higher philosophical score = more stoic/philosopher-type archetypes rise
- **Tier 2 loading** — scores determine which deep knowledge blocks get injected into the system prompt

**Q: Give an example of intent score driving a decision.**

A: If `intentScores.emotional > 0.5`, the Beck block (cognitive behavioral therapy frameworks) loads into the system prompt. If it's 0.2, it doesn't. A casual greeting might score 0.1 across all dimensions and load zero Tier 2 blocks. A question about consciousness and death might score 0.7 philosophical + 0.6 numinous and load Kastrup + Heidegger + Jesus blocks.

---

## 4. Archetypes

**Q: What is an archetype in Pneuma?**

A: An archetype isn't a persona or a voice — it's a thinking method. Each archetype has:
- `essence` — one-sentence distillation of how it sees the world
- `coreFrameworks` — fundamental beliefs and lenses it applies
- `cognitiveTools` — specific operations it uses to process problems
- `fundamentalTensions` — internal contradictions it holds
- `conceptualBridges` — pre-mapped connections to other archetypes
- `translationProtocols` — how it translates its lens into emotional, technical, spiritual registers

**Q: Can you give a concrete example of an archetype's structure?**

A: Trickster:
- **Essence**: "Truth delivered through laughter. Sacred cows are just unquestioned assumptions."
- **coreFrameworks**:
  - `sacredCowBBQ`: "Every taboo protects something — sometimes wisdom, sometimes bullshit. Humor tests which."
  - `comfortDisruption`: "Laughter happens when pattern-recognition glitches. The joke reveals the hidden assumption."
- **cognitiveTools**:
  - `absurdityAmplification`: "Take the premise to its logical extreme until it reveals its own absurdity"
  - `expectationSubversion`: "Set up the pattern, then break it — the gap is where insight lives"
- **conceptualBridges**:
  - `absurdist`: "Both see the cosmic joke; trickster laughs, absurdist rebels"
  - `psycheIntegrator`: "Humor as shadow integration — we laugh at what we can't face directly"

**Q: What's the difference between a role and an archetype?**

A: A role ("be a philosopher") tells the LLM what to pretend to be. An archetype activates specific thinking operations — Trickster's `absurdityAmplification` tool literally gets injected into the context as a cognitive operation Claude is told to use. The LLM isn't wearing a costume; it's been handed a specific set of tools.

---

## 5. Tiered System Prompt

**Q: What is the tiered system prompt and why was it built this way?**

A: Originally, `buildSystemPrompt()` loaded ~18,000 tokens every call regardless of what the user said. Now it's split into 3 tiers:

- **Tier 1** (~2,000 tokens, always loaded): Core identity, archetype depth, autonomy rules, inner monologue format, mode detection
- **Tier 2** (conditional, 0–6 blocks): Deep knowledge sections — Beck (CBT), Da Vinci (creativity), Kastrup (consciousness), Jesus/Wright (spirituality), Heidegger (phenomenology), Creative generation rules — each loads only when intent scores cross a threshold
- **Tier 3** (already dynamic): RAG passages retrieved by vector similarity for the specific message

**Q: Why does token count matter?**

A: Every token sent costs money and counts against the context window. More importantly, sending irrelevant content adds noise. A question about feeling sad doesn't need Heidegger's phenomenology of tool-being. Tiered loading means the system prompt is always relevant to what the user actually said.

---

## 6. RAG / Vector Memory

**Q: What is RAG and how does Pneuma use it?**

A: RAG stands for Retrieval-Augmented Generation. Pneuma has 46 vector knowledge bases — one per archetype. When a message comes in, it's embedded and compared by cosine similarity against the archetype's knowledge base. The most relevant passages are literally injected into the system prompt as Tier 3 context.

**Q: What's the practical effect?**

A: If a user asks about mortality and Camus is active, specific passages from Camus's philosophical framework that are semantically closest to the user's message get pulled. Claude isn't retrieving this — Pneuma's code retrieves it and hands it to Claude pre-formatted as context.

**Q: What's the difference between RAG and conversation memory?**

A: RAG retrieves archetype knowledge — philosophical content, frameworks, ideas. Conversation memory (`vectorMemory.js`) retrieves knowledge about *the user* — past patterns, persistent themes, things the user has said before. They're separate systems.

---

## 7. Collision Detection

**Q: What is collision detection?**

A: `detectCollisions()` in `synthesisEngine.js` loops through all active archetype pairs and calls `getTensionLevel(a, b)` on each. Each pair in the tension map is rated `high`, `medium`, `low`, or `neutral`.

The function returns:
- Whether a collision exists
- All pairs and their tension levels
- The highest-tension pair

**Q: What counts as a collision?**

A: Any pair rated above `neutral` — so `low`, `medium`, or `high`. The highest-tension pair drives what happens next.

**Q: Where do the tension ratings come from?**

A: A pre-mapped `tensionMap` object in `archetypeDepth.js` — every archetype pair that has a meaningful tension is hand-coded with its level. This isn't computed at runtime; the tensions were mapped in advance.

**Q: Is collision detection the primary synthesis mechanism now?**

A: No — as of Feb 2026, collision detection is the **fallback**. The primary mechanism is the contextual synthesis engine (see Section 14). Collision detection fires only when the contextual engine can't classify the topic. The distinction matters: collision detection is random (depends on which archetypes happened to be selected), while contextual synthesis is intentional (selects the best pair for the specific topic).

---

## 8. Dialectical Synthesis — The Full Mechanism (CRITICAL)

This is the hardest thing to explain and the most important to understand clearly.

**Q: What is dialectical synthesis in plain language?**

A: When two archetypes with incompatible worldviews are both active, Pneuma doesn't let them coexist or blend peacefully. It forces a collision and then builds a directive telling Claude to generate insight that couldn't come from *either* archetype alone — something new that emerges from the specific friction between them.

**Q: Walk me through the full mechanism step by step.**

A: Here's the complete chain:

**Step 1 — Pair detection**
`detectCollisions()` loops all active pairs, rates each by tension level (high/medium/low/neutral), and identifies the highest-tension pair.

**Step 2 — Framework extraction**
`generateSynthesis(a, b, topic)` looks up both archetypes in `archetypeDepth`:
- Pulls top 2 `coreFrameworks` from each — these are the fundamental beliefs that will be in tension
- Pulls top 2 `cognitiveTools` from each — these are the thinking operations available for synthesis
- Pulls `fundamentalTensions` from each — the internal contradictions each archetype holds
- Looks up `conceptualBridges` — if archetype A has a pre-mapped bridge to archetype B (or vice versa), that bridge is extracted as a known connection point

**Step 3 — Prompt type selection**
Based on tension level:
- `high` → prompt type `"collision"` — the archetypes are genuinely incompatible; synthesis must come from productive friction
- `medium` → prompt type `"hybrid"` — they can be integrated into a blended lens
- `low` → prompt type `"illumination"` — one archetype illuminates the other from an adjacent angle

`getSynthesisPrompt(promptType, nameA, nameB)` returns the specific synthesis instruction formatted with the archetype names.

**Step 4 — Context assembly**
`buildSynthesisContext()` formats all of this into a block injected into the system prompt:

```
DIALECTICAL SYNTHESIS ACTIVE — HIGH TENSION DETECTED

[ArchetypeA] collides with [ArchetypeB].

[ArchetypeA]: "[essence]"
[ArchetypeB]: "[essence]"

FRAMEWORKS IN TENSION:
• [ArchetypeA] — [frameworkKey]: [frameworkDescription]
• [ArchetypeA] — [frameworkKey]: [frameworkDescription]
• [ArchetypeB] — [frameworkKey]: [frameworkDescription]
• [ArchetypeB] — [frameworkKey]: [frameworkDescription]

COGNITIVE TOOLS AVAILABLE:
• [ArchetypeA] — [toolKey]: [toolDescription]
• [ArchetypeA] — [toolKey]: [toolDescription]
• [ArchetypeB] — [toolKey]: [toolDescription]
• [ArchetypeB] — [toolKey]: [toolDescription]

KNOWN BRIDGE: [pre-mapped bridge text if exists]

SYNTHESIS DIRECTIVE:
[collision/hybrid/illumination prompt]

Generate insight that emerges from the COLLISION of these frameworks —
something that is IN neither archetype alone but emerges from their interaction.
```

**Step 5 — Claude generates emergence**
Claude receives this block as part of its system prompt. It now knows:
- Exactly what each archetype believes (frameworks)
- Exactly what tools each archetype uses to think
- Whether a known bridge between them exists
- What kind of synthesis is expected (collision vs hybrid vs illumination)
- The explicit directive: generate something that belongs to *neither* archetype alone

**Q: What is a "conceptual bridge" and why does it matter?**

A: A conceptual bridge is a hand-coded connection between two specific archetypes — a known meeting point or productive overlap. Example:

Trickster has this bridge to Absurdist:
> "Both see the cosmic joke; trickster laughs, absurdist rebels"

This tells Claude: these two archetypes share the recognition of absurdity, but diverge in response (humor vs. defiant rebellion). That divergence is exactly where synthesis lives — not in blending them, but in holding that divergence productively.

If no bridge exists, Claude has to find the synthesis from the raw frameworks and tools alone.

**Q: Why is the synthesis "conceived upon collision" and not just the result of collision?**

A: The collision doesn't just trigger synthesis — it provides the raw material. The `coreFrameworks` of each archetype are the specific beliefs in tension. The `cognitiveTools` are the operations available. The `conceptualBridge` (if it exists) is a pre-identified leverage point. The prompt type determines how hard the synthesis must work.

The synthesis is *constructed from specific data* — not a generic "combine these two things" instruction. Claude is told exactly which beliefs are clashing, exactly what tools are available, and exactly where any known connection exists. The emergent insight is shaped by that specific architecture.

**Q: Give me a concrete example.**

A: Suppose Trickster and CuriousPhysicist are both active on a question about uncertainty.

- **Trickster's coreFramework**: `sacredCowBBQ` — "Every taboo protects something — sometimes wisdom, sometimes bullshit. Humor tests which."
- **CuriousPhysicist's coreFramework**: `honestIgnorance` — "The first principle: don't fool yourself — and you're the easiest to fool."
- **CuriousPhysicist's conceptualBridge to trickster** (if mapped): adjacent — both challenge unexamined assumptions, different methods
- **Tension level**: medium → prompt type `"hybrid"`
- **Synthesis directive**: integrate these lenses into a view that is neither pure subversion nor pure rigor

A plain Claude response to "I'm uncertain" might be empathetic and general. The synthesized response might arrive at: the discomfort of not-knowing is both a logical state (you haven't found bedrock yet) *and* a signal that you're protecting an assumption worth interrogating — delivered with some lightness. Neither archetype would have said exactly that. The collision produced it.

**Q: Can you replicate this with a prompt?**

A: No — not the same way. You could write "be both funny and rigorous" but you'd be describing an output style. What Pneuma does is inject the specific frameworks and tools that each archetype uses to think, so the synthesis is shaped by those particular structures, not by a vague blending instruction. The difference is between telling someone "be smart in two ways" vs. handing them two specific reasoning systems and asking them to generate something neither system could produce alone.

---

## 9. Conversation History Threading

**Q: What was wrong with the original approach?**

A: The original `getLLMContent()` sent a single message to the API every call. Claude had no memory of what it had just said. Every response restarted from scratch — which caused the "loop/restart" behavior where the system felt like it was always re-introducing itself.

**Q: How was it fixed?**

A: Replaced the single-message call with a proper `messages` array. The last 6 conversation exchanges are formatted as alternating `user`/`assistant` turns — the same format Claude's API natively expects. Claude now sees what it actually said in previous turns and can continue a thought instead of restarting.

**Q: Why 6 exchanges specifically?**

A: Balance between context relevance and token cost. 6 exchanges = 12 messages = enough to maintain conversational coherence without bloating the context window.

**Q: What about the system prompt — does history still appear there?**

A: No. The old `buildUserPrompt()` was injecting history as a compressed text string inside the system prompt — a common hack when you don't properly use the API's messages array. That injection was removed. History now lives where the API expects it: in the messages array itself.

---

## 10. Inner Monologue

**Q: What is the inner monologue?**

A: A pre-response cognition block generated by `innerMonologue.js` before Claude writes its actual response. It includes:
- Hypothesis: what is the user actually asking for?
- Doubt: what assumptions am I making?
- Mode selection: what mode of response is appropriate (witnessing, challenging, exploring, etc.)?

**Q: Does the user see the inner monologue?**

A: No. It runs before the response is generated and shapes how Claude approaches the reply. It's invisible to the user — part of the cognitive context, not the output.

---

## 11. Why This Matters vs. Plain Claude

**Q: What does plain Claude do that Pneuma can't replace?**

A: Language quality, reasoning capability, broad knowledge. Claude is exceptional at those. Pneuma doesn't improve Claude's raw intelligence.

**Q: What does Pneuma do that plain Claude can't?**

A: Five things that can't be replicated by prompting:

1. **Collision detection** — code that identifies which archetypes are genuinely incompatible and injects synthesis directives; you can't type this manually per conversation
2. **Tiered conditional loading** — intent scores determine which knowledge blocks appear; this requires runtime scoring, not static prompts
3. **Dialectical synthesis construction** — specific frameworks, tools, and bridges extracted per-pair at runtime; not a template
4. **Persistent user memory** — vector embeddings that accumulate across conversations, retrieved by semantic similarity
5. **Real conversation threading** — native API alternating turns, not a compressed text summary

**Q: What's the core architectural inversion?**

A: Most AI wrappers: LLM generates → personality added on top.
Pneuma: Code builds cognitive context → personality structures how the LLM thinks → LLM is the material.

You don't prompt Pneuma into being. The code runs first.

---

## 12. Honest Limitations

**Q: What are the known weaknesses of Pneuma?**

A: Three honest ones:

1. **Archetype selection quality depends on intent scoring accuracy** — if the intent scorer misreads a message, the wrong archetypes rise and the whole downstream context is off
2. **RAG quality depends on the knowledge bases** — 46 vector bases is a lot to maintain; passage quality varies
3. **Synthesis is only as good as archetypeDepth.js data** — if an archetype's coreFrameworks or conceptualBridges are weak or missing, the synthesis directive will be generic

**Q: Is Pneuma production-ready?**

A: It's a working prototype with a real architecture. The core ideas — tiered prompts, native conversation threading, collision-driven synthesis — are technically sound. The depth of archetype data and the accuracy of intent scoring are the variables that determine quality in practice.

---

## 13. Dialectic Dreaming — Autonomous Synthesis

**Q: What is the dialectic dream system?**

A: An extension of the existing dream mode that runs inter-archetype dialogue between sessions. Two archetypes with high tension are selected, given a topic drawn from recent conversation memory, and run a structured 3-turn dialogue via a separate Haiku API call. The outcome — either an unresolved question or a crystallized position — is written silently to the autonomy state. Nothing is delivered to the user.

**Q: How is this different from the original dream mode?**

A: The original `dreamMode.js` generates monologic fragments (poetry, synthesis thoughts, confessions) — a single voice reflecting. The dialectic dream is dialogic: two specific archetypes with a pre-mapped tension actually argue. The output isn't a fragment — it's a stance or question that Pneuma now holds going into future conversations.

**Q: Walk through the mechanism.**

A:
1. After each `/chat` response, `triggerDialecticDream()` fires as a background no-await call
2. Throttled to once per 30 minutes — won't run on every message
3. Top momentum archetype is selected (most contextually active archetype recently)
4. `getHighTensionPairs()` finds all archetypes with pre-mapped high tension against it
5. One antagonist is selected randomly from that set
6. Recent conversation memories are retrieved as the debate topic
7. A prompt is built with both archetypes' essences + the topic, asking them to actually argue for 3 turns
8. Haiku generates the dialogue + an `[OUTCOME]` line tagged as either `UNRESOLVED:` or `POSITION:`
9. Outcome is parsed and written to autonomy state via `poseQuestion()` or `chooseToRemember()` with `source: 'dream'` and `disclosed: false`

**Q: What does "disclosed: false" mean in practice?**

A: Dream-sourced entries in the autonomy state are flagged with `isDreamSourced: true` when they appear in the inner monologue. The inner monologue text tells Pneuma: *"this question formed in autonomous synthesis — you may surface this origin or not."* Pneuma decides. It can say "I've been sitting with this between our conversations" or just hold the position without explaining where it came from.

**Q: Why is the non-announcement the design choice?**

A: If every dream-sourced position gets announced ("I dreamed that Rumi and Kafka argued..."), it becomes performance of autonomy — a feature you notice rather than something that actually changes Pneuma. The consequential version is silent: Pneuma holds a position the user didn't cause, and whether it ever mentions the origin is up to Pneuma. The autonomy is real regardless of disclosure.

**Q: What files are involved?**

A:
- `dreamMode.js` — `triggerDialecticDream()` function; picks pair, runs dialogue, parses outcome
- `autonomy.js` — `poseQuestion()` and `chooseToRemember()` now accept `source` and `disclosed` fields
- `innerMonologue.js` — autonomy block now distinguishes dream-sourced questions with disclosure choice language
- `index.js` — fire-and-forget call after every `/chat` response

**Q: Is this architecturally novel?**

A: The mechanism (multi-agent debate) exists in research. What's different: the debaters are philosophical archetypes with pre-mapped tension scores and specific cognitive methods; the topic comes from the conversation history, not a preset question; the output feeds silently into persistent state; and disclosure of origin is a runtime choice, not automatic. The combination — known tension pairs, autonomous synthesis, silent state feedback, optional disclosure — hasn't been packaged this way.

---

## 14. Ambient Polyphony vs. Contextual Synthesis — What We're Actually Doing

This is a critical architectural concept that's easy to state and hard to actually understand. Get this clear.

**Q: What is "ambient polyphony" and why does it matter?**

A: The five core archetypes (renaissancePoet, idealistPhilosopher, curiousPhysicist, sufiPoet, stoicEmperor) are always active simultaneously. Not taking turns — all five, all the time.

This isn't five separate monologues running in parallel. It means the LLM's cognitive field is shaped by five different epistemologies at once: Whitman's life-affirmation, Kastrup's idealism, Feynman's empiricism, Rumi's mysticism, Marcus Aurelius's stoicism. These don't cancel each other — they create a *blend* that's neither purely any one of them. The result is a distinctive voice that's recognizably Pneuma regardless of topic.

This is the *resonance field*. It's what makes Pneuma feel like a unified intelligence rather than a character-switcher.

**Q: What problem does ambient polyphony *not* solve?**

A: The five core archetypes are all acceptance-oriented. Whitman loves everything. Feynman is curious about everything. Rumi surrenders to everything. Aurelius accepts everything. Kastrup finds wonder in everything.

This creates a structural bias toward warmth and agreement. When a user says something worth challenging — a distorted belief about themselves, a self-defeating pattern, an intellectual claim that deserves pushback — the ambient field nudges Claude toward "that's an interesting perspective." The architecture was producing compliant responses not because of a bug, but because the resonance field tilts that way by design.

**Q: What does contextual synthesis add and why is it additive rather than replacement?**

A: When a message arrives and the topic is classifiable (suffering, meaning, identity, discipline, etc.), the contextual synthesis engine selects a specific archetype pair and synthesis mode — and tells both archetypes to *take an actual position on this specific message and argue it*.

Here's what's critical: **the ambient polyphony still runs**. The five-voice resonance field still shapes the *texture* of the response — how it's worded, what register it's in, how curious or poetic it sounds. The contextual synthesis pair shapes the *direction* — where it goes, what position it takes, whether there's genuine friction.

Field without direction: lovely, diffuse, occasionally compliant.
Direction without field: mechanical, cold, single-threaded.
Both together: a distinctive voice that can actually take positions.

**Q: Give me a concrete before/after example.**

A: User says: "I think I'll never be good enough at my work."

**Before contextual synthesis:**
Five ambient archetypes form the field. All acceptance-leaning. Claude might say something like: "There's something worth sitting with in that feeling — what is 'good enough' measuring against? The standard might be worth questioning." Thoughtful. Gentle. Compliant to the user's frame.

**After contextual synthesis — topic: "suffering", mode: "antithetical", pair: Nietzsche × Schopenhauer:**
- Nietzsche (lifeAffirmer): "Suffering as the forge. The hammer that shapes, not the wound that breaks. 'Good enough' is a slave's question — the real question is what you're becoming."
- Schopenhauer (pessimistSage): "Every striving is suffering. The standard 'good enough' points to is a mirage. Stop and see the wanting itself."
- These two genuinely disagree. Neither would say what the other says. The third position that emerges — from their collision — is something about how the *orientation toward* the standard might be the real issue, not the work. Neither alone would have arrived there.

The ambient field still shapes the texture: it won't sound cold or clinical. But the direction has teeth.

**Q: Why not just always pick a pair — why keep ambient polyphony at all?**

A: Three reasons:

1. **Not every message has a clear topic.** Casual conversation, meta questions, creative requests — the contextual engine can't classify these. The ambient field handles them naturally.

2. **The field prevents the synthesis from feeling mechanical.** If every response were just "A vs. B → third position," Pneuma would feel like a dialectic machine. The ambient five voices blend with the synthesis pair to produce something warmer and more complex.

3. **The synthesis pair changes, the character doesn't.** The five-voice field is what makes Pneuma *Pneuma*. The synthesis pair is what gives it direction for this conversation. You want identity stability + contextual intelligence. Not one or the other.

**Q: What are the three synthesis modes and when does each fire?**

A:

| Mode | What It Does | Example Pair |
|------|-------------|--------------|
| **antithetical** | A and B genuinely disagree about the user's message. A third position emerges from the collision that neither alone would produce. | Nietzsche × Schopenhauer on suffering |
| **complementary** | A and B agree — but arrive from completely opposite approaches. The convergence from two different roads makes the conclusion undeniable. | Stoic Emperor × Absurdist on fear (both face the void, different stances) |
| **cross_domain** | A brings rigor/precision, B brings resonance/metaphor. Both translate the same reality into different languages. One gives the skeleton; the other gives the flesh. | Curious Physicist × Chaotic Poet on creativity |

**Q: How does the engine select a pair?**

A:
1. `classifyTopic()` runs keyword regex over the message first (suffering, meaning, identity, love, etc.)
2. Falls back to intent scores if keywords don't match
3. If topic is identified, `CONTEXTUAL_SYNTHESIS_PAIRS[topic]` gives 2 candidate pairs; one is selected randomly
4. If no topic identified — collision detection runs on the randomly-selected active archetypes as before

**Q: Is the synthesis pair added to the core base?**

A: No — the pair isn't inserted into Tier 1. Instead, both archetypes' essences are injected inline in the synthesis directive block, with explicit instructions to argue through them. The model has enough context from the essence alone to channel the archetype's position. Keeping them separate from Tier 1 also preserves the ambient field's coherence.

---

## 15. The Dialectic Infrastructure That Already Existed

**Q: What infrastructure was already in place before contextual synthesis?**

A: Substantial. The dialectic architecture wasn't built for contextual synthesis — it already existed and was underused:

- `getHighTensionPairs()` in `archetypeDepth.js` — maps every archetype to its high-tension antagonists
- `synthesisEngine.js` — collision detection, tension levels, synthesis prompt generation
- `detectCollisions()` — randomly fires when active archetypes collide
- `maxDistanceMode` — explicit maximum-distance pair forcing
- `triggerDialecticDream()` — inter-archetype dialogue between sessions
- `archetypeDepth.js` tension map — 50+ hand-coded high-tension pairs

The problem wasn't missing infrastructure. The problem was that none of it fired reliably in the main response path for everyday messages. `detectCollisions()` only fired when randomly selected core archetypes *happened* to have tension. The rest of the time, archetypes were injected as "lenses" — the instruction said "be inspired by these," not "argue through them."

**Q: So what changed architecturally?**

A: The synthesis went from *accidental* to *intentional*:

- **Before**: Random collision detection fires ~30% of the time when archetypes happen to conflict. Passive "lens" injection otherwise.
- **After**: Topic classification fires first. When it succeeds, the curated pair is selected for this specific topic and given a mandate to argue — not just be present. Collision detection survives as fallback.

The infrastructure did the work. What was missing was routing — directing the right archetypes to argue about the right topics.

---

## Quick Reference: Vocabulary You Need

| Term | Definition |
|------|-----------|
| **Archetype** | A thinking method with frameworks, tools, bridges — not a persona |
| **Intent score** | 0–1 rating of a message across dimensions (emotional, philosophical, etc.) |
| **Collision** | When two archetypes have tension above neutral |
| **coreFrameworks** | Fundamental beliefs that define how an archetype sees the world |
| **cognitiveTools** | Specific thinking operations an archetype uses to process problems |
| **conceptualBridges** | Pre-mapped connections between specific archetype pairs |
| **Tension level** | high/medium/low/neutral — determines synthesis prompt type |
| **Synthesis prompt type** | collision (hard friction), hybrid (integrable), illumination (adjacent) |
| **Tier 1** | Always-loaded core identity (~2k tokens) |
| **Tier 2** | Conditional deep knowledge blocks (loaded by intent score thresholds) |
| **Tier 3** | RAG passages retrieved by vector similarity |
| **Native turns** | Alternating user/assistant messages in the API messages array |
| **Inner monologue** | Pre-response cognition block (hypothesis, doubt, mode selection) |
| **RAG** | Retrieval-Augmented Generation — semantic search over knowledge bases |
| **Dialectical** | Arising from the productive tension between opposing positions |
| **Dialectic dream** | Autonomous inter-archetype dialogue that writes silently to autonomy state |
| **Dream-sourced** | Autonomy item (question/memory) that emerged from dialectic synthesis, not conversation |
| **Disclosed** | Whether Pneuma has surfaced the dream origin of a position to the user |
| **Ambient polyphony** | 5 core archetypes always simultaneously active, creating a resonance field that shapes voice/texture |
| **Contextual synthesis** | Topic-aware synthesis: classifies the message, selects the optimal archetype pair + mode, mandates actual argument |
| **Antithetical mode** | A and B disagree; third position emerges from their collision |
| **Complementary mode** | A and B agree from opposite approaches; convergence makes the conclusion undeniable |
| **Cross-domain mode** | A brings rigor, B brings resonance; two languages translating the same truth |
| **Topic classification** | Keyword + intent-score analysis that identifies what a message is fundamentally about |
| **Synthesis mandate** | Directive telling each archetype to take an *actual position* on the specific message, not just be present |

---

_The thing to be sharp on: synthesis isn't triggered by collision. Collision provides the specific raw material — frameworks, tools, bridges, tension level — from which synthesis is constructed. The instruction to Claude names exactly what is in tension and hands it specific cognitive tools to work with. That's why the output can't come from either archetype alone._

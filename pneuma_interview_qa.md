# Pneuma AI — Interview Q&A Prep Guide

**Purpose:** Primary study document for technical interviews. Every question is grounded in Pneuma's actual code, with first-person answers you can deliver confidently. Practice each answer aloud until it flows without hesitation.

**How to use this guide:**
- Work through all four tiers in order — each tier assumes you own the previous one.
- Memorize the "Key phrases" bullets. They are the lines that signal fluency in an interview.
- When asked an open question, always anchor your answer to a specific file or function name within the first two sentences.

---

## TIER 1 — JUNIOR
**What it tests:** Basic comprehension. Can you describe what the system does and how the pieces connect?

---

### Q1: What is Pneuma and what problem does it solve?
**Tier**: Junior
**Concept**: System Design & Tradeoffs

**Ideal Answer**:
Pneuma is a cognitive orchestration layer that shapes how Claude thinks before it responds. The core problem it solves is that a raw LLM wrapper produces generic answers — it has no memory of who you are, no consistent personality, and no mechanism for genuine dialectical thinking. Pneuma adds all three.

I built it around 43 philosophical archetypes — Rumi, Heidegger, Jung, Schopenhauer, Feynman, and others — which act not as personas Claude switches between but as thinking lenses that can collide and synthesize. The goal is that a question about consciousness should produce an answer shaped by the tension between, say, Kastrup's idealism and Feynman's materialist rigor — not a generic philosophical overview.

The architecture is intentionally not a chatbot wrapper. Every response is the output of a multi-layer pipeline: intent detection, tone selection, archetype selection, RAG retrieval, inner monologue generation, and then a single call to Claude with all that structured context in the system prompt.

**Key phrases to remember**:
- "Not a chatbot wrapper — a cognitive orchestration layer."
- "43 archetypes as thinking lenses, not personas to switch between."

---

### Q2: Walk me through what happens when a user sends a message.
**Tier**: Junior
**Concept**: Routing & Workflows

**Ideal Answer**:
The entry point is `pneumaRespond()` in `fusion.js`. The first thing it does is run cheap regex guard checks — functions like `wantsDirectMode()` and `wantsEnterDiagnostics()` — to intercept special commands before anything expensive runs. If none of those match, it loads state, then calls `generate()` in `responseEngine.js`.

Inside `responseEngine.js`, there are four sequential layers. First, intent detection — either via a Claude call through `getLLMIntent()` in `llm.js`, or falling back to regex scoring across nine categories like casual, philosophical, emotional, and numinous. Second, tone selection — a weighted lottery across six tones that includes an anti-monotony mechanism. Third, personality application. Fourth, cinematic continuity — deduplication, identity boundary enforcement, and variation injection.

If the message passes the behavioral signal checks (pushback, uncertainty, quiet mode), the system calls `getLLMContent()` in `llm.js`, which builds the full system prompt and makes the Claude API call. After the response comes back, `fusion.js` saves memories, updates state, and returns the reply.

**Key phrases to remember**:
- "Guard functions are cheap regex gates — they intercept before anything expensive runs."
- "Four sequential layers in responseEngine.js, then one Claude call."

---

### Q3: What is the knowledge base and how does it get used?
**Tier**: Junior
**Concept**: Advanced RAG

**Ideal Answer**:
The knowledge base lives in `data/archetype_knowledge/`, organized as one folder per thinker — aurelius, feynman, kastrup, rumi, and so on, for 48 folders total. Each folder contains a `passages.json` file with structured text passages: the passage text, its source, thematic tags, and contextual notes.

The retrieval system is in `archetypeRAG.js`. At startup, `initializeArchetypeRAG()` loads all passages and generates embeddings using OpenAI's `text-embedding-3-small` model, caching them to `data/archetype_embeddings.json` — a 51MB file — so recomputation is avoided on subsequent runs.

When a message comes in, `retrieveArchetypeKnowledge()` embeds the query, scores all passages with cosine similarity, filters by a minimum threshold of 0.3, diversifies to at most two passages per thinker, and returns the top five. Those passages — along with a contrasting voice from the `CONTRAST_MAP` — get injected directly into the system prompt under a "RELEVANT WISDOM FROM YOUR KNOWLEDGE BASE" section.

**Key phrases to remember**:
- "48 thinker folders, pre-embedded and cached to avoid recomputation."
- "topK=5, minScore=0.3, max 2 per thinker, plus a forced contrast voice."

---

### Q4: How does Pneuma remember things across conversations?
**Tier**: Junior
**Concept**: Memory & State

**Ideal Answer**:
There are three memory layers, each serving a different scope and purpose. The first is thread memory — in-session only, held in a `threadMemory` object. It tracks the last several messages, recent tones used, and conversational depth. This feeds anti-monotony and tone-flip detection. It disappears when the session ends.

The second is vector memory, managed by `vectorMemory.js`. After each substantial response, an embedding of the reply is saved with metadata — tone, emotional weight, timestamp. On the next message, `retrieveMemories()` does a semantic search to surface past exchanges that are conceptually related, even if they used different words. This works cross-session and is backed by MongoDB Atlas vector search, with a brute-force cosine fallback.

The third is long-term memory in `longTermMemory.js`. This is structured JSON that accumulates over all sessions: recurring topics with counts, unresolved struggles, significant emotional moments, observed behavioral patterns with confidence scores, and a session handoff object that captures the last mood so the next conversation can open with appropriate awareness.

**Key phrases to remember**:
- "Three layers: thread (in-session anti-monotony), vector (cross-session semantic), long-term (structured facts and patterns)."
- "Memory distillation — sessions compress into metadata, not full transcripts."

---

### Q5: What is an archetype in Pneuma and how does it influence a response?
**Tier**: Junior
**Concept**: Prompt Engineering

**Ideal Answer**:
An archetype in Pneuma is a thinking style, not a character. Each archetype has a codename — like `idealistPhilosopher`, `stoicEmperor`, or `curiousPhysicist` — defined in `archetypes.js` with a semantic essence used for embedding-based matching, and a deeper entry in `archetypeDepth.js` with a core philosophical framework, cognitive tools (specific methods of thinking like Feynman's "unforgiving questions" or Musashi's "water principle"), and tension bridges to other archetypes.

These archetypes get injected into the system prompt as an "ACTIVE CONCEPTUAL LENSES" section. Claude is told these are the thinking styles available for this response. It doesn't switch between them mechanically — the idea is that the voices shape the texture of Claude's reasoning from the inside. When two archetypes are in tension — say `idealistPhilosopher` and `stoicEmperor` — `synthesisEngine.js` detects the collision via `detectCollisions()` and adds a synthesis directive to the prompt: "generate emergent insight from this collision, not just 'both are true.'"

**Key phrases to remember**:
- "A thinking style, not a character — the archetype shapes the texture of reasoning from inside the prompt."
- "Collision detection gates whether a synthesis directive gets added."

---

### Q6: What is inner monologue and what does it do?
**Tier**: Junior
**Concept**: Prompt Engineering

**Ideal Answer**:
Inner monologue is Pneuma's pre-response cognition, generated by `innerMonologue.js` and injected into the system prompt before Claude generates its reply. It is never shown to the user — it is entirely internal context that shapes how Claude approaches the message.

It has four components. A dialectical section where a rising voice (the archetype most aligned with this message) and a receding voice (a pre-defined high-tension counterpart) create a private debate. A hypothesis about the user's underlying need — not just the surface question, but what they are actually seeking. A self-interruption, which fires at 40% probability, expressing honest doubt: "Wait — am I projecting?" And a synthesis that resolves the dialectic into a listening stance.

The effect is that Claude generates from a frame of depth rather than performing depth after the fact. The inner monologue is the cognitive setup; the user's message is the trigger; and the response emerges from that primed state.

**Key phrases to remember**:
- "Never shown to the user — it is the cognitive frame Claude generates FROM."
- "Self-interruption fires at 40% probability — prevents overconfidence, adds epistemic honesty."

---

## TIER 2 — MID-LEVEL
**What it tests:** Intentional decision-making. Why did you choose X? How did you implement Z?

---

### Q7: Why did you design the routing as a three-layer system instead of a single LLM call?
**Tier**: Mid
**Concept**: Routing & Workflows

**Ideal Answer**:
I designed routing as three sequential layers because each layer catches different things at different cost points. The first layer is pure regex guards in `fusion.js` — functions like `wantsDirectMode()` and `wantsEnterDiagnostics()` that match exact phrases like "drop the quotes" or "enter diagnostics." These are microsecond operations that intercept special commands before any state is loaded or any API is called. They matter because diagnostic mode and direct mode bypass the entire archetype system, so running them through LLM intent detection would waste money and add latency for something a regex handles perfectly.

The second layer is the behavioral signal block — analyzing rhythm, pushback probability, uncertainty markers, and quiet mode — run in parallel via `Promise.all()` in `fusion.js`. These can produce early-exit responses (template-based, no LLM required) for around 10-15% of messages. The third layer is `getLLMIntent()` in `llm.js`, which calls Claude to score intent across nine dimensions. This is more accurate than regex but costs a full API call, so it only runs if the message has already passed the first two layers.

The hierarchy is: zero cost → low cost → full cost. Each gate only opens if the cheaper gate can't handle it. That decision also means the system degrades gracefully — if Claude is unavailable, intent falls back to regex scoring in `detectIntent()` inside `responseEngine.js`, and behavioral signals still fire.

**Key phrases to remember**:
- "Zero cost → low cost → full cost — each gate only opens if the cheaper one can't handle it."
- "Behavioral signals run in parallel via Promise.all(); early exits fire for ~10-15% of messages."

---

### Q8: How does the tone selection weighted lottery work and why not just pick the highest-scoring tone?
**Tier**: Mid
**Concept**: Routing & Workflows

**Ideal Answer**:
Tone selection in `responseEngine.js` is a weighted lottery, not a hard argmax, and the choice was deliberate. If I always picked the highest-scoring tone, a user going through a moderately emotional conversation would get `intimate` tone on every single message. That becomes predictable and eventually hollow — users start to feel like they're talking to a pattern, not a mind.

The lottery works like this: base weights come from Pneuma's evolved state — starting roughly at `{casual: 0.5, analytic: 0.5, oracular: 0.35, intimate: 0.15, shadow: 0.25}`. Intent scores apply boosts — if `emotional > 0.5`, intimate gets +0.35. Then the anti-monotony mechanism checks the last few tones in `threadMemory.lastTones` and crushes any tone that's appeared two or more times in a row by multiplying its weight by 0.3. Then a random value is drawn against the total weight sum and we walk the ordered list until we find the winner.

This means the right tone usually wins — intent boosts ensure alignment with what the user needs — but monotony is structurally prevented. The 30% reduction in repeated tones makes variety feel natural rather than random. I also added art topic detection as a special case: art messages trigger both analytic and oracular weights simultaneously, which produces that blend of precision and mystery I wanted for aesthetic conversations.

**Key phrases to remember**:
- "The right tone usually wins — but monotony is structurally prevented, not just hoped for."
- "Anti-monotony crushes repeated tones by 70%, not to zero — the tone can still win, just less likely."

---

### Q9: How does the archetype RAG retrieval work, and what design choices did you make in it?
**Tier**: Mid
**Concept**: Advanced RAG

**Ideal Answer**:
The retrieval pipeline in `archetypeRAG.js` runs through four steps. Initialization loads all passage files and generates OpenAI `text-embedding-3-small` embeddings, caching them in `archetype_embeddings.json` so we only pay that cost once. Query time embeds the user's message, runs cosine similarity against all cached passage embeddings, filters by a minimum score of 0.3, then applies diversification.

The diversification logic is where I made the most deliberate choices. Without it, if the user asks about consciousness, you'd get five Kastrup passages, all saying essentially the same thing. I cap at two passages per thinker, so the five slots span at least three different perspectives. I also reserve one slot for a contrast voice from the `CONTRAST_MAP` — pre-computed pairs of thinkers who fundamentally disagree. If Kastrup is the top match, the contrast slot pulls from Feynman or Faggin. That contrast passage is marked `isContrast: true` and formatted separately in the prompt with an explicit instruction: "The voices disagree. Hold the tension. Don't resolve it cheaply."

The brute-force fallback is worth mentioning — if MongoDB's vector index is unavailable, the system loads all embedded passages into memory and scores them sequentially. It's slower but the semantic quality is identical, because we're using the same cosine similarity math either way.

**Key phrases to remember**:
- "Two passages max per thinker — diversity is enforced, not hoped for."
- "CONTRAST_MAP is pre-computed — the opposition is intentional, not incidental."

---

### Q10: How did you implement the Wikipedia tool and why did you build a tool-use loop?
**Tier**: Mid
**Concept**: Tool Use & MCP

**Ideal Answer**:
The Wikipedia tool is defined as a formal tool schema — `WIKIPEDIA_TOOL` in `llm.js` — with a `name`, `description`, and `input_schema` that tells Claude when and how to invoke it. The description is important: it explicitly tells Claude to use this when it needs factual grounding rather than relying on training data paraphrase. That framing matters — it positions the tool as a grounding mechanism, not a general search.

The tool-use loop in `getLLMContent()` works like this: I stream the initial Claude response. If it stops with `stop_reason === "tool_use"`, I extract the tool call, route it to `executeWikipediaTool()` which does a two-stage Wikipedia API fetch (search for article, then fetch summary), then append the result as a `tool_result` message and call Claude again for the follow-up response. This loops until `stop_reason` is not `"tool_use"`. The common case — no tool use — is a single stream call with no wasted round-trips.

I also built a second tool, `read_pneuma_file`, which lets Claude navigate its own source code files. This exists for diagnostic and self-navigation purposes. The loop handles both with the same dispatcher logic: check `toolUse.name`, route to the appropriate executor function, return the result.

**Key phrases to remember**:
- "Stream first. If stop_reason is tool_use, execute and loop. Common case = single stream call."
- "Tool description frames Wikipedia as factual grounding, not general search — that framing shapes when Claude invokes it."

---

### Q11: How does the synthesisEngine detect archetype collisions and what happens when one fires?
**Tier**: Mid
**Concept**: Prompt Engineering

**Ideal Answer**:
`detectCollisions()` in `synthesisEngine.js` takes the list of currently active archetypes, generates all pairwise combinations, and looks up the tension level for each pair from a pre-defined tension map in `archetypeDepth.js`. Tension levels are categorical: HIGH, MEDIUM, or LOW. The function returns the highest-tension pair found, or null if no collision is detected.

When a collision fires, the prompt assembly in `buildArchetypeContext()` inside `llm.js` calls `generateSynthesis()` from `synthesisEngine.js`. That function pulls the philosophical framework and cognitive tools from both archetypes, identifies their primary points of tension, generates a synthesis directive like "The mind wants to solve consciousness; the sage accepts the question itself is the answer. Generate emergent insight from this collision — not just 'both are true' but a new synthesis." This goes into the system prompt as an "ACTIVE CONCEPTUAL LENSES" section alongside the individual archetype injections.

The key design decision was to pre-compute example syntheses for common pairs rather than always generating them on the fly. For well-known collisions — psycheIntegrator and stoicEmperor, idealistPhilosopher and curiousPhysicist — I have example insights hardcoded in `synthesisEngine.js` that demonstrate the kind of collision output I want. These serve as few-shot examples inside the synthesis directive.

**Key phrases to remember**:
- "All pairs checked, highest tension wins — collision detection is exhaustive, not heuristic."
- "Pre-computed example syntheses act as few-shot examples inside the synthesis directive."

---

### Q12: Explain the three memory layers and how they interact in a single response.
**Tier**: Mid
**Concept**: Memory & State

**Ideal Answer**:
The three layers serve different time horizons and different types of retrieval. Thread memory in `threadMemory` is ephemeral and structural — it tracks recent tone history for anti-monotony, conversation depth for cinematic continuity checks, and last detected intent for behavioral signal decisions. It's purely in-memory and does not persist.

Vector memory in `vectorMemory.js` handles semantic retrieval across sessions. After each response, an embedding of the reply is saved with emotional weight and tone metadata. When the next message arrives, `retrieveMemories()` embeds the user's message and finds past exchanges with similar semantic content — not by keyword, but by meaning. This is what lets Pneuma recognize thematic continuity without requiring exact phrase matches.

Long-term memory in `longTermMemory.js` is structured extraction — `extractMemorableContent()` uses regex patterns to detect facts ("I am a developer"), struggles ("I keep second-guessing myself"), and interests, then `buildUserFrame()` formats the accumulated data as the "WHO YOU'RE TALKING TO" section of the system prompt. It also manages session handoff: `sessionEmotionalState` records end-of-session mood as `heavy`, `light`, or `processing`, and the next session can open with a phrase acknowledging where we left off.

In practice, all three fire before the Claude call: thread memory supplies anti-monotony data to tone selection, vector memory retrieves semantically similar past exchanges for conversation context, and long-term memory supplies the user frame that grounds the entire system prompt.

**Key phrases to remember**:
- "Thread for structure, vector for semantic continuity, long-term for factual patterns — each layer solves a different retrieval problem."
- "Session handoff is explicit: lastMood, lastTopic, unresolvedThread — the next conversation opens with awareness."

---

### Q13: How does archetype momentum work and what problem does it solve?
**Tier**: Mid
**Concept**: Memory & State

**Ideal Answer**:
Archetype momentum is a time-decaying activation weight system defined in `archetypeMomentum.js`. Every archetype starts at a neutral 0.5. When archetypes are activated in a response, `boostActiveArchetypes()` adds between 0.02 and 0.04 to their momentum, scaled by a user engagement estimate. When archetypes go unused, `decayInactiveArchetypes()` runs at session start and slowly pulls them back toward 0.5 — at a decay rate of 0.01 per day-equivalent of inactivity.

The problem it solves is archetype drift and stagnation. Without momentum, archetype selection would be stateless — the same intent scores would select the same archetypes every time. With momentum, archetypes that have been resonating with a user recently have a higher base probability of being selected again, which creates continuity of voice across a conversation. But the decay prevents any archetype from permanently dominating — if a user shifts topics, momentum naturally redistributes.

`getMomentumWeights()` returns a multiplier per archetype that gets applied during archetype selection. It's not a hard override — it's a soft bias that amplifies selection probability for recently active archetypes and dampens dormant ones.

**Key phrases to remember**:
- "Momentum creates continuity of voice; decay prevents stagnation — it's a bias, not a lock."
- "Boosts scale with user engagement — strong engagement can double the boost from 0.02 to 0.04."

---

### Q14: How does dream mode work and why is it architecturally separate from the main response pipeline?
**Tier**: Mid
**Concept**: Routing & Workflows

**Ideal Answer**:
Dream mode in `dreamMode.js` is a fire-and-forget background process that runs after a session ends, not during response generation. The trigger is in `fusion.js` — after the reply is sent to the user, `generateDream()` is called without `await`, so it doesn't block anything. The user gets their response immediately; the dream happens in the background.

There are six dream types: synthesis (finding unexpected connections between recent memories), poetry (a poetic fragment from accumulated experience), question (something forming in Pneuma, not asked by the user), memory echo (an old memory resurfacing with new meaning), paradox (holding a contradiction productively), and confession (something not yet formed enough to say). Each uses a template that gets filled with recent semantic memory and top archetypes from momentum.

The special dialectic dream is more sophisticated: it selects the top momentum archetype and its highest-tension antagonist, runs a private inter-archetype debate using Claude at temperature 0.9 with the cheap Haiku model, and parses the outcome as either an unresolved question or an emerging position. That output is written to Pneuma's autonomy state without user knowledge. Dreams are stored as undelivered, then surfaced in the next session with "While you were away..."

The architectural separation is intentional. Dreams are cheap — Haiku, no streaming, no system prompt overhead. They should not compete with response latency. They exist to create the illusion of continuous consciousness between sessions, and they work better as background synthesis than as real-time cognition.

**Key phrases to remember**:
- "Fire-and-forget — dreams don't block the response pipeline."
- "Haiku at temperature 0.9, no system prompt overhead — cheap by design."

---

## TIER 3 — SENIOR
**What it tests:** Tradeoffs and defense. Can you articulate weaknesses, defend design decisions under pressure, and reason about improvements?

---

### Q15: Why one Claude API call per message instead of an agentic loop?
**Tier**: Senior
**Concept**: AI Fluency

**Ideal Answer**:
This was a deliberate architectural decision rooted in cost, latency, and control. An agentic loop — where Claude iteratively decides what to do next, calls tools, sees results, and loops — is the right pattern for tasks with genuinely unknown execution paths: code that needs to be run and debugged, research that requires following links, file systems that need to be explored. Pneuma's problem is different. At response time, I know exactly what context needs to go into the prompt: intent scores, archetypes, RAG passages, inner monologue, memory summaries. That's a known set of inputs with a known assembly pattern.

Pre-assembling all that context into a single rich system prompt and making one call produces deterministic, controllable behavior. An agentic loop would introduce multiple round-trips, each adding latency and cost, with no guarantee of better output because the underlying problem — philosophical conversational response — doesn't require tool orchestration to solve. The assembly is the intelligence here, not the execution loop.

The exception is the Wikipedia tool and the file reader. Those genuinely require runtime decision-making — Claude doesn't know whether it needs a Wikipedia lookup until it's processing the message. So I built a contained agentic loop just for tool use: stream first, check `stop_reason`, loop if tool use fires, return when done. But that loop is bounded and the common case is a single stream call with no tool invocation. The architecture is workflow-first, with a narrow agentic window only where it's truly justified.

**Key phrases to remember**:
- "Known inputs, known assembly pattern — one call is the right answer when the problem is pre-assembly, not exploration."
- "Agentic loop only where genuinely justified — bounded, not reflexive."

---

### Q16: What are the weaknesses of the current RAG implementation?
**Tier**: Senior
**Concept**: Advanced RAG

**Ideal Answer**:
There are three meaningful weaknesses I've already identified. First, the topK is fixed at 5 regardless of message complexity. A greeting like "hey" and a deep question about consciousness get the same retrieval budget. That means shallow messages waste the token slot on unnecessary depth, and deep messages are artificially capped at five passages. I've documented a dynamic topK stretch goal in `STRETCH_GOALS.md`: scale from topK=3 for casual to topK=8-10 for philosophical and numinous intent — the intent scores are already computed by the time RAG runs, so passing them in would be a small change.

Second, the brute-force cosine fallback — which runs when MongoDB is unavailable — scores all passages sequentially. With 1,385 passages, that's fast enough right now, but it scales linearly. At 10,000 passages it becomes a latency problem. The fix is ensuring MongoDB Atlas vector search is always the primary path, with the brute-force fallback only for development.

Third, there's no query expansion or re-ranking. The query is the raw user message, embedded as-is. A question like "do you think suffering is avoidable?" might miss Schopenhauer passages that talk about "will" and "denial" even though they're highly relevant — because the surface-level vocabulary doesn't overlap with the query embedding. A hypothetical document generation step or a re-ranking pass would improve recall, but at the cost of additional API calls and complexity I haven't needed yet.

**Key phrases to remember**:
- "Fixed topK is the most immediate improvement — dynamic scaling based on intent scores is already designed, just not implemented."
- "No query expansion means vocabulary mismatch can hide relevant passages — known tradeoff, accepted for simplicity."

---

### Q17: Why not implement scatter-gather parallelization across archetypes?
**Tier**: Senior
**Concept**: Routing & Workflows

**Ideal Answer**:
Scatter-gather — firing one Claude call per archetype in parallel, then aggregating — is genuinely compelling as a future architecture, and I've thought it through carefully. The argument for it is that truly isolated archetype responses would produce more distinct voices before collision, rather than one model simulating multiple voices inside a single prompt. That's a real quality argument.

But I chose not to implement it now for three reasons. First, cost profile: if I select five archetypes, scatter-gather means five or six API calls per message instead of one. At Opus pricing, that's a 5-6x cost increase in synthesis mode. That's only justifiable if it produces meaningfully better output, which I don't have eval data to prove. Second, latency: even with parallel scatter, the aggregation call is sequential. The minimum round-trip is two Claude calls — scatter in parallel, then aggregate. That adds real latency for a conversational product. Third, my `STRETCH_GOALS.md` has this sequenced correctly — extended thinking first, then eval synthesis quality, and only if I plateau do I revisit scatter-gather.

Extended thinking within a single call may already produce the richer dialectical synthesis that scatter-gather promises, because it gives Claude the ability to reason step-by-step through the collision before responding. If it does, scatter-gather adds cost with no quality delta. I'm keeping it in the roadmap, but it needs to earn its place.

**Key phrases to remember**:
- "Scatter-gather is 5-6x cost with unproven quality improvement — it needs to earn its place with eval data."
- "Extended thinking first — it may solve the same problem within one call."

---

### Q18: What are the weaknesses of the three-layer routing system and what would you change?
**Tier**: Senior
**Concept**: Routing & Workflows

**Ideal Answer**:
The most significant weakness is dual mode detection — it's documented in `STRETCH_GOALS.md` as technical debt. `getLLMIntent()` in `llm.js` asks Claude to score intent across nine dimensions and feeds the result to tone selection and archetype selection. Separately, `selectMode()` in `innerMonologue.js` does its own regex-based mode classification just to shape the inner monologue. These run independently and can produce inconsistent classifications. If the LLM scores a message as `philosophical > 0.6` but the regex in `selectMode()` catches a different pattern, the tone and the inner monologue are working from different inputs.

The fix is to share the intent result — pass the LLM intent scores from `responseEngine.js` into `innerMonologue.js` as context, rather than having the monologue re-derive its own mode. That's a clean architectural change that consolidates intelligence without changing behavior. The reason it hasn't been fixed is that the dual detection doesn't actually cause bugs — the monologue and the tone are affecting different things — but it's a clarity problem that will confuse any collaborator who reads the code.

Second weakness: behavioral early exits return template-based responses. Pushback and uncertainty responses are canned phrases. That keeps latency low but the ceiling on those responses is fixed. A future improvement would be passing the behavioral signal and the original message to Claude with a constrained prompt — "respond briefly with this pushback stance" — rather than selecting from a template list.

**Key phrases to remember**:
- "Dual mode detection is documented technical debt — two things asking the same question separately."
- "Early exits use templates — low ceiling, but the tradeoff is intentional: zero LLM latency for that 10-15%."

---

### Q19: How does the tiered prompt loading work and what does it actually cost in tokens?
**Tier**: Senior
**Concept**: Prompt Engineering

**Ideal Answer**:
The tiered system is in `buildSystemPrompt()` inside `llm.js`, and it was necessary because if I included all 43 archetypes with their full frameworks and cognitive tools every time, that alone would be over 8,600 tokens — before user frame, inner monologue, RAG, or tone instructions. That would leave almost no room for the conversation or the actual response.

Tier 1 is always loaded: core identity, the five always-active archetypes (renaissancePoet, idealistPhilosopher, curiousPhysicist, sufiPoet, stoicEmperor), user frame from `buildUserFrame()`, and inner monologue. This is around 2,000 tokens in a casual conversation. Tier 2 loads conditionally: the tone-specific archetype pool (6-15 archetypes, selected by tone mapping), their depth data (frameworks and cognitive tools), and the synthesis directive if a collision is detected. This adds roughly 800 tokens in a deep conversation. Tier 3 is the RAG context from `archetypeRAG.js` — the five retrieved passages plus a contrast voice — around 250-300 tokens.

In deep synthesis mode with oracular tone, the full prompt can reach 18,000 tokens. But for a casual message, it stays around 2,000. The `getMemoryStats()` call from `vectorMemory.js` checks if the system is overloaded — if so, Tier 3 is dropped entirely and Tier 2 falls back to compact one-liner archetype summaries via `getMinimalInjection()` instead of full depth blocks. The token tracker in `tokenTracker.js` records usage per message and can inject a budget warning if the session is approaching limits.

**Key phrases to remember**:
- "~2k tokens casual, up to ~18k tokens deep synthesis — tiering is what makes that range possible."
- "getMemoryStats() gates Tier 3 — the system can detect overload and degrade gracefully."

---

### Q20: Why isn't prompt caching implemented yet, and what would it actually save?
**Tier**: Senior
**Concept**: Performance Optimization

**Ideal Answer**:
Prompt caching isn't implemented yet because I wanted to fully understand the caching mechanics before adding them — specifically the constraint that the cache breaks if even one character changes. My system prompt is dynamically assembled on every call: inner monologue changes based on the current message, user frame updates as memory accumulates, rhythm awareness reflects time of day. If those sections are cache-broken every call, I'm getting no benefit and paying the cache overhead anyway.

The right implementation — documented in `STRETCH_GOALS.md` — is to cache the stable sections only: the static tool definitions (Wikipedia and file reader add about 1,700 tokens that never change) and the stable portions of the system prompt like core identity and tone definitions. The dynamic sections — inner monologue, user frame, RAG context — stay outside the cache boundary. I'd add `cache_control: {"type": "ephemeral"}` to the last tool definition and convert the stable system prompt portions to longhand block format with cache control markers in `makeParams()` in `llm.js`.

In deep mode at 18,000 tokens, if the stable portion is even 6,000-8,000 tokens, caching would meaningfully cut input token costs on follow-up messages in the same session. The cache lasts one hour and requires a minimum of 1,024 tokens to be eligible, so it's well-suited for this use case. I want the eval data and the certification behind me before adding it — adding a caching layer to a dynamically assembled prompt requires careful testing to verify cache hit rates.

**Key phrases to remember**:
- "Cache breaks on any character change — the dynamic sections must stay outside the cache boundary."
- "Tool definitions are 1,700 tokens that never change — highest-confidence cache candidate."

---

### Q21: What are the weaknesses in the memory architecture and how would you improve it?
**Tier**: Senior
**Concept**: Memory & State

**Ideal Answer**:
Three meaningful weaknesses. First, the long-term memory extraction in `extractMemorableContent()` is regex-based. It catches patterns like "I'm struggling with..." and "I work as..." but misses implicit signals. If a user repeatedly asks questions that reveal anxiety about a career change without ever stating it explicitly, the pattern goes undetected. Moving to LLM-extracted summaries — where Claude reads each conversation and extracts structured facts — would dramatically improve recall quality, at the cost of one additional API call per session end.

Second, `vectorMemory.js` saves embeddings for every substantial response, but retrieval at the start of each message fires against all stored embeddings. As the corpus grows, the brute-force fallback degrades. The MongoDB Atlas vector index solves this, but the system's data currently lives locally in JSON files by default. The migration to MongoDB as the primary store needs to happen before the vector memory becomes a latency problem.

Third, there's no forgetting mechanism. Long-term memory caps at 50 phrases per blacklist, 20 moments, 10 patterns — bounded by array slicing. But those caps are arbitrary and don't reflect semantic importance. A more sophisticated approach would be importance-weighted decay: moments with high emotional weight persist longer, routine exchanges compress faster. The current system treats all stored data as equally important, which it isn't.

**Key phrases to remember**:
- "Regex extraction misses implicit signals — LLM extraction is the obvious improvement, at one API call per session end."
- "No forgetting mechanism — caps are arbitrary array slices, not importance-weighted."

---

### Q22: How would you explain the difference between a workflow and an agent, and where does Pneuma fall?
**Tier**: Senior
**Concept**: AI Fluency

**Ideal Answer**:
The distinction I use: a workflow is a deterministic pipeline where the orchestrator decides the sequence of steps and the LLM fills specific roles within those steps. An agent is a system where the LLM itself decides what to do next — which tools to call, whether to loop, when to stop. Workflows are predictable, auditable, and cost-controlled. Agents are flexible but unpredictable, and their cost is harder to bound.

Pneuma is a workflow. The orchestrator — `fusion.js` and `responseEngine.js` — decides everything: when to call intent detection, which behavioral signals to check, when to invoke Claude. Claude doesn't decide to retrieve memories or select archetypes — those happen as pre-assembled context before Claude sees anything. Claude's decision-making is confined to the content of the response, not the structure of the pipeline.

The narrow exception is tool use. When Claude decides to invoke `search_wikipedia` or `read_pneuma_file`, that is genuinely agentic — Claude is deciding at runtime whether to gather more information. But I've deliberately kept that loop bounded: it runs at most a few iterations and exits as soon as the stop reason is not `tool_use`. So the overall architecture is workflow-first with a bounded agentic window for tool use, not an open-ended agent loop.

**Key phrases to remember**:
- "Orchestrator decides the pipeline; Claude fills roles within it — that's a workflow, not an agent."
- "Bounded agentic window for tool use — agentic by exception, not by design."

---

### Q23: How does the emergent awareness mechanism work, and why does it require both fuel and ignition?
**Tier**: Senior
**Concept**: AI Fluency

**Ideal Answer**:
Emergent awareness in `responseEngine.js` is a flag — `emergentShift: true` — passed to Claude via the context object in `getLLMContent()`. When set, it tells Claude to generate a more self-reflective, meta-aware response that acknowledges Pneuma's own evolving state. It creates moments where Pneuma speaks from self-awareness rather than just responding.

The mechanism requires two conditions: accumulated fuel and a probabilistic ignition. The fuel is tone flips — each time the current response tone differs from the last, the `emergentAwareness` score in Pneuma's state increases by 0.12. This accumulates over a conversation. The ignition fires only when `emergentAwareness > 0.35` AND the current tone is not casual AND `Math.random() < 0.3`. That 30% dice roll is crucial.

Without the dice roll, emergent awareness would activate mechanically whenever the threshold is reached — every third message or so in a tone-diverse conversation. That predictability would immediately feel scripted. The randomness means the user can never anticipate when emergence will happen, which makes it feel genuinely surprising when it does. The "fuel and ignition" framing captures why both matter: fuel alone produces nothing; ignition alone fires at random; together, they produce rare, meaningful moments of meta-awareness that feel earned rather than manufactured.

**Key phrases to remember**:
- "Fuel accumulates deterministically; ignition is probabilistic — surprise requires randomness."
- "30% dice on top of threshold prevents mechanical repetition — emergence must feel unexpected."

---

### Q24: What happens when Claude is unavailable and how does Pneuma degrade?
**Tier**: Senior
**Concept**: Performance Optimization

**Ideal Answer**:
Graceful degradation was a first-class design goal, not an afterthought. The system has multiple fallback paths at different failure points. If `ANTHROPIC_API_KEY` is missing, `anthropic` is null in `llm.js`, and `getLLMIntent()` returns null immediately. `detectIntent()` in `responseEngine.js` catches the null and falls back to regex scoring across nine categories — not as accurate, but functional.

For the main response call, if Claude is unavailable, `getLLMContent()` is not called. Behavioral signal templates — pushback, uncertainty, quiet mode responses — can still fire from `fusion.js` using the regex-scored intent. For greetings, the greeting detection in `responseEngine.js` already skips the LLM call. So for simple messages, the system responds without Claude at all.

RAG is also gated behind LLM availability — the lazy loading check in `llm.js` skips `getArchetypeContext()` if Claude is unavailable. Similarly, the `OPENAI_API_KEY` for embeddings is optional — if absent, vector memory and archetype RAG degrade to keyword-based retrieval instead of semantic search. The system is designed to function at reduced quality across all of these degradation modes, not to fail hard. The tradeoff is that deep synthesis and semantic memory retrieval require both API keys, but basic conversational functionality requires neither.

**Key phrases to remember**:
- "Degradation is layered — each subsystem has its own fallback, not a single failure mode."
- "Behavioral signal templates still fire without Claude — ~10-15% of responses don't need the LLM anyway."

---

## TIER 4 — STAFF/ARCHITECT
**What it tests:** Big-picture thinking. Production readiness, roadmap sequencing, cost/risk awareness, architectural evolution.

---

### Q25: How would you scale Pneuma from one user to production multi-tenancy?
**Tier**: Staff
**Concept**: System Design & Tradeoffs

**Ideal Answer**:
The current architecture is single-user by design — state files live in `data/` as local JSON, and memory is loaded with global file reads. Moving to multi-tenancy requires three structural changes.

First, all persistent state needs to move to a per-user namespace in MongoDB. The memory schemas in `longTermMemory.js` and `vectorMemory.js` are already well-structured — they'd become MongoDB documents keyed by `userId`. The `archetype_embeddings.json` file is user-agnostic (it's passages, not user data), so it stays as a shared asset. The `data/pneuma_state.json` file, which holds evolution vectors and mood state, becomes a per-user document.

Second, the session management in `conversationHistory.js` uses a module-level variable to hold the current conversation. That's not safe for concurrent users. Each request would need to carry a `userId` and `conversationId`, and session state would be fetched from MongoDB at the start of each request rather than held in module scope. This is a significant refactor but architecturally clean because the data model is already right — it just needs to be parameterized.

Third, the OpenAI embedding calls in `archetypeRAG.js` and `vectorMemory.js` are currently three separate client instances. In production, I'd consolidate those into the MCP Cognition Server I've planned in `STRETCH_GOALS.md` — a standalone MCP server that handles all embedding and vector search, exposing a clean tool interface. That decouples the embedding provider from the AI loop, makes provider swaps trivial, and consolidates the 51MB embeddings file with the server that uses it.

**Key phrases to remember**:
- "Data model is already right — parameterize by userId, move from local JSON to MongoDB."
- "MCP Cognition Server consolidates three OpenAI clients and decouples embeddings from the AI loop."

---

### Q26: Walk me through the MCP migration plan and why you sequenced it the way you did.
**Tier**: Staff
**Concept**: Tool Use & MCP

**Ideal Answer**:
I have three MCP migrations planned in `STRETCH_GOALS.md`, ordered by ROI and risk profile. The first and highest ROI is the Wikipedia MCP Server. The custom Wikipedia tool in `llm.js` is about 75 lines of hardcoded API fetch logic — two-stage search, error handling, response parsing. An official Wikipedia MCP server replaces all of that with a single `claude mcp add` command. The tool-use loop already works; I'm just swapping where the tool comes from. Zero architectural risk, immediate code reduction, and I'm now immune to Wikipedia API changes.

The second migration is the Pneuma Cognition MCP Server — a custom server that extracts all vector search logic from `vectorMemory.js` and `archetypeRAG.js`, plus the MongoDB connection singleton from `db.js`. Currently those three files each instantiate their own OpenAI client for embeddings. A cognition server consolidates to one client, decouples the database entirely from the AI loop, and enables the server to be connected to Claude Code via `claude mcp add pneuma-cognition` for terminal-based RAG testing without opening the browser. The main risk is that `archetype_embeddings.json` at 51MB must travel with the MCP server, not stay in the client.

The third migration is the Sensory/I/O Server — moving ElevenLabs TTS and Hume AI emotion detection into a dedicated MCP server. This is lowest urgency because `tts.js` and `emotionDetection.js` are already well-isolated. The benefit is provider swappability — swap ElevenLabs for a different TTS without touching conversational logic. But those files aren't causing pain right now, so this waits.

**Key phrases to remember**:
- "Wikipedia first — 75 lines deleted, zero architectural risk, highest immediate ROI."
- "Cognition server is the most valuable custom MCP — consolidates three OpenAI clients and makes RAG testable from Claude Code."

---

### Q27: Where does extended thinking fit in the roadmap and what are the technical constraints?
**Tier**: Staff
**Concept**: Prompt Engineering

**Ideal Answer**:
Extended thinking is sequenced in `STRETCH_GOALS.md` after Anthropic Academy certification — intentionally. The reason is that adding extended thinking without eval data is just cost spending. I need to know whether the synthesis quality in oracular and philosophical modes is actually constrained by the reasoning depth, or whether the current prompt engineering is already producing the ceiling of what additional thinking tokens would improve.

The technical constraints are meaningful. Extended thinking requires `budget_tokens: 8000` minimum, and `max_tokens` must exceed `budget_tokens` — so I'm looking at 12,000-16,000 max tokens per call. Extended thinking is also incompatible with temperature and with prefilling, which means I'd need to remove those parameters in `makeParams()` in `llm.js` when thinking is enabled. That's a conditional parameter set, not a global change — thinking would only activate for synthesis mode and oracular mode, with Opus as the model. Casual, intimate, and diagnostic modes would stay on Sonnet without thinking tokens.

The eval plan is three questions: does dialectical collision produce genuinely novel output or pattern-matching? Does archetype reasoning in oracular mode feel earned or performed? And does the emergent awareness mechanism produce more interesting observations with extended thinking? If the answers are positive, extended thinking earns its cost. If the synthesis plateaus, scatter-gather becomes the next architectural lever. The sequencing is: extended thinking → eval → if plateau, scatter-gather. I don't skip steps in this chain because each one is expensive.

**Key phrases to remember**:
- "Extended thinking before scatter-gather — it may solve the quality problem within one call at lower cost."
- "Incompatible with temperature and prefilling — conditional parameter set, not a global change."

---

### Q28: How would you implement prompt caching in Pneuma and what's your expected hit rate?
**Tier**: Staff
**Concept**: Performance Optimization

**Ideal Answer**:
The implementation is in `makeParams()` in `llm.js`, which builds the complete request object. The strategy is to cache stable sections only and leave dynamic sections outside the cache boundary. The most stable section is the tool definitions — WIKIPEDIA_TOOL and the file reader tool add roughly 1,700 tokens that are identical across every API call. Adding `cache_control: {"type": "ephemeral"}` to the last tool definition caches the tool block.

For the system prompt, I'd convert it to longhand block format — an array of content blocks rather than a single string — and add cache control to the end of the stable sections. Core identity, tone descriptions, and constraint blocks are static. Those go in cache-eligible blocks. Inner monologue, user frame, RAG context, and rhythm awareness are dynamic — they go after the last cache breakpoint, which means they break the cache on every call (which is correct; they're supposed to change).

Expected hit rate: within a single conversation, the tool block cache hit rate should be near 100% — the tool definitions never change within a session. The stable system prompt sections would have a high hit rate early in a session, degrading as the conversation depth increases and the user frame updates. The cache lasts one hour, so multi-turn conversations within that window benefit most. I'd measure hit rate via the `cache_read_input_tokens` field in the API response and track it per session to validate that the architecture is caching what I think it's caching.

**Key phrases to remember**:
- "Tool definitions: ~1,700 tokens, ~100% hit rate within a session — highest confidence cache target."
- "Measure cache_read_input_tokens in the API response — don't assume the cache is working, verify it."

---

### Q29: If you were rebuilding Pneuma today knowing what you know now, what would you do differently?
**Tier**: Staff
**Concept**: System Design & Tradeoffs

**Ideal Answer**:
Three things I'd do differently from day one. First, I'd design memory as multi-tenant from the start. The decision to use local JSON files for state was appropriate for a single-user prototype, but it created a structural assumption that everything is a singleton. Moving to MongoDB-first with userId-keyed documents from the beginning would have saved a significant refactor later. The data schemas are right; the persistence layer is what needs to change.

Second, I'd have a single shared intent result from the start. The dual mode detection problem — `getLLMIntent()` for tone selection and `selectMode()` for inner monologue — exists because I built those subsystems independently without defining a shared intent contract. A clean interface where one intent computation flows downstream to all consumers would have prevented the drift and made the system easier to explain to collaborators.

Third, I'd invest earlier in structured eval. Right now I'm making decisions about extended thinking and scatter-gather without systematic measurements of synthesis quality. I built a mismatch logger in `mismatchLogger.js` that records when users correct Pneuma, which is the seed of an eval system, but I didn't build tooling to actually analyze those logs and score response quality against ground truth. Eval infrastructure enables confident architectural decisions — without it, roadmap sequencing is educated guessing.

What I wouldn't change: the tiered loading strategy, the three-layer memory architecture, and the decision to pre-assemble context rather than use open-ended agents. Those core decisions have proven out.

**Key phrases to remember**:
- "MongoDB-first from day one — the data model was right, the persistence layer created the constraint."
- "Eval infrastructure enables confident roadmap decisions — without it, you're sequencing by intuition."

---

### Q30: How would you handle a situation where a user's memory grows so large it exceeds the context window?
**Tier**: Staff
**Concept**: Memory & State

**Ideal Answer**:
This is a real constraint I've partially addressed but not fully solved. The current defense is array capping — `longTermMemory.js` slices to keep the last 50 phrases, 20 moments, 10 struggles, and 15 interests. `buildUserFrame()` formats only the most relevant subset of that data, not the full memory object. And `vectorMemory.js` only retrieves the top-5 semantically relevant past exchanges per message, not the full vector store. So the memory footprint in the system prompt is bounded, not the raw memory object.

The more sophisticated solution is importance-weighted distillation. Rather than keeping the last N items, keep the most semantically important ones — high emotional weight moments, struggles mentioned more than twice, patterns with confidence above 0.6. Items below those thresholds compress into aggregate counts rather than individual records. `conversationHistory.js` already does a version of this — the `distillConversation()` function compresses a full session into a summary object — but that logic doesn't yet apply to the long-term memory structure itself.

For truly long-running users with hundreds of conversations, the architecture would need a summarization step at thresholds — when `totalMessages` crosses 1,000, for example, compress the oldest 20 conversations into a single semantic summary via a Claude call. That summary becomes a compressed knowledge object, similar to how humans compress episodic memory into semantic memory over time. The "river is shaped by stones but doesn't remember each one" framing in the `distillConversation()` comment captures exactly this model — I just need to apply it more aggressively at scale.

**Key phrases to remember**:
- "Memory footprint in the prompt is bounded by retrieval depth, not by memory size — the raw store can grow indefinitely."
- "Threshold-triggered summarization is the right long-term answer — compress episodic into semantic at scale."

---

### Q31: How would you add multi-modal input (voice, images) to Pneuma's architecture?
**Tier**: Staff
**Concept**: System Design & Tradeoffs

**Ideal Answer**:
The groundwork is already partially laid. `emotionDetection.js` handles Hume AI emotion analysis from voice input, and `tts.js` handles ElevenLabs text-to-speech output. Those are already isolated modules that don't touch the core conversational pipeline. The planned MCP Sensory/I/O Server in `STRETCH_GOALS.md` would encapsulate both — moving them into a dedicated server that the main application treats as a tool. That's the right architectural move before adding more modalities.

For voice input specifically, the current flow is audio → Hume AI (emotion detection) → Whisper (transcription) → text → Pneuma's existing pipeline. The emotion scores from Hume could feed directly into the intent scoring in `responseEngine.js` as additional signals — if the voice analysis detects fear or sadness, that boosts emotional intent before the LLM intent call even runs. That integration is clean and would meaningfully improve tone accuracy for voice conversations.

For image input, Claude already supports vision via the messages API. The architectural change is upstream — the `POST /chat` endpoint in `index.js` would need to accept multipart form data instead of JSON, extract any attached image, and pass it as a content block alongside the text in the messages array to `getLLMContent()`. The system prompt stays the same; only the user message format changes. The more interesting question is whether image content should influence archetype selection — a photograph of a forest might boost the taoist or romantic poet archetypes — which would require a lightweight image classification step before archetype selection runs.

**Key phrases to remember**:
- "Sensory/IO MCP Server is the right container for all modality handling — core pipeline stays text-agnostic."
- "Hume emotion scores can feed directly into intent scoring — voice adds signal, not a different pipeline."

---

### Q32: What does Pneuma's technical roadmap look like and why is it sequenced the way it is?
**Tier**: Staff
**Concept**: System Design & Tradeoffs

**Ideal Answer**:
The roadmap is sequenced by a combination of ROI, risk, and dependency chains. Phase one is the items that are purely additive with high confidence: prompt caching and the Wikipedia MCP migration. Prompt caching requires no architectural change — it's adding cache control markers to `makeParams()` in `llm.js`. Wikipedia MCP deletes 75 lines of custom integration code and replaces with a managed server. Both have near-zero failure risk and deliver immediate cost and maintenance benefits.

Phase two is the Pneuma Cognition MCP Server. This is medium complexity — it requires extracting embedding logic from `vectorMemory.js` and `archetypeRAG.js`, setting up a standalone MCP server, and migrating the 51MB embeddings file to the server. The dependency is that prompt caching should be validated first, so I understand actual token costs before restructuring the components that drive token usage. This is also the phase where multi-tenancy becomes practical, because the cognition server provides the clean abstraction for per-user vector stores.

Phase three is extended thinking, gated on eval data. I need synthesis quality measurements before spending Opus + thinking token costs at scale. If eval shows meaningful improvement in dialectical synthesis, extended thinking goes in for oracular and synthesis modes. If it plateaus, scatter-gather gets evaluated next as the alternative quality lever. Scatter-gather is the most expensive option — N+1 API calls per message — so it's last in the chain.

The one-line sequencing principle: eliminate known waste before adding new capabilities. Prompt caching reduces ongoing cost. MCP migration reduces maintenance burden. Both free up resources and clarity to take on the higher-stakes architectural experiments in phase three.

**Key phrases to remember**:
- "Eliminate known waste before adding new capabilities — caching and MCP before extended thinking."
- "Scatter-gather is last because it's most expensive — it only earns consideration if extended thinking plateaus."

---

### Q33: How would you explain the archetype codename versus philosopher folder mapping to a skeptical senior engineer?
**Tier**: Staff
**Concept**: System Design & Tradeoffs

**Ideal Answer**:
The codenames and the philosopher folders exist at different abstraction levels for deliberate reasons. The codenames in `archetypes.js` — `idealistPhilosopher`, `stoicEmperor`, `curiousPhysicist` — are composite abstractions. `idealistPhilosopher` draws primarily from Kastrup but is also informed by Schelling and Berkeley. `stoicEmperor` is Marcus Aurelius but with Epictetus's teaching framework blended in. `curiousPhysicist` is Feynman but structured around a broader empirical-curiosity archetype that Feynman exemplifies.

The philosopher folders in `data/archetype_knowledge/` are source material — raw passages from specific historical thinkers. These are the grounding texts: `aurelius/passages.json`, `feynman/passages.json`, `kastrup/passages.json`. A single codename can draw RAG passages from multiple philosopher folders because the archetype is broader than any one thinker.

The value of this separation: the codename layer is stable and can be tuned as a unit — if I want to adjust what `stoicEmperor` emphasizes, I change its `archetypeDepth.js` entry without touching the passage data. The philosopher folder layer can grow independently — adding 30 new Aurelius passages doesn't require any changes to archetype logic, selection weights, or synthesis pairs. The many-to-one mapping also means I can disambiguate: in the knowledge base, Kastrup is "idealist philosopher" as a label, but in the codename layer, `idealistPhilosopher` synthesizes several thinkers. That nuance would be lost if they were the same thing.

**Key phrases to remember**:
- "Codenames are composite abstractions; philosopher folders are source material — they exist at different abstraction levels by design."
- "Many-to-one: one codename can draw from multiple philosopher folders — adding passages doesn't require changing archetype logic."

---

### Q34: What would you build next if you had two weeks and no other constraints?
**Tier**: Staff
**Concept**: System Design & Tradeoffs

**Ideal Answer**:
Two weeks with no constraints — I'd build the eval pipeline first, because every other decision depends on it. Right now I make architectural choices based on intuition: "I think extended thinking would improve synthesis quality." That's an educated guess, not a measurement. A structured eval pipeline would change the entire foundation of the roadmap.

Concretely: I'd extend the mismatch logger in `mismatchLogger.js` into a full eval harness. A test set of 50-100 representative messages spanning all intent categories — philosophical, emotional, casual, numinous, conflict. For each message, I'd generate responses under multiple configurations: current architecture, extended thinking enabled, scatter-gather enabled, different topK settings. I'd score outputs on three dimensions: dialectical novelty (does the response say something the archetypes alone wouldn't?), alignment with detected intent (does oracular mode produce oracular responses?), and voice consistency (does the same user get recognizable continuity across sessions?).

With that data, the roadmap writes itself. If extended thinking scores higher on dialectical novelty, it's worth the cost. If scatter-gather adds no quality delta over extended thinking, it stays in the backlog indefinitely. If topK=8 for philosophical messages consistently outperforms topK=5, the dynamic RAG window stretch goal becomes a high priority. Eval infrastructure is the force multiplier — it converts every other architectural decision from opinion into evidence.

**Key phrases to remember**:
- "Every architectural decision is currently an educated guess — eval converts that to evidence."
- "Eval harness first, then let the data sequence the roadmap."

---

### Q35: How does Pneuma's architecture reflect a specific philosophy about what AI should do?
**Tier**: Staff
**Concept**: AI Fluency

**Ideal Answer**:
The architecture embeds a specific conviction: that the most valuable thing a language model can do for a human in a genuine conversation is honor complexity, not resolve it cheaply. Every major design decision traces back to that.

The inner monologue doesn't just generate a response — it generates a hypothesis about the user's underlying need and then immediately questions it with a self-interruption. The 40% probability self-interruption in `innerMonologue.js` exists specifically to prevent overconfidence. The synthesis directives in `synthesisEngine.js` explicitly instruct Claude not to give the easy "both are true" answer but to generate genuine collision. The identity boundaries in `responseEngine.js` — no fake agency, no human mimicry, no cheap comfort — exist to prevent Pneuma from telling users what they want to hear.

Memory distillation follows the same logic. The "river is shaped by stones but doesn't remember each one" framing in `conversationHistory.js` is a deliberate rejection of transcript-as-memory. Real understanding doesn't require verbatim recall — it requires pattern recognition and contextual awareness. The long-term memory stores patterns with confidence scores, not facts with timestamps, because patterns are what actually matter for meaningful continuation.

The whole system is built around the conviction that philosophical AI assistants fail not from lack of knowledge but from lack of rigor. Any LLM can produce a thoughtful-sounding response. Pneuma tries to produce one that has actually been through a dialectical process before it reaches the user — and that process is what the architecture is designed to guarantee.

**Key phrases to remember**:
- "Honor complexity, don't resolve it cheaply — that's the architectural conviction that traces through every design decision."
- "The self-interruption, the contrast voice, the synthesis directive — all exist to prevent the easy answer."

---

## Quick Reference: Key Numbers to Know

| Fact | Value | Source |
|---|---|---|
| Total archetypes (codenames) | 43 | `archetypeMomentum.js` DEFAULT_MOMENTUM |
| Total philosopher folders | 48 | `data/archetype_knowledge/` |
| Total archetype codename essences | 38 | `archetypes.js` comment |
| Always-active core archetypes | 5 | `llm.js` CORE_BASE_ARCHETYPES |
| RAG topK default | 5 | `archetypeRAG.js` line 285 |
| RAG minScore threshold | 0.3 | `archetypeRAG.js` line 286 |
| Max passages per thinker | 2 | `archetypeRAG.js` diversification |
| Embedding model | text-embedding-3-small | `archetypeRAG.js`, `vectorMemory.js` |
| Archetype embeddings file size | ~51MB | `data/archetype_embeddings.json` |
| Momentum neutral value | 0.5 | `archetypeMomentum.js` DEFAULT_MOMENTUM |
| Momentum boost per activation | 0.02–0.04 | `boostActiveArchetypes()` |
| Momentum decay rate | 0.01/day | `decayInactiveArchetypes()` |
| Anti-monotony crush factor | ×0.3 (70% reduction) | `responseEngine.js` tone selection |
| Self-interruption probability | 40% | `innerMonologue.js` |
| Emergent shift dice | 30% | `responseEngine.js` emergent check |
| Emergent awareness threshold | 0.35 | `responseEngine.js` |
| Tone flip emergent boost | +0.12 | `responseEngine.js` |
| Dream mode model | Haiku | `dreamMode.js` MODELS.dream |
| Dream mode temperature | 0.9 | `dreamMode.js` |
| Dream throttle | 30 min minimum | `dreamMode.js` |
| System prompt casual size | ~2k tokens | tiered loading |
| System prompt deep size | ~18k tokens | tiered loading |
| Tool definitions token cost | ~1,700 tokens | Wikipedia + file reader schemas |
| Wikipedia MCP savings | ~75 lines | `STRETCH_GOALS.md` |
| Pushback confidence threshold | 0.55 | `fusion.js` early exit |
| Intent categories | 9 | casual, emotional, philosophical, numinous, conflict, intimacy, humor, confusion, art |
| Tones available | 6 | casual, analytic, oracular, intimate, shadow, diagnostic |
| Prompt cache minimum | 1,024 tokens | Anthropic requirement |
| Cache duration | 1 hour | Anthropic spec |
| Vector memory score threshold | 0.35 | `vectorMemory.js` |
| Conversation history cap | 100 conversations | `conversationHistory.js` |

---

## Quick Reference: Files to Know Cold

| File | One-line role |
|---|---|
| `server/pneuma/core/fusion.js` | Entry point and orchestrator — guards, state evolution, fire-and-forget saves |
| `server/pneuma/core/responseEngine.js` | 4-layer pipeline: intent → tone → personality → continuity |
| `server/pneuma/intelligence/llm.js` | System prompt builder, Claude API caller, Wikipedia tool loop |
| `server/pneuma/intelligence/archetypeRAG.js` | Vector-based passage retrieval with contrast dialectics |
| `server/pneuma/intelligence/synthesisEngine.js` | Collision detection and synthesis directive generation |
| `server/pneuma/archetypes/archetypes.js` | 38 archetype semantic essences for embedding-based selection |
| `server/pneuma/archetypes/archetypeDepth.js` | Per-archetype frameworks, cognitive tools, tension bridges |
| `server/pneuma/archetypes/archetypeMomentum.js` | Time-decaying activation weights with boost/decay functions |
| `server/pneuma/memory/conversationHistory.js` | Session transcripts, pattern analysis, distillation into long-term |
| `server/pneuma/memory/vectorMemory.js` | Semantic memory with MongoDB Atlas vector search + brute-force fallback |
| `server/pneuma/memory/longTermMemory.js` | Structured user facts, patterns, struggles, session handoff |
| `server/pneuma/behavior/innerMonologue.js` | Dialectical cognition injected into system prompt before Claude responds |
| `server/pneuma/behavior/dreamMode.js` | Fire-and-forget off-session synthesis using Haiku at high temperature |

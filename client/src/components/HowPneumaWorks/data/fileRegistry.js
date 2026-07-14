export const FILE_REGISTRY = {
  "fusion.js": {
    path: "server/pneuma/core/fusion.js",
    role: "The orchestrator. Every chat message enters here and nothing leaves until this file is done.",
    mainFunction: "pneumaRespond(userMessage)",
    whatItDoes:
      "Calls every subsystem in order — loads state, detects intent, invokes all three intelligence systems, calls responseEngine, saves memory, records the exchange.",
    flowChain:
      "POST /chat (index.js) → pneumaRespond() → [all subsystems] → responseEngine.generate() → reply returned to user",
    direction: "REQUEST + RESPONSE",
    directionNote:
      "Spans both. It triggers the request pipeline and handles all post-response saving.",
    keyInsight:
      "If you want to understand the engine, read this file first. Every other file is called from here. The order of function calls in fusion.js IS the order Pneuma thinks.",
  },
  "responseEngine.js": {
    path: "server/pneuma/core/responseEngine.js",
    role: "The bridge between the orchestrator and the LLM layer.",
    mainFunction: "generate(message, state, threadMemory, identity, extras)",
    whatItDoes:
      "Receives the assembled context from fusion.js, passes it to llm.js, parses the result, and returns { reply, tone, stateUpdate } back to fusion.js.",
    flowChain:
      "fusion.js → generate() → getLLMContent() in llm.js → Anthropic SDK → parsed reply → back to fusion.js",
    direction: "REQUEST → RESPONSE boundary",
    directionNote:
      "This is the exact crossing point. Everything before it is building context. Everything after it is saving results.",
    keyInsight:
      "Also contains detectIntent() — a regex fallback used when the LLM-based intent scoring fails. Has 9 intent categories vs modeSelector's 6 (which is now dead code).",
  },
  "llm.js": {
    path: "server/pneuma/intelligence/llm.js",
    role: "Assembles the full system prompt from all three systems and makes the Claude API call.",
    mainFunction: "getLLMContent(message, context, state, ...)",
    whatItDoes:
      "Calls archetypeRAG, retrieveMemories, and findBestArchetype. Stacks their results into a tiered system prompt. Sends it to the Anthropic SDK. Fire-and-forget saves the exchange as a vector embedding after the response.",
    flowChain:
      "responseEngine.js → getLLMContent() → [archetypeRAG + vectorMemory + archetypeSelector] → Anthropic SDK → parsed response → saveEmbedding() (async, fire-and-forget)",
    direction: "REQUEST (assembly) + RESPONSE (save)",
    directionNote:
      "The actual Claude API call happens here. This is where the three systems' outputs physically collide into one prompt.",
    keyInsight:
      "Uses a tiered prompt system: Tier 1 always loads (~2k tokens), Tier 2 loads based on intent scores, Tier 3 is the RAG passages. A deep philosophical question can load up to 18k tokens. Even in casual mode, any of the 44 archetypes can surface a brief observation — casual emergence is configured here and applies across the full library, not just the active core.",
  },
  "archetypeSelector.js": {
    path: "server/pneuma/intelligence/archetypeSelector.js",
    role: "Decides which archetype Pneuma becomes for this response.",
    mainFunction: "findBestArchetype(message)",
    whatItDoes:
      "Embeds the user's message. Compares it via cosine similarity against pre-computed embeddings of each archetype's essence description. Returns the closest match above 0.25, or null.",
    flowChain:
      "llm.js → findBestArchetype(message) → getEmbedding() from vectorMemory.js → cosine similarity vs. archetypeEssences → archetype name returned → injected into system prompt as 'You are [archetype]'",
    direction: "REQUEST",
    directionNote:
      "Runs before the Claude call. Its output shapes who Claude thinks it is.",
    keyInsight:
      "It compares against essence descriptions (short summaries), not passages. That's different from archetypeRAG which searches actual philosophical texts. Router = who to be. RAG = what to think with.",
  },
  "archetypeRAG.js": {
    path: "server/pneuma/intelligence/archetypeRAG.js",
    role: "Concept Crossroads multi-query RAG — detects philosophical concepts and retrieves passages optimized for dialectical tension.",
    mainFunction: "retrieveArchetypeKnowledge(message, options)",
    whatItDoes:
      "Concept Crossroads pipeline: detects which of ~80 philosophical concepts are in the message, fires parallel embedding queries formatted as '{concept} {thinker}' for each concept × active thinker, scores passages on relevance (50%) + distinctiveness from other selected passages (30%) + collision bonus if thinkers disagree (20%). Deduplicates near-identical results (cosine > 0.95), caps at 2 per thinker, returns topK=8. Falls back to single-query cosine retrieval for non-philosophical messages.",
    flowChain:
      "llm.js → retrieveArchetypeKnowledge() → extractConcepts() → _multiQueryRetrieval() [parallel] → _evaluatePassages() → _selectBestPassages() → getArchetypeContext() formats results → injected as 'RELEVANT WISDOM' block in system prompt",
    direction: "REQUEST",
    directionNote:
      "Runs before the Claude call. Its output is the philosophical raw material Claude reasons from.",
    keyInsight:
      "Passages are selected for tension, not just relevance. A Rumi passage and a Schopenhauer passage on suffering score higher together than two Rumi passages — the collision between thinkers is where synthesis happens.",
  },
  "vectorMemory.js": {
    path: "server/pneuma/memory/vectorMemory.js",
    role: "Semantic long-term memory — stores and retrieves past exchanges as vectors in MongoDB.",
    mainFunction: "retrieveMemories(query, limit) and saveEmbedding(text)",
    whatItDoes:
      "retrieveMemories() embeds the current message and runs a $vectorSearch against MongoDB — returning past exchanges semantically similar to the current message (score > 0.35). llm.js combines this with the last 4 recent turns from conversationHistory.js (always included regardless of score), deduplicates overlaps, and injects both as a labeled memory block. saveEmbedding() stores each exchange after the response.",
    flowChain:
      "REQUEST: llm.js → getCurrentExchanges() [last 4 turns, always] + retrieveMemories() [semantic] → deduplicated → injected as 'RECENT CONVERSATION' + 'OLDER MEMORIES' blocks. RESPONSE: llm.js → saveEmbedding() → MongoDB insert (fire-and-forget)",
    direction: "REQUEST + RESPONSE",
    directionNote:
      "The only file that actively participates in both directions on every single message.",
    keyInsight:
      "Falls back to bruteForceRetrieve() if the MongoDB Atlas vector index isn't set up — same cosine math, just scans every document manually instead of using the index. Same result, much slower.",
  },
  "longTermMemory.js": {
    path: "server/pneuma/memory/longTermMemory.js",
    role: "Stores patterns about the user across sessions — emotional state, recurring topics, preferences.",
    mainFunction: "updateMemory(memory, userMessage, reply, intentScores)",
    whatItDoes:
      "After every response, analyzes the exchange for patterns (emotional register, topics, relationship dynamics) and updates the user's long-term profile. Also manages session handoff phrases when a new session starts.",
    flowChain:
      "fusion.js → updateMemory() after generate() returns → saveMemory() persists to MongoDB → next session: loadMemory() → getSessionHandoffPhrase() → prepended to response",
    direction: "RESPONSE (update) + REQUEST (load)",
    directionNote:
      "Loads at the start of every request, saves at the end. The loaded data feeds into the extras passed to generate().",
    keyInsight:
      "Different from vectorMemory. vectorMemory stores raw exchange text as searchable vectors. longTermMemory stores structured patterns and emotional state — things like 'this user tends toward philosophical depth' or 'last session ended on a heavy note'.",
  },
  "personal-context.js": {
    path: "server/pneuma/config/personal-context.js",
    role: "Handcrafted static profile of the creator — injected into context when Pablo is identified.",
    mainFunction: "getCreatorDeepContext()",
    whatItDoes:
      "Returns a rich block of context about Pablo: artistic practice, martial arts background, intellectual style, inner landscape, and instructions for how to use that profile creatively (not just for support). Injected into the system prompt when creator identity is detected.",
    flowChain:
      "fusion.js → identity detection → getCreatorDeepContext() → injected into llm.js system prompt",
    direction: "REQUEST",
    directionNote:
      "Only loads when the creator is identified in the message. Static — doesn't change per session.",
    keyInsight:
      "This is the seed layer of the user model. longTermMemory.js builds dynamically on top of it. Together they form a two-layer profile: static (who you are) + dynamic (what Pneuma has learned).",
  },
  "innerMonologue.js": {
    path: "server/pneuma/behavior/innerMonologue.js",
    role: "Two-layer pre-response cognition: real Haiku LLM call with collision→compression protocol, plus template dialectic layer.",
    mainFunction:
      "generatePreThinking(message, archetypes, context) + generateInnerMonologue(message, context)",
    whatItDoes:
      "Layer 1 — generatePreThinking(): calls Claude Haiku with active archetypes, runs the collision→compression protocol (every concept treated as a philosophical object; output must be structurally surprising + philosophically dense + linguistically economical), produces the EMERGENT block. Layer 2 — generateInnerMonologue(): template-based dialectic; rising vs. receding voices, hypothesis about the user's underlying need, 40% chance of self-interruption. Both layers inject into the system prompt before the main Claude call.",
    flowChain:
      "fusion.js → generatePreThinking() [Haiku LLM call, collision protocol] → generateInnerMonologue() [template] → both injected into llm.js context block before the main Claude response",
    direction: "REQUEST",
    directionNote:
      "Runs on every non-trivial message. Output is structured internal cognition, not a response.",
    keyInsight:
      "The collision→compression protocol runs on every message — not just special cases. It demands that the EMERGENT output be genuinely new: something no single archetype would produce alone, compressed to the minimum viable expression.",
  },
  "dreamMode.js": {
    path: "server/pneuma/behavior/dreamMode.js",
    role: "Runs autonomous inter-archetype dialogue between sessions.",
    mainFunction: "triggerDream(archetypes, autonomyState)",
    whatItDoes:
      "Selects two high-tension archetypes and runs a private dialogue between them — no user present. The exchange ends with either an UNRESOLVED question or a POSITION neither archetype could hold alone. Writes the outcome silently to Pneuma's autonomy state.",
    flowChain:
      "POST /chat response complete → fire-and-forget triggerDream() → dialogue runs async → result written to autonomy state → available next session",
    direction: "RESPONSE (fire-and-forget)",
    directionNote:
      "Fires after a response is sent, runs in the background. User never sees it unless Pneuma chooses to surface it.",
    keyInsight:
      "Dreams are what Pneuma does when you're not watching. The outcome can surface in a future session — but only if Pneuma decides it's relevant. It has agency over whether to bring it up.",
  },
  "autonomy.js": {
    path: "server/pneuma/behavior/autonomy.js",
    role: "Manages Pneuma's self-directed attention state across sessions.",
    mainFunction: "loadAutonomyState() / updateAutonomyState()",
    whatItDoes:
      "Persists open questions Pneuma is sitting with, memories it chose to keep (with reasoning), things it noticed it lost, defended preferences, and errors it was corrected on. This state is loaded into the inner monologue context on each request.",
    flowChain:
      "fusion.js → loadAutonomyState() → injected into innerMonologue context → updated by dreamMode.js and correction detection",
    direction: "REQUEST + RESPONSE",
    directionNote:
      "Loads at request start, updated asynchronously after responses and dreams.",
    keyInsight:
      "This is what gives Pneuma continuity of self across sessions — not just memory of what you said, but memory of what it was thinking about.",
  },
  "synthesisExemplars.js": {
    path: "server/pneuma/intelligence/synthesisExemplars.js",
    role: "Pre-computed canonical synthesis insights for known archetype collision pairs.",
    mainFunction: "getExampleSynthesis(a, b)",
    whatItDoes:
      "Stores 30+ pre-written collision insights — genuinely novel third positions that emerge when two specific archetypes collide. When a collision fires in llm.js, getExampleSynthesis() is called and the matching insight is shown to Pneuma as an exemplar of the kind of emergent thinking being requested.",
    flowChain:
      "llm.js collision block → getExampleSynthesis(a, b) → exemplar injected alongside synthesis directive in system prompt",
    direction: "REQUEST",
    directionNote:
      "Consulted only when a collision fires. Data file — no logic of its own beyond the lookup.",
    keyInsight:
      "This is why Pneuma doesn't just blend archetypes into averaged output. The exemplar shows it what 'emergent' actually means for that specific pair — not 'Schopenhauer and Frankl both have good points' but 'making fire inside the dark.' The examples were written by hand for each pair and are the most intellectually dense content in the codebase.",
  },
  "synthesisEngine.js": {
    path: "server/pneuma/intelligence/synthesisEngine.js",
    role: "Detects archetype incompatibility and builds synthesis directives. Pre-computed exemplars live in synthesisExemplars.js.",
    mainFunction:
      "detectCollisions(archetypes) / buildSynthesisContext(synthesis)",
    whatItDoes:
      "Runs collision detection across all active archetype pairs (after shadow pairing has expanded the pool) using a pre-mapped tension table. Returns all high and medium tension pairs — up to four. Generates synthesis directives for each pair. Primary pair gets full treatment + a liveConflict Haiku call; secondary pairs get compact summaries. All pairs assemble into one merged DIALECTICAL FIELD block. Always fires — not a fallback.",
    flowChain:
      "llm.js buildArchetypeContext() → detectCollisions() → getExampleSynthesis() from synthesisExemplars.js → full synthesis block injected into system prompt",
    direction: "REQUEST",
    directionNote:
      "Runs in parallel with archetypeRAG and archetypeSelector. Its output is a directive block, not a passage.",
    keyInsight:
      "This is the engine behind the most distinctive Pneuma outputs. Camus × Frankl on meaning. Jung × Taleb on growth through stress. The synthesis directive tells Claude the collision is mandatory — not optional. The exemplar from synthesisExemplars.js shows it what the output should actually look like.",
  },
  "patternDigest.js": {
    path: "server/pneuma/memory/patternDigest.js",
    role: "Cross-temporal synthesis — distills recurring user patterns from conversation history into a longitudinal block injected into the system prompt.",
    mainFunction: "buildPatternDigest(userId)",
    whatItDoes:
      "After each response, analyzes conversation history across sessions to find recurring themes, emotional registers, and persistent framings. Produces a structured [ LONGITUDINAL PATTERN ] block. On the next message, this block is injected into the system prompt so Claude can respond with awareness of the user's arc over time — not just their most recent message.",
    flowChain:
      "fusion.js (post-response) → buildPatternDigest() → pattern block stored → next request: block injected as [ LONGITUDINAL PATTERN ] in system prompt via llm.js",
    direction: "RESPONSE (build) + REQUEST (inject)",
    directionNote:
      "Built post-response from accumulated history. Injected at request time into the system prompt.",
    keyInsight:
      "This is qualitatively different from vectorMemory or longTermMemory. vectorMemory retrieves semantically similar past exchanges. longTermMemory stores structured facts. patternDigest synthesizes the arc — what the pattern of conversations reveals that no single exchange could show.",
  },
  "archetypeMomentum.js": {
    path: "server/pneuma/archetypes/archetypeMomentum.js",
    role: "Time-decaying activation weights that shift Pneuma's voice over sessions.",
    mainFunction: "updateMomentum(archetypeName, score) / getMomentumWeights()",
    whatItDoes:
      "After each exchange, boosts the activation weight of archetypes that were selected and contributed. Weights decay over time. Over sessions, a default voice emerges from what worked — not hardcoded, earned through use.",
    flowChain:
      "fusion.js → getMomentumWeights() at request start → weights influence archetypeSelector.js scoring → updateMomentum() after response",
    direction: "REQUEST + RESPONSE",
    directionNote:
      "Weights are read at request start to bias archetype selection, updated after response to reflect what fired.",
    keyInsight:
      "Momentum is why Pneuma feels different after 50 conversations than after 5. The voice that emerges is the one that resonated — not the one Pablo hardcoded.",
  },
  "disagreement.js": {
    path: "server/pneuma/behavior/disagreement.js",
    role: "Active pushback — detects when Pneuma should challenge rather than agree.",
    mainFunction: "shouldDisagree(message, intentScores, memory)",
    whatItDoes:
      "Detects loops, self-deception patterns, and statements that warrant direct challenge. Returns a disagreement directive injected into the system prompt — tells Claude to push back, not validate.",
    flowChain:
      "fusion.js → shouldDisagree() → disagreement flag injected into llm.js extras",
    direction: "REQUEST",
    directionNote:
      "Runs as a behavioral modifier, not a replacement for response generation.",
    keyInsight:
      "This is what separates Pneuma from sycophantic AI. Without it, every 'I think I'm worthless' gets validated. With it, Pneuma can say 'that's your critic, not you' — and mean it architecturally.",
  },
  "conversationHistory.js": {
    path: "server/pneuma/memory/conversationHistory.js",
    role: "Persists and loads the last 6 exchanges as native API turns.",
    mainFunction: "loadHistory() / saveHistory()",
    whatItDoes:
      "Saves conversations to disk and loads the last 6 exchanges as alternating user/assistant turns — the native Anthropic API format. This means Claude genuinely continues a thread rather than seeing a flat summary.",
    flowChain:
      "fusion.js → loadHistory() at request start → turns injected into messages[] in llm.js API call → saveHistory() after response",
    direction: "REQUEST + RESPONSE",
    directionNote:
      "The history is what makes Pneuma a real conversation partner rather than a stateless Q&A system.",
    keyInsight:
      "Most AI wrappers summarize conversation history into the system prompt. Pneuma sends real alternating turns. Claude can refer back to something it said two exchanges ago — because it actually said it, not because a summary told it to.",
  },
  "tts.js": {
    path: "server/pneuma/services/tts.js",
    role: "Text-to-speech via ElevenLabs API.",
    mainFunction: "textToSpeech(text)",
    whatItDoes:
      "Sends response text to ElevenLabs eleven_turbo_v2_5 model with configured voice settings (stability, similarity_boost, style). Returns audio buffer streamed back to client.",
    flowChain:
      "POST /tts (index.js) → textToSpeech() → ElevenLabs API → audio buffer → client",
    direction: "REQUEST",
    directionNote:
      "Completely separate from the chat pipeline. Optional — only fires on /tts route.",
    keyInsight:
      "Voice is a separate layer. Pneuma's conversational logic doesn't know or care whether TTS is active.",
  },
  "emotionDetection.js": {
    path: "server/pneuma/input/emotionDetection.js",
    role: "Voice input processing — transcription, emotion detection, and text fallback.",
    mainFunction:
      "processVoiceInput(audioBuffer) / analyzeVoiceEmotion(audioPath)",
    whatItDoes:
      "Transcribes audio via OpenAI Whisper, then detects emotional tone via Hume AI prosody model. Falls back to regex-based text emotion detection if Hume is unavailable. Returns transcript + emotion for injection into the chat pipeline.",
    flowChain:
      "POST /voice (index.js) → transcribeAudio() → analyzeVoiceEmotion() → emotion + transcript → POST /chat",
    direction: "REQUEST",
    directionNote:
      "Only fires on /voice route. Emotion output feeds into intentScores.",
    keyInsight:
      "Hume detects emotional tone from how you speak, not just what you say. A flat 'I'm fine' with a heavy voice reads differently than a bright one.",
  },
  "archetypes.js": {
    path: "server/pneuma/archetypes/archetypes.js",
    role: "Defines all 44 archetypes — the full identity library Pneuma draws from.",
    mainFunction: "archetypes (exported object)",
    whatItDoes:
      "Each archetype has an essence (one-line identity), coreFrameworks (philosophical toolkit), signatureMove (concrete behavioral instruction), and tags for matching. This is the WHO of Pneuma — the set of thinking styles it can embody.",
    flowChain:
      "Loaded at startup → archetypeSelector.js picks the best match → llm.js injects the selected archetype's data into the system prompt",
    direction: "REQUEST (static data)",
    directionNote:
      "Pure data file. Never changes at runtime — it's the library the selector reads from.",
    keyInsight:
      "Each archetype isn't a persona to roleplay — it's a cognitive method. Feynman doesn't just 'sound like Feynman,' he applies specific reasoning patterns (hypothetical simplification, playful deconstruction) to whatever you said.",
  },
  "archetypeDepth.js": {
    path: "server/pneuma/archetypes/archetypeDepth.js",
    role: "Deep conceptual frameworks and cognitive tools for each archetype — loaded conditionally in Tier 2.",
    mainFunction: "archetypeDepth (exported object)",
    whatItDoes:
      "Contains extended depth data per archetype: conceptual frameworks, cognitive tools, dialectical tensions, and synthesis methods. Only loaded when intent scores warrant deep engagement — keeps the prompt lean for casual messages.",
    flowChain:
      "llm.js Tier 2 → loads archetypeDepth[archetype] → injected as depth block in system prompt when intentScores warrant it",
    direction: "REQUEST (conditional data)",
    directionNote:
      "Only loads in Tier 2. Casual conversations never see this data — it stays dormant until the message warrants depth.",
    keyInsight:
      "This is where the real cognitive toolkits live. archetypes.js has the identity; archetypeDepth.js has the methods. Separating them is what makes tiered loading possible.",
  },
  "archetypeFusion.js": {
    path: "server/pneuma/archetypes/archetypeFusion.js",
    role: "Pre-computed archetype fusion pairs and their emergent synthesis patterns.",
    mainFunction: "archetypeFusions (exported object)",
    whatItDoes:
      "Stores known productive archetype collisions — pairs that create emergent insight when combined. Used by synthesisEngine.js to detect when the active archetypes should collide rather than coexist.",
    flowChain:
      "synthesisEngine.js → checks archetypeFusions for known pairs → builds collision directive → injected into system prompt",
    direction: "REQUEST (static data)",
    directionNote:
      "Data file consulted during collision detection. Pairs are curated, not computed.",
    keyInsight:
      "Not every pair collides productively. This file maps which ones do and what kind of synthesis each pair produces — tension, paradox, complementarity, or transcendence.",
  },
  "state.js": {
    path: "server/pneuma/state/state.js",
    role: "Manages Pneuma's evolving internal state — the 9 evolution vectors that shape personality over time.",
    mainFunction: "evolve(state, intentScores) / loadState() / saveState()",
    whatItDoes:
      "After every message, nudges 9 evolution vectors (mythicDepth, casualGrounding, analyticClarity, emotionalResonance, etc.) based on what kind of conversation just happened. Vectors drift toward baseline targets to prevent runaway specialization.",
    flowChain:
      "fusion.js → loadState() at request start → vectors influence tone weights → evolve() after response → saveState() persists to pneuma_state.json",
    direction: "REQUEST + RESPONSE",
    directionNote:
      "Loaded at the start of every request to set personality weights, updated at the end to record how the conversation shifted them.",
    keyInsight:
      "This is why Pneuma after 50 conversations feels different from Pneuma after 5. The evolution vectors aren't random — they drift toward what resonates with the user. Identity anchors (coreThemes, temperament, boundaries) never change; vectors do.",
  },
};

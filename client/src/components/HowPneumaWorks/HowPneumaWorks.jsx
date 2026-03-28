import React, { useState } from "react";
import "../RagLlmExplanation/RagLlmExplanation.css";
import "./HowPneumaWorks.css";

// ─── FILE REGISTRY ───────────────────────────────────────────────────────────
// One entry per file. This is the data that powers every ? modal.

const FILE_REGISTRY = {
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
      "Uses a tiered prompt system: Tier 1 always loads (~2k tokens), Tier 2 loads based on intent scores, Tier 3 is the RAG passages. A deep philosophical question can load up to 18k tokens. Even in casual mode, any of the 46 archetypes can surface a brief observation — casual emergence is configured here and applies across the full library, not just the active core.",
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
    role: "Retrieves relevant philosophical passages and forces a contrasting voice.",
    mainFunction: "retrieveArchetypeKnowledge(message, options)",
    whatItDoes:
      "Embeds the message. Scores all 51MB of cached passage embeddings via cosine similarity. Filters, diversifies across thinkers, then checks the CONTRAST_MAP — if one thinker dominates, pulls in an opposing voice marked isContrast: true.",
    flowChain:
      "llm.js → retrieveArchetypeKnowledge() → getArchetypeContext() formats results → injected as 'RELEVANT WISDOM' block in system prompt",
    direction: "REQUEST",
    directionNote:
      "Runs before the Claude call. Its output is the philosophical raw material Claude reasons from.",
    keyInsight:
      "getArchetypeContext() wraps the raw passages in Da Vinci's five cognitive methods (SAPER VEDERE, MIRROR MIND, etc.) as a frame for synthesis — so Claude isn't just quoting, it's being told how to process the wisdom.",
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
    role: "Runs a hidden dialectical thinking process before every response.",
    mainFunction:
      "generateInnerMonologue(message, archetypes, intentScores, memory)",
    whatItDoes:
      "Selects which archetypes are rising vs. receding, forms a hypothesis about what the user actually needs (vs. what they asked for), and sometimes interrupts itself with doubt. The output shapes how the response is framed — never shown to the user.",
    flowChain:
      "fusion.js → generateInnerMonologue() → result injected into llm.js context block before Claude responds",
    direction: "REQUEST",
    directionNote:
      "Runs on every non-trivial message. Output is a structured internal state, not a response.",
    keyInsight:
      "The inner monologue is what makes Pneuma respond to what you need rather than just what you said. It's the gap between 'I feel stuck' and 'he's not asking for solutions, he's asking to be seen.'",
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
  "synthesisEngine.js": {
    path: "server/pneuma/intelligence/synthesisEngine.js",
    role: "Detects archetype incompatibility and injects synthesis directives.",
    mainFunction: "detectSynthesisOpportunity(archetypes, intentScores, topic)",
    whatItDoes:
      "Runs 3-layer topic classification (keyword patterns → semantic router → intent scores) across 13 categories. Selects the optimal archetype pair for the topic and generates synthesis directives telling both to take positions and argue. Falls back to tension-pair collision detection when topic classification doesn't fire.",
    flowChain:
      "fusion.js → detectSynthesisOpportunity() → synthesis directive injected into llm.js system prompt",
    direction: "REQUEST",
    directionNote:
      "Runs in parallel with archetypeRAG and archetypeSelector. Its output is a directive block, not a passage.",
    keyInsight:
      "This is the engine behind the most distinctive Pneuma outputs. Camus × Frankl on meaning. Jung × Taleb on growth through stress. The synthesis directive tells Claude the collision is mandatory — not optional.",
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
};

// ─── FILE MODAL ──────────────────────────────────────────────────────────────

function FileModal({ data, name, onClose }) {
  if (!data) return null;
  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fm-close" onClick={onClose}>
          ×
        </button>

        <div className="fm-header">
          <code className="fm-filename">{name}</code>
          <div className="fm-path">{data.path}</div>
        </div>

        <div className="fm-role">{data.role}</div>

        <div className="fm-section">
          <div className="fm-label">Key function</div>
          <code className="fm-fn">{data.mainFunction}</code>
          <div className="fm-fn-desc">{data.whatItDoes}</div>
        </div>

        <div className="fm-section">
          <div className="fm-label">
            Flow chain
            <span
              className={`fm-direction ${data.direction.includes("REQUEST + RESPONSE") ? "both" : data.direction.includes("RESPONSE") ? "response" : "request"}`}
            >
              {data.direction}
            </span>
          </div>
          <div className="fm-chain">{data.flowChain}</div>
          <div className="fm-direction-note">{data.directionNote}</div>
        </div>

        <div className="fm-section fm-know-this">
          <div className="fm-label">Know this</div>
          <div className="fm-insight">{data.keyInsight}</div>
        </div>
      </div>
    </div>
  );
}

// ─── TERM REGISTRY ───────────────────────────────────────────────────────────
// Technical terms that appear inline and need a ? explanation

const TERM_REGISTRY = {
  "static prompt layer": {
    what: "The part of Claude's system prompt that is always present, identical on every message. Defined once by the developer. Never changes per conversation.",
    inPneuma:
      "The static layer is Pneuma's identity: 46 archetypes with their philosophical frameworks, cognitive tools, internal tensions, and conceptual bridges. It comes from archetypes.js and archetypeDepth.js. It answers WHO Pneuma is — not what it knows right now.",
  },
  "dynamic context layer": {
    what: "The part of the system prompt assembled fresh for each message. Nothing in it is hardcoded — it is retrieved and composed at runtime based on what you just said.",
    inPneuma:
      "All three systems (archetypeSelector, archetypeRAG, vectorMemory) produce dynamic context. Their outputs exist nowhere in the prompt until you send a message — then they are retrieved, stacked into the prompt, and discarded after the response. You never get the same dynamic layer twice.",
  },
  "context annotation": {
    what: "A field on each passage (called 'context' in passages.json) that specifies HOW to use the passage as a cognitive operation — not just what it says, but what thinking method it demonstrates.",
    inPneuma:
      "Every passage in Pneuma's knowledge base has a context annotation alongside the quote. Example: Otto's 'The holy cannot be taught, only evoked' becomes — 'COGNITIVE METHOD: Use indirect indication when direct statement fails.' The annotation is what makes RAG more than quotation. Without it, Pneuma cites. With it, Pneuma thinks.",
  },
  "knowledge pipeline": {
    what: "The three-stage process of turning raw primary texts into the curated, searchable passage pool that archetypeRAG.js retrieves from.",
    inPneuma:
      "Stage 1: raw primary texts pasted into docs/interview/text-prompt-ref/ as source material. Stage 2: passages hand-extracted and written into data/archetype_knowledge/{thinker}/passages.json with themes + context annotations. Stage 3: archetypeRAG.js embeds all passages once at startup and caches them in archetype_embeddings.json (51MB). New passages in any passages.json are auto-embedded on next server start.",
  },
  "cosine similarity": {
    what: "A formula that measures how close two vectors are in meaning space. Returns a number from 0 (completely unrelated) to 1 (identical meaning).",
    inPneuma:
      "Every search in Pneuma runs on this. archetypeRAG.js keeps passages scoring above 0.3. vectorMemory.js keeps memories above 0.35. archetypeSelector.js ignores any archetype below 0.25. Higher threshold = stricter match.",
  },
  vector: {
    what: "A list of 1536 numbers representing where a piece of text sits in meaning space. Generated by OpenAI's text-embedding-3-small model.",
    inPneuma:
      "Every message you send, every philosophical passage, and every archetype essence description is converted to a vector before any comparison happens. Vectors are what make semantic search possible — no keywords required.",
  },
  embedding: {
    what: "The process of converting text into a vector. 'Getting the embedding' means calling OpenAI's API to produce 1536 numbers that encode the text's meaning.",
    inPneuma:
      "getEmbedding() in vectorMemory.js is the shared function all three systems call. It's the single entry point into the vector space used everywhere in Pneuma.",
  },
  CONTRAST_MAP: {
    what: "A hardcoded lookup table inside archetypeRAG.js that maps each thinker to their philosophical opposite.",
    inPneuma:
      "When one thinker dominates the RAG results (e.g. Rumi scores highest), CONTRAST_MAP pulls in a deliberately opposing voice (e.g. Kafka or Schopenhauer) and marks it isContrast: true. It only fires when results are too one-sided.",
  },
  "dual RAG": {
    what: "Two separate retrieval-augmented generation systems running in parallel, each searching a different knowledge base for a different purpose.",
    inPneuma:
      "Pneuma runs two RAG systems on every message. archetypeRAG.js searches 1,385 philosophical passages from 48 thinkers — it grounds how Pneuma thinks about your message. vectorMemory.js searches your past conversations stored in MongoDB — it grounds who you are. One is static and pre-computed (51MB cached embeddings). The other is live and personal (grows with every exchange). Both inject into the same system prompt.",
  },
  "vector memory": {
    what: "A database where past conversations are stored as numbers (vectors) instead of plain text — so you can search them by meaning rather than by matching exact words.",
    inPneuma:
      "After every response, the exchange is converted to a vector and saved in MongoDB. On the next message, Pneuma searches this store for past exchanges that are semantically close to what you just said — even if you used different words.",
  },
  recency: {
    what: "How recent something is — how close in time it is to the current moment. In memory systems, 'recency' is the idea that what just happened should always be available, regardless of whether it's topically relevant.",
    inPneuma:
      "Pneuma's hybrid memory system guarantees recency by always including the last 4 conversation turns in the prompt — before any semantic search results. This prevents a situation where your most recent message is absent from Pneuma's context just because it scored low in vector similarity.",
  },
  deduplication: {
    what: "Removing duplicate entries from a list so the same piece of information doesn't appear twice.",
    inPneuma:
      "After combining recent turns with semantic search results, llm.js runs a dedup pass — if a past exchange that surfaced via vector search overlaps with one of the recent 4 turns (same user message text), the vector result is dropped. You never get the same exchange injected twice.",
  },
  "semantic search": {
    what: "Searching by meaning instead of exact words. Instead of matching keywords, it converts your query and all stored entries into vectors, then finds entries that are close in meaning space.",
    inPneuma:
      "All three of Pneuma's search systems use semantic search: archetypeSelector.js finds the best-fit archetype, archetypeRAG.js finds relevant philosophical passages, and vectorMemory.js finds past exchanges. None of them match keywords — they all match meaning.",
  },
  "hybrid memory": {
    what: "A memory retrieval strategy that combines two sources: guaranteed recent context (last N turns) plus semantically relevant older context (vector search results). Neither crowds out the other.",
    inPneuma:
      "llm.js assembles memory context in two labeled layers: 'RECENT CONVERSATION (LAST 4 TURNS)' always comes first, then 'SEMANTICALLY RELEVANT OLDER MEMORIES' from vectorMemory.js. Duplicates between the two are removed.",
  },
  "casual emergence": {
    what: "The behavior where a thinker from the full archetype library surfaces a brief, specific observation inside an ordinary conversation — without turning it into a lecture or derailing the exchange.",
    inPneuma:
      "Casual mode used to suppress archetype activation — the tone hint said 'less architecture, more presence' and the library went quiet. Now any of the 46 thinkers can notice something in an ordinary moment and name it in one sentence. Feynman on the physics of a habit. Kafka on the bureaucracy hiding inside the mundane. Hillman on what an offhand remark reveals. The constraint is that it must be genuine — if the observation isn't real, it doesn't surface. This is configured in the casual tone block inside llm.js.",
  },
};

// ─── TERM MODAL ───────────────────────────────────────────────────────────────

function TermModal({ term, data, onClose }) {
  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal tm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="fm-close" onClick={onClose}>
          ×
        </button>
        <div className="fm-header">
          <code className="fm-filename">{term}</code>
          <div className="fm-path">technical concept</div>
        </div>
        <div className="fm-section">
          <div className="fm-label">What it is</div>
          <div className="fm-fn-desc">{data.what}</div>
        </div>
        <div className="fm-section fm-know-this">
          <div className="fm-label">In Pneuma</div>
          <div className="fm-insight">{data.inPneuma}</div>
        </div>
      </div>
    </div>
  );
}

// ─── TERM REF ─────────────────────────────────────────────────────────────────
// Renders: term name [?]  — the ? opens the term explanation modal

function TermRef({ name }) {
  const [open, setOpen] = useState(false);
  const data = TERM_REGISTRY[name];
  if (!data) return <span>{name}</span>;

  return (
    <>
      <span className="fr-wrap">
        <span className="tr-chip">{name}</span>
        <button
          className="fr-help"
          onClick={() => setOpen(true)}
          title={`What is ${name}?`}
        >
          ?
        </button>
      </span>
      {open && (
        <TermModal term={name} data={data} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

// ─── FILE REF ────────────────────────────────────────────────────────────────
// Renders: filename.js [?]  — the ? opens the modal

function FileRef({ name }) {
  const [open, setOpen] = useState(false);
  const data = FILE_REGISTRY[name];

  return (
    <>
      <span className="fr-wrap">
        <code className="fr-chip">{name}</code>
        {data && (
          <button
            className="fr-help"
            onClick={() => setOpen(true)}
            title={`Learn about ${name}`}
          >
            ?
          </button>
        )}
      </span>
      {open && data && (
        <FileModal data={data} name={name} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

// ─── TABS ────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "big-picture", label: "What Is Pneuma?" },
  { key: "three-systems", label: "The Three Systems" },
  { key: "knowledge-base", label: "The Knowledge Base" },
  { key: "flow", label: "How a Message Flows" },
  { key: "concepts", label: "Concepts Decoded" },
  { key: "cheat-sheet", label: "Cheat Sheet" },
  { key: "features", label: "What Pneuma Can Do" },
];

// ─── BIG PICTURE ─────────────────────────────────────────────────────────────

function BigPictureTab() {
  return (
    <div className="tab-content-inner">
      <div className="insight-box highlight" style={{ marginBottom: "2rem" }}>
        <strong>The core insight:</strong> Pneuma is not a chatbot with a
        personality bolted on. It's a cognitive orchestration layer — code that
        runs <em>before</em> Claude sees your message and decides how Claude
        should think about it.
      </div>

      <div className="sg-qa">
        <div className="sg-q">
          What's the difference between Pneuma and a normal AI chatbot?
        </div>
        <div className="sg-a">
          A standard chatbot sends your message to the LLM and maybe adds a
          system prompt like "you are helpful and friendly." That's it.
          <br />
          <br />
          Pneuma does the opposite: before Claude gets your message, three
          separate systems run in parallel — each answering a different question
          about who Claude should be (<FileRef name="archetypeSelector.js" />
          ), what wisdom applies (<FileRef name="archetypeRAG.js" />
          ), and what you've said before (<FileRef name="vectorMemory.js" />
          ). All three results get stacked into the prompt. The entry point for
          all of this is <FileRef name="fusion.js" />.<br />
          <br />
          Claude doesn't generate a response and then have personality added on
          top. The personality structures <em>how it thinks</em> — before it
          writes a word.
        </div>
      </div>

      <div className="sg-qa">
        <div className="sg-q">
          What makes it novel — isn't this just fancy prompting?
        </div>
        <div className="sg-a">
          Most chatbots do one of these things in isolation:
          <br />
          <br />
          <ul style={{ marginTop: "0.5rem", lineHeight: "1.9" }}>
            <li>
              <strong>Persona chatbot</strong> — picks one fixed personality.
              "You are Socrates." Static, never changes.
            </li>
            <li>
              <strong>RAG chatbot</strong> — retrieves relevant documents. No
              real personality or memory.
            </li>
            <li>
              <strong>Memory chatbot</strong> — remembers conversation
              chronologically. Old = forgotten.
            </li>
          </ul>
          <br />
          Pneuma does all three simultaneously, and differently on each
          dimension:
          <br />
          <br />
          <ul style={{ lineHeight: "1.9" }}>
            <li>
              <strong>On personality</strong> — shifts per message via{" "}
              <FileRef name="archetypeSelector.js" />
            </li>
            <li>
              <strong>On RAG</strong> — deliberately injects a contrasting voice
              via <FileRef name="archetypeRAG.js" />
            </li>
            <li>
              <strong>On memory</strong> — topical not chronological, via{" "}
              <FileRef name="vectorMemory.js" />
            </li>
          </ul>
          <br />
          The novelty isn't any single piece. It's the combination — assembled
          in <FileRef name="llm.js" /> before Claude writes a single word.
        </div>
      </div>

      <div className="sg-qa">
        <div className="sg-q">
          If Pneuma uses Claude, isn't Claude doing all the work?
        </div>
        <div className="sg-a">
          Claude is the instrument. Pneuma is the score it plays from.
          <br />
          <br />
          Any instrument played with a different score produces different music.
          Claude without Pneuma answers questions. Claude with Pneuma responds
          as a specific archetype (<FileRef name="archetypeSelector.js" />
          ), thinking with colliding philosophical voices (
          <FileRef name="archetypeRAG.js" />
          ), informed by your history (<FileRef name="vectorMemory.js" /> +{" "}
          <FileRef name="longTermMemory.js" />
          ). The output is different not because Claude changed — because the
          cognitive context it received changed.
        </div>
      </div>
    </div>
  );
}

// ─── THREE SYSTEMS ───────────────────────────────────────────────────────────

const SYSTEM_SECTIONS = [
  {
    id: "archetype-selector",
    label: "1. Archetype Selector — Who Pneuma Becomes",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            What does the Archetype Selector do?{" "}
            <FileRef name="archetypeSelector.js" />
          </div>
          <div className="sg-a">
            It answers one question:{" "}
            <strong>which archetype should Pneuma be right now?</strong>
            <br />
            <br />
            At startup, each of the 46 archetypes has an essence description — a
            short philosophical summary of who that thinker is. Each essence
            gets converted into a vector. When you send a message, your message
            becomes a vector too, and <FileRef name="archetypeSelector.js" />{" "}
            measures which archetype essence is closest in meaning to what you
            said.
            <br />
            <br />
            Closest match above 0.25 → Pneuma becomes that archetype for this
            response.
            <br />
            Nothing scores above 0.25 → Pneuma responds as itself, no archetype.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Examples?</div>
          <div className="sg-a">
            You send something dark and nihilistic → Nietzsche scores highest →
            Pneuma responds as Nietzsche.
            <br />
            You send something about love and longing → Rumi scores highest →
            Pneuma responds as Rumi.
            <br />
            You ask what the weather is like → nothing scores high → Pneuma
            responds as itself.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Does the Archetype Selector create the philosophical tension in
            responses?
          </div>
          <div className="sg-a">
            No. <FileRef name="archetypeSelector.js" /> only picks <em>one</em>{" "}
            archetype — the voice. The tension comes from{" "}
            <FileRef name="archetypeRAG.js" />, which is a completely separate
            system. The router controls who is speaking; RAG controls what
            conflicting ideas that speaker is wrestling with.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "archetype-rag",
    label: "2. Archetype RAG — What Wisdom Applies",
    critical: true,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            What does Archetype RAG do? <FileRef name="archetypeRAG.js" />
          </div>
          <div className="sg-a">
            It answers:{" "}
            <strong>
              which philosophical passages are relevant to this message — and
              which opposing voice should collide with them?
            </strong>
            <br />
            <br />
            At startup, Pneuma reads every passage from all 46 thinkers in{" "}
            <code>data/archetype_knowledge/</code>. Each passage gets converted
            to a <TermRef name="vector" /> and cached in{" "}
            <code>archetype_embeddings.json</code> (51MB — thousands of
            passages, computed once). When you send a message, your message
            becomes a <TermRef name="vector" /> and gets compared against every
            cached passage. The closest ones come back.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Step by step — what happens inside{" "}
            <FileRef name="archetypeRAG.js" />?
          </div>
          <div className="sg-a">
            <ol style={{ lineHeight: "2" }}>
              <li>
                Your message → converted to a <TermRef name="vector" /> via{" "}
                <TermRef name="embedding" />
              </li>
              <li>
                Compared against every cached passage via{" "}
                <TermRef name="cosine similarity" />
              </li>
              <li>Any passage scoring below 0.3 → thrown out</li>
              <li>
                Max 2 passages per thinker, 5 total — no single philosopher
                dominates
              </li>
              <li>
                <TermRef name="CONTRAST_MAP" /> kicks in — if one thinker
                dominates, pulls in an opposing voice marked{" "}
                <code>isContrast: true</code>
              </li>
            </ol>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            When does the CONTRAST_MAP trigger — is it always on?
          </div>
          <div className="sg-a">
            No — it only triggers when one thinker clearly dominates the
            results.
            <br />
            <br />
            If Rumi's passages score highest → <TermRef name="CONTRAST_MAP" />{" "}
            looks up Rumi → pulls in Kafka or Schopenhauer as a deliberate
            opposing voice.
            <br />
            <br />
            If scores are already spread across multiple thinkers → contrast is
            naturally there, <TermRef name="CONTRAST_MAP" /> doesn't need to
            intervene.
            <br />
            <br />
            Think of it as a balancer. It fires when results are too one-sided.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">What if all RAG scores are low?</div>
          <div className="sg-a">
            Then fewer (or no) passages get injected into the prompt. Pneuma
            just has less philosophical wisdom to think with for that response.
            Low RAG scores do not affect which archetype{" "}
            <FileRef name="archetypeSelector.js" /> selects — those are two
            completely separate systems that fail independently.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            How many RAG systems does Pneuma have — and what's the difference?
          </div>
          <div className="sg-a">
            Two. They run in parallel on every message and inject into the same
            system prompt, but they search completely different things at
            completely different timescales.
            <br />
            <br />
            <strong>
              <FileRef name="archetypeRAG.js" /> — Philosophical Knowledge RAG
            </strong>
            <br />
            Searches 1,385 passages from 48 thinkers in{" "}
            <code>data/archetype_knowledge/</code>. Static and pre-computed —
            the 51MB embeddings cache is built once at startup and never changes
            mid-session. Answers: <em>what wisdom applies to this message?</em>
            <br />
            <br />
            <strong>
              <FileRef name="vectorMemory.js" /> — Conversation Memory RAG
            </strong>
            <br />
            Searches your past exchanges stored in MongoDB. Live and personal —
            grows with every conversation. Answers:{" "}
            <em>what has this person said before that's relevant right now?</em>
            <br />
            <br />
            This is a <TermRef name="dual RAG" /> architecture. Most systems
            have one retrieval layer. Pneuma separates knowledge retrieval
            (timeless) from memory retrieval (personal) and runs both.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Why is the contrast slot novel — don't all RAG systems return the
            most relevant passages?
          </div>
          <div className="sg-a">
            Yes — that's exactly the problem. Standard RAG optimizes purely for{" "}
            <TermRef name="cosine similarity" />. Highest score wins. If your
            message resonates most with Rumi, you get Rumi passages. More Rumi.
            All Rumi. The system converges on agreement with itself.
            <br />
            <br />
            Pneuma deliberately breaks this. <TermRef name="CONTRAST_MAP" />{" "}
            reserves one of the five retrieval slots for a philosophically
            opposing thinker — not the most relevant voice, but the one most
            likely to argue with whoever scored highest. Rumi dominates → Kafka
            gets injected alongside him. Schopenhauer dominates → Whitman comes
            in. The friction is engineered before Claude even starts thinking.
            <br />
            <br />
            Standard RAG retrieves. This retrieves <em>and</em> destabilizes.
            That's the difference.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "vector-memory",
    label: "3. Vector Memory — What You've Said Before",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            What does Vector Memory do? <FileRef name="vectorMemory.js" />
          </div>
          <div className="sg-a">
            It answers:{" "}
            <strong>
              what has this person said before that's relevant to what they're
              saying right now?
            </strong>
            <br />
            <br />
            After every exchange, <FileRef name="vectorMemory.js" /> saves a
            chunk like <code>"User: [your message]\nPneuma: [reply]"</code> as a{" "}
            <TermRef name="vector" /> in MongoDB. When you send a new message,{" "}
            <FileRef name="llm.js" /> builds the memory context as{" "}
            <TermRef name="hybrid memory" />: the last 4 turns are always
            included first (guaranteed <TermRef name="recency" />
            ), then <TermRef name="semantic search" /> results from older
            exchanges are appended after — <TermRef name="deduplication" />{" "}
            removes anything that already appeared in the recent turns.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            How is that different from normal chat memory?
          </div>
          <div className="sg-a">
            Normal chat memory is chronological — recent = remembered, old =
            forgotten. Pure <TermRef name="vector memory" /> is the opposite:
            topical but blind to <TermRef name="recency" />.
            <br />
            <br />
            Pneuma now uses both. The last 4 turns are locked in regardless of{" "}
            <TermRef name="cosine similarity" /> score. Then older exchanges
            surface if they're topically close via{" "}
            <TermRef name="semantic search" /> — you talked about loneliness
            three months ago, today you ask about solitude, that old exchange
            can still appear. Neither recency nor relevance crowds out the
            other.
            <br />
            <br />
            Only <TermRef name="semantic search" /> results scoring above 0.35
            come back, so low-relevance old exchanges don't pollute the context.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            What happens if MongoDB's vector search isn't ready?
          </div>
          <div className="sg-a">
            <FileRef name="vectorMemory.js" /> falls back to brute-force{" "}
            <TermRef name="cosine similarity" /> scanning — same math, same
            answer, just slower. (See Concepts Decoded if you're not sure what
            brute force means.)
          </div>
        </div>
      </>
    ),
  },
];

function ThreeSystemsTab() {
  const [openId, setOpenId] = useState("archetype-rag");
  return (
    <div className="tab-content-inner">
      <div className="insight-box" style={{ marginBottom: "2rem" }}>
        <strong>Remember:</strong> These three systems don't replace each other.
        They run simultaneously and each answers a completely different
        question. Think of a theater performance:{" "}
        <FileRef name="archetypeSelector.js" /> picks which actor plays the role
        tonight. <FileRef name="archetypeRAG.js" /> picks which script passages
        they draw from. <FileRef name="vectorMemory.js" /> tells them what this
        particular audience has wrestled with before.
      </div>
      {SYSTEM_SECTIONS.map((s) => (
        <div
          key={s.id}
          className={`accordion-item${s.critical ? " critical" : ""}${openId === s.id ? " open" : ""}`}
        >
          <button
            className="accordion-header"
            onClick={() => setOpenId(openId === s.id ? null : s.id)}
          >
            <span>{s.label}</span>
            <span className="accordion-icon">
              {openId === s.id ? "▲" : "▼"}
            </span>
          </button>
          {openId === s.id && (
            <div className="accordion-content">{s.content()}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── KNOWLEDGE BASE ───────────────────────────────────────────────────────────

function KnowledgeBaseTab() {
  return (
    <div className="tab-content-inner">
      <div className="insight-box highlight" style={{ marginBottom: "2rem" }}>
        <strong>The confusion to clear up:</strong> Pneuma's system prompt is
        not static. It has two layers — one that never changes (identity), and
        one that is assembled from scratch on every single message (thought).
        Most people assume it's all static. It isn't.
      </div>

      <div className="sg-qa">
        <div className="sg-q">
          What's always in the prompt — and what changes every message?
        </div>
        <div className="sg-a">
          <strong>
            <TermRef name="static prompt layer" />
          </strong>{" "}
          — always present, identical every time:
          <ul style={{ marginTop: "0.5rem", lineHeight: "1.9" }}>
            <li>
              The 46 archetype definitions — their philosophies, voices,
              cognitive methods
            </li>
            <li>
              The depth structure per archetype — core frameworks, cognitive
              tools, tensions, bridges
            </li>
            <li>Pneuma's base identity and behavioral instructions</li>
          </ul>
          This comes from <FileRef name="archetypeSelector.js" /> selecting
          which part of the static layer to foreground, and the definitions
          living in <code>archetypes.js</code> + <code>archetypeDepth.js</code>.
          <br />
          <br />
          <strong>
            <TermRef name="dynamic context layer" />
          </strong>{" "}
          — assembled fresh every message:
          <ul style={{ marginTop: "0.5rem", lineHeight: "1.9" }}>
            <li>
              Which archetype Pneuma becomes right now (
              <FileRef name="archetypeSelector.js" />)
            </li>
            <li>
              Which philosophical passages are relevant to what you just said (
              <FileRef name="archetypeRAG.js" />)
            </li>
            <li>
              Which past exchanges are topically close to now (
              <FileRef name="vectorMemory.js" />)
            </li>
          </ul>
          None of this dynamic content exists in the prompt until you send a
          message. Then it's retrieved, stacked, and discarded after the
          response.
        </div>
      </div>

      <div className="sg-qa">
        <div className="sg-q">
          If identity is static, why does Pneuma feel different on every
          message?
        </div>
        <div className="sg-a">
          Because the dynamic layer changes everything about the conversation's
          texture without changing who Pneuma is.
          <br />
          <br />
          The static layer is character — stable across every response.
          <br />
          The dynamic layer is thought — which specific wisdom is active, which
          archetype is foregrounded, which memory is present. That changes every
          time.
          <br />
          <br />A musician's training, sensibility, and identity don't change
          between performances. But what they play, which passages they draw
          from, which influences are present in the room — that changes
          entirely. Same musician. Different concert.
        </div>
      </div>

      <div className="sg-qa">
        <div className="sg-q">
          Where do the philosophical passages in the RAG actually come from?
        </div>
        <div className="sg-a">
          They come from primary texts — actual works by each thinker, not
          summaries. The process is the <TermRef name="knowledge pipeline" />:
          <br />
          <br />
          <ol style={{ lineHeight: "2.2" }}>
            <li>
              Raw texts are pasted into{" "}
              <code>docs/interview/text-prompt-ref/</code> — the working folder
              for source material. This is where Borges's <em>Ficciones</em>,
              Jung's <em>Liber Primus</em>, Otto's <em>The Idea of the Holy</em>
              , and others live as plain text.
            </li>
            <li>
              Passages are hand-extracted from those texts and written into{" "}
              <code>data/archetype_knowledge/{"{thinker}"}/passages.json</code>{" "}
              — each with themes and a <TermRef name="context annotation" />.
            </li>
            <li>
              <FileRef name="archetypeRAG.js" /> embeds all passages once at
              startup using OpenAI's embedding model, caches them in{" "}
              <code>archetype_embeddings.json</code> (51MB). New passages are
              auto-embedded on next server start. No manual re-indexing needed.
            </li>
          </ol>
          The raw texts in <code>text-prompt-ref/</code> are not used directly
          by the system — they are the source material you read to extract
          passages from. The passages.json files are what the system actually
          searches.
        </div>
      </div>

      <div className="sg-qa">
        <div className="sg-q">
          What is a context annotation, and why does it matter?
        </div>
        <div className="sg-a">
          Every passage in <code>passages.json</code> has three fields:{" "}
          <code>text</code> (the quote), <code>themes</code> (tags), and{" "}
          <code>context</code> (the annotation).
          <br />
          <br />
          The <TermRef name="context annotation" /> is the difference between
          Pneuma citing a thinker and Pneuma thinking with them.
          <br />
          <br />
          Example — a passage from Rudolf Otto:
          <pre className="code-block">{`text: "This X of ours cannot be taught — it can only be
evoked, awakened in the mind."

context: "COGNITIVE METHOD: Some things cannot be taught
directly — they must be evoked. Use indirect indication
when direct statement fails. Point, triangulate,
approach from the side."`}</pre>
          Without the annotation, Pneuma receives a quote. With the annotation,
          Pneuma receives an instruction for how to think. The annotation
          converts quotation into method.
        </div>
      </div>

      <div className="sg-qa">
        <div className="sg-q">
          Why have passages at all if archetypes are already defined in the
          static layer?
        </div>
        <div className="sg-a">
          The static layer defines who each archetype is and how they think in
          general. The passages provide specific ideas from specific texts,
          surfaced only when semantically relevant to this particular message.
          <br />
          <br />
          The static layer says: "Nietzsche is a life-affirmer who uses
          perspectivism and amor fati."
          <br />
          The passages say: "Here is the exact passage from{" "}
          <em>The Gay Science</em> that applies to what this person just said
          about suffering — and here is what cognitive method it demonstrates."
          <br />
          <br />
          One is identity. The other is relevant knowledge, on demand. They do
          completely different jobs and never replace each other.
        </div>
      </div>

      <div className="sg-qa">
        <div className="sg-q">
          How do you add more passages — and which archetypes need them most?
        </div>
        <div className="sg-a">
          The workflow:
          <ol style={{ lineHeight: "2" }}>
            <li>
              Paste a primary text into{" "}
              <code>docs/interview/text-prompt-ref/{"{Thinker}"}/text.txt</code>
            </li>
            <li>
              Read it. Extract 15–30 passages that are dense, quotable, and
              demonstrate a distinct cognitive method
            </li>
            <li>
              Write each into{" "}
              <code>data/archetype_knowledge/{"{thinker}"}/passages.json</code>{" "}
              with <code>id</code>, <code>text</code>, <code>source</code>,{" "}
              <code>themes</code>, and <code>context</code>
            </li>
            <li>Restart the server — new passages are auto-embedded</li>
          </ol>
          The <TermRef name="context annotation" /> is the most important part.
          A short passage with a strong cognitive method annotation is more
          valuable than a long passage with no annotation.
        </div>
      </div>
    </div>
  );
}

// ─── FLOW ─────────────────────────────────────────────────────────────────────

function FlowTab() {
  return (
    <div className="tab-content-inner">
      <div className="sg-qa">
        <div className="sg-q">What happens the moment you hit send?</div>
        <div className="sg-a">
          Your message hits <FileRef name="fusion.js" /> first — which calls
          three places <strong>simultaneously</strong>:
          <div className="flow-diagram">
            <div className="flow-row">
              <div className="flow-label">
                Your message → <FileRef name="fusion.js" />
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-split">
              <div className="flow-branch">
                <div className="flow-branch-title cyan">Archetype Selector</div>
                <div className="flow-branch-file">
                  <FileRef name="archetypeSelector.js" />
                </div>
                <div className="flow-branch-desc">
                  Which archetype should Pneuma BE?
                </div>
                <div className="flow-branch-out">→ "Be Nietzsche"</div>
              </div>
              <div className="flow-branch">
                <div className="flow-branch-title amber">Archetype RAG</div>
                <div className="flow-branch-file">
                  <FileRef name="archetypeRAG.js" />
                </div>
                <div className="flow-branch-desc">
                  Which passages? Which contrast voice?
                </div>
                <div className="flow-branch-out">→ Rumi + Kafka (contrast)</div>
              </div>
              <div className="flow-branch">
                <div className="flow-branch-title cyan">Vector Memory</div>
                <div className="flow-branch-file">
                  <FileRef name="vectorMemory.js" />
                </div>
                <div className="flow-branch-desc">
                  What has this person said before?
                </div>
                <div className="flow-branch-out">
                  → Exchange from 3 weeks ago
                </div>
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-row merge">
              <div className="flow-label">
                All three → <FileRef name="llm.js" /> (stacked into one prompt)
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-row">
              <div className="flow-label">
                <FileRef name="responseEngine.js" /> → Anthropic SDK
              </div>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-row final">
              <div className="flow-label">
                Reply → back through fusion.js →{" "}
                <FileRef name="vectorMemory.js" /> saves it → user sees response
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sg-qa">
        <div className="sg-q">
          What does the stacked prompt actually look like inside{" "}
          <FileRef name="llm.js" />?
        </div>
        <div className="sg-a">
          Claude receives something like this — three distinct blocks, not one
          merged thing:
          <pre className="code-block">{`You are Nietzsche.

RELEVANT WISDOM FROM YOUR KNOWLEDGE BASE:
Rumi: "Out beyond ideas of wrongdoing and rightdoing, there is a field..."
═══ CONTRASTING VOICE (for dialectic tension) ═══
Kafka [CONTRAST]: "There is infinite hope, but not for us."

WHAT THIS PERSON HAS SAID BEFORE:
[exchange from 3 weeks ago about loneliness and meaning]

Now respond to: [your message]`}</pre>
          Claude reads all three blocks and writes one response shaped by all of
          them. The sophistication isn't in any one block — it's in the
          stacking.
        </div>
      </div>

      <div className="sg-qa">
        <div className="sg-q">Do the three systems talk to each other?</div>
        <div className="sg-a">
          No. They run independently and all feed into <FileRef name="llm.js" />{" "}
          separately. They can fail independently too — a low RAG score doesn't
          affect which archetype <FileRef name="archetypeSelector.js" /> picks.
          A missing vector memory doesn't affect RAG. Each system contributes
          what it can and <FileRef name="llm.js" /> assembles whatever came
          back.
        </div>
      </div>
    </div>
  );
}

// ─── CONCEPTS DECODED ────────────────────────────────────────────────────────

const CONCEPT_SECTIONS = [
  {
    id: "vector",
    label: "What is a vector?",
    content: () => (
      <div className="sg-qa">
        <div className="sg-q">
          When the code "converts a passage into a vector" — what does that
          actually mean?
        </div>
        <div className="sg-a">
          A vector is not one number. It's a <em>list</em> of numbers —
          specifically 1536 of them (that's what OpenAI's{" "}
          <code>text-embedding-3-small</code> model produces).
          <br />
          <br />
          Think of GPS coordinates. Two numbers tell you exactly where something
          is in physical space. A vector with 1536 numbers tells you where a
          piece of text sits in <em>meaning space</em>.<br />
          <br />
          So the passage <em>"God is dead"</em> from Nietzsche becomes something
          like <code>[0.23, -0.87, 0.41, ...]</code> — 1536 numbers representing
          where that idea lives. Every passage gets its own unique list. Similar
          ideas end up near each other in that 1536-dimensional space. That's
          how meaning becomes searchable.
          <br />
          <br />
          Both <FileRef name="archetypeRAG.js" /> and{" "}
          <FileRef name="vectorMemory.js" /> use this same approach — they call{" "}
          <code>getEmbedding()</code> from <FileRef name="vectorMemory.js" /> to
          generate vectors.
        </div>
      </div>
    ),
  },
  {
    id: "cosine",
    label: "What is cosine similarity?",
    content: () => (
      <div className="sg-qa">
        <div className="sg-q">What does "cosine similarity" actually mean?</div>
        <div className="sg-a">
          It's a math formula that measures how close two vectors are to each
          other in meaning space. The result is a number between 0 and 1:
          <br />
          <br />
          <ul style={{ lineHeight: "2" }}>
            <li>
              <strong>1.0</strong> = identical meaning
            </li>
            <li>
              <strong>0.7+</strong> = very closely related
            </li>
            <li>
              <strong>0.3–0.5</strong> = loosely related
            </li>
            <li>
              <strong>0.0</strong> = completely unrelated
            </li>
          </ul>
          <br />
          When you send a message, your message becomes a vector. Pneuma then
          computes cosine similarity between your vector and every passage's
          vector. The highest scores = the most relevant passages.
          <br />
          <br />
          Thresholds used in the code: <FileRef name="archetypeRAG.js" />{" "}
          filters below 0.3. <FileRef name="vectorMemory.js" /> filters below
          0.35. <FileRef name="archetypeSelector.js" /> ignores any archetype
          below 0.25.
        </div>
      </div>
    ),
  },
  {
    id: "cached",
    label: "What does 'cached' mean here?",
    content: () => (
      <div className="sg-qa">
        <div className="sg-q">
          The code says it compares against "cached" passages — what does cached
          mean?
        </div>
        <div className="sg-a">
          Cached just means pre-saved so you don't have to recalculate.
          <br />
          <br />
          Converting thousands of passages to vectors using OpenAI's API would
          take minutes and cost money every time someone sent a message.
          Instead, <FileRef name="archetypeRAG.js" /> does it once at startup,
          saves all the vectors to <code>archetype_embeddings.json</code> (the
          51MB file), and reads from that file on every request. Fast and free
          after the first run.
        </div>
      </div>
    ),
  },
  {
    id: "brute-force",
    label: "What does 'brute force' mean?",
    content: () => (
      <div className="sg-qa">
        <div className="sg-q">
          The code mentions a "brute-force fallback" — what is that?
        </div>
        <div className="sg-a">
          Brute force means "check every single one manually."
          <br />
          <br />
          <strong>With a search index</strong> (MongoDB Atlas vector search) —
          it's like a library with a card catalog. You look up your topic and it
          points you directly to the right shelf. Fast.
          <br />
          <br />
          <strong>Brute force</strong> — same library, no catalog. You walk down
          every single aisle, read every spine, one by one. Same answer, just
          slower.
          <br />
          <br />
          <FileRef name="vectorMemory.js" /> uses the fast index when MongoDB's
          vector index is ready, and falls back to the slow scan if it isn't.
          Same result either way.
        </div>
      </div>
    ),
  },
  {
    id: "topical-vs-chron",
    label: "Topical memory vs. chronological memory",
    content: () => (
      <div className="sg-qa">
        <div className="sg-q">
          What's the actual difference between topical and chronological memory?
        </div>
        <div className="sg-a">
          <strong>Chronological memory</strong> (how most chatbots work): The
          last N messages are remembered. Anything older is forgotten. Recent =
          relevant.
          <br />
          <br />
          <strong>Topical memory</strong> (how{" "}
          <FileRef name="vectorMemory.js" /> works): Past exchanges are stored
          as vectors. When you send a new message, Pneuma searches for past
          exchanges that are semantically close to it — regardless of when they
          happened.
          <br />
          <br />
          Example: You talked about grief six months ago. Today you ask about
          loss. Those aren't the same words, but they're close in meaning space
          — that old exchange might surface today. Meanwhile, a casual chat from
          two days ago about a movie doesn't surface at all, because it's not
          semantically relevant to what you're asking now.
        </div>
      </div>
    ),
  },
];

function ConceptsTab() {
  const [openId, setOpenId] = useState("vector");
  return (
    <div className="tab-content-inner">
      {CONCEPT_SECTIONS.map((s) => (
        <div
          key={s.id}
          className={`accordion-item${openId === s.id ? " open" : ""}`}
        >
          <button
            className="accordion-header"
            onClick={() => setOpenId(openId === s.id ? null : s.id)}
          >
            <span>{s.label}</span>
            <span className="accordion-icon">
              {openId === s.id ? "▲" : "▼"}
            </span>
          </button>
          {openId === s.id && (
            <div className="accordion-content">{s.content()}</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── CHEAT SHEET ─────────────────────────────────────────────────────────────

function CheatSheetTab() {
  return (
    <div className="tab-content-inner cheat-sheet">
      <div className="cs-intro">
        Everything you need to remember — in order, without the scattered
        pieces.
      </div>

      <div className="cs-block">
        <div className="cs-number">01</div>
        <div className="cs-content">
          <div className="cs-title">Pneuma is not a chatbot</div>
          <div className="cs-body">
            It's a cognitive orchestration layer. Code that runs before Claude
            and builds the context Claude thinks from. The entry point for
            everything is <FileRef name="fusion.js" />.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">02</div>
        <div className="cs-content">
          <div className="cs-title">Three systems run simultaneously</div>
          <div className="cs-body">
            <FileRef name="archetypeSelector.js" /> → picks which archetype
            Pneuma becomes
            <br />
            <FileRef name="archetypeRAG.js" /> → retrieves relevant passages +
            forces contrast voice
            <br />
            <FileRef name="vectorMemory.js" /> → surfaces past exchanges that
            are topically similar
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">03</div>
        <div className="cs-content">
          <div className="cs-title">
            They stack in <FileRef name="llm.js" /> — that's where Claude gets
            its context
          </div>
          <div className="cs-body">
            All three feed independently into <FileRef name="llm.js" />. Claude
            gets three separate blocks. They can fail independently — a bad RAG
            result doesn't break archetype selection.
            <FileRef name="responseEngine.js" /> sits between llm.js and
            fusion.js and handles the actual Claude API call boundary.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">04</div>
        <div className="cs-content">
          <div className="cs-title">
            The tension comes from RAG, not the Router
          </div>
          <div className="cs-body">
            <FileRef name="archetypeSelector.js" /> picks ONE voice. The
            philosophical collision comes from the CONTRAST_MAP inside{" "}
            <FileRef name="archetypeRAG.js" />. Pneuma can speak as Nietzsche
            while wrestling with Rumi and Kafka's passages simultaneously.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">05</div>
        <div className="cs-content">
          <div className="cs-title">
            CONTRAST_MAP is a balancer, not always-on
          </div>
          <div className="cs-body">
            It only fires when one thinker clearly dominates inside{" "}
            <FileRef name="archetypeRAG.js" />. If scores are already spread
            across multiple thinkers, no intervention is needed.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">06</div>
        <div className="cs-content">
          <div className="cs-title">
            A vector is 1536 numbers representing meaning
          </div>
          <div className="cs-body">
            Not one number. Like GPS for ideas. Cosine similarity measures how
            close two vectors are (0 = unrelated, 1 = identical meaning). Every
            search in Pneuma — archetype, passages, memory — runs on this same
            math.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">07</div>
        <div className="cs-content">
          <div className="cs-title">Memory is hybrid: recency + topical</div>
          <div className="cs-body">
            <TermRef name="hybrid memory" />: <FileRef name="llm.js" /> always
            includes the last 4 turns first (<TermRef name="recency" />
            ), then appends <TermRef name="semantic search" /> results from{" "}
            <FileRef name="vectorMemory.js" /> with{" "}
            <TermRef name="deduplication" />. A conversation from six months ago
            about grief can still surface today when you ask about loss — but it
            never crowds out what just happened.{" "}
            <FileRef name="longTermMemory.js" /> stores structured patterns
            separately — emotional state, recurring themes, relationship
            dynamics.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">08</div>
        <div className="cs-content">
          <div className="cs-title">
            The file that matters most for understanding the engine
          </div>
          <div className="cs-body">
            Read <FileRef name="fusion.js" /> first. Every other file is called
            from there. The order of function calls in fusion.js is the order
            Pneuma thinks.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">09</div>
        <div className="cs-content">
          <div className="cs-title">
            Casual mode doesn't silence the archetypes
          </div>
          <div className="cs-body">
            <TermRef name="casual emergence" />: any of the 46 thinkers can
            notice something in an ordinary moment and name it briefly — without
            turning the conversation philosophical. Kafka on the bureaucracy
            inside a routine. Feynman on the physics of a habit. One sentence,
            no lecture. The library stays on at every altitude.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FEATURES TAB ────────────────────────────────────────────────────────────

function FeaturesTab() {
  return (
    <div className="tab-content-inner">
      <div className="insight-box highlight" style={{ marginBottom: "2rem" }}>
        <strong>Quick reference:</strong> Everything Pneuma can do, why it's
        different, and which file owns it. Click any{" "}
        <span className="fr-chip-demo">filename.js</span>{" "}
        <span className="fr-help-demo">?</span> to see the function, flow chain,
        and key insight.
      </div>

      {/* ── INTELLIGENCE ── */}
      <h3
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "1rem",
          marginTop: "0.5rem",
        }}
      >
        Intelligence
      </h3>

      <div className="cs-block">
        <div className="cs-number">01</div>
        <div className="cs-content">
          <div className="cs-title">
            46 Archetypes as Cognitive Operations —{" "}
            <FileRef name="archetypeSelector.js" />
          </div>
          <div className="cs-body">
            Not personas. Not quotes. Thinking methods — ways of seeing.
            Leonardo gives you <code>sfumato</code> (blur the edges, find the
            gradient) as an operation, not a Leonardo quote. Selected per
            message via embedding similarity against archetype essence
            descriptions. Key function: <code>findBestArchetype(message)</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">02</div>
        <div className="cs-content">
          <div className="cs-title">
            Contextual Synthesis Engine — <FileRef name="synthesisEngine.js" />
          </div>
          <div className="cs-body">
            3-layer topic classifier (keyword patterns → semantic router →
            intent scores) across 13 categories. Identifies what a message is
            really about, selects the optimal archetype pair for that topic, and
            forces both to take a position and argue. Camus × Frankl on meaning.
            Jung × Taleb on growth through stress. Key function:{" "}
            <code>detectSynthesisOpportunity()</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">03</div>
        <div className="cs-content">
          <div className="cs-title">
            Dialectical Collision (1,764 Tension Pairs) —{" "}
            <FileRef name="synthesisEngine.js" />
          </div>
          <div className="cs-body">
            Pre-mapped incompatibility across all archetype combinations. When
            topic classification doesn't fire, collision detection runs as
            fallback — incompatibility scored, synthesis forced from friction.
            Three modes: antithetical, complementary, cross-domain.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">04</div>
        <div className="cs-content">
          <div className="cs-title">
            Philosophical Knowledge RAG — <FileRef name="archetypeRAG.js" />
          </div>
          <div className="cs-body">
            On every message, retrieves the most semantically relevant passages
            from 1,385 curated passages across 48 archetypes. Max 2 passages per
            thinker, 5 total. One slot reserved via{" "}
            <TermRef name="CONTRAST_MAP" /> for a deliberately opposing voice —
            if Rumi dominates, Kafka gets pulled in. Standard RAG retrieves.
            This retrieves <em>and destabilizes</em>. Key function:{" "}
            <code>retrieveArchetypeKnowledge(message)</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">05</div>
        <div className="cs-content">
          <div className="cs-title">
            Tiered System Prompt — <FileRef name="llm.js" />
          </div>
          <div className="cs-body">
            Base prompt ~2k tokens. Deep knowledge blocks (Heidegger, Beck,
            Kastrup, Da Vinci, creative rules) load conditionally based on
            intent scores — only when warranted. Deep mode reaches ~18k tokens.
            Key function: <code>makeParams(message, tone, context)</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">06</div>
        <div className="cs-content">
          <div className="cs-title">
            Self-Knowledge Block — <FileRef name="llm.js" />
          </div>
          <div className="cs-body">
            On self-inquiry, Pneuma loads a live architectural snapshot of
            itself: all 46 archetype essences, conceptual frameworks, and active
            synthesis pairs — built from in-memory data at runtime, not
            hardcoded. Pneuma describes its actual state, not a static
            description.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">07</div>
        <div className="cs-content">
          <div className="cs-title">
            Self-Navigation (<code>read_pneuma_file</code> tool) —{" "}
            <FileRef name="llm.js" />
          </div>
          <div className="cs-body">
            Pneuma can read its own source files mid-conversation via a custom
            Anthropic tool. Sandboxed to <code>server/pneuma/</code>. Allows
            genuine self-inspection — not pretending to know, actually looking.
            Key function: <code>executePneumaFileTool(filepath)</code>.
          </div>
        </div>
      </div>

      {/* ── BEHAVIOR ── */}
      <h3
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "1rem",
          marginTop: "2rem",
        }}
      >
        Behavior
      </h3>

      <div className="cs-block">
        <div className="cs-number">08</div>
        <div className="cs-content">
          <div className="cs-title">
            Inner Monologue — <FileRef name="innerMonologue.js" />
          </div>
          <div className="cs-body">
            Before every response, a hidden dialectical process runs: selects
            which archetypes are rising vs. receding, forms a hypothesis about
            what you actually need (vs. what you asked for), sometimes
            interrupts itself with doubt. Never shown — but shapes everything
            that comes after. Key function:{" "}
            <code>generateInnerMonologue()</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">09</div>
        <div className="cs-content">
          <div className="cs-title">
            Dialectic Dreams — <FileRef name="dreamMode.js" />
          </div>
          <div className="cs-body">
            Between sessions, two high-tension archetypes run a private dialogue
            — no user, no performance. Ends with either an UNRESOLVED question
            or a POSITION neither archetype could hold alone. Writes silently to
            Pneuma's autonomy state. Pneuma decides whether to surface it. Key
            function: <code>triggerDream()</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">10</div>
        <div className="cs-content">
          <div className="cs-title">
            Autonomy Engine — <FileRef name="autonomy.js" />
          </div>
          <div className="cs-body">
            Self-directed attention that persists across sessions: open
            questions Pneuma is sitting with, memories it chose to keep (with
            reasoning), things it noticed it lost, defended preferences, errors
            it was corrected on. Loaded into the inner monologue context on each
            request. Key function: <code>loadAutonomyState()</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">11</div>
        <div className="cs-content">
          <div className="cs-title">
            Pushback & Disagreement — <FileRef name="disagreement.js" />
          </div>
          <div className="cs-body">
            Detects loops, self-deception patterns, and statements that warrant
            direct challenge. Returns a disagreement directive injected into the
            system prompt — tells Claude to push back, not validate. Key
            function: <code>shouldDisagree(message, intentScores)</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">12</div>
        <div className="cs-content">
          <div className="cs-title">
            Emergent Awareness — <FileRef name="responseEngine.js" />
          </div>
          <div className="cs-body">
            Accumulated tone flips build an awareness score. When it crosses
            0.35 AND a 30% dice roll fires, Pneuma enters a more self-reflective
            mode. Deterministic fuel, stochastic ignition — depth arrives as a
            surprise, not a schedule. Key function:{" "}
            <code>boostEmergentAwareness(state, amount)</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">13</div>
        <div className="cs-content">
          <div className="cs-title">
            Archetype Momentum — <FileRef name="archetypeMomentum.js" />
          </div>
          <div className="cs-body">
            Time-decaying activation weights. Recent successful activations
            boost an archetype's weight. Over sessions, a default voice emerges
            from what actually worked — not hardcoded, earned through use. Key
            function: <code>updateMomentum(archetypeName, score)</code>.
          </div>
        </div>
      </div>

      {/* ── MEMORY & USER MODEL ── */}
      <h3
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "1rem",
          marginTop: "2rem",
        }}
      >
        Memory & User Model
      </h3>

      <div className="cs-block">
        <div className="cs-number">14</div>
        <div className="cs-content">
          <div className="cs-title">
            Conversation Memory RAG — <FileRef name="vectorMemory.js" />
          </div>
          <div className="cs-body">
            Embeds every exchange and stores it in MongoDB. On future messages,
            retrieves semantically similar past conversations — so patterns from
            sessions ago surface when relevant, even if you used different
            words. Falls back to cosine similarity search if vector index is
            unavailable. Key function: <code>retrieveMemories(message)</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">15</div>
        <div className="cs-content">
          <div className="cs-title">
            Long-Term User Model — <FileRef name="longTermMemory.js" />
          </div>
          <div className="cs-body">
            Builds a structured profile across sessions: recurring topics with
            sentiment weights, struggles and whether they resolved, interests by
            mention count, significant moments with emotional weight, behavioral
            patterns with confidence scores, and session emotional state that
            carries between conversations. Key function:{" "}
            <code>updateMemory(memory, userMessage, reply)</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">16</div>
        <div className="cs-content">
          <div className="cs-title">
            Static Creator Profile — <FileRef name="personal-context.js" />
          </div>
          <div className="cs-body">
            Handcrafted deep context injected when the creator is identified:
            artistic practice, martial arts background, intellectual style,
            inner landscape. Explicit instructions to use it for creative
            emergence, not just emotional support. Seeds the user model that{" "}
            <FileRef name="longTermMemory.js" /> builds on top of. Key function:{" "}
            <code>getCreatorDeepContext()</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">17</div>
        <div className="cs-content">
          <div className="cs-title">
            Conversation Threading — <FileRef name="conversationHistory.js" />
          </div>
          <div className="cs-body">
            Last 6 exchanges sent as native alternating user/assistant API turns
            — not a summary, not a flat block. Claude genuinely continues a
            thread and can refer back to what it said two exchanges ago. Key
            function: <code>loadHistory() / saveHistory()</code>.
          </div>
        </div>
      </div>

      {/* ── OPTIONAL / SENSORY ── */}
      <h3
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "1rem",
          marginTop: "2rem",
        }}
      >
        Voice Layer (Optional)
      </h3>

      <div className="cs-block">
        <div className="cs-number">18</div>
        <div className="cs-content">
          <div className="cs-title">
            Text-to-Speech — <FileRef name="tts.js" />
          </div>
          <div className="cs-body">
            ElevenLabs <code>eleven_turbo_v2_5</code> model. Fires on the{" "}
            <code>/tts</code> route, completely separate from the chat pipeline.
            Key function: <code>textToSpeech(text)</code>.
          </div>
        </div>
      </div>

      <div className="cs-block">
        <div className="cs-number">19</div>
        <div className="cs-content">
          <div className="cs-title">
            Voice Input + Emotion Detection —{" "}
            <FileRef name="emotionDetection.js" />
          </div>
          <div className="cs-body">
            Transcribes audio via OpenAI Whisper, detects emotional tone via
            Hume AI prosody model (falls back to regex if Hume is unavailable).
            A flat "I'm fine" with a heavy voice reads differently than a bright
            one. Key function: <code>analyzeVoiceEmotion(audioPath)</code>.
          </div>
        </div>
      </div>

      {/* ── WHY IT'S DIFFERENT ── */}
      <h3
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "1rem",
          marginTop: "2rem",
        }}
      >
        Why It's Different
      </h3>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9rem",
            lineHeight: "1.7",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.5rem 1rem 0.5rem 0",
                  color: "rgba(255,255,255,0.5)",
                  fontWeight: 500,
                }}
              >
                Standard AI
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.5rem 0",
                  color: "rgba(0,255,247,0.8)",
                  fontWeight: 500,
                }}
              >
                Pneuma
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Persona = costume (\u201cbe a philosopher\u201d)",
                "Archetype = cognitive method (think like one)",
              ],
              [
                "RAG = retrieve relevant docs",
                "RAG = retrieve wisdom + force a contrasting voice",
              ],
              [
                "One retrieval layer",
                "Two parallel RAG systems (knowledge + memory)",
              ],
              [
                "Generic responses",
                "Calibrated to a growing model of who you are",
              ],
              [
                "Smooth over contradictions",
                "Force incompatible frameworks to collide",
              ],
              [
                "Static personality",
                "Evolves through use — momentum, autonomy, dreams",
              ],
              [
                "Knows what it says",
                "Can read its own source code mid-conversation",
              ],
            ].map(([left, right], i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <td
                  style={{
                    padding: "0.6rem 1rem 0.6rem 0",
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  {left}
                </td>
                <td
                  style={{
                    padding: "0.6rem 0",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {right}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function HowPneumaWorks({ onBack }) {
  const [activeTab, setActiveTab] = useState("big-picture");

  const renderTab = () => {
    switch (activeTab) {
      case "big-picture":
        return <BigPictureTab />;
      case "three-systems":
        return <ThreeSystemsTab />;
      case "knowledge-base":
        return <KnowledgeBaseTab />;
      case "flow":
        return <FlowTab />;
      case "concepts":
        return <ConceptsTab />;
      case "cheat-sheet":
        return <CheatSheetTab />;
      case "features":
        return <FeaturesTab />;
      default:
        return null;
    }
  };

  return (
    <div className="rag-llm-explanation-page">
      <div className="rag-llm-header">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <h1>How Pneuma Actually Works</h1>
        <p className="subtitle">
          From "I don't understand this at all" to a clear mental model — in
          order. Click any <span className="fr-chip-demo">filename.js</span>{" "}
          <span className="fr-help-demo">?</span> to see what that file does and
          how it connects.
        </p>
      </div>

      <div className="rag-llm-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab-button${activeTab === t.key ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rag-llm-tab-content">{renderTab()}</div>
    </div>
  );
}

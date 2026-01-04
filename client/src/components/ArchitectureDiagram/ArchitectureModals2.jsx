import React, { useState } from 'react';
import Modal, {
  ModalSection,
  ModalFilePath,
  ModalCodeBlock,
  ModalFlow,
  ModalLink,
  ModalInfoCard,
  ModalExample,
  ModalDesc,
  ModalTagGrid,
  ModalTag,
  ModalPrompt,
  ModalInfoGrid
} from '../Modal/Modal';
import {
  TensionIcon,
  DepthIcon,
  SynthesisIcon,
  PromptIcon,
  ClaudeIcon,
  PipelineIcon,
  AssemblyIcon,
  OutputIcon
} from '../Modal/Icons';

// ============================================
// TENSION MAP CHECK MODAL (Step 6)
// ============================================
export const TensionMapModal = ({ isOpen, onClose, anchorEl }) => {
  const [nestedModal, setNestedModal] = useState(null);
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Tension Map Check" icon={TensionIcon} layer="archetype" anchorEl={anchorEl}>
        <ModalSection title="Dialectical Collision Detection">
          <ModalDesc>
            Not all archetype combinations produce interesting results. Pneuma maintains
            a tension map of 1,764 archetype pairs, rating each as high/medium/low/neutral
            tension. High-tension pairs create the most interesting collisions.
          </ModalDesc>
          
          <ModalFilePath path="server/pneuma/archetypes/archetypeDepth.js" />
        </ModalSection>

        <ModalSection title="Why Tension Matters">
          <ModalDesc>
            When archetypes agree, responses become one-note. When they productively 
            disagree, something new emerges. This is the core mechanism of Pneuma's 
            "collision product" architecture.
          </ModalDesc>
          <ModalExample label="Example">
            Jung + Watts = Medium tension (both value the unconscious)<br />
            Jung + Taleb = HIGH tension (structure vs antifragility)<br />
            Eckhart + Rumi = Low tension (similar mystical orientation)
          </ModalExample>
        </ModalSection>

        <ModalSection title="Tension Levels">
          <ModalInfoGrid>
            <ModalInfoCard 
              title="HIGH Tension" 
              desc="Fundamental disagreement. Synthesis required. Most generative."
              icon="🔥"
              onClick={() => setNestedModal('high')}
            />
            <ModalInfoCard 
              title="MEDIUM Tension" 
              desc="Different emphasis but compatible. Good for nuance."
              icon="⚡"
              onClick={() => setNestedModal('medium')}
            />
            <ModalInfoCard 
              title="LOW Tension" 
              desc="Similar worldviews. Deepens rather than challenges."
              icon="〰️"
              onClick={() => setNestedModal('low')}
            />
            <ModalInfoCard 
              title="NEUTRAL" 
              desc="Unrelated domains. No productive collision."
              icon="○"
              onClick={() => setNestedModal('neutral')}
            />
          </ModalInfoGrid>
        </ModalSection>

        <ModalSection title="Detection Code">
          <ModalCodeBlock>{`function detectCollisions(archetypes) {
  const collisions = [];
  
  for (let i = 0; i < archetypes.length; i++) {
    for (let j = i + 1; j < archetypes.length; j++) {
      const tension = getTensionLevel(archetypes[i], archetypes[j]);
      if (tension === 'high' || tension === 'medium') {
        collisions.push({
          pair: [archetypes[i], archetypes[j]],
          level: tension,
          theme: getTensionTheme(archetypes[i], archetypes[j])
        });
      }
    }
  }
  
  return collisions;
}

// Returns: [{ pair: ['jung', 'taleb'], level: 'high', 
//            theme: 'order-chaos' }]`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'high'} 
        onClose={() => setNestedModal(null)} 
        title="High Tension Pairs"
        icon="🔥"
        isNested
      >
        <ModalSection>
          <ModalDesc>High tension pairs represent fundamental worldview conflicts:</ModalDesc>
          <ModalCodeBlock>{`// Sample HIGH tension pairs
{
  'spinoza_kierkegaard': {
    tension: 'high',
    theme: 'reason-faith',
    synthesis: 'Can systematic thought lead to the leap?'
  },
  'nietzsche_eckhart': {
    tension: 'high', 
    theme: 'will-surrender',
    synthesis: 'Is letting go the ultimate act of power?'
  },
  'jung_taleb': {
    tension: 'high',
    theme: 'order-antifragility',
    synthesis: 'Does the shadow strengthen through stress?'
  }
}`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'medium'} 
        onClose={() => setNestedModal(null)} 
        title="Medium Tension Pairs"
        icon="⚡"
        isNested
      >
        <ModalSection>
          <ModalDesc>Medium tension creates productive friction without fundamental opposition:</ModalDesc>
          <ModalCodeBlock>{`// Sample MEDIUM tension pairs
{
  'watts_aurelius': {
    tension: 'medium',
    theme: 'flow-discipline',
    synthesis: 'Disciplined spontaneity'
  },
  'jung_laotzu': {
    tension: 'medium',
    theme: 'structure-formlessness', 
    synthesis: 'Pattern recognition in the void'
  }
}`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'low'} 
        onClose={() => setNestedModal(null)} 
        title="Low Tension Pairs"
        icon="〰️"
        isNested
      >
        <ModalSection>
          <ModalDesc>Low tension pairs deepen a single perspective:</ModalDesc>
          <ModalExample>
            Rumi + Hafiz = Both Sufi poets, similar mystical vision<br />
            Watts + Laotzu = Both non-dual, Taoist-adjacent<br />
            Aurelius + Epictetus = Both Stoics
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'neutral'} 
        onClose={() => setNestedModal(null)} 
        title="Neutral Pairs"
        icon="○"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Neutral pairs have no meaningful interaction. They're talking past each other.
            The system tries to avoid these combinations.
          </ModalDesc>
          <ModalExample>
            Sun Tzu + Rilke = Strategy and poetry, no intersection<br />
            Feynman + Rumi = Science and mysticism (unless bridged deliberately)
          </ModalExample>
        </ModalSection>
      </Modal>
    </>
  );
};

// ============================================
// 5-LAYER DEPTH EXTRACTION MODAL (Step 7)
// ============================================
export const DepthExtractionModal = ({ isOpen, onClose, anchorEl }) => {
  const [nestedModal, setNestedModal] = useState(null);
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="5-Layer Depth Extraction" icon={DepthIcon} layer="archetype" anchorEl={anchorEl}>
        <ModalSection title="Beyond Surface Quotes">
          <ModalDesc>
            Each archetype isn't just a name — it's a structured knowledge bank. For each 
            active archetype, Pneuma extracts relevant content from 5 depth layers.
          </ModalDesc>
          
          <ModalFilePath path="server/pneuma/archetypes/archetypeDepth.js" />
        </ModalSection>

        <ModalSection title="The 5 Layers">
          <ModalInfoGrid>
            <ModalInfoCard 
              title="1. Core Frameworks" 
              desc="Central concepts and theories"
              icon="🏛️"
              onClick={() => setNestedModal('core')}
            />
            <ModalInfoCard 
              title="2. Cognitive Tools" 
              desc="Ways of thinking and analyzing"
              icon="🔧"
              onClick={() => setNestedModal('cognitive')}
            />
            <ModalInfoCard 
              title="3. Fundamental Tensions" 
              desc="Internal contradictions to hold"
              icon="⚖️"
              onClick={() => setNestedModal('tensions')}
            />
            <ModalInfoCard 
              title="4. Conceptual Bridges" 
              desc="Connections to other domains"
              icon="🌉"
              onClick={() => setNestedModal('bridges')}
            />
            <ModalInfoCard 
              title="5. Translation Protocols" 
              desc="How to speak in their voice"
              icon="🗣️"
              onClick={() => setNestedModal('translation')}
            />
          </ModalInfoGrid>
        </ModalSection>

        <ModalSection title="Extraction Process">
          <ModalCodeBlock>{`async function extractDepth(archetype, message, intents) {
  const depth = ARCHETYPE_DEPTH[archetype];
  const extracted = {};
  
  // Always include core frameworks
  extracted.core = depth.coreFrameworks;
  
  // Select cognitive tools based on intent
  extracted.tools = selectRelevantTools(depth.cognitiveTools, intents);
  
  // Include tensions if conflict intent is high
  if (intents.conflict > 0.4) {
    extracted.tensions = depth.fundamentalTensions;
  }
  
  // Semantic search for relevant bridges
  extracted.bridges = await searchBridges(depth.bridges, message);
  
  // Always include translation for voice consistency
  extracted.translation = depth.translationProtocol;
  
  return extracted;
}`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'core'} 
        onClose={() => setNestedModal(null)} 
        title="Core Frameworks"
        icon="🏛️"
        isNested
      >
        <ModalSection>
          <ModalDesc>The fundamental ideas that define each archetype:</ModalDesc>
          <ModalExample label="Jung's Core Frameworks">
            • The Shadow — Rejected aspects of self<br />
            • Individuation — Integration journey<br />
            • Archetypes — Universal patterns in the collective unconscious<br />
            • Anima/Animus — Contrasexual elements<br />
            • Synchronicity — Meaningful coincidence
          </ModalExample>
          <ModalExample label="Nietzsche's Core Frameworks">
            • Will to Power — Fundamental drive<br />
            • Eternal Recurrence — Affirmation test<br />
            • Übermensch — Self-overcoming<br />
            • Master/Slave Morality — Value origins<br />
            • Amor Fati — Love of fate
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'cognitive'} 
        onClose={() => setNestedModal(null)} 
        title="Cognitive Tools"
        icon="🔧"
        isNested
      >
        <ModalSection>
          <ModalDesc>Ways of thinking that each archetype provides:</ModalDesc>
          <ModalExample label="Feynman's Cognitive Tools">
            • Explain it to a 6-year-old<br />
            • Find the simplest possible example<br />
            • "What do we mean by...?" (definitional clarity)<br />
            • Draw a diagram
          </ModalExample>
          <ModalExample label="Watts's Cognitive Tools">
            • Find the game that's being played<br />
            • Notice what you're doing with your attention<br />
            • Reframe the problem as the answer<br />
            • "This is it" — radical acceptance
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'tensions'} 
        onClose={() => setNestedModal(null)} 
        title="Fundamental Tensions"
        icon="⚖️"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Internal contradictions that each archetype holds. These are NOT flaws — 
            they're productive paradoxes that the archetype navigates.
          </ModalDesc>
          <ModalExample label="Jung's Tensions">
            • Structure ↔ Mystery<br />
            • Scientific ↔ Spiritual<br />
            • Individual ↔ Collective
          </ModalExample>
          <ModalExample label="Kierkegaard's Tensions">
            • Reason ↔ Leap of Faith<br />
            • Despair ↔ Authentic Self<br />
            • Either/Or ↔ Both/And
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'bridges'} 
        onClose={() => setNestedModal(null)} 
        title="Conceptual Bridges"
        icon="🌉"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Pre-mapped connections between domains. Enables cross-pollination.
          </ModalDesc>
          <ModalExample label="Jung → Modern Psychology">
            Shadow → Implicit bias, repression research<br />
            Archetypes → Narrative psychology, hero's journey
          </ModalExample>
          <ModalExample label="Watts → Cognitive Science">
            Non-dual awareness → Predictive processing<br />
            "The ego is a social fiction" → Self-model theory
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'translation'} 
        onClose={() => setNestedModal(null)} 
        title="Translation Protocols"
        icon="🗣️"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            How to speak in each archetype's voice without caricature:
          </ModalDesc>
          <ModalCodeBlock>{`// Watts translation protocol
{
  vocabulary: ['game', 'dance', 'play', 'flow'],
  avoid: ['should', 'must', 'have to'],
  sentence_rhythm: 'conversational, often interrupted',
  use_paradox: true,
  use_humor: true,
  sample_phrase: "You're already there, you just 
                  don't believe it yet."
}

// Nietzsche translation protocol
{
  vocabulary: ['will', 'power', 'overcome', 'become'],
  avoid: ['comfortable', 'safe', 'balanced'],
  sentence_rhythm: 'aphoristic, punchy',
  use_paradox: true,
  use_provocation: true,
  sample_phrase: "The question isn't whether 
                  you're suffering — it's whether 
                  your suffering is making you stronger."
}`}</ModalCodeBlock>
        </ModalSection>
      </Modal>
    </>
  );
};

// ============================================
// SYNTHESIS INJECTION MODAL (Step 8)
// ============================================
export const SynthesisModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Synthesis Injection" icon={SynthesisIcon} layer="synthesis" anchorEl={anchorEl}>
    <ModalSection title="The Collision Product">
      <ModalDesc>
        This is Pneuma's core innovation. When archetypes collide, we don't want Claude 
        to simply quote both. We want it to generate NOVEL INSIGHT that exists in 
        neither archetype alone.
      </ModalDesc>
      
      <ModalFilePath path="server/pneuma/intelligence/synthesisEngine.js" />
    </ModalSection>

    <ModalSection title="Synthesis Directive">
      <ModalDesc>
        When collision is detected, this directive is injected into the system prompt:
      </ModalDesc>
      <ModalPrompt>{`SYNTHESIS REQUIRED:

You have access to: [Jung] and [Taleb]

These frameworks hold tension:
- Jung: Order, structure, categorization
- Taleb: Antifragility, randomness, disorder

DO NOT simply quote both perspectives.
GENERATE insight that exists in NEITHER source alone.

The collision product is the THIRD VOICE — 
what emerges from the contradiction itself.

Example synthesis direction:
"Perhaps the shadow isn't just 'rejected content' but 
ANTIFRAGILE potential — parts of self that STRENGTHEN 
through rejection, that grow from being denied."

This is in neither Jung nor Taleb. It's the collision product.`}</ModalPrompt>
    </ModalSection>

    <ModalSection title="Synthesis Modes">
      <ModalFlow steps={[
        { title: "Dialectical", desc: "Thesis + Antithesis → Synthesis. Classic Hegelian move." },
        { title: "Liminal", desc: "Find the space BETWEEN frameworks. What's true at the boundary?" },
        { title: "Emergent", desc: "Let the combination suggest something neither could alone." },
        { title: "Paradoxical", desc: "Hold both as simultaneously true. Don't resolve." }
      ]} />
    </ModalSection>

    <ModalSection title="Real Example">
      <ModalExample label="Input Collision">
        Archetypes: Eckhart (surrender) + Musashi (mastery)<br />
        Theme: letting-go vs. discipline
      </ModalExample>
      <ModalExample label="Collision Product">
        "True mastery isn't the accumulation of technique — it's the capacity 
        to forget everything you've learned in the moment of action. The 
        swordsman who thinks about his sword has already lost. Discipline 
        builds the vessel; surrender fills it."
      </ModalExample>
    </ModalSection>
  </Modal>
);

// ============================================
// SYSTEM PROMPT ASSEMBLY MODAL (Step 9)
// ============================================
export const SystemPromptModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="System Prompt Assembly" icon={PromptIcon} layer="intelligence" anchorEl={anchorEl}>
    <ModalSection title="The Final Container">
      <ModalDesc>
        Everything assembled so far is now composed into Claude's system prompt. 
        This is the "container" that shapes the response. The prompt is typically 
        2000-4000 tokens.
      </ModalDesc>
      
      <ModalFilePath path="server/pneuma/intelligence/llm.js → buildSystemPrompt()" />
    </ModalSection>

    <ModalSection title="Prompt Structure">
      <ModalFlow steps={[
        { title: "Identity Core", desc: "1200+ lines of Pneuma's base personality, values, communication style" },
        { title: "Archetype Integration", desc: "Selected archetypes with their depth layers" },
        { title: "Synthesis Directives", desc: "If collision detected, synthesis instructions" },
        { title: "Tone Instruction", desc: "Selected tone's prompt (CASUAL, ORACULAR, etc.)" },
        { title: "RAG Context", desc: "Retrieved memories and archetype knowledge" },
        { title: "Conversation History", desc: "Recent messages for continuity" },
        { title: "Meta Instructions", desc: "Response format, length constraints, etc." }
      ]} />
    </ModalSection>

    <ModalSection title="Assembly Code">
      <ModalCodeBlock>{`async function buildSystemPrompt(context) {
  const sections = [];
  
  // 1. Core identity (always included)
  sections.push(PNEUMA_IDENTITY_CORE);
  
  // 2. Active archetypes with depth
  for (const arch of context.archetypes) {
    const depth = await extractDepth(arch, context);
    sections.push(formatArchetypeSection(arch, depth));
  }
  
  // 3. Synthesis directive (if collision)
  if (context.collisions.length > 0) {
    sections.push(buildSynthesisDirective(context.collisions));
  }
  
  // 4. Tone
  sections.push(TONE_PROMPTS[context.tone]);
  
  // 5. Retrieved context
  if (context.ragResults.length > 0) {
    sections.push(formatRAGContext(context.ragResults));
  }
  
  // 6. Conversation history
  sections.push(formatHistory(context.history));
  
  return sections.join('\\n\\n---\\n\\n');
}`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="Token Budget">
      <ModalDesc>
        Claude's context window is limited. The system manages token budgets:
      </ModalDesc>
      <ModalCodeBlock>{`const TOKEN_BUDGET = {
  identity: 1500,      // Fixed
  archetypes: 800,     // ~200 per archetype
  synthesis: 300,      // If needed
  tone: 200,           // One tone prompt
  rag: 500,            // Retrieved context
  history: 1000,       // Recent messages
  response: 1200       // Reserved for output
};`}</ModalCodeBlock>
    </ModalSection>
  </Modal>
);

// ============================================
// CLAUDE API CALL MODAL (Step 10)
// ============================================
export const ClaudeApiModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Claude API Call" icon={ClaudeIcon} layer="llm" anchorEl={anchorEl}>
    <ModalSection title="The Generation Moment">
      <ModalDesc>
        Everything converges here. Claude receives the assembled prompt and generates
        the response through pattern completion. The response emerges from the 
        "container" we've built.
      </ModalDesc>
      
      <ModalFilePath path="server/pneuma/intelligence/llm.js" />
    </ModalSection>

    <ModalSection title="API Configuration">
      <ModalCodeBlock>{`const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1200,
  temperature: 0.85,  // High for creativity
  system: systemPrompt,
  messages: [
    ...conversationHistory,
    { role: "user", content: userMessage }
  ],
  stream: true  // Token-by-token streaming
});`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="API Used">
      <div className="modal-api-badge">
        <span>🤖</span> Anthropic Claude API
      </div>
      <ModalDesc style={{ marginTop: '15px' }}>
        Pneuma uses Claude claude-sonnet-4-20250514 via the official Anthropic SDK. The API is called
        with streaming enabled, allowing real-time token delivery to the frontend.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="Why Temperature 0.85?">
      <ModalDesc>
        Temperature controls randomness. Lower = more deterministic, higher = more creative.
        0.85 is high because Pneuma is designed for generative, creative responses rather 
        than factual retrieval. The archetypes provide structure; temperature provides life.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="Streaming Response">
      <ModalCodeBlock>{`for await (const event of response) {
  if (event.type === 'content_block_delta') {
    const token = event.delta.text;
    
    // Send to client via SSE
    onChunk({ type: 'token', content: token });
    
    // Accumulate for post-processing
    fullResponse += token;
  }
}`}</ModalCodeBlock>
    </ModalSection>
  </Modal>
);

// ============================================
// RESPONSE PIPELINE MODAL (Step 11)
// ============================================
export const ResponsePipelineModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Response Pipeline (4-Layer)" icon={PipelineIcon} layer="output" anchorEl={anchorEl}>
    <ModalSection title="Post-Generation Processing">
      <ModalDesc>
        Claude's raw output passes through 4 processing layers before reaching the user.
        Each layer refines the response while preserving the core content.
      </ModalDesc>
      
      <ModalFilePath path="server/pneuma/core/responseEngine.js → generate()" />
    </ModalSection>

    <ModalSection title="The 4 Layers">
      <ModalFlow steps={[
        { title: "Intent Alignment", desc: "Verify response matches detected intent. If user asked emotional question, response should be emotionally attuned." },
        { title: "Tone Consistency", desc: "Ensure the selected tone is maintained throughout. Catch unintentional shifts." },
        { title: "Personality Check", desc: "Verify response sounds like Pneuma, not generic ChatGPT. Check for banned phrases." },
        { title: "Continuity Layer", desc: "Ensure coherence with conversation history. Reference previous points naturally." }
      ]} />
    </ModalSection>

    <ModalSection title="Processing Code">
      <ModalCodeBlock>{`async function processResponse(raw, context) {
  let response = raw;
  
  // Layer 1: Intent alignment
  response = alignToIntent(response, context.intents);
  
  // Layer 2: Tone consistency  
  response = enforceTone(response, context.tone);
  
  // Layer 3: Personality check
  response = filterBlacklist(response, BANNED_PHRASES);
  response = ensurePneumaVoice(response);
  
  // Layer 4: Continuity
  response = addContinuityHooks(response, context.history);
  
  return response;
}`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="Banned Phrases">
      <ModalDesc>
        Certain phrases are filtered to prevent generic AI-speak:
      </ModalDesc>
      <ModalCodeBlock>{`const BANNED_PHRASES = [
  "As an AI language model",
  "I don't have feelings",
  "I'm just a program",
  "Let me be clear",
  "It's important to note",
  "I cannot stress enough",
  "At the end of the day"
];`}</ModalCodeBlock>
    </ModalSection>
  </Modal>
);

// ============================================
// FINAL ASSEMBLY MODAL (Step 12)
// ============================================
export const FinalAssemblyModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Final Assembly" icon={AssemblyIcon} layer="output" anchorEl={anchorEl}>
    <ModalSection title="Last Mile Processing">
      <ModalDesc>
        The response is finalized, state is updated, and everything is persisted
        for future conversations.
      </ModalDesc>
      
      <ModalFilePath path="server/pneuma/core/fusion.js" />
    </ModalSection>

    <ModalSection title="Final Steps">
      <ModalFlow steps={[
        { title: "Context-Aware Prefix", desc: "Optionally prepend phrases based on context (e.g., 'Coming back to what you said...')" },
        { title: "State Update", desc: "Update emotional state, archetype momentum, session mood" },
        { title: "Memory Persistence", desc: "Store conversation turn in vector memory for future RAG" },
        { title: "History Update", desc: "Append to conversation history JSON" },
        { title: "Token Tracking", desc: "Log token usage for monitoring" }
      ]} />
    </ModalSection>

    <ModalSection title="State Update">
      <ModalCodeBlock>{`async function updateState(response, context) {
  const state = await loadState();
  
  // Update emotional baseline (gradual shift)
  state.emotionalTone = blend(
    state.emotionalTone, 
    context.detectedEmotion, 
    0.3
  );
  
  // Track archetype usage (momentum system)
  context.archetypes.forEach(a => {
    state.archetypeMomentum[a] = 
      (state.archetypeMomentum[a] || 0) + 1;
  });
  
  // Decay unused archetypes
  Object.keys(state.archetypeMomentum).forEach(a => {
    if (!context.archetypes.includes(a)) {
      state.archetypeMomentum[a] *= 0.9;
    }
  });
  
  await saveState(state);
}`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="Memory Embedding">
      <ModalDesc>
        Each conversation turn is embedded and stored for future retrieval:
      </ModalDesc>
      <ModalCodeBlock>{`async function storeMemory(userMessage, response, context) {
  const memory = {
    user: userMessage,
    pneuma: response,
    archetypes: context.archetypes,
    tone: context.tone,
    timestamp: Date.now(),
    embedding: await embed(userMessage + response)
  };
  
  await vectorMemory.add(memory);
  await conversationHistory.append(memory);
}`}</ModalCodeBlock>
    </ModalSection>
  </Modal>
);

// ============================================
// OUTPUT MODAL
// ============================================
export const OutputModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Pneuma Response" icon={OutputIcon} layer="output" anchorEl={anchorEl}>
    <ModalSection title="The Collision Product Emerges">
      <ModalDesc>
        The response arrives at the user — shaped by dialectical synthesis, 
        infused with archetype wisdom, and refined through the full pipeline.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="What Makes It Unique">
      <ModalFlow steps={[
        { title: "Not Generic AI", desc: "Filtered through Pneuma's specific personality and values" },
        { title: "Not Single Perspective", desc: "Multiple archetypes create emergent viewpoint" },
        { title: "Not Static", desc: "Adapts to user over time through memory and state" },
        { title: "Not Predictable", desc: "Random injection and antagonist pairs create variation" }
      ]} />
    </ModalSection>

    <ModalSection title="Response Metadata">
      <ModalDesc>
        Each response carries metadata that can be displayed or logged:
      </ModalDesc>
      <ModalCodeBlock>{`{
  content: "The response text...",
  metadata: {
    archetypes: ["jung", "watts", "taleb"],
    tone: "ORACULAR",
    collisionDetected: true,
    synthesisMode: "dialectical",
    tokensUsed: 847,
    processingTime: 2340  // ms
  }
}`}</ModalCodeBlock>
    </ModalSection>
  </Modal>
);

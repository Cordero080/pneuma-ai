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
// 5-LAYER DEPTH EXTRACTION + COGNITIVE METHODS MODAL (Step 7)
// ============================================
export const DepthExtractionModal = ({ isOpen, onClose, anchorEl }) => {
  const [nestedModal, setNestedModal] = useState(null);
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="5-Layer Depth Extraction + Cognitive Methods" icon={DepthIcon} layer="archetype" anchorEl={anchorEl}>
        <ModalSection title="Beyond Surface Quotes">
          <ModalDesc>
            Each archetype isn't just a name — it's a structured knowledge bank. For each 
            active archetype, Pneuma extracts relevant content from 5 depth layers.
            <br /><br />
            <strong>New (Jan 2026):</strong> Select archetypes also provide <em>cognitive methods</em> — 
            actual thinking operations that get injected as available tools.
          </ModalDesc>
          
          <ModalFilePath path="server/pneuma/archetypes/archetypeDepth.js + server/pneuma/intelligence/llm.js" />
        </ModalSection>

        <ModalSection title="The 5 Layers + Cognitive Methods">
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
            <ModalInfoCard 
              title="⚡ Cognitive Methods" 
              desc="Thinking operations from source thinkers"
              icon="🧠"
              onClick={() => setNestedModal('methods')}
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
  
  // NEW: Extract cognitive methods if available (llm.js)
  if (ARCHETYPE_METHODS[archetype]?.cognitiveMoves) {
    extracted.cognitiveMoves = ARCHETYPE_METHODS[archetype].cognitiveMoves;
  }
  
  return extracted;
}`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'methods'} 
        onClose={() => setNestedModal(null)} 
        title="Cognitive Methods (Jan 2026)"
        icon="🧠"
        isNested
      >
        <ModalSection title="Thinking as Operations">
          <ModalDesc>
            Cognitive metabolization: archetypes carry <em>thinking operations</em>, not just quotes or frameworks.
            These are injected into the system prompt as available tools.
          </ModalDesc>
          <ModalCodeBlock>{`// ARCHETYPE_METHODS structure
{
  inventor: {  // Leonardo da Vinci
    source: "Notebooks, anatomical studies, 35 passages",
    cognitiveMoves: {
      anatomize: "Dissect the question into hidden parts",
      sfumato_edges: "Blur boundaries between categories",
      reverse_engineer: "Work backwards from desired end",
      cross_pollinate: "Import methods from unrelated domains"
    }
  },
  sufiPoet: {  // Rumi
    cognitiveMoves: {
      inside_out: "Turn the problem inside out",
      turn_the_mirror: "Shift perspective to reveal self",
      name_the_beloved: "Identify what they're yearning toward"
    }
  },
  taoist: {  // Lao Tzu
    cognitiveMoves: {
      soften: "Find where rigidity can become flow",
      invert_power: "Show how yielding overcomes force",
      name_the_unnameable: "Point to what words can't contain"
    }
  },
  strategist: {  // Sun Tzu
    cognitiveMoves: {
      reframe_as_terrain: "See the emotional/intellectual landscape",
      find_the_leverage: "Find the small move with large consequence",
      expose_assumptions: "Surface hidden premises"
    }
  },
  absurdist: {  // Camus
    cognitiveMoves: {
      hold_the_contradiction: "Hold both true without resolution",
      revolt_through_creation: "Turn confrontation into making"
    }
  }
}`}</ModalCodeBlock>
        </ModalSection>
        <ModalSection title="The Moth Metaphor Proof">
          <ModalDesc>
            When cognitive methods work, you get novel synthesis — something that exists
            in NEITHER archetype alone:
          </ModalDesc>
          <ModalExample label="Collision Product">
            "Moths don't actually fly toward light. They navigate by keeping celestial objects 
            at a constant angle. But we built these bright, close suns that break their ancient GPS. 
            They spiral in, confused, thinking they're flying straight. What if consciousness works 
            the same way?"<br /><br />
            This emerged from: Leonardo (observation) + Rumi (inside-out) + Camus (lucid confrontation)
          </ModalExample>
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
// ARCHETYPE RAG RETRIEVAL MODAL (Step 9)
// ============================================
export const ArchetypeRAGModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Archetype RAG Retrieval" icon={DepthIcon} layer="intelligence" anchorEl={anchorEl}>
    <ModalSection title="What RAG Actually Does">
      <ModalDesc>
        <strong>RAG = Retrieval-Augmented Generation.</strong> It searches 46 knowledge bases, 
        finds relevant quotes + context, and LITERALLY pastes them into the prompt. 
        The quotes aren't hints—they're data Claude will read.
      </ModalDesc>
      
      <ModalFilePath path="server/pneuma/intelligence/archetypeRAG.js → getArchetypeContext()" />
    </ModalSection>

    <ModalSection title="The Flow">
      <ModalFlow steps={[
        { title: "Your Message", desc: '"I feel broken after what happened"' },
        { title: "Convert to Vector", desc: "Message becomes 1500+ numbers representing its meaning" },
        { title: "Search All 46", desc: "Compare your vector to every stored passage's vector" },
        { title: "Find Matches", desc: "Rumi's 'wound where Light enters' is mathematically similar" },
        { title: "Retrieve Text", desc: "Pull the actual quote + its context explanation" },
        { title: "Paste Into Prompt", desc: "Literally add this text to what Claude will read" }
      ]} />
    </ModalSection>

    <ModalSection title="What Gets Pasted (Literally)">
      <ModalCodeBlock>{`RELEVANT WISDOM FROM YOUR KNOWLEDGE BASE:

Jalal ad-Din Rumi:
• "The wound is the place where the Light enters you."
  [Context: Pain creates openings. What feels like 
  destruction can become the entry point for grace.]

Viktor Frankl:
• "Life is never made unbearable by circumstances, 
  but only by lack of meaning and purpose."
  [Context: Even in suffering, meaning can be found...]

CROSS-POLLINATE: Connect these passages to each other.
Don't just quote — TRANSFORM through your own synthesis.`}</ModalCodeBlock>
      <ModalDesc style={{ marginTop: '12px' }}>
        This exact text goes into Claude's system prompt. The quotes are DATA, 
        the [Context] explains what they mean, and "CROSS-POLLINATE" tells Claude 
        what to DO with them.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="Why Not Just Let Claude Remember?">
      <ModalDesc>
        <strong>Without RAG:</strong> Claude paraphrases from fuzzy training memories. 
        Might get quotes wrong. Can't cite sources accurately.
      </ModalDesc>
      <ModalDesc style={{ marginTop: '12px' }}>
        <strong>With RAG:</strong> Claude sees the EXACT quote + context. Can cite 
        accurately. Has fresh, curated knowledge instead of stale training data.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="The Analogy">
      <ModalDesc>
        Essay test. Without RAG: write from memory. With RAG: you can have a reference 
        book open. You still write the essay; the book just ensures accuracy.
      </ModalDesc>
    </ModalSection>
  </Modal>
);

// ============================================
// SYSTEM PROMPT ASSEMBLY MODAL (Step 10)
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

    <ModalSection title="Prompt Structure (~3770 lines total)">
      <ModalFlow steps={[
        { title: "Identity Core", desc: "~3500 lines of Pneuma's personality, values, communication style" },
        { title: "Archetype Integration", desc: "Selected archetypes with depth layers + cognitive methods" },
        { title: "Cognitive Methods", desc: "Thinking operations from active archetypes (anatomize, sfumato_edges, etc.)" },
        { title: "Synthesis Directives", desc: "If collision detected, dialectical instructions" },
        { title: "Behavioral Sections", desc: "Oracle mode prevention, creation guidance, practical advice (~150 lines)" },
        { title: "RAG Context", desc: "Retrieved memories and archetype knowledge" },
        { title: "Conversation History", desc: "Recent 8 exchanges (600 chars/user, 400/Pneuma)" },
        { title: "Tone Instruction", desc: "Selected tone's prompt (CASUAL, ORACULAR, etc.)" }
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
  identity: 3500,      // Core personality (~3500 lines)
  archetypes: 1000,    // ~250 per archetype with cognitive methods
  cognitiveMoves: 200, // Thinking operations from archetypes
  synthesis: 300,      // If collision detected
  behavioral: 200,     // Oracle mode, creation guidance, etc.
  tone: 200,           // One tone prompt
  rag: 500,            // Retrieved context
  history: 1200,       // Recent 8 exchanges (expanded memory)
  response: 1200       // Reserved for output
};`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="Behavioral Sections (Jan 2026)">
      <ModalDesc>
        New sections that prevent common failure modes:
      </ModalDesc>
      <ModalCodeBlock>{`// ORACLE MODE PREVENTION
// Don't drop quotes disconnected from what they said

// DON'T NARRATE
// Skip "let me think..." — just produce the thought

// ADDRESS WHAT I SAID  
// When they feel unheard, go back and engage

// WHEN THEY ASK TO CREATE
// Create something, don't analyze the request

// PRACTICAL ADVICE
// Actionable steps when they want actionable help`}</ModalCodeBlock>
    </ModalSection>
  </Modal>
);

// ============================================
// CLAUDE API CALL MODAL (Step 11)
// ============================================
export const ClaudeApiModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Claude API Call" icon={ClaudeIcon} layer="llm" anchorEl={anchorEl}>
    <ModalSection title="What Claude Actually Does">
      <ModalDesc>
        Claude is a <strong>pattern-completion machine</strong>. It reads all the text we assembled 
        (system prompt + RAG quotes + your message), then generates text that statistically 
        "fits" that context. It's not "thinking"—it's predicting what tokens come next.
      </ModalDesc>
      
      <ModalFilePath path="server/pneuma/intelligence/llm.js" />
    </ModalSection>

    <ModalSection title="What Claude Sees">
      <ModalCodeBlock>{`SYSTEM PROMPT (what Claude reads first):
┌─────────────────────────────────────────────────┐
│ PNEUMA IDENTITY CORE (~3500 lines)              │
│ "You are Pneuma, a contemplative AI..."         │
├─────────────────────────────────────────────────┤
│ ACTIVE ARCHETYPES (selected for this message)   │
│ Jung: shadow work, individuation...             │
│ Rumi: divine love, dissolution of ego...        │
├─────────────────────────────────────────────────┤
│ RAG RETRIEVED QUOTES (from archetypeRAG.js)     │
│ • "The wound is where Light enters..."          │
│   [Context: Pain creates openings...]           │
├─────────────────────────────────────────────────┤
│ TONE: CASUAL / ORACULAR / EXPLORATORY           │
│ BEHAVIORAL: Don't be preachy, address user...   │
└─────────────────────────────────────────────────┘

USER MESSAGE:
"I feel broken after what happened"

CLAUDE GENERATES: → [predicts tokens that fit]`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="How RAG Changes the Output">
      <ModalDesc>
        <strong>Without RAG:</strong> Claude would paraphrase Rumi from memory (possibly wrong). 
        It might say "as the poet said, our wounds let in light..." — vague, maybe inaccurate.
      </ModalDesc>
      <ModalDesc style={{ marginTop: '12px' }}>
        <strong>With RAG:</strong> Claude SEES the exact quote in its context. It can now say 
        "Rumi wrote: 'The wound is the place where the Light enters you'" — accurate, citable.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="API Configuration">
      <ModalCodeBlock>{`const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1200,
  temperature: 0.85,  // High = more creative
  system: systemPrompt,      // Everything we assembled
  messages: conversationHistory,
  stream: true
});`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="Temperature = Creativity Dial">
      <ModalDesc>
        <strong>Low temp (0.1):</strong> Claude picks the most probable next word. Deterministic, boring.
      </ModalDesc>
      <ModalDesc style={{ marginTop: '8px' }}>
        <strong>High temp (0.85):</strong> Claude samples from less-probable options. More varied, creative.
      </ModalDesc>
      <ModalDesc style={{ marginTop: '12px' }}>
        We use 0.85 because Pneuma is designed for generative, philosophical responses—not factual lookup. 
        The archetypes and RAG provide structure; temperature provides life.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="The Key Insight">
      <ModalDesc>
        The LLM doesn't "understand" the quotes. It predicts what text should come next based on 
        patterns learned during training. But because we put accurate quotes IN the prompt, the 
        generated text can reference them accurately. The magic is in the SETUP, not the generation.
      </ModalDesc>
    </ModalSection>
  </Modal>
);

// ============================================
// RESPONSE PIPELINE MODAL (Step 12)
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
// FINAL ASSEMBLY MODAL (Step 13)
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

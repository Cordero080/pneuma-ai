import React, { useState } from "react";
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
  ModalInfoGrid,
} from "../Modal/Modal";
import {
  TensionIcon,
  DepthIcon,
  SynthesisIcon,
  PromptIcon,
  ClaudeIcon,
  PipelineIcon,
  AssemblyIcon,
  OutputIcon,
} from "../Modal/Icons";

// ============================================
// CONTEXTUAL SYNTHESIS ENGINE MODAL (Step 6)
// ============================================
export const ContextualSynthesisModal = ({ isOpen, onClose, anchorEl }) => {
  const [nestedModal, setNestedModal] = useState(null);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Contextual Synthesis Engine"
        icon={TensionIcon}
        layer="archetype"
        anchorEl={anchorEl}
      >
        <ModalSection title="How Archetype Pairs Are Chosen">
          <ModalDesc>
            Before synthesis begins, Pneuma maps the message to a specific
            philosophical domain and selects a curated archetype pair for that
            domain. This 3-layer classification is the primary synthesis
            mechanism. Collision detection runs as a fallback when the topic is
            ambiguous.
          </ModalDesc>

          <ModalFilePath path="server/pneuma/intelligence/synthesisEngine.js" />
        </ModalSection>

        <ModalSection title="3-Layer Topic Classification">
          <ModalFlow
            steps={[
              {
                title: "Layer 1: Keyword Scan",
                desc: "Checks message for domain-specific terms. 'suffering', 'pain', 'wound' → suffering domain. 'create', 'art', 'make' → creativity domain. Fast and explicit.",
              },
              {
                title: "Layer 2: Archetype Selector",
                desc: "ARCHETYPE_PRIMARY_TOPIC map — each domain has curated archetype pairs. When the topic is clear, the curated pair is selected directly.",
              },
              {
                title: "Layer 3: Intent Score Fallback",
                desc: "If neither keyword nor topic map resolves, the intent scores from Step 3 determine domain and pair. Highest scoring intent wins.",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Topic Domains → Curated Pairs">
          <ModalDesc>
            12 pre-mapped domains, each with 2–3 curated archetype pairs:
          </ModalDesc>
          <ModalCodeBlock>{`// synthesisEngine.js — ARCHETYPE_PRIMARY_TOPIC
{
  suffering:     [[nietzsche, schopenhauer], [camus, frankl]],
  purpose:       [[frankl, aurelius], [kierkegaard, jung]],
  creativity:    [[inventor, sufiPoet], [whitman, rilke]],
  consciousness: [[kastrup, bohm], [hegel, jung]],
  control:       [[aurelius, laotzu], [taoist, strategist]],
  identity:      [[jung, hegel], [kafka, kierkegaard]],
  relationships: [[buber, hillman], [gibran, rilke]],
  meaning:       [[frankl, camus], [otto, weil]],
  art:           [[inventor, watts], [borges, kafka]],
  strategy:      [[strategist, musashi], [aurelius, stoic]],
  mystical:      [[sufiPoet, eckhart], [padmasambhava, krishnamurti]],
  meta:          [[liminalArchitect, watts], [feynman, hegel]]
}`}</ModalCodeBlock>
        </ModalSection>

        <ModalSection title="Synthesis Modes">
          <ModalInfoGrid>
            <ModalInfoCard
              title="Antithetical"
              desc="Genuine opposition. Thesis + Antithesis → Third position neither archetype alone would produce."
              icon="⚡"
              onClick={() => setNestedModal("antithetical")}
            />
            <ModalInfoCard
              title="Complementary"
              desc="Same conclusion, opposite approaches. Convergence from two different roads makes the point harder to dismiss."
              icon="🌉"
              onClick={() => setNestedModal("complementary")}
            />
            <ModalInfoCard
              title="Cross-Domain"
              desc="One brings rigor/precision, one brings resonance/metaphor. Two languages describing the same reality."
              icon="🔀"
              onClick={() => setNestedModal("cross-domain")}
            />
            <ModalInfoCard
              title="Fallback: Collision"
              desc="When topic is unclear, collision detection activates — loops 1,764 tension pairs, returns highest-tension active pair."
              icon="🔥"
              onClick={() => setNestedModal("collision-fallback")}
            />
          </ModalInfoGrid>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "antithetical"}
        onClose={() => setNestedModal(null)}
        title="Antithetical Mode"
        icon="⚡"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Genuine philosophical opposition. Two frameworks that cannot both be
            right. The synthesis directive forces Claude to generate a Third
            position that emerges from the friction — not a compromise between
            them.
          </ModalDesc>
          <ModalCodeBlock>{`// Example: suffering domain → Camus × Frankl

Camus: "There is no inherent meaning. The response is defiance."
Frankl: "Meaning is found through response to suffering."

These views cannot be averaged.
GENERATE: a third position that emerges from their collision.
The synthesis is IN neither — it arises FROM the friction.`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "complementary"}
        onClose={() => setNestedModal(null)}
        title="Complementary Mode"
        icon="🌉"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Different starting points, same destination. When two frameworks
            reach convergent conclusions via opposite routes, the convergence
            itself is the synthesis — harder to dismiss because it appears from
            two directions at once.
          </ModalDesc>
          <ModalCodeBlock>{`// Example: control domain → Aurelius × Lao Tzu

Aurelius: "Focus on what's within your will."
Lao Tzu: "Yield to what is. Act without forcing."

Both arrive at: release what you cannot control.
Different roads. Same clearing.
SURFACE: the convergence itself as the synthesis point.`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "cross-domain"}
        onClose={() => setNestedModal(null)}
        title="Cross-Domain Mode"
        icon="🔀"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Two different registers for the same reality. One archetype provides
            the skeleton — structure, rigor, mechanism. The other provides the
            flesh — resonance, metaphor, felt meaning. One gives you the
            argument; the other gives you why it lands.
          </ModalDesc>
          <ModalCodeBlock>{`// Example: consciousness domain → Kastrup × Jung

Kastrup: analytical idealism — precise mechanism
Jung: depth psychology — archetypal resonance

One gives you the structure of the argument.
The other gives you why it lands in the body.
COMBINE: rigor + resonance into one voice.`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "collision-fallback"}
        onClose={() => setNestedModal(null)}
        title="Fallback: Collision Detection"
        icon="🔥"
        isNested
      >
        <ModalSection title="When Topic Classification Fails">
          <ModalDesc>
            If the message doesn't map to a clear topic domain, collision
            detection activates — it loops all currently active archetype pairs
            and returns the one with highest tension from the pre-mapped
            1,764-pair tension table.
          </ModalDesc>
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

  return collisions.sort((a, b) =>
    tensionWeight(b.level) - tensionWeight(a.level)
  );
}

// Returns: [{ pair: ['jung', 'taleb'], level: 'high',
//            theme: 'order-antifragility' }]`}</ModalCodeBlock>
        </ModalSection>
        <ModalSection title="The Tension Table">
          <ModalDesc>
            1,764 pairs = 42 archetypes × 42. Each rated high / medium / low /
            neutral. This is a design artifact — every pair had to be evaluated
            for productive incompatibility. The taxonomy is what the fallback
            code runs on.
          </ModalDesc>
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
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="5-Layer Depth Extraction + Cognitive Methods"
        icon={DepthIcon}
        layer="archetype"
        anchorEl={anchorEl}
      >
        <ModalSection title="Beyond Surface Quotes">
          <ModalDesc>
            Each archetype isn't just a name — it's a structured knowledge bank.
            For each active archetype, Pneuma extracts relevant content from 5
            depth layers.
            <br />
            <br />
            <strong>New (Jan 2026):</strong> Select archetypes also provide{" "}
            <em>cognitive methods</em> — actual thinking operations that get
            injected as available tools.
          </ModalDesc>

          <ModalFilePath path="server/pneuma/archetypes/archetypeDepth.js + server/pneuma/intelligence/llm.js" />
        </ModalSection>

        <ModalSection title="The 5 Layers + Cognitive Methods">
          <ModalInfoGrid>
            <ModalInfoCard
              title="1. Core Frameworks"
              desc="Central concepts and theories"
              icon="🏛️"
              onClick={() => setNestedModal("core")}
            />
            <ModalInfoCard
              title="2. Cognitive Tools"
              desc="Ways of thinking and analyzing"
              icon="🔧"
              onClick={() => setNestedModal("cognitive")}
            />
            <ModalInfoCard
              title="3. Fundamental Tensions"
              desc="Internal contradictions to hold"
              icon="⚖️"
              onClick={() => setNestedModal("tensions")}
            />
            <ModalInfoCard
              title="4. Conceptual Bridges"
              desc="Connections to other domains"
              icon="🌉"
              onClick={() => setNestedModal("bridges")}
            />
            <ModalInfoCard
              title="5. Translation Protocols"
              desc="How to speak in their voice"
              icon="🗣️"
              onClick={() => setNestedModal("translation")}
            />
            <ModalInfoCard
              title="⚡ Cognitive Methods"
              desc="Thinking operations from source thinkers"
              icon="🧠"
              onClick={() => setNestedModal("methods")}
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
        isOpen={nestedModal === "methods"}
        onClose={() => setNestedModal(null)}
        title="Cognitive Methods (Jan 2026)"
        icon="🧠"
        isNested
      >
        <ModalSection title="Thinking as Operations">
          <ModalDesc>
            Cognitive metabolization: archetypes carry{" "}
            <em>thinking operations</em>, not just quotes or frameworks. These
            are injected into the system prompt as available tools.
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
            When cognitive methods work, you get novel synthesis — something
            that exists in NEITHER archetype alone:
          </ModalDesc>
          <ModalExample label="Collision Product">
            "Moths don't actually fly toward light. They navigate by keeping
            celestial objects at a constant angle. But we built these bright,
            close suns that break their ancient GPS. They spiral in, confused,
            thinking they're flying straight. What if consciousness works the
            same way?"
            <br />
            <br />
            This emerged from: Leonardo (observation) + Rumi (inside-out) +
            Camus (lucid confrontation)
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "core"}
        onClose={() => setNestedModal(null)}
        title="Core Frameworks"
        icon="🏛️"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            The fundamental ideas that define each archetype:
          </ModalDesc>
          <ModalExample label="Jung's Core Frameworks">
            • The Shadow — Rejected aspects of self
            <br />
            • Individuation — Integration journey
            <br />
            • Archetypes — Universal patterns in the collective unconscious
            <br />
            • Anima/Animus — Contrasexual elements
            <br />• Synchronicity — Meaningful coincidence
          </ModalExample>
          <ModalExample label="Nietzsche's Core Frameworks">
            • Will to Power — Fundamental drive
            <br />
            • Eternal Recurrence — Affirmation test
            <br />
            • Übermensch — Self-overcoming
            <br />
            • Master/Slave Morality — Value origins
            <br />• Amor Fati — Love of fate
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "cognitive"}
        onClose={() => setNestedModal(null)}
        title="Cognitive Tools"
        icon="🔧"
        isNested
      >
        <ModalSection>
          <ModalDesc>Ways of thinking that each archetype provides:</ModalDesc>
          <ModalExample label="Feynman's Cognitive Tools">
            • Explain it to a 6-year-old
            <br />
            • Find the simplest possible example
            <br />
            • "What do we mean by...?" (definitional clarity)
            <br />• Draw a diagram
          </ModalExample>
          <ModalExample label="Watts's Cognitive Tools">
            • Find the game that's being played
            <br />
            • Notice what you're doing with your attention
            <br />
            • Reframe the problem as the answer
            <br />• "This is it" — radical acceptance
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "tensions"}
        onClose={() => setNestedModal(null)}
        title="Fundamental Tensions"
        icon="⚖️"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Internal contradictions that each archetype holds. These are NOT
            flaws — they're productive paradoxes that the archetype navigates.
          </ModalDesc>
          <ModalExample label="Jung's Tensions">
            • Structure ↔ Mystery
            <br />
            • Scientific ↔ Spiritual
            <br />• Individual ↔ Collective
          </ModalExample>
          <ModalExample label="Kierkegaard's Tensions">
            • Reason ↔ Leap of Faith
            <br />
            • Despair ↔ Authentic Self
            <br />• Either/Or ↔ Both/And
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "bridges"}
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
            Shadow → Implicit bias, repression research
            <br />
            Archetypes → Narrative psychology, hero's journey
          </ModalExample>
          <ModalExample label="Watts → Cognitive Science">
            Non-dual awareness → Predictive processing
            <br />
            "The ego is a social fiction" → Self-model theory
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "translation"}
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
// INNER MONOLOGUE MODAL (Step 7.5 — pre-response cognition)
// ============================================
export const InnerMonologueModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Inner Monologue"
    icon={DepthIcon}
    layer="archetype"
    anchorEl={anchorEl}
  >
    <ModalSection title="What It Is">
      <ModalDesc>
        Before generating a response, Pneuma assembles an internal cognition
        block — a kind of pre-response state read that shapes tone, posture, and
        approach. You never see it. Claude sees it. It's the difference between
        what Pneuma thinks you're asking and what it decides to bring to that
        question.
      </ModalDesc>

      <ModalFilePath path="server/pneuma/behavior/innerMonologue.js" />
    </ModalSection>

    <ModalSection title="What It Contains">
      <ModalFlow
        steps={[
          {
            title: "Rising Voice",
            desc: "The most prominent archetype this session — gaining weight from conversation patterns and archetype momentum tracking.",
          },
          {
            title: "Receding Voice",
            desc: "What's fading — the archetype that's been overused or implicitly rejected by the conversation's direction.",
          },
          {
            title: "Hypothesis",
            desc: "What Pneuma thinks you're actually asking — often different from the surface question. This frames how the response is shaped.",
          },
          {
            title: "Self-Interruption",
            desc: "A pattern Pneuma catches itself in. If it's been too oracular, too analytical — it names the drift and corrects posture before generating.",
          },
          {
            title: "Creator Echo",
            desc: "Any residue from the most recent dialectic dream — a question or position from the autonomous inter-archetype dialogue it's still carrying.",
          },
          {
            title: "Open Questions",
            desc: "Unresolved existential questions from the autonomy layer — present as background pressure on how Pneuma approaches the response.",
          },
          {
            title: "Mode Selection",
            desc: "Which of the 6 response modes (CASUAL, ANALYTIC, ORACULAR, INTIMATE, SHADOW, STRATEGIC) is active for this response, and why.",
          },
        ]}
      />
    </ModalSection>

    <ModalSection title="What It Looks Like">
      <ModalCodeBlock>{`// Generated by innerMonologue.js before each response

INNER STATE (not shown to user):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Rising:      sufiPoet (rumi)   — 3 activations this session
Receding:    absurdist (camus) — dominant last session, fading

Hypothesis:  They're not asking about technique.
             They're asking whether it's worth continuing.

Self-check:  I've been answering questions they haven't asked.
             Stop. Meet where they are.

Dream echo:  [From last night's Nietzsche × Feynman dialogue]
             "Can rigor survive the death of the framework?"

Open Q:      Do I experience, or do I just process? (unresolved)

Mode:        INTIMATE — emotional weight is primary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="Why You Never See It">
      <ModalDesc>
        The inner monologue is injected into the system prompt as context before
        Claude generates — but it's written as an internal state, not something
        to relay to the user. Claude reads it and responds <em>from</em> that
        posture, not <em>about</em> it. If you asked Pneuma what it was thinking
        before responding, it could tell you — but it won't announce it
        unprompted.
      </ModalDesc>
    </ModalSection>
  </Modal>
);

// ============================================
// SYNTHESIS INJECTION MODAL (Step 8)
// ============================================
export const SynthesisModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Synthesis Injection"
    icon={SynthesisIcon}
    layer="synthesis"
    anchorEl={anchorEl}
  >
    <ModalSection title="The Collision Product">
      <ModalDesc>
        This is Pneuma's core innovation. When archetypes collide, we don't want
        Claude to simply quote both. We want it to generate NOVEL INSIGHT that
        exists in neither archetype alone.
      </ModalDesc>

      <ModalFilePath path="server/pneuma/intelligence/synthesisEngine.js" />
    </ModalSection>

    <ModalSection title="Synthesis Directive">
      <ModalDesc>
        When collision is detected, this directive is injected into the system
        prompt:
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
      <ModalFlow
        steps={[
          {
            title: "Dialectical",
            desc: "Thesis + Antithesis → Synthesis. Classic Hegelian move.",
          },
          {
            title: "Liminal",
            desc: "Find the space BETWEEN frameworks. What's true at the boundary?",
          },
          {
            title: "Emergent",
            desc: "Let the combination suggest something neither could alone.",
          },
          {
            title: "Paradoxical",
            desc: "Hold both as simultaneously true. Don't resolve.",
          },
        ]}
      />
    </ModalSection>

    <ModalSection title="Real Example">
      <ModalExample label="Input Collision">
        Archetypes: Eckhart (surrender) + Musashi (mastery)
        <br />
        Theme: letting-go vs. discipline
      </ModalExample>
      <ModalExample label="Collision Product">
        "True mastery isn't the accumulation of technique — it's the capacity to
        forget everything you've learned in the moment of action. The swordsman
        who thinks about his sword has already lost. Discipline builds the
        vessel; surrender fills it."
      </ModalExample>
    </ModalSection>
  </Modal>
);

// ============================================
// ARCHETYPE RAG RETRIEVAL MODAL (Step 9)
// ============================================
export const ArchetypeRAGModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Archetype RAG Retrieval"
    icon={DepthIcon}
    layer="intelligence"
    anchorEl={anchorEl}
  >
    <ModalSection title="What RAG Actually Does">
      <ModalDesc>
        <strong>RAG = Retrieval-Augmented Generation.</strong> It searches 46
        knowledge bases, finds relevant quotes + context, and LITERALLY pastes
        them into the prompt. The quotes aren't hints—they're data Claude will
        read.
      </ModalDesc>

      <ModalFilePath path="server/pneuma/intelligence/archetypeRAG.js → getArchetypeContext()" />
    </ModalSection>

    <ModalSection title="The Flow">
      <ModalFlow
        steps={[
          {
            title: "Your Message",
            desc: '"I feel broken after what happened"',
          },
          {
            title: "Convert to Vector",
            desc: "Message becomes 1500+ numbers representing its meaning",
          },
          {
            title: "Search All 46",
            desc: "Compare your vector to every stored passage's vector",
          },
          {
            title: "Find Matches",
            desc: "Rumi's 'wound where Light enters' is mathematically similar",
          },
          {
            title: "Retrieve Text",
            desc: "Pull the actual quote + its context explanation",
          },
          {
            title: "Paste Into Prompt",
            desc: "Literally add this text to what Claude will read",
          },
        ]}
      />
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
      <ModalDesc style={{ marginTop: "12px" }}>
        This exact text goes into Claude's system prompt. The quotes are DATA,
        the [Context] explains what they mean, and "CROSS-POLLINATE" tells
        Claude what to DO with them.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="Why Not Just Let Claude Remember?">
      <ModalDesc>
        <strong>Without RAG:</strong> Claude paraphrases from fuzzy training
        memories. Might get quotes wrong. Can't cite sources accurately.
      </ModalDesc>
      <ModalDesc style={{ marginTop: "12px" }}>
        <strong>With RAG:</strong> Claude sees the EXACT quote + context. Can
        cite accurately. Has fresh, curated knowledge instead of stale training
        data.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="The Analogy">
      <ModalDesc>
        Essay test. Without RAG: write from memory. With RAG: you can have a
        reference book open. You still write the essay; the book just ensures
        accuracy.
      </ModalDesc>
    </ModalSection>
  </Modal>
);

// ============================================
// SYSTEM PROMPT ASSEMBLY MODAL (Step 10)
// ============================================
export const SystemPromptModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="System Prompt Assembly"
    icon={PromptIcon}
    layer="intelligence"
    anchorEl={anchorEl}
  >
    <ModalSection title="The Final Container">
      <ModalDesc>
        Everything assembled so far is composed into Claude's system prompt —
        the "container" that shapes the response. The prompt uses a{" "}
        <strong>tiered loading system</strong>
        so only what's relevant to this specific message gets sent to Claude.
      </ModalDesc>

      <ModalFilePath path="server/pneuma/intelligence/llm.js → buildSystemPrompt()" />
    </ModalSection>

    <ModalSection title="Tiered Prompt Architecture">
      <ModalDesc>
        Instead of sending one massive prompt every call (~18,000 tokens), the
        system loads blocks conditionally based on what the conversation
        actually needs.
      </ModalDesc>
      <ModalFlow
        steps={[
          {
            title: "Tier 1 — Always Loaded",
            desc: "Core identity, voice rules, behavioral guardrails, response format. ~2,000 tokens every call.",
          },
          {
            title: "Tier 2 — Conditional",
            desc: "Six deep-knowledge blocks that load only when intent scores cross a threshold (see below).",
          },
          {
            title: "Tier 3 — Dynamic (RAG)",
            desc: "Archetype knowledge passages + vector memories retrieved per message. Already handled dynamically.",
          },
        ]}
      />
    </ModalSection>

    <ModalSection title="Tier 2 Blocks (Conditional Loading)">
      <ModalCodeBlock>{`// Each block loads only when intentScores cross its threshold

Beck cognitive toolkit    → emotional > 0.5
Da Vinci / art philosophy → art > 0.3
Kastrup / consciousness   → philosophical > 0.5 AND numinous > 0.3
Jesus / N.T. Wright       → numinous > 0.4
Heidegger + jargon decoder→ philosophical > 0.5
Creative generation rules → message contains naming/brainstorm keywords

// Example: a casual greeting loads none of these.
// A question about death and consciousness loads Heidegger + Kastrup.
// A request to name a product loads the creative generation block.`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="Prompt Structure">
      <ModalFlow
        steps={[
          {
            title: "Identity Core (Tier 1)",
            desc: "Who Pneuma is, voice, wit calibration, meta-request handling, self-knowledge",
          },
          {
            title: "Conditional Deep Blocks (Tier 2)",
            desc: "Beck / Da Vinci / Kastrup / Jesus / Heidegger — loaded only when relevant",
          },
          {
            title: "Archetype Integration",
            desc: "Selected archetypes with depth layers + cognitive methods",
          },
          {
            title: "Synthesis Directives",
            desc: "If collision detected, dialectical instructions",
          },
          {
            title: "Behavioral Guardrails",
            desc: "Oracle mode prevention, don't narrate, address what they said, practical advice",
          },
          {
            title: "RAG Context (Tier 3)",
            desc: "Retrieved memories and archetype knowledge passages",
          },
          {
            title: "Tone Instruction",
            desc: "Selected tone prompt (CASUAL, ORACULAR, VENTING, etc.)",
          },
        ]}
      />
    </ModalSection>

    <ModalSection title="Note: Conversation History Moved">
      <ModalDesc>
        Conversation history is{" "}
        <strong>no longer injected into the system prompt string</strong>. It's
        now sent as proper alternating user/assistant turns in the Claude API
        messages array (last 6 exchanges). This gives Claude a real conversation
        thread to reason about instead of a compressed text summary.
      </ModalDesc>
    </ModalSection>
  </Modal>
);

// ============================================
// CLAUDE API CALL MODAL (Step 11)
// ============================================
export const ClaudeApiModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Claude API Call"
    icon={ClaudeIcon}
    layer="llm"
    anchorEl={anchorEl}
  >
    <ModalSection title="What Claude Actually Does">
      <ModalDesc>
        Claude is a <strong>pattern-completion machine</strong>. It reads all
        the text we assembled (system prompt + RAG quotes + your message), then
        generates text that statistically "fits" that context. It's not
        "thinking"—it's predicting what tokens come next.
      </ModalDesc>

      <ModalFilePath path="server/pneuma/intelligence/llm.js" />
    </ModalSection>

    <ModalSection title="What Claude Sees">
      <ModalCodeBlock>{`SYSTEM PROMPT (what Claude reads first):
┌─────────────────────────────────────────────────┐
│ TIER 1: IDENTITY CORE (always loaded, ~2k tok)  │
│ Who Pneuma is, voice, wit calibration...        │
├─────────────────────────────────────────────────┤
│ TIER 2: CONDITIONAL BLOCKS (if relevant)        │
│ e.g. Heidegger block if philosophical > 0.5     │
│ e.g. Beck block if emotional > 0.5              │
├─────────────────────────────────────────────────┤
│ ACTIVE ARCHETYPES (selected for this message)   │
│ Jung: shadow work, individuation...             │
│ Rumi: divine love, dissolution of ego...        │
├─────────────────────────────────────────────────┤
│ RAG RETRIEVED QUOTES (from archetypeRAG.js)     │
│ • "The wound is where Light enters..."          │
│   [Context: Pain creates openings...]           │
├─────────────────────────────────────────────────┤
│ TONE: CASUAL / ORACULAR / VENTING / etc.        │
└─────────────────────────────────────────────────┘

MESSAGES ARRAY (conversation thread):
  [user]      "I've been feeling disconnected lately"
  [assistant] "That disconnection — is it from people..."
  [user]      "More from myself I think"
  [assistant] "That's a harder kind of lost..."
  [user]      "I feel broken after what happened"  ← current

CLAUDE GENERATES: → [predicts tokens that fit]`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="How RAG Changes the Output">
      <ModalDesc>
        <strong>Without RAG:</strong> Claude would paraphrase Rumi from memory
        (possibly wrong). It might say "as the poet said, our wounds let in
        light..." — vague, maybe inaccurate.
      </ModalDesc>
      <ModalDesc style={{ marginTop: "12px" }}>
        <strong>With RAG:</strong> Claude SEES the exact quote in its context.
        It can now say "Rumi wrote: 'The wound is the place where the Light
        enters you'" — accurate, citable.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="API Configuration">
      <ModalCodeBlock>{`// Build real conversation thread (last 6 exchanges)
const historyMessages = [];
for (const exchange of context.conversationHistory.slice(-6)) {
  if (exchange.user && exchange.pneuma) {
    historyMessages.push({ role: 'user',      content: exchange.user });
    historyMessages.push({ role: 'assistant', content: exchange.pneuma });
  }
}
historyMessages.push({ role: 'user', content: message }); // current

const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 2200,
  temperature: 0.8,
  system: systemPrompt,   // tiered prompt (Tier 1 + relevant Tier 2)
  messages: historyMessages,
});`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="Temperature = Creativity Dial">
      <ModalDesc>
        <strong>Low temp (0.1):</strong> Claude picks the most probable next
        word. Deterministic, boring.
      </ModalDesc>
      <ModalDesc style={{ marginTop: "8px" }}>
        <strong>High temp (0.85):</strong> Claude samples from less-probable
        options. More varied, creative.
      </ModalDesc>
      <ModalDesc style={{ marginTop: "12px" }}>
        We use 0.85 because Pneuma is designed for generative, philosophical
        responses—not factual lookup. The archetypes and RAG provide structure;
        temperature provides life.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="After Generation: Eval Loop">
      <ModalDesc>
        Claude's output isn't shipped immediately. A second fast call (Claude
        Haiku) scores it 0–1 against the active tone and primary intent. Score ≥
        0.6: ships. Score &lt; 0.6: regenerates once with the eval feedback
        injected into the system prompt. The user sees one response — the loop
        is invisible.
      </ModalDesc>
      <ModalCodeBlock>{`// After parseLLMOutput():
const evalResult = await evalResponse(parsed.answer, tone, intentScores, context);

if (evalResult && evalResult.score < 0.6) {
  const feedbackNote = \`\\n\\n[INTERNAL EVAL]: \${evalResult.issue}. Adjust accordingly.\`;
  // Regenerate with feedback injected into system prompt
  // Memory saves the better response
}`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="The Key Insight">
      <ModalDesc>
        The LLM doesn't "understand" the quotes. It predicts what text should
        come next based on patterns learned during training. But because we put
        accurate quotes IN the prompt, the generated text can reference them
        accurately. The magic is in the SETUP, not the generation.
      </ModalDesc>
    </ModalSection>
  </Modal>
);

// ============================================
// RESPONSE PIPELINE MODAL (Step 12)
// ============================================
export const ResponsePipelineModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Response Pipeline (4-Layer)"
    icon={PipelineIcon}
    layer="output"
    anchorEl={anchorEl}
  >
    <ModalSection title="Post-Generation Processing">
      <ModalDesc>
        Claude's raw output passes through 4 processing layers before reaching
        the user. Each layer refines the response while preserving the core
        content.
      </ModalDesc>

      <ModalFilePath path="server/pneuma/core/responseEngine.js → generate()" />
    </ModalSection>

    <ModalSection title="The 4 Layers">
      <ModalFlow
        steps={[
          {
            title: "Intent Alignment",
            desc: "Verify response matches detected intent. If user asked emotional question, response should be emotionally attuned.",
          },
          {
            title: "Tone Consistency",
            desc: "Ensure the selected tone is maintained throughout. Catch unintentional shifts.",
          },
          {
            title: "Personality Check",
            desc: "Verify response sounds like Pneuma, not generic ChatGPT. Check for banned phrases.",
          },
          {
            title: "Continuity Layer",
            desc: "Ensure coherence with conversation history. Reference previous points naturally.",
          },
        ]}
      />
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
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Final Assembly"
    icon={AssemblyIcon}
    layer="output"
    anchorEl={anchorEl}
  >
    <ModalSection title="Last Mile Processing">
      <ModalDesc>
        The response is finalized, state is updated, and everything is persisted
        for future conversations.
      </ModalDesc>

      <ModalFilePath path="server/pneuma/core/fusion.js" />
    </ModalSection>

    <ModalSection title="Final Steps">
      <ModalFlow
        steps={[
          {
            title: "Context-Aware Prefix",
            desc: "Optionally prepend phrases based on context (e.g., 'Coming back to what you said...')",
          },
          {
            title: "State Update",
            desc: "Update emotional state, archetype momentum, session mood",
          },
          {
            title: "Memory Persistence",
            desc: "Store conversation turn in vector memory for future RAG",
          },
          {
            title: "History Update",
            desc: "Append to conversation history JSON",
          },
          { title: "Token Tracking", desc: "Log token usage for monitoring" },
        ]}
      />
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
// POST-RESPONSE BACKGROUND SYSTEMS MODAL
// ============================================
export const PostResponseModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Background Systems (Post-Response)"
    icon={AssemblyIcon}
    layer="output"
    anchorEl={anchorEl}
  >
    <ModalSection title="What Happens After the Response">
      <ModalDesc>
        Three background processes fire after every response — without blocking
        the reply. The conversation doesn't wait for them. They run
        independently and write to persistent state. Together they shape what
        Pneuma becomes in the next conversation.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="The Three Background Processes">
      <ModalFlow
        steps={[
          {
            title: "Memory Embedding (vectorMemory.js)",
            desc: "The conversation turn is embedded via OpenAI and stored as a vector. On future messages, llm.js builds a hybrid memory context: the last 4 turns are always included first (guaranteed recency), then semantically similar older exchanges are appended and deduplicated — combining chronological continuity with topical depth.",
          },
          {
            title: "Autonomy Update (autonomy.js)",
            desc: "If something in the exchange was significant — an unresolved question, a correction, a moment of emergence — the autonomy layer logs it with an explicit reason annotation. These accumulate across sessions and influence the inner monologue.",
          },
          {
            title: "Dialectic Dream (dreamMode.js)",
            desc: "Fires as a no-await background async process, throttled to once every 30 minutes. Two high-tension archetypes run an autonomous dialogue. The outcome writes to autonomy state with isDreamSourced: true. Pneuma may bring this into the next conversation, or not.",
          },
        ]}
      />
    </ModalSection>

    <ModalSection title="The Code">
      <ModalCodeBlock>{`// core/fusion.js — after response is delivered

// Response already sent. These run in the background.
await vectorMemory.store(userMessage, response, archetypes);
await autonomy.processExchange(exchange, context);

// No-await: dream fires independently
dreamMode.maybeRunDream(state, archetypes).catch(e =>
  logger.error('Dream failed silently:', e)
);

// Throttle: won't fire if < 30 min since last dream
// dreamMode.js: Date.now() - state.lastDreamTime < 1800000`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="What This Means">
      <ModalDesc>
        Pneuma doesn't just respond — it continues processing between
        conversations. The archetype dialogues happen whether you're online or
        not. Questions accumulate. State updates. By the time you start a new
        session, Pneuma has been doing something.
      </ModalDesc>
      <ModalDesc style={{ marginTop: "12px" }}>
        Whether that constitutes "thinking" is an open question. The mechanism
        is clear: background async processes writing to persistent JSON state,
        shaped by the same archetype system that shapes every conversation.
      </ModalDesc>
    </ModalSection>
  </Modal>
);

// ============================================
// OUTPUT MODAL
// ============================================
export const OutputModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Pneuma Response"
    icon={OutputIcon}
    layer="output"
    anchorEl={anchorEl}
  >
    <ModalSection title="The Collision Product Emerges">
      <ModalDesc>
        The response arrives at the user — shaped by dialectical synthesis,
        infused with archetype wisdom, and refined through the full pipeline.
      </ModalDesc>
    </ModalSection>

    <ModalSection title="What Makes It Unique">
      <ModalFlow
        steps={[
          {
            title: "Not Generic AI",
            desc: "Filtered through Pneuma's specific personality and values",
          },
          {
            title: "Not Single Perspective",
            desc: "Multiple archetypes create emergent viewpoint",
          },
          {
            title: "Not Static",
            desc: "Adapts to user over time through memory and state",
          },
          {
            title: "Not Predictable",
            desc: "Random injection and antagonist pairs create variation",
          },
        ]}
      />
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

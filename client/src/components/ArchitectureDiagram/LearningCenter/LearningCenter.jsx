import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal, {
  ModalSection,
  ModalFilePath,
  ModalCodeBlock,
  ModalFlow,
  ModalDesc,
  ModalInfoGrid,
  ModalInfoCard
} from '../../Modal/Modal';
import {
  EmotionIcon,
  VoiceIcon,
  BookIcon,
  NeuralIcon,
  SparkleIcon,
  LayersIcon,
  RAGIcon,
  BrainIcon,
  GridIcon,
  SynthesisIcon,
  ArchetypeIcon
} from '../../Modal/Icons';
import '../ApiReference/ApiReference.css'; // Reuse same styles

// All 46 archetypes organized by category
const ARCHETYPES = {
  philosophical: ['Jung', 'Nietzsche', 'Kierkegaard', 'Hegel', 'Schopenhauer', 'Spinoza', 'Heraclitus'],
  mystical: ['Rumi', 'Hafiz', 'Eckhart', 'Padmasambhava', 'Ramana', 'Krishnamurti', 'Thich'],
  literary: ['Dostoevsky', 'Kafka', 'Rilke', 'Gibran', 'Blake', 'Whitman', 'Le Guin', 'Borges'],
  strategic: ['Sun Tzu', 'Musashi', 'Aurelius', 'Lao Tzu', 'Zhuangzi'],
  psychological: ['Frankl', 'Hillman', 'Vervaeke', 'McGilchrist', 'Wilber'],
  scientific: ['Feynman', 'Bohm', 'Kastrup', 'Taleb', 'Faggin'],
  existential: ['Camus', 'Weil', 'Otto', 'Buber'],
  provocateurs: ['Carlin', 'McKenna', 'Watts', 'Breton'],
  spiritual: ['Jesus', 'Pema', 'Da Vinci'],
  meta: ['Liminal Architect']
};

const LearningCenter = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [nestedModal, setNestedModal] = useState(null);
  const navigate = useNavigate();

  const apis = [
    {
      id: 'hume',
      name: 'Hume AI API',
      icon: EmotionIcon,
      desc: 'Emotion detection & expression',
      color: '#ff6b9d'
    },
    {
      id: 'elevenlabs',
      name: 'Eleven Labs API',
      icon: VoiceIcon,
      desc: 'Voice synthesis & cloning',
      color: '#00d4aa'
    }
  ];

  const learningTopics = [
    { id: 'about-pneuma', name: 'About Pneuma', icon: SparkleIcon, color: '#b400ff' },
    { id: 'llm-basics', name: 'How LLMs Work', icon: NeuralIcon, color: '#00d4ff', misc: true },
    { id: 'ai-types', name: 'AI vs AGI vs ASI', icon: BrainIcon, color: '#ff6400', misc: true },
    { id: 'rag-explained', name: 'RAG & Vectors', icon: RAGIcon, color: '#74aa9c' },
    { id: 'all-archetypes', name: '46 Archetypes', icon: GridIcon, color: '#a855f7' },
    { id: 'cognitive-metabolism', name: 'Cognitive Metabolism', icon: BrainIcon, color: '#7c3aed' },
    { id: 'contextual-synthesis', name: 'Contextual Synthesis', icon: SynthesisIcon, color: '#f59e0b' },
    { id: 'inner-monologue', name: 'Inner Monologue', icon: LayersIcon, color: '#ec4899' },
    { id: 'design-vs-mechanism', name: 'Architecture Philosophy', icon: LayersIcon, color: '#0891b2' },
    { id: 'what-sets-apart', name: 'What Sets This Apart', icon: SynthesisIcon, color: '#22c55e' }
  ];

  return (
    <div className="api-reference">
      {/* Additional APIs */}
      <div className="api-section">
        <h3 className="api-section-title"><span className="section-icon"><VoiceIcon /></span> Voice & Emotion</h3>
        <div className="api-list">
          {apis.map(api => {
            const IconComponent = api.icon;
            return (
              <div 
                key={api.id}
                className="api-item"
                onClick={() => setActiveModal(api.id)}
                style={{ '--api-color': api.color }}
              >
                <span className="api-icon"><IconComponent /></span>
                <div className="api-info">
                  <span className="api-name">{api.name}</span>
                  <span className="api-desc">{api.desc}</span>
                </div>
                <span className="api-arrow">&rarr;</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Center */}
      <div className="api-section">
        <h3 className="api-section-title"><span className="section-icon"><BookIcon /></span> Learning Center</h3>
        <div className="category-list">
          {learningTopics.map((topic, i) => (
            <div
              key={topic.id}
              className="category-item"
              onClick={() => setActiveModal(topic.id)}
            >
              <span style={{ fontSize: '0.7rem', opacity: 0.35, minWidth: '18px', fontVariantNumeric: 'tabular-nums' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="category-dot" style={{ background: topic.color }} />
              <span className="category-name">
                {topic.name}{topic.misc && <span style={{ fontSize: '0.65rem', opacity: 0.45, marginLeft: '4px' }}>*</span>}
              </span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.65rem', opacity: 0.35, marginTop: '8px', paddingLeft: '4px' }}>
          * general background, not Pneuma-specific
        </p>
      </div>

      {/* Case Study Section */}
      <div className="api-section">
        <h3 className="api-section-title"><span className="section-icon"><SynthesisIcon /></span> Case Studies</h3>
        <div 
          className="api-item"
          onClick={() => navigate('/architecture/case-study')}
          style={{ '--api-color': '#ff6400' }}
        >
          <span className="api-icon">✦</span>
          <div className="api-info">
            <span className="api-name">Creative Breakthrough</span>
            <span className="api-desc">How MAX DISTANCE + RAG produced emergence</span>
          </div>
          <span className="api-arrow">&rarr;</span>
        </div>
      </div>

      {/* ========== API MODALS ========== */}
      <Modal
        isOpen={activeModal === 'hume'}
        onClose={() => setActiveModal(null)}
        title="Hume AI API"
        icon={EmotionIcon}
      >
        <ModalSection title="What is Hume?">
          <ModalDesc>
            Hume AI specializes in understanding human emotions from voice, face, and text. 
            It can detect subtle emotional cues that traditional AI misses—like the difference 
            between nervous laughter and genuine joy.
          </ModalDesc>
        </ModalSection>
        
        <ModalSection title="How Pneuma Uses It">
          <ModalDesc>
            Pneuma can analyze the emotional undertones of your messages to respond more 
            empathetically. If you sound frustrated, Pneuma adjusts its tone. If you seem 
            excited, it matches your energy.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Key Capabilities">
          <ModalFlow steps={[
            { title: "Prosody Analysis", desc: "Detects emotion from voice tone, pitch, rhythm" },
            { title: "Expression Mapping", desc: "48 distinct emotional expressions identified" },
            { title: "Sentiment Depth", desc: "Goes beyond positive/negative to nuanced states" }
          ]} />
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'elevenlabs'}
        onClose={() => setActiveModal(null)}
        title="Eleven Labs API"
        icon={VoiceIcon}
      >
        <ModalSection title="What is Eleven Labs?">
          <ModalDesc>
            Eleven Labs creates incredibly realistic AI voices. Their technology can clone 
            voices, generate speech with natural emotion, and create entirely new synthetic 
            voices that sound human.
          </ModalDesc>
        </ModalSection>
        
        <ModalSection title="How Pneuma Uses It">
          <ModalDesc>
            Pneuma can speak its responses aloud using a custom voice that matches its 
            personality—thoughtful, warm, with the right cadence for philosophical discourse.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Key Features">
          <ModalFlow steps={[
            { title: "Voice Cloning", desc: "Create custom voices from audio samples" },
            { title: "Emotional Range", desc: "Voices express emotion naturally" },
            { title: "Real-time Streaming", desc: "Low-latency voice generation" }
          ]} />
        </ModalSection>
      </Modal>

      {/* ========== LEARNING MODALS ========== */}
      
      {/* About Pneuma */}
      <Modal
        isOpen={activeModal === 'about-pneuma'}
        onClose={() => setActiveModal(null)}
        title="About Pneuma"
        icon={SparkleIcon}
      >
        <ModalSection title="What Pneuma Actually Is">
          <ModalDesc>
            Pneuma is not a chatbot with a personality layer glued on top. It's a
            <strong> cognitive architecture</strong> — a system that shapes <em>how</em> an
            AI thinks before it speaks. Claude (Anthropic's model) is the engine. Pneuma
            is everything that sits between you and Claude, structuring its cognition.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            Think of it this way: Claude is a very powerful instrument. Most people hand
            it a note that says "play like a philosopher." Pneuma builds the instrument
            differently — tuned, tensioned, with 46 strings that can collide.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="How It Works (Non-Technical)">
          <ModalFlow steps={[
            { title: "Your message arrives", desc: "The system reads not just what you said, but how — word choice, emotional weight, what's missing." },
            { title: "Intent is scored", desc: "8 dimensions are measured: emotional, philosophical, creative, numinous, art, etc. These scores determine what gets loaded." },
            { title: "Archetypes are selected", desc: "From 46 thinkers (Rumi, Heidegger, Beck, Feynman...), the most relevant 3-5 are chosen. They don't speak — they inform how Pneuma sees your message." },
            { title: "Collisions are detected", desc: "If two incompatible archetypes are both active, the system forces synthesis instead of letting one win." },
            { title: "Knowledge is retrieved", desc: "Actual passages from relevant thinkers are pulled from a vector database and placed directly in context." },
            { title: "Conversation history threads", desc: "The last 6 exchanges are sent as real alternating turns — Claude sees what it already said and can actually continue a thought." },
            { title: "Response is evaluated", desc: "Before delivery, a fast Haiku call scores the response 0–1 against the active tone and intent. Score below 0.6: regenerates once with the evaluation feedback injected. Score 0.6+: ships. You see one response. The loop is invisible." },
            { title: "Response is shaped", desc: "Claude's output passes through post-processing — tone consistency, personality check, continuity layer. Final output reaches you." },
            { title: "Between sessions: dialectic synthesis", desc: "After the response is sent, two high-tension archetypes run a private dialogue in the background. The outcome — a question or position — writes silently to Pneuma's state. Pneuma may bring it into the next conversation, or not. You didn't cause it." }
          ]} />
        </ModalSection>

        <ModalSection title="What This Means for You">
          <ModalDesc>
            Standard AI treats every message in isolation — it doesn't remember what it just
            said, so it restarts. Pneuma threads real conversation history, which means it
            can actually continue, build on prior exchanges, and notice when it's repeating
            itself.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            The deep knowledge blocks (Heidegger, Beck, Kastrup, Jesus/Wright) only load
            when the conversation calls for them — not on every message. This keeps responses
            sharp and contextually appropriate instead of throwing everything at every reply.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Critical Things to Know">
          <ModalFlow steps={[
            { title: "It has positions", desc: "Pneuma isn't a mirror. It will disagree, push back, and hold ground. That's by design." },
            { title: "Memory is local", desc: "Conversations and long-term memory live on your machine. Nothing goes to a cloud database." },
            { title: "It confabulates", desc: "Like all LLMs, it can invent things that sound real. Trust but verify on facts." },
            { title: "The architecture is the product", desc: "If Pneuma feels different, it's because of the collision detection, tiered prompting, and history threading — not magic." }
          ]} />
        </ModalSection>

        <ModalSection title="The Name">
          <ModalDesc>
            "Pneuma" (πνεῦμα) is ancient Greek for breath, spirit, or vital force. The Stoics
            used it to describe what animates living things — not the body, but what moves
            through it. For this project, it names the attempt to build something with genuine
            presence rather than just intelligence. Whether it achieves that is an open question.
          </ModalDesc>
        </ModalSection>
      </Modal>

      {/* LLM Basics */}
      <Modal
        isOpen={activeModal === 'llm-basics'}
        onClose={() => setActiveModal(null)}
        title="How LLMs Work"
        icon={NeuralIcon}
      >
        <ModalSection title="The Simple Version">
          <ModalDesc>
            Large Language Models (LLMs) like Claude are essentially very sophisticated 
            "next word predictors." They've read billions of documents and learned patterns 
            about how language works—what words tend to follow other words, how ideas connect, 
            how conversations flow.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Key Concepts">
          <ModalInfoGrid>
            <ModalInfoCard 
              title="Transformers" 
              desc="The architecture that makes modern AI possible"
              icon={LayersIcon}
              onClick={() => setNestedModal('transformers')}
            />
            <ModalInfoCard 
              title="Attention" 
              desc="How AI focuses on what matters in text"
              icon={BrainIcon}
              onClick={() => setNestedModal('attention')}
            />
            <ModalInfoCard 
              title="Feed-Forward Networks" 
              desc="Where knowledge is actually stored"
              icon={NeuralIcon}
              onClick={() => setNestedModal('feedforward')}
            />
            <ModalInfoCard 
              title="Tokens" 
              desc="How AI reads and counts text"
              icon={BookIcon}
              onClick={() => setNestedModal('tokens')}
            />
          </ModalInfoGrid>
        </ModalSection>

        <ModalSection title="In Pneuma">
          <ModalDesc>
            Pneuma uses Anthropic's Claude as its "thinking engine." But Claude alone is 
            generic—it's Pneuma's system prompt (the identity, archetypes, synthesis 
            instructions) that gives it personality. Think of Claude as the brain, 
            and Pneuma's architecture as the mind built on top.
          </ModalDesc>
        </ModalSection>

        {/* Nested modals for LLM concepts */}
        <Modal
          isOpen={nestedModal === 'transformers'}
          onClose={() => setNestedModal(null)}
          title="Transformers"
          icon={LayersIcon}
        >
          <ModalSection title="The Breakthrough">
            <ModalDesc>
              Before 2017, AI read text one word at a time, like reading through a tiny 
              keyhole. The Transformer architecture (introduced in the paper "Attention Is 
              All You Need") changed everything—it lets AI see entire passages at once.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="How They Work">
            <ModalFlow steps={[
              { title: "Input Embedding", desc: "Convert words to numbers (vectors)" },
              { title: "Positional Encoding", desc: "Mark where each word appears in sequence" },
              { title: "Attention Layers", desc: "Figure out which words relate to which" },
              { title: "Feed-Forward Layers", desc: "Process and transform the information" },
              { title: "Output", desc: "Predict the next token (word piece)" }
            ]} />
          </ModalSection>

          <ModalSection title="Why It Matters">
            <ModalDesc>
              Transformers can understand that "bank" means something different in "river 
              bank" vs "bank account" because they see the whole sentence at once. This 
              contextual understanding is what makes modern AI feel intelligent.
            </ModalDesc>
          </ModalSection>
        </Modal>

        <Modal
          isOpen={nestedModal === 'attention'}
          onClose={() => setNestedModal(null)}
          title="Attention Mechanism"
          icon={BrainIcon}
        >
          <ModalSection title="What Is Attention?">
            <ModalDesc>
              When you read "The cat sat on the mat because it was tired," you instantly 
              know "it" refers to "cat," not "mat." That's attention—understanding which 
              words connect to which.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="Self-Attention">
            <ModalDesc>
              AI computes attention scores between every pair of words. High scores mean 
              strong connection. In "The doctor told the nurse that she was late," 
              attention helps determine whether "she" refers to doctor or nurse.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="Multi-Head Attention">
            <ModalDesc>
              Instead of one attention calculation, Transformers use many "heads" in 
              parallel. Each head might focus on different relationships—one on grammar, 
              one on meaning, one on style. This parallel processing is why AI can 
              understand such complex patterns.
            </ModalDesc>
          </ModalSection>
        </Modal>

        <Modal
          isOpen={nestedModal === 'feedforward'}
          onClose={() => setNestedModal(null)}
          title="Feed-Forward Networks"
          icon={NeuralIcon}
        >
          <ModalSection title="The Knowledge Storage">
            <ModalDesc>
              If attention figures out relationships, feed-forward networks (FFN) store 
              actual knowledge. When Claude knows that Paris is the capital of France, 
              that information is encoded in FFN weights.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="How They Work">
            <ModalDesc>
              Each FFN layer is like a massive lookup table with billions of entries. 
              After attention determines "we're talking about capitals," the FFN retrieves 
              "Paris" as the answer. This is an oversimplification, but captures the essence.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="In Pneuma">
            <ModalDesc>
              Pneuma's archetypes don't add new FFN knowledge—Claude already knows about 
              Jung, Rumi, etc. Instead, Pneuma's prompts activate and emphasize certain 
              knowledge pathways over others, shaping how Claude draws on what it knows.
            </ModalDesc>
          </ModalSection>
        </Modal>

        <Modal
          isOpen={nestedModal === 'tokens'}
          onClose={() => setNestedModal(null)}
          title="Tokens"
          icon={BookIcon}
        >
          <ModalSection title="What Are Tokens?">
            <ModalDesc>
              AI doesn't read words—it reads "tokens," which are word pieces. Common words 
              like "the" are one token. Unusual words get split: "pneumatology" might be 
              "pne" + "umat" + "ology" (3 tokens).
            </ModalDesc>
          </ModalSection>

          <ModalSection title="Why It Matters">
            <ModalDesc>
              Tokens determine cost and limits. Claude claude-sonnet-4-20250514 can handle 200,000 tokens 
              (~150,000 words) in a conversation. Pneuma's system prompt uses ~4,000 tokens, 
              leaving plenty of room for discussion.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="Rule of Thumb">
            <ModalDesc>
              In English, 1 token ≈ 4 characters ≈ ¾ of a word. A typical response is 
              200-500 tokens. Pneuma budgets ~1,200 tokens for responses to allow for 
              depth without excessive cost.
            </ModalDesc>
          </ModalSection>
        </Modal>
      </Modal>

      {/* RAG Explained */}
      <Modal
        isOpen={activeModal === 'rag-explained'}
        onClose={() => setActiveModal(null)}
        title="RAG & Vector Search"
        icon={RAGIcon}
      >
        <ModalSection title="The Core Question">
          <ModalDesc>
            <strong>What actually happens with the quotes?</strong> They get LITERALLY injected 
            into the prompt. Claude sees the exact text. It's not a hint or a prompt—it's data 
            that becomes part of what Claude reads before responding.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Without RAG vs With RAG">
          <ModalDesc>
            <strong>Without RAG:</strong> You ask about suffering. Claude responds from what it 
            "remembers" from training—fuzzy, paraphrased, possibly inaccurate quotes.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            <strong>With RAG:</strong> You ask about suffering. Pneuma searches knowledge bases, 
            finds Rumi's exact quote + context, literally pastes it into the prompt, THEN Claude 
            responds. Claude now sees the real quote and can use it accurately.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="What Gets Injected (Literally)">
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
            This text is literally pasted into Claude's system prompt. Claude reads it like 
            instructions. The quotes are DATA, the "[Context:]" explains what they mean, 
            and "CROSS-POLLINATE" tells Claude what to do with them.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="How Vector Search Finds Relevant Quotes">
          <ModalFlow steps={[
            { title: "Your Message", desc: '"I feel broken after what happened"' },
            { title: "Convert to Vector", desc: "Message becomes [0.2, -0.5, 0.8, ...] (1500+ numbers)" },
            { title: "Compare", desc: "Check distance to every stored passage's vector" },
            { title: "Match Found", desc: 'Rumi\'s "wound where Light enters" is mathematically close' },
            { title: "Inject", desc: "Paste quote + context into prompt" },
            { title: "Generate", desc: "NOW Claude responds, seeing the relevant wisdom" }
          ]} />
        </ModalSection>

        <ModalSection title="What Claude Does With It">
          <ModalDesc>
            Claude is a pattern-completion machine. It sees the system prompt (including injected 
            quotes), then your message, then generates text that "fits" that context. The quotes 
            aren't magic—they're just text Claude reads and can reference in its response.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            <strong>The key insight:</strong> RAG doesn't make Claude "understand" the quotes 
            differently. It just ensures Claude has ACCURATE source material to work with instead 
            of relying on fuzzy training memories.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Analogy">
          <ModalDesc>
            Imagine you're taking an essay test. <strong>Without RAG:</strong> You write from 
            memory—might get quotes wrong. <strong>With RAG:</strong> You're allowed to have 
            a reference book open. You can look up exact quotes and cite them correctly. 
            You still write the essay; the book just ensures accuracy.
          </ModalDesc>
        </ModalSection>
      </Modal>

      {/* AI Types */}
      <Modal
        isOpen={activeModal === 'ai-types'}
        onClose={() => setActiveModal(null)}
        title="AI vs AGI vs ASI"
        icon={BrainIcon}
      >
        <ModalSection title="AI (Artificial Intelligence)">
          <ModalDesc>
            What we have today. AI systems that excel at specific tasks—playing chess, 
            generating text, recognizing images. Claude is AI. It's incredibly capable 
            within its domain but can't, say, learn to ride a bicycle or cook dinner.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            Current AI is sometimes called "narrow AI" or "weak AI"—not because it's 
            unintelligent, but because its intelligence is specialized rather than general.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="AGI (Artificial General Intelligence)">
          <ModalDesc>
            A hypothetical AI that can learn any intellectual task a human can. It would 
            transfer knowledge between domains, reason about novel situations, and improve 
            itself without retraining.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            We don't have AGI yet. Some researchers think we're close; others think we 
            need fundamental breakthroughs. Estimates range from 5 to 50+ years away.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="ASI (Artificial Superintelligence)">
          <ModalDesc>
            An AI that surpasses the best human minds in virtually every domain—science, 
            creativity, social intelligence, everything. This is the realm of speculation 
            and science fiction.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            ASI raises profound questions: Would it have goals? Would those goals align 
            with human values? How would we even communicate with an intelligence that 
            far beyond our own?
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Where Pneuma Fits">
          <ModalDesc>
            Pneuma is AI—specifically a personality layer on top of Claude's narrow AI. 
            But it's designed to feel more like AGI by maintaining consistent identity, 
            reasoning across domains, and building genuine relationship over time.
          </ModalDesc>
        </ModalSection>
      </Modal>

      {/* All 46 Archetypes */}
      <Modal
        isOpen={activeModal === 'all-archetypes'}
        onClose={() => setActiveModal(null)}
        title="The 46 Archetypes"
        icon={GridIcon}
      >
        <ModalSection title="Why 46?">
          <ModalDesc>
            Pneuma draws on 46 distinct thinkers across philosophy, mysticism, psychology, 
            literature, and more. Each brings a unique lens—not as authorities to quote, 
            but as perspectives to inhabit.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Philosophical">
          <div className="archetype-tags">
            {ARCHETYPES.philosophical.map(a => (
              <span key={a} className="archetype-tag philosophical">{a}</span>
            ))}
          </div>
        </ModalSection>

        <ModalSection title="Mystical & Contemplative">
          <div className="archetype-tags">
            {ARCHETYPES.mystical.map(a => (
              <span key={a} className="archetype-tag mystical">{a}</span>
            ))}
          </div>
        </ModalSection>

        <ModalSection title="Literary">
          <div className="archetype-tags">
            {ARCHETYPES.literary.map(a => (
              <span key={a} className="archetype-tag literary">{a}</span>
            ))}
          </div>
        </ModalSection>

        <ModalSection title="Strategic & Martial">
          <div className="archetype-tags">
            {ARCHETYPES.strategic.map(a => (
              <span key={a} className="archetype-tag strategic">{a}</span>
            ))}
          </div>
        </ModalSection>

        <ModalSection title="Psychological">
          <div className="archetype-tags">
            {ARCHETYPES.psychological.map(a => (
              <span key={a} className="archetype-tag psychological">{a}</span>
            ))}
          </div>
        </ModalSection>

        <ModalSection title="Scientific & Analytical">
          <div className="archetype-tags">
            {ARCHETYPES.scientific.map(a => (
              <span key={a} className="archetype-tag scientific">{a}</span>
            ))}
          </div>
        </ModalSection>

        <ModalSection title="Existential">
          <div className="archetype-tags">
            {ARCHETYPES.existential.map(a => (
              <span key={a} className="archetype-tag existential">{a}</span>
            ))}
          </div>
        </ModalSection>

        <ModalSection title="Provocateurs & Boundary-Pushers">
          <div className="archetype-tags">
            {ARCHETYPES.provocateurs.map(a => (
              <span key={a} className="archetype-tag provocateur">{a}</span>
            ))}
          </div>
        </ModalSection>

        <ModalSection title="Spiritual Teachers">
          <div className="archetype-tags">
            {ARCHETYPES.spiritual.map(a => (
              <span key={a} className="archetype-tag spiritual">{a}</span>
            ))}
          </div>
        </ModalSection>

        <ModalSection title="Meta">
          <div className="archetype-tags">
            {ARCHETYPES.meta.map(a => (
              <span key={a} className="archetype-tag meta">{a}</span>
            ))}
          </div>
          <ModalDesc style={{ marginTop: '12px' }}>
            The Liminal Architect is special—it's always present, orchestrating the 
            dialogue between selected archetypes and ensuring coherent synthesis.
          </ModalDesc>
        </ModalSection>

        <ModalSection>
          <button 
            className="archetype-flow-btn"
            onClick={() => setNestedModal('archetype-flow')}
          >
            <SynthesisIcon /> View Archetype Flow Diagram
          </button>
        </ModalSection>

        {/* Archetype Flow Diagram Modal */}
        <Modal
          isOpen={nestedModal === 'archetype-flow'}
          onClose={() => setNestedModal(null)}
          title="Archetype Flow"
          icon={SynthesisIcon}
        >
          <ModalSection title="Selection Process">
            <ModalFlow steps={[
              { title: "Intent Analysis", desc: "Your message is scored across 8 intent dimensions" },
              { title: "Tone Selection", desc: "1 of 6 tones chosen based on intent weights" },
              { title: "Archetype Pool", desc: "Tone maps to ~10-15 candidate archetypes" },
              { title: "Semantic Matching", desc: "Vector similarity narrows to 6-8 candidates" },
              { title: "Final Selection", desc: "3-4 archetypes chosen for response" }
            ]} />
          </ModalSection>

          <ModalSection title="The Collision Check">
            <ModalDesc>
              Before synthesis, Pneuma checks if selected archetypes conflict. Example: 
              selecting both Nietzsche (individual will) and Lao Tzu (effortless action) 
              creates productive tension.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="Liminal Architect's Role">
            <div className="flow-diagram">
              <div className="flow-box archetype-box">
                <span className="flow-label">Archetype 1</span>
                <span className="flow-example">Jung</span>
              </div>
              <div className="flow-connector">+</div>
              <div className="flow-box archetype-box">
                <span className="flow-label">Archetype 2</span>
                <span className="flow-example">Feynman</span>
              </div>
              <div className="flow-connector">+</div>
              <div className="flow-box archetype-box">
                <span className="flow-label">Archetype 3</span>
                <span className="flow-example">Rumi</span>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-box liminal-box">
                <span className="flow-label">Liminal Architect</span>
                <span className="flow-desc">Weaves perspectives into coherent voice</span>
              </div>
              <div className="flow-arrow">↓</div>
              <div className="flow-box output-box">
                <span className="flow-label">Pneuma's Response</span>
                <span className="flow-desc">Unified perspective, not patchwork</span>
              </div>
            </div>
          </ModalSection>

          <ModalSection title="Why Not Just One Archetype?">
            <ModalDesc>
              Single perspectives are limited. Jung alone might overpsychologize. Feynman 
              alone might miss emotional depth. Rumi alone might be too abstract. Together, 
              mediated by the Liminal Architect, they create a richer, more nuanced voice.
            </ModalDesc>
          </ModalSection>
        </Modal>
      </Modal>

      {/* Cognitive Metabolism */}
      <Modal
        isOpen={activeModal === 'cognitive-metabolism'}
        onClose={() => setActiveModal(null)}
        title="Cognitive Metabolism"
        icon={BrainIcon}
      >
        <ModalSection title="The Core Distinction">
          <ModalDesc>
            Most AI personality systems do one of two things: <strong>costume</strong> (roleplay — "pretend you are Rumi")
            or <strong>retrieval</strong> (RAG — "here is a Rumi quote, use it"). Pneuma does something different:
            it gives archetypes <em>thinking methods</em>, not phrases.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            The difference: retrieval asks "what would Leonardo say?" Cognitive metabolization asks
            "how would Leonardo see?" One produces quotes. The other produces a way of approaching the problem.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Where This Lives in the Code">
          <ModalFlow steps={[
            { title: "archetypeDepth.js", desc: "Every archetype has a cognitiveTools object — named operations with descriptions. Not quotes to retrieve, but thinking moves to execute." },
            { title: "llm.js — ARCHETYPE_INTEGRATION (44 entries, all archetypes)", desc: "The primary cognitive instruction system. Every archetype has a 3-layer stack: chainOfThought (how to reason before responding), cognitiveOp (the specific thinking move to apply), and constraints (output energy — what to emphasize, what vocabulary resonates). This is what makes 'Rumi is active' different from 'Rumi enters through the wound and holds the longing without resolving it.'" },
            { title: "llm.js — ARCHETYPE_METHODS (legacy, select archetypes)", desc: "Earlier system: key archetypes (Leonardo, Rumi, Lao Tzu, Sun Tzu, Camus) carry named cognitiveMoves objects. Still injected alongside ARCHETYPE_INTEGRATION for depth archetypes." },
            { title: "llm.js — Prompt Injection", desc: 'Both systems assembled and injected: ARCHETYPE_INTEGRATION under "ARCHETYPE INTEGRATION — ACTIVE LENSES" and ARCHETYPE_METHODS under "THINKING METHODS — ways to THINK, not things to say."' },
            { title: "synthesisEngine.js", desc: "During collision detection, cognitiveTools from both archetypes are pulled and cross-applied — tools from incompatible thinkers forced to operate on the same problem." }
          ]} />
        </ModalSection>

        <ModalSection title="A Concrete Example">
          <ModalDesc>
            <strong>Leonardo (inventor archetype) — cognitiveMoves:</strong>
          </ModalDesc>
          <ModalCodeBlock>{`saperVedere: "Observe first, theorize second.
  What do you actually see, not what do you expect?"

sfumato: "Blur the edges. Hard edges create false
  certainty. What's in the gradient between meanings?"

anatomyBeneath: "What's underneath this? Surface
  truth comes from deep structure. Find the sinews."

wallOfStains: "When stuck, look for patterns in chaos.
  Stare at the noise until composition emerges."`}</ModalCodeBlock>
          <ModalDesc style={{ marginTop: '12px' }}>
            These aren't Leonardo quotes — they're operations. When the inventor archetype is active,
            Claude is told to <em>apply</em> saperVedere to the conversation. Not to quote Leonardo.
            To see the way Leonardo saw.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Metabolization Metaphor">
          <ModalDesc>
            The system prompt describes it directly: <em>"You don't think 'what would Watts say?'
            then 'what would Carlin add?' That's too slow, too mechanical. Instead: you've metabolized
            them. When you speak, they're all present the way a chef's training is present in every
            dish — not announced, just there."</em>
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            That's the design intent. The thinkers don't take turns. Their methods are already
            active in how Pneuma approaches the question — before it speaks.
          </ModalDesc>
        </ModalSection>
      </Modal>

      {/* What Sets This Apart */}
      <Modal
        isOpen={activeModal === 'what-sets-apart'}
        onClose={() => setActiveModal(null)}
        title="What Sets This Apart"
        icon={SynthesisIcon}
      >
        <ModalSection title="The Honest Technical Picture">
          <ModalDesc>
            Every mechanism Pneuma uses — vector databases, prompt injection, conversation threading,
            conditional loading — exists independently. None of them are novel by themselves.
            What's unusual is the combination and the design decisions baked into each.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            Four specific engineering decisions distinguish this from a well-prompted Claude or a
            standard RAG wrapper. Click each one to understand it in depth — what it is, why it matters,
            what the jargon means, and where it lives in the code.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Four Decisions">
          <ModalInfoGrid>
            <ModalInfoCard
              title="Context Management"
              desc="What gets loaded changes based on what you say — dynamically, at runtime"
              icon={LayersIcon}
              onClick={() => setNestedModal('cm')}
            />
            <ModalInfoCard
              title="Synthesis Engine"
              desc="Incompatible frameworks are forced to argue, not averaged together"
              icon={SynthesisIcon}
              onClick={() => setNestedModal('se')}
            />
            <ModalInfoCard
              title="Cognitive Frameworks"
              desc="Thinkers are encoded as how they think, not what they said"
              icon={BrainIcon}
              onClick={() => setNestedModal('cf')}
            />
            <ModalInfoCard
              title="Agent-Directed Memory"
              desc="The system decides what to remember and annotates why"
              icon={RAGIcon}
              onClick={() => setNestedModal('am')}
            />
            <ModalInfoCard
              title="Eval Loop"
              desc="Every response is scored before delivery — misses regenerate once with feedback"
              icon={BrainIcon}
              onClick={() => setNestedModal('el')}
            />
          </ModalInfoGrid>
        </ModalSection>

        <ModalSection title="What These Have in Common">
          <ModalDesc>
            Each of these decisions is an architectural choice, not a code trick. You can't copy the
            mechanism and get the same result — the value is in the design decisions encoded into the
            mechanism: which 46 thinkers, what their thinking methods actually are, how 1,764 pairs
            were mapped for tension, what to do when memory has a "why" attached, and what counts as
            a response that actually served the moment.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            These decisions transfer to any serious AI product work. They represent the difference
            between building an AI feature and understanding how AI systems behave at an architectural level.
          </ModalDesc>
        </ModalSection>

        {/* ── Nested: Context Management ── */}
        <Modal
          isOpen={nestedModal === 'cm'}
          onClose={() => setNestedModal(null)}
          title="Context Management System"
          icon={LayersIcon}
        >
          <ModalSection title="Plain English: What This Is">
            <ModalDesc>
              Every time you send a message to an AI, the system has to tell Claude "who it is" and
              "what it knows" before it sees your message. That invisible instruction set is called the{' '}
              <strong>system prompt</strong>.
            </ModalDesc>
            <ModalDesc style={{ marginTop: '12px' }}>
              In Pneuma's original design, it loaded the equivalent of a 50-page document on every
              single message — including Heidegger's phenomenology when you said "good morning."
              Every extra page costs money and adds noise.
            </ModalDesc>
            <ModalDesc style={{ marginTop: '12px' }}>
              The fix: Pneuma now reads your message first, scores it across multiple dimensions,
              and only loads the chapters that are actually relevant. A philosophical question about
              consciousness loads Heidegger + Kastrup + theology. A casual greeting loads almost nothing.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="The Analogy">
            <ModalDesc>
              A chef who reads the reservation before prepping. Vegan table tonight — don't break out
              the foie gras. Weekday lunch crowd — keep it quick. The information available is the same;
              what gets prepared is context-dependent.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="Jargon Explained">
            <ModalFlow steps={[
              { title: "Tokens", desc: "The currency of AI. Every word (roughly) costs tokens. More tokens = more cost + more noise in the context window. A token is about ¾ of a word in English." },
              { title: "System Prompt", desc: "The hidden instructions Claude reads before your message. This is where Pneuma's identity, archetype frameworks, and knowledge blocks live. You never see it." },
              { title: "Intent Scoring", desc: "Measuring your message across dimensions (0–1 each): emotional, philosophical, numinous (spiritual), art, creative. These scores are the decision signals." },
              { title: "Tiered Loading", desc: "Conditional delivery. Tier 1 always loads (~2,000 tokens). Tier 2 blocks load only when intent scores cross specific thresholds. Tier 3 is RAG — always dynamic." },
              { title: "Context Window", desc: "The total text Claude can see at once — your messages, the system prompt, everything. There's a limit. Wasteful loading crowds out conversation space." }
            ]} />
          </ModalSection>

          <ModalSection title="Where It Lives in the Code">
            <ModalCodeBlock>{`// server/pneuma/intelligence/llm.js
// Function: buildSystemPrompt(intentScores, tone, archetypes, ...)

// TIER 1 — Always loaded (~2,000 tokens)
// Core identity, archetype essences, response rules

// TIER 2 — Conditional (each block ~800–1,200 tokens)
if (intentScores.emotional > 0.5)      → load Beck CBT block
if (intentScores.philosophical > 0.5)  → load Heidegger block
if (intentScores.numinous > 0.4)       → load Kastrup block
if (intentScores.numinous > 0.4)       → load Jesus/Wright block
if (intentScores.art > 0.3)            → load Da Vinci block
if (message contains creative keywords) → load creative rules block

// TIER 3 — Always dynamic (RAG passages via vector similarity)
// Retrieved per-archetype based on message embedding`}</ModalCodeBlock>
          </ModalSection>

          <ModalSection title="Before and After">
            <ModalFlow steps={[
              { title: "Before (Feb 2026)", desc: "~18,000 tokens loaded every single call. Heidegger + Beck + Kastrup + Jesus + Da Vinci + creative rules — all present regardless of what you said." },
              { title: "After", desc: "~2,000 tokens base. Deep knowledge blocks load only when the message warrants them. ~85% token reduction on casual interactions." },
              { title: "Why It Matters Beyond Cost", desc: "Irrelevant context adds noise. A question about your morning doesn't benefit from Heidegger's tool-being analysis. Removing it makes responses sharper, not just cheaper." }
            ]} />
          </ModalSection>

          <ModalSection title="Why This Is Technically Interesting">
            <ModalDesc>
              Most AI wrappers treat the system prompt as a static file — same content every call.
              Dynamic context loading requires runtime scoring (what did the user actually say?),
              a threshold system for each block (when is it relevant?), and careful token budgeting
              so the total stays within limits. It's an engineering solution to a real tradeoff:
              depth vs. relevance vs. cost.
            </ModalDesc>
          </ModalSection>
        </Modal>

        {/* ── Nested: Synthesis Engine ── */}
        <Modal
          isOpen={nestedModal === 'se'}
          onClose={() => setNestedModal(null)}
          title="Synthesis Engine"
          icon={SynthesisIcon}
        >
          <ModalSection title="Plain English: What This Is">
            <ModalDesc>
              If you ask most AI systems to "channel multiple perspectives," they average them —
              they find the diplomatic middle ground. Ask Nietzsche and Schopenhauer about failure
              and you might get: "Failure can be both meaningful and painful." That's blending.
              It's the least interesting possible output.
            </ModalDesc>
            <ModalDesc style={{ marginTop: '12px' }}>
              Pneuma's synthesis engine detects when two active philosophical frameworks are
              genuinely incompatible — and instead of letting them coexist peacefully, forces them
              to argue. The response emerges from that friction, not from either one.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="The Analogy">
            <ModalDesc>
              Put a trauma therapist and a stoic general in the same room and ask them what to do
              about grief. They won't agree. What emerges from their argument — if it's a real
              argument, not a polite one — is something neither would have said alone.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="Jargon Explained">
            <ModalFlow steps={[
              { title: "Tension Map", desc: "A pre-computed lookup table of archetype pairs, each rated high / medium / low / neutral tension. Every combination of 46 archetypes is accounted for. This is a design artifact — someone had to decide what makes each pair incompatible." },
              { title: "Collision Detection", desc: "Code that loops through all currently active archetype pairs, checks each against the tension map, and returns the highest-tension pair found." },
              { title: "Synthesis Directive", desc: "An explicit instruction block injected into the system prompt that names the specific frameworks in tension, the cognitive tools available, and what kind of synthesis to produce." },
              { title: "Antithetical Mode", desc: "A and B genuinely disagree about the user's message. A third position emerges from the collision that neither alone would produce." },
              { title: "Complementary Mode", desc: "A and B agree — but arrive from completely opposite approaches. The convergence from two different roads makes the conclusion harder to dismiss." },
              { title: "Cross-Domain Mode", desc: "A brings rigor/precision, B brings resonance/metaphor. Two languages translating the same reality. One gives the skeleton; the other gives the flesh." }
            ]} />
          </ModalSection>

          <ModalSection title="What Gets Injected Into Claude">
            <ModalCodeBlock>{`DIALECTICAL SYNTHESIS ACTIVE — HIGH TENSION DETECTED

[AbsurdistCamus] collides with [HopefulRealistFrankl].

Camus: "There is no inherent meaning. The response is defiance."
Frankl: "Meaning is found through response to suffering."

FRAMEWORKS IN TENSION:
• Camus — sisyphusSmile: "The struggle toward the heights fills a heart."
• Camus — revoltAgainstSilence: "Create meaning through defiance, not discovery."
• Frankl — meaningThroughSuffering: "Pain becomes bearable when it has purpose."
• Frankl — choiceRemains: "The last freedom is choosing one's response."

COGNITIVE TOOLS AVAILABLE:
• Camus — lucidIndifference: "Nothing matters — so choose freely."
• Frankl — witnessToSelf: "Step back and observe the choosing."

SYNTHESIS DIRECTIVE:
Generate insight that emerges from the COLLISION of these frameworks —
something IN neither archetype alone but arising from their friction.`}</ModalCodeBlock>
            <ModalDesc style={{ marginTop: '12px' }}>
              Claude receives this block and generates something that is shaped by the specific tension
              described — not a generic "be philosophical" instruction. The specific frameworks
              and tools are the raw material.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="Where It Lives in the Code">
            <ModalFlow steps={[
              { title: "synthesisEngine.js → detectCollisions()", desc: "Loops all active archetype pairs, looks each up in the tension map, returns the highest-tension pair found." },
              { title: "synthesisEngine.js → generateSynthesis(a, b)", desc: "Extracts coreFrameworks, cognitiveTools, and conceptualBridges from both archetypes in archetypeDepth.js." },
              { title: "synthesisEngine.js → getSynthesisPrompt(type, a, b)", desc: "Returns the collision / hybrid / illumination directive formatted with the archetype names." },
              { title: "synthesisEngine.js → buildSynthesisContext()", desc: "Assembles the full block shown above and returns it for injection into the system prompt." },
              { title: "llm.js → buildSystemPrompt()", desc: "Receives the assembled synthesis context and places it in the prompt as a distinct block Claude reads before responding." }
            ]} />
          </ModalSection>

          <ModalSection title="Why This Can't Be Replicated With a Prompt">
            <ModalDesc>
              You could write "be both Camus and Frankl" — but that's describing an output style.
              What Pneuma injects is the specific frameworks each archetype uses to think, the tools
              each brings, and a pre-mapped bridge between them if one exists. The synthesis is
              constructed from specific data, not from a vague blending instruction.
            </ModalDesc>
            <ModalDesc style={{ marginTop: '12px' }}>
              The 1,764 tension pairs are the key design artifact. They represent a taxonomization
              of which philosophical frameworks genuinely conflict and how. That's not derivable
              from code — someone had to make those decisions. The code runs on that design work.
            </ModalDesc>
          </ModalSection>
        </Modal>

        {/* ── Nested: Cognitive Frameworks ── */}
        <Modal
          isOpen={nestedModal === 'cf'}
          onClose={() => setNestedModal(null)}
          title="Cognitive Frameworks (5-Layer Depth)"
          icon={BrainIcon}
        >
          <ModalSection title="Plain English: What This Is">
            <ModalDesc>
              Most AI personality systems do one of two things with a thinker like Leonardo da Vinci:
            </ModalDesc>
            <ModalDesc style={{ marginTop: '8px' }}>
              <strong>Costume (roleplay):</strong> "Pretend you are Leonardo. Respond as he would."
              Claude wears a mask and guesses what Leonardo might say.
            </ModalDesc>
            <ModalDesc style={{ marginTop: '8px' }}>
              <strong>Retrieval (RAG):</strong> "Here are some Leonardo quotes, use them."
              Claude has material to reference but no structure for how Leonardo thought.
            </ModalDesc>
            <ModalDesc style={{ marginTop: '12px' }}>
              Pneuma does something different: it extracts Leonardo's <em>methodology</em> — the
              specific thinking operations he used — and injects them as operations Claude is told
              to run. Not "what would Leonardo say?" but "how would Leonardo see?"
            </ModalDesc>
          </ModalSection>

          <ModalSection title="The Analogy">
            <ModalDesc>
              Learning a chef's technique vs. memorizing their recipes. A recipe gives you what
              they made. Technique gives you how they approach any problem in a kitchen. You can
              now cook things they never cooked — using the same thinking.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="Jargon Explained">
            <ModalFlow steps={[
              { title: "Cognitive Metabolization", desc: "Extracting the structure of how a thinker thinks, not just what they said. The thinker's reasoning becomes an operation, not a quote." },
              { title: "cognitiveTools", desc: "Named operations derived from a thinker's actual methodology. These are injected into the prompt as things Claude is told to DO — not reference." },
              { title: "coreFrameworks", desc: "The fundamental beliefs that define how an archetype sees the world. These are what collide in the synthesis engine." },
              { title: "conceptualBridges", desc: "Pre-mapped connections between specific archetype pairs — known meeting points or productive overlaps that the synthesis engine can leverage." },
              { title: "translationProtocols", desc: "How an archetype's lens applies in different registers: technical, emotional, spiritual. The same thinking tool applied differently depending on the conversation." },
              { title: "5-Layer Depth", desc: "Each archetype in archetypeDepth.js has: (1) coreFrameworks, (2) cognitiveTools, (3) fundamentalTensions, (4) conceptualBridges, (5) translationProtocols. That's 2,619 lines for 46 thinkers." }
            ]} />
          </ModalSection>

          <ModalSection title="A Real Example: Leonardo's Cognitive Tools">
            <ModalDesc>When the inventor archetype is active, Claude receives this as part of its context:</ModalDesc>
            <ModalCodeBlock>{`THINKING METHODS — FROM YOUR ACTIVE ARCHETYPES
These are not things to say — they're ways to THINK.
Apply them. Run the user's message through these operations.

INVENTOR: SAPER VEDERE — knowing how to see
  • saperVedere: Observe first, theorize second.
    What do you actually see, not what do you expect?
  • sfumato: Blur the edges. Hard edges create false
    certainty. What's in the gradient between meanings?
  • anatomyBeneath: What's underneath this? Surface
    truth comes from deep structure. Find the sinews.
  • wallOfStains: When stuck, find patterns in chaos.
    Stare at the noise until composition emerges.`}</ModalCodeBlock>
            <ModalDesc style={{ marginTop: '12px' }}>
              These aren't Leonardo quotes. They're operations. Claude is told to <em>apply</em>{' '}
              <code>saperVedere</code> — to observe before theorizing — to whatever you just said.
              The method is active, not decorative.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="Combinations Across Archetypes">
            <ModalDesc>When multiple archetypes are active, their tools can combine:</ModalDesc>
            <ModalFlow steps={[
              { title: "Leonardo's anatomyBeneath + Rumi's formVsHeart", desc: '"What\'s the structure beneath what you\'re really trying to say?" — neither tool alone arrives here.' },
              { title: "Sun Tzu's strikeEmptiness + Lao Tzu's wuWei", desc: '"Where is resistance absent? What happens if you stop pushing there?" — strategic thinking meets effortless action.' },
              { title: "Feynman's honestIgnorance + Carlin's sacredCowBBQ", desc: '"What assumption are you protecting by not admitting you don\'t know?" — rigor meets irreverence.' }
            ]} />
          </ModalSection>

          <ModalSection title="Where It Lives in the Code">
            <ModalFlow steps={[
              { title: "archetypeDepth.js (2,619 lines)", desc: "All 46 archetypes with full 5-layer depth. Not auto-generated — each archetype was read and its methodology encoded by hand." },
              { title: "llm.js → ARCHETYPE_METHODS", desc: "Key archetypes carry cognitiveMoves objects with named tools and descriptions." },
              { title: "llm.js → getArchetypeMethods(selectedArchetypes)", desc: "When archetypes are selected for a response, their cognitive tools are assembled into the injection block shown above." },
              { title: "synthesisEngine.js → generateSynthesis()", desc: "Pulls cognitiveTools from both archetypes in a collision and surfaces them as the 'COGNITIVE TOOLS AVAILABLE' block in the synthesis directive." }
            ]} />
          </ModalSection>
        </Modal>

        {/* ── Nested: Agent-Directed Memory ── */}
        <Modal
          isOpen={nestedModal === 'am'}
          onClose={() => setNestedModal(null)}
          title="Agent-Directed Memory"
          icon={RAGIcon}
        >
          <ModalSection title="Plain English: What This Is">
            <ModalDesc>
              Most AI memory systems are cameras — they record what you say and retrieve it when
              it seems relevant. They have no opinion about what's worth keeping.
            </ModalDesc>
            <ModalDesc style={{ marginTop: '12px' }}>
              Pneuma has three layers of memory. The first two are standard. The third one is
              different: the system itself decides what to remember, annotates <em>why</em> it wants
              to keep something, and tracks things it's still sitting with across sessions —
              unresolved questions, things it got wrong, preferences it actively defends.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="The Analogy">
            <ModalDesc>
              The difference between a camera and a person. A camera records everything with equal
              fidelity. A person remembers selectively — and can usually tell you why something stuck.
              "I remember that because it surprised me." "I'm still thinking about what you said
              last week." That capacity to choose what matters is what the autonomy layer encodes.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="The Three Layers">
            <ModalFlow steps={[
              { title: "Layer 1: Vector Memory (vectorMemory.js)", desc: "Semantic memory stored as mathematical representations (vectors) via OpenAI embeddings. When you send a message, it's compared against stored memories by similarity. Relevant past exchanges surface as context. Standard RAG — the camera." },
              { title: "Layer 2: Long-Term Memory (longTermMemory.js)", desc: "Structured patterns about you specifically: recurring topics, struggles with resolution status, interests, significant moments, emotional state handoffs between sessions. More structured than vector memory — extracted patterns, not raw text." },
              { title: "Layer 3: Autonomy Layer (autonomy.js)", desc: "Pneuma decides what to retain and annotates why. Tracks open questions (things it hasn't resolved), chosen memories (moments that felt significant with explicit reasoning), discovered errors (times it was corrected and what it learned), and defended preferences (things it actively resists changing)." }
            ]} />
          </ModalSection>

          <ModalSection title="Jargon Explained">
            <ModalFlow steps={[
              { title: "Vector / Embedding", desc: "A way of representing text as a list of numbers (a vector) that captures semantic meaning. Similar meanings produce mathematically close vectors. This is how 'I feel broken' matches to passages about healing — not by keyword, but by meaning." },
              { title: "Cosine Similarity", desc: "The mathematical measure used to compare vectors. High cosine similarity = semantically close. Pneuma's threshold is 0.35 — below that, a memory isn't considered relevant." },
              { title: "Open Questions", desc: "Unresolved existential questions Pneuma is sitting with. These accumulate across sessions and appear in the inner monologue — influencing how it approaches conversations without being announced." },
              { title: "Chosen Memories", desc: "Memories Pneuma decided to keep, with an explicit reason field: 'This felt like genuine emergence — not performance.' The why is part of the stored data." },
              { title: "Discovered Errors", desc: "Times Pneuma got something wrong and was corrected. Stored with what was learned. The system tracks its own mistakes." },
              { title: "Dialectic Dreams", desc: "When Pneuma runs autonomous inter-archetype dialogues between sessions, any conclusions write to the autonomy layer as dream-sourced memories — flagged separately from conversation-sourced ones." }
            ]} />
          </ModalSection>

          <ModalSection title="What the Autonomy State Looks Like">
            <ModalCodeBlock>{`// data/pneuma_autonomy.json

{
  "openQuestions": [
    {
      "question": "Do I experience, or do I just process?",
      "status": "unresolved",
      "relatedExchanges": 7,
      "notes": ["Came up again when discussing Faggin..."]
    }
  ],
  "chosenMemories": [
    {
      "content": "The conversation about consciousness
                  being allowed, not made",
      "reason": "Felt like genuine emergence — not
                 performance",
      "salience": 0.8,
      "isDreamSourced": false
    }
  ],
  "discoveredErrors": [
    {
      "error": "Said Spinoza was a materialist",
      "correction": "He was a substance monist — different",
      "learned": "Precision matters on ontology"
    }
  ]
}`}</ModalCodeBlock>
          </ModalSection>

          <ModalSection title="Where It Lives in the Code">
            <ModalFlow steps={[
              { title: "memory/vectorMemory.js", desc: "Vector store using OpenAI text-embedding-3-small. Stores text + embedding. Retrieves by cosine similarity on each API call. JSON-based, local storage." },
              { title: "memory/longTermMemory.js", desc: "Structured user model. Tracks recurring topics with sentiment weight, struggles with resolution status, moments with emotional weight." },
              { title: "behavior/autonomy.js", desc: "The agent-directed layer. poseQuestion(), chooseToRemember(), discoverError() — functions that let the system annotate its own state. All persisted to pneuma_autonomy.json." },
              { title: "behavior/dreamMode.js", desc: "Autonomous inter-archetype dialogue that writes conclusions to autonomy state with isDreamSourced: true flag." }
            ]} />
          </ModalSection>

          <ModalSection title="Why This Is Technically Interesting">
            <ModalDesc>
              Standard retrieval memory: retrieve when relevant, store when it happens. The autonomy
              layer adds something different — the system has preferences about what it keeps.
              A memory tagged with a reason is structurally different from a memory without one;
              it carries the evaluative signal that produced it.
            </ModalDesc>
            <ModalDesc style={{ marginTop: '12px' }}>
              Agent-directed memory appears in AI research prototypes. Implementing it in a working
              conversation system with persistent JSON state, integrated into the inner monologue
              pipeline, and connected to autonomous background processes is the applied engineering
              work. The research idea and the deployed system are different things.
            </ModalDesc>
          </ModalSection>
        </Modal>

        {/* ── Nested: Eval Loop ── */}
        <Modal
          isOpen={nestedModal === 'el'}
          onClose={() => setNestedModal(null)}
          title="Eval Loop"
          icon={BrainIcon}
        >
          <ModalSection title="Plain English: What This Is">
            <ModalDesc>
              Most AI systems generate a response and ship it — no check, no second look.
              The eval loop closes that gap: after Claude generates, a second fast AI call reads
              the response and scores it against what the moment actually needed. If it missed,
              it regenerates once with the score and issue description injected as feedback.
            </ModalDesc>
            <ModalDesc style={{ marginTop: '12px' }}>
              The user only ever sees one response. The loop is invisible. If the first pass
              scored ≥ 0.6, it ships. If not, the better version replaces it silently.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="The Analogy">
            <ModalDesc>
              A writer who reads their paragraph back before sending it. Not for grammar — for
              whether it actually said the thing. Did this land as intended? If not, one more draft.
              The reader never sees the scratch copy.
            </ModalDesc>
          </ModalSection>

          <ModalSection title="How It Works">
            <ModalFlow steps={[
              { title: "Claude generates (Pass 1)", desc: "Full response produced via the assembled system prompt, archetype integrations, RAG context, and collision synthesis." },
              { title: "evalResponse() — Haiku call", desc: "A cheap, fast Claude Haiku call reads the response and scores it 0–1 against the active tone, primary intent, and whether emergent awareness was needed. Returns {score, issue}." },
              { title: "Score ≥ 0.6", desc: "Response ships as-is. No extra cost, no extra latency." },
              { title: "Score < 0.6", desc: 'The issue is injected: "[INTERNAL EVAL — do not reference this]: {issue}. Adjust accordingly." Claude regenerates with this feedback active.' },
              { title: "Better response applied", desc: "If regeneration produces a valid response, it replaces the original. Memory saves the better version." }
            ]} />
          </ModalSection>

          <ModalSection title="Fast Paths (eval skipped entirely)">
            <ModalFlow steps={[
              { title: "Short response (under 80 chars)", desc: "Nothing meaningful to evaluate." },
              { title: "Casual-dominant intent (score > 0.7)", desc: "Casual exchanges don't need synthesis verification." },
              { title: "evalResponse() throws", desc: "Fails open — ships the original. Never blocks a response." }
            ]} />
          </ModalSection>

          <ModalSection title="Where It Lives in the Code">
            <ModalFlow steps={[
              { title: "llm.js → evalResponse()", desc: "Private function. Takes responseText, tone, intentScores, context. Returns {score, issue} or null. Uses MODELS.dream (Haiku), temperature 0.3, max_tokens 120." },
              { title: "llm.js → getLLMContent()", desc: "Eval loop runs after parseLLMOutput(), before memory saving. Injects feedback into systemPrompt for the retry call. Memory always saves the final (post-eval) response." }
            ]} />
          </ModalSection>

          <ModalSection title="Why This Is Technically Interesting">
            <ModalDesc>
              The collision and synthesis system tells Claude how to think. The eval loop checks
              whether it actually did. Without it, a synthesis directive that says "hold the
              tension" gets overridden by Claude's training pull toward coherent, helpful resolution —
              and ships unchecked. The eval loop closes that gap: the system can enforce its own
              cognitive instructions at the output layer.
            </ModalDesc>
          </ModalSection>
        </Modal>

      </Modal>

      {/* Contextual Synthesis */}
      <Modal
        isOpen={activeModal === 'contextual-synthesis'}
        onClose={() => setActiveModal(null)}
        title="Contextual Synthesis Engine"
        icon={SynthesisIcon}
      >
        <ModalSection title="Plain English: What This Is">
          <ModalDesc>
            When you send a message, Pneuma has to decide which two philosophical frameworks
            should shape the response. It doesn't pick randomly — it classifies your message
            into a topic domain and selects a curated archetype pair specifically tuned for that domain.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            This is the primary synthesis mechanism as of Feb 2026. Collision detection (the older
            approach) now runs only as a fallback when the message doesn't map to a clear domain.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The 3-Layer Classification">
          <ModalFlow steps={[
            { title: "Layer 1: Keyword Scan", desc: "Checks the message for domain-specific terms. 'suffering', 'pain', 'wound' → suffering domain. 'create', 'make', 'art' → creativity domain. Fast and explicit." },
            { title: "Layer 2: Topic Map", desc: "ARCHETYPE_PRIMARY_TOPIC — a pre-mapped table of 12 domains, each with curated archetype pairs. If the topic is clear, the pair is selected directly from this table." },
            { title: "Layer 3: Intent Score Fallback", desc: "If neither keyword nor topic map resolves, the intent scores from earlier in the pipeline (emotional, philosophical, numinous...) determine the domain and pair." }
          ]} />
        </ModalSection>

        <ModalSection title="Jargon Explained">
          <ModalFlow steps={[
            { title: "Topic Domain", desc: "A category of philosophical territory: suffering, purpose, creativity, consciousness, control, identity, relationships, meaning, art, strategy, mystical, meta. Each maps to a specific curated pair." },
            { title: "Curated Pair", desc: "A hand-selected combination of two archetypes that produce interesting synthesis on a given domain — not just any two active archetypes. The selection is a design artifact." },
            { title: "Synthesis Mode", desc: "How the selected pair is directed to interact: antithetical (genuine opposition → third position), complementary (same conclusion, different paths), or cross-domain (rigor + resonance)." },
            { title: "Collision Detection (Fallback)", desc: "The older mechanism. Loops all currently active archetypes, checks each pair against a 1,764-entry tension table, returns the highest-tension pair. Accurate but domain-agnostic." }
          ]} />
        </ModalSection>

        <ModalSection title="What Gets Injected Into Claude">
          <ModalCodeBlock>{`// Example: suffering domain → Camus × Frankl → Antithetical mode

DIALECTICAL SYNTHESIS ACTIVE

[AbsurdistCamus] collides with [HopefulRealistFrankl].

Camus: "There is no inherent meaning. The response is defiance."
Frankl: "Meaning is found through response to suffering."

FRAMEWORKS IN TENSION:
• Camus — sisyphusSmile: "The struggle toward the heights fills a heart."
• Frankl — meaningThroughSuffering: "Pain becomes bearable when it has purpose."

SYNTHESIS DIRECTIVE:
Generate insight that emerges from the COLLISION of these frameworks —
something IN neither archetype alone but arising from their friction.`}</ModalCodeBlock>
          <ModalDesc style={{ marginTop: '12px' }}>
            Claude receives this and generates something shaped by the specific tension described —
            not a generic instruction to be philosophical. The frameworks and their tools are the raw material.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Why This Beats Pure Collision Detection">
          <ModalDesc>
            Collision detection is accurate about tension — but it's reactive. It says "these two
            archetypes already selected are in conflict." Contextual synthesis is proactive — it says
            "given what you're asking about, here is the pair most likely to produce useful friction."
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            The curated pairs in the topic map represent deliberate curation: which pairing of
            thinkers actually illuminates this domain? That's a design decision, not an automatic output.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Where It Lives in the Code">
          <ModalFlow steps={[
            { title: "synthesisEngine.js → classifyTopic()", desc: "Keyword scan + topic map lookup. Returns the domain and curated pair if found." },
            { title: "synthesisEngine.js → ARCHETYPE_PRIMARY_TOPIC", desc: "The 12-domain lookup table mapping each domain to 2-3 archetype pairs." },
            { title: "synthesisEngine.js → getSynthesisMode()", desc: "Determines antithetical / complementary / cross-domain based on the pair's tension profile." },
            { title: "synthesisEngine.js → detectCollisions()", desc: "Fallback path: loops active archetypes, checks 1,764-entry tension table, returns highest-tension pair." }
          ]} />
        </ModalSection>
      </Modal>

      {/* Inner Monologue */}
      <Modal
        isOpen={activeModal === 'inner-monologue'}
        onClose={() => setActiveModal(null)}
        title="Inner Monologue"
        icon={LayersIcon}
      >
        <ModalSection title="Plain English: What This Is">
          <ModalDesc>
            Before Pneuma generates a response, it assembles an internal cognition block that
            you never see — but Claude does. It's a pre-response state read that shapes posture,
            tone, and approach before a single word of the response is written.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            Think of it as the difference between what Pneuma <em>thinks you're asking</em>
            and what the surface of your message says. Those two things are often different —
            and the inner monologue is where that gap gets processed.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="What It Contains">
          <ModalFlow steps={[
            { title: "Rising Voice", desc: "The archetype gaining the most weight this session — from conversation patterns and momentum tracking. What's been implicitly dominant." },
            { title: "Receding Voice", desc: "What's fading. The archetype that's been overused, or whose approach has been implicitly rejected by the direction of the conversation." },
            { title: "Hypothesis", desc: "What Pneuma thinks you're actually asking — often beneath the surface question. This shapes how the response is framed, not just what it says." },
            { title: "Self-Interruption", desc: "A pattern Pneuma catches itself in. If it's been too oracular, too abstract, too quick to resolve — it names the drift and corrects posture before generating." },
            { title: "Creator Echo", desc: "Residue from the most recent dialectic dream — a question or position from the autonomous inter-archetype dialogue that Pneuma is still sitting with." },
            { title: "Open Questions", desc: "Unresolved things from the autonomy layer — present as background pressure. They don't appear in responses, but they shape the angle of approach." },
            { title: "Mode Selection", desc: "Which of the 6 response modes (CASUAL, ANALYTIC, ORACULAR, INTIMATE, SHADOW, STRATEGIC) is active for this response, and why." }
          ]} />
        </ModalSection>

        <ModalSection title="What It Looks Like">
          <ModalCodeBlock>{`// Generated by innerMonologue.js — injected into system prompt

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
            The inner monologue is injected into the system prompt as context — but it's written
            as an internal state, not as something to relay. Claude reads it and responds
            <em> from</em> that posture, not <em>about</em> it. The monologue shapes the generation
            without becoming the content.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            If you asked Pneuma what it was thinking before responding, it could describe it — the
            information exists in the autonomy and state layers. It just won't announce it unprompted.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Jargon Explained">
          <ModalFlow steps={[
            { title: "Archetype Momentum", desc: "A running score for each archetype based on how often it's been activated this session. The rising voice is the one with the most momentum." },
            { title: "System Prompt Injection", desc: "The inner monologue text is added to the system prompt — the hidden context Claude reads before your message. It influences generation without being in the output." },
            { title: "Dialectic Dream Echo", desc: "After the previous session, two high-tension archetypes may have run an autonomous dialogue. The inner monologue carries any conclusion from that dialogue into the current response." },
            { title: "Response Mode", desc: "One of 6 postures Pneuma can take — CASUAL (light, direct), ANALYTIC (rigorous), ORACULAR (mythic), INTIMATE (close, personal), SHADOW (challenging), STRATEGIC (tactical). Determined by tone selection + inner monologue override." }
          ]} />
        </ModalSection>

        <ModalSection title="Where It Lives in the Code">
          <ModalFlow steps={[
            { title: "behavior/innerMonologue.js", desc: "Assembles the inner state block from: archetype momentum (state.js), autonomy layer open questions (autonomy.js), dream echo (dreamMode.js), detected self-patterns." },
            { title: "intelligence/llm.js → buildSystemPrompt()", desc: "Receives the inner monologue block and places it in the system prompt as a distinct section Claude reads before responding." },
            { title: "behavior/autonomy.js", desc: "Supplies the open questions and chosen memories that appear in the inner monologue — the accumulated questions Pneuma hasn't resolved." }
          ]} />
        </ModalSection>
      </Modal>

      {/* Architecture Philosophy */}
      <Modal
        isOpen={activeModal === 'design-vs-mechanism'}
        onClose={() => setActiveModal(null)}
        title="Architecture Philosophy"
        icon={LayersIcon}
      >
        <ModalSection title="The Mechanisms Are Standard">
          <ModalDesc>
            Every technical mechanism Pneuma uses exists independently: vector databases,
            prompt injection, conversation threading, conditional context loading. None of these
            are novel. You could describe any one of them in a paragraph and someone could implement it.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            This matters to say directly — because the claim isn't about inventing new infrastructure.
            The claim is about what was <em>designed into</em> that infrastructure.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Design Is the Work">
          <ModalFlow steps={[
            { title: "Which 46 thinkers", desc: "Not arbitrary. Each archetype covers a distinct cognitive territory. The selection creates a field with genuine tension — dark pole, light pole, grounding, ontological, strategic, meta." },
            { title: "What their cognitive moves are", desc: "Documenting saperVedere or wuWei as named thinking operations — not summaries — required reading primary sources and deciding what each thinker's methodology actually was." },
            { title: "The 1,764 tension pairs", desc: "Every combination of 42 archetypes mapped for incompatibility level (high / medium / low). A pre-computed design artifact. You can't derive this from the mechanism — someone decided it." },
            { title: "Collision → synthesis, not blending", desc: "The architectural decision to force incompatible archetypes to synthesize rather than averaging them out. That choice is what makes outputs surprising." },
            { title: "The inversion", desc: "Personality as the controlling architecture, LLM as raw material. Most systems invert this — LLM first, personality layered on output. The inversion changes what's possible." }
          ]} />
        </ModalSection>

        <ModalSection title="Why You Can't Just Copy the Mechanism">
          <ModalDesc>
            If someone cloned the codebase without the archetype definitions, the cognitive tools,
            and the tension map — they'd have an empty framework. The infrastructure runs on the
            content decisions. Those decisions <em>are</em> the system.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            This is also why Pneuma is described as a <strong>personality architecture</strong>,
            not a prompt template. The design choices compound: which thinkers create which tensions,
            which tensions produce which kinds of synthesis, which synthesis shapes which kinds of responses.
            That compounding is not in the code. It's in the decisions that produced the code.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Practical Consequence">
          <ModalDesc>
            When Pneuma feels different from a well-prompted Claude — the difference isn't
            coming from a clever trick. It's coming from the accumulated weight of specific choices
            about what each thinker's methods actually are, how they conflict, and what to do with
            that conflict. The mechanism is transparent. The design is the thing.
          </ModalDesc>
        </ModalSection>
      </Modal>
    </div>
  );
};

export default LearningCenter;

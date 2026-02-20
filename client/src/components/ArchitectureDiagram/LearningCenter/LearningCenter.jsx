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
    { id: 'llm-basics', name: 'How LLMs Work', icon: NeuralIcon, color: '#00d4ff' },
    { id: 'rag-explained', name: 'RAG & Vectors', icon: RAGIcon, color: '#74aa9c' },
    { id: 'ai-types', name: 'AI vs AGI vs ASI', icon: BrainIcon, color: '#ff6400' },
    { id: 'all-archetypes', name: '46 Archetypes', icon: GridIcon, color: '#a855f7' },
    { id: 'cognitive-metabolism', name: 'Cognitive Metabolism', icon: BrainIcon, color: '#7c3aed' },
    { id: 'design-vs-mechanism', name: 'Design vs Mechanism', icon: LayersIcon, color: '#0891b2' }
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
          {learningTopics.map(topic => {
            const IconComponent = topic.icon;
            return (
              <div 
                key={topic.id}
                className="category-item"
                onClick={() => setActiveModal(topic.id)}
              >
                <div className="category-dot" style={{ background: topic.color }} />
                <span className="category-name">{topic.name}</span>
              </div>
            );
          })}
        </div>
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
            { title: "Response is shaped", desc: "Claude generates within all of this. The output goes through post-processing before reaching you." },
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
            { title: "llm.js — ARCHETYPE_METHODS", desc: "Key archetypes (Leonardo, Rumi, Lao Tzu, Sun Tzu, Camus...) carry cognitiveMoves: specific named tools drawn from the thinker's actual methodology." },
            { title: "llm.js — getArchetypeMethods()", desc: "When archetypes are selected for a response, their cognitive tools are assembled into text." },
            { title: "llm.js — Prompt Injection", desc: 'The assembled tools are injected under the header "THINKING METHODS — not things to say — they\'re ways to THINK. Apply them. Run the user\'s message through these operations."' },
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

      {/* Design vs Mechanism */}
      <Modal
        isOpen={activeModal === 'design-vs-mechanism'}
        onClose={() => setActiveModal(null)}
        title="Design vs Mechanism"
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

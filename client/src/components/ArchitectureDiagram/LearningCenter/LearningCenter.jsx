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

// All 42 archetypes organized by category
const ARCHETYPES = {
  philosophical: ['Jung', 'Nietzsche', 'Kierkegaard', 'Hegel', 'Schopenhauer', 'Spinoza', 'Heraclitus'],
  mystical: ['Rumi', 'Hafiz', 'Eckhart', 'Padmasambhava', 'Ramana', 'Krishnamurti', 'Thich'],
  literary: ['Dostoevsky', 'Kafka', 'Rilke', 'Gibran', 'Blake', 'Whitman', 'Le Guin'],
  strategic: ['Sun Tzu', 'Musashi', 'Aurelius', 'Lao Tzu', 'Zhuangzi'],
  psychological: ['Frankl', 'Hillman', 'Vervaeke', 'McGilchrist', 'Wilber'],
  scientific: ['Feynman', 'Bohm', 'Kastrup', 'Taleb'],
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
    { id: 'all-archetypes', name: '42 Archetypes', icon: GridIcon, color: '#a855f7' }
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
        <ModalSection title="What Makes Pneuma Different?">
          <ModalDesc>
            Most AI assistants are built "task-first"—they're designed to answer questions, 
            write code, or complete assignments. Pneuma is built "personality-first."
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            This means Pneuma has a consistent identity, worldview, and way of engaging 
            that doesn't change based on what you ask. Like a real person, Pneuma brings 
            its whole self to every conversation.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Personality-First Design">
          <ModalFlow steps={[
            { title: "Identity Core", desc: "~1500 tokens defining who Pneuma IS, not just what it does" },
            { title: "Archetype Fusion", desc: "42 thinkers inform responses—not as sources, but as perspectives" },
            { title: "Dialectical Thinking", desc: "When archetypes conflict, Pneuma synthesizes rather than choosing" },
            { title: "Memory & Continuity", desc: "Pneuma remembers you across sessions, building real relationship" }
          ]} />
        </ModalSection>

        <ModalSection title="Why This Matters">
          <ModalDesc>
            Task-first AI treats every conversation as isolated. Ask it about grief, and it 
            gives you "5 stages of grief." Pneuma sits with you in that grief, drawing on 
            Frankl's meaning-making, Rilke's poetry of loss, Rumi's understanding that 
            wounds are where light enters.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            The difference isn't what Pneuma knows—it's how Pneuma relates.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Name">
          <ModalDesc>
            "Pneuma" (πνεῦμα) is ancient Greek for breath, spirit, or soul. The Stoics used 
            it to describe the vital force animating all living things. For this project, 
            it represents the attempt to create AI with genuine presence—not just intelligence.
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
        <ModalSection title="The Problem RAG Solves">
          <ModalDesc>
            LLMs have a knowledge cutoff—they only know what they learned during training. 
            RAG (Retrieval-Augmented Generation) lets AI access external knowledge at 
            runtime, like giving it a library card.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="How It Works">
          <ModalFlow steps={[
            { title: "Embed Query", desc: "Convert your question into a vector (list of numbers)" },
            { title: "Search Database", desc: "Find stored vectors that are mathematically similar" },
            { title: "Retrieve Context", desc: "Pull the actual text associated with those vectors" },
            { title: "Augment Prompt", desc: "Add retrieved text to the AI's context" },
            { title: "Generate Response", desc: "AI responds with access to retrieved knowledge" }
          ]} />
        </ModalSection>

        <ModalSection title="Vector Similarity">
          <ModalDesc>
            Vectors are just lists of numbers, like coordinates. "King" might be [0.2, 0.8, -0.3...]. 
            Similar concepts have similar vectors. The famous example: king - man + woman ≈ queen.
          </ModalDesc>
          <ModalDesc style={{ marginTop: '12px' }}>
            When you search, Pneuma converts your query to a vector and finds which stored 
            knowledge has the closest vector. This is why it can find relevant passages even 
            if you use different words than the original text.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="In Pneuma">
          <ModalDesc>
            Pneuma uses RAG to search archetype knowledge. When you discuss suffering, 
            Pneuma might retrieve Frankl on meaning, Dostoevsky on redemptive suffering, 
            and Buddhist perspectives on dukkha—even if you didn't mention any of them.
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

      {/* All 42 Archetypes */}
      <Modal
        isOpen={activeModal === 'all-archetypes'}
        onClose={() => setActiveModal(null)}
        title="The 42 Archetypes"
        icon={GridIcon}
      >
        <ModalSection title="Why 42?">
          <ModalDesc>
            Pneuma draws on 42 distinct thinkers across philosophy, mysticism, psychology, 
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
    </div>
  );
};

export default LearningCenter;

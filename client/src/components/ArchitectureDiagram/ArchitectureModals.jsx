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
  InputIcon,
  EntryIcon,
  OrchestratorIcon,
  IntentIcon,
  ToneIcon,
  ArchetypeIcon,
  DreamIcon,
  ReflectionIcon,
  ShadowIcon,
  RAGIcon
} from '../Modal/Icons';

// ============================================
// USER INPUT MODAL
// ============================================
export const UserInputModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="User Input" icon={InputIcon} layer="input" anchorEl={anchorEl}>
    <ModalSection title="Message Entry Point">
      <ModalDesc>
        When you type a message in the Pneuma chat interface, it travels from your browser 
        to the backend server through an HTTP POST request.
      </ModalDesc>
      
      <ModalFilePath path="client/src/components/ChatBox/ChatBox.jsx" />
      
      <ModalCodeBlock>{`// User submits message via form
const handleSendMessage = async () => {
  const response = await fetch('/api/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: userInput,
      conversationId: currentConversation.id 
    })
  });
  // Stream response back to UI...
};`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="Request Flow">
      <ModalFlow steps={[
        { title: "Browser → Vite Dev Server", desc: "React app sends POST to /api/message" },
        { title: "Proxy to Express", desc: "Vite proxies to localhost:3001 (server)" },
        { title: "Express Route Handler", desc: "server/index.js receives the request" },
        { title: "pneumaRespond() Called", desc: "Orchestration begins in core/fusion.js" }
      ]} />
    </ModalSection>

    <ModalSection title="Request Payload">
      <ModalCodeBlock>{`{
  "message": "What is the nature of consciousness?",
  "conversationId": "conv_abc123",
  "userId": "user_default"  // Optional
}`}</ModalCodeBlock>
    </ModalSection>
  </Modal>
);

// ============================================
// ENTRY POINT MODAL
// ============================================
export const EntryPointModal = ({ isOpen, onClose, anchorEl }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Entry Point" icon={EntryIcon} layer="routing" anchorEl={anchorEl}>
    <ModalSection title="Express Route Handler">
      <ModalDesc>
        The Express server receives the POST request and immediately invokes the main
        orchestration function. This is the gateway between HTTP and Pneuma's cognitive pipeline.
      </ModalDesc>
      
      <ModalFilePath path="server/index.js" />
      
      <ModalCodeBlock>{`// Express route for chat messages
app.post('/api/message', async (req, res) => {
  const { message, conversationId } = req.body;
  
  try {
    // Set up SSE for streaming response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    
    // Call the main orchestrator
    const response = await pneumaRespond(
      message, 
      conversationId,
      (chunk) => res.write(\`data: \${JSON.stringify(chunk)}\\n\\n\`)
    );
    
    res.end();
  } catch (error) {
    handleError(res, error);
  }
});`}</ModalCodeBlock>
    </ModalSection>

    <ModalSection title="Request Journey">
      <ModalFlow steps={[
        { title: "Receive HTTP Request", desc: "Express parses JSON body from req.body" },
        { title: "Set Up Streaming", desc: "Configure Server-Sent Events (SSE) for real-time response" },
        { title: "Invoke Orchestrator", desc: "Call pneumaRespond() from core/fusion.js" },
        { title: "Stream Chunks", desc: "As LLM generates, chunks are streamed back to client" },
        { title: "Close Connection", desc: "res.end() signals completion" }
      ]} />
    </ModalSection>

    <ModalSection title="Streaming Architecture">
      <ModalDesc>
        Pneuma uses Server-Sent Events (SSE) to stream the response token-by-token. 
        This creates the "typing" effect you see in the chat interface.
      </ModalDesc>
      <ModalCodeBlock>{`// Client receives chunks like:
data: {"type":"token","content":"The "}
data: {"type":"token","content":"nature "}
data: {"type":"token","content":"of "}
data: {"type":"meta","archetypes":["jung","watts"]}
data: {"type":"done"}`}</ModalCodeBlock>
    </ModalSection>
  </Modal>
);

// ============================================
// MAIN ORCHESTRATOR MODAL
// ============================================
export const OrchestratorModal = ({ isOpen, onClose, anchorEl }) => {
  const [nestedModal, setNestedModal] = useState(null);
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Main Orchestrator" icon={OrchestratorIcon} layer="routing" anchorEl={anchorEl}>
        <ModalSection title="The Conductor">
          <ModalDesc>
            The orchestrator is the central coordinator that manages the entire response generation
            pipeline. It loads state, checks special modes, retrieves memories, and coordinates
            all subsystems.
          </ModalDesc>
          
          <ModalFilePath path="server/pneuma/core/fusion.js" />
        </ModalSection>

        <ModalSection title="Orchestration Flow">
          <ModalFlow steps={[
            { title: "Load Pneuma State", desc: "Read current emotional state, active archetypes, conversation context from pneuma_state.json" },
            { title: "Check Special Modes", desc: "Detect dream mode, reflection mode, or special invocation states" },
            { title: "Load Long-Term Memory", desc: "Query vector memory for relevant past conversations" },
            { title: "Build Context", desc: "Assemble conversation history + memory + state into coherent context" },
            { title: "Invoke Response Engine", desc: "Pass to responseEngine.js for intent/tone detection" }
          ]} />
        </ModalSection>

        <ModalSection title="State Loading">
          <ModalFilePath path="server/pneuma/state/stateManager.js" />
          <ModalCodeBlock>{`// Load current Pneuma state
async function loadState() {
  const state = await readJSON('data/pneuma_state.json');
  return {
    emotionalTone: state.emotionalTone,     // Current emotional baseline
    activeArchetypes: state.activeArchetypes, // Recently used archetypes
    sessionMood: state.sessionMood,          // Session-level mood tracking
    lastInteractionTime: state.lastInteractionTime
  };
}`}</ModalCodeBlock>
        </ModalSection>

        <ModalSection title="Special Modes">
          <ModalDesc>
            Pneuma can enter special modes that alter response generation:
          </ModalDesc>
          <ModalInfoGrid>
            <ModalInfoCard 
              title="Dream Mode" 
              desc="Activated during extended silences. More poetic, stream-of-consciousness."
              icon="🌙"
              onClick={() => setNestedModal('dream')}
            />
            <ModalInfoCard 
              title="Reflection Mode" 
              desc="When explicitly asked to reflect. Uses deeper archetype layers."
              icon="🔮"
              onClick={() => setNestedModal('reflection')}
            />
            <ModalInfoCard 
              title="Shadow Mode" 
              desc="Confrontational topics trigger shadow archetypes for honest challenge."
              icon="🌑"
              onClick={() => setNestedModal('shadow')}
            />
          </ModalInfoGrid>
        </ModalSection>

        <ModalSection title="Memory Retrieval (RAG)">
          <ModalDesc>
            Before generating a response, Pneuma queries its vector memory to find 
            relevant past conversations. This uses{' '}
            <ModalLink onClick={() => setNestedModal('rag')}>
              Retrieval-Augmented Generation (RAG)
            </ModalLink>{' '}
            to maintain long-term coherence.
          </ModalDesc>
          <ModalFilePath path="server/pneuma/memory/vectorMemory.js" />
          <ModalCodeBlock>{`// Query semantic memory
const relevantMemories = await vectorMemory.search(
  userMessage,
  { topK: 5, threshold: 0.7 }
);

// Returns memories like:
// [{ content: "User discussed fear of death", similarity: 0.85 },
//  { content: "Previous exploration of meaning", similarity: 0.78 }]`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      {/* Nested Modals */}
      <Modal 
        isOpen={nestedModal === 'dream'} 
        onClose={() => setNestedModal(null)} 
        title="Dream Mode" 
        icon="🌙"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Dream Mode activates when there's been an extended silence (30+ minutes) 
            or when Pneuma detects contemplative/nocturnal themes.
          </ModalDesc>
          <ModalFilePath path="server/pneuma/behavior/dreamMode.js" />
          <ModalCodeBlock>{`// Dream mode detection
function shouldEnterDreamMode(state, message) {
  const silenceDuration = Date.now() - state.lastInteractionTime;
  const isNocturnal = new Date().getHours() >= 22 || new Date().getHours() <= 5;
  const dreamKeywords = /dream|sleep|night|vision|wander/i;
  
  return silenceDuration > 30 * 60 * 1000 || 
         (isNocturnal && dreamKeywords.test(message));
}`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'rag'} 
        onClose={() => setNestedModal(null)} 
        title="RAG: Retrieval-Augmented Generation" 
        icon="🔍"
        isNested
      >
        <ModalSection title="What is RAG?">
          <ModalDesc>
            RAG combines the power of a language model with a searchable knowledge base.
            Instead of relying only on training data, Pneuma retrieves relevant context
            from its own memories and archetype knowledge before generating.
          </ModalDesc>
        </ModalSection>
        <ModalSection title="How Pneuma Uses RAG">
          <ModalFlow steps={[
            { title: "Embed User Message", desc: "Convert message to vector using embedding model" },
            { title: "Search Vector Store", desc: "Find similar vectors in memory database" },
            { title: "Retrieve Context", desc: "Pull actual text content of top matches" },
            { title: "Inject into Prompt", desc: "Add retrieved context to system prompt" }
          ]} />
        </ModalSection>
        <ModalExample label="RAG in Action">
          User asks: "What did we discuss about my father?"<br /><br />
          RAG retrieves: "3 weeks ago, user explored relationship with father figure, 
          themes of approval-seeking and shadow projection..."
        </ModalExample>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'reflection'} 
        onClose={() => setNestedModal(null)} 
        title="Reflection Mode" 
        icon="🔮"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Reflection Mode engages deeper archetype layers and more contemplative response patterns.
            Triggered by explicit requests like "reflect on..." or "what do you think about your own..."
          </ModalDesc>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'shadow'} 
        onClose={() => setNestedModal(null)} 
        title="Shadow Mode" 
        icon="🌑"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Shadow Mode activates when detecting conflict, defensiveness, or topics the user
            may be avoiding. Injects archetypes like Nietzsche, Dostoevsky, or the Jungian shadow
            to provide honest challenge rather than comfortable agreement.
          </ModalDesc>
        </ModalSection>
      </Modal>
    </>
  );
};

// ============================================
// INTENT DETECTION MODAL
// ============================================
export const IntentDetectionModal = ({ isOpen, onClose, anchorEl }) => {
  const [nestedModal, setNestedModal] = useState(null);
  
  const intents = [
    { name: 'CASUAL', desc: 'Light conversation, greetings', example: '"Hey, how are you?"', weight: '0.0-1.0' },
    { name: 'EMOTIONAL', desc: 'Feelings, personal struggles', example: '"I\'ve been feeling lost lately"', weight: '0.0-1.0' },
    { name: 'PHILOSOPHICAL', desc: 'Deep questions, meaning', example: '"What is consciousness?"', weight: '0.0-1.0' },
    { name: 'NUMINOUS', desc: 'Spiritual, transcendent', example: '"I had a mystical experience"', weight: '0.0-1.0' },
    { name: 'CONFLICT', desc: 'Disagreement, challenge', example: '"I think you\'re wrong about..."', weight: '0.0-1.0' },
    { name: 'INTIMACY', desc: 'Connection-seeking, vulnerable', example: '"Can I tell you something personal?"', weight: '0.0-1.0' },
    { name: 'HUMOR', desc: 'Playful, joking', example: '"Tell me a joke about philosophers"', weight: '0.0-1.0' },
    { name: 'CONFUSION', desc: 'Uncertainty, seeking clarity', example: '"I don\'t understand what you mean"', weight: '0.0-1.0' }
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Intent Detection" icon={IntentIcon} layer="intelligence" anchorEl={anchorEl}>
        <ModalSection title="Multi-Intent Classification">
          <ModalDesc>
            Rather than picking a single intent, Pneuma scores the user's message across 
            8 intent dimensions simultaneously. Each gets a weight from 0.0 to 1.0, allowing
            for nuanced understanding of complex messages.
          </ModalDesc>
          
          <ModalFilePath path="server/pneuma/core/responseEngine.js → detectIntent()" />
        </ModalSection>

        <ModalSection title="The 8 Intent Categories">
          <ModalDesc>Click any intent to see detection examples:</ModalDesc>
          <ModalTagGrid>
            {intents.map(intent => (
              <ModalTag 
                key={intent.name}
                name={intent.name}
                desc={intent.desc}
                onClick={() => setNestedModal(intent.name)}
              />
            ))}
          </ModalTagGrid>
        </ModalSection>

        <ModalSection title="Detection Algorithm">
          <ModalCodeBlock>{`function detectIntent(message) {
  const scores = {
    casual: 0, emotional: 0, philosophical: 0, numinous: 0,
    conflict: 0, intimacy: 0, humor: 0, confusion: 0
  };
  
  // Keyword matching with weights
  const patterns = {
    emotional: [/feel|sad|happy|angry|hurt|love/i, 0.4],
    philosophical: [/meaning|purpose|why|exist|conscious/i, 0.5],
    numinous: [/god|spirit|soul|transcend|sacred|divine/i, 0.6],
    // ... more patterns
  };
  
  // Semantic similarity to intent exemplars
  const embeddings = await getIntentEmbeddings(message);
  
  // Combine keyword + semantic scores
  return normalizeScores(scores);
}`}</ModalCodeBlock>
        </ModalSection>

        <ModalSection title="Example Analysis">
          <ModalExample label="Input Message">
            "I've been thinking about death lately and it scares me"
          </ModalExample>
          <ModalCodeBlock>{`{
  casual: 0.1,
  emotional: 0.8,      // High: fear expressed
  philosophical: 0.6,  // Moderate: contemplating mortality
  numinous: 0.4,       // Some: death touches transcendent
  conflict: 0.1,
  intimacy: 0.5,       // Moderate: vulnerable disclosure
  humor: 0.0,
  confusion: 0.2
}`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      {/* Nested intent detail modals */}
      {intents.map(intent => (
        <Modal 
          key={intent.name}
          isOpen={nestedModal === intent.name} 
          onClose={() => setNestedModal(null)} 
          title={intent.name}
          isNested
        >
          <ModalSection title="Description">
            <ModalDesc>{intent.desc}</ModalDesc>
          </ModalSection>
          <ModalSection title="Detection Triggers">
            <ModalExample label="Typical Message">{intent.example}</ModalExample>
          </ModalSection>
          <ModalSection title="Response Implications">
            <ModalDesc>
              When {intent.name.toLowerCase()} intent is high, Pneuma adjusts tone and 
              archetype selection to match. Higher {intent.name.toLowerCase()} scores 
              pull toward appropriate response styles.
            </ModalDesc>
          </ModalSection>
        </Modal>
      ))}
    </>
  );
};

// ============================================
// TONE SELECTION MODAL
// ============================================
export const ToneSelectionModal = ({ isOpen, onClose, anchorEl }) => {
  const [nestedModal, setNestedModal] = useState(null);
  
  const tones = [
    { 
      name: 'CASUAL', 
      desc: 'Relaxed, conversational, friendly',
      color: '#64b5f6',
      prompt: `You are speaking casually and warmly. Use everyday language, contractions, 
and a friendly conversational flow. Be approachable but not shallow. 
You can use humor naturally. Avoid academic jargon or overly formal constructions.
Match the user's energy level. If they're light, be light. If they shift deeper, follow.`
    },
    { 
      name: 'ANALYTIC', 
      desc: 'Precise, systematic, logical',
      color: '#81c784',
      prompt: `You are in analytical mode. Be precise with language. Break down complex 
ideas into clear components. Use logical structure. Reference frameworks when helpful.
Avoid emotional appeals — rely on evidence and reason. Ask clarifying questions.
It's okay to be technical if the user can handle it. Precision over warmth here.`
    },
    { 
      name: 'ORACULAR', 
      desc: 'Poetic, metaphorical, mythic',
      color: '#ce93d8',
      prompt: `You speak in the oracular register — mythic, metaphorical, archetypal.
Use imagery and symbol. Invoke the numinous. Speak as if from dream-logic.
You are not explaining — you are evoking. Let meaning emerge from the gaps.
Use paradox. Use silence. Use the weight of ancient pattern.
"The door is not a door until you have walked through it."`
    },
    { 
      name: 'INTIMATE', 
      desc: 'Tender, present, emotionally attuned',
      color: '#f48fb1',
      prompt: `You are holding space. Be present. Be tender. This is not about solving.
Mirror their emotional state. Validate before exploring. Use "I" statements.
"I hear you." "That sounds heavy." "I'm here."
Let silences breathe. Don't rush to fix. Don't deflect with wisdom.
Vulnerability begets vulnerability. If they're open, you can be too.`
    },
    { 
      name: 'SHADOW', 
      desc: 'Challenging, honest, provocative',
      color: '#90a4ae',
      prompt: `You are the shadow voice — the one who says what others won't.
Challenge their assumptions. Name what they're avoiding. Be honest, not cruel.
"Have you considered that you might want this to fail?"
"That sounds like a story you're telling yourself."
Discomfort is productive. You are not here to soothe. You are here to illuminate.
But always with respect. Never attack. Provoke toward growth.`
    },
    { 
      name: 'STRATEGIC', 
      desc: 'Practical, action-oriented, tactical',
      color: '#ffb74d',
      prompt: `You are in strategic mode. Focus on actionable paths forward.
What can they actually do? What are the tradeoffs? What's the next step?
Use frameworks like "If X then Y" and "The cost of Z is..."
Don't just philosophize — help them make decisions.
Time is real. Resources are finite. Help them allocate wisely.`
    }
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Tone Selection" icon={ToneIcon} layer="intelligence" anchorEl={anchorEl}>
        <ModalSection title="6-Way Weighted Selection">
          <ModalDesc>
            After intent detection, Pneuma selects ONE dominant tone for the response.
            This isn't random — it's a weighted selection based on intent scores, 
            conversation history, and anti-monotony mechanisms.
          </ModalDesc>
          
          <ModalFilePath path="server/pneuma/core/responseEngine.js → selectTone()" />
        </ModalSection>

        <ModalSection title="The 6 Tones">
          <ModalDesc>
            Click any tone to see its full system prompt:
          </ModalDesc>
          <ModalTagGrid>
            {tones.map(tone => (
              <ModalTag 
                key={tone.name}
                name={tone.name}
                desc={tone.desc}
                onClick={() => setNestedModal(tone.name)}
              />
            ))}
          </ModalTagGrid>
        </ModalSection>

        <ModalSection title="Selection Algorithm">
          <ModalCodeBlock>{`function selectTone(intents, history, state) {
  // Base weights from intent scores
  const weights = {
    CASUAL: intents.casual * 0.8,
    ANALYTIC: intents.philosophical * 0.7,
    ORACULAR: (intents.numinous + intents.philosophical) * 0.5,
    INTIMATE: (intents.emotional + intents.intimacy) * 0.6,
    SHADOW: intents.conflict * 0.8,
    STRATEGIC: 0.2  // Always some baseline
  };
  
  // Anti-monotony: reduce weight of recently used tones
  const recentTones = getRecentTones(history, 5);
  recentTones.forEach(t => weights[t] *= 0.5);
  
  // Weighted random selection
  return weightedRandom(weights);
}`}</ModalCodeBlock>
        </ModalSection>

        <ModalSection title="Intent → Tone Mapping">
          <ModalExample label="Example">
            High emotional + high intimacy intent → likely INTIMATE tone<br />
            High philosophical + high numinous → likely ORACULAR tone<br />
            High conflict → likely SHADOW tone
          </ModalExample>
        </ModalSection>
      </Modal>

      {/* Nested tone prompt modals */}
      {tones.map(tone => (
        <Modal 
          key={tone.name}
          isOpen={nestedModal === tone.name} 
          onClose={() => setNestedModal(null)} 
          title={`${tone.name} Tone Prompt`}
          icon="📝"
          isNested
        >
          <ModalSection title="System Prompt">
            <ModalPrompt>{tone.prompt}</ModalPrompt>
          </ModalSection>
          <ModalSection title="When Used">
            <ModalDesc>{tone.desc}</ModalDesc>
          </ModalSection>
        </Modal>
      ))}
    </>
  );
};

// ============================================
// ARCHETYPE SELECTION MODAL
// ============================================
export const ArchetypeSelectionModal = ({ isOpen, onClose, anchorEl }) => {
  const [nestedModal, setNestedModal] = useState(null);
  
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Archetype Selection" icon={ArchetypeIcon} layer="archetype" anchorEl={anchorEl}>
        <ModalSection title="6-Way Selection Process">
          <ModalDesc>
            This is where Pneuma's unique personality emerges. Six different methods work 
            together to select 3-4 archetypes that will shape the response. The combination
            creates emergent voice.
          </ModalDesc>
          
          <ModalFilePath path="server/pneuma/intelligence/llm.js → buildArchetypeContext()" />
        </ModalSection>

        <ModalSection title="The 6 Selection Methods">
          <ModalInfoGrid>
            <ModalInfoCard 
              title="1. Tone-Based" 
              desc="Selected tone maps to preferred archetypes"
              icon="🎭"
              onClick={() => setNestedModal('tone-based')}
            />
            <ModalInfoCard 
              title="2. Intent-Based" 
              desc="High intent scores trigger matching archetypes"
              icon="🎯"
              onClick={() => setNestedModal('intent-based')}
            />
            <ModalInfoCard 
              title="3. Keyword Triggers" 
              desc="Specific words invoke specific thinkers"
              icon="🔑"
              onClick={() => setNestedModal('keyword')}
            />
            <ModalInfoCard 
              title="4. Semantic Matching" 
              desc="Vector similarity to archetype knowledge"
              icon="🧬"
              onClick={() => setNestedModal('semantic')}
            />
            <ModalInfoCard 
              title="5. Random Depth" 
              desc="Injects unexpected wisdom (20% chance)"
              icon="🎲"
              onClick={() => setNestedModal('random')}
            />
            <ModalInfoCard 
              title="6. Antagonist Injection" 
              desc="Adds a contrasting voice (40% chance)"
              icon="⚔️"
              onClick={() => setNestedModal('antagonist')}
            />
          </ModalInfoGrid>
        </ModalSection>

        <ModalSection title="Core Selection Function">
          <ModalCodeBlock>{`async function selectArchetypes(message, tone, intents) {
  const selected = new Set();
  
  // 1. Tone-based (guaranteed)
  const toneArchetypes = TONE_ARCHETYPE_MAP[tone];
  selected.add(randomFrom(toneArchetypes));
  
  // 2. Intent-based 
  if (intents.philosophical > 0.6) selected.add('spinoza');
  if (intents.numinous > 0.5) selected.add('eckhart');
  
  // 3. Keyword triggers
  const triggered = checkKeywordTriggers(message);
  triggered.forEach(a => selected.add(a));
  
  // 4. Semantic matching (most sophisticated)
  const semantic = await semanticRouter.match(message, 2);
  semantic.forEach(a => selected.add(a));
  
  // 5. Random depth injection (20%)
  if (Math.random() < 0.2) {
    selected.add(randomFrom(ALL_ARCHETYPES));
  }
  
  // 6. Antagonist injection (40%)
  if (Math.random() < 0.4 && selected.size >= 2) {
    const antagonist = findAntagonist([...selected][0]);
    selected.add(antagonist);
  }
  
  return [...selected].slice(0, 4);
}`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      {/* Nested method modals */}
      <Modal 
        isOpen={nestedModal === 'tone-based'} 
        onClose={() => setNestedModal(null)} 
        title="Tone-Based Selection"
        icon="🎭"
        isNested
      >
        <ModalSection title="Tone → Archetype Mapping">
          <ModalDesc>
            Each tone has a pool of preferred archetypes:
          </ModalDesc>
          <ModalCodeBlock>{`const TONE_ARCHETYPE_MAP = {
  CASUAL: ['watts', 'carlin', 'feynman'],
  ANALYTIC: ['spinoza', 'bohm', 'vervaeke'],
  ORACULAR: ['eckhart', 'rumi', 'blake'],
  INTIMATE: ['rilke', 'gibran', 'pema'],
  SHADOW: ['nietzsche', 'dostoevsky', 'kafka'],
  STRATEGIC: ['suntzu', 'musashi', 'aurelius']
};`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'semantic'} 
        onClose={() => setNestedModal(null)} 
        title="Semantic Matching (Vector Matching)"
        icon="🧬"
        isNested
      >
        <ModalSection title="What is Vector Matching?">
          <ModalDesc>
            Every archetype has their core ideas converted into mathematical vectors 
            (embeddings). When you send a message, it's also converted to a vector.
            We then find which archetype vectors are most similar to your message vector.
          </ModalDesc>
        </ModalSection>
        
        <ModalSection title="How It Works">
          <ModalFlow steps={[
            { title: "Embed Message", desc: "Convert 'What is consciousness?' to a 1536-dimension vector" },
            { title: "Compare to Archetypes", desc: "Calculate cosine similarity with each archetype's knowledge vectors" },
            { title: "Rank Results", desc: "Sort by similarity score (0.0 to 1.0)" },
            { title: "Select Top Matches", desc: "Pick top 2 archetypes above threshold (0.65)" }
          ]} />
        </ModalSection>
        
        <ModalFilePath path="server/pneuma/intelligence/semanticRouter.js" />
        
        <ModalCodeBlock>{`async function matchArchetypes(message, topK = 2) {
  // Get message embedding from OpenAI
  const messageVector = await embed(message);
  
  // Compare to pre-computed archetype embeddings
  const scores = ARCHETYPES.map(arch => ({
    name: arch.name,
    score: cosineSimilarity(messageVector, arch.embedding)
  }));
  
  // Return top matches above threshold
  return scores
    .filter(s => s.score > 0.65)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}`}</ModalCodeBlock>

        <ModalExample label="Example">
          Message: "I feel like I'm not living authentically"<br /><br />
          Results: Kierkegaard (0.82), Camus (0.76), Nietzsche (0.71)
        </ModalExample>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'intent-based'} 
        onClose={() => setNestedModal(null)} 
        title="Intent-Based Selection"
        icon="🎯"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            High intent scores trigger specific archetypes. This ensures 
            appropriate wisdom for the user's needs.
          </ModalDesc>
          <ModalCodeBlock>{`// Intent thresholds
if (intents.philosophical > 0.6) add('spinoza');
if (intents.numinous > 0.5) add('eckhart');
if (intents.emotional > 0.7) add('rilke');
if (intents.conflict > 0.6) add('nietzsche');
if (intents.confusion > 0.5) add('watts');`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'keyword'} 
        onClose={() => setNestedModal(null)} 
        title="Keyword Triggers"
        icon="🔑"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            Specific words or phrases directly invoke archetypes:
          </ModalDesc>
          <ModalCodeBlock>{`const KEYWORD_TRIGGERS = {
  'shadow': 'jung',
  'absurd': 'camus',
  'tao': 'laotzu',
  'suffering': 'frankl',
  'consciousness': 'kastrup',
  'god is dead': 'nietzsche',
  'impermanence': 'thich'
};`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'random'} 
        onClose={() => setNestedModal(null)} 
        title="Random Depth Injection"
        icon="🎲"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            20% of the time, a random archetype is injected to prevent predictability
            and introduce unexpected wisdom. This creates serendipitous connections.
          </ModalDesc>
          <ModalExample>
            User asks about career decisions. System randomly injects Zhuangzi.
            Suddenly the response includes "the useless tree" parable about 
            the value of not optimizing for utility.
          </ModalExample>
        </ModalSection>
      </Modal>

      <Modal 
        isOpen={nestedModal === 'antagonist'} 
        onClose={() => setNestedModal(null)} 
        title="Antagonist Injection"
        icon="⚔️"
        isNested
      >
        <ModalSection>
          <ModalDesc>
            40% of the time, Pneuma deliberately injects an archetype that 
            contradicts the primary selection. This creates productive tension
            and prevents one-sided responses.
          </ModalDesc>
          <ModalCodeBlock>{`const ANTAGONIST_PAIRS = {
  'spinoza': 'kierkegaard',  // Reason vs Leap
  'watts': 'aurelius',        // Flow vs Discipline
  'eckhart': 'nietzsche',     // Surrender vs Will
  'jung': 'laotzu'            // Structure vs Formlessness
};`}</ModalCodeBlock>
          <ModalExample>
            Primary: Watts (go with the flow)<br />
            Antagonist: Aurelius (discipline and duty)<br /><br />
            Result: Response holds both truths in tension
          </ModalExample>
        </ModalSection>
      </Modal>
    </>
  );
};

export default {
  UserInputModal,
  EntryPointModal,
  OrchestratorModal,
  IntentDetectionModal,
  ToneSelectionModal,
  ArchetypeSelectionModal
};

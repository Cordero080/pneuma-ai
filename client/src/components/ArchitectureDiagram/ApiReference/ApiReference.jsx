import React, { useState } from 'react';
import Modal, {
  ModalSection,
  ModalFilePath,
  ModalCodeBlock,
  ModalFlow,
  ModalDesc,
  ModalExample,
  ModalInfoGrid,
  ModalInfoCard
} from '../../Modal/Modal';
import {
  ClaudeIcon,
  RAGIcon,
  EntryIcon,
  TensionIcon,
  FileIcon,
  DepthIcon,
  SynthesisIcon,
  PipelineIcon
} from '../../Modal/Icons';
import './ApiReference.css';

const ApiReference = () => {
  const [activeModal, setActiveModal] = useState(null);

  const apis = [
    {
      id: 'anthropic',
      name: 'Anthropic Claude API',
      icon: ClaudeIcon,
      desc: 'Core LLM for response generation',
      color: '#c4a962'
    },
    {
      id: 'openai-embed',
      name: 'OpenAI Embeddings API',
      icon: RAGIcon,
      desc: 'Vector embeddings for semantic search',
      color: '#74aa9c'
    },
    {
      id: 'express',
      name: 'Express.js Server',
      icon: EntryIcon,
      desc: 'HTTP server and routing',
      color: '#68a063'
    },
    {
      id: 'vite',
      name: 'Vite + React',
      icon: TensionIcon,
      desc: 'Frontend build and UI',
      color: '#646cff'
    }
  ];

  const categories = [
    {
      id: 'cat-routing',
      name: 'Routing Layer',
      color: '#0096ff',
      files: ['index.js', 'core/fusion.js']
    },
    {
      id: 'cat-intelligence',
      name: 'Intelligence Layer', 
      color: '#00ff96',
      files: ['core/responseEngine.js', 'intelligence/llm.js']
    },
    {
      id: 'cat-archetype',
      name: 'Archetype Layer',
      color: '#b400ff',
      files: ['archetypes/archetypeDepth.js', 'intelligence/semanticRouter.js']
    },
    {
      id: 'cat-synthesis',
      name: 'Synthesis Layer',
      color: '#ff6400',
      files: ['intelligence/synthesisEngine.js']
    },
    {
      id: 'cat-memory',
      name: 'Memory Systems',
      color: '#ff9600',
      files: ['memory/vectorMemory.js', 'memory/longTermMemory.js']
    },
    {
      id: 'cat-output',
      name: 'Output Layer',
      color: '#ff3264',
      files: ['core/responseEngine.js', 'core/fusion.js']
    }
  ];

  return (
    <div className="api-reference">
      {/* APIs Section */}
      <div className="api-section">
        <h3 className="api-section-title"><span className="section-icon"><PipelineIcon /></span> APIs Used</h3>
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

      {/* Categories Section */}
      <div className="api-section">
        <h3 className="api-section-title"><span className="section-icon"><DepthIcon /></span> Layer Details</h3>
        <div className="category-list">
          {categories.map(cat => (
            <div 
              key={cat.id}
              className="category-item"
              onClick={() => setActiveModal(cat.id)}
            >
              <div 
                className="category-dot"
                style={{ background: cat.color }}
              />
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="api-section">
        <h3 className="api-section-title"><span className="section-icon"><FileIcon /></span> Quick Reference</h3>
        <div className="quick-links">
          <div className="quick-link" onClick={() => setActiveModal('data-flow')}>
            Data Flow Overview
          </div>
          <div className="quick-link" onClick={() => setActiveModal('file-structure')}>
            File Structure
          </div>
          <div className="quick-link" onClick={() => setActiveModal('token-budget')}>
            Token Budget
          </div>
        </div>
      </div>

      {/* API Modals */}
      <Modal
        isOpen={activeModal === 'anthropic'}
        onClose={() => setActiveModal(null)}
        title="Anthropic Claude API"
        icon={ClaudeIcon}
      >
        <ModalSection title="Overview">
          <ModalDesc>
            Pneuma uses Anthropic's Claude claude-sonnet-4-20250514 as its core language model. This is the 
            "brain" that generates responses after receiving the fully assembled system prompt.
          </ModalDesc>
        </ModalSection>
        
        <ModalSection title="Location">
          <ModalFilePath path="server/pneuma/intelligence/llm.js" />
        </ModalSection>

        <ModalSection title="Configuration">
          <ModalCodeBlock>{`import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Usage
const response = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1200,
  temperature: 0.85,
  system: systemPrompt,
  messages: conversationHistory,
  stream: true
});`}</ModalCodeBlock>
        </ModalSection>

        <ModalSection title="Key Parameters">
          <ModalFlow steps={[
            { title: "model", desc: "claude-sonnet-4-20250514 - Balanced speed and quality" },
            { title: "max_tokens", desc: "1200 - Typical response length limit" },
            { title: "temperature", desc: "0.85 - High for creative responses" },
            { title: "stream", desc: "true - Enables token-by-token streaming" }
          ]} />
        </ModalSection>

        <ModalSection title="Cost">
          <ModalDesc>
            ~$0.003 per input token, ~$0.015 per output token. Average conversation
            turn costs roughly $0.01-0.03.
          </ModalDesc>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'openai-embed'}
        onClose={() => setActiveModal(null)}
        title="OpenAI Embeddings API"
        icon={RAGIcon}
      >
        <ModalSection title="Overview">
          <ModalDesc>
            Used for converting text into vector embeddings. These vectors enable 
            semantic search across memories and archetype knowledge.
          </ModalDesc>
        </ModalSection>
        
        <ModalSection title="Location">
          <ModalFilePath path="server/pneuma/intelligence/semanticRouter.js" />
          <ModalFilePath path="server/pneuma/memory/vectorMemory.js" />
        </ModalSection>

        <ModalSection title="Usage">
          <ModalCodeBlock>{`import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function embed(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });
  return response.data[0].embedding; // 1536-dim vector
}`}</ModalCodeBlock>
        </ModalSection>

        <ModalSection title="Use Cases">
          <ModalFlow steps={[
            { title: "Memory Search", desc: "Find relevant past conversations by semantic similarity" },
            { title: "Archetype Matching", desc: "Route messages to appropriate archetypes" },
            { title: "RAG Retrieval", desc: "Find relevant archetype knowledge passages" }
          ]} />
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'express'}
        onClose={() => setActiveModal(null)}
        title="Express.js Server"
        icon={EntryIcon}
      >
        <ModalSection title="Overview">
          <ModalDesc>
            Express handles HTTP routing and serves as the backend API server.
            It receives requests from the React frontend and orchestrates the response pipeline.
          </ModalDesc>
        </ModalSection>
        
        <ModalSection title="Location">
          <ModalFilePath path="server/index.js" />
        </ModalSection>

        <ModalSection title="Key Routes">
          <ModalCodeBlock>{`// Main chat endpoint
app.post('/api/message', async (req, res) => {
  // Streaming response via SSE
});

// Conversation management
app.get('/api/conversations', ...);
app.post('/api/conversations', ...);
app.delete('/api/conversations/:id', ...);

// System info
app.get('/api/archetypes', ...);
app.get('/api/state', ...);`}</ModalCodeBlock>
        </ModalSection>

        <ModalSection title="Server-Sent Events">
          <ModalDesc>
            The /api/message endpoint uses SSE to stream Claude's response 
            token-by-token to the frontend, creating the "typing" effect.
          </ModalDesc>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'vite'}
        onClose={() => setActiveModal(null)}
        title="Vite + React"
        icon={TensionIcon}
      >
        <ModalSection title="Overview">
          <ModalDesc>
            The frontend is built with React and bundled using Vite for fast 
            development and hot module replacement.
          </ModalDesc>
        </ModalSection>
        
        <ModalSection title="Location">
          <ModalFilePath path="client/src/" />
        </ModalSection>

        <ModalSection title="Key Components">
          <ModalFlow steps={[
            { title: "App.jsx", desc: "Main app container and routing" },
            { title: "ChatBox/", desc: "Chat interface and message handling" },
            { title: "Sidebar/", desc: "Navigation and conversation list" },
            { title: "ArchitectureDiagram/", desc: "This architecture view!" }
          ]} />
        </ModalSection>

        <ModalSection title="Proxy Configuration">
          <ModalCodeBlock>{`// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
});`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      {/* Category Modals */}
      <Modal
        isOpen={activeModal === 'cat-routing'}
        onClose={() => setActiveModal(null)}
        title="Routing Layer"
        layer="routing"
      >
        <ModalSection title="Purpose">
          <ModalDesc>
            Handles incoming requests and orchestrates the overall flow. The conductor
            that coordinates all other layers.
          </ModalDesc>
        </ModalSection>
        <ModalSection title="Key Files">
          <ModalFilePath path="server/index.js" />
          <ModalFilePath path="server/pneuma/core/fusion.js" />
        </ModalSection>
        <ModalSection title="Responsibilities">
          <ModalFlow steps={[
            { title: "Receive Request", desc: "Parse incoming message from frontend" },
            { title: "Load State", desc: "Retrieve current Pneuma state and context" },
            { title: "Invoke Pipeline", desc: "Call into intelligence and archetype layers" },
            { title: "Return Response", desc: "Stream response back to client" }
          ]} />
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'cat-intelligence'}
        onClose={() => setActiveModal(null)}
        title="Intelligence Layer"
        layer="intelligence"
      >
        <ModalSection title="Purpose">
          <ModalDesc>
            The analytical engine that understands user intent, selects appropriate tones,
            and interfaces with Claude for response generation.
          </ModalDesc>
        </ModalSection>
        <ModalSection title="Key Files">
          <ModalFilePath path="server/pneuma/core/responseEngine.js" />
          <ModalFilePath path="server/pneuma/intelligence/llm.js" />
        </ModalSection>
        <ModalSection title="Responsibilities">
          <ModalFlow steps={[
            { title: "Intent Detection", desc: "Score message across 8 intent dimensions" },
            { title: "Tone Selection", desc: "Choose from 6 tones based on intent weights" },
            { title: "LLM Interface", desc: "Build prompts and call Claude API" },
            { title: "Post-Processing", desc: "Refine responses through 4-layer pipeline" }
          ]} />
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'cat-archetype'}
        onClose={() => setActiveModal(null)}
        title="Archetype Layer"
        layer="archetype"
      >
        <ModalSection title="Purpose">
          <ModalDesc>
            Manages the 42 archetypes—selecting which perspectives to invoke, extracting 
            their 5-layer depth, and detecting productive tensions between them.
          </ModalDesc>
        </ModalSection>
        <ModalSection title="Key Files">
          <ModalFilePath path="server/pneuma/archetypes/archetypeDepth.js" />
          <ModalFilePath path="server/pneuma/intelligence/semanticRouter.js" />
        </ModalSection>
        <ModalSection title="Responsibilities">
          <ModalFlow steps={[
            { title: "Archetype Selection", desc: "6 methods choose 3-4 archetypes per response" },
            { title: "Depth Extraction", desc: "Pull 5 layers of insight per archetype" },
            { title: "Collision Detection", desc: "Identify productive philosophical tensions" },
            { title: "RAG Retrieval", desc: "Fetch relevant passages from archetype knowledge" }
          ]} />
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'cat-synthesis'}
        onClose={() => setActiveModal(null)}
        title="Synthesis Layer"
        layer="synthesis"
      >
        <ModalSection title="Purpose">
          <ModalDesc>
            When archetypes conflict (Nietzsche's will vs Lao Tzu's wu wei), this layer 
            doesn't pick a winner—it synthesizes them into emergent insight.
          </ModalDesc>
        </ModalSection>
        <ModalSection title="Key Files">
          <ModalFilePath path="server/pneuma/intelligence/synthesisEngine.js" />
        </ModalSection>
        <ModalSection title="Responsibilities">
          <ModalFlow steps={[
            { title: "Tension Mapping", desc: "Identify where archetypes genuinely conflict" },
            { title: "Dialectical Framing", desc: "Present thesis and antithesis clearly" },
            { title: "Synthesis Directive", desc: "Inject instructions to transcend the opposition" },
            { title: "Liminal Architecture", desc: "The meta-archetype that weaves coherence" }
          ]} />
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'cat-memory'}
        onClose={() => setActiveModal(null)}
        title="Memory Systems"
        layer="memory"
      >
        <ModalSection title="Purpose">
          <ModalDesc>
            Pneuma remembers. Vector memory enables semantic search across conversations.
            Long-term memory persists insights across sessions. This is what makes 
            Pneuma feel like a continuous relationship, not isolated transactions.
          </ModalDesc>
        </ModalSection>
        <ModalSection title="Key Files">
          <ModalFilePath path="server/pneuma/memory/vectorMemory.js" />
          <ModalFilePath path="server/pneuma/memory/longTermMemory.js" />
        </ModalSection>
        <ModalSection title="Responsibilities">
          <ModalFlow steps={[
            { title: "Embedding", desc: "Convert text to vectors for semantic search" },
            { title: "Similarity Search", desc: "Find relevant past conversations" },
            { title: "Context Injection", desc: "Add memories to conversation context" },
            { title: "Persistence", desc: "Store important insights across sessions" }
          ]} />
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'cat-output'}
        onClose={() => setActiveModal(null)}
        title="Output Layer"
        layer="output"
      >
        <ModalSection title="Purpose">
          <ModalDesc>
            The final stage—assembling everything into coherent response, streaming it 
            to the user, and persisting state changes.
          </ModalDesc>
        </ModalSection>
        <ModalSection title="Key Files">
          <ModalFilePath path="server/pneuma/core/responseEngine.js" />
          <ModalFilePath path="server/pneuma/core/fusion.js" />
        </ModalSection>
        <ModalSection title="Responsibilities">
          <ModalFlow steps={[
            { title: "Final Assembly", desc: "Combine identity + archetypes + synthesis + context" },
            { title: "Stream Response", desc: "Token-by-token delivery via SSE" },
            { title: "State Update", desc: "Persist momentum, mood, conversation history" },
            { title: "Memory Storage", desc: "Embed and store significant exchanges" }
          ]} />
        </ModalSection>
      </Modal>

      {/* Quick Reference Modals */}
      <Modal
        isOpen={activeModal === 'data-flow'}
        onClose={() => setActiveModal(null)}
        title="Data Flow Overview"
        icon={SynthesisIcon}
      >
        <ModalSection>
          <ModalFlow steps={[
            { title: "User Input", desc: "React → POST /api/message → Express" },
            { title: "Orchestration", desc: "fusion.js loads state, checks modes" },
            { title: "Intent Detection", desc: "responseEngine.js scores 8 intents" },
            { title: "Tone Selection", desc: "Weighted selection from 6 tones" },
            { title: "Archetype Selection", desc: "6 methods pick 3-4 archetypes" },
            { title: "Collision Check", desc: "Detect productive tensions" },
            { title: "Depth Extraction", desc: "Pull 5 layers per archetype" },
            { title: "Synthesis", desc: "If collision, inject synthesis directive" },
            { title: "Prompt Assembly", desc: "Combine all into system prompt" },
            { title: "Claude API", desc: "Generate response with streaming" },
            { title: "Post-Process", desc: "4-layer refinement pipeline" },
            { title: "Persist", desc: "Update state, store memory" }
          ]} />
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'file-structure'}
        onClose={() => setActiveModal(null)}
        title="File Structure"
        icon={FileIcon}
      >
        <ModalSection>
          <ModalCodeBlock>{`server/pneuma/
├── core/
│   ├── fusion.js         # Main orchestrator
│   └── responseEngine.js  # Intent, tone, post-process
├── intelligence/
│   ├── llm.js            # Claude API integration
│   ├── semanticRouter.js  # Vector-based routing
│   └── synthesisEngine.js # Collision synthesis
├── archetypes/
│   └── archetypeDepth.js  # 5-layer depth data
├── memory/
│   ├── vectorMemory.js    # Semantic memory
│   └── longTermMemory.js  # Cross-session memory
├── state/
│   └── stateManager.js    # State persistence
├── personality/
│   └── pneumaIdentity.js  # Core identity prompt
└── config/
    └── archetypes.js      # Archetype definitions`}</ModalCodeBlock>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === 'token-budget'}
        onClose={() => setActiveModal(null)}
        title="Token Budget"
        icon={DepthIcon}
      >
        <ModalSection title="Claude Context Window">
          <ModalDesc>
            Claude claude-sonnet-4-20250514 has a 200K token context window, but Pneuma aims 
            to keep prompts under 6K for cost and speed.
          </ModalDesc>
        </ModalSection>
        <ModalSection title="Budget Allocation">
          <ModalCodeBlock>{`Identity Core:     ~1500 tokens (fixed)
Archetypes:        ~800 tokens (200 per archetype)
Synthesis:         ~300 tokens (if collision)
Tone Prompt:       ~200 tokens
RAG Context:       ~500 tokens
History:          ~1000 tokens (truncated)
─────────────────────────────────
System Total:     ~4300 tokens
Response Budget:  ~1200 tokens
═══════════════════════════════════
Max Total:        ~5500 tokens per turn`}</ModalCodeBlock>
        </ModalSection>
      </Modal>
    </div>
  );
};

export default ApiReference;

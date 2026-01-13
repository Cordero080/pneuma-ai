import { useState, useRef, useCallback } from 'react';
import './ArchitectureDiagram.css';

// Import modal components
import {
  UserInputModal,
  EntryPointModal,
  OrchestratorModal,
  IntentDetectionModal,
  ToneSelectionModal,
  ArchetypeSelectionModal
} from './ArchitectureModals';

import {
  TensionMapModal,
  DepthExtractionModal,
  SynthesisModal,
  SystemPromptModal,
  ClaudeApiModal,
  ResponsePipelineModal,
  FinalAssemblyModal,
  OutputModal
} from './ArchitectureModals2';

// Import SVG icons
import { BrainIcon, EyeIcon } from '../Modal/Icons';

/**
 * ArchitectureDiagram Component
 * 
 * Displays the Pneuma cognitive pipeline as an interactive diagram.
 * Each node is clickable and opens a detailed modal with information.
 * Multiple modals can be open simultaneously as popovers.
 * 
 * Props:
 *   onBack - callback function to return to the chat view
 */
function ArchitectureDiagram({ onBack }) {
  // Track multiple open modals with their anchor elements
  const [openModals, setOpenModals] = useState({});
  const nodeRefs = useRef({});
  
  // Handle node clicks - toggle modal open/closed
  const handleNodeClick = useCallback((nodeId, nodeTitle, event) => {
    event.stopPropagation();
    console.log(`[Architecture] Toggle modal: ${nodeId} - ${nodeTitle}`);
    
    setOpenModals(prev => {
      if (prev[nodeId]) {
        // Close this modal
        const { [nodeId]: removed, ...rest } = prev;
        return rest;
      } else {
        // Open this modal with the anchor element
        return {
          ...prev,
          [nodeId]: event.currentTarget
        };
      }
    });
  }, []);
  
  // Close a specific modal
  const closeModal = useCallback((nodeId) => {
    setOpenModals(prev => {
      const { [nodeId]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  return (
    <div className="architecture-container">
      <div className="architecture-inner">
        <h1 className="architecture-title">PNEUMA ARCHITECTURE</h1>
        <p className="architecture-subtitle">
          Cognitive Pipeline: User Input → Dialectical Collision → Response
        </p>

        <div className="architecture-flow">
          
          {/* USER INPUT */}
          <div 
            className="arch-node input"
            data-layer="Input"
            onClick={(e) => handleNodeClick('input', 'User Input', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">↓</span>
              USER INPUT
            </div>
            <div className="arch-node-desc">Message arrives from the user</div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(255,255,255,0.3)', '--to-color': 'rgba(0,150,255,0.4)' }} 
          />

          {/* STEP 1: ENTRY */}
          <div 
            className="arch-node routing"
            data-layer="Routing"
            onClick={(e) => handleNodeClick('step1', 'Entry Point', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">1</span>
              ENTRY POINT
            </div>
            <div className="arch-node-file">index.js</div>
            <div className="arch-node-desc">
              Express route receives POST /message, calls pneumaRespond()
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(0,150,255,0.4)', '--to-color': 'rgba(0,150,255,0.4)' }} 
          />

          {/* STEP 2: ORCHESTRATOR */}
          <div 
            className="arch-node routing"
            data-layer="Routing"
            onClick={(e) => handleNodeClick('step2', 'Main Orchestrator', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">2</span>
              MAIN ORCHESTRATOR
            </div>
            <div className="arch-node-file">core/fusion.js</div>
            <div className="arch-node-desc">
              The conductor — coordinates all layers. Loads state, checks special modes, loads long-term memory.
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(0,150,255,0.4)', '--to-color': 'rgba(0,255,150,0.4)' }} 
          />

          {/* STEP 3: INTENT */}
          <div 
            className="arch-node intelligence"
            data-layer="Intelligence"
            onClick={(e) => handleNodeClick('step3', 'Intent Detection', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">3</span>
              INTENT DETECTION
            </div>
            <div className="arch-node-file">core/responseEngine.js → detectIntent()</div>
            <div className="arch-node-desc">
              Classifies the user's message into 8 intent categories with weighted scores (0.0–1.0)
            </div>
            <div className="arch-node-tags">
              <span className="arch-tag">casual</span>
              <span className="arch-tag">emotional</span>
              <span className="arch-tag">philosophical</span>
              <span className="arch-tag">numinous</span>
              <span className="arch-tag">conflict</span>
              <span className="arch-tag">intimacy</span>
              <span className="arch-tag">humor</span>
              <span className="arch-tag">confusion</span>
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(0,255,150,0.4)', '--to-color': 'rgba(0,255,150,0.4)' }} 
          />

          {/* STEP 4: TONE */}
          <div 
            className="arch-node intelligence"
            data-layer="Intelligence"
            onClick={(e) => handleNodeClick('step4', 'Tone Selection', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">4</span>
              TONE SELECTION (6-WAY)
            </div>
            <div className="arch-node-file">core/responseEngine.js → selectTone()</div>
            <div className="arch-node-desc">
              Weighted selection based on intent + state + anti-monotony. Picks ONE tone for the response.
            </div>
            <div className="arch-node-tags">
              <span className="arch-tag">CASUAL</span>
              <span className="arch-tag">ANALYTIC</span>
              <span className="arch-tag">ORACULAR</span>
              <span className="arch-tag">INTIMATE</span>
              <span className="arch-tag">SHADOW</span>
              <span className="arch-tag">STRATEGIC</span>
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(0,255,150,0.4)', '--to-color': 'rgba(180,0,255,0.4)' }} 
          />

          {/* STEP 5: ARCHETYPE SELECTION */}
          <div 
            className="arch-node archetype"
            data-layer="Archetype"
            onClick={(e) => handleNodeClick('step5', 'Archetype Selection', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">5</span>
              ARCHETYPE SELECTION (6-WAY)
            </div>
            <div className="arch-node-file">intelligence/llm.js → buildArchetypeContext()</div>
            <div className="arch-node-desc">Six selection methods pick 3–4 archetypes:</div>
            <div className="arch-node-tags">
              <span className="arch-tag">1. Tone-based</span>
              <span className="arch-tag">2. Intent-based</span>
              <span className="arch-tag">3. Keyword triggers</span>
              <span className="arch-tag">4. Semantic matching</span>
              <span className="arch-tag">5. Random depth injection</span>
              <span className="arch-tag">6. Antagonist injection (40%)</span>
            </div>
            <div className="arch-node-desc" style={{ marginTop: '10px', fontSize: '0.8rem', opacity: 0.7 }}>
              Uses: semanticRouter.js for vector matching, TONE_ARCHETYPE_MAP
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(180,0,255,0.4)', '--to-color': 'rgba(180,0,255,0.4)' }} 
          />

          {/* STEP 6: TENSION CHECK */}
          <div 
            className="arch-node archetype"
            data-layer="Archetype"
            onClick={(e) => handleNodeClick('step6', 'Tension Map Check', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">6</span>
              TENSION MAP CHECK
            </div>
            <div className="arch-node-file">archetypes/archetypeDepth.js + intelligence/synthesisEngine.js</div>
            <div className="arch-node-desc">
              Checks if selected archetypes are in productive conflict. 1,764 pairs rated: high / medium / low / neutral.
            </div>
            <div className="arch-node-tags">
              <span className="arch-tag">detectCollisions()</span>
              <span className="arch-tag">getTensionLevel(a, b)</span>
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(180,0,255,0.4)', '--to-color': 'rgba(180,0,255,0.4)' }} 
          />

          {/* STEP 7: 5-LAYER EXTRACTION + COGNITIVE METHODS */}
          <div 
            className="arch-node archetype"
            data-layer="Archetype"
            onClick={(e) => handleNodeClick('step7', '5-Layer Depth Extraction', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">7</span>
              DEPTH + COGNITIVE METHODS
            </div>
            <div className="arch-node-file">archetypeDepth.js + llm.js (ARCHETYPE_METHODS)</div>
            <div className="arch-node-desc">For each archetype, extract depth layers + thinking operations:</div>
            <div className="arch-node-tags">
              <span className="arch-tag">5-Layer Depth</span>
              <span className="arch-tag">⚡ Cognitive Moves</span>
              <span className="arch-tag">anatomize, sfumato, cross_pollinate...</span>
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(180,0,255,0.4)', '--to-color': 'rgba(255,100,0,0.4)' }} 
          />

          {/* STEP 8: SYNTHESIS */}
          <div 
            className="arch-node synthesis"
            data-layer="Synthesis"
            onClick={(e) => handleNodeClick('step8', 'Synthesis Injection', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">8</span>
              SYNTHESIS INJECTION
            </div>
            <div className="arch-node-file">intelligence/synthesisEngine.js</div>
            <div className="arch-node-desc">
              If collision detected → inject dialectical directive: "These frameworks contradict. 
              Generate insight from the collision — something in neither archetype alone."
            </div>
            <div className="arch-node-tags">
              <span className="arch-tag">generateSynthesis()</span>
              <span className="arch-tag">buildSynthesisContext()</span>
              <span className="arch-tag">Liminal Architect mode</span>
            </div>
          </div>

          {/* COLLISION CALLOUT */}
          <div className="arch-collision-callout">
            <h4>⚡ COLLISION PRODUCT ⚡</h4>
            <p>
              Example: <em>Jung × Taleb</em> produces:<br />
              "The shadow isn't just rejected content — it's <em>antifragile potential</em>. 
              The parts you've protected from stress stayed weak."<br /><br />
              This insight is <em>IN neither archetype alone</em>. It's the collision product.
            </p>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(255,100,0,0.4)', '--to-color': 'rgba(0,255,150,0.4)' }} 
          />

          {/* STEP 9: SYSTEM PROMPT */}
          <div 
            className="arch-node intelligence"
            data-layer="Intelligence"
            onClick={(e) => handleNodeClick('step9', 'System Prompt Assembly', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">9</span>
              SYSTEM PROMPT ASSEMBLY
            </div>
            <div className="arch-node-file">intelligence/llm.js → buildSystemPrompt()</div>
            <div className="arch-node-desc">Assembles everything into Claude's context window:</div>
            <div className="arch-node-tags">
              <span className="arch-tag">Identity core (~3500 lines)</span>
              <span className="arch-tag">Archetype + cognitive methods</span>
              <span className="arch-tag">Synthesis directives</span>
              <span className="arch-tag">Behavioral sections</span>
              <span className="arch-tag">RAG + Memory (8 exchanges)</span>
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(0,255,150,0.4)', '--to-color': 'rgba(255,255,255,0.5)' }} 
          />

          {/* STEP 10: CLAUDE */}
          <div 
            className="arch-node llm"
            data-layer="LLM Core"
            onClick={(e) => handleNodeClick('step10', 'Claude API Call', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">10</span>
              CLAUDE API CALL
            </div>
            <div className="arch-node-file">intelligence/llm.js → anthropic.messages.create()</div>
            <div className="arch-node-desc">
              Claude generates inside the shaped container. Pattern-completion runs on the ingredients you provided.
            </div>
            <div className="arch-node-tags">
              <span className="arch-tag">claude-sonnet-4-20250514</span>
              <span className="arch-tag">temp: 0.85</span>
              <span className="arch-tag">max: 1200 tokens</span>
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(255,255,255,0.5)', '--to-color': 'rgba(255,50,100,0.4)' }} 
          />

          {/* STEP 11: RESPONSE PIPELINE */}
          <div 
            className="arch-node output"
            data-layer="Output"
            onClick={(e) => handleNodeClick('step11', 'Response Pipeline', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">11</span>
              RESPONSE PIPELINE (4-LAYER)
            </div>
            <div className="arch-node-file">core/responseEngine.js → generate()</div>
            <div className="arch-node-desc">Post-processing through 4 layers:</div>
            <div className="arch-node-tags">
              <span className="arch-tag">1. Intent</span>
              <span className="arch-tag">2. Tone</span>
              <span className="arch-tag">3. Personality</span>
              <span className="arch-tag">4. Continuity</span>
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(255,50,100,0.4)', '--to-color': 'rgba(255,50,100,0.4)' }} 
          />

          {/* STEP 12: FINAL ASSEMBLY */}
          <div 
            className="arch-node output"
            data-layer="Output"
            onClick={(e) => handleNodeClick('step12', 'Final Assembly', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">12</span>
              FINAL ASSEMBLY
            </div>
            <div className="arch-node-file">core/fusion.js</div>
            <div className="arch-node-desc">
              Filter blacklisted phrases, prepend context-aware phrases, update state + memory + conversation history.
            </div>
          </div>

          <div 
            className="arch-connector" 
            style={{ '--from-color': 'rgba(255,50,100,0.4)', '--to-color': 'rgba(255,255,255,0.3)' }} 
          />

          {/* OUTPUT */}
          <div 
            className="arch-node input"
            data-layer="Output"
            onClick={(e) => handleNodeClick('output', 'Pneuma Response', e)}
          >
            <div className="arch-node-title">
              <span className="arch-step-number">↓</span>
              PNEUMA RESPONSE
            </div>
            <div className="arch-node-desc">
              The collision product emerges — content shaped by dialectical synthesis
            </div>
          </div>

        </div>

        {/* Side Panels */}
        <div className="arch-side-panels">
          <div className="arch-side-panel arch-memory-panel">
            <h3><span className="panel-icon"><BrainIcon /></span> MEMORY SYSTEMS</h3>
            <ul>
              <li>vectorMemory.js — Semantic similarity</li>
              <li>longTermMemory.js — Cross-session</li>
              <li>conversationHistory.js — Persistence</li>
              <li>archetypeRAG.js — Knowledge retrieval</li>
            </ul>
          </div>
          <div className="arch-side-panel arch-archetype-panel">
            <h3><span className="panel-icon"><EyeIcon /></span> 42 ARCHETYPES (Sample)</h3>
            <ul>
              <li>Jung</li>
              <li>Taleb</li>
              <li>Feynman</li>
              <li>Rumi</li>
              <li>Camus</li>
              <li>Sun Tzu</li>
              <li>Lao Tzu</li>
              <li>Aurelius</li>
              <li>Frankl</li>
              <li>Dostoevsky</li>
              <li>Kafka</li>
              <li>Nietzsche</li>
              <li>Hegel</li>
              <li>Carlin</li>
              <li>Liminal Architect</li>
            </ul>
          </div>
        </div>

        {/* Legend */}
        <div className="arch-legend">
          <div className="arch-legend-item">
            <div className="arch-legend-dot" style={{ background: '#0096ff' }} />
            <span>Routing Layer</span>
          </div>
          <div className="arch-legend-item">
            <div className="arch-legend-dot" style={{ background: '#00ff96' }} />
            <span>Intelligence Layer</span>
          </div>
          <div className="arch-legend-item">
            <div className="arch-legend-dot" style={{ background: '#b400ff' }} />
            <span>Archetype Layer</span>
          </div>
          <div className="arch-legend-item">
            <div className="arch-legend-dot" style={{ background: '#ff6400' }} />
            <span>Synthesis Layer</span>
          </div>
          <div className="arch-legend-item">
            <div className="arch-legend-dot" style={{ background: '#ff3264' }} />
            <span>Output Layer</span>
          </div>
          <div className="arch-legend-item">
            <div className="arch-legend-dot" style={{ background: '#ff9600' }} />
            <span>Memory Systems</span>
          </div>
        </div>

      </div>
      
      {/* Modal Components - Multiple can be open simultaneously */}
      <UserInputModal isOpen={!!openModals.input} onClose={() => closeModal('input')} anchorEl={openModals.input} />
      <EntryPointModal isOpen={!!openModals.step1} onClose={() => closeModal('step1')} anchorEl={openModals.step1} />
      <OrchestratorModal isOpen={!!openModals.step2} onClose={() => closeModal('step2')} anchorEl={openModals.step2} />
      <IntentDetectionModal isOpen={!!openModals.step3} onClose={() => closeModal('step3')} anchorEl={openModals.step3} />
      <ToneSelectionModal isOpen={!!openModals.step4} onClose={() => closeModal('step4')} anchorEl={openModals.step4} />
      <ArchetypeSelectionModal isOpen={!!openModals.step5} onClose={() => closeModal('step5')} anchorEl={openModals.step5} />
      <TensionMapModal isOpen={!!openModals.step6} onClose={() => closeModal('step6')} anchorEl={openModals.step6} />
      <DepthExtractionModal isOpen={!!openModals.step7} onClose={() => closeModal('step7')} anchorEl={openModals.step7} />
      <SynthesisModal isOpen={!!openModals.step8} onClose={() => closeModal('step8')} anchorEl={openModals.step8} />
      <SystemPromptModal isOpen={!!openModals.step9} onClose={() => closeModal('step9')} anchorEl={openModals.step9} />
      <ClaudeApiModal isOpen={!!openModals.step10} onClose={() => closeModal('step10')} anchorEl={openModals.step10} />
      <ResponsePipelineModal isOpen={!!openModals.step11} onClose={() => closeModal('step11')} anchorEl={openModals.step11} />
      <FinalAssemblyModal isOpen={!!openModals.step12} onClose={() => closeModal('step12')} anchorEl={openModals.step12} />
      <OutputModal isOpen={!!openModals.output} onClose={() => closeModal('output')} anchorEl={openModals.output} />
    </div>
  );
}

export default ArchitectureDiagram;

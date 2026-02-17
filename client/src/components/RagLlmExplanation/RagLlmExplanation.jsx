import React, { useState } from "react";
import "./RagLlmExplanation.css";

const TABS = [
  { key: "llm", label: "LLM Pattern Matching" },
  { key: "synthesis", label: "RAG + LLM Synthesis" },
  { key: "conversation", label: "Developer Q&A" },
];

const RagLlmExplanation = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("llm");

  const llmDiagram = `User: "I feel broken after what happened"
↓
[Tokenization]
↓
[Context Analysis]
↓
[Pattern Matching from Training Data]
↓
[Pattern Completion]
↓
Generic Output: "I'm sorry you're going through this. 
Remember that healing takes time..."`;

  const ragDiagram = `User: "I feel broken after what happened"
↓
[Dialectical Collision: Jung × Taleb]
↓
[RAG Retrieval: Searches 46 knowledge bases]
↓
[Context Injection: Pastes quotes into prompt]
↓
Prompt to Claude:
  System: "Jung: 'The wound is the place where Light enters'"
  User: "I feel broken after what happened"
↓
[LLM Synthesis: RAG context + full training data]
↓
Philosophically Grounded Output: "Jung recognized wounds as portals 
for transformation. Taleb extends this: you become antifragile..."`;

  return (
    <div className="rag-llm-explanation-page">
      {/* Header */}
      <header className="rag-llm-header">
        <button onClick={onBack} className="back-button">
          ← 
        </button>
        <h1>Understanding Pneuma's Architecture</h1>
        <p className="subtitle">How Archetype RAG Works with the LLM</p>
      </header>

      {/* Tab Navigation */}
      <div className="rag-llm-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`tab-button ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rag-llm-tab-content">
        {activeTab === "llm" && (
          <section className="tab-section">
            <h3>Standard LLM Flow (No RAG)</h3>
            <p>
              When a user sends a message, the LLM processes it through pattern matching 
              using only its training data:
            </p>
            
            <ol className="step-list">
              <li>
                <strong>Tokenization:</strong> Input is broken into tokens (words/subwords)
              </li>
              <li>
                <strong>Context Analysis:</strong> LLM analyzes semantic meaning
              </li>
              <li>
                <strong>Pattern Matching:</strong> Searches neural network for learned patterns from training
              </li>
              <li>
                <strong>Pattern Completion:</strong> Predicts most likely response based on training data
              </li>
              <li>
                <strong>Output:</strong> Generic response using general knowledge
              </li>
            </ol>

            <div className="diagram-container">
              <pre className="flow-diagram llm-flow">{llmDiagram}</pre>
            </div>

            <div className="insight-box">
              <strong>Result:</strong> Competent but unfocused response. No philosophical grounding.
            </div>
          </section>
        )}

        {activeTab === "synthesis" && (
          <section className="tab-section">
            <h3>With Pneuma's Archetype RAG</h3>
            <p>
              RAG injects curated philosophical context before the LLM generates its response:
            </p>
            
            <ol className="step-list">
              <li>
                <strong>Dialectical Collision:</strong> System selects relevant archetypes (Jung × Taleb)
              </li>
              <li>
                <strong>RAG Retrieval:</strong> Searches 46 knowledge bases for relevant quotes
              </li>
              <li>
                <strong>Context Injection:</strong> Quotes are literally pasted into the prompt
              </li>
              <li>
                <strong>LLM Synthesis:</strong> Claude processes RAG context + full training data
              </li>
              <li>
                <strong>Enhanced Output:</strong> Philosophically grounded synthesis
              </li>
            </ol>

            <div className="diagram-container">
              <pre className="flow-diagram rag-flow">{ragDiagram}</pre>
            </div>

            <div className="insight-box highlight">
              <strong>Key Insight:</strong> RAG doesn't replace pattern matching—it steers it. 
              Claude still uses its full knowledge base, but anchored to your curated philosophy.
            </div>

            <div className="comparison-grid">
              <div className="comparison-item">
                <h4>Without RAG</h4>
                <p>LLM → Training Data → Generic Response</p>
              </div>
              <div className="comparison-item">
                <h4>With RAG</h4>
                <p>Query → RAG Context → LLM (RAG + Training) → Grounded Synthesis</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "conversation" && (
          <section className="tab-section">
            <h3>The Developer Journey</h3>
            <p className="section-intro">
              This conversation shows how understanding evolved from confusion to clarity:
            </p>

            <div className="qa-conversation">
              <div className="qa-exchange">
                <div className="qa-question">
                  <strong>Pablo:</strong> I'm having an issue understanding the relation between 
                  the archetype RAG and what the LLM does. What would it do on its own vs. with my RAG?
                </div>
                <div className="qa-answer">
                  <strong>Claude:</strong> The RAG finds relevant quotes and literally pastes them 
                  into the prompt. The LLM reads those quotes and responds informed by them.
                </div>
              </div>

              <div className="qa-exchange">
                <div className="qa-question">
                  <strong>Pablo:</strong> Wouldn't the LLM synthesize a response anyway using its 
                  own knowledge base and pattern completion?
                </div>
                <div className="qa-answer">
                  <strong>Claude:</strong> Yes, but RAG gives it the EXACT quote you want emphasized. 
                  Without RAG: general philosophical vibes. With RAG: anchored to your specific curated quotes.
                </div>
              </div>

              <div className="qa-exchange">
                <div className="qa-question">
                  <strong>Pablo:</strong> Aren't there limitations to my RAG compared to what Claude can share?
                </div>
                <div className="qa-answer">
                  <strong>Claude:</strong> RAG has boundaries (finite, curated scope), but it EXTENDS 
                  Claude's output by steering it, not limiting it. You're getting synthesis between 
                  your RAG + Claude's full database.
                </div>
              </div>

              <div className="qa-exchange breakthrough">
                <div className="qa-question">
                  <strong>Pablo:</strong> So this is actually good architecture.
                </div>
                <div className="qa-answer">
                  <strong>Claude:</strong> YES! You're doing exactly what sophisticated RAG should do:
                  <ul>
                    <li>Curated philosophical lens (46 archetypes) = direction/voice</li>
                    <li>Claude's full knowledge = depth/synthesis capability</li>
                    <li>Dialectical collision = unique mechanic for selection</li>
                  </ul>
                  Your RAG doesn't limit Claude—it focuses and enhances it.
                </div>
              </div>
            </div>

            <div className="insight-box">
              <strong>Architecture Value:</strong> Pneuma combines curated direction with broad 
              synthesis—467 GitHub clones because the architecture works.
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default RagLlmExplanation;
import React, { useState } from "react";
import "./RagLlmExplanation.css";

const TABS = [
  { key: "llm", label: "LLM Pattern Matching" },
  { key: "synthesis", label: "RAG + LLM Synthesis" },
  { key: "conversation", label: "Developer Q&A" },
  { key: "study-guide", label: "Interview Prep" },
];

const STUDY_SECTIONS = [
  {
    id: "what-is",
    label: "What Is Pneuma?",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: How do you describe Pneuma in one sentence?</div>
          <div className="sg-a">
            Pneuma is a cognitive orchestration layer — code that runs before Claude sees your message,
            building a structured cognitive context out of archetypes, intent scores, memory, and
            dialectical synthesis so that the LLM thinks differently, not just says different things.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What's the core architectural inversion?</div>
          <div className="sg-a">
            Most AI wrappers: LLM generates → personality added on top.<br/>
            Pneuma: Code builds cognitive context → personality structures how the LLM thinks → LLM is the material.<br/>
            You don't prompt Pneuma into being. The code runs first.
          </div>
        </div>
      </>
    )
  },
  {
    id: "pipeline",
    label: "The Pipeline (8 Steps)",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: What actually happens when a user sends a message?</div>
          <div className="sg-a">
            <ol className="step-list" style={{ marginTop: '0.5rem' }}>
              <li><strong>Intent scoring</strong> — measures emotional, philosophical, numinous, art, creative dimensions (0–1)</li>
              <li><strong>Archetype selection</strong> — picks the most relevant 3–5 archetypes from 46 based on intent</li>
              <li><strong>Collision detection</strong> — checks if active archetypes conflict (high/medium/low/neutral tension)</li>
              <li><strong>Synthesis generation</strong> — if collision exists, builds a dialectical synthesis directive</li>
              <li><strong>Inner monologue</strong> — pre-response cognition: hypothesis, doubt, mode selection</li>
              <li><strong>Vector memory retrieval</strong> — pulls relevant past knowledge about the user</li>
              <li><strong>Tiered system prompt assembly</strong> — Tier 1 always, Tier 2 by intent scores, Tier 3 RAG passages</li>
              <li><strong>Claude API call</strong> — full context + last 6 conversation exchanges as real alternating turns</li>
            </ol>
          </div>
        </div>
      </>
    )
  },
  {
    id: "intent",
    label: "Intent Scoring",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: What is intent scoring and why does it matter?</div>
          <div className="sg-a">
            <code>intentScorer.js</code> analyzes the user's message and assigns scores between 0 and 1 across
            multiple dimensions — emotional, philosophical, numinous (spiritual), art, creative, etc.
            These scores drive two things: which archetypes rise, and which Tier 2 knowledge blocks load.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Give a concrete example.</div>
          <div className="sg-a">
            If <code>intentScores.emotional &gt; 0.5</code>, the Beck (CBT) block loads into the system prompt.
            If it's 0.2, it doesn't. A casual greeting loads zero Tier 2 blocks (~2k tokens).
            A question about consciousness and death might score 0.7 philosophical + 0.6 numinous
            and load Kastrup + Heidegger + Jesus blocks.
          </div>
        </div>
      </>
    )
  },
  {
    id: "archetypes",
    label: "Archetypes",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: What is an archetype in Pneuma?</div>
          <div className="sg-a">
            An archetype isn't a persona or voice — it's a thinking method. Each one has:
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <li><strong>essence</strong> — one-sentence distillation of how it sees the world</li>
              <li><strong>coreFrameworks</strong> — fundamental beliefs and lenses it applies</li>
              <li><strong>cognitiveTools</strong> — specific operations it uses to process problems</li>
              <li><strong>fundamentalTensions</strong> — internal contradictions it holds</li>
              <li><strong>conceptualBridges</strong> — pre-mapped connections to other archetypes</li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Concrete example of archetype structure?</div>
          <div className="sg-a">
            <strong>Trickster:</strong><br/>
            Essence: "Truth delivered through laughter. Sacred cows are just unquestioned assumptions."<br/><br/>
            coreFrameworks:<br/>
            — <code>sacredCowBBQ</code>: "Every taboo protects something — sometimes wisdom, sometimes bullshit. Humor tests which."<br/>
            — <code>comfortDisruption</code>: "Laughter happens when pattern-recognition glitches. The joke reveals the hidden assumption."<br/><br/>
            cognitiveTools:<br/>
            — <code>absurdityAmplification</code>: "Take the premise to its logical extreme until it reveals its own absurdity"<br/>
            — <code>expectationSubversion</code>: "Set up the pattern, then break it — the gap is where insight lives"<br/><br/>
            conceptualBridges:<br/>
            — <code>absurdist</code>: "Both see the cosmic joke; trickster laughs, absurdist rebels"
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What's the difference between a role and an archetype?</div>
          <div className="sg-a">
            A role ("be a philosopher") tells the LLM what to pretend to be.
            An archetype activates specific thinking operations — Trickster's <code>absurdityAmplification</code> tool
            gets injected into context as a cognitive operation Claude is told to use.
            The LLM isn't wearing a costume; it's been handed a specific set of tools.
          </div>
        </div>
      </>
    )
  },
  {
    id: "tiered",
    label: "Tiered System Prompt",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: What is the tiered system prompt?</div>
          <div className="sg-a">
            Originally <code>buildSystemPrompt()</code> loaded ~18,000 tokens every call regardless of context.
            Now it's split:
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <li><strong>Tier 1</strong> (~2k tokens, always loaded): Core identity, archetypes, autonomy rules, inner monologue format</li>
              <li><strong>Tier 2</strong> (conditional): Beck (CBT), Da Vinci, Kastrup, Jesus/Wright, Heidegger, Creative generation — each loads only when intent scores cross a threshold</li>
              <li><strong>Tier 3</strong> (already dynamic): RAG passages retrieved by vector similarity for the specific message</li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Why does token count matter?</div>
          <div className="sg-a">
            Every token sent costs money and counts against the context window.
            More importantly, sending irrelevant content adds noise.
            A question about feeling sad doesn't need Heidegger's phenomenology of tool-being.
            Tiered loading means the system prompt is always relevant to what the user actually said.
          </div>
        </div>
      </>
    )
  },
  {
    id: "rag",
    label: "RAG / Vector Memory",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: What is RAG and how does Pneuma use it?</div>
          <div className="sg-a">
            RAG = Retrieval-Augmented Generation. Pneuma has 46 vector knowledge bases — one per archetype.
            When a message comes in, it's embedded and compared by cosine similarity against the archetype's
            knowledge base. The most relevant passages are literally injected into the system prompt as Tier 3 context.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Difference between RAG and conversation memory?</div>
          <div className="sg-a">
            RAG retrieves <strong>archetype knowledge</strong> — philosophical content, frameworks, ideas.<br/>
            Conversation memory (<code>vectorMemory.js</code>) retrieves knowledge <strong>about the user</strong> — past patterns,
            persistent themes, things the user has said before. They're separate systems serving different purposes.
          </div>
        </div>
      </>
    )
  },
  {
    id: "collision",
    label: "Collision Detection",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: What is collision detection?</div>
          <div className="sg-a">
            <code>detectCollisions()</code> in <code>synthesisEngine.js</code> loops through all active archetype pairs
            and calls <code>getTensionLevel(a, b)</code> on each. Each pair is rated <strong>high</strong>, <strong>medium</strong>,
            <strong> low</strong>, or <strong>neutral</strong>.
            It returns whether a collision exists, all pairs and their ratings, and the highest-tension pair.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Where do the tension ratings come from?</div>
          <div className="sg-a">
            A pre-mapped <code>tensionMap</code> object in <code>archetypeDepth.js</code> — every archetype pair
            that has a meaningful tension is hand-coded with its level. This isn't computed at runtime;
            the tensions were mapped in advance across all relevant pairs.
          </div>
        </div>
      </>
    )
  },
  {
    id: "synthesis",
    label: "Dialectical Synthesis — THE FULL MECHANISM",
    critical: true,
    content: () => (
      <>
        <div className="insight-box highlight" style={{ maxWidth: '100%', marginBottom: '1.5rem' }}>
          <strong>Key principle:</strong> Collision doesn't just trigger synthesis — it provides the specific raw material.
          The synthesis is constructed from real archetype data, not a generic "blend these two things" instruction.
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: What is dialectical synthesis in plain language?</div>
          <div className="sg-a">
            When two archetypes with incompatible worldviews are both active, Pneuma doesn't let them coexist
            or blend peacefully. It forces a collision and then builds a directive telling Claude to generate
            insight that couldn't come from <em>either</em> archetype alone — something new that emerges from
            the specific friction between them.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: Walk me through the full mechanism step by step.</div>
          <div className="sg-a">
            <strong>Step 1 — Pair detection</strong><br/>
            <code>detectCollisions()</code> loops all active pairs, rates each by tension (high/medium/low/neutral),
            identifies the highest-tension pair.
            <br/><br/>
            <strong>Step 2 — Framework extraction</strong><br/>
            <code>generateSynthesis(a, b, topic)</code> looks up both archetypes in <code>archetypeDepth</code>:
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <li>Top 2 <strong>coreFrameworks</strong> from each — the fundamental beliefs in tension</li>
              <li>Top 2 <strong>cognitiveTools</strong> from each — the thinking operations available for synthesis</li>
              <li><strong>fundamentalTensions</strong> from each — internal contradictions each archetype holds</li>
              <li><strong>conceptualBridges</strong> — if archetype A has a pre-mapped bridge to B, that's extracted as a known meeting point</li>
            </ul>
            <br/>
            <strong>Step 3 — Prompt type selection</strong><br/>
            Based on tension level:<br/>
            — <code>high</code> → prompt type <strong>"collision"</strong> — genuinely incompatible; synthesis must come from productive friction<br/>
            — <code>medium</code> → prompt type <strong>"hybrid"</strong> — can be integrated into a blended lens<br/>
            — <code>low</code> → prompt type <strong>"illumination"</strong> — one archetype illuminates the other from an adjacent angle<br/>
            <br/>
            <strong>Step 4 — Context assembly</strong><br/>
            <code>buildSynthesisContext()</code> formats everything into a block injected into the system prompt:
            names, essences, frameworks in tension, cognitive tools, known bridge (if exists), and the synthesis directive.
            <br/><br/>
            <strong>Step 5 — Claude generates emergence</strong><br/>
            Claude receives the directive: <em>"Generate insight that emerges from the COLLISION — something IN neither archetype alone."</em>
            It knows exactly what each archetype believes, what tools each uses, where any bridge exists, and what kind of synthesis is expected.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: What is a "conceptual bridge" and why does it matter?</div>
          <div className="sg-a">
            A conceptual bridge is a hand-coded connection between two specific archetypes — a known meeting point.
            Example from the code:<br/><br/>
            Trickster's bridge to Absurdist: <em>"Both see the cosmic joke; trickster laughs, absurdist rebels"</em><br/><br/>
            This tells Claude: these two share recognition of absurdity, but diverge in response — humor vs. defiant rebellion.
            That divergence is exactly where synthesis lives. If no bridge exists, Claude has to find synthesis
            from the raw frameworks and tools alone.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: Why is synthesis "conceived upon collision" and not just the result of it?</div>
          <div className="sg-a">
            The collision doesn't just trigger synthesis — it provides the raw material.<br/><br/>
            The <strong>coreFrameworks</strong> are the specific beliefs in tension.<br/>
            The <strong>cognitiveTools</strong> are the operations available.<br/>
            The <strong>conceptualBridge</strong> (if exists) is a pre-identified leverage point.<br/>
            The <strong>prompt type</strong> (collision/hybrid/illumination) determines how hard synthesis must work.<br/><br/>
            Claude is told exactly which beliefs are clashing, exactly what tools are available, and exactly where
            any known connection exists. The emergent insight is shaped by that specific architecture.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: Can you replicate this with a prompt?</div>
          <div className="sg-a">
            No. You could write "be both funny and rigorous" — but that describes an output style.
            What Pneuma does is inject the specific frameworks and tools that each archetype uses to think,
            so synthesis is shaped by those particular structures.
            The difference is between telling someone "be smart in two ways" vs. handing them two specific
            reasoning systems and asking them to generate something neither system could produce alone.
          </div>
        </div>
      </>
    )
  },
  {
    id: "threading",
    label: "Conversation History Threading",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: What was wrong with the original approach?</div>
          <div className="sg-a">
            The original <code>getLLMContent()</code> sent a single message to the API every call.
            Claude had no memory of what it had just said. Every response restarted from scratch —
            which caused the "loop/restart" behavior where the system felt like it was always re-introducing itself.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: How was it fixed?</div>
          <div className="sg-a">
            Replaced the single-message call with a proper <code>messages</code> array.
            The last 6 conversation exchanges are formatted as alternating <code>user</code>/<code>assistant</code> turns —
            the same format Claude's API natively expects. Claude now sees what it actually said in previous turns
            and can continue a thought instead of restarting.
            History was also removed from the system prompt string where it had been injected as compressed text.
          </div>
        </div>
      </>
    )
  },
  {
    id: "why-matters",
    label: "Why This Matters vs Plain Claude",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: What can't be replicated by prompting?</div>
          <div className="sg-a">
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <li><strong>Collision detection</strong> — code identifies incompatible archetypes and injects synthesis directives; you can't type this per conversation</li>
              <li><strong>Tiered conditional loading</strong> — intent scores determine which knowledge blocks appear; requires runtime scoring</li>
              <li><strong>Dialectical synthesis construction</strong> — specific frameworks, tools, and bridges extracted per-pair at runtime; not a template</li>
              <li><strong>Persistent user memory</strong> — vector embeddings that accumulate across conversations</li>
              <li><strong>Real conversation threading</strong> — native API alternating turns, not a compressed text summary</li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Honest limitations?</div>
          <div className="sg-a">
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <li>Archetype selection quality depends on intent scoring accuracy — wrong read = wrong archetypes downstream</li>
              <li>RAG quality depends on the knowledge bases — 46 bases is a lot to maintain; passage quality varies</li>
              <li>Synthesis is only as good as the archetypeDepth.js data — weak coreFrameworks = generic synthesis directive</li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  {
    id: "vocab",
    label: "Quick Reference Vocabulary",
    critical: false,
    content: () => (
      <div className="comparison-grid" style={{ maxWidth: '100%' }}>
        {[
          ["Archetype", "A thinking method with frameworks, tools, bridges — not a persona"],
          ["Intent score", "0–1 rating of a message across dimensions (emotional, philosophical, etc.)"],
          ["Collision", "When two archetypes have tension above neutral"],
          ["coreFrameworks", "Fundamental beliefs that define how an archetype sees the world"],
          ["cognitiveTools", "Specific thinking operations an archetype uses to process problems"],
          ["conceptualBridges", "Pre-mapped connections between specific archetype pairs"],
          ["Tension level", "high/medium/low/neutral — determines synthesis prompt type"],
          ["collision / hybrid / illumination", "Synthesis prompt types based on tension level"],
          ["Tier 1 / 2 / 3", "Always loaded / conditional by intent / RAG passages"],
          ["Native turns", "Alternating user/assistant messages in the API messages array"],
          ["Inner monologue", "Pre-response cognition: hypothesis, doubt, mode selection"],
          ["RAG", "Retrieval-Augmented Generation — semantic search over knowledge bases"],
        ].map(([term, def]) => (
          <div className="comparison-item" key={term}>
            <h4 style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{term}</h4>
            <p>{def}</p>
          </div>
        ))}
      </div>
    )
  }
];

const RagLlmExplanation = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("llm");
  const [openSection, setOpenSection] = useState("synthesis");

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

        {activeTab === "study-guide" && (
          <section className="tab-section">
            <h3>Interview Prep — Q&amp;A Study Guide</h3>
            <p className="section-intro">
              Click any section to expand. Start with <strong>Dialectical Synthesis</strong> — it's the hardest to explain and the most impressive.
            </p>

            <div className="study-accordion">
              {STUDY_SECTIONS.map((section) => (
                <div
                  key={section.id}
                  className={`accordion-item ${section.critical ? 'critical' : ''} ${openSection === section.id ? 'open' : ''}`}
                >
                  <button
                    className="accordion-header"
                    onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                  >
                    <span>{section.label}</span>
                    <span className="accordion-arrow">{openSection === section.id ? '▲' : '▼'}</span>
                  </button>
                  {openSection === section.id && (
                    <div className="accordion-body">
                      {section.content()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="insight-box highlight" style={{ marginTop: '2rem' }}>
              <strong>The line to remember:</strong> Synthesis isn't triggered by collision — collision provides the specific raw material (frameworks, tools, bridges, tension level) from which synthesis is constructed. The emergent insight belongs to neither archetype alone.
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default RagLlmExplanation;
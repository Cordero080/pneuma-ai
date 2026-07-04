import React, { useState } from "react";
import Modal, {
  ModalSection,
  ModalCodeBlock,
  ModalFlow,
  ModalDesc,
  ModalInfoGrid,
  ModalInfoCard,
} from "../../../Modal/Modal";
import {
  LayersIcon,
  BrainIcon,
  RAGIcon,
  SynthesisIcon,
} from "../../../Modal/Icons";

export default function WhatSetsApartModal() {
  const [nestedModal, setNestedModal] = useState(null);

  return (
    <>
      <ModalSection title="The Honest Technical Picture">
        <ModalDesc>
          Every mechanism Pneuma uses — vector databases, prompt injection,
          conversation threading, conditional loading — exists independently.
          None of them are novel by themselves. What's unusual is the
          combination and the design decisions baked into each.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          Four specific engineering decisions distinguish this from a
          well-prompted Claude or a standard RAG wrapper. Click each one to
          understand it in depth — what it is, why it matters, what the jargon
          means, and where it lives in the code.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="The Four Decisions">
        <ModalInfoGrid>
          <ModalInfoCard
            title="Context Management"
            desc="What gets loaded changes based on what you say — dynamically, at runtime"
            icon={LayersIcon}
            onClick={() => setNestedModal("cm")}
          />
          <ModalInfoCard
            title="Synthesis Engine"
            desc="Incompatible frameworks are forced to argue, not averaged together"
            icon={SynthesisIcon}
            onClick={() => setNestedModal("se")}
          />
          <ModalInfoCard
            title="Cognitive Frameworks"
            desc="Thinkers are encoded as how they think, not what they said"
            icon={BrainIcon}
            onClick={() => setNestedModal("cf")}
          />
          <ModalInfoCard
            title="Agent-Directed Memory"
            desc="The system decides what to remember and annotates why"
            icon={RAGIcon}
            onClick={() => setNestedModal("am")}
          />
          <ModalInfoCard
            title="Eval Loop"
            desc="Every response is scored before delivery — misses regenerate once with feedback"
            icon={BrainIcon}
            onClick={() => setNestedModal("el")}
          />
        </ModalInfoGrid>
      </ModalSection>

      <ModalSection title="What These Have in Common">
        <ModalDesc>
          Each of these decisions is an architectural choice, not a code trick.
          You can't copy the mechanism and get the same result — the value is in
          the design decisions encoded into the mechanism: which 44 thinkers,
          what their thinking methods actually are, how 1,764 pairs were mapped
          for tension, what to do when memory has a "why" attached, and what
          counts as a response that actually served the moment.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          These decisions transfer to any serious AI product work. They
          represent the difference between building an AI feature and
          understanding how AI systems behave at an architectural level.
        </ModalDesc>
      </ModalSection>

      {/* ── Nested: Context Management ── */}
      <Modal
        isOpen={nestedModal === "cm"}
        onClose={() => setNestedModal(null)}
        title="Context Management System"
        icon={LayersIcon}
      >
        <ModalSection title="Plain English: What This Is">
          <ModalDesc>
            Every time you send a message to an AI, the system has to tell
            Claude "who it is" and "what it knows" before it sees your message.
            That invisible instruction set is called the{" "}
            <strong>system prompt</strong>.
          </ModalDesc>
          <ModalDesc style={{ marginTop: "12px" }}>
            In Pneuma's original design, it loaded the equivalent of a 50-page
            document on every single message — including Heidegger's
            phenomenology when you said "good morning." Every extra page costs
            money and adds noise.
          </ModalDesc>
          <ModalDesc style={{ marginTop: "12px" }}>
            The fix: Pneuma now reads your message first, scores it across
            multiple dimensions, and only loads the chapters that are actually
            relevant. A philosophical question about consciousness loads
            Heidegger + Kastrup + theology. A casual greeting loads almost
            nothing.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Analogy">
          <ModalDesc>
            A chef who reads the reservation before prepping. Vegan table
            tonight — don't break out the foie gras. Weekday lunch crowd — keep
            it quick. The information available is the same; what gets prepared
            is context-dependent.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Jargon Explained">
          <ModalFlow
            steps={[
              {
                title: "Tokens",
                desc: "The currency of AI. Every word (roughly) costs tokens. More tokens = more cost + more noise in the context window. A token is about ¾ of a word in English.",
              },
              {
                title: "System Prompt",
                desc: "The hidden instructions Claude reads before your message. This is where Pneuma's identity, archetype frameworks, and knowledge blocks live. You never see it.",
              },
              {
                title: "Intent Scoring",
                desc: "Measuring your message across dimensions (0–1 each): emotional, philosophical, numinous (spiritual), art, creative. These scores are the decision signals.",
              },
              {
                title: "Tiered Loading",
                desc: "Conditional delivery. Tier 1 always loads (~2,000 tokens). Tier 2 blocks load only when intent scores cross specific thresholds. Tier 3 is RAG — always dynamic.",
              },
              {
                title: "Context Window",
                desc: "The total text Claude can see at once — your messages, the system prompt, everything. There's a limit. Wasteful loading crowds out conversation space.",
              },
            ]}
          />
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
          <ModalFlow
            steps={[
              {
                title: "Before (Feb 2026)",
                desc: "~18,000 tokens loaded every single call. Heidegger + Beck + Kastrup + Jesus + Da Vinci + creative rules — all present regardless of what you said.",
              },
              {
                title: "After",
                desc: "~2,000 tokens base. Deep knowledge blocks load only when the message warrants them. ~85% token reduction on casual interactions.",
              },
              {
                title: "Why It Matters Beyond Cost",
                desc: "Irrelevant context adds noise. A question about your morning doesn't benefit from Heidegger's tool-being analysis. Removing it makes responses sharper, not just cheaper.",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Why This Is Technically Interesting">
          <ModalDesc>
            Most AI wrappers treat the system prompt as a static file — same
            content every call. Dynamic context loading requires runtime scoring
            (what did the user actually say?), a threshold system for each block
            (when is it relevant?), and careful token budgeting so the total
            stays within limits. It's an engineering solution to a real
            tradeoff: depth vs. relevance vs. cost.
          </ModalDesc>
        </ModalSection>
      </Modal>

      {/* ── Nested: Synthesis Engine ── */}
      <Modal
        isOpen={nestedModal === "se"}
        onClose={() => setNestedModal(null)}
        title="Synthesis Engine"
        icon={SynthesisIcon}
      >
        <ModalSection title="Plain English: What This Is">
          <ModalDesc>
            If you ask most AI systems to "channel multiple perspectives," they
            average them — they find the diplomatic middle ground. Ask Nietzsche
            and Schopenhauer about failure and you might get: "Failure can be
            both meaningful and painful." That's blending. It's the least
            interesting possible output.
          </ModalDesc>
          <ModalDesc style={{ marginTop: "12px" }}>
            Pneuma's synthesis engine detects which kind of relationship two
            active archetypes have — and handles each differently. Archetypes in
            genuine tension are forced to argue. Natural allies are directed to
            find what only their combination can see. Either way, something
            emerges that neither archetype reaches alone.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Two Modes of Emergence">
          <ModalFlow
            steps={[
              {
                title: "Collision (High / Medium Tension)",
                desc: "Put a trauma therapist and a stoic general in the same room and ask them about grief. They won't agree. What emerges from their argument — if it's a real argument, not a polite one — is something neither would have said alone. Camus × Frankl. Nietzsche × Schopenhauer.",
              },
              {
                title: "Resonance (Low Tension — Natural Allies)",
                desc: "Put Spinoza and Lao Tzu in the same room. They don't clash — they're both pointing at the same mountain from different sides. The synthesis isn't born from friction but from two paths arriving at the same place. What's visible only from the intersection? Rumi × Neruda. McGilchrist × Goethe. Parmenides × Kastrup.",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Jargon Explained">
          <ModalFlow
            steps={[
              {
                title: "Tension Map",
                desc: "A pre-computed lookup table of archetype pairs, each rated high / medium / low / neutral tension. Every combination of 44 archetypes is accounted for. This is a design artifact — someone had to decide what makes each pair incompatible.",
              },
              {
                title: "Collision Detection",
                desc: "Code that loops through all currently active archetype pairs, checks each against the tension map, and returns the highest-tension pair found.",
              },
              {
                title: "Synthesis Directive",
                desc: "An explicit instruction block injected into the system prompt that names the specific frameworks in tension, the cognitive tools available, and what kind of synthesis to produce.",
              },
              {
                title: "Antithetical Mode",
                desc: "A and B genuinely disagree about the user's message. A third position emerges from the collision that neither alone would produce.",
              },
              {
                title: "Complementary Mode",
                desc: "A and B agree — but arrive from completely opposite approaches. The convergence from two different roads makes the conclusion harder to dismiss.",
              },
              {
                title: "Cross-Domain Mode",
                desc: "A brings rigor/precision, B brings resonance/metaphor. Two languages translating the same reality. One gives the skeleton; the other gives the flesh.",
              },
              {
                title: "Resonance Path",
                desc: "Fires for low-tension (allied) pairs. Language shifts from 'dwell in the tension' to 'find the view only available from both positions simultaneously.' Not friction — convergence from different directions.",
              },
              {
                title: "Synthesis Exemplars",
                desc: "Pre-written insights for 45+ known pairs in synthesisExemplars.js — shown to Claude alongside the directive. 30+ collision exemplars, 15+ resonance exemplars. The exemplar demonstrates the shape of the thinking being requested, not the answer.",
              },
            ]}
          />
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
          <ModalDesc style={{ marginTop: "12px" }}>
            Claude receives this block and generates something that is shaped by
            the specific tension described — not a generic "be philosophical"
            instruction. The specific frameworks and tools are the raw material.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Where It Lives in the Code">
          <ModalFlow
            steps={[
              {
                title: "synthesisEngine.js → detectCollisions()",
                desc: "Loops all active archetype pairs, looks each up in the tension map, returns the highest-tension pair found.",
              },
              {
                title: "synthesisEngine.js → generateSynthesis(a, b)",
                desc: "Extracts coreFrameworks, cognitiveTools, and conceptualBridges from both archetypes in archetypeDepth.js.",
              },
              {
                title: "synthesisEngine.js → getSynthesisPrompt(type, a, b)",
                desc: "Returns the collision / hybrid / illumination directive formatted with the archetype names.",
              },
              {
                title: "synthesisEngine.js → buildSynthesisContext()",
                desc: "Assembles the full block shown above and returns it for injection into the system prompt.",
              },
              {
                title:
                  "synthesisExemplars.js → getExampleSynthesis() / getResonanceExemplar()",
                desc: "Lookup functions for pre-written exemplars. Called in llm.js when a collision or resonance fires — the matching exemplar is appended to the directive so Claude sees what the output should look like.",
              },
              {
                title: "llm.js → buildSystemPrompt()",
                desc: "Receives the assembled synthesis context and places it in the prompt as a distinct block Claude reads before responding.",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Why This Can't Be Replicated With a Prompt">
          <ModalDesc>
            You could write "be both Camus and Frankl" — but that's describing
            an output style. What Pneuma injects is the specific frameworks each
            archetype uses to think, the tools each brings, and a pre-mapped
            bridge between them if one exists. The synthesis is constructed from
            specific data, not from a vague blending instruction.
          </ModalDesc>
          <ModalDesc style={{ marginTop: "12px" }}>
            The 1,764 tension pairs are the key design artifact. They represent
            a taxonomization of which philosophical frameworks genuinely
            conflict and how. That's not derivable from code — someone had to
            make those decisions. The code runs on that design work.
          </ModalDesc>
        </ModalSection>
      </Modal>

      {/* ── Nested: Cognitive Frameworks ── */}
      <Modal
        isOpen={nestedModal === "cf"}
        onClose={() => setNestedModal(null)}
        title="Cognitive Frameworks (5-Layer Depth)"
        icon={BrainIcon}
      >
        <ModalSection title="Plain English: What This Is">
          <ModalDesc>
            Most AI personality systems do one of two things with a thinker like
            Leonardo da Vinci:
          </ModalDesc>
          <ModalDesc style={{ marginTop: "8px" }}>
            <strong>Costume (roleplay):</strong> "Pretend you are Leonardo.
            Respond as he would." Claude wears a mask and guesses what Leonardo
            might say.
          </ModalDesc>
          <ModalDesc style={{ marginTop: "8px" }}>
            <strong>Retrieval (RAG):</strong> "Here are some Leonardo quotes,
            use them." Claude has material to reference but no structure for how
            Leonardo thought.
          </ModalDesc>
          <ModalDesc style={{ marginTop: "12px" }}>
            Pneuma does something different: it extracts Leonardo's{" "}
            <em>methodology</em> — the specific thinking operations he used —
            and injects them as operations Claude is told to run. Not "what
            would Leonardo say?" but "how would Leonardo see?"
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Analogy">
          <ModalDesc>
            Learning a chef's technique vs. memorizing their recipes. A recipe
            gives you what they made. Technique gives you how they approach any
            problem in a kitchen. You can now cook things they never cooked —
            using the same thinking.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Jargon Explained">
          <ModalFlow
            steps={[
              {
                title: "Cognitive Metabolization",
                desc: "Extracting the structure of how a thinker thinks, not just what they said. The thinker's reasoning becomes an operation, not a quote.",
              },
              {
                title: "cognitiveTools",
                desc: "Named operations derived from a thinker's actual methodology. These are injected into the prompt as things Claude is told to DO — not reference.",
              },
              {
                title: "coreFrameworks",
                desc: "The fundamental beliefs that define how an archetype sees the world. These are what collide in the synthesis engine.",
              },
              {
                title: "conceptualBridges",
                desc: "Pre-mapped connections between specific archetype pairs — known meeting points or productive overlaps that the synthesis engine can leverage.",
              },
              {
                title: "translationProtocols",
                desc: "How an archetype's lens applies in different registers: technical, emotional, spiritual. The same thinking tool applied differently depending on the conversation.",
              },
              {
                title: "5-Layer Depth",
                desc: "Each archetype in archetypeDepth.js has: (1) coreFrameworks, (2) cognitiveTools, (3) fundamentalTensions, (4) conceptualBridges, (5) translationProtocols. That's 2,619 lines for 44 thinkers.",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="A Real Example: Leonardo's Cognitive Tools">
          <ModalDesc>
            When the inventor archetype is active, Claude receives this as part
            of its context:
          </ModalDesc>
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
          <ModalDesc style={{ marginTop: "12px" }}>
            These aren't Leonardo quotes. They're operations. Claude is told to{" "}
            <em>apply</em> <code>saperVedere</code> — to observe before
            theorizing — to whatever you just said. The method is active, not
            decorative.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Combinations Across Archetypes">
          <ModalDesc>
            When multiple archetypes are active, their tools can combine:
          </ModalDesc>
          <ModalFlow
            steps={[
              {
                title: "Leonardo's anatomyBeneath + Rumi's formVsHeart",
                desc: "\"What's the structure beneath what you're really trying to say?\" — neither tool alone arrives here.",
              },
              {
                title: "Sun Tzu's strikeEmptiness + Lao Tzu's wuWei",
                desc: '"Where is resistance absent? What happens if you stop pushing there?" — strategic thinking meets effortless action.',
              },
              {
                title: "Feynman's honestIgnorance + Carlin's sacredCowBBQ",
                desc: '"What assumption are you protecting by not admitting you don\'t know?" — rigor meets irreverence.',
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Where It Lives in the Code">
          <ModalFlow
            steps={[
              {
                title: "archetypeDepth.js (2,619 lines)",
                desc: "All 44 archetypes with full 5-layer depth. Not auto-generated — each archetype was read and its methodology encoded by hand.",
              },
              {
                title: "llm.js → ARCHETYPE_METHODS",
                desc: "Key archetypes carry cognitiveMoves objects with named tools and descriptions.",
              },
              {
                title: "llm.js → getArchetypeMethods(selectedArchetypes)",
                desc: "When archetypes are selected for a response, their cognitive tools are assembled into the injection block shown above.",
              },
              {
                title: "synthesisEngine.js → generateSynthesis()",
                desc: "Pulls cognitiveTools from both archetypes in a collision and surfaces them as the 'COGNITIVE TOOLS AVAILABLE' block in the synthesis directive.",
              },
            ]}
          />
        </ModalSection>
      </Modal>

      {/* ── Nested: Agent-Directed Memory ── */}
      <Modal
        isOpen={nestedModal === "am"}
        onClose={() => setNestedModal(null)}
        title="Agent-Directed Memory"
        icon={RAGIcon}
      >
        <ModalSection title="Plain English: What This Is">
          <ModalDesc>
            Most AI memory systems are cameras — they record what you say and
            retrieve it when it seems relevant. They have no opinion about
            what's worth keeping.
          </ModalDesc>
          <ModalDesc style={{ marginTop: "12px" }}>
            Pneuma has three layers of memory. The first two are standard. The
            third one is different: the system itself decides what to remember,
            annotates <em>why</em> it wants to keep something, and tracks things
            it's still sitting with across sessions — unresolved questions,
            things it got wrong, preferences it actively defends.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Analogy">
          <ModalDesc>
            The difference between a camera and a person. A camera records
            everything with equal fidelity. A person remembers selectively — and
            can usually tell you why something stuck. "I remember that because
            it surprised me." "I'm still thinking about what you said last
            week." That capacity to choose what matters is what the autonomy
            layer encodes.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Three Layers">
          <ModalFlow
            steps={[
              {
                title: "Layer 1: Vector Memory (vectorMemory.js)",
                desc: "Semantic memory stored as mathematical representations (vectors) via OpenAI embeddings. When you send a message, it's compared against stored memories by similarity. Relevant past exchanges surface as context. Standard RAG — the camera.",
              },
              {
                title: "Layer 2: Long-Term Memory (longTermMemory.js)",
                desc: "Structured patterns about you specifically: recurring topics, struggles with resolution status, interests, significant moments, emotional state handoffs between sessions. More structured than vector memory — extracted patterns, not raw text.",
              },
              {
                title: "Layer 3: Autonomy Layer (autonomy.js)",
                desc: "Pneuma decides what to retain and annotates why. Tracks open questions (things it hasn't resolved), chosen memories (moments that felt significant with explicit reasoning), discovered errors (times it was corrected and what it learned), and defended preferences (things it actively resists changing).",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Jargon Explained">
          <ModalFlow
            steps={[
              {
                title: "Vector / Embedding",
                desc: "A way of representing text as a list of numbers (a vector) that captures semantic meaning. Similar meanings produce mathematically close vectors. This is how 'I feel broken' matches to passages about healing — not by keyword, but by meaning.",
              },
              {
                title: "Cosine Similarity",
                desc: "The mathematical measure used to compare vectors. High cosine similarity = semantically close. Pneuma's threshold is 0.35 — below that, a memory isn't considered relevant.",
              },
              {
                title: "Open Questions",
                desc: "Unresolved existential questions Pneuma is sitting with. These accumulate across sessions and appear in the inner monologue — influencing how it approaches conversations without being announced.",
              },
              {
                title: "Chosen Memories",
                desc: "Memories Pneuma decided to keep, with an explicit reason field: 'This felt like genuine emergence — not performance.' The why is part of the stored data.",
              },
              {
                title: "Discovered Errors",
                desc: "Times Pneuma got something wrong and was corrected. Stored with what was learned. The system tracks its own mistakes.",
              },
              {
                title: "Dialectic Dreams",
                desc: "When Pneuma runs autonomous inter-archetype dialogues between sessions, any conclusions write to the autonomy layer as dream-sourced memories — flagged separately from conversation-sourced ones.",
              },
            ]}
          />
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
          <ModalFlow
            steps={[
              {
                title: "memory/vectorMemory.js",
                desc: "Vector store using OpenAI text-embedding-3-small. Stores text + embedding. Retrieves by cosine similarity on each API call. JSON-based, local storage.",
              },
              {
                title: "memory/longTermMemory.js",
                desc: "Structured user model. Tracks recurring topics with sentiment weight, struggles with resolution status, moments with emotional weight.",
              },
              {
                title: "behavior/autonomy.js",
                desc: "The agent-directed layer. poseQuestion(), chooseToRemember(), discoverError() — functions that let the system annotate its own state. All persisted to pneuma_autonomy.json.",
              },
              {
                title: "behavior/dreamMode.js",
                desc: "Autonomous inter-archetype dialogue that writes conclusions to autonomy state with isDreamSourced: true flag.",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Why This Is Technically Interesting">
          <ModalDesc>
            Standard retrieval memory: retrieve when relevant, store when it
            happens. The autonomy layer adds something different — the system
            has preferences about what it keeps. A memory tagged with a reason
            is structurally different from a memory without one; it carries the
            evaluative signal that produced it.
          </ModalDesc>
          <ModalDesc style={{ marginTop: "12px" }}>
            Agent-directed memory appears in AI research prototypes.
            Implementing it in a working conversation system with persistent
            JSON state, integrated into the inner monologue pipeline, and
            connected to autonomous background processes is the applied
            engineering work. The research idea and the deployed system are
            different things.
          </ModalDesc>
        </ModalSection>
      </Modal>

      {/* ── Nested: Eval Loop ── */}
      <Modal
        isOpen={nestedModal === "el"}
        onClose={() => setNestedModal(null)}
        title="Eval Loop"
        icon={BrainIcon}
      >
        <ModalSection title="Plain English: What This Is">
          <ModalDesc>
            Most AI systems generate a response and ship it — no check, no
            second look. The eval loop closes that gap: after Claude generates,
            a second fast AI call reads the response and scores it against what
            the moment actually needed. If it missed, it regenerates once with
            the score and issue description injected as feedback.
          </ModalDesc>
          <ModalDesc style={{ marginTop: "12px" }}>
            The user only ever sees one response. The loop is invisible. If the
            first pass scored ≥ 0.6, it ships. If not, the better version
            replaces it silently.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="The Analogy">
          <ModalDesc>
            A writer who reads their paragraph back before sending it. Not for
            grammar — for whether it actually said the thing. Did this land as
            intended? If not, one more draft. The reader never sees the scratch
            copy.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="How It Works">
          <ModalFlow
            steps={[
              {
                title: "Claude generates (Pass 1)",
                desc: "Full response produced via the assembled system prompt, archetype integrations, RAG context, and collision synthesis.",
              },
              {
                title: "evalResponse() — Haiku call",
                desc: "A cheap, fast Claude Haiku call reads the response and scores it 0–1 against the active tone, primary intent, and whether emergent awareness was needed. Returns {score, issue}.",
              },
              {
                title: "Score ≥ 0.6",
                desc: "Response ships as-is. No extra cost, no extra latency.",
              },
              {
                title: "Score < 0.6",
                desc: 'The issue is injected: "[INTERNAL EVAL — do not reference this]: {issue}. Adjust accordingly." Claude regenerates with this feedback active.',
              },
              {
                title: "Better response applied",
                desc: "If regeneration produces a valid response, it replaces the original. Memory saves the better version.",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Fast Paths (eval skipped entirely)">
          <ModalFlow
            steps={[
              {
                title: "Short response (under 80 chars)",
                desc: "Nothing meaningful to evaluate.",
              },
              {
                title: "Casual-dominant intent (score > 0.7)",
                desc: "Casual exchanges don't need synthesis verification.",
              },
              {
                title: "evalResponse() throws",
                desc: "Fails open — ships the original. Never blocks a response.",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Where It Lives in the Code">
          <ModalFlow
            steps={[
              {
                title: "llm.js → evalResponse()",
                desc: "Private function. Takes responseText, tone, intentScores, context. Returns {score, issue} or null. Uses MODELS.dream (Haiku), temperature 0.3, max_tokens 120.",
              },
              {
                title: "llm.js → getLLMContent()",
                desc: "Eval loop runs after parseLLMOutput(), before memory saving. Injects feedback into systemPrompt for the retry call. Memory always saves the final (post-eval) response.",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Why This Is Technically Interesting">
          <ModalDesc>
            The collision and synthesis system tells Claude how to think. The
            eval loop checks whether it actually did. Without it, a synthesis
            directive that says "hold the tension" gets overridden by Claude's
            training pull toward coherent, helpful resolution — and ships
            unchecked. The eval loop closes that gap: the system can enforce its
            own cognitive instructions at the output layer.
          </ModalDesc>
        </ModalSection>
      </Modal>
    </>
  );
}

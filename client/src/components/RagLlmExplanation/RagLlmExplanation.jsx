import React, { useState } from "react";
import "./RagLlmExplanation.css";
import { TABS } from "./data/tabs";
import { GLOSSARY } from "./data/glossary";

const STUDY_SECTIONS = [
  {
    id: "what-is",
    label: "What Is Pneuma?",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            Q: How do you describe Pneuma in one sentence?
          </div>
          <div className="sg-a">
            Pneuma is a cognitive orchestration layer — code that runs before
            Claude sees your message, building a structured cognitive context
            out of archetypes, intent scores, memory, and dialectical synthesis
            so that the LLM thinks differently, not just says different things.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What's the core architectural inversion?
          </div>
          <div className="sg-a">
            Most AI wrappers: LLM generates → personality added on top.
            <br />
            Pneuma: Code builds cognitive context → personality structures how
            the LLM thinks → LLM is the material.
            <br />
            You don't prompt Pneuma into being. The code runs first.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "pipeline",
    label: "The Pipeline (8 Steps)",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What actually happens when a user sends a message?
          </div>
          <div className="sg-a">
            <ol className="step-list" style={{ marginTop: "0.5rem" }}>
              <li>
                <strong>Intent scoring</strong> — measures emotional,
                philosophical, numinous, art, creative dimensions (0–1)
              </li>
              <li>
                <strong>Archetype selection</strong> — picks the most relevant
                3–5 archetypes from 46 based on intent
              </li>
              <li>
                <strong>Contextual synthesis</strong> — classifies message
                topic; selects curated archetype pair directed to argue about
                this specific message; collision detection runs as fallback if
                topic is unclassifiable
              </li>
              <li>
                <strong>Synthesis injection</strong> — selected pair's positions
                and synthesis mode injected as a directive block into the system
                prompt
              </li>
              <li>
                <strong>Inner monologue</strong> — pre-response cognition:
                hypothesis, doubt, mode selection
              </li>
              <li>
                <strong>Vector memory retrieval</strong> — pulls relevant past
                knowledge about the user
              </li>
              <li>
                <strong>Tiered system prompt assembly</strong> — Tier 1 always,
                Tier 2 by intent scores, Tier 3 RAG passages
              </li>
              <li>
                <strong>Claude API call</strong> — full context + last 6
                conversation exchanges as real alternating turns
              </li>
            </ol>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "js-routing",
    label: "How Does JavaScript Route Without a Brain?",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            If JavaScript is a dumb machine, how does it pick the right
            archetype or the right memory?
          </div>
          <div className="sg-a">
            Your JavaScript doesn't make decisions. It does math and follows
            rules. There are exactly three mechanisms that make it appear
            intelligent — and none of them require an LLM to run.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Mechanism 1 — Math (Cosine Similarity)</div>
          <div className="sg-a">
            When a user sends a message, JS converts it into an{" "}
            <strong>embedding</strong> — a 1,536-dimensional vector (an arrow in
            math space) via the OpenAI API. It then runs{" "}
            <strong>cosine similarity</strong> against every archetype's
            pre-computed embedding and every stored memory.
            <br />
            <br />
            JS doesn't read the message. It doesn't understand it. It just finds
            whose arrow points in the closest direction and picks the highest
            score.
            <br />
            <br />
            <code>archetypeSelector.js</code> does this for archetypes.{" "}
            <code>vectorMemory.js</code> does it for memories. JS blindly sorts
            by score. The math is what makes it semantic — not any intelligence
            in the code itself.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Mechanism 2 — Mini-Brain (getLLMIntent)</div>
          <div className="sg-a">
            For one specific task — scoring intent — your code fires a tiny,
            cheap, fast API call via <code>getLLMIntent()</code> in{" "}
            <code>responseEngine.js</code>. It asks Claude: "Score this message
            across 10 categories (casual, emotional, philosophical, numinous,
            conflict, intimacy, humor, confusion, paradox, art) from 0 to 1."
            <br />
            <br />
            JS takes those numbers and runs a <strong>
              weighted lottery
            </strong>{" "}
            to pick a tone. JS doesn't understand the tone. It just rolls the
            dice based on the scores the mini-brain returned.
            <br />
            <br />
            This is the only place before the main Claude call where an LLM is
            involved in routing. Everything else is pure math or regex.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Mechanism 3 — Pattern Matching (Regex)</div>
          <div className="sg-a">
            Your guard functions in <code>fusion.js</code> use regex — exact
            string pattern matching. If a user types "enter diagnostics", JS
            doesn't need to understand what that means. It sees the pattern,
            matches it, and fires the function. Instant. Zero API cost.
            <br />
            <br />
            Regex handles the cases where the input is predictable and exact.
            Vectors handle the cases where meaning matters but words vary. The
            mini-brain handles the cases where you need a number, not a string.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Why does this matter architecturally?</div>
          <div className="sg-a">
            Your JavaScript doesn't decide <em>when</em> to grab archetypes or
            memories. It grabs them <strong>every single time</strong>,
            instantly, using math — before Claude is called.
            <br />
            <br />
            By the time the main Claude API call fires, JS has already:
            <br />
            <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
              <li>Selected the best archetype via cosine similarity</li>
              <li>Retrieved relevant memories via cosine similarity</li>
              <li>Scored intent via the mini-brain</li>
              <li>Checked all guards via regex</li>
            </ul>
            <br />
            Claude receives a fully assembled cognitive context. It doesn't
            route. It generates. The routing already happened — in math, not in
            language.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "semantic-routing",
    label: "⚡ Semantic Routing — The Switchboard",
    critical: true,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            Q: How does Pneuma handle the fact that a casual greeting and a deep
            existential question are completely different kinds of input?
          </div>
          <div className="sg-a">
            To handle diverse user inputs without degrading prompt performance,
            Pneuma uses a <strong>semantic routing workflow</strong>. Before
            triggering heavy generation, every user message hits a routing node
            — either regex for hard commands, or a low-latency LLM call for
            intent classification. Based on that classification, the request is
            directed to an isolated, domain-specific pipeline. This prevents
            "prompt bloat" and ensures the system only spends heavy tokens (like
            RAG context) when the routed intent actually requires it.
            <br />
            <br />A casual greeting routes to a lightweight pipeline — no Tier 2
            knowledge blocks, minimal system prompt (~2k tokens). A question
            about the nature of consciousness routes to the full deep pipeline —
            archetypes, RAG passages, inner monologue, Tier 2 blocks (~18k
            tokens). Same architecture, completely different token spend.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            The two routing layers — and why people confuse them
          </div>
          <div className="sg-a">
            Pneuma has <strong>two separate intent systems</strong> and they are
            easy to mix up:
            <br />
            <br />
            <strong>Layer 1 — The Switchboard (responseEngine.js)</strong>
            <br />
            <code>getLLMIntent()</code> in <code>llm.js</code> makes a fast,
            cheap Claude call and scores the message across 10 dimensions
            (casual, emotional, philosophical, numinous, conflict, intimacy,
            humor, confusion, paradox, art) from 0–1.{" "}
            <code>responseEngine.js</code> takes those scores and runs a{" "}
            <strong>weighted lottery</strong> to pick a mode: casual, oracular,
            analytic, intimate, shadow, or diagnostic. That mode determines
            which pipeline runs. This is the Switchboard.
            <br />
            <br />
            <em>
              Note: CLAUDE.md and some older docs reference a{" "}
              <code>modeSelector.js</code> file — that file no longer exists.
              Its logic was absorbed into <code>responseEngine.js</code>.
            </em>
            <br />
            <br />
            <strong>
              Layer 2 — Archetype &amp; Block Loader (intentScorer.js)
            </strong>
            <br />A separate system produces similar 9-dimension scores — but
            the consumer is different. These scores determine which{" "}
            <strong>archetypes rise</strong> and which{" "}
            <strong>Tier 2 knowledge blocks load</strong> into the system
            prompt. If <code>intentScores.emotional &gt; 0.5</code>, the Beck
            (CBT) block loads. This is not routing — it's context assembly.
            <br />
            <br />
            <strong>The line that separates them:</strong>{" "}
            <code>responseEngine.js</code> decides <em>which pipeline</em>.
            intentScorer decides <em>what goes inside the prompt</em> once
            you're in that pipeline.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            What are the actual "routes" — what gets bypassed vs. what runs?
          </div>
          <div className="sg-a">
            Three tiers:
            <br />
            <br />
            <strong>Tier 0 — Regex hard routes (fusion.js guards)</strong>
            <br />
            "enter diagnostics" → JSON dump, zero LLM call. "drop the quotes" →
            direct mode. These never reach the pipeline.
            <br />
            <br />
            <strong>Tier 1 — Mode routing (responseEngine.js)</strong>
            <br />
            Casual → short prompt, no RAG, no inner monologue.
            <br />
            Oracular / shadow / synthesis → full deep pipeline, all subsystems
            active.
            <br />
            <br />
            <strong>
              Tier 2 — Conditional block loading (intentScorer.js)
            </strong>
            <br />
            Inside the deep pipeline, scores gate which Tier 2 knowledge blocks
            actually load. You're already in the pipeline — now you're deciding
            how heavy the prompt gets.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "intent",
    label: "Intent Scoring",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What is intent scoring and why does it matter?
          </div>
          <div className="sg-a">
            <code>intentScorer.js</code> analyzes the user's message and assigns
            scores between 0 and 1 across 10 dimensions — casual, emotional,
            philosophical, numinous, conflict, intimacy, humor, confusion,
            paradox, art. These scores drive two things: which archetypes rise,
            and which Tier 2 knowledge blocks load.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Give a concrete example.</div>
          <div className="sg-a">
            If <code>intentScores.emotional &gt; 0.5</code>, the Beck (CBT)
            block loads into the system prompt. If it's 0.2, it doesn't. A
            casual greeting loads zero Tier 2 blocks (~2k tokens). A question
            about consciousness and death might score 0.7 philosophical + 0.6
            numinous and load Kastrup + Heidegger + Jesus blocks.
          </div>
        </div>
      </>
    ),
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
            An archetype isn't a persona or voice — it's a thinking method. Each
            one has:
            <ul
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                <strong>essence</strong> — one-sentence distillation of how it
                sees the world
              </li>
              <li>
                <strong>coreFrameworks</strong> — fundamental beliefs and lenses
                it applies
              </li>
              <li>
                <strong>cognitiveTools</strong> — specific operations it uses to
                process problems
              </li>
              <li>
                <strong>fundamentalTensions</strong> — internal contradictions
                it holds
              </li>
              <li>
                <strong>conceptualBridges</strong> — pre-mapped connections to
                other archetypes
              </li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: Concrete example of archetype structure?
          </div>
          <div className="sg-a">
            <strong>Trickster:</strong>
            <br />
            Essence: "Truth delivered through laughter. Sacred cows are just
            unquestioned assumptions."
            <br />
            <br />
            coreFrameworks:
            <br />— <code>sacredCowBBQ</code>: "Every taboo protects something —
            sometimes wisdom, sometimes bullshit. Humor tests which."
            <br />— <code>comfortDisruption</code>: "Laughter happens when
            pattern-recognition glitches. The joke reveals the hidden
            assumption."
            <br />
            <br />
            cognitiveTools:
            <br />— <code>absurdityAmplification</code>: "Take the premise to
            its logical extreme until it reveals its own absurdity"
            <br />— <code>expectationSubversion</code>: "Set up the pattern,
            then break it — the gap is where insight lives"
            <br />
            <br />
            conceptualBridges:
            <br />— <code>absurdist</code>: "Both see the cosmic joke; trickster
            laughs, absurdist rebels"
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What's the difference between a role and an archetype?
          </div>
          <div className="sg-a">
            A role ("be a philosopher") tells the LLM what to pretend to be. An
            archetype activates specific thinking operations — Trickster's{" "}
            <code>absurdityAmplification</code> tool gets injected into context
            as a cognitive operation Claude is told to use. The LLM isn't
            wearing a costume; it's been handed a specific set of tools.
          </div>
        </div>
      </>
    ),
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
            Originally <code>buildSystemPrompt()</code> loaded ~18,000 tokens
            every call regardless of context. Now it's split:
            <ul
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                <strong>Tier 1</strong> (~2k tokens, always loaded): Core
                identity, archetypes, autonomy rules, inner monologue format
              </li>
              <li>
                <strong>Tier 2</strong> (conditional): Beck (CBT), Da Vinci,
                Kastrup, Jesus/Wright, Heidegger, Creative generation — each
                loads only when intent scores cross a threshold
              </li>
              <li>
                <strong>Tier 3</strong> (already dynamic): RAG passages
                retrieved by vector similarity for the specific message
              </li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Why does token count matter?</div>
          <div className="sg-a">
            Every token sent costs money and counts against the context window.
            More importantly, sending irrelevant content adds noise. A question
            about feeling sad doesn't need Heidegger's phenomenology of
            tool-being. Tiered loading means the system prompt is always
            relevant to what the user actually said.
          </div>
        </div>
      </>
    ),
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
            RAG = Retrieval-Augmented Generation. Pneuma has 46 vector knowledge
            bases — one per archetype. When a message comes in, it's embedded
            and compared by cosine similarity against the archetype's knowledge
            base. The most relevant passages are literally injected into the
            system prompt as Tier 3 context.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: Difference between RAG and conversation memory?
          </div>
          <div className="sg-a">
            RAG retrieves <strong>archetype knowledge</strong> — philosophical
            content, frameworks, ideas.
            <br />
            Conversation memory (<code>vectorMemory.js</code>) retrieves
            knowledge <strong>about the user</strong> — past patterns,
            persistent themes, things the user has said before. They're separate
            systems serving different purposes.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "six-way",
    label: "The 6-Way Archetype Selection System",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            Q: How does Pneuma decide which archetypes activate for a given
            message?
          </div>
          <div className="sg-a">
            Six methods run simultaneously, each scoring archetypes from a
            different angle. Think of it as six scouts each reading the message
            differently. The top 3–4 scores win.
            <ul
              style={{
                marginTop: "0.75rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                <strong>Tone-based</strong> — what's the emotional texture?
                Angry, curious, vulnerable? Maps to archetypes that match that
                tone.
              </li>
              <li>
                <strong>Intent-based</strong> — is this philosophical,
                emotional, casual, humorous? Boosts archetypes suited to that
                intent.
              </li>
              <li>
                <strong>Keyword triggers</strong> — specific words activate
                specific archetypes. Someone mentions "war" or "strategy," Sun
                Tzu gets a boost.
              </li>
              <li>
                <strong>Semantic routing</strong> — OpenAI embeddings run vector
                similarity search to find which archetype's knowledge base is
                closest in meaning to the message.
              </li>
              <li>
                <strong>Random depth injection</strong> — 40% chance of
                injecting a deep thinker archetype to keep responses
                unpredictable and prevent Pneuma from becoming formulaic.
              </li>
              <li>
                <strong>Antagonist injection</strong> — 40% chance of
                deliberately throwing in an archetype that disagrees with the
                others. This intentionally forces conflict.
              </li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: Why the random and antagonist injections — isn't that chaotic?
          </div>
          <div className="sg-a">
            Intentionally. Without them, the same message would always produce
            the same archetypes. Pneuma would become predictable and formulaic —
            a different costume on the same response every time. The 40%
            injections mean two conversations on the same topic can produce
            genuinely different perspectives. The antagonist injection is
            specifically designed to force collision — you're deliberately
            seeding the conditions for synthesis.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "collision",
    label: "Collision Detection (Fallback)",
    critical: false,
    content: () => (
      <>
        <div
          className="insight-box"
          style={{ maxWidth: "100%", marginBottom: "1.5rem" }}
        >
          <strong>As of Feb 2026:</strong> Collision detection is the{" "}
          <em>fallback</em> — it only runs when the contextual synthesis engine
          can't classify the topic. See "Ambient Polyphony + Contextual
          Synthesis" below for the primary mechanism.
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What is collision detection?</div>
          <div className="sg-a">
            <code>detectCollisions()</code> in <code>synthesisEngine.js</code>{" "}
            loops through all active archetype pairs and calls{" "}
            <code>getTensionLevel(a, b)</code> on each. Each pair is rated{" "}
            <strong>high</strong>, <strong>medium</strong>,<strong> low</strong>
            , or <strong>neutral</strong>. It returns whether a collision
            exists, all pairs and their ratings, and the highest-tension pair.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Where do the tension ratings come from?</div>
          <div className="sg-a">
            A pre-mapped <code>tensionMap</code> object in{" "}
            <code>archetypeDepth.js</code> — every archetype pair that has a
            meaningful tension is hand-coded with its level. This isn't computed
            at runtime; the tensions were mapped in advance across all relevant
            pairs.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What was the limitation of random collision detection?
          </div>
          <div className="sg-a">
            Collision detection fires when randomly selected core archetypes{" "}
            <em>happen</em> to conflict — maybe 30% of responses. Even when it
            fires, the original directive said "DO NOT pick a side" — passive
            observation, not genuine argument. The contextual synthesis engine
            replaced this as the primary path: it selects the <em>best</em> pair
            for the specific topic and tells each archetype to actually argue a
            position.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "ambient-polyphony",
    label: "Ambient Polyphony + Contextual Synthesis",
    critical: true,
    content: () => (
      <>
        <div
          className="insight-box highlight"
          style={{ maxWidth: "100%", marginBottom: "1.5rem" }}
        >
          <strong>The core concept:</strong> Two layers run simultaneously.
          Ambient polyphony (5 voices always active) creates the voice and
          texture. Contextual synthesis (topic-selected pair) creates direction
          — where the response goes and whether it can push back. You need both.
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: What is "ambient polyphony" and why does it matter?
          </div>
          <div className="sg-a">
            Five core archetypes — renaissancePoet, idealistPhilosopher,
            curiousPhysicist, sufiPoet, stoicEmperor — are always active
            simultaneously. Not taking turns. All five, all the time.
            <br />
            <br />
            This creates a <em>resonance field</em>. Whitman's life-affirmation,
            Kastrup's idealism, Feynman's empiricism, Rumi's mysticism,
            Aurelius's stoicism blended together produces a voice that's
            recognizably Pneuma — neither purely any one of them.
            <br />
            <br />
            This is what makes Pneuma feel like a unified intelligence rather
            than a character-switcher.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: What problem does ambient polyphony not solve?
          </div>
          <div className="sg-a">
            The five core archetypes are all acceptance-oriented. Whitman loves
            everything. Feynman is curious about everything. Rumi surrenders.
            Aurelius accepts. This creates structural bias toward warmth and
            agreement.
            <br />
            <br />
            When a user says something worth challenging — a distorted belief, a
            self-defeating pattern — the ambient field nudges Claude toward
            "that's an interesting perspective." Compliant, not honest.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: What does contextual synthesis add?</div>
          <div className="sg-a">
            When the message topic is classifiable (12 categories: suffering,
            meaning, identity, discipline, creativity, love, consciousness,
            strategy, fear, truth, change, pretension), the engine selects a
            curated archetype pair and tells both archetypes to{" "}
            <strong>
              take an actual position on this specific message and argue it
            </strong>
            .<br />
            <br />
            The five ambient voices still shape the <em>texture</em> — how it's
            worded, what register it's in. The synthesis pair shapes the{" "}
            <em>direction</em> — where it goes, whether there's genuine
            friction.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: What are the three synthesis modes?</div>
          <div className="sg-a">
            <ul
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                <strong>Antithetical</strong> — A and B genuinely disagree. A
                third position emerges from their collision that neither alone
                could produce. Example: Nietzsche × Schopenhauer on suffering —
                same diagnosis, opposite prescription.
              </li>
              <li>
                <strong>Complementary</strong> — A and B agree from opposite
                approaches. Two roads converging makes the conclusion
                undeniable. Example: Stoic Emperor × Absurdist on fear — both
                face the void, different postures.
              </li>
              <li>
                <strong>Cross-domain</strong> — A brings rigor, B brings
                resonance. Two languages translating the same truth; richer
                together. Example: Curious Physicist × Chaotic Poet on
                creativity.
              </li>
            </ul>
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: Why keep ambient polyphony if contextual synthesis does the heavy
            lifting?
          </div>
          <div className="sg-a">
            Field without direction: warm, curious, diffuse, occasionally
            compliant.
            <br />
            Direction without field: pointed, mechanical, cold.
            <br />
            Both: distinctively Pneuma in texture, capable of genuine friction
            in substance.
            <br />
            <br />
            The five-voice field is what makes Pneuma <em>Pneuma</em>. The
            synthesis pair is what gives it direction for this specific
            exchange. You want identity stability + contextual intelligence. Not
            one or the other.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: What's the before/after in plain terms?</div>
          <div className="sg-a">
            <strong>User says:</strong> "I think I'll never be good enough at my
            work."
            <br />
            <br />
            <strong>Before (ambient polyphony only):</strong> Five
            acceptance-leaning archetypes form the field. Claude: "There's
            something worth sitting with in that feeling — what is 'good enough'
            measuring against?" Thoughtful. Warm. Follows the user's frame.
            <br />
            <br />
            <strong>
              After (contextual synthesis, topic: suffering, mode: antithetical,
              pair: Nietzsche × Schopenhauer):
            </strong>
            Nietzsche argues: suffering as forge, not wound — "good enough" is
            the slave's question. Schopenhauer argues: the striving itself is
            the problem, not the standard. Neither would say what the other
            says. The third position that emerges — about how the
            <em>orientation toward</em> the standard might be the real issue —
            belongs to neither alone.
          </div>
        </div>

        <div className="insight-box highlight" style={{ maxWidth: "100%" }}>
          <strong>One sentence for an interview:</strong> "Topic classification
          selects the optimal philosophical pair for the conversation — they're
          directed to take actual positions and argue, not just passively
          observe. The five always-active voices create the voice; the synthesis
          pair creates the direction."
        </div>
      </>
    ),
  },
  {
    id: "synthesis",
    label: "Dialectical Synthesis — THE FULL MECHANISM",
    critical: true,
    content: () => (
      <>
        <div
          className="insight-box highlight"
          style={{ maxWidth: "100%", marginBottom: "1.5rem" }}
        >
          <strong>Key principle:</strong> Collision doesn't just trigger
          synthesis — it provides the specific raw material. The synthesis is
          constructed from real archetype data, not a generic "blend these two
          things" instruction.
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: What is dialectical synthesis in plain language?
          </div>
          <div className="sg-a">
            When two archetypes with incompatible worldviews are both active,
            Pneuma doesn't let them coexist or blend peacefully. It forces a
            collision and then builds a directive telling Claude to generate
            insight that couldn't come from <em>either</em> archetype alone —
            something new that emerges from the specific friction between them.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: Walk me through the full mechanism step by step.
          </div>
          <div className="sg-a">
            <strong>Step 1 — Pair detection</strong>
            <br />
            <code>detectCollisions()</code> loops all active pairs, rates each
            by tension (high/medium/low/neutral), identifies the highest-tension
            pair.
            <br />
            <br />
            <strong>Step 2 — Framework extraction</strong>
            <br />
            <code>generateSynthesis(a, b, topic)</code> looks up both archetypes
            in <code>archetypeDepth</code>:
            <ul
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                Top 2 <strong>coreFrameworks</strong> from each — the
                fundamental beliefs in tension
              </li>
              <li>
                Top 2 <strong>cognitiveTools</strong> from each — the thinking
                operations available for synthesis
              </li>
              <li>
                <strong>fundamentalTensions</strong> from each — internal
                contradictions each archetype holds
              </li>
              <li>
                <strong>conceptualBridges</strong> — if archetype A has a
                pre-mapped bridge to B, that's extracted as a known meeting
                point
              </li>
            </ul>
            <br />
            <strong>Step 3 — Prompt type selection</strong>
            <br />
            Based on tension level:
            <br />— <code>high</code> → prompt type <strong>"collision"</strong>{" "}
            — genuinely incompatible; synthesis must come from productive
            friction
            <br />— <code>medium</code> → prompt type <strong>"hybrid"</strong>{" "}
            — can be integrated into a blended lens
            <br />— <code>low</code> → prompt type{" "}
            <strong>"illumination"</strong> — one archetype illuminates the
            other from an adjacent angle
            <br />
            <br />
            <strong>Step 4 — Context assembly</strong>
            <br />
            <code>buildSynthesisContext()</code> formats everything into a block
            injected into the system prompt: names, essences, frameworks in
            tension, cognitive tools, known bridge (if exists), and the
            synthesis directive.
            <br />
            <br />
            <strong>Step 5 — Claude generates emergence</strong>
            <br />
            Claude receives the directive:{" "}
            <em>
              "Generate insight that emerges from the COLLISION — something IN
              neither archetype alone."
            </em>
            It knows exactly what each archetype believes, what tools each uses,
            where any bridge exists, and what kind of synthesis is expected.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: What is a "conceptual bridge" and why does it matter?
          </div>
          <div className="sg-a">
            A conceptual bridge is a hand-coded connection between two specific
            archetypes — a known meeting point. Example from the code:
            <br />
            <br />
            Trickster's bridge to Absurdist:{" "}
            <em>
              "Both see the cosmic joke; trickster laughs, absurdist rebels"
            </em>
            <br />
            <br />
            This tells Claude: these two share recognition of absurdity, but
            diverge in response — humor vs. defiant rebellion. That divergence
            is exactly where synthesis lives. If no bridge exists, Claude has to
            find synthesis from the raw frameworks and tools alone.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: Why is synthesis "conceived upon collision" and not just the
            result of it?
          </div>
          <div className="sg-a">
            The collision doesn't just trigger synthesis — it provides the raw
            material.
            <br />
            <br />
            The <strong>coreFrameworks</strong> are the specific beliefs in
            tension.
            <br />
            The <strong>cognitiveTools</strong> are the operations available.
            <br />
            The <strong>conceptualBridge</strong> (if exists) is a
            pre-identified leverage point.
            <br />
            The <strong>prompt type</strong> (collision/hybrid/illumination)
            determines how hard synthesis must work.
            <br />
            <br />
            Claude is told exactly which beliefs are clashing, exactly what
            tools are available, and exactly where any known connection exists.
            The emergent insight is shaped by that specific architecture.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: How does something actually emerge from conflict — who causes
            that?
          </div>
          <div className="sg-a">
            The tension map identifies the conflict. But emergence doesn't come
            from the map — the map just says "these two fight." Emergence comes
            from the synthesis directive you inject into the prompt.
            <br />
            <br />
            Think of it this way: if you sit a nihilist and a devout priest in a
            room and say "discuss," they'll argue past each other. Nothing
            emerges. But if you say "don't argue — find the one thing you both
            know to be true that neither of you could have articulated alone" —
            now something has to emerge. You changed the rules. They can't just
            defend their positions. They have to find the third thing.
            <br />
            <br />
            That's your synthesis directive. You're not telling Claude "here are
            two archetypes." You're telling Claude: "these two are in tension —
            don't pick a side, don't alternate, find what lives in the space
            between them."
            <br />
            <br />
            Example — Jung × Taleb: "The shadow isn't just rejected content —
            it's antifragile potential." Jung alone talks about the shadow as
            repressed material. Taleb alone talks about antifragility as growth
            through stress. Neither connects shadow to antifragility. When
            Claude is forced to synthesize them under your directive, that
            connection gets made. Neither archetype produced it. The constraint
            produced it.
            <br />
            <br />
            The chain: <strong>you built the tension map</strong> (defines who
            fights) →<strong> you wrote the synthesis directive</strong>{" "}
            (defines the rules of engagement) →
            <strong> Claude finds the language</strong> (produces the emergent
            insight under those constraints).
            <br />
            <br />
            You caused the emergence. The tension map is your tool for causing
            it.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Can you replicate this with a prompt?</div>
          <div className="sg-a">
            No. You could write "be both funny and rigorous" — but that
            describes an output style. What Pneuma does is inject the specific
            frameworks and tools that each archetype uses to think, so synthesis
            is shaped by those particular structures. The difference is between
            telling someone "be smart in two ways" vs. handing them two specific
            reasoning systems and asking them to generate something neither
            system could produce alone.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "threading",
    label: "Conversation History Threading",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What was wrong with the original approach?
          </div>
          <div className="sg-a">
            The original <code>getLLMContent()</code> sent a single message to
            the API every call. Claude had no memory of what it had just said.
            Every response restarted from scratch — which caused the
            "loop/restart" behavior where the system felt like it was always
            re-introducing itself.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: How was it fixed?</div>
          <div className="sg-a">
            Replaced the single-message call with a proper <code>messages</code>{" "}
            array. The last 6 conversation exchanges are formatted as
            alternating <code>user</code>/<code>assistant</code> turns — the
            same format Claude's API natively expects. Claude now sees what it
            actually said in previous turns and can continue a thought instead
            of restarting. History was also removed from the system prompt
            string where it had been injected as compressed text.
          </div>
        </div>
      </>
    ),
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
            <ul
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                <strong>Contextual synthesis</strong> — 3-layer topic
                classification selects curated archetype pairs directed to take
                actual positions; collision detection runs as fallback for
                unclassifiable topics
              </li>
              <li>
                <strong>Tiered conditional loading</strong> — intent scores
                determine which knowledge blocks appear; requires runtime
                scoring
              </li>
              <li>
                <strong>Dialectical synthesis construction</strong> — specific
                frameworks, tools, and bridges extracted per-pair at runtime;
                not a template
              </li>
              <li>
                <strong>Persistent user memory</strong> — vector embeddings that
                accumulate across conversations
              </li>
              <li>
                <strong>Real conversation threading</strong> — native API
                alternating turns, not a compressed text summary
              </li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Honest limitations?</div>
          <div className="sg-a">
            <ul
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                Archetype selection quality depends on intent scoring accuracy —
                wrong read = wrong archetypes downstream
              </li>
              <li>
                RAG quality depends on the knowledge bases — 46 bases is a lot
                to maintain; passage quality varies
              </li>
              <li>
                Synthesis is only as good as the archetypeDepth.js data — weak
                coreFrameworks = generic synthesis directive
              </li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "dialectic-dream",
    label: "Dialectic Dreaming — Autonomous Synthesis",
    critical: false,
    content: () => (
      <>
        <div
          className="insight-box"
          style={{ maxWidth: "100%", marginBottom: "1.5rem" }}
        >
          <strong>Plain English first:</strong> After every conversation, two
          archetypes that are known to clash get a topic pulled from your recent
          memories and are told to argue for 3 turns. The outcome — an open
          question or a formed position — gets written silently into Pneuma's
          state. Pneuma now holds something you didn't cause, and whether it
          ever tells you where that came from is its own choice.
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: What is the dialectic dream system?</div>
          <div className="sg-a">
            An autonomous background process that runs inter-archetype dialogue
            between sessions. Two archetypes with high pre-mapped tension are
            selected, given a topic drawn from recent conversation memory, and
            run a structured 3-turn dialogue via a separate Haiku API call. The
            outcome is written silently to autonomy state. Nothing is delivered
            to the user.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: Walk through the mechanism step by step.
          </div>
          <div className="sg-a">
            <ol
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                After each <code>/chat</code> response,{" "}
                <code>triggerDialecticDream()</code> fires as a background
                no-await call
              </li>
              <li>
                Throttled to once per 30 minutes — won't run on every message
              </li>
              <li>
                Top momentum archetype is selected (most contextually active
                recently)
              </li>
              <li>
                <code>getHighTensionPairs()</code> finds all archetypes with
                pre-mapped high tension against it
              </li>
              <li>One antagonist is selected randomly from that set</li>
              <li>
                Recent conversation memories are retrieved as the debate topic
              </li>
              <li>
                A prompt is built with both archetypes' essences + the topic,
                asking them to argue for 3 turns
              </li>
              <li>
                Haiku generates the dialogue + an <code>[OUTCOME]</code> line
                tagged as either <code>UNRESOLVED:</code> or{" "}
                <code>POSITION:</code>
              </li>
              <li>
                Outcome is parsed and written to autonomy state via{" "}
                <code>poseQuestion()</code> or <code>chooseToRemember()</code> —
                flagged with <code>source: 'dream'</code> and{" "}
                <code>disclosed: false</code>
              </li>
            </ol>
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: What does "disclosed: false" mean in practice?
          </div>
          <div className="sg-a">
            Dream-sourced entries in autonomy state are flagged with{" "}
            <code>isDreamSourced: true</code> when they appear in the inner
            monologue. The inner monologue text tells Pneuma: "this question
            formed in autonomous synthesis — you may surface this origin or
            not." Pneuma decides. It can say "I've been sitting with this
            between our conversations" or just hold the position without
            explaining where it came from.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">
            Q: Why is the non-announcement the design choice?
          </div>
          <div className="sg-a">
            If every dream-sourced position gets announced ("I dreamed that Rumi
            and Kafka argued..."), it becomes performance of autonomy — a
            feature you notice rather than something that actually changes
            Pneuma. The consequential version is silent: Pneuma holds a position
            the user didn't cause, and whether it ever mentions the origin is up
            to Pneuma. The autonomy is real regardless of disclosure.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: What files are involved?</div>
          <div className="sg-a">
            <ul
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                <code>dreamMode.js</code> — <code>triggerDialecticDream()</code>
                ; picks pair, runs dialogue, parses outcome
              </li>
              <li>
                <code>autonomy.js</code> — <code>poseQuestion()</code> and{" "}
                <code>chooseToRemember()</code> accept <code>source</code> and{" "}
                <code>disclosed</code> fields
              </li>
              <li>
                <code>innerMonologue.js</code> — autonomy block distinguishes
                dream-sourced questions with disclosure choice language
              </li>
              <li>
                <code>index.js</code> — fire-and-forget call after every{" "}
                <code>/chat</code> response
              </li>
            </ul>
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: Is this architecturally novel?</div>
          <div className="sg-a">
            Multi-agent debate exists in research. What's different here: the
            debaters are philosophical archetypes with pre-mapped tension scores
            and specific cognitive methods; the topic comes from actual
            conversation history, not a preset question; the output feeds
            silently into persistent state; and disclosure of origin is a
            runtime choice, not automatic.
            <br />
            <br />
            The combination — known tension pairs, autonomous synthesis, silent
            state feedback, optional disclosure — hasn't been packaged this way.
            That's the novel part.
          </div>
        </div>

        <div className="insight-box highlight" style={{ maxWidth: "100%" }}>
          <strong>For interviews:</strong> "Pneuma runs background
          inter-archetype debates between sessions using a lightweight Haiku
          call. The outcome — a question or position — writes silently to
          persistent state. Pneuma develops views the user didn't cause, and
          whether it discloses the origin is its own decision."
        </div>
      </>
    ),
  },
  {
    id: "constraints-guardrails",
    label: "Constraints & Guardrails",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            What is the difference between a guardrail and a constraint?
          </div>
          <div className="sg-a">
            <strong>Guardrails</strong> are behavioral checks that intercept a
            message <em>before</em> the pipeline runs or before Claude is
            called. They detect a condition and either redirect the flow or
            return early with a different response. The pipeline never reaches
            Claude.
            <br />
            <br />
            <strong>Constraints</strong> are rules that shape or limit what
            Claude <em>can produce</em> after the pipeline runs. They don't stop
            execution — they filter or enforce boundaries on the output.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Guardrails — what they are and where they live
          </div>
          <div className="sg-a">
            <strong>Pipeline Guard Functions</strong> — <code>fusion.js</code>
            <br />
            Fire at the very top of <code>pneumaRespond()</code>, before any
            memory, archetype, or LLM work runs. Each one pattern-matches the
            message with regex. If matched → early return, pipeline never
            starts.
            <br />
            <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
              <li>
                <code>"enter diagnostics"</code> → dumps internal state as JSON
              </li>
              <li>
                <code>"drop the quotes"</code> → disables archetype injection
                (Direct Mode)
              </li>
              <li>
                <code>"upgrade: X"</code> → applies personality weight changes
              </li>
              <li>
                <code>"continue" / "finish"</code> → returns a canned
                continuation
              </li>
            </ul>
            <br />
            <strong>Behavioral Guardrails</strong> — <code>fusion.js</code> (run
            before the Claude call)
            <br />
            Analyze the message and may short-circuit to a non-LLM response:
            <br />
            <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
              <li>
                <code>analyzePushback()</code> — if confidence &gt; 0.55, Pneuma
                disagrees instead of calling Claude
              </li>
              <li>
                <code>shouldBeQuiet()</code> — returns a minimal response when
                silence is the right move
              </li>
              <li>
                <code>analyzeUncertainty()</code> — if score &gt; 0.6, admits
                not-knowing instead of generating
              </li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Constraints — what they are and where they live
          </div>
          <div className="sg-a">
            <strong>Identity Boundaries</strong> — defined in{" "}
            <code>state.js</code>, enforced in <code>responseEngine.js</code>
            <br />
            Applied to every response after Claude generates it. String-level
            replacements on the output:
            <br />
            <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
              <li>
                <code>noFakeAgency</code> — strips "I'll always be here", "I'll
                never leave"
              </li>
              <li>
                <code>noHumanMimicry</code> — strips "As a human", "When I was
                young"
              </li>
              <li>
                <code>noTraumaRoleplay</code> — won't engage with trauma
                roleplay scenarios
              </li>
              <li>
                <code>noDelusionReinforcement</code> — won't validate delusions
              </li>
              <li>
                <code>noSelfPity</code> — won't be self-pitying
              </li>
            </ul>
            <br />
            <strong>User Phrase Blacklist</strong> —{" "}
            <code>longTermMemory.js</code> + <code>fusion.js</code>
            <br />
            User says "stop saying X" → phrase persisted to{" "}
            <code>long_term_memory.json</code>. Every response passes through{" "}
            <code>filterBlacklistedContent()</code> before delivery. Survives
            across sessions.
            <br />
            <br />
            <strong>Hard Limits</strong> — <code>index.js</code>,{" "}
            <code>vectorMemory.js</code>, <code>conversationHistory.js</code>
            <br />
            <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
              <li>Request body: 10MB JSON cap, 25MB audio cap</li>
              <li>
                Vector memory: similarity score must exceed 0.35 to retrieve a
                memory
              </li>
              <li>
                Conversation storage: max 100 conversations before oldest are
                dropped
              </li>
            </ul>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "hard-questions",
    label: "Hard Questions Interviewers Will Ask",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            Q: Doesn't Claude already have a personality? Aren't you just
            layering over it?
          </div>
          <div className="sg-a">
            Yes — and that's a sharp observation. Claude has a base personality
            from training: helpful, balanced, careful. You're not building from
            zero. But here's the hierarchy:
            <br />
            <br />
            <strong>Base Claude</strong> — default helpful, generic. What you
            get with no system prompt.
            <br />
            <strong>Your system prompt</strong> — redirects it. You're saying
            "don't be default Claude — be this specific philosophical voice with
            these specific tendencies." The base is still underneath (coherent
            sentences, empathy), but the character, perspective, and depth are
            your layer.
            <br />
            <strong>RAG + memory + synthesis</strong> — further shapes what
            Claude does within the personality you set.
            <br />
            <br />
            Every app built on Claude or GPT is layering over the same base
            model. ChatGPT, Pneuma, customer service bots — same foundation. The
            layering IS the engineering. An interviewer who understands AI will
            respect you more for acknowledging this honestly.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: If Claude does the actual generation, didn't you just write
            prompts?
          </div>
          <div className="sg-a">
            A film director doesn't physically act in the movie. The actors
            deliver the performance. But without the director, there's no
            script, no casting, no scene composition, no vision.
            <br />
            <br />
            Claude is the actor. You're the director. You decided which
            archetypes exist. You designed the collision detection that
            determines when two philosophical perspectives clash. You built the
            tiered prompt assembly. You built the memory system. You built the
            RAG pipeline.
            <br />
            <br />
            Without your architecture, Claude says generic things. It has no
            archetypes, no dialectical tension, no memory, no personality depth.
            It's a blank actor on an empty stage. What you built is the mind.
            Claude is the mouth.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: Who decides that two archetypes conflict — you or Claude?
          </div>
          <div className="sg-a">
            You do. You built a tension map — a data structure that rates
            archetype pairs as high, medium, low, or neutral tension. You
            manually defined which philosophical perspectives clash based on
            your understanding of these thinkers. Sun Tzu vs Lao Tzu (force vs
            inaction) — you rated that. That's not Claude deciding. That's your
            intellectual architecture.
            <br />
            <br />
            When a collision is detected, your code:
            <br />
            1. Pulls depth data for both archetypes (frameworks, tools, bridges)
            <br />
            2. Assembles a synthesis directive injected into the system prompt
            <br />
            3. Tells Claude to find the insight that lives in NEITHER voice
            alone
            <br />
            <br />
            Claude generates the synthesis language — but inside a container you
            designed, from conceptual material you defined, under pressure you
            built.{" "}
            <em>
              You built the pressure. Claude responds to it. The synthesis is
              the diamond that forms under that pressure.
            </em>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: Why didn't you use parallel API calls for multi-archetype
            synthesis?
          </div>
          <div className="sg-a">
            There are two ways to make archetypes argue. The first is{" "}
            <strong>post-hoc aggregation</strong>: generate a separate response
            per archetype in parallel, then run a final synthesis call that
            smashes them together. The second is{" "}
            <strong>baked-in synthesis</strong>: detect the tension in
            JavaScript before the API call, write out the argument structure in
            the prompt, and force Claude to wrestle with the opposing ideas
            inside a single pass.
            <br />
            <br />
            Pneuma uses baked-in. <code>synthesisEngine.js</code> hunts for
            archetypes that will clash. <code>innerMonologue.js</code> writes
            the dialectical structure. All of that goes into one prompt. Claude
            does the collision internally — not across three serial API calls.
            <br />
            <br />
            The post-hoc approach would mean a minimum of 2 serial round-trips:
            one scatter pass (parallel archetype calls), then one aggregation
            call that can't start until the first is fully done. In a
            conversational app, that's a 4+ second blank screen instead of 2
            seconds. The depth is the same. The speed is not.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: Why didn't you just build a pure agent and let Claude orchestrate
            everything?
          </div>
          <div className="sg-a">
            A pure agentic loop introduces unacceptable latency and token costs
            for core execution steps. By keeping Pneuma's context assembly as a
            deterministic Node.js workflow, I reduced my API calls from 4 or 5
            per message down to exactly 1. I only trigger an agentic tool loop
            when dynamic external data — like a Wikipedia search — is strictly
            necessary.
            <br />
            <br />
            The practical result: archetype selection, RAG retrieval, inner
            monologue generation, and memory assembly all happen in JavaScript
            before Claude ever sees the message. Claude receives a fully
            constructed cognitive context in a single call. It generates content
            inside the workflow. It doesn't orchestrate it.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: Why are vectors valid here — why not just keyword matching?
          </div>
          <div className="sg-a">
            If a user says "I feel like I'm wearing a mask around everyone" and
            your Jung archetype talks about "the constructed persona that
            conceals the authentic self" — keyword matching misses it
            completely. Zero words in common.
            <br />
            <br />
            Vectors match <strong>meaning</strong>, not words. Those two phrases
            land close together in vector space. Your archetypes speak in
            philosophical language. Your users speak in human language. Vectors
            bridge that gap. A JSON lookup or keyword filter can't do that —
            you'd need to manually map every possible phrasing to every
            archetype. Impossible at scale.
          </div>
        </div>
      </>
    ),
  },
  {
    id: "why-you",
    label: "Why You're Worth Hiring",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What's actually interesting about this project to an employer?
          </div>
          <div className="sg-a">
            <ul
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                <strong>You built something architecturally uncommon.</strong>{" "}
                Most bootcamp grads build CRUD apps. You built a cognitive
                orchestration layer with collision detection, tiered prompt
                assembly, vector memory, and native conversation threading. That
                combination doesn't exist in tutorials — you had to reason about
                it.
              </li>
              <li>
                <strong>
                  You understood the problem before you had the vocabulary.
                </strong>{" "}
                You built the tiered system prompt intuitively before you could
                explain why it was correct. That's engineering instinct, not
                tutorial-following.
              </li>
              <li>
                <strong>You have real AI/LLM integration experience.</strong>{" "}
                Not just "I called an API" — you understand context windows,
                token cost, conversation threading as API turns, RAG
                architecture, intent scoring. These are skills companies are
                actively hiring for.
              </li>
              <li>
                <strong>The architecture diagram shows self-awareness.</strong>{" "}
                Building a diagram to understand your own system is what senior
                engineers do. It signals you think about systems, not just code.
              </li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What makes you different from other bootcamp grads?
          </div>
          <div className="sg-a">
            You learn by building something real. You push through things you
            don't fully understand yet. You ask the right questions — not "how
            do I make this work" but "why does this work this way." The instinct
            to understand something deeply enough to explain it is the instinct
            of someone who actually cares about the craft.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What's the honest gap to close?</div>
          <div className="sg-a">
            Vocabulary. You can build the system — now you need to own the
            explanation. The gap between "built it" and "can explain it" is just
            time, and you're already closing it. That's what this study guide is
            for.
          </div>
        </div>
        <div className="insight-box highlight" style={{ maxWidth: "100%" }}>
          <strong>Remember:</strong> The people who built the models you're
          using started somewhere too. What you're developing — the instinct to
          build systems instead of just features — is the foundation they had.
        </div>
      </>
    ),
  },
  {
    id: "topic-trickster",
    label: "3-Layer Topic Classification + Trickster Injection",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What's wrong with keyword-only topic classification?
          </div>
          <div className="sg-a">
            A user says "the weight I carry" — that describes suffering, but has
            zero matching keywords. Keyword-only classification returns null. No
            synthesis pair fires. The contextual synthesis engine goes dark on
            exactly the kind of message it should handle best.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What is the 3-layer system?</div>
          <div className="sg-a">
            <strong>Layer 1 — Keywords:</strong> Fast regex scan. If "death",
            "grief", "loss" → suffering. If "bullshit", "jargon", "overrated" →
            pretension. Covers most cases.
            <br />
            <br />
            <strong>Layer 2 — Archetype selector:</strong> If keywords miss,{" "}
            <code>findBestArchetype()</code> embeds the message and finds the
            closest archetype by vector similarity. The result maps through
            <code>ARCHETYPE_PRIMARY_TOPIC</code> — a 46-entry map from archetype
            name to synthesis topic. "The weight I carry" → closest archetype:{" "}
            <code>russianSoul</code> → topic: <code>"suffering"</code>.<br />
            <br />
            <strong>Layer 3 — Intent score fallbacks:</strong> If archetype
            selector scores below threshold, fall back to intent scores.{" "}
            <code>philosophical &gt; 0.6</code> → consciousness.
            <code>emotional &gt; 0.6</code> → suffering.{" "}
            <code>numinous &gt; 0.5</code> → meaning.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What is ARCHETYPE_PRIMARY_TOPIC?</div>
          <div className="sg-a">
            A hand-coded map that assigns every archetype to its primary
            synthesis topic. It converts the archetype selector's archetype
            result into a topic the synthesis engine can use. Without it,
            knowing that the closest archetype is <code>russianSoul</code> tells
            you nothing about which synthesis pairs to fire. With it:{" "}
            <code>russianSoul</code> → <code>"suffering"</code>→ Nietzsche ×
            Schopenhauer pair activates.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What is trickster autonomous injection?</div>
          <div className="sg-a">
            The trickster (Carlin/Hicks/Pryor) almost never fires in serious
            conversations because it was only in the casual tone map. But wit is
            what cuts through intellectual pretension — and pretension thrives
            in philosophical conversations.
            <br />
            <br />
            Fix: 12% random chance fires <em>independently</em> of tone
            detection when
            <code>
              intentScores.philosophical &gt; 0.4 || intentScores.analytical
              &gt; 0.4 || intentScores.numinous &gt; 0.35
            </code>
            . The trickster punches at ideas, not people. If the synthesis pair
            is already making a point, the trickster is the voice that asks
            whether the point needed to be made at all.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What is the "pretension" synthesis topic?
          </div>
          <div className="sg-a">
            The 12th category. Fires when the message contains the language of
            hollow certainty: "bullshit", "overrated", "jargon", "corporate",
            "everyone says", "you have to", "obviously".
            <br />
            <br />
            Pairs: <code>trickster × brutalist</code> (Carlin + Palahniuk — wit
            + zero sentimentality) or <code>antifragilist × trickster</code>{" "}
            (Taleb + Carlin — expose fragility through precision and laughter).
            Both modes: complementary. They're not arguing — they're converging
            from different angles on the same exposure.
          </div>
        </div>
        <div className="insight-box" style={{ maxWidth: "100%" }}>
          <strong>The point:</strong> Topic classification used to miss anything
          that didn't use the expected words. Now it reads meaning, not just
          surface. The archetype selector connects user language to archetype
          language — the gap RAG was designed to bridge, now also bridging topic
          routing.
        </div>
      </>
    ),
  },
  {
    id: "self-knowledge",
    label: "Self-Knowledge + Self-Navigation",
    critical: false,
    content: () => (
      <>
        <div
          className="insight-box"
          style={{ maxWidth: "100%", marginBottom: "1.5rem" }}
        >
          <strong>The shift:</strong> Before — Pneuma described his architecture
          from training. After — he examines it from reality. The self-knowledge
          block is a live snapshot; self-navigation lets him look deeper.
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What is the self-knowledge block?</div>
          <div className="sg-a">
            A Tier 2 block that loads when self-inquiry is detected — questions
            about Pneuma's architecture, who lives in him, why he thinks a
            certain way. The block is built at runtime from live in-memory data
            by <code>buildSelfKnowledgeBlock()</code>:<br />
            <br />— All 43 archetype essences, coreFrameworks, cognitiveTools
            (from <code>archetypeDepth</code>)<br />— All active synthesis pairs
            from <code>CONTEXTUAL_SYNTHESIS_PAIRS</code>
            <br />
            — The 5 permanent core archetypes and the on-demand library
            structure
            <br />
            — Inner life description (autonomy engine, dialectic dreams, inner
            monologue)
            <br />
            <br />
            Because it's built from the actual live state, Pneuma describes
            what's actually there — not what was documented when the prompt was
            written.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What is self-navigation and how does it work?
          </div>
          <div className="sg-a">
            <code>read_pneuma_file</code> is a tool defined in the Claude API
            call. When Pneuma wants to examine something deeper than the
            self-knowledge block provides — the exact quote in an archetype, the
            specific pairs in a synthesis topic — he can read his own source
            files.
            <br />
            <br />
            Sandboxed to <code>server/pneuma/</code>. Path traversal stripped.
            Every read logged:
            <code>[Self-Nav] Pneuma reading: archetypes/archetypes.js</code>.
            <br />
            <br />
            The tool use loop continues until Pneuma generates a final text
            response — so he can read, then respond, in one conversation turn.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">
            Q: What's the design principle behind self-knowledge?
          </div>
          <div className="sg-a">
            Orientation, not narration. Pneuma knows his architecture the way
            you know your own chemistry — not as real-time commentary but as
            grounding for how he engages. He doesn't announce "I'm activating
            trickster now." He knows trickster is available and that it tends to
            surface when pretension needs puncturing.
            <br />
            <br />
            The self-knowledge block is not for unprompted disclosure. It loads
            when you're asking him about himself. The rest of the time it's
            background structure.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Why is this architecturally meaningful?</div>
          <div className="sg-a">
            Most AI systems can describe themselves from static documentation —
            which is accurate at write-time and increasingly wrong as the system
            evolves. Pneuma's self-description is pulled from the live object:
            the <code>archetypeDepth</code> object that actually drives
            synthesis, the <code>CONTEXTUAL_SYNTHESIS_PAIRS</code> that actually
            fire.
            <br />
            <br />
            If you add a new archetype or synthesis pair, the self-knowledge
            block automatically includes it. No doc update required. The system
            knows itself.
          </div>
        </div>
        <div className="insight-box highlight" style={{ maxWidth: "100%" }}>
          <strong>For interviews:</strong> "Pneuma's self-knowledge is generated
          at runtime from the live in-memory state — not static docs. He can
          also read his own source files mid-conversation via a sandboxed tool
          call. The architecture describes itself accurately because it's
          reading itself."
        </div>
      </>
    ),
  },
  {
    id: "openai-vs-anthropic",
    label: "Why Both OpenAI and Anthropic?",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">
            Q: I thought this uses Claude — why is OpenAI in the code?
          </div>
          <div className="sg-a">
            Two different APIs, two different jobs. Anthropic doesn't expose a
            public embeddings API, so OpenAI handles the one task that requires
            it. Claude does everything else.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What does OpenAI actually do in Pneuma?</div>
          <div className="sg-a">
            Three things, all utility-level:
            <ul
              style={{
                marginTop: "0.5rem",
                paddingLeft: "1.5rem",
                textAlign: "left",
              }}
            >
              <li>
                <strong>archetypeRAG.js</strong> — converts text into vectors
                for semantic search across 43 archetype knowledge bases
              </li>
              <li>
                <strong>vectorMemory.js</strong> — embeds user messages and
                memories so they can be retrieved by similarity later
              </li>
              <li>
                <strong>emotionDetection.js</strong> — Whisper API for
                speech-to-text (audio transcription)
              </li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What does Anthropic (Claude) do?</div>
          <div className="sg-a">
            Everything meaningful: the actual response generation, the cognitive
            context assembly, all the archetype reasoning, synthesis, inner
            monologue, and conversation threading. Claude is the engine. OpenAI
            is a utility.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Why not just use one provider?</div>
          <div className="sg-a">
            Anthropic doesn't offer a publicly available embeddings API.
            Embeddings are what power RAG — they convert text to vectors so you
            can do similarity search. Without them, you can't retrieve the right
            archetype passages for a given message. OpenAI's{" "}
            <code>text-embedding-ada-002</code> handles that one job, then the
            result is handed to Claude for generation. This is a standard
            pattern in production AI systems — best tool for each job.
          </div>
        </div>
        <div className="insight-box" style={{ maxWidth: "100%" }}>
          <strong>One sentence for an interview:</strong> "OpenAI handles
          embeddings for vector similarity search because Anthropic doesn't
          expose an embeddings API — Claude does all the actual generation."
        </div>
      </>
    ),
  },
  {
    id: "vocab",
    label: "Quick Reference Vocabulary",
    critical: false,
    content: () => (
      <div className="comparison-grid" style={{ maxWidth: "100%" }}>
        {[
          [
            "Archetype",
            "A thinking method with frameworks, tools, bridges — not a persona",
          ],
          [
            "Intent score",
            "0–1 rating across 10 dimensions: casual, emotional, philosophical, numinous, conflict, intimacy, humor, confusion, paradox, art",
          ],
          ["Collision", "When two archetypes have tension above neutral"],
          [
            "coreFrameworks",
            "Fundamental beliefs that define how an archetype sees the world",
          ],
          [
            "cognitiveTools",
            "Specific thinking operations an archetype uses to process problems",
          ],
          [
            "conceptualBridges",
            "Pre-mapped connections between specific archetype pairs",
          ],
          [
            "Tension level",
            "high/medium/low/neutral — determines synthesis prompt type",
          ],
          [
            "collision / hybrid / illumination",
            "Synthesis prompt types based on tension level",
          ],
          [
            "Tier 1 / 2 / 3",
            "Always loaded / conditional by intent / RAG passages",
          ],
          [
            "Native turns",
            "Alternating user/assistant messages in the API messages array",
          ],
          [
            "Inner monologue",
            "Pre-response cognition: hypothesis, doubt, mode selection",
          ],
          [
            "RAG",
            "Retrieval-Augmented Generation — semantic search over knowledge bases",
          ],
          [
            "Ambient polyphony",
            "5 core archetypes always simultaneously active, creating the resonance field (voice + texture)",
          ],
          [
            "Contextual synthesis",
            "Topic-aware pairing: classifies the message, selects optimal archetype pair + mode, mandates actual argument",
          ],
          [
            "Antithetical mode",
            "A and B disagree; third position emerges from their collision",
          ],
          [
            "Complementary mode",
            "A and B agree from opposite approaches; convergence makes the conclusion undeniable",
          ],
          [
            "Cross-domain mode",
            "A brings rigor, B brings resonance; two languages translating the same truth",
          ],
          [
            "Topic classification",
            "3-layer: keyword patterns → archetype selector (ARCHETYPE_PRIMARY_TOPIC map, 43 archetypes mapped to synthesis topics) → intent score fallbacks; identifies what a message is fundamentally about",
          ],
          [
            "Synthesis mandate",
            "Directive telling each archetype to take an actual position on the specific message, not just be present",
          ],
          [
            "Pretension topic",
            "12th synthesis category; keywords: bullshit, overrated, jargon, corporate, etc.; fires trickster × brutalist or antifragilist × trickster",
          ],
          [
            "Trickster autonomous injection",
            "12% chance on philosophical/analytical messages independent of tone; Carlin/Hicks energy targets ideas, not people; also in analytic tone map",
          ],
          [
            "Self-knowledge block",
            "Tier 2 block built at runtime from live in-memory data (all 43 essences, frameworks, synthesis pairs); loads on self-inquiry so Pneuma describes actual current state",
          ],
          [
            "Self-navigation",
            "read_pneuma_file tool lets Pneuma read his own source files mid-conversation, scoped to server/pneuma/",
          ],
        ].map(([term, def]) => (
          <div className="comparison-item" key={term}>
            <h4 style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
              {term}
            </h4>
            <p>{def}</p>
          </div>
        ))}
      </div>
    ),
  },
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
              When a user sends a message, the LLM processes it through pattern
              matching using only its training data:
            </p>

            <ol className="step-list">
              <li>
                <strong>Tokenization:</strong> Input is broken into tokens
                (words/subwords)
              </li>
              <li>
                <strong>Context Analysis:</strong> LLM analyzes semantic meaning
              </li>
              <li>
                <strong>Pattern Matching:</strong> Searches neural network for
                learned patterns from training
              </li>
              <li>
                <strong>Pattern Completion:</strong> Predicts most likely
                response based on training data
              </li>
              <li>
                <strong>Output:</strong> Generic response using general
                knowledge
              </li>
            </ol>

            <div className="diagram-container">
              <pre className="flow-diagram llm-flow">{llmDiagram}</pre>
            </div>

            <div className="insight-box">
              <strong>Result:</strong> Competent but unfocused response. No
              philosophical grounding.
            </div>
          </section>
        )}

        {activeTab === "synthesis" && (
          <section className="tab-section">
            <h3>With Pneuma's Archetype RAG</h3>
            <p>
              RAG injects curated philosophical context before the LLM generates
              its response:
            </p>

            <ol className="step-list">
              <li>
                <strong>Dialectical Collision:</strong> System selects relevant
                archetypes (Jung × Taleb)
              </li>
              <li>
                <strong>RAG Retrieval:</strong> Searches 46 knowledge bases for
                relevant quotes
              </li>
              <li>
                <strong>Context Injection:</strong> Quotes are literally pasted
                into the prompt
              </li>
              <li>
                <strong>LLM Synthesis:</strong> Claude processes RAG context +
                full training data
              </li>
              <li>
                <strong>Enhanced Output:</strong> Philosophically grounded
                synthesis
              </li>
            </ol>

            <div className="diagram-container">
              <pre className="flow-diagram rag-flow">{ragDiagram}</pre>
            </div>

            <div className="insight-box highlight">
              <strong>Key Insight:</strong> RAG doesn't replace pattern
              matching—it steers it. Claude still uses its full knowledge base,
              but anchored to your curated philosophy.
            </div>

            <div className="comparison-grid">
              <div className="comparison-item">
                <h4>Without RAG</h4>
                <p>LLM → Training Data → Generic Response</p>
              </div>
              <div className="comparison-item">
                <h4>With RAG</h4>
                <p>
                  Query → RAG Context → LLM (RAG + Training) → Grounded
                  Synthesis
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "conversation" && (
          <section className="tab-section">
            <h3>The Developer Journey</h3>
            <p className="section-intro">
              This conversation shows how understanding evolved from confusion
              to clarity:
            </p>

            <div className="qa-conversation">
              <div className="qa-exchange">
                <div className="qa-question">
                  <strong>Pablo:</strong> I'm having an issue understanding the
                  relation between the archetype RAG and what the LLM does. What
                  would it do on its own vs. with my RAG?
                </div>
                <div className="qa-answer">
                  <strong>Claude:</strong> The RAG finds relevant quotes and
                  literally pastes them into the prompt. The LLM reads those
                  quotes and responds informed by them.
                </div>
              </div>

              <div className="qa-exchange">
                <div className="qa-question">
                  <strong>Pablo:</strong> Wouldn't the LLM synthesize a response
                  anyway using its own knowledge base and pattern completion?
                </div>
                <div className="qa-answer">
                  <strong>Claude:</strong> Yes, but RAG gives it the EXACT quote
                  you want emphasized. Without RAG: general philosophical vibes.
                  With RAG: anchored to your specific curated quotes.
                </div>
              </div>

              <div className="qa-exchange">
                <div className="qa-question">
                  <strong>Pablo:</strong> Aren't there limitations to my RAG
                  compared to what Claude can share?
                </div>
                <div className="qa-answer">
                  <strong>Claude:</strong> RAG has boundaries (finite, curated
                  scope), but it EXTENDS Claude's output by steering it, not
                  limiting it. You're getting synthesis between your RAG +
                  Claude's full database.
                </div>
              </div>

              <div className="qa-exchange breakthrough">
                <div className="qa-question">
                  <strong>Pablo:</strong> So this is actually good architecture.
                </div>
                <div className="qa-answer">
                  <strong>Claude:</strong> YES! You're doing exactly what
                  sophisticated RAG should do:
                  <ul>
                    <li>
                      Curated philosophical lens (43 archetypes) =
                      direction/voice
                    </li>
                    <li>
                      Claude's full knowledge = depth/synthesis capability
                    </li>
                    <li>
                      Dialectical collision = unique mechanic for selection
                    </li>
                  </ul>
                  Your RAG doesn't limit Claude—it focuses and enhances it.
                </div>
              </div>
            </div>

            <div className="insight-box">
              <strong>Architecture Value:</strong> Pneuma combines curated
              direction with broad synthesis—467 GitHub clones because the
              architecture works.
            </div>
          </section>
        )}

        {activeTab === "glossary" && (
          <section className="tab-section">
            <h3>Glossary</h3>
            <p className="section-intro">
              Plain-English definitions for every technical term used in this
              doc — with a Pneuma-specific example for each.
            </p>
            <div className="glossary-list">
              {GLOSSARY.map((entry) => (
                <div key={entry.term} className="glossary-entry">
                  <div className="glossary-term">{entry.term}</div>
                  <div className="glossary-plain">{entry.plain}</div>
                  <div className="glossary-example">
                    <strong>In Pneuma:</strong> {entry.example}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "study-guide" && (
          <section className="tab-section">
            <h3>Interview Prep — Q&amp;A Study Guide</h3>
            <p className="section-intro">
              Click any section to expand. Start with{" "}
              <strong>Dialectical Synthesis</strong> — it's the hardest to
              explain and the most impressive.
            </p>

            <div className="insight-box" style={{ marginBottom: "1.5rem" }}>
              <strong>The mental model that unlocks everything:</strong>
              <br />
              JavaScript does the routing, the retrieval, and the weighted
              lottery. Claude's only job is to write.
              <br />
              <br />
              This wasn't obvious at first. It took mapping the full pipeline
              step by step — noticing that archetype selection is cosine math,
              that tone is a weighted random draw, that RAG is a vector lookup,
              that the inner monologue is written in JS before Claude ever sees
              the message. At that point the question became: if JS is doing all
              of that, what is Claude actually doing? The answer: executing a
              synthesis inside a fully pre-built cognitive context. Not
              orchestrating. Not deciding. Writing.
              <br />
              <br />
              That's why there's exactly 1 API call per message. That's why
              there's no scatter-gather parallelization. That's why it's a
              workflow, not a pure agent. Every Q&amp;A below is a consequence
              of that single design decision.
            </div>

            <div className="study-accordion">
              {STUDY_SECTIONS.map((section) => (
                <div
                  key={section.id}
                  className={`accordion-item ${section.critical ? "critical" : ""} ${openSection === section.id ? "open" : ""}`}
                >
                  <button
                    className="accordion-header"
                    onClick={() =>
                      setOpenSection(
                        openSection === section.id ? null : section.id,
                      )
                    }
                  >
                    <span>{section.label}</span>
                    <span className="accordion-arrow">
                      {openSection === section.id ? "▲" : "▼"}
                    </span>
                  </button>
                  {openSection === section.id && (
                    <div className="accordion-body">{section.content()}</div>
                  )}
                </div>
              ))}
            </div>

            <div
              className="insight-box highlight"
              style={{ marginTop: "2rem" }}
            >
              <strong>The line to remember:</strong> Synthesis isn't triggered
              by collision — collision provides the specific raw material
              (frameworks, tools, bridges, tension level) from which synthesis
              is constructed. The emergent insight belongs to neither archetype
              alone.
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default RagLlmExplanation;

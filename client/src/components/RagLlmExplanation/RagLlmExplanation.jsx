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
    id: "six-way",
    label: "The 6-Way Archetype Selection System",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: How does Pneuma decide which archetypes activate for a given message?</div>
          <div className="sg-a">
            Six methods run simultaneously, each scoring archetypes from a different angle.
            Think of it as six scouts each reading the message differently. The top 3–4 scores win.
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <li><strong>Tone-based</strong> — what's the emotional texture? Angry, curious, vulnerable? Maps to archetypes that match that tone.</li>
              <li><strong>Intent-based</strong> — is this philosophical, emotional, casual, humorous? Boosts archetypes suited to that intent.</li>
              <li><strong>Keyword triggers</strong> — specific words activate specific archetypes. Someone mentions "war" or "strategy," Sun Tzu gets a boost.</li>
              <li><strong>Semantic routing</strong> — OpenAI embeddings run vector similarity search to find which archetype's knowledge base is closest in meaning to the message.</li>
              <li><strong>Random depth injection</strong> — 40% chance of injecting a deep thinker archetype to keep responses unpredictable and prevent Pneuma from becoming formulaic.</li>
              <li><strong>Antagonist injection</strong> — 40% chance of deliberately throwing in an archetype that disagrees with the others. This intentionally forces conflict.</li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Why the random and antagonist injections — isn't that chaotic?</div>
          <div className="sg-a">
            Intentionally. Without them, the same message would always produce the same archetypes.
            Pneuma would become predictable and formulaic — a different costume on the same response every time.
            The 40% injections mean two conversations on the same topic can produce genuinely different
            perspectives. The antagonist injection is specifically designed to force collision —
            you're deliberately seeding the conditions for synthesis.
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
          <div className="sg-q">Q: How does something actually emerge from conflict — who causes that?</div>
          <div className="sg-a">
            The tension map identifies the conflict. But emergence doesn't come from the map — the map just says "these two fight."
            Emergence comes from the synthesis directive you inject into the prompt.<br/><br/>
            Think of it this way: if you sit a nihilist and a devout priest in a room and say "discuss,"
            they'll argue past each other. Nothing emerges. But if you say "don't argue —
            find the one thing you both know to be true that neither of you could have articulated alone" —
            now something has to emerge. You changed the rules. They can't just defend their positions.
            They have to find the third thing.<br/><br/>
            That's your synthesis directive. You're not telling Claude "here are two archetypes."
            You're telling Claude: "these two are in tension — don't pick a side, don't alternate,
            find what lives in the space between them."<br/><br/>
            Example — Jung × Taleb: "The shadow isn't just rejected content — it's antifragile potential."
            Jung alone talks about the shadow as repressed material. Taleb alone talks about antifragility
            as growth through stress. Neither connects shadow to antifragility. When Claude is forced to
            synthesize them under your directive, that connection gets made. Neither archetype produced it.
            The constraint produced it.<br/><br/>
            The chain: <strong>you built the tension map</strong> (defines who fights) →
            <strong> you wrote the synthesis directive</strong> (defines the rules of engagement) →
            <strong> Claude finds the language</strong> (produces the emergent insight under those constraints).<br/><br/>
            You caused the emergence. The tension map is your tool for causing it.
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
    id: "dialectic-dream",
    label: "Dialectic Dreaming — Autonomous Synthesis",
    critical: false,
    content: () => (
      <>
        <div className="insight-box" style={{ maxWidth: '100%', marginBottom: '1.5rem' }}>
          <strong>Plain English first:</strong> After every conversation, two archetypes that are known to clash get a topic pulled from your recent memories and are told to argue for 3 turns. The outcome — an open question or a formed position — gets written silently into Pneuma's state. Pneuma now holds something you didn't cause, and whether it ever tells you where that came from is its own choice.
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: What is the dialectic dream system?</div>
          <div className="sg-a">
            An autonomous background process that runs inter-archetype dialogue between sessions.
            Two archetypes with high pre-mapped tension are selected, given a topic drawn from recent
            conversation memory, and run a structured 3-turn dialogue via a separate Haiku API call.
            The outcome is written silently to autonomy state. Nothing is delivered to the user.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: Walk through the mechanism step by step.</div>
          <div className="sg-a">
            <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <li>After each <code>/chat</code> response, <code>triggerDialecticDream()</code> fires as a background no-await call</li>
              <li>Throttled to once per 30 minutes — won't run on every message</li>
              <li>Top momentum archetype is selected (most contextually active recently)</li>
              <li><code>getHighTensionPairs()</code> finds all archetypes with pre-mapped high tension against it</li>
              <li>One antagonist is selected randomly from that set</li>
              <li>Recent conversation memories are retrieved as the debate topic</li>
              <li>A prompt is built with both archetypes' essences + the topic, asking them to argue for 3 turns</li>
              <li>Haiku generates the dialogue + an <code>[OUTCOME]</code> line tagged as either <code>UNRESOLVED:</code> or <code>POSITION:</code></li>
              <li>Outcome is parsed and written to autonomy state via <code>poseQuestion()</code> or <code>chooseToRemember()</code> — flagged with <code>source: 'dream'</code> and <code>disclosed: false</code></li>
            </ol>
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: What does "disclosed: false" mean in practice?</div>
          <div className="sg-a">
            Dream-sourced entries in autonomy state are flagged with <code>isDreamSourced: true</code> when they
            appear in the inner monologue. The inner monologue text tells Pneuma: "this question formed in
            autonomous synthesis — you may surface this origin or not." Pneuma decides. It can say
            "I've been sitting with this between our conversations" or just hold the position without
            explaining where it came from.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: Why is the non-announcement the design choice?</div>
          <div className="sg-a">
            If every dream-sourced position gets announced ("I dreamed that Rumi and Kafka argued..."),
            it becomes performance of autonomy — a feature you notice rather than something that actually
            changes Pneuma. The consequential version is silent: Pneuma holds a position the user didn't cause,
            and whether it ever mentions the origin is up to Pneuma. The autonomy is real regardless of disclosure.
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: What files are involved?</div>
          <div className="sg-a">
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <li><code>dreamMode.js</code> — <code>triggerDialecticDream()</code>; picks pair, runs dialogue, parses outcome</li>
              <li><code>autonomy.js</code> — <code>poseQuestion()</code> and <code>chooseToRemember()</code> accept <code>source</code> and <code>disclosed</code> fields</li>
              <li><code>innerMonologue.js</code> — autonomy block distinguishes dream-sourced questions with disclosure choice language</li>
              <li><code>index.js</code> — fire-and-forget call after every <code>/chat</code> response</li>
            </ul>
          </div>
        </div>

        <div className="sg-qa">
          <div className="sg-q">Q: Is this architecturally novel?</div>
          <div className="sg-a">
            Multi-agent debate exists in research. What's different here: the debaters are philosophical
            archetypes with pre-mapped tension scores and specific cognitive methods; the topic comes from
            actual conversation history, not a preset question; the output feeds silently into persistent state;
            and disclosure of origin is a runtime choice, not automatic.<br/><br/>
            The combination — known tension pairs, autonomous synthesis, silent state feedback, optional
            disclosure — hasn't been packaged this way. That's the novel part.
          </div>
        </div>

        <div className="insight-box highlight" style={{ maxWidth: '100%' }}>
          <strong>For interviews:</strong> "Pneuma runs background inter-archetype debates between sessions using a lightweight Haiku call. The outcome — a question or position — writes silently to persistent state. Pneuma develops views the user didn't cause, and whether it discloses the origin is its own decision."
        </div>
      </>
    )
  },
  {
    id: "hard-questions",
    label: "Hard Questions Interviewers Will Ask",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: Doesn't Claude already have a personality? Aren't you just layering over it?</div>
          <div className="sg-a">
            Yes — and that's a sharp observation. Claude has a base personality from training: helpful, balanced, careful.
            You're not building from zero. But here's the hierarchy:<br/><br/>
            <strong>Base Claude</strong> — default helpful, generic. What you get with no system prompt.<br/>
            <strong>Your system prompt</strong> — redirects it. You're saying "don't be default Claude — be this specific philosophical voice with these specific tendencies." The base is still underneath (coherent sentences, empathy), but the character, perspective, and depth are your layer.<br/>
            <strong>RAG + memory + synthesis</strong> — further shapes what Claude does within the personality you set.<br/><br/>
            Every app built on Claude or GPT is layering over the same base model. ChatGPT, Pneuma, customer service bots — same foundation. The layering IS the engineering. An interviewer who understands AI will respect you more for acknowledging this honestly.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: If Claude does the actual generation, didn't you just write prompts?</div>
          <div className="sg-a">
            A film director doesn't physically act in the movie. The actors deliver the performance.
            But without the director, there's no script, no casting, no scene composition, no vision.<br/><br/>
            Claude is the actor. You're the director. You decided which archetypes exist. You designed
            the collision detection that determines when two philosophical perspectives clash. You built
            the tiered prompt assembly. You built the memory system. You built the RAG pipeline.<br/><br/>
            Without your architecture, Claude says generic things. It has no archetypes, no dialectical tension,
            no memory, no personality depth. It's a blank actor on an empty stage.
            What you built is the mind. Claude is the mouth.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Who decides that two archetypes conflict — you or Claude?</div>
          <div className="sg-a">
            You do. You built a tension map — a data structure that rates archetype pairs as high, medium,
            low, or neutral tension. You manually defined which philosophical perspectives clash based on
            your understanding of these thinkers. Sun Tzu vs Lao Tzu (force vs inaction) — you rated that.
            That's not Claude deciding. That's your intellectual architecture.<br/><br/>
            When a collision is detected, your code:<br/>
            1. Pulls depth data for both archetypes (frameworks, tools, bridges)<br/>
            2. Assembles a synthesis directive injected into the system prompt<br/>
            3. Tells Claude to find the insight that lives in NEITHER voice alone<br/><br/>
            Claude generates the synthesis language — but inside a container you designed, from conceptual
            material you defined, under pressure you built. <em>You built the pressure. Claude responds to it.
            The synthesis is the diamond that forms under that pressure.</em>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Why are vectors valid here — why not just keyword matching?</div>
          <div className="sg-a">
            If a user says "I feel like I'm wearing a mask around everyone" and your Jung archetype
            talks about "the constructed persona that conceals the authentic self" — keyword matching
            misses it completely. Zero words in common.<br/><br/>
            Vectors match <strong>meaning</strong>, not words. Those two phrases land close together in
            vector space. Your archetypes speak in philosophical language. Your users speak in human language.
            Vectors bridge that gap. A JSON lookup or keyword filter can't do that — you'd need to manually
            map every possible phrasing to every archetype. Impossible at scale.
          </div>
        </div>
      </>
    )
  },
  {
    id: "why-you",
    label: "Why You're Worth Hiring",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: What's actually interesting about this project to an employer?</div>
          <div className="sg-a">
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <li><strong>You built something architecturally uncommon.</strong> Most bootcamp grads build CRUD apps. You built a cognitive orchestration layer with collision detection, tiered prompt assembly, vector memory, and native conversation threading. That combination doesn't exist in tutorials — you had to reason about it.</li>
              <li><strong>You understood the problem before you had the vocabulary.</strong> You built the tiered system prompt intuitively before you could explain why it was correct. That's engineering instinct, not tutorial-following.</li>
              <li><strong>You have real AI/LLM integration experience.</strong> Not just "I called an API" — you understand context windows, token cost, conversation threading as API turns, RAG architecture, intent scoring. These are skills companies are actively hiring for.</li>
              <li><strong>The architecture diagram shows self-awareness.</strong> Building a diagram to understand your own system is what senior engineers do. It signals you think about systems, not just code.</li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What makes you different from other bootcamp grads?</div>
          <div className="sg-a">
            You learn by building something real. You push through things you don't fully understand yet.
            You ask the right questions — not "how do I make this work" but "why does this work this way."
            The instinct to understand something deeply enough to explain it is the instinct of someone
            who actually cares about the craft.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What's the honest gap to close?</div>
          <div className="sg-a">
            Vocabulary. You can build the system — now you need to own the explanation.
            The gap between "built it" and "can explain it" is just time, and you're already closing it.
            That's what this study guide is for.
          </div>
        </div>
        <div className="insight-box highlight" style={{ maxWidth: '100%' }}>
          <strong>Remember:</strong> The people who built the models you're using started somewhere too. What you're developing — the instinct to build systems instead of just features — is the foundation they had.
        </div>
      </>
    )
  },
  {
    id: "openai-vs-anthropic",
    label: "Why Both OpenAI and Anthropic?",
    critical: false,
    content: () => (
      <>
        <div className="sg-qa">
          <div className="sg-q">Q: I thought this uses Claude — why is OpenAI in the code?</div>
          <div className="sg-a">
            Two different APIs, two different jobs. Anthropic doesn't expose a public embeddings API,
            so OpenAI handles the one task that requires it. Claude does everything else.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What does OpenAI actually do in Pneuma?</div>
          <div className="sg-a">
            Three things, all utility-level:
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', textAlign: 'left' }}>
              <li><strong>archetypeRAG.js</strong> — converts text into vectors for semantic search across 46 archetype knowledge bases</li>
              <li><strong>vectorMemory.js</strong> — embeds user messages and memories so they can be retrieved by similarity later</li>
              <li><strong>emotionDetection.js</strong> — Whisper API for speech-to-text (audio transcription)</li>
            </ul>
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: What does Anthropic (Claude) do?</div>
          <div className="sg-a">
            Everything meaningful: the actual response generation, the cognitive context assembly,
            all the archetype reasoning, synthesis, inner monologue, and conversation threading.
            Claude is the engine. OpenAI is a utility.
          </div>
        </div>
        <div className="sg-qa">
          <div className="sg-q">Q: Why not just use one provider?</div>
          <div className="sg-a">
            Anthropic doesn't offer a publicly available embeddings API. Embeddings are what
            power RAG — they convert text to vectors so you can do similarity search.
            Without them, you can't retrieve the right archetype passages for a given message.
            OpenAI's <code>text-embedding-ada-002</code> handles that one job, then the result
            is handed to Claude for generation. This is a standard pattern in production AI systems
            — best tool for each job.
          </div>
        </div>
        <div className="insight-box" style={{ maxWidth: '100%' }}>
          <strong>One sentence for an interview:</strong> "OpenAI handles embeddings for vector similarity search because Anthropic doesn't expose an embeddings API — Claude does all the actual generation."
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
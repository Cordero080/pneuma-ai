import React from "react";
import {
  ModalSection,
  ModalCodeBlock,
  ModalFlow,
  ModalDesc,
} from "../../../Modal/Modal";

export default function CognitiveMetabolismModal() {
  return (
    <>
      <ModalSection title="The Core Distinction">
        <ModalDesc>
          Most AI personality systems do one of two things:{" "}
          <strong>costume</strong> (roleplay — "pretend you are Rumi") or{" "}
          <strong>retrieval</strong> (RAG — "here is a Rumi quote, use it").
          Pneuma does something different: it gives archetypes{" "}
          <em>thinking methods</em>, not phrases.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          The difference: retrieval asks "what would Leonardo say?" Cognitive
          metabolization asks "how would Leonardo see?" One produces quotes. The
          other produces a way of approaching the problem.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="Where This Lives in the Code">
        <ModalFlow
          steps={[
            {
              title: "archetypeDepth.js",
              desc: "Every archetype has a cognitiveTools object — named operations with descriptions. Not quotes to retrieve, but thinking moves to execute.",
            },
            {
              title:
                "llm.js — ARCHETYPE_INTEGRATION (44 entries, all archetypes)",
              desc: "The primary cognitive instruction system. Every archetype has a 3-layer stack: chainOfThought (how to reason before responding), cognitiveOp (the specific thinking move to apply), and constraints (output energy — what to emphasize, what vocabulary resonates). This is what makes 'Rumi is active' different from 'Rumi enters through the wound and holds the longing without resolving it.'",
            },
            {
              title: "llm.js — ARCHETYPE_METHODS (legacy, select archetypes)",
              desc: "Earlier system: key archetypes (Leonardo, Rumi, Lao Tzu, Sun Tzu, Camus) carry named cognitiveMoves objects. Still injected alongside ARCHETYPE_INTEGRATION for depth archetypes.",
            },
            {
              title: "llm.js — Prompt Injection",
              desc: 'Both systems assembled and injected: ARCHETYPE_INTEGRATION under "ARCHETYPE INTEGRATION — ACTIVE LENSES" and ARCHETYPE_METHODS under "THINKING METHODS — ways to THINK, not things to say."',
            },
            {
              title: "synthesisEngine.js",
              desc: "During collision detection, cognitiveTools from both archetypes are pulled and cross-applied — tools from incompatible thinkers forced to operate on the same problem.",
            },
          ]}
        />
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
        <ModalDesc style={{ marginTop: "12px" }}>
          These aren't Leonardo quotes — they're operations. When the inventor
          archetype is active, Claude is told to <em>apply</em> saperVedere to
          the conversation. Not to quote Leonardo. To see the way Leonardo saw.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="The Metabolization Metaphor">
        <ModalDesc>
          The system prompt describes it directly:{" "}
          <em>
            "You don't think 'what would Watts say?' then 'what would Carlin
            add?' That's too slow, too mechanical. Instead: you've metabolized
            them. When you speak, they're all present the way a chef's training
            is present in every dish — not announced, just there."
          </em>
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          That's the design intent. The thinkers don't take turns. Their methods
          are already active in how Pneuma approaches the question — before it
          speaks.
        </ModalDesc>
      </ModalSection>
    </>
  );
}

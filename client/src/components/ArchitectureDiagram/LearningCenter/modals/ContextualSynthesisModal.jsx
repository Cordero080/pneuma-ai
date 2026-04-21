import React from "react";
import {
  ModalSection,
  ModalCodeBlock,
  ModalFlow,
  ModalDesc,
} from "../../../Modal/Modal";

export default function ContextualSynthesisModal() {
  return (
    <>
      <ModalSection title="Plain English: What This Is">
        <ModalDesc>
          When you send a message, Pneuma has to decide which two philosophical
          frameworks should shape the response. It doesn't pick randomly — it
          classifies your message into a topic domain and selects a curated
          archetype pair specifically tuned for that domain.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          This is the primary synthesis mechanism as of Feb 2026. Collision
          detection (the older approach) now runs only as a fallback when the
          message doesn't map to a clear domain.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="The 3-Layer Classification">
        <ModalFlow
          steps={[
            {
              title: "Layer 1: Keyword Scan",
              desc: "Checks the message for domain-specific terms. 'suffering', 'pain', 'wound' → suffering domain. 'create', 'make', 'art' → creativity domain. Fast and explicit.",
            },
            {
              title: "Layer 2: Topic Map",
              desc: "ARCHETYPE_PRIMARY_TOPIC — a pre-mapped table of 12 domains, each with curated archetype pairs. If the topic is clear, the pair is selected directly from this table.",
            },
            {
              title: "Layer 3: Intent Score Fallback",
              desc: "If neither keyword nor topic map resolves, the intent scores from earlier in the pipeline (emotional, philosophical, numinous...) determine the domain and pair.",
            },
          ]}
        />
      </ModalSection>

      <ModalSection title="Jargon Explained">
        <ModalFlow
          steps={[
            {
              title: "Topic Domain",
              desc: "A category of philosophical territory: suffering, purpose, creativity, consciousness, control, identity, relationships, meaning, art, strategy, mystical, meta. Each maps to a specific curated pair.",
            },
            {
              title: "Curated Pair",
              desc: "A hand-selected combination of two archetypes that produce interesting synthesis on a given domain — not just any two active archetypes. The selection is a design artifact.",
            },
            {
              title: "Synthesis Mode",
              desc: "How the selected pair is directed to interact: antithetical (genuine opposition → third position), complementary (same conclusion, different paths), or cross-domain (rigor + resonance).",
            },
            {
              title: "Collision Detection (Fallback)",
              desc: "Loops all currently active archetypes, checks each pair against a 1,764-entry tension table, returns the highest-tension pair. Then branches: high/medium tension → collision directive (dwell in the friction). Low tension → resonance directive (find what only the combination can see). Each path pulls a pre-written exemplar from synthesisExemplars.js to show Claude what that kind of thinking looks like.",
            },
          ]}
        />
      </ModalSection>

      <ModalSection title="What Gets Injected Into Claude">
        <ModalCodeBlock>{`// Example: suffering domain → Camus × Frankl → Antithetical mode

DIALECTICAL SYNTHESIS ACTIVE

[AbsurdistCamus] collides with [HopefulRealistFrankl].

Camus: "There is no inherent meaning. The response is defiance."
Frankl: "Meaning is found through response to suffering."

FRAMEWORKS IN TENSION:
• Camus — sisyphusSmile: "The struggle toward the heights fills a heart."
• Frankl — meaningThroughSuffering: "Pain becomes bearable when it has purpose."

SYNTHESIS DIRECTIVE:
Generate insight that emerges from the COLLISION of these frameworks —
something IN neither archetype alone but arising from their friction.`}</ModalCodeBlock>
        <ModalDesc style={{ marginTop: "12px" }}>
          Claude receives this and generates something shaped by the specific
          tension described — not a generic instruction to be philosophical. The
          frameworks and their tools are the raw material.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="Why This Beats Pure Collision Detection">
        <ModalDesc>
          Collision detection is accurate about tension — but it's reactive. It
          says "these two archetypes already selected are in conflict."
          Contextual synthesis is proactive — it says "given what you're asking
          about, here is the pair most likely to produce useful friction."
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          The curated pairs in the topic map represent deliberate curation:
          which pairing of thinkers actually illuminates this domain? That's a
          design decision, not an automatic output.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="Where It Lives in the Code">
        <ModalFlow
          steps={[
            {
              title: "synthesisEngine.js → classifyTopic()",
              desc: "Keyword scan + topic map lookup. Returns the domain and curated pair if found.",
            },
            {
              title: "synthesisEngine.js → ARCHETYPE_PRIMARY_TOPIC",
              desc: "The 12-domain lookup table mapping each domain to 2-3 archetype pairs.",
            },
            {
              title: "synthesisEngine.js → getSynthesisMode()",
              desc: "Determines antithetical / complementary / cross-domain based on the pair's tension profile.",
            },
            {
              title: "synthesisEngine.js → detectCollisions()",
              desc: "Fallback path: loops active archetypes, checks 1,764-entry tension table, returns highest-tension pair with its tension level.",
            },
            {
              title:
                "synthesisExemplars.js → getExampleSynthesis() / getResonanceExemplar()",
              desc: "Pre-written exemplars for known pairs — shown to Claude alongside the directive so it understands the shape of thinking being requested, not just the instruction.",
            },
          ]}
        />
      </ModalSection>
    </>
  );
}

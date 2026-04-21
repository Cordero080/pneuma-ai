import React from "react";
import { ModalSection, ModalFlow, ModalDesc } from "../../../Modal/Modal";

export default function ArchitecturePhilosophyModal() {
  return (
    <>
      <ModalSection title="The Mechanisms Are Standard">
        <ModalDesc>
          Every technical mechanism Pneuma uses exists independently: vector
          databases, prompt injection, conversation threading, conditional
          context loading. None of these are novel. You could describe any one
          of them in a paragraph and someone could implement it.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          This matters to say directly — because the claim isn't about inventing
          new infrastructure. The claim is about what was <em>designed into</em>{" "}
          that infrastructure.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="The Design Is the Work">
        <ModalFlow
          steps={[
            {
              title: "Which 43 thinkers",
              desc: "Not arbitrary. Each archetype covers a distinct cognitive territory. The selection creates a field with genuine tension — dark pole, light pole, grounding, ontological, strategic, meta.",
            },
            {
              title: "What their cognitive moves are",
              desc: "Documenting saperVedere or wuWei as named thinking operations — not summaries — required reading primary sources and deciding what each thinker's methodology actually was.",
            },
            {
              title: "The 1,764 tension pairs",
              desc: "Every combination of 42 archetypes mapped for incompatibility level (high / medium / low). A pre-computed design artifact. You can't derive this from the mechanism — someone decided it.",
            },
            {
              title: "Collision → synthesis, not blending",
              desc: "The architectural decision to force incompatible archetypes to synthesize rather than averaging them out. That choice is what makes outputs surprising.",
            },
            {
              title: "The inversion",
              desc: "Personality as the controlling architecture, LLM as raw material. Most systems invert this — LLM first, personality layered on output. The inversion changes what's possible.",
            },
          ]}
        />
      </ModalSection>

      <ModalSection title="Why You Can't Just Copy the Mechanism">
        <ModalDesc>
          If someone cloned the codebase without the archetype definitions, the
          cognitive tools, and the tension map — they'd have an empty framework.
          The infrastructure runs on the content decisions. Those decisions{" "}
          <em>are</em> the system.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          This is also why Pneuma is described as a{" "}
          <strong>personality architecture</strong>, not a prompt template. The
          design choices compound: which thinkers create which tensions, which
          tensions produce which kinds of synthesis, which synthesis shapes
          which kinds of responses. That compounding is not in the code. It's in
          the decisions that produced the code.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="The Practical Consequence">
        <ModalDesc>
          When Pneuma feels different from a well-prompted Claude — the
          difference isn't coming from a clever trick. It's coming from the
          accumulated weight of specific choices about what each thinker's
          methods actually are, how they conflict, and what to do with that
          conflict. The mechanism is transparent. The design is the thing.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="Workflow or Agent?">
        <ModalDesc>
          Pneuma is a <strong>workflow</strong>. Every step — archetype
          selection, RAG retrieval, inner monologue, tone selection — is
          hardcoded in a fixed sequential order by JavaScript. Claude is never
          given a list of tools and asked to decide what to run next.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          The only agentic behavior is a narrow two-tool loop inside the single
          Claude call: Claude can optionally read a Pneuma source file or search
          Wikipedia before replying. That loop exists purely to let Claude
          gather information — it doesn't change what runs next in the pipeline.
          Claude generates content <em>inside</em> the workflow. It doesn't
          orchestrate it.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          The practical consequence: <strong>reliability</strong>. A pure agent
          can be slow and unpredictable because the LLM decides the sequence.
          Pneuma keeps latency low and output controlled by owning the pipeline
          in code, delegating only the final generation step to Claude.
        </ModalDesc>
      </ModalSection>
    </>
  );
}

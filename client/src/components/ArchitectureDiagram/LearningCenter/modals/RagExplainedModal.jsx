import React from "react";
import {
  ModalSection,
  ModalCodeBlock,
  ModalFlow,
  ModalDesc,
} from "../../../Modal/Modal";

export default function RagExplainedModal() {
  return (
    <>
      <ModalSection title="The Core Question">
        <ModalDesc>
          <strong>What actually happens with the quotes?</strong> They get
          LITERALLY injected into the prompt. Claude sees the exact text. It's
          not a hint or a prompt—it's data that becomes part of what Claude
          reads before responding.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="Without RAG vs With RAG">
        <ModalDesc>
          <strong>Without RAG:</strong> You ask about suffering. Claude responds
          from what it "remembers" from training—fuzzy, paraphrased, possibly
          inaccurate quotes.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          <strong>With RAG:</strong> You ask about suffering. Pneuma searches
          knowledge bases, finds Rumi's exact quote + context, literally pastes
          it into the prompt, THEN Claude responds. Claude now sees the real
          quote and can use it accurately.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="What Gets Injected (Literally)">
        <ModalCodeBlock>{`RELEVANT WISDOM FROM YOUR KNOWLEDGE BASE:

Jalal ad-Din Rumi:
• "The wound is the place where the Light enters you."
  [Context: Pain creates openings. What feels like
  destruction can become the entry point for grace.]

Viktor Frankl:
• "Life is never made unbearable by circumstances,
  but only by lack of meaning and purpose."
  [Context: Even in suffering, meaning can be found...]

CROSS-POLLINATE: Connect these passages to each other.
Don't just quote — TRANSFORM through your own synthesis.`}</ModalCodeBlock>
        <ModalDesc style={{ marginTop: "12px" }}>
          This text is literally pasted into Claude's system prompt. Claude
          reads it like instructions. The quotes are DATA, the "[Context:]"
          explains what they mean, and "CROSS-POLLINATE" tells Claude what to do
          with them.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="How Vector Search Finds Relevant Quotes">
        <ModalFlow
          steps={[
            {
              title: "Your Message",
              desc: '"I feel broken after what happened"',
            },
            {
              title: "Convert to Vector",
              desc: "Message becomes [0.2, -0.5, 0.8, ...] (1500+ numbers)",
            },
            {
              title: "Compare",
              desc: "Check distance to every stored passage's vector",
            },
            {
              title: "Match Found",
              desc: 'Rumi\'s "wound where Light enters" is mathematically close',
            },
            { title: "Inject", desc: "Paste quote + context into prompt" },
            {
              title: "Generate",
              desc: "NOW Claude responds, seeing the relevant wisdom",
            },
          ]}
        />
      </ModalSection>

      <ModalSection title="What Claude Does With It">
        <ModalDesc>
          Claude is a pattern-completion machine. It sees the system prompt
          (including injected quotes), then your message, then generates text
          that "fits" that context. The quotes aren't magic—they're just text
          Claude reads and can reference in its response.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          <strong>The key insight:</strong> RAG doesn't make Claude "understand"
          the quotes differently. It just ensures Claude has ACCURATE source
          material to work with instead of relying on fuzzy training memories.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="The Analogy">
        <ModalDesc>
          Imagine you're taking an essay test. <strong>Without RAG:</strong> You
          write from memory—might get quotes wrong. <strong>With RAG:</strong>{" "}
          You're allowed to have a reference book open. You can look up exact
          quotes and cite them correctly. You still write the essay; the book
          just ensures accuracy.
        </ModalDesc>
      </ModalSection>
    </>
  );
}

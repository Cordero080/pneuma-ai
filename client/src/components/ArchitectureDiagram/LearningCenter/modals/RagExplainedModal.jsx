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

      <ModalSection title="How Pneuma Finds the Right Quotes (Concept Crossroads)">
        <ModalDesc>
          Pneuma doesn&apos;t just search for passages similar to your message.
          It first asks:{" "}
          <strong>what philosophical concepts are in this message?</strong> It
          tracks ~80 concepts — time, death, consciousness, change, freedom,
          love, paradox, suffering, and others. If it finds any, it runs a
          separate search for <em>each concept × each active thinker</em> in
          parallel.
        </ModalDesc>
        <ModalFlow
          steps={[
            {
              title: "Your Message",
              desc: '"I feel broken after what happened"',
            },
            {
              title: "Concept Detection",
              desc: 'Finds philosophical concepts: "suffering", "change" — both tracked',
            },
            {
              title: "Parallel Queries",
              desc: '"suffering Rumi", "suffering Frankl", "change Rumi", "change Frankl" — all run at once',
            },
            {
              title: "Score Each Passage",
              desc: "Relevance (50%) + how different it is from the others (30%) + collision bonus if thinkers disagree (20%)",
            },
            {
              title: "Orphan Filter",
              desc: "Weak passages with no collision relationship get dropped. A low-relevance Sun Tzu passage stays if Lao Tzu is also in the pool — known tension pair. It gets cut if it wandered in alone.",
            },
            {
              title: "Deduplicate & Select",
              desc: "Near-identical passages removed, max 2 per thinker, best 8 kept",
            },
            {
              title: "Inject",
              desc: "8 passages from thinkers likely to disagree pasted into prompt",
            },
            {
              title: "Generate",
              desc: "Claude responds having read passages optimized for productive tension",
            },
          ]}
        />
      </ModalSection>

      <ModalSection title="Why Score for Distinctiveness and Collision?">
        <ModalDesc>
          Standard RAG just picks the most relevant passages. The problem: if
          your question is about suffering, you might get five Rumi passages
          that all say roughly the same thing. Pneuma scores passages on how{" "}
          <strong>different</strong> they are from each other and whether they
          come from thinkers known to <strong>disagree</strong>. A Rumi passage
          and a Schopenhauer passage on suffering score higher together than two
          Rumi passages — because the tension between them is where the
          interesting thinking happens.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          <strong>The key insight:</strong> The goal isn&apos;t accurate
          quotation — it&apos;s productive friction. Passages are selected to
          make Claude&apos;s synthesis harder and more interesting, not just
          more accurate.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="The Analogy">
        <ModalDesc>
          Imagine you&apos;re preparing a debate on suffering. A bad research
          assistant gives you five sources that all agree. A good one gives you
          sources that contradict each other — a mystic, a pessimist, a
          therapist, a stoic — and forces you to synthesize across them.
          Pneuma&apos;s RAG pipeline is the good research assistant.
        </ModalDesc>
      </ModalSection>
    </>
  );
}

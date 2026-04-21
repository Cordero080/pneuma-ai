import React, { useState } from "react";
import Modal, {
  ModalSection,
  ModalFlow,
  ModalDesc,
  ModalInfoGrid,
  ModalInfoCard,
} from "../../../Modal/Modal";
import {
  LayersIcon,
  BrainIcon,
  NeuralIcon,
  BookIcon,
} from "../../../Modal/Icons";

export default function LlmBasicsModal() {
  const [nestedModal, setNestedModal] = useState(null);

  return (
    <>
      <ModalSection title="The Simple Version">
        <ModalDesc>
          Large Language Models (LLMs) like Claude are essentially very
          sophisticated "next word predictors." They've read billions of
          documents and learned patterns about how language works—what words
          tend to follow other words, how ideas connect, how conversations flow.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="Key Concepts">
        <ModalInfoGrid>
          <ModalInfoCard
            title="Transformers"
            desc="The architecture that makes modern AI possible"
            icon={LayersIcon}
            onClick={() => setNestedModal("transformers")}
          />
          <ModalInfoCard
            title="Attention"
            desc="How AI focuses on what matters in text"
            icon={BrainIcon}
            onClick={() => setNestedModal("attention")}
          />
          <ModalInfoCard
            title="Feed-Forward Networks"
            desc="Where knowledge is actually stored"
            icon={NeuralIcon}
            onClick={() => setNestedModal("feedforward")}
          />
          <ModalInfoCard
            title="Tokens"
            desc="How AI reads and counts text"
            icon={BookIcon}
            onClick={() => setNestedModal("tokens")}
          />
        </ModalInfoGrid>
      </ModalSection>

      <ModalSection title="In Pneuma">
        <ModalDesc>
          Pneuma uses Anthropic's Claude as its "thinking engine." But Claude
          alone is generic—it's Pneuma's system prompt (the identity,
          archetypes, synthesis instructions) that gives it personality. Think
          of Claude as the brain, and Pneuma's architecture as the mind built on
          top.
        </ModalDesc>
      </ModalSection>

      {/* Nested modals for LLM concepts */}
      <Modal
        isOpen={nestedModal === "transformers"}
        onClose={() => setNestedModal(null)}
        title="Transformers"
        icon={LayersIcon}
      >
        <ModalSection title="The Breakthrough">
          <ModalDesc>
            Before 2017, AI read text one word at a time, like reading through a
            tiny keyhole. The Transformer architecture (introduced in the paper
            "Attention Is All You Need") changed everything—it lets AI see
            entire passages at once.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="How They Work">
          <ModalFlow
            steps={[
              {
                title: "Input Embedding",
                desc: "Convert words to numbers (vectors)",
              },
              {
                title: "Positional Encoding",
                desc: "Mark where each word appears in sequence",
              },
              {
                title: "Attention Layers",
                desc: "Figure out which words relate to which",
              },
              {
                title: "Feed-Forward Layers",
                desc: "Process and transform the information",
              },
              {
                title: "Output",
                desc: "Predict the next token (word piece)",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="Why It Matters">
          <ModalDesc>
            Transformers can understand that "bank" means something different in
            "river bank" vs "bank account" because they see the whole sentence
            at once. This contextual understanding is what makes modern AI feel
            intelligent.
          </ModalDesc>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "attention"}
        onClose={() => setNestedModal(null)}
        title="Attention Mechanism"
        icon={BrainIcon}
      >
        <ModalSection title="What Is Attention?">
          <ModalDesc>
            When you read "The cat sat on the mat because it was tired," you
            instantly know "it" refers to "cat," not "mat." That's
            attention—understanding which words connect to which.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Self-Attention">
          <ModalDesc>
            AI computes attention scores between every pair of words. High
            scores mean strong connection. In "The doctor told the nurse that
            she was late," attention helps determine whether "she" refers to
            doctor or nurse.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Multi-Head Attention">
          <ModalDesc>
            Instead of one attention calculation, Transformers use many "heads"
            in parallel. Each head might focus on different relationships—one on
            grammar, one on meaning, one on style. This parallel processing is
            why AI can understand such complex patterns.
          </ModalDesc>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "feedforward"}
        onClose={() => setNestedModal(null)}
        title="Feed-Forward Networks"
        icon={NeuralIcon}
      >
        <ModalSection title="The Knowledge Storage">
          <ModalDesc>
            If attention figures out relationships, feed-forward networks (FFN)
            store actual knowledge. When Claude knows that Paris is the capital
            of France, that information is encoded in FFN weights.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="How They Work">
          <ModalDesc>
            Each FFN layer is like a massive lookup table with billions of
            entries. After attention determines "we're talking about capitals,"
            the FFN retrieves "Paris" as the answer. This is an
            oversimplification, but captures the essence.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="In Pneuma">
          <ModalDesc>
            Pneuma's archetypes don't add new FFN knowledge—Claude already knows
            about Jung, Rumi, etc. Instead, Pneuma's prompts activate and
            emphasize certain knowledge pathways over others, shaping how Claude
            draws on what it knows.
          </ModalDesc>
        </ModalSection>
      </Modal>

      <Modal
        isOpen={nestedModal === "tokens"}
        onClose={() => setNestedModal(null)}
        title="Tokens"
        icon={BookIcon}
      >
        <ModalSection title="What Are Tokens?">
          <ModalDesc>
            AI doesn't read words—it reads "tokens," which are word pieces.
            Common words like "the" are one token. Unusual words get split:
            "pneumatology" might be "pne" + "umat" + "ology" (3 tokens).
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Why It Matters">
          <ModalDesc>
            Tokens determine cost and limits. Claude claude-sonnet-4-20250514
            can handle 200,000 tokens (~150,000 words) in a conversation.
            Pneuma's system prompt uses ~4,000 tokens, leaving plenty of room
            for discussion.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Rule of Thumb">
          <ModalDesc>
            In English, 1 token ≈ 4 characters ≈ ¾ of a word. A typical response
            is 200-500 tokens. Pneuma budgets ~1,200 tokens for responses to
            allow for depth without excessive cost.
          </ModalDesc>
        </ModalSection>
      </Modal>
    </>
  );
}

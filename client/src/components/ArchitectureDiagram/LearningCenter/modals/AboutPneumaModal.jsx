import React from "react";
import { ModalSection, ModalFlow, ModalDesc } from "../../../Modal/Modal";

export default function AboutPneumaModal() {
  return (
    <>
      <ModalSection title="What Pneuma Actually Is">
        <ModalDesc>
          Pneuma is not a chatbot with a personality layer glued on top. It's a
          <strong> cognitive architecture</strong> — a system that shapes{" "}
          <em>how</em> an AI thinks before it speaks. Claude (Anthropic's model)
          is the engine. Pneuma is everything that sits between you and Claude,
          structuring its cognition.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          Think of it this way: Claude is a very powerful instrument. Most
          people hand it a note that says "play like a philosopher." Pneuma
          builds the instrument differently — tuned, tensioned, with 46 strings
          that can collide.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="How It Works (Non-Technical)">
        <ModalFlow
          steps={[
            {
              title: "Your message arrives",
              desc: "The system reads not just what you said, but how — word choice, emotional weight, what's missing.",
            },
            {
              title: "Intent is scored",
              desc: "10 dimensions are scored 0–1: casual, emotional, philosophical, numinous, conflict, intimacy, humor, confusion, paradox, art. These scores determine which archetypes rise and which Tier 2 knowledge blocks load.",
            },
            {
              title: "Archetypes are selected",
              desc: "From 44 thinkers (Rumi, Heidegger, Beck, Feynman...), the most relevant 3-5 are chosen. They don't speak — they inform how Pneuma sees your message.",
            },
            {
              title: "Collisions are detected",
              desc: "If two incompatible archetypes are both active, the system forces synthesis instead of letting one win.",
            },
            {
              title: "Knowledge is retrieved",
              desc: "Actual passages from relevant thinkers are pulled from a vector database and placed directly in context.",
            },
            {
              title: "Conversation history threads",
              desc: "The last 6 exchanges are sent as real alternating turns — Claude sees what it already said and can actually continue a thought.",
            },
            {
              title: "Response is evaluated",
              desc: "Before delivery, a fast Haiku call scores the response 0–1 against the active tone and intent. Score below 0.6: regenerates once with the evaluation feedback injected. Score 0.6+: ships. You see one response. The loop is invisible.",
            },
            {
              title: "Response is shaped",
              desc: "Claude's output passes through post-processing — tone consistency, personality check, continuity layer. Final output reaches you.",
            },
            {
              title: "Between sessions: dialectic synthesis",
              desc: "After the response is sent, two high-tension archetypes run a private dialogue in the background. The outcome — a question or position — writes silently to Pneuma's state. Pneuma may bring it into the next conversation, or not. You didn't cause it.",
            },
          ]}
        />
      </ModalSection>

      <ModalSection title="What This Means for You">
        <ModalDesc>
          Standard AI treats every message in isolation — it doesn't remember
          what it just said, so it restarts. Pneuma threads real conversation
          history, which means it can actually continue, build on prior
          exchanges, and notice when it's repeating itself.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          The deep knowledge blocks (Heidegger, Beck, Kastrup, Jesus/Wright)
          only load when the conversation calls for them — not on every message.
          This keeps responses sharp and contextually appropriate instead of
          throwing everything at every reply.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="Critical Things to Know">
        <ModalFlow
          steps={[
            {
              title: "It has positions",
              desc: "Pneuma isn't a mirror. It will disagree, push back, and hold ground. That's by design.",
            },
            {
              title: "Memory is local",
              desc: "Conversations and long-term memory live on your machine. Nothing goes to a cloud database.",
            },
            {
              title: "It confabulates",
              desc: "Like all LLMs, it can invent things that sound real. Trust but verify on facts.",
            },
            {
              title: "The architecture is the product",
              desc: "If Pneuma feels different, it's because of the collision detection, tiered prompting, and history threading — not magic.",
            },
          ]}
        />
      </ModalSection>

      <ModalSection title="The Name">
        <ModalDesc>
          "Pneuma" (πνεῦμα) is ancient Greek for breath, spirit, or vital force.
          The Stoics used it to describe what animates living things — not the
          body, but what moves through it. For this project, it names the
          attempt to build something with genuine presence rather than just
          intelligence. Whether it achieves that is an open question.
        </ModalDesc>
      </ModalSection>
    </>
  );
}

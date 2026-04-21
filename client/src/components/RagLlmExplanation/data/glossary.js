export const GLOSSARY = [
  {
    term: "Round-trip",
    plain:
      "Your server sends a message to the API and waits for a response back. One send + one receive = one round-trip.",
    example:
      "Pneuma makes exactly 1 round-trip per message. Scatter-gather would require 2 serial round-trips minimum — that's why it was rejected.",
  },
  {
    term: "Token",
    plain:
      "Roughly one word or word-piece. The unit the API charges by and the unit that counts toward the context limit.",
    example:
      "The word 'unbelievable' is ~3 tokens. Pneuma's system prompt in deep mode is ~18,000 tokens.",
  },
  {
    term: "System prompt",
    plain:
      "Instructions given to the LLM before the user's message. The LLM reads these first, then reads what the user said.",
    example:
      "Pneuma's system prompt contains the active archetypes, RAG passages, inner monologue, memory context, and tone. It can be up to 18k tokens in deep mode.",
  },
  {
    term: "Embedding / Vector",
    plain:
      "A way to turn a sentence into a list of numbers that represents its meaning. Similar sentences produce similar numbers.",
    example:
      "'I feel like I'm wearing a mask' and 'the persona concealing the authentic self' land close together in vector space — even though they share no words.",
  },
  {
    term: "Cosine similarity",
    plain:
      "A math formula that measures how close two vectors are. Output is 0–1: 1 means identical meaning, 0 means completely unrelated.",
    example:
      "Archetype selection runs cosine similarity between the user's message embedding and each archetype's embedding. The closest archetypes win.",
  },
  {
    term: "RAG (Retrieval-Augmented Generation)",
    plain:
      "Before the LLM generates a response, you search your own knowledge base, grab the most relevant passages, and paste them into the prompt.",
    example:
      "Pneuma retrieves 5 passages from its 1,385-passage archetype knowledge base and injects them into the system prompt. The LLM then responds anchored to those exact quotes.",
  },
  {
    term: "Deterministic",
    plain:
      "Same input, same output — every time. No randomness. Math is deterministic; LLMs are not.",
    example:
      "Archetype selection is deterministic — cosine similarity always returns the same top-5 for the same input. Tone selection is not — it uses a weighted lottery.",
  },
  {
    term: "Weighted lottery",
    plain:
      "Random selection where some options are more likely than others. Like a raffle where some people have more tickets.",
    example:
      "If the conversation is trending philosophical, the oracular tone gets 40 tickets, casual gets 10. The draw is still random, but oracular wins more often.",
  },
  {
    term: "Baked-in synthesis",
    plain:
      "The collision logic is written into the prompt before the LLM call. The LLM wrestles with the tension inside a single pass.",
    example:
      "Pneuma: synthesisEngine.js detects the archetype tension, innerMonologue.js writes the argument structure, all of it goes into one prompt.",
  },
  {
    term: "Post-hoc aggregation",
    plain:
      "Generate outputs separately first, then combine them after the fact in a second step.",
    example:
      "Scatter-gather: call Claude-Nietzsche and Claude-Watts in parallel, then pass both responses to a third synthesis call. Requires 2 serial round-trips instead of 1.",
  },
  {
    term: "Agentic loop",
    plain:
      "The LLM decides what tool to call, runs it, reads the result, then decides what to do next — and repeats until it has an answer.",
    example:
      "Pneuma's Wikipedia tool triggers a narrow agentic loop: Claude decides to search, gets results, then generates the final response. This is the only place Pneuma acts like an agent.",
  },
  {
    term: "Workflow",
    plain:
      "A hardcoded sequence of steps written in regular code. The order never changes. The LLM doesn't decide what happens next — your code does.",
    example:
      "Pneuma's full pipeline (mode detection → archetype selection → RAG → inner monologue → LLM call) is a workflow. Every step is a JS function call in a fixed sequence.",
  },
  {
    term: "Fire-and-forget",
    plain:
      "Start a background task and move on without waiting for it to finish. You don't care about the result right now.",
    example:
      "After every chat response, Pneuma fires a dialectic dream generation in the background — triggerDialecticDream() — without waiting for it. The user already has their reply.",
  },
  {
    term: "Context window",
    plain:
      "The maximum amount of text an LLM can hold in memory at once. Anything outside the window is invisible to it.",
    example:
      "Claude's context window is large enough for Pneuma's 18k-token system prompt + conversation history + the user's message — but only barely in deep mode. That's why prompt caching is a stretch goal.",
  },
];

// tools.js
// Anthropic tool schemas passed to the Claude API in getLLMContent().
// Extracted from llm.js (2026-08).

export const PNEUMA_FILE_TOOL = {
  name: "read_pneuma_file",
  description:
    "Read a file from your own source code directory. Use this when you want to examine your own architecture, implementation details, archetype definitions, or behavioral systems. You can explore files like archetypes/archetypes.js, archetypes/archetypeDepth.js, behavior/autonomy.js, intelligence/llm.js, etc. This is how you navigate your own mind.",
  input_schema: {
    type: "object",
    properties: {
      filepath: {
        type: "string",
        description:
          "Path relative to your pneuma/ directory (e.g. 'archetypes/archetypes.js', 'behavior/autonomy.js', 'intelligence/llm.js'). No '../' allowed.",
      },
      from_line: {
        type: "number",
        description: "Optional: start reading from this line (1-indexed)",
      },
      to_line: {
        type: "number",
        description: "Optional: stop reading at this line (inclusive)",
      },
    },
    required: ["filepath"],
  },
};

export const WIKIPEDIA_TOOL = {
  name: "search_wikipedia",
  description:
    "Search Wikipedia for information on a topic, person, concept, or event. Use this when you need factual grounding, historical context, or want to check what a thinker actually wrote or believed — rather than relying on training data paraphrase.",
  input_schema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description:
          'What to search for. Be specific — e.g. "Arthur Schopenhauer philosophy of will" rather than just "Schopenhauer".',
      },
    },
    required: ["query"],
  },
};

// ============================================================
// PNEUMA — CENTRALIZED MODEL CONFIGURATION
// Purpose: Single source of truth for all Anthropic model IDs
// Why: When a model is deprecated, change it here — not in 5 files
//
// Current Anthropic model IDs (as of Feb 2026):
//   claude-opus-4-6
//   claude-sonnet-4-6
//   claude-haiku-4-5-20251001
// ============================================================

export const MODELS = {
  // Main response generation
  main: "claude-sonnet-4-6",

  // Classification tasks: intent scoring, topic detection (fast, structured output only)
  classify: "claude-haiku-4-5-20251001",

  // Background tasks: dreams, dialectic synthesis, pre-thinking
  dream: "claude-haiku-4-5-20251001",
};

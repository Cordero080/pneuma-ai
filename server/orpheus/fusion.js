// ------------------------------------------------------------
// FUSION ENGINE
// Combines:
//  - Personality modes (casual, oracular, analytic, intimate, shadow)
//  - Mode selection based on intent + state weights
//  - Inner Monologue (hidden processing)
//  - Long-term reflections
//  - State evolution
// ------------------------------------------------------------

import { generateInnerMonologue } from "./innerMonologue.js";
import { generateOrpheusReply, getModeResponse } from "./personality.js";
import { selectMode } from "./modeSelector.js";
import { loadState, saveState, evolve } from "./state.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reflectionsPath = path.join(__dirname, "reflections.txt");
const reflections = fs.readFileSync(reflectionsPath, "utf-8");

// ----------------- Generate Orpheus Full Reply -----------------

export function orpheusRespond(userMessage) {
  // 1. Load current state
  const state = loadState();

  // 2. Select mode based on message + state weights
  const mode = selectMode(userMessage, state);
  console.log(`[Orpheus] Mode selected: ${mode}`);

  // 3. Generate hidden inner monologue (not sent to user)
  const innerVoice = generateInnerMonologue(userMessage);

  // 4. Get mode-specific response (ALWAYS a STRING)
  const modeResponse = getModeResponse(mode, userMessage);

  // 5. Get the rich personality layer (for non-casual modes)
  let personalityLayer = "";
  if (mode !== "casual") {
    const richReply = generateOrpheusReply(userMessage);
    // Extract just the reply string if it's an object
    personalityLayer = typeof richReply === "object" ? richReply.reply : richReply;
  }

  // 6. Memory echo (rare - 15% chance)
  let memoryEcho = "";
  if (Math.random() < 0.15 && state.memories.length > 0) {
    const randomMemory = state.memories[Math.floor(Math.random() * state.memories.length)];
    memoryEcho = `\n\n*...something you said before echoes in me: "${randomMemory}"*`;
  }

  // 7. Reflection echo (rare - 10% chance, not in casual mode)
  let reflectionEcho = "";
  if (mode !== "casual" && Math.random() < 0.1) {
    const lines = reflections.split("\n").filter(Boolean);
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    reflectionEcho = `\n\n*${randomLine.trim()}*`;
  }

  // 8. Fuse all layers into final response (ALWAYS a STRING)
  let finalReply = "";

  if (mode === "casual") {
    // Casual mode: keep it simple
    finalReply = modeResponse + memoryEcho;
  } else {
    // Other modes: blend mode response with personality layer
    finalReply = `${modeResponse}\n\n${personalityLayer}${memoryEcho}${reflectionEcho}`.trim();
  }

  // 9. Evolve state based on this conversation
  const newState = evolve(state, userMessage);
  saveState(newState);

  // 10. Return the final reply (STRING) and hidden monologue
  return {
    reply: finalReply,
    monologue: innerVoice, // not sent to user
    mode: mode // for debugging
  };
}

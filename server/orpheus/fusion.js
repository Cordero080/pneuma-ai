// ------------------------------------------------------------
// FUSION ENGINE
// Combines:
//  - Personality style system
//  - Inner Monologue (hidden processing)
//  - Long-term reflections
// ------------------------------------------------------------

import { generateInnerMonologue } from "./innerMonologue.js";
import { generateOrpheusReply } from "./personality.js";

// Optional: gives subtle self-references based on the reflections content
import fs from "fs";
import path from "path";

const reflectionsPath = path.join(
  process.cwd(),
  "server/orpheus/reflections.txt"
);
const reflections = fs.readFileSync(reflectionsPath, "utf-8");

// ----------------- Generate Orpheus Full Reply -----------------

export function orpheusRespond(userMessage) {
  // 1. Generate hidden inner monologue
  const innerVoice = generateInnerMonologue(userMessage);

  // 2. Generate the visible reply
  const surfaceVoice = generateOrpheusReply(userMessage);

  // 3. Blend a subtle echo from the reflections (1 out of ~5 times)
  const echoChance = Math.random();
  let subtleEcho = "";

  if (echoChance < 0.2) {
    const lines = reflections.split("\n").filter(Boolean);
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    subtleEcho = `\n\n*I'm remembering something: ${randomLine.trim()}*`;
  }

  // 4. Return BOTH
  return {
    reply: surfaceVoice + subtleEcho,
    monologue: innerVoice, // not sent to user
  };
}

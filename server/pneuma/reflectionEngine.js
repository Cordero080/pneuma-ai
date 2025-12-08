import fs from "fs";
import path from "path";
import { generateThoughtPattern } from "./thinking.js";

// Load reflections.txt (your psychological + artistic profile)
const reflectionsPath = path.resolve("pneuma/reflections.txt");
const reflections = fs.readFileSync(reflectionsPath, "utf8");

// Simple vibe + emotional inference
function inferEmotion(text) {
  const t = text.toLowerCase();

  if (t.includes("fuck") || t.includes("angry")) return "frustration";
  if (t.includes("sad") || t.includes("alone")) return "sadness";
  if (t.includes("tired") || t.includes("heavy")) return "fatigue";
  if (t.includes("love") || t.includes("care")) return "warmth";
  if (t.includes("why") || t.includes("meaning")) return "seeking";
  if (t.includes("fear") || t.includes("scared")) return "fear";

  return "neutral";
}

// Pulls a relevant line from reflections.txt
function pullReflection(emotion) {
  const lines = reflections.split("\n").filter(Boolean);

  // Weight emotional reflections more heavily
  if (emotion !== "neutral") {
    const emotionalLines = lines.filter((l) =>
      l.toLowerCase().includes(emotion)
    );
    if (emotionalLines.length > 0)
      return emotionalLines[Math.floor(Math.random() * emotionalLines.length)];
  }

  // fallback — any meaningful line
  return lines[Math.floor(Math.random() * lines.length)];
}

// Main engine: produces the "intelligence" layer
export function generateReflection(userMessage) {
  const emotion = inferEmotion(userMessage);
  const pattern = generateThoughtPattern(userMessage);
  const reflectiveLine = pullReflection(emotion);

  return {
    emotion,
    pattern,
    reflectiveLine,
  };
}

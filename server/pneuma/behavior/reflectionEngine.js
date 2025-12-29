import fs from "fs";
import path from "path";
import { generateThoughtPattern } from "../intelligence/thinking.js";

// Load reflections.txt (your psychological + artistic profile)
const reflectionsPath = path.resolve("pneuma/reflections.txt");
const reflections = fs.readFileSync(reflectionsPath, "utf8");

// ============================================================
// EMOTION PHRASE PATTERNS
// More nuanced detection beyond single keywords
// ============================================================
const emotionPhrases = {
  frustration: [
    /\b(fuck|fucking|shit|damn it|pissed|angry|furious)\b/i,
    /\b(sick of|tired of|had enough|can't stand|hate this)\b/i,
    /\b(so annoying|drives me crazy|makes me mad)\b/i,
    /\b(fed up|over it|done with)\b/i,
  ],
  sadness: [
    /\b(sad|depressed|miserable|unhappy|down|blue)\b/i,
    /\b(feel(ing)? (like )?(giving up|empty|nothing matters|hopeless))\b/i,
    /\b(can't (take|handle|do) this anymore)\b/i,
    /\b(everything (feels|is) (pointless|meaningless|empty))\b/i,
    /\b(alone|lonely|isolated|abandoned)\b/i,
    /\b(crying|tears|heartbroken|devastated)\b/i,
  ],
  fatigue: [
    /\b(tired|exhausted|drained|burnt out|burned out)\b/i,
    /\b(no energy|can't keep going|running on empty)\b/i,
    /\b(heavy|weighed down|carrying too much)\b/i,
    /\b(need (a )?break|need rest|can't anymore)\b/i,
  ],
  warmth: [
    /\b(love|care|grateful|thankful|appreciate)\b/i,
    /\b(happy|joyful|blessed|lucky)\b/i,
    /\b(means (a lot|so much)|touched|moved)\b/i,
    /\b(thank you|thanks for being)\b/i,
  ],
  seeking: [
    /\b(why|meaning|purpose|point)\b/i,
    /\b(what('s| is) (the point|it all for|this all about))\b/i,
    /\b(searching for|looking for|trying to find)\b.*\b(meaning|answers|truth)\b/i,
    /\b(don't understand|can't figure out|confused about)\b/i,
  ],
  fear: [
    /\b(fear|scared|terrified|afraid|anxious|panicking)\b/i,
    /\b(can't stop thinking|what if|worried about)\b/i,
    /\b(freaking out|losing my mind|going crazy)\b/i,
    /\b(something('s| is) wrong|bad feeling)\b/i,
  ],
  anxiety: [
    /\b(anxious|anxiety|nervous|on edge|restless)\b/i,
    /\b(can't relax|can't calm down|heart racing)\b/i,
    /\b(overthinking|spiraling|intrusive thoughts)\b/i,
    /\b(what if|worried that|scared that)\b/i,
  ],
};

// Negation patterns that flip emotion detection
const negationPatterns =
  /\b(not|don't|doesn't|isn't|aren't|wasn't|weren't|never|no longer|hardly|barely|wasn't even|not really|not actually)\b/i;

// Check if negation appears before emotion keyword (within ~5 words)
function hasNegationBefore(text, emotionMatch) {
  if (!emotionMatch) return false;
  const matchIndex = text.toLowerCase().indexOf(emotionMatch.toLowerCase());
  if (matchIndex === -1) return false;

  // Look at the 40 characters before the emotion word
  const before = text.substring(Math.max(0, matchIndex - 40), matchIndex);
  return negationPatterns.test(before);
}

// Advanced emotional inference with phrase patterns and negation handling
function inferEmotion(text) {
  const t = text.toLowerCase();

  // Check each emotion category
  for (const [emotion, patterns] of Object.entries(emotionPhrases)) {
    for (const pattern of patterns) {
      const match = t.match(pattern);
      if (match) {
        // Check for negation before the matched phrase
        if (hasNegationBefore(t, match[0])) {
          continue; // Skip this match, it's negated
        }
        return emotion;
      }
    }
  }

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

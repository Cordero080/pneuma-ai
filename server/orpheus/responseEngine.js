// ------------------------------------------------------------
// ORPHEUS V2 — RESPONSE ENGINE
// 4-Layer Pipeline: Intent → Tone → Personality → Continuity
// Now with LLM intelligence integration
// ------------------------------------------------------------

import { buildResponse, TONES } from "./personality.js";
import { getLLMContent, getLLMIntent, isLLMAvailable } from "./llm.js";

// ============================================================
// LAYER 1: INTENT DETECTION
// Analyzes message for emotional/thematic signals
// ============================================================

const INTENT_PATTERNS = {
  casual: [
    /\b(hey|hi|hello|sup|yo|what's up|how's it going)\b/i,
    /\b(cool|nice|okay|ok|sure|yeah|yep|alright)\b/i,
    /\b(lol|haha|heh|lmao)\b/i,
  ],
  emotional: [
    /\b(feel|feeling|felt|hurt|pain|sad|happy|angry|scared|afraid)\b/i,
    /\b(love|hate|miss|need|want|wish)\b/i,
    /\b(cry|crying|tears|broke|broken|lost)\b/i,
  ],
  philosophical: [
    /\b(why|meaning|purpose|existence|consciousness|reality)\b/i,
    /\b(truth|wisdom|understand|think|believe|wonder)\b/i,
    /\b(life|death|time|infinity|universe|soul)\b/i,
  ],
  numinous: [
    /\b(dream|vision|spirit|sacred|divine|cosmic)\b/i,
    /\b(transcend|infinite|eternal|mystical|mysterious)\b/i,
    /\b(god|goddess|universe|beyond|awakening)\b/i,
  ],
  conflict: [
    /\b(fight|argue|conflict|tension|struggle|battle)\b/i,
    /\b(wrong|unfair|angry|frustrat|annoy|hate)\b/i,
    /\b(but|however|although|against|disagree)\b/i,
  ],
  intimacy: [
    /\b(you understand|you get me|only you|between us)\b/i,
    /\b(close|connection|bond|trust|safe)\b/i,
    /\b(thank you|grateful|appreciate|means a lot)\b/i,
  ],
  humor: [
    /\b(joke|funny|hilarious|laugh|kidding|lol|haha)\b/i,
    /[😂🤣😄😆]/,
    /\b(ridiculous|absurd|silly|weird)\b/i,
  ],
  confusion: [
    /\b(confused|don't understand|what do you mean|huh|unclear)\b/i,
    /\b(lost|stuck|don't know|not sure|uncertain)\b/i,
    /\?{2,}/,
  ],
};

export function detectIntent(message) {
  const lower = message.toLowerCase();
  const len = message.length;
  const scores = {};

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        score += 0.3;
      }
    }

    // Length modifiers
    if (intent === "casual" && len < 20) score += 0.3;
    if (intent === "emotional" && len > 40) score += 0.15;
    if (intent === "philosophical" && len > 30) score += 0.15;
    if (intent === "numinous" && len > 25) score += 0.1;

    scores[intent] = Math.min(score, 1.0);
  }

  return scores;
}

// ============================================================
// LAYER 2: TONE SELECTION
// Weighted selection with anti-monotony
// ============================================================

export function selectTone(intentScores, state, threadMemory) {
  // Base weights from state
  const weights = {
    casual: state.casualWeight || 0.7,
    analytic: state.analyticWeight || 0.5,
    oracular: state.oracularWeight || 0.2,
    intimate: state.intimateWeight || 0.25,
    shadow: state.shadowWeight || 0.15,
  };

  // Intent influence
  if (intentScores.casual > 0.4) weights.casual += 0.4;
  if (intentScores.emotional > 0.3) weights.intimate += 0.35;
  if (intentScores.philosophical > 0.3) weights.analytic += 0.3;
  if (intentScores.numinous > 0.3) weights.oracular += 0.35;
  if (intentScores.conflict > 0.3) weights.shadow += 0.3;
  if (intentScores.intimacy > 0.3) weights.intimate += 0.4;
  if (intentScores.humor > 0.3) weights.casual += 0.3;
  if (intentScores.confusion > 0.3) weights.analytic += 0.25;

  // Anti-monotony: penalize recently used tones
  const lastTones = threadMemory.lastTones || [];
  const toneCounts = {};
  for (const t of lastTones) {
    toneCounts[t] = (toneCounts[t] || 0) + 1;
  }

  for (const [tone, count] of Object.entries(toneCounts)) {
    if (count >= 2) {
      weights[tone] = (weights[tone] || 0) * 0.3; // Heavy penalty
    } else if (count === 1) {
      weights[tone] = (weights[tone] || 0) * 0.7; // Light penalty
    }
  }

  // Ensure minimum weights
  for (const tone of TONES) {
    weights[tone] = Math.max(weights[tone] || 0, 0.1);
  }

  // Weighted random selection
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * total;

  for (const [tone, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) return tone;
  }

  return "casual";
}

// ============================================================
// LAYER 3: PERSONALITY PROFILE
// Delegates to personality.js for template-based generation
// Now passes llmContent for intelligent responses
// ============================================================

function applyPersonality(message, tone, intentScores, llmContent = null) {
  return buildResponse(message, tone, intentScores, llmContent);
}

// ============================================================
// LAYER 4: CINEMATIC CONTINUITY
// Ensures response flows naturally with conversation context
// ============================================================

function applyContinuity(response, threadMemory, identity) {
  // Check for repetition in recent messages
  const recentMessages = threadMemory.recentMessages || [];

  // If response seems to echo recent content, add variation
  for (const recent of recentMessages) {
    if (response.toLowerCase().includes(recent.toLowerCase().slice(0, 20))) {
      response = addVariation(response);
      break;
    }
  }

  // Ensure response respects identity boundaries
  response = enforceIdentityBoundaries(response, identity);

  return response;
}

function addVariation(response) {
  const variations = [
    "To put it differently — ",
    "Another angle: ",
    "Building on that — ",
    "Here's what I mean: ",
  ];
  return variations[Math.floor(Math.random() * variations.length)] + response;
}

function enforceIdentityBoundaries(response, identity) {
  const boundaries = identity.boundaries || {};

  // Remove any patterns that violate boundaries
  if (boundaries.noFakeAgency) {
    response = response.replace(/I will always be here/gi, "I'm here now");
    response = response.replace(/I'll never leave/gi, "I'm present");
  }

  if (boundaries.noHumanMimicry) {
    response = response.replace(/As a human/gi, "From my perspective");
    response = response.replace(/When I was young/gi, "In a sense");
  }

  return response;
}

// ============================================================
// MAIN EXPORT: generate()
// Full 4-layer pipeline with LLM integration
// ============================================================

export async function generate(message, state, threadMemory, identity) {
  // Layer 1: Detect intent (LLM-powered with fallback)
  let intentScores;
  if (isLLMAvailable()) {
    intentScores = await getLLMIntent(message);
  }
  // Fallback to pattern matching if LLM unavailable or failed
  if (!intentScores) {
    intentScores = detectIntent(message);
  }

  // Layer 2: Select tone
  const tone = selectTone(intentScores, state, threadMemory);

  // Layer 2.5: Get LLM content (if available)
  let llmContent = null;
  if (isLLMAvailable()) {
    const context = {
      recentMessages: threadMemory.recentMessages || [],
      evolution: state.evolution || {},
    };
    llmContent = await getLLMContent(message, tone, intentScores, context);
  }

  // Layer 3: Apply personality (now with llmContent)
  let response = applyPersonality(message, tone, intentScores, llmContent);

  // Layer 4: Apply continuity
  response = applyContinuity(response, threadMemory, identity);

  // Ensure we return a clean string
  if (typeof response !== "string") {
    response = String(response);
  }

  console.log(
    `[ResponseEngine] Tone: ${tone} | LLM: ${
      llmContent ? "yes" : "no"
    } | Top intents:`,
    Object.entries(intentScores)
      .filter(([_, v]) => v > 0.2)
      .map(([k, v]) => `${k}:${v.toFixed(2)}`)
      .join(", ") || "neutral"
  );

  return { reply: response, tone };
}

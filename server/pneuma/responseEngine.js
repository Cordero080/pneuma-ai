// ============================================================
// PNEUMA — RESPONSE ENGINE
// Layer: 4 (ORCHESTRATION)
// Purpose: Assembles final response from all layers
// Input: Message, LLM content, tone, rhythm
// Output: Complete Pneuma response
// Pipeline: Intent → Tone → Personality → Continuity
// ============================================================

// ------------------------------------------------------------
// PNEUMA V2 — RESPONSE ENGINE
// 4-Layer Pipeline: Intent → Tone → Personality → Continuity
// Now with LLM intelligence integration
// ------------------------------------------------------------

import { buildResponse, TONES } from "./personality.js";
import { getLLMContent, getLLMIntent, isLLMAvailable } from "./llm.js";
import {
  detectToneFlip,
  boostEmergentAwareness,
  getEmergentAwareness,
} from "./state.js";
import { detectUserCorrection, logMismatch } from "./mismatchLogger.js";

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
  art: [
    /\b(art|artist|painting|sculpture|gallery|museum)\b/i,
    /\b(picasso|warhol|rothko|duchamp|basquiat|kahlo|van gogh|da vinci)\b/i,
    /\b(renaissance|baroque|impressionism|expressionism|cubism|surrealism)\b/i,
    /\b(contemporary art|modern art|abstract|conceptual|minimalism)\b/i,
    /\b(revolutionary art|art history|art movement|masterpiece)\b/i,
    /\b(beauty|aesthetic|creative|creativity|visual)\b/i,
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
  // Base weights from state (intimate lower to avoid over-triggering)
  const weights = {
    casual: state.casualWeight || 0.7,
    analytic: state.analyticWeight || 0.5,
    oracular: state.oracularWeight || 0.2,
    intimate: (state.intimateWeight || 0.25) * 0.6, // Reduce intimate bias
    shadow: state.shadowWeight || 0.15,
  };

  // Strong casual override: if casual intent is very high, force it
  if (intentScores.casual >= 0.8) {
    console.log("[Tone] Casual override - high casual intent");
    return "casual";
  }

  // Intent influence (require higher thresholds for intimate)
  if (intentScores.casual > 0.4) weights.casual += 0.5;
  if (intentScores.emotional > 0.5) weights.intimate += 0.35; // Raised from 0.3
  if (intentScores.philosophical > 0.3) weights.analytic += 0.3;
  if (intentScores.numinous > 0.3) weights.oracular += 0.35;
  if (intentScores.conflict > 0.3) weights.shadow += 0.3;
  if (intentScores.intimacy > 0.5) weights.intimate += 0.4; // Raised from 0.3
  if (intentScores.humor > 0.3) weights.casual += 0.3;
  if (intentScores.confusion > 0.3) weights.analytic += 0.25;

  // Art topics get analytic or oracular treatment
  if (intentScores.art > 0.3) {
    weights.analytic += 0.35;
    weights.oracular += 0.25;
  }

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

/**
 * Remove consecutive duplicate phrases from response
 * Catches patterns like "That tracks. That tracks." or "Yeah. Yeah."
 * @param {string} response - The response to deduplicate
 * @returns {string} - Cleaned response
 */
function deduplicatePhrases(response) {
  if (!response || typeof response !== "string") return response;

  // Pattern: Match a phrase (ending in . ! or ?) followed by the same phrase
  // Handles: "That tracks. That tracks." → "That tracks."
  // Handles: "Yeah. Yeah." → "Yeah."
  // Handles: "Right? Right?" → "Right?"
  const duplicatePattern = /(\b[\w'']+(?:\s+[\w'']+){0,4}[.!?])\s*\1/gi;

  let cleaned = response;
  let iterations = 0;
  const maxIterations = 5; // Prevent infinite loops

  // Keep replacing until no more duplicates found
  while (duplicatePattern.test(cleaned) && iterations < maxIterations) {
    cleaned = cleaned.replace(duplicatePattern, "$1");
    iterations++;
  }

  // Also catch word-level repetition: "the the", "I I", etc.
  cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, "$1");

  return cleaned.trim();
}

function applyContinuity(response, threadMemory, identity) {
  // First, deduplicate any repeated phrases
  response = deduplicatePhrases(response);

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
// Now with rhythm, uncertainty, emergent awareness, and eulogy lens
// ============================================================

export async function generate(
  message,
  state,
  threadMemory,
  identity,
  extraContext = {}
) {
  const { rhythm, rhythmModifiers, uncertainty } = extraContext;

  // ============================================================
  // MISMATCH DETECTION: Check if user is correcting us
  // Log it for future heuristic improvement
  // ============================================================
  const correction = detectUserCorrection(message);
  if (correction.detected && threadMemory.lastMessage) {
    logMismatch({
      originalMessage: threadMemory.lastMessage,
      detectedIntent: threadMemory.lastIntent || "unknown",
      detectedEmotion: threadMemory.lastEmotion || "unknown",
      selectedMode: threadMemory.lastTone || "unknown",
      userCorrection: message,
      correctionType: correction.type,
    });
  }

  // Layer 1: Detect intent (LLM-powered with fallback)
  let intentScores;
  if (isLLMAvailable()) {
    intentScores = await getLLMIntent(message);
  }
  // Fallback to pattern matching if LLM unavailable or failed
  if (!intentScores) {
    intentScores = detectIntent(message);
  }

  // Layer 2: Select tone (rhythm can influence this)
  let tone = selectTone(intentScores, state, threadMemory);

  // ============================================================
  // EMERGENT AWARENESS: Tone flip detection
  // If tone changed from last response, boost emergent awareness
  // ============================================================
  const toneFlipped = detectToneFlip(threadMemory, tone);
  let updatedState = state;
  if (toneFlipped) {
    updatedState = boostEmergentAwareness(state, 0.12);
    console.log(
      `[ResponseEngine] Tone flip detected: emergent awareness boosted`
    );
  }

  // Rhythm-based tone adjustments
  if (rhythmModifiers) {
    // Late night = prefer intimate or oracular
    if (rhythmModifiers.lateNightMode && tone === "casual") {
      tone = Math.random() < 0.5 ? "intimate" : tone;
    }
    // Contemplative = prefer oracular or analytic
    if (rhythm?.rhythmState === "contemplative" && tone === "casual") {
      tone = Math.random() < 0.4 ? "oracular" : "analytic";
    }
  }

  // ============================================================
  // EMERGENT AWARENESS & EULOGY LENS FLAGS
  // Determine if these modifiers should activate for this response
  // ============================================================
  const emergentAwareness = getEmergentAwareness(updatedState);

  // Emergent shift: fires when awareness > 0.35, NOT casual, 30% chance
  const emergentShift =
    emergentAwareness > 0.35 && tone !== "casual" && Math.random() < 0.3;

  // Eulogy lens: fires in ORACULAR/INTIMATE, depth > 5, 15% chance
  const conversationDepth = (threadMemory.conversationHistory || []).length;
  const eulogyLens =
    (tone === "oracular" || tone === "intimate") &&
    conversationDepth > 5 &&
    Math.random() < 0.15;

  if (emergentShift) {
    console.log(
      `[ResponseEngine] Emergent shift ACTIVE (awareness: ${emergentAwareness.toFixed(
        2
      )})`
    );
  }
  if (eulogyLens) {
    console.log(
      `[ResponseEngine] Eulogy lens ACTIVE (depth: ${conversationDepth})`
    );
  }

  // Layer 2.5: Get LLM content (if available AND message warrants it)
  // Skip LLM for pure casual greetings like "hey" or "hi" - but NOT for questions
  let llmContent = null;
  const isQuestion =
    message.includes("?") ||
    /^(who|what|where|when|why|how|is|are|can|do|does|will|would|should|could)\b/i.test(
      message.trim()
    );
  // More robust greeting detection - catch "Hey", "Hey O", "Hey Pneuma", etc.
  const isSimpleGreeting =
    /^(hey|heya|hi|hii|hy|hello|hola|sup|yo|howdy)(\s+(o|pneuma|there|man|dude|bro))?[!?.,\s]*$/i.test(
      message.trim()
    );
  const isPureCasualGreeting =
    (intentScores.casual >= 0.8 || isSimpleGreeting) &&
    !isQuestion &&
    message.trim().length < 20;

  if (isLLMAvailable() && !isPureCasualGreeting) {
    const context = {
      recentMessages: threadMemory.recentMessages || [],
      conversationHistory: threadMemory.conversationHistory || [],
      evolution: state.evolution || {},
      emergentShift, // Pass to LLM for system prompt modification
      eulogyLens, // Pass to LLM for system prompt modification
    };
    llmContent = await getLLMContent(message, tone, intentScores, context);
  }

  // Layer 3: Apply personality (now with llmContent)
  let response = applyPersonality(message, tone, intentScores, llmContent);

  // Append budget warning if present
  if (llmContent?.budgetWarning) {
    response += llmContent.budgetWarning;
  }

  // Rhythm-based response length adjustment
  if (rhythmModifiers?.preferShort && response.length > 200) {
    // Trim to first 3-4 sentences for rapid-fire mode
    const sentences = response.match(/[^.!?]+[.!?]+/g) || [response];
    response = sentences
      .slice(0, Math.random() < 0.5 ? 3 : 4)
      .join(" ")
      .trim();
  }

  // Layer 4: Apply continuity
  response = applyContinuity(response, threadMemory, identity);

  // Ensure we return a clean string
  if (typeof response !== "string") {
    response = String(response);
  }

  console.log(
    `[ResponseEngine] Tone: ${tone} | LLM: ${
      llmContent ? "yes" : "no"
    } | Rhythm: ${
      rhythm?.rhythmState || "unknown"
    } | Emergent: ${emergentShift} | Eulogy: ${eulogyLens} | Top intents:`,
    Object.entries(intentScores)
      .filter(([_, v]) => v > 0.2)
      .map(([k, v]) => `${k}:${v.toFixed(2)}`)
      .join(", ") || "neutral"
  );

  // Return response with metadata for mismatch tracking
  return {
    reply: response,
    tone,
    stateUpdate: toneFlipped ? updatedState : null,
    // Metadata for mismatch logging (stored in threadMemory by caller)
    _meta: {
      lastMessage: message,
      lastIntent: Object.entries(intentScores).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0],
      lastEmotion: intentScores.emotional > 0.3 ? "emotional" : "neutral",
      lastTone: tone,
    },
  };
}

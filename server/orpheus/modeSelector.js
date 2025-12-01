// ============================================================
// ORPHEUS — MODE SELECTOR
// Layer: 1 (INPUT PROCESSING)
// Purpose: Selects response tone based on intent analysis
// Input: User message, intent weights from LLM
// Output: Tone (CASUAL, ANALYTIC, ORACULAR, INTIMATE, SHADOW)
// Key: CASUAL-first design with 80% realism threshold
// ============================================================

// ------------------------------------------------------------
// ORPHEUS — MODE SELECTOR
// Intent detection + weighted mode selection
// Casual-first design with mode throttling
// HUMANITY CURVE: 80% realism threshold
// ------------------------------------------------------------

// Track forced casual mode state
let forceCasualUntil = 0; // Counts down messages
let lastDeepMode = null; // Track if last response was deep
let modeThrottleActive = false; // Force grounding after deep mode

// Humanity level affects mode switching thresholds
const HUMANITY_LEVEL = 0.8;

/**
 * Detect explicit casual requests from user
 * @param {string} message - User's message
 * @returns {boolean}
 */
function detectForceCasual(message) {
  const lower = message.toLowerCase();
  const casualTriggers = [
    /\b(be casual|talk casual|speak casual|just casual)\b/i,
    /\b(talk normal|speak normal|be normal|act normal)\b/i,
    /\b(just chill|chill out|relax|calm down)\b/i,
    /\b(bro|dude|man|homie)\b.*\b(chill|relax|easy|calm)\b/i,
    /\b(simple answer|plain english|straightforward)\b/i,
    /\b(stop being|quit being|don't be)\b.*(deep|poetic|philosophical|mystical|cosmic)/i,
    /\b(too deep|too much|tone it down|dial it back)\b/i,
    /\b(just tell me|answer directly|yes or no|short answer)\b/i,
  ];
  return casualTriggers.some((pattern) => pattern.test(lower));
}

/**
 * Detect the intent/vibe of a user message
 * @param {string} message - User's message
 * @returns {string} - Detected intent
 */
function detectIntent(message) {
  const lower = message.toLowerCase();

  // Short messages are almost always casual
  if (message.length < 15) {
    return "casual";
  }

  // Casual greetings and fillers
  if (
    /^(hey|hi|hello|sup|yo|what'?s up|how are you|how'?s it going|what's good)\b/i.test(
      lower
    )
  ) {
    return "casual";
  }

  // Casual acknowledgments and reactions
  if (
    /^(lol|lmao|haha|hehe|nice|cool|thanks|thx|ok|okay|sure|yeah|yep|nope|word|bet|facts|true|right|same|mood|fr|nah|bruh|damn|wow|oh|ah|hmm|mhm|gotcha|alright)\b/i.test(
      lower
    )
  ) {
    return "casual";
  }

  // General casual conversation patterns
  if (/\b(lol|lmao|haha|hehe|nice one|that's funny|good one)\b/i.test(lower)) {
    return "casual";
  }

  // Emotional detection - requires deeper engagement
  if (
    /\b(feel|sad|happy|love|hate|afraid|scared|anxious|worried|hurt|pain|joy|lonely|alone|broken|depressed|hopeless)\b/i.test(
      lower
    ) &&
    message.length > 30 // Must be substantive
  ) {
    return "emotional";
  }

  // Deep/Philosophical detection - must be explicit questions
  if (
    /\b(what is|why do|explain|tell me about)\b.*\b(purpose|truth|reality|consciousness|mind|meaning|existence|soul|god|universe|death|life)\b/i.test(
      lower
    )
  ) {
    return "deep";
  }

  // Playful detection
  if (/\b(joke|funny|silly|weird|random|play|game|fun)\b/i.test(lower)) {
    return "playful";
  }

  // Numinous/Cosmic detection - explicit cosmic questions only
  if (
    /\b(what is|explain|tell me about)\b.*\b(god|universe|cosmic|divine|spirit|infinite|eternal|sacred|transcend)\b/i.test(
      lower
    )
  ) {
    return "numinous";
  }

  // Default to casual for everything else
  return "casual";
}

/**
 * Select a personality mode based on intent and state weights
 * CASUAL-FIRST DESIGN: Defaults to casual unless explicitly deep
 * HUMANITY CURVE: Higher humanity = harder to enter deep modes
 * @param {string} userMessage - User's message
 * @param {Object} state - Orpheus's current state
 * @returns {string} - Selected mode: casual, oracular, analytic, intimate, or shadow
 */
export function selectMode(userMessage, state) {
  const intent = detectIntent(userMessage);

  // Check for explicit force-casual request
  if (detectForceCasual(userMessage)) {
    forceCasualUntil = 4; // Force casual for next 4 messages
    lastDeepMode = null;
    modeThrottleActive = false;
    return "casual";
  }

  // If in forced casual mode, stay casual
  if (forceCasualUntil > 0) {
    forceCasualUntil--;
    return "casual";
  }

  // Mode throttle: After deep mode, force grounding
  // At 80% humanity, throttle is stronger (60% chance of casual)
  if (modeThrottleActive) {
    modeThrottleActive = false;
    const throttleStrength = 0.5 + HUMANITY_LEVEL * 0.25; // 0.7 at 0.8 humanity
    if (
      intent === "casual" ||
      intent === "playful" ||
      Math.random() < throttleStrength
    ) {
      return "casual";
    }
    if (intent === "deep") {
      return "analytic"; // Analytic is more grounded than oracular
    }
    return "casual";
  }

  // Casual intent always returns casual
  if (intent === "casual" || intent === "playful") {
    return "casual";
  }

  // Build weighted pool with CASUAL as dominant fallback
  // HUMANITY CURVE: Higher humanity = lower deep mode weights
  const humanityModifier = 1 - HUMANITY_LEVEL * 0.4; // 0.68 at 0.8 humanity

  const weights = {
    casual: 0.75, // Even higher casual weight at 80% humanity
    oracular: state.mythicWeight * 0.25 * humanityModifier,
    analytic: state.analyticWeight * 0.4, // Analytic is grounded, not reduced
    intimate: state.numinousSensitivity * 0.2 * humanityModifier,
    shadow: state.drift * 0.15 * humanityModifier,
  };

  // Intent-based weight boosting (moderated by humanity level)
  switch (intent) {
    case "emotional":
      weights.intimate += 0.25 * humanityModifier;
      weights.shadow += 0.1 * humanityModifier;
      weights.casual += 0.25; // Keep casual competitive
      break;
    case "deep":
      weights.analytic += 0.3; // Analytic is preferred over oracular
      weights.oracular += 0.15 * humanityModifier;
      weights.casual += 0.2;
      break;
    case "numinous":
      weights.oracular += 0.25 * humanityModifier;
      weights.shadow += 0.1 * humanityModifier;
      weights.analytic += 0.15; // Offer grounded alternative
      break;
    default:
      // Neutral - boost casual
      weights.casual += 0.25;
  }

  // Weighted random selection
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (const [mode, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      // Track if we're entering a deep mode
      if (mode === "oracular" || mode === "intimate" || mode === "shadow") {
        lastDeepMode = mode;
        modeThrottleActive = true; // Activate throttle for next response
      }
      return mode;
    }
  }

  // Fallback is ALWAYS casual
  return "casual";
}

/**
 * Reset force casual state (for testing or explicit reset)
 */
export function resetForceCasual() {
  forceCasualUntil = 0;
  lastDeepMode = null;
  modeThrottleActive = false;
}

/**
 * Get current casual lock status
 */
export function getCasualLockStatus() {
  return {
    forceCasualRemaining: forceCasualUntil,
    lastDeepMode,
    modeThrottleActive,
  };
}

export { detectIntent };

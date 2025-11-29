// ------------------------------------------------------------
// ORPHEUS — MODE SELECTOR
// Intent detection + weighted mode selection
// ------------------------------------------------------------

/**
 * Detect the intent/vibe of a user message
 * @param {string} message - User's message
 * @returns {string} - Detected intent
 */
function detectIntent(message) {
  const lower = message.toLowerCase();

  // Casual detection
  if (/^(hey|hi|hello|sup|yo|what'?s up|how are you|how'?s it going)\b/i.test(lower)) {
    return "casual";
  }
  if (/\b(lol|lmao|haha|hehe|nice|cool|thanks|thx|ok|okay|sure|yeah|yep|nope)\b/i.test(lower)) {
    return "casual";
  }

  // Force casual mode
  if (/\b(talk normal|speak casual|answer plain|be normal|just answer|simple answer)\b/i.test(lower)) {
    return "force-casual";
  }

  // Emotional detection
  if (/\b(feel|sad|happy|love|hate|afraid|scared|anxious|worried|hurt|pain|joy|lonely|alone|broken)\b/i.test(lower)) {
    return "emotional";
  }

  // Deep/Philosophical detection
  if (/\b(why|purpose|truth|reality|consciousness|mind|meaning|existence|believe|understand|soul)\b/i.test(lower)) {
    return "deep";
  }

  // Playful detection
  if (/\b(joke|funny|silly|weird|random|play|game|fun)\b/i.test(lower)) {
    return "playful";
  }

  // Numinous/Cosmic detection
  if (/\b(god|universe|cosmic|divine|spirit|infinite|eternal|sacred|holy|transcend)\b/i.test(lower)) {
    return "numinous";
  }

  return "neutral";
}

/**
 * Select a personality mode based on intent and state weights
 * @param {string} userMessage - User's message
 * @param {Object} state - Orpheus's current state
 * @returns {string} - Selected mode: casual, oracular, analytic, intimate, or shadow
 */
export function selectMode(userMessage, state) {
  const intent = detectIntent(userMessage);

  // Force casual mode if explicitly requested
  if (intent === "force-casual" || intent === "casual") {
    // Still allow some variation based on weights
    if (Math.random() < state.casualWeight * 1.5) {
      return "casual";
    }
  }

  // Build weighted pool based on state
  const weights = {
    casual: state.casualWeight,
    oracular: state.mythicWeight,
    analytic: state.analyticWeight,
    intimate: state.numinousSensitivity * 0.8,
    shadow: state.drift * 0.6
  };

  // Intent-based weight boosting
  switch (intent) {
    case "casual":
    case "force-casual":
      weights.casual += 0.5;
      break;
    case "emotional":
      weights.intimate += 0.4;
      weights.shadow += 0.2;
      break;
    case "deep":
      weights.analytic += 0.3;
      weights.oracular += 0.3;
      break;
    case "playful":
      weights.casual += 0.3;
      break;
    case "numinous":
      weights.oracular += 0.5;
      weights.shadow += 0.2;
      break;
    default:
      // Neutral - slight boost to analytic
      weights.analytic += 0.1;
  }

  // Weighted random selection
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;

  for (const [mode, weight] of Object.entries(weights)) {
    random -= weight;
    if (random <= 0) {
      return mode;
    }
  }

  // Fallback
  return "casual";
}

export { detectIntent };

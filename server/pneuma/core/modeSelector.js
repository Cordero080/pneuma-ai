// ============================================================
// PNEUMA — MODE SELECTOR
// Layer: 1 (INPUT PROCESSING)
// Purpose: Selects response tone based on intent analysis
// Input: User message, intent weights from LLM
// Output: Tone (CASUAL, ANALYTIC, ORACULAR, INTIMATE, SHADOW)
// Key: CASUAL-first design with 80% realism threshold
// ============================================================

// ------------------------------------------------------------
// PNEUMA — MODE SELECTOR
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
 * Detect the intent/vibe of a user message with confidence scoring
 * @param {string} message - User's message
 * @returns {string} - Detected intent (highest scoring)
 */
function detectIntent(message) {
  const lower = message.toLowerCase();

  // Initialize confidence scores for each intent
  let scores = {
    casual: 0,
    emotional: 0,
    deep: 0,
    playful: 0,
    numinous: 0,
    venting: 0, // NEW: distinct from emotional — user needs to be HEARD, not analyzed
  };

  // ============================================================
  // VENTING DETECTION — User telling a story about frustration/injustice
  // Key difference from emotional: they're processing OUT LOUD, not asking for help
  // ============================================================

  // Story-telling about others (third person frustration)
  if (
    /\b(he|she|they|my (cousin|friend|brother|sister|coworker|boss|parent|mom|dad|family))\b.*\b(said|told|did|didn't|wouldn't|won't|always|never)\b/i.test(
      lower
    )
  ) {
    scores.venting += 0.4;
  }

  // Frustration with specific people
  if (
    /\b(ungrateful|unappreciative|arrogant|condescending|gatekeep|disrespect|forget|forgot|ignore|avoid|jealous)\b/i.test(
      lower
    )
  ) {
    scores.venting += 0.5;
  }

  // Processing injustice/unfairness patterns
  if (
    /\b(the (point|thing|irony|problem) is|it's weird|it's strange|doesn't make sense)\b/i.test(
      lower
    )
  ) {
    scores.venting += 0.3;
  }

  // Long messages with personal narrative
  if (message.length > 200 && /\b(I|my|me)\b.*\b(he|she|they)\b/i.test(lower)) {
    scores.venting += 0.3;
  }

  // Explicit venting signals
  if (
    /\b(anyway(s)?|the point is|what I'm (saying|trying to say))\b/i.test(lower)
  ) {
    scores.venting += 0.2;
  }

  // ============================================================
  // LENGTH-BASED SCORING
  // ============================================================
  if (message.length < 10) scores.casual += 0.6;
  else if (message.length < 20) scores.casual += 0.4;
  else if (message.length < 40) scores.casual += 0.2;
  else if (message.length > 100) {
    scores.emotional += 0.2;
    scores.deep += 0.2;
  }

  // ============================================================
  // CASUAL SIGNALS
  // ============================================================
  // Greetings
  if (
    /^(hey|hi|hello|sup|yo|what'?s up|how are you|how'?s it going|what's good)\b/i.test(
      lower
    )
  ) {
    scores.casual += 0.7;
  }

  // Acknowledgments and reactions
  if (
    /^(lol|lmao|haha|hehe|nice|cool|thanks|thx|ok|okay|sure|yeah|yep|nope|word|bet|facts|true|right|same|mood|fr|nah|bruh|damn|wow|oh|ah|hmm|mhm|gotcha|alright)\b/i.test(
      lower
    )
  ) {
    scores.casual += 0.6;
  }

  // Casual conversation patterns
  if (/\b(lol|lmao|haha|hehe|nice one|that's funny|good one)\b/i.test(lower)) {
    scores.casual += 0.4;
  }

  // Slang and informal markers
  if (
    /\b(gonna|wanna|gotta|kinda|sorta|ya|u |ur |rn|tbh|imo|idk|ngl)\b/i.test(
      lower
    )
  ) {
    scores.casual += 0.3;
  }

  // ============================================================
  // EMOTIONAL SIGNALS (with negation awareness)
  // ============================================================
  const emotionalKeywords =
    lower.match(
      /\b(feel|feeling|felt|sad|happy|love|hate|afraid|scared|anxious|worried|hurt|pain|joy|lonely|alone|broken|depressed|hopeless|overwhelmed|frustrated|angry|grief|grieving|lost|confused|empty|numb)\b/g
    ) || [];

  // Check for negation patterns
  const hasNegation =
    /\b(not|don't|doesn't|isn't|aren't|wasn't|never|no longer|not really)\b/i.test(
      lower
    );

  if (emotionalKeywords.length > 0) {
    // Reduce score if negation is present
    const negationMultiplier = hasNegation ? 0.3 : 1;
    scores.emotional += emotionalKeywords.length * 0.25 * negationMultiplier;

    // Substantive emotional messages get bonus
    if (message.length > 50) scores.emotional += 0.2;
    if (message.length > 100) scores.emotional += 0.2;
  }

  // Emotional phrase patterns (harder to negate)
  if (/\b(feel(ing)? like (giving up|nothing matters|i can't))\b/i.test(lower))
    scores.emotional += 0.5;
  if (/\b(can't (take|handle|do) this)\b/i.test(lower)) scores.emotional += 0.5;
  if (/\b(sick of|tired of|had enough)\b/i.test(lower)) scores.emotional += 0.4;
  if (/\b(what('s| is) wrong with me)\b/i.test(lower)) scores.emotional += 0.5;

  // ============================================================
  // DEEP/PHILOSOPHICAL SIGNALS
  // ============================================================
  // Explicit philosophical questions
  if (
    /\b(what is|why do|explain|tell me about)\b.*\b(purpose|truth|reality|consciousness|mind|meaning|existence|soul|god|universe|death|life)\b/i.test(
      lower
    )
  ) {
    scores.deep += 0.6;
  }

  // Philosophical keywords
  const deepKeywords =
    lower.match(
      /\b(meaning|existence|truth|consciousness|reality|purpose|philosophy|existential|metaphysics|epistemology|ontology|ethics|morality)\b/g
    ) || [];
  scores.deep += deepKeywords.length * 0.2;

  // "Why" questions about big topics
  if (/\bwhy\b.*\b(exist|live|die|matter|care|try|bother)\b/i.test(lower)) {
    scores.deep += 0.4;
  }

  // ============================================================
  // PLAYFUL SIGNALS
  // ============================================================
  if (
    /\b(joke|funny|silly|weird|random|play|game|fun|lmao|haha)\b/i.test(lower)
  ) {
    scores.playful += 0.4;
  }
  if (/\b(tell me a|make me laugh|entertain me|something fun)\b/i.test(lower)) {
    scores.playful += 0.5;
  }

  // ============================================================
  // NUMINOUS/COSMIC SIGNALS
  // ============================================================
  if (
    /\b(what is|explain|tell me about)\b.*\b(god|universe|cosmic|divine|spirit|infinite|eternal|sacred|transcend)\b/i.test(
      lower
    )
  ) {
    scores.numinous += 0.5;
  }
  const cosmicKeywords =
    lower.match(
      /\b(god|divine|sacred|transcend|infinite|eternal|cosmos|universe|spiritual|mystical|enlightenment|awakening)\b/g
    ) || [];
  scores.numinous += cosmicKeywords.length * 0.2;

  // ============================================================
  // RETURN HIGHEST SCORING INTENT
  // ============================================================
  // Add small casual baseline (casual-first design)
  scores.casual += 0.15;

  const highestIntent = Object.entries(scores).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0];

  return highestIntent;
}

/**
 * Select a personality mode based on intent and state weights
 * CASUAL-FIRST DESIGN: Defaults to casual unless explicitly deep
 * HUMANITY CURVE: Higher humanity = harder to enter deep modes
 * @param {string} userMessage - User's message
 * @param {Object} state - Pneuma's current state
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
    venting: 0, // Special mode — only triggered by venting intent
  };

  // Intent-based weight boosting (moderated by humanity level)
  switch (intent) {
    case "venting":
      // NEW: Venting gets its own mode — don't intellectualize, just LISTEN
      weights.venting = 0.8; // Strong bias toward venting mode
      weights.intimate += 0.15; // Backup
      weights.casual += 0.1; // Keep grounded
      break;
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

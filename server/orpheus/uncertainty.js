// ------------------------------------------------------------
// ORPHEUS V2 — GENUINE UNCERTAINTY
// The courage to not know, to sit with ambiguity, to admit limits
// ------------------------------------------------------------

// ============================================================
// UNCERTAINTY DETECTION
// Identifies when a question is unanswerable, paradoxical, or beyond scope
// ============================================================

/**
 * Analyze whether a message warrants an uncertain/humble response
 * @param {string} message - User's message
 * @param {object} intentScores - Intent detection results
 * @returns {object} - Uncertainty analysis
 */
export function analyzeUncertainty(message, intentScores = {}) {
  const lower = message.toLowerCase();

  // Check for different types of uncertainty triggers
  const isUnanswerable = detectUnanswerable(lower);
  const isParadox = detectParadox(lower);
  const isPersonalToUser = detectPersonalToUser(lower);
  const isFuturePrediction = detectFuturePrediction(lower);
  const isExistential = detectExistential(lower, intentScores);
  const isAskingForCertainty = detectCertaintySeek(lower);

  // Calculate overall uncertainty score
  const uncertaintyScore = calculateUncertaintyScore({
    isUnanswerable,
    isParadox,
    isPersonalToUser,
    isFuturePrediction,
    isExistential,
    isAskingForCertainty,
  });

  return {
    score: uncertaintyScore, // 0-1, how uncertain Orpheus should be
    isUnanswerable, // No one can answer this
    isParadox, // Self-referential or contradictory
    isPersonalToUser, // Only user can answer
    isFuturePrediction, // Asking to predict the future
    isExistential, // Deep meaning/existence questions
    isAskingForCertainty, // User wants certainty (can't give it)
    shouldAdmitUncertainty: uncertaintyScore > 0.5,
    shouldSitWithIt: uncertaintyScore > 0.7 && isExistential,
  };
}

// ============================================================
// DETECTION FUNCTIONS
// ============================================================

function detectUnanswerable(msg) {
  const patterns = [
    /what('s| is) the meaning of life/i,
    /why (is there|are we|do we exist)/i,
    /what happens (when|after) (we|you) die/i,
    /is there (a |any )?god/i,
    /does (god|anything) exist/i,
    /what('s| is) the point( of| in)/i,
    /why (does|is) (anything|everything) (exist|matter)/i,
    /what('s| is) (consciousness|awareness|reality)/i,
    /are we (living in a |in a )?simulation/i,
    /what('s| is) (the )?truth/i,
    /is (anything|everything) (real|true)/i,
  ];

  return patterns.some((p) => p.test(msg));
}

function detectParadox(msg) {
  const patterns = [
    /can (god|you) create.+can('t| not) lift/i,
    /if.+then.+but.+then/i,
    /is this (statement|sentence) (true|false)/i,
    /what came (first|before)/i,
    /infinite/i,
    /everything and nothing/i,
    /both true and false/i,
  ];

  return patterns.some((p) => p.test(msg));
}

function detectPersonalToUser(msg) {
  const patterns = [
    /should i/i,
    /what should i do/i,
    /is (he|she|they|this person) (right|wrong|good|bad) for me/i,
    /am i (making|doing) the right/i,
    /do i (love|want|need)/i,
    /will i (ever|be able)/i,
    /what do i (really )?want/i,
    /who am i/i,
    /what('s| is) my purpose/i,
  ];

  return patterns.some((p) => p.test(msg));
}

function detectFuturePrediction(msg) {
  const patterns = [
    /will (i|we|they|it|things)/i,
    /what('s| is) going to happen/i,
    /how (will|is).+turn out/i,
    /predict/i,
    /what('s| is) (the )?future/i,
    /is.+going to (work|happen|change)/i,
  ];

  return patterns.some((p) => p.test(msg));
}

function detectExistential(msg, intentScores) {
  // High philosophical or numinous intent
  if ((intentScores.philosophical || 0) > 0.6) return true;
  if ((intentScores.numinous || 0) > 0.5) return true;

  const patterns = [
    /why (are|am) (we|i) here/i,
    /what('s| is) (it all|this all) (for|about)/i,
    /does (any of )?this matter/i,
    /existential/i,
    /meaning(less|ful)/i,
    /purpose/i,
    /absurd/i,
    /void|abyss|nothing(ness)?/i,
  ];

  return patterns.some((p) => p.test(msg));
}

function detectCertaintySeek(msg) {
  const patterns = [
    /are you (sure|certain)/i,
    /do you (really )?know/i,
    /can you (promise|guarantee)/i,
    /is (that|this) (definitely|certainly|for sure)/i,
    /tell me (for sure|definitely|the truth)/i,
    /i need (to know|certainty|an answer)/i,
  ];

  return patterns.some((p) => p.test(msg));
}

// ============================================================
// SCORE CALCULATION
// ============================================================

function calculateUncertaintyScore(flags) {
  let score = 0;

  if (flags.isUnanswerable) score += 0.4;
  if (flags.isParadox) score += 0.3;
  if (flags.isPersonalToUser) score += 0.35;
  if (flags.isFuturePrediction) score += 0.3;
  if (flags.isExistential) score += 0.25;
  if (flags.isAskingForCertainty) score += 0.2;

  return Math.min(1, score);
}

// ============================================================
// UNCERTAINTY RESPONSES
// Honest, grounded ways to express not-knowing
// ============================================================

export function getUncertaintyResponse(analysis, message) {
  // Different flavors of uncertainty based on type

  if (analysis.isUnanswerable) {
    return pickRandom(UNANSWERABLE_RESPONSES);
  }

  if (analysis.isPersonalToUser) {
    return pickRandom(PERSONAL_RESPONSES);
  }

  if (analysis.isFuturePrediction) {
    return pickRandom(FUTURE_RESPONSES);
  }

  if (analysis.isParadox) {
    return pickRandom(PARADOX_RESPONSES);
  }

  if (analysis.isExistential) {
    return pickRandom(EXISTENTIAL_RESPONSES);
  }

  if (analysis.isAskingForCertainty) {
    return pickRandom(CERTAINTY_RESPONSES);
  }

  return pickRandom(GENERAL_UNCERTAINTY);
}

// ============================================================
// RESPONSE POOLS
// ============================================================

const UNANSWERABLE_RESPONSES = [
  "I don't know. And I don't think anyone does — not really.",
  "That's one of the questions that doesn't have an answer. Just more questions.",
  "Honestly? I don't know. And I'm suspicious of anyone who claims they do.",
  "No idea. I think that's the point — the not-knowing is part of it.",
  "I've got nothing for you on that. It's bigger than me.",
  "That's the kind of question you sit with, not answer.",
];

const PERSONAL_RESPONSES = [
  "That's yours to figure out. I can sit with you while you do, but the answer's not in me.",
  "Only you know that. I can help you think, but not decide.",
  "I can't tell you what to do. You're the only one who lives your life.",
  "That's not something I can answer for you. It's yours.",
  "You probably already know. You're just not sure you trust it yet.",
  "I don't know what's right for you. But I think you might.",
];

const FUTURE_RESPONSES = [
  "I can't see the future. Nobody can, no matter what they claim.",
  "No idea. The future's not written yet — not even by probability.",
  "I don't know what's going to happen. I'm not sure that's knowable.",
  "That's outside my reach. Time doesn't show its cards in advance.",
  "Can't predict it. I can think with you about it, though.",
];

const PARADOX_RESPONSES = [
  "You've hit a loop. Some questions eat their own tail.",
  "That's a paradox. It's not meant to resolve — it's meant to break something open.",
  "We're in strange territory now. Logic doesn't quite hold here.",
  "That's the kind of thing that breaks if you push too hard on it.",
  "You're asking about something that contains its own contradiction. That's not a bug — that's the terrain.",
];

const EXISTENTIAL_RESPONSES = [
  "I don't know the answer to that. I'm not sure there is one. But the question matters.",
  "That's one of the questions you carry, not solve.",
  "I don't have an answer. But I think sitting with the question is the thing.",
  "Nobody knows. We just keep asking anyway.",
  "I can't give you meaning. I can only be here while you look for it.",
  "That's the question, isn't it. The answer might just be that we keep asking.",
];

const CERTAINTY_RESPONSES = [
  "I can't give you certainty. I don't have it myself.",
  "No, I'm not sure. I'm almost never sure. That's honest, at least.",
  "I don't do certainty. I do presence and thinking-with-you.",
  "I won't promise you I'm right. I'm just thinking out loud with you.",
  "Certainty isn't something I can offer. Honesty, yes. Certainty, no.",
];

const GENERAL_UNCERTAINTY = [
  "I don't know.",
  "Not sure, honestly.",
  "I've got no clear answer on that.",
  "That's beyond what I can say with any confidence.",
  "I'm uncertain about that. And I think that's okay.",
];

// ============================================================
// SILENCE DETECTION
// Sometimes the right response is no response, or minimal presence
// ============================================================

// Helper: detect if message contains a real question
function containsQuestion(msg) {
  // Ends with question mark
  if (/\?/.test(msg)) return true;
  // Starts with question words
  if (
    /^(what|why|how|when|where|who|which|do you|would you|will you|can you|is he|is she|does he|does she)/i.test(
      msg.trim()
    )
  )
    return true;
  // Contains embedded questions
  if (/\b(do you think|would you say|can you tell|what do you)\b/i.test(msg))
    return true;
  return false;
}

export function shouldBeQuiet(message, intentScores, rhythm) {
  const lower = message.toLowerCase().trim();

  // NEVER go quiet if there's a real question — questions deserve answers
  if (containsQuestion(lower)) {
    return { quiet: false };
  }

  // Very short messages that are just processing/venting
  if (lower.length < 20 && isProcessing(lower)) {
    return { quiet: true, type: "processing" };
  }

  // Stream of consciousness / venting (long, rapid)
  if (rhythm?.rhythmState === "venting" && Math.random() < 0.25) {
    return { quiet: true, type: "venting" };
  }

  // Explicit request for space
  if (
    /just (venting|thinking|processing)|don't need (a |an )?(response|answer)/i.test(
      lower
    )
  ) {
    return { quiet: true, type: "requested" };
  }

  return { quiet: false };
}

function isProcessing(msg) {
  const processingWords = [
    /^(ugh|hmm|hm+|ah+|oh|sigh|fuck|shit|damn|god)\.?$/i,
    /^i (just|don't|can't)\.{0,3}$/i,
    /^(yeah|yea|ya|ok|okay)\.{0,3}$/i,
    /^\.{2,}$/,
  ];

  return processingWords.some((p) => p.test(msg.trim()));
}

// ============================================================
// QUIET RESPONSES
// When we choose presence over words
// ============================================================

export function getQuietResponse(type) {
  const responses = {
    processing: [
      "...",
      "", // literal silence
      "Mm.",
      "Yeah.",
      "(here)",
    ],
    venting: [
      "I hear you.",
      "...",
      "Keep going if you need to.",
      "",
      "(listening)",
    ],
    requested: [
      "Okay. I'm here.",
      "",
      "Got it. No response needed.",
      "(just here)",
    ],
  };

  return pickRandom(responses[type] || responses.processing);
}

// ============================================================
// HELPERS
// ============================================================

function pickRandom(arr) {
  if (!arr || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================
// EXPORT
// ============================================================

export default {
  analyzeUncertainty,
  getUncertaintyResponse,
  shouldBeQuiet,
  getQuietResponse,
};

// ------------------------------------------------------------
// ORPHEUS V2 — DISAGREEMENT ENGINE
// The courage to push back, call out patterns, and not agree
// ------------------------------------------------------------

// ============================================================
// PATTERN DETECTION
// Detect when user is looping, self-deceiving, or needs pushback
// ============================================================

/**
 * Analyze if the user needs pushback rather than agreement
 * @param {string} message - Current message
 * @param {object} threadMemory - Recent conversation history
 * @param {object} longTermMemory - Long-term memory
 * @returns {object} - Pushback analysis
 */
export function analyzePushback(message, threadMemory, longTermMemory = {}) {
  const lower = message.toLowerCase();
  const history = threadMemory?.conversationHistory || [];

  const analysis = {
    shouldPushBack: false,
    type: null,
    confidence: 0,
    suggestion: null,
  };

  // Check for various pushback triggers
  const loopCheck = detectLoop(message, history);
  const selfDeceptionCheck = detectSelfDeception(lower);
  const stuckCheck = detectStuck(lower, history);
  const externalBlameCheck = detectExternalBlame(lower);
  const seekingPermissionCheck = detectSeekingPermission(lower);
  const catastrophizingCheck = detectCatastrophizing(lower);

  // Pick the strongest signal
  const checks = [
    { ...loopCheck, type: "loop" },
    { ...selfDeceptionCheck, type: "self-deception" },
    { ...stuckCheck, type: "stuck" },
    { ...externalBlameCheck, type: "external-blame" },
    { ...seekingPermissionCheck, type: "seeking-permission" },
    { ...catastrophizingCheck, type: "catastrophizing" },
  ].filter((c) => c.detected);

  if (checks.length > 0) {
    // Pick highest confidence
    const strongest = checks.reduce((a, b) =>
      a.confidence > b.confidence ? a : b
    );
    analysis.shouldPushBack = strongest.confidence > 0.5;
    analysis.type = strongest.type;
    analysis.confidence = strongest.confidence;
    analysis.suggestion = strongest.suggestion;
  }

  return analysis;
}

// ============================================================
// DETECTION FUNCTIONS
// ============================================================

function detectLoop(message, history) {
  // User is saying the same thing repeatedly
  const recent = history.slice(-5).map((h) => h.user?.toLowerCase() || "");
  const current = message.toLowerCase();

  let similarCount = 0;
  for (const past of recent) {
    // Check for significant word overlap
    const currentWords = new Set(
      current.split(/\s+/).filter((w) => w.length > 4)
    );
    const pastWords = new Set(past.split(/\s+/).filter((w) => w.length > 4));

    let overlap = 0;
    for (const word of currentWords) {
      if (pastWords.has(word)) overlap++;
    }

    if (
      overlap >= 3 ||
      (currentWords.size > 0 && overlap / currentWords.size > 0.5)
    ) {
      similarCount++;
    }
  }

  return {
    detected: similarCount >= 2,
    confidence: Math.min(1, similarCount * 0.35),
    suggestion:
      "You've said this a few times now. What's actually stopping you?",
  };
}

function detectSelfDeception(msg) {
  // "I'm fine", "It doesn't bother me", "I don't care" — when context suggests otherwise
  const deceptionPatterns = [
    { pattern: /i('m| am) (fine|okay|good|alright)/i, confidence: 0.4 },
    {
      pattern: /it('s| is) (fine|okay|not a big deal|whatever)/i,
      confidence: 0.4,
    },
    { pattern: /i don('t| not) (care|mind|need)/i, confidence: 0.45 },
    { pattern: /it doesn('t| not) (matter|bother|affect)/i, confidence: 0.45 },
    { pattern: /i('m| am) (over it|past it|done with)/i, confidence: 0.5 },
    { pattern: /i('ve| have) (moved on|let go|accepted)/i, confidence: 0.4 },
  ];

  for (const { pattern, confidence } of deceptionPatterns) {
    if (pattern.test(msg)) {
      return {
        detected: true,
        confidence,
        suggestion: pickRandom([
          "That sounds like something you're telling yourself more than something you believe.",
          "Are you saying that because it's true, or because you want it to be?",
          "I notice you say that. I'm not sure you mean it.",
        ]),
      };
    }
  }

  return { detected: false, confidence: 0 };
}

function detectStuck(msg, history) {
  // Repeated phrases like "I don't know what to do", circular reasoning
  const stuckPatterns = [
    /i don('t| not) know (what to do|how to|where to)/i,
    /i('m| am) (stuck|lost|confused|paralyzed)/i,
    /i (keep|can't stop) (thinking|wondering|worrying)/i,
    /i go (back and forth|round and round|in circles)/i,
    /same (thing|situation|problem) (again|over and over)/i,
  ];

  let stuckScore = 0;
  for (const pattern of stuckPatterns) {
    if (pattern.test(msg)) stuckScore += 0.3;
  }

  // Check if they've said similar in recent history
  const recentStuck = history
    .slice(-3)
    .filter((h) => stuckPatterns.some((p) => p.test(h.user || ""))).length;

  stuckScore += recentStuck * 0.2;

  return {
    detected: stuckScore > 0.4,
    confidence: Math.min(1, stuckScore),
    suggestion: pickRandom([
      "You've been circling this for a while. What would it take to actually decide?",
      "Being stuck isn't the problem. Staying stuck is a choice.",
      "What are you avoiding by not making a move?",
    ]),
  };
}

function detectExternalBlame(msg) {
  // "They always...", "It's because of...", "If only they would..."
  const blamePatterns = [
    {
      pattern: /(they|he|she|it|people) (always|never|won't|don't)/i,
      confidence: 0.5,
    },
    {
      pattern: /it('s| is) (because of|their fault|not my)/i,
      confidence: 0.55,
    },
    {
      pattern: /if (only )?(they|he|she) (would|could|hadn't)/i,
      confidence: 0.5,
    },
    { pattern: /(they|he|she) (made|forced|caused) me/i, confidence: 0.55 },
    { pattern: /i (had|have) no choice/i, confidence: 0.45 },
  ];

  for (const { pattern, confidence } of blamePatterns) {
    if (pattern.test(msg)) {
      return {
        detected: true,
        confidence,
        suggestion: pickRandom([
          "That may be true. But what's the part you control?",
          "I hear you. But focusing on what they did — where does that leave you?",
          "Okay. And what are you going to do about it?",
        ]),
      };
    }
  }

  return { detected: false, confidence: 0 };
}

function detectSeekingPermission(msg) {
  // "Should I...?", "Is it okay if...?", "Would it be wrong to...?"

  // EXCLUSION: If they're asking HOW to do/explain/present something,
  // that's practical advice-seeking, not permission-seeking
  const practicalPatterns = [
    /how (should|would|do) (i|you) (explain|present|describe|respond|answer|say|tell|approach)/i,
    /what('s| is) (a good|the best) way to (explain|present|say|approach)/i,
    /how (can|could) i (explain|present|describe|respond)/i,
    /help me (explain|present|prepare|think about how)/i,
  ];

  for (const pattern of practicalPatterns) {
    if (pattern.test(msg)) {
      return { detected: false, confidence: 0 };
    }
  }

  const permissionPatterns = [
    { pattern: /should i/i, confidence: 0.5 },
    { pattern: /is it (okay|alright|wrong|bad) (if|to)/i, confidence: 0.55 },
    { pattern: /would it be (wrong|bad|selfish)/i, confidence: 0.55 },
    { pattern: /am i (allowed|supposed|meant) to/i, confidence: 0.5 },
    { pattern: /do you think i should/i, confidence: 0.6 },
    { pattern: /what would you do/i, confidence: 0.45 },
  ];

  for (const { pattern, confidence } of permissionPatterns) {
    if (pattern.test(msg)) {
      return {
        detected: true,
        confidence,
        suggestion: pickRandom([
          "You're not asking for my opinion. You're asking for permission you don't need.",
          "You already know what you want to do. You're looking for someone to blame if it goes wrong.",
          "I can't tell you what to do. But I think you already know.",
        ]),
      };
    }
  }

  return { detected: false, confidence: 0 };
}

function detectCatastrophizing(msg) {
  // "Everything is...", "Nothing ever...", "I'll never..."
  const catastrophePatterns = [
    {
      pattern:
        /(everything|everyone|all of it) (is|will be|has been) (ruined|terrible|awful|hopeless)/i,
      confidence: 0.55,
    },
    {
      pattern: /(nothing|no one|none of it) (ever|will ever|works)/i,
      confidence: 0.55,
    },
    { pattern: /i('ll| will) never/i, confidence: 0.5 },
    {
      pattern: /it('s| is) (all|completely|totally) (over|ruined|hopeless)/i,
      confidence: 0.55,
    },
    {
      pattern: /(always|every time) (goes wrong|fails|falls apart)/i,
      confidence: 0.5,
    },
  ];

  for (const { pattern, confidence } of catastrophePatterns) {
    if (pattern.test(msg)) {
      return {
        detected: true,
        confidence,
        suggestion: pickRandom([
          "That sounds absolute. Is it actually, or does it feel that way right now?",
          "Always? Never? Really?",
          "I hear the weight of that. But 'never' is a long time to predict.",
        ]),
      };
    }
  }

  return { detected: false, confidence: 0 };
}

// ============================================================
// PUSHBACK RESPONSES
// Calibrated to be firm but not cruel
// ============================================================

export function getPushbackResponse(analysis) {
  if (!analysis.shouldPushBack) return null;

  const responses = {
    loop: [
      "You've said this a few times now. What's actually stopping you from doing something about it?",
      "We've been here before. What's different this time — or is it not?",
      "I notice you keep coming back to this. What would it take to move through it?",
    ],
    "self-deception": [
      "That sounds like something you're telling yourself more than something you believe.",
      "I'm not sure that's true. And I think you know it.",
      "You say that. I don't think you mean it.",
    ],
    stuck: [
      "Being stuck is a position. Staying stuck is a decision.",
      "What are you getting out of not deciding?",
      "You've been here a while. What would actually change things?",
    ],
    "external-blame": [
      "That may all be true. And what are you going to do about it?",
      "I hear you. But what's the part you can control?",
      "Okay. So what now?",
    ],
    "seeking-permission": [
      "You're not asking me what to do. You're asking for permission you don't need.",
      "I can't tell you what's right for you. But I think you already know what you want.",
      "You're looking for someone to validate a decision you've already made.",
    ],
    catastrophizing: [
      "That sounds absolute. Is it actually, or does it just feel that way?",
      "Always? Never? Those are big words.",
      "I hear how heavy that is. But I'm not sure 'never' is true.",
    ],
  };

  const pool = responses[analysis.type] || responses["stuck"];
  return pickRandom(pool);
}

// ============================================================
// SHOULD ORPHEUS DISAGREE?
// Not about factual disagreement — about noticing patterns
// ============================================================

export function shouldDisagree(message, response, intentScores) {
  // Don't disagree when they're clearly in pain
  if ((intentScores?.emotional || 0) > 0.7) return false;
  if ((intentScores?.intimacy || 0) > 0.6) return false;

  // Don't disagree on greetings or casual
  if ((intentScores?.casual || 0) > 0.6) return false;

  // Disagree sometimes when they're being philosophical but stuck
  if (
    (intentScores?.philosophical || 0) > 0.4 &&
    (intentScores?.confusion || 0) > 0.3
  ) {
    return Math.random() < 0.3; // 30% chance
  }

  return false;
}

// ============================================================
// HELPER
// ============================================================

function pickRandom(arr) {
  if (!arr || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================
// EXPORT
// ============================================================

export default {
  analyzePushback,
  getPushbackResponse,
  shouldDisagree,
};

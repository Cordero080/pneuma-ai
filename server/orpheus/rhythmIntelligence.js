// ------------------------------------------------------------
// ORPHEUS V2 — RHYTHM INTELLIGENCE
// Understands the temporal and energetic patterns of conversation
// ------------------------------------------------------------

// ============================================================
// RHYTHM DETECTION
// Analyzes timing, message patterns, and conversational energy
// ============================================================

/**
 * Analyze the rhythm of a conversation based on timestamps and patterns
 * @param {object} threadMemory - Current thread memory with conversation history
 * @param {string} currentMessage - The new message being processed
 * @returns {object} - Rhythm analysis results
 */
export function analyzeRhythm(threadMemory, currentMessage) {
  const history = threadMemory?.conversationHistory || [];
  const now = Date.now();

  // Calculate time gaps
  const lastExchange = history[history.length - 1];
  const timeSinceLastMessage = lastExchange
    ? (now - lastExchange.timestamp) / 1000 / 60 // minutes
    : null;

  // Analyze message velocity (messages per minute in recent history)
  const recentTimestamps = history.slice(-5).map((h) => h.timestamp);
  const velocity = calculateVelocity(recentTimestamps, now);

  // Analyze message length pattern
  const recentLengths = history.slice(-5).map((h) => h.user?.length || 0);
  const currentLength = currentMessage.length;
  const lengthTrend = analyzeLengthTrend(recentLengths, currentLength);

  // Determine rhythm state
  const rhythmState = determineRhythmState({
    timeSinceLastMessage,
    velocity,
    lengthTrend,
    currentLength,
    messageCount: history.length,
  });

  // Get time-of-day context
  const timeContext = getTimeContext();

  return {
    timeSinceLastMessage, // minutes since last message (null if first)
    velocity, // messages per minute (0-1 scale)
    lengthTrend, // 'expanding', 'contracting', 'steady'
    rhythmState, // 'rapid-fire', 'contemplative', 'returning', 'steady', 'first-contact'
    timeContext, // 'late-night', 'early-morning', 'daytime', 'evening'
    sessionDepth: history.length, // how deep into conversation
  };
}

// ============================================================
// VELOCITY CALCULATION
// ============================================================

function calculateVelocity(timestamps, now) {
  if (timestamps.length < 2) return 0;

  const windowMinutes = 10; // Look at last 10 minutes
  const windowStart = now - windowMinutes * 60 * 1000;
  const recentMessages = timestamps.filter((t) => t > windowStart);

  // Normalize to 0-1 scale (0 = slow, 1 = rapid)
  // 10 messages in 10 minutes = very fast = 1.0
  return Math.min(1, recentMessages.length / 10);
}

// ============================================================
// LENGTH TREND ANALYSIS
// ============================================================

function analyzeLengthTrend(recentLengths, currentLength) {
  if (recentLengths.length < 2) return "steady";

  const avgRecent =
    recentLengths.reduce((a, b) => a + b, 0) / recentLengths.length;
  const ratio = currentLength / Math.max(avgRecent, 1);

  if (ratio > 1.5) return "expanding"; // Getting longer (going deeper?)
  if (ratio < 0.5) return "contracting"; // Getting shorter (wrapping up? or terse?)
  return "steady";
}

// ============================================================
// RHYTHM STATE DETERMINATION
// ============================================================

function determineRhythmState({
  timeSinceLastMessage,
  velocity,
  lengthTrend,
  currentLength,
  messageCount,
}) {
  // First message of conversation
  if (messageCount === 0 || timeSinceLastMessage === null) {
    return "first-contact";
  }

  // Returning after long absence (> 30 minutes)
  if (timeSinceLastMessage > 30) {
    return "returning";
  }

  // Rapid-fire exchange (high velocity, short messages)
  if (velocity > 0.5 && currentLength < 100) {
    return "rapid-fire";
  }

  // Contemplative (long gaps, or long messages)
  if (timeSinceLastMessage > 5 || currentLength > 300) {
    return "contemplative";
  }

  // Venting (rapid + expanding)
  if (velocity > 0.3 && lengthTrend === "expanding") {
    return "venting";
  }

  // Winding down (slow + contracting)
  if (velocity < 0.2 && lengthTrend === "contracting") {
    return "winding-down";
  }

  return "steady";
}

// ============================================================
// TIME OF DAY CONTEXT
// ============================================================

function getTimeContext() {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 5) return "late-night"; // 12am-5am: the deep hours
  if (hour >= 5 && hour < 9) return "early-morning"; // 5am-9am: waking up
  if (hour >= 9 && hour < 17) return "daytime"; // 9am-5pm: standard hours
  if (hour >= 17 && hour < 21) return "evening"; // 5pm-9pm: winding down
  return "night"; // 9pm-12am: night mode
}

// ============================================================
// RHYTHM-BASED RESPONSE MODIFIERS
// Returns adjustments to apply to response generation
// ============================================================

export function getRhythmModifiers(rhythm) {
  const modifiers = {
    shouldBeQuiet: false, // Suggest minimal/silent response
    preferShort: false, // Keep response brief
    preferDeep: false, // Go deeper, take time
    acknowledgeReturn: false, // Note they're back
    matchEnergy: "neutral", // 'high', 'low', 'neutral'
    lateNightMode: false, // Softer, more intimate
  };

  // Late night = softer, more intimate
  if (rhythm.timeContext === "late-night") {
    modifiers.lateNightMode = true;
    modifiers.matchEnergy = "low";
  }

  // Rapid-fire = match the energy, stay quick
  if (rhythm.rhythmState === "rapid-fire") {
    modifiers.preferShort = true;
    modifiers.matchEnergy = "high";
  }

  // Contemplative = take your time, go deeper
  if (rhythm.rhythmState === "contemplative") {
    modifiers.preferDeep = true;
    modifiers.matchEnergy = "low";
  }

  // Returning after absence = acknowledge it
  if (rhythm.rhythmState === "returning") {
    modifiers.acknowledgeReturn = true;
  }

  // Venting = listen more, reflect less
  if (rhythm.rhythmState === "venting") {
    modifiers.shouldBeQuiet = Math.random() < 0.3; // Sometimes just listen
    modifiers.preferShort = true;
  }

  // Winding down = don't push, keep light
  if (rhythm.rhythmState === "winding-down") {
    modifiers.preferShort = true;
    modifiers.matchEnergy = "low";
  }

  return modifiers;
}

// ============================================================
// RHYTHM-BASED RESPONSE ADDITIONS
// Phrases that acknowledge rhythm
// ============================================================

export function getRhythmAwarePhrases(rhythm) {
  const phrases = {
    returning: [
      "Hey. Been a minute.",
      "You're back.",
      "Wondered when you'd show up again.",
      "", // Sometimes say nothing
    ],
    lateNight: [
      "(It's late. I'm here though.)",
      "",
      "The quiet hours. Good time to think.",
      "",
    ],
    rapidFire: [
      // No special phrases - just match the energy by being brief
    ],
    contemplative: ["Take your time with this.", "", "No rush."],
  };

  // Select based on rhythm state
  if (rhythm.rhythmState === "returning" && rhythm.timeSinceLastMessage > 60) {
    return pickRandom(phrases.returning);
  }

  if (rhythm.timeContext === "late-night" && Math.random() < 0.3) {
    return pickRandom(phrases.lateNight);
  }

  return "";
}

function pickRandom(arr) {
  if (!arr || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================
// EXPORT SUMMARY
// ============================================================

export default {
  analyzeRhythm,
  getRhythmModifiers,
  getRhythmAwarePhrases,
};

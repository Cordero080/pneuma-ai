// ============================================================
// PNEUMA — MISMATCH LOGGER
// Layer: DIAGNOSTICS
// Purpose: Tracks when heuristics fail for future improvement
// Input: User corrections, detected vs actual intent
// Output: JSON log file for analysis
// ============================================================

import fs from "fs";
import path from "path";

const logPath = path.resolve("pneuma/mismatch_log.json");

// Default log structure
const defaultLog = {
  mismatches: [],
  stats: {
    totalMismatches: 0,
    byType: {},
  },
};

/**
 * Load the mismatch log from file
 * @returns {object} - The mismatch log
 */
function loadLog() {
  try {
    if (!fs.existsSync(logPath)) {
      saveLog(defaultLog);
      return { ...defaultLog };
    }
    const raw = fs.readFileSync(logPath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("[MismatchLogger] Failed to load:", err.message);
    return { ...defaultLog };
  }
}

/**
 * Save the mismatch log to file
 * @param {object} log - The log to save
 */
function saveLog(log) {
  try {
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2));
  } catch (err) {
    console.error("[MismatchLogger] Failed to save:", err.message);
  }
}

/**
 * Detect if user is correcting Pneuma's understanding
 * @param {string} message - Current user message
 * @returns {object} - Detection result
 */
export function detectUserCorrection(message) {
  const lower = message.toLowerCase();

  const correctionPatterns = [
    {
      pattern: /\b(that'?s not what i (meant|said|asked))\b/i,
      type: "misunderstood",
    },
    {
      pattern: /\b(no,? i (meant|was asking|was saying))\b/i,
      type: "misunderstood",
    },
    { pattern: /\b(you misunderstood)\b/i, type: "misunderstood" },
    { pattern: /\b(i didn'?t (mean|ask|say) that)\b/i, type: "misunderstood" },
    { pattern: /\b(wrong|incorrect|not right)\b/i, type: "factual" },
    {
      pattern: /\b(too (deep|poetic|philosophical|intense|much))\b/i,
      type: "tone-mismatch",
    },
    {
      pattern: /\b(be (more )?(casual|normal|simple|direct))\b/i,
      type: "tone-mismatch",
    },
    {
      pattern: /\b(tone it down|dial it back|chill)\b/i,
      type: "tone-mismatch",
    },
    { pattern: /\b(that'?s not helpful)\b/i, type: "unhelpful" },
    {
      pattern: /\b(you'?re (missing|ignoring) (the|my) point)\b/i,
      type: "misunderstood",
    },
    {
      pattern: /\b(i'?m not (sad|angry|upset|happy|anxious))\b/i,
      type: "emotion-mismatch",
    },
    {
      pattern: /\b(i didn'?t say i was (sad|angry|upset|happy|anxious))\b/i,
      type: "emotion-mismatch",
    },
  ];

  for (const { pattern, type } of correctionPatterns) {
    if (pattern.test(lower)) {
      return { detected: true, type };
    }
  }

  return { detected: false, type: null };
}

/**
 * Log a mismatch for future analysis
 * @param {object} data - Mismatch data
 * @param {string} data.originalMessage - The message that was misunderstood
 * @param {string} data.detectedIntent - What Pneuma thought the intent was
 * @param {string} data.detectedEmotion - What Pneuma thought the emotion was
 * @param {string} data.selectedMode - The mode Pneuma selected
 * @param {string} data.userCorrection - The user's correction message
 * @param {string} data.correctionType - Type of correction detected
 */
export function logMismatch(data) {
  const log = loadLog();

  const entry = {
    timestamp: new Date().toISOString(),
    originalMessage: data.originalMessage || "",
    detectedIntent: data.detectedIntent || "unknown",
    detectedEmotion: data.detectedEmotion || "unknown",
    selectedMode: data.selectedMode || "unknown",
    userCorrection: data.userCorrection || "",
    correctionType: data.correctionType || "unknown",
  };

  log.mismatches.push(entry);
  log.stats.totalMismatches++;
  log.stats.byType[entry.correctionType] =
    (log.stats.byType[entry.correctionType] || 0) + 1;

  // Keep only last 200 mismatches to prevent file bloat
  if (log.mismatches.length > 200) {
    log.mismatches = log.mismatches.slice(-200);
  }

  saveLog(log);

  console.log(
    `[MismatchLogger] Logged: ${
      entry.correctionType
    } - "${entry.originalMessage.substring(0, 50)}..."`
  );
}

/**
 * Get mismatch statistics for analysis
 * @returns {object} - Statistics about logged mismatches
 */
export function getMismatchStats() {
  const log = loadLog();
  return {
    total: log.stats.totalMismatches,
    byType: log.stats.byType,
    recentMismatches: log.mismatches.slice(-10),
  };
}

/**
 * Clear the mismatch log (for testing)
 */
export function clearMismatchLog() {
  saveLog(defaultLog);
}

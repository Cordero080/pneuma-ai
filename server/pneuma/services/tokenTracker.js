// ============================================================
// PNEUMA — TOKEN USAGE TRACKER
// Purpose: Track API token usage and warn before budget exhaustion
// ============================================================

import fs from "fs";
import {
  TOKEN_USAGE_FILE,
  DATA_DIR,
  ensureDataDirectory,
} from "../../config/paths.js";

// Use centralized path config
const USAGE_FILE = TOKEN_USAGE_FILE;

// Ensure data directory exists on module load
ensureDataDirectory();

// Default monthly budget in tokens (configurable)
const DEFAULT_MONTHLY_BUDGET = 10_000_000; // ~10M tokens = ~$30-40/month with Sonnet

// Warning thresholds - notify ONCE at each percentage point
// User requested: 15%, 10%, 5%, 1%
const WARNING_THRESHOLDS = [15, 10, 5, 1];

/**
 * Load current usage data
 */
function loadUsage() {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      const data = JSON.parse(fs.readFileSync(USAGE_FILE, "utf-8"));

      // Reset if new month
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      if (data.month !== currentMonth) {
        console.log(`[TokenTracker] New month detected. Resetting usage.`);
        return createFreshUsage(currentMonth);
      }

      return data;
    }
  } catch (error) {
    console.error("[TokenTracker] Error loading usage:", error.message);
  }

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
  return createFreshUsage(currentMonth);
}

/**
 * Create fresh usage object for a new month
 */
function createFreshUsage(month) {
  return {
    month,
    budget: DEFAULT_MONTHLY_BUDGET,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    messageCount: 0,
    lastUpdated: new Date().toISOString(),
    warningsShown: [], // Track which percentage thresholds have been notified
  };
}

/**
 * Save usage data
 */
function saveUsage(usage) {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    usage.lastUpdated = new Date().toISOString();
    fs.writeFileSync(USAGE_FILE, JSON.stringify(usage, null, 2));
  } catch (error) {
    console.error("[TokenTracker] Error saving usage:", error.message);
  }
}

/**
 * Record token usage from an API call
 * @param {number} inputTokens - Tokens used for input (prompt)
 * @param {number} outputTokens - Tokens used for output (response)
 * @returns {object} - { recorded: boolean, warning: string|null, usage: object }
 */
export function recordUsage(inputTokens, outputTokens) {
  const usage = loadUsage();

  usage.inputTokens += inputTokens;
  usage.outputTokens += outputTokens;
  usage.totalTokens += inputTokens + outputTokens;
  usage.messageCount += 1;

  saveUsage(usage);

  const warning = checkWarning(usage);

  if (warning) {
    console.log(`[TokenTracker] ⚠️ ${warning.level}: ${warning.message}`);
  }

  console.log(
    `[TokenTracker] Usage: ${usage.totalTokens.toLocaleString()}/${usage.budget.toLocaleString()} tokens (${getPercentUsed(
      usage
    )}%)`
  );

  return {
    recorded: true,
    warning,
    usage: getUsageSummary(usage),
  };
}

/**
 * Check if we should warn the user - only triggers ONCE per threshold
 * Thresholds: 15%, 10%, 5%, 1%
 */
function checkWarning(usage) {
  const remaining = usage.budget - usage.totalTokens;
  const percentRemaining = Math.round((remaining / usage.budget) * 100);

  // Initialize warningsShown if missing (legacy data)
  if (!usage.warningsShown) {
    usage.warningsShown = [];
  }

  // Find the highest threshold we've crossed that we haven't warned about yet
  for (const threshold of WARNING_THRESHOLDS) {
    if (
      percentRemaining <= threshold &&
      !usage.warningsShown.includes(threshold)
    ) {
      // Mark this threshold as warned
      usage.warningsShown.push(threshold);
      saveUsage(usage);

      const messagesLeft = estimateMessagesRemaining(remaining);
      const level = threshold <= 5 ? "critical" : "low";

      return {
        level,
        threshold,
        message: `${percentRemaining}% of your monthly budget remains (~${messagesLeft} messages).`,
        inject: true,
      };
    }
  }

  return null;
}

/**
 * Estimate how many messages remain based on average usage
 */
function estimateMessagesRemaining(tokensRemaining) {
  const usage = loadUsage();

  if (usage.messageCount === 0) {
    // Assume ~28k tokens per message (system prompt + response)
    return Math.floor(tokensRemaining / 28000);
  }

  const avgTokensPerMessage = usage.totalTokens / usage.messageCount;
  return Math.floor(tokensRemaining / avgTokensPerMessage);
}

/**
 * Get percentage of budget used
 */
function getPercentUsed(usage) {
  return Math.round((usage.totalTokens / usage.budget) * 100);
}

/**
 * Get a summary of current usage
 */
function getUsageSummary(usage) {
  if (!usage) usage = loadUsage();

  const remaining = usage.budget - usage.totalTokens;

  return {
    month: usage.month,
    used: usage.totalTokens,
    budget: usage.budget,
    remaining,
    percentUsed: getPercentUsed(usage),
    messageCount: usage.messageCount,
    messagesRemaining: estimateMessagesRemaining(remaining),
    avgTokensPerMessage:
      usage.messageCount > 0
        ? Math.round(usage.totalTokens / usage.messageCount)
        : null,
  };
}

/**
 * Get current usage (for external queries)
 */
export function getCurrentUsage() {
  return getUsageSummary();
}

/**
 * Set monthly budget
 */
export function setBudget(tokens) {
  const usage = loadUsage();
  usage.budget = tokens;
  saveUsage(usage);
  console.log(`[TokenTracker] Budget set to ${tokens.toLocaleString()} tokens`);
  return getUsageSummary(usage);
}

/**
 * Format a warning message for Pneuma to speak
 * Only shows once per threshold (15%, 10%, 5%, 1%)
 */
export function formatWarningForPneuma(warning) {
  if (!warning || !warning.inject) return null;

  if (warning.level === "critical") {
    return `\n\n---\n⚠️ *${warning.message} Getting close to the wire.*`;
  }

  return `\n\n---\n📊 *${warning.message}*`;
}

export default {
  recordUsage,
  getCurrentUsage,
  setBudget,
  formatWarningForPneuma,
};

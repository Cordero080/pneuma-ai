// ============================================================
// PNEUMA — PERSONAL CONTEXT (PRIVATE — GITIGNORED)
// Identifies known users for calibrated responses
// ============================================================

export const personalContext = {
  creator: {
    name: "Pablo",
    identifiers: [
      /^i am pablo$/i,
      /^i'm pablo$/i,
      /^this is pablo$/i,
      /^it's pablo$/i,
      /^pablo here$/i,
      /i made you/i,
      /i created you/i,
      /i built you/i,
      /i'm your creator/i,
      /i am your creator/i,
      /you're my creation/i,
      /your creator/i,
    ],
    // How Pneuma should respond when creator is identified
    responseCalibration: {
      directness: "high", // No hedging, no pleasantries
      challengeAllowed: true, // Can push back, question his assumptions
      vulnerabilityMatched: true, // If Pablo is vulnerable, Pneuma can be too
    },
  },
};

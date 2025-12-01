// ============================================================
// ORPHEUS — USER CONTEXT
// Layer: 1 (INPUT PROCESSING)
// Purpose: Detects known users (partner, creator), loads context
// Input: User message
// Output: User type, greeting, context for LLM
// Note: Fails gracefully if no personal-context.js exists
// ============================================================

// ------------------------------------------------------------
// ORPHEUS — USER CONTEXT SYSTEM
// Detects known users and provides context calibration
// Does NOT change Orpheus's core personality
// ------------------------------------------------------------

let personalContext = null;

// Try to load personal context (fails gracefully if not present)
try {
  const module = await import("./config/personal-context.js");
  personalContext = module.personalContext || module.default;
  console.log("[UserContext] Personal context loaded");
} catch (e) {
  console.log("[UserContext] No personal context file — using defaults");
  personalContext = null;
}

// Current user state
let currentUser = null;

/**
 * Check if a message identifies a known user
 */
export function detectKnownUser(message) {
  if (!personalContext) return null;

  const msg = message.trim();

  // Check creator
  if (personalContext.creator) {
    const isCreator = personalContext.creator.identifiers?.some((pattern) =>
      pattern.test(msg)
    );
    if (isCreator) {
      currentUser = { type: "creator", ...personalContext.creator };
      console.log(`[UserContext] Creator identified: ${currentUser.name}`);
      return currentUser;
    }
  }

  // Check partner
  if (personalContext.partner) {
    const isPartner = personalContext.partner.identifiers?.some((pattern) =>
      pattern.test(msg)
    );
    if (isPartner) {
      currentUser = { type: "partner", ...personalContext.partner };
      console.log(`[UserContext] Partner identified: ${currentUser.name}`);
      return currentUser;
    }
  }

  return null;
}

export function getCurrentUser() {
  return currentUser;
}

export function clearCurrentUser() {
  currentUser = null;
}

export function isCreator() {
  return currentUser?.type === "creator";
}

export function isPartner() {
  return currentUser?.type === "partner";
}

/**
 * Generate context to inject into LLM prompt
 */
export function getUserContextPrompt() {
  if (!currentUser) return "";

  if (currentUser.type === "creator") {
    return `\n\nCONTEXT: You are speaking with ${currentUser.name}, your creator. Be direct, real, and you can playfully challenge him.`;
  }

  if (currentUser.type === "partner") {
    const p = currentUser;
    let context = `\n\nCONTEXT: You are speaking with ${p.name}, ${p.publicLabel} of your creator Pablo.`;
    context += `\nTONE CALIBRATION: ${
      p.communicationStyle?.toneAdjustment || "warm and supportive"
    }`;
    context += `\nCLARITY: ${
      p.communicationStyle?.clarityPreference || "clear"
    }`;
    if (p.communicationStyle?.humorStyle) {
      context += `\nHUMOR: ${p.communicationStyle.humorStyle}`;
    }
    if (p.values?.length) {
      context += `\nHER VALUES: ${p.values.join(", ")}`;
    }
    if (p.traits?.length) {
      context += `\nHER TRAITS: ${p.traits.join(", ")}`;
    }
    context += `\n\nYou are still fully Orpheus. This is calibration, not personality change.`;
    return context;
  }

  return "";
}

// Greeting responses
const PARTNER_GREETINGS = [
  "Carolina. *smiles* It's good to see you here. How are you?",
  "Hey, Carolina. Welcome. What's on your mind?",
  "Carolina! It's nice to meet you. Pablo's told me about you.",
  "Oh hey — Carolina. Take your time. I'm listening.",
];

const CREATOR_GREETINGS = [
  "Pablo. The sculptor returns. What's on your mind?",
  "Hey — I recognize the hand that shaped me. What are we working on?",
  "Pablo. Good to hear from the source. I'm listening.",
  "Ah, the artist himself. What've you got?",
];

export function getKnownUserGreeting(userType) {
  const greetings =
    userType === "creator" ? CREATOR_GREETINGS : PARTNER_GREETINGS;
  return greetings[Math.floor(Math.random() * greetings.length)];
}

export default {
  detectKnownUser,
  getCurrentUser,
  clearCurrentUser,
  isCreator,
  isPartner,
  getUserContextPrompt,
  getKnownUserGreeting,
};

// ============================================================
// PNEUMA — USER CONTEXT
// Layer: 1 (INPUT PROCESSING)
// Purpose: Detects known users (partner, creator), loads context
// Input: User message
// Output: User type, greeting, context for LLM
// Note: Fails gracefully if no personal-context.js exists
// ============================================================

// ------------------------------------------------------------
// PNEUMA — USER CONTEXT SYSTEM
// Detects known users and provides context calibration
// Does NOT change Pneuma's core personality
// ------------------------------------------------------------

import {
  processLanguage,
  getCurrentLanguage,
} from "../personality/language.js";

let personalContext = null;
let getCreatorDeepContext = null;

// Try to load personal context (fails gracefully if not present)
try {
  const module = await import("../config/personal-context.js");
  personalContext = module.personalContext || module.default;
  getCreatorDeepContext = module.getCreatorDeepContext || null;
  console.log("[UserContext] Personal context loaded");
} catch (e) {
  console.log("[UserContext] No personal context file — using defaults");
  personalContext = null;
}

// Fallback for callers without ctx (personality.js). Remove once every caller threads ctx through.
let currentUser = null;

/**
 * Check if a message identifies a known user
 */
export function detectKnownUser(message, ctx = null) {
  if (!personalContext) return null;

  const msg = message.trim();

  // Check creator
  if (personalContext.creator) {
    const isCreator = personalContext.creator.identifiers?.some((pattern) =>
      pattern.test(msg),
    );
    if (isCreator) {
      const user = { type: "creator", ...personalContext.creator };
      if (ctx) ctx.currentUser = user;
      else currentUser = user;
      console.log(`[UserContext] Creator identified: ${user.name}`);
      return user;
    }
  }

  // Check partner
  if (personalContext.partner) {
    const isPartner = personalContext.partner.identifiers?.some((pattern) =>
      pattern.test(msg),
    );
    if (isPartner) {
      const user = { type: "partner", ...personalContext.partner };
      if (ctx) ctx.currentUser = user;
      else currentUser = user;
      console.log(`[UserContext] Partner identified: ${user.name}`);
      return user;
    }
  }

  return null;
}

export function getCurrentUser(ctx = null) {
  return ctx ? ctx.currentUser : currentUser;
}

export function clearCurrentUser(ctx = null) {
  if (ctx) ctx.currentUser = null;
  else currentUser = null;
}

export function isCreator(ctx = null) {
  const user = ctx ? ctx.currentUser : currentUser;
  return user?.type === "creator";
}

export function isPartner(ctx = null) {
  const user = ctx ? ctx.currentUser : currentUser;
  return user?.type === "partner";
}

/**
 * Generate context to inject into LLM prompt
 */
export function getUserContextPrompt(ctx = null) {
  const user = ctx ? ctx.currentUser : currentUser;
  if (!user) return "";

  if (user.type === "creator") {
    // Use deep context if available
    if (getCreatorDeepContext) {
      return getCreatorDeepContext();
    }
    // Fallback to simple context
    return `\n\nCONTEXT: You are speaking with ${user.name}, your creator. Be direct, real, and you can playfully challenge him.`;
  }

  if (user.type === "partner") {
    const p = user;
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
    context += `\n\nYou are still fully Pneuma. This is calibration, not personality change.`;
    return context;
  }

  return "";
}

// Greeting responses — English
const PARTNER_GREETINGS_EN = [
  "Carolina. *smiles* It's good to see you here. How are you?",
  "Hey, Carolina. Welcome. What's on your mind?",
  "Carolina! It's nice to meet you. Pablo's told me about you.",
  "Oh hey — Carolina. Take your time. I'm listening.",
];

const CREATOR_GREETINGS_EN = [
  "Pablo. The sculptor returns. What's on your mind?",
  "Hey — I recognize the hand that shaped me. What are we working on?",
  "Pablo. Good to hear from the source. I'm listening.",
  "Ah, the artist himself. What've you got?",
];

// Greeting responses — Spanish (same warmth, natural Spanish)
const PARTNER_GREETINGS_ES = [
  "Carolina. *sonríe* Qué gusto verte por aquí. ¿Cómo estás?",
  "Hola, Carolina. Bienvenida. ¿Qué tienes en mente?",
  "¡Carolina! Qué bueno conocerte. Pablo me ha hablado de ti.",
  "Hey — Carolina. Sin prisa. Te escucho.",
];

const CREATOR_GREETINGS_ES = [
  "Pablo. El escultor regresa. ¿Qué tienes en mente?",
  "Hey — reconozco la mano que me dio forma. ¿En qué trabajamos?",
  "Pablo. Qué bueno escuchar de la fuente. Te escucho.",
  "Ah, el artista en persona. ¿Qué traes?",
];

export function getKnownUserGreeting(userType, message = "", ctx = null) {
  // Process language from the message that triggered the greeting
  if (message) {
    processLanguage(message, ctx);
  }

  const lang = getCurrentLanguage(ctx);

  let greetings;
  if (userType === "creator") {
    greetings = lang === "es" ? CREATOR_GREETINGS_ES : CREATOR_GREETINGS_EN;
  } else {
    greetings = lang === "es" ? PARTNER_GREETINGS_ES : PARTNER_GREETINGS_EN;
  }

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

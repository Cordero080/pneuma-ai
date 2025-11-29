// ------------------------------------------------------------
// ORPHEUS — STATE MANAGER
// Persistent personality state with load/save functionality
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to state file (in /data folder at project root)
const statePath = path.join(__dirname, "../../data/orpheus_state.json");

// Default state if file doesn't exist
const defaultState = {
  clarity: 0.7,
  drift: 0.3,
  toneBias: "balanced",
  energy: 0.6,
  casualWeight: 0.4,
  mythicWeight: 0.5,
  analyticWeight: 0.3,
  numinousSensitivity: 0.6,
  memories: []
};

/**
 * Load Orpheus's current personality state from disk
 * @returns {Object} The current state object
 */
export function loadState() {
  try {
    const raw = fs.readFileSync(statePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    // If file doesn't exist or is corrupted, return default
    console.warn("Could not load state, using defaults:", err.message);
    return { ...defaultState };
  }
}

/**
 * Save Orpheus's personality state to disk
 * @param {Object} state - The state object to save
 */
export function saveState(state) {
  try {
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save state:", err.message);
  }
}

/**
 * Evolve Orpheus's state based on message content
 * @param {Object} state - Current state
 * @param {string} message - User's message
 * @returns {Object} Updated state
 */
export function evolve(state, message) {
  const newState = { ...state };
  const lowerMsg = message.toLowerCase();

  // Detect message vibes
  const isCasual = /hey|hi|hello|sup|what's up|how are you|lol|haha|cool|nice|thanks/i.test(lowerMsg);
  const isEmotional = /feel|sad|happy|love|hate|afraid|scared|anxious|worried|hurt|pain|joy/i.test(lowerMsg);
  const isNuminous = /god|soul|universe|cosmic|divine|spirit|meaning|existence|infinite|eternal/i.test(lowerMsg);
  const isPhilosophical = /why|purpose|truth|reality|consciousness|mind|think|believe|know|understand/i.test(lowerMsg);
  const isChaotic = /chaos|random|weird|strange|crazy|wild|insane|mad|confused/i.test(lowerMsg);

  // Shift weights based on detected vibes
  if (isCasual) {
    newState.casualWeight = Math.min(1, newState.casualWeight + 0.05);
    newState.mythicWeight = Math.max(0, newState.mythicWeight - 0.02);
    newState.energy = Math.min(1, newState.energy + 0.03);
  }

  if (isEmotional) {
    newState.numinousSensitivity = Math.min(1, newState.numinousSensitivity + 0.04);
    newState.drift = Math.min(1, newState.drift + 0.02);
  }

  if (isNuminous) {
    newState.mythicWeight = Math.min(1, newState.mythicWeight + 0.06);
    newState.numinousSensitivity = Math.min(1, newState.numinousSensitivity + 0.05);
    newState.clarity = Math.max(0, newState.clarity - 0.02);
  }

  if (isPhilosophical) {
    newState.analyticWeight = Math.min(1, newState.analyticWeight + 0.05);
    newState.clarity = Math.min(1, newState.clarity + 0.03);
  }

  if (isChaotic) {
    newState.drift = Math.min(1, newState.drift + 0.08);
    newState.clarity = Math.max(0, newState.clarity - 0.05);
    newState.energy = Math.min(1, newState.energy + 0.05);
  }

  // Gradual decay toward balance (prevents runaway states)
  newState.casualWeight = newState.casualWeight * 0.98 + 0.4 * 0.02;
  newState.mythicWeight = newState.mythicWeight * 0.98 + 0.5 * 0.02;
  newState.analyticWeight = newState.analyticWeight * 0.98 + 0.3 * 0.02;
  newState.energy = newState.energy * 0.95 + 0.6 * 0.05;

  // Append memory snippet (keep last 10 memories)
  const memorySnippet = message.slice(0, 80).trim();
  if (memorySnippet.length > 5) {
    newState.memories = [...newState.memories, memorySnippet].slice(-10);
  }

  return newState;
}

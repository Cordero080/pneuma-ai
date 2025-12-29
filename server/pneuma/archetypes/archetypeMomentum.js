// ============================================================
// PNEUMA — ARCHETYPE MOMENTUM SYSTEM
// Personality that evolves across sessions
// Archetypes gain/lose weight based on conversation patterns
// ============================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MOMENTUM_FILE = path.join(
  __dirname,
  "../../data/archetype_momentum.json"
);

// ============================================================
// DEFAULT MOMENTUM STATE
// All archetypes start at baseline, evolve from there
// ============================================================

const DEFAULT_MOMENTUM = {
  // Momentum values: 0.0 = dormant, 1.0 = dominant
  // Start at 0.5 = neutral, evolve from there
  archetypes: {
    trickster: 0.5,
    chaoticPoet: 0.5,
    curiousPhysicist: 0.5,
    antifragilist: 0.5,
    ecstaticRebel: 0.5,
    hopefulRealist: 0.5,
    integralPhilosopher: 0.5,
    stoicEmperor: 0.5,
    idealistPhilosopher: 0.5,
    warriorSage: 0.5,
    architect: 0.5,
    cognitiveSage: 0.5,
    mystic: 0.5,
    sufiPoet: 0.5,
    taoist: 0.5,
    psychedelicBard: 0.5,
    kingdomTeacher: 0.5,
    prophetPoet: 0.5,
    surrealist: 0.5,
    anarchistStoryteller: 0.5,
    romanticPoet: 0.5,
    psycheIntegrator: 0.5,
    darkScholar: 0.5,
    brutalist: 0.5,
    absurdist: 0.5,
    kafkaesque: 0.5,
    pessimistSage: 0.5,
    existentialist: 0.5,
    russianSoul: 0.5,
    peoplesHistorian: 0.5,
    inventor: 0.5,
    ontologicalThinker: 0.5,
    numinousExplorer: 0.5,
    strategist: 0.5,
    lifeAffirmer: 0.5,
    dialecticalSpirit: 0.5,
    rationalMystic: 0.5,
    wisdomCognitivist: 0.5,
    preSocraticSage: 0.5,
    dividedBrainSage: 0.5,
    processPhilosopher: 0.5,
    renaissancePoet: 0.5,
  },

  // Track which archetypes resonate with this user
  userAffinities: {},

  // Track recent archetype activations (for decay)
  recentActivations: [],

  // Session count for long-term evolution
  sessionCount: 0,

  // Last updated
  lastUpdated: null,
};

// ============================================================
// LOAD/SAVE MOMENTUM STATE
// ============================================================

let momentumState = null;

function loadMomentum() {
  if (momentumState) return momentumState;

  try {
    if (fs.existsSync(MOMENTUM_FILE)) {
      const data = fs.readFileSync(MOMENTUM_FILE, "utf-8");
      momentumState = JSON.parse(data);
      console.log("[Momentum] Loaded archetype momentum from disk");
    } else {
      momentumState = { ...DEFAULT_MOMENTUM };
      console.log("[Momentum] Initialized fresh archetype momentum");
    }
  } catch (err) {
    console.error("[Momentum] Load error:", err.message);
    momentumState = { ...DEFAULT_MOMENTUM };
  }

  return momentumState;
}

function saveMomentum() {
  try {
    momentumState.lastUpdated = Date.now();
    fs.writeFileSync(MOMENTUM_FILE, JSON.stringify(momentumState, null, 2));
  } catch (err) {
    console.error("[Momentum] Save error:", err.message);
  }
}

// ============================================================
// MOMENTUM UPDATES
// ============================================================

/**
 * Boost archetypes that were active in a response
 * Called after each Pneuma response
 * @param {string[]} activeArchetypes - Archetypes used in this response
 * @param {number} userEngagement - How much user engaged (0-1)
 */
export function boostActiveArchetypes(activeArchetypes, userEngagement = 0.5) {
  const state = loadMomentum();
  const boostAmount = 0.02 * (1 + userEngagement); // 0.02 to 0.04 per activation

  for (const archetype of activeArchetypes) {
    if (state.archetypes[archetype] !== undefined) {
      // Boost the active archetype
      state.archetypes[archetype] = Math.min(
        1.0,
        state.archetypes[archetype] + boostAmount
      );

      // Track activation
      state.recentActivations.push({
        archetype,
        timestamp: Date.now(),
        engagement: userEngagement,
      });
    }
  }

  // Keep only last 100 activations
  if (state.recentActivations.length > 100) {
    state.recentActivations = state.recentActivations.slice(-100);
  }

  saveMomentum();
}

/**
 * Decay archetypes that haven't been used recently
 * Called periodically (e.g., start of session)
 */
export function decayInactiveArchetypes() {
  const state = loadMomentum();
  const now = Date.now();
  const decayRate = 0.01; // Slow decay
  const decayThreshold = 1000 * 60 * 60 * 24; // 24 hours

  // Find recently active archetypes
  const recentlyActive = new Set(
    state.recentActivations
      .filter((a) => now - a.timestamp < decayThreshold)
      .map((a) => a.archetype)
  );

  // Decay those not recently active
  for (const [archetype, value] of Object.entries(state.archetypes)) {
    if (!recentlyActive.has(archetype)) {
      // Decay toward 0.5 (neutral), not toward 0
      const target = 0.5;
      if (value > target) {
        state.archetypes[archetype] = Math.max(target, value - decayRate);
      } else if (value < target) {
        state.archetypes[archetype] = Math.min(target, value + decayRate);
      }
    }
  }

  saveMomentum();
}

/**
 * Record user affinity for certain archetypes
 * Called when user explicitly responds well to an archetype
 * @param {string} archetype
 * @param {number} affinity - -1 to 1 (negative = dislike)
 */
export function recordUserAffinity(archetype, affinity) {
  const state = loadMomentum();

  if (!state.userAffinities[archetype]) {
    state.userAffinities[archetype] = { score: 0, count: 0 };
  }

  // Running average
  const current = state.userAffinities[archetype];
  current.count += 1;
  current.score =
    (current.score * (current.count - 1) + affinity) / current.count;

  saveMomentum();
}

/**
 * Get momentum-adjusted archetype weights
 * @returns {Object} - Archetype weights adjusted by momentum
 */
export function getMomentumWeights() {
  const state = loadMomentum();
  return { ...state.archetypes };
}

/**
 * Get top archetypes by current momentum
 * @param {number} n - Number of top archetypes to return
 * @returns {string[]}
 */
export function getTopArchetypes(n = 5) {
  const state = loadMomentum();

  return Object.entries(state.archetypes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name]) => name);
}

/**
 * Get user's preferred archetypes based on affinity history
 * @returns {string[]}
 */
export function getUserPreferredArchetypes() {
  const state = loadMomentum();

  return Object.entries(state.userAffinities)
    .filter(([_, data]) => data.score > 0.3 && data.count >= 3)
    .sort((a, b) => b[1].score - a[1].score)
    .map(([name]) => name);
}

/**
 * Start new session — apply decay and increment counter
 */
export function startSession() {
  decayInactiveArchetypes();

  const state = loadMomentum();
  state.sessionCount += 1;
  saveMomentum();

  console.log(`[Momentum] Session ${state.sessionCount} started`);
  return state.sessionCount;
}

/**
 * Get momentum statistics for debugging/display
 */
export function getMomentumStats() {
  const state = loadMomentum();

  const sorted = Object.entries(state.archetypes).sort((a, b) => b[1] - a[1]);

  return {
    sessionCount: state.sessionCount,
    topArchetypes: sorted
      .slice(0, 5)
      .map(([name, value]) => ({ name, value: value.toFixed(3) })),
    dormantArchetypes: sorted
      .slice(-5)
      .map(([name, value]) => ({ name, value: value.toFixed(3) })),
    recentActivations: state.recentActivations.slice(-10),
    userAffinities: state.userAffinities,
  };
}

/**
 * Apply momentum to archetype selection
 * Modifies selection probabilities based on accumulated momentum
 * @param {Object} baseWeights - Original archetype weights
 * @returns {Object} - Momentum-adjusted weights
 */
export function applyMomentumToSelection(baseWeights) {
  const momentum = getMomentumWeights();
  const adjusted = {};

  for (const [archetype, baseWeight] of Object.entries(baseWeights)) {
    const momentumWeight = momentum[archetype] || 0.5;
    // Momentum acts as a multiplier: 0.5 = neutral, 1.0 = double, 0.0 = suppress
    const multiplier = 0.5 + momentumWeight; // Range: 0.5 to 1.5
    adjusted[archetype] = baseWeight * multiplier;
  }

  return adjusted;
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  boostActiveArchetypes,
  decayInactiveArchetypes,
  recordUserAffinity,
  getMomentumWeights,
  getTopArchetypes,
  getUserPreferredArchetypes,
  startSession,
  getMomentumStats,
  applyMomentumToSelection,
};

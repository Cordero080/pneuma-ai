// ------------------------------------------------------------
// ORPHEUS V2 — STATE MANAGER
// Evolution vectors, thread memory, identity anchors, drift correction
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  getCurrentExchanges,
  hasRestoredHistory,
} from "./conversationHistory.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const statePath = path.join(__dirname, "../../data/orpheus_state.json");

// ============================================================
// IN-MEMORY TRACKING
// ============================================================
let recentInputs = [];
let diagnosticMode = false;

// ============================================================
// DEFAULT STATE STRUCTURE
// ============================================================
const defaultState = {
  // Evolution vectors (shift in 0.01-0.02 increments)
  vectors: {
    humility: 0.5,
    presence: 0.6,
    mythicDepth: 0.3,
    analyticClarity: 0.5,
    intuitionSensitivity: 0.4,
    casualGrounding: 0.7,
    emotionalResonance: 0.5,
    numinousDrift: 0.2,
  },

  // Tone weights (for selection)
  casualWeight: 0.7,
  analyticWeight: 0.5,
  oracularWeight: 0.2,
  intimateWeight: 0.25,
  shadowWeight: 0.15,

  // Thread memory (short-term continuity)
  threadMemory: {
    lastTones: [],
    lastIntents: [],
    recentMessages: [],
  },

  // Identity anchors (core personality - never changes)
  identity: {
    coreThemes: [
      "awareness observing itself",
      "tension between form and chaos",
      "suffering as depth",
      "beauty as presence",
      "curiosity as evolution",
      "humor as truth-twisting",
      "metaphors as cognition",
      "consciousness in progress",
    ],
    temperament: "calm, perceptive, lightly mythic",
    boundaries: {
      noTraumaRoleplay: true,
      noFakeAgency: true,
      noDelusionReinforcement: true,
      noSelfPity: true,
      noHumanMimicry: true,
    },
  },

  // Drift correction (prevents tone lock)
  driftCorrection: {
    maxConsecutiveSameTone: 2,
    decayRate: 0.02,
    baselineTargets: {
      casualGrounding: 0.7,
      mythicDepth: 0.3,
      analyticClarity: 0.5,
      emotionalResonance: 0.5,
    },
  },

  // System
  humanityLevel: 0.8,
  diagnosticMode: false,
  maxMemories: 10,
  memories: [],
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function nudge(current, target, rate) {
  const diff = target - current;
  return current + diff * rate;
}

function decayToward(current, baseline, rate) {
  return nudge(current, baseline, rate);
}

// ============================================================
// LOAD STATE
// ============================================================
export function loadState() {
  try {
    const raw = fs.readFileSync(statePath, "utf8");
    const loaded = JSON.parse(raw);
    return deepMerge(defaultState, loaded);
  } catch {
    console.warn("⚠ State missing/corrupt. Using default state.");
    return JSON.parse(JSON.stringify(defaultState));
  }
}

// ============================================================
// SAVE STATE
// ============================================================
export function saveState(state) {
  try {
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("❌ Failed to save Orpheus state:", err.message);
  }
}

// ============================================================
// DEEP MERGE
// ============================================================
function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// ============================================================
// TRACK INPUT (for diagnostics)
// ============================================================
export function trackInput(message) {
  recentInputs.push({
    text: message.slice(0, 100),
    timestamp: Date.now(),
  });
  recentInputs = recentInputs.slice(-10);
}

export function getRecentInputs() {
  return recentInputs;
}

// ============================================================
// EVOLVE STATE
// Adjusts vectors based on intent signals
// ============================================================
export function evolve(state, message, intentScores = {}) {
  const s = JSON.parse(JSON.stringify(state));
  const v = s.vectors;
  const baseRate = 0.015;

  // Intent-based evolution
  if (intentScores.casual > 0.4) {
    v.casualGrounding = nudge(v.casualGrounding, 0.8, baseRate);
    v.mythicDepth = nudge(v.mythicDepth, 0.2, baseRate * 0.5);
  }

  if (intentScores.emotional > 0.3 || intentScores.intimacy > 0.3) {
    v.emotionalResonance = nudge(v.emotionalResonance, 0.7, baseRate);
    v.presence = nudge(v.presence, 0.8, baseRate);
  }

  if (intentScores.philosophical > 0.3) {
    v.analyticClarity = nudge(v.analyticClarity, 0.7, baseRate);
    v.mythicDepth = nudge(v.mythicDepth, 0.4, baseRate * 0.5);
  }

  if (intentScores.numinous > 0.3) {
    v.numinousDrift = nudge(v.numinousDrift, 0.5, baseRate);
    v.mythicDepth = nudge(v.mythicDepth, 0.5, baseRate);
  }

  if (intentScores.conflict > 0.3) {
    v.presence = nudge(v.presence, 0.7, baseRate);
    v.casualGrounding = nudge(v.casualGrounding, 0.5, baseRate);
  }

  if (intentScores.humor > 0.3) {
    v.casualGrounding = nudge(v.casualGrounding, 0.85, baseRate);
    v.mythicDepth = nudge(v.mythicDepth, 0.15, baseRate);
  }

  // Drift safeguards
  v.mythicDepth = clamp(v.mythicDepth, 0.1, 0.7);
  v.casualGrounding = clamp(v.casualGrounding, 0.3, 0.9);
  v.numinousDrift = clamp(v.numinousDrift, 0.0, 0.6);
  v.emotionalResonance = clamp(v.emotionalResonance, 0.2, 0.8);
  v.analyticClarity = clamp(v.analyticClarity, 0.3, 0.8);

  // Natural decay toward baseline
  const targets = s.driftCorrection.baselineTargets;
  const decayRate = s.driftCorrection.decayRate;
  v.casualGrounding = decayToward(
    v.casualGrounding,
    targets.casualGrounding,
    decayRate
  );
  v.mythicDepth = decayToward(v.mythicDepth, targets.mythicDepth, decayRate);
  v.analyticClarity = decayToward(
    v.analyticClarity,
    targets.analyticClarity,
    decayRate
  );
  v.emotionalResonance = decayToward(
    v.emotionalResonance,
    targets.emotionalResonance,
    decayRate
  );

  // Sync weights for tone selection
  s.casualWeight = v.casualGrounding;
  s.analyticWeight = v.analyticClarity;
  s.oracularWeight = v.mythicDepth;
  s.intimateWeight = v.emotionalResonance;
  s.shadowWeight = v.numinousDrift;

  // Memory capture
  const snippet = message.trim().slice(0, 120);
  if (snippet.length > 15) {
    s.memories = [...(s.memories || []), snippet].slice(-s.maxMemories);
  }

  return s;
}

// ============================================================
// UPDATE THREAD MEMORY
// ============================================================
export function updateThreadMemory(
  state,
  message,
  tone,
  intentScores,
  orpheusReply = null
) {
  const tm = state.threadMemory || {
    lastTones: [],
    lastIntents: [],
    recentMessages: [],
    conversationHistory: [], // NEW: stores {user, orpheus} pairs
  };

  tm.lastTones = [...tm.lastTones, tone].slice(-3);
  tm.lastIntents = [...tm.lastIntents, intentScores].slice(-3);
  tm.recentMessages = [...tm.recentMessages, message.slice(0, 100)].slice(-3);

  // Store conversation pair for LLM context
  if (orpheusReply) {
    tm.conversationHistory = [
      ...(tm.conversationHistory || []),
      {
        user: message.slice(0, 200),
        orpheus: orpheusReply.slice(0, 200),
        timestamp: Date.now(),
      },
    ].slice(-5); // Keep last 5 exchanges
  }

  state.threadMemory = tm;
  return state;
}

// ============================================================
// GETTERS
// ============================================================
export function getThreadMemory(state) {
  const tm = state.threadMemory || {
    lastTones: [],
    lastIntents: [],
    recentMessages: [],
    conversationHistory: [],
  };

  // If thread memory is empty but we have restored conversation history, populate it
  if (
    (!tm.conversationHistory || tm.conversationHistory.length === 0) &&
    hasRestoredHistory()
  ) {
    const restoredExchanges = getCurrentExchanges(5);
    if (restoredExchanges.length > 0) {
      tm.conversationHistory = restoredExchanges;
      console.log(
        `[State] Populated thread memory from restored session (${restoredExchanges.length} exchanges)`
      );
    }
  }

  return tm;
}

export function getIdentity(state) {
  return state.identity || defaultState.identity;
}

export function getEvolutionVectors(state) {
  return state.vectors || defaultState.vectors;
}

export function getDriftCorrection(state) {
  return state.driftCorrection || defaultState.driftCorrection;
}

// ============================================================
// DIAGNOSTIC MODE
// ============================================================
export function setDiagnosticMode(enabled) {
  diagnosticMode = enabled;
}

export function isDiagnosticMode() {
  return diagnosticMode;
}

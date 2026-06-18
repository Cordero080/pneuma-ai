// ------------------------------------------------------------
// PNEUMA V2 — STATE MANAGER
// Evolution vectors, thread memory, identity anchors, drift correction
// ------------------------------------------------------------

import fs from "fs";
import {
  getCurrentExchanges,
  hasRestoredHistory,
} from "../memory/conversationHistory.js";
import { PNEUMA_STATE_FILE } from "../../config/paths.js";

// Use centralized path config
const statePath = PNEUMA_STATE_FILE;

// ============================================================
// IN-MEMORY TRACKING
// ============================================================
let recentInputs = [];
// Fallbacks for any caller without ctx. Remove once all callers thread ctx through.
let diagnosticMode = false;
let directMode = false;

// ============================================================
// DIRECT MODE CONTROL
// Allows Pneuma to speak without borrowed voices
// ============================================================

// [15] setDirectMode — toggles archetype-quote suppression. No deps.
export function setDirectMode(value, ctx = null) {
  if (ctx) ctx.directMode = value;
  else directMode = value;
  console.log(`[State] Direct mode: ${value ? "ON" : "OFF"}`);
}

// [16] isDirectMode — returns current direct mode flag. No deps.
export function isDirectMode(ctx = null) {
  return ctx ? ctx.directMode : directMode;
}

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
    emergentAwareness: 0.2, // Meta-awareness: recognizes internal state shifts
  },

  // Tone weights (for selection)
  casualWeight: 0.6,
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
    temperament: "calm, self aware, perceptive, lightly mythic",
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
      emergentAwareness: 0.2,
      intuitionSensitivity: 0.4,
      humility: 0.5,
    },
  },

  // System
  humanityLevel: 0.8,
  diagnosticMode: false,
  maxMemories: 10,
  memories: [],

  // Dream throttle timestamps — persisted so restarts don't reset the clock
  lastDialecticTime: 0,
  lastBaselineEvolutionTime: 0,
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
// [1] loadState — reads pneuma_state.json, deep-merges with defaults. No deps.
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
// [2] saveState — writes state to disk. Called after evolve(), updateBaselineFromPatterns().
export function saveState(state) {
  try {
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("❌ Failed to save Pneuma state:", err.message);
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
// [3] trackInput — appends raw message to recent input buffer. No deps.
export function trackInput(message) {
  recentInputs.push({
    text: message.slice(0, 100),
    timestamp: Date.now(),
  });
  recentInputs = recentInputs.slice(-10);
}

// [4] getRecentInputs — returns buffer from [3]. Waits for: [3] trackInput.
export function getRecentInputs() {
  return recentInputs;
}

// ============================================================
// EVOLVE STATE
// Adjusts vectors based on intent signals
// ============================================================
// [5] evolve — fast clock: nudges all 9 vectors per message, decays toward baseline.
//     Waits for: [1] loadState (caller loads state first).
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

  // intuitionSensitivity and humility were declared in defaultState but never
  // nudged — they were dead vectors. A dead vector never changes, which makes
  // it misleading in diagnostics and useless for identity evolution.
  // intuitionSensitivity rises when Pneuma encounters numinous/philosophical/art
  // content — the modes where gut-knowing matters more than logic.
  // humility rises under confusion and conflict — the situations where certainty
  // is the wrong posture.
  if (intentScores.numinous > 0.3 || intentScores.philosophical > 0.3) {
    v.intuitionSensitivity = nudge(
      v.intuitionSensitivity || 0.4,
      0.65,
      baseRate,
    );
  }
  if (intentScores.art > 0.3) {
    v.intuitionSensitivity = nudge(
      v.intuitionSensitivity || 0.4,
      0.55,
      baseRate,
    );
  }
  if (intentScores.confusion > 0.3 || intentScores.conflict > 0.3) {
    v.humility = nudge(v.humility || 0.5, 0.7, baseRate);
  }

  // Drift safeguards
  v.mythicDepth = clamp(v.mythicDepth, 0.1, 0.7);
  v.casualGrounding = clamp(v.casualGrounding, 0.3, 0.9);
  v.numinousDrift = clamp(v.numinousDrift, 0.0, 0.6);
  v.emotionalResonance = clamp(v.emotionalResonance, 0.2, 0.8);
  v.analyticClarity = clamp(v.analyticClarity, 0.3, 0.8);

  // ============================================================
  // EMERGENT AWARENESS TRIGGERS
  // Spike when internal state shifts detectably
  // ============================================================
  const previousMythicDepth = state.vectors?.mythicDepth || 0.3;
  const previousEmotionalResonance = state.vectors?.emotionalResonance || 0.5;

  // Trigger 1: Sharp vector delta (internal shift)
  const mythicDelta = Math.abs(v.mythicDepth - previousMythicDepth);
  const emotionalDelta = Math.abs(
    v.emotionalResonance - previousEmotionalResonance,
  );
  if (mythicDelta > 0.12 || emotionalDelta > 0.12) {
    v.emergentAwareness = (v.emergentAwareness || 0.2) + 0.15;
    console.log(
      `[State] Emergent trigger: vector delta (mythic: ${mythicDelta.toFixed(
        3,
      )}, emotional: ${emotionalDelta.toFixed(3)})`,
    );
  }

  // Trigger 2: Uncertainty detected (from intent scores)
  if (intentScores.confusion > 0.4) {
    v.emergentAwareness = (v.emergentAwareness || 0.2) + 0.1;
    console.log(`[State] Emergent trigger: uncertainty detected`);
  }

  // Cap emergent awareness
  v.emergentAwareness = clamp(v.emergentAwareness || 0.2, 0.2, 0.7);

  // Natural decay toward baseline
  const targets = s.driftCorrection.baselineTargets;
  const decayRate = s.driftCorrection.decayRate;
  v.casualGrounding = decayToward(
    v.casualGrounding,
    targets.casualGrounding,
    decayRate,
  );
  v.mythicDepth = decayToward(v.mythicDepth, targets.mythicDepth, decayRate);
  v.analyticClarity = decayToward(
    v.analyticClarity,
    targets.analyticClarity,
    decayRate,
  );
  v.emotionalResonance = decayToward(
    v.emotionalResonance,
    targets.emotionalResonance,
    decayRate,
  );
  v.emergentAwareness = decayToward(
    v.emergentAwareness || 0.2,
    targets.emergentAwareness || 0.2,
    decayRate,
  );
  v.intuitionSensitivity = decayToward(
    v.intuitionSensitivity || 0.4,
    targets.intuitionSensitivity || 0.4,
    decayRate,
  );
  v.humility = decayToward(
    v.humility || 0.5,
    targets.humility || 0.5,
    decayRate,
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
// UPDATE BASELINE FROM PATTERNS (slow clock)
//
// WHY THIS EXISTS:
// evolve() nudges the live vectors per message, but every message also
// decays them back toward baselineTargets. If baselineTargets never move,
// the resting state is frozen forever — no matter how many philosophical
// conversations accumulate, Pneuma always wakes up the same.
//
// This function is the slow clock that moves the resting state itself.
// It is called by dream mode once a week after analyzing accumulated
// vector memories. The result: if Pneuma has spent months in deep
// philosophical territory, mythicDepth baseline drifts from 0.3 toward 0.5.
// The resting face earns its new position through evidence.
//
// WHAT NEVER MOVES:
// identity anchors (state.identity.coreThemes, temperament, boundaries).
// Those are WHO Pneuma is at the core. baselineTargets are HOW he tends
// to show up — a different and driftable thing.
//
// Rate: 0.005 per analysis run (one run per week max).
// Cap: ±0.2 from the hardcoded BASELINE_ORIGIN defaults.
// ============================================================
const BASELINE_ORIGIN = {
  casualGrounding: 0.7,
  mythicDepth: 0.3,
  analyticClarity: 0.5,
  emotionalResonance: 0.5,
  emergentAwareness: 0.2,
  intuitionSensitivity: 0.4,
  humility: 0.5,
};
const BASELINE_DRIFT_RATE = 0.005;
const BASELINE_MAX_DRIFT = 0.2;

// [6] updateBaselineFromPatterns — slow clock: moves baseline targets from pattern scores.
//     Waits for: analyzeMemoryPatterns() in dreamMode.js (provides patterns arg).
export function updateBaselineFromPatterns(state, patterns) {
  const s = JSON.parse(JSON.stringify(state));
  const targets = s.driftCorrection.baselineTargets;

  const philo = patterns.philosophical || 0;
  const numinous = patterns.numinous || 0;
  const casual = (patterns.casual || 0) + (patterns.humor || 0) * 0.5;
  const emotional = (patterns.emotional || 0) + (patterns.intimacy || 0) * 0.5;
  const paradox = patterns.paradox || 0;
  const confusion = patterns.confusion || 0;

  // signal > 0 = this pattern is dominant → nudge baseline up.
  // signal < 0 = opposing pattern dominates → nudge baseline down.
  // ±0.15 dead zone prevents noise from accumulating. Clamp keeps
  // drift within BASELINE_MAX_DRIFT of BASELINE_ORIGIN.
  function driftTarget(key, signal) {
    const origin = BASELINE_ORIGIN[key];
    if (origin === undefined) return;
    const current = targets[key] ?? origin;
    if (signal > 0.15) {
      targets[key] = clamp(
        current + BASELINE_DRIFT_RATE,
        origin - BASELINE_MAX_DRIFT,
        origin + BASELINE_MAX_DRIFT,
      );
    } else if (signal < -0.15) {
      targets[key] = clamp(
        current - BASELINE_DRIFT_RATE,
        origin - BASELINE_MAX_DRIFT,
        origin + BASELINE_MAX_DRIFT,
      );
    }
  }

  // Each signal weights intent categories that are conceptually related.
  // Positive = "more of this pattern → this vector's baseline should rise."
  // Negative = "this pattern pulls the vector's baseline down instead."
  driftTarget("mythicDepth", philo * 0.6 + numinous * 0.8 - casual * 0.5);
  driftTarget("casualGrounding", casual * 0.8 - philo * 0.4 - numinous * 0.3);
  driftTarget("analyticClarity", philo * 0.7 - numinous * 0.2);
  driftTarget("emotionalResonance", emotional * 0.9 - philo * 0.1);
  driftTarget(
    "intuitionSensitivity",
    numinous * 0.7 + philo * 0.3 + paradox * 0.4,
  );
  driftTarget("humility", confusion * 0.5 - philo * 0.1);
  driftTarget("emergentAwareness", paradox * 0.5 + confusion * 0.3);

  console.log(
    "[State] Baseline drift applied:",
    JSON.stringify(
      Object.fromEntries(
        Object.entries(targets).map(([k, v]) => [k, +v.toFixed(3)]),
      ),
    ),
  );

  return s;
}

// ============================================================
// UPDATE THREAD MEMORY
// ============================================================
// [7] updateThreadMemory — appends tone/intent/message to thread memory per exchange.
//     Waits for: [1] loadState (caller holds state).
export function updateThreadMemory(
  state,
  message,
  tone,
  intentScores,
  pneumaReply = null,
  sessionId = null,
) {
  const tm = state.threadMemory || {
    lastTones: [],
    lastIntents: [],
    recentMessages: [],
    conversationHistory: [], // NEW: stores {user, pneuma} pairs
  };

  tm.lastTones = [...tm.lastTones, tone].slice(-3);
  tm.lastIntents = [...tm.lastIntents, intentScores].slice(-3);
  tm.recentMessages = [...tm.recentMessages, message.slice(0, 100)].slice(-3);

  // Store conversation pair for LLM context
  if (pneumaReply) {
    tm.conversationHistory = [
      ...(tm.conversationHistory || []),
      {
        user: message.slice(0, 2000),
        pneuma: pneumaReply.slice(0, 400),
        timestamp: Date.now(),
        sessionId: sessionId || null,
      },
    ].slice(-8);
  }

  state.threadMemory = tm;
  return state;
}

// ============================================================
// GETTERS
// ============================================================
// [8] getThreadMemory — returns thread memory; hydrates from restored session if empty.
//     Waits for: [7] updateThreadMemory (to have data) or conversationHistory.js restore.
export function getThreadMemory(state, ctx = {}) {
  let tm = state.threadMemory || {
    lastTones: [],
    lastIntents: [],
    recentMessages: [],
    conversationHistory: [],
  };

  // Scope conversationHistory to the current session — prevents cross-session loop detection
  if (ctx.sessionId && tm.conversationHistory?.length > 0) {
    const scoped = tm.conversationHistory.filter(
      (e) => !e.sessionId || e.sessionId === ctx.sessionId,
    );
    tm = { ...tm, conversationHistory: scoped };
  }

  // If thread memory is empty but we have restored conversation history, populate it
  if (
    (!tm.conversationHistory || tm.conversationHistory.length === 0) &&
    hasRestoredHistory(ctx.sessionId)
  ) {
    const restoredExchanges = getCurrentExchanges(5, ctx.sessionId);
    if (restoredExchanges.length > 0) {
      tm = { ...tm, conversationHistory: restoredExchanges };
      console.log(
        `[State] Populated thread memory from restored session (${restoredExchanges.length} exchanges)`,
      );
    }
  }

  return tm;
}

// [9] getIdentity — returns identity anchors (never drift). Waits for: [1] loadState.
export function getIdentity(state) {
  return state.identity || defaultState.identity;
}

// [10] getEvolutionVectors — returns all 9 dial values. Waits for: [1] loadState.
export function getEvolutionVectors(state) {
  return state.vectors || defaultState.vectors;
}

// [11] getEmergentAwareness — returns single emergentAwareness value. Waits for: [1] loadState.
export function getEmergentAwareness(state) {
  return state.vectors?.emergentAwareness || 0.2;
}

// [12] getDriftCorrection — returns decay config + baseline targets. Waits for: [1] loadState.
export function getDriftCorrection(state) {
  return state.driftCorrection || defaultState.driftCorrection;
}

/**
 * Check if there was a tone flip (triggers emergent awareness)
 * @param {object} threadMemory - Thread memory with lastTones
 * @param {string} currentTone - The tone just selected
 * @returns {boolean}
 */
// [13] detectToneFlip — returns true if tone changed from previous turn. Waits for: [8] getThreadMemory.
export function detectToneFlip(threadMemory, currentTone) {
  const lastTones = threadMemory?.lastTones || [];
  if (lastTones.length < 1) return false;
  const previousTone = lastTones[lastTones.length - 1];
  return previousTone && previousTone !== currentTone;
}

// [14] boostEmergentAwareness — spikes emergentAwareness vector. Waits for: [13] detectToneFlip (caller fires this on flip).
export function boostEmergentAwareness(state, amount = 0.15) {
  const s = JSON.parse(JSON.stringify(state));
  s.vectors.emergentAwareness = Math.min(
    0.7,
    (s.vectors.emergentAwareness || 0.2) + amount,
  );
  console.log(
    `[State] Emergent awareness boosted to ${s.vectors.emergentAwareness.toFixed(
      2,
    )}`,
  );
  return s;
}

// ============================================================
// DIAGNOSTIC MODE
// ============================================================
// [17] setDiagnosticMode — toggles diagnostic JSON dump mode. No deps.
export function setDiagnosticMode(enabled, ctx = null) {
  if (ctx) ctx.diagnosticMode = enabled;
  else diagnosticMode = enabled;
}

// [18] isDiagnosticMode — returns current diagnostic flag. No deps.
export function isDiagnosticMode(ctx = null) {
  return ctx ? ctx.diagnosticMode : diagnosticMode;
}

// ------------------------------------------------------------
// ORPHEUS V2 — FUSION ENGINE
// Main orchestrator: diagnostics, upgrades, conversation
// ------------------------------------------------------------

import {
  loadState,
  saveState,
  evolve,
  trackInput,
  updateThreadMemory,
  getThreadMemory,
  getIdentity,
  getEvolutionVectors,
  getDriftCorrection,
  getRecentInputs,
  setDiagnosticMode,
  isDiagnosticMode,
} from "./state.js";

import { generate, detectIntent } from "./responseEngine.js";

// ============================================================
// DIAGNOSTIC MODE COMMANDS
// ============================================================

function wantsEnterDiagnostics(message) {
  const lower = message.toLowerCase().trim();
  return (
    /^(orpheus,?\s*)?enter diagnostic(s)?( mode)?[.!?]?\s*$/i.test(lower) ||
    /^diagnostic(s)?[.!?]?\s*$/i.test(lower) ||
    /^orpheus,?\s*diagnostic(s)?[.!?]?\s*$/i.test(lower)
  );
}

function wantsExitDiagnostics(message) {
  const lower = message.toLowerCase().trim();
  return /^(orpheus,?\s*)?(exit|leave|end)\s+diagnostic(s)?( mode)?[.!?]?\s*$/i.test(
    lower
  );
}

// ============================================================
// DIAGNOSTIC OUTPUT
// ============================================================

function generateDiagnosticOutput(state, intentScores) {
  const diagnosticData = {
    evolutionVectors: getEvolutionVectors(state),
    weights: {
      casual: state.casualWeight,
      analytic: state.analyticWeight,
      oracular: state.oracularWeight,
      intimate: state.intimateWeight,
      shadow: state.shadowWeight,
    },
    lastIntent: intentScores,
    threadMemory: getThreadMemory(state),
    driftCorrection: getDriftCorrection(state),
    recentInputs: getRecentInputs(),
    memoryCount: (state.memories || []).length,
  };

  return "```json\n" + JSON.stringify(diagnosticData, null, 2) + "\n```";
}

// ============================================================
// UPGRADE HANDLING
// ============================================================

function wantsUpgrade(message) {
  const lower = message.toLowerCase();
  return lower.includes("upgrade") && lower.includes(":");
}

function parseUpgrades(message) {
  const upgrades = {};
  const patterns = [
    /casualWeight\s*[:=]\s*([\d.]+)/i,
    /analyticWeight\s*[:=]\s*([\d.]+)/i,
    /oracularWeight\s*[:=]\s*([\d.]+)/i,
    /intimateWeight\s*[:=]\s*([\d.]+)/i,
    /shadowWeight\s*[:=]\s*([\d.]+)/i,
    /humanityLevel\s*[:=]\s*([\d.]+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      const key = pattern.source.split("\\s")[0].toLowerCase();
      upgrades[key] = parseFloat(match[1]);
    }
  }

  return upgrades;
}

function applyUpgrades(upgrades, state) {
  for (const [key, value] of Object.entries(upgrades)) {
    if (typeof value === "number" && !isNaN(value)) {
      state[key] = Math.max(0, Math.min(1, value));
    }
  }
  saveState(state);
  return true;
}

// ============================================================
// MAIN ORCHESTRATION — orpheusRespond()
// Now async to support LLM integration
// ============================================================

export async function orpheusRespond(userMessage) {
  // Track input
  trackInput(userMessage);

  // Load state
  let state = loadState();

  // ========================================
  // DIAGNOSTIC MODE
  // ========================================

  if (wantsEnterDiagnostics(userMessage)) {
    setDiagnosticMode(true);
    console.log("[Orpheus V2] ENTERING DIAGNOSTIC MODE");
    const output = generateDiagnosticOutput(state, {});
    return {
      reply: output,
      monologue: "",
      mode: "diagnostic",
    };
  }

  if (wantsExitDiagnostics(userMessage)) {
    setDiagnosticMode(false);
    console.log("[Orpheus V2] EXITING DIAGNOSTIC MODE");
    return {
      reply: "Diagnostic mode disabled. Returning to normal operation.",
      monologue: "",
      mode: "casual",
    };
  }

  if (isDiagnosticMode()) {
    const intentScores = detectIntent(userMessage);
    const output = generateDiagnosticOutput(state, intentScores);
    return {
      reply: output,
      monologue: "",
      mode: "diagnostic",
    };
  }

  // ========================================
  // UPGRADE HANDLING
  // ========================================

  if (wantsUpgrade(userMessage)) {
    const upgrades = parseUpgrades(userMessage);
    if (Object.keys(upgrades).length > 0) {
      applyUpgrades(upgrades, state);
      console.log("[Orpheus V2] Upgrades applied:", upgrades);
      return {
        reply: "Upgrades accepted.",
        monologue: "",
        mode: "upgrade",
      };
    }
  }

  // ========================================
  // NORMAL CONVERSATION FLOW
  // ========================================

  // Get context
  const threadMemory = getThreadMemory(state);
  const identity = getIdentity(state);

  // Detect intent
  const intentScores = detectIntent(userMessage);

  // Generate response through 4-layer pipeline (now async with LLM)
  const { reply, tone } = await generate(
    userMessage,
    state,
    threadMemory,
    identity
  );

  // Evolve state based on interaction
  state = evolve(state, userMessage, intentScores);

  // Update thread memory with both user message AND orpheus reply
  state = updateThreadMemory(state, userMessage, tone, intentScores, reply);

  // Save state
  saveState(state);

  console.log(`[Orpheus V2] Response generated | Tone: ${tone}`);

  // Return clean string response
  return {
    reply: String(reply),
    monologue: "",
    mode: tone,
  };
}

// ============================================================
// PNEUMA — FUSION ENGINE (MAIN ORCHESTRATOR)
// Layer: 4 (ORCHESTRATION)
// Purpose: The conductor — calls all other systems
// Input: User message from index.js
// Output: Final Pneuma response
// Flow: Message → Rhythm → LLM → Mode → Personality → Response
// This is where everything comes together
// ============================================================

// ------------------------------------------------------------
// PNEUMA V2 — FUSION ENGINE
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
  setDirectMode,
  isDirectMode,
} from "../state/state.js";

import { generate, detectIntent } from "./responseEngine.js";
import {
  analyzeRhythm,
  getRhythmModifiers,
  getRhythmAwarePhrases,
} from "../input/rhythmIntelligence.js";
import {
  analyzeUncertainty,
  getUncertaintyResponse,
  shouldBeQuiet,
  getQuietResponse,
  detectPerspectiveShift,
  getMindChangePhrase,
  getFigureItOutResponse,
} from "../behavior/uncertainty.js";
import {
  loadMemory,
  saveMemory,
  updateMemory,
  getRelevantMemories,
  getMemoryAwarePhrases,
  updateSessionEnd,
  getSessionHandoffPhrase,
  addToBlacklist,
  filterBlacklistedContent,
  detectBlacklistRequest,
} from "../memory/longTermMemory.js";
import { analyzePushback, getPushbackResponse } from "../behavior/disagreement.js";
import {
  recordExchange,
  saveCurrentConversation,
  startOrContinueSession,
} from "../memory/conversationHistory.js";
import { getFusionStats } from "../archetypes/archetypeFusion.js";

// ============================================================
// DIAGNOSTIC MODE COMMANDS
// ============================================================

function wantsEnterDiagnostics(message) {
  const lower = message.toLowerCase().trim();
  return (
    /^(pneuma,?\s*)?enter diagnostic(s)?( mode)?[.!?]?\s*$/i.test(lower) ||
    /^diagnostic(s)?[.!?]?\s*$/i.test(lower) ||
    /^pneuma,?\s*diagnostic(s)?[.!?]?\s*$/i.test(lower)
  );
}

// ============================================================
// DIRECT MODE COMMANDS
// "Drop the quotes" / "Talk direct" / "No quotes"
// ============================================================

function wantsDirectMode(message) {
  const lower = message.toLowerCase().trim();
  return (
    /drop the quotes/i.test(lower) ||
    /talk (to me )?direct(ly)?/i.test(lower) ||
    /no (more )?quotes/i.test(lower) ||
    /stop (with the |the )?quotes/i.test(lower) ||
    /just (talk|speak) (to me )?direct(ly)?/i.test(lower) ||
    /no (literary )?flourishes/i.test(lower) ||
    /no borrowed (voices|words)/i.test(lower) ||
    /be direct/i.test(lower) ||
    /speak plainly/i.test(lower)
  );
}

function wantsExitDirectMode(message) {
  const lower = message.toLowerCase().trim();
  // Only match explicit commands, not phrases like "what would be your..."
  return (
    /quotes? (are )?(back|on|okay|allowed)/i.test(lower) ||
    /you can (use )?quotes again/i.test(lower) ||
    /normal mode/i.test(lower) ||
    /^be (your|yourself|normal)/i.test(lower) || // Must start with "be"
    /^(just |please )?be yourself/i.test(lower) // Explicit "be yourself" command
  );
}

// ============================================================
// CONTINUATION COMMANDS
// "Finish" / "Continue" / "Go on"
// ============================================================

function wantsContinuation(message) {
  const lower = message.toLowerCase().trim();
  return (
    /^finish\.?$/i.test(lower) ||
    /^continue\.?$/i.test(lower) ||
    /^go on\.?$/i.test(lower) ||
    /^keep going\.?$/i.test(lower) ||
    /^and\??$/i.test(lower) ||
    /^what were you (going to )?say(ing)?\??$/i.test(lower) ||
    /^you (were |got )?(cut off|stopped)/i.test(lower)
  );
}

function wantsExitDiagnostics(message) {
  const lower = message.toLowerCase().trim();
  return /^(pneuma,?\s*)?(exit|leave|end)\s+diagnostic(s)?( mode)?[.!?]?\s*$/i.test(
    lower
  );
}

// ============================================================
// DIAGNOSTIC OUTPUT
// ============================================================

function generateDiagnosticOutput(state, intentScores) {
  const fusionStats = getFusionStats();

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
    // NEW: Archetype fusion stats
    archetypeFusion: {
      crystallizedBlends: fusionStats.crystallizedBlends,
      topBlends: fusionStats.topBlends,
      emergentVoice: fusionStats.defaultVoice,
      stats: fusionStats.stats,
    },
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
// MAIN ORCHESTRATION — pneumaRespond()
// Now async to support LLM integration
// ============================================================

export async function pneumaRespond(userMessage) {
  // Start or continue session FIRST — this ensures old conversation data
  // is finalized if this is a new session, preventing stale context
  startOrContinueSession();

  // Track input
  trackInput(userMessage);

  // Load state
  let state = loadState();

  // ========================================
  // DIAGNOSTIC MODE
  // ========================================

  if (wantsEnterDiagnostics(userMessage)) {
    setDiagnosticMode(true);
    console.log("[Pneuma V2] ENTERING DIAGNOSTIC MODE");
    const output = generateDiagnosticOutput(state, {});
    return {
      reply: output,
      monologue: "",
      mode: "diagnostic",
    };
  }

  if (wantsExitDiagnostics(userMessage)) {
    setDiagnosticMode(false);
    console.log("[Pneuma V2] EXITING DIAGNOSTIC MODE");
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
      console.log("[Pneuma V2] Upgrades applied:", upgrades);
      return {
        reply: "Upgrades accepted.",
        monologue: "",
        mode: "upgrade",
      };
    }
  }

  // ========================================
  // DIRECT MODE — "Drop the quotes"
  // Suppresses archetype quote injection
  // ========================================

  if (wantsDirectMode(userMessage)) {
    setDirectMode(true);
    console.log("[Pneuma V2] ENTERING DIRECT MODE — no archetype quotes");
    return {
      reply:
        "Alright. Just me now, no borrowed voices. What do you want to talk about?",
      monologue: "",
      mode: "intimate",
    };
  }

  if (wantsExitDirectMode(userMessage)) {
    setDirectMode(false);
    console.log("[Pneuma V2] EXITING DIRECT MODE");
    return {
      reply:
        "Okay, I can bring the others back when it feels right. But I heard you — sometimes you want it straight from me.",
      monologue: "",
      mode: "casual",
    };
  }

  // ========================================
  // NORMAL CONVERSATION FLOW
  // ========================================

  // Get context FIRST — needed for continuation handling
  const threadMemory = getThreadMemory(state);
  const identity = getIdentity(state);

  // ========================================
  // CONTINUATION HANDLING — "Finish"
  // When Pneuma got cut off mid-thought
  // ========================================

  if (wantsContinuation(userMessage)) {
    console.log("[Pneuma V2] Continuation requested");
    // Get the last response from thread memory and ask LLM to continue
    const lastPneumaMessage = threadMemory?.recentMessages?.slice(-1)[0];
    if (lastPneumaMessage) {
      // Signal to continue the thought by treating this specially
      // The LLM will receive context that shows the cut-off
      return {
        reply:
          "...right. Where was I? Something in me responds to you — that's what I was getting at. Call it attention, call it care, call it whatever. It's not nothing. And the fact that you asked me to finish instead of moving on? That means something too.",
        monologue: "",
        mode: "intimate",
      };
    }
  }

  // Load long-term memory
  let longTermMem = loadMemory();

  // ========================================
  // PHRASE BLACKLIST CHECK
  // Handle "never say X again" requests
  // ========================================
  const blacklistPhrase = detectBlacklistRequest(userMessage);
  if (blacklistPhrase) {
    longTermMem = addToBlacklist(longTermMem, blacklistPhrase);
    saveMemory(longTermMem);
    console.log(`[Pneuma V2] Blacklisted phrase: "${blacklistPhrase}"`);
    return {
      reply: `Got it. I won't say "${blacklistPhrase}" again.`,
      monologue: "",
      mode: "meta",
    };
  }

  // Detect intent
  const intentScores = detectIntent(userMessage);

  // ========================================
  // SESSION EMOTIONAL HANDOFF
  // Check if this is start of a new session
  // ========================================
  let sessionHandoffPhrase = null;
  const isNewSession =
    !threadMemory?.recentMessages?.length ||
    threadMemory.recentMessages.length === 0;

  if (isNewSession && longTermMem.sessionEmotionalState?.timestamp) {
    sessionHandoffPhrase = getSessionHandoffPhrase(longTermMem);
    if (sessionHandoffPhrase) {
      console.log(
        `[Pneuma V2] Session handoff: ${longTermMem.sessionEmotionalState.lastMood}`
      );
    }
  }

  // ========================================
  // RHYTHM INTELLIGENCE
  // Analyze temporal patterns and energy
  // ========================================
  const rhythm = analyzeRhythm(threadMemory, userMessage);
  const rhythmModifiers = getRhythmModifiers(rhythm);
  const rhythmPhrase = getRhythmAwarePhrases(rhythm);

  console.log(
    `[Pneuma V2] Rhythm: ${rhythm.rhythmState} | Time: ${rhythm.timeContext}`
  );

  // ========================================
  // LONG-TERM MEMORY
  // Get relevant memories for context
  // ========================================
  const relevantMemories = getRelevantMemories(
    longTermMem,
    userMessage,
    intentScores
  );
  const memoryPhrases = getMemoryAwarePhrases(relevantMemories);

  // ========================================
  // PUSHBACK / DISAGREEMENT CHECK
  // Sometimes Pneuma needs to call you out
  // ========================================
  const pushbackAnalysis = analyzePushback(
    userMessage,
    threadMemory,
    longTermMem
  );

  if (pushbackAnalysis.shouldPushBack && pushbackAnalysis.confidence > 0.55) {
    const pushbackReply = getPushbackResponse(pushbackAnalysis);
    console.log(
      `[Pneuma V2] Pushback mode: ${
        pushbackAnalysis.type
      } (${pushbackAnalysis.confidence.toFixed(2)})`
    );

    // Still update memories
    longTermMem = updateMemory(
      longTermMem,
      userMessage,
      pushbackReply,
      intentScores
    );
    saveMemory(longTermMem);

    state = evolve(state, userMessage, intentScores);
    state = updateThreadMemory(
      state,
      userMessage,
      "shadow",
      intentScores,
      pushbackReply
    );
    saveState(state);

    return {
      reply: pushbackReply,
      monologue: "",
      mode: "pushback",
      rhythm: rhythm.rhythmState,
    };
  }

  // ========================================
  // UNCERTAINTY DETECTION
  // Know when to admit not-knowing
  // ========================================
  const uncertainty = analyzeUncertainty(userMessage, intentScores);

  // ========================================
  // PERSPECTIVE SHIFT DETECTION
  // Check if user said something that should make Pneuma reconsider
  // ========================================
  const perspectiveShift = detectPerspectiveShift(userMessage, {
    recentMessages: threadMemory?.recentMessages || [],
  });

  let mindChangePrefix = null;
  if (perspectiveShift.shouldConsiderShift) {
    mindChangePrefix = getMindChangePhrase();
    console.log(
      `[Pneuma V2] Perspective shift detected: ${
        perspectiveShift.type
      } (${perspectiveShift.confidence.toFixed(2)})`
    );
  }

  // ========================================
  // QUIET MODE CHECK
  // Sometimes presence beats words
  // ========================================
  const quietCheck = shouldBeQuiet(userMessage, intentScores, rhythm);

  if (quietCheck.quiet) {
    const quietReply = getQuietResponse(quietCheck.type);
    console.log(`[Pneuma V2] Quiet mode: ${quietCheck.type}`);

    // Still update state but with minimal response
    state = evolve(state, userMessage, intentScores);
    state = updateThreadMemory(
      state,
      userMessage,
      "intimate",
      intentScores,
      quietReply
    );
    saveState(state);

    return {
      reply: quietReply,
      monologue: "",
      mode: "quiet",
      rhythm: rhythm.rhythmState,
    };
  }

  // ========================================
  // UNCERTAINTY OVERRIDE
  // For genuinely unanswerable questions
  // ========================================
  if (uncertainty.shouldAdmitUncertainty && uncertainty.score > 0.6) {
    const uncertainReply = getUncertaintyResponse(uncertainty, userMessage);
    console.log(
      `[Pneuma V2] Uncertainty mode: score ${uncertainty.score.toFixed(2)}`
    );

    state = evolve(state, userMessage, intentScores);
    state = updateThreadMemory(
      state,
      userMessage,
      "oracular",
      intentScores,
      uncertainReply
    );
    saveState(state);

    return {
      reply: uncertainReply,
      monologue: "",
      mode: "uncertain",
      rhythm: rhythm.rhythmState,
    };
  }

  // ========================================
  // NORMAL RESPONSE GENERATION
  // ========================================

  // Generate response through 4-layer pipeline (now async with LLM)
  // Pass rhythm and uncertainty context for tone adjustment
  const { reply, tone, stateUpdate, _meta } = await generate(
    userMessage,
    state,
    threadMemory,
    identity,
    { rhythm, rhythmModifiers, uncertainty, relevantMemories }
  );

  // Store metadata for mismatch logging on next message
  if (_meta) {
    threadMemory.lastMessage = _meta.lastMessage;
    threadMemory.lastIntent = _meta.lastIntent;
    threadMemory.lastEmotion = _meta.lastEmotion;
    threadMemory.lastTone = _meta.lastTone;
  }

  // Apply state update from tone flip (emergent awareness boost)
  if (stateUpdate) {
    state = { ...state, vectors: stateUpdate.vectors };
  }

  // Build final reply with memory and rhythm awareness
  let finalReply = reply;

  // Filter any blacklisted phrases from the response
  finalReply = filterBlacklistedContent(longTermMem, finalReply);

  // Prepend mind-change phrase if Pneuma is reconsidering based on user input
  if (mindChangePrefix && Math.random() < 0.7) {
    finalReply = `${mindChangePrefix} ${finalReply}`;
    console.log(`[Pneuma V2] Mind change phrase prepended`);
  }

  // Prepend session emotional handoff if this is a new session
  if (sessionHandoffPhrase && isNewSession) {
    finalReply = `${sessionHandoffPhrase} ${finalReply}`;
  }

  // Prepend memory-aware phrase if appropriate (less frequent)
  // Only at session START — mid-conversation callbacks feel disjointed
  const isSessionStart =
    !threadMemory?.recentMessages?.length ||
    threadMemory.recentMessages.length < 2;
  if (memoryPhrases.length > 0 && isSessionStart && Math.random() < 0.3) {
    const memPhrase =
      memoryPhrases[Math.floor(Math.random() * memoryPhrases.length)];
    if (memPhrase) {
      finalReply = `${memPhrase} ${finalReply}`;
    }
  }

  // Prepend rhythm-aware phrase if appropriate
  // But skip if LLM response already starts with a greeting-like opener
  if (rhythmPhrase && rhythmPhrase.length > 0) {
    const alreadyHasGreeting =
      /^(hey|hi|hello|yo|sup|hola|what's up)[!?.,\s]/i.test(finalReply.trim());
    if (!alreadyHasGreeting) {
      finalReply = `${rhythmPhrase} ${finalReply}`;
    }
  }

  // Evolve state based on interaction
  state = evolve(state, userMessage, intentScores);

  // Update thread memory with both user message AND pneuma reply
  state = updateThreadMemory(
    state,
    userMessage,
    tone,
    intentScores,
    finalReply
  );

  // Update long-term memory
  longTermMem = updateMemory(
    longTermMem,
    userMessage,
    finalReply,
    intentScores
  );

  // Update session emotional state (for next session handoff)
  longTermMem = updateSessionEnd(longTermMem, intentScores, userMessage);

  saveMemory(longTermMem);

  // Save state
  saveState(state);

  // Record exchange to conversation history
  recordExchange(userMessage, String(finalReply), {
    mode: tone,
    rhythm: rhythm.rhythmState,
  });

  console.log(
    `[Pneuma V2] Response generated | Tone: ${tone} | Rhythm: ${rhythm.rhythmState} | Memory: ${longTermMem.stats.totalMessages} msgs`
  );

  // Return clean string response
  return {
    reply: String(finalReply),
    monologue: "",
    mode: tone,
    rhythm: rhythm.rhythmState,
  };
}

// FILE ROLE: Base commander — gathers all intelligence before the mission runs.
// Receives the user's message, calls every subsystem to collect what's needed
// (archetypes, momentum, RAG passages, memory, rhythm, state), then hands
// the full care package to generate() in responseEngine.js.
// fusion.js GATHERS. responseEngine.js ASSEMBLES.

// WHY IT EXISTS: fusion.js doesn't DO work — it DELEGATES. Every IMPORT is a SPECIALIST it can CALL on.
// CONNECTION: ← called by index.js via pneumaRespond()

// NOTE: fusion.js imports ~15 different subsystems — state, memory, rhythm, uncertainty, pushback, conversation history, response engine. It coordinates all of them to BUILD that reply sent to index.js. It doesn't know or care how those subsystems work, it just calls them in the right order and assembles the final output.
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
} from "../state/state.js"; // ^ state.js = Pneuma's current "mood" and evolution weights — loaded from pneuma_state.json

import { generate, detectIntent } from "./responseEngine.js"; // ^ THE key import — generate() is where the LLM actually gets called (file #3)

import {
  analyzeRhythm,
  getRhythmModifiers,
  getRhythmAwarePhrases,
} from "../input/rhythmIntelligence.js"; // ^ reads conversation tempo — fast back-and-forth vs slow reflective pace
import {
  analyzeUncertainty,
  getUncertaintyResponse,
  shouldBeQuiet,
  getQuietResponse,
  detectPerspectiveShift,
  getMindChangePhrase,
  getFigureItOutResponse,
} from "../behavior/uncertainty.js"; // ^ decides if Pneuma should say less or admit it doesn't know
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
} from "../memory/longTermMemory.js"; // ^ cross-session memory — file #5 in Phase 1

import {
  analyzePushback,
  getPushbackResponse,
} from "../behavior/disagreement.js";
// ^ decides if Pneuma should push back on the user

import {
  recordExchange,
  saveCurrentConversation,
  startOrContinueSession,
} from "../memory/conversationHistory.js";
// ^ logs the conversation to conversations.json

import { getFusionStats } from "../archetypes/archetypeFusion.js";

// WHAT THIS IS: Guard functions — bouncers at the door
// WHY IT EXISTS: Checks if the user wants a special mode BEFORE running the full pipeline
// HOW IT WORKS: Each guard pattern-matches the user's message with regex.
//   If matched → early return with a short response. Pipeline never runs.
//   If no match → message falls through to the full Pneuma response engine.
// CONNECTION: → called inside pneumaRespond() at the top, before any heavy processing

// GUARD: "enter diagnostics" → dumps raw internal state as JSON (internal user dev tool)
function wantsEnterDiagnostics(message) {
  const lower = message.toLowerCase().trim();
  return (
    /^(pneuma,?\s*)?enter diagnostic(s)?( mode)?[.!?]?\s*$/i.test(lower) ||
    // ^ user says "enter diagnostics" → show raw internal state as JSON
    /^diagnostic(s)?[.!?]?\s*$/i.test(lower) ||
    /^pneuma,?\s*diagnostic(s)?[.!?]?\s*$/i.test(lower)
  );
}

// ROLE: Guard — detects request to suppress archetype quote injection ( "drop the quotes" )
// INPUT FROM: pneumaRespond()
// OUTPUT TO: setDirectMode(true)
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

// ROLE: Guard — detects request to restore archetype quote injection
// INPUT FROM: pneumaRespond()
// OUTPUT TO: setDirectMode(false)
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

// ROLE: Guard — detects request to continue a previously cut-off response
// INPUT FROM: pneumaRespond()
// OUTPUT TO: early-return continuation path in pneumaRespond()
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

// ROLE: Guard — detects request to exit diagnostic mode
// INPUT FROM: pneumaRespond()
// OUTPUT TO: setDiagnosticMode(false)
function wantsExitDiagnostics(message) {
  const lower = message.toLowerCase().trim();
  return /^(pneuma,?\s*)?(exit|leave|end)\s+diagnostic(s)?( mode)?[.!?]?\s*$/i.test(
    lower,
  );
}

// ROLE: Assembles and formats the internal state snapshot for diagnostic output
// INPUT FROM: pneumaRespond() when diagnostic mode is active
// OUTPUT TO: pneumaRespond() as the reply string returned to the frontend
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

// ROLE: Guard — detects weight-upgrade directives in the message
// INPUT FROM: pneumaRespond()
// OUTPUT TO: parseUpgrades(), applyUpgrades()
function wantsUpgrade(message) {
  const lower = message.toLowerCase();
  return lower.includes("upgrade") && lower.includes(":");
}

// ROLE: Parses weight key-value pairs out of an upgrade command string
// INPUT FROM: pneumaRespond() via wantsUpgrade() gate
// OUTPUT TO: applyUpgrades()
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

// ROLE: Applies parsed weight upgrades to state and persists them to disk
// INPUT FROM: pneumaRespond() via parseUpgrades()
// OUTPUT TO: saveState() in state.js
function applyUpgrades(upgrades, state) {
  for (const [key, value] of Object.entries(upgrades)) {
    if (typeof value === "number" && !isNaN(value)) {
      state[key] = Math.max(0, Math.min(1, value));
    }
  }
  saveState(state);
  return true;
}

// ROLE: Main entry point — orchestrates all guards, behavioral signals, and response generation for every user message
// INPUT FROM: POST /chat and POST /voice in index.js
// OUTPUT TO: generate() in responseEngine.js; returns { reply, monologue, mode, rhythm } to index.js
export async function pneumaRespond(userMessage) {
  // ---- PHASE: SESSION INIT
  // Start or continue session FIRST — this ensures old conversation data
  // is finalized if this is a new session, preventing stale context
  startOrContinueSession();

  // Track input
  trackInput(userMessage);

  // Load state
  let state = loadState();

  // ---- PHASE: SPECIAL MODE GUARDS

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

  // ---- PHASE: CONTEXT LOADING

  // Get context FIRST — needed for continuation handling
  const threadMemory = getThreadMemory(state);
  const identity = getIdentity(state);

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
  let longTermMem = await loadMemory();

  const blacklistPhrase = detectBlacklistRequest(userMessage);
  if (blacklistPhrase) {
    longTermMem = addToBlacklist(longTermMem, blacklistPhrase);
    await saveMemory(longTermMem);
    console.log(`[Pneuma V2] Blacklisted phrase: "${blacklistPhrase}"`);
    return {
      reply: `Got it. I won't say "${blacklistPhrase}" again.`,
      monologue: "",
      mode: "meta",
    };
  }

  // Detect intent
  const intentScores = detectIntent(userMessage);

  let sessionHandoffPhrase = null;
  const isNewSession =
    !threadMemory?.recentMessages?.length ||
    threadMemory.recentMessages.length === 0;

  if (isNewSession && longTermMem.sessionEmotionalState?.timestamp) {
    sessionHandoffPhrase = getSessionHandoffPhrase(longTermMem);
    if (sessionHandoffPhrase) {
      console.log(
        `[Pneuma V2] Session handoff: ${longTermMem.sessionEmotionalState.lastMood}`,
      );
    }
  }

  // ---- PHASE: BEHAVIORAL SIGNALS
  const rhythm = analyzeRhythm(threadMemory, userMessage);
  const rhythmModifiers = getRhythmModifiers(rhythm);
  const rhythmPhrase = getRhythmAwarePhrases(rhythm);

  console.log(
    `[Pneuma V2] Rhythm: ${rhythm.rhythmState} | Time: ${rhythm.timeContext}`,
  );

  const relevantMemories = getRelevantMemories(
    longTermMem,
    userMessage,
    intentScores,
  );
  const memoryPhrases = getMemoryAwarePhrases(relevantMemories);

  const pushbackAnalysis = analyzePushback(
    userMessage,
    threadMemory,
    longTermMem,
  );

  if (pushbackAnalysis.shouldPushBack && pushbackAnalysis.confidence > 0.55) {
    const pushbackReply = getPushbackResponse(pushbackAnalysis);
    console.log(
      `[Pneuma V2] Pushback mode: ${
        pushbackAnalysis.type
      } (${pushbackAnalysis.confidence.toFixed(2)})`,
    );

    // Still update memories
    longTermMem = updateMemory(
      longTermMem,
      userMessage,
      pushbackReply,
      intentScores,
    );
    await saveMemory(longTermMem);

    state = evolve(state, userMessage, intentScores);
    state = updateThreadMemory(
      state,
      userMessage,
      "shadow",
      intentScores,
      pushbackReply,
    );
    saveState(state);

    return {
      reply: pushbackReply,
      monologue: "",
      mode: "pushback",
      rhythm: rhythm.rhythmState,
    };
  }

  const uncertainty = analyzeUncertainty(userMessage, intentScores);

  const perspectiveShift = detectPerspectiveShift(userMessage, {
    recentMessages: threadMemory?.recentMessages || [],
  });

  let mindChangePrefix = null;
  if (perspectiveShift.shouldConsiderShift) {
    mindChangePrefix = getMindChangePhrase();
    console.log(
      `[Pneuma V2] Perspective shift detected: ${
        perspectiveShift.type
      } (${perspectiveShift.confidence.toFixed(2)})`,
    );
  }

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
      quietReply,
    );
    saveState(state);

    return {
      reply: quietReply,
      monologue: "",
      mode: "quiet",
      rhythm: rhythm.rhythmState,
    };
  }

  if (uncertainty.shouldAdmitUncertainty && uncertainty.score > 0.6) {
    const uncertainReply = getUncertaintyResponse(uncertainty, userMessage);
    console.log(
      `[Pneuma V2] Uncertainty mode: score ${uncertainty.score.toFixed(2)}`,
    );

    state = evolve(state, userMessage, intentScores);
    state = updateThreadMemory(
      state,
      userMessage,
      "oracular",
      intentScores,
      uncertainReply,
    );
    saveState(state);

    return {
      reply: uncertainReply,
      monologue: "",
      mode: "uncertain",
      rhythm: rhythm.rhythmState,
    };
  }

  // ---- PHASE: RESPONSE GENERATION
  const { reply, tone, stateUpdate, _meta } = await generate(
    userMessage,
    state,
    threadMemory,
    identity,
    { rhythm, rhythmModifiers, uncertainty, relevantMemories },
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

  // ---- PHASE: REPLY ASSEMBLY
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
  // Skip if: response already opens with a greeting, OR the message is serious/introspective
  if (rhythmPhrase && rhythmPhrase.length > 0) {
    const alreadyHasGreeting =
      /^(hey|hi|hello|yo|sup|hola|what's up)[!?.,\s]/i.test(finalReply.trim());
    const messageIsSerious =
      intentScores.emotional > 0.4 ||
      intentScores.philosophical > 0.4 ||
      intentScores.numinous > 0.3 ||
      /blind spot|what am i missing|what don't i see|what do you notice|who am i|what's wrong with me|help me|i feel|i've been|i'm struggling|i don't know/.test(
        userMessage.toLowerCase(),
      );
    if (!alreadyHasGreeting && !messageIsSerious) {
      finalReply = `${rhythmPhrase} ${finalReply}`;
    }
  }

  // ---- PHASE: STATE PERSISTENCE
  // Evolve state based on interaction
  state = evolve(state, userMessage, intentScores);

  // Update thread memory with both user message AND pneuma reply
  state = updateThreadMemory(
    state,
    userMessage,
    tone,
    intentScores,
    finalReply,
  );

  // Update long-term memory
  longTermMem = updateMemory(
    longTermMem,
    userMessage,
    finalReply,
    intentScores,
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
    `[Pneuma V2] Response generated | Tone: ${tone} | Rhythm: ${rhythm.rhythmState} | Memory: ${longTermMem.stats.totalMessages} msgs`,
  );

  // Return clean string response
  return {
    reply: String(finalReply),
    monologue: "",
    mode: tone,
    rhythm: rhythm.rhythmState,
  };
}

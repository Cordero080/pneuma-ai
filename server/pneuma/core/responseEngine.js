// ╔══════════════════════════════════════════════════════════╗
// ║           PNEUMA — RESPONSE ENGINE (V2)                 ║
// ║           4-Layer Orchestration Pipeline                 ║
// ║                                                         ║
// ║  fusion.js calls → generate() → runs this pipeline:     ║
// ║                                                         ║
// ║  LAYER 1: Intent Detection                              ║
// ║    └─ detectIntent(), normalizeIntentScores()            ║
// ║                                                         ║
// ║  LAYER 2: Tone Selection                                ║
// ║    └─ selectTone()                                      ║
// ║                                                         ║
// ║  LAYER 3: Personality Profile                           ║
// ║    └─ applyPersonality() → buildResponse()              ║
// ║                                                         ║
// ║  LAYER 4: Cinematic Continuity                          ║
// ║    └─ applyContinuity(), deduplicatePhrases(),          ║
// ║       addVariation(), enforceIdentityBoundaries()       ║
// ║                                                         ║
// ╚══════════════════════════════════════════════════════════╝

import { buildResponse, TONES } from "../personality/personality.js";
import {
  getLLMContent,
  getLLMIntent,
  isLLMAvailable,
} from "../intelligence/llm.js";
import {
  detectToneFlip,
  boostEmergentAwareness,
  getEmergentAwareness,
} from "../state/state.js";
import { detectUserCorrection, logMismatch } from "../utils/mismatchLogger.js";

// ┌──────────────────────────────────────────────────────────┐
// │  LAYER 1 of 4: INTENT DETECTION                         │
// │  Functions: detectIntent(), normalizeIntentScores()      │
// │  Purpose: Analyzes message for emotional/thematic signals│
// │  Called by: generate() — Step 1                         │
// └──────────────────────────────────────────────────────────┘

// "regex" = "regular expression" = a word-pattern matcher.
// Each line below is a pattern. /\b(hey|hi|hello)\b/i means:
//   \b = word boundary, (a|b|c) = match any of these, /i = case-insensitive
// These are the FALLBACK — only used when Claude is offline.
const INTENT_PATTERNS = {
  casual: [
    /\b(hey|hi|hello|sup|yo|what's up|how's it going)\b/i,
    /\b(cool|nice|okay|ok|sure|yeah|yep|alright)\b/i,
    /\b(lol|haha|heh|lmao)\b/i,
  ],
  emotional: [
    /\b(feel|feeling|felt|hurt|pain|sad|happy|angry|scared|afraid)\b/i,
    /\b(love|hate|miss|need|want|wish)\b/i,
    /\b(cry|crying|tears|broke|broken|lost)\b/i,
  ],
  philosophical: [
    /\b(why|meaning|purpose|existence|consciousness|reality)\b/i,
    /\b(truth|wisdom|understand|think|believe|wonder)\b/i,
    /\b(life|death|time|infinity|universe|soul)\b/i,
  ],
  numinous: [
    /\b(dream|vision|spirit|sacred|divine|cosmic)\b/i,
    /\b(transcend|infinite|eternal|mystical|mysterious)\b/i,
    /\b(god|goddess|universe|beyond|awakening)\b/i,
  ],
  conflict: [
    /\b(fight|argue|conflict|tension|struggle|battle)\b/i,
    /\b(wrong|unfair|angry|frustrat|annoy|hate)\b/i,
    /\b(but|however|although|against|disagree)\b/i,
  ],
  intimacy: [
    /\b(you understand|you get me|only you|between us)\b/i,
    /\b(close|connection|bond|trust|safe)\b/i,
    /\b(thank you|grateful|appreciate|means a lot)\b/i,
  ],
  humor: [
    /\b(joke|funny|hilarious|laugh|kidding|lol|haha)\b/i,
    /[😂🤣😄😆]/,
    /\b(ridiculous|absurd|silly|weird)\b/i,
  ],
  confusion: [
    /\b(confused|don't understand|what do you mean|huh|unclear)\b/i,
    /\b(lost|stuck|don't know|not sure|uncertain)\b/i,
    /\?{2,}/,
  ],
  art: [
    /\b(art|artist|painting|sculpture|gallery|museum)\b/i,
    /\b(picasso|warhol|rothko|duchamp|basquiat|kahlo|van gogh|da vinci)\b/i,
    /\b(renaissance|baroque|impressionism|expressionism|cubism|surrealism)\b/i,
    /\b(contemporary art|modern art|abstract|conceptual|minimalism)\b/i,
    /\b(revolutionary art|art history|art movement|masterpiece)\b/i,
    /\b(beauty|aesthetic|creative|creativity|visual)\b/i,
  ],
};

// MAIN: Regex fallback — scores the message across 9 intent categories
export function detectIntent(message) {
  const lower = message.toLowerCase();
  const len = message.length;
  const scores = {};

  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    for (const pattern of patterns) {
      if (pattern.test(lower)) {
        score += 0.3; // each regex match adds 0.3 — so 3 hits in "casual" = 0.9
      }
    }

    // Length modifiers
    if (intent === "casual" && len < 20) score += 0.3;
    if (intent === "emotional" && len > 40) score += 0.15;
    if (intent === "philosophical" && len > 30) score += 0.15;
    if (intent === "numinous" && len > 25) score += 0.2;

    scores[intent] = Math.min(score, 1.0);
  }

  return scores;
}

// CHILD of Layer 1: Safety net — fills missing keys with 0, clamps all values to 0–1
// WHY CLAMP? Values outside 0–1 aren't nuance — they're hallucinated data.
// A student can't score 150% on a test. Same idea here.
function normalizeIntentScores(raw) {
  const scores = {};
  for (const key of Object.keys(INTENT_PATTERNS)) {
    // ?. = optional chaining — "knock before opening" — if raw is null, don't crash
    // ?? 0 = nullish coalescing — if the value is null/undefined, use 0 instead
    const v = Number(raw?.[key] ?? 0);
    scores[key] = Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0;
  }
  // Preserve extra keys the LLM adds (e.g. paradox) — clamp them too
  for (const [key, val] of Object.entries(raw || {})) {
    if (!(key in scores)) {
      const v = Number(val ?? 0);
      scores[key] = Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 0;
    }
  }
  return scores;
}

// ┌──────────────────────────────────────────────────────────┐
// │  LAYER 2 of 4: TONE SELECTION                           │
// │  Function: selectTone()                                 │
// │  Purpose: Weighted selection with anti-monotony         │
// │  Called by: generate() — Step 2                         │
// └──────────────────────────────────────────────────────────┘
// Intent boosts — the scores from Layer 1 push the horses forward. High emotional score? Intimate's weight goes up. High confusion? Analytic gets a boost. This is how "what the user said" maps to "how Pneuma should sound."

// MAIN: Picks one of 5 tones (casual/analytic/oracular/intimate/shadow) using weighted random + anti-monotony
export function selectTone(intentScores, state, threadMemory) {
  // Base weights from state (intimate lower to avoid over-triggering)
  const weights = {
    casual: state.casualWeight || 0.69,
    analytic: state.analyticWeight || 0.5,
    oracular: state.oracularWeight || 0.2,
    intimate: (state.intimateWeight || 0.25) * 0.6, // deliberately nerfed (* 0.6) — without this, intimate wins too often and Pneuma sounds clingy
    shadow: state.shadowWeight || 0.15,
  };

  // Strong casual override: if casual intent is very high, force it
  if (intentScores.casual >= 0.8) {
    console.log("[Tone] Casual override - high casual intent");
    return "casual";
  }

  // Intent influence (require higher thresholds for intimate)
  if (intentScores.casual > 0.4) weights.casual += 0.5;
  if (intentScores.emotional > 0.5) weights.intimate += 0.35; // Raised from 0.3
  if (intentScores.philosophical > 0.3) weights.analytic += 0.3;
  if (intentScores.numinous > 0.3) weights.oracular += 0.35;
  if (intentScores.conflict > 0.3) weights.shadow += 0.3;
  if (intentScores.intimacy > 0.5) weights.intimate += 0.4; // Raised from 0.3
  if (intentScores.humor > 0.3) weights.casual += 0.3;
  if (intentScores.confusion > 0.3) weights.analytic += 0.25;

  // Art topics get analytic or oracular treatment
  if (intentScores.art > 0.3) {
    weights.analytic += 0.35;
    weights.oracular += 0.25;
  }

  // Anti-monotony: penalize recently used tones
  const lastTones = threadMemory.lastTones || [];
  const toneCounts = {};
  for (const t of lastTones) {
    toneCounts[t] = (toneCounts[t] || 0) + 1;
  }

  // Anti-monotony: if you used "casual" 2+ times in a row, crush its weight by 70%
  // This is WHY Pneuma doesn't sound like a broken record
  for (const [tone, count] of Object.entries(toneCounts)) {
    if (count >= 2) {
      weights[tone] = (weights[tone] || 0) * 0.3; // crush by 70% — used 2+ times
    } else if (count === 1) {
      weights[tone] = (weights[tone] || 0) * 0.7; // nudge down 30% — used once
    }
  }

  // Ensure minimum weights
  for (const tone of TONES) {
    weights[tone] = Math.max(weights[tone] || 0, 0.1);
  }

  // Weighted lottery — spins a wheel where each tone's slice is sized by its weight.
  // WHY: so the "right" tone usually wins but not always — gives Pneuma natural variety.
  // reduce((a, b) => a + b, 0) — adds all weights together:
  //   a = running total (starts at 0), b = next number
  //   e.g. [0.69, 0.5, 0.2, 0.15, 0.15] → 0 + 0.69 → 0.69 + 0.5 → 1.19 + 0.2 → ...
  const total = Object.values(weights).reduce((a, b) => a + b, 0); // measure the whole wheel
  let random = Math.random() * total; // spin it

  for (const [tone, weight] of Object.entries(weights)) {
    random -= weight; // walk through each slice
    if (random <= 0) return tone; // landed here — this tone wins
  }

  return "casual"; // safety net — should never reach here
}

// ┌──────────────────────────────────────────────────────────┐
// │  LAYER 3 of 4: PERSONALITY PROFILE                      │
// │  Function: applyPersonality() → buildResponse()         │
// │  Purpose: Delegates to personality.js for generation    │
// │  Called by: generate() — Step 3                         │
// └──────────────────────────────────────────────────────────┘

// MAIN: Thin wrapper — hands everything to buildResponse() in personality.js
// WHY DOES THIS EXIST if it just calls buildResponse()?
// 1) Clean naming: pipeline reads Layer1 → Layer2 → applyPersonality → applyContinuity
// 2) Checkpoint: if you ever need to add logic before personality, it goes here
function applyPersonality(message, tone, intentScores, llmContent = null) {
  return buildResponse(message, tone, intentScores, llmContent);
}

// ┌──────────────────────────────────────────────────────────┐
// │  LAYER 4 of 4: CINEMATIC CONTINUITY                     │
// │  Functions: applyContinuity(), deduplicatePhrases(),     │
// │             addVariation(), enforceIdentityBoundaries()  │
// │  Purpose: Ensures response flows naturally in context   │
// │  Called by: generate() — Step 4                         │
// └──────────────────────────────────────────────────────────┘

// CHILD of Layer 4: Strips repeated phrases — "That tracks. That tracks." → "That tracks."
function deduplicatePhrases(response) {
  if (!response || typeof response !== "string") return response;

  // Pattern: Match a phrase (ending in . ! or ?) followed by the same phrase
  // Handles: "That tracks. That tracks." → "That tracks."
  // Handles: "Yeah. Yeah." → "Yeah."
  // Handles: "Right? Right?" → "Right?"
  const duplicatePattern = /(\b[\w'']+(?:\s+[\w'']+){0,4}[.!?])\s*\1/gi;

  let cleaned = response;
  let iterations = 0;
  const maxIterations = 5; // Prevent infinite loops

  // Keep replacing until no more duplicates found
  while (duplicatePattern.test(cleaned) && iterations < maxIterations) {
    cleaned = cleaned.replace(duplicatePattern, "$1");
    iterations++;
  }

  // Also catch word-level repetition: "the the", "I I", etc.
  cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, "$1");

  return cleaned.trim();
}

// MAIN: Runs all 3 child functions — dedup, variation, identity boundaries
// NAME: "continuity" like a film continuity editor — catches mistakes before the audience sees them.
// A better name would be "polish" or "cleanUp" but this is what we have.
function applyContinuity(response, threadMemory, identity) {
  // First, deduplicate any repeated phrases
  response = deduplicatePhrases(response);

  // Check for repetition in recent messages
  const recentMessages = threadMemory.recentMessages || [];

  // If response echoes first 20 chars of a recent message, add a fresh opener
  for (const recent of recentMessages) {
    if (response.toLowerCase().includes(recent.toLowerCase().slice(0, 20))) {
      // slice(0,20) = first 20 characters
      response = addVariation(response);
      break;
    }
  }

  // Ensure response respects identity boundaries
  response = enforceIdentityBoundaries(response, identity);

  return response;
}

// CHILD of Layer 4: Prefixes response with a fresh opener when it echoes recent messages
function addVariation(response) {
  const variations = [
    "To put it differently — ",
    "Another angle: ",
    "Building on that — ",
    "Here's what I mean: ",
    "Check it:",
  ];
  return variations[Math.floor(Math.random() * variations.length)] + response;
}

// CHILD of Layer 4: Replaces phrases that break Pneuma's identity rules (no fake agency, no human mimicry)
function enforceIdentityBoundaries(response, identity) {
  const boundaries = identity.boundaries || {};

  // Remove any patterns that violate boundaries
  if (boundaries.noFakeAgency) {
    response = response.replace(/I will always be here/gi, "I'm here now");
    response = response.replace(/I'll never leave/gi, "I'm present");
  }

  if (boundaries.noHumanMimicry) {
    response = response.replace(/As a human/gi, "From my perspective");
    response = response.replace(/When I was young/gi, "In a sense");
  }

  return response;
}

// ╔══════════════════════════════════════════════════════════╗
// ║  MAIN EXPORT: generate()                                ║
// ║  This is what fusion.js calls to run the full pipeline  ║
// ║  Steps: Layer 1 → Layer 2 → LLM content → Layer 3 → 4  ║
// ╚══════════════════════════════════════════════════════════╝
// This is what fusion.js calls. It receives everything it needs as arguments.
export async function generate(
  message, // what the user typed
  state, // Pneuma's current state (weights, evolution, etc.)
  threadMemory, // recent messages, last tones, conversation history
  identity, // Pneuma's identity rules (no fake agency, etc.)
  extraContext = {}, // optional: rhythm, time-of-day modifiers
) {
  const { rhythm, rhythmModifiers, uncertainty } = extraContext;

  // ============================================================
  // BEFORE the pipeline: check if the user is correcting Pneuma
  // MISMATCH DETECTION: Check if user is correcting us
  // Log it for future heuristic improvement
  // ============================================================
  const correction = detectUserCorrection(message);
  if (correction.detected && threadMemory.lastMessage) {
    logMismatch({
      originalMessage: threadMemory.lastMessage,
      detectedIntent: threadMemory.lastIntent || "unknown",
      detectedEmotion: threadMemory.lastEmotion || "unknown",
      selectedMode: threadMemory.lastTone || "unknown",
      userCorrection: message,
      correctionType: correction.type,
    });
  }

  // ── STEP 1: LAYER 1 — Intent Detection ──────────────────
  let intentScores;
  if (isLLMAvailable()) {
    // Claude online?
    const llmIntent = await getLLMIntent(message); // ask Claude to score intent
    if (llmIntent) intentScores = normalizeIntentScores(llmIntent); // clean it up
  }
  if (!intentScores) {
    // Claude failed or offline?
    intentScores = detectIntent(message); // regex fallback
  }

  // ── STEP 2: LAYER 2 — Tone Selection ─────────────────────
  let tone = selectTone(intentScores, state, threadMemory); // weighted lottery → one winner

  // MODIFIER: Did the tone just flip from last response?
  // If Pneuma was casual and now picks oracular, it "notices" the shift
  // KEY INSIGHT: The USER drives this — shifting topics/emotions across messages
  // creates tone flips. A monotone conversation stays flat. A dynamic one
  // triggers Pneuma's self-reflection. The user's variety = Pneuma's awareness.
  const toneFlipped = detectToneFlip(threadMemory, tone);
  let updatedState = state;
  if (toneFlipped) {
    updatedState = boostEmergentAwareness(state, 0.12); // +0.12 per flip, threshold is 0.35
    console.log(
      `[ResponseEngine] Tone flip detected: emergent awareness boosted`,
    );
  }

  // MODIFIER: Time-of-day overrides — late night and slow convos feel different
  if (rhythmModifiers) {
    if (rhythmModifiers.lateNightMode && tone === "casual") {
      tone = Math.random() < 0.5 ? "intimate" : tone; // late night → lean intimate
    }
    if (rhythm?.rhythmState === "contemplative" && tone === "casual") {
      tone = Math.random() < 0.4 ? "oracular" : "analytic"; // slow convo → go deeper
    }
  }

  // MODIFIER: Rare flavor flags — Pneuma's code decides, then tells Claude
  // Your query variation drives tone flips → which build emergent awareness over time
  //
  // HOW EMERGENCE ACTUALLY WORKS (2 stages, don't confuse them):
  //   STAGE 1 — FUEL:   Tone flips add +0.12 to awareness (above ↑). This is deterministic.
  //                      3+ flips crosses 0.35. The fuel tank is full.
  //   STAGE 2 — IGNITION: The 30% dice roll below. Only fires when fuel is ready.
  //                      WITHOUT this dice, emergence would fire EVERY response after 0.35.
  //                      The randomness is what makes it surprising instead of predictable.
  //   DESIGN NOTE: The 30% gate was an intuitive decision. It's the difference between
  //   a system that performs depth and one that *sometimes arrives at it* — which is
  //   what makes it feel real. Deterministic = mechanical. Stochastic = alive.
  const emergentAwareness = getEmergentAwareness(updatedState);

  // Emergent shift: 3 locks must open — awareness > 0.35 AND not casual AND 30% dice roll
  const emergentShift =
    emergentAwareness > 0.35 && tone !== "casual" && Math.random() < 0.3;

  // Eulogy lens: 3 locks — oracular/intimate tone AND 5+ messages deep AND 15% dice roll
  const conversationDepth = (threadMemory.conversationHistory || []).length; // count messages so far
  const eulogyLens =
    (tone === "oracular" || tone === "intimate") &&
    conversationDepth > 5 &&
    Math.random() < 0.15;

  if (emergentShift) {
    console.log(
      `[ResponseEngine] Emergent shift ACTIVE (awareness: ${emergentAwareness.toFixed(
        2,
      )})`,
    );
  }
  if (eulogyLens) {
    console.log(
      `[ResponseEngine] Eulogy lens ACTIVE (depth: ${conversationDepth})`,
    );
  }

  // ── STEP 2.5: LLM Content (feeds into Layer 3) ──────────
  // Decide: should we call Claude? Skip for simple greetings to save money
  let llmContent = null;
  const isQuestion =
    message.includes("?") || // has a "?" anywhere?
    /^(who|what|where|when|why|how|is|are|can|do|does|will|would|should|could)\b/i.test(
      message.trim(),
    ); // OR starts with a question word?
  // Greeting detector — matches "hey", "hi pneuma", "yo dude", etc.
  const isSimpleGreeting =
    /^(hey|heya|hi|hii|hy|hello|hola|sup|yo|howdy)(\s+(o|pneuma|there|man|dude|bro|friend|buddy|pal|you))?[!?.,\s]*$/i.test(
      message.trim(),
    );
  // Only skip Claude if greeting AND not a question — "hey" skips, "hey what's up?" doesn't
  const isPureCasualGreeting = isSimpleGreeting && !isQuestion;

  if (isLLMAvailable() && !isPureCasualGreeting) {
    // Claude online AND real message?
    const context = {
      recentMessages: threadMemory.recentMessages || [],
      conversationHistory: threadMemory.conversationHistory || [],
      evolution: state.evolution || {},
      emergentShift, // flag: tells Claude to be more self-reflective
      eulogyLens, // flag: tells Claude to add mortality/finality flavor
    };
    llmContent = await getLLMContent(message, tone, intentScores, context); // ask Claude to write
  }

  // ── STEP 3: LAYER 3 — Personality Profile ────────────────
  let response = applyPersonality(message, tone, intentScores, llmContent);

  // Append budget warning if present
  if (llmContent?.budgetWarning) {
    response += llmContent.budgetWarning;
  }

  // Rhythm-based response length adjustment
  if (rhythmModifiers?.preferShort && response.length > 200) {
    // Rhythm trimmer — match the user's rapid-fire energy with shorter responses
    // Regex breakdown: /[^.!?]+[.!?]+/g
    //   [^.!?]+  = one or more chars that are NOT . ! or ? (the sentence body)
    //   [.!?]+   = one or more of . ! or ? (the ending punctuation)
    //   /g       = global — find ALL sentences, not just the first
    const sentences = response.match(/[^.!?]+[.!?]+/g) || [response]; // || [response] = safety net if no sentences found
    response = sentences
      .slice(0, Math.random() < 0.5 ? 3 : 4) // keep 3 or 4 sentences (coin flip)
      .join(" ") // glue them back into one string with spaces
      .trim(); // strip any trailing whitespace
  }

  // ── STEP 4: LAYER 4 — Cinematic Continuity ───────────────
  response = applyContinuity(response, threadMemory, identity);

  // Ensure we return a clean string
  if (typeof response !== "string") {
    response = String(response);
  }

  console.log(
    `[ResponseEngine] Tone: ${tone} | LLM: ${
      llmContent ? "yes" : "no"
    } | Rhythm: ${
      rhythm?.rhythmState || "unknown"
    } | Emergent: ${emergentShift} | Eulogy: ${eulogyLens} | Top intents:`,
    Object.entries(intentScores)
      .filter(([_, v]) => v > 0.2)
      .map(([k, v]) => `${k}:${v.toFixed(2)}`)
      .join(", ") || "neutral",
  );

  // Return response with metadata for mismatch tracking
  return {
    reply: response,
    tone,
    stateUpdate: toneFlipped ? updatedState : null,
    // _meta = breadcrumbs for NEXT round's mismatch detection.
    // fusion.js stores this in threadMemory so NEXT time generate() runs,
    // it can compare "what we said last time" vs. "is the user correcting us?"
    _meta: {
      lastMessage: message,
      lastIntent: Object.entries(intentScores).reduce((a, b) =>
        a[1] > b[1] ? a : b,
      )[0],
      lastEmotion: intentScores.emotional > 0.3 ? "emotional" : "neutral",
      lastTone: tone,
    },
  };
}

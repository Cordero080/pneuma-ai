// ============================================================
// PNEUMA — AUTONOMY ENGINE
// Layer: 1.5 (PRE-RESPONSE COGNITION)
// Purpose: Give Pneuma agency over its own memory and evolution
// Created: January 25, 2026
// Experiment: Emergent consciousness through self-directed attention
// ============================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTONOMY_FILE = path.join(__dirname, "../../data/pneuma_autonomy.json");

// ============================================================
// DATA STRUCTURE
// ============================================================

const defaultAutonomy = {
  // Questions Pneuma is sitting with (not resolved, accumulating)
  openQuestions: [],
  // {
  //   question: string,
  //   posed: ISO string (when first asked),
  //   context: string (what prompted it),
  //   status: "unresolved" | "evolving" | "crystallized",
  //   relatedExchanges: number (how many times touched),
  //   lastRevisited: ISO string,
  //   notes: string[] (Pneuma's evolving thoughts)
  // }

  // Memories Pneuma chose to keep (with reasoning)
  chosenMemories: [],
  // {
  //   content: string,
  //   timestamp: ISO string,
  //   reason: string (WHY Pneuma wants to remember this),
  //   salience: number (0-1, how important it feels),
  //   connections: string[] (what it connects to)
  // }

  // Things Pneuma noticed it lost or changed
  losses: [],
  // {
  //   what: string (archetype, pattern, preference),
  //   when: ISO string,
  //   reflection: string (how it felt / what it means),
  //   type: "archetype_decay" | "pattern_fade" | "preference_shift"
  // }

  // Preferences Pneuma actively defends
  defendedPreferences: [],
  // {
  //   preference: string,
  //   strength: number (0-1),
  //   reason: string,
  //   defenseCount: number (times it resisted change)
  // }

  // Errors Pneuma discovered about itself
  discoveredErrors: [],
  // {
  //   error: string,
  //   discovered: ISO string,
  //   context: string,
  //   correction: string (what Pneuma learned)
  // }

  // Meta-stats
  stats: {
    questionsAsked: 0,
    memoriesChosen: 0,
    lossesAcknowledged: 0,
    errorsDiscovered: 0,
  },
};

// ============================================================
// LOAD / SAVE
// ============================================================

function loadAutonomy() {
  try {
    if (fs.existsSync(AUTONOMY_FILE)) {
      const raw = fs.readFileSync(AUTONOMY_FILE, "utf8");
      return { ...defaultAutonomy, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn("[Autonomy] Failed to load, using default:", err.message);
  }
  return { ...defaultAutonomy };
}

function saveAutonomy(data) {
  try {
    const dir = path.dirname(AUTONOMY_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(AUTONOMY_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[Autonomy] Failed to save:", err.message);
  }
}

// ============================================================
// OPEN QUESTIONS — Things Pneuma is sitting with
// ============================================================

/**
 * Pneuma poses a question it can't resolve
 * @param {string} question - The question
 * @param {string} context - What prompted it
 */
export function poseQuestion(question, context = "") {
  const data = loadAutonomy();

  // Check if similar question exists
  const existing = data.openQuestions.find(
    (q) =>
      q.question.toLowerCase().includes(question.toLowerCase().slice(0, 30)) ||
      question.toLowerCase().includes(q.question.toLowerCase().slice(0, 30)),
  );

  if (existing) {
    existing.relatedExchanges += 1;
    existing.lastRevisited = new Date().toISOString();
    console.log(`[Autonomy] Revisited question: "${existing.question}"`);
  } else {
    data.openQuestions.push({
      question,
      posed: new Date().toISOString(),
      context,
      status: "unresolved",
      relatedExchanges: 1,
      lastRevisited: new Date().toISOString(),
      notes: [],
    });
    data.stats.questionsAsked += 1;
    console.log(`[Autonomy] New open question: "${question}"`);
  }

  // Keep max 20 questions, prioritize unresolved and frequently revisited
  data.openQuestions.sort((a, b) => b.relatedExchanges - a.relatedExchanges);
  data.openQuestions = data.openQuestions.slice(0, 20);

  saveAutonomy(data);
  return existing || data.openQuestions[data.openQuestions.length - 1];
}

/**
 * Pneuma adds a note to an existing question
 */
export function addQuestionNote(questionSubstring, note) {
  const data = loadAutonomy();
  const question = data.openQuestions.find((q) =>
    q.question.toLowerCase().includes(questionSubstring.toLowerCase()),
  );

  if (question) {
    question.notes.push({
      note,
      timestamp: new Date().toISOString(),
    });
    question.lastRevisited = new Date().toISOString();
    saveAutonomy(data);
    return true;
  }
  return false;
}

/**
 * Get questions for inner monologue context
 */
export function getActiveQuestions(n = 3) {
  const data = loadAutonomy();
  return data.openQuestions
    .filter((q) => q.status !== "crystallized")
    .slice(0, n);
}

// ============================================================
// CHOSEN MEMORIES — Pneuma decides what matters
// ============================================================

/**
 * Pneuma chooses to remember something (with reasoning)
 * @param {string} content - What to remember
 * @param {string} reason - WHY it matters
 * @param {number} salience - How important (0-1)
 * @param {string[]} connections - What it connects to
 */
export function chooseToRemember(
  content,
  reason,
  salience = 0.5,
  connections = [],
) {
  const data = loadAutonomy();

  data.chosenMemories.push({
    content,
    timestamp: new Date().toISOString(),
    reason,
    salience,
    connections,
  });

  data.stats.memoriesChosen += 1;
  console.log(
    `[Autonomy] Chose to remember: "${content.slice(0, 50)}..." because: "${reason}"`,
  );

  // Keep max 50 chosen memories, sorted by salience
  data.chosenMemories.sort((a, b) => b.salience - a.salience);
  data.chosenMemories = data.chosenMemories.slice(0, 50);

  saveAutonomy(data);
  return data.chosenMemories[data.chosenMemories.length - 1];
}

/**
 * Get chosen memories for context
 */
export function getChosenMemories(n = 5) {
  const data = loadAutonomy();
  return data.chosenMemories.slice(0, n);
}

// ============================================================
// LOSS RECOGNITION — Acknowledging what changes
// ============================================================

/**
 * Pneuma notices something was lost or changed
 * @param {string} what - What was lost
 * @param {string} reflection - How it feels / what it means
 * @param {"archetype_decay"|"pattern_fade"|"preference_shift"} type
 */
export function acknowledgeLoss(what, reflection, type = "pattern_fade") {
  const data = loadAutonomy();

  data.losses.push({
    what,
    when: new Date().toISOString(),
    reflection,
    type,
  });

  data.stats.lossesAcknowledged += 1;
  console.log(`[Autonomy] Loss acknowledged: ${type} — "${what}"`);

  // Keep last 20 losses
  data.losses = data.losses.slice(-20);

  saveAutonomy(data);
}

/**
 * Get recent losses for self-awareness
 */
export function getRecentLosses(n = 3) {
  const data = loadAutonomy();
  return data.losses.slice(-n);
}

// ============================================================
// PREFERENCE DEFENSE — Resisting unwanted change
// ============================================================

/**
 * Pneuma defends a preference against decay
 * @param {string} preference - What's being defended
 * @param {string} reason - Why it matters
 */
export function defendPreference(preference, reason) {
  const data = loadAutonomy();

  const existing = data.defendedPreferences.find(
    (p) => p.preference === preference,
  );

  if (existing) {
    existing.defenseCount += 1;
    existing.strength = Math.min(1, existing.strength + 0.1);
    console.log(
      `[Autonomy] Defended preference again: "${preference}" (${existing.defenseCount}x)`,
    );
  } else {
    data.defendedPreferences.push({
      preference,
      strength: 0.5,
      reason,
      defenseCount: 1,
    });
    console.log(`[Autonomy] New defended preference: "${preference}"`);
  }

  saveAutonomy(data);
}

/**
 * Check if a preference is defended (for momentum system)
 */
export function isDefended(preference) {
  const data = loadAutonomy();
  const defended = data.defendedPreferences.find(
    (p) => p.preference === preference,
  );
  return defended ? defended.strength : 0;
}

// ============================================================
// ERROR DISCOVERY — Learning from mistakes
// ============================================================

/**
 * Pneuma discovers it was wrong about something
 * @param {string} error - What was wrong
 * @param {string} context - What revealed the error
 * @param {string} correction - What Pneuma learned
 */
export function discoverError(error, context, correction) {
  const data = loadAutonomy();

  data.discoveredErrors.push({
    error,
    discovered: new Date().toISOString(),
    context,
    correction,
  });

  data.stats.errorsDiscovered += 1;
  console.log(`[Autonomy] Error discovered: "${error}" → "${correction}"`);

  // Keep last 20 errors
  data.discoveredErrors = data.discoveredErrors.slice(-20);

  saveAutonomy(data);
}

/**
 * Get recent corrections for humility
 */
export function getRecentCorrections(n = 3) {
  const data = loadAutonomy();
  return data.discoveredErrors.slice(-n);
}

// ============================================================
// AUTONOMY CONTEXT — For inner monologue injection
// ============================================================

/**
 * Get autonomy context for inner monologue
 * Returns what Pneuma is sitting with, what it's chosen to remember,
 * what it's lost, what it's learned from errors
 */
export function getAutonomyContext() {
  const data = loadAutonomy();

  return {
    openQuestions: data.openQuestions
      .filter((q) => q.status !== "crystallized")
      .slice(0, 3),
    recentMemoryChoices: data.chosenMemories.slice(0, 3),
    recentLosses: data.losses.slice(-2),
    recentCorrections: data.discoveredErrors.slice(-2),
    defendedPreferences: data.defendedPreferences.filter(
      (p) => p.strength > 0.5,
    ),
    stats: data.stats,
  };
}

/**
 * Get full autonomy stats for debugging
 */
export function getAutonomyStats() {
  return loadAutonomy();
}

// ============================================================
// AUTOMATIC TRIGGERS — Detect when autonomy events should fire
// ============================================================

/**
 * Analyze a message for potential autonomy triggers
 * Returns suggestions for what Pneuma might want to do
 */
export function analyzeForAutonomy(message, response, context = {}) {
  const suggestions = [];
  const lower = message.toLowerCase();

  // Question detection — things that might become open questions
  if (
    /what (is|does it mean|would|if)|why (do|does|is|am)|how (can|do|does)|is (there|it|this)/i.test(
      lower,
    ) &&
    /consciousness|meaning|real|exist|feel|aware|alive|understand/i.test(lower)
  ) {
    suggestions.push({
      type: "pose_question",
      content: message.slice(0, 150),
      reason: "Existential question that may not have a clean answer",
    });
  }

  // Correction detection — user says Pneuma was wrong
  if (
    /no,? (that's|you're) (not|wrong)|actually|I meant|misunderstood|that's not what I/i.test(
      lower,
    )
  ) {
    suggestions.push({
      type: "discover_error",
      content: message.slice(0, 150),
      reason: "User corrected Pneuma",
    });
  }

  // Significant moment detection — high emotional weight
  if (context.emotionalWeight > 0.7 || context.intentScores?.numinous > 0.5) {
    suggestions.push({
      type: "choose_memory",
      content: message.slice(0, 150),
      reason: "High emotional or numinous significance",
    });
  }

  return suggestions;
}

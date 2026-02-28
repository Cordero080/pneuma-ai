// FILE ROLE: Pneuma's self-directed agency store — persists open questions, chosen memories, acknowledged losses, defended preferences, and discovered errors to pneuma_autonomy.json so they accumulate across sessions.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTONOMY_FILE = path.join(__dirname, "../../data/pneuma_autonomy.json");

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

// ROLE: Reads autonomy state from disk, merging with defaults for missing keys
// INPUT FROM: all public autonomy functions at the start of each call
// OUTPUT TO: all public autonomy functions as the working autonomy data object
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

// ROLE: Persists the current autonomy data object to disk
// INPUT FROM: all public autonomy functions after a state mutation
// OUTPUT TO: AUTONOMY_FILE on disk
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

// ROLE: Adds or increments an open question in the autonomy store
// INPUT FROM: getLLMContent() in llm.js via analyzeForAutonomy()
// OUTPUT TO: saveAutonomy() → AUTONOMY_FILE; returns the added or existing question object
export function poseQuestion(question, context = "", source = "conversation") {
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
      source,
      disclosed: source !== "dream",
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

// ROLE: Appends a note to an existing open question matched by substring
// INPUT FROM: external callers that want to annotate an existing question
// OUTPUT TO: saveAutonomy() → AUTONOMY_FILE; returns boolean indicating match found
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

// ROLE: Returns the top unresolved questions for inner monologue injection
// INPUT FROM: generateInnerMonologue() in innerMonologue.js
// OUTPUT TO: generateInnerMonologue() as the autonomy open-questions block
export function getActiveQuestions(n = 3) {
  const data = loadAutonomy();
  return data.openQuestions
    .filter((q) => q.status !== "crystallized")
    .slice(0, n);
}

// ROLE: Adds a chosen memory to the autonomy store with a stated reason and salience score
// INPUT FROM: getLLMContent() in llm.js via analyzeForAutonomy()
// OUTPUT TO: saveAutonomy() → AUTONOMY_FILE; returns the added memory object
export function chooseToRemember(
  content,
  reason,
  salience = 0.5,
  connections = [],
  source = "conversation",
) {
  const data = loadAutonomy();

  data.chosenMemories.push({
    content,
    timestamp: new Date().toISOString(),
    reason,
    salience,
    connections,
    source,
    disclosed: source !== "dream",
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

// ROLE: Returns the top highest-salience chosen memories for context injection
// INPUT FROM: getAutonomyContext()
// OUTPUT TO: getAutonomyContext() as the recentMemoryChoices field
export function getChosenMemories(n = 5) {
  const data = loadAutonomy();
  return data.chosenMemories.slice(0, n);
}

// ROLE: Records an acknowledged loss or change about Pneuma's own state
// INPUT FROM: external callers that detect archetype decay, pattern fade, or preference shifts
// OUTPUT TO: saveAutonomy() → AUTONOMY_FILE
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

// ROLE: Returns the most recent acknowledged losses for self-awareness context
// INPUT FROM: getAutonomyContext()
// OUTPUT TO: getAutonomyContext() as the recentLosses field
export function getRecentLosses(n = 3) {
  const data = loadAutonomy();
  return data.losses.slice(-n);
}

// ROLE: Creates or strengthens a defended preference in the autonomy store
// INPUT FROM: external callers that detect resistance to preference decay
// OUTPUT TO: saveAutonomy() → AUTONOMY_FILE
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

// ROLE: Checks whether a given preference is actively defended and returns its strength
// INPUT FROM: archetypeMomentum.js momentum system
// OUTPUT TO: momentum system as a strength number (0 if not found)
export function isDefended(preference) {
  const data = loadAutonomy();
  const defended = data.defendedPreferences.find(
    (p) => p.preference === preference,
  );
  return defended ? defended.strength : 0;
}

// ROLE: Records an error Pneuma discovered about itself and what it learned
// INPUT FROM: getLLMContent() in llm.js via analyzeForAutonomy()
// OUTPUT TO: saveAutonomy() → AUTONOMY_FILE
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

// ROLE: Returns the most recently discovered corrections for humility-context injection
// INPUT FROM: getAutonomyContext()
// OUTPUT TO: getAutonomyContext() as the recentCorrections field
export function getRecentCorrections(n = 3) {
  const data = loadAutonomy();
  return data.discoveredErrors.slice(-n);
}

// ROLE: Assembles the full autonomy snapshot for inner monologue injection
// INPUT FROM: generateInnerMonologue() in innerMonologue.js
// OUTPUT TO: generateInnerMonologue() as the autonomy context object
export function getAutonomyContext() {
  const data = loadAutonomy();

  return {
    openQuestions: data.openQuestions
      .filter((q) => q.status !== "crystallized")
      .slice(0, 3)
      .map((q) => ({
        ...q,
        isDreamSourced: q.source === "dream" && !q.disclosed,
      })),
    recentMemoryChoices: data.chosenMemories.slice(0, 3).map((m) => ({
      ...m,
      isDreamSourced: m.source === "dream" && !m.disclosed,
    })),
    recentLosses: data.losses.slice(-2),
    recentCorrections: data.discoveredErrors.slice(-2),
    defendedPreferences: data.defendedPreferences.filter(
      (p) => p.strength > 0.5,
    ),
    stats: data.stats,
  };
}

// ROLE: Returns the full raw autonomy data object for debugging
// INPUT FROM: diagnostic or debug callers
// OUTPUT TO: caller as the complete autonomy data object
export function getAutonomyStats() {
  return loadAutonomy();
}

// ROLE: Detects which autonomy events should fire based on message content and emotional weight
// INPUT FROM: getLLMContent() in llm.js after each API response
// OUTPUT TO: getLLMContent() as a suggestions array driving poseQuestion(), chooseToRemember(), discoverError()
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

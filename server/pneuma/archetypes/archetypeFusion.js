// ============================================================
// PNEUMA — ARCHETYPE FUSION ENGINE
// Layer: 2 (INTELLIGENCE)
// Purpose: Track and reinforce successful archetype combinations
// Input: Active archetypes, user feedback signals, topic
// Output: Weighted fusion recommendations, crystallized blends
// Created: December 18, 2025
// Experiment: Archetype Convergence — making voices ONE
// ============================================================

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getEmbedding, cosineSimilarity } from "../memory/vectorMemory.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FUSION_FILE = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "archetype_fusions.json"
);

// ============================================================
// DATA STRUCTURE
// ============================================================

const defaultFusionData = {
  // Successful blends that have been reinforced
  crystallizedBlends: [],
  // {
  //   archetypes: ["stoicEmperor", "trickster"],
  //   weight: 0.7, // How strongly this blend has been reinforced
  //   topicPatterns: ["existential", "humor", "death"],
  //   successCount: 5,
  //   lastUsed: ISO string,
  //   embedding: number[] // Vector of the blend for similarity matching
  // }

  // Recent fusions (last 50) for pattern detection
  recentFusions: [],
  // {
  //   archetypes: string[],
  //   topic: string,
  //   feedback: "positive" | "neutral" | "negative",
  //   timestamp: ISO string
  // }

  // The "default voice" — weighted combination that emerges over time
  defaultVoice: {
    weights: {}, // { archetypeName: weight }
    lastUpdated: null,
  },

  stats: {
    totalFusions: 0,
    positiveReinforcements: 0,
    negativeSignals: 0,
  },
};

// ============================================================
// LOAD / SAVE
// ============================================================

function loadFusionData() {
  try {
    if (fs.existsSync(FUSION_FILE)) {
      const raw = fs.readFileSync(FUSION_FILE, "utf8");
      return { ...defaultFusionData, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn(
      "[ArchetypeFusion] Failed to load, using default:",
      err.message
    );
  }
  return { ...defaultFusionData };
}

function saveFusionData(data) {
  try {
    const dir = path.dirname(FUSION_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(FUSION_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("[ArchetypeFusion] Failed to save:", err.message);
  }
}

// ============================================================
// FUSION TRACKING
// ============================================================

/**
 * Record a fusion that was used in a response
 * @param {string[]} archetypes - The archetypes that were blended
 * @param {string} topic - The topic/context of the conversation
 * @param {string} userMessage - The user's message (for embedding)
 */
export async function recordFusion(archetypes, topic, userMessage) {
  if (!archetypes || archetypes.length < 2) return;

  const data = loadFusionData();

  data.recentFusions.push({
    archetypes: archetypes.slice(0, 3), // Max 3 archetypes
    topic,
    feedback: "neutral", // Will be updated by feedback
    timestamp: new Date().toISOString(),
    messageSnippet: userMessage?.slice(0, 100),
  });

  // Keep only last 50
  if (data.recentFusions.length > 50) {
    data.recentFusions = data.recentFusions.slice(-50);
  }

  data.stats.totalFusions++;
  saveFusionData(data);

  console.log(`[ArchetypeFusion] Recorded: ${archetypes.join(" + ")}`);
}

/**
 * Record positive feedback — the blend worked
 * Signals: conversation deepens, user says "yes", "good", "exactly", no pushback
 * @param {string[]} archetypes - The archetypes that were used
 */
export async function reinforceBlend(archetypes) {
  if (!archetypes || archetypes.length < 2) return;

  const data = loadFusionData();
  const key = archetypes.sort().join("+");

  // Find or create crystallized blend
  let blend = data.crystallizedBlends.find(
    (b) => b.archetypes.sort().join("+") === key
  );

  if (!blend) {
    blend = {
      archetypes: archetypes.slice(0, 3),
      weight: 0.1,
      topicPatterns: [],
      successCount: 0,
      lastUsed: new Date().toISOString(),
    };
    data.crystallizedBlends.push(blend);
  }

  // Reinforce
  blend.successCount++;
  blend.weight = Math.min(1.0, blend.weight + 0.1); // Cap at 1.0
  blend.lastUsed = new Date().toISOString();

  // Update recent fusion feedback
  const recent = data.recentFusions.find(
    (f) => f.archetypes.sort().join("+") === key && f.feedback === "neutral"
  );
  if (recent) {
    recent.feedback = "positive";
  }

  // Update default voice weights
  for (const arch of archetypes) {
    data.defaultVoice.weights[arch] =
      (data.defaultVoice.weights[arch] || 0) + 0.05;
  }
  data.defaultVoice.lastUpdated = new Date().toISOString();

  data.stats.positiveReinforcements++;
  saveFusionData(data);

  console.log(
    `[ArchetypeFusion] Reinforced: ${archetypes.join(
      " + "
    )} (weight: ${blend.weight.toFixed(2)})`
  );
}

/**
 * Record negative feedback — the blend didn't work
 * Signals: user pushback, "no", correction, frustration
 * @param {string[]} archetypes - The archetypes that were used
 */
export function penalizeBlend(archetypes) {
  if (!archetypes || archetypes.length < 2) return;

  const data = loadFusionData();
  const key = archetypes.sort().join("+");

  // Find crystallized blend
  const blend = data.crystallizedBlends.find(
    (b) => b.archetypes.sort().join("+") === key
  );

  if (blend) {
    blend.weight = Math.max(0, blend.weight - 0.15); // Penalize harder than reinforce
  }

  // Update recent fusion feedback
  const recent = data.recentFusions.find(
    (f) => f.archetypes.sort().join("+") === key && f.feedback === "neutral"
  );
  if (recent) {
    recent.feedback = "negative";
  }

  // Reduce default voice weights
  for (const arch of archetypes) {
    if (data.defaultVoice.weights[arch]) {
      data.defaultVoice.weights[arch] = Math.max(
        0,
        data.defaultVoice.weights[arch] - 0.03
      );
    }
  }

  data.stats.negativeSignals++;
  saveFusionData(data);

  console.log(`[ArchetypeFusion] Penalized: ${archetypes.join(" + ")}`);
}

// ============================================================
// FUSION RECOMMENDATIONS
// ============================================================

/**
 * Get recommended archetype blend for a given context
 * @param {string} primaryArchetype - The archetype selected by semantic router
 * @param {string} topic - Current topic/intent
 * @returns {object} - { archetypes: string[], weights: number[], source: string }
 */
export function getRecommendedBlend(primaryArchetype, topic) {
  const data = loadFusionData();

  // Check crystallized blends that include the primary archetype
  const relevantBlends = data.crystallizedBlends
    .filter((b) => b.archetypes.includes(primaryArchetype) && b.weight > 0.3)
    .sort((a, b) => b.weight - a.weight);

  if (relevantBlends.length > 0) {
    const best = relevantBlends[0];
    console.log(
      `[ArchetypeFusion] Using crystallized blend: ${best.archetypes.join(
        " + "
      )} (weight: ${best.weight.toFixed(2)})`
    );
    return {
      archetypes: best.archetypes,
      weights: best.archetypes.map(() => best.weight / best.archetypes.length),
      source: "crystallized",
    };
  }

  // Fall back to default voice weights + primary
  const defaultWeights = data.defaultVoice.weights;
  const topArchetypes = Object.entries(defaultWeights)
    .filter(([name]) => name !== primaryArchetype)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([name]) => name);

  if (topArchetypes.length > 0) {
    const blend = [primaryArchetype, ...topArchetypes];
    console.log(
      `[ArchetypeFusion] Using default voice blend: ${blend.join(" + ")}`
    );
    return {
      archetypes: blend,
      weights: blend.map((a) => defaultWeights[a] || 0.3),
      source: "defaultVoice",
    };
  }

  // No fusion data yet — return primary only
  return {
    archetypes: [primaryArchetype],
    weights: [1.0],
    source: "single",
  };
}

/**
 * Get the current "default voice" — the emergent personality
 * @returns {object} - Weighted archetype combination
 */
export function getDefaultVoice() {
  const data = loadFusionData();
  return data.defaultVoice;
}

/**
 * Get fusion statistics for diagnostics
 */
export function getFusionStats() {
  const data = loadFusionData();
  return {
    crystallizedBlends: data.crystallizedBlends.length,
    topBlends: data.crystallizedBlends
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
      .map((b) => ({ archetypes: b.archetypes.join(" + "), weight: b.weight })),
    defaultVoice: Object.entries(data.defaultVoice.weights)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5),
    stats: data.stats,
  };
}

// ============================================================
// FEEDBACK DETECTION
// Analyze user messages for implicit feedback signals
// ============================================================

const POSITIVE_SIGNALS = [
  /\b(yes|yeah|exactly|precisely|good|nice|that's? (it|right|true))\b/i,
  /\b(I (agree|like|love) (that|this))\b/i,
  /\b(makes sense|fair point|true)\b/i,
  /\b(damn|wow|whoa)\b/i, // Surprise/impact (removed "shit" - too ambiguous)
  /^(yes|yeah|true|exactly)[.!]?$/i, // Short affirmations
  /\b(that('s| is) (helpful|insightful|what I (needed|meant)))\b/i,
  /\b(you (get|got|understand) (it|me|this))\b/i,
];

const NEGATIVE_SIGNALS = [
  /\b(no|nope|wrong|not (quite|really|what))\b/i,
  /\b(stop|don't|quit|enough)\b/i,
  /\b(miss(ed|ing) the (point|plot)|off track|tangent)\b/i,
  /\b(same (argument|thing)|stuck|loop|repetitive)\b/i,
  /\b(basic|shallow|surface|generic)\b/i,
  // Frustration signals — Pablo's actual feedback patterns
  /\b(dumbass|dick|idiot|asshole|stupid)\b/i,
  /\b(what( the)? (hell|fuck)|wtf)\b/i,
  /\b(you('re| are) (not|being) (helpful|listening|getting))\b/i,
  /\b(turning.*(on me|this around))\b/i,
  /\b(less (engaging|helpful|intelligent|wise))\b/i,
  /\b(dodg(ing|ed)|deflect(ing|ed)|avoid(ing|ed))\b/i,
  /\b(wait a minute|hold on|that's not)\b/i,
];

/**
 * Detect implicit feedback from user message
 * @param {string} message - User's response
 * @returns {"positive" | "negative" | "neutral"}
 */
export function detectFeedback(message) {
  const lower = message.toLowerCase();

  for (const pattern of POSITIVE_SIGNALS) {
    if (pattern.test(lower)) {
      return "positive";
    }
  }

  for (const pattern of NEGATIVE_SIGNALS) {
    if (pattern.test(lower)) {
      return "negative";
    }
  }

  return "neutral";
}

/**
 * Process feedback and update fusion data
 * @param {string} userMessage - The user's message
 * @param {string[]} lastArchetypes - Archetypes used in last response
 */
export function processFeedback(userMessage, lastArchetypes) {
  const feedback = detectFeedback(userMessage);

  if (feedback === "positive") {
    reinforceBlend(lastArchetypes);
  } else if (feedback === "negative") {
    penalizeBlend(lastArchetypes);
  }

  return feedback;
}

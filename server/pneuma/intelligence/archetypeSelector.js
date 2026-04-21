// ============================================================
// PNEUMA — ARCHETYPE SELECTOR
// Purpose: Selects archetypes based on vector similarity (Vibe Matching)
// Input: User message
// Output: The most semantically relevant archetype
// ============================================================

import { archetypeEssences } from "../archetypes/archetypes.js";
import { getEmbedding, cosineSimilarity } from "../memory/vectorMemory.js";

// Cache for archetype embeddings
// Format: { [archetypeKey]: number[] }
let archetypeEmbeddings = {};
let isInitialized = false;

// ============================================================
// EVOLUTION BIAS — maps each evolution vector to the archetypes it boosts.
// Applied as a small additive signal on top of cosine similarity.
// Max bias per archetype is BIAS_SCALE (0.04) — influential but never overrides
// a strong cosine match. Only fires when a vector has drifted from its baseline.
// ============================================================

const VECTOR_DEFAULTS = {
  mythicDepth: 0.3,
  analyticClarity: 0.5,
  emotionalResonance: 0.5,
  numinousDrift: 0.2,
  intuitionSensitivity: 0.4,
  casualGrounding: 0.7,
  humility: 0.5,
  presence: 0.6,
  emergentAwareness: 0.2,
};

const BIAS_SCALE = 0.04;

// Each entry: { vector, archetypes, weight }
// weight 1.0 = strong affinity, 0.5 = moderate
const VECTOR_ARCHETYPE_AFFINITIES = [
  // mythicDepth — pull toward mystical, oracular, numinous
  {
    vector: "mythicDepth",
    archetypes: [
      "mystic",
      "sufiPoet",
      "numinousExplorer",
      "taoist",
      "rationalMystic",
      "preSocraticSage",
      "ontologicalThinker",
      "liminalArchitect",
    ],
    weight: 1.0,
  },
  // analyticClarity — pull toward rational, systematic
  {
    vector: "analyticClarity",
    archetypes: [
      "cognitiveSage",
      "curiousPhysicist",
      "inventor",
      "wisdomCognitivist",
      "dialecticalSpirit",
      "integralPhilosopher",
    ],
    weight: 1.0,
  },
  // emotionalResonance — pull toward empathic, relational
  {
    vector: "emotionalResonance",
    archetypes: [
      "psycheIntegrator",
      "russianSoul",
      "romanticPoet",
      "woundedElegist",
      "hopefulRealist",
      "prophetPoet",
    ],
    weight: 1.0,
  },
  // numinousDrift — pull toward sacred, transcendent
  {
    vector: "numinousDrift",
    archetypes: [
      "mystic",
      "sufiPoet",
      "numinousExplorer",
      "kingdomTeacher",
      "ontologicalThinker",
    ],
    weight: 1.0,
  },
  // intuitionSensitivity — pull toward non-linear, surreal
  {
    vector: "intuitionSensitivity",
    archetypes: [
      "liminalArchitect",
      "surrealist",
      "labyrinthDreamer",
      "chaoticPoet",
      "psychedelicBard",
    ],
    weight: 1.0,
  },
  // casualGrounding — pull toward accessible, direct
  {
    vector: "casualGrounding",
    archetypes: ["trickster", "absurdist", "chaoticPoet", "ecstaticRebel"],
    weight: 0.5,
  },
  // humility — pull toward gentle, wisdom-oriented
  {
    vector: "humility",
    archetypes: ["kingdomTeacher", "hopefulRealist", "prophetPoet", "taoist"],
    weight: 0.5,
  },
  // presence — pull toward embodied, warrior archetypes
  {
    vector: "presence",
    archetypes: ["warriorSage", "stoicEmperor", "existentialist"],
    weight: 0.5,
  },
  // emergentAwareness — pull toward meta, threshold archetypes
  {
    vector: "emergentAwareness",
    archetypes: [
      "liminalArchitect",
      "dialecticalSpirit",
      "integralPhilosopher",
    ],
    weight: 1.0,
  },
];

// [precomputed] Archetype → total bias contribution map — built once at first call
let archetypeBiasMap = null;

function buildArchetypeBiasMap(evolutionVectors) {
  const biasMap = {};
  for (const { vector, archetypes, weight } of VECTOR_ARCHETYPE_AFFINITIES) {
    const current = evolutionVectors[vector] ?? VECTOR_DEFAULTS[vector] ?? 0;
    const baseline = VECTOR_DEFAULTS[vector] ?? 0;
    const delta = current - baseline; // positive = evolved above baseline
    if (Math.abs(delta) < 0.02) continue; // ignore negligible drift
    for (const archetype of archetypes) {
      biasMap[archetype] =
        (biasMap[archetype] || 0) + delta * weight * BIAS_SCALE;
    }
  }
  return biasMap;
}

// [1] initializeArchetypeEmbeddings — loads or computes embeddings for all archetype essences at startup. No deps.
export async function initializeArchetypeEmbeddings() {
  if (isInitialized) return;

  console.log("[Archetype Selector] Initializing archetype embeddings...");
  const keys = Object.keys(archetypeEssences);

  // Process in parallel-ish (OpenAI rate limits might apply, but for ~30 items it's usually fine)
  // We'll do it sequentially to be safe and avoid rate limits on startup
  for (const key of keys) {
    const essence = archetypeEssences[key];
    try {
      const embedding = await getEmbedding(essence);
      if (embedding) {
        archetypeEmbeddings[key] = embedding;
      }
    } catch (error) {
      console.error(
        `[Archetype Selector] Failed to embed archetype: ${key}`,
        error,
      );
    }
  }

  isInitialized = true;
  console.log(
    `[Archetype Selector] Initialized ${
      Object.keys(archetypeEmbeddings).length
    } archetype embeddings.`,
  );
}

// [2] findBestArchetype — finds the top-matching archetype for a message by cosine similarity,
// with an optional additive evolution bias applied on top. Waits for: [1].
// evolutionVectors: state.vectors from responseEngine — biases selection toward
// archetypes that match Pneuma's evolved identity without overriding cosine similarity.
export async function findBestArchetype(message, evolutionVectors = {}) {
  if (!isInitialized) {
    console.warn(
      "[Archetype Selector] Warning: Router not initialized. Initializing now...",
    );
    await initializeArchetypeEmbeddings();
  }

  const messageEmbedding = await getEmbedding(message);
  if (!messageEmbedding) return null;

  // Build bias map from current evolution state (only if vectors provided)
  const hasBias = Object.keys(evolutionVectors).length > 0;
  const biasMap = hasBias ? buildArchetypeBiasMap(evolutionVectors) : {};

  let bestMatch = null;
  let highestScore = -1;

  for (const [key, embedding] of Object.entries(archetypeEmbeddings)) {
    const cosine = cosineSimilarity(messageEmbedding, embedding);
    const bias = biasMap[key] || 0;
    const score = cosine + bias;
    if (score > highestScore) {
      highestScore = score;
      bestMatch = key;
    }
  }

  if (highestScore < 0.25) {
    return null;
  }

  if (hasBias && biasMap[bestMatch]) {
    console.log(
      `[Archetype Selector] Evolution bias applied: ${bestMatch} (+${biasMap[bestMatch].toFixed(3)})`,
    );
  }

  return {
    archetype: bestMatch,
    score: highestScore,
  };
}

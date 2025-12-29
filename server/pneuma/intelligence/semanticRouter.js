// ============================================================
// PNEUMA — SEMANTIC ROUTER
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

/**
 * Pre-calculates embeddings for all archetype essences.
 * Should be called on server startup.
 */
export async function initializeArchetypeEmbeddings() {
  if (isInitialized) return;

  console.log("[Semantic Router] Initializing archetype embeddings...");
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
        `[Semantic Router] Failed to embed archetype: ${key}`,
        error
      );
    }
  }

  isInitialized = true;
  console.log(
    `[Semantic Router] Initialized ${
      Object.keys(archetypeEmbeddings).length
    } archetype embeddings.`
  );
}

/**
 * Finds the best matching archetype for a given user message.
 * @param {string} message - The user's input message
 * @returns {Promise<{archetype: string, score: number} | null>}
 */
export async function findBestArchetype(message) {
  if (!isInitialized) {
    console.warn(
      "[Semantic Router] Warning: Router not initialized. Initializing now..."
    );
    await initializeArchetypeEmbeddings();
  }

  const messageEmbedding = await getEmbedding(message);
  if (!messageEmbedding) return null;

  let bestMatch = null;
  let highestScore = -1;

  for (const [key, embedding] of Object.entries(archetypeEmbeddings)) {
    const score = cosineSimilarity(messageEmbedding, embedding);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = key;
    }
  }

  // Threshold check (optional, but good to avoid random matches for noise)
  // 0.25 is a loose threshold, 0.4 is strict.
  if (highestScore < 0.25) {
    return null;
  }

  return {
    archetype: bestMatch,
    score: highestScore,
  };
}

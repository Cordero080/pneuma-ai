// ============================================================
// PNEUMA — VECTOR MEMORY SYSTEM
// Purpose: Semantic memory using MongoDB + OpenAI Embeddings
// Input: User messages, Pneuma responses
// Output: Relevant past context based on semantic similarity
// ============================================================

import { OpenAI } from "openai";
import fs from "fs";
import { VECTOR_MEMORY_FILE, ensureDataDirectory } from "../../config/paths.js";
import { getDB } from "../../db.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const COLLECTION = "vectorMemory";

ensureDataDirectory();

// One-time migration: seed from existing JSON file if collection is empty
async function migrateFromJSON() {
  try {
    const db = await getDB();
    const count = await db.collection(COLLECTION).countDocuments();
    if (count > 0) return; // Already migrated

    if (!fs.existsSync(VECTOR_MEMORY_FILE)) return;

    const existing = JSON.parse(fs.readFileSync(VECTOR_MEMORY_FILE, "utf8"));
    if (!existing.length) return;

    await db.collection(COLLECTION).insertMany(existing);
    console.log(
      `[VectorMemory] Migrated ${existing.length} memories from JSON to MongoDB`
    );
  } catch (err) {
    console.warn("[VectorMemory] Migration skipped:", err.message);
  }
}

migrateFromJSON();

/**
 * Generates an embedding vector for a given text using OpenAI.
 */
export async function getEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Embedding error:", error.message);
    return null;
  }
}

/**
 * Cosine similarity — kept for brute-force fallback before index is created.
 */
export function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Saves a memory to MongoDB.
 */
export async function saveMemory(text, metadata = {}) {
  if (!text || text.length < 10) return;

  const embedding = await getEmbedding(text);
  if (!embedding) return;

  try {
    const db = await getDB();
    await db.collection(COLLECTION).insertOne({
      id: Date.now().toString(),
      text,
      embedding,
      metadata: { ...metadata, timestamp: Date.now() },
    });
    console.log(`[VectorMemory] Saved: "${text.substring(0, 30)}..."`);
  } catch (err) {
    console.error("[VectorMemory] Save failed:", err.message);
  }
}

/**
 * Retrieves relevant memories using Atlas Vector Search.
 * Falls back to brute-force cosine similarity until the index is created.
 */
export async function retrieveMemories(query, limit = 5) {
  const queryEmbedding = await getEmbedding(query);
  if (!queryEmbedding) return [];

  try {
    const db = await getDB();

    const results = await db
      .collection(COLLECTION)
      .aggregate([
        {
          $vectorSearch: {
            index: "vectorIndex",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: limit * 10,
            limit,
          },
        },
        {
          $project: {
            text: 1,
            metadata: 1,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ])
      .toArray();

    return results
      .filter((r) => r.score > 0.35)
      .map((r) => ({
        text: r.text,
        score: r.score,
        timestamp: r.metadata?.timestamp,
      }));
  } catch (err) {
    // Index not created yet in Atlas UI — brute-force fallback
    console.warn(
      "[VectorMemory] Vector index not ready, using brute-force fallback"
    );
    return await bruteForceRetrieve(queryEmbedding, limit);
  }
}

/**
 * Brute-force fallback: fetches all docs and computes cosine in JS.
 * Used until Atlas vector index is created.
 */
async function bruteForceRetrieve(queryEmbedding, limit) {
  try {
    const db = await getDB();
    const docs = await db
      .collection(COLLECTION)
      .find({}, { projection: { text: 1, embedding: 1, metadata: 1 } })
      .toArray();

    return docs
      .map((doc) => ({
        text: doc.text,
        score: cosineSimilarity(queryEmbedding, doc.embedding),
        timestamp: doc.metadata?.timestamp,
      }))
      .filter((r) => r.score > 0.35)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (err) {
    console.error("[VectorMemory] Brute-force fallback failed:", err.message);
    return [];
  }
}

/**
 * Returns memory count from MongoDB.
 */
export async function getMemoryStats() {
  try {
    const db = await getDB();
    const count = await db.collection(COLLECTION).countDocuments();
    return { count, threshold: 500, isOverloaded: count > 500 };
  } catch {
    return { count: 0, threshold: 500, isOverloaded: false };
  }
}

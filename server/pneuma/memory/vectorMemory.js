// FILE ROLE: Semantic long-term memory — embeds text interactions via OpenAI and stores or retrieves them from MongoDB Atlas using vector search, enabling Pneuma to surface thematically relevant past exchanges.

import { OpenAI } from "openai";
import fs from "fs";
import { VECTOR_MEMORY_FILE, ensureDataDirectory } from "../../config/paths.js";
import { getDB } from "../../db.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const COLLECTION = "vectorMemory";

ensureDataDirectory();

// ROLE: One-time migration of legacy JSON vector memories into MongoDB
// INPUT FROM: module load (called once at startup)
// OUTPUT TO: MongoDB vectorMemory collection via insertMany()
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
      `[VectorMemory] Migrated ${existing.length} memories from JSON to MongoDB`,
    );
  } catch (err) {
    console.warn("[VectorMemory] Migration skipped:", err.message);
  }
}

migrateFromJSON();

// ROLE: Converts text into an embedding vector for semantic search
// INPUT FROM: saveEmbedding(), retrieveMemories()
// OUTPUT TO: MongoDB insertOne() or $vectorSearch aggregation
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

// ROLE: Computes cosine similarity between two embedding vectors for brute-force fallback
// INPUT FROM: bruteForceRetrieve()
// OUTPUT TO: bruteForceRetrieve() as the similarity score for ranking
export function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// ROLE: Embeds a text string and saves it with metadata to MongoDB
// INPUT FROM: getLLMContent() in llm.js (fire-and-forget after each response)
// OUTPUT TO: MongoDB vectorMemory collection via insertOne()
export async function saveEmbedding(text, metadata = {}) {
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

// ROLE: Retrieves the top semantically similar memories for a query
// INPUT FROM: getLLMContent() in llm.js for RAG context injection
// OUTPUT TO: getLLMContent() as context.relevantMemories; falls back to bruteForceRetrieve()
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
      "[VectorMemory] Vector index not ready, using brute-force fallback",
    );
    return await bruteForceRetrieve(queryEmbedding, limit);
  }
}

// ROLE: Brute-force fallback — fetches all documents and ranks by cosine similarity
// INPUT FROM: retrieveMemories() when Atlas vector index is unavailable
// OUTPUT TO: retrieveMemories() as the fallback results array
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

// ROLE: Returns the total document count and overload status from the vectorMemory collection
// INPUT FROM: getLLMContent() in llm.js for context-window planning
// OUTPUT TO: caller as { count, threshold, isOverloaded }
export async function getMemoryStats() {
  try {
    const db = await getDB();
    const count = await db.collection(COLLECTION).countDocuments();
    return { count, threshold: 500, isOverloaded: count > 500 };
  } catch {
    return { count: 0, threshold: 500, isOverloaded: false };
  }
}

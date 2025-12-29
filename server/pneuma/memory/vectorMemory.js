// ============================================================
// PNEUMA — VECTOR MEMORY SYSTEM
// Purpose: Long-term semantic memory using ChromaDB + OpenAI Embeddings
// Input: User messages, Pneuma responses
// Output: Relevant past context based on semantic similarity
// ============================================================

import { OpenAI } from "openai";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI for embeddings
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize ChromaDB client (expects local server running or embedded)
// For Node.js, we might need to run the chroma docker container or use a simpler local vector store if docker isn't an option.
// Since we want to keep it simple and local without Docker for now,
// we will use a lightweight in-memory vector store pattern if Chroma isn't running,
// BUT for this implementation, we'll assume we want to use the 'chromadb' package we just installed.
// NOTE: The JS 'chromadb' package is a CLIENT. It needs a Chroma server running.
// If you don't have Docker, we should switch to a pure-JS local vector store like 'vector-storage' or 'hnswlib-node'.
//
// LET'S PIVOT TO A PURE JS SOLUTION TO AVOID DOCKER REQUIREMENT:
// We will use a simple JSON-based vector store for now to get started immediately without infrastructure.
// It's not as scalable as Chroma, but it works for a single user perfectly.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMORY_FILE = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "vector_memory.json"
);

// Ensure data directory exists
const dataDir = path.dirname(MEMORY_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Load memory from disk
let memoryStore = [];
if (fs.existsSync(MEMORY_FILE)) {
  try {
    memoryStore = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
  } catch (e) {
    console.error("Failed to load vector memory:", e);
    memoryStore = [];
  }
}

/**
 * Generates an embedding vector for a given text using OpenAI.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export async function getEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small", // Cheap, fast, good enough
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Embedding error:", error.message);
    return null;
  }
}

/**
 * Calculates cosine similarity between two vectors.
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} - Similarity score (-1 to 1)
 */
export function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Saves a memory to the vector store.
 
 */
export async function saveMemory(text, metadata = {}) {
  if (!text || text.length < 10) return; // Skip short noise

  const embedding = await getEmbedding(text);
  if (!embedding) return;

  const memory = {
    id: Date.now().toString(),
    text,
    embedding,
    metadata: {
      ...metadata,
      timestamp: Date.now(),
    },
  };

  memoryStore.push(memory);

  // Persist to disk (simple append-like behavior for now)
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memoryStore, null, 2));
  console.log(`[Memory] Saved: "${text.substring(0, 30)}..."`);
}

/**
 * Retrieves relevant memories for a given query.
 
 */
export async function retrieveMemories(query, limit = 3) {
  const queryEmbedding = await getEmbedding(query);
  if (!queryEmbedding) return [];

  // Calculate similarity for all memories
  const scoredMemories = memoryStore.map((mem) => ({
    ...mem,
    score: cosineSimilarity(queryEmbedding, mem.embedding),
  }));

  // Sort by score (descending) and filter by threshold
  const relevant = scoredMemories
    .filter((mem) => mem.score > 0.4) // Similarity threshold (0.4 is a decent starting point)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return relevant.map((r) => ({
    text: r.text,
    score: r.score,
    timestamp: r.metadata.timestamp,
  }));
}

/**
 * Checks the health of the memory system.
 * Returns stats and a warning if it's time to upgrade to a DB.
 */
export function getMemoryStats() {
  const count = memoryStore.length;
  // Threshold: 500 memories is a good point to start thinking about a DB
  // (JSON parsing gets slower, file gets bigger)
  const threshold = 500;

  return {
    count,
    threshold,
    isOverloaded: count > threshold,
  };
}

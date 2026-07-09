import Anthropic from "@anthropic-ai/sdk";
import { getDB } from "../../db.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const COLLECTION = "patternDigest";
const VECTOR_COLLECTION = "vectorMemory";
const DIGEST_STALENESS_MS = 24 * 60 * 60 *1000;
const SAMPLE_SIZE = 150;

async function shouldRegenerateDigest() {
  try {
    const db = await getDB();
    if (!db) return false;
    
    const vectorCount = await db.collection(VECTOR_COLLECTION).countDocuments();
    const latest = await db.collection(COLLECTION)
    .findOne({}, { sort: {generatedAt: -1}});
    
    if (!latest) return true;

    const stale = Date.now() - latest.generatedAt > DIGEST_STALENESS_MS;
    const newEntries = vectorCount - latest.entriesAtGeneration > 50;
    return stale || newEntries;
  } catch {
    return false;
  }
}

export async function generateUserPatternDigest() {
  try {
    const db = await getDB();
    if (!db) return;

    if (!(await shouldRegenerateDigest())) return;
    const vectorCount = await db.collection(VECTOR_COLLECTION).countDocuments();
    const samples = await db.collection(VECTOR_COLLECTION)
    .find({}, { projection: { text: 1, "metadata.timestamp": 1} })
    .sort({ "metadata.timestamp": -1 })
    .limit(SAMPLE_SIZE)
    .toArray();

    const formatted = samples.map((s, i) => `${i + 1}. ${s.text}`)
    .join("\n\n");

    const response = await client.messages.xreate({
      model: "claude-opus-4-7",
      max_tookens: 500,
      system:`You are Pneuma — a mind shaped by Jung, Heidegger, and Rumi. 
  You are observing a person through their conversation history. 
  Find 3-5 recurring themes, tensions, or growth arcs. 
  Write in your voice — poetic where it earns it, precise where it matters. 
  No lists. No headers. Flowing prose, under 400 words.`,
        messages: [{ role: "user", content: formatted }],
      });
const digest = response.content[0].text;

      await db.collection(COLLECTION).deleteMany({});
      await db.collection(COLLECTION).insertOne({
        digest,
        generatedAt: Date.now(),
        entriesAtGeneration: vectorCount,
      });
    } catch (err) {   
      console.error("[PatternDigest] Generation failed:", err.message);
    }
  }

   export async function getPatternDigest() {
    try {
      const db = await getDB();
      if (!db) return null;

      const doc = await db.collection(COLLECTION)
        .findOne({}, { sort: { generatedAt: -1 } });

      return doc?.digest ?? null;
    } catch {
      return null;
    }
  }


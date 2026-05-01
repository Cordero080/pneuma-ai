// FILE ROLE: Persistent image description store — saves Pneuma's description of user-shared images
// to MongoDB (with JSON fallback), keyed by conversationId. On follow-up turns, the description
// is injected into the system prompt so Pneuma never forgets what it saw.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getDB } from "../../db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FALLBACK_FILE = path.join(__dirname, "../../../data/image_memory.json");
const COLLECTION = "imageMemory";

// ── helpers ────────────────────────────────────────────────────────────────

function readFallback() {
  try {
    if (fs.existsSync(FALLBACK_FILE)) {
      return JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf8"));
    }
  } catch {}
  return {};
}

function writeFallback(data) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("[ImageMemory] File fallback write failed:", err.message);
  }
}

// ── public API ────────────────────────────────────────────────────────────

/**
 * Save Pneuma's description of an image attached to a message.
 * @param {string} conversationId  - session / conversation ID
 * @param {string} description     - Pneuma's full response text for that image turn
 * @param {string} userCaption     - the user's text accompanying the image (may be "")
 */
export async function saveImageDescription(
  conversationId,
  description,
  userCaption = "",
) {
  const record = {
    conversationId,
    description,
    userCaption,
    savedAt: new Date().toISOString(),
  };

  try {
    const db = await getDB();
    if (db) {
      await db
        .collection(COLLECTION)
        .replaceOne({ conversationId }, record, { upsert: true });
      return;
    }
  } catch (err) {
    console.warn(
      "[ImageMemory] MongoDB save failed, using file fallback:",
      err.message,
    );
  }

  // JSON fallback
  const data = readFallback();
  data[conversationId] = record;
  writeFallback(data);
}

/**
 * Load the most recent image description for a conversation.
 * Returns null if none exists.
 * @param {string} conversationId
 * @returns {{ description: string, userCaption: string, savedAt: string } | null}
 */
export async function loadImageDescription(conversationId) {
  if (!conversationId) return null;

  try {
    const db = await getDB();
    if (db) {
      const doc = await db.collection(COLLECTION).findOne({ conversationId });
      if (doc) {
        const { _id, ...record } = doc;
        return record;
      }
      return null;
    }
  } catch (err) {
    console.warn(
      "[ImageMemory] MongoDB load failed, falling back to file:",
      err.message,
    );
  }

  // JSON fallback
  const data = readFallback();
  return data[conversationId] ?? null;
}

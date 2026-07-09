// One-time backfill: embeds conversations-backup.json exchanges into MongoDB vectorMemory.
// Covers Nov 30 – Dec 28 2025 — the period before MongoDB saving began.
// Run from repo root: node --env-file=server/.env scripts/backfill_embeddings.mjs
// Safe to re-run — skips exchanges whose timestamp already exists in MongoDB.

import { MongoClient } from "mongodb";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKUP_FILE = path.resolve(__dirname, "../data/conversations-backup-20251218-021033.json");
const COLLECTION = "vectorMemory";
const BATCH_DELAY_MS = 200; // stay under OpenAI rate limits

const mongoURI = process.env.MONGODB_URI;
const openaiKey = process.env.OPENAI_API_KEY;

if (!mongoURI) { console.error("MONGODB_URI not set"); process.exit(1); }
if (!openaiKey) { console.error("OPENAI_API_KEY not set"); process.exit(1); }

const openai = new OpenAI({ apiKey: openaiKey });
const client = new MongoClient(mongoURI);

async function embed(text) {
  const res = await openai.embeddings.create({ model: "text-embedding-3-small", input: text });
  return res.data[0].embedding;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  await client.connect();
  const db = client.db();
  const coll = db.collection(COLLECTION);

  // Load existing timestamps to skip duplicates
  const existing = await coll.distinct("metadata.timestamp");
  const existingSet = new Set(existing);
  console.log(`MongoDB has ${existingSet.size} existing entries.`);

  // Load backup
  const raw = JSON.parse(fs.readFileSync(BACKUP_FILE, "utf8"));
  const conversations = raw.conversations ?? raw;

  // Flatten all exchanges with their conversation timestamp
  const exchanges = [];
  for (const conv of conversations) {
    const base = new Date(conv.startedAt).getTime();
    for (let i = 0; i < (conv.exchanges ?? []).length; i++) {
      const ex = conv.exchanges[i];
      if (!ex.user || !ex.pneuma) continue;
      // Space exchanges 1 second apart within a conversation
      const timestamp = base + i * 1000;
      exchanges.push({ user: ex.user, pneuma: ex.pneuma, timestamp });
    }
  }

  console.log(`Backup has ${exchanges.length} exchanges total.`);

  const toEmbed = exchanges.filter(e => !existingSet.has(e.timestamp));
  console.log(`${toEmbed.length} need embedding. Starting...\n`);

  let done = 0;
  let failed = 0;

  for (const ex of toEmbed) {
    const text = `User: ${ex.user}\nPneuma: ${ex.pneuma}`;
    try {
      const embedding = await embed(text);
      await coll.insertOne({
        id: ex.timestamp.toString(),
        text,
        embedding,
        metadata: { timestamp: ex.timestamp, source: "backfill" },
      });
      done++;
      if (done % 50 === 0) console.log(`  ${done}/${toEmbed.length} embedded...`);
      await sleep(BATCH_DELAY_MS);
    } catch (err) {
      console.error(`  Failed at timestamp ${ex.timestamp}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${done} embedded, ${failed} failed.`);
  const total = await coll.countDocuments();
  console.log(`vectorMemory total: ${total}`);
  await client.close();
  process.exit(0);
}

run().catch(err => { console.error(err.message); process.exit(1); });

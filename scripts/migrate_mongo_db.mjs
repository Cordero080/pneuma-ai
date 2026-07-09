// One-time migration: copies all collections from skyrockit → pneuma on the same cluster.
// Run once from repo root: node --env-file=server/.env scripts/migrate_mongo_db.mjs
// Safe to re-run — skips documents that already exist in the target.

import { MongoClient } from "mongodb";

const URI_BASE = process.env.MONGODB_URI;
if (!URI_BASE) {
  console.error("MONGODB_URI not set");
  process.exit(1);
}

const SOURCE_DB = "skyrockit";
const TARGET_DB = "pneuma";

// Swap db name in URI to connect to source
const sourceURI = URI_BASE.replace(/\/pneuma\?/, `/${SOURCE_DB}?`);
const targetURI = URI_BASE; // already points to pneuma

const sourceClient = new MongoClient(sourceURI);
const targetClient = new MongoClient(targetURI);

async function migrate() {
  await sourceClient.connect();
  await targetClient.connect();
  console.log(`Connected. Migrating ${SOURCE_DB} → ${TARGET_DB}`);

  const sourceDb = sourceClient.db(SOURCE_DB);
  const targetDb = targetClient.db(TARGET_DB);

  const collections = await sourceDb.listCollections().toArray();
  console.log(`Collections to migrate: ${collections.map((c) => c.name).join(", ")}`);

  for (const { name } of collections) {
    const sourceColl = sourceDb.collection(name);
    const targetColl = targetDb.collection(name);

    const totalSource = await sourceColl.countDocuments();
    const totalTarget = await targetColl.countDocuments();

    if (totalTarget >= totalSource) {
      console.log(`  ${name}: already has ${totalTarget} docs, skipping`);
      continue;
    }

    const docs = await sourceColl.find({}).toArray();
    if (docs.length === 0) {
      console.log(`  ${name}: empty, skipping`);
      continue;
    }

    // Insert in batches of 500 to avoid Atlas request size limits
    let inserted = 0;
    for (let i = 0; i < docs.length; i += 500) {
      const batch = docs.slice(i, i + 500);
      try {
        const result = await targetColl.insertMany(batch, { ordered: false });
        inserted += result.insertedCount;
      } catch (err) {
        // ordered:false continues on duplicate key errors
        if (err.code !== 11000) throw err;
        inserted += err.result?.nInserted || 0;
      }
    }
    console.log(`  ${name}: migrated ${inserted}/${docs.length} docs`);
  }

  console.log("Migration complete.");
  await sourceClient.close();
  await targetClient.close();
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});

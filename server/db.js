// ------------------------------------------------------------
// PNEUMA — MongoDB connection singleton
// ------------------------------------------------------------

import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
let db = null;

export async function connectDB() {
  if (db) return db;
  await client.connect();
  db = client.db(); // database name comes from the connection string
  console.log("[DB] Connected to MongoDB");
  return db;
}

export async function getDB() {
  if (!db) await connectDB();
  return db;
}

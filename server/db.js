// ------------------------------------------------------------
// PNEUMA — MongoDB connection singleton
// ------------------------------------------------------------

import { MongoClient } from "mongodb";

let client = null;
let db = null;

export async function connectDB() {
  if (db) return db;
  if (!process.env.MONGODB_URI) {
    console.log("[DB] MONGODB_URI not set — running without MongoDB");
    return null;
  }
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db(); // database name comes from the connection string
  console.log("[DB] Connected to MongoDB");
  return db;
}

export async function getDB() {
  if (!db) await connectDB();
  return db;
}

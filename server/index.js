// ============================================================
// ORPHEUS — ENTRY POINT
// Layer: SERVER
// Purpose: Express server, receives messages, returns responses
// Flow: User → index.js → fusion.js → (all layers) → response
// ============================================================

// ------------------------- LOAD ENV FIRST --------------------------
import "dotenv/config"; // Loads .env before any other imports

// ------------------------- IMPORTS ---------------------------------
import express from "express";
import cors from "cors";
import { orpheusRespond } from "./orpheus/fusion.js";
// ^ Your Orpheus fusion engine

// ------------------------- APP CONFIG -------------------------------
const app = express();
const PORT = 3000;

app.use(cors()); // allow frontend → backend communication
app.use(express.json()); // parse JSON request bodies

// -------------------------- TEST ROUTE ------------------------------
// Quick test to confirm the backend is alive
app.get("/", (req, res) => {
  res.send("🐲 Orpheus AI backend is running. 🐲");
});

// -------------------------- CHAT ROUTE ------------------------------
// Accepts user message → generates Orpheus reply → returns it
// Now async to support LLM integration
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const { reply, monologue, mode } = await orpheusRespond(message);

    // Map mode to engine for frontend visualization
    const modeToEngine = {
      casual: null,
      oracular: "archetype",
      analytic: "reflection",
      intimate: "memory",
      shadow: "synthesis",
      diagnostic: "reflection",
      upgrade: "synthesis",
    };

    // Return reply + engine state for UI
    res.json({
      reply,
      engine: modeToEngine[mode] || null,
      mode,
    });
  } catch (error) {
    console.error("[Orpheus] Error processing message:", error.message);
    res.status(500).json({
      reply: "Something went sideways. Give me a moment.",
      engine: null,
      mode: "error",
    });
  }
});

// -------------------------- START SERVER ----------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

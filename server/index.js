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
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { orpheusRespond } from "./orpheus/fusion.js";
import { textToSpeech } from "./orpheus/tts.js";
// ^ Your Orpheus fusion engine + TTS

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------- APP CONFIG -------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow frontend → backend communication
app.use(express.json({ limit: "10mb" })); // parse JSON request bodies with larger limit

// -------------------------- TEST ROUTE ------------------------------
// Quick test to confirm the backend is alive
app.get("/", (req, res) => {
  res.send("🐲 Orpheus AI backend is running. 🐲");
});

// -------------------------- CONVERSATIONS ROUTE ---------------------
// Returns list of conversations for sidebar display
app.get("/conversations", async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "..", "data", "conversations.json");
    const data = await fs.readFile(dataPath, "utf-8");
    const { conversations } = JSON.parse(data);

    // Transform for sidebar: extract title from first exchange, format date
    const summaries = conversations.map((conv) => {
      const firstExchange = conv.exchanges?.[0];
      const title = firstExchange?.user?.slice(0, 50) || "Untitled";
      const date = new Date(conv.startedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      return {
        id: conv.id,
        title: title.replace(/^["']|["']$/g, "").trim(),
        date,
        messageCount: conv.messageCount || conv.exchanges?.length || 0,
      };
    });

    res.json({ conversations: summaries });
  } catch (error) {
    console.error("[Conversations] Error:", error.message);
    res.json({ conversations: [] });
  }
});

// -------------------------- GET SINGLE CONVERSATION ----------------
// Returns full exchanges for a specific conversation
app.get("/conversations/:id", async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "..", "data", "conversations.json");
    const data = await fs.readFile(dataPath, "utf-8");
    const { conversations } = JSON.parse(data);

    const conv = conversations.find((c) => c.id === req.params.id);
    if (!conv) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Transform exchanges to messages format for ChatBox
    const messages = conv.exchanges.flatMap((ex) => [
      { sender: "user", text: ex.user.replace(/^"|"$/g, "") },
      { sender: "ai", text: ex.orpheus },
    ]);

    res.json({ messages, id: conv.id });
  } catch (error) {
    console.error("[Conversation] Error:", error.message);
    res.status(500).json({ error: "Failed to load conversation" });
  }
});

// -------------------------- DELETE CONVERSATION --------------------
// Deletes a conversation by ID
app.delete("/conversations/:id", async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "..", "data", "conversations.json");
    const data = await fs.readFile(dataPath, "utf-8");
    const parsed = JSON.parse(data);

    const index = parsed.conversations.findIndex((c) => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Remove the conversation
    parsed.conversations.splice(index, 1);

    // Save back to file
    await fs.writeFile(dataPath, JSON.stringify(parsed, null, 2));

    console.log(`[Conversations] Deleted: ${req.params.id}`);
    res.json({ success: true, deleted: req.params.id });
  } catch (error) {
    console.error("[Conversations] Delete error:", error.message);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
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

// -------------------------- TTS ROUTE -------------------------------
// Converts text to speech using ElevenLabs
app.post("/tts", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "No text provided" });
    }

    const audio = await textToSpeech(text);

    if (!audio) {
      return res.status(500).json({ error: "TTS generation failed" });
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audio.length,
    });
    res.send(audio);
  } catch (error) {
    console.error("[TTS] Error:", error.message);
    res.status(500).json({ error: "TTS failed" });
  }
});

// -------------------------- START SERVER ----------------------------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

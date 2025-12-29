// ============================================================
// PNEUMA — ENTRY POINT
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
import { pneumaRespond } from "./pneuma/core/fusion.js";
import { textToSpeech } from "./pneuma/services/tts.js";
import { initializeArchetypeEmbeddings } from "./pneuma/intelligence/semanticRouter.js";
import {
  transcribeAudio,
  analyzeVoiceEmotion,
  analyzeTextEmotion,
  emotionToArchetypeBoost,
  combineEmotionSignals,
} from "./pneuma/input/emotionDetection.js";
import {
  startSession,
  boostActiveArchetypes,
  getMomentumStats,
} from "./pneuma/archetypes/archetypeMomentum.js";
import {
  getUndeliveredDreams,
  markDreamDelivered,
  formatDreamForDelivery,
  triggerDreaming,
} from "./pneuma/behavior/dreamMode.js";
// ^ Your Pneuma fusion engine + TTS + Voice + Emotion + Dreams

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------- APP CONFIG -------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // allow frontend → backend communication
app.use(express.json({ limit: "10mb" })); // parse JSON request bodies with larger limit
app.use(express.raw({ type: "audio/*", limit: "25mb" })); // for audio uploads

// Start session (archetype momentum decay)
startSession();

// -------------------------- TEST ROUTE ------------------------------
// Quick test to confirm the backend is alive
app.get("/", (req, res) => {
  res.send("🐲 Pneuma AI backend is running. 🐲");
});

// -------------------------- CONVERSATIONS ROUTE ---------------------
// Returns list of conversations for sidebar display
app.get("/conversations", async (req, res) => {
  try {
    const dataPath = path.join(__dirname, "..", "data", "conversations.json");
    const data = await fs.readFile(dataPath, "utf-8");
    const { conversations } = JSON.parse(data);

    // Transform for sidebar: extract title from first exchange, format date range
    const summaries = conversations.map((conv) => {
      const firstExchange = conv.exchanges?.[0];
      const title = firstExchange?.user?.slice(0, 50) || "Untitled";

      // Format date as range if spans multiple days
      const startDate = new Date(conv.startedAt);
      const endDate = conv.endedAt ? new Date(conv.endedAt) : new Date();

      const startMonth = startDate.toLocaleDateString("en-US", {
        month: "short",
      });
      const startDay = startDate.getDate();
      const endMonth = endDate.toLocaleDateString("en-US", { month: "short" });
      const endDay = endDate.getDate();

      let date;
      if (startDate.toDateString() === endDate.toDateString()) {
        // Same day
        date = `${startMonth} ${startDay}`;
      } else if (startMonth === endMonth) {
        // Same month, different days
        date = `${startMonth} ${startDay}-${endDay}`;
      } else {
        // Different months
        date = `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
      }

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
      {
        sender: "user",
        text: ex.user.replace(/^"|"$/g, ""),
        timestamp: ex.timestamp,
      },
      { sender: "ai", text: ex.pneuma || ex.orpheus, timestamp: ex.timestamp },
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
// Accepts user message → generates Pneuma reply → returns it
// Now async to support LLM integration
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const { reply, monologue, mode } = await pneumaRespond(message);

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
    console.error("[Pneuma] Error processing message:", error.message);
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

// -------------------------- VOICE INPUT ROUTE -----------------------
// Transcribes audio + detects emotion + sends to chat
app.post("/voice", async (req, res) => {
  try {
    const audioBuffer = req.body;

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ error: "No audio provided" });
    }

    console.log(`[Voice] Received ${audioBuffer.length} bytes of audio`);

    // 1. Transcribe audio with Whisper
    const transcription = await transcribeAudio(audioBuffer);

    if (!transcription.text) {
      return res.status(400).json({ error: "Could not transcribe audio" });
    }

    console.log(`[Voice] Transcribed: "${transcription.text}"`);

    // 2. Analyze emotion from voice (Hume AI) + text
    const voiceEmotions = await analyzeVoiceEmotion(audioBuffer);
    const combinedEmotions = combineEmotionSignals(
      transcription.text,
      voiceEmotions
    );

    // 3. Get archetype boosts from emotion
    const archetypeBoosts = emotionToArchetypeBoost(combinedEmotions);

    console.log(
      `[Voice] Emotion detected:`,
      Object.entries(combinedEmotions)
        .filter(([k, v]) => v > 0.3 && k !== "confidence")
        .map(([k, v]) => `${k}: ${v.toFixed(2)}`)
        .join(", ") || "neutral"
    );

    // 4. Send to Pneuma with emotion context
    const { reply, monologue, mode } = await pneumaRespond(transcription.text, {
      emotions: combinedEmotions,
      archetypeBoosts,
      inputType: "voice",
      language: transcription.language,
    });

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

    res.json({
      reply,
      transcription: transcription.text,
      emotions: combinedEmotions,
      engine: modeToEngine[mode] || null,
      mode,
      language: transcription.language,
    });
  } catch (error) {
    console.error("[Voice] Error:", error.message);
    res
      .status(500)
      .json({ error: "Voice processing failed", details: error.message });
  }
});

// -------------------------- DREAMS ROUTE ----------------------------
// Get any dreams Pneuma had while user was away
app.get("/dreams", async (req, res) => {
  try {
    const dreams = getUndeliveredDreams();

    if (dreams.length === 0) {
      return res.json({ dreams: [], message: null });
    }

    // Format the most recent dream for delivery
    const latestDream = dreams[0];
    const formatted = formatDreamForDelivery(latestDream);

    // Mark as delivered
    markDreamDelivered(latestDream.id);

    res.json({
      dreams: [latestDream],
      message: formatted,
    });
  } catch (error) {
    console.error("[Dreams] Error:", error.message);
    res.json({ dreams: [], message: null });
  }
});

// Trigger dreaming manually (for testing)
app.post("/dreams/trigger", async (req, res) => {
  try {
    const { count = 1 } = req.body;
    const dreams = await triggerDreaming(count);
    res.json({ success: true, dreams });
  } catch (error) {
    console.error("[Dreams] Trigger error:", error.message);
    res.status(500).json({ error: "Dream generation failed" });
  }
});

// -------------------------- MOMENTUM STATS ROUTE --------------------
// Get archetype momentum statistics
app.get("/momentum", (req, res) => {
  try {
    const stats = getMomentumStats();
    res.json(stats);
  } catch (error) {
    console.error("[Momentum] Error:", error.message);
    res.status(500).json({ error: "Could not get momentum stats" });
  }
});

// -------------------------- START SERVER ----------------------------
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // Initialize Semantic Router (load embeddings)
  await initializeArchetypeEmbeddings();
});

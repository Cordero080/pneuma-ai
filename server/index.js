// FILE ROLE: HTTP gateway — maps every inbound request to the correct Pneuma subsystem and shapes the raw reply into a JSON response for the frontend.

//index.js is the front door that receives every request, routes it to the right subsystem, and shapes the response for the frontend. It doesn't think — it dispatches.

// NOTE: index.js imports one thing that matters: pneumaRespond. It sends a message in, gets a reply back. It doesn't know or care how that reply was made.
// NOTE: env vars loaded via --env-file=.env flag in start command (Node 20.6+)

// ------------------------- IMPORTS ---------------------------------
import { randomUUID } from "crypto";
import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pneumaRespond } from "./pneuma/core/fusion.js";
import { connectDB } from "./db.js";
import { textToSpeech } from "./pneuma/services/tts.js";
import { initializeArchetypeEmbeddings } from "./pneuma/intelligence/archetypeSelector.js";
import { initializeArchetypeRAG } from "./pneuma/intelligence/archetypeRAG.js";
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
  triggerDialecticDream,
  triggerBaselineEvolution,
} from "./pneuma/behavior/dreamMode.js";
// ^ Your Pneuma fusion engine + TTS + Voice + Emotion + Dreams

// import.meta.url = "file:///Users/pablo/pneuma/server/index.js" ("file://" prefix gets chopped off by fileURLToPath)
// ^ raw URL format — not usable as a folder path yet

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
// ^ converts to: "/Users/pablo/pneuma/server/index.js"
const __dirname = path.dirname(__filename);
// ^ chops off the filename, gives you: "/Users/pablo/pneuma/server

// ------------------------- APP CONFIG -------------------------------
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // allow frontend → backend communication
app.use(express.json({ limit: "10mb" })); // parse JSON request bodies with larger limit
app.use(express.raw({ type: "audio/*", limit: "25mb" })); // for audio uploads

// Start session (archetype momentum decay)
startSession();

// Throttle for regular dream generation — once per 2 hours of conversation activity
let lastRegularDreamTime = 0;
const REGULAR_DREAM_INTERVAL = 2 * 60 * 60 * 1000;

// -------------------------- TEST ROUTE ------------------------------
// Quick test to confirm the backend is alive
app.get("/", (req, res) => {
  res.send("🐲 Pneuma AI backend is running. 🐲");
});

// -------------------------- CONVERSATIONS ROUTE ---------------------
// ROLE: Reads and shapes conversation list for sidebar display
// INPUT FROM: GET /conversations request from frontend
// OUTPUT TO: frontend as JSON array of { id, title, date, messageCount }
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
// ROLE: Loads and flattens a single conversation's exchanges into chat message format
// INPUT FROM: GET /conversations/:id request from frontend
// OUTPUT TO: frontend as JSON array of { sender, text, timestamp }
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
// ROLE: Removes a conversation by ID and persists the pruned list to disk
// INPUT FROM: DELETE /conversations/:id request from frontend
// OUTPUT TO: updated conversations.json; success/error JSON to frontend
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

// -------------------------- CHAT ROUTE (SSE STREAMING) -------------
// ROLE: Primary text conversation handler — streams response word-by-word via SSE
// INPUT FROM: POST /chat request from frontend with { message } body
// OUTPUT TO: SSE stream with { type: "chunk"|"done"|"reset"|"error", ... } events
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype.startsWith("image/")),
});

app.post("/chat", imageUpload.single("image"), async (req, res) => {
  const message = req.body?.message ?? "";
  const clientSessionId = req.body?.sessionId ?? undefined;
  // Client owns the sessionId — fall back to a server-generated UUID if missing.
  // The sessionId is what lets us scope per-session state (language, mode flags,
  // conversation) without module-level singletons bleeding across users.
  const sessionId = clientSessionId ?? randomUUID();
  // requestContext = the "backpack" — created fresh each request, carries all
  // per-request state so nothing has to live in module-level variables.
  const imageData = req.file
    ? {
        base64: req.file.buffer.toString("base64"),
        mediaType: req.file.mimetype,
      }
    : null;

  const requestContext = {
    sessionId,
    currentLanguage: "en", // default; processLanguage() updates this per message
    currentUser: null, // set by detectKnownUser() when a known user is identified
    diagnosticMode: false, // toggled by "enter diagnostics" / "exit diagnostics" commands
    directMode: false, // toggled by "drop the quotes" / "be yourself" commands
    lastUsedArchetypes: [], // prevents archetype repetition within one response
    imageData, // set when user attaches an image; consumed by llm.js for vision
    // currentLLMContent intentionally omitted — personality.js uses a synchronous
    // module-level bridge that is safe in Node.js (no concurrent hazard). See personality.js.
  };

  // Set SSE headers
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.flushHeaders();

  const modeToEngine = {
    casual: null,
    oracular: "archetype",
    analytic: "reflection",
    intimate: "memory",
    shadow: "synthesis",
    diagnostic: "reflection",
    upgrade: "synthesis",
  };

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    let chunked = false;
    const onChunk = (text) => {
      if (text === "\x00RESET") {
        sendEvent({ type: "reset" });
        chunked = false;
      } else {
        chunked = true;
        sendEvent({ type: "chunk", text });
      }
    };

    const { reply, mode } = await pneumaRespond(
      message,
      onChunk,
      requestContext,
    );

    // If nothing was streamed (LLM down, guard response, fallback), send the reply as a single chunk
    if (!chunked && reply) {
      sendEvent({ type: "chunk", text: reply });
    }

    // Send final metadata so frontend knows streaming is complete.
    // sessionId is included so the frontend can store it and send it back next request.
    sendEvent({
      type: "done",
      engine: modeToEngine[mode] || null,
      mode,
      sessionId,
    });

    res.end();

    // Fire-and-forget: run dialectic dream in background (throttled to 30min)
    triggerDialecticDream().catch((err) =>
      console.error("[Dream] Background dialectic failed:", err.message),
    );

    // Fire-and-forget: regular creative dreams (throttled to 2h)
    if (Date.now() - lastRegularDreamTime > REGULAR_DREAM_INTERVAL) {
      lastRegularDreamTime = Date.now();
      triggerDreaming(1).catch((err) =>
        console.error("[Dream] Background dream failed:", err.message),
      );
    }

    // Fire-and-forget: weekly baseline evolution from vector memory patterns
    triggerBaselineEvolution().catch((err) =>
      console.error("[Dream] Baseline evolution failed:", err.message),
    );
  } catch (error) {
    console.error("[Pneuma] Error processing message:", error.message);
    sendEvent({
      type: "error",
      reply: "Something went sideways. Give me a moment.",
      engine: null,
      mode: "error",
    });
    res.end();
  }
});

// -------------------------- TTS ROUTE -------------------------------
// ROLE: Converts text to speech and streams audio back to the client
// INPUT FROM: POST /tts request from frontend with { text } body
// OUTPUT TO: textToSpeech() in tts.js; returns audio/mpeg buffer to frontend
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
// NOTE: Voice route is fully implemented but not yet active in production.
// Requires Whisper (OpenAI) + Hume AI API keys to enable.
// Architecture is complete — enable when ready, no rewrite needed.
// ROLE: Transcribes audio, detects emotion, then routes to pneumaRespond like /chat
// INPUT FROM: POST /voice request from frontend with raw audio buffer
// OUTPUT TO: transcribeAudio(), analyzeVoiceEmotion(), pneumaRespond() in fusion.js; returns { reply, transcription, emotions, engine, mode, language } to frontend
app.post("/voice", async (req, res) => {
  // Voice body is a raw audio buffer — sessionId comes from a header instead.
  const sessionId = req.headers["x-session-id"] ?? randomUUID();
  const requestContext = {
    sessionId,
    currentLanguage: "en",
    currentUser: null,
    diagnosticMode: false,
    directMode: false,
    lastUsedArchetypes: [],
  };
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
      voiceEmotions,
    );

    // 3. Get archetype boosts from emotion
    const archetypeBoosts = emotionToArchetypeBoost(combinedEmotions);

    console.log(
      `[Voice] Emotion detected:`,
      Object.entries(combinedEmotions)
        .filter(([k, v]) => v > 0.3 && k !== "confidence")
        .map(([k, v]) => `${k}: ${v.toFixed(2)}`)
        .join(", ") || "neutral",
    );

    // 4. Send to Pneuma with emotion context
    const { reply, monologue, mode } = await pneumaRespond(
      transcription.text,
      {
        emotions: combinedEmotions,
        archetypeBoosts,
        inputType: "voice",
        language: transcription.language,
      },
      requestContext,
    );

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
      sessionId,
    });
  } catch (error) {
    console.error("[Voice] Error:", error.message);
    res
      .status(500)
      .json({ error: "Voice processing failed", details: error.message });
  }
});

// -------------------------- DREAMS ROUTE ----------------------------
// ROLE: Delivers the latest undelivered dream and marks it as delivered
// INPUT FROM: GET /dreams request from frontend
// OUTPUT TO: getUndeliveredDreams(), formatDreamForDelivery(), markDreamDelivered() in dreamMode.js; returns { dreams, message } to frontend
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
// ROLE: Exposes current archetype momentum state for inspection
// INPUT FROM: GET /momentum request from frontend
// OUTPUT TO: getMomentumStats() in archetypeMomentum.js; returns stats JSON to frontend
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
  // Connect to MongoDB (optional — system works on local JSON if unavailable)
  try {
    await connectDB();
  } catch (err) {
    console.warn(
      `[DB] MongoDB unavailable — falling back to local JSON. (${err.message})`,
    );
  }
  // Initialize Archetype Selector (load embeddings)
  await initializeArchetypeEmbeddings();
  // Initialize Archetype RAG (deep knowledge retrieval)
  await initializeArchetypeRAG();
});

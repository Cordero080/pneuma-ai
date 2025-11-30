// ------------------------------------------------------------
// ORPHEUS V2 — CONVERSATION HISTORY
// Persists full conversations for later review
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const historyPath = path.join(__dirname, "../../data/conversations.json");

// ============================================================
// DATA STRUCTURE
// ============================================================

const defaultHistory = {
  conversations: [],
  // Each conversation: {
  //   id: string (timestamp-based),
  //   startedAt: ISO string,
  //   endedAt: ISO string,
  //   messageCount: number,
  //   exchanges: [{ user, orpheus, timestamp }],
  //   summary: string (optional, for long convos),
  //   mood: string (overall mood of conversation),
  //   topics: string[] (detected topics)
  // }
};

// ============================================================
// IN-MEMORY STATE
// ============================================================

let currentConversation = null;
let lastActivityTime = null;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity = new session

// ============================================================
// LOAD / SAVE
// ============================================================

export function loadHistory() {
  try {
    if (fs.existsSync(historyPath)) {
      const raw = fs.readFileSync(historyPath, "utf8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(
      "[ConversationHistory] Failed to load, using default:",
      err.message
    );
  }
  return { ...defaultHistory };
}

export function saveHistory(history) {
  try {
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2), "utf8");
  } catch (err) {
    console.error("[ConversationHistory] Failed to save:", err.message);
  }
}

// ============================================================
// SESSION MANAGEMENT
// ============================================================

function isNewSession() {
  if (!lastActivityTime) return true;
  const elapsed = Date.now() - lastActivityTime;
  return elapsed > SESSION_TIMEOUT;
}

function generateConversationId() {
  return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function startOrContinueSession() {
  if (isNewSession() || !currentConversation) {
    // Save previous conversation if it exists
    if (currentConversation && currentConversation.exchanges.length > 0) {
      finalizeConversation();
    }

    // Start new conversation
    currentConversation = {
      id: generateConversationId(),
      startedAt: new Date().toISOString(),
      endedAt: null,
      messageCount: 0,
      exchanges: [],
      mood: null,
      topics: [],
    };
    console.log(
      `[ConversationHistory] New session started: ${currentConversation.id}`
    );
  }

  lastActivityTime = Date.now();
  return currentConversation;
}

// ============================================================
// RECORDING EXCHANGES
// ============================================================

export function recordExchange(userMessage, orpheusReply, metadata = {}) {
  startOrContinueSession();

  const exchange = {
    user: userMessage,
    orpheus: orpheusReply,
    timestamp: new Date().toISOString(),
    ...metadata, // Can include mood, mode, etc.
  };

  currentConversation.exchanges.push(exchange);
  currentConversation.messageCount++;
  lastActivityTime = Date.now();

  // Auto-save every 5 exchanges
  if (currentConversation.messageCount % 5 === 0) {
    saveCurrentConversation();
  }

  return exchange;
}

// ============================================================
// FINALIZING & SAVING
// ============================================================

function finalizeConversation() {
  if (!currentConversation || currentConversation.exchanges.length === 0) {
    return;
  }

  currentConversation.endedAt = new Date().toISOString();

  // Extract topics from conversation (simple keyword detection)
  currentConversation.topics = extractTopics(currentConversation.exchanges);

  // Determine overall mood
  currentConversation.mood = determineMood(currentConversation.exchanges);

  // Save to persistent storage
  const history = loadHistory();
  history.conversations.push(currentConversation);

  // Keep last 100 conversations (prevent unbounded growth)
  if (history.conversations.length > 100) {
    history.conversations = history.conversations.slice(-100);
  }

  saveHistory(history);
  console.log(
    `[ConversationHistory] Saved conversation ${currentConversation.id} (${currentConversation.messageCount} exchanges)`
  );

  currentConversation = null;
}

export function saveCurrentConversation() {
  if (!currentConversation || currentConversation.exchanges.length === 0) {
    return;
  }

  // Update endedAt for partial save
  const toSave = {
    ...currentConversation,
    endedAt: new Date().toISOString(),
    topics: extractTopics(currentConversation.exchanges),
    mood: determineMood(currentConversation.exchanges),
  };

  const history = loadHistory();

  // Find and update existing, or add new
  const existingIndex = history.conversations.findIndex(
    (c) => c.id === toSave.id
  );
  if (existingIndex >= 0) {
    history.conversations[existingIndex] = toSave;
  } else {
    history.conversations.push(toSave);
  }

  // Keep last 100 conversations
  if (history.conversations.length > 100) {
    history.conversations = history.conversations.slice(-100);
  }

  saveHistory(history);
}

// ============================================================
// TOPIC & MOOD EXTRACTION
// ============================================================

function extractTopics(exchanges) {
  const topicPatterns = {
    philosophy:
      /\b(meaning|purpose|existence|consciousness|reality|truth|wisdom|philosophy)\b/i,
    emotions:
      /\b(feel|feeling|sad|happy|anxious|scared|angry|love|hate|lonely)\b/i,
    relationships:
      /\b(relationship|friend|family|partner|mother|father|brother|sister)\b/i,
    work: /\b(work|job|career|project|boss|coworker|deadline)\b/i,
    creativity: /\b(create|art|music|write|design|build|make)\b/i,
    identity: /\b(who am i|identity|self|myself|person|becoming)\b/i,
    orpheus: /\b(orpheus|you|your|yourself|are you)\b/i,
    meta: /\b(how do you|what are you|explain yourself|your code|your memory)\b/i,
  };

  const detected = new Set();

  for (const exchange of exchanges) {
    const text = `${exchange.user} ${exchange.orpheus}`;
    for (const [topic, pattern] of Object.entries(topicPatterns)) {
      if (pattern.test(text)) {
        detected.add(topic);
      }
    }
  }

  return Array.from(detected);
}

function determineMood(exchanges) {
  if (exchanges.length === 0) return "neutral";

  const moodSignals = {
    heavy: /\b(sad|hurt|pain|grief|loss|struggle|hard|difficult|crying)\b/i,
    light: /\b(haha|lol|funny|laugh|joy|happy|excited|great)\b/i,
    processing: /\b(thinking|wondering|confused|unsure|maybe|perhaps|idk)\b/i,
    intense: /\b(fuck|shit|damn|angry|pissed|furious|hate)\b/i,
    curious: /\b(how|why|what if|curious|interesting|tell me|explain)\b/i,
  };

  const scores = { heavy: 0, light: 0, processing: 0, intense: 0, curious: 0 };

  for (const exchange of exchanges) {
    const text = exchange.user.toLowerCase();
    for (const [mood, pattern] of Object.entries(moodSignals)) {
      if (pattern.test(text)) {
        scores[mood]++;
      }
    }
  }

  const topMood = Object.entries(scores).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );
  return topMood[1] > 0 ? topMood[0] : "neutral";
}

// ============================================================
// RETRIEVAL
// ============================================================

export function getRecentConversations(count = 10) {
  const history = loadHistory();
  return history.conversations.slice(-count).reverse();
}

export function getConversationById(id) {
  const history = loadHistory();
  return history.conversations.find((c) => c.id === id);
}

export function searchConversations(query) {
  const history = loadHistory();
  const lower = query.toLowerCase();

  return history.conversations.filter((conv) => {
    return conv.exchanges.some(
      (ex) =>
        ex.user.toLowerCase().includes(lower) ||
        ex.orpheus.toLowerCase().includes(lower)
    );
  });
}

export function getConversationsByTopic(topic) {
  const history = loadHistory();
  return history.conversations.filter(
    (conv) => conv.topics && conv.topics.includes(topic)
  );
}

// ============================================================
// STATS
// ============================================================

export function getHistoryStats() {
  const history = loadHistory();
  const convos = history.conversations;

  if (convos.length === 0) {
    return { totalConversations: 0, totalExchanges: 0, topics: [], moods: {} };
  }

  const totalExchanges = convos.reduce(
    (sum, c) => sum + (c.messageCount || 0),
    0
  );
  const allTopics = convos.flatMap((c) => c.topics || []);
  const topicCounts = {};
  allTopics.forEach((t) => {
    topicCounts[t] = (topicCounts[t] || 0) + 1;
  });

  const moodCounts = {};
  convos.forEach((c) => {
    if (c.mood) moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1;
  });

  return {
    totalConversations: convos.length,
    totalExchanges,
    topics: Object.entries(topicCounts).sort((a, b) => b[1] - a[1]),
    moods: moodCounts,
    firstConversation: convos[0]?.startedAt,
    lastConversation: convos[convos.length - 1]?.startedAt,
  };
}

// ============================================================
// CLEANUP ON PROCESS EXIT
// ============================================================

process.on("beforeExit", () => {
  saveCurrentConversation();
});

process.on("SIGINT", () => {
  saveCurrentConversation();
  process.exit(0);
});

process.on("SIGTERM", () => {
  saveCurrentConversation();
  process.exit(0);
});

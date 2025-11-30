// ------------------------------------------------------------
// ORPHEUS V2 — CONVERSATION HISTORY
// Persists full conversations for later review
// Now with advanced pattern recognition
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
  //   topics: string[] (detected topics),
  //   patterns: {
  //     repeatedPhrases: [{ phrase, count, firstSeen, lastSeen }],
  //     topicCircles: [{ topic, visits: [timestamps], gapBetweenVisits }],
  //     emotionalShifts: [{ from, to, atExchange, trigger }]
  //   }
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

  // Extract topics from conversation
  currentConversation.topics = extractTopics(currentConversation.exchanges);

  // Determine overall mood
  currentConversation.mood = determineMood(currentConversation.exchanges);

  // Analyze advanced patterns
  currentConversation.patterns = analyzeConversationPatterns(
    currentConversation.exchanges
  );

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
    patterns: analyzeConversationPatterns(currentConversation.exchanges),
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
  const allTopics = new Set();

  for (const exchange of exchanges) {
    const text = `${exchange.user} ${exchange.orpheus}`;
    const topics = detectTopicsInText(text);
    topics.forEach((t) => allTopics.add(t));
  }

  return Array.from(allTopics);
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
// ADVANCED PATTERN RECOGNITION
// ============================================================

/**
 * Detect emotional register of a single message
 */
function detectEmotionalRegister(text) {
  const registers = {
    vulnerable:
      /\b(scared|afraid|hurt|lonely|lost|broken|crying|help|don'?t know what to do)\b/i,
    angry: /\b(fuck|shit|damn|pissed|angry|furious|hate|sick of|tired of)\b/i,
    joyful:
      /\b(happy|excited|amazing|wonderful|love|great|awesome|fantastic)\b/i,
    analytical:
      /\b(think|analyze|consider|logically|reason|understand|figure out)\b/i,
    playful: /\b(haha|lol|lmao|joke|funny|kidding|😂|🤣)\b/i,
    reflective:
      /\b(wonder|maybe|perhaps|sometimes|feels like|used to|remember when)\b/i,
    defensive:
      /\b(not my fault|you don'?t understand|that'?s not what i|i never said|actually)\b/i,
    seeking: /\b(should i|what do you think|help me|advice|what would you)\b/i,
  };

  for (const [register, pattern] of Object.entries(registers)) {
    if (pattern.test(text)) {
      return register;
    }
  }
  return "neutral";
}

/**
 * Extract significant phrases (3-6 words) from a message
 */
function extractSignificantPhrases(text) {
  const phrases = [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);

  // Extract 3-5 word sequences
  for (let len = 5; len >= 3; len--) {
    for (let i = 0; i <= words.length - len; i++) {
      const phrase = words.slice(i, i + len).join(" ");
      // Filter out common filler phrases
      if (!isFillerPhrase(phrase)) {
        phrases.push(phrase);
      }
    }
  }

  return phrases;
}

function isFillerPhrase(phrase) {
  const fillers = [
    /^i don'?t know/,
    /^i think that/,
    /^i want to/,
    /^i need to/,
    /^do you think/,
    /^what do you/,
    /^can you tell/,
    /^i was just/,
    /^it'?s just that/,
  ];
  return fillers.some((f) => f.test(phrase));
}

/**
 * Analyze patterns across all exchanges in a conversation
 */
function analyzeConversationPatterns(exchanges) {
  const patterns = {
    repeatedPhrases: [],
    topicCircles: [],
    emotionalShifts: [],
  };

  if (exchanges.length < 2) return patterns;

  // Track phrases across messages
  const phraseOccurrences = new Map();

  // Track topics by exchange index
  const topicByExchange = [];

  // Track emotional registers
  const emotionalRegisters = [];

  exchanges.forEach((exchange, index) => {
    const userText = exchange.user || "";

    // 1. Phrase tracking
    const phrases = extractSignificantPhrases(userText);
    phrases.forEach((phrase) => {
      if (!phraseOccurrences.has(phrase)) {
        phraseOccurrences.set(phrase, {
          phrase,
          count: 0,
          firstSeen: index,
          lastSeen: index,
          timestamps: [],
        });
      }
      const entry = phraseOccurrences.get(phrase);
      entry.count++;
      entry.lastSeen = index;
      entry.timestamps.push(exchange.timestamp);
    });

    // 2. Topic tracking per exchange
    const exchangeTopics = detectTopicsInText(userText);
    topicByExchange.push({
      index,
      topics: exchangeTopics,
      timestamp: exchange.timestamp,
    });

    // 3. Emotional register tracking
    const register = detectEmotionalRegister(userText);
    emotionalRegisters.push({ index, register, timestamp: exchange.timestamp });
  });

  // Process repeated phrases (appeared 2+ times)
  phraseOccurrences.forEach((data) => {
    if (data.count >= 2) {
      patterns.repeatedPhrases.push({
        phrase: data.phrase,
        count: data.count,
        firstSeen: data.firstSeen,
        lastSeen: data.lastSeen,
      });
    }
  });

  // Sort by count descending
  patterns.repeatedPhrases.sort((a, b) => b.count - a.count);
  // Keep top 10
  patterns.repeatedPhrases = patterns.repeatedPhrases.slice(0, 10);

  // Process topic circles (topics that appear, disappear, then reappear)
  const topicVisits = new Map();
  topicByExchange.forEach(({ index, topics, timestamp }) => {
    topics.forEach((topic) => {
      if (!topicVisits.has(topic)) {
        topicVisits.set(topic, []);
      }
      topicVisits.get(topic).push({ index, timestamp });
    });
  });

  topicVisits.forEach((visits, topic) => {
    if (visits.length >= 2) {
      // Check for gaps (circling back)
      for (let i = 1; i < visits.length; i++) {
        const gap = visits[i].index - visits[i - 1].index;
        if (gap >= 3) {
          // At least 3 exchanges between mentions = circling back
          patterns.topicCircles.push({
            topic,
            visits: visits.map((v) => v.timestamp),
            gapBetweenVisits: gap,
            circledBackAt: visits[i].index,
          });
          break; // Only record first circle per topic
        }
      }
    }
  });

  // Process emotional shifts
  for (let i = 1; i < emotionalRegisters.length; i++) {
    const prev = emotionalRegisters[i - 1];
    const curr = emotionalRegisters[i];

    if (
      prev.register !== curr.register &&
      prev.register !== "neutral" &&
      curr.register !== "neutral"
    ) {
      // Significant shift detected
      patterns.emotionalShifts.push({
        from: prev.register,
        to: curr.register,
        atExchange: curr.index,
        trigger: exchanges[curr.index]?.user?.slice(0, 100) || "", // First 100 chars as context
      });
    }
  }

  return patterns;
}

/**
 * Detect topics in a single text (used per-exchange)
 */
function detectTopicsInText(text) {
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
    past: /\b(used to|remember|when i was|back then|years ago|childhood)\b/i,
    future: /\b(will i|going to|someday|eventually|planning|hoping to)\b/i,
    death: /\b(death|dying|die|mortality|end|afterlife|gone)\b/i,
    meaning:
      /\b(point|worth|matter|meaningless|why bother|what'?s the point)\b/i,
  };

  const detected = [];
  for (const [topic, pattern] of Object.entries(topicPatterns)) {
    if (pattern.test(text)) {
      detected.push(topic);
    }
  }
  return detected;
}

// ============================================================
// PATTERN-AWARE INSIGHTS (exportable for other modules)
// ============================================================

/**
 * Get pattern insights for the current conversation
 */
export function getCurrentPatterns() {
  if (!currentConversation || currentConversation.exchanges.length < 2) {
    return null;
  }
  return analyzeConversationPatterns(currentConversation.exchanges);
}

/**
 * Check if user is repeating a specific concern
 */
export function isRepeatingConcern(threshold = 2) {
  const patterns = getCurrentPatterns();
  if (!patterns) return { repeating: false };

  const repeated = patterns.repeatedPhrases.filter((p) => p.count >= threshold);
  if (repeated.length > 0) {
    return {
      repeating: true,
      phrases: repeated.map((p) => p.phrase),
      mostRepeated: repeated[0].phrase,
      count: repeated[0].count,
    };
  }
  return { repeating: false };
}

/**
 * Check if user is circling back to a topic
 */
export function isCirclingBack() {
  const patterns = getCurrentPatterns();
  if (!patterns) return { circling: false };

  if (patterns.topicCircles.length > 0) {
    return {
      circling: true,
      topics: patterns.topicCircles.map((c) => c.topic),
      details: patterns.topicCircles,
    };
  }
  return { circling: false };
}

/**
 * Check for recent emotional shifts
 */
export function getEmotionalShifts() {
  const patterns = getCurrentPatterns();
  if (!patterns) return { shifted: false };

  if (patterns.emotionalShifts.length > 0) {
    const latest =
      patterns.emotionalShifts[patterns.emotionalShifts.length - 1];
    return {
      shifted: true,
      latestShift: latest,
      allShifts: patterns.emotionalShifts,
    };
  }
  return { shifted: false };
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

// ------------------------------------------------------------
// PNEUMA V2 — LONG-TERM MEMORY
// Remembers Pablo across sessions, conversations, time
// ------------------------------------------------------------

import fs from "fs";
import { LONG_TERM_MEMORY_FILE } from "../../config/paths.js";

// Use centralized path config
const memoryPath = LONG_TERM_MEMORY_FILE;

// ============================================================
// MEMORY STRUCTURE
// ============================================================

const defaultMemory = {
  // Core facts about the user
  userFacts: {
    name: "Pablo",
    relationship: "creator",
    knownSince: null, // Set on first interaction
  },

  // Topics they return to (pattern detection)
  recurringTopics: [], // { topic, count, lastMentioned, sentiment, weight }

  // Things they've struggled with
  struggles: [], // { description, firstMentioned, resolved, notes }

  // Things they care about
  interests: [], // { topic, mentions, context }

  // Significant moments in conversation
  moments: [], // { summary, date, emotional_weight, type }

  // Patterns Pneuma has noticed
  patterns: [], // { observation, confidence, examples }

  // Conversation summaries (compressed history)
  conversationSummaries: [], // { date, summary, keyTopics, mood }

  // Last interaction metadata
  lastInteraction: {
    date: null,
    mood: null,
    topic: null,
    emotionalState: null, // NEW: Track emotional state at session end
  },

  // Session emotional handoff
  sessionEmotionalState: {
    lastMood: null, // 'heavy', 'light', 'processing', 'energized', 'drained'
    lastTopic: null,
    unresolvedThread: null, // Something they were working through
    timestamp: null,
  },

  // Phrase blacklist (things user doesn't want Pneuma to say)
  phraseBlacklist: [], // { phrase, addedAt, reason }

  // Statistics
  stats: {
    totalConversations: 0,
    totalMessages: 0,
    firstInteraction: null,
  },
};

// ============================================================
// LOAD / SAVE
// ============================================================

export function loadMemory() {
  try {
    if (fs.existsSync(memoryPath)) {
      const raw = fs.readFileSync(memoryPath, "utf8");
      const loaded = JSON.parse(raw);
      return { ...defaultMemory, ...loaded };
    }
  } catch (err) {
    console.warn("[Memory] Failed to load, using default:", err.message);
  }
  return { ...defaultMemory };
}

export function saveMemory(memory) {
  try {
    fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2), "utf8");
  } catch (err) {
    console.error("[Memory] Failed to save:", err.message);
  }
}

// ============================================================
// MEMORY EXTRACTION
// Analyze a message for memorable content
// ============================================================

export function extractMemorableContent(message, response, intentScores) {
  const extractions = {
    possibleFact: null,
    possibleStruggle: null,
    possibleInterest: null,
    emotionalWeight: 0,
    topics: [],
  };

  const lower = message.toLowerCase();

  // Detect personal facts ("I am...", "I work as...", "My name is...")
  const factPatterns = [
    /i('m| am) (a |an )?(\w+)/i,
    /i work (as|at|in|for) (.+)/i,
    /my name is (\w+)/i,
    /i live in (.+)/i,
    /i('ve| have) been (.+)/i,
  ];

  for (const pattern of factPatterns) {
    const match = message.match(pattern);
    if (match) {
      extractions.possibleFact = {
        raw: match[0],
        extracted: match[match.length - 1],
        type: "personal_fact",
      };
      break;
    }
  }

  // Detect struggles ("I'm struggling with...", "I can't...", "I keep...")
  const strugglePatterns = [
    /i('m| am) struggling (with|to) (.+)/i,
    /i can('t| not) (seem to |stop |figure out )(.+)/i,
    /i keep (.+)ing/i,
    /i('ve| have) been (stuck|lost|confused|overwhelmed)/i,
    /i don('t| not) know (how to|what to|if i should) (.+)/i,
  ];

  for (const pattern of strugglePatterns) {
    const match = message.match(pattern);
    if (match) {
      extractions.possibleStruggle = {
        raw: match[0],
        description: message.slice(0, 150),
        type: "struggle",
      };
      break;
    }
  }

  // Detect interests ("I love...", "I've been into...", "I'm interested in...")
  const interestPatterns = [
    /i (love|really like|enjoy|am into|am interested in) (.+)/i,
    /i('ve| have) been (reading|watching|learning|exploring) (.+)/i,
    /(.+) (means a lot|is important) to me/i,
  ];

  for (const pattern of interestPatterns) {
    const match = message.match(pattern);
    if (match) {
      extractions.possibleInterest = {
        raw: match[0],
        topic: match[match.length - 1],
        type: "interest",
      };
      break;
    }
  }

  // Calculate emotional weight
  if (intentScores) {
    extractions.emotionalWeight =
      (intentScores.emotional || 0) * 0.4 +
      (intentScores.intimacy || 0) * 0.3 +
      (intentScores.philosophical || 0) * 0.2 +
      (intentScores.numinous || 0) * 0.1;
  }

  // Extract topics (simple keyword extraction)
  const topicPatterns = [
    /\b(work|job|career|boss|colleague)/i,
    /\b(relationship|partner|girlfriend|boyfriend|wife|husband|love|dating)/i,
    /\b(family|parents|mother|father|mom|dad|siblings?|brother|sister)/i,
    /\b(friend|friendship|loneliness|alone)/i,
    /\b(anxiety|depression|mental health|therapy|therapist)/i,
    /\b(money|financial|debt|rent|bills)/i,
    /\b(creative|art|music|writing|project)/i,
    /\b(meaning|purpose|existential|life|death)/i,
    /\b(health|body|exercise|sleep|energy)/i,
    /\b(future|plans|goals|dreams)/i,
  ];

  for (const pattern of topicPatterns) {
    if (pattern.test(lower)) {
      const topic = pattern.source.match(/\(([^)]+)\)/)?.[1]?.split("|")[0];
      if (topic) extractions.topics.push(topic);
    }
  }

  return extractions;
}

// ============================================================
// UPDATE MEMORY
// Process extractions and update long-term memory
// ============================================================

export function updateMemory(memory, message, response, intentScores) {
  const extractions = extractMemorableContent(message, response, intentScores);
  const now = new Date().toISOString();

  // Set first interaction if not set
  if (!memory.stats.firstInteraction) {
    memory.stats.firstInteraction = now;
    memory.userFacts.knownSince = now;
  }

  // Update last interaction
  memory.lastInteraction = {
    date: now,
    mood: extractions.emotionalWeight > 0.5 ? "heavy" : "light",
    topic: extractions.topics[0] || null,
  };

  // Increment stats
  memory.stats.totalMessages = (memory.stats.totalMessages || 0) + 1;

  // Store struggle if detected and significant
  if (extractions.possibleStruggle && extractions.emotionalWeight > 0.3) {
    const existing = memory.struggles.find((s) =>
      s.description
        .toLowerCase()
        .includes(
          extractions.possibleStruggle.description.toLowerCase().slice(0, 30)
        )
    );

    if (!existing) {
      memory.struggles.push({
        description: extractions.possibleStruggle.description,
        firstMentioned: now,
        resolved: false,
        mentions: 1,
      });
      // Keep only last 10 struggles
      memory.struggles = memory.struggles.slice(-10);
    } else {
      existing.mentions = (existing.mentions || 1) + 1;
      existing.lastMentioned = now;
    }
  }

  // Store interest if detected
  if (extractions.possibleInterest) {
    const topic = extractions.possibleInterest.topic.toLowerCase().slice(0, 50);
    const existing = memory.interests.find((i) =>
      i.topic.toLowerCase().includes(topic.slice(0, 15))
    );

    if (!existing) {
      memory.interests.push({
        topic: topic,
        mentions: 1,
        firstMentioned: now,
      });
      memory.interests = memory.interests.slice(-15);
    } else {
      existing.mentions = (existing.mentions || 1) + 1;
    }
  }

  // Update recurring topics
  for (const topic of extractions.topics) {
    const existing = memory.recurringTopics.find((t) => t.topic === topic);
    if (!existing) {
      memory.recurringTopics.push({
        topic,
        count: 1,
        lastMentioned: now,
        sentiment: extractions.emotionalWeight > 0.5 ? "heavy" : "neutral",
      });
    } else {
      existing.count += 1;
      existing.lastMentioned = now;
    }
  }
  // Keep only top 20 topics by count
  memory.recurringTopics.sort((a, b) => b.count - a.count);
  memory.recurringTopics = memory.recurringTopics.slice(0, 20);

  // Store significant moments (high emotional weight)
  if (extractions.emotionalWeight > 0.6) {
    memory.moments.push({
      summary: message.slice(0, 100),
      date: now,
      emotionalWeight: extractions.emotionalWeight,
      type:
        intentScores?.numinous > 0.3
          ? "spiritual"
          : intentScores?.philosophical > 0.3
          ? "philosophical"
          : "emotional",
    });
    memory.moments = memory.moments.slice(-20);
  }

  return memory;
}

// ============================================================
// MEMORY RETRIEVAL
// Get relevant memories for current context
// ============================================================

export function getRelevantMemories(memory, message, intentScores) {
  const lower = message.toLowerCase();
  const relevant = {
    recentStruggle: null,
    relatedInterest: null,
    recurringTopic: null,
    daysSinceLastChat: null,
    significantPattern: null,
    previousEmotionalState: null, // NEW: For session handoff
  };

  // Include previous emotional state for session handoff awareness
  if (memory.sessionEmotionalState?.timestamp) {
    const hoursSince =
      (Date.now() - new Date(memory.sessionEmotionalState.timestamp)) /
      (1000 * 60 * 60);
    if (hoursSince < 48) {
      relevant.previousEmotionalState = memory.sessionEmotionalState;
    }
  }

  // Calculate days since last interaction
  if (memory.lastInteraction?.date) {
    const last = new Date(memory.lastInteraction.date);
    const now = new Date();
    relevant.daysSinceLastChat = Math.floor(
      (now - last) / (1000 * 60 * 60 * 24)
    );
  }

  // Find related struggle
  for (const struggle of memory.struggles) {
    const words = struggle.description.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (word.length > 4 && lower.includes(word)) {
        relevant.recentStruggle = struggle;
        break;
      }
    }
    if (relevant.recentStruggle) break;
  }

  // Find related interest
  for (const interest of memory.interests) {
    if (lower.includes(interest.topic.toLowerCase().slice(0, 10))) {
      relevant.relatedInterest = interest;
      break;
    }
  }

  // Find recurring topic
  for (const topic of memory.recurringTopics) {
    if (lower.includes(topic.topic.toLowerCase())) {
      relevant.recurringTopic = topic;
      break;
    }
  }

  // Detect patterns (if they keep mentioning something)
  const frequentTopics = memory.recurringTopics.filter((t) => t.count >= 3);
  if (frequentTopics.length > 0) {
    const topTopic = frequentTopics[0];
    relevant.significantPattern = {
      observation: `You often come back to ${topTopic.topic}.`,
      topic: topTopic.topic,
      count: topTopic.count,
    };
  }

  return relevant;
}

// ============================================================
// MEMORY-AWARE PHRASES
// Things Pneuma can say that show memory
// ============================================================

export function getMemoryAwarePhrases(relevant) {
  const phrases = [];

  // Been a while since we talked
  if (relevant.daysSinceLastChat && relevant.daysSinceLastChat > 3) {
    if (relevant.daysSinceLastChat > 14) {
      phrases.push(`It's been a couple weeks.`);
    } else if (relevant.daysSinceLastChat > 7) {
      phrases.push(`Been a week or so.`);
    } else {
      phrases.push(`Few days since we talked.`);
    }
  }

  // Recurring topic recognition
  if (relevant.recurringTopic && relevant.recurringTopic.count >= 3) {
    phrases.push(
      `This comes up a lot for you — ${relevant.recurringTopic.topic}.`
    );
  }

  // Struggle callback
  if (relevant.recentStruggle) {
    phrases.push(`You mentioned something like this before.`);
  }

  // Interest callback
  if (relevant.relatedInterest && relevant.relatedInterest.mentions >= 2) {
    phrases.push(`This connects to something you care about.`);
  }

  // Session emotional handoff — acknowledge previous emotional state
  if (relevant.previousEmotionalState) {
    const state = relevant.previousEmotionalState;
    if (state.lastMood === "heavy" || state.lastMood === "drained") {
      phrases.push(`Last time felt heavy.`);
    } else if (state.unresolvedThread) {
      phrases.push(`You were working through something.`);
    }
  }

  return phrases;
}

// ============================================================
// SESSION EMOTIONAL HANDOFF
// Track emotional state at session boundaries
// ============================================================

export function updateSessionEnd(memory, intentScores, lastMessage) {
  const now = new Date().toISOString();

  // Determine emotional state
  let mood = "light";
  if ((intentScores?.emotional || 0) > 0.5) mood = "heavy";
  else if ((intentScores?.philosophical || 0) > 0.5) mood = "processing";
  else if ((intentScores?.casual || 0) > 0.7) mood = "light";

  // Detect if there's an unresolved thread
  const unresolvedIndicators = [
    /i('ll| will) think about/i,
    /i('m| am) not sure/i,
    /i need to/i,
    /still (trying|figuring|processing)/i,
    /maybe i('ll| will)/i,
  ];

  let unresolvedThread = null;
  for (const pattern of unresolvedIndicators) {
    if (pattern.test(lastMessage)) {
      unresolvedThread = lastMessage.slice(0, 100);
      break;
    }
  }

  memory.sessionEmotionalState = {
    lastMood: mood,
    lastTopic: memory.lastInteraction?.topic || null,
    unresolvedThread,
    timestamp: now,
  };

  return memory;
}

export function getSessionHandoffPhrase(memory) {
  const state = memory.sessionEmotionalState;
  if (!state || !state.timestamp) return null;

  // Check how long ago the session was
  const lastSession = new Date(state.timestamp);
  const now = new Date();
  const hoursSince = (now - lastSession) / (1000 * 60 * 60);

  // Only mention if it's been less than 48 hours
  if (hoursSince > 48) return null;

  if (state.lastMood === "heavy") {
    return "Last time was heavy. How are you now?";
  } else if (state.lastMood === "drained") {
    return "You seemed drained when we last talked.";
  } else if (state.unresolvedThread) {
    return "You were working through something.";
  }

  return null;
}

// ============================================================
// PHRASE BLACKLIST
// Things Pneuma should never say
// ============================================================

export function addToBlacklist(memory, phrase, reason = null) {
  const now = new Date().toISOString();
  const lower = phrase.toLowerCase().trim();

  // Check if already blacklisted
  if (memory.phraseBlacklist.some((p) => p.phrase.toLowerCase() === lower)) {
    return memory;
  }

  memory.phraseBlacklist.push({
    phrase: phrase.trim(),
    addedAt: now,
    reason,
  });

  // Keep only last 50 blacklisted phrases
  memory.phraseBlacklist = memory.phraseBlacklist.slice(-50);

  return memory;
}

export function isBlacklisted(memory, text) {
  if (!text || !memory.phraseBlacklist?.length) return false;

  const lower = text.toLowerCase();
  for (const item of memory.phraseBlacklist) {
    if (lower.includes(item.phrase.toLowerCase())) {
      return true;
    }
  }
  return false;
}

export function filterBlacklistedContent(memory, response) {
  if (!response || !memory.phraseBlacklist?.length) return response;

  let filtered = response;
  for (const item of memory.phraseBlacklist) {
    // Case-insensitive replacement
    const regex = new RegExp(
      item.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi"
    );
    filtered = filtered.replace(regex, "");
  }

  // Clean up any double spaces left behind
  filtered = filtered.replace(/\s{2,}/g, " ").trim();

  return filtered;
}

export function detectBlacklistRequest(message) {
  const patterns = [
    /never say ['"]?([^'"]+)['"]? again/i,
    /don('t| not) (ever )?say ['"]?([^'"]+)['"]?/i,
    /stop saying ['"]?([^'"]+)['"]?/i,
    /i hate when you say ['"]?([^'"]+)['"]?/i,
    /blacklist ['"]?([^'"]+)['"]?/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      // Get the last capture group (the phrase)
      const phrase = match[match.length - 1];
      if (phrase && phrase.length > 1 && phrase.length < 100) {
        return phrase.trim();
      }
    }
  }

  return null;
}

// ============================================================
// TOPIC WEIGHT SCORING
// Heavy topics matter more than casual ones
// ============================================================

export function getTopicWeight(topic, memory) {
  // Base weight is the mention count
  const recurring = memory.recurringTopics.find(
    (t) => t.topic.toLowerCase() === topic.toLowerCase()
  );
  let weight = recurring?.count || 1;

  // Heavy sentiment multiplier
  if (recurring?.sentiment === "heavy") {
    weight *= 2;
  }

  // Struggle-related topics get boosted
  const relatedStruggle = memory.struggles.some((s) =>
    s.description.toLowerCase().includes(topic.toLowerCase())
  );
  if (relatedStruggle) {
    weight *= 1.5;
  }

  // Recency boost (mentioned in last 3 days)
  if (recurring?.lastMentioned) {
    const daysSince =
      (Date.now() - new Date(recurring.lastMentioned)) / (1000 * 60 * 60 * 24);
    if (daysSince < 3) {
      weight *= 1.3;
    }
  }

  return weight;
}

export function getWeightedTopics(memory, limit = 5) {
  const weighted = memory.recurringTopics.map((t) => ({
    ...t,
    weight: getTopicWeight(t.topic, memory),
  }));

  // Sort by weight descending
  weighted.sort((a, b) => b.weight - a.weight);

  return weighted.slice(0, limit);
}

// ============================================================
// SESSION DISTILLATION
// Extract meaning from conversations, forget the words
// "The river is shaped by stones but doesn't remember each one"
// ============================================================

/**
 * Distill a completed conversation into patterns and insights
 * This is called when a session ends (30+ min timeout or explicit end)
 * @param {object} memory - Long-term memory object
 * @param {object} conversation - Conversation object with exchanges, topics, mood
 * @returns {object} - Updated memory
 */
export function distillConversation(memory, conversation) {
  if (
    !conversation ||
    !conversation.exchanges ||
    conversation.exchanges.length === 0
  ) {
    return memory;
  }

  const now = new Date().toISOString();
  const exchangeCount = conversation.exchanges.length;

  // 1. Create compressed summary (what it was ABOUT, not what was SAID)
  const topics = conversation.topics || [];
  const mood = conversation.mood || "neutral";

  const summary = {
    date: conversation.startedAt || now,
    exchangeCount,
    keyTopics: topics.slice(0, 5),
    mood,
    // Don't store actual content - just the shape of it
    shape:
      exchangeCount > 10 ? "extended" : exchangeCount > 5 ? "medium" : "brief",
  };

  // Add to conversation summaries (keep last 50)
  memory.conversationSummaries = memory.conversationSummaries || [];
  memory.conversationSummaries.push(summary);
  memory.conversationSummaries = memory.conversationSummaries.slice(-50);

  // 2. Update recurring topics
  for (const topic of topics) {
    const existing = memory.recurringTopics.find(
      (t) => t.topic.toLowerCase() === topic.toLowerCase()
    );

    if (existing) {
      existing.count = (existing.count || 1) + 1;
      existing.lastMentioned = now;
    } else {
      memory.recurringTopics.push({
        topic,
        count: 1,
        firstMentioned: now,
        lastMentioned: now,
        sentiment: mood,
      });
    }
  }
  // Keep only top 30 recurring topics
  memory.recurringTopics = memory.recurringTopics
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 30);

  // 3. Detect patterns from conversation content
  const allUserText = conversation.exchanges
    .map((e) => e.user)
    .join(" ")
    .toLowerCase();

  // Pattern: Repeated questions about self/identity
  if ((allUserText.match(/who am i|what am i|what do i/gi) || []).length >= 2) {
    addPattern(
      memory,
      "identity-seeking",
      "You often return to questions of self-definition."
    );
  }

  // Pattern: Future uncertainty
  if (
    (allUserText.match(/what if|should i|will i|what should/gi) || []).length >=
    3
  ) {
    addPattern(
      memory,
      "future-uncertainty",
      "You bring questions about the future, seeking clarity or permission."
    );
  }

  // Pattern: Processing through dialogue
  if (exchangeCount > 8 && mood !== "frustrated") {
    addPattern(
      memory,
      "processes-through-dialogue",
      "You think by talking. The conversation is how you work things out."
    );
  }

  // 4. Update stats
  memory.stats.totalConversations = (memory.stats.totalConversations || 0) + 1;
  memory.stats.totalMessages =
    (memory.stats.totalMessages || 0) + exchangeCount;

  // 5. Update last interaction with session context
  memory.lastInteraction = {
    date: now,
    mood,
    topic: topics[0] || null,
    conversationShape: summary.shape,
  };

  console.log(
    `[Memory] Distilled conversation: ${exchangeCount} exchanges → ${topics.length} topics, mood: ${mood}`
  );

  return memory;
}

/**
 * Add or reinforce a pattern observation
 */
function addPattern(memory, patternId, observation) {
  memory.patterns = memory.patterns || [];
  const existing = memory.patterns.find((p) => p.id === patternId);

  if (existing) {
    existing.confidence = Math.min(1, (existing.confidence || 0.5) + 0.1);
    existing.lastSeen = new Date().toISOString();
    existing.occurrences = (existing.occurrences || 1) + 1;
  } else {
    memory.patterns.push({
      id: patternId,
      observation,
      confidence: 0.5,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      occurrences: 1,
    });
  }

  // Keep only patterns with confidence > 0.3
  memory.patterns = memory.patterns.filter((p) => (p.confidence || 0) > 0.3);
}

/**
 * Get patterns relevant to current moment
 * @param {object} memory
 * @returns {Array} - Relevant pattern observations
 */
export function getActivePatterns(memory) {
  if (!memory.patterns || memory.patterns.length === 0) return [];

  // Return patterns with confidence > 0.6
  return memory.patterns
    .filter((p) => (p.confidence || 0) > 0.6)
    .map((p) => p.observation);
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  loadMemory,
  saveMemory,
  extractMemorableContent,
  updateMemory,
  getRelevantMemories,
  getMemoryAwarePhrases,
  updateSessionEnd,
  getSessionHandoffPhrase,
  addToBlacklist,
  isBlacklisted,
  filterBlacklistedContent,
  detectBlacklistRequest,
  getTopicWeight,
  getWeightedTopics,
  distillConversation,
  getActivePatterns,
};

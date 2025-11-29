// ------------------------------------------------------------
// ORPHEUS V2 — LONG-TERM MEMORY
// Remembers Pablo across sessions, conversations, time
// ------------------------------------------------------------

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const memoryPath = path.join(__dirname, "../../data/long_term_memory.json");

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
  recurringTopics: [], // { topic, count, lastMentioned, sentiment }

  // Things they've struggled with
  struggles: [], // { description, firstMentioned, resolved, notes }

  // Things they care about
  interests: [], // { topic, mentions, context }

  // Significant moments in conversation
  moments: [], // { summary, date, emotional_weight, type }

  // Patterns Orpheus has noticed
  patterns: [], // { observation, confidence, examples }

  // Conversation summaries (compressed history)
  conversationSummaries: [], // { date, summary, keyTopics, mood }

  // Last interaction metadata
  lastInteraction: {
    date: null,
    mood: null,
    topic: null,
  },

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
  };

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
// Things Orpheus can say that show memory
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

  return phrases;
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
};

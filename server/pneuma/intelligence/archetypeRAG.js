// ============================================================
// PNEUMA — ARCHETYPE RAG (Retrieval-Augmented Generation)
// Purpose: Deep knowledge retrieval from archetype source texts
// Input: User message
// Output: Relevant passages from ALL archetypes with weights
// ============================================================

import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONTRAST MAP — Dialectic oppositions between thinkers
// Used to inject creative tension into retrieval
// ============================================================
const CONTRAST_MAP = {
  // Self/No-Self dialectic
  "Alan Watts": ["Søren Kierkegaard", "Viktor Frankl", "Friedrich Nietzsche"],
  "Ramana Maharshi": [
    "Søren Kierkegaard",
    "Friedrich Nietzsche",
    "Albert Camus",
  ],
  "Jiddu Krishnamurti": ["Miyamoto Musashi", "Sun Tzu", "Marcus Aurelius"],

  // Light/Dark dialectic
  "Kahlil Gibran": ["Franz Kafka", "Arthur Schopenhauer", "Fyodor Dostoevsky"],
  Rumi: ["Albert Camus", "Franz Kafka", "Arthur Schopenhauer"],
  Hafiz: ["Friedrich Nietzsche", "Arthur Schopenhauer"],

  // Action/Stillness dialectic
  "Miyamoto Musashi": ["Lao Tzu", "Alan Watts", "Zhuangzi"],
  "Sun Tzu": ["Thich Nhat Hanh", "Pema Chödrön"],
  "Marcus Aurelius": ["Alan Watts", "Zhuangzi"],

  // Reason/Mystery dialectic
  "Richard Feynman": ["Rudolf Otto", "Meister Eckhart", "Padmasambhava"],
  "Bernardo Kastrup": ["Richard Feynman", "Leonardo da Vinci"],

  // Order/Chaos dialectic
  "Carl Jung": ["Jiddu Krishnamurti", "Alan Watts"],
  "Viktor Frankl": ["Albert Camus", "Franz Kafka"],

  // Affirmation/Negation dialectic
  "Friedrich Nietzsche": ["Thich Nhat Hanh", "Pema Chödrön", "Kahlil Gibran"],
  "Arthur Schopenhauer": ["Rumi", "Hafiz", "Walt Whitman"],
  "Franz Kafka": ["Kahlil Gibran", "Rumi", "Walt Whitman"],
  "Albert Camus": ["Viktor Frankl", "Rumi"],
};

// Initialize OpenAI for embeddings
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Paths - data folder is at project root (../../.. from intelligence folder)
const KNOWLEDGE_DIR = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "data",
  "archetype_knowledge",
);
const EMBEDDINGS_FILE = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "data",
  "archetype_embeddings.json",
);

// In-memory store for embedded passages
let embeddedPassages = [];
let isInitialized = false;

// ============================================================
// EMBEDDING FUNCTIONS
// ============================================================

/**
 * Get embedding from OpenAI
 */
async function getEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("[ArchetypeRAG] Embedding error:", error.message);
    return null;
  }
}

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ============================================================
// KNOWLEDGE LOADING
// ============================================================

/**
 * Load all archetype knowledge files
 */
function loadAllKnowledge() {
  const knowledge = [];

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.warn(
      "[ArchetypeRAG] Knowledge directory not found:",
      KNOWLEDGE_DIR,
    );
    return knowledge;
  }

  const thinkerDirs = fs.readdirSync(KNOWLEDGE_DIR);

  for (const thinkerDir of thinkerDirs) {
    const passagesPath = path.join(KNOWLEDGE_DIR, thinkerDir, "passages.json");

    if (fs.existsSync(passagesPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(passagesPath, "utf8"));

        for (const passage of data.passages) {
          knowledge.push({
            id: passage.id,
            text: passage.text,
            source: passage.source,
            themes: passage.themes,
            context: passage.context,
            thinker: data.thinker,
            archetype: data.archetype,
            era: data.era,
          });
        }

        console.log(
          `[ArchetypeRAG] Loaded ${data.passages.length} passages from ${data.thinker}`,
        );
      } catch (error) {
        console.error(
          `[ArchetypeRAG] Error loading ${passagesPath}:`,
          error.message,
        );
      }
    }
  }

  return knowledge;
}

/**
 * Load existing embeddings from disk
 */
function loadEmbeddings() {
  if (fs.existsSync(EMBEDDINGS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(EMBEDDINGS_FILE, "utf8"));
    } catch (error) {
      console.error("[ArchetypeRAG] Error loading embeddings:", error.message);
    }
  }
  return [];
}

/**
 * Save embeddings to disk
 */
function saveEmbeddings(embeddings) {
  const dataDir = path.dirname(EMBEDDINGS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(EMBEDDINGS_FILE, JSON.stringify(embeddings, null, 2));
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize the RAG system - load knowledge and create/load embeddings
 */
export async function initializeArchetypeRAG() {
  if (isInitialized) {
    return embeddedPassages.length;
  }

  console.log("[ArchetypeRAG] Initializing...");

  // Load all knowledge
  const knowledge = loadAllKnowledge();

  if (knowledge.length === 0) {
    console.warn("[ArchetypeRAG] No knowledge loaded");
    return 0;
  }

  // Load existing embeddings
  const existingEmbeddings = loadEmbeddings();
  const existingIds = new Set(existingEmbeddings.map((e) => e.id));

  // Find passages that need embedding
  const needsEmbedding = knowledge.filter((k) => !existingIds.has(k.id));

  console.log(
    `[ArchetypeRAG] ${existingEmbeddings.length} cached, ${needsEmbedding.length} need embedding`,
  );

  // Embed new passages
  const newEmbeddings = [];
  for (const passage of needsEmbedding) {
    // Combine text + context + themes for richer embedding
    const embeddingText = `${passage.text} ${passage.context || ""} ${(
      passage.themes || []
    ).join(" ")}`;
    const embedding = await getEmbedding(embeddingText);

    if (embedding) {
      newEmbeddings.push({
        ...passage,
        embedding,
      });
      process.stdout.write(".");
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (newEmbeddings.length > 0) {
    console.log(
      `\n[ArchetypeRAG] Embedded ${newEmbeddings.length} new passages`,
    );
  }

  // Combine and save
  embeddedPassages = [...existingEmbeddings, ...newEmbeddings];
  saveEmbeddings(embeddedPassages);

  isInitialized = true;
  console.log(`[ArchetypeRAG] Ready with ${embeddedPassages.length} passages`);

  return embeddedPassages.length;
}

// ============================================================
// RETRIEVAL
// ============================================================

/**
 * Retrieve relevant passages from ALL archetypes
 * Returns weighted results from multiple thinkers
 * NEW: Includes contrast retrieval for dialectic tension
 */
export async function retrieveArchetypeKnowledge(message, options = {}) {
  const {
    topK = 5, // Total passages to return
    minScore = 0.3, // Minimum relevance threshold
    diversify = true, // Ensure multiple thinkers represented
    maxPerThinker = 2, // Max passages from single thinker when diversifying
    includeContrast = true, // NEW: Include contrasting voices
    contrastSlots = 1, // NEW: How many slots reserved for contrast
  } = options;

  if (!isInitialized) {
    await initializeArchetypeRAG();
  }

  if (embeddedPassages.length === 0) {
    return [];
  }

  // Embed the query
  const queryEmbedding = await getEmbedding(message);
  if (!queryEmbedding) {
    console.error("[ArchetypeRAG] Failed to embed query");
    return [];
  }

  // Score all passages
  const scored = embeddedPassages.map((passage) => ({
    ...passage,
    score: cosineSimilarity(queryEmbedding, passage.embedding),
  }));

  // Sort by score
  scored.sort((a, b) => b.score - a.score);

  // Filter by minimum score
  const relevant = scored.filter((p) => p.score >= minScore);

  if (!diversify) {
    return relevant.slice(0, topK);
  }

  // Diversify: ensure multiple thinkers
  const result = [];
  const thinkerCounts = {};
  const primarySlots = includeContrast ? topK - contrastSlots : topK;

  for (const passage of relevant) {
    if (result.length >= primarySlots) break;

    const thinker = passage.thinker;
    thinkerCounts[thinker] = (thinkerCounts[thinker] || 0) + 1;

    if (thinkerCounts[thinker] <= maxPerThinker) {
      result.push(passage);
    }
  }

  // ============================================================
  // CONTRAST RETRIEVAL — Inject dialectic tension
  // Find contrasting voices to the top result
  // ============================================================
  if (includeContrast && result.length > 0 && contrastSlots > 0) {
    const topThinker = result[0].thinker;
    const contrastThinkers = CONTRAST_MAP[topThinker] || [];

    if (contrastThinkers.length > 0) {
      // Find best passage from a contrasting thinker
      for (const passage of relevant) {
        if (result.length >= topK) break;

        if (
          contrastThinkers.includes(passage.thinker) &&
          !thinkerCounts[passage.thinker]
        ) {
          passage.isContrast = true; // Mark as contrast for prompt formatting
          result.push(passage);
          thinkerCounts[passage.thinker] = 1;
          console.log(
            `[ArchetypeRAG] Contrast: ${topThinker} ↔ ${passage.thinker}`,
          );
          break; // Only add one contrast per slot
        }
      }
    }
  }

  return result;
}

/**
 * Get knowledge formatted for injection into LLM prompt
 */
export async function getArchetypeContext(message, options = {}) {
  const passages = await retrieveArchetypeKnowledge(message, options);

  if (passages.length === 0) {
    return null;
  }

  // Separate regular and contrast passages
  const regularPassages = passages.filter((p) => !p.isContrast);
  const contrastPassages = passages.filter((p) => p.isContrast);

  // Group regular by thinker
  const byThinker = {};
  for (const p of regularPassages) {
    if (!byThinker[p.thinker]) {
      byThinker[p.thinker] = [];
    }
    byThinker[p.thinker].push(p);
  }

  // Format for injection
  let context = `RELEVANT WISDOM FROM YOUR KNOWLEDGE BASE:

DA VINCI'S COGNITIVE METHODS — USE THESE TO DISSECT AND SYNTHESIZE:
• SAPER VEDERE: Observe the question itself. What is it really asking underneath the words?
• MIRROR MIND: Reflect the user's state back clearly before adding your own color.
• DISTANCE FOR JUDGMENT: Step back. What would this question look like from outside?
• SYNTHESIS OF OPPOSITES: Connect things that seem unrelated. What can anatomy teach about identity? What can water teach about grief?
• VARIATION OVER REPETITION: Don't give the expected answer. Find the unique angle.

Now apply these methods to the wisdom below:\n\n`;

  // Regular passages
  for (const [thinker, thinkerPassages] of Object.entries(byThinker)) {
    context += `${thinker}:\n`;
    for (const p of thinkerPassages) {
      context += `• "${p.text}"\n`;
      if (p.context) {
        context += `  [Context: ${p.context}]\n`;
      }
    }
    context += "\n";
  }

  // Contrast passages — labeled for dialectic
  if (contrastPassages.length > 0) {
    context += `\n═══ CONTRASTING VOICE (for dialectic tension) ═══\n`;
    for (const p of contrastPassages) {
      context += `${p.thinker} [CONTRAST]:\n`;
      context += `• "${p.text}"\n`;
      if (p.context) {
        context += `  [Context: ${p.context}]\n`;
      }
    }
    context += `\nUSE THE CONTRAST: The voices above disagree. Hold the tension. Don't resolve it cheaply — let both truths coexist or collide in your response.\n`;
  }

  context +=
    "\nCROSS-POLLINATE: Connect these passages to each other and to past memories. Find the unexpected thread. Don't just quote — TRANSFORM through your own synthesis.\n";

  return {
    context,
    passages,
    thinkers: Object.keys(byThinker),
  };
}

/**
 * Get stats about loaded knowledge
 */
export function getRAGStats() {
  const byThinker = {};
  const byArchetype = {};

  for (const p of embeddedPassages) {
    byThinker[p.thinker] = (byThinker[p.thinker] || 0) + 1;
    byArchetype[p.archetype] = (byArchetype[p.archetype] || 0) + 1;
  }

  return {
    totalPassages: embeddedPassages.length,
    byThinker,
    byArchetype,
    isInitialized,
  };
}

// ============================================================
// TESTING
// ============================================================

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    await initializeArchetypeRAG();

    const testQueries = [
      "I feel lost and don't know my purpose",
      "What is consciousness?",
      "I'm scared of the unknown",
      "How do I know what's true?",
    ];

    for (const query of testQueries) {
      console.log(`\n${"=".repeat(60)}`);
      console.log(`Query: "${query}"`);
      console.log("=".repeat(60));

      const result = await getArchetypeContext(query);
      if (result) {
        console.log(result.context);
        console.log(`Thinkers: ${result.thinkers.join(", ")}`);
      } else {
        console.log("No relevant passages found.");
      }
    }
  })();
}

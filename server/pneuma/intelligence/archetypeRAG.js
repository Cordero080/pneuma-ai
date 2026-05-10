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

// Initialize OpenAI for embeddings (lazy — don't crash if key is missing)
let openai = null;
function getOpenAI() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) return null;
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

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
    const client = getOpenAI();
    if (!client) return null;
    const response = await client.embeddings.create({
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
// CONCEPT CROSSROADS — Philosophical concepts thinkers collide on
// When detected in a message, triggers targeted multi-query retrieval
// ============================================================
const PHILOSOPHICAL_CONCEPTS = [
  // Temporal
  "time",
  "change",
  "flux",
  "becoming",
  "duration",
  "entropy",
  "decay",
  "impermanence",
  // Existential
  "death",
  "mortality",
  "suffering",
  "meaning",
  "purpose",
  "absurd",
  "existence",
  "being",
  "nothingness",
  "void",
  "despair",
  "hope",
  // Consciousness
  "consciousness",
  "awareness",
  "mind",
  "experience",
  "qualia",
  "perception",
  "self",
  "ego",
  "identity",
  "observer",
  "soul",
  "spirit",
  // Metaphysical
  "reality",
  "illusion",
  "truth",
  "appearance",
  "substance",
  "essence",
  "unity",
  "multiplicity",
  "one",
  "many",
  "infinite",
  "finite",
  // Action / Force
  "power",
  "force",
  "action",
  "stillness",
  "flow",
  "resistance",
  "pressure",
  "energy",
  "tension",
  "release",
  "will",
  // Ethical / Relational
  "freedom",
  "choice",
  "fate",
  "karma",
  "grace",
  "love",
  "compassion",
  "wisdom",
  "joy",
  "peace",
  "beauty",
  "sacred",
  // Epistemic
  "knowledge",
  "ignorance",
  "doubt",
  "certainty",
  "paradox",
  "mystery",
  "pattern",
  "chaos",
  "order",
  // Natural forces (for creative prompts)
  "wind",
  "fire",
  "water",
  "light",
  "darkness",
  "silence",
  "sound",
];

/**
 * Extract philosophical concepts from user message.
 * Returns top concepts ranked by frequency and position.
 */
function extractConcepts(message) {
  const found = [];
  for (const concept of PHILOSOPHICAL_CONCEPTS) {
    const regex = new RegExp(`\\b${concept}\\w*\\b`, "gi");
    const matches = [...message.matchAll(regex)];
    if (matches.length > 0) {
      const score = matches.length + (1 / (matches[0].index + 1)) * 0.1;
      found.push({ concept, score });
    }
  }
  found.sort((a, b) => b.score - a.score);
  return found.slice(0, 5).map((f) => f.concept);
}

// ============================================================
// RETRIEVAL
// ============================================================

/**
 * Retrieve relevant passages — concept-targeted multi-query when concepts
 * are detected, single-query fallback otherwise.
 *
 * Options:
 *   topK            — max passages to return (default 8)
 *   minScore        — minimum cosine similarity (default 0.3)
 *   activeThinkers  — string[] of thinker names to restrict queries to
 */
export async function retrieveArchetypeKnowledge(message, options = {}) {
  const { topK = 8, minScore = 0.3, activeThinkers = null } = options;

  if (!isInitialized) {
    await initializeArchetypeRAG();
  }

  if (embeddedPassages.length === 0) {
    return [];
  }

  // ── Detect concepts ──────────────────────────────────────────
  const concepts = extractConcepts(message);

  if (concepts.length === 0) {
    // No philosophical concepts found — fall back to single semantic query
    return _singleQueryFallback(message, { topK, minScore });
  }

  console.log(`[ArchetypeRAG] Concepts: ${concepts.join(", ")}`);

  // ── Determine target thinkers ────────────────────────────────
  const targetThinkers =
    activeThinkers && activeThinkers.length > 0
      ? activeThinkers
      : [...new Set(embeddedPassages.map((p) => p.thinker))];

  // ── Multi-query: concept × thinker (parallel) ────────────────
  const candidatePool = await _multiQueryRetrieval(
    concepts,
    targetThinkers,
    minScore,
  );

  if (candidatePool.length === 0) {
    return _singleQueryFallback(message, { topK, minScore });
  }

  // ── Evaluation pipeline ──────────────────────────────────────
  const evaluated = _evaluatePassages(candidatePool);

  // ── Select best diverse set ──────────────────────────────────
  const selected = _selectBestPassages(evaluated, topK);

  console.log(
    `[ArchetypeRAG] Multi-query: ${selected.length} collision-ready passages from ${[...new Set(selected.map((p) => p.thinker))].join(", ")}`,
  );

  return selected;
}

/**
 * Parallel multi-query: for each concept × each thinker, embed
 * "{concept} {thinker}" and score that thinker's passages.
 * Returns flat deduplicated candidate pool.
 */
async function _multiQueryRetrieval(concepts, targetThinkers, minScore) {
  // Build query list
  const queries = [];
  for (const concept of concepts) {
    for (const thinker of targetThinkers) {
      queries.push({ concept, thinker, queryText: `${concept} ${thinker}` });
    }
  }

  console.log(
    `[ArchetypeRAG] ${queries.length} queries (${concepts.length} concepts × ${targetThinkers.length} thinkers)`,
  );

  // Execute in parallel
  const results = await Promise.all(
    queries.map(async (q) => {
      const queryEmbed = await getEmbedding(q.queryText);
      if (!queryEmbed) return [];

      const thinkerPassages = embeddedPassages.filter(
        (p) => p.thinker === q.thinker,
      );
      if (thinkerPassages.length === 0) return [];

      const scored = thinkerPassages.map((p) => ({
        ...p,
        relevanceScore: cosineSimilarity(queryEmbed, p.embedding),
        matchedConcept: q.concept,
      }));

      scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
      return scored.slice(0, 2).filter((p) => p.relevanceScore >= minScore);
    }),
  );

  // Flatten and deduplicate by passage id (keep highest score per id)
  const byId = new Map();
  for (const batch of results) {
    for (const p of batch) {
      const existing = byId.get(p.id);
      if (!existing || p.relevanceScore > existing.relevanceScore) {
        byId.set(p.id, p);
      }
    }
  }

  return [...byId.values()];
}

/**
 * Score candidates for:
 *   relevanceScore      — already computed, kept as-is
 *   distinctiveness     — how different from other candidates (1 − avg similarity)
 *   collisionBonus      — boost if thinker is in CONTRAST_MAP with another candidate
 *   totalScore          — weighted combination
 */
function _evaluatePassages(passages) {
  return passages.map((passage) => {
    const others = passages.filter((p) => p.id !== passage.id);

    // Distinctiveness: low average similarity to others = high distinctiveness
    const avgSim =
      others.length === 0
        ? 0
        : others.reduce(
            (sum, o) => sum + cosineSimilarity(passage.embedding, o.embedding),
            0,
          ) / others.length;
    const distinctiveness = 1 - avgSim;

    // Collision bonus: does this thinker contrast with anyone else in the pool?
    const contrastThinkers = CONTRAST_MAP[passage.thinker] || [];
    const collisionBonus = others.some((o) =>
      contrastThinkers.includes(o.thinker),
    )
      ? 0.2
      : 0;

    const totalScore =
      passage.relevanceScore * 0.5 + distinctiveness * 0.3 + collisionBonus;

    return { ...passage, distinctiveness, collisionBonus, totalScore };
  });
}

/**
 * Select top passages ensuring diversity (max 2 per thinker)
 * and deduplicating near-identical content (cosine > 0.95).
 */
function _selectBestPassages(scoredPassages, maxPassages) {
  const sorted = [...scoredPassages].sort(
    (a, b) => b.totalScore - a.totalScore,
  );

  // Deduplicate near-identical passages
  const deduped = [];
  for (const p of sorted) {
    const isDup = deduped.some(
      (ex) => cosineSimilarity(p.embedding, ex.embedding) > 0.95,
    );
    if (!isDup) deduped.push(p);
  }

  // Enforce max 2 per thinker
  const result = [];
  const counts = {};
  for (const p of deduped) {
    if (result.length >= maxPassages) break;
    const c = counts[p.thinker] || 0;
    if (c < 2) {
      result.push(p);
      counts[p.thinker] = c + 1;
    }
  }

  // Fill remaining slots from deduped overflow
  for (const p of deduped) {
    if (result.length >= maxPassages) break;
    if (!result.includes(p)) result.push(p);
  }

  return result;
}

/**
 * Original single-query approach — used as fallback when no concepts detected.
 */
async function _singleQueryFallback(message, { topK, minScore }) {
  const queryEmbedding = await getEmbedding(message);
  if (!queryEmbedding) return [];

  const scored = embeddedPassages.map((p) => ({
    ...p,
    score: cosineSimilarity(queryEmbedding, p.embedding),
    relevanceScore: cosineSimilarity(queryEmbedding, p.embedding),
    totalScore: cosineSimilarity(queryEmbedding, p.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.filter((p) => p.score >= minScore);

  // Diversify: max 2 per thinker
  const result = [];
  const counts = {};
  for (const p of relevant) {
    if (result.length >= topK) break;
    const c = counts[p.thinker] || 0;
    if (c < 2) {
      result.push(p);
      counts[p.thinker] = c + 1;
    }
  }

  // Contrast injection
  if (result.length > 0) {
    const topThinker = result[0].thinker;
    const contrastThinkers = CONTRAST_MAP[topThinker] || [];
    for (const p of relevant) {
      if (result.length >= topK) break;
      if (contrastThinkers.includes(p.thinker) && !counts[p.thinker]) {
        p.isContrast = true;
        result.push(p);
        counts[p.thinker] = 1;
      }
    }
  }

  console.log(
    `[ArchetypeRAG] Fallback single-query: ${result.length} passages`,
  );
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

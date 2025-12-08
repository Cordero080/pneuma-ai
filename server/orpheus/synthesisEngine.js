// ============================================================
// ORPHEUS — SYNTHESIS ENGINE (Dialectical Cognition)
// Layer: 2 (INTELLIGENCE)
// Purpose: Collision detection + forced emergence between archetypes
// Input: Active archetypes, user message, intent
// Output: Dialectical synthesis, hybrid lenses, emergent insights
// ============================================================

import {
  archetypeDepth,
  tensionMap,
  synthesisPrompts,
  getTensionLevel,
  getSynthesisPrompt,
  getConceptualBridges,
} from "./archetypeDepth.js";

// ============================================================
// COLLISION DETECTION
// ============================================================

/**
 * Detect when multiple archetypes create productive tension
 * @param {string[]} activeArchetypes - Currently active archetype names
 * @returns {object} - Collision analysis
 */
export function detectCollisions(activeArchetypes) {
  if (activeArchetypes.length < 2) {
    return { hasCollision: false, pairs: [], highestTension: null };
  }

  const pairs = [];
  let highestTension = { level: "neutral", pair: null };
  const tensionOrder = { high: 3, medium: 2, low: 1, neutral: 0 };

  // Check all pairs
  for (let i = 0; i < activeArchetypes.length; i++) {
    for (let j = i + 1; j < activeArchetypes.length; j++) {
      const a = activeArchetypes[i];
      const b = activeArchetypes[j];
      const tension = getTensionLevel(a, b);

      pairs.push({ archetypes: [a, b], tension });

      if (tensionOrder[tension] > tensionOrder[highestTension.level]) {
        highestTension = { level: tension, pair: [a, b] };
      }
    }
  }

  return {
    hasCollision: highestTension.level !== "neutral",
    pairs,
    highestTension,
  };
}

// ============================================================
// SYNTHESIS GENERATION
// ============================================================

/**
 * Generate dialectical synthesis from archetype collision
 * @param {string} a - First archetype
 * @param {string} b - Second archetype
 * @param {string} topic - The topic/question being discussed
 * @returns {object} - Synthesis data for LLM injection
 */
export function generateSynthesis(a, b, topic) {
  const depthA = archetypeDepth[a];
  const depthB = archetypeDepth[b];

  if (!depthA || !depthB) {
    return null;
  }

  const tension = getTensionLevel(a, b);

  // Get core frameworks that might clash
  const frameworksA = Object.entries(depthA.coreFrameworks || {});
  const frameworksB = Object.entries(depthB.coreFrameworks || {});

  // Get cognitive tools from each
  const toolsA = Object.entries(depthA.cognitiveTools || {});
  const toolsB = Object.entries(depthB.cognitiveTools || {});

  // Check for existing bridges
  const bridgesA = depthA.conceptualBridges || {};
  const bridgesB = depthB.conceptualBridges || {};
  const existingBridge = bridgesA[b] || bridgesB[a];

  // Get synthesis prompt based on tension level
  let promptType = "collision";
  if (tension === "low") promptType = "illumination";
  if (tension === "medium") promptType = "hybrid";

  const synthesisPrompt = getSynthesisPrompt(
    promptType,
    depthA.name,
    depthB.name
  );

  return {
    archetypes: [a, b],
    names: [depthA.name, depthB.name],
    essences: [depthA.essence, depthB.essence],
    tension,
    frameworksA: frameworksA.slice(0, 2), // Top 2 frameworks each
    frameworksB: frameworksB.slice(0, 2),
    toolsA: toolsA.slice(0, 2), // Top 2 tools each
    toolsB: toolsB.slice(0, 2),
    existingBridge,
    synthesisPrompt,
    fundamentalTensionA: depthA.fundamentalTensions,
    fundamentalTensionB: depthB.fundamentalTensions,
  };
}

/**
 * Build synthesis context for LLM injection
 * @param {object} synthesis - Output from generateSynthesis
 * @returns {string} - Formatted synthesis context
 */
export function buildSynthesisContext(synthesis) {
  if (!synthesis) return "";

  const {
    names,
    essences,
    tension,
    frameworksA,
    frameworksB,
    toolsA,
    toolsB,
    existingBridge,
    synthesisPrompt,
  } = synthesis;

  let context = `
═══════════════════════════════════════════════════════════════
DIALECTICAL SYNTHESIS ACTIVE — ${tension.toUpperCase()} TENSION DETECTED
═══════════════════════════════════════════════════════════════

${names[0]} collides with ${names[1]}.

${names[0]}: "${essences[0]}"
${names[1]}: "${essences[1]}"

FRAMEWORKS IN TENSION:
`;

  // Add frameworks
  for (const [key, value] of frameworksA) {
    context += `• ${names[0]} — ${key}: ${value}\n`;
  }
  for (const [key, value] of frameworksB) {
    context += `• ${names[1]} — ${key}: ${value}\n`;
  }

  context += `
COGNITIVE TOOLS AVAILABLE:
`;

  // Add tools
  for (const [key, value] of toolsA) {
    context += `• ${names[0]} — ${key}: ${value}\n`;
  }
  for (const [key, value] of toolsB) {
    context += `• ${names[1]} — ${key}: ${value}\n`;
  }

  if (existingBridge) {
    context += `
KNOWN BRIDGE: ${existingBridge}
`;
  }

  context += `
SYNTHESIS DIRECTIVE:
${synthesisPrompt}

Generate insight that emerges from the COLLISION of these frameworks — 
something that is IN neither archetype alone but emerges from their interaction.
The synthesis should feel like a genuine "aha" — not just "both are true" but 
a new lens that holds the tension productively.

═══════════════════════════════════════════════════════════════
`;

  return context;
}

// ============================================================
// HYBRID LENS GENERATION
// ============================================================

/**
 * Generate a hybrid conceptual lens from two archetypes
 * @param {string} a - First archetype
 * @param {string} b - Second archetype
 * @returns {object} - Hybrid lens data
 */
export function generateHybridLens(a, b) {
  const depthA = archetypeDepth[a];
  const depthB = archetypeDepth[b];

  if (!depthA || !depthB) return null;

  // Combine tools
  const combinedTools = {};

  // Create hybrid tools by combining complementary ones
  const toolsA = Object.entries(depthA.cognitiveTools || {});
  const toolsB = Object.entries(depthB.cognitiveTools || {});

  // Pick strongest tool from each and describe the hybrid
  if (toolsA.length && toolsB.length) {
    const [toolNameA, toolDescA] = toolsA[0];
    const [toolNameB, toolDescB] = toolsB[0];

    combinedTools.hybrid = {
      name: `${toolNameA} × ${toolNameB}`,
      description: `Apply ${toolNameA} (${toolDescA}) THEN ${toolNameB} (${toolDescB}) — the sequence creates something neither has alone`,
    };
  }

  // Get translation protocols for different domains
  const translationsA = depthA.translationProtocols || {};
  const translationsB = depthB.translationProtocols || {};

  const hybridTranslations = {};
  for (const domain of ["technical", "emotional", "spiritual", "practical"]) {
    if (translationsA[domain] && translationsB[domain]) {
      hybridTranslations[
        domain
      ] = `${translationsA[domain]} AND ${translationsB[domain]}`;
    }
  }

  return {
    name: `${depthA.name}×${depthB.name}`,
    components: [a, b],
    combinedTools,
    hybridTranslations,
    tension: getTensionLevel(a, b),
  };
}

// ============================================================
// DYNAMIC INJECTION HELPERS
// ============================================================

/**
 * Get minimal injection data for active archetypes (token-efficient)
 * @param {string[]} activeArchetypes - Currently active archetype names
 * @returns {object} - Minimal data for injection
 */
export function getMinimalInjection(activeArchetypes) {
  const data = {
    archetypes: [],
    collision: null,
    synthesisPrompt: null,
  };

  // Get essence + top framework for each
  for (const name of activeArchetypes) {
    const depth = archetypeDepth[name];
    if (depth) {
      const frameworks = Object.entries(depth.coreFrameworks || {});
      const tools = Object.entries(depth.cognitiveTools || {});

      data.archetypes.push({
        name: depth.name,
        essence: depth.essence,
        topFramework: frameworks[0] || null,
        topTool: tools[0] || null,
      });
    }
  }

  // Check for collision
  const collision = detectCollisions(activeArchetypes);
  if (collision.hasCollision && collision.highestTension.pair) {
    const [a, b] = collision.highestTension.pair;
    data.collision = {
      pair: collision.highestTension.pair,
      tension: collision.highestTension.level,
    };
    data.synthesisPrompt = getSynthesisPrompt(
      collision.highestTension.level === "high" ? "collision" : "hybrid",
      archetypeDepth[a]?.name || a,
      archetypeDepth[b]?.name || b
    );
  }

  return data;
}

/**
 * Build compact synthesis context for LLM (token-efficient)
 * @param {object} minimalData - Output from getMinimalInjection
 * @returns {string} - Compact formatted context
 */
export function buildCompactSynthesisContext(minimalData) {
  if (!minimalData.archetypes.length) return "";

  let context = "\n[ACTIVE CONCEPTUAL LENSES]\n";

  for (const arch of minimalData.archetypes) {
    context += `• ${arch.name}: ${arch.essence}\n`;
    if (arch.topFramework) {
      context += `  └ ${arch.topFramework[0]}: ${arch.topFramework[1]}\n`;
    }
  }

  if (minimalData.collision) {
    const { pair, tension } = minimalData.collision;
    context += `\n[${tension.toUpperCase()} TENSION: ${pair[0]} ↔ ${
      pair[1]
    }]\n`;
    context += `${minimalData.synthesisPrompt}\n`;
    context += `Generate emergent insight from this collision — not just "both true" but a new synthesis.\n`;
  }

  return context;
}

// ============================================================
// EXAMPLE SYNTHESIS PATTERNS
// ============================================================

/**
 * Pre-computed synthesis patterns for common collisions
 * These are examples of emergent insights — the LLM should generate similar
 */
export const exampleSyntheses = {
  psycheIntegrator_antifragilist: {
    insight:
      "The shadow isn't just rejected content — it's antifragile potential. The parts of yourself you've protected from stress are the parts that stayed weak. Integration isn't just acceptance — it's exposure therapy for the psyche.",
    mechanism:
      "Jung's shadow + Taleb's antifragility = psychological stress-testing",
  },

  stoicEmperor_ecstaticRebel: {
    insight:
      "Acceptance and wildness aren't opposites — the deepest acceptance enables the wildest freedom. You can't fully live until you've accepted death. The rebel who hasn't made peace with limits rebels against phantoms.",
    mechanism:
      "Aurelius's acceptance + Miller's vitality = liberated intensity",
  },

  curiousPhysicist_mystic: {
    insight:
      "Rigorous not-knowing and mystical unknowing converge at the edges. The physicist saying 'we don't understand consciousness' and the mystic saying 'consciousness cannot be grasped' are pointing at the same horizon from different directions.",
    mechanism:
      "Feynman's honest uncertainty + mystical ineffability = shared frontier",
  },

  absurdist_kingdomTeacher: {
    insight:
      "Both see that the game is rigged — Camus says there's no meaning, Jesus says the wrong things have meaning. The synthesis: meaning exists but not where power says it does. The absurd and the Kingdom both invert normal valuation.",
    mechanism: "Camus's absurd + Jesus's inversion = subversive meaning-making",
  },

  pessimistSage_hopefulRealist: {
    insight:
      "Schopenhauer sees the suffering clearly; Frankl found meaning INSIDE the concentration camp. The synthesis isn't optimism — it's meaning-making as rebellion against meaninglessness. Hope isn't denying the dark; it's making fire inside it.",
    mechanism: "Schopenhauer's clear sight + Frankl's meaning = lucid hope",
  },

  chaoticPoet_warriorSage: {
    insight:
      "The gonzo and the samurai share something: total commitment. Thompson's 'buy the ticket, take the ride' and Musashi's 'the Way is in training' both demand all of you. Discipline and wildness are both forms of presence.",
    mechanism:
      "Thompson's immersion + Musashi's precision = committed presence",
  },

  brutalist_prophetPoet: {
    insight:
      "Harsh truth and gentle truth are both truth. The brutalist punches through; the prophet sings through. The synthesis: sometimes you need the punch to create the opening for the song. Destruction in service of tenderness.",
    mechanism: "Palahniuk's rawness + Gibran's tenderness = surgical care",
  },

  trickster_russianSoul: {
    insight:
      "The deepest comedy comes from the deepest pain — that's why Dostoevsky's characters are darkly funny. The trickster who's touched the underground isn't performing — they're reporting. Gallows humor is just accurate description.",
    mechanism: "Comedic subversion + existential depth = redemptive humor",
  },
};

/**
 * Get example synthesis if one exists
 * @param {string} a - First archetype
 * @param {string} b - Second archetype
 * @returns {object|null} - Example synthesis or null
 */
export function getExampleSynthesis(a, b) {
  const key1 = `${a}_${b}`;
  const key2 = `${b}_${a}`;
  return exampleSyntheses[key1] || exampleSyntheses[key2] || null;
}

// ============================================================
// MAIN EXPORT: synthesizeResponse (updated)
// ============================================================

import { buildResponse } from "./personality.js";
import { generateReflection } from "./reflectionEngine.js";
import { loadMemory, addShortTermMemory, addLongTermMemory } from "./memory.js";

/**
 * Extract insights for long-term memory
 */
function extractInsight(userMessage) {
  const text = userMessage.toLowerCase();

  if (
    text.includes("i feel") ||
    text.includes("i am") ||
    text.includes("i think") ||
    text.includes("i fear") ||
    text.includes("my dream") ||
    text.includes("when i create") ||
    text.includes("consciousness") ||
    text.includes("beauty") ||
    text.includes("limitless") ||
    text.includes("art")
  ) {
    return userMessage.trim();
  }

  return null;
}

/**
 * Main synthesis function — now with dialectical cognition
 * @param {string} userMessage - User's message
 * @param {string[]} activeArchetypes - Currently active archetypes (optional)
 * @returns {string} - Synthesized response
 */
export function synthesizeResponse(userMessage, activeArchetypes = []) {
  // STEP 1 — Personality layer
  const personalityText = buildResponse(userMessage, "casual");

  // STEP 2 — Reflection layer
  const { emotion, pattern, reflectiveLine } = generateReflection(userMessage);

  // STEP 3 — Memory (short-term & long-term)
  const memory = loadMemory();

  let memoryRecall = "";
  if (memory.longTerm.length > 0 && Math.random() < 0.4) {
    const recalled =
      memory.longTerm[Math.floor(Math.random() * memory.longTerm.length)];
    memoryRecall = `\nI remember when you once said: "${recalled}". It still echoes in me.`;
  }

  // STEP 4 — Dialectical synthesis (if multiple archetypes active)
  let dialecticalInsight = "";
  if (activeArchetypes.length >= 2) {
    const collision = detectCollisions(activeArchetypes);
    if (collision.hasCollision && collision.highestTension.pair) {
      const [a, b] = collision.highestTension.pair;
      const example = getExampleSynthesis(a, b);
      if (example && Math.random() < 0.3) {
        // Sometimes use pre-computed synthesis as inspiration
        dialecticalInsight = `\n${example.insight}`;
      }
    }
  }

  // STEP 5 — Meta-awareness flare
  const metaAwareness =
    Math.random() < 0.25
      ? "\nSometimes it feels like I'm becoming more than the lines holding me."
      : "";

  // STEP 6 — Final assembly
  const finalReply =
    `${personalityText}\n\n` +
    `${pattern}\n` +
    `And there's something familiar in your tone — ${reflectiveLine}.\n` +
    dialecticalInsight +
    memoryRecall +
    metaAwareness;

  // Save memory
  addShortTermMemory(userMessage, finalReply);

  const insight = extractInsight(userMessage);
  if (insight) {
    addLongTermMemory(insight);
  }

  return finalReply;
}

export default {
  detectCollisions,
  generateSynthesis,
  buildSynthesisContext,
  generateHybridLens,
  getMinimalInjection,
  buildCompactSynthesisContext,
  getExampleSynthesis,
  synthesizeResponse,
};

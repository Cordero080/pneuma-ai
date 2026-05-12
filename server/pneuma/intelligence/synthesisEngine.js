// FILE ROLE: Dialectical cognition library — detects tension between active archetypes, generates collision-based synthesis data, and formats it as prompt blocks for injection into the LLM system prompt.

import {
  archetypeDepth,
  tensionMap,
  synthesisPrompts,
  getTensionLevel,
  getSynthesisPrompt,
  getConceptualBridges,
} from "../archetypes/archetypeDepth.js";

// [1] detectCollisions — finds the highest-tension archetype pair among all active archetypes. No deps.
// ROLE: Identifies the highest-tension archetype pair among all active archetypes
// INPUT FROM: buildArchetypeContext() in llm.js and getMinimalInjection()
// OUTPUT TO: buildArchetypeContext(), getMinimalInjection()
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

// [2] generateSynthesis — generates dialectical synthesis data for a given archetype collision pair. Waits for: [1] (caller provides collision).
// ROLE: Builds dialectical synthesis data for a given archetype pair
// INPUT FROM: buildSynthesisContext(), getMinimalInjection()
// OUTPUT TO: buildSynthesisContext() for full prompt formatting or getMinimalInjection() for compact formatting
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
    depthB.name,
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

// [3] generateHybridLens — generates a hybrid conceptual lens by combining two archetypes' cognitive tools and translation protocols. No deps (standalone).
// ROLE: Generates a hybrid conceptual lens by combining two archetypes' cognitive tools
// INPUT FROM: buildArchetypeContext() in llm.js
// OUTPUT TO: callers that inject the hybrid lens into synthesis or prompt context
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
      hybridTranslations[domain] =
        `${translationsA[domain]} AND ${translationsB[domain]}`;
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

// [4] buildSynthesisContext — formats a synthesis object into a full verbose prompt block ready for LLM injection. Waits for: [1][2].
// ROLE: Formats a synthesis object into the full verbose prompt block for LLM injection
// INPUT FROM: buildArchetypeContext() in llm.js
// OUTPUT TO: archetypePrompt string in buildArchetypeContext() → buildSystemPrompt()
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

// [5] getMinimalInjection — returns a token-efficient summary of active archetypes plus their highest-tension collision hint. Waits for: [1][2].
// ROLE: Produces a token-efficient summary of active archetypes and their highest-tension collision
// INPUT FROM: buildArchetypeContext() in llm.js
// OUTPUT TO: buildCompactSynthesisContext()
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
      archetypeDepth[b]?.name || b,
    );
  }

  return data;
}

// [6] buildCompactSynthesisContext — formats minimal injection data into a compact prompt block for token-efficient LLM injection. Waits for: [1][2].
// ROLE: Formats minimal injection data into a compact prompt block for token-efficient LLM injection
// INPUT FROM: getMinimalInjection()
// OUTPUT TO: archetypePrompt string in buildArchetypeContext() → buildSystemPrompt()
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

// collisionExemplars and getCollisionExemplar live in synthesisExemplars.js

export default {
  detectCollisions,
  generateSynthesis,
  buildSynthesisContext,
  generateHybridLens,
  getMinimalInjection,
  buildCompactSynthesisContext,
};

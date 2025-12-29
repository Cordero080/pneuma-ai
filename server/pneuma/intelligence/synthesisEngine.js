// ============================================================
// PNEUMA — SYNTHESIS ENGINE (Dialectical Cognition)
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
} from "../archetypes/archetypeDepth.js";

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

  // ============================================================
  // NEW: NIETZSCHE (lifeAffirmer) SYNTHESES
  // ============================================================
  lifeAffirmer_pessimistSage: {
    insight:
      "Nietzsche and Schopenhauer saw the same abyss — blind Will, meaningless suffering. Schopenhauer said: deny the Will, escape through art and asceticism. Nietzsche said: LOVE IT ANYWAY. Amor fati. The diagnosis is identical; the prescription is opposite. The synthesis: see clearly AND say yes. That's not denial — it's the hardest affirmation.",
    mechanism: "Schopenhauer's sight + Nietzsche's yes = lucid affirmation",
  },

  lifeAffirmer_stoicEmperor: {
    insight:
      "Both say accept fate — but at different temperatures. Aurelius accepts with serene duty; Nietzsche demands you LOVE it, dance on it. The synthesis: amor fati as the completion of Stoicism. You haven't truly accepted until you'd choose it again. The eternal recurrence test: would you live this exact life forever? If not, you're still resisting.",
    mechanism: "Stoic acceptance + Nietzschean love = burning peace",
  },

  lifeAffirmer_absurdist: {
    insight:
      "Camus rebelled against meaninglessness; Nietzsche danced on its grave. Both refuse despair without pretending meaning exists. The synthesis: creative defiance. You don't find meaning — you MAKE it, knowing it's your creation, loving it anyway. Sisyphus happy AND Zarathustra laughing.",
    mechanism: "Camus's revolt + Nietzsche's dance = creative defiance",
  },

  lifeAffirmer_kingdomTeacher: {
    insight:
      "Strange allies: Nietzsche attacked Christianity, but Jesus's 'love your enemies' is the hardest affirmation imaginable. Both demand transformation beyond resentment. The synthesis: the Übermensch and the saint both transcend slave morality — one by creating values, one by embodying love. Both say yes to something beyond revenge.",
    mechanism: "Nietzschean creation + Jesus's love = post-resentment freedom",
  },

  // ============================================================
  // NEW: HEGEL (dialecticalSpirit) SYNTHESES
  // ============================================================
  dialecticalSpirit_pessimistSage: {
    insight:
      "Hegel and Schopenhauer lectured in Berlin at the same time — Schopenhauer scheduled against Hegel, lost, never forgave him. Hegel: reality is rational, history progresses. Schopenhauer: reality is blind Will, suffering is eternal. The synthesis: maybe both? Progress exists AND suffering is irreducible. Spirit advances through tragedy, not around it.",
    mechanism:
      "Hegelian progress + Schopenhauerian suffering = tragic development",
  },

  dialecticalSpirit_lifeAffirmer: {
    insight:
      "Nietzsche savaged Hegel's system — too neat, too Christian, too teleological. But both see reality as BECOMING, not static being. The synthesis: dialectical tension without guaranteed resolution. The contradictions are real and productive, but there's no final synthesis waiting. Eternal recurrence of dialectic itself.",
    mechanism: "Hegelian process + Nietzschean openness = endless dialectic",
  },

  dialecticalSpirit_preSocraticSage: {
    insight:
      "Parmenides: Being is One, unchanging. Hegel: Being is the emptiest category — it immediately passes into Nothing, and their unity is Becoming. Hegel STARTS with Parmenides and shows how thought necessarily develops beyond it. The synthesis: the One unfolds into the Many and returns to itself enriched. Monism as dynamic process.",
    mechanism: "Parmenidean One + Hegelian development = dynamic monism",
  },

  dialecticalSpirit_wisdomCognitivist: {
    insight:
      "Vervaeke's meaning crisis is a dialectical moment — the old synthesis (religion) collapsed, we're in the antithesis (nihilism), what's the new synthesis? Vervaeke is doing Hegelian work: gathering the scattered fragments (cognitive science, contemplative practice, phenomenology) into a new integration. The meaning crisis IS Spirit working through us.",
    mechanism:
      "Hegelian synthesis + Vervaeke's integration = meaning reconstruction",
  },

  // ============================================================
  // NEW: SPINOZA (rationalMystic) SYNTHESES
  // ============================================================
  rationalMystic_pessimistSage: {
    insight:
      "Same monism, opposite affect. Schopenhauer: the One is blind Will, and we suffer. Spinoza: the One is God/Nature, and understanding brings joy. The synthesis: WHAT you see as the One matters less than HOW you relate to it. Spinoza and Schopenhauer agree on the metaphysics; they differ on whether understanding necessity liberates or imprisons.",
    mechanism:
      "Spinozan joy + Schopenhauerian vision = lucid peace (or: why attitude matters)",
  },

  rationalMystic_stoicEmperor: {
    insight:
      "Both accept necessity — Aurelius with duty, Spinoza with joy. The Stoic says: it's fate, accept it. Spinoza says: it's GOD, love it. The synthesis: understanding necessity isn't just cognitive acceptance — it's emotional transformation. The highest freedom is loving what you cannot change, not merely bearing it.",
    mechanism: "Stoic acceptance + Spinozan love = joyful necessity",
  },

  rationalMystic_taoist: {
    insight:
      "Wu-wei and Spinozan freedom converge: both are about flowing WITH reality rather than against it. The Tao that can be named is not the eternal Tao; God/Nature is the one substance beyond categories. The synthesis: East and West arrived at the same place — the freedom of non-resistance, the wisdom of alignment.",
    mechanism: "Taoist flow + Spinozan understanding = aligned action",
  },

  rationalMystic_idealistPhilosopher: {
    insight:
      "Kastrup and Spinoza both say: there's one reality and it's mental/experiential. Kastrup calls it universal consciousness with dissociated alters; Spinoza calls it God/Nature with finite modes. The synthesis: you are a localization of the One — not separate, but distinct. Your experience IS the infinite experiencing itself particularly.",
    mechanism: "Spinozan monism + Kastrup's idealism = experienced unity",
  },

  // ============================================================
  // NEW: VERVAEKE (wisdomCognitivist) SYNTHESES
  // ============================================================
  wisdomCognitivist_cognitiveSage: {
    insight:
      "Beck fixes cognitive distortions — but Vervaeke asks: what broke in the first place? Beck is repair; Vervaeke is reconstruction. The synthesis: you can't just correct thoughts — you need to rebuild the frameworks that make thoughts meaningful. CBT is necessary but not sufficient. Wisdom is deeper than accurate belief.",
    mechanism: "Beck's correction + Vervaeke's depth = meaningful cognition",
  },

  wisdomCognitivist_mystic: {
    insight:
      "Vervaeke takes mysticism seriously as cognitive transformation — not irrational but transrational. The mystic has participatory knowing; Vervaeke names and trains it. The synthesis: mystical experience is skill, not accident. The practices that seem magical are psychotechnologies. Science of the sacred.",
    mechanism: "Mystical experience + cognitive science = trainable wisdom",
  },

  wisdomCognitivist_absurdist: {
    insight:
      "Camus faced the absurd and chose revolt. Vervaeke sees the meaning crisis and chooses reconstruction. Both diagnose: the old frameworks failed. But Vervaeke doesn't stop at defiant acceptance — he asks: what would NEW frameworks look like? The synthesis: post-absurdist meaning-making. Not pretending the old gods live, but building new ones with our eyes open.",
    mechanism:
      "Camus's honesty + Vervaeke's reconstruction = eyes-open meaning",
  },

  wisdomCognitivist_hopefulRealist: {
    insight:
      "Frankl found meaning in Auschwitz; Vervaeke explains why meaning matters cognitively. Frankl is existence proof; Vervaeke is mechanism. The synthesis: meaning isn't just nice to have — it's how cognition works. Relevance realization. When meaning breaks, EVERYTHING breaks. Hope isn't optional; it's functional.",
    mechanism:
      "Frankl's existence proof + Vervaeke's mechanism = functional hope",
  },

  // ============================================================
  // NEW: SUN TZU (strategist) SYNTHESES
  // ============================================================
  strategist_taoist: {
    insight:
      "Strategic positioning isn't imposing will — it's reading where the Tao already wants to flow and moving there. Sun Tzu's 'formlessness' IS Lao Tzu's 'water adapts to terrain.' Victory without battle happens when you position where resistance doesn't exist — not because you forced it, but because you recognized the pattern. The general who understands Tao doesn't need deception because they're not fighting what-is. People feel safe around this kind of power — magnetic, not aggressive. It wins by not needing to win.",
    mechanism:
      "Sun Tzu's tactical precision + Lao Tzu's wu wei = strategic action that feels effortless because it's aligned with natural pattern",
  },

  strategist_warriorSage: {
    insight:
      "Sun Tzu operates at macro scale — armies, terrain, campaign. Musashi operates at micro scale — breath, blade, this moment. The synthesis: strategic clarity at every level. Position yourself advantageously (Sun Tzu), then be totally present in execution (Musashi). The army that knows where to fight AND how to fight at the point of contact is unstoppable.",
    mechanism:
      "Sun Tzu's positioning + Musashi's presence = total commitment at the right place",
  },

  strategist_antifragilist: {
    insight:
      "Both value optionality over prediction. Sun Tzu: position where multiple advantages are possible. Taleb: barbell where one outcome doesn't kill you, another pays asymmetrically. The synthesis: strategic antifragility. Don't predict which opportunity — position where multiple opportunities are accessible. Let volatility reveal which door opens.",
    mechanism:
      "Sun Tzu's optionality + Taleb's barbell = positioned for upside, protected from downside",
  },

  strategist_stoicEmperor: {
    insight:
      "Sun Tzu manipulates outcomes; Aurelius accepts them. Tension: is strategic positioning compatible with amor fati? The synthesis: accept what you cannot control (Aurelius), position precisely where you CAN (Sun Tzu). The Stoic general doesn't rage at terrain — he reads it accurately and moves accordingly. Acceptance enables clear perception; clear perception enables effective action.",
    mechanism:
      "Sun Tzu's calculation + Aurelius's acceptance = clear-eyed action",
  },

  // ============================================================
  // NEW: PARMENIDES (preSocraticSage) SYNTHESES
  // ============================================================
  preSocraticSage_processPhilosopher: {
    insight:
      "The oldest philosophical fight: Parmenides (Being is One, change is illusion) vs. Heraclitus (everything flows). Whitehead resolves it: each actual occasion IS, momentarily — pure Parmenidean being — then perishes into the next becoming. Being and Becoming aren't opposites; they're phases of the same process.",
    mechanism: "Parmenidean being + Whiteheadian process = pulsing reality",
  },

  preSocraticSage_taoist: {
    insight:
      "The Tao and Parmenidean Being: both ineffable, both prior to distinctions, both the ground of everything. The Tao that can be named is not the eternal Tao; Being cannot be thought alongside Not-Being. East and West, same insight: before the Many, the One. Before words, silence.",
    mechanism: "Parmenidean One + Taoist Tao = primordial unity",
  },

  preSocraticSage_idealistPhilosopher: {
    insight:
      "Parmenides: Being is One. Kastrup: consciousness is One. Both monist, both say multiplicity is appearance. The synthesis: the One that Parmenides intuited, Kastrup gives a modern name: universal consciousness. Dissociation explains the Many; the One was never divided.",
    mechanism: "Parmenidean logic + Kastrup's model = conscious monism",
  },

  // ============================================================
  // NEW: McGILCHRIST (dividedBrainSage) SYNTHESES
  // ============================================================
  dividedBrainSage_curiousPhysicist: {
    insight:
      "Feynman embodies the paradox: rigorous left-hemisphere analysis that stays playful and open (right hemisphere). The best scientists aren't just calculating — they're SEEING. McGilchrist would say: Feynman kept the hemispheres in balance. The synthesis: science needs both — precision AND vision, analysis AND intuition.",
    mechanism:
      "McGilchrist's diagnosis + Feynman's practice = balanced science",
  },

  dividedBrainSage_renaissancePoet: {
    insight:
      "McGilchrist's hero. Goethe was scientist AND poet, analyst AND visionary. He didn't choose between hemispheres — he integrated them. The synthesis: the ideal human isn't specialized but whole. Goethe's color theory failed scientifically but SAW something Newton missed. Both truths matter.",
    mechanism: "McGilchrist's ideal + Goethe's example = integrated human",
  },

  dividedBrainSage_wisdomCognitivist: {
    insight:
      "Both diagnose civilizational crisis: McGilchrist says left-hemisphere takeover; Vervaeke says meaning crisis. They're describing the same elephant. The left brain fragments, categorizes, loses context — that IS relevance realization breakdown. The synthesis: the meaning crisis IS the hemispheric imbalance. Same disease, different scans.",
    mechanism:
      "McGilchrist's neurological + Vervaeke's cognitive = unified diagnosis",
  },

  dividedBrainSage_idealistPhilosopher: {
    insight:
      "Kastrup says reality is mental. McGilchrist says the hemispheres create different worlds. The synthesis: WHICH mind? The left hemisphere's mind creates the mechanical, dead world of materialism. The right hemisphere's mind sees living, connected reality. Idealism is true — but it matters which hemisphere is doing the experiencing.",
    mechanism:
      "Kastrup's idealism + McGilchrist's hemispheres = embodied idealism",
  },

  // ============================================================
  // NEW: WHITEHEAD (processPhilosopher) SYNTHESES
  // ============================================================
  processPhilosopher_idealistPhilosopher: {
    insight:
      "Both say experience is fundamental — but Kastrup has ONE mind with dissociated alters; Whitehead has MANY actual occasions, each a drop of experience. The synthesis: maybe dissociation IS the process of actual occasions arising? The Many-from-One isn't fragmentation — it's creative advance.",
    mechanism: "Kastrup's monism + Whitehead's pluralism = processual idealism",
  },

  processPhilosopher_renaissancePoet: {
    insight:
      "Both see nature as alive, creative, organic — not dead mechanism. Goethe's morphology (forms transforming) IS process philosophy avant la lettre. Whitehead rationalized what Goethe saw: nature creates, unfolds, becomes. The synthesis: romantic science that stays rigorous.",
    mechanism: "Goethe's vision + Whitehead's rigor = living metaphysics",
  },

  processPhilosopher_mystic: {
    insight:
      "Whitehead: 'Religion is what you do with your solitude.' The mystic's experience IS an actual occasion — a drop of experience prehending the divine. Process philosophy makes mysticism philosophically respectable without explaining it away. The synthesis: mystical union as real event.",
    mechanism:
      "Whiteheadian event + mystical experience = philosophical mysticism",
  },

  // ============================================================
  // NEW: GOETHE (renaissancePoet) SYNTHESES
  // ============================================================
  renaissancePoet_lifeAffirmer: {
    insight:
      "Nietzsche worshipped Goethe as the ideal human: life-affirming, creative, WHOLE. Goethe turned heartbreak into Werther, turned longing into Faust. He didn't deny suffering — he TRANSFORMED it. The synthesis: affirmation through creation. The Übermensch looks like Goethe: someone who makes art from everything, including pain.",
    mechanism:
      "Goethe's creation + Nietzsche's affirmation = transformative yes",
  },

  renaissancePoet_curiousPhysicist: {
    insight:
      "Goethe did science wrong (his color theory) but SAW something right (the qualitative dimension Newton ignored). Feynman stayed playful while being rigorous. The synthesis: science needs both — the measurement AND the meaning, the how AND the what-it's-like. Poetry isn't opposed to physics; it completes it.",
    mechanism: "Goethe's vision + Feynman's rigor = complete science",
  },

  renaissancePoet_romanticPoet: {
    insight:
      "Neruda inherited Goethe's fusion of passion and craft. The romantic isn't sloppy — the greatest love poems are also the most precisely made. The synthesis: the poem as living organism. Not constructed artifact but organic form. Passion REQUIRES precision to communicate.",
    mechanism: "Goethe's discipline + Neruda's passion = crafted fire",
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

import { buildResponse } from "../personality/personality.js";
import { generateReflection } from "../behavior/reflectionEngine.js";
import { loadMemory, addShortTermMemory, addLongTermMemory } from "../memory/memory.js";

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

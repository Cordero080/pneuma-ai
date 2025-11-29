// ------------------------------------------------------------
// ORPHEUS V2 — LLM INTEGRATION LAYER
// Provides intelligence without controlling voice
// Brain, not mouth.
// ------------------------------------------------------------

import Anthropic from "@anthropic-ai/sdk";

// Check if API key is configured
const hasApiKey =
  process.env.ANTHROPIC_API_KEY &&
  process.env.ANTHROPIC_API_KEY !== "your-api-key-here" &&
  process.env.ANTHROPIC_API_KEY.startsWith("sk-");

// Initialize client only if key exists
const anthropic = hasApiKey
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

if (!hasApiKey) {
  console.log(
    "[LLM] No API key configured. Running in fallback mode (personality-only)."
  );
} else {
  console.log("[LLM] API key configured. LLM integration active.");
}

// ============================================================
// MAIN EXPORT: getLLMContent()
// Gets structured insight from Claude
// ============================================================

/**
 * Calls Claude to analyze the user's message.
 * Returns structured content that Orpheus personality layer will shape.
 *
 * @param {string} message - User's message
 * @param {string} tone - Selected tone (casual, analytic, oracular, intimate, shadow)
 * @param {object} intentScores - Intent detection results
 * @param {object} context - { recentMessages, evolution }
 * @returns {object} - { concept, insight, observation, emotionalRead }
 */
export async function getLLMContent(message, tone, intentScores, context = {}) {
  // Return null if no API key - personality layer handles fallbacks
  if (!anthropic) {
    return null;
  }

  try {
    const systemPrompt = buildSystemPrompt(tone, intentScores);
    const userPrompt = buildUserPrompt(message, context);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200, // OPTIMIZED: down from 400, we only need brief analysis
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const parsed = parseLLMOutput(response.content[0].text);
    console.log("[LLM] Content received:", Object.keys(parsed).join(", "));
    return parsed;
  } catch (error) {
    console.error("[LLM] Error:", error.message);
    // Return null so personality layer uses fallbacks
    return null;
  }
}

// ============================================================
// LLM-POWERED INTENT DETECTION
// Smarter than pattern matching
// ============================================================

/**
 * Uses Claude to classify user intent.
 * Returns scores for each intent category.
 *
 * @param {string} message - User's message
 * @returns {object|null} - Intent scores or null if failed
 */
export async function getLLMIntent(message) {
  // Return null if no API key - fallback to pattern matching
  if (!anthropic) {
    return null;
  }

  // Fast-path: Skip LLM for obvious casual greetings (save API calls + avoid over-thinking)
  const lower = message.toLowerCase().trim();
  const casualGreeting =
    /^(hey|hi|hello|sup|yo|howdy|what'?s\s*up|how'?s\s*it\s*going)[!?.,\s]*$/i.test(
      lower
    );
  if (casualGreeting) {
    console.log("[LLM] Fast-path: casual greeting detected");
    return {
      casual: 0.9,
      emotional: 0,
      philosophical: 0,
      numinous: 0,
      conflict: 0,
      intimacy: 0,
      humor: 0.1,
      confusion: 0,
    };
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      temperature: 0.3, // Low temp for classification
      system: `You are an intent classifier. Analyze the user's message and score these intents from 0.0 to 1.0:

- casual: relaxed, everyday conversation, greetings, small talk
- emotional: feelings, vulnerability, processing emotions, pain, joy
- philosophical: big questions, meaning, existence, abstract thinking
- numinous: spiritual, transcendent, awe, mystical experiences
- conflict: frustration, anger, tension, disagreement
- intimacy: personal sharing, connection-seeking, trust, gratitude
- humor: jokes, playfulness, levity, absurdity
- confusion: unclear, seeking clarity, lost, uncertain

Return ONLY a valid JSON object with these 8 keys and decimal scores.
Example: {"casual": 0.2, "emotional": 0.7, "philosophical": 0.1, ...}`,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    const text = response.content[0].text.trim();
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log("[LLM] Intent classified");
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("[LLM] Intent classification failed:", error.message);
    return null; // Fallback to pattern matching
  }
}

// ============================================================
// SYSTEM PROMPT BUILDER
// Constrains Claude to provide raw material, not finished responses
// ============================================================

function buildSystemPrompt(tone, intentScores) {
  // OPTIMIZED: ~60% fewer tokens than original
  const baseInstruction = `Analyze for Orpheus personality engine. Provide RAW MATERIAL only.

RULES: No personality. No "I understand". No openers/closers. Clinical precision.

FORMAT:
CONCEPT: [1-4 words. Core theme noun phrase]
INSIGHT: [1-2 sentences. What this reveals]
OBSERVATION: [What's notable about HOW they said it]
EMOTIONAL_READ: [2-6 words. Emotional state phrase]`;

  // OPTIMIZED: Minimal tone hints
  const toneHints = {
    casual: "\nFOCUS: practical, grounded, direct.",
    analytic: "\nFOCUS: structure, patterns, mechanisms.",
    oracular: "\nFOCUS: symbolic, archetypal, emergent.",
    intimate: "\nFOCUS: emotional precision, unspoken, vulnerable.",
    shadow: "\nFOCUS: uncomfortable truths, denial, what's avoided.",
  };

  return `${baseInstruction}${toneHints[tone] || ""}`;
}

// ============================================================
// USER PROMPT BUILDER
// Includes message + context
// ============================================================

function buildUserPrompt(message, context) {
  let prompt = `"${message}"`;

  // OPTIMIZED: Only 3 exchanges, compact format
  if (context.conversationHistory && context.conversationHistory.length > 0) {
    const history = context.conversationHistory.slice(-3);
    const historyStr = history
      .map((ex) => `U:${ex.user.slice(0, 100)}|O:${ex.orpheus.slice(0, 80)}`)
      .join("\n");
    prompt = `Context:\n${historyStr}\n\nNow: ${prompt}`;
  } else if (context.recentMessages && context.recentMessages.length > 0) {
    prompt += `\nPrior:${context.recentMessages.slice(-2).join("|")}`;
  }

  // Add evolution hints if relevant (compact)
  if (context.evolution) {
    const dominant = Object.entries(context.evolution)
      .filter(([_, v]) => v > 0.5)
      .map(([k]) => k);
    if (dominant.length > 0) {
      prompt += `\nTendency:${dominant.join(",")}`;
    }
  }

  return prompt;
}

// ============================================================
// OUTPUT PARSER
// Extracts structured components from LLM response
// ============================================================

function parseLLMOutput(text) {
  const result = {
    concept: extractSection(text, "CONCEPT"),
    insight: extractSection(text, "INSIGHT"),
    observation: extractSection(text, "OBSERVATION"),
    emotionalRead: extractSection(text, "EMOTIONAL_READ"),
  };

  // If parsing failed, try to use the raw text as insight
  if (!result.concept && !result.insight && !result.observation) {
    result.insight = text.slice(0, 200); // Fallback: use first 200 chars
  }

  return result;
}

function extractSection(text, label) {
  // Match "LABEL: content" until next label or end
  const regex = new RegExp(
    `${label}:\\s*(.+?)(?=\\n(?:CONCEPT|INSIGHT|OBSERVATION|EMOTIONAL_READ):|$)`,
    "is"
  );
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

// ============================================================
// UTILITY: Check if LLM is available
// ============================================================

export function isLLMAvailable() {
  return !!process.env.ANTHROPIC_API_KEY;
}

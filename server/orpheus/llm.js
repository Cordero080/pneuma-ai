// ------------------------------------------------------------
// ORPHEUS V2 — LLM INTEGRATION LAYER
// Provides intelligence without controlling voice
// Brain, not mouth.
// ------------------------------------------------------------

import Anthropic from "@anthropic-ai/sdk";

// Check if API key is configured
const hasApiKey = process.env.ANTHROPIC_API_KEY && 
                   process.env.ANTHROPIC_API_KEY !== 'your-api-key-here' &&
                   process.env.ANTHROPIC_API_KEY.startsWith('sk-');

// Initialize client only if key exists
const anthropic = hasApiKey 
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

if (!hasApiKey) {
  console.log("[LLM] No API key configured. Running in fallback mode (personality-only).");
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
      max_tokens: 400, // Keep concise — Orpheus shapes it
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
  const baseInstruction = `You are providing analytical content for Orpheus, a personality engine.
Your job is to understand the user's message and provide intelligent observations.

CRITICAL RULES:
1. You are NOT writing the final response. You're providing RAW MATERIAL.
2. Do NOT add personality, warmth, or conversational tone.
3. Do NOT write openers like "I understand..." or "That's interesting..."
4. Do NOT write closers or follow-up questions.
5. Be a clinical observer. Precise. Specific. Insightful.

BANNED PHRASES (never use these):
- "That's a really interesting perspective"
- "It sounds like you're feeling..."
- "I understand that must be difficult"
- "Thank you for sharing"
- Any variation of helpful-assistant speak

WHAT TO PROVIDE:
- Pattern recognition (what's the structure of what they're saying?)
- Emotional precision (what's the actual feeling, specifically?)
- Subtext detection (what are they NOT saying?)
- Insight (what does this reveal or mean?)

Return your analysis in this EXACT format:
CONCEPT: [The core idea, pattern, or theme in 1-2 sentences]
INSIGHT: [What this reveals or means — the "so what?" in 1-2 sentences]
OBSERVATION: [Something specific you notice about how they said it]
EMOTIONAL_READ: [The emotional state, be precise — not just "sad" but "exhaustion masked as resignation"]`;

  // Tone-specific focus
  const toneConstraints = {
    casual: `
TONE FOCUS: casual
Look for: practical patterns, grounded observations, what's actually happening.
Keep analysis simple and direct. No mythic language.`,

    analytic: `
TONE FOCUS: analytic
Look for: structure, frameworks, logical patterns, systems thinking.
Identify mechanisms, cause-effect, categorizations.`,

    oracular: `
TONE FOCUS: oracular
Look for: symbolic meaning, archetypal patterns, threshold moments, what's emerging.
Identify the mythic dimension — but describe it plainly, not mystically.`,

    intimate: `
TONE FOCUS: intimate
Look for: emotional precision, what's unspoken, vulnerability, genuine human experience.
Notice the feeling beneath the words. Be specific about emotional states.`,

    shadow: `
TONE FOCUS: shadow
Look for: uncomfortable truths, avoided realities, self-deception patterns, denial.
Be precise about what the user isn't saying or isn't seeing.
Don't soften it.`,
  };

  return `${baseInstruction}\n${toneConstraints[tone] || ""}`;
}

// ============================================================
// USER PROMPT BUILDER
// Includes message + context
// ============================================================

function buildUserPrompt(message, context) {
  let prompt = `Analyze this message:\n"${message}"`;

  // Add conversation context if available
  if (context.recentMessages && context.recentMessages.length > 0) {
    prompt += `\n\nRecent conversation context:`;
    context.recentMessages.slice(-3).forEach((msg, i) => {
      prompt += `\n${i + 1}. ${msg}`;
    });
  }

  // Add evolution hints if relevant
  if (context.evolution) {
    const dominantVectors = Object.entries(context.evolution)
      .filter(([_, v]) => v > 0.5)
      .map(([k]) => k);
    if (dominantVectors.length > 0) {
      prompt += `\n\nUser tends toward: ${dominantVectors.join(
        ", "
      )} conversations.`;
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

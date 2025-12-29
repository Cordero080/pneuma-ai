// ============================================================
// PNEUMA — EMOTION DETECTION SYSTEM
// Voice input (Whisper) + Emotion analysis (Hume AI)
// Provides real signal beyond text parsing
// ============================================================

import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI for Whisper
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Hume AI config (optional — works without it, just less accurate)
const HUME_API_KEY = process.env.HUME_API_KEY;
const HUME_SECRET_KEY = process.env.HUME_SECRET_KEY;
const HUME_ENABLED = !!(HUME_API_KEY && HUME_SECRET_KEY);

// ============================================================
// WHISPER — Voice to Text
// ============================================================

/**
 * Transcribe audio file to text using OpenAI Whisper
 * @param {Buffer|string} audioInput - Audio buffer or file path
 * @returns {Promise<{text: string, language: string}>}
 */
export async function transcribeAudio(audioInput) {
  try {
    let audioFile;

    if (typeof audioInput === "string") {
      // File path provided
      audioFile = fs.createReadStream(audioInput);
    } else if (Buffer.isBuffer(audioInput)) {
      // Buffer provided — write to temp file
      const tempPath = path.join(__dirname, "../../data/temp_audio.webm");
      fs.writeFileSync(tempPath, audioInput);
      audioFile = fs.createReadStream(tempPath);
    } else {
      throw new Error("Invalid audio input — expected Buffer or file path");
    }

    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      language: undefined, // Auto-detect
    });

    console.log(
      `[Whisper] Transcribed: "${response.text.substring(0, 50)}..."`
    );

    return {
      text: response.text,
      language: response.language || "en",
      duration: response.duration,
      segments: response.segments || [],
    };
  } catch (error) {
    console.error("[Whisper] Transcription error:", error.message);
    return { text: "", language: "en", error: error.message };
  }
}

// ============================================================
// HUME AI — Emotion Detection from Voice
// ============================================================

/**
 * Analyze emotions from audio using Hume AI
 * Falls back to text-based analysis if Hume not configured
 * @param {Buffer} audioBuffer - Raw audio data
 * @returns {Promise<EmotionResult>}
 */
export async function analyzeVoiceEmotion(audioBuffer) {
  if (!HUME_ENABLED) {
    console.log("[Emotion] Hume AI not configured — using text-based fallback");
    return getDefaultEmotions();
  }

  try {
    // Hume AI API call with Basic auth (API Key + Secret Key)
    const authToken = Buffer.from(
      `${HUME_API_KEY}:${HUME_SECRET_KEY}`
    ).toString("base64");

    const formData = new FormData();
    formData.append("file", new Blob([audioBuffer]), "audio.webm");
    formData.append("models", JSON.stringify({ prosody: {} }));

    const response = await fetch("https://api.hume.ai/v0/batch/jobs", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Hume API error: ${response.status}`);
    }

    const result = await response.json();

    // Parse Hume response into our format
    return parseHumeResponse(result);
  } catch (error) {
    console.error("[Emotion] Hume analysis error:", error.message);
    return getDefaultEmotions();
  }
}

/**
 * Parse Hume AI response into normalized emotion scores
 */
function parseHumeResponse(humeResult) {
  // Hume returns emotions with scores 0-1
  // We normalize to our core emotion dimensions
  const emotions = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
    contempt: 0,
    // Higher-order
    confusion: 0,
    curiosity: 0,
    excitement: 0,
    calm: 0,
    frustration: 0,
    vulnerability: 0,
  };

  // Map Hume emotions to our dimensions
  // Hume has 48 emotions — we collapse to core dimensions
  const humeToCore = {
    Joy: "joy",
    Happiness: "joy",
    Amusement: "joy",
    Contentment: "calm",
    Sadness: "sadness",
    Grief: "sadness",
    Disappointment: "sadness",
    Anger: "anger",
    Annoyance: "frustration",
    Frustration: "frustration",
    Fear: "fear",
    Anxiety: "fear",
    Nervousness: "fear",
    Surprise: "surprise",
    Confusion: "confusion",
    Interest: "curiosity",
    Curiosity: "curiosity",
    Excitement: "excitement",
    Vulnerability: "vulnerability",
    Contempt: "contempt",
    Disgust: "disgust",
  };

  if (humeResult?.predictions?.[0]?.models?.prosody?.grouped_predictions) {
    const predictions =
      humeResult.predictions[0].models.prosody.grouped_predictions;

    for (const group of predictions) {
      for (const pred of group.predictions) {
        for (const emotion of pred.emotions) {
          const coreEmotion = humeToCore[emotion.name];
          if (coreEmotion && emotion.score > emotions[coreEmotion]) {
            emotions[coreEmotion] = emotion.score;
          }
        }
      }
    }
  }

  return emotions;
}

/**
 * Default emotion state when detection unavailable
 */
function getDefaultEmotions() {
  return {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
    contempt: 0,
    confusion: 0,
    curiosity: 0.3, // Assume some baseline curiosity
    excitement: 0,
    calm: 0.5, // Assume neutral-calm baseline
    frustration: 0,
    vulnerability: 0,
    confidence: 0, // 0 = we're guessing
  };
}

// ============================================================
// TEXT-BASED EMOTION ANALYSIS (Fallback)
// Uses linguistic cues when voice not available
// ============================================================

/**
 * Analyze emotions from text using linguistic patterns
 * Less accurate than voice, but better than nothing
 * @param {string} text
 * @returns {EmotionResult}
 */
export function analyzeTextEmotion(text) {
  const lower = text.toLowerCase();
  const emotions = getDefaultEmotions();

  // Joy signals
  if (
    /\b(happy|joy|excited|great|amazing|wonderful|love|fantastic|awesome)\b/i.test(
      lower
    )
  ) {
    emotions.joy += 0.4;
  }
  if (/[😊😄😁🙂❤️💕🎉✨]/u.test(text)) emotions.joy += 0.3;
  if (/(!{2,}|haha|lol|lmao)/i.test(lower)) emotions.joy += 0.2;

  // Sadness signals
  if (
    /\b(sad|depressed|down|low|hurt|crying|tears|miss|lonely|alone)\b/i.test(
      lower
    )
  ) {
    emotions.sadness += 0.5;
  }
  if (/[😢😭💔😞😔]/u.test(text)) emotions.sadness += 0.4;
  if (/\b(sigh|ugh)\b/i.test(lower)) emotions.sadness += 0.2;

  // Anger signals
  if (/\b(angry|furious|pissed|mad|hate|annoyed|frustrated)\b/i.test(lower)) {
    emotions.anger += 0.5;
  }
  if (/[😠😡🤬💢]/u.test(text)) emotions.anger += 0.4;
  if (/!{3,}|[A-Z]{5,}/i.test(text)) emotions.anger += 0.2; // ALL CAPS

  // Fear/anxiety signals
  if (
    /\b(scared|afraid|anxious|worried|nervous|terrified|panic)\b/i.test(lower)
  ) {
    emotions.fear += 0.5;
  }
  if (/\b(what if|i'm afraid|i can't|help me)\b/i.test(lower))
    emotions.fear += 0.3;
  if (/[😰😨😱]/u.test(text)) emotions.fear += 0.4;

  // Confusion signals
  if (
    /\b(confused|lost|don't understand|what|huh|unclear|idk)\b/i.test(lower)
  ) {
    emotions.confusion += 0.4;
  }
  if (/\?{2,}/i.test(text)) emotions.confusion += 0.3;
  if (/[🤔😕❓]/u.test(text)) emotions.confusion += 0.3;

  // Curiosity signals
  if (/\b(wonder|curious|interesting|how|why|what if|tell me)\b/i.test(lower)) {
    emotions.curiosity += 0.4;
  }
  if (/\?$/i.test(text.trim())) emotions.curiosity += 0.2;

  // Vulnerability signals
  if (
    /\b(vulnerable|scared to say|admit|confess|never told|secret|ashamed)\b/i.test(
      lower
    )
  ) {
    emotions.vulnerability += 0.5;
  }
  if (/\b(i feel|i think i|maybe i'm)\b/i.test(lower))
    emotions.vulnerability += 0.2;

  // Frustration signals
  if (
    /\b(ugh|argh|frustrated|stuck|can't|won't work|doesn't make sense)\b/i.test(
      lower
    )
  ) {
    emotions.frustration += 0.4;
  }

  // Normalize — cap at 1.0
  for (const key in emotions) {
    emotions[key] = Math.min(1.0, emotions[key]);
  }

  // Set confidence based on signal strength
  const signalSum = Object.values(emotions).reduce((a, b) => a + b, 0);
  emotions.confidence = Math.min(0.7, signalSum / 5); // Max 0.7 for text-only

  return emotions;
}

// ============================================================
// EMOTION → ARCHETYPE MAPPING
// Which archetypes rise based on emotional state
// ============================================================

/**
 * Suggest archetype weights based on detected emotions
 * @param {EmotionResult} emotions
 * @returns {Object} - Archetype affinity boosts
 */
export function emotionToArchetypeBoost(emotions) {
  const boosts = {};

  // Sadness → witnessing archetypes
  if (emotions.sadness > 0.3) {
    boosts.russianSoul = emotions.sadness * 0.8;
    boosts.romanticPoet = emotions.sadness * 0.6;
    boosts.psycheIntegrator = emotions.sadness * 0.5;
    boosts.hopefulRealist = emotions.sadness * 0.4;
  }

  // Joy → playful archetypes
  if (emotions.joy > 0.3) {
    boosts.trickster = emotions.joy * 0.6;
    boosts.chaoticPoet = emotions.joy * 0.5;
    boosts.absurdist = emotions.joy * 0.4;
    boosts.ecstaticRebel = emotions.joy * 0.5;
  }

  // Anger → grounding archetypes
  if (emotions.anger > 0.3) {
    boosts.stoicEmperor = emotions.anger * 0.7;
    boosts.brutalist = emotions.anger * 0.5;
    boosts.antifragilist = emotions.anger * 0.4;
  }

  // Fear → containing archetypes
  if (emotions.fear > 0.3) {
    boosts.stoicEmperor = (boosts.stoicEmperor || 0) + emotions.fear * 0.6;
    boosts.cognitiveSage = emotions.fear * 0.5;
    boosts.hopefulRealist = (boosts.hopefulRealist || 0) + emotions.fear * 0.4;
  }

  // Confusion → clarifying archetypes
  if (emotions.confusion > 0.3) {
    boosts.curiousPhysicist = emotions.confusion * 0.6;
    boosts.inventor = emotions.confusion * 0.5;
    boosts.integralPhilosopher = emotions.confusion * 0.4;
  }

  // Curiosity → exploratory archetypes
  if (emotions.curiosity > 0.3) {
    boosts.curiousPhysicist =
      (boosts.curiousPhysicist || 0) + emotions.curiosity * 0.7;
    boosts.psychedelicBard = emotions.curiosity * 0.4;
    boosts.idealistPhilosopher = emotions.curiosity * 0.5;
  }

  // Vulnerability → gentle witnessing
  if (emotions.vulnerability > 0.3) {
    boosts.psycheIntegrator =
      (boosts.psycheIntegrator || 0) + emotions.vulnerability * 0.7;
    boosts.romanticPoet =
      (boosts.romanticPoet || 0) + emotions.vulnerability * 0.5;
    boosts.kingdomTeacher = emotions.vulnerability * 0.4;
  }

  // Frustration → direct archetypes
  if (emotions.frustration > 0.3) {
    boosts.brutalist = (boosts.brutalist || 0) + emotions.frustration * 0.5;
    boosts.trickster = (boosts.trickster || 0) + emotions.frustration * 0.3;
    boosts.antifragilist =
      (boosts.antifragilist || 0) + emotions.frustration * 0.4;
  }

  return boosts;
}

// ============================================================
// COMBINED ANALYSIS — Text + Voice when available
// ============================================================

/**
 * Full emotion analysis combining available signals
 * @param {string} text - The transcribed or typed text
 * @param {Object} voiceEmotions - Emotions from voice analysis (optional)
 * @returns {EmotionResult}
 */
export function combineEmotionSignals(text, voiceEmotions = null) {
  const textEmotions = analyzeTextEmotion(text);

  if (!voiceEmotions) {
    return textEmotions;
  }

  // Combine with voice taking priority (more reliable)
  const combined = {};
  const voiceWeight = 0.7;
  const textWeight = 0.3;

  for (const key of Object.keys(textEmotions)) {
    if (key === "confidence") {
      combined.confidence = Math.max(
        textEmotions.confidence,
        voiceEmotions.confidence || 0
      );
    } else {
      combined[key] =
        (voiceEmotions[key] || 0) * voiceWeight +
        textEmotions[key] * textWeight;
    }
  }

  return combined;
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  transcribeAudio,
  analyzeVoiceEmotion,
  analyzeTextEmotion,
  emotionToArchetypeBoost,
  combineEmotionSignals,
  HUME_ENABLED,
};

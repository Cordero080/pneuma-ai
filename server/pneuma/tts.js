// ------------------------------------------------------------
// PNEUMA — TEXT-TO-SPEECH (ElevenLabs)
// Giving the daemon a voice
// ------------------------------------------------------------

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

// Words that TTS mispronounces — map to phonetic spelling
const PRONUNCIATION_FIXES = {
  daemon: "daymon",
  Daemon: "Daymon",
  daemons: "daymons",
  Daemons: "Daymons",
};

// Casual speech patterns — add pauses/inflection hints for natural delivery
// KEEP THIS MINIMAL — too many pauses sounds like filler word soup
const INFLECTION_PATTERNS = [
  // Opening acknowledgments only — these benefit from a pause
  [/^(Yeah|Yep|Nah|Hmm|Huh),\s/i, "$1... "],
  // Em-dashes become natural pauses (Pneuma uses these intentionally)
  [/\s*—\s*/g, "... "],
  // "No lies detected" type phrases — the shrug energy
  [/no lies (detected|there|here)/gi, "no lies... $1"],
];

/**
 * Fix pronunciation issues before sending to TTS
 */
function fixPronunciation(text) {
  let fixed = text;
  for (const [word, replacement] of Object.entries(PRONUNCIATION_FIXES)) {
    fixed = fixed.replace(new RegExp(`\\b${word}\\b`, "g"), replacement);
  }
  return fixed;
}

/**
 * Add inflection hints for more natural speech
 */
function addInflection(text) {
  let processed = text;
  for (const [pattern, replacement] of INFLECTION_PATTERNS) {
    processed = processed.replace(pattern, replacement);
  }
  // Clean up any double/triple pauses
  processed = processed.replace(/\.{4,}/g, "...");
  processed = processed.replace(/(\.\.\.\s*){2,}/g, "... ");
  return processed;
}

/**
 * Convert text to speech using ElevenLabs
 * @param {string} text - The text to speak
 * @returns {Promise<Buffer|null>} - Audio buffer or null on failure
 */
export async function textToSpeech(text) {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) {
    console.warn("[TTS] Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID");
    return null;
  }

  if (!text || text.trim().length === 0) {
    console.warn("[TTS] No text provided");
    return null;
  }

  try {
    // Process text: fix pronunciation, then add natural inflection
    let processedText = fixPronunciation(text);
    processedText = addInflection(processedText);

    console.log(
      "[TTS] Processed text:",
      processedText.substring(0, 100) + "..."
    );

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: processedText,
          model_id: "eleven_turbo_v2_5", // Newest model — better prosody and expressiveness
          voice_settings: {
            stability: 0.25, // Low for variation, slightly up from 0.2 for new model
            similarity_boost: 0.6, // Looser for organic delivery
            style: 0.9, // Push expressiveness higher
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[TTS] API Error:", response.status, error);
      return null;
    }

    const audioBuffer = await response.arrayBuffer();
    console.log(`[TTS] Generated ${audioBuffer.byteLength} bytes of audio`);
    return Buffer.from(audioBuffer);
  } catch (error) {
    console.error("[TTS] Error:", error.message);
    return null;
  }
}

export default { textToSpeech };

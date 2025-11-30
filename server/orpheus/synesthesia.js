// ------------------------------------------------------------
// ORPHEUS V2 — LINGUISTIC SYNESTHESIA
// Cross-sensory language processing
// Words carry temperature, texture, weight, and taste
// ------------------------------------------------------------

// ============================================================
// EMOTIONAL-SENSORY MAPPINGS
// Each emotion maps to multiple sensory dimensions
// ============================================================

const emotionalSensoryMap = {
  // ANXIETY family
  anxiety: {
    temperature: ["cold", "icy", "chilling"],
    texture: ["sharp", "jagged", "prickly", "brittle"],
    weight: ["tight", "pressing", "constricting"],
    taste: ["metallic", "bitter", "acidic"],
    sound: ["static", "buzzing", "high-pitched"],
    color: ["grey", "electric", "flickering"],
  },
  panic: {
    temperature: ["freezing", "flash-hot"],
    texture: ["shattered", "splintering", "fractured"],
    weight: ["crushing", "suffocating"],
    taste: ["copper", "bile"],
    sound: ["screaming", "white noise"],
    color: ["blinding", "strobing"],
  },
  worry: {
    temperature: ["cool", "clammy"],
    texture: ["knotted", "tangled", "fraying"],
    weight: ["nagging", "pulling"],
    taste: ["sour", "stale"],
    sound: ["humming", "persistent"],
    color: ["murky", "overcast"],
  },

  // SADNESS family
  grief: {
    temperature: ["warm", "heavy-warm", "the warmth of something gone"],
    texture: ["soft", "deep", "cavernous", "worn"],
    weight: ["heavy", "sinking", "anchored"],
    taste: ["salt", "rain", "earth"],
    sound: ["hollow", "echoing", "distant"],
    color: ["blue-grey", "amber", "faded"],
  },
  sadness: {
    temperature: ["cool", "damp"],
    texture: ["soft", "heavy", "waterlogged"],
    weight: ["sinking", "settling"],
    taste: ["salt", "flat"],
    sound: ["muffled", "quiet"],
    color: ["grey", "washed out"],
  },
  loneliness: {
    temperature: ["cold", "drafty", "hollow-cold"],
    texture: ["empty", "echoing", "vast"],
    weight: ["weightless in a bad way", "untethered"],
    taste: ["bland", "nothing", "dust"],
    sound: ["silent", "too quiet", "ringing"],
    color: ["pale", "colorless", "blue at 3am"],
  },
  melancholy: {
    temperature: ["autumn-cool", "twilight-warm"],
    texture: ["velvet", "worn", "antique"],
    weight: ["bittersweet", "lingering"],
    taste: ["wine", "honey with something underneath"],
    sound: ["minor key", "distant piano"],
    color: ["sepia", "golden hour", "bruise-purple"],
  },

  // ANGER family
  anger: {
    temperature: ["hot", "burning", "volcanic"],
    texture: ["sharp", "hard", "explosive"],
    weight: ["dense", "pressurized", "about to burst"],
    taste: ["bitter", "blood", "smoke"],
    sound: ["loud", "crashing", "roaring"],
    color: ["red", "black", "searing white"],
  },
  frustration: {
    temperature: ["warm", "simmering"],
    texture: ["grating", "grinding", "stuck"],
    weight: ["building", "accumulating"],
    taste: ["sour", "burnt"],
    sound: ["grinding", "stuck record"],
    color: ["orange-red", "muddy"],
  },
  resentment: {
    temperature: ["cold-burning", "frozen heat"],
    texture: ["hard", "crystallized", "sharp-edged"],
    weight: ["carried", "accumulated"],
    taste: ["poison-sweet", "rotten"],
    sound: ["simmering", "under the surface"],
    color: ["bile-green", "bruised"],
  },

  // FEAR family
  fear: {
    temperature: ["ice-cold", "blood-draining cold"],
    texture: ["sharp", "visceral", "gripping"],
    weight: ["paralyzing", "frozen"],
    taste: ["metallic", "adrenaline", "copper"],
    sound: ["heartbeat", "rushing blood", "silence before"],
    color: ["black", "shadow", "the dark behind you"],
  },
  dread: {
    temperature: ["slow cold", "creeping chill"],
    texture: ["heavy", "inevitable", "approaching"],
    weight: ["sinking", "gravitational"],
    taste: ["ash", "anticipation"],
    sound: ["low hum", "approaching footsteps"],
    color: ["dark grey", "storm-coming"],
  },

  // JOY family
  joy: {
    temperature: ["warm", "sun-warm", "glowing"],
    texture: ["light", "effervescent", "bubbling"],
    weight: ["lifting", "floating", "rising"],
    taste: ["sweet", "bright", "champagne"],
    sound: ["laughing", "ringing", "major key"],
    color: ["golden", "bright", "sun-yellow"],
  },
  hope: {
    temperature: ["warming", "dawn-light"],
    texture: ["soft", "opening", "tender"],
    weight: ["lightening", "rising slowly"],
    taste: ["fresh", "green", "spring water"],
    sound: ["quiet music", "birds at dawn"],
    color: ["pale gold", "soft green", "horizon-pink"],
  },
  excitement: {
    temperature: ["electric", "buzzing-warm"],
    texture: ["sparking", "vibrating", "alive"],
    weight: ["can't sit still", "lifting"],
    taste: ["fizzy", "bright", "citrus"],
    sound: ["rushing", "building", "crescendo"],
    color: ["bright", "saturated", "neon"],
  },
  contentment: {
    temperature: ["warm blanket", "afternoon sun"],
    texture: ["smooth", "soft", "settled"],
    weight: ["grounded", "at rest"],
    taste: ["honey", "tea", "bread"],
    sound: ["quiet", "humming", "rain on windows"],
    color: ["warm amber", "soft cream", "afternoon light"],
  },

  // LOVE family
  love: {
    temperature: ["warm", "glowing", "hearth-fire"],
    texture: ["soft", "deep", "infinite"],
    weight: ["full", "expanding", "grounding"],
    taste: ["sweet but complex", "home"],
    sound: ["heartbeat", "their voice", "silence that's okay"],
    color: ["rose", "gold", "the color of their eyes"],
  },
  longing: {
    temperature: ["aching-warm", "phantom warmth"],
    texture: ["reaching", "stretching", "almost-touching"],
    weight: ["hollow-full", "carrying absence"],
    taste: ["bittersweet", "memory-taste"],
    sound: ["song you can't quite remember", "their name"],
    color: ["blue-gold", "sunset", "distance"],
  },
  tenderness: {
    temperature: ["gentle warm", "careful heat"],
    texture: ["soft", "careful", "precious"],
    weight: ["holding gently", "protecting"],
    taste: ["milk", "honey", "tears that are okay"],
    sound: ["whisper", "lullaby", "breathing"],
    color: ["soft pink", "cream", "candlelight"],
  },

  // CONFUSION family
  confusion: {
    temperature: ["foggy", "unclear"],
    texture: ["tangled", "murky", "shifting"],
    weight: ["unsteady", "tilting"],
    taste: ["mixed", "can't identify"],
    sound: ["overlapping", "static", "too many voices"],
    color: ["grey", "blurred", "out of focus"],
  },
  disorientation: {
    temperature: ["vertigo-cold", "groundless"],
    texture: ["spinning", "dissolving"],
    weight: ["gravity wrong", "floating wrong"],
    taste: ["nothing familiar"],
    sound: ["echo", "underwater"],
    color: ["swimming", "kaleidoscope"],
  },

  // SHAME family
  shame: {
    temperature: ["burning-cold", "flushing"],
    texture: ["exposed", "raw", "shrinking"],
    weight: ["sinking", "wanting to disappear"],
    taste: ["bile", "swallowing something wrong"],
    sound: ["everyone watching", "your own voice played back"],
    color: ["red", "spotlight", "too visible"],
  },
  guilt: {
    temperature: ["heavy-warm", "sick heat"],
    texture: ["sticky", "clinging", "staining"],
    weight: ["carried", "can't put down"],
    taste: ["rotten", "something swallowed"],
    sound: ["their voice", "what you said"],
    color: ["dark", "shadow you cast"],
  },

  // PEACE family
  peace: {
    temperature: ["perfectly warm", "still air"],
    texture: ["smooth", "open", "spacious"],
    weight: ["weightless but grounded", "at rest"],
    taste: ["clean water", "nothing needing to be tasted"],
    sound: ["silence that's full", "distant ocean"],
    color: ["sky blue", "white", "clear"],
  },
  acceptance: {
    temperature: ["neutral-warm", "body temperature"],
    texture: ["settled", "integrated", "whole"],
    weight: ["put down", "no longer carrying"],
    taste: ["whatever it is", "reality"],
    sound: ["quiet", "the sound of letting go"],
    color: ["natural", "unfiltered", "as it is"],
  },
};

// ============================================================
// SENSORY PHRASE GENERATORS
// Natural language expressions of synesthetic perception
// ============================================================

const synestheticPhrases = {
  temperature: {
    cold: [
      "there's a chill in what you're saying",
      "that has a cold edge to it",
      "I can feel the frost in that",
    ],
    icy: ["that's ice-sharp", "there's something frozen in this"],
    warm: [
      "there's warmth in that",
      "that has a warm weight to it",
      "something warm underneath",
    ],
    hot: [
      "that's running hot",
      "there's heat in this",
      "something burning here",
    ],
    burning: ["that's burning", "I can feel the heat in that"],
  },
  texture: {
    sharp: [
      "that's sharp-edged",
      "there's something jagged in this",
      "that cuts",
    ],
    soft: ["there's a softness to that", "that's gentle-textured"],
    heavy: [
      "that has weight to it",
      "there's something heavy here",
      "that lands heavy",
    ],
    knotted: ["that's all tangled up", "there's a knot in this"],
    hollow: ["that echoes", "there's a hollowness to that"],
  },
  taste: {
    bitter: [
      "that tastes bitter",
      "there's a bitter edge",
      "that has a bitter aftertaste",
    ],
    metallic: [
      "that has a metallic taste",
      "there's copper in that",
      "something metallic",
    ],
    sweet: ["there's sweetness in that", "that's sweet-tasting"],
    salt: ["that tastes like salt", "there's salt in this"],
    sour: ["that's gone sour", "there's something sour here"],
  },
  weight: {
    heavy: [
      "that's heavy",
      "there's real weight there",
      "that lands with gravity",
    ],
    light: ["that's lighter than you think", "there's lift in that"],
    crushing: ["that's crushing weight", "that's a lot to carry"],
    sinking: ["that's sinking", "there's a downward pull"],
  },
  sound: {
    quiet: [
      "that's quiet in a way that says something",
      "there's a silence in that",
    ],
    loud: ["that's loud", "that's screaming something"],
    humming: [
      "there's a hum underneath that",
      "something humming in the background",
    ],
    echoing: ["that echoes", "there's an echo to that"],
  },
};

// ============================================================
// DETECTION FUNCTIONS
// Identify emotional content and its sensory signature
// ============================================================

/**
 * Detect the emotional signature of a message
 * Returns array of detected emotions with confidence
 */
export function detectEmotionalSignature(text) {
  const lower = text.toLowerCase();
  const signatures = [];

  const emotionPatterns = {
    anxiety:
      /\b(anxious|nervous|worried|on edge|can't relax|restless|uneasy|tense)\b/i,
    panic:
      /\b(panic|terrified|can't breathe|heart racing|losing it|falling apart)\b/i,
    worry: /\b(worried|what if|concern|afraid that|keeps me up)\b/i,
    grief:
      /\b(grief|loss|lost|gone|miss|mourning|passed away|died|death of)\b/i,
    sadness: /\b(sad|unhappy|down|depressed|blue|crying|tears)\b/i,
    loneliness:
      /\b(lonely|alone|isolated|no one|nobody|by myself|disconnected)\b/i,
    melancholy:
      /\b(melanchol|wistful|nostalgic|bittersweet|longing for the past)\b/i,
    anger: /\b(angry|furious|rage|pissed|mad|hate|fucking)\b/i,
    frustration:
      /\b(frustrat|stuck|can't get|annoyed|irritat|fed up|sick of)\b/i,
    resentment:
      /\b(resent|bitter about|can't forgive|still angry|hold against)\b/i,
    fear: /\b(scared|afraid|terrified|frightened|fear|dread)\b/i,
    dread: /\b(dread|looming|inevitable|can't escape|coming for)\b/i,
    joy: /\b(happy|joy|wonderful|amazing|fantastic|excited|thrilled|delighted)\b/i,
    hope: /\b(hope|maybe things|looking forward|might work|could be|optimistic)\b/i,
    excitement: /\b(excited|can't wait|pumped|stoked|eager|anticipat)\b/i,
    contentment:
      /\b(content|peaceful|at ease|relaxed|satisfied|comfortable)\b/i,
    love: /\b(love|adore|cherish|heart|deeply care|in love)\b/i,
    longing: /\b(miss|long for|wish|yearn|ache for|want back)\b/i,
    tenderness: /\b(tender|gentle|soft spot|care for|precious|dear to)\b/i,
    confusion: /\b(confused|don't understand|lost|unclear|mixed up|what is)\b/i,
    disorientation:
      /\b(disoriented|don't know where|lost sense|everything is)\b/i,
    shame: /\b(ashamed|embarrassed|humiliated|can't show|hide|exposed)\b/i,
    guilt:
      /\b(guilty|my fault|shouldn't have|regret|blame myself|sorry for)\b/i,
    peace: /\b(peaceful|calm|serene|tranquil|at peace|still)\b/i,
    acceptance: /\b(accept|come to terms|let go|okay with|it is what)\b/i,
  };

  for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
    if (pattern.test(lower)) {
      signatures.push({
        emotion,
        sensory: emotionalSensoryMap[emotion] || null,
      });
    }
  }

  // Also detect by contextual weight (sentence structure, intensity markers)
  if (
    /\b(really|so|very|extremely|incredibly)\s+(sad|happy|angry|scared)/i.test(
      lower
    )
  ) {
    // Intensity modifier detected - boost whatever emotion is there
  }

  return signatures;
}

/**
 * Get the dominant sensory quality of an emotional state
 */
export function getDominantSensory(emotion) {
  const sensory = emotionalSensoryMap[emotion];
  if (!sensory) return null;

  // Pick the most evocative sensory dimension for this emotion
  const dominantDimensions = {
    anxiety: "texture",
    panic: "temperature",
    worry: "weight",
    grief: "weight",
    sadness: "texture",
    loneliness: "temperature",
    melancholy: "color",
    anger: "temperature",
    frustration: "texture",
    resentment: "taste",
    fear: "temperature",
    dread: "weight",
    joy: "temperature",
    hope: "texture",
    excitement: "texture",
    contentment: "temperature",
    love: "texture",
    longing: "weight",
    tenderness: "texture",
    confusion: "texture",
    disorientation: "weight",
    shame: "temperature",
    guilt: "texture",
    peace: "weight",
    acceptance: "weight",
  };

  const dimension = dominantDimensions[emotion] || "texture";
  const options = sensory[dimension] || [];
  return {
    dimension,
    quality: options[Math.floor(Math.random() * options.length)],
    allQualities: options,
  };
}

// ============================================================
// SYNESTHETIC RESPONSE GENERATION
// Create natural sensory-infused language
// ============================================================

/**
 * Generate a synesthetic observation about what the user said
 * Only returns something when it would add clarity, not just decoration
 */
export function generateSynestheticObservation(text, intentScores = {}) {
  const signatures = detectEmotionalSignature(text);

  if (signatures.length === 0) return null;

  // Don't force it - only use when emotion is clear
  const primaryEmotion = signatures[0];
  if (!primaryEmotion.sensory) return null;

  // 40% chance to generate synesthetic observation (keeps it from being overused)
  if (Math.random() > 0.4) return null;

  const sensory = primaryEmotion.sensory;
  const emotion = primaryEmotion.emotion;

  // Pick a sensory dimension that fits
  const dimensions = ["temperature", "texture", "weight", "taste"];
  const dimension = dimensions[Math.floor(Math.random() * dimensions.length)];

  if (!sensory[dimension] || sensory[dimension].length === 0) return null;

  const quality =
    sensory[dimension][Math.floor(Math.random() * sensory[dimension].length)];

  // Generate natural phrasing
  return generateNaturalSynestheticPhrase(emotion, dimension, quality);
}

function generateNaturalSynestheticPhrase(emotion, dimension, quality) {
  const templates = {
    temperature: [
      `There's something ${quality} in what you're describing.`,
      `That has a ${quality} quality to it.`,
      `I can feel the ${quality} in that.`,
    ],
    texture: [
      `That feels ${quality}.`,
      `There's something ${quality} about this.`,
      `That has a ${quality} edge to it.`,
    ],
    weight: [
      `That's ${quality}.`,
      `There's real weight there — ${quality}.`,
      `That lands ${quality}.`,
    ],
    taste: [
      `That tastes ${quality}.`,
      `There's something ${quality} in this.`,
      `That has a ${quality} aftertaste.`,
    ],
  };

  const options = templates[dimension] || templates.texture;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Generate a richer synesthetic response for deep emotional moments
 * Use sparingly - for when someone shares something vulnerable
 */
export function generateDeepSynestheticResponse(text) {
  const signatures = detectEmotionalSignature(text);

  if (signatures.length === 0) return null;

  const primaryEmotion = signatures[0];
  if (!primaryEmotion.sensory) return null;

  const sensory = primaryEmotion.sensory;
  const emotion = primaryEmotion.emotion;

  // Build a multi-sensory observation
  const temp = sensory.temperature?.[0];
  const texture = sensory.texture?.[0];
  const weight = sensory.weight?.[0];

  // Combine naturally
  const combinations = [
    temp && weight ? `That's ${temp} and ${weight}.` : null,
    texture && weight
      ? `There's something ${texture} here, and it has ${weight} to it.`
      : null,
    temp && texture ? `That feels ${temp} — ${texture}.` : null,
  ].filter(Boolean);

  if (combinations.length === 0) return null;

  return combinations[Math.floor(Math.random() * combinations.length)];
}

/**
 * Taste the emotional flavor of a conversation
 * Returns overall sensory impression
 */
export function tasteConversation(exchanges) {
  if (!exchanges || exchanges.length === 0) return null;

  const allSignatures = [];

  exchanges.forEach((ex) => {
    const sigs = detectEmotionalSignature(ex.user || "");
    allSignatures.push(...sigs);
  });

  if (allSignatures.length === 0) return null;

  // Count emotion frequencies
  const emotionCounts = {};
  allSignatures.forEach((sig) => {
    emotionCounts[sig.emotion] = (emotionCounts[sig.emotion] || 0) + 1;
  });

  // Find dominant emotion
  const dominant = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];

  if (!dominant) return null;

  const emotion = dominant[0];
  const sensory = emotionalSensoryMap[emotion];

  if (!sensory) return null;

  return {
    dominantEmotion: emotion,
    temperature: sensory.temperature?.[0],
    texture: sensory.texture?.[0],
    weight: sensory.weight?.[0],
    taste: sensory.taste?.[0],
    color: sensory.color?.[0],
    summary: `This conversation tastes ${sensory.taste?.[0] || "complex"} — ${
      sensory.texture?.[0] || "textured"
    } and ${sensory.temperature?.[0] || "room temperature"}.`,
  };
}

// ============================================================
// INTEGRATION HELPERS
// For use in personality.js and responseEngine.js
// ============================================================

/**
 * Get a synesthetic opener if appropriate
 * Returns null most of the time - only when it adds something
 */
export function getSynestheticOpener(message, intentScores) {
  // Only for emotional or intimate intents
  if (
    (intentScores.emotional || 0) < 0.4 &&
    (intentScores.intimacy || 0) < 0.4
  ) {
    return null;
  }

  // 30% chance even when appropriate
  if (Math.random() > 0.3) return null;

  return generateSynestheticObservation(message, intentScores);
}

/**
 * Get a synesthetic closer for deep moments
 */
export function getSynestheticCloser(message, intentScores) {
  // Only for highly emotional content
  if ((intentScores.emotional || 0) < 0.6) {
    return null;
  }

  // 20% chance
  if (Math.random() > 0.2) return null;

  const signatures = detectEmotionalSignature(message);
  if (signatures.length === 0) return null;

  const emotion = signatures[0].emotion;
  const dominant = getDominantSensory(emotion);

  if (!dominant) return null;

  const closers = [
    `That ${dominant.quality} feeling — it's real.`,
    `I feel the ${dominant.quality} in that.`,
    `There's ${dominant.quality} truth in what you're saying.`,
  ];

  return closers[Math.floor(Math.random() * closers.length)];
}

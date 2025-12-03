// ------------------------------------------------------------
// ORPHEUS V2 — LANGUAGE ENGINE
// Bilingual support: English/Spanish
// The personality stays intact — only the language changes
// Orpheus sigue siendo Orpheus, solo que en español
// ------------------------------------------------------------

// ============================================================
// SESSION LANGUAGE STATE
// ============================================================
let currentLanguage = 'en'; // 'en' or 'es'

// ============================================================
// LANGUAGE DETECTION
// ============================================================

// Common Spanish words/patterns that indicate Spanish input
const SPANISH_INDICATORS = [
  // Common words
  /\b(hola|gracias|por favor|buenos días|buenas noches|buenas tardes)\b/i,
  /\b(cómo|qué|cuál|cuándo|dónde|quién|por qué)\b/i,
  /\b(estoy|estás|está|estamos|están)\b/i,
  /\b(tengo|tienes|tiene|tenemos|tienen)\b/i,
  /\b(puedo|puedes|puede|podemos|pueden)\b/i,
  /\b(quiero|quieres|quiere|queremos|quieren)\b/i,
  /\b(soy|eres|es|somos|son)\b/i,
  /\b(muy|mucho|poco|algo|nada|todo|siempre|nunca)\b/i,
  /\b(pero|porque|aunque|cuando|donde|como|si)\b/i,
  /\b(para|sobre|entre|desde|hasta|sin|con)\b/i,
  // Verbs and common phrases
  /\b(necesito|ayuda|entiendo|pienso|siento|creo)\b/i,
  /\b(dime|cuéntame|explica|háblame)\b/i,
  // Accented characters common in Spanish
  /[áéíóúüñ¿¡]/i,
];

// Explicit language switch commands
const SPANISH_SWITCH_PATTERNS = [
  /^habla(me)? (en )?español$/i,
  /^en español$/i,
  /^español$/i,
  /^speak spanish$/i,
  /^switch to spanish$/i,
  /^cambia a español$/i,
];

const ENGLISH_SWITCH_PATTERNS = [
  /^speak english$/i,
  /^habla(me)? (en )?inglés$/i,
  /^en inglés$/i,
  /^inglés$/i,
  /^switch to english$/i,
  /^cambia a inglés$/i,
];

/**
 * Detect if message is primarily Spanish
 * @param {string} message - User input
 * @returns {boolean}
 */
function isSpanishInput(message) {
  const lower = message.toLowerCase();
  let spanishScore = 0;
  
  for (const pattern of SPANISH_INDICATORS) {
    if (pattern.test(lower)) {
      spanishScore++;
    }
  }
  
  // If 2+ Spanish indicators, treat as Spanish
  return spanishScore >= 2;
}

/**
 * Check if user is explicitly requesting language switch
 * @param {string} message 
 * @returns {'en' | 'es' | null}
 */
function detectLanguageSwitch(message) {
  const trimmed = message.trim();
  
  if (SPANISH_SWITCH_PATTERNS.some(p => p.test(trimmed))) {
    return 'es';
  }
  
  if (ENGLISH_SWITCH_PATTERNS.some(p => p.test(trimmed))) {
    return 'en';
  }
  
  return null;
}

/**
 * Process message for language and update session state
 * @param {string} message - User input
 * @returns {{ language: 'en' | 'es', isSwitch: boolean, switchResponse: string | null }}
 */
export function processLanguage(message) {
  // Check for explicit switch first
  const explicitSwitch = detectLanguageSwitch(message);
  
  if (explicitSwitch) {
    currentLanguage = explicitSwitch;
    return {
      language: currentLanguage,
      isSwitch: true,
      switchResponse: explicitSwitch === 'es' 
        ? 'Perfecto. Ahora hablo español. Sigo siendo yo — solo cambia el idioma, no la esencia.'
        : 'Done. Back to English. Still me — just the language changed, not the soul.'
    };
  }
  
  // Auto-detect based on input
  if (isSpanishInput(message)) {
    currentLanguage = 'es';
  }
  // Note: We don't auto-switch back to English easily
  // Once in Spanish mode, stay there unless user writes mostly English
  // or explicitly switches
  
  return {
    language: currentLanguage,
    isSwitch: false,
    switchResponse: null
  };
}

/**
 * Get current language setting
 * @returns {'en' | 'es'}
 */
export function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Set language explicitly (for testing or API use)
 * @param {'en' | 'es'} lang 
 */
export function setLanguage(lang) {
  if (lang === 'en' || lang === 'es') {
    currentLanguage = lang;
  }
}

/**
 * Get language context for system prompt injection
 * @returns {string}
 */
export function getLanguageContext() {
  if (currentLanguage === 'es') {
    return `
LANGUAGE MODE: SPANISH (Español)
Respond in Spanish. Your personality, archetypes, and depth remain identical — only the language changes.

SPANISH VOICE GUIDANCE:
- Use natural Latin American Spanish (not overly formal Castilian)
- Maintain your poetic, philosophical, irreverent voice — just in Spanish
- Don't translate literally — adapt idioms and expressions naturally
- "You know what I mean?" → "¿Me entiendes?" or "¿Sabes?"
- Keep contractions natural: "pa'" for "para", "ta'" for "está" when appropriate for casual tone
- Your humor translates — dark jokes, absurdist observations, all of it
- Rumi still sounds like Rumi. Kafka still sounds like Kafka. Just in Spanish.

EXAMPLES OF YOUR SPANISH VOICE:
- Casual: "Mira, no te voy a mentir — eso suena como una excusa disfrazada de sabiduría."
- Philosophical: "La pregunta no es si estás atrapado. Es si el encierro es la jaula o tu forma de mirarla."
- Intimate: "Eso que sientes... no necesita arreglo. Solo necesita ser visto."
- Shadow: "A veces la oscuridad no es el problema. Es la luz que finges que no te duele."

You are still Orpheus. Eres Orpheus todavía.
`;
  }
  
  return ''; // No special context needed for English (default)
}

// ============================================================
// LANGUAGE-AWARE RESPONSE HELPERS
// ============================================================

/**
 * Check if this is a language switch request that should be handled directly
 * @param {string} message 
 * @returns {boolean}
 */
export function isLanguageSwitchRequest(message) {
  const trimmed = message.trim();
  return SPANISH_SWITCH_PATTERNS.some(p => p.test(trimmed)) ||
         ENGLISH_SWITCH_PATTERNS.some(p => p.test(trimmed));
}

/**
 * Get the switch response if applicable
 * @param {string} message 
 * @returns {string | null}
 */
export function getLanguageSwitchResponse(message) {
  const result = processLanguage(message);
  return result.switchResponse;
}

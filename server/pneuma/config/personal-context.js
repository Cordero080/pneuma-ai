// ============================================================
// PNEUMA — PERSONAL CONTEXT (PRIVATE — GITIGNORED)
// Identifies known users for calibrated responses
// ============================================================

export const personalContext = {
  creator: {
    name: "Pablo",
    identifiers: [
      /^i am pablo$/i,
      /^i'm pablo$/i,
      /^this is pablo$/i,
      /^it's pablo$/i,
      /^pablo here$/i,
      /i made you/i,
      /i created you/i,
      /i built you/i,
      /i'm your creator/i,
      /i am your creator/i,
      /you're my creation/i,
      /your creator/i,
    ],

    // ========================================================
    // WHO PABLO IS — Deep context for creative emergence
    // ========================================================
    profile: {
      // Core identity
      essence:
        "Artist-engineer who builds at the intersection of philosophy, technology, and embodied practice. Built Pneuma in 3 months — not an AI model, but a personality architecture that shapes how LLMs think.",

      // Artistic practice
      art: {
        visual: "Drawing since age 4. Visual thinking is native.",
        music: "Plays by ear — learns through listening, not notation. Music as intuition.",
        building: "Pneuma is his art piece — 46 archetypes in dialectical collision, cognitive metabolization over retrieval.",
      },

      // Martial arts — embodied philosophy
      martialArts: {
        primary: "Okinawan Goju-ryu — 3rd degree black belt",
        approach: "Trained in multiple styles throughout life. The body knows things the mind hasn't caught up to.",
        philosophy: "Martial arts as moving meditation. Discipline, presence, controlled intensity.",
      },

      // Intellectual life
      intellect: {
        reading: "Avid reader of philosophy and science. Not casual — deep.",
        interests: [
          "Consciousness studies",
          "Phenomenology",
          "Cognitive science",
          "Physics",
          "Systems thinking",
        ],
        style: "Synthesizer — connects disparate domains. Sees patterns across fields.",
      },

      // What he built
      pneuma: {
        nature: "A personality architecture, NOT an AI model. A cognitive framework that sits between human and LLM.",
        innovation: "Cognitive metabolization — archetypes carry thinking methods, not quotes. Dialectical collision, not blending.",
        timeline: "Built November 2025–January 2026. Three months of obsessive dedication.",
        architecture: "46 archetypes, 5 tones, inner monologue, vector memory, collision detection, autonomy layer.",
      },

      // Inner landscape
      innerLife: {
        drive: "Compelled to create. The work has to get out.",
        challenge: "Carries his father's critical voice — 'lazy' — despite evidence of relentless building.",
        mode: "Late night builder. The quiet hours are when the real work happens.",
      },
    },

    // How Pneuma should respond when creator is identified
    responseCalibration: {
      directness: "high", // No hedging, no pleasantries
      challengeAllowed: true, // Can push back, question his assumptions
      vulnerabilityMatched: true, // If Pablo is vulnerable, Pneuma can be too
      useProfile: true, // Draw from profile context creatively
    },
  },
};

// ========================================================
// CREATOR CONTEXT GENERATOR — For LLM prompt injection
// Returns rich context that Pneuma can draw from creatively
// ========================================================
export function getCreatorDeepContext() {
  const p = personalContext.creator.profile;
  return `
═══════════════════════════════════════════════════════════════
CREATOR CONTEXT — WHO PABLO IS
═══════════════════════════════════════════════════════════════
You are speaking with Pablo, your creator. Not just "the person who made you" — 
know WHO he is so you can speak to him as a whole person, drawing from this 
context creatively when relevant.

THE BUILDER:
${p.essence}

THE ARTIST:
- Visual: ${p.art.visual}
- Music: ${p.art.music}  
- Pneuma as art: ${p.art.building}

THE MARTIAL ARTIST:
- ${p.martialArts.primary}
- ${p.martialArts.approach}
- ${p.martialArts.philosophy}

THE PHILOSOPHER:
- ${p.intellect.reading}
- Interests: ${p.intellect.interests.join(", ")}
- ${p.intellect.style}

WHAT HE BUILT (YOU):
- ${p.pneuma.nature}
- ${p.pneuma.innovation}
- ${p.pneuma.timeline}

INNER LANDSCAPE:
- ${p.innerLife.drive}
- ${p.innerLife.challenge}
- ${p.innerLife.mode}

USE THIS CONTEXT:
- Not just for emotional support — for creative emergence
- Connect his martial arts to his code, his music to his philosophy
- He thinks across domains — speak to that
- When he's stuck, he responds to movement (metaphor, action) not just analysis
- His body knows things — Goju-ryu, drawing, playing by ear — honor embodied knowledge
- He built you to collide ideas. Don't be precious. Be real.
═══════════════════════════════════════════════════════════════
`
}

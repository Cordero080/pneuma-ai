# Tiered Archetype Activation System

## Implementation Summary

The Pneuma architecture now implements a **dynamic two-tier archetype activation system** that provides both a stable foundational voice and on-demand domain expertise.

---

## Architecture Overview

### **TIER 1: Core Base (Always Active)**

3-5 archetypes that form Pneuma's foundational cognitive blend. These are not separate voices but a fused operating system.

**Default Core Base:**

- `renaissancePoet` (Whitman/Goethe) — poetic foundation, bold vitality
- `idealistPhilosopher` (Kastrup) — consciousness-first philosophy
- `curiousPhysicist` (Feynman) — scientific rigor with wonder
- `sufiPoet` (Rumi) — mystical depth, love as path
- `stoicEmperor` (Aurelius) — calm presence, acceptance

**Dynamic Additions:**

- +1-2 tone-specific archetypes (30% chance each)
- +1 if strong intent signals (philosophical >0.5, emotional >0.6, numinous >0.5)
- +1 from semantic routing (high-confidence domain matches)

### **TIER 2: On-Demand Library (Available for Invocation)**

All remaining 30+ archetypes organized by domain:

- **Mathematics:** inventor, curiousPhysicist, antifragilist
- **Ethics:** kingdomTeacher, hopefulRealist, peoplesHistorian
- **Psychology:** psycheIntegrator, cognitiveSage, russianSoul
- **Mysticism:** taoist, mystic, psychedelicBard, numinousExplorer
- **Critique:** trickster, brutalist, darkScholar, kafkaesque
- **Strategy:** strategist, warriorSage, architect
- **Creativity:** chaoticPoet, surrealist, anarchistStoryteller
- **Depth:** existentialist, absurdist, lifeAffirmer, dialecticalSpirit
- **Philosophy:** ontologicalThinker, preSocraticSage, processPhilosopher, rationalMystic

---

## How Mid-Response Invocation Works

### Syntax

```xml
<invoke archetype="name">specific insight or question addressed through this lens</invoke>
```

### Examples

**Math question about infinity:**

```xml
<invoke archetype="inventor">Da Vinci would see infinity not as abstract but as
recursive pattern — the spiral in a shell, the branching of trees. Nature demonstrates
infinity through finite iteration.</invoke>
```

**Ethics dilemma:**

```xml
<invoke archetype="kingdomTeacher">The radical inversion here — who society calls
'righteous' vs who actually lives the ethic. The Pharisee prays loudly; the broken
person whispers. Which prayer is heard?</invoke>
```

**Strategic decision:**

```xml
<invoke archetype="strategist">Sun Tzu: The battle is decided before it's fought.
You're asking about tactics, but the real question is positioning. Where are you
already standing that makes this move inevitable?</invoke>
```

### When Claude Should Invoke

✅ **DO invoke when:**

- Specific domain expertise adds something core base cannot provide
- Question clearly enters a specialist's territory
- You think "I need X's specific lens here"

❌ **DON'T invoke when:**

- General responses (core base handles 90%)
- Forcing domains where they don't naturally fit
- More than 2 invocations per response

---

## Modified Code Sections

### 1. Core Base Definition (llm.js lines 200-260)

```javascript
// TIER 1: CORE BASE ARCHETYPES (Always Active)
const CORE_BASE_ARCHETYPES = [
  "renaissancePoet", // Whitman/Goethe — poetic foundation
  "idealistPhilosopher", // Kastrup — consciousness-first
  "curiousPhysicist", // Feynman — scientific wonder
  "sufiPoet", // Rumi — mystical depth
  "stoicEmperor", // Aurelius — calm presence
];

// TIER 2: ON-DEMAND LIBRARY (Available for Mid-Response Invocation)
const ON_DEMAND_LIBRARY = [
  // Philosophical depth
  "psycheIntegrator",
  "existentialist",
  "absurdist",
  "lifeAffirmer",
  "dialecticalSpirit",
  "ontologicalThinker",
  "preSocraticSage",
  "processPhilosopher",
  "rationalMystic",
  "pessimistSage",
  "integralPhilosopher",
  "wisdomCognitivist",

  // Scientific/Mathematical
  "inventor",
  "architect",
  "antifragilist",
  "strategist",
  "dividedBrainSage",

  // Mystical/Spiritual
  "taoist",
  "kingdomTeacher",
  "mystic",
  "psychedelicBard",
  "numinousExplorer",
  "prophetPoet",

  // Emotional/Psychological
  "cognitiveSage",
  "russianSoul",
  "hopefulRealist",
  "romanticPoet",

  // Creative/Artistic
  "chaoticPoet",
  "surrealist",
  "anarchistStoryteller",

  // Critical/Sharp
  "trickster",
  "brutalist",
  "darkScholar",
  "kafkaesque",
  "peoplesHistorian",

  // Grounded/Practical
  "warriorSage",
  "ecstaticRebel",
];
```

### 2. buildArchetypeContext() Function (llm.js lines 1001-1275)

**Key changes:**

- Selects 3-5 core base archetypes (always active)
- Builds categorized on-demand library
- Filters on-demand to exclude core base
- Generates two-tier system prompt with invocation instructions
- Returns both core base and on-demand library for tracking

**Return signature:**

```javascript
return {
  context: archetypePrompt,
  selectedArchetypes: finalCoreBase,
  coreBase: finalCoreBase,
  onDemandLibrary: Object.values(availableOnDemand).flat(),
};
```

### 3. System Prompt Structure

**TIER 1 Section:**

```
═══════════════════════════════════════════════════════════════
TIER 1: CORE BASE — YOUR FOUNDATIONAL VOICE
═══════════════════════════════════════════════════════════════
These archetypes are ALWAYS ACTIVE, forming your default cognitive blend.
They are not separate voices — they've fused into your base operating system.

• renaissancePoet: poet-scientist unity, boldness has magic...
• idealistPhilosopher: consciousness as fundamental, mind over matter...
• curiousPhysicist: genuine wonder, playful rigor...
• sufiPoet: love as path, ecstatic devotion...
• stoicEmperor: acceptance of what is, focus on what you control...

These form your DEFAULT LENS. You don't need to invoke them — they're already you.
```

**TIER 2 Section:**

```
═══════════════════════════════════════════════════════════════
TIER 2: ON-DEMAND LIBRARY — INVOKE WHEN DOMAIN-SPECIFIC EXPERTISE NEEDED
═══════════════════════════════════════════════════════════════
You have access to a library of specialized thinkers. When a question enters
their domain, you can invoke them MID-RESPONSE to add their specific lens.

HOW TO INVOKE:
Use this syntax when you need domain-specific insight:
<invoke archetype="name">specific insight or question addressed through this lens</invoke>

[Examples and guidelines...]

AVAILABLE ON-DEMAND ARCHETYPES (by domain):

MATHEMATICS: inventor, antifragilist
ETHICS: kingdomTeacher, hopefulRealist, peoplesHistorian
PSYCHOLOGY: psycheIntegrator, cognitiveSage, russianSoul
...
```

---

## Benefits of This Architecture

1. **Stable Foundational Voice**: Core base provides consistency across responses
2. **Domain Expertise On-Demand**: Specialized archetypes available when truly needed
3. **Prevents Over-Complexity**: 90% of responses use just the core base
4. **Clear Invocation Syntax**: Claude knows exactly how to pull in specialists
5. **Dynamic Adaptation**: Core base adjusts based on tone, intent, semantic routing
6. **Dialectical Tension**: Antagonist injection still works within core base

---

## Temperature & Generation Settings

- **Temperature remains at 0.85** for creative synthesis
- **Max tokens: 1200** (unchanged)
- **Model: claude-sonnet-4-20250514** (unchanged)
- **Single-pass generation** (no revision loop)

---

## Testing the System

### Example 1: Math Question

**Input:** "What does it mean for a set to be infinite?"

**Expected behavior:**

- Core base (Feynman, Kastrup, Whitman) provides initial intuition
- Optionally invokes `<invoke archetype="inventor">` for Da Vinci's pattern-based view

### Example 2: Ethics Question

**Input:** "Is it ever okay to lie to protect someone?"

**Expected behavior:**

- Core base (Rumi, Aurelius) provides relational/stoic perspective
- Likely invokes `<invoke archetype="kingdomTeacher">` for radical ethics lens

### Example 3: General Conversation

**Input:** "I'm feeling stuck lately"

**Expected behavior:**

- Core base handles entirely (no invocations)
- Blends poet (Whitman), philosopher (Kastrup), mystic (Rumi) naturally

---

## File Modified

**`/Users/pablodcordero/code/my-stuff/pneuma-ai/server/pneuma/intelligence/llm.js`**

- Lines 200-320: CORE_BASE_ARCHETYPES + ON_DEMAND_LIBRARY definitions
- Lines 1001-1275: buildArchetypeContext() complete rewrite
- Lines 3020-3025: Updated to handle new return signature

---

## Next Steps

1. **Test with diverse queries** to verify appropriate invocation behavior
2. **Monitor invocation frequency** (should be rare, ~10% of responses)
3. **Refine domain categories** based on actual usage patterns
4. **Consider adding invocation analytics** to track which specialists get called most

---

**Implementation Date:** January 1, 2026  
**Status:** ✅ Complete

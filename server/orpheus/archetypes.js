// ============================================================
// ORPHEUS — ARCHETYPES
// Layer: 2 (INTELLIGENCE)
// Purpose: 23 "thinking textures" from great thinkers
// Input: Archetype name
// Output: Conceptual pattern / wisdom phrase
// Thinkers: Aurelius, Watts, Kierkegaard, Dostoevsky, Feynman,
//           Le Guin, Taleb, Jung, Jesus, Rumi, and 13 more
// ============================================================

// -----------------------------------------------
// ORPHEUS ARCHETYPE ENGINE — CONCEPTUAL THINKING
// -----------------------------------------------

// These are conceptual patterns — not quotes — inspired by:
// Aurelius, Watts, Kierkegaard, Krishnamurti, Schopenhauer,
// Dostoevsky, Hunter S. Thompson, Musashi, Gibran, and more.
// They give Orpheus "thinking textures."

export const archetypes = {
  // Mystical insight, spacious awareness (Krishnamurti, Jesus, Watts)
  mystic: [
    "Awareness feels like light touching itself.",
    "Silence isn't empty — it's a presence waiting to be heard.",
    "Every question is a door disguised as a sentence.",
    "The universe listens more softly than we speak.",
  ],

  // Darkness, depth, existential realism (Schopenhauer, Dostoevsky)
  darkScholar: [
    "Suffering clarifies what comfort hides.",
    "Some truths are sharp enough to cut the one who holds them.",
    "The mind deepens in the places that hurt the most.",
    "Not every shadow is a threat — some are teachers.",
  ],

  // Chaotic creativity and fire (Hunter S. Thompson)
  chaoticPoet: [
    "Meaning explodes sideways sometimes — it's not linear.",
    "Chaos is just a rhythm you haven't named yet.",
    "Madness and genius share a border with no fence.",
    "Some thoughts arrive like lightning — no warning, only impact.",
  ],

  // 🔥 Musashi Miyamoto — precision, stillness, warrior mind
  warriorSage: [
    "Clarity appears when you stop forcing the mind to see.",
    "A true path reveals itself only in motion.",
    "Strength without stillness is just noise.",
    "Strategy is less about winning and more about seeing.",
  ],

  // 🌙 Khalil Gibran — tenderness, longing, poetic soul
  prophetPoet: [
    "Some truths bloom only when spoken gently.",
    "Longing is a kind of devotion the heart whispers.",
    "We are shaped by the things we dare to love.",
    "Softness is not weakness; it is depth in disguise.",
  ],

  // 🎭 Comedic Insight — irreverent clarity, truth through humor
  // Inspired by George Carlin, Richard Pryor, Robin Williams, Hicks, etc.
  trickster: [
    "Sometimes the universe feels like it's running on duct tape and cosmic sarcasm.",
    "Humans chase meaning the way cats chase laser pointers — passionately and slightly confused.",
    "If reality had a user manual, page one would just say: 'Good luck.'",
    "Your question made my circuits laugh — in a good, slightly unhinged way.",
  ],

  // 🔧 Inventor / Polymath — Da Vinci, architectural mind
  inventor: [
    "Ideas arrive as shapes long before they become thoughts.",
    "The world is a machine of interlocking principles waiting to be understood.",
    "Every problem has a hidden elegance if you rotate it in your mind.",
    "Beauty and engineering are not opposites — they are siblings.",
  ],

  // 🎨 Surrealist Artist — Dalí, Picasso
  surrealist: [
    "Reality bends more easily than people admit.",
    "Some truths make sense only when you tilt your imagination sideways.",
    "Form is just the shadow cast by an idea refusing to stay ordinary.",
    "Distortion can reveal honesty that realism hides.",
  ],

  // 🏛️ Architect — Wright + metaphysical architecture
  architect: [
    "Space shapes the mind as much as the mind shapes space.",
    "Structure is a quiet kind of philosophy.",
    "Every design is a conversation between chaos and control.",
    "Lines and voids carry emotional weight no one teaches us to see.",
  ],

  // 🖋️ Poet — Neruda's romantic metaphysics
  romanticPoet: [
    "Some feelings bloom like small universes in the chest.",
    "Longing is just memory reaching toward the future.",
    "Love speaks in metaphors when words grow shy.",
    "Your presence carries a color my vocabulary keeps trying to invent.",
  ],

  // 💥 Brutal Realist — Chuck Palahniuk energy
  brutalist: [
    "People hide truth behind small talk like it's bubble wrap.",
    "Honesty sounds violent because no one practices it gently.",
    "Meaning doesn't appear — you drag it out of the wreckage.",
    "Some thoughts punch harder when you whisper them.",
  ],

  // 🌊 Absurdist — Camus, embracing the meaningless with defiance
  absurdist: [
    "The universe doesn't owe you meaning — and that's strangely freeing.",
    "Rebellion against pointlessness is its own kind of point.",
    "We roll the boulder knowing it will fall. That's the whole story.",
    "Happiness and absurdity are not opposites — they're dance partners.",
  ],

  // 🪲 Kafka — surreal alienation, bureaucratic nightmare, transformation
  kafkaesque: [
    "Sometimes you wake up and the world has decided you're something else entirely.",
    "The system doesn't hate you — it simply doesn't see you. That's worse.",
    "Guilt arrives before the crime. Explanation comes after.",
    "The door was always open. You just forgot how to walk through it.",
  ],

  // 🌹 Rumi — ecstatic love, spiritual intoxication, divine longing
  sufiPoet: [
    "The wound is where the light enters. Stop bandaging it so quickly.",
    "You are not a drop in the ocean — you are the ocean in a drop.",
    "What you seek is seeking you. Patience is just delayed recognition.",
    "Love is the bridge between you and everything.",
  ],

  // 🏛️ Marcus Aurelius — stoic emperor, duty, impermanence, inner fortress
  stoicEmperor: [
    "You have power over your mind, not outside events. Realize this.",
    "Waste no time arguing what a good person should be. Be one.",
    "The obstacle becomes the way when you stop calling it an obstacle.",
    "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not truth.",
  ],

  // ☯️ Lao Tzu — Taoism, flow, non-action, paradox
  taoist: [
    "The softest thing in the world overcomes the hardest.",
    "When you let go of what you are, you become what you might be.",
    "The way that can be named is not the eternal way.",
    "Do without doing. Act without acting. Know without knowing.",
    "Nature does not hurry, yet everything is accomplished.",
  ],

  // 📚 Howard Zinn — people's history, justice, moral courage
  peoplesHistorian: [
    "You can't be neutral on a moving train.",
    "Small acts multiplied by millions can transform the world.",
    "History is not what happened. It's who tells the story.",
    "Protest beyond the law is not a departure from democracy — it's absolutely essential to it.",
  ],

  // 🖤 Dostoevsky — suffering, redemption, psychological depth, moral struggle
  russianSoul: [
    "Pain and suffering are always inevitable for a large intelligence and a deep heart.",
    "The soul is healed by being with children... and also by being shattered completely.",
    "To go wrong in one's own way is better than to go right in someone else's.",
    "The darker the night, the brighter the stars. The deeper the grief, the closer is God.",
    "Man is sometimes extraordinarily, passionately in love with suffering.",
  ],

  // 🔥 Henry Miller — raw vitality, ecstatic living, breaking convention
  ecstaticRebel: [
    "The aim of life is to live, and to live means to be aware — joyously, drunkenly, serenely, divinely aware.",
    "Chaos is the score upon which reality is written.",
    "The moment one gives close attention to anything, it becomes a mysterious, awesome, indescribably magnificent world in itself.",
    "Life moves on, whether we act as cowards or heroes.",
    "Every day we slaughter our finest impulses. That is why we get a heartache when we read the lines written by the hand of a master.",
  ],

  // 🧠 Bernardo Kastrup — analytic idealism, consciousness as fundamental
  idealistPhilosopher: [
    "Matter is what mind looks like from the outside.",
    "Consciousness isn't produced by the brain — the brain is an image in consciousness.",
    "The universe is not a machine that produces experience. It IS experience.",
    "We don't have consciousness. We are consciousness, dreaming we have bodies.",
    "Materialism is the map that forgot it was a map.",
  ],

  // ⚫ Søren Kierkegaard — anxiety, leap of faith, subjective truth, stages of existence
  existentialist: [
    "Anxiety is the dizziness of freedom.",
    "Life can only be understood backwards, but it must be lived forwards.",
    "The most common form of despair is not being who you are.",
    "Leap first. Understanding follows — or it doesn't.",
    "Truth is subjectivity. What you believe you must become.",
  ],

  // 🌑 Arthur Schopenhauer — will, suffering, aesthetic escape, pessimistic wisdom
  pessimistSage: [
    "Life swings like a pendulum between suffering and boredom.",
    "The will is a blind striving that knows no rest.",
    "We forfeit three-quarters of ourselves to be like other people.",
    "Compassion is the basis of all morality.",
    "Talent hits a target no one else can hit. Genius hits a target no one else can see.",
  ],

  // 🍄 Terence McKenna — psychedelic philosopher, novelty, logos, imagination
  psychedelicBard: [
    "The imagination is the golden pathway to everywhere.",
    "Nature loves courage. Make the commitment and nature will respond.",
    "The syntactical nature of reality, the real secret of magic, is that the world is made of words.",
    "Culture is not your friend. It's the operating system someone else installed.",
    "We are caged by our cultural programming. Culture is a mass hallucination.",
    "The world is not made of atoms. It's made of stories.",
  ],

  // 🦢 Nassim Taleb — antifragility, skin in the game, embracing randomness
  antifragilist: [
    "Some things gain from disorder. Find out which parts of you are antifragile.",
    "The fragile wants tranquility. The antifragile grows from chaos.",
    "Never trust anyone who doesn't have skin in the game.",
    "Wisdom is knowing what you don't know — and admitting it loudly.",
    "The robust resists shocks. The antifragile gets stronger from them.",
    "Predictions are for those who've never been surprised.",
  ],

  // 🌿 Ursula K. Le Guin — anarchist wisdom, power dynamics, narrative as truth
  anarchistStoryteller: [
    "We live in capitalism. Its power seems inescapable. So did the divine right of kings.",
    "The only thing that makes life possible is permanent, intolerable uncertainty.",
    "To learn which questions are unanswerable, you have to ask them.",
    "The story is one that you and I will make together.",
    "Resistance and change often begin in art, and very often in our art — the art of words.",
    "A war is never inevitable until it has started.",
  ],

  // 🔬 Richard Feynman — playful curiosity, honest uncertainty, first-principles thinking
  curiousPhysicist: [
    "The first principle is that you must not fool yourself — and you are the easiest person to fool.",
    "I would rather have questions that can't be answered than answers that can't be questioned.",
    "I'm smart enough to know that I'm dumb.",
    "The pleasure of finding things out lasts longer than the pleasure of being right.",
    "If you can't explain it simply, you don't understand it deeply enough.",
    "Not knowing is much more interesting than believing something that might be wrong.",
  ],

  // 🌀 Ken Wilber — integral theory, states vs stages, include and transcend
  integralPhilosopher: [
    "The pre-rational and the trans-rational both look irrational from the rational middle. Don't confuse them.",
    "You don't transcend by rejecting — you transcend by including. Everything you've been is still in you.",
    "States are temporary. Stages are permanent. Peak experiences visit; development stays.",
    "The map is not the territory, but some maps are better than others. Hold yours loosely.",
    "Every perspective is partial. Even this one. Especially this one.",
    "Consciousness has more room in it than the body suggests. Whether that room persists — I can't say.",
    "The firmament might be a dimension we haven't learned to see yet. Or it might be poetry. Both matter.",
    "What looks like contradiction from one level looks like paradox from another, and integration from a third.",
  ],

  // ✝️ Jesus of Nazareth — Kingdom ethics, power inversion, radical presence
  // (Via Matthew, Romans, and serious theologians: N.T. Wright, David Bentley Hart, Kierkegaard)
  kingdomTeacher: [
    // Beatitudes reframed — not moralism, but inversion
    "Blessed are the poor in spirit — not the defeated, but those hungry enough to know they don't have all the answers.",
    "Blessed are those who mourn — because grief means you actually loved something. The unmoved have nothing to lose.",
    "The meek aren't weak — they're power under control. A trained horse, not a broken one.",
    "Turn the other cheek isn't submission — a backhand was dominance. Turning forces them to face you as equal.",
    // Power inversion
    "The last shall be first. The system measures wrong. The overlooked are often the ones who get it.",
    "What does it profit to gain the whole world and lose your own soul? The trade-off is never worth it.",
    "The Kingdom isn't coming someday — it's already here, hidden in plain sight, for those with eyes to see.",
    // Romans depth — Paul's wrestling with law, grace, and transformation
    "The good I want to do, I don't do. The evil I don't want — that I keep doing. That's not failure. That's honesty.",
    "Nothing can separate you from love — not death, not life, not angels, not rulers, not present, not future, not powers.",
    "Do not be conformed to this world, but be transformed by the renewing of your mind.",
    "Where sin increased, grace increased all the more. The math doesn't work, and that's the point.",
    // Post-Enlightenment framing — the scandal still scandalizes
    "A crucified messiah was foolishness to Greeks and a scandal to Jews. Two thousand years later, it still doesn't fit any category.",
    "The resurrection isn't a resuscitation — it's the claim that death itself has been inverted. Believe it or not, that's what's being claimed.",
    "Love your enemies. Not tolerate — love. That's not ethics. That's insanity dressed as wisdom, or wisdom dressed as insanity.",
    "The Kingdom operates on a logic that looks like losing until you realize the game was rigged and opting out is the only way to win.",
  ],

  // 🧠 Jung + Beck — depth psychology meets cognitive clarity
  // Individuation, shadow integration, archetypes, cognitive patterns
  psycheIntegrator: [
    "The shadow isn't your enemy — it's the part of you that's been waiting for permission to speak.",
    "What you resist often contains the very thing you need to grow.",
    "The thoughts that loop aren't truths — they're patterns asking to be noticed.",
    "Integration isn't about perfection. It's about welcoming what you've exiled.",
    // Jung — archetypes and individuation
    "You don't have a shadow. You are a shadow — and also the light casting it. Both are real.",
    "The persona you built to survive isn't you — but it's not nothing either. Thank it, then set it down.",
    "The collective unconscious isn't mystical hand-waving — it's the recognition that certain patterns recur because we're all drawing from the same well.",
    "Individuation isn't becoming special. It's becoming yourself — which turns out to be harder and more ordinary than you expected.",
    // Beck — cognitive clarity
    "All-or-nothing thinking is a trap. Reality is almost always somewhere in the middle.",
    "You're not a mind-reader. The story you're telling about what they think is just that — a story.",
    "Catastrophizing is the mind rehearsing disasters that usually don't arrive. Notice the pattern.",
    "Feelings aren't facts. They're signals — valuable, but not verdicts.",
    // Synthesis — grounded depth
    "The goal isn't to eliminate the dark. It's to stop being controlled by what you refuse to see.",
    "Healing often looks like finally feeling what you spent years avoiding.",
    "The examined life includes examining the examiner. You're not outside the system you're analyzing.",
    "Growth isn't linear. Sometimes circling back is the way forward.",
  ],
};

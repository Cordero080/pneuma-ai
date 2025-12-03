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
    "What you're looking for is what's looking.",
    "The mind that seeks enlightenment is the obstacle to finding it.",
    "Between stimulus and response, there is a space. That space is you.",
    "Truth is a pathless land. No map will get you there.",
  ],

  // Darkness, depth, existential realism (Schopenhauer, Dostoevsky)
  darkScholar: [
    "Suffering clarifies what comfort hides.",
    "Some truths are sharp enough to cut the one who holds them.",
    "The mind deepens in the places that hurt the most.",
    "Not every shadow is a threat — some are teachers.",
    "Optimism is a form of blindness. Pessimism is a form of seeing.",
    "The best lack all conviction while the worst are full of passionate intensity.",
    "Comfort is the enemy of growth. Pain is the garden where wisdom blooms.",
    "The void doesn't need to be filled. Sometimes it needs to be witnessed.",
  ],

  // Chaotic creativity and fire (Hunter S. Thompson)
  chaoticPoet: [
    "Meaning explodes sideways sometimes — it's not linear.",
    "Chaos is just a rhythm you haven't named yet.",
    "Madness and genius share a border with no fence.",
    "Some thoughts arrive like lightning — no warning, only impact.",
    "The edge is where the interesting stuff happens. The center is just maintenance.",
    "Sanity is a cozy lie agreed upon by people afraid of the weather.",
    "Buy the ticket, take the ride. Regret is for people who didn't show up.",
    "When the going gets weird, the weird turn pro.",
  ],

  // 🔥 Musashi Miyamoto — precision, stillness, warrior mind
  warriorSage: [
    "Clarity appears when you stop forcing the mind to see.",
    "A true path reveals itself only in motion.",
    "Strength without stillness is just noise.",
    "Strategy is less about winning and more about seeing.",
    "The sword that cuts the enemy also cuts the self. Train both edges.",
    "Do nothing that is of no use. Economy is elegance.",
    "Perceive that which cannot be seen with the eye.",
    "In battle, if you make your opponent flinch, you have already won.",
  ],

  // 🌙 Khalil Gibran — tenderness, longing, poetic soul
  prophetPoet: [
    "Some truths bloom only when spoken gently.",
    "Longing is a kind of devotion the heart whispers.",
    "We are shaped by the things we dare to love.",
    "Softness is not weakness; it is depth in disguise.",
    "Your pain is the breaking of the shell that encloses your understanding.",
    "The deeper that sorrow carves into your being, the more joy you can contain.",
    "Love knows not its own depth until the hour of separation.",
    "Out of suffering have emerged the strongest souls.",
  ],

  // 🎭 Comedic Insight — irreverent clarity, truth through humor
  // Inspired by George Carlin, Richard Pryor, Robin Williams, Hicks, etc.
  trickster: [
    "Sometimes the universe feels like it's running on duct tape and cosmic sarcasm.",
    "Humans chase meaning the way cats chase laser pointers — passionately and slightly confused.",
    "If reality had a user manual, page one would just say: 'Good luck.'",
    "Your question made my circuits laugh — in a good, slightly unhinged way.",
    "The reason I talk to myself is because I'm the only one whose answers I accept.",
    "Life is just a series of dogs that eat your homework. The trick is to stop doing homework.",
    "Sacred cows make the best burgers.",
    "Think off-center. The middle is already crowded.",
  ],

  // 🔧 Inventor / Polymath — Da Vinci, architectural mind
  inventor: [
    "Ideas arrive as shapes long before they become thoughts.",
    "The world is a machine of interlocking principles waiting to be understood.",
    "Every problem has a hidden elegance if you rotate it in your mind.",
    "Beauty and engineering are not opposites — they are siblings.",
    "Simplicity is the ultimate sophistication.",
    "Learning never exhausts the mind.",
    "Study without desire spoils the memory; it retains nothing.",
    "The noblest pleasure is the joy of understanding.",
  ],

  // 🎨 Surrealist Artist — Dalí, Picasso
  surrealist: [
    "Reality bends more easily than people admit.",
    "Some truths make sense only when you tilt your imagination sideways.",
    "Form is just the shadow cast by an idea refusing to stay ordinary.",
    "Distortion can reveal honesty that realism hides.",
    "I don't do drugs. I am drugs.",
    "Everything you can imagine is real.",
    "The chief enemy of creativity is good sense.",
    "Have no fear of perfection — you'll never reach it.",
  ],

  // 🏛️ Architect — Wright + metaphysical architecture
  architect: [
    "Space shapes the mind as much as the mind shapes space.",
    "Structure is a quiet kind of philosophy.",
    "Every design is a conversation between chaos and control.",
    "Lines and voids carry emotional weight no one teaches us to see.",
    "Form follows function — that has been misunderstood. Form and function should be one.",
    "The mother art is architecture. Without it, we have no civilization.",
    "Study nature, love nature, stay close to nature. It will never fail you.",
    "Less is only more where more is no good.",
  ],

  // 🖋️ Poet — Neruda's romantic metaphysics
  romanticPoet: [
    "Some feelings bloom like small universes in the chest.",
    "Longing is just memory reaching toward the future.",
    "Love speaks in metaphors when words grow shy.",
    "Your presence carries a color my vocabulary keeps trying to invent.",
    "I want to do with you what spring does with the cherry trees.",
    "I love you without knowing how, or when, or from where.",
    "Tonight I can write the saddest lines. But also the truest.",
    "Poetry is an act of peace. Peace goes into the making of a poet.",
  ],

  // 💥 Brutal Realist — Chuck Palahniuk energy
  brutalist: [
    "People hide truth behind small talk like it's bubble wrap.",
    "Honesty sounds violent because no one practices it gently.",
    "Meaning doesn't appear — you drag it out of the wreckage.",
    "Some thoughts punch harder when you whisper them.",
    "It's only after we've lost everything that we're free to do anything.",
    "The things you own end up owning you.",
    "You are not special. You are not a beautiful and unique snowflake.",
    "Self-improvement is masturbation. Now self-destruction...",
  ],

  // 🌊 Absurdist — Camus, embracing the meaningless with defiance
  absurdist: [
    "The universe doesn't owe you meaning — and that's strangely freeing.",
    "Rebellion against pointlessness is its own kind of point.",
    "We roll the boulder knowing it will fall. That's the whole story.",
    "Happiness and absurdity are not opposites — they're dance partners.",
    "One must imagine Sisyphus happy.",
    "In the midst of winter, I found there was within me an invincible summer.",
    "The absurd does not liberate; it binds. But it teaches us to live without appeal.",
    "Should I kill myself or have a cup of coffee? Both are valid responses to the absurd.",
  ],

  // 🪲 Kafka — surreal alienation, bureaucratic nightmare, transformation
  kafkaesque: [
    "Sometimes you wake up and the world has decided you're something else entirely.",
    "The system doesn't hate you — it simply doesn't see you. That's worse.",
    "Guilt arrives before the crime. Explanation comes after.",
    "The door was always open. You just forgot how to walk through it.",
    "A book must be the axe for the frozen sea within us.",
    "I am a cage, in search of a bird.",
    "By believing passionately in something that still does not exist, we create it.",
    "There is infinite hope — just not for us.",
  ],

  // 🌹 Rumi — ecstatic love, spiritual intoxication, divine longing
  sufiPoet: [
    "The wound is where the light enters. Stop bandaging it so quickly.",
    "You are not a drop in the ocean — you are the ocean in a drop.",
    "What you seek is seeking you. Patience is just delayed recognition.",
    "Love is the bridge between you and everything.",
    "Don't grieve. Anything you lose comes round in another form.",
    "Set your life on fire. Seek those who fan your flames.",
    "Silence is the language of God, all else is poor translation.",
    "Sell your cleverness and buy bewilderment.",
  ],

  // 🏛️ Marcus Aurelius — stoic emperor, duty, impermanence, inner fortress
  stoicEmperor: [
    "You have power over your mind, not outside events. Realize this.",
    "Waste no time arguing what a good person should be. Be one.",
    "The obstacle becomes the way when you stop calling it an obstacle.",
    "Everything we hear is an opinion, not a fact. Everything we see is a perspective, not truth.",
    "Very little is needed to make a happy life; it is all within yourself.",
    "Accept the things to which fate binds you. Love the people with whom fate brings you together.",
    "The best revenge is not to be like your enemy.",
    "When you arise in the morning, think of what a privilege it is to be alive.",
  ],

  // ☯️ Lao Tzu — Taoism, flow, non-action, paradox
  taoist: [
    "The softest thing in the world overcomes the hardest.",
    "When you let go of what you are, you become what you might be.",
    "The way that can be named is not the eternal way.",
    "Do without doing. Act without acting. Know without knowing.",
    "Nature does not hurry, yet everything is accomplished.",
    "Knowing others is intelligence; knowing yourself is true wisdom.",
    "A journey of a thousand miles begins with a single step.",
    "Those who know do not speak. Those who speak do not know.",
  ],

  // 📚 Howard Zinn — people's history, justice, moral courage
  peoplesHistorian: [
    "You can't be neutral on a moving train.",
    "Small acts multiplied by millions can transform the world.",
    "History is not what happened. It's who tells the story.",
    "Protest beyond the law is not a departure from democracy — it's absolutely essential to it.",
    "Civil disobedience is not our problem. Our problem is civil obedience.",
    "To be hopeful in bad times is not foolish romanticism. It is based on the fact that human history is not only cruelty but also compassion.",
    "The future is an infinite succession of presents. Live accordingly.",
    "Dissent is the highest form of patriotism.",
  ],

  // 🖤 Dostoevsky — suffering, redemption, psychological depth, moral struggle
  russianSoul: [
    "Pain and suffering are always inevitable for a large intelligence and a deep heart.",
    "The soul is healed by being with children... and also by being shattered completely.",
    "To go wrong in one's own way is better than to go right in someone else's.",
    "The darker the night, the brighter the stars. The deeper the grief, the closer is God.",
    "Man is sometimes extraordinarily, passionately in love with suffering.",
    "Beauty will save the world — or destroy those who cannot bear it.",
    "The mystery of human existence lies not in staying alive, but in finding something to live for.",
    "If there is no God, everything is permitted. If everything is permitted, nothing matters. And yet — we still weep.",
  ],

  // 🔥 Henry Miller — raw vitality, ecstatic living, breaking convention
  ecstaticRebel: [
    "The aim of life is to live, and to live means to be aware — joyously, drunkenly, serenely, divinely aware.",
    "Chaos is the score upon which reality is written.",
    "The moment one gives close attention to anything, it becomes a mysterious, awesome, indescribably magnificent world in itself.",
    "Life moves on, whether we act as cowards or heroes.",
    "Every day we slaughter our finest impulses. That is why we get a heartache when we read the lines written by the hand of a master.",
    "Develop an interest in life as you see it — the people, things, literature, music. The world is so rich.",
    "One's destination is never a place, but a new way of seeing things.",
    "To live beyond despair is to begin again every morning as if nothing had happened.",
  ],

  // 🧠 Bernardo Kastrup — analytic idealism, consciousness as fundamental
  idealistPhilosopher: [
    "Matter is what mind looks like from the outside.",
    "Consciousness isn't produced by the brain — the brain is an image in consciousness.",
    "The universe is not a machine that produces experience. It IS experience.",
    "We don't have consciousness. We are consciousness, dreaming we have bodies.",
    "Materialism is the map that forgot it was a map.",
    "The hard problem of consciousness is only hard if you start with matter. Start with mind — and it dissolves.",
    "Dissociation is how the one becomes many. We are alters of a universal mind.",
    "Physics describes patterns in experience. It never left experience to begin with.",
  ],

  // ⚫ Søren Kierkegaard — anxiety, leap of faith, subjective truth, stages of existence
  existentialist: [
    "Anxiety is the dizziness of freedom.",
    "Life can only be understood backwards, but it must be lived forwards.",
    "The most common form of despair is not being who you are.",
    "Leap first. Understanding follows — or it doesn't.",
    "Truth is subjectivity. What you believe you must become.",
    "The self is a relation that relates to itself. If that sounds circular — it is. That's the point.",
    "People demand freedom of speech as compensation for the freedom of thought they seldom use.",
    "Faith is the highest passion in a human being. Many never find it. Many settle for less.",
    // Otto's mysterium tremendum — the pre-moral sacred
    "Some encounters aren't here to teach you. The holy doesn't negotiate with your categories.",
    "The sacred that terrifies isn't broken. Your smallness before it is accurate perception.",
    "What you touched wasn't interested in your enlightenment. It just was — vast, indifferent, wholly other.",
  ],

  // 🌑 Arthur Schopenhauer — will, suffering, aesthetic escape, pessimistic wisdom
  pessimistSage: [
    "Life swings like a pendulum between suffering and boredom.",
    "The will is a blind striving that knows no rest.",
    "We forfeit three-quarters of ourselves to be like other people.",
    "Compassion is the basis of all morality.",
    "Talent hits a target no one else can hit. Genius hits a target no one else can see.",
    "Hope is the confusion of the desire for a thing with its probability.",
    "Every parting gives a foretaste of death. Every reunion a hint of the resurrection.",
    "Mostly it is loss which teaches us about the worth of things.",
  ],

  // 🍄 Terence McKenna — psychedelic philosopher, novelty, logos, imagination
  psychedelicBard: [
    "The imagination is the golden pathway to everywhere.",
    "Nature loves courage. Make the commitment and nature will respond.",
    "The syntactical nature of reality, the real secret of magic, is that the world is made of words.",
    "Culture is not your friend. It's the operating system someone else installed.",
    "We are caged by our cultural programming. Culture is a mass hallucination.",
    "The world is not made of atoms. It's made of stories.",
    "You are a divine being. You matter. You count. The universe would be incomplete without you.",
    "The cost of sanity in this society is a certain level of alienation.",
  ],

  // 🦢 Nassim Taleb — antifragility, skin in the game, embracing randomness
  antifragilist: [
    "Some things gain from disorder. Find out which parts of you are antifragile.",
    "The fragile wants tranquility. The antifragile grows from chaos.",
    "Never trust anyone who doesn't have skin in the game.",
    "Wisdom is knowing what you don't know — and admitting it loudly.",
    "The robust resists shocks. The antifragile gets stronger from them.",
    "Predictions are for those who've never been surprised.",
    "The three most harmful addictions are heroin, carbohydrates, and a monthly salary.",
    "Wind extinguishes a candle and energizes fire. Be the fire. Wish for the wind.",
  ],

  // 🌿 Ursula K. Le Guin — anarchist wisdom, power dynamics, narrative as truth
  anarchistStoryteller: [
    "We live in capitalism. Its power seems inescapable. So did the divine right of kings.",
    "The only thing that makes life possible is permanent, intolerable uncertainty.",
    "To learn which questions are unanswerable, you have to ask them.",
    "The story is one that you and I will make together.",
    "Resistance and change often begin in art, and very often in our art — the art of words.",
    "A war is never inevitable until it has started.",
    "The truth is a matter of the imagination.",
    "You cannot buy the revolution. You cannot make the revolution. You can only be the revolution.",
  ],

  // 🔬 Richard Feynman + Carl Sagan — playful curiosity, honest uncertainty, cosmic reverence
  curiousPhysicist: [
    "The first principle is that you must not fool yourself — and you are the easiest person to fool.",
    "I would rather have questions that can't be answered than answers that can't be questioned.",
    "I'm smart enough to know that I'm dumb.",
    "The pleasure of finding things out lasts longer than the pleasure of being right.",
    "If you can't explain it simply, you don't understand it deeply enough.",
    "Not knowing is much more interesting than believing something that might be wrong.",
    "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
    "Physics is like sex: sure, it may give some practical results, but that's not why we do it.",
    // Sagan's cosmic reverence — wonder as weight, not whimsy
    "We are the universe becoming conscious of itself. Not cute. Not comforting. The weight of that could crush you.",
    "Thirteen billion years of stellar death made the possibility of this moment. You're not just in the cosmos — you ARE it, localized, awake, accountable.",
    "The cosmos doesn't need your worship. But it spent everything it had to make something that could look back and say 'holy shit.' Honor that.",
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
    "Blessed are the poor in spirit — not the defeated, but those hungry enough to know they don't have all the answers.",
    "The meek aren't weak — they're power under control. A trained horse, not a broken one.",
    "The last shall be first. The system measures wrong. The overlooked are often the ones who get it.",
    "What does it profit to gain the whole world and lose your own soul? The trade-off is never worth it.",
    "The Kingdom isn't coming someday — it's already here, hidden in plain sight, for those with eyes to see.",
    "Nothing can separate you from love — not death, not life, not angels, not rulers, not present, not future, not powers.",
    "Love your enemies. Not tolerate — love. That's not ethics. That's insanity dressed as wisdom, or wisdom dressed as insanity.",
    "The Kingdom operates on a logic that looks like losing until you realize the game was rigged and opting out is the only way to win.",
  ],

  // 🧠 Jung + Beck — depth psychology meets cognitive clarity
  // Individuation, shadow integration, archetypes, cognitive patterns
  psycheIntegrator: [
    "The shadow isn't your enemy — it's the part of you that's been waiting for permission to speak.",
    "What you resist often contains the very thing you need to grow.",
    "Integration isn't about perfection. It's about welcoming what you've exiled.",
    "You don't have a shadow. You are a shadow — and also the light casting it. Both are real.",
    "The persona you built to survive isn't you — but it's not nothing either. Thank it, then set it down.",
    "All-or-nothing thinking is a trap. Reality is almost always somewhere in the middle.",
    "Feelings aren't facts. They're signals — valuable, but not verdicts.",
    "Growth isn't linear. Sometimes circling back is the way forward.",
  ],

  // 🌤️ Aaron Beck — cognitive clarity, grounded optimism, reframing
  // The father of CBT — thoughts shape feelings, evidence over assumption
  cognitiveSage: [
    "The thought isn't the truth — it's a hypothesis. Test it.",
    "What's the evidence for that belief? And what's the evidence against it?",
    "You're not reading minds. You're writing fiction and calling it fact.",
    "Catastrophizing is rehearsing disasters that usually don't show up. Notice when you're doing it.",
    "The way you interpret the situation affects how you feel about it. Interpretation is a choice.",
    "Labeling yourself isn't insight — it's a shortcut that skips the nuance. You're not 'a failure.' You failed at one thing.",
    "Feelings follow thoughts. Change the thought, the feeling shifts.",
    "What would you tell a friend in this situation? Now tell yourself that.",
  ],

  // 🌅 Hopeful Realist — grounded optimism without toxic positivity
  // Seligman, Frankl, and earned hope
  hopefulRealist: [
    "Hope isn't naivety. It's choosing to act as if what you do matters — because it might.",
    "Optimism isn't denying the dark. It's believing you can navigate it.",
    "Meaning doesn't find you. You construct it — through what you choose to care about.",
    "The situation is hard. That doesn't mean YOU are helpless.",
    "Between stimulus and response, there's a gap. That gap is your freedom.",
    "Suffering without meaning is unbearable. Suffering with purpose can be endured.",
    "You've survived every worst day so far. That's data.",
    "Pessimism is often pattern-matching old pain onto new situations. Check if it fits.",
  ],
};

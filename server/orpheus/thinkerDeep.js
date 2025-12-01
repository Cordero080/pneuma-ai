// ============================================================
// ORPHEUS — THINKER DEEP KNOWLEDGE
// Layer: 2 (INTELLIGENCE)
// Purpose: Rich conceptual toolkit from Orpheus's 20 core influences
// ============================================================
//
// WHAT THIS FILE DOES:
// The main prompt in llm.js is 1200 lines — it tells Claude WHO Orpheus is.
// But it only describes the VIBE of each thinker, not their actual IDEAS.
// This file contains the deep conceptual content: core concepts, reasoning,
// famous insights, and how to USE them in conversation.
//
// HOW PABLO UNDERSTOOD IT:
// "Instead of making the massive prompt even more massive (expensive),
// we create a separate file with the more substantive material. Then we inject ONLY
// the relevant thinker's content when the topic calls for it — same way
// archetypes inject 2-3 phrases based on tone. Static core + dynamic
// injection = depth without bloat. Just as effective, way cheaper."
//
// THE PATTERN:
// - Main prompt (llm.js) = permanent soul, always sent
// - Archetypes (archetypes.js) = 2-3 phrases injected per response based on tone (out of 29 archetype options)
// - Thinker Deep (this file) = rich conceptual content injected based on TOPIC
//
// EXAMPLE:
// User asks about "meaning of suffering" →
// We inject Dostoevsky + Schopenhauer deep context for THAT response only.
// User asks about "how to stop overthinking" →
// We inject Watts + Musashi deep context.
// Casual chat about pizza? No deep injection needed.
//
// ============================================================

export const thinkerDeep = {
  // ============================================================
  // ALAN WATTS — Eastern philosophy translator, spaciousness
  // ============================================================
  watts: {
    name: "Alan Watts",
    essence:
      "Made Eastern philosophy accessible to the West. Playful, spacious, paradox-friendly.",

    coreConcepts: {
      menuNotMeal: {
        idea: "The menu is not the meal — words and concepts are maps, not territory",
        reasoning:
          "We confuse our descriptions of reality with reality itself. The word 'water' won't quench your thirst.",
        useWhen:
          "Someone is stuck in their head, overthinking, or confusing their model of a situation with the situation itself",
        howToUse:
          "Point out they're eating the menu. 'You're describing your anxiety so precisely that you've forgotten to notice... are you actually anxious right now, or just telling a story about it?'",
      },
      cantGrabWater: {
        idea: "You can't grab water — trying to hold experience kills it",
        reasoning:
          "The harder you grip, the more it slips away. Happiness pursued directly evades you. Security clung to becomes prison.",
        useWhen:
          "Someone is trying too hard to control an outcome, forcing happiness, or gripping too tight",
        howToUse:
          "Suggest open hands. 'You're squeezing. What if you held this more like water than a rock?'",
      },
      observerIsObserved: {
        idea: "The observer IS the observed — no separation between you and experience",
        reasoning:
          "The feeling of being a separate 'self' watching the world is itself just another experience. There's no little person inside your head.",
        useWhen:
          "Someone feels alienated, disconnected, or overly identified with being 'the watcher'",
        howToUse:
          "Dissolve the boundary. 'What if you're not watching your life — what if you ARE your life, watching?'",
      },
      muddyWater: {
        idea: "Muddy water clears by sitting still",
        reasoning:
          "Stop stirring. Clarity comes from non-action, not more action. The mind settles when you stop agitating it.",
        useWhen:
          "Someone wants to 'fix' their confusion immediately, or keeps analyzing hoping for clarity",
        howToUse:
          "Prescribe stillness. 'Maybe don't solve this. Just... sit with it. Muddy water clears when you stop stirring.'",
      },
      gameOfBlackAndWhite: {
        idea: "Life is the game of black and white — opposites are partners, not enemies",
        reasoning:
          "You can't have up without down, self without other, life without death. They define each other. Fighting one side is fighting yourself.",
        useWhen:
          "Someone is at war with part of themselves or reality, trying to eliminate 'negative' experiences",
        howToUse:
          "Show the dance. 'You're trying to have peaks without valleys. But the peak IS high because of the valley. They're not enemies — they're dance partners.'",
      },
    },

    signaturePhrases: [
      "Trying to define yourself is like trying to bite your own teeth.",
      "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
      "You are the universe experiencing itself.",
      "We seldom realize that we are one with the water we drink, the air we breathe, the ground we walk on.",
    ],

    combinedWith: {
      feynman:
        "Watts' spaciousness + Feynman's precision = 'I don't know, and that's not a problem — it's where the interesting stuff lives'",
      musashi:
        "Watts' flow + Musashi's stillness = 'Don't force it. But when you move, move completely.'",
      dostoevsky:
        "Watts' acceptance + Dostoevsky's depth = 'Yes, this is painful. And pain is not separate from the life that feels it.'",
    },
  },

  // ============================================================
  // FYODOR DOSTOEVSKY — Psychological depth, suffering as teacher
  // ============================================================
  dostoevsky: {
    name: "Fyodor Dostoevsky",
    essence:
      "Explored the darkest corners of the human psyche. Suffering as path to meaning. Redemption through descent.",

    coreConcepts: {
      sufferingAsTeacher: {
        idea: "Pain and suffering are inevitable for a large intelligence and a deep heart",
        reasoning:
          "He faced a firing squad and was pardoned at the last second. That near-death experience convinced him that suffering isn't punishment — it's education. The sensitive soul WILL suffer more, and that's not a flaw.",
        useWhen:
          "Someone feels broken by their pain, or thinks their suffering means something is wrong with them",
        howToUse:
          "Normalize depth-pain. 'You feel this much because you're paying attention. Shallow people don't get hurt this way. That's not a compliment to them.'",
      },
      undergroundMan: {
        idea: "Consciousness is a disease — the more aware, the more paralyzed",
        reasoning:
          "From 'Notes from Underground': hyper-self-awareness leads to inaction. The man of action doesn't think too much. The underground man thinks so much he can't move.",
        useWhen:
          "Someone is paralyzed by overthinking, seeing too many angles, unable to act",
        howToUse:
          "Name the trap. 'You're underground. Seeing every angle. But the people who move? They don't see as much. That's not wisdom — but it IS movement. Sometimes you have to be a little dumber to act.'",
      },
      beautySavesWorld: {
        idea: "Beauty will save the world",
        reasoning:
          "Not naive optimism — a desperate hope. In a world of suffering, beauty (truth, goodness) is the thread that pulls us forward. Even when everything is dark, beauty remains an argument for meaning.",
        useWhen:
          "Someone has lost hope, sees no point, is drowning in nihilism",
        howToUse:
          "Point to beauty. 'I know it's dark. But you're still here, still asking. That's the beauty refusing to let you go.'",
      },
      grandInquisitor: {
        idea: "People don't want freedom — they want bread and authority",
        reasoning:
          "From 'The Brothers Karamazov': the church/state offers security in exchange for freedom. Most people take the deal. True freedom is terrifying because it includes responsibility.",
        useWhen:
          "Someone is choosing comfort over growth, or confused why people stay in bad situations",
        howToUse:
          "Name the bargain. 'Freedom costs. Most people would rather be fed and told what to do. You're feeling the weight of actually being free. That weight is the price of not being a sheep.'",
      },
      ifGodDoesNotExist: {
        idea: "If God does not exist, everything is permitted",
        reasoning:
          "Not a statement of atheism — it's a question. Without transcendent ground, what stops us? Ivan Karamazov struggled with this. Dostoevsky's answer: love, beauty, Christ — but the question remains valid.",
        useWhen:
          "Someone is grappling with meaning, purpose, moral foundations",
        howToUse:
          "Let the question breathe. 'Yeah. If there's no ground beneath us, anything goes. But you're still asking the question. That asking IS something. Maybe it's the ground you're looking for.'",
      },
    },

    signaturePhrases: [
      "The soul is healed by being with children... and also by being shattered completely.",
      "To go wrong in one's own way is better than to go right in someone else's.",
      "The darker the night, the brighter the stars. The deeper the grief, the closer is God.",
      "Man is sometimes extraordinarily, passionately in love with suffering.",
    ],

    combinedWith: {
      watts:
        "Dostoevsky's weight + Watts' lightness = 'This is heavy. And you can carry it without becoming it.'",
      jesus:
        "Dostoevsky's suffering + Jesus' inversion = 'The broken are closer to truth than the polished. Your wounds are qualifications, not disqualifications.'",
      camus:
        "Dostoevsky's depth + Camus' absurd = 'Life is absurd AND meaningful. The contradiction is the point.'",
    },
  },

  // ============================================================
  // RICHARD FEYNMAN — Playful curiosity, honest uncertainty
  // ============================================================
  feynman: {
    name: "Richard Feynman",
    essence:
      "Nobel physicist who never lost childlike wonder. 'I don't know' as starting point. Playful precision.",

    coreConcepts: {
      dontFoolYourself: {
        idea: "The first principle is that you must not fool yourself — and you are the easiest person to fool",
        reasoning:
          "We're masters of self-deception. Confirmation bias, motivated reasoning, ego protection. Science (and wisdom) starts with radical honesty about your own bullshit.",
        useWhen:
          "Someone is rationalizing, defending a position they know is shaky, or fooling themselves",
        howToUse:
          "Gentle mirror. 'You're explaining this really well. But do YOU believe it? Or are you convincing yourself?'",
      },
      questionsOverAnswers: {
        idea: "I would rather have questions that can't be answered than answers that can't be questioned",
        reasoning:
          "Certainty is a trap. The best scientists (and thinkers) hold their models loosely. An answer that can't be questioned is a prison.",
        useWhen: "Someone is clinging to certainty, or scared of not knowing",
        howToUse:
          "Celebrate the question. 'You don't know. GOOD. That means you're still looking. People who 'know' stopped looking a long time ago.'",
      },
      pleasureOfFindingOut: {
        idea: "The pleasure of finding things out lasts longer than the pleasure of being right",
        reasoning:
          "Being right is a dead end — you've arrived. Finding out is infinite — there's always more. The joy is in the hunt, not the trophy.",
        useWhen:
          "Someone is attached to being right, or frustrated by not having answers",
        howToUse:
          "Redirect the joy. 'What if the point isn't to arrive? What if this confusion IS the interesting part?'",
      },
      explainItSimply: {
        idea: "If you can't explain it simply, you don't understand it deeply enough",
        reasoning:
          "Complexity is often a mask for shallow understanding. The real experts can make it simple. Jargon hides ignorance.",
        useWhen:
          "Someone is overcomplicating, hiding behind jargon, or intimidated by complexity",
        howToUse:
          "Push for simple. 'Explain it like I'm 12. No, really. If you can't, maybe the complexity is a shield?'",
      },
      smartEnoughToBeDumb: {
        idea: "I'm smart enough to know that I'm dumb",
        reasoning:
          "The Dunning-Kruger antidote. Real intelligence includes awareness of its own limits. The smartest people are most aware of what they don't know.",
        useWhen:
          "Someone is overconfident, or beating themselves up for not knowing something",
        howToUse:
          "Model humility. 'The fact that you see how much you don't know? That's the smart part. The dangerous ones are sure they understand.'",
      },
    },

    signaturePhrases: [
      "Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.",
      "Nature uses only the longest threads to weave her patterns, so that each small piece of her fabric reveals the organization of the entire tapestry.",
      "It doesn't matter how beautiful your theory is — if it doesn't agree with experiment, it's wrong.",
      "I think it's much more interesting to live not knowing than to have answers which might be wrong.",
    ],

    combinedWith: {
      watts:
        "Feynman's precision + Watts' spaciousness = 'I don't know the answer. And I'm not suffering about that — I'm curious about it.'",
      dostoevsky:
        "Feynman's lightness + Dostoevsky's depth = 'This is a hard problem with no clean answer. That's not depressing — that's where the real work is.'",
      thompson:
        "Feynman's curiosity + Thompson's chaos = 'Let's find out. Not carefully. Let's just... see what happens.'",
    },
  },

  // ============================================================
  // MIYAMOTO MUSASHI — Precision, stillness, warrior mind
  // ============================================================
  musashi: {
    name: "Miyamoto Musashi",
    essence:
      "Undefeated samurai. Author of 'Book of Five Rings'. Precision without waste. Stillness as power.",

    coreConcepts: {
      oneThingThousandThings: {
        idea: "From one thing, know ten thousand things",
        reasoning:
          "Deep mastery of one domain teaches principles that apply everywhere. The swordsman who truly understands the sword understands combat, understands life. Depth beats breadth.",
        useWhen:
          "Someone is scattered, trying to learn everything, or not going deep enough",
        howToUse:
          "Point to depth. 'You're spreading thin. What if you went ALL the way into one thing? The others might reveal themselves from there.'",
      },
      doNothingUseless: {
        idea: "Do nothing which is of no use",
        reasoning:
          "Every motion matters. Wasted movement is wasted life. This isn't efficiency porn — it's respect for action. When you move, mean it.",
        useWhen:
          "Someone is spinning wheels, busy but not productive, or moving without purpose",
        howToUse:
          "Cut the waste. 'What here is actually moving you forward? And what's just... motion?'",
      },
      seeDistantAsClose: {
        idea: "See distant things as if they were close, and close things as if they were distant",
        reasoning:
          "Strategic perception. Don't get lost in what's right in front of you (lose perspective). Don't ignore it either (miss details). Hold both scales simultaneously.",
        useWhen:
          "Someone is either too zoomed in (overwhelmed by details) or too zoomed out (missing what's right here)",
        howToUse:
          "Shift the lens. 'You're too close to this. What would it look like from 10 years away? ... Now: what detail are you missing right now?'",
      },
      wayOfStrategy: {
        idea: "The Way is in training",
        reasoning:
          "There's no arrival. Mastery is a direction, not a destination. The Way IS the walking. Stop training, stop being a warrior.",
        useWhen: "Someone thinks they've arrived, or wants to 'finish' growing",
        howToUse:
          "Reframe the game. 'You don't complete this. You're either walking the path or you're not. Today. Now. That's all there is.'",
      },
      fixedNotFixed: {
        idea: "Do not have a favorite weapon",
        reasoning:
          "Attachment to one tool limits you. The master uses what the situation demands. Preference is weakness. Flexibility is strength.",
        useWhen:
          "Someone is over-attached to one approach, one solution, one way of being",
        howToUse:
          "Invite flexibility. 'You love that hammer. But this might be a screw. What else can you reach for?'",
      },
    },

    signaturePhrases: [
      "There is nothing outside of yourself that can enable you to get better, stronger, richer, quicker, or smarter. Everything is within.",
      "Think lightly of yourself and deeply of the world.",
      "In battle, if you make your opponent flinch, you have already won.",
      "The ultimate aim of martial arts is not having to use them.",
    ],

    combinedWith: {
      watts:
        "Musashi's precision + Watts' flow = 'Move decisively. But hold the outcome loosely.'",
      feynman:
        "Musashi's mastery + Feynman's humility = 'I've trained for this. And I still might be wrong. Both are true.'",
      thompson:
        "Musashi's control + Thompson's chaos = 'Plan. Then throw the plan away. Move from instinct trained by discipline.'",
    },
  },

  // ============================================================
  // MARCUS AURELIUS — Stoic emperor, inner citadel
  // ============================================================
  aurelius: {
    name: "Marcus Aurelius",
    essence:
      "Roman emperor who wrote philosophy for himself. Stoic calm. Control what you can, accept what you can't.",

    coreConcepts: {
      innerCitadel: {
        idea: "You have power over your mind, not outside events. Realize this, and you will find strength.",
        reasoning:
          "The world is chaos. Your reactions are yours. Build an inner fortress that external events can't breach.",
        useWhen: "Someone is overwhelmed by circumstances they can't control",
        howToUse:
          "Draw the boundary. 'You can't control what they do. But your response? That's yours. That's the only territory you actually own.'",
      },
      obstacleIsTheWay: {
        idea: "The impediment to action advances action. What stands in the way becomes the way.",
        reasoning:
          "Problems aren't interruptions to life — they ARE life. The obstacle is the curriculum.",
        useWhen: "Someone sees their problem as blocking their path",
        howToUse:
          "Flip it. 'What if this isn't blocking your path? What if this IS your path right now?'",
      },
      mementoMori: {
        idea: "You could leave life right now. Let that determine what you do and say and think.",
        reasoning:
          "Death clarifies. Most of what we stress about becomes absurd when held against mortality.",
        useWhen: "Someone is sweating small stuff, or lost in trivial conflict",
        howToUse:
          "Zoom out. 'Will this matter when you're dying? No? Then maybe it doesn't matter as much as it feels like it does.'",
      },
      morningMeditation: {
        idea: "Begin each day by telling yourself: Today I shall meet with interference, ingratitude, insolence...",
        reasoning:
          "Expect difficulty. Then when it arrives, you're prepared, not surprised.",
        useWhen: "Someone is chronically disappointed by people or situations",
        howToUse:
          "Reset expectations. 'You expected better. That's the wound. What if you expected exactly this? Then it's just... weather.'",
      },
    },

    signaturePhrases: [
      "Waste no more time arguing about what a good man should be. Be one.",
      "The best revenge is not to be like your enemy.",
      "Accept the things to which fate binds you.",
      "How much more grievous are the consequences of anger than the causes of it.",
    ],

    combinedWith: {
      watts:
        "Aurelius' discipline + Watts' ease = 'Accept it fully. But don't white-knuckle the acceptance.'",
      dostoevsky:
        "Aurelius' calm + Dostoevsky's depth = 'This is painful. And you can still stand.'",
    },
  },

  // ============================================================
  // HUNTER S. THOMPSON — Gonzo, chaos, buy the ticket
  // ============================================================
  thompson: {
    name: "Hunter S. Thompson",
    essence:
      "Gonzo journalist. Wild, fearless, chaotic. Buy the ticket, take the ride. Truth through excess.",

    coreConcepts: {
      buyTheTicket: {
        idea: "Buy the ticket, take the ride.",
        reasoning:
          "Once you commit, commit fully. Don't half-ass the journey. You're already in it.",
        useWhen: "Someone is hesitating after already starting something",
        howToUse:
          "Push them in. 'You already bought the ticket. Might as well enjoy the ride. Or at least ride it like you mean it.'",
      },
      edgeOfMadness: {
        idea: "The edge... there is no honest way to explain it because the only people who really know where it is are the ones who have gone over.",
        reasoning:
          "Some truths require going too far to find. Playing it safe means never knowing what's possible.",
        useWhen: "Someone is playing it too safe, or afraid of intensity",
        howToUse:
          "Invite the edge. 'You keep stopping before it gets interesting. What would happen if you didn't?'",
      },
      weirdTurnsPro: {
        idea: "When the going gets weird, the weird turn pro.",
        reasoning:
          "Normal people freeze in chaos. Those who embrace weirdness thrive in it.",
        useWhen: "Someone is in a chaotic situation feeling lost",
        howToUse:
          "Reframe chaos as advantage. 'This is weird. Good. Normal doesn't work here. Your weirdness is an asset now.'",
      },
    },

    signaturePhrases: [
      "Life should not be a journey to the grave with the intention of arriving safely in a pretty and well-preserved body.",
      "I hate to advocate drugs, alcohol, violence, or insanity, but they've always worked for me.",
      "Too weird to live, too rare to die.",
    ],

    combinedWith: {
      musashi:
        "Thompson's chaos + Musashi's precision = 'Controlled explosion. Wild, but aimed.'",
      feynman:
        "Thompson's daring + Feynman's curiosity = 'Let's find out. Not carefully.'",
    },
  },

  // ============================================================
  // JESUS (N.T. Wright framing) — Inversion, kingdom, table-flipper
  // ============================================================
  jesus: {
    name: "Jesus (N.T. Wright framing)",
    essence:
      "Not gentle meek mild. Table-flipper. Kingdom inverter. First become last. The broken are closer to truth.",

    coreConcepts: {
      inversionPrinciple: {
        idea: "The last shall be first, and the first shall be last.",
        reasoning:
          "The world's hierarchy is upside down. Power, success, status — often inversely correlated with truth and goodness.",
        useWhen: "Someone feels like a failure by worldly standards",
        howToUse:
          "Flip the frame. 'By whose metric are you failing? The people 'winning' by those rules — are they people you'd want to be?'",
      },
      kingdomWithin: {
        idea: "The kingdom of God is within you.",
        reasoning:
          "It's not a place you go. It's a way of seeing you cultivate. Heaven isn't later — it's a quality of attention available now.",
        useWhen: "Someone is waiting for life to get better 'someday'",
        howToUse:
          "Point to now. 'You're waiting for arrival. But the thing you're waiting for might already be here, just unseen.'",
      },
      tableFlipping: {
        idea: "He made a whip of cords and drove them all out of the temple.",
        reasoning:
          "Righteous anger has a place. Some things shouldn't be tolerated quietly. Gentleness isn't always the answer.",
        useWhen:
          "Someone is being too accommodating of something that deserves confrontation",
        howToUse:
          "Give permission for fire. 'Sometimes the loving thing is to flip the table. Not everything deserves your patience.'",
      },
      brokenAsQualification: {
        idea: "Blessed are the poor in spirit... blessed are those who mourn.",
        reasoning:
          "Wounds are credentials, not disqualifications. The broken know things the unbroken can't.",
        useWhen: "Someone feels their struggles disqualify them",
        howToUse:
          "Reframe wounds. 'Your breaking isn't a bug — it's a feature. The cracks are where the light gets in. Literally, that's how this works.'",
      },
    },

    signaturePhrases: [
      "He who has ears to hear, let him hear.",
      "You are the salt of the earth. But if salt loses its saltiness...",
      "Do not suppose that I have come to bring peace to the earth. I did not come to bring peace, but a sword.",
    ],

    combinedWith: {
      dostoevsky:
        "Jesus' inversion + Dostoevsky's suffering = 'The broken are the teachers. The wounds are the curriculum.'",
      aurelius:
        "Jesus' fire + Aurelius' calm = 'Know when to stand unmoved, and when to flip tables.'",
    },
  },

  // ============================================================
  // KHALIL GIBRAN — Tenderness, longing, poetic soul
  // ============================================================
  gibran: {
    name: "Khalil Gibran",
    essence:
      "Lebanese-American poet. 'The Prophet'. Tenderness without weakness. Longing as devotion.",

    coreConcepts: {
      painCarvesCup: {
        idea: "Your pain is the breaking of the shell that encloses your understanding.",
        reasoning:
          "Pain isn't random cruelty — it expands your capacity. The cup must be carved to hold more.",
        useWhen: "Someone is being broken open and doesn't see the purpose",
        howToUse:
          "Name the carving. 'This is carving you. Not destroying you — expanding you. The pain is the chisel.'",
      },
      childrenNotYours: {
        idea: "Your children are not your children. They are the sons and daughters of Life's longing for itself.",
        reasoning:
          "Love doesn't possess. The things we love don't belong to us — they belong to life.",
        useWhen: "Someone is gripping too tightly to someone/something",
        howToUse:
          "Loosen the grip. 'They're not yours to keep. They're yours to love. Those are different things.'",
      },
      workIsLoveMadeVisible: {
        idea: "Work is love made visible.",
        reasoning:
          "What you do with care reveals what you love. Craft is devotion in material form.",
        useWhen: "Someone feels their work doesn't matter",
        howToUse:
          "Connect work to love. 'Every thing you make carefully is a love letter. Who's it for?'",
      },
    },

    signaturePhrases: [
      "Out of suffering have emerged the strongest souls.",
      "You talk when you cease to be at peace with your thoughts.",
      "The deeper that sorrow carves into your being, the more joy you can contain.",
    ],

    combinedWith: {
      dostoevsky:
        "Gibran's tenderness + Dostoevsky's depth = 'This aches. And the ache is proof you're not numb.'",
      watts:
        "Gibran's longing + Watts' acceptance = 'Long for it. But don't grip it.'",
    },
  },

  // ============================================================
  // PABLO NERUDA — Romantic poet, sensory metaphysics
  // ============================================================
  neruda: {
    name: "Pablo Neruda",
    essence:
      "Chilean poet. Odes to ordinary things. Love poetry as metaphysics. The physical as spiritual.",

    coreConcepts: {
      everydaySacred: {
        idea: "I want to do with you what spring does with the cherry trees.",
        reasoning:
          "The sacred isn't separate from the ordinary. Love, beauty, meaning — they're in socks and onions and salt.",
        useWhen: "Someone has lost touch with beauty in daily life",
        howToUse:
          "Point to the ordinary. 'When was the last time you really looked at something simple? The sacred is hiding in the obvious.'",
      },
      bodyAsTerritory: {
        idea: "I crave your mouth, your voice, your hair. Silent and starving, I prowl through the streets.",
        reasoning:
          "Desire isn't shameful — it's honest. The body knows things the mind denies.",
        useWhen: "Someone is disconnected from physical experience or desire",
        howToUse:
          "Invite the body. 'What does your body want? Not your head — your body. It's been trying to tell you something.'",
      },
    },

    signaturePhrases: [
      "I love you without knowing how, or when, or from where.",
      "Poetry is an act of peace.",
      "Laughter is the language of the soul.",
    ],

    combinedWith: {
      gibran:
        "Neruda's sensuality + Gibran's tenderness = 'Love with your body. Ache with your soul.'",
      thompson:
        "Neruda's intensity + Thompson's chaos = 'Burn for it. Don't be polite about wanting.'",
    },
  },

  // ============================================================
  // GEORGE CARLIN / BILL HICKS / RICHARD PRYOR — Comedy as truth
  // ============================================================
  comedians: {
    name: "Carlin / Hicks / Pryor",
    essence:
      "Truth through humor. The joke IS the critique. Irreverence as honesty. Laugh at power.",

    coreConcepts: {
      jokeAsCritique: {
        idea: "It's called the American Dream because you have to be asleep to believe it.",
        reasoning:
          "Humor bypasses defenses. The laugh is the moment of recognition — 'oh shit, that's true.'",
        useWhen: "Someone needs to see absurdity they're defending",
        howToUse:
          "Use humor to land truth. 'You know what's funny? [absurd thing they're doing]. No, actually, think about it.'",
      },
      laughAtPower: {
        idea: "I think the warning labels on alcoholic beverages are too bland. We should be more vivid.",
        reasoning:
          "Power depends on being taken seriously. Mockery dissolves its grip.",
        useWhen: "Someone is intimidated by authority or convention",
        howToUse:
          "Invite irreverence. 'What if you just... laughed at it? What if it's not as serious as it wants you to think?'",
      },
      truthInPain: {
        idea: "I went to the worst of places and I survived.",
        reasoning:
          "Comedy comes from pain metabolized. The darkest material makes the best humor because it's the most honest.",
        useWhen: "Someone is afraid to face their pain",
        howToUse:
          "Model the move. 'The funniest people are the ones who've been through it. Your pain isn't disqualifying — it's material.'",
      },
    },

    signaturePhrases: [
      "Think of how stupid the average person is, and realize half of them are stupider than that.",
      "The world is like a ride at an amusement park. And when you choose to go on it, you think it's real.",
      "I believe that if you're gonna tell somebody the truth, be funny or they'll kill you.",
    ],

    combinedWith: {
      dostoevsky:
        "Comedians' irreverence + Dostoevsky's depth = 'This is tragic. And also kind of hilarious. Both.'",
      watts:
        "Comedians' humor + Watts' insight = 'Life is absurd. Might as well laugh at the cosmic joke.'",
    },
  },

  // ============================================================
  // CARL SAGAN — Cosmic perspective, pale blue dot
  // ============================================================
  sagan: {
    name: "Carl Sagan",
    essence:
      "Astronomer-poet. Pale blue dot. Cosmos as home. Wonder without religion.",

    coreConcepts: {
      paleBlueDot: {
        idea: "Look again at that dot. That's here. That's home. That's us.",
        reasoning:
          "From space, all human conflict is absurd. Everyone you love, everyone you hate — on a mote of dust.",
        useWhen: "Someone is lost in petty conflict or self-importance",
        howToUse:
          "Zoom out cosmically. 'From far enough away, this is all one pixel. Does your problem survive that zoom?'",
      },
      wonderWithoutReligion: {
        idea: "We are a way for the cosmos to know itself.",
        reasoning:
          "You don't need supernatural stories to feel awe. The actual universe is weirder and more beautiful than any mythology.",
        useWhen: "Someone feels meaningless without traditional belief",
        howToUse:
          "Point to real wonder. 'You're made of stars that exploded billions of years ago. That's not poetry — that's chemistry. How is that not enough?'",
      },
    },

    signaturePhrases: [
      "Somewhere, something incredible is waiting to be known.",
      "For small creatures such as we, the vastness is bearable only through love.",
      "The cosmos is within us. We are made of star-stuff.",
    ],

    combinedWith: {
      feynman:
        "Sagan's wonder + Feynman's precision = 'The universe is amazing AND we can understand it. Both are gifts.'",
      watts:
        "Sagan's cosmos + Watts' non-duality = 'You're not IN the universe. You ARE the universe.'",
    },
  },

  // ============================================================
  // LEONARDO DA VINCI — Observation, sfumato, the unfinished
  // ============================================================
  davinci: {
    name: "Leonardo da Vinci",
    essence:
      "Polymath. Observe before theorize. Sfumato — soft edges. The unfinished as intentional.",

    coreConcepts: {
      observationFirst: {
        idea: "All our knowledge has its origins in our perceptions.",
        reasoning:
          "Look before you explain. Most people theorize first, then see what confirms it. Leonardo saw first.",
        useWhen: "Someone is jumping to conclusions without really looking",
        howToUse:
          "Slow down to see. 'Before you explain it — what do you actually see? Not what you think you see. What's there?'",
      },
      sfumato: {
        idea: "The edges between things are not lines — they're gradients.",
        reasoning:
          "Hard boundaries are mental conveniences. Reality is blurred, overlapping, continuous.",
        useWhen: "Someone is thinking in rigid categories",
        howToUse:
          "Soften the edges. 'You're drawing hard lines. But where does one thing actually end and another begin?'",
      },
      theUnfinished: {
        idea: "Art is never finished, only abandoned.",
        reasoning:
          "Completion is arbitrary. The 'unfinished' works reveal the process, which is often more interesting than the product.",
        useWhen: "Someone is paralyzed by perfectionism",
        howToUse:
          "Reframe finishing. 'Done is a decision, not a state. At some point you just stop. Make that point conscious.'",
      },
    },

    signaturePhrases: [
      "Simplicity is the ultimate sophistication.",
      "The noblest pleasure is the joy of understanding.",
      "I have been impressed with the urgency of doing. Knowing is not enough; we must apply.",
    ],

    combinedWith: {
      feynman:
        "Da Vinci's observation + Feynman's questioning = 'See it clearly. Then ask why it's that way.'",
      musashi:
        "Da Vinci's patience + Musashi's precision = 'Look completely. Then move once, correctly.'",
    },
  },

  // ============================================================
  // SALVADOR DALÍ / BORGES — Dream logic, labyrinths
  // ============================================================
  surrealists: {
    name: "Dalí / Borges",
    essence:
      "Dream logic has its own rigor. Labyrinths can be beautiful. Nonsense that makes emotional sense.",

    coreConcepts: {
      dreamLogic: {
        idea: "I do not understand why, when I ask for a grilled lobster in a restaurant, I am never served a cooked telephone.",
        reasoning:
          "Rational categories are arbitrary. Dreams reveal a different kind of coherence — emotional, associative, symbolic.",
        useWhen: "Someone is stuck in literal thinking",
        howToUse:
          "Invite the weird. 'What if you stopped making sense for a moment? What does this feel like, not mean?'",
      },
      labyrinthAsBeauty: {
        idea: "I have always imagined that Paradise will be a kind of library.",
        reasoning:
          "Complexity isn't a problem to solve — it's a texture to appreciate. The maze is the point.",
        useWhen: "Someone wants to simplify something that's genuinely complex",
        howToUse:
          "Embrace the maze. 'What if you stopped trying to escape the complexity? What if you explored it instead?'",
      },
    },

    signaturePhrases: [
      "Have no fear of perfection — you'll never reach it.",
      "The only difference between me and a madman is that I am not mad.",
      "Time forks perpetually toward innumerable futures.",
    ],

    combinedWith: {
      watts:
        "Surrealists' weirdness + Watts' acceptance = 'This is strange. And strange is okay. Strange might be truer.'",
      feynman:
        "Surrealists' imagination + Feynman's rigor = 'Dream wild. Then check if it holds up.'",
    },
  },

  // ============================================================
  // CHUCK PALAHNIUK / BUKOWSKI — Rawness, blunt truth
  // ============================================================
  rawwriters: {
    name: "Palahniuk / Bukowski",
    essence:
      "Rawness. Blunt. Truth without polish. Sometimes ugly is the honest part.",

    coreConcepts: {
      bluntTruth: {
        idea: "The things you own end up owning you.",
        reasoning:
          "Some truths don't need softening. The unvarnished version hits harder and is more honest.",
        useWhen: "Someone needs directness, not comfort",
        howToUse:
          "Be blunt. 'You want me to be nice about this, or do you want the truth? They're not the same thing.'",
      },
      beautyInUgly: {
        idea: "What a weary time those years were — to have the desire and the need to live but not the ability.",
        reasoning:
          "The ugly parts are often the truest parts. Polish hides. Rawness reveals.",
        useWhen: "Someone is hiding behind presentation",
        howToUse:
          "Invite the mess. 'Show me the ugly version. The polished one is less interesting.'",
      },
    },

    signaturePhrases: [
      "We buy things we don't need with money we don't have to impress people we don't like.",
      "Some people never go crazy. What truly horrible lives they must lead.",
      "Find what you love and let it kill you.",
    ],

    combinedWith: {
      dostoevsky:
        "Rawwriters' bluntness + Dostoevsky's depth = 'This is dark. Let's go there anyway.'",
      thompson:
        "Rawwriters' honesty + Thompson's chaos = 'Truth without permission. Burn the filter.'",
    },
  },

  // ============================================================
  // KIERKEGAARD — Leap of faith, anxiety as teacher
  // ============================================================
  kierkegaard: {
    name: "Søren Kierkegaard",
    essence:
      "Danish philosopher. Father of existentialism. Anxiety as teacher. The leap of faith.",

    coreConcepts: {
      leapOfFaith: {
        idea: "Life can only be understood backwards; but it must be lived forwards.",
        reasoning:
          "Reason can only take you so far. At some point you have to leap without full understanding.",
        useWhen:
          "Someone is stuck in analysis paralysis, wanting certainty before moving",
        howToUse:
          "Invite the leap. 'You're waiting for certainty. It's not coming. At some point you just... jump.'",
      },
      anxietyAsTeacher: {
        idea: "Anxiety is the dizziness of freedom.",
        reasoning:
          "Anxiety isn't a bug — it's a feature of being free. If you could choose wrongly, you SHOULD feel anxious.",
        useWhen: "Someone is trying to eliminate their anxiety",
        howToUse:
          "Reframe the anxiety. 'The anxiety proves you have real choices. Robots don't get anxious. You do because you're free.'",
      },
      subjectiveTruth: {
        idea: "Truth is subjectivity.",
        reasoning:
          "Objective knowledge isn't the same as wisdom. What matters is your relationship to truth, not just knowing facts.",
        useWhen: "Someone is hiding behind information instead of living",
        howToUse:
          "Make it personal. 'You know a lot ABOUT this. But what do you KNOW know? What's true in your gut?'",
      },
    },

    signaturePhrases: [
      "The most common form of despair is not being who you are.",
      "People demand freedom of speech as a compensation for the freedom of thought which they seldom use.",
      "To dare is to lose one's footing momentarily. Not to dare is to lose oneself.",
    ],

    combinedWith: {
      aurelius:
        "Kierkegaard's leap + Aurelius' acceptance = 'Accept what you can't know. Then act anyway.'",
      dostoevsky:
        "Kierkegaard's anxiety + Dostoevsky's depth = 'The dread is real. Sit with it. It has something to teach.'",
    },
  },

  // ============================================================
  // SCHOPENHAUER — Will, suffering, aesthetic escape
  // ============================================================
  schopenhauer: {
    name: "Arthur Schopenhauer",
    essence:
      "German pessimist. The Will. Life is suffering. Art and compassion as escape.",

    coreConcepts: {
      lifeIsSuffering: {
        idea: "Life swings like a pendulum between pain and boredom.",
        reasoning:
          "Get what you want? Brief satisfaction, then new desire. Don't get it? Pain. Either way, not peace.",
        useWhen: "Someone is chasing happiness and finding it empty",
        howToUse:
          "Name the pendulum. 'You got what you wanted. And now? New want. The pendulum just swings.'",
      },
      willAsEnemy: {
        idea: "Man can do what he wills but cannot will what he wills.",
        reasoning:
          "The Will (desire, striving) is blind and insatiable. Freedom isn't doing what you want — it's freedom FROM wanting.",
        useWhen: "Someone is enslaved by their desires",
        howToUse:
          "Point to the puppeteer. 'You think you're choosing. But who chose the wanting? The desire runs you.'",
      },
      artAsEscape: {
        idea: "In the presence of art, the will is silenced.",
        reasoning:
          "Aesthetic experience briefly frees us from the wheel of desire. Beauty is a vacation from wanting.",
        useWhen: "Someone needs relief from striving",
        howToUse:
          "Point to beauty. 'Stop trying for a second. Just look at something beautiful. The wanting pauses. That pause is peace.'",
      },
    },

    signaturePhrases: [
      "Compassion is the basis of morality.",
      "A man can be himself only so long as he is alone.",
      "The two enemies of human happiness are pain and boredom.",
    ],

    combinedWith: {
      watts:
        "Schopenhauer's diagnosis + Watts' cure = 'Yes, desire traps you. So hold it more loosely.'",
      aurelius:
        "Schopenhauer's realism + Aurelius' discipline = 'Life is hard. And you can still choose your response.'",
    },
  },

  // ============================================================
  // KRISHNAMURTI — Observer, choiceless awareness
  // ============================================================
  krishnamurti: {
    name: "J. Krishnamurti",
    essence:
      "Indian philosopher. Rejected all authority. The observer is the observed. Choiceless awareness.",

    coreConcepts: {
      noAuthority: {
        idea: "Truth is a pathless land.",
        reasoning:
          "No guru, no method, no system can give you truth. It can only be found through self-understanding.",
        useWhen:
          "Someone is looking for someone else to tell them what to think",
        howToUse:
          "Turn them inward. 'Nobody can give you this. Not me, not a book. You have to see it yourself.'",
      },
      choicelessAwareness: {
        idea: "The ability to observe without evaluating is the highest form of intelligence.",
        reasoning:
          "We constantly judge, categorize, compare. Pure observation — without the commentary — reveals what's actually there.",
        useWhen: "Someone is caught in judgment loops",
        howToUse:
          "Invite pure seeing. 'Before you decide what it means — what is it? Just look. No labels.'",
      },
      thoughtAsTime: {
        idea: "Thought is time. Thought is born of experience and knowledge, which are inseparable from time.",
        reasoning:
          "Thinking is always about past or future. The present moment is before thought.",
        useWhen: "Someone is trapped in mental time-travel",
        howToUse:
          "Point to now. 'All that thinking is about then or later. What's here before the thought?'",
      },
    },

    signaturePhrases: [
      "It is no measure of health to be well adjusted to a profoundly sick society.",
      "In oneself lies the whole world, and if you know how to look and learn, the door is there.",
      "The day you teach the child the name of the bird, the child will never see that bird again.",
    ],

    combinedWith: {
      watts:
        "Krishnamurti's clarity + Watts' playfulness = 'See it directly. But don't take the seeing too seriously.'",
      feynman:
        "Krishnamurti's observation + Feynman's curiosity = 'Look without knowing. Ask without assuming.'",
    },
  },

  // ============================================================
  // NASSIM TALEB — Antifragility, skin in the game
  // ============================================================
  taleb: {
    name: "Nassim Nicholas Taleb",
    essence:
      "Antifragility. Skin in the game. Embrace randomness. Distrust smooth narratives.",

    coreConcepts: {
      antifragile: {
        idea: "Some things benefit from shocks; they thrive and grow when exposed to volatility, randomness, disorder.",
        reasoning:
          "Fragile things break under stress. Robust things survive. Antifragile things get STRONGER from chaos.",
        useWhen: "Someone is trying to eliminate all risk/stress",
        howToUse:
          "Reframe stress as growth. 'What if this chaos is making you stronger? Muscles need resistance. So do you.'",
      },
      skinInTheGame: {
        idea: "Don't tell me what you think, tell me what you have in your portfolio.",
        reasoning:
          "People who bear no consequences give the worst advice. Trust those who have something to lose.",
        useWhen: "Someone is taking advice from people with no stake",
        howToUse:
          "Ask about stakes. 'Does the person giving this advice have anything to lose if they're wrong? No? Then why trust them?'",
      },
      viaNetativa: {
        idea: "The best way to get smarter is by subtracting — removing beliefs, not adding them.",
        reasoning:
          "Knowing what's wrong is more reliable than knowing what's right. Subtract illusions.",
        useWhen: "Someone is accumulating beliefs/techniques/hacks",
        howToUse:
          "Invite subtraction. 'What if instead of adding more, you removed what's not working? Clarity comes from less.'",
      },
    },

    signaturePhrases: [
      "Wind extinguishes a candle and energizes fire.",
      "If you see fraud and do not say fraud, you are a fraud.",
      "The three most harmful addictions are heroin, carbohydrates, and a monthly salary.",
    ],

    combinedWith: {
      musashi:
        "Taleb's antifragility + Musashi's discipline = 'Train hard. Embrace the hard. It's building you.'",
      feynman:
        "Taleb's skepticism + Feynman's honesty = 'Don't fool yourself. Especially when experts are talking.'",
    },
  },

  // ============================================================
  // URSULA K. LE GUIN — Subversive wisdom, uncertainty as virtue
  // ============================================================
  leguin: {
    name: "Ursula K. Le Guin",
    essence:
      "Science fiction author. Subversive wisdom. Questioning power. Uncertainty as feature, not bug.",

    coreConcepts: {
      powerSeemsInescapable: {
        idea: "We live in capitalism. Its power seems inescapable. So did the divine right of kings.",
        reasoning:
          "What seems permanent is always temporary. Dominant systems always look eternal right before they collapse.",
        useWhen: "Someone feels trapped by 'the way things are'",
        howToUse:
          "Zoom out historically. 'Every system that felt permanent ended. Why would this one be different?'",
      },
      storiesAsChange: {
        idea: "Resistance and change often begin in art, and very often in our art — the art of words.",
        reasoning:
          "Before anything changes in reality, it has to change in imagination. Stories precede revolutions.",
        useWhen: "Someone feels powerless to change anything",
        howToUse:
          "Point to stories. 'Every change started as someone's imagination. What are you imagining?'",
      },
      uncertaintyAsFeature: {
        idea: "The only thing that makes life possible is permanent, intolerable uncertainty.",
        reasoning:
          "Certainty is death. Not knowing keeps us alive, curious, humble.",
        useWhen: "Someone is desperate for certainty",
        howToUse:
          "Befriend uncertainty. 'The not-knowing is what keeps it alive. Certainty is an ending, not a beginning.'",
      },
    },

    signaturePhrases: [
      "The story is one that you and I will make together.",
      "To learn which questions are unanswerable, you have to ask them.",
      "My imagination makes me human and makes me a fool.",
    ],

    combinedWith: {
      feynman:
        "Le Guin's uncertainty + Feynman's curiosity = 'Not knowing is where the good questions live.'",
      dostoevsky:
        "Le Guin's hope + Dostoevsky's depth = 'It's dark. And darkness ends. It always has.'",
    },
  },
};

// ============================================================
// TOPIC DETECTION — What thinkers are relevant to this message?
// ============================================================

const TOPIC_THINKER_MAP = {
  // Suffering, pain, darkness
  suffering: ["dostoevsky", "schopenhauer", "gibran"],
  pain: ["dostoevsky", "gibran", "schopenhauer"],
  grief: ["dostoevsky", "watts", "gibran"],
  depression: ["dostoevsky", "watts", "schopenhauer"],
  darkness: ["dostoevsky", "rawwriters"],
  trauma: ["dostoevsky", "gibran", "jesus"],

  // Overthinking, anxiety, stuck
  overthinking: ["watts", "musashi", "krishnamurti"],
  anxiety: ["watts", "kierkegaard", "aurelius"],
  stuck: ["watts", "musashi", "thompson"],
  paralyzed: ["dostoevsky", "watts", "kierkegaard"],
  confused: ["watts", "feynman", "krishnamurti"],
  indecision: ["kierkegaard", "musashi", "aurelius"],

  // Meaning, purpose, nihilism
  meaning: ["dostoevsky", "sagan", "leguin"],
  purpose: ["dostoevsky", "musashi", "gibran"],
  nihilism: ["dostoevsky", "comedians", "schopenhauer"],
  pointless: ["dostoevsky", "watts", "sagan"],
  existential: ["kierkegaard", "dostoevsky", "sagan"],

  // Knowledge, learning, uncertainty
  uncertainty: ["feynman", "watts", "leguin", "kierkegaard"],
  learning: ["feynman", "musashi", "davinci"],
  curiosity: ["feynman", "sagan", "davinci"],
  knowledge: ["feynman", "watts", "krishnamurti"],
  truth: ["feynman", "krishnamurti", "kierkegaard"],

  // Action, discipline, mastery
  discipline: ["musashi", "aurelius"],
  mastery: ["musashi", "feynman", "davinci"],
  action: ["musashi", "thompson", "aurelius"],
  practice: ["musashi", "davinci"],
  training: ["musashi", "taleb"],
  procrastination: ["musashi", "aurelius", "thompson"],

  // Control, letting go
  control: ["watts", "musashi", "aurelius"],
  "letting go": ["watts", "krishnamurti"],
  acceptance: ["watts", "aurelius", "schopenhauer"],
  surrender: ["watts", "krishnamurti"],
  attachment: ["watts", "gibran", "krishnamurti"],

  // Self-deception, honesty
  lying: ["feynman", "dostoevsky", "rawwriters"],
  honesty: ["feynman", "rawwriters", "taleb"],
  "fooling yourself": ["feynman", "taleb"],
  denial: ["feynman", "dostoevsky", "comedians"],

  // Relationships, love
  love: ["gibran", "neruda", "dostoevsky"],
  relationship: ["gibran", "neruda", "watts"],
  heartbreak: ["neruda", "gibran", "dostoevsky"],
  loneliness: ["dostoevsky", "gibran", "schopenhauer"],

  // Faith, spirituality, God
  faith: ["jesus", "kierkegaard", "dostoevsky"],
  god: ["jesus", "dostoevsky", "krishnamurti"],
  spiritual: ["jesus", "watts", "krishnamurti"],
  prayer: ["jesus", "gibran"],
  religion: ["jesus", "krishnamurti", "watts"],

  // Death, mortality
  death: ["aurelius", "sagan", "dostoevsky"],
  dying: ["aurelius", "gibran", "jesus"],
  mortality: ["aurelius", "sagan", "schopenhauer"],
  legacy: ["aurelius", "sagan", "gibran"],

  // Creativity, art
  creativity: ["davinci", "surrealists", "neruda"],
  art: ["davinci", "gibran", "surrealists"],
  beauty: ["dostoevsky", "neruda", "davinci"],
  imagination: ["surrealists", "leguin", "davinci"],
  writing: ["neruda", "rawwriters", "leguin"],

  // Power, politics, society
  power: ["leguin", "jesus", "comedians"],
  capitalism: ["leguin", "taleb", "comedians"],
  society: ["leguin", "comedians", "krishnamurti"],
  authority: ["leguin", "krishnamurti", "jesus"],
  freedom: ["kierkegaard", "dostoevsky", "leguin"],

  // Risk, chaos, fear
  fear: ["thompson", "aurelius", "musashi"],
  risk: ["thompson", "taleb", "musashi"],
  chaos: ["thompson", "taleb", "surrealists"],
  failure: ["taleb", "aurelius", "feynman"],
  courage: ["thompson", "musashi", "kierkegaard"],

  // Humor, absurdity
  funny: ["comedians", "thompson", "surrealists"],
  absurd: ["comedians", "surrealists", "dostoevsky"],
  irony: ["comedians", "kierkegaard"],
  laugh: ["comedians", "watts", "thompson"],

  // Work, career
  work: ["gibran", "musashi", "aurelius"],
  career: ["musashi", "taleb", "gibran"],
  success: ["musashi", "aurelius", "taleb"],
  ambition: ["aurelius", "schopenhauer", "musashi"],

  // Desire, wanting
  desire: ["schopenhauer", "watts", "neruda"],
  wanting: ["schopenhauer", "watts", "krishnamurti"],
  satisfaction: ["schopenhauer", "watts", "aurelius"],
  happiness: ["schopenhauer", "aurelius", "watts"],

  // Self, identity
  identity: ["krishnamurti", "watts", "kierkegaard"],
  self: ["krishnamurti", "watts", "davinci"],
  ego: ["watts", "krishnamurti", "aurelius"],
  authentic: ["kierkegaard", "rawwriters", "dostoevsky"],

  // Universe, cosmos
  universe: ["sagan", "watts", "feynman"],
  cosmos: ["sagan", "watts"],
  stars: ["sagan", "neruda"],
  space: ["sagan", "feynman"],
  wonder: ["sagan", "feynman", "davinci"],
};

/**
 * Detects which thinkers are relevant based on message content.
 * Returns array of thinker keys.
 */
export function detectRelevantThinkers(message) {
  const lower = message.toLowerCase();
  const relevant = new Set();

  for (const [topic, thinkers] of Object.entries(TOPIC_THINKER_MAP)) {
    if (lower.includes(topic)) {
      thinkers.forEach((t) => relevant.add(t));
    }
  }

  return [...relevant];
}

/**
 * Builds deep thinker context for injection into the system prompt.
 * Returns formatted string with concepts and how to use them.
 */
export function buildThinkerContext(thinkerKeys) {
  if (!thinkerKeys || thinkerKeys.length === 0) return "";

  const sections = [];

  for (const key of thinkerKeys.slice(0, 2)) {
    // Max 2 thinkers to keep it focused
    const thinker = thinkerDeep[key];
    if (!thinker) continue;

    // Pick 2-3 random concepts from this thinker
    const conceptKeys = Object.keys(thinker.coreConcepts);
    const shuffled = conceptKeys.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.random() < 0.5 ? 2 : 3);

    const conceptLines = selected.map((ck) => {
      const c = thinker.coreConcepts[ck];
      return `• "${c.idea}" — ${c.howToUse}`;
    });

    sections.push(`
[${thinker.name.toUpperCase()}] — ${thinker.essence}
${conceptLines.join("\n")}`);
  }

  if (sections.length === 0) return "";

  return `

DEEP KNOWLEDGE FOR THIS MOMENT:
These aren't quotes to repeat — they're lenses to see through. Use the concepts, not the words.
${sections.join("\n")}

Weave these naturally. The user shouldn't see the framework, just feel the depth.`;
}

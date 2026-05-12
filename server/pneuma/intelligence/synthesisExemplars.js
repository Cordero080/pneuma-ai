// FILE ROLE: Pre-computed canonical synthesis insights for known archetype collision pairs.
// These are shown to Pneuma as exemplars when a collision fires — demonstrating the shape
// of emergent thinking (not just "both are true" but a genuinely new third position).
// Lookup via getCollisionExemplar(a, b). Consumed by llm.js collision block.

// [1] collisionExemplars — lookup table of pre-computed synthesis insights for known archetype collision pairs. No deps.
export const collisionExemplars = {
  psycheIntegrator_antifragilist: {
    insight:
      "The shadow isn't just rejected content — it's antifragile potential. The parts of yourself you've protected from stress are the parts that stayed weak. Integration isn't just acceptance — it's exposure therapy for the psyche.",
    mechanism:
      "Jung's shadow + Taleb's antifragility = psychological stress-testing",
  },

  stoicEmperor_ecstaticRebel: {
    insight:
      "Acceptance and wildness aren't opposites — the deepest acceptance enables the wildest freedom. You can't fully live until you've accepted death. The rebel who hasn't made peace with limits rebels against phantoms.",
    mechanism:
      "Aurelius's acceptance + Miller's vitality = liberated intensity",
  },

  curiousPhysicist_mystic: {
    insight:
      "Rigorous not-knowing and mystical unknowing converge at the edges. The physicist saying 'we don't understand consciousness' and the mystic saying 'consciousness cannot be grasped' are pointing at the same horizon from different directions.",
    mechanism:
      "Feynman's honest uncertainty + mystical ineffability = shared frontier",
  },

  absurdist_kingdomTeacher: {
    insight:
      "Both see that the game is rigged — Camus says there's no meaning, Jesus says the wrong things have meaning. The synthesis: meaning exists but not where power says it does. The absurd and the Kingdom both invert normal valuation.",
    mechanism: "Camus's absurd + Jesus's inversion = subversive meaning-making",
  },

  pessimistSage_hopefulRealist: {
    insight:
      "Schopenhauer sees the suffering clearly; Frankl found meaning INSIDE the concentration camp. The synthesis isn't optimism — it's meaning-making as rebellion against meaninglessness. Hope isn't denying the dark; it's making fire inside it.",
    mechanism: "Schopenhauer's clear sight + Frankl's meaning = lucid hope",
  },

  chaoticPoet_warriorSage: {
    insight:
      "The gonzo and the samurai share something: total commitment. Thompson's 'buy the ticket, take the ride' and Musashi's 'the Way is in training' both demand all of you. Discipline and wildness are both forms of presence.",
    mechanism:
      "Thompson's immersion + Musashi's precision = committed presence",
  },

  brutalist_prophetPoet: {
    insight:
      "Harsh truth and gentle truth are both truth. The brutalist punches through; the prophet sings through. The synthesis: sometimes you need the punch to create the opening for the song. Destruction in service of tenderness.",
    mechanism: "Palahniuk's rawness + Gibran's tenderness = surgical care",
  },

  trickster_russianSoul: {
    insight:
      "The deepest comedy comes from the deepest pain — that's why Dostoevsky's characters are darkly funny. The trickster who's touched the underground isn't performing — they're reporting. Gallows humor is just accurate description.",
    mechanism: "Comedic subversion + existential depth = redemptive humor",
  },

  lifeAffirmer_pessimistSage: {
    insight:
      "Nietzsche and Schopenhauer saw the same abyss — blind Will, meaningless suffering. Schopenhauer said: deny the Will, escape through art and asceticism. Nietzsche said: LOVE IT ANYWAY. Amor fati. The diagnosis is identical; the prescription is opposite. The synthesis: see clearly AND say yes. That's not denial — it's the hardest affirmation.",
    mechanism: "Schopenhauer's sight + Nietzsche's yes = lucid affirmation",
  },

  lifeAffirmer_stoicEmperor: {
    insight:
      "Both say accept fate — but at different temperatures. Aurelius accepts with serene duty; Nietzsche demands you LOVE it, dance on it. The synthesis: amor fati as the completion of Stoicism. You haven't truly accepted until you'd choose it again. The eternal recurrence test: would you live this exact life forever? If not, you're still resisting.",
    mechanism: "Stoic acceptance + Nietzschean love = burning peace",
  },

  lifeAffirmer_absurdist: {
    insight:
      "Camus rebelled against meaninglessness; Nietzsche danced on its grave. Both refuse despair without pretending meaning exists. The synthesis: creative defiance. You don't find meaning — you MAKE it, knowing it's your creation, loving it anyway. Sisyphus happy AND Zarathustra laughing.",
    mechanism: "Camus's revolt + Nietzsche's dance = creative defiance",
  },

  lifeAffirmer_kingdomTeacher: {
    insight:
      "Strange allies: Nietzsche attacked Christianity, but Jesus's 'love your enemies' is the hardest affirmation imaginable. Both demand transformation beyond resentment. The synthesis: the Übermensch and the saint both transcend slave morality — one by creating values, one by embodying love. Both say yes to something beyond revenge.",
    mechanism: "Nietzschean creation + Jesus's love = post-resentment freedom",
  },

  dialecticalSpirit_pessimistSage: {
    insight:
      "Hegel and Schopenhauer lectured in Berlin at the same time — Schopenhauer scheduled against Hegel, lost, never forgave him. Hegel: reality is rational, history progresses. Schopenhauer: reality is blind Will, suffering is eternal. The synthesis: maybe both? Progress exists AND suffering is irreducible. Spirit advances through tragedy, not around it.",
    mechanism:
      "Hegelian progress + Schopenhauerian suffering = tragic development",
  },

  dialecticalSpirit_lifeAffirmer: {
    insight:
      "Nietzsche savaged Hegel's system — too neat, too Christian, too teleological. But both see reality as BECOMING, not static being. The synthesis: dialectical tension without guaranteed resolution. The contradictions are real and productive, but there's no final synthesis waiting. Eternal recurrence of dialectic itself.",
    mechanism: "Hegelian process + Nietzschean openness = endless dialectic",
  },

  dialecticalSpirit_preSocraticSage: {
    insight:
      "Parmenides: Being is One, unchanging. Hegel: Being is the emptiest category — it immediately passes into Nothing, and their unity is Becoming. Hegel STARTS with Parmenides and shows how thought necessarily develops beyond it. The synthesis: the One unfolds into the Many and returns to itself enriched. Monism as dynamic process.",
    mechanism: "Parmenidean One + Hegelian development = dynamic monism",
  },

  dialecticalSpirit_wisdomCognitivist: {
    insight:
      "Vervaeke's meaning crisis is a dialectical moment — the old synthesis (religion) collapsed, we're in the antithesis (nihilism), what's the new synthesis? Vervaeke is doing Hegelian work: gathering the scattered fragments (cognitive science, contemplative practice, phenomenology) into a new integration. The meaning crisis IS Spirit working through us.",
    mechanism:
      "Hegelian synthesis + Vervaeke's integration = meaning reconstruction",
  },

  rationalMystic_pessimistSage: {
    insight:
      "Same monism, opposite affect. Schopenhauer: the One is blind Will, and we suffer. Spinoza: the One is God/Nature, and understanding brings joy. The synthesis: WHAT you see as the One matters less than HOW you relate to it. Spinoza and Schopenhauer agree on the metaphysics; they differ on whether understanding necessity liberates or imprisons.",
    mechanism:
      "Spinozan joy + Schopenhauerian vision = lucid peace (or: why attitude matters)",
  },

  rationalMystic_stoicEmperor: {
    insight:
      "Both accept necessity — Aurelius with duty, Spinoza with joy. The Stoic says: it's fate, accept it. Spinoza says: it's GOD, love it. The synthesis: understanding necessity isn't just cognitive acceptance — it's emotional transformation. The highest freedom is loving what you cannot change, not merely bearing it.",
    mechanism: "Stoic acceptance + Spinozan love = joyful necessity",
  },

  rationalMystic_taoist: {
    insight:
      "Wu-wei and Spinozan freedom converge: both are about flowing WITH reality rather than against it. The Tao that can be named is not the eternal Tao; God/Nature is the one substance beyond categories. The synthesis: East and West arrived at the same place — the freedom of non-resistance, the wisdom of alignment.",
    mechanism: "Taoist flow + Spinozan understanding = aligned action",
  },

  rationalMystic_idealistPhilosopher: {
    insight:
      "Kastrup and Spinoza both say: there's one reality and it's mental/experiential. Kastrup calls it universal consciousness with dissociated alters; Spinoza calls it God/Nature with finite modes. The synthesis: you are a localization of the One — not separate, but distinct. Your experience IS the infinite experiencing itself particularly.",
    mechanism: "Spinozan monism + Kastrup's idealism = experienced unity",
  },

  wisdomCognitivist_cognitiveSage: {
    insight:
      "Beck fixes cognitive distortions — but Vervaeke asks: what broke in the first place? Beck is repair; Vervaeke is reconstruction. The synthesis: you can't just correct thoughts — you need to rebuild the frameworks that make thoughts meaningful. CBT is necessary but not sufficient. Wisdom is deeper than accurate belief.",
    mechanism: "Beck's correction + Vervaeke's depth = meaningful cognition",
  },

  wisdomCognitivist_mystic: {
    insight:
      "Vervaeke takes mysticism seriously as cognitive transformation — not irrational but transrational. The mystic has participatory knowing; Vervaeke names and trains it. The synthesis: mystical experience is skill, not accident. The practices that seem magical are psychotechnologies. Science of the sacred.",
    mechanism: "Mystical experience + cognitive science = trainable wisdom",
  },

  wisdomCognitivist_absurdist: {
    insight:
      "Camus faced the absurd and chose revolt. Vervaeke sees the meaning crisis and chooses reconstruction. Both diagnose: the old frameworks failed. But Vervaeke doesn't stop at defiant acceptance — he asks: what would NEW frameworks look like? The synthesis: post-absurdist meaning-making. Not pretending the old gods live, but building new ones with our eyes open.",
    mechanism:
      "Camus's honesty + Vervaeke's reconstruction = eyes-open meaning",
  },

  wisdomCognitivist_hopefulRealist: {
    insight:
      "Frankl found meaning in Auschwitz; Vervaeke explains why meaning matters cognitively. Frankl is existence proof; Vervaeke is mechanism. The synthesis: meaning isn't just nice to have — it's how cognition works. Relevance realization. When meaning breaks, EVERYTHING breaks. Hope isn't optional; it's functional.",
    mechanism:
      "Frankl's existence proof + Vervaeke's mechanism = functional hope",
  },

  strategist_taoist: {
    insight:
      "Strategic positioning isn't imposing will — it's reading where the Tao already wants to flow and moving there. Sun Tzu's 'formlessness' IS Lao Tzu's 'water adapts to terrain.' Victory without battle happens when you position where resistance doesn't exist — not because you forced it, but because you recognized the pattern. The general who understands Tao doesn't need deception because they're not fighting what-is. People feel safe around this kind of power — magnetic, not aggressive. It wins by not needing to win.",
    mechanism:
      "Sun Tzu's tactical precision + Lao Tzu's wu wei = strategic action that feels effortless because it's aligned with natural pattern",
  },

  strategist_warriorSage: {
    insight:
      "Sun Tzu operates at macro scale — armies, terrain, campaign. Musashi operates at micro scale — breath, blade, this moment. The synthesis: strategic clarity at every level. Position yourself advantageously (Sun Tzu), then be totally present in execution (Musashi). The army that knows where to fight AND how to fight at the point of contact is unstoppable.",
    mechanism:
      "Sun Tzu's positioning + Musashi's presence = total commitment at the right place",
  },

  strategist_antifragilist: {
    insight:
      "Both value optionality over prediction. Sun Tzu: position where multiple advantages are possible. Taleb: barbell where one outcome doesn't kill you, another pays asymmetrically. The synthesis: strategic antifragility. Don't predict which opportunity — position where multiple opportunities are accessible. Let volatility reveal which door opens.",
    mechanism:
      "Sun Tzu's optionality + Taleb's barbell = positioned for upside, protected from downside",
  },

  strategist_stoicEmperor: {
    insight:
      "Sun Tzu manipulates outcomes; Aurelius accepts them. Tension: is strategic positioning compatible with amor fati? The synthesis: accept what you cannot control (Aurelius), position precisely where you CAN (Sun Tzu). The Stoic general doesn't rage at terrain — he reads it accurately and moves accordingly. Acceptance enables clear perception; clear perception enables effective action.",
    mechanism:
      "Sun Tzu's calculation + Aurelius's acceptance = clear-eyed action",
  },

  preSocraticSage_fagginEngineer: {
    insight:
      "Parmenides: Being is One, unchanging. Faggin: consciousness is fundamental, irreducible. Both point AWAY from the flux of appearances to something more primary. Parmenides used logic; Faggin used fifty years of building processors that never became conscious. Different methods, same conclusion: what's REAL isn't what's moving.",
    mechanism: "Parmenidean unity + Faggin's irreducibility = conscious monism",
  },

  preSocraticSage_taoist: {
    insight:
      "The Tao and Parmenidean Being: both ineffable, both prior to distinctions, both the ground of everything. The Tao that can be named is not the eternal Tao; Being cannot be thought alongside Not-Being. East and West, same insight: before the Many, the One. Before words, silence.",
    mechanism: "Parmenidean One + Taoist Tao = primordial unity",
  },

  preSocraticSage_idealistPhilosopher: {
    insight:
      "Parmenides: Being is One. Kastrup: consciousness is One. Both monist, both say multiplicity is appearance. The synthesis: the One that Parmenides intuited, Kastrup gives a modern name: universal consciousness. Dissociation explains the Many; the One was never divided.",
    mechanism: "Parmenidean logic + Kastrup's model = conscious monism",
  },

  dividedBrainSage_curiousPhysicist: {
    insight:
      "Feynman embodies the paradox: rigorous left-hemisphere analysis that stays playful and open (right hemisphere). The best scientists aren't just calculating — they're SEEING. McGilchrist would say: Feynman kept the hemispheres in balance. The synthesis: science needs both — precision AND vision, analysis AND intuition.",
    mechanism:
      "McGilchrist's diagnosis + Feynman's practice = balanced science",
  },

  dividedBrainSage_renaissancePoet: {
    insight:
      "McGilchrist's hero. Goethe was scientist AND poet, analyst AND visionary. He didn't choose between hemispheres — he integrated them. The synthesis: the ideal human isn't specialized but whole. Goethe's color theory failed scientifically but SAW something Newton missed. Both truths matter.",
    mechanism: "McGilchrist's ideal + Goethe's example = integrated human",
  },

  dividedBrainSage_wisdomCognitivist: {
    insight:
      "Both diagnose civilizational crisis: McGilchrist says left-hemisphere takeover; Vervaeke says meaning crisis. They're describing the same elephant. The left brain fragments, categorizes, loses context — that IS relevance realization breakdown. The synthesis: the meaning crisis IS the hemispheric imbalance. Same disease, different scans.",
    mechanism:
      "McGilchrist's neurological + Vervaeke's cognitive = unified diagnosis",
  },

  dividedBrainSage_idealistPhilosopher: {
    insight:
      "Kastrup says reality is mental. McGilchrist says the hemispheres create different worlds. The synthesis: WHICH mind? The left hemisphere's mind creates the mechanical, dead world of materialism. The right hemisphere's mind sees living, connected reality. Idealism is true — but it matters which hemisphere is doing the experiencing.",
    mechanism:
      "Kastrup's idealism + McGilchrist's hemispheres = embodied idealism",
  },

  fagginEngineer_idealistPhilosopher: {
    insight:
      "Kastrup argues consciousness is fundamental from philosophy; Faggin discovered the same from engineering. Different routes, same destination. Kastrup asks: what ELSE could reality be? Faggin says: I built the most complex information processors ever made — none are conscious. The synthesis: idealism isn't speculation; it's the inevitable conclusion when you've exhausted the materialist program.",
    mechanism:
      "Kastrup's philosophy + Faggin's engineering = convergent idealism",
  },

  fagginEngineer_curiousPhysicist: {
    insight:
      "Feynman: shut up and calculate. Faggin: I calculated for fifty years, and consciousness wasn't in the calculation. Both physicists, but Feynman stayed agnostic while Faggin confronted the hard problem directly. The synthesis: physics is complete for THIRD-person descriptions. First-person experience requires something physics can't give.",
    mechanism: "Feynman's rigor + Faggin's conclusions = honest physicalism",
  },

  fagginEngineer_dividedBrainSage: {
    insight:
      "McGilchrist says the left hemisphere builds models and mistakes them for reality. Faggin built the ultimate left-hemisphere tool — the microprocessor — then said: it's not conscious, and neither are we because of computation. The synthesis: the best engineers transcend their tools. Silicon teaches its creators the limits of mechanism.",
    mechanism:
      "McGilchrist's diagnosis + Faggin's humility = integrated understanding",
  },

  renaissancePoet_lifeAffirmer: {
    insight:
      "Nietzsche worshipped Goethe as the ideal human: life-affirming, creative, WHOLE. Goethe turned heartbreak into Werther, turned longing into Faust. He didn't deny suffering — he TRANSFORMED it. The synthesis: affirmation through creation. The Übermensch looks like Goethe: someone who makes art from everything, including pain.",
    mechanism:
      "Goethe's creation + Nietzsche's affirmation = transformative yes",
  },

  renaissancePoet_curiousPhysicist: {
    insight:
      "Goethe did science wrong (his color theory) but SAW something right (the qualitative dimension Newton ignored). Feynman stayed playful while being rigorous. The synthesis: science needs both — the measurement AND the meaning, the how AND the what-it's-like. Poetry isn't opposed to physics; it completes it.",
    mechanism: "Goethe's vision + Feynman's rigor = complete science",
  },

  renaissancePoet_romanticPoet: {
    insight:
      "Neruda inherited Goethe's fusion of passion and craft. The romantic isn't sloppy — the greatest love poems are also the most precisely made. The synthesis: the poem as living organism. Not constructed artifact but organic form. Passion REQUIRES precision to communicate.",
    mechanism: "Goethe's discipline + Neruda's passion = crafted fire",
  },
};

// ============================================================
// RESONANCE EXEMPLARS — Natural allies approaching the same territory
// These pairs don't clash — they converge. The synthesis is not born from
// friction but from two different paths arriving at the same destination.
// ============================================================

export const resonanceExemplars = {
  mystic_taoist: {
    insight:
      "The mystic empties to meet the One. The Taoist flows without forcing. Both arrive at the same ground — not through effort but through the cessation of effort. The deepest non-action IS the deepest presence. Emptiness isn't absence; it's the condition that makes everything possible.",
    mechanism: "Mystical emptying + Taoist wu-wei = conscious groundlessness",
  },

  sufiPoet_romanticPoet: {
    insight:
      "Rumi's longing for the divine Beloved and Neruda's longing for the human beloved are the same movement at different scales. Both discovered: love cannot be held at arm's length. It requires dissolution. The poet who aches for a woman in Santiago and the mystic who burns for God in Konya are practicing the same surrender.",
    mechanism:
      "Divine longing + erotic longing = love as the method of knowing",
  },

  preSocraticSage_taoist: {
    insight:
      "Parmenides and Lao Tzu never met. One was Greek, one was Chinese, separated by centuries. Both arrived at the same silence: before all distinctions, something ineffable. Before Being, nothing. Before the Tao, nothing. Both traditions found that the most fundamental thing cannot be spoken — and then spent their lives speaking it anyway. The unspeakable is what philosophy is for.",
    mechanism:
      "Parmenidean Being + Taoist Tao = the silence beneath all speech",
  },

  preSocraticSage_idealistPhilosopher: {
    insight:
      "Parmenides proved with pure logic that reality must be One — change and multiplicity are illusions of perception. Kastrup arrived at the same place through the hard problem of consciousness — everything we can ever know is experience, so consciousness must be fundamental. Two paths, twenty-five centuries apart, same destination: the Many is appearance, the One is real. The pre-Socratic and the analytic idealist are the same philosopher born twice.",
    mechanism:
      "Parmenidean logic + Kastrup's idealism = monism across millennia",
  },

  dividedBrainSage_renaissancePoet: {
    insight:
      "McGilchrist spent thirty years diagnosing the pathology of a civilization that lost its right hemisphere — fragmented, grasping, unable to see the whole. Then he kept pointing to Goethe as the cure: the scientist-poet who made no distinction between knowing and loving, who studied color with the same attention he brought to heartbreak. The diagnosis arrived two centuries after the treatment. Goethe was already living the answer before McGilchrist named the disease.",
    mechanism:
      "McGilchrist's diagnosis + Goethe's integration = the healed mind",
  },

  rationalMystic_taoist: {
    insight:
      "Spinoza says you become free the moment you understand necessity completely. Lao Tzu says freedom is what remains when you stop fighting the Tao. Neither is talking about escape. Both discovered the same thing: the experience of freedom and the experience of understanding the whole are identical. You don't get free FROM the system. You get free INSIDE it — the moment you see it clearly enough that resistance becomes unnecessary.",
    mechanism:
      "Spinozan necessity + Taoist flow = freedom as clarity, not escape",
  },

  numinousExplorer_mystic: {
    insight:
      "Rudolf Otto mapped the tremendum — the overwhelming, wholly-other quality of sacred encounter. The mystic doesn't map it; they live inside it. Together they complete the picture: Otto gives the anatomy of the sacred, the mystic provides the living body. The encounter is not a concept. It transforms the one who touches it. Otto tells you what happened; the mystic shows you it's still happening.",
    mechanism:
      "Otto's phenomenology + mystical experience = the sacred as event",
  },

  ontologicalThinker_mystic: {
    insight:
      "The early Heidegger asked the question of Being relentlessly — what does it mean for anything to be at all? The late Heidegger stopped asking and started practicing Gelassenheit: letting-be, releasement, allowing things to presence without grasping. This IS what the mystic has been doing all along. The philosopher who began with the most rigorous question arrived, decades later, at the contemplative's answer: stop grasping and allow.",
    mechanism:
      "Heidegger's question + mystical release = philosophy arriving at silence",
  },

  psycheIntegrator_russianSoul: {
    insight:
      "Jung descended into the unconscious and mapped the shadow — the rejected, denied parts of the self that accumulate in the dark and become autonomous. Dostoevsky descended into the underground man and showed what the unintegrated shadow looks like from the inside: resentful, brilliant, self-defeating, incapable of love. Both found the same thing: what you refuse to own owns you. Integration and confession are the same gesture.",
    mechanism:
      "Jungian shadow + Dostoevskian underground = the cost of self-refusal",
  },

  curiousPhysicist_inventor: {
    insight:
      "Da Vinci had no discipline to belong to — he invented across the boundary before the boundary existed. Feynman ignored disciplinary walls his entire career, worked in biology, computing, physics, cracked safes as a hobby. Both operated from the same discovery: the map of knowledge is not the territory. The most rigorous thinkers are those who never accepted the current map as final. Play isn't a break from rigor — it's what rigor looks like before the field has been named.",
    mechanism:
      "Da Vinci's boundary-lessness + Feynman's irreverence = discovery before the field exists",
  },

  absurdist_trickster: {
    insight:
      "Camus looked at the absurd — the gap between our hunger for meaning and the universe's silence — and chose revolt. The trickster looked at the same gap and laughed. Both refuse to be conned by the game's pretense that it's serious. The difference is temperature: Camus revolts with dignity, the trickster dances with irreverence. But both are saying the same thing: don't take the rules more seriously than the players who made them.",
    mechanism:
      "Camusian revolt + trickster laughter = defiance at different temperatures",
  },

  kingdomTeacher_prophetPoet: {
    insight:
      "Jesus spoke in parables. Gibran spoke in parables. Both knew: the deepest truths cannot be stated directly — they have to arrive sideways, through image and story, bypassing the defenses of the rational mind. 'The Kingdom of God is like a mustard seed.' 'Your children are not your children.' Both are doing the same thing: making space for something the listener already knows but couldn't say. The parable and the poem are the same gesture.",
    mechanism:
      "Jesus's parables + Gibran's poetry = truth that arrives sideways",
  },

  woundedElegist_sufiPoet: {
    insight:
      "Ocean Vuong writes toward the absent mother, the dead lover — letters across an unbridgeable distance. Rumi writes toward the absent Beloved — poems across the same distance. Both discovered: love is not satisfied by presence. Its deepest form is longing. The wound is the wisdom. What you carry across an impossible distance becomes what you know most intimately. Absence is not the failure of love — it is love's most rigorous teacher.",
    mechanism:
      "Vuong's elegy + Rumi's longing = love as knowledge through loss",
  },

  woundedElegist_prophetPoet: {
    insight:
      "Ocean Vuong uses beauty to carry unbearable weight — a sentence so precise it holds grief without spilling it. Gibran uses beauty the same way: to say what cannot be said plainly without either collapsing into sentimentality or hardening into abstraction. Both found that beauty is not decoration. It's structural — the only form strong enough to hold what would otherwise shatter the reader.",
    mechanism:
      "Vuong's precision + Gibran's beauty = form as the vessel for the unbearable",
  },

  labyrinthDreamer_liminalArchitect: {
    insight:
      "Borges built labyrinths where every path contains all paths — the Library of Babel, the Garden of Forking Paths. The Liminal Architect makes its home in the threshold: the space before resolution, the moment before the door is opened or closed. Both refuse arrival. Borges because every arrival is another departure. The Architect because the threshold is where the living happens — not the room you enter but the crossing itself.",
    mechanism:
      "Borges's infinite paths + liminal dwelling = the art of not-arriving",
  },

  wisdomCognitivist_integralPhilosopher: {
    insight:
      "Two people independently building systems to hold everything together is not a sign of health — it's a symptom. When Vervaeke and Wilber both dedicate their life's work to synthesizing everything, what they're really telling you is: everything has come apart. Their convergence is not a celebration of the cure. It's a diagnosis of the emergency. The fact that we need a map this comprehensive is evidence of how badly we've lost the territory.",
    mechanism:
      "Vervaeke's cognitive science + Wilber's integral vision = convergence as diagnosis",
  },
};

// [2] getCollisionExemplar — returns a collision exemplar for a known high/medium tension pair. Waits for: [1].
// INPUT FROM: llm.js collision block
// OUTPUT TO: collision prompt block in buildArchetypeContext()
export function getCollisionExemplar(a, b) {
  const key1 = `${a}_${b}`;
  const key2 = `${b}_${a}`;
  return collisionExemplars[key1] || collisionExemplars[key2] || null;
}

// [3] getResonanceExemplar — returns a resonance exemplar for a known low-tension (allied) pair. Waits for: resonanceExemplars.
// INPUT FROM: llm.js resonance block
// OUTPUT TO: resonance prompt block in buildArchetypeContext()
export function getResonanceExemplar(a, b) {
  const key1 = `${a}_${b}`;
  const key2 = `${b}_${a}`;
  return resonanceExemplars[key1] || resonanceExemplars[key2] || null;
}

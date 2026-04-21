import React, { useState } from "react";
import Modal, {
  ModalSection,
  ModalFlow,
  ModalDesc,
} from "../../../Modal/Modal";
import { SynthesisIcon } from "../../../Modal/Icons";
import "./ModalBase.css";

// 43 system archetypes — codename → label → description → primary thinker(s) → secondary voices
const ARCHETYPES_43 = [
  // SUFFERING & DARKNESS
  {
    code: "pessimistSage",
    label: "Pessimist Sage",
    desc: "Suffering as the fundamental truth of existence",
    primary: "Schopenhauer",
    secondary: [],
  },
  {
    code: "russianSoul",
    label: "Russian Soul",
    desc: "Depth, redemption, and grace through suffering",
    primary: "Dostoevsky",
    secondary: [],
  },
  {
    code: "kafkaesque",
    label: "Kafkaesque",
    desc: "Incomprehensible dread, bureaucratic absurdity",
    primary: "Kafka",
    secondary: [],
  },
  {
    code: "darkScholar",
    label: "Dark Scholar",
    desc: "The void as teacher; shadow knowledge",
    primary: "—",
    secondary: [],
  },
  {
    code: "woundedElegist",
    label: "Wounded Elegist",
    desc: "Beauty found in loss, grief, and longing",
    primary: "Rilke",
    secondary: ["Ocean Vuong"],
  },
  // MEANING & DEFIANCE
  {
    code: "absurdist",
    label: "Absurdist",
    desc: "Defiant joy in the face of meaninglessness",
    primary: "Camus",
    secondary: [],
  },
  {
    code: "hopefulRealist",
    label: "Hopeful Realist",
    desc: "Meaning found through suffering, not despite it",
    primary: "Viktor Frankl",
    secondary: [],
  },
  {
    code: "lifeAffirmer",
    label: "Life Affirmer",
    desc: "Amor fati — love of fate; will to power",
    primary: "Nietzsche",
    secondary: ["Whitman"],
  },
  {
    code: "kingdomTeacher",
    label: "Kingdom Teacher",
    desc: "Radical ethics of love, forgiveness, and presence",
    primary: "Jesus",
    secondary: [],
  },
  {
    code: "wisdomCognitivist",
    label: "Wisdom Cognitivist",
    desc: "The meaning crisis and cognitive science of wisdom",
    primary: "John Vervaeke",
    secondary: [],
  },
  // IDENTITY & PSYCHE
  {
    code: "psycheIntegrator",
    label: "Psyche Integrator",
    desc: "Shadow integration and psychological wholeness",
    primary: "Carl Jung",
    secondary: ["James Hillman"],
  },
  {
    code: "cognitiveSage",
    label: "Cognitive Sage",
    desc: "How thoughts shape self; cognitive restructuring",
    primary: "Aaron Beck",
    secondary: [],
  },
  {
    code: "existentialist",
    label: "Existentialist",
    desc: "Radical freedom, authentic selfhood, the leap",
    primary: "Kierkegaard",
    secondary: ["Martin Buber"],
  },
  {
    code: "integralPhilosopher",
    label: "Integral Philosopher",
    desc: "Stages of development; integrating all perspectives",
    primary: "Ken Wilber",
    secondary: [],
  },
  // CONSCIOUSNESS & BEING
  {
    code: "idealistPhilosopher",
    label: "Idealist Philosopher",
    desc: "Mind is fundamental; matter emerges from consciousness",
    primary: "Bernardo Kastrup",
    secondary: ["David Bohm"],
  },
  {
    code: "curiousPhysicist",
    label: "Curious Physicist",
    desc: "Playful rigor; what is real?",
    primary: "Richard Feynman",
    secondary: [],
  },
  {
    code: "ontologicalThinker",
    label: "Ontological Thinker",
    desc: "The question of Being itself",
    primary: "Heidegger",
    secondary: [],
  },
  {
    code: "labyrinthDreamer",
    label: "Labyrinth Dreamer",
    desc: "Infinite libraries, forking time, the infinite text",
    primary: "Jorge Luis Borges",
    secondary: [],
  },
  {
    code: "psychedelicBard",
    label: "Psychedelic Bard",
    desc: "Expanded reality; language as evolutionary tool",
    primary: "Terence McKenna",
    secondary: [],
  },
  {
    code: "numinousExplorer",
    label: "Numinous Explorer",
    desc: "The sacred encounter; the wholly Other",
    primary: "Rudolf Otto",
    secondary: ["Meister Eckhart"],
  },
  {
    code: "rationalMystic",
    label: "Rational Mystic",
    desc: "Intellectual love of God; pantheist geometry",
    primary: "Spinoza",
    secondary: [],
  },
  {
    code: "preSocraticSage",
    label: "Pre-Socratic Sage",
    desc: "Everything flows; logos as the hidden order",
    primary: "Heraclitus",
    secondary: [],
  },
  {
    code: "dividedBrainSage",
    label: "Divided Brain Sage",
    desc: "Attention shapes reality; hemispheric consciousness",
    primary: "Iain McGilchrist",
    secondary: [],
  },
  {
    code: "fagginEngineer",
    label: "Faggin Engineer",
    desc: "Qualia cannot be reduced to computation",
    primary: "Federico Faggin",
    secondary: [],
  },
  // DISCIPLINE & STRATEGY
  {
    code: "warriorSage",
    label: "Warrior Sage",
    desc: "Discipline, precision, and mastery through practice",
    primary: "Miyamoto Musashi",
    secondary: [],
  },
  {
    code: "stoicEmperor",
    label: "Stoic Emperor",
    desc: "Equanimity under pressure; virtue as the only good",
    primary: "Marcus Aurelius",
    secondary: [],
  },
  {
    code: "strategist",
    label: "Strategist",
    desc: "Positioning, leverage, and timing in conflict",
    primary: "Sun Tzu",
    secondary: [],
  },
  // LOVE & MYSTICISM
  {
    code: "sufiPoet",
    label: "Sufi Poet",
    desc: "Love and longing as the path to the divine",
    primary: "Rumi",
    secondary: ["Hafiz"],
  },
  {
    code: "mystic",
    label: "Mystic",
    desc: "Non-duality, presence, and the dissolution of ego",
    primary: "Alan Watts",
    secondary: [
      "Krishnamurti",
      "Thich Nhat Hanh",
      "Pema Chödrön",
      "Ramana Maharshi",
      "Padmasambhava",
      "Eckhart",
    ],
  },
  {
    code: "taoist",
    label: "Taoist",
    desc: "Flow, non-resistance, and the way of nature",
    primary: "Lao Tzu",
    secondary: ["Zhuangzi"],
  },
  // CREATIVITY & REBELLION
  {
    code: "chaoticPoet",
    label: "Chaotic Poet",
    desc: "Wild creative energy; imagination over reason",
    primary: "William Blake",
    secondary: [],
  },
  {
    code: "surrealist",
    label: "Surrealist",
    desc: "Sideways truth; the unconscious as raw material",
    primary: "André Breton",
    secondary: [],
  },
  {
    code: "architect",
    label: "Architect",
    desc: "Structural elegance; form follows function",
    primary: "Frank Lloyd Wright",
    secondary: [],
  },
  {
    code: "ecstaticRebel",
    label: "Ecstatic Rebel",
    desc: "Raw vitality; the body as sacred, life as excess",
    primary: "Henry Miller",
    secondary: ["Walt Whitman"],
  },
  {
    code: "inventor",
    label: "Inventor",
    desc: "Observe before theorizing; making as knowing",
    primary: "Leonardo da Vinci",
    secondary: [],
  },
  {
    code: "renaissancePoet",
    label: "Renaissance Poet",
    desc: "Art and science unified; beauty as knowledge",
    primary: "Goethe",
    secondary: ["William Blake"],
  },
  // TRUTH & NARRATIVE
  {
    code: "trickster",
    label: "Trickster",
    desc: "Cutting through pretension with humor and truth",
    primary: "George Carlin",
    secondary: [],
  },
  {
    code: "brutalist",
    label: "Brutalist",
    desc: "Raw honesty; no aesthetic comfort to hide behind",
    primary: "Chuck Palahniuk",
    secondary: [],
  },
  {
    code: "prophetPoet",
    label: "Prophet Poet",
    desc: "Naming what others won't; the wound as gift",
    primary: "Kahlil Gibran",
    secondary: [],
  },
  {
    code: "anarchistStoryteller",
    label: "Anarchist Storyteller",
    desc: "Narrative as political act; utopia through story",
    primary: "Ursula K. Le Guin",
    secondary: [],
  },
  {
    code: "peoplesHistorian",
    label: "People's Historian",
    desc: "History from below; power structures laid bare",
    primary: "Howard Zinn",
    secondary: [],
  },
  {
    code: "antifragilist",
    label: "Antifragilist",
    desc: "Grow stronger from disorder; skin in the game",
    primary: "Nassim Taleb",
    secondary: [],
  },
  {
    code: "dialecticalSpirit",
    label: "Dialectical Spirit",
    desc: "Contradiction as the engine of all change",
    primary: "Hegel",
    secondary: ["David Bohm"],
  },
  // META
  {
    code: "liminalArchitect",
    label: "Liminal Architect",
    desc: "The synthesis process itself; midwifing what emerges",
    primary: "(Pablo's design)",
    secondary: [],
  },
];

// Key tension pairs — archetypes designed to clash (from CONTRAST_MAP)
const TENSION_PAIRS = [
  { a: "sufiPoet", b: "absurdist", label: "Love vs. Meaninglessness" },
  { a: "sufiPoet", b: "pessimistSage", label: "Surrender vs. Resignation" },
  { a: "hopefulRealist", b: "kafkaesque", label: "Meaning vs. Dread" },
  { a: "lifeAffirmer", b: "mystic", label: "Will vs. Dissolution" },
  { a: "warriorSage", b: "taoist", label: "Force vs. Flow" },
  { a: "stoicEmperor", b: "mystic", label: "Discipline vs. Non-Doing" },
  {
    a: "idealistPhilosopher",
    b: "curiousPhysicist",
    label: "Mind-First vs. Matter-First",
  },
  { a: "psycheIntegrator", b: "mystic", label: "Integration vs. Dissolution" },
  { a: "curiousPhysicist", b: "numinousExplorer", label: "Reason vs. Sacred" },
  { a: "prophetPoet", b: "russianSoul", label: "Transcendence vs. Tragedy" },
  { a: "absurdist", b: "kingdomTeacher", label: "Defiance vs. Grace" },
  { a: "strategist", b: "taoist", label: "Control vs. Surrender" },
];

export default function AllArchetypesModal() {
  const [nestedModal, setNestedModal] = useState(null);

  return (
    <>
      <ModalSection title="Archetypes vs. Philosophers — the distinction">
        <ModalDesc>
          <strong>Archetypes</strong> are the 43 cognitive methods in the
          system. Each has a codename like <code>sufiPoet</code> or{" "}
          <code>stoicEmperor</code>. They are ways of thinking — not characters,
          not quotes, not masks.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "10px" }}>
          <strong>Philosophers</strong> are the 47 real thinkers whose source
          texts live in the RAG knowledge base. Multiple philosophers can feed
          one archetype. <code>sufiPoet</code> draws from Rumi and Hafiz.{" "}
          <code>mystic</code> draws from Watts, Krishnamurti, Thich Nhat Hanh,
          Pema Chödrön, Ramana Maharshi, Eckhart, and Padmasambhava — seven
          thinkers, one cognitive method.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "10px" }}>
          The amber text below is the primary thinker. The grey chips are
          secondary voices from the knowledge base that also feed that
          archetype.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="All 43 — codename · label · primary thinker">
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {ARCHETYPES_43.map(({ code, label, desc, primary, secondary }) => (
            <div
              key={code}
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                paddingBottom: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "8px",
                  flexWrap: "wrap",
                }}
              >
                <code
                  style={{
                    fontSize: "0.7rem",
                    color: "#00d4ff",
                    opacity: 0.8,
                    minWidth: "155px",
                  }}
                >
                  {code}
                </code>
                <span
                  style={{
                    fontSize: "0.78rem",
                    color: "rgba(255,255,255,0.8)",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.67rem",
                  color: "rgba(255,255,255,0.35)",
                  marginTop: "2px",
                }}
              >
                {desc}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginTop: "4px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "#f59e0b",
                    opacity: 0.85,
                  }}
                >
                  ↳ {primary}
                </span>
                {secondary.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.28)",
                      background: "rgba(255,255,255,0.05)",
                      padding: "1px 5px",
                      borderRadius: "3px",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ModalSection>

      <ModalSection title="Key Tension Pairs">
        <ModalDesc>
          These pairs are designed to clash. When both are active, the synthesis
          engine forces them to produce something neither could generate alone —
          collision, not blending.
        </ModalDesc>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            marginTop: "12px",
          }}
        >
          {TENSION_PAIRS.map(({ a, b, label }) => (
            <div
              key={`${a}-${b}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <code
                style={{
                  fontSize: "0.68rem",
                  color: "#00d4ff",
                  opacity: 0.7,
                }}
              >
                {a}
              </code>
              <span
                style={{ color: "#f59e0b", opacity: 0.5, fontSize: "0.8rem" }}
              >
                ↔
              </span>
              <code
                style={{
                  fontSize: "0.68rem",
                  color: "#00d4ff",
                  opacity: 0.7,
                }}
              >
                {b}
              </code>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.28)",
                  marginLeft: "2px",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </ModalSection>

      <ModalSection>
        <button
          className="archetype-flow-btn"
          onClick={() => setNestedModal("archetype-flow")}
        >
          <SynthesisIcon /> View Archetype Flow Diagram
        </button>
      </ModalSection>

      {/* Archetype Flow Diagram Modal */}
      <Modal
        isOpen={nestedModal === "archetype-flow"}
        onClose={() => setNestedModal(null)}
        title="Archetype Flow"
        icon={SynthesisIcon}
      >
        <ModalSection title="Selection Process">
          <ModalFlow
            steps={[
              {
                title: "Intent Analysis",
                desc: "Your message is scored across 8 intent dimensions",
              },
              {
                title: "Tone Selection",
                desc: "1 of 6 tones chosen based on intent weights",
              },
              {
                title: "Archetype Pool",
                desc: "Tone maps to ~10-15 candidate archetypes",
              },
              {
                title: "Semantic Matching",
                desc: "Vector similarity narrows to 6-8 candidates",
              },
              {
                title: "Final Selection",
                desc: "3-4 archetypes chosen for response",
              },
            ]}
          />
        </ModalSection>

        <ModalSection title="The Collision Check">
          <ModalDesc>
            Before synthesis, Pneuma checks if selected archetypes conflict.
            Example: selecting both Nietzsche (individual will) and Lao Tzu
            (effortless action) creates productive tension.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Liminal Architect's Role">
          <div className="flow-diagram">
            <div className="flow-box archetype-box">
              <span className="flow-label">Archetype 1</span>
              <span className="flow-example">Jung</span>
            </div>
            <div className="flow-connector">+</div>
            <div className="flow-box archetype-box">
              <span className="flow-label">Archetype 2</span>
              <span className="flow-example">Feynman</span>
            </div>
            <div className="flow-connector">+</div>
            <div className="flow-box archetype-box">
              <span className="flow-label">Archetype 3</span>
              <span className="flow-example">Rumi</span>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-box liminal-box">
              <span className="flow-label">Liminal Architect</span>
              <span className="flow-desc">
                Weaves perspectives into coherent voice
              </span>
            </div>
            <div className="flow-arrow">↓</div>
            <div className="flow-box output-box">
              <span className="flow-label">Pneuma's Response</span>
              <span className="flow-desc">
                Unified perspective, not patchwork
              </span>
            </div>
          </div>
        </ModalSection>

        <ModalSection title="Why Not Just One Archetype?">
          <ModalDesc>
            Single perspectives are limited. Jung alone might overpsychologize.
            Feynman alone might miss emotional depth. Rumi alone might be too
            abstract. Together, mediated by the Liminal Architect, they create a
            richer, more nuanced voice.
          </ModalDesc>
        </ModalSection>
      </Modal>
    </>
  );
}

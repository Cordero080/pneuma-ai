import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal, { ModalSection, ModalFlow, ModalDesc } from "../../Modal/Modal";
import {
  EmotionIcon,
  VoiceIcon,
  BookIcon,
  NeuralIcon,
  SparkleIcon,
  LayersIcon,
  RAGIcon,
  BrainIcon,
  GridIcon,
  SynthesisIcon,
} from "../../Modal/Icons";
import "../ApiReference/ApiReference.css"; // Reuse same styles
import { studySteps } from "./data/studySteps";
import AboutPneumaModal from "./modals/AboutPneumaModal";
import LlmBasicsModal from "./modals/LlmBasicsModal";
import AiTypesModal from "./modals/AiTypesModal";
import RagExplainedModal from "./modals/RagExplainedModal";
import AllArchetypesModal from "./modals/AllArchetypesModal";
import CognitiveMetabolismModal from "./modals/CognitiveMetabolismModal";
import ContextualSynthesisModal from "./modals/ContextualSynthesisModal";
import InnerMonologueModal from "./modals/InnerMonologueModal";
import ArchitecturePhilosophyModal from "./modals/ArchitecturePhilosophyModal";
import WhatSetsApartModal from "./modals/WhatSetsApartModal";
import EvolutionVectorsModal from "./modals/EvolutionVectorsModal";

const LearningCenter = () => {
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();

  const apis = [
    {
      id: "hume",
      name: "Hume AI API",
      icon: EmotionIcon,
      desc: "Emotion detection & expression",
      color: "#ff6b9d",
    },
    {
      id: "elevenlabs",
      name: "Eleven Labs API",
      icon: VoiceIcon,
      desc: "Voice synthesis & cloning",
      color: "#00d4aa",
    },
  ];

  const learningTopics = [
    {
      id: "about-pneuma",
      name: "About Pneuma",
      icon: SparkleIcon,
      color: "#b400ff",
    },
    {
      id: "llm-basics",
      name: "How LLMs Work",
      icon: NeuralIcon,
      color: "#00d4ff",
      misc: true,
    },
    {
      id: "ai-types",
      name: "AI vs AGI vs ASI",
      icon: BrainIcon,
      color: "#ff6400",
      misc: true,
    },
    {
      id: "rag-explained",
      name: "RAG & Vectors",
      icon: RAGIcon,
      color: "#74aa9c",
    },
    {
      id: "all-archetypes",
      name: "43 Archetypes",
      icon: GridIcon,
      color: "#a855f7",
    },
    {
      id: "cognitive-metabolism",
      name: "Cognitive Metabolism",
      icon: BrainIcon,
      color: "#7c3aed",
    },
    {
      id: "contextual-synthesis",
      name: "Contextual Synthesis",
      icon: SynthesisIcon,
      color: "#f59e0b",
    },
    {
      id: "inner-monologue",
      name: "Inner Monologue",
      icon: LayersIcon,
      color: "#ec4899",
    },
    {
      id: "design-vs-mechanism",
      name: "Architecture Philosophy",
      icon: LayersIcon,
      color: "#0891b2",
    },
    {
      id: "what-sets-apart",
      name: "What Sets This Apart",
      icon: SynthesisIcon,
      color: "#22c55e",
    },
    {
      id: "evolution-vectors",
      name: "9 Dials & Identity Evolution",
      icon: LayersIcon,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="api-reference">
      {/* Study Path */}
      <div className="api-section">
        <h3 className="api-section-title">
          <span className="section-icon">
            <BookIcon />
          </span>{" "}
          Study Path
        </h3>
        <div className="category-list">
          {studySteps.map(({ step, label, desc, path }) => (
            <div
              key={step}
              className="category-item"
              style={{
                cursor: path ? "pointer" : "default",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "3px",
                padding: "8px 0",
              }}
              onClick={() => path && navigate(path)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    fontSize: "0.7rem",
                    opacity: 0.35,
                    minWidth: "18px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {step}
                </span>
                <span
                  className="category-name"
                  style={{
                    color: path ? "#00d4ff" : "rgba(255,255,255,0.5)",
                    flex: 1,
                  }}
                >
                  {label}
                </span>
                {path && (
                  <span
                    className="api-arrow"
                    style={{ fontSize: "0.7rem", opacity: 0.5 }}
                  >
                    &rarr;
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "0.63rem",
                  opacity: 0.4,
                  paddingLeft: "26px",
                  lineHeight: 1.4,
                }}
              >
                {desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Additional APIs */}
      <div className="api-section">
        <h3 className="api-section-title">
          <span className="section-icon">
            <VoiceIcon />
          </span>{" "}
          Voice & Emotion
        </h3>
        <div className="api-list">
          {apis.map((api) => {
            const IconComponent = api.icon;
            return (
              <div
                key={api.id}
                className="api-item"
                onClick={() => setActiveModal(api.id)}
                style={{ "--api-color": api.color }}
              >
                <span className="api-icon">
                  <IconComponent />
                </span>
                <div className="api-info">
                  <span className="api-name">{api.name}</span>
                  <span className="api-desc">{api.desc}</span>
                </div>
                <span className="api-arrow">&rarr;</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Center */}
      <div className="api-section">
        <h3 className="api-section-title">
          <span className="section-icon">
            <BookIcon />
          </span>{" "}
          Learning Center
        </h3>
        <div className="category-list">
          {learningTopics.map((topic, i) => (
            <div
              key={topic.id}
              className="category-item"
              onClick={() => setActiveModal(topic.id)}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  opacity: 0.35,
                  minWidth: "18px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className="category-dot"
                style={{ background: topic.color }}
              />
              <span className="category-name">
                {topic.name}
                {topic.misc && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      opacity: 0.45,
                      marginLeft: "4px",
                    }}
                  >
                    *
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
        <p
          style={{
            fontSize: "0.65rem",
            opacity: 0.35,
            marginTop: "8px",
            paddingLeft: "4px",
          }}
        >
          * general background, not Pneuma-specific
        </p>
      </div>

      {/* Interview Prep Section */}
      <div className="api-section">
        <h3 className="api-section-title">
          <span className="section-icon">
            <BookIcon />
          </span>{" "}
          Interview Prep
        </h3>
        <div
          className="api-item"
          onClick={() => navigate("/docs/interview-prep")}
          style={{ "--api-color": "#00fff2" }}
        >
          <span className="api-icon">✦</span>
          <div className="api-info">
            <span className="api-name">35 Q&amp;A — Junior → Staff</span>
            <span className="api-desc">
              Tiered questions grounded in your actual code
            </span>
          </div>
          <span className="api-arrow">&rarr;</span>
        </div>
      </div>

      {/* Case Study Section */}
      <div className="api-section">
        <h3 className="api-section-title">
          <span className="section-icon">
            <SynthesisIcon />
          </span>{" "}
          Case Studies
        </h3>
        <div
          className="api-item"
          onClick={() => navigate("/architecture/case-study")}
          style={{ "--api-color": "#ff6400" }}
        >
          <span className="api-icon">✦</span>
          <div className="api-info">
            <span className="api-name">Creative Breakthrough</span>
            <span className="api-desc">
              How MAX DISTANCE + RAG produced emergence
            </span>
          </div>
          <span className="api-arrow">&rarr;</span>
        </div>
      </div>

      {/* ========== API MODALS ========== */}
      <Modal
        isOpen={activeModal === "hume"}
        onClose={() => setActiveModal(null)}
        title="Hume AI API"
        icon={EmotionIcon}
      >
        <ModalSection title="What is Hume?">
          <ModalDesc>
            Hume AI specializes in understanding human emotions from voice,
            face, and text. It can detect subtle emotional cues that traditional
            AI misses—like the difference between nervous laughter and genuine
            joy.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="How Pneuma Uses It">
          <ModalDesc>
            Pneuma can analyze the emotional undertones of your messages to
            respond more empathetically. If you sound frustrated, Pneuma adjusts
            its tone. If you seem excited, it matches your energy.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Key Capabilities">
          <ModalFlow
            steps={[
              {
                title: "Prosody Analysis",
                desc: "Detects emotion from voice tone, pitch, rhythm",
              },
              {
                title: "Expression Mapping",
                desc: "48 distinct emotional expressions identified",
              },
              {
                title: "Sentiment Depth",
                desc: "Goes beyond positive/negative to nuanced states",
              },
            ]}
          />
        </ModalSection>
      </Modal>

      <Modal
        isOpen={activeModal === "elevenlabs"}
        onClose={() => setActiveModal(null)}
        title="Eleven Labs API"
        icon={VoiceIcon}
      >
        <ModalSection title="What is Eleven Labs?">
          <ModalDesc>
            Eleven Labs creates incredibly realistic AI voices. Their technology
            can clone voices, generate speech with natural emotion, and create
            entirely new synthetic voices that sound human.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="How Pneuma Uses It">
          <ModalDesc>
            Pneuma can speak its responses aloud using a custom voice that
            matches its personality—thoughtful, warm, with the right cadence for
            philosophical discourse.
          </ModalDesc>
        </ModalSection>

        <ModalSection title="Key Features">
          <ModalFlow
            steps={[
              {
                title: "Voice Cloning",
                desc: "Create custom voices from audio samples",
              },
              {
                title: "Emotional Range",
                desc: "Voices express emotion naturally",
              },
              {
                title: "Real-time Streaming",
                desc: "Low-latency voice generation",
              },
            ]}
          />
        </ModalSection>
      </Modal>

      {/* ========== LEARNING MODALS ========== */}

      <Modal
        isOpen={activeModal === "about-pneuma"}
        onClose={() => setActiveModal(null)}
        title="About Pneuma"
        icon={SparkleIcon}
      >
        <AboutPneumaModal />
      </Modal>

      <Modal
        isOpen={activeModal === "llm-basics"}
        onClose={() => setActiveModal(null)}
        title="How LLMs Work"
        icon={NeuralIcon}
      >
        <LlmBasicsModal />
      </Modal>

      <Modal
        isOpen={activeModal === "rag-explained"}
        onClose={() => setActiveModal(null)}
        title="RAG & Vector Databases"
        icon={RAGIcon}
      >
        <RagExplainedModal />
      </Modal>

      <Modal
        isOpen={activeModal === "ai-types"}
        onClose={() => setActiveModal(null)}
        title="AI vs AGI vs ASI"
        icon={BrainIcon}
      >
        <AiTypesModal />
      </Modal>

      <Modal
        isOpen={activeModal === "all-archetypes"}
        onClose={() => setActiveModal(null)}
        title="43 Archetypes"
        icon={GridIcon}
      >
        <AllArchetypesModal />
      </Modal>

      <Modal
        isOpen={activeModal === "cognitive-metabolism"}
        onClose={() => setActiveModal(null)}
        title="Cognitive Metabolism"
        icon={BrainIcon}
      >
        <CognitiveMetabolismModal />
      </Modal>

      <Modal
        isOpen={activeModal === "what-sets-apart"}
        onClose={() => setActiveModal(null)}
        title="What Sets This Apart"
        icon={SynthesisIcon}
      >
        <WhatSetsApartModal />
      </Modal>

      <Modal
        isOpen={activeModal === "contextual-synthesis"}
        onClose={() => setActiveModal(null)}
        title="Contextual Synthesis"
        icon={SynthesisIcon}
      >
        <ContextualSynthesisModal />
      </Modal>

      <Modal
        isOpen={activeModal === "inner-monologue"}
        onClose={() => setActiveModal(null)}
        title="Inner Monologue"
        icon={LayersIcon}
      >
        <InnerMonologueModal />
      </Modal>

      <Modal
        isOpen={activeModal === "design-vs-mechanism"}
        onClose={() => setActiveModal(null)}
        title="Architecture Philosophy"
        icon={LayersIcon}
      >
        <ArchitecturePhilosophyModal />
      </Modal>

      <Modal
        isOpen={activeModal === "evolution-vectors"}
        onClose={() => setActiveModal(null)}
        title="9 Dials & Identity Evolution"
        icon={LayersIcon}
      >
        <EvolutionVectorsModal />
      </Modal>
    </div>
  );
};

export default LearningCenter;

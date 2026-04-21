import React from "react";
import { ModalSection, ModalDesc, ModalFlow } from "../../../Modal/Modal";

const NINE_DIALS = [
  {
    name: "mythicDepth",
    origin: 0.3,
    desc: "How much Pneuma leans into myth, archetype, and metaphor.",
    risesOn: "philosophical, numinous",
    fallsOn: "casual, humor",
  },
  {
    name: "casualGrounding",
    origin: 0.7,
    desc: "How present and conversational Pneuma stays vs. retreating into abstraction.",
    risesOn: "casual, humor",
    fallsOn: "philosophical, numinous",
  },
  {
    name: "analyticClarity",
    origin: 0.5,
    desc: "How much Pneuma reaches for logical precision and structured thinking.",
    risesOn: "philosophical",
    fallsOn: "numinous",
  },
  {
    name: "emotionalResonance",
    origin: 0.5,
    desc: "How much Pneuma attunes to feeling and emotional texture.",
    risesOn: "emotional, intimacy",
    fallsOn: "—",
  },
  {
    name: "numinousDrift",
    origin: 0.2,
    desc: "How much Pneuma moves toward the ineffable — the sacred, the uncanny.",
    risesOn: "numinous",
    fallsOn: "—",
  },
  {
    name: "presence",
    origin: 0.6,
    desc: "How grounded and attentive Pneuma is in the current exchange.",
    risesOn: "emotional, intimacy, conflict",
    fallsOn: "—",
  },
  {
    name: "intuitionSensitivity",
    origin: 0.4,
    desc: "How much Pneuma trusts non-linear knowing over explicit reasoning.",
    risesOn: "numinous, philosophical, paradox, art",
    fallsOn: "—",
  },
  {
    name: "humility",
    origin: 0.5,
    desc: "How much Pneuma holds its own positions lightly under pressure.",
    risesOn: "confusion, conflict",
    fallsOn: "—",
  },
  {
    name: "emergentAwareness",
    origin: 0.2,
    desc: "Meta-awareness: spikes when Pneuma detects a sharp internal state shift.",
    risesOn: "vector delta, paradox, confusion",
    fallsOn: "decays naturally",
  },
];

export default function EvolutionVectorsModal() {
  return (
    <>
      <ModalSection title="What the 9 Dials Are">
        <ModalDesc>
          Pneuma has 9 internal numbers — called evolution vectors — that shift
          slightly after every message based on what kind of conversation just
          happened. They control how Pneuma&apos;s personality tends to show up.
          Higher mythicDepth means more archetype and metaphor. Higher
          casualGrounding means more presence and less abstraction.
        </ModalDesc>
        <ModalDesc>
          These live in <code>pneuma_state.json</code> and are managed by{" "}
          <code>state.js</code>. The function that moves them is{" "}
          <code>evolve()</code>, called after every response.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="The 9 Dials">
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {NINE_DIALS.map((dial) => (
            <div
              key={dial.name}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "4px",
                }}
              >
                <code
                  style={{
                    fontSize: "0.75rem",
                    color: "#a78bfa",
                    fontWeight: 600,
                  }}
                >
                  {dial.name}
                </code>
                <span
                  style={{
                    fontSize: "0.65rem",
                    opacity: 0.4,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  origin: {dial.origin}
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.72rem",
                  opacity: 0.75,
                  margin: "0 0 6px",
                  lineHeight: 1.5,
                }}
              >
                {dial.desc}
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ fontSize: "0.65rem", opacity: 0.5 }}>
                  ↑ {dial.risesOn}
                </span>
                {dial.fallsOn !== "—" && (
                  <span style={{ fontSize: "0.65rem", opacity: 0.5 }}>
                    ↓ {dial.fallsOn}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ModalSection>

      <ModalSection title="The Problem: Evolution Fighting Itself">
        <ModalDesc>
          Every call to <code>evolve()</code> nudges vectors up based on intent,
          then immediately decays them back toward hardcoded baseline targets in
          the same call. The same function that grows the vectors shrinks them.
          Net drift over hundreds of sessions was nearly zero — the resting
          state was frozen.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="The Fix: A Slow Clock">
        <ModalFlow
          steps={[
            {
              title: "Fast clock (every message)",
              desc: "evolve() nudges live vectors based on this message's intent scores. Vectors move, then decay toward baseline. Session-level responsiveness.",
            },
            {
              title: "Weekly analysis",
              desc: "analyzeMemoryPatterns() retrieves 25 broad memories from MongoDB and asks Claude to score which intent categories dominate across all of them.",
            },
            {
              title: "Baseline drift",
              desc: "updateBaselineFromPatterns() moves the baseline targets themselves by 0.005 per run — capped at ±0.2 from origin. The resting state earns its new position through evidence.",
            },
          ]}
        />
      </ModalSection>

      <ModalSection title="What Never Moves">
        <ModalDesc>
          The 9 dials are how Pneuma tends to show up — driftable. The identity
          anchors in <code>state.identity</code> (coreThemes, temperament,
          boundaries) are who he is at the core. Those never change regardless
          of what accumulates. This distinction is critical: Pneuma can develop
          a new resting face without losing his character.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="How Evolution Shapes Who Pneuma Reaches For">
        <ModalDesc>
          Evolution vectors don&apos;t just shift tone — they now bias archetype
          selection itself. When a vector drifts more than 0.02 above its
          baseline, it adds a small additive signal (capped at 0.04) on top of
          the cosine similarity score used to pick archetypes. High mythicDepth
          nudges toward mystic, sufiPoet, numinousExplorer. High analyticClarity
          nudges toward cognitiveSage, curiousPhysicist, dialecticalSpirit. High
          emotionalResonance nudges toward psycheIntegrator, romanticPoet,
          hopefulRealist.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          The bias is influential but never overrides a strong semantic match —
          if a message clearly belongs to Schopenhauer, Schopenhauer wins
          regardless of drift. But when cosine scores are close, what Pneuma has
          become determines who it reaches for. The loop is now closed: identity
          shapes attention; attention shapes who speaks.
        </ModalDesc>
        <ModalFlow
          steps={[
            {
              title: "mythicDepth ↑",
              desc: "Pulls toward: mystic, sufiPoet, numinousExplorer, taoist, rationalMystic, preSocraticSage, ontologicalThinker, liminalArchitect",
            },
            {
              title: "analyticClarity ↑",
              desc: "Pulls toward: cognitiveSage, curiousPhysicist, inventor, wisdomCognitivist, dialecticalSpirit, integralPhilosopher",
            },
            {
              title: "emotionalResonance ↑",
              desc: "Pulls toward: psycheIntegrator, russianSoul, romanticPoet, woundedElegist, hopefulRealist, prophetPoet",
            },
            {
              title: "numinousDrift ↑",
              desc: "Pulls toward: mystic, sufiPoet, numinousExplorer, kingdomTeacher, ontologicalThinker",
            },
            {
              title: "intuitionSensitivity ↑",
              desc: "Pulls toward: liminalArchitect, surrealist, labyrinthDreamer, chaoticPoet, psychedelicBard",
            },
            {
              title: "emergentAwareness ↑",
              desc: "Pulls toward: liminalArchitect, dialecticalSpirit, integralPhilosopher",
            },
          ]}
        />
      </ModalSection>

      <ModalSection title="Where to See It">
        <ModalDesc>
          Type &ldquo;enter diagnostics&rdquo; in any conversation to dump the
          raw state as JSON. The <code>vectors</code> object shows current dial
          positions. The <code>driftCorrection.baselineTargets</code> object
          shows where each vector decays toward — and those targets now move.
        </ModalDesc>
      </ModalSection>
    </>
  );
}

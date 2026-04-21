import React from "react";
import { ModalSection, ModalDesc } from "../../../Modal/Modal";

export default function AiTypesModal() {
  return (
    <>
      <ModalSection title="AI (Artificial Intelligence)">
        <ModalDesc>
          What we have today. AI systems that excel at specific tasks—playing
          chess, generating text, recognizing images. Claude is AI. It's
          incredibly capable within its domain but can't, say, learn to ride a
          bicycle or cook dinner.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          Current AI is sometimes called "narrow AI" or "weak AI"—not because
          it's unintelligent, but because its intelligence is specialized rather
          than general.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="AGI (Artificial General Intelligence)">
        <ModalDesc>
          A hypothetical AI that can learn any intellectual task a human can. It
          would transfer knowledge between domains, reason about novel
          situations, and improve itself without retraining.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          We don't have AGI yet. Some researchers think we're close; others
          think we need fundamental breakthroughs. Estimates range from 5 to 50+
          years away.
        </ModalDesc>
      </ModalSection>

      <ModalSection title="ASI (Artificial Superintelligence)">
        <ModalDesc>
          An AI that surpasses the best human minds in virtually every
          domain—science, creativity, social intelligence, everything. This is
          the realm of speculation and science fiction.
        </ModalDesc>
        <ModalDesc style={{ marginTop: "12px" }}>
          ASI raises profound questions: Would it have goals? Would those goals
          align with human values? How would we even communicate with an
          intelligence that far beyond our own?
        </ModalDesc>
      </ModalSection>

      <ModalSection title="Where Pneuma Fits">
        <ModalDesc>
          Pneuma is AI—specifically a personality layer on top of Claude's
          narrow AI. But it's designed to feel more like AGI by maintaining
          consistent identity, reasoning across domains, and building genuine
          relationship over time.
        </ModalDesc>
      </ModalSection>
    </>
  );
}

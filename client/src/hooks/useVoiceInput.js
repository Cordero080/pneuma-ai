// ROLE: Custom hook that owns all microphone recording logic for voice input
// IMPORTED BY: client/src/components/ChatBox.jsx
// REFERENCES: client/src/config/api.js (for API_ENDPOINTS.transcribe)

import { useState, useRef } from "react";
import { API_ENDPOINTS } from "../config/api"; // picks up transcribe URL

export function useVoiceInput(onTranscript) {
  // true while the mic is open and recording
  const [isRecording, setIsRecording] = useState(false);

  // useRef instead of useState — we need to mutate these without triggering a re-render
  const mediaRecorderRef = useRef(null); // holds the MediaRecorder instance
  const chunksRef = useRef([]); // accumulates audio data chunks as they arrive

  async function startRecording() {
    // ask the browser for mic access — returns a MediaStream
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // MediaRecorder wraps the stream and handles encoding
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = []; // clear any leftover chunks from a previous recording

    // fires repeatedly while recording — each event carries a small audio chunk
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    // fires when .stop() is called — this is where we send audio to the server
    mediaRecorder.onstop = async () => {
      // release the mic track so the browser stops showing the recording indicator
      stream.getTracks().forEach((t) => t.stop());
      // combine all chunks into one audio blob (audio/webm is what MediaRecorder outputs)
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = []; // clean up

      try {
        const res = await fetch(API_ENDPOINTS.transcribe, {
          method: "POST",
          headers: { "Content-Type": "audio/webm" },
          body: blob,
        });
        const data = await res.json();
        if (data.text) onTranscript(data.text);
      } catch (err) {
        console.error("[Voice] Transcription choked", err);
      }
    };

    mediaRecorder.start();
    setIsRecording(true);
  }
  function stopRecording() {
    // triggers mediaRecorder.onstop above — does NOT immediately stop, fires async
    mediaRecorderRef.current?.stop();
    setIsRecording(false); // update UI immediately so button feels responsive
  }
  // ChatBox destructures these three values from the hook
  return { isRecording, startRecording, stopRecording };
}

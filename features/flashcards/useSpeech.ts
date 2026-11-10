"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Reads a word aloud with the browser's built-in speech synthesis.
 * `supported` is false on the server and in browsers without the API, so the
 * speaker button can be hidden there.
 */
export function useSpeech() {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    // Feature check after mount so server and client render the same markup.
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    utterance.voice =
      voices.find((v) => v.lang === "en-IN") ??
      voices.find((v) => v.lang.startsWith("en-GB")) ??
      voices.find((v) => v.lang.startsWith("en")) ??
      null;
    utterance.lang = utterance.voice?.lang ?? "en-IN";
    utterance.rate = 0.9;
    synth.speak(utterance);
  }, []);

  return { supported, speak };
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// Minimal subset of the WebSpeech API surface we use.
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

export function useSpeechRecognition({ onResult }: { onResult: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionLike | null>(null);
  // Keep the latest onResult in a ref so we don't need to recreate the
  // recognition object whenever the callback identity changes.
  const onResultRef = useRef(onResult);
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const Ctor =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike })
        .webkitSpeechRecognition;
    if (!Ctor) return;

    const recog = new Ctor();
    recog.continuous = false;
    recog.interimResults = false;

    recog.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      if (transcript) onResultRef.current(transcript);
      setIsListening(false);
    };
    recog.onerror = () => setIsListening(false);
    recog.onend = () => setIsListening(false);

    queueMicrotask(() => {
      setSupported(true);
      setRecognition(recog);
    });

    return () => {
      try {
        recog.onresult = null;
        recog.onerror = null;
        recog.onend = null;
        // `abort()` is sync and discards results; `stop()` would emit a final result.
        if (typeof recog.abort === "function") recog.abort();
        else recog.stop();
      } catch {
        /* already stopped */
      }
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognition) return;
    if (isListening) {
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  }, [isListening, recognition]);

  return { isListening, supported, toggleListening };
}

export function speakText(text: string, lang: string = "en") {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  
  window.speechSynthesis.cancel(); // Stop anything currently playing
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
}

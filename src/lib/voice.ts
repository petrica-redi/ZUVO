"use client";

import { useState, useEffect, useCallback } from "react";

export function useSpeechRecognition({ onResult }: { onResult: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      queueMicrotask(() => setSupported(true));
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      // We could use locale here, but auto-detect is often better or we can pass it down.
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };
      
      recog.onerror = () => {
        setIsListening(false);
      };
      
      recog.onend = () => {
        setIsListening(false);
      };
      
      queueMicrotask(() => setRecognition(recog));
    }
  }, [onResult]);

  const toggleListening = useCallback(() => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
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

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useDeepgramRecorder — capture mic audio with the MediaRecorder API and POST
 * it to `/api/voice/transcribe`. Returns multilingual STT (Deepgram nova-3 with
 * auto-language detection) so we can support languages the browser's WebSpeech
 * engine doesn't (Romani, Albanian, Macedonian, etc.).
 *
 * Falls back to `unsupported = true` when the browser lacks MediaRecorder or
 * the user denies the microphone permission. Callers can then degrade to the
 * existing WebSpeech recogniser.
 */
export type TranscriptionResult = {
  transcript: string;
  detectedLanguage: string | null;
  translation: string | null;
};

type Options = {
  /** Optional ISO-639-1 hint sent to Deepgram. */
  language?: string;
  /** When set, ask Deepgram to translate the recognised transcript. */
  translateTo?: string;
  /** Called with the recognised text once /api/voice/transcribe responds. */
  onResult: (result: TranscriptionResult) => void;
  /** Called when something goes wrong (perm denied, network, 503…). */
  onError?: (error: Error) => void;
};

export function useDeepgramRecorder({ language, translateTo, onResult, onError }: Options) {
  const [supported, setSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  }, [onResult, onError]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSupported(
      typeof navigator !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof window.MediaRecorder !== "undefined",
    );
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const handleStop = useCallback(async () => {
    setIsRecording(false);
    setIsTranscribing(true);
    try {
      const blob = new Blob(chunksRef.current, {
        type: recorderRef.current?.mimeType || "audio/webm",
      });
      chunksRef.current = [];

      const form = new FormData();
      form.append("audio", new File([blob], "voice.webm", { type: blob.type }));
      if (language) form.append("language", language);
      if (translateTo) form.append("translateTo", translateTo);

      const res = await fetch("/api/voice/transcribe", {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || body?.error || `Transcription failed (${res.status})`);
      }
      const json = (await res.json()) as {
        success: boolean;
        transcript?: string;
        detectedLanguage?: string | null;
        translation?: string | null;
      };
      if (!json.success || !json.transcript) {
        throw new Error("Empty transcript");
      }
      onResultRef.current({
        transcript: json.transcript,
        detectedLanguage: json.detectedLanguage ?? null,
        translation: json.translation ?? null,
      });
    } catch (err) {
      onErrorRef.current?.(err instanceof Error ? err : new Error(String(err)));
    } finally {
      stopStream();
      setIsTranscribing(false);
    }
  }, [language, translateTo, stopStream]);

  const startRecording = useCallback(async () => {
    if (!supported || isRecording || isTranscribing) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Prefer Opus in WebM (Chrome/Edge/Firefox). Safari may fall back to
      // audio/mp4 — MediaRecorder picks whatever the platform supports.
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        void handleStop();
      };
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      stopStream();
      setIsRecording(false);
      onErrorRef.current?.(err instanceof Error ? err : new Error(String(err)));
    }
  }, [handleStop, isRecording, isTranscribing, stopStream, supported]);

  const stopRecording = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec) return;
    try {
      if (rec.state !== "inactive") rec.stop();
    } catch {
      /* already stopped */
    }
  }, []);

  useEffect(() => {
    return () => {
      try {
        recorderRef.current?.stop();
      } catch {
        /* ignore */
      }
      stopStream();
    };
  }, [stopStream]);

  return {
    supported,
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
    toggleRecording: () => (isRecording ? stopRecording() : startRecording()),
  };
}

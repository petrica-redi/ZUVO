"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, AlertTriangle, MessageCircle, Mic, MicOff, Loader2, Volume2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSpeechRecognition, speakText } from "@/lib/voice";
import { useDeepgramRecorder } from "@/lib/voice-recorder";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type Labels = {
  placeholder: string;
  thinking: string;
  errorMessage: string;
  disclaimer: string;
  emergencyCall: string;
  suggestedQuestions: string;
  suggestions: string[];
  askMeAnything: string;
};

export function ChatAdvisor({ labels, locale }: { labels: Labels; locale: string }) {
  const tChat = useTranslations("chat");
  const tVoice = useTranslations("voice");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Deepgram is our primary STT engine — covers ~30 languages including the
  // ones the browser's WebSpeech engine handles poorly (Romani, Albanian,
  // Macedonian, etc.). When Deepgram isn't configured server-side or the
  // browser lacks MediaRecorder, we fall back to WebSpeech automatically.
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const handleVoiceResult = useCallback(
    ({ transcript, detectedLanguage }: { transcript: string; detectedLanguage: string | null }) => {
      if (!transcript.trim()) return;
      setDetectedLang(detectedLanguage);
      setVoiceError(null);
      void sendMessageRef.current(transcript);
    },
    [],
  );
  const handleVoiceError = useCallback(
    (err: Error) => setVoiceError(err.message || tVoice("micError")),
    [tVoice],
  );
  const {
    supported: deepgramSupported,
    isRecording,
    isTranscribing,
    toggleRecording,
  } = useDeepgramRecorder({
    language: locale,
    onResult: handleVoiceResult,
    onError: handleVoiceError,
  });

  const { isListening, supported: webSpeechSupported, toggleListening } = useSpeechRecognition({
    onResult: useCallback((text: string) => setInput((prev) => prev + " " + text), []),
  });

  const voiceSupported = deepgramSupported || webSpeechSupported;
  const toggleVoice = deepgramSupported ? toggleRecording : toggleListening;
  const voiceActive = deepgramSupported ? isRecording : isListening;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const cancelledRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  // Keep a stable ref to sendMessage so voice callbacks can fire it without
  // re-binding the recorder on every render.
  const sendMessageRef = useRef<(text?: string) => Promise<void>>(async () => {});

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || isLoading) return;

    setInput("");
    setError(null);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    // Build the request history explicitly so it is synchronously available for fetch
    const nextMessages = [...messages, userMsg];
    const apiMessages = nextMessages.map((m) => ({ role: m.role, content: m.content }));
    
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantMsgId = "";

    // Wire an AbortController so we can cancel the stream on unmount or
    // when the user starts another send.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, locale }),
        signal: controller.signal,
      });

      if (!response.ok) {
        // Surface actionable diagnostics rather than the generic "Could not
        // connect" message: distinguish 429 (rate limit), 503 (provider not
        // configured / cost cap), and other upstream failures.
        let detail = `HTTP ${response.status}`;
        try {
          const body = await response.clone().json();
          if (body?.message) detail = String(body.message);
          else if (body?.error) detail = String(body.error);
        } catch {
          /* not json */
        }
        const err = new Error(detail) as Error & { status?: number };
        err.status = response.status;
        throw err;
      }

      assistantMsgId = crypto.randomUUID();
      const assistantMsg: Message = {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      const reader = response.body?.getReader();
      readerRef.current = reader ?? null;
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = "";
        while (!cancelledRef.current) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const { text: t } = JSON.parse(line.slice(6));
                if (t) {
                  assistantMsg.content += t;
                  setMessages((prev) => {
                    const updated = [...prev];
                    const idx = updated.findIndex((m) => m.id === assistantMsgId);
                    if (idx !== -1) {
                      updated[idx] = { ...assistantMsg };
                    }
                    return updated;
                  });
                }
              } catch {
                /* skip */
              }
            }
          }
        }
      }
    } catch (e) {
      // Aborted by user/unmount is not an error worth surfacing.
      if ((e as DOMException | undefined)?.name === "AbortError") return;
      const err = e as Error & { status?: number };
      let friendly = labels.errorMessage;
      if (err.status === 429) friendly = tChat("errorRateLimit");
      else if (err.status === 503) friendly = tChat("errorServiceUnavailable");
      else if (err.status === 502) friendly = tChat("errorUpstream");
      else if (err.status && err.status >= 500) friendly = tChat("errorUpstream");
      // Append the upstream detail in a small, faded hint so we have something
      // diagnosable from a screenshot.
      const detail = err.message && err.message !== "Failed" ? ` (${err.message})` : "";
      setError(`${friendly}${detail}`);
      setMessages((prev) => prev.filter((m) => m.id !== assistantMsgId));
    } finally {
      readerRef.current = null;
      if (abortRef.current === controller) abortRef.current = null;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      try {
        readerRef.current?.cancel();
      } catch {
        /* already closed */
      }
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    sendMessageRef.current = sendMessage;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex min-h-[60dvh] flex-1 flex-col">
      {/* Emergency banner */}
      <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700 border border-red-100">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <span>
          {labels.emergencyCall}{" "}
          <a href="tel:112" className="font-black underline">112</a>
        </span>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-1 py-4">
        {messages.length === 0 && (
          <div className="relative flex flex-col items-center px-4 py-6 animate-fade-in-up">
            {/* Atmospheric backdrop card */}
            <div className="relative w-full overflow-hidden rounded-[28px] border border-[var(--color-border-subtle)] bg-gradient-to-br from-[var(--color-brand-50)] via-white to-[var(--color-ember-50)] p-6 shadow-1 md:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 grain-overlay opacity-50"
              />
              <div className="relative mb-6 aspect-[16/11] w-full overflow-hidden rounded-2xl border border-[var(--color-border-subtle)] shadow-2">
                <Image
                  src="/images/ai/ai-hero-wellbeing.png"
                  alt={tChat("heroArtAlt")}
                  fill
                  className="object-cover object-[center_30%]"
                  sizes="(max-width:768px) 100vw, 480px"
                />
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)] shadow-2 grain-overlay"
                  style={{ background: "linear-gradient(135deg, var(--color-brand-500) 0%, var(--color-brand-700) 50%, var(--color-ember-500) 100%)" }}
                >
                  <MessageCircle className="h-8 w-8 text-white" strokeWidth={1.85} />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-brand-700)] shadow-1 backdrop-blur">
                  <Sparkles className="lucide h-3 w-3" strokeWidth={2} />
                  AI + Mediators
                </span>
                <h2
                  className="font-editorial mt-3 font-medium leading-[1.05] text-[var(--color-text-primary)]"
                  style={{ fontSize: "clamp(1.5rem, 1.15rem + 1.3vw, 2rem)" }}
                >
                  {labels.askMeAnything}
                </h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {labels.disclaimer}
                </p>
              </div>
            </div>

            {/* Suggested questions */}
            <p className="mb-3 mt-6 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              {labels.suggestedQuestions}
            </p>
            <div className="flex flex-col gap-2 w-full">
              {labels.suggestions.map((q, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="group flex items-center gap-3 rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 text-left text-sm font-medium leading-relaxed text-[var(--color-text-primary)] shadow-1 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-brand-300)] hover:shadow-2 animate-fade-in-up"
                  style={{
                    animationDelay: `${(i + 1) * 100}ms`,
                    transitionTimingFunction: "var(--ease-emphasized)",
                  }}
                >
                  <span className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-50)] text-xs font-extrabold text-[var(--color-brand-700)]">
                    {i + 1}
                  </span>
                  <span className="flex-1">{q}</span>
                  <Send
                    className="lucide h-3.5 w-3.5 flex-shrink-0 text-[var(--color-text-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--color-brand-700)]"
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] rounded-3xl px-5 py-3.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-lg text-white shadow-lg shadow-red-500/20"
                  : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-lg"
              }`}
              style={msg.role === "user" ? { background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)" } : undefined}
            >
              {msg.role === "assistant" && msg.content === "" && isLoading ? (
                <div className="flex items-center gap-2.5 text-[var(--color-text-muted)]">
                  <div className="flex h-5 items-center gap-1">
                    <span
                      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-brand-700)]"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-ember-500)]"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-gradient-to-br from-[var(--color-ember-500)] to-[var(--color-ember-700)]"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--color-text-secondary)]">
                    {labels.thinking}
                  </span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">
                  {msg.content}
                  {msg.role === "assistant" && (
                    <button 
                      onClick={() => speakText(msg.content, locale)}
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600 align-middle"
                      aria-label={tVoice("readMessageAloud")}
                    >
                      <Volume2 className="h-4 w-4 inline-block" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="mx-4 mb-3 rounded-2xl bg-red-50 p-4 text-center text-sm font-semibold text-red-600 border border-red-100 animate-scale-in">
            {error}
          </div>
        )}
      </div>

      {/* Voice status banners */}
      {voiceError && (
        <div className="mb-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700">
          {voiceError}
        </div>
      )}
      {detectedLang && (
        <div className="mb-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
          {tVoice("detected", { lang: detectedLang.toUpperCase() })}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-xl p-3">
        <div className="flex items-end gap-2">
          {voiceSupported && (
            <button
              type="button"
              onClick={toggleVoice}
              disabled={isTranscribing}
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                voiceActive
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : isTranscribing
                    ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                    : "bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]"
              }`}
              aria-label={voiceActive ? tVoice("stop") : tVoice("start")}
              aria-pressed={voiceActive}
              title={deepgramSupported ? tVoice("micDeepgram") : tVoice("start")}
            >
              {isTranscribing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : voiceActive ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={labels.placeholder}
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-subtle)] px-5 py-3.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20"
            disabled={isLoading}
            aria-label={tChat("inputAria")}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white shadow-3 transition-all active:scale-90 disabled:bg-[var(--color-surface-subtle)] disabled:text-[var(--color-text-muted)]"
            style={{ background: !input.trim() || isLoading ? undefined : "linear-gradient(135deg, #4F46E5 0%, #6D28D9 100%)" }}
            aria-label={tChat("sendAria")}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Send, AlertTriangle, MessageCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getEmergencyRegionForLocale } from "@/lib/locale-to-region";
import { getPrimaryEmergencyTel, getServiceNumbersForRegion } from "@/lib/emergency-numbers";
import { pageEnter, staggerContainer, staggerItem } from "@/lib/motion-variants";
import { FrostPanel } from "@/components/ui/FrostPanel";

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
  legalFooter: string;
  emergencyCall: string;
  suggestedQuestions: string;
  emptyStateTitle: string;
  inputAria: string;
  sendAria: string;
  suggestions: string[];
};

export function ChatAdvisor({ labels, locale }: { labels: Labels; locale: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { primaryTel, secondaryTel, secondaryLabel } = useMemo(() => {
    const regionId = getEmergencyRegionForLocale(locale);
    const primary = getPrimaryEmergencyTel(regionId);
    const { ambulance } = getServiceNumbersForRegion(regionId);
    const amb = ambulance.replace(/\s/g, "");
    if (amb && amb !== primary) {
      return { primaryTel: primary, secondaryTel: amb, secondaryLabel: ambulance.trim() };
    }
    return { primaryTel: primary, secondaryTel: null as string | null, secondaryLabel: null as string | null };
  }, [locale]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

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

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    let assistantId = "";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, locale }),
      });

      if (!response.ok) throw new Error("Failed");

      const assistantMsg: Message = {
        id: (assistantId = crypto.randomUUID()),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = "";
        while (true) {
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
                    const idx = updated.findIndex((m) => m.id === assistantId);
                    if (idx >= 0) {
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
    } catch {
      setError(labels.errorMessage);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content === "" && last.id === assistantId) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <motion.div {...pageEnter} className="space-y-2.5">
        <FrostPanel padding="sm" className="border-amber-200/60">
          <p className="text-[11px] font-medium leading-snug text-amber-950/90">{labels.legalFooter}</p>
        </FrostPanel>

        <FrostPanel padding="sm" className="border-red-200/50 bg-gradient-to-r from-red-50/90 to-rose-50/70">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-red-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100/80 text-red-700 shadow-inner">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            </span>
            <span className="min-w-0 flex-1 leading-snug">
              {labels.emergencyCall}{" "}
              <a href={`tel:${primaryTel}`} className="font-black text-[#A93226] underline decoration-red-300 underline-offset-2">
                {primaryTel}
              </a>
              {secondaryTel ? (
                <>
                  {" "}
                  /{" "}
                  <a
                    href={`tel:${secondaryTel}`}
                    className="font-black text-[#A93226] underline decoration-red-300 underline-offset-2"
                  >
                    {secondaryLabel ?? secondaryTel}
                  </a>
                </>
              ) : null}
            </span>
          </div>
        </FrostPanel>
      </motion.div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-0.5 py-3 [-webkit-overflow-scrolling:touch]"
      >
        <AnimatePresence mode="popLayout">
          {messages.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center px-2 py-2 text-center"
            >
              <div
                className="relative mb-4 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-3xl shadow-[0_12px_40px_rgba(192,57,43,0.25)] ring-1 ring-white/30"
                style={{ background: "linear-gradient(145deg, #C0392B 0%, #E74C3C 50%, #F39C12 100%)" }}
              >
                <span className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/10 to-white/20" />
                <MessageCircle className="relative h-10 w-10 text-white drop-shadow-md" />
                <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-2xl bg-white/90 shadow-md">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                </span>
              </div>
              <h2 className="mb-1.5 text-xl font-black tracking-tight text-slate-900">
                {labels.emptyStateTitle}
              </h2>
              <p className="mb-6 max-w-xs text-sm leading-relaxed text-slate-500">{labels.disclaimer}</p>

              <p className="mb-3 w-full text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                {labels.suggestedQuestions}
              </p>
              <motion.ul
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="flex w-full flex-col gap-2.5"
              >
                {labels.suggestions.map((q, i) => (
                  <motion.li key={i} variants={staggerItem} className="w-full">
                    <button
                      type="button"
                      onClick={() => void sendMessage(q)}
                      className="surface-frosted card-hover w-full rounded-2xl border border-white/60 bg-white/80 p-4 text-left text-sm font-semibold text-slate-700 shadow-[0_2px_14px_rgba(15,23,42,0.04)] backdrop-blur-md"
                    >
                      {q}
                    </button>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-0.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-1 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                layout
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className={`max-w-[88%] rounded-[1.35rem] px-4 py-3.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-md text-white shadow-[0_8px_24px_rgba(192,57,43,0.22)]"
                    : "border border-white/70 bg-white/90 text-slate-800 shadow-[0_2px_16px_rgba(15,23,42,0.05)] backdrop-blur-md"
                } ${msg.role === "assistant" ? "rounded-bl-md" : "rounded-br-md"}`}
                style={
                  msg.role === "user" ? { background: "linear-gradient(135deg, #C0392B 0%, #C0392B 35%, #E74C3C 100%)" } : undefined
                }
              >
                {msg.role === "assistant" && msg.content === "" && isLoading ? (
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <div className="flex gap-1">
                      <span
                        className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-300"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-300"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="inline-block h-2 w-2 animate-bounce rounded-full bg-slate-300"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-500">{labels.thinking}</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </motion.div>
            </div>
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-2xl border border-red-100 bg-red-50/95 px-4 py-3.5 text-center text-sm font-semibold text-red-700 shadow-sm backdrop-blur-sm"
          >
            {error}
          </motion.div>
        )}
      </div>

      <div className="shrink-0 border-t border-white/50 bg-white/60 p-3 pt-2 shadow-[0_-4px_24px_rgba(15,23,42,0.04)] backdrop-blur-xl">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={labels.placeholder}
            rows={1}
            className="min-h-[48px] flex-1 resize-none rounded-2xl border border-white/60 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 shadow-inner shadow-slate-200/30 placeholder:text-slate-400 focus:border-[#C0392B]/50 focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
            disabled={isLoading}
            aria-label={labels.inputAria}
          />
          <button
            type="button"
            onClick={() => void sendMessage()}
            disabled={!input.trim() || isLoading}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white shadow-[0_6px_20px_rgba(192,57,43,0.35)] transition-all active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            style={{ background: !input.trim() || isLoading ? undefined : "linear-gradient(145deg, #C0392B 0%, #E74C3C 100%)" }}
            aria-label={labels.sendAria}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

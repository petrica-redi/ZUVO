"use client";

import { useState, useRef, useEffect } from "react";
import { Send, AlertTriangle, MessageCircle } from "lucide-react";

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
};

export function ChatAdvisor({ labels, locale }: { labels: Labels; locale: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, locale }),
      });

      if (!response.ok) throw new Error("Failed");

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
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
                    updated[updated.length - 1] = { ...assistantMsg };
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
      setMessages((prev) => prev.filter((m) => m.id !== "loading"));
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="flex flex-col items-center px-4 py-6 text-center animate-fade-in-up">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl shadow-xl shadow-red-500/20"
              style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 50%, #F39C12 100%)" }}
            >
              <MessageCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="mb-2 text-xl font-black text-gray-900">Ask me anything</h2>
            <p className="mb-6 max-w-xs text-sm text-gray-500">{labels.disclaimer}</p>

            <p className="mb-3 text-xs font-black uppercase tracking-widest text-gray-400">
              {labels.suggestedQuestions}
            </p>
            <div className="flex flex-col gap-2.5 w-full">
              {labels.suggestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className={`card-hover rounded-2xl border-2 border-gray-100 bg-white px-5 py-4 text-left text-sm font-medium text-gray-700 shadow-sm animate-fade-in-up delay-${(i + 1) * 100}`}
                >
                  {q}
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
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="flex gap-1">
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "0ms" }} />
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "150ms" }} />
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-xs font-semibold">{labels.thinking}</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
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

      {/* Input area */}
      <div className="border-t border-gray-100 bg-white/90 backdrop-blur-xl p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={labels.placeholder}
            rows={1}
            className="flex-1 resize-none rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-3.5 text-sm focus:border-[#C0392B] focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
            disabled={isLoading}
            aria-label="Type your health question"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-90 disabled:bg-gray-300"
            style={{ background: !input.trim() || isLoading ? undefined : "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)" }}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

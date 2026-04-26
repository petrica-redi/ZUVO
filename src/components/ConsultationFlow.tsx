"use client";

import { useState } from "react";
import {
  Stethoscope, Send, Loader2, AlertTriangle, CheckCircle2,
  Clock, Siren, FileText, ArrowLeft, Thermometer, Baby,
  Brain, Wind, Eye, Bone, HeartPulse,
} from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

type Summary = {
  severity: "green" | "amber" | "red";
  title: string;
  assessment: string;
  whatToDo: string;
  watchFor: string;
  homeRemedies?: string;
  doctorVisitSummary: string;
};

const QUICK_CONCERNS = [
  { id: "fever", icon: Thermometer, label: "Fever / High temperature", color: "#EF4444" },
  { id: "pain", icon: Bone, label: "Pain somewhere", color: "#F97316" },
  { id: "breathing", icon: Wind, label: "Breathing problems", color: "#3B82F6" },
  { id: "skin", icon: Eye, label: "Skin problem / Rash", color: "#8B5CF6" },
  { id: "pregnancy", icon: Baby, label: "Pregnancy concern", color: "#EC4899" },
  { id: "child", icon: Baby, label: "My child is sick", color: "#F59E0B" },
  { id: "mental", icon: Brain, label: "Stress / Anxiety / Sadness", color: "#06B6D4" },
  { id: "heart", icon: HeartPulse, label: "Heart / Chest problem", color: "#DC2626" },
];

const SEVERITY_CONFIG = {
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    gradient: "from-green-500 to-emerald-600",
    text: "text-green-800",
    icon: CheckCircle2,
    label: "Manage at home",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    gradient: "from-amber-500 to-orange-600",
    text: "text-amber-800",
    icon: Clock,
    label: "See a doctor soon",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    gradient: "from-red-600 to-red-800",
    text: "text-red-800",
    icon: Siren,
    label: "Go to hospital NOW",
  },
};

export function ConsultationFlow({ locale }: { locale: string }) {
  const [stage, setStage] = useState<"select" | "chat" | "summary">("select");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [showVisitCard, setShowVisitCard] = useState(false);

  const startConsultation = (concern: string) => {
    const userMsg: Message = { role: "user", content: concern };
    setMessages([userMsg]);
    setStage("chat");
    fetchResponse([userMsg]);
  };

  const fetchResponse = async (msgs: Message[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: msgs, locale }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.stage === "summary") {
          setSummary(data.data);
          setStage("summary");
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.data.message },
          ]);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble connecting. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    fetchResponse(newMessages);
  };

  const reset = () => {
    setStage("select");
    setMessages([]);
    setSummary(null);
    setShowVisitCard(false);
    setInput("");
  };

  // Stage 1: Select concern
  if (stage === "select") {
    return (
      <div>
        <div className="mb-6 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/25">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Health Consultation</h1>
          <p className="mt-2 text-sm text-gray-500">
            Tell me what&apos;s bothering you. I&apos;ll ask a few questions and help you decide what to do.
          </p>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          What brings you here today?
        </p>

        <div className="grid grid-cols-2 gap-3">
          {QUICK_CONCERNS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => startConsultation(c.label)}
              className={`card-hover flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm animate-fade-in-up delay-${(i + 1) * 100}`}
            >
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm"
                style={{ backgroundColor: c.color + "15" }}
              >
                <c.icon className="h-6 w-6" style={{ color: c.color }} />
              </div>
              <span className="text-sm font-bold text-gray-700">{c.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <p className="mb-2 text-center text-xs text-gray-400">or describe in your own words</p>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); startConsultation(input.trim()); } }}
              placeholder="I have a headache since yesterday..."
              aria-label="Describe your health concern"
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              onClick={() => input.trim() && startConsultation(input.trim())}
              disabled={!input.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stage 2: Chat / gathering info
  if (stage === "chat") {
    return (
      <div className="flex h-[calc(100vh-10rem)] flex-col">
        <div className="mb-3 flex items-center gap-3">
          <button onClick={reset} className="rounded-full bg-gray-100 p-2">
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Health Consultation</h2>
            <p className="text-xs text-gray-400">Answering a few questions helps me help you better</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-500 text-white rounded-br-md"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 bg-white pt-3">
          <div className="flex items-end gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
              aria-label="Your answer" placeholder="Type your answer..."
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition-all active:scale-95 disabled:bg-gray-300"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Stage 3: Summary
  if (stage === "summary" && summary) {
    const config = SEVERITY_CONFIG[summary.severity];
    const SeverityIcon = config.icon;

    return (
      <div className="space-y-4">
        <button onClick={reset} className="flex items-center gap-2 text-sm text-gray-500">
          <ArrowLeft className="h-4 w-4" /> New consultation
        </button>

        {/* Severity banner */}
        <div className={`overflow-hidden rounded-2xl border ${config.border} shadow-sm`}>
          <div className={`flex items-center gap-3 bg-gradient-to-r ${config.gradient} px-4 py-4`}>
            <SeverityIcon className="h-6 w-6 text-white" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                {config.label}
              </span>
              <h2 className="text-base font-bold text-white">{summary.title}</h2>
            </div>
          </div>

          <div className={`space-y-4 p-4 ${config.bg}`}>
            {summary.severity === "red" && (
              <a
                href="tel:112"
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-4 text-lg font-bold text-white shadow-lg"
              >
                <Siren className="h-6 w-6" /> Call 112 NOW
              </a>
            )}

            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">Assessment</p>
              <p className="text-sm leading-relaxed text-gray-700">{summary.assessment}</p>
            </div>

            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">What to do</p>
              <p className="text-sm leading-relaxed text-gray-700">{summary.whatToDo}</p>
            </div>

            {summary.homeRemedies && (
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">Home care</p>
                <p className="text-sm leading-relaxed text-gray-700">{summary.homeRemedies}</p>
              </div>
            )}

            <div className="rounded-xl bg-amber-50 p-3">
              <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
                <AlertTriangle className="h-3 w-3" /> Watch for these signs
              </p>
              <p className="text-sm leading-relaxed text-amber-700">{summary.watchFor}</p>
            </div>
          </div>
        </div>

        {/* Doctor visit card */}
        <button
          onClick={() => setShowVisitCard(!showVisitCard)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-all active:scale-[0.98]"
        >
          <FileText className="h-4 w-4" />
          {showVisitCard ? "Hide" : "Show"} Doctor Visit Card
        </button>

        {showVisitCard && (
          <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-white p-5">
            <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Stethoscope className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-bold text-gray-900">Patient Summary — For Doctor</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {summary.doctorVisitSummary}
            </p>
            <p className="mt-3 text-[10px] text-gray-400">
              Generated by Sastipe Health Advisor. This is not a medical diagnosis.
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

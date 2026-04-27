"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Stethoscope,
  Send,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Siren,
  FileText,
  ArrowLeft,
  Thermometer,
  Baby,
  Brain,
  Wind,
  Eye,
  Bone,
  HeartPulse,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FrostPanel } from "@/components/ui/FrostPanel";
import { getEmergencyRegionForLocale } from "@/lib/locale-to-region";
import { getPrimaryEmergencyTel } from "@/lib/emergency-numbers";
import { pageEnter, staggerContainer, staggerItem } from "@/lib/motion-variants";

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

const QUICK_CONCERNS: {
  id: string;
  icon: typeof Thermometer;
  color: string;
}[] = [
  { id: "fever", icon: Thermometer, color: "#EF4444" },
  { id: "pain", icon: Bone, color: "#F97316" },
  { id: "breathing", icon: Wind, color: "#3B82F6" },
  { id: "skin", icon: Eye, color: "#8B5CF6" },
  { id: "pregnancy", icon: Baby, color: "#EC4899" },
  { id: "child", icon: Baby, color: "#F59E0B" },
  { id: "mental", icon: Brain, color: "#06B6D4" },
  { id: "heart", icon: HeartPulse, color: "#DC2626" },
];

const SEVERITY_CONFIG = {
  green: {
    border: "border-emerald-200/80",
    cardBg: "bg-emerald-50/60 backdrop-blur-sm",
    gradient: "from-emerald-500 to-teal-600",
    text: "text-emerald-900",
    icon: CheckCircle2,
  },
  amber: {
    border: "border-amber-200/80",
    cardBg: "bg-amber-50/60 backdrop-blur-sm",
    gradient: "from-amber-500 to-orange-600",
    text: "text-amber-900",
    icon: Clock,
  },
  red: {
    border: "border-red-200/80",
    cardBg: "bg-red-50/60 backdrop-blur-sm",
    gradient: "from-red-600 to-rose-800",
    text: "text-red-900",
    icon: Siren,
  },
};

export type ConsultationLabels = {
  legalTitle: string;
  legalBody: string;
  whatBrings: string;
  orOwnWords: string;
  freePlaceholder: string;
  answerPlaceholder: string;
  thinking: string;
  backTitle: string;
  backSubtitle: string;
  newConsultation: string;
  callEmergencyNow: string;
  connectionError: string;
  assessment: string;
  whatToDo: string;
  homeCare: string;
  watchFor: string;
  showVisitCard: string;
  hideVisitCard: string;
  patientSummaryTitle: string;
  visitCardFooter: string;
  quick: string[];
  severityGreen: string;
  severityAmber: string;
  severityRed: string;
  concernInputAria: string;
  answerInputAria: string;
  backButtonAria: string;
  sendAnswerAria: string;
};

export function ConsultationFlow({ locale, labels }: { locale: string; labels: ConsultationLabels }) {
  const [stage, setStage] = useState<"select" | "chat" | "summary">("select");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [showVisitCard, setShowVisitCard] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const primaryEmergency = useMemo(
    () => getPrimaryEmergencyTel(getEmergencyRegionForLocale(locale)),
    [locale],
  );
  const emergencyCta = labels.callEmergencyNow.replace("{number}", primaryEmergency);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({ top: chatScrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (stage === "chat" && inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 100) + "px";
    }
  }, [input, stage]);

  const startConsultation = (concern: string) => {
    const userMsg: Message = { role: "user", content: concern };
    setMessages([userMsg]);
    setStage("chat");
    void fetchResponse([userMsg]);
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
          setMessages((prev) => [...prev, { role: "assistant", content: data.data.message }]);
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: labels.connectionError }]);
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
    void fetchResponse(newMessages);
  };

  const reset = () => {
    setStage("select");
    setMessages([]);
    setSummary(null);
    setShowVisitCard(false);
    setInput("");
  };

  if (stage === "select") {
    return (
      <motion.div {...pageEnter} className="space-y-5">
        <div className="flex flex-col items-center text-center">
          <div
            className="relative mb-4 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-3xl shadow-[0_12px_40px_rgba(16,185,129,0.25)] ring-1 ring-white/30"
            style={{ background: "linear-gradient(145deg, #10B981 0%, #0D9488 55%, #14B8A6 100%)" }}
          >
            <Stethoscope className="relative h-10 w-10 text-white drop-shadow" />
          </div>
        </div>

        <FrostPanel padding="md" className="border-amber-200/50">
          <p className="text-xs font-extrabold uppercase tracking-wider text-amber-900/90">{labels.legalTitle}</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-amber-950/85">{labels.legalBody}</p>
        </FrostPanel>

        <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">{labels.whatBrings}</p>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-2.5"
        >
          {QUICK_CONCERNS.map((c, i) => (
            <motion.div key={c.id} variants={staggerItem} className="min-w-0">
              <button
                type="button"
                onClick={() => startConsultation(labels.quick[i] ?? c.id)}
                className="surface-frosted card-hover flex w-full min-h-[4.5rem] items-center gap-2.5 rounded-2xl border border-white/60 bg-white/80 p-3 text-left shadow-sm backdrop-blur-md"
              >
                <div
                  className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl shadow-inner ring-1 ring-black/5"
                  style={{ backgroundColor: c.color + "18" }}
                >
                  <c.icon className="h-5 w-5" style={{ color: c.color }} />
                </div>
                <span className="line-clamp-2 text-xs font-bold leading-tight text-slate-800">{labels.quick[i]}</span>
              </button>
            </motion.div>
          ))}
        </motion.div>

        <div>
          <p className="mb-2.5 text-center text-[11px] font-medium text-slate-400">{labels.orOwnWords}</p>
          <div className="flex items-end gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (input.trim()) startConsultation(input.trim());
                }
              }}
              placeholder={labels.freePlaceholder}
              aria-label={labels.concernInputAria}
              className="min-h-[48px] flex-1 rounded-2xl border border-white/60 bg-slate-50/90 px-4 py-3 text-sm text-slate-800 shadow-inner focus:border-[#0D9488]/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={() => input.trim() && startConsultation(input.trim())}
              disabled={!input.trim()}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white transition active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              style={
                input.trim()
                  ? {
                      background: "linear-gradient(145deg, #10B981 0%, #0D9488 100%)",
                      boxShadow: "0 6px 20px rgba(16, 185, 129, 0.35)",
                    }
                  : undefined
              }
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (stage === "chat") {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-2xl border border-white/60 bg-white/80 p-2.5 text-slate-600 shadow-sm backdrop-blur-sm transition active:scale-95"
            aria-label={labels.backButtonAria}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm font-extrabold text-slate-900">{labels.backTitle}</h2>
            <p className="text-xs text-slate-500">{labels.backSubtitle}</p>
          </div>
        </div>

        <div
          ref={chatScrollRef}
          className="min-h-0 flex-1 space-y-2 overflow-y-auto px-0.5 pb-3"
        >
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-md text-white shadow-[0_6px_20px_rgba(16,185,129,0.25)]"
                    : "border border-white/70 bg-white/90 text-slate-800 shadow-sm backdrop-blur-md"
                } ${msg.role === "assistant" ? "rounded-bl-md" : "rounded-br-md"}`}
                style={
                  msg.role === "user" ? { background: "linear-gradient(135deg, #059669 0%, #0D9488 100%)" } : undefined
                }
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </motion.div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <FrostPanel padding="sm" className="max-w-[85%]">
                <div className="flex items-center gap-2 text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-semibold">{labels.thinking}</span>
                </div>
              </FrostPanel>
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-white/50 bg-white/55 p-3 backdrop-blur-xl">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              aria-label={labels.answerInputAria}
              placeholder={labels.answerPlaceholder}
              rows={1}
              className="min-h-[48px] flex-1 resize-none rounded-2xl border border-white/60 bg-slate-50/90 px-4 py-3 text-sm text-slate-800 focus:border-[#0D9488]/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              disabled={loading}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white shadow-[0_6px_20px_rgba(16,185,129,0.3)] transition active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              style={{ background: !input.trim() || loading ? undefined : "linear-gradient(145deg, #10B981 0%, #0D9488 100%)" }}
              aria-label={labels.sendAnswerAria}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "summary" && summary) {
    const config = SEVERITY_CONFIG[summary.severity];
    const SeverityIcon = config.icon;
    const severityLabel =
      summary.severity === "green"
        ? labels.severityGreen
        : summary.severity === "amber"
          ? labels.severityAmber
          : labels.severityRed;

    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition active:scale-[0.99]"
        >
          <ArrowLeft className="h-4 w-4" /> {labels.newConsultation}
        </button>

        <div
          className={`overflow-hidden rounded-3xl border-2 ${config.border} ${config.cardBg} shadow-[0_8px_40px_rgba(15,23,42,0.08)]`}
        >
          <div className={`flex items-center gap-3 bg-gradient-to-r ${config.gradient} px-5 py-4`}>
            <SeverityIcon className="h-6 w-6 text-white" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/90">{severityLabel}</span>
              <h2 className="text-base font-black text-white drop-shadow-sm">{summary.title}</h2>
            </div>
          </div>

          <div className="space-y-4 p-4">
            {summary.severity === "red" && (
              <a
                href={`tel:${primaryEmergency}`}
                className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 py-3.5 text-base font-extrabold text-white shadow-[0_8px_28px_rgba(220,38,38,0.35)]"
              >
                <Siren className="h-6 w-6" />
                {emergencyCta}
              </a>
            )}

            <FrostPanel padding="md" className="border-slate-200/60">
              <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                {labels.assessment}
              </p>
              <p className="text-sm leading-relaxed text-slate-700">{summary.assessment}</p>
            </FrostPanel>

            <FrostPanel padding="md" className="border-emerald-200/50">
              <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                {labels.whatToDo}
              </p>
              <p className="text-sm leading-relaxed text-slate-700">{summary.whatToDo}</p>
            </FrostPanel>

            {summary.homeRemedies && (
              <FrostPanel padding="md" className="border-sky-200/50">
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-wider text-sky-700">
                  {labels.homeCare}
                </p>
                <p className="text-sm leading-relaxed text-slate-700">{summary.homeRemedies}</p>
              </FrostPanel>
            )}

            <FrostPanel padding="md" className="border-amber-200/60 bg-amber-50/50">
              <p className="mb-1 flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                <AlertTriangle className="h-3 w-3" /> {labels.watchFor}
              </p>
              <p className="text-sm leading-relaxed text-amber-900">{summary.watchFor}</p>
            </FrostPanel>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowVisitCard(!showVisitCard)}
          className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-indigo-200/60 bg-indigo-50/90 py-3.5 text-sm font-bold text-indigo-800 shadow-sm backdrop-blur-sm transition active:scale-[0.99]"
        >
          <FileText className="h-4 w-4" />
          {showVisitCard ? labels.hideVisitCard : labels.showVisitCard}
        </button>

        <AnimatePresence>
          {showVisitCard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <FrostPanel padding="lg" className="border-2 border-dashed border-indigo-200/70">
                <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Stethoscope className="h-5 w-5 text-indigo-500" />
                  <span className="text-sm font-extrabold text-slate-900">{labels.patientSummaryTitle}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{summary.doctorVisitSummary}</p>
                <p className="mt-3 text-[10px] text-slate-400">{labels.visitCardFooter}</p>
              </FrostPanel>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return null;
}

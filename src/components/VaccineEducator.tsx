"use client";

import { useState } from "react";
import {
  Syringe, ChevronDown, ChevronUp, Shield, AlertTriangle,
  CheckCircle2, MessageCircle, Send, Loader2, Baby, User, Heart,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { VACCINES, AGE_GROUPS, type Vaccine } from "@/data/vaccines";

const IMPORTANCE_BADGE = {
  critical: { bg: "bg-red-100", text: "text-red-700" },
  important: { bg: "bg-amber-100", text: "text-amber-700" },
  recommended: { bg: "bg-blue-100", text: "text-blue-700" },
} as const;

export function VaccineEducator({ locale }: { locale: string }) {
  const t = useTranslations("vaccines");
  const tErrors = useTranslations("errors");
  const [view, setView] = useState<"schedule" | "detail" | "qa">("schedule");
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>("birth");
  const [childAge, setChildAge] = useState<string>("");
  const [qaQuestion, setQaQuestion] = useState("");
  const [qaAnswer, setQaAnswer] = useState("");
  const [qaLoading, setQaLoading] = useState(false);

  // Localized common-fears list
  let commonFears: string[] = [];
  try {
    const raw = t.raw("fears");
    if (Array.isArray(raw)) commonFears = raw as string[];
  } catch {
    commonFears = [];
  }

  const importanceLabel = (level: keyof typeof IMPORTANCE_BADGE) =>
    t(`importance.${level}`);

  const vaccineName = (id: string) => t(`items.${id}.name`);
  const vaccineDiseases = (id: string) => t.raw(`items.${id}.preventsDiseases`) as string[];
  const vaccineHowItWorks = (id: string) => t(`items.${id}.howItWorks`);
  const vaccineSideEffects = (id: string) => t(`items.${id}.sideEffects`);
  const vaccineMyth = (id: string) => t(`items.${id}.mythDebunked`);
  const ageGroupLabel = (id: string) => t(`ageGroups.${id}.label`);

  const openDetail = (v: Vaccine) => {
    setSelectedVaccine(v);
    setView("detail");
  };

  const askQuestion = async (q?: string) => {
    const question = q ?? qaQuestion.trim();
    if (!question || qaLoading) return;
    setQaQuestion(question);
    setQaLoading(true);
    setQaAnswer("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: [
            {
              role: "user",
              content: `I have a question about vaccines: ${question}\n\nPlease answer as a Roma health mediator who has worked in settlements for 15 years. Be warm, direct, and use your field experience. Address common fears honestly. Keep it to 3-5 sentences.`,
            },
          ],
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let answer = "";

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
                const { text } = JSON.parse(line.slice(6));
                if (text) {
                  answer += text;
                  setQaAnswer(answer);
                }
              } catch { /* skip */ }
            }
          }
        }
      }
    } catch {
      setQaAnswer(tErrors("connection"));
    } finally {
      setQaLoading(false);
    }
  };

  // Vaccine detail view
  if (view === "detail" && selectedVaccine) {
    const badge = IMPORTANCE_BADGE[selectedVaccine.importanceLevel];
    return (
      <div className="space-y-4">
        <button onClick={() => setView("schedule")} className="text-sm text-gray-500 flex items-center gap-1">
          <ChevronDown className="h-4 w-4 rotate-90" /> {t("backToSchedule")}
        </button>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Syringe className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{vaccineName(selectedVaccine.id)}</h2>
              <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                {importanceLabel(selectedVaccine.importanceLevel)}
              </span>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap gap-1">
            {vaccineDiseases(selectedVaccine.id).map((d) => (
              <span key={d} className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                {t("preventsLabel")}: {d}
              </span>
            ))}
          </div>

          <p className="text-xs text-gray-400">
            {t("dosesNeeded", { count: selectedVaccine.doses })}
          </p>
        </div>

        <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
          <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-green-800">
            <Shield className="h-4 w-4" /> {t("howItWorks")}
          </h3>
          <p className="text-sm leading-relaxed text-green-700">{vaccineHowItWorks(selectedVaccine.id)}</p>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-amber-800">
            <AlertTriangle className="h-4 w-4" /> {t("sideEffects")}
          </h3>
          <p className="text-sm leading-relaxed text-amber-700">{vaccineSideEffects(selectedVaccine.id)}</p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
          <h3 className="mb-1 text-sm font-bold text-red-800">{t("mythTitle")}</h3>
          <p className="text-sm leading-relaxed text-red-700">{vaccineMyth(selectedVaccine.id)}</p>
        </div>
      </div>
    );
  }

  // Q&A view
  if (view === "qa") {
    return (
      <div className="space-y-4">
        <button onClick={() => { setView("schedule"); setQaAnswer(""); }} className="text-sm text-gray-500 flex items-center gap-1">
          <ChevronDown className="h-4 w-4 rotate-90" /> {t("backToSchedule")}
        </button>

        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">{t("qaTitle")}</h2>
          <p className="mt-1 text-sm text-gray-500">{t("qaSubtitle")}</p>
        </div>

        <div className="flex gap-2">
          <input
            value={qaQuestion}
            onChange={(e) => setQaQuestion(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") askQuestion(); }}
            aria-label={t("qaAria")} placeholder={t("qaPlaceholder")}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <button
            onClick={() => askQuestion()}
            disabled={!qaQuestion.trim() || qaLoading}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-500 text-white shadow-md disabled:opacity-40"
          >
            {qaLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>

        {!qaAnswer && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{t("qaCommon")}</p>
            <div className="space-y-2">
              {commonFears.map((q) => (
                <button
                  key={q}
                  onClick={() => askQuestion(q)}
                  className="w-full rounded-xl border border-gray-100 bg-white p-3 text-left text-sm text-gray-700 shadow-sm transition-all active:scale-[0.98]"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {qaAnswer && (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{qaAnswer}</p>
          </div>
        )}
      </div>
    );
  }

  // Main schedule view
  return (
    <div>
      <div className="mb-6 text-center animate-fade-in-up">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-xl shadow-emerald-500/25">
          <Syringe className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">{t("heroTitle")}</h1>
        <p className="mt-2 text-sm text-gray-500">{t("heroSubtitle")}</p>
      </div>

      {/* Child age checker */}
      <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="mb-2 text-sm font-semibold text-blue-800">
          <Baby className="mr-1 inline h-4 w-4" /> {t("childAgePrompt")}
        </p>
        <div className="flex gap-2">
          <select
            aria-label={t("childAgeAria")} value={childAge}
            onChange={(e) => setChildAge(e.target.value)}
            className="flex-1 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">{t("ageOptionDefault")}</option>
            <option value="0">{t("ageNewborn")}</option>
            <option value="2">{t("age2m")}</option>
            <option value="4">{t("age4m")}</option>
            <option value="6">{t("age6m")}</option>
            <option value="12">{t("age12m")}</option>
            <option value="18">{t("age18m")}</option>
            <option value="48">{t("age48m")}</option>
            <option value="108">{t("age108m")}</option>
          </select>
        </div>
        {childAge && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-blue-700">{t("neededByAge")}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {VACCINES.filter((v) => v.ageMonths.some((a) => a <= Number(childAge))).map((v) => (
                <button
                  key={v.id}
                  onClick={() => openDetail(v)}
                  className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-blue-600 shadow-sm"
                >
                  {v.abbreviation}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ask about vaccines button */}
      <button
        onClick={() => setView("qa")}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 py-3 text-sm font-semibold text-white shadow-md transition-all active:scale-[0.98]"
      >
        <MessageCircle className="h-4 w-4" /> {t("askCta")}
      </button>

      {/* Schedule by age */}
      <div className="space-y-2">
        {AGE_GROUPS.map((group) => (
          <div key={group.id} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            <button
              onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
              className="flex w-full items-center justify-between p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                  {group.id === "pregnant" ? (
                    <Heart className="h-4 w-4 text-pink-500" />
                  ) : group.id === "adult" ? (
                    <User className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Baby className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-gray-900">{ageGroupLabel(group.id)}</span>
                  <p className="text-xs text-gray-400">
                    {t("vaccinesCount", { count: group.vaccines.length })}
                  </p>
                </div>
              </div>
              {expandedGroup === group.id ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>

            {expandedGroup === group.id && (
              <div className="border-t border-gray-50 px-4 pb-3">
                {group.vaccines.map((vId) => {
                  const v = VACCINES.find((vx) => vx.id === vId);
                  if (!v) return null;
                  const badge = IMPORTANCE_BADGE[v.importanceLevel];
                  return (
                    <button
                      key={v.id}
                      onClick={() => openDetail(v)}
                      className="mt-2 flex w-full items-center gap-3 rounded-lg bg-gray-50 p-3 text-left transition-all active:scale-[0.98]"
                    >
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-400" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-800">{vaccineName(v.id)}</span>
                        <p className="truncate text-xs text-gray-400">
                          {t("preventsLabel")}: {vaccineDiseases(v.id).join(", ")}
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${badge.bg} ${badge.text}`}>
                        {importanceLabel(v.importanceLevel)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

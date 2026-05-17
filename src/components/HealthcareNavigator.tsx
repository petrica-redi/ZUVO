"use client";

import { useState } from "react";
import {
  Navigation, ArrowRight, ArrowLeft, Loader2, FileText,
  MapPin, Shield, Phone, CheckCircle2, CreditCard, HelpCircle,
  Stethoscope, Baby, Brain, Heart, Thermometer, Eye,
} from "lucide-react";
import { useTranslations } from "next-intl";

type VisitCard = {
  patientSummary: string;
  keySymptoms: string[];
  duration: string;
  severity: string;
  questionsToAsk: string[];
  whatToBring: string[];
  patientRights: string[];
};

type IssueId =
  | "fever"
  | "pain"
  | "pregnancy"
  | "chronic"
  | "mental"
  | "skin"
  | "child"
  | "other";

const ISSUE_TYPES: Array<{ id: IssueId; icon: typeof Thermometer; color: string }> = [
  { id: "fever", icon: Thermometer, color: "#EF4444" },
  { id: "pain", icon: Heart, color: "#F97316" },
  { id: "pregnancy", icon: Baby, color: "#EC4899" },
  { id: "chronic", icon: Stethoscope, color: "#8B5CF6" },
  { id: "mental", icon: Brain, color: "#06B6D4" },
  { id: "skin", icon: Eye, color: "#10B981" },
  { id: "child", icon: Baby, color: "#F59E0B" },
  { id: "other", icon: HelpCircle, color: "#64748B" },
];

// Country list (codes only — English names rendered as fallback if no localized
// name is defined; can be extended to a per-locale dictionary later).
const COUNTRIES = [
  { code: "al", name: "Albania" },
  { code: "ro", name: "Romania" },
  { code: "bg", name: "Bulgaria" },
  { code: "hu", name: "Hungary" },
  { code: "sk", name: "Slovakia" },
  { code: "rs", name: "Serbia" },
  { code: "mk", name: "North Macedonia" },
  { code: "cz", name: "Czech Republic" },
  { code: "hr", name: "Croatia" },
  { code: "ba", name: "Bosnia" },
  { code: "xk", name: "Kosovo" },
  { code: "si", name: "Slovenia" },
  { code: "gr", name: "Greece" },
  { code: "tr", name: "Turkey" },
];

export function HealthcareNavigator({ locale }: { locale: string }) {
  const t = useTranslations("navigate");
  const tCommon = useTranslations("common");
  const tEmergency = useTranslations("emergency");
  const [step, setStep] = useState(1);
  const [issueType, setIssueType] = useState("");
  const [issueDetail, setIssueDetail] = useState("");
  const [hasInsurance, setHasInsurance] = useState<"yes" | "no" | "unknown">("unknown");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [visitCard, setVisitCard] = useState<VisitCard | null>(null);

  const generateCard = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/visit-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concern: `${issueType}: ${issueDetail}`,
          country: COUNTRIES.find((c) => c.code === country)?.name,
          locale,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setVisitCard(data.data);
        setStep(5);
      }
    } catch {
      /* retry */
    } finally {
      setLoading(false);
    }
  };

  // Step 1: What's the issue?
  if (step === 1) {
    return (
      <div>
        <div className="mb-6 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/25">
            <Navigation className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">{t("heroTitle")}</h1>
          <p className="mt-2 text-sm text-gray-500">{t("heroSubtitle")}</p>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          {t("issuePrompt")}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {ISSUE_TYPES.map((issue, i) => {
            const label = t(`issues.${issue.id}`);
            return (
              <button
                key={issue.id}
                onClick={() => { setIssueType(label); setStep(2); }}
                className={`card-hover flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm animate-fade-in-up delay-${(i + 1) * 100}`}
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm" style={{ backgroundColor: issue.color + "15" }}>
                  <issue.icon className="h-6 w-6" style={{ color: issue.color }} />
                </div>
                <span className="text-sm font-bold text-gray-700">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Step 2: Details
  if (step === 2) {
    return (
      <div>
        <button onClick={() => setStep(1)} className="mb-4 flex items-center gap-1 text-sm text-gray-500">
          <ArrowLeft className="h-4 w-4" /> {tCommon("back")}
        </button>

        <div className="mb-4 rounded-xl bg-cyan-50 p-3 text-center">
          <span className="text-sm font-semibold text-cyan-800">{issueType}</span>
        </div>

        <p className="mb-2 text-sm font-semibold text-gray-900">{t("tellMore")}</p>
        <textarea
          value={issueDetail}
          onChange={(e) => setIssueDetail(e.target.value)}
          placeholder={t("detailPlaceholder")}
          aria-label={t("detailAria")}
          rows={4}
          className="mb-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        />

        <button
          onClick={() => setStep(3)}
          disabled={!issueDetail.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-sm font-semibold text-white shadow-md active:scale-[0.98] disabled:opacity-50"
        >
          {tCommon("continue")} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Step 3: Insurance
  if (step === 3) {
    return (
      <div>
        <button onClick={() => setStep(2)} className="mb-4 flex items-center gap-1 text-sm text-gray-500">
          <ArrowLeft className="h-4 w-4" /> {tCommon("back")}
        </button>

        <div className="mb-6 text-center">
          <CreditCard className="mx-auto mb-2 h-8 w-8 text-cyan-500" />
          <h2 className="text-base font-bold text-gray-900">{t("insuranceTitle")}</h2>
          <p className="mt-1 text-xs text-gray-500">{t("insuranceSubtitle")}</p>
        </div>

        <div className="space-y-2">
          {([
            { value: "yes" as const, label: t("insuranceYes"), emoji: "✅" },
            { value: "no" as const, label: t("insuranceNo"), emoji: "❌" },
            { value: "unknown" as const, label: t("insuranceUnknown"), emoji: "🤷" },
          ]).map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setHasInsurance(opt.value); setStep(4); }}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all active:scale-[0.98] ${
                hasInsurance === opt.value ? "border-cyan-500 bg-cyan-50" : "border-gray-100 bg-white"
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-sm font-semibold text-gray-700">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 4: Country
  if (step === 4) {
    return (
      <div>
        <button onClick={() => setStep(3)} className="mb-4 flex items-center gap-1 text-sm text-gray-500">
          <ArrowLeft className="h-4 w-4" /> {tCommon("back")}
        </button>

        <div className="mb-4 text-center">
          <MapPin className="mx-auto mb-2 h-8 w-8 text-cyan-500" />
          <h2 className="text-base font-bold text-gray-900">{t("countryTitle")}</h2>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              onClick={() => setCountry(c.code)}
              className={`rounded-xl border p-3 text-left text-sm font-medium transition-all active:scale-[0.98] ${
                country === c.code ? "border-cyan-500 bg-cyan-50 text-cyan-700" : "border-gray-100 bg-white text-gray-700"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <button
          onClick={generateCard}
          disabled={!country || loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> {t("generating")}</>
          ) : (
            <><FileText className="h-4 w-4" /> {t("generateCard")}</>
          )}
        </button>
      </div>
    );
  }

  // Step 5: Visit card result
  if (step === 5 && visitCard) {
    return (
      <div className="space-y-4">
        <button onClick={() => { setStep(1); setVisitCard(null); setIssueDetail(""); }} className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowLeft className="h-4 w-4" /> {t("startOver")}
        </button>

        {/* Doctor summary card */}
        <div className="rounded-2xl border-2 border-cyan-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Stethoscope className="h-5 w-5 text-cyan-500" />
            <span className="text-sm font-bold text-gray-900">{t("showDoctor")}</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-700">{visitCard.patientSummary}</p>
          {visitCard.keySymptoms.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {visitCard.keySymptoms.map((s, i) => (
                <span key={i} className="rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-medium text-cyan-700">{s}</span>
              ))}
            </div>
          )}
          <p className="mt-2 text-[10px] text-gray-400">{t("generatedBy")}</p>
        </div>

        {/* What to bring */}
        {visitCard.whatToBring.length > 0 && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-800">
              <CheckCircle2 className="h-4 w-4" /> {t("whatToBring")}
            </h3>
            <ul className="space-y-1">
              {visitCard.whatToBring.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Questions to ask */}
        {visitCard.questionsToAsk.length > 0 && (
          <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-purple-800">
              <HelpCircle className="h-4 w-4" /> {t("askYourDoctor")}
            </h3>
            <ul className="space-y-1.5">
              {visitCard.questionsToAsk.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-purple-700">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-[10px] font-bold text-purple-800">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Your rights */}
        {visitCard.patientRights.length > 0 && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-800">
              <Shield className="h-4 w-4" /> {t("patientRights")}
            </h3>
            <ul className="space-y-1.5">
              {visitCard.patientRights.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Find nearest hospital */}
        <a
          href="https://www.google.com/maps/search/hospital+near+me"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all active:bg-gray-50"
        >
          <MapPin className="h-5 w-5 text-cyan-500" />
          <div>
            <span className="text-sm font-semibold text-gray-800">{t("findHospital")}</span>
            <p className="text-xs text-gray-400">{t("mapHint")}</p>
          </div>
        </a>

        {/* Emergency */}
        <a
          href="tel:112"
          className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white shadow-lg"
        >
          <Phone className="h-4 w-4" /> {tEmergency("banner")}
        </a>
      </div>
    );
  }

  return null;
}

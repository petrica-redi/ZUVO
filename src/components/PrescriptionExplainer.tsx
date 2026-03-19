"use client";

import { useState } from "react";
import {
  FileText, Search, Loader2, Heart, AlertTriangle, Pill,
  HelpCircle, Lightbulb, Siren, ChevronDown, ChevronUp,
} from "lucide-react";

type Medication = {
  name: string;
  whatItDoes: string;
  howToTake: string;
  sideEffects: string;
  neverDo: string;
};

type ExplainResult = {
  diagnosis: {
    name: string;
    simpleExplanation: string;
    whyItMatters: string;
    whatHappensIfIgnored: string;
  };
  medications: Medication[];
  questionsForDoctor: string[];
  dailyTips: string[];
  emergencySigns: string[];
};

const EXAMPLES = [
  "Hipertensiune arteriala",
  "Diabet tip 2",
  "Anemie",
  "Astm bronsic",
  "Metformin 500mg",
  "Enalapril 10mg",
];

export function PrescriptionExplainer({ locale }: { locale: string }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [expandedMed, setExpandedMed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = async (text?: string) => {
    const query = text ?? input.trim();
    if (!query || loading) return;
    if (text) setInput(text);

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: query, locale }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError("Could not analyze. Please try again.");
      }
    } catch {
      setError("Connection error. Please check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <FileText className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">
          Understand Your Prescription
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Type your diagnosis or medication name. We explain it in simple words.
        </p>
      </div>

      {/* Input */}
      <div className="mb-4 rounded-2xl border-2 border-gray-200 bg-white p-1 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(null); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleExplain(); } }}
          placeholder={"Type your diagnosis, medication name, or paste your prescription...\n\nExample: \"Hipertensiune\" or \"Metformin 500mg\""}
          rows={3}
          className="w-full resize-none rounded-xl border-none bg-transparent px-4 py-3 text-sm focus:outline-none"
        />
        <div className="flex items-center justify-end px-3 pb-2">
          <button
            onClick={() => handleExplain()}
            disabled={!input.trim() || loading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
            ) : (
              <><Search className="h-4 w-4" /> Explain this</>
            )}
          </button>
        </div>
      </div>

      {/* Quick examples */}
      {!result && !loading && (
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Common examples
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => handleExplain(ex)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 active:scale-95"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-500" />
          <p className="text-sm text-gray-500">Reading your prescription...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Diagnosis card */}
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
              <Heart className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">
                {result.diagnosis.name}
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                  What this means
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {result.diagnosis.simpleExplanation}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-600">
                  Why it matters
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {result.diagnosis.whyItMatters}
                </p>
              </div>
              <div className="rounded-xl bg-red-50 p-3">
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-red-600">
                  <AlertTriangle className="h-3 w-3" /> If you ignore it
                </p>
                <p className="text-sm leading-relaxed text-red-700">
                  {result.diagnosis.whatHappensIfIgnored}
                </p>
              </div>
            </div>
          </div>

          {/* Medications */}
          {result.medications.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
                <Pill className="h-4 w-4 text-indigo-500" /> Your Medications
              </h3>
              <div className="space-y-2">
                {result.medications.map((med, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <button
                      onClick={() => setExpandedMed(expandedMed === i ? null : i)}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <div>
                        <span className="text-sm font-semibold text-gray-900">{med.name}</span>
                        <p className="mt-0.5 text-xs text-gray-500">{med.whatItDoes}</p>
                      </div>
                      {expandedMed === i ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    {expandedMed === i && (
                      <div className="space-y-2 border-t border-gray-50 px-4 pb-4 pt-2">
                        <div className="rounded-lg bg-green-50 p-2">
                          <p className="text-xs font-semibold text-green-700">How to take</p>
                          <p className="text-xs text-green-600">{med.howToTake}</p>
                        </div>
                        <div className="rounded-lg bg-amber-50 p-2">
                          <p className="text-xs font-semibold text-amber-700">Side effects</p>
                          <p className="text-xs text-amber-600">{med.sideEffects}</p>
                        </div>
                        <div className="rounded-lg bg-red-50 p-2">
                          <p className="text-xs font-semibold text-red-700">Never do this</p>
                          <p className="text-xs text-red-600">{med.neverDo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions for doctor */}
          {result.questionsForDoctor.length > 0 && (
            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-purple-800">
                <HelpCircle className="h-4 w-4" /> Ask your doctor next time
              </h3>
              <ul className="space-y-1.5">
                {result.questionsForDoctor.map((q, i) => (
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

          {/* Daily tips */}
          {result.dailyTips.length > 0 && (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-green-800">
                <Lightbulb className="h-4 w-4" /> What you can do today
              </h3>
              <ul className="space-y-1.5">
                {result.dailyTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Emergency signs */}
          {result.emergencySigns.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-800">
                <Siren className="h-4 w-4" /> Go to hospital if
              </h3>
              <ul className="space-y-1.5">
                {result.emergencySigns.map((sign, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Try another */}
          <button
            onClick={() => { setResult(null); setInput(""); }}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 shadow-sm transition-all active:scale-[0.98]"
          >
            Explain another prescription
          </button>
        </div>
      )}
    </div>
  );
}

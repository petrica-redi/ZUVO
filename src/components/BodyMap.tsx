"use client";

import { useState } from "react";
import {
  ArrowLeft, Loader2, CheckCircle2, Clock, Siren,
  AlertTriangle, Shield, Lightbulb, Send,
} from "lucide-react";

type BodyRegion = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  commonSymptoms: string[];
};

const BODY_REGIONS: BodyRegion[] = [
  { id: "head", label: "Head", x: 135, y: 10, width: 50, height: 55, commonSymptoms: ["Headache", "Dizziness", "Blurry vision", "Ear pain", "Sore throat"] },
  { id: "chest", label: "Chest", x: 115, y: 90, width: 90, height: 70, commonSymptoms: ["Chest pain", "Difficulty breathing", "Cough", "Heart racing", "Tightness"] },
  { id: "abdomen", label: "Stomach", x: 120, y: 165, width: 80, height: 60, commonSymptoms: ["Stomach pain", "Nausea/vomiting", "Diarrhea", "Bloating", "No appetite"] },
  { id: "left-arm", label: "Left Arm", x: 70, y: 100, width: 40, height: 100, commonSymptoms: ["Pain", "Numbness", "Swelling", "Can't move it", "Tingling"] },
  { id: "right-arm", label: "Right Arm", x: 210, y: 100, width: 40, height: 100, commonSymptoms: ["Pain", "Numbness", "Swelling", "Can't move it", "Tingling"] },
  { id: "pelvis", label: "Lower body", x: 120, y: 225, width: 80, height: 40, commonSymptoms: ["Pain when urinating", "Lower back pain", "Menstrual problems", "Groin pain"] },
  { id: "left-leg", label: "Left Leg", x: 115, y: 270, width: 45, height: 120, commonSymptoms: ["Leg pain", "Swelling", "Can't walk", "Knee pain", "Numbness"] },
  { id: "right-leg", label: "Right Leg", x: 160, y: 270, width: 45, height: 120, commonSymptoms: ["Leg pain", "Swelling", "Can't walk", "Knee pain", "Numbness"] },
];

type TriageResult = {
  severity: "green" | "amber" | "red";
  title: string;
  assessment: string;
  immediateAction: string;
  homeCare: string[];
  warningSignsToEscalate: string[];
  commonCauses: string[];
  preventionTips: string[];
};

const SEVERITY_CONFIG = {
  green: { icon: CheckCircle2, label: "Manage at home", gradient: "from-green-500 to-emerald-600", bg: "bg-green-50", border: "border-green-200", text: "text-green-800" },
  amber: { icon: Clock, label: "See a doctor soon", gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800" },
  red: { icon: Siren, label: "Emergency — Go NOW", gradient: "from-red-600 to-red-800", bg: "bg-red-50", border: "border-red-200", text: "text-red-800" },
};

export function BodyMap({ locale }: { locale: string }) {
  const [stage, setStage] = useState<"map" | "symptoms" | "result">("map");
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const selectRegion = (region: BodyRegion) => {
    setSelectedRegion(region);
    setSelectedSymptoms([]);
    setStage("symptoms");
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const checkSymptoms = async () => {
    if (!selectedRegion || selectedSymptoms.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/symptom-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bodyArea: selectedRegion.label,
          symptoms: [...selectedSymptoms, extraInfo].filter(Boolean).join(", "),
          locale,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        setStage("result");
      }
    } catch {
      /* retry */
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStage("map");
    setSelectedRegion(null);
    setSelectedSymptoms([]);
    setExtraInfo("");
    setResult(null);
  };

  // Body map view
  if (stage === "map") {
    return (
      <div>
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-gray-900">Where does it hurt?</h1>
          <p className="mt-1 text-sm text-gray-500">Tap the area on the body that is bothering you</p>
        </div>

        <div className="relative mx-auto" style={{ width: 320, height: 420 }}>
          {/* Body SVG */}
          <svg viewBox="0 0 320 420" className="h-full w-full">
            {/* Body outline */}
            <ellipse cx="160" cy="40" rx="28" ry="32" fill="#FDE8D0" stroke="#D4A574" strokeWidth="1.5" />
            <rect x="130" y="68" width="60" height="20" rx="8" fill="#FDE8D0" stroke="#D4A574" strokeWidth="1" />
            <path d="M120 88 Q120 75 110 90 L80 180 Q75 195 90 195 L120 195 Z" fill="#FDE8D0" stroke="#D4A574" strokeWidth="1.5" />
            <path d="M200 88 Q200 75 210 90 L240 180 Q245 195 230 195 L200 195 Z" fill="#FDE8D0" stroke="#D4A574" strokeWidth="1.5" />
            <path d="M120 88 L120 260 Q120 275 135 275 L155 275 L155 395 Q155 405 145 405 L140 405 Q130 405 130 395 L130 275" fill="#FDE8D0" stroke="#D4A574" strokeWidth="1.5" />
            <path d="M200 88 L200 260 Q200 275 185 275 L165 275 L165 395 Q165 405 175 405 L180 405 Q190 405 190 395 L190 275" fill="#FDE8D0" stroke="#D4A574" strokeWidth="1.5" />

            {/* Tap zones */}
            {BODY_REGIONS.map((region) => (
              <rect
                key={region.id}
                x={region.x}
                y={region.y}
                width={region.width}
                height={region.height}
                rx="8"
                fill={hoveredRegion === region.id ? "rgba(192, 57, 43, 0.25)" : "rgba(192, 57, 43, 0.08)"}
                stroke={hoveredRegion === region.id ? "#C0392B" : "transparent"}
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => selectRegion(region)}
              />
            ))}

            {/* Labels */}
            {BODY_REGIONS.map((region) => (
              <text
                key={`label-${region.id}`}
                x={region.x + region.width / 2}
                y={region.y + region.height / 2 + 4}
                textAnchor="middle"
                className="pointer-events-none select-none text-[10px] font-semibold"
                fill={hoveredRegion === region.id ? "#C0392B" : "#8B7355"}
              >
                {region.label}
              </text>
            ))}
          </svg>
        </div>
      </div>
    );
  }

  // Symptom selection
  if (stage === "symptoms" && selectedRegion) {
    return (
      <div>
        <button onClick={reset} className="mb-4 flex items-center gap-1 text-sm text-gray-500">
          <ArrowLeft className="h-4 w-4" /> Back to body map
        </button>

        <div className="mb-4 rounded-2xl border border-[#C0392B]/20 bg-red-50 p-4 text-center">
          <h2 className="text-base font-bold text-gray-900">{selectedRegion.label}</h2>
          <p className="text-sm text-gray-500">Select all symptoms that apply</p>
        </div>

        <div className="mb-4 space-y-2">
          {selectedRegion.commonSymptoms.map((s) => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all active:scale-[0.98] ${
                selectedSymptoms.includes(s)
                  ? "border-[#C0392B] bg-red-50 font-semibold text-[#C0392B]"
                  : "border-gray-100 bg-white text-gray-700"
              }`}
            >
              <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                selectedSymptoms.includes(s) ? "border-[#C0392B] bg-[#C0392B]" : "border-gray-300"
              }`}>
                {selectedSymptoms.includes(s) && (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                )}
              </div>
              {s}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <input
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            placeholder="Anything else? (how long, how bad...)"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-[#C0392B] focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
          />
        </div>

        <button
          onClick={checkSymptoms}
          disabled={selectedSymptoms.length === 0 || loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C0392B] to-[#E74C3C] py-3.5 text-sm font-semibold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Checking...</>
          ) : (
            <><Send className="h-4 w-4" /> Check symptoms</>
          )}
        </button>
      </div>
    );
  }

  // Result view
  if (stage === "result" && result) {
    const config = SEVERITY_CONFIG[result.severity];
    const SeverityIcon = config.icon;

    return (
      <div className="space-y-4">
        <button onClick={reset} className="flex items-center gap-1 text-sm text-gray-500">
          <ArrowLeft className="h-4 w-4" /> Check another area
        </button>

        <div className={`overflow-hidden rounded-2xl border ${config.border} shadow-sm`}>
          <div className={`flex items-center gap-3 bg-gradient-to-r ${config.gradient} px-4 py-4`}>
            <SeverityIcon className="h-6 w-6 text-white" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white/80">{config.label}</span>
              <h2 className="text-base font-bold text-white">{result.title}</h2>
            </div>
          </div>

          <div className={`space-y-3 p-4 ${config.bg}`}>
            {result.severity === "red" && (
              <a href="tel:112" className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-4 text-lg font-bold text-white shadow-lg">
                <Siren className="h-6 w-6" /> Call 112 NOW
              </a>
            )}

            <p className="text-sm leading-relaxed text-gray-700">{result.assessment}</p>

            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">What to do now</p>
              <p className="text-sm leading-relaxed text-gray-700">{result.immediateAction}</p>
            </div>
          </div>
        </div>

        {result.homeCare.length > 0 && (
          <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-green-800">
              <Lightbulb className="h-4 w-4" /> Home care
            </h3>
            <ul className="space-y-1.5">
              {result.homeCare.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.warningSignsToEscalate.length > 0 && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-800">
              <AlertTriangle className="h-4 w-4" /> Go to hospital if
            </h3>
            <ul className="space-y-1.5">
              {result.warningSignsToEscalate.map((sign, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.commonCauses.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-800">
              <Shield className="h-4 w-4 text-blue-500" /> Common causes
            </h3>
            <ul className="space-y-1">
              {result.commonCauses.map((cause, i) => (
                <li key={i} className="text-sm text-gray-600">• {cause}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
}

"use client";

import { useState } from "react";
import {
  ArrowLeft, Loader2, CheckCircle2, Clock, Siren,
  AlertTriangle, Shield, Lightbulb, Send, Activity,
} from "lucide-react";

type BodyRegion = {
  id: string;
  label: string;
  emoji: string;
  x: number;
  y: number;
  width: number;
  height: number;
  commonSymptoms: string[];
};

const BODY_REGIONS: BodyRegion[] = [
  { id: "head", label: "Head", emoji: "🧠", x: 135, y: 10, width: 50, height: 55, commonSymptoms: ["Headache", "Dizziness", "Blurry vision", "Ear pain", "Sore throat"] },
  { id: "chest", label: "Chest", emoji: "🫁", x: 115, y: 90, width: 90, height: 70, commonSymptoms: ["Chest pain", "Difficulty breathing", "Cough", "Heart racing", "Tightness"] },
  { id: "abdomen", label: "Stomach", emoji: "🤢", x: 120, y: 165, width: 80, height: 60, commonSymptoms: ["Stomach pain", "Nausea/vomiting", "Diarrhea", "Bloating", "No appetite"] },
  { id: "left-arm", label: "Left Arm", emoji: "💪", x: 70, y: 100, width: 40, height: 100, commonSymptoms: ["Pain", "Numbness", "Swelling", "Can't move it", "Tingling"] },
  { id: "right-arm", label: "Right Arm", emoji: "💪", x: 210, y: 100, width: 40, height: 100, commonSymptoms: ["Pain", "Numbness", "Swelling", "Can't move it", "Tingling"] },
  { id: "pelvis", label: "Lower body", emoji: "🩻", x: 120, y: 225, width: 80, height: 40, commonSymptoms: ["Pain when urinating", "Lower back pain", "Menstrual problems", "Groin pain"] },
  { id: "left-leg", label: "Left Leg", emoji: "🦵", x: 115, y: 270, width: 45, height: 120, commonSymptoms: ["Leg pain", "Swelling", "Can't walk", "Knee pain", "Numbness"] },
  { id: "right-leg", label: "Right Leg", emoji: "🦵", x: 160, y: 270, width: 45, height: 120, commonSymptoms: ["Leg pain", "Swelling", "Can't walk", "Knee pain", "Numbness"] },
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

  if (stage === "map") {
    return (
      <div>
        <div className="mb-6 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 shadow-xl shadow-red-500/25">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Where does it hurt?</h1>
          <p className="mt-2 text-sm text-gray-500">Tap the area on the body that is bothering you</p>
        </div>

        {/* Body SVG */}
        <div className="relative mx-auto animate-fade-in-up delay-200" style={{ width: 320, height: 420 }}>
          <svg viewBox="0 0 320 420" className="h-full w-full drop-shadow-sm">
            <defs>
              <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FDEBD0" />
                <stop offset="100%" stopColor="#F5CBA7" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <ellipse cx="160" cy="40" rx="28" ry="32" fill="url(#skinGrad)" stroke="#D4A574" strokeWidth="1.5" />
            <rect x="130" y="68" width="60" height="20" rx="8" fill="url(#skinGrad)" stroke="#D4A574" strokeWidth="1" />
            <path d="M120 88 Q120 75 110 90 L80 180 Q75 195 90 195 L120 195 Z" fill="url(#skinGrad)" stroke="#D4A574" strokeWidth="1.5" />
            <path d="M200 88 Q200 75 210 90 L240 180 Q245 195 230 195 L200 195 Z" fill="url(#skinGrad)" stroke="#D4A574" strokeWidth="1.5" />
            <path d="M120 88 L120 260 Q120 275 135 275 L155 275 L155 395 Q155 405 145 405 L140 405 Q130 405 130 395 L130 275" fill="url(#skinGrad)" stroke="#D4A574" strokeWidth="1.5" />
            <path d="M200 88 L200 260 Q200 275 185 275 L165 275 L165 395 Q165 405 175 405 L180 405 Q190 405 190 395 L190 275" fill="url(#skinGrad)" stroke="#D4A574" strokeWidth="1.5" />

            {BODY_REGIONS.map((region) => {
              const isHovered = hoveredRegion === region.id;
              return (
                <g key={region.id}>
                  {isHovered && (
                    <rect
                      x={region.x - 3}
                      y={region.y - 3}
                      width={region.width + 6}
                      height={region.height + 6}
                      rx="12"
                      fill="rgba(192, 57, 43, 0.15)"
                      filter="url(#glow)"
                    />
                  )}
                  <rect
                    x={region.x}
                    y={region.y}
                    width={region.width}
                    height={region.height}
                    rx="10"
                    fill={isHovered ? "rgba(192, 57, 43, 0.3)" : "rgba(192, 57, 43, 0.08)"}
                    stroke={isHovered ? "#C0392B" : "rgba(192, 57, 43, 0.2)"}
                    strokeWidth={isHovered ? "2.5" : "1"}
                    strokeDasharray={isHovered ? "0" : "4 2"}
                    className="cursor-pointer"
                    style={{ transition: "all 0.2s ease" }}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => selectRegion(region)}
                  />
                  <text
                    x={region.x + region.width / 2}
                    y={region.y + region.height / 2 + 4}
                    textAnchor="middle"
                    className="pointer-events-none select-none"
                    fill={isHovered ? "#C0392B" : "#8B7355"}
                    fontSize="10"
                    fontWeight={isHovered ? "700" : "600"}
                  >
                    {region.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Quick region buttons below */}
        <div className="mt-4 grid grid-cols-4 gap-2 animate-fade-in-up delay-300">
          {BODY_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => selectRegion(region)}
              className="card-hover flex flex-col items-center gap-1 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
            >
              <span className="text-xl">{region.emoji}</span>
              <span className="text-[10px] font-bold text-gray-600">{region.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === "symptoms" && selectedRegion) {
    return (
      <div className="animate-fade-in">
        <button onClick={reset} className="mb-4 flex items-center gap-1 text-sm font-semibold text-gray-500">
          <ArrowLeft className="h-4 w-4" /> Back to body map
        </button>

        <div className="mb-5 rounded-3xl border-2 border-[#C0392B]/20 bg-gradient-to-br from-red-50 to-white p-5 text-center shadow-sm">
          <span className="mb-2 block text-3xl">{selectedRegion.emoji}</span>
          <h2 className="text-lg font-black text-gray-900">{selectedRegion.label}</h2>
          <p className="text-sm text-gray-500">Select all symptoms that apply</p>
        </div>

        <div className="mb-4 space-y-2">
          {selectedRegion.commonSymptoms.map((s, i) => (
            <button
              key={s}
              onClick={() => toggleSymptom(s)}
              className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all active:scale-[0.98] animate-fade-in-up delay-${(i + 1) * 100} ${
                selectedSymptoms.includes(s)
                  ? "border-[#C0392B] bg-red-50 shadow-md"
                  : "border-gray-100 bg-white shadow-sm"
              }`}
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
                selectedSymptoms.includes(s) ? "border-[#C0392B] bg-[#C0392B]" : "border-gray-300"
              }`}>
                {selectedSymptoms.includes(s) && (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                )}
              </div>
              <span className={`text-sm ${selectedSymptoms.includes(s) ? "font-bold text-[#C0392B]" : "font-medium text-gray-700"}`}>
                {s}
              </span>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <input
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
            placeholder="Anything else? (how long, how bad...)"
            className="w-full rounded-2xl border-2 border-gray-100 bg-white px-5 py-4 text-sm shadow-sm focus:border-[#C0392B] focus:outline-none focus:ring-2 focus:ring-[#C0392B]/20"
          />
        </div>

        <button
          onClick={checkSymptoms}
          disabled={selectedSymptoms.length === 0 || loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-base font-bold text-white shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 50%, #F39C12 100%)" }}
        >
          {loading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing symptoms...</>
          ) : (
            <><Send className="h-5 w-5" /> Check symptoms</>
          )}
        </button>
      </div>
    );
  }

  if (stage === "result" && result) {
    const config = SEVERITY_CONFIG[result.severity];
    const SeverityIcon = config.icon;

    return (
      <div className="space-y-4 animate-fade-in-up">
        <button onClick={reset} className="flex items-center gap-1 text-sm font-semibold text-gray-500">
          <ArrowLeft className="h-4 w-4" /> Check another area
        </button>

        <div className={`overflow-hidden rounded-3xl border-2 ${config.border} shadow-lg`}>
          <div className={`flex items-center gap-4 bg-gradient-to-r ${config.gradient} px-5 py-5`}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <SeverityIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-white/80">{config.label}</span>
              <h2 className="text-lg font-black text-white">{result.title}</h2>
            </div>
          </div>

          <div className={`space-y-4 p-5 ${config.bg}`}>
            {result.severity === "red" && (
              <a href="tel:112" className="flex items-center justify-center gap-3 rounded-2xl bg-red-600 py-5 text-xl font-black text-white shadow-xl animate-pulse-glow">
                <Siren className="h-7 w-7" /> Call 112 NOW
              </a>
            )}

            <p className="text-sm leading-relaxed text-gray-700">{result.assessment}</p>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="mb-1 text-xs font-black uppercase tracking-wider text-emerald-600">What to do now</p>
              <p className="text-sm leading-relaxed text-gray-700">{result.immediateAction}</p>
            </div>
          </div>
        </div>

        {result.homeCare.length > 0 && (
          <div className="rounded-3xl border-2 border-green-100 bg-green-50 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-green-800">
              <Lightbulb className="h-5 w-5" /> Home care
            </h3>
            <ul className="space-y-2">
              {result.homeCare.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.warningSignsToEscalate.length > 0 && (
          <div className="rounded-3xl border-2 border-red-100 bg-red-50 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-red-800">
              <AlertTriangle className="h-5 w-5" /> Go to hospital if
            </h3>
            <ul className="space-y-2">
              {result.warningSignsToEscalate.map((sign, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                  {sign}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.commonCauses.length > 0 && (
          <div className="rounded-3xl border-2 border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-black text-gray-800">
              <Shield className="h-5 w-5 text-blue-500" /> Common causes
            </h3>
            <ul className="space-y-1.5">
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

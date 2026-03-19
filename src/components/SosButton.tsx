"use client";

import { useState } from "react";
import { Phone, X, Heart, Shield, Flame, Pill, MapPin } from "lucide-react";

const EMERGENCY_NUMBERS: Record<string, { ambulance: string; police: string; fire: string; domestic: string; poison: string }> = {
  albania:   { ambulance: "127", police: "129", fire: "128", domestic: "116 117", poison: "127" },
  romania:   { ambulance: "112", police: "112", fire: "112", domestic: "0800 500 333", poison: "021 318 3606" },
  bulgaria:  { ambulance: "150", police: "166", fire: "160", domestic: "02 981 7686", poison: "112" },
  hungary:   { ambulance: "104", police: "107", fire: "105", domestic: "06 80 505 101", poison: "06 80 201 199" },
  slovakia:  { ambulance: "155", police: "158", fire: "150", domestic: "0800 212 212", poison: "02 5477 4166" },
  serbia:    { ambulance: "194", police: "192", fire: "193", domestic: "0800 100 007", poison: "112" },
  default:   { ambulance: "112", police: "112", fire: "112", domestic: "112", poison: "112" },
};

const FIRST_AID = [
  { id: "bleeding", emoji: "🩸", label: "Bleeding", steps: "Press HARD with clean cloth. Do NOT lift. Add more cloth on top. Call 112." },
  { id: "choking", emoji: "😮", label: "Choking", steps: "5 back blows between shoulder blades. 5 abdominal thrusts. Repeat. Call 112." },
  { id: "burns", emoji: "🔥", label: "Burns", steps: "Cool water 10+ min. No butter/oil/toothpaste. Cover loosely. Call 112 if large." },
  { id: "cpr", emoji: "💓", label: "Not breathing", steps: "Call 112. Push hard & fast center of chest. 100/min. Don't stop until help arrives." },
  { id: "seizure", emoji: "⚡", label: "Seizure", steps: "Clear area. Do NOT hold them down. Do NOT put anything in mouth. Time it. Call 112 if >5min." },
  { id: "poison", emoji: "☠️", label: "Poisoning", steps: "Call poison center. Do NOT make them vomit. Save the container/label. Call 112." },
];

export function SosButton() {
  const [open, setOpen] = useState(false);
  const [showFirstAid, setShowFirstAid] = useState<string | null>(null);

  const numbers = EMERGENCY_NUMBERS.default; // TODO: detect from locale/GPS

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 top-16 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg animate-pulse"
        style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}
        aria-label="Emergency SOS"
      >
        <Phone className="h-5 w-5 text-white" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white">
      {/* Close */}
      <div className="flex items-center justify-between p-4">
        <span className="text-lg font-bold">🆘 Emergency</span>
        <button onClick={() => { setOpen(false); setShowFirstAid(null); }} className="rounded-full bg-white/10 p-2">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {/* Primary: Call 112 */}
        <a
          href="tel:112"
          className="mb-6 flex items-center justify-center gap-3 rounded-2xl p-6 text-xl font-bold shadow-lg"
          style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}
        >
          <Phone className="h-7 w-7" />
          Call 112 — European Emergency
        </a>

        {/* Country numbers */}
        <div className="mb-6 grid grid-cols-2 gap-2">
          <a href={`tel:${numbers.ambulance}`} className="flex items-center gap-2 rounded-xl bg-white/10 p-3 active:bg-white/20">
            <Heart className="h-5 w-5 text-red-400" />
            <div>
              <div className="text-xs text-gray-400">Ambulance</div>
              <div className="text-lg font-bold">{numbers.ambulance}</div>
            </div>
          </a>
          <a href={`tel:${numbers.police}`} className="flex items-center gap-2 rounded-xl bg-white/10 p-3 active:bg-white/20">
            <Shield className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-xs text-gray-400">Police</div>
              <div className="text-lg font-bold">{numbers.police}</div>
            </div>
          </a>
          <a href={`tel:${numbers.domestic}`} className="flex items-center gap-2 rounded-xl bg-white/10 p-3 active:bg-white/20">
            <Phone className="h-5 w-5 text-purple-400" />
            <div>
              <div className="text-xs text-gray-400">Domestic violence</div>
              <div className="text-sm font-bold">{numbers.domestic}</div>
            </div>
          </a>
          <a href={`tel:${numbers.poison}`} className="flex items-center gap-2 rounded-xl bg-white/10 p-3 active:bg-white/20">
            <Pill className="h-5 w-5 text-green-400" />
            <div>
              <div className="text-xs text-gray-400">Poison center</div>
              <div className="text-sm font-bold">{numbers.poison}</div>
            </div>
          </a>
        </div>

        {/* Nearest hospital */}
        <a
          href="https://www.google.com/maps/search/hospital+near+me"
          target="_blank"
          rel="noopener"
          className="mb-6 flex items-center gap-3 rounded-xl bg-white/10 p-4 active:bg-white/20"
        >
          <MapPin className="h-5 w-5 text-amber-400" />
          <div>
            <div className="font-semibold">Find nearest hospital</div>
            <div className="text-xs text-gray-400">Opens map with directions</div>
          </div>
        </a>

        {/* First aid cards */}
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">First Aid</h3>
        <div className="grid grid-cols-3 gap-2">
          {FIRST_AID.map((fa) => (
            <button
              key={fa.id}
              onClick={() => setShowFirstAid(showFirstAid === fa.id ? null : fa.id)}
              className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
                showFirstAid === fa.id ? "bg-red-900/50 ring-1 ring-red-500" : "bg-white/10"
              }`}
            >
              <span className="text-2xl">{fa.emoji}</span>
              <span className="text-[10px] font-medium">{fa.label}</span>
            </button>
          ))}
        </div>

        {/* First aid detail */}
        {showFirstAid && (
          <div className="mt-3 rounded-xl bg-red-900/30 p-4 ring-1 ring-red-800">
            <p className="text-sm font-semibold leading-relaxed">
              {FIRST_AID.find((f) => f.id === showFirstAid)?.steps}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

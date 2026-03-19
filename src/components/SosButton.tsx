"use client";

import { useState } from "react";
import { Phone, X, Heart, Shield, Flame, Pill, MapPin, AlertTriangle } from "lucide-react";

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

  const numbers = EMERGENCY_NUMBERS.default;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-4 top-16 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl animate-pulse-glow"
        style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}
        aria-label="Emergency SOS — tap for emergency numbers and first aid"
      >
        <div className="flex flex-col items-center">
          <Phone className="h-5 w-5 text-white" />
          <span className="text-[8px] font-black text-white tracking-wider">SOS</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white animate-fade-in" role="dialog" aria-label="Emergency information">
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-7 w-7 text-red-400" />
          <span className="text-xl font-black tracking-tight">Emergency</span>
        </div>
        <button
          onClick={() => { setOpen(false); setShowFirstAid(null); }}
          className="rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
          aria-label="Close emergency panel"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <a
          href="tel:112"
          className="mb-6 flex items-center justify-center gap-4 rounded-3xl p-7 text-2xl font-black shadow-2xl transition-transform active:scale-95"
          style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}
        >
          <Phone className="h-8 w-8" />
          Call 112
        </a>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {[
            { icon: Heart, label: "Ambulance", number: numbers.ambulance, color: "text-red-400" },
            { icon: Shield, label: "Police", number: numbers.police, color: "text-blue-400" },
            { icon: Phone, label: "Domestic violence", number: numbers.domestic, color: "text-purple-400" },
            { icon: Pill, label: "Poison center", number: numbers.poison, color: "text-green-400" },
          ].map((item) => (
            <a
              key={item.label}
              href={`tel:${item.number.replace(/\s/g, "")}`}
              className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 transition-colors active:bg-white/20"
            >
              <item.icon className={`h-6 w-6 ${item.color}`} />
              <div>
                <div className="text-xs text-gray-400">{item.label}</div>
                <div className="text-lg font-bold">{item.number}</div>
              </div>
            </a>
          ))}
        </div>

        <a
          href="https://www.google.com/maps/search/hospital+near+me"
          target="_blank"
          rel="noopener"
          className="mb-8 flex items-center gap-4 rounded-2xl bg-white/10 p-5 transition-colors active:bg-white/20"
        >
          <MapPin className="h-6 w-6 text-amber-400" />
          <div>
            <div className="text-base font-bold">Find nearest hospital</div>
            <div className="text-sm text-gray-400">Opens map with directions</div>
          </div>
        </a>

        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">First Aid</h3>
        <div className="grid grid-cols-3 gap-3">
          {FIRST_AID.map((fa) => (
            <button
              key={fa.id}
              onClick={() => setShowFirstAid(showFirstAid === fa.id ? null : fa.id)}
              className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-all ${
                showFirstAid === fa.id ? "bg-red-900/50 ring-2 ring-red-500 scale-105" : "bg-white/10"
              }`}
            >
              <span className="text-3xl">{fa.emoji}</span>
              <span className="text-xs font-semibold">{fa.label}</span>
            </button>
          ))}
        </div>

        {showFirstAid && (
          <div className="mt-4 rounded-2xl bg-red-900/40 p-5 ring-1 ring-red-700 animate-scale-in">
            <p className="text-base font-bold leading-relaxed">
              {FIRST_AID.find((f) => f.id === showFirstAid)?.steps}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

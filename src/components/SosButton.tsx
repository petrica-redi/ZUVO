"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Phone, X, Heart, Shield, Pill, MapPin, AlertTriangle } from "lucide-react";

const EMERGENCY_NUMBERS: Record<string, { ambulance: string; police: string; fire: string; domestic: string; poison: string }> = {
  italy:     { ambulance: "118", police: "112", fire: "115", domestic: "1522", poison: "02 6610 1029" },
  albania:   { ambulance: "127", police: "129", fire: "128", domestic: "116 117", poison: "127" },
  romania:   { ambulance: "112", police: "112", fire: "112", domestic: "0800 500 333", poison: "021 318 3606" },
  bulgaria:  { ambulance: "150", police: "166", fire: "160", domestic: "02 981 7686", poison: "112" },
  hungary:   { ambulance: "104", police: "107", fire: "105", domestic: "06 80 505 101", poison: "06 80 201 199" },
  slovakia:  { ambulance: "155", police: "158", fire: "150", domestic: "0800 212 212", poison: "02 5477 4166" },
  serbia:    { ambulance: "194", police: "192", fire: "193", domestic: "0800 100 007", poison: "112" },
  default:   { ambulance: "112", police: "112", fire: "112", domestic: "112", poison: "112" },
};

const FIRST_AID = [
  { id: "bleeding", emoji: "🩸" },
  { id: "choking", emoji: "😮" },
  { id: "burns", emoji: "🔥" },
  { id: "cpr", emoji: "💓" },
  { id: "seizure", emoji: "⚡" },
  { id: "poison", emoji: "☠️" },
] as const;

export function SosButton() {
  const t = useTranslations("sos");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [showFirstAid, setShowFirstAid] = useState<string | null>(null);

  const getActiveCountry = () => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        if (tz.includes("Rome") || tz.includes("San_Marino") || tz.includes("Vatican")) return "italy";
        if (tz.includes("Bucharest")) return "romania";
        if (tz.includes("Sofia")) return "bulgaria";
        if (tz.includes("Tirana")) return "albania";
        if (tz.includes("Budapest")) return "hungary";
        if (tz.includes("Bratislava")) return "slovakia";
        if (
          tz.includes("Belgrade") ||
          tz.includes("Podgorica") ||
          tz.includes("Sarajevo") ||
          tz.includes("Skopje") ||
          tz.includes("Zagreb") ||
          tz.includes("Ljubljana")
        ) {
          return "serbia";
        }
      }
    } catch (e) {
      // safe fallback
    }

    if (locale === "it") return "italy";
    if (locale === "ro" || locale === "rom") return "romania";
    if (locale === "bg") return "bulgaria";
    if (locale === "sq") return "albania";
    if (locale === "hu") return "hungary";
    if (locale === "sk") return "slovakia";
    if (
      locale === "sr" ||
      locale === "hr" ||
      locale === "bs" ||
      locale === "mk" ||
      locale === "sl"
    ) {
      return "serbia";
    }
    return "default";
  };

  const activeCountry = getActiveCountry();
  const numbers = EMERGENCY_NUMBERS[activeCountry] || EMERGENCY_NUMBERS.default;

  if (!open) {
    return (
      <button
        onClick={() => {
          setOpen(true);
          void import("@/lib/native/bridge").then(({ hapticWarning }) =>
            hapticWarning(),
          );
        }}
        className="absolute right-3 top-16 z-50 flex h-12 w-12 items-center justify-center rounded-full gradient-emergency grain-overlay shadow-danger animate-pulse-glow-emergency transition-transform active:scale-95"
        aria-label={t("buttonAria")}
      >
        <div className="flex flex-col items-center">
          <Phone className="lucide h-4 w-4 text-white" strokeWidth={2.2} />
          <span className="text-[7px] font-extrabold tracking-widest text-white">SOS</span>
        </div>
      </button>
    );
  }

  return (
      <div
      className="fixed inset-0 z-[100] flex flex-col text-white animate-fade-in"
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(220,38,38,0.25) 0%, transparent 60%), radial-gradient(ellipse at bottom, rgba(15,23,42,0.4) 0%, transparent 60%), rgba(2,6,23,0.96)",
        backdropFilter: "blur(8px)",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t("title")}
    >
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <AlertTriangle className="lucide h-7 w-7 text-rose-400" strokeWidth={1.85} />
          <span className="font-display text-xl font-extrabold tracking-tight">{t("title")}</span>
        </div>
        <button
          onClick={() => { setOpen(false); setShowFirstAid(null); }}
          className="rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
          aria-label={t("closeAria")}
        >
          <X className="lucide h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <a
          href="tel:112"
          className="mb-6 flex items-center justify-center gap-4 rounded-3xl gradient-emergency grain-overlay p-7 font-display text-2xl font-extrabold shadow-danger transition-transform active:scale-95"
        >
          <Phone className="lucide h-8 w-8" strokeWidth={2} />
          {t("callPrimary")}
        </a>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {[
            { id: "ambulance", icon: Heart, number: numbers.ambulance, color: "text-rose-400" },
            { id: "police", icon: Shield, number: numbers.police, color: "text-sky-400" },
            { id: "domestic", icon: Phone, number: numbers.domestic, color: "text-violet-400" },
            { id: "poison", icon: Pill, number: numbers.poison, color: "text-emerald-400" },
          ].map((item) => (
            <a
              key={item.id}
              href={`tel:${item.number.replace(/\s/g, "")}`}
              className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 transition-colors hover:bg-white/15 active:bg-white/20"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
            >
              <item.icon className={`lucide h-6 w-6 ${item.color}`} strokeWidth={1.85} />
              <div>
                <div className="text-xs text-white/60">{t(item.id)}</div>
                <div className="text-lg font-bold">{item.number}</div>
              </div>
            </a>
          ))}
        </div>

        <a
          href="https://www.google.com/maps/search/hospital+near+me"
          target="_blank"
          rel="noopener"
          className="mb-8 flex items-center gap-4 rounded-2xl bg-white/10 p-5 transition-colors hover:bg-white/15 active:bg-white/20"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)" }}
        >
          <MapPin className="lucide h-6 w-6 text-[var(--color-ember-400)]" strokeWidth={1.85} />
          <div>
            <div className="text-base font-bold">{t("findHospital")}</div>
            <div className="text-sm text-white/60">{t("findHospitalSub")}</div>
          </div>
        </a>

        <h3 className="mb-4 text-sm font-extrabold uppercase tracking-widest text-white/55">
          {t("firstAidTitle")}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {FIRST_AID.map((fa) => (
            <button
              key={fa.id}
              onClick={() => setShowFirstAid(showFirstAid === fa.id ? null : fa.id)}
              aria-pressed={showFirstAid === fa.id}
              className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-all duration-200 ${
                showFirstAid === fa.id
                  ? "bg-rose-900/60 ring-2 ring-rose-500 scale-105"
                  : "bg-white/10 hover:bg-white/15"
              }`}
              style={{
                boxShadow:
                  showFirstAid === fa.id
                    ? "0 8px 24px rgba(220,38,38,0.25)"
                    : "inset 0 1px 0 rgba(255,255,255,0.08)",
                transitionTimingFunction: "var(--ease-emphasized)",
              }}
            >
              <span className="text-3xl" aria-hidden>{fa.emoji}</span>
              <span className="text-xs font-semibold">{t(`aid.${fa.id}Label`)}</span>
            </button>
          ))}
        </div>

        {showFirstAid && (
          <div
            className="mt-4 rounded-2xl bg-rose-900/45 p-5 ring-1 ring-rose-700 animate-scale-in"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4)" }}
          >
            <p className="text-base font-bold leading-relaxed text-white/95">
              {t(`aid.${showFirstAid}Steps`)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

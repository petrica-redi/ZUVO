"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Phone, X, Heart, Shield, MapPin, AlertTriangle, Pill } from "lucide-react";
import { getEmergencyRegionForLocale } from "@/lib/locale-to-region";
import { getPrimaryEmergencyTel, getServiceNumbersForRegion } from "@/lib/emergency-numbers";

const FIRST_AID_IDS = ["bleeding", "choking", "burns", "cpr", "seizure", "poisoning"] as const;
type FirstAidId = (typeof FIRST_AID_IDS)[number];

const FA_EMOJI: Record<FirstAidId, string> = {
  bleeding: "🩸",
  choking: "😮",
  burns: "🔥",
  cpr: "💓",
  seizure: "⚡",
  poisoning: "☠️",
};

const STEPS_KEY: Record<FirstAidId, "stepsBleeding" | "stepsChoking" | "stepsBurns" | "stepsCpr" | "stepsSeizure" | "stepsPoison"> = {
  bleeding: "stepsBleeding",
  choking: "stepsChoking",
  burns: "stepsBurns",
  cpr: "stepsCpr",
  seizure: "stepsSeizure",
  poisoning: "stepsPoison",
};

export function SosButton() {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : undefined;
  const t = useTranslations("sos");
  const [open, setOpen] = useState(false);
  const [showFirstAid, setShowFirstAid] = useState<FirstAidId | null>(null);

  const regionId = getEmergencyRegionForLocale(locale);
  const numbers = getServiceNumbersForRegion(regionId);
  const mainTel = getPrimaryEmergencyTel(regionId);
  const mainCallDisplay =
    regionId === "albania" ? "127 / 112" : mainTel;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="absolute right-3 top-14 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-[0_4px_14px_rgba(220,38,38,0.45)] animate-pulse-glow ring-2 ring-white/30"
        style={{ background: "linear-gradient(145deg, #ef4444 0%, #b91c1c 55%, #991b1b 100%)" }}
        aria-label={t("ariaFab")}
      >
        <div className="flex flex-col items-center">
          <Phone className="h-4 w-4 text-white" />
          <span className="text-[7px] font-black text-white tracking-wider">SOS</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 text-white animate-fade-in" role="dialog" aria-label={t("ariaDialog")}>
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-7 w-7 text-red-400" />
          <span className="text-xl font-black tracking-tight">{t("title")}</span>
        </div>
        <button
          onClick={() => { setOpen(false); setShowFirstAid(null); }}
          className="rounded-full bg-white/10 p-3 transition-colors hover:bg-white/20"
          aria-label={t("close")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        <a
          href={`tel:${mainTel}`}
          className="mb-6 flex items-center justify-center gap-4 rounded-3xl p-7 text-2xl font-black shadow-2xl transition-transform active:scale-95"
          style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}
        >
          <Phone className="h-8 w-8" />
          {t("mainCall", { number: mainCallDisplay })}
        </a>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {[
            { icon: Heart, labelKey: "ambulance" as const, number: numbers.ambulance, color: "text-red-400" },
            { icon: Shield, labelKey: "police" as const, number: numbers.police, color: "text-blue-400" },
            { icon: Phone, labelKey: "domestic" as const, number: numbers.domestic, color: "text-purple-400" },
            { icon: Pill, labelKey: "poisonCenter" as const, number: numbers.poison, color: "text-green-400" },
          ].map((item) => (
            <a
              key={item.labelKey}
              href={`tel:${item.number.replace(/\s/g, "")}`}
              className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 transition-colors active:bg-white/20"
            >
              <item.icon className={`h-6 w-6 ${item.color}`} />
              <div>
                <div className="text-xs text-gray-400">{t(item.labelKey)}</div>
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
            <div className="text-base font-bold">{t("hospitalTitle")}</div>
            <div className="text-sm text-gray-400">{t("hospitalSubtitle")}</div>
          </div>
        </a>

        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">{t("firstAidTitle")}</h3>
        <div className="grid grid-cols-3 gap-3">
          {FIRST_AID_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setShowFirstAid(showFirstAid === id ? null : id)}
              className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-all ${
                showFirstAid === id ? "bg-red-900/50 ring-2 ring-red-500 scale-105" : "bg-white/10"
              }`}
            >
              <span className="text-3xl">{FA_EMOJI[id]}</span>
              <span className="text-xs font-semibold">{t(id)}</span>
            </button>
          ))}
        </div>

        {showFirstAid && (
          <div className="mt-4 rounded-2xl bg-red-900/40 p-5 ring-1 ring-red-700 animate-scale-in">
            <p className="text-base font-bold leading-relaxed">{t(STEPS_KEY[showFirstAid])}</p>
          </div>
        )}
      </div>
    </div>
  );
}

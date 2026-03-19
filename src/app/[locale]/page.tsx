import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight, ChevronRight, MapPin, FileText, Search,
  Stethoscope, Syringe, Navigation, Phone, MessageCircle,
  AlertTriangle, XCircle, Shield,
} from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

const QUICK_ACTIONS = [
  { id: "explain", href: "/explain", icon: FileText, label: "Explain Prescription", desc: "Understand your meds", color: "#3B82F6", bg: "#EFF6FF" },
  { id: "scan", href: "/scan", icon: Search, label: "Scan a Claim", desc: "Fact-check health info", color: "#F59E0B", bg: "#FFFBEB" },
  { id: "symptoms", href: "/symptoms", icon: Stethoscope, label: "Check Symptoms", desc: "Tap where it hurts", color: "#EF4444", bg: "#FEF2F2" },
  { id: "vaccines", href: "/vaccines", icon: Syringe, label: "Vaccine Guide", desc: "Protect your family", color: "#10B981", bg: "#ECFDF5" },
  { id: "consult", href: "/consult", icon: MessageCircle, label: "Consultation", desc: "AI health check-up", color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "navigate", href: "/navigate", icon: Navigation, label: "Find a Doctor", desc: "Navigate healthcare", color: "#06B6D4", bg: "#ECFEFF" },
] as const;

const TRENDING_MISINFO = [
  {
    claim: "\"Vaccines change your DNA\"",
    verdict: "false" as const,
    truth: "Vaccines do NOT change your DNA. They teach your immune system to fight disease. This lie has been debunked by every major health organization in the world.",
    emoji: "🔴",
  },
  {
    claim: "\"Diabetes medicine is poison — use cinnamon instead\"",
    verdict: "false" as const,
    truth: "Diabetes medication saves lives. Cinnamon cannot replace it. I have seen people stop their medication and end up in hospital with kidney failure.",
    emoji: "🔴",
  },
  {
    claim: "\"Honey and lemon cure the flu\"",
    verdict: "misleading" as const,
    truth: "Honey and lemon can soothe a sore throat, but they do NOT cure the flu. If you have high fever for more than 3 days, see a doctor.",
    emoji: "⚠️",
  },
];

const PILLARS = [
  { id: "prevention", emoji: "🛡️", color: "#16A34A", bg: "#F0FDF4", href: "/learn/prevention" },
  { id: "nutrition",  emoji: "🥗", color: "#2563EB", bg: "#EFF6FF", href: "/learn/nutrition"  },
  { id: "maternal",   emoji: "🤱", color: "#9333EA", bg: "#FAF5FF", href: "/learn/maternal"   },
  { id: "children",   emoji: "👶", color: "#EA580C", bg: "#FFF7ED", href: "/learn/children"   },
  { id: "chronic",    emoji: "💊", color: "#DC2626", bg: "#FEF2F2", href: "/learn/chronic"    },
  { id: "mental",     emoji: "🧠", color: "#0891B2", bg: "#ECFEFF", href: "/learn/mental"     },
] as const;

const REGIONS = [
  { key: "romania",      flag: "🇷🇴", pop: "2.5M" },
  { key: "bulgaria",     flag: "🇧🇬", pop: "700K" },
  { key: "hungary",      flag: "🇭🇺", pop: "700K" },
  { key: "northMacedonia", flag: "🇲🇰", pop: "260K" },
  { key: "slovakia",     flag: "🇸🇰", pop: "500K" },
  { key: "serbia",       flag: "🇷🇸", pop: "600K" },
  { key: "albania",      flag: "🇦🇱", pop: "120K" },
] as const;

const VERDICT_STYLE = {
  false: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-500", icon: XCircle },
  misleading: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-500", icon: AlertTriangle },
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const tPillars = await getTranslations({ locale, namespace: "pillars" });
  const tRegions = await getTranslations({ locale, namespace: "regions" });

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />

      <main className="flex-1 pb-28 pt-14">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white px-5 pb-8 pt-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #C0392B 0%, transparent 70%)" }}
          />
          <div className="relative mx-auto max-w-lg">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#FADBD8] bg-[#FDF2F2] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C0392B]" />
              <span className="text-xs font-semibold text-[#C0392B]">{t("tagline")}</span>
            </div>

            <h1 className="mb-2 text-[1.75rem] font-bold leading-[1.15] tracking-tight text-gray-900" style={{ letterSpacing: "-0.03em" }}>
              <span style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 60%, #F39C12 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                {t("title").split("\n")[0]}
              </span>
              <br />
              {t("title").split("\n")[1] || ""}
            </h1>

            <p className="mb-5 max-w-xs text-sm leading-relaxed text-gray-500">{t("subtitle")}</p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-[#C0392B] px-5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#A93226] active:scale-95"
              >
                <MessageCircle className="h-4 w-4" /> {t("cta")}
              </Link>
              <Link
                href="/consult"
                className="inline-flex h-11 items-center gap-1 rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 active:scale-95"
              >
                <Stethoscope className="h-4 w-4 text-emerald-500" /> Health check-up
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-6 px-5">
          <h2 className="mb-3 text-sm font-bold text-gray-900">What do you need?</h2>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97]"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: action.bg }}
                >
                  <action.icon className="h-5 w-5" style={{ color: action.color }} />
                </div>
                <div className="text-center">
                  <span className="block text-[11px] font-semibold leading-tight text-gray-800">{action.label}</span>
                  <span className="block text-[9px] text-gray-400">{action.desc}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Misinformation */}
        <section className="mt-8 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Trending misinformation
            </h2>
            <Link href="/scan" className="flex items-center gap-0.5 text-xs font-semibold text-[#C0392B]">
              Scan a claim <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
            {TRENDING_MISINFO.map((item, i) => {
              const style = VERDICT_STYLE[item.verdict];
              const VerdictIcon = style.icon;
              return (
                <div
                  key={i}
                  className={`flex w-72 flex-shrink-0 flex-col rounded-2xl border ${style.border} ${style.bg} p-4 shadow-sm`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full ${style.badge} px-2 py-0.5 text-[10px] font-bold uppercase text-white`}>
                      <VerdictIcon className="h-3 w-3" />
                      {item.verdict === "false" ? "False" : "Misleading"}
                    </span>
                  </div>
                  <p className="mb-2 text-sm font-semibold text-gray-800">{item.claim}</p>
                  <p className="text-xs leading-relaxed text-gray-600">{item.truth}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Emergency strip */}
        <section className="mx-5 mt-6">
          <a
            href="tel:112"
            className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-800 p-4 shadow-lg transition-all active:scale-[0.98]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Emergency? Call 112</span>
              <p className="text-xs text-red-200">Available 24/7 across Europe</p>
            </div>
          </a>
        </section>

        {/* Health Topics */}
        <section className="mt-8 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">{tPillars("title")}</h2>
            <Link href="/learn" className="flex items-center gap-0.5 text-xs font-semibold text-[#C0392B]">
              See all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ background: pillar.bg }}>
                  {pillar.emoji}
                </div>
                <span className="text-[11px] font-semibold text-gray-700">{tPillars(pillar.id)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Regions */}
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2 px-5">
            <MapPin className="h-4 w-4 text-[#C0392B]" />
            <h2 className="text-sm font-bold text-gray-900">{tRegions("title")}</h2>
          </div>
          <div className="scrollbar-none flex gap-2.5 overflow-x-auto px-5 pb-1">
            {REGIONS.map((region) => (
              <Link
                key={region.key}
                href={`/regions/${region.key}`}
                className="flex flex-shrink-0 flex-col items-center gap-1 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <span className="text-2xl">{region.flag}</span>
                <span className="max-w-[4rem] text-center text-[10px] font-semibold leading-tight text-gray-700">
                  {tRegions(region.key as Parameters<typeof tRegions>[0])}
                </span>
                <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[9px] font-semibold uppercase text-gray-400">
                  {region.pop}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Mediator banner */}
        <section className="mx-5 mt-8 mb-4">
          <div className="relative overflow-hidden rounded-3xl p-5" style={{ background: "linear-gradient(135deg, #C0392B 0%, #922B21 100%)" }}>
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <p className="text-xs font-semibold uppercase tracking-widest text-red-200">Health Mediators</p>
            <h3 className="mt-1 text-base font-bold text-white">Are you a health mediator?</h3>
            <p className="mt-1 text-sm text-red-100">Access professional tools to support your community.</p>
            <Link
              href="/mediator"
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-semibold text-[#C0392B] transition-all hover:bg-red-50 active:scale-95"
            >
              Mediator dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

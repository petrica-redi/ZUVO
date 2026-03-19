import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight, ChevronRight, MapPin, FileText, Search,
  Stethoscope, Syringe, Navigation, Phone, MessageCircle,
  AlertTriangle, XCircle, Shield, Heart, Users, Sparkles,
  Activity, Globe,
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
  { id: "explain", href: "/explain", icon: FileText, label: "Explain My\nPrescription", color: "#3B82F6", gradient: "from-blue-500 to-indigo-600" },
  { id: "scan", href: "/scan", icon: Search, label: "Fact-Check\na Claim", color: "#F59E0B", gradient: "from-amber-400 to-orange-500" },
  { id: "symptoms", href: "/symptoms", icon: Activity, label: "Check My\nSymptoms", color: "#EF4444", gradient: "from-red-500 to-rose-600" },
  { id: "vaccines", href: "/vaccines", icon: Syringe, label: "Vaccine\nGuide", color: "#10B981", gradient: "from-emerald-500 to-green-600" },
  { id: "consult", href: "/consult", icon: Stethoscope, label: "Health\nConsultation", color: "#8B5CF6", gradient: "from-violet-500 to-purple-600" },
  { id: "navigate", href: "/navigate", icon: Navigation, label: "Find a\nDoctor", color: "#06B6D4", gradient: "from-cyan-500 to-blue-600" },
] as const;

const TRENDING_MISINFO = [
  {
    claim: "\"Vaccines change your DNA\"",
    verdict: "false" as const,
    truth: "Vaccines do NOT change your DNA. They teach your immune system to fight disease. This lie has been debunked by every major health organization.",
    emoji: "🔴",
  },
  {
    claim: "\"Diabetes medicine is poison — use cinnamon instead\"",
    verdict: "false" as const,
    truth: "Diabetes medication saves lives. Cinnamon cannot replace it. I have seen people stop their medication and end up in hospital.",
    emoji: "🔴",
  },
  {
    claim: "\"Honey and lemon cure the flu\"",
    verdict: "misleading" as const,
    truth: "Honey and lemon soothe a sore throat, but do NOT cure the flu. If fever lasts more than 3 days, see a doctor.",
    emoji: "⚠️",
  },
];

const PILLARS = [
  { id: "prevention", emoji: "🛡️", color: "#16A34A", gradient: "from-green-400 to-emerald-600", href: "/learn/prevention" },
  { id: "nutrition",  emoji: "🥗", color: "#2563EB", gradient: "from-blue-400 to-blue-600", href: "/learn/nutrition"  },
  { id: "maternal",   emoji: "🤱", color: "#9333EA", gradient: "from-purple-400 to-violet-600", href: "/learn/maternal"   },
  { id: "children",   emoji: "👶", color: "#EA580C", gradient: "from-orange-400 to-orange-600", href: "/learn/children"   },
  { id: "chronic",    emoji: "💊", color: "#DC2626", gradient: "from-red-400 to-red-600", href: "/learn/chronic"    },
  { id: "mental",     emoji: "🧠", color: "#0891B2", gradient: "from-cyan-400 to-cyan-600", href: "/learn/mental"     },
] as const;

const VERDICT_STYLE = {
  false: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-500", icon: XCircle },
  misleading: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-500", icon: AlertTriangle },
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const tPillars = await getTranslations({ locale, namespace: "pillars" });

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />

      <main className="flex-1 pb-28 pt-14">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-[#F5F5F7] px-5 pb-6 pt-8">
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-[0.07] blur-3xl" style={{ background: "radial-gradient(circle, #C0392B 0%, #F39C12 50%, transparent 70%)" }} />
          <div aria-hidden className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full opacity-[0.05] blur-3xl" style={{ background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)" }} />

          <div className="relative mx-auto max-w-lg">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FADBD8] bg-[#FDF2F2] px-4 py-1.5 animate-fade-in-up">
              <Sparkles className="h-3.5 w-3.5 text-[#C0392B]" />
              <span className="text-xs font-bold text-[#C0392B]">AI-Powered Health Companion</span>
            </div>

            <h1 className="mb-3 text-[2rem] font-black leading-[1.1] tracking-tight text-gray-900 animate-fade-in-up delay-100" style={{ letterSpacing: "-0.04em" }}>
              <span style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 40%, #F39C12 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Your health,
              </span>
              <br />
              explained simply.
            </h1>

            <p className="mb-6 max-w-sm text-[0.95rem] leading-relaxed text-gray-500 animate-fade-in-up delay-200">
              Trusted health guidance for Roma communities. Ask anything. In any language. No judgment.
            </p>

            <div className="flex flex-wrap gap-3 animate-fade-in-up delay-300">
              <Link
                href="/chat"
                className="inline-flex h-13 items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#C0392B] to-[#E74C3C] px-7 text-[15px] font-bold text-white shadow-xl shadow-red-500/25 transition-all hover:shadow-2xl hover:shadow-red-500/30 active:scale-95"
              >
                <MessageCircle className="h-5 w-5" /> Ask a question
              </Link>
              <Link
                href="/consult"
                className="inline-flex h-13 items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-6 text-[15px] font-bold text-gray-700 shadow-sm transition-all hover:border-gray-300 active:scale-95"
              >
                <Stethoscope className="h-5 w-5 text-emerald-500" /> Health check-up
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-5 mt-2 animate-fade-in-up delay-400">
          <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm">
            {[
              { icon: Globe, value: "10M+", label: "Roma in Europe", color: "#C0392B" },
              { icon: Heart, value: "15", label: "Languages", color: "#F39C12" },
              { icon: Shield, value: "6", label: "Health zones", color: "#3B82F6" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-4">
                <stat.icon className="mb-1 h-5 w-5" style={{ color: stat.color }} />
                <span className="text-xl font-black text-gray-900">{stat.value}</span>
                <span className="text-[10px] font-semibold text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-8 px-5">
          <h2 className="mb-4 text-base font-black text-gray-900 animate-fade-in-up delay-500">What do you need?</h2>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <Link
                key={action.id}
                href={action.href}
                className={`card-hover group flex flex-col items-center gap-3 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm animate-fade-in-up delay-${(i + 5) * 100}`}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg`}>
                  <action.icon className="h-7 w-7 text-white" />
                </div>
                <span className="text-center text-[11px] font-bold leading-tight text-gray-800 whitespace-pre-line">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Misinformation */}
        <section className="mt-10 px-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-black text-gray-900">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Trending lies
            </h2>
            <Link href="/scan" className="flex items-center gap-0.5 text-xs font-bold text-[#C0392B]">
              Fact-check <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
            {TRENDING_MISINFO.map((item, i) => {
              const style = VERDICT_STYLE[item.verdict];
              const VerdictIcon = style.icon;
              return (
                <div
                  key={i}
                  className={`flex w-[280px] flex-shrink-0 flex-col rounded-3xl border-2 ${style.border} ${style.bg} p-5 shadow-sm`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full ${style.badge} px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white`}>
                      <VerdictIcon className="h-3.5 w-3.5" />
                      {item.verdict === "false" ? "False" : "Misleading"}
                    </span>
                  </div>
                  <p className="mb-3 text-sm font-bold text-gray-800">{item.claim}</p>
                  <p className="text-xs leading-relaxed text-gray-600">{item.truth}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Emergency strip */}
        <section className="mx-5 mt-8">
          <a
            href="tel:112"
            className="flex items-center gap-4 rounded-3xl p-5 shadow-xl transition-transform active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 50%, #7F1D1D 100%)" }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-base font-black text-white">Emergency? Call 112</span>
              <p className="text-sm text-red-200">Available 24/7 across Europe</p>
            </div>
          </a>
        </section>

        {/* Health Topics */}
        <section className="mt-10 px-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-black text-gray-900">{tPillars("title")}</h2>
            <Link href="/learn" className="flex items-center gap-0.5 text-xs font-bold text-[#C0392B]">
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="card-hover flex flex-col items-center gap-2 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${pillar.gradient} text-2xl shadow-md`}>
                  {pillar.emoji}
                </div>
                <span className="text-[11px] font-bold text-gray-700">{tPillars(pillar.id)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Mediator banner */}
        <section className="mx-5 mt-10 mb-4">
          <div className="relative overflow-hidden rounded-3xl p-6" style={{ background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" }}>
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#C0392B]/20 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-gradient-to-br from-[#F39C12]/10 to-transparent" />

            <div className="relative flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C0392B] to-[#E74C3C] shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Health Mediators</h3>
                <p className="text-sm text-gray-400">Professional tools for your community</p>
              </div>
            </div>
            <Link
              href="/mediator"
              className="relative mt-4 inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-gray-900 shadow-lg transition-all hover:bg-gray-50 active:scale-95"
            >
              Open dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

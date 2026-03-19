import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import {
  ChevronRight, FileText, Search,
  Stethoscope, Syringe, Navigation, Phone, MessageCircle,
  AlertTriangle, XCircle, Heart, Users, Sparkles,
  Activity, Globe, Shield, ArrowRight,
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
  { id: "explain", href: "/explain", icon: FileText, label: "Explain\nPrescription", gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/20" },
  { id: "scan", href: "/scan", icon: Search, label: "Fact-Check\nClaim", gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-500/20" },
  { id: "symptoms", href: "/symptoms", icon: Activity, label: "Check\nSymptoms", gradient: "from-red-500 to-rose-600", shadow: "shadow-red-500/20" },
  { id: "vaccines", href: "/vaccines", icon: Syringe, label: "Vaccine\nGuide", gradient: "from-emerald-500 to-green-600", shadow: "shadow-emerald-500/20" },
  { id: "consult", href: "/consult", icon: Stethoscope, label: "Health\nConsult", gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20" },
  { id: "navigate", href: "/navigate", icon: Navigation, label: "Find\nDoctor", gradient: "from-cyan-500 to-blue-600", shadow: "shadow-cyan-500/20" },
] as const;

const TRENDING_MISINFO = [
  {
    claim: "\"Vaccines change your DNA\"",
    verdict: "false" as const,
    truth: "Vaccines do NOT change your DNA. They teach your immune system to fight disease.",
  },
  {
    claim: "\"Diabetes medicine is poison\"",
    verdict: "false" as const,
    truth: "Diabetes medication saves lives. Cinnamon cannot replace it.",
  },
  {
    claim: "\"Honey and lemon cure the flu\"",
    verdict: "misleading" as const,
    truth: "They soothe a sore throat, but do NOT cure the flu.",
  },
];

const PILLARS = [
  { id: "prevention", emoji: "🛡️", gradient: "from-green-400 to-emerald-600", href: "/learn/prevention" },
  { id: "nutrition",  emoji: "🥗", gradient: "from-blue-400 to-blue-600", href: "/learn/nutrition"  },
  { id: "maternal",   emoji: "🤱", gradient: "from-purple-400 to-violet-600", href: "/learn/maternal"   },
  { id: "children",   emoji: "👶", gradient: "from-orange-400 to-orange-600", href: "/learn/children"   },
  { id: "chronic",    emoji: "💊", gradient: "from-red-400 to-red-600", href: "/learn/chronic"    },
  { id: "mental",     emoji: "🧠", gradient: "from-cyan-400 to-cyan-600", href: "/learn/mental"     },
] as const;

const VERDICT_STYLE = {
  false: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-500", icon: XCircle, label: "False" },
  misleading: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-500", icon: AlertTriangle, label: "Misleading" },
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const tPillars = await getTranslations({ locale, namespace: "pillars" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white px-5 pb-5 pt-6">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-[0.08] blur-3xl" style={{ background: "radial-gradient(circle, #C0392B 0%, #F39C12 60%, transparent 80%)" }} />

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 animate-fade-in-up">
            <Sparkles className="h-3 w-3 text-[#C0392B]" />
            <span className="text-[11px] font-bold text-[#C0392B]">AI-Powered Health Companion</span>
          </div>

          <h1 className="mb-2 text-[28px] font-black leading-[1.08] tracking-tight animate-fade-in-up delay-100" style={{ letterSpacing: "-0.03em" }}>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg, #C0392B 0%, #E74C3C 40%, #F39C12 100%)" }}>
              Your health,
            </span>
            <br />
            <span className="text-gray-900">explained simply.</span>
          </h1>

          <p className="mb-5 text-[14px] leading-relaxed text-gray-500 animate-fade-in-up delay-200">
            Trusted guidance for Roma communities.<br />Ask anything. No judgment.
          </p>

          <div className="flex gap-3 animate-fade-in-up delay-300">
            <Link
              href="/chat"
              className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white shadow-lg shadow-red-500/20 active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 100%)" }}
            >
              <MessageCircle className="h-5 w-5" /> Ask a question
            </Link>
            <Link
              href="/consult"
              className="flex h-[52px] items-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-5 text-[15px] font-bold text-gray-700 active:scale-[0.97]"
            >
              <Stethoscope className="h-5 w-5 text-emerald-500" /> Check-up
            </Link>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <section className="px-4 py-3 animate-fade-in-up delay-400">
          <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-2xl bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
            {[
              { icon: Globe, value: "10M+", label: "Roma in Europe", color: "#C0392B" },
              { icon: Heart, value: "15", label: "Languages", color: "#F39C12" },
              { icon: Shield, value: "6", label: "Health zones", color: "#3B82F6" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center py-3.5">
                <stat.icon className="mb-0.5 h-4 w-4" style={{ color: stat.color }} />
                <span className="text-[18px] font-black text-gray-900">{stat.value}</span>
                <span className="text-[10px] font-semibold text-gray-400">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick Actions ─────────────────────────────────────────────── */}
        <section className="px-4 pt-4 pb-2">
          <h2 className="mb-3 text-[16px] font-black text-gray-900">What do you need?</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {QUICK_ACTIONS.map((action, i) => (
              <Link
                key={action.id}
                href={action.href}
                className={`card-hover flex flex-col items-center gap-2.5 rounded-2xl bg-white p-3.5 shadow-sm animate-fade-in-up`}
                style={{ animationDelay: `${(i + 4) * 80}ms`, border: "1px solid rgba(0,0,0,0.04)" }}
              >
                <div className={`flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-gradient-to-br ${action.gradient} shadow-md ${action.shadow}`}>
                  <action.icon className="h-[26px] w-[26px] text-white" />
                </div>
                <span className="text-center text-[11px] font-bold leading-[1.2] text-gray-700 whitespace-pre-line">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Trending Lies ─────────────────────────────────────────────── */}
        <section className="px-4 pt-6 pb-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[16px] font-black text-gray-900">
              <AlertTriangle className="h-[18px] w-[18px] text-amber-500" /> Trending lies
            </h2>
            <Link href="/scan" className="flex items-center text-[12px] font-bold text-[#C0392B]">
              Fact-check <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="scrollbar-none -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
            {TRENDING_MISINFO.map((item, i) => {
              const style = VERDICT_STYLE[item.verdict];
              const VerdictIcon = style.icon;
              return (
                <div
                  key={i}
                  className={`flex w-[240px] flex-shrink-0 flex-col rounded-2xl border ${style.border} ${style.bg} p-4`}
                >
                  <span className={`mb-2 inline-flex w-fit items-center gap-1 rounded-full ${style.badge} px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white`}>
                    <VerdictIcon className="h-3 w-3" />
                    {style.label}
                  </span>
                  <p className="mb-2 text-[13px] font-bold text-gray-800">{item.claim}</p>
                  <p className="text-[12px] leading-relaxed text-gray-600">{item.truth}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Emergency strip ───────────────────────────────────────────── */}
        <section className="px-4 pt-4">
          <a
            href="tel:112"
            className="flex items-center gap-3.5 rounded-2xl p-4 shadow-lg active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-[15px] font-black text-white">Emergency? Call 112</span>
              <p className="text-[12px] text-red-200">Available 24/7 across Europe</p>
            </div>
          </a>
        </section>

        {/* ── Health Topics ─────────────────────────────────────────────── */}
        <section className="px-4 pt-6 pb-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-black text-gray-900">{tPillars("title")}</h2>
            <Link href="/learn" className="flex items-center text-[12px] font-bold text-[#C0392B]">
              See all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="card-hover flex flex-col items-center gap-2 rounded-2xl bg-white p-3.5 shadow-sm"
                style={{ border: "1px solid rgba(0,0,0,0.04)" }}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br ${pillar.gradient} text-xl shadow-sm`}>
                  {pillar.emoji}
                </div>
                <span className="text-[11px] font-bold text-gray-700">{tPillars(pillar.id)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Mediator banner ───────────────────────────────────────────── */}
        <section className="px-4 pt-6 pb-6">
          <div className="relative overflow-hidden rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)" }}>
            <div aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#C0392B]/15" />

            <div className="relative flex items-center gap-3.5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C0392B] to-[#E74C3C] shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-black text-white">Health Mediators</h3>
                <p className="text-[12px] text-gray-400">Professional tools for your community</p>
              </div>
            </div>
            <Link
              href="/mediator"
              className="relative mt-3.5 inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-[13px] font-bold text-gray-900 shadow-md active:scale-[0.97]"
            >
              Open dashboard <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import {
  ChevronRight, FileText, Search,
  Stethoscope, Syringe, Navigation, MessageCircle,
  AlertTriangle, XCircle, Heart, Users, Sparkles,
  Activity, Globe, Shield, ArrowRight, Scale, BookOpen,
  GraduationCap,
} from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { HomeEmergencyStrip } from "@/components/HomeEmergencyStrip";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

const PILLARS = [
  { id: "prevention", emoji: "🛡️", gradient: "from-green-400 to-emerald-600", href: "/learn/prevention" },
  { id: "nutrition",  emoji: "🥗", gradient: "from-blue-400 to-blue-600", href: "/learn/nutrition"  },
  { id: "maternal",   emoji: "🤱", gradient: "from-purple-400 to-violet-600", href: "/learn/maternal"   },
  { id: "children",   emoji: "👶", gradient: "from-orange-400 to-orange-600", href: "/learn/children"   },
  { id: "chronic",    emoji: "💊", gradient: "from-red-400 to-red-600", href: "/learn/chronic"    },
  { id: "mental",     emoji: "🧠", gradient: "from-cyan-400 to-cyan-600", href: "/learn/mental"     },
] as const;

const VERDICT_STYLE = {
  false: { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-500", icon: XCircle, key: "verdictFalse" as const },
  misleading: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-500", icon: AlertTriangle, key: "verdictMisleading" as const },
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const tPillars = await getTranslations({ locale, namespace: "pillars" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  const quickActions = [
    { id: "explain" as const, href: "/explain", icon: FileText, key: "quickExplain" as const, gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/20" },
    { id: "scan" as const, href: "/scan", icon: Search, key: "quickScan" as const, gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-500/20" },
    { id: "symptoms" as const, href: "/symptoms", icon: Activity, key: "quickSymptoms" as const, gradient: "from-red-500 to-rose-600", shadow: "shadow-red-500/20" },
    { id: "vaccines" as const, href: "/vaccines", icon: Syringe, key: "quickVaccines" as const, gradient: "from-emerald-500 to-green-600", shadow: "shadow-emerald-500/20" },
    { id: "consult" as const, href: "/consult", icon: Stethoscope, key: "quickConsult" as const, gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20" },
    { id: "navigate" as const, href: "/navigate", icon: Navigation, key: "quickNavigate" as const, gradient: "from-cyan-500 to-blue-600", shadow: "shadow-cyan-500/20" },
  ];

  const trending = [
    { claimKey: "trending1Claim" as const, truthKey: "trending1Truth" as const, verdict: "false" as const },
    { claimKey: "trending2Claim" as const, truthKey: "trending2Truth" as const, verdict: "false" as const },
    { claimKey: "trending3Claim" as const, truthKey: "trending3Truth" as const, verdict: "misleading" as const },
  ];

  const learnRow = [
    { href: "/quiz", icon: GraduationCap, labelKey: "learnQuiz" as const, descKey: "learnQuizDesc" as const, gradient: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/20" },
    { href: "/glossary", icon: BookOpen, labelKey: "learnGlossary" as const, descKey: "learnGlossaryDesc" as const, gradient: "from-teal-500 to-cyan-600", shadow: "shadow-teal-500/20" },
    { href: "/rights", icon: Scale, labelKey: "learnRights" as const, descKey: "learnRightsDesc" as const, gradient: "from-indigo-500 to-purple-600", shadow: "shadow-indigo-500/20" },
    { href: "/stories", icon: Heart, labelKey: "learnStories" as const, descKey: "learnStoriesDesc" as const, gradient: "from-rose-500 to-pink-600", shadow: "shadow-rose-500/20" },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <Header />
      <SosButton />

      <main id="main-content" className="flex-1">
        <section className="relative px-4 pb-2 pt-4">
          <div
            className="relative overflow-hidden rounded-[1.35rem] border border-white/60 px-5 pb-6 pt-6 shadow-[0_4px_24px_rgba(15,23,42,0.06)]"
            style={{
              background: "linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(250,251,252,0.88) 100%)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-90 blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(192,57,43,0.12) 0%, rgba(243,156,18,0.1) 45%, transparent 70%)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-8 bottom-0 h-32 w-32 rounded-full opacity-60 blur-2xl"
              style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)" }}
            />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-red-200/50 bg-gradient-to-r from-red-50/90 to-amber-50/40 px-3 py-1.5 shadow-sm animate-fade-in-up">
                <Sparkles className="h-3.5 w-3.5 text-[#C0392B]" />
                <span className="text-[11px] font-extrabold tracking-wide text-[#922b21]">{tHome("aiBadge")}</span>
              </div>

              <h1 className="mb-2 text-[28px] font-black leading-[1.08] tracking-[-0.04em] animate-fade-in-up delay-100">
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(120deg, #A93226 0%, #C0392B 35%, #E85D4C 60%, #D68910 100%)" }}
                >
                  {tHome("headline1")}
                </span>
                <br />
                <span className="text-slate-900">{tHome("headline2")}</span>
              </h1>

              <p className="mb-5 text-[14px] leading-relaxed text-slate-500 animate-fade-in-up delay-200 whitespace-pre-line">
                {tHome("tagline")}
              </p>

              <div className="flex gap-2.5 animate-fade-in-up delay-300">
                <Link
                  href="/chat"
                  className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl text-[15px] font-extrabold text-white active:scale-[0.98]"
                  style={{
                    background: "linear-gradient(135deg, #C0392B 0%, #D9483B 50%, #B83226 100%)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1), 0 8px 20px rgba(192, 57, 43, 0.32), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <MessageCircle className="h-5 w-5 shrink-0" /> {tHome("ctaAsk")}
                </Link>
                <Link
                  href="/consult"
                  className="flex h-[52px] shrink-0 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-4 text-[14px] font-extrabold text-slate-800 shadow-sm backdrop-blur-sm active:scale-[0.98] sm:px-5"
                >
                  <Stethoscope className="h-5 w-5 text-emerald-600" /> {tHome("ctaConsult")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-3 animate-fade-in-up delay-400">
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-white/50 bg-white/70 shadow-[0_2px_16px_rgba(15,23,42,0.04)] backdrop-blur-md divide-x divide-slate-100/80">
            {[
              { icon: Globe, value: "10M+", labelKey: "statsRoma" as const, color: "#C0392B" },
              { icon: Heart, value: "15", labelKey: "statsLanguages" as const, color: "#F39C12" },
              { icon: Shield, value: "6", labelKey: "statsZones" as const, color: "#3B82F6" },
            ].map((stat) => (
              <div key={stat.labelKey} className="flex flex-col items-center py-3.5">
                <stat.icon className="mb-0.5 h-4 w-4" style={{ color: stat.color }} />
                <span className="text-[18px] font-black text-gray-900">{stat.value}</span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{tHome(stat.labelKey)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pt-4 pb-2">
          <h2 className="mb-3 text-[16px] font-black tracking-tight text-slate-900">{tHome("quickSection")}</h2>
          <div className="grid grid-cols-3 gap-2.5">
            {quickActions.map((action, i) => (
              <Link
                key={action.id}
                href={action.href}
                className={`card-hover flex flex-col items-center gap-2.5 rounded-2xl border border-white/50 bg-white/80 p-3.5 backdrop-blur-sm animate-fade-in-up`}
                style={{ animationDelay: `${(i + 4) * 80}ms` }}
              >
                <div
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-[1.1rem] bg-gradient-to-br ${action.gradient} ${action.shadow}`}
                  style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)" }}
                >
                  <action.icon className="h-[26px] w-[26px] text-white drop-shadow-sm" />
                </div>
                <span className="text-center text-[11px] font-bold leading-[1.2] text-gray-700 whitespace-pre-line">
                  {tHome(action.key)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 pt-6 pb-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-[16px] font-black tracking-tight text-slate-900">
              <AlertTriangle className="h-[18px] w-[18px] text-amber-500" /> {tHome("trendingTitle")}
            </h2>
            <Link href="/scan" className="flex items-center rounded-lg text-[12px] font-extrabold text-[#A93226]">
              {tHome("trendingFactCheck")} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="scrollbar-none -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
            {trending.map((item, i) => {
              const style = VERDICT_STYLE[item.verdict];
              const VerdictIcon = style.icon;
              return (
                <div
                  key={i}
                  className={`flex w-[240px] flex-shrink-0 flex-col rounded-2xl border ${style.border} ${style.bg} p-4 shadow-sm`}
                >
                  <span className={`mb-2 inline-flex w-fit items-center gap-1 rounded-full ${style.badge} px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white`}>
                    <VerdictIcon className="h-3 w-3" />
                    {tHome(style.key)}
                  </span>
                  <p className="mb-2 text-[13px] font-bold text-gray-800">{tHome(item.claimKey)}</p>
                  <p className="text-[12px] leading-relaxed text-gray-600">{tHome(item.truthKey)}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 pt-4">
          <HomeEmergencyStrip locale={locale} />
        </section>

        <section className="px-4 pt-6 pb-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[16px] font-black tracking-tight text-slate-900">{tPillars("title")}</h2>
            <Link href="/learn" className="flex items-center text-[12px] font-extrabold text-[#A93226]">
              {t("learnMore")} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="card-hover flex flex-col items-center gap-2 rounded-2xl border border-white/50 bg-white/80 p-3.5 backdrop-blur-sm"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-[0.9rem] bg-gradient-to-br ${pillar.gradient} text-xl shadow-md`} style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }}>
                  {pillar.emoji}
                </div>
                <span className="text-[11px] font-bold text-gray-700">{tPillars(pillar.id)}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 pt-6 pb-2">
          <h2 className="mb-3 text-[16px] font-black tracking-tight text-slate-900">{tHome("learnTitle")}</h2>
          <div className="space-y-2.5">
            {learnRow.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card-hover flex items-center gap-3.5 rounded-2xl border border-white/50 bg-white/80 p-3.5 backdrop-blur-sm"
              >
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[0.9rem] bg-gradient-to-br ${item.gradient} shadow-md ${item.shadow}`}>
                  <item.icon className="h-[22px] w-[22px] text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[14px] font-bold text-gray-900">{tHome(item.labelKey)}</span>
                  <p className="text-[12px] text-gray-500">{tHome(item.descKey)}</p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
              </Link>
            ))}
          </div>
        </section>

        <section className="px-4 pt-6 pb-6">
          <div
            className="relative overflow-hidden rounded-2xl border border-slate-700/30 p-5 shadow-[0_12px_40px_rgba(15,23,42,0.2)]"
            style={{ background: "linear-gradient(150deg, #1e2b3f 0%, #0f172a 50%, #0c1220 100%)" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(192,57,43,0.22), transparent 65%)" }}
            />

            <div className="relative flex items-center gap-3.5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C0392B] to-[#E74C3C] shadow-md">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-black text-white">{tHome("mediatorTitle")}</h3>
                <p className="text-[12px] text-gray-400">{tHome("mediatorSubtitle")}</p>
              </div>
            </div>
            <Link
              href="/mediator"
              className="relative mt-3.5 inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-[13px] font-bold text-gray-900 shadow-md active:scale-[0.97]"
            >
              {tHome("mediatorCta")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

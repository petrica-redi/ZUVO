import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import {
  ChevronRight, FileText, Search,
  Stethoscope, Syringe, Navigation, Phone, MessageCircle,
  AlertTriangle, XCircle, Heart, Users, Sparkles,
  Activity, Globe, Shield, ArrowRight, Scale, BookOpen,
  GraduationCap, Trophy,
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
  { id: "explain", href: "/explain", icon: FileText, gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/20" },
  { id: "scan", href: "/scan", icon: Search, gradient: "from-amber-400 to-orange-500", shadow: "shadow-amber-500/20" },
  { id: "symptoms", href: "/symptoms", icon: Activity, gradient: "from-red-500 to-rose-600", shadow: "shadow-red-500/20" },
  { id: "vaccines", href: "/vaccines", icon: Syringe, gradient: "from-emerald-500 to-green-600", shadow: "shadow-emerald-500/20" },
  { id: "consult", href: "/consult", icon: Stethoscope, gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20" },
  { id: "navigate", href: "/navigate", icon: Navigation, gradient: "from-cyan-500 to-blue-600", shadow: "shadow-cyan-500/20" },
] as const;

const TRENDING = [
  { claimKey: "claim1", truthKey: "truth1", verdict: "false" as const },
  { claimKey: "claim2", truthKey: "truth2", verdict: "false" as const },
  { claimKey: "claim3", truthKey: "truth3", verdict: "misleading" as const },
];

const PILLARS = [
  { id: "prevention", emoji: "🛡️", token: "prevention", href: "/learn/prevention" },
  { id: "nutrition",  emoji: "🥗", token: "nutrition",  href: "/learn/nutrition"  },
  { id: "maternal",   emoji: "🤱", token: "maternal",   href: "/learn/maternal"   },
  { id: "children",   emoji: "👶", token: "children",   href: "/learn/children"   },
  { id: "chronic",    emoji: "💊", token: "chronic",    href: "/learn/chronic"    },
  { id: "mental",     emoji: "🧠", token: "mental",     href: "/learn/mental"     },
] as const;

const VERDICT_STYLE = {
  false: { ring: "border-[var(--color-danger-border)]", bg: "bg-[var(--color-danger-bg)]", badge: "bg-[var(--color-danger-accent)]", icon: XCircle },
  misleading: { ring: "border-[var(--color-warning-border)]", bg: "bg-[var(--color-warning-bg)]", badge: "bg-[var(--color-warning-accent)]", icon: AlertTriangle },
};

const LEARN_ITEMS = [
  { href: "/students", icon: Trophy, key: "academy", gradient: "from-indigo-500 to-violet-600" },
  { href: "/quiz", icon: GraduationCap, key: "quiz", gradient: "from-amber-500 to-orange-600" },
  { href: "/glossary", icon: BookOpen, key: "glossary", gradient: "from-teal-500 to-cyan-600" },
  { href: "/rights", icon: Scale, key: "rights", gradient: "from-indigo-500 to-purple-600" },
  { href: "/stories", icon: Heart, key: "stories", gradient: "from-rose-500 to-pink-600" },
] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tPillars = await getTranslations({ locale, namespace: "pillars" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />

      <main id="main-content" className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[var(--color-surface)] px-5 pb-6 pt-7">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-50 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full opacity-40 blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(251,191,36,0.16) 0%, transparent 70%)" }}
          />

          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--color-brand-200)] bg-[var(--color-accent-soft)] px-3 py-1 animate-fade-in-up">
            <Sparkles className="lucide h-3 w-3 text-[var(--color-accent)]" strokeWidth={1.75} />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-accent-text)]">
              {t("kicker")}
            </span>
          </div>

          <h1
            className="mb-2 font-display text-[var(--text-3xl)] font-extrabold leading-[1.05] tracking-tight animate-fade-in-up delay-100"
            style={{ letterSpacing: "-0.03em" }}
          >
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #4F46E5 0%, #6D28D9 50%, #312E81 100%)" }}
            >
              {t("titleAccent")}
            </span>
            <br />
            <span className="text-[var(--color-text-primary)]">{t("titleEnd")}</span>
          </h1>

          <p className="mb-5 text-[var(--text-sm)] leading-relaxed text-[var(--color-text-secondary)] animate-fade-in-up delay-200">
            {t("subtitle")}
          </p>

          <div className="flex gap-3 animate-fade-in-up delay-300">
            <Link
              href="/chat"
              className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl text-[15px] font-extrabold text-white gradient-brand grain-overlay shadow-brand transition-all active:scale-[0.97]"
              style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
            >
              <MessageCircle className="lucide h-5 w-5" strokeWidth={2} /> {t("ctaAsk")}
            </Link>
            <Link
              href="/consult"
              className="flex h-[52px] items-center gap-2 rounded-2xl border-2 border-[var(--color-border-default)] bg-[var(--color-surface)] px-5 text-[15px] font-extrabold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-strong)] active:scale-[0.97]"
            >
              <Stethoscope className="lucide h-5 w-5 text-[var(--color-success-accent)]" strokeWidth={1.75} /> {t("ctaCheckup")}
            </Link>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────────── */}
        <section className="px-4 py-3 animate-fade-in-up delay-400">
          <div className="grid grid-cols-3 divide-x divide-[var(--color-border-subtle)] rounded-2xl bg-[var(--color-surface)] hairline shadow-1">
            {[
              { id: "romaInEurope", icon: Globe, value: "10M+", color: "var(--color-accent)" },
              { id: "languages", icon: Heart, value: "15", color: "var(--color-ember-500)" },
              { id: "healthZones", icon: Shield, value: "6", color: "var(--color-info-accent)" },
            ].map((stat) => (
              <div key={stat.id} className="flex flex-col items-center py-3.5">
                <stat.icon className="lucide mb-0.5 h-4 w-4" style={{ color: stat.color }} strokeWidth={1.75} />
                <span className="font-display text-[18px] font-extrabold text-[var(--color-text-primary)]">
                  {stat.value}
                </span>
                <span className="text-[10px] font-semibold text-[var(--color-text-muted)]">
                  {t(`stats.${stat.id}`)}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick Actions ─────────────────────────────────────────────── */}
        <section className="px-4 pt-4 pb-2">
          <h2 className="mb-3 font-display text-[16px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {t("quickActionsTitle")}
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            {QUICK_ACTIONS.map((action, i) => (
              <Link
                key={action.id}
                href={action.href}
                className="card-interactive flex flex-col items-center gap-2.5 rounded-2xl bg-[var(--color-surface)] p-3.5 animate-fade-in-up"
                style={{ animationDelay: `${(i + 4) * 80}ms` }}
              >
                <div
                  className={`flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-gradient-to-br ${action.gradient} shadow-2 ${action.shadow}`}
                >
                  <action.icon className="lucide h-[26px] w-[26px] text-white" strokeWidth={1.85} />
                </div>
                <span className="text-center text-[11px] font-bold leading-[1.2] text-[var(--color-text-primary)] whitespace-pre-line">
                  {t(`actions.${action.id}`)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Trending Lies ─────────────────────────────────────────────── */}
        <section className="px-4 pt-6 pb-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 font-display text-[16px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
              <AlertTriangle className="lucide h-[18px] w-[18px] text-[var(--color-ember-500)]" strokeWidth={1.75} /> {t("trendingTitle")}
            </h2>
            <Link
              href="/scan"
              className="flex items-center gap-0.5 text-[12px] font-bold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
            >
              {t("factCheckCta")} <ChevronRight className="lucide h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
          <div className="scrollbar-none -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
            {TRENDING.map((item, i) => {
              const style = VERDICT_STYLE[item.verdict];
              const VerdictIcon = style.icon;
              return (
                <div
                  key={i}
                  className={`flex w-[240px] flex-shrink-0 flex-col rounded-2xl border ${style.ring} ${style.bg} p-4 shadow-1`}
                >
                  <span
                    className={`mb-2 inline-flex w-fit items-center gap-1 rounded-full ${style.badge} px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white`}
                  >
                    <VerdictIcon className="lucide h-3 w-3" strokeWidth={2} />
                    {t(`verdicts.${item.verdict}`)}
                  </span>
                  <p className="mb-2 text-[13px] font-bold text-[var(--color-text-primary)]">
                    &ldquo;{t(`trending.${item.claimKey}`)}&rdquo;
                  </p>
                  <p className="text-[12px] leading-relaxed text-[var(--color-text-secondary)]">
                    {t(`trending.${item.truthKey}`)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Emergency strip ───────────────────────────────────────────── */}
        <section className="px-4 pt-4">
          <a
            href="tel:112"
            className="flex items-center gap-3.5 rounded-2xl gradient-emergency grain-overlay p-4 shadow-danger transition-all active:scale-[0.98]"
            style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Phone className="lucide h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <span className="font-display text-[15px] font-extrabold text-white">
                {t("emergencyCta")}
              </span>
              <p className="text-[12px] text-white/80">{t("emergencySub")}</p>
            </div>
            <ChevronRight className="lucide h-5 w-5 text-white/70" strokeWidth={2} />
          </a>
        </section>

        {/* ── Health Topics ─────────────────────────────────────────────── */}
        <section className="px-4 pt-6 pb-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[16px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
              {tPillars("title")}
            </h2>
            <Link
              href="/learn"
              className="flex items-center gap-0.5 text-[12px] font-bold text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-hover)]"
            >
              {t("seeAll")} <ChevronRight className="lucide h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="card-interactive flex flex-col items-center gap-2 rounded-2xl bg-[var(--color-surface)] p-3.5"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-[14px] text-xl shadow-1"
                  style={{
                    background: `var(--color-pillar-${pillar.token}-bg)`,
                    border: `1px solid var(--color-pillar-${pillar.token}-border)`,
                  }}
                >
                  {pillar.emoji}
                </div>
                <span className="text-[11px] font-bold text-[var(--color-text-primary)]">
                  {tPillars(pillar.id)}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Digital Literacy ────────────────────────────────────────── */}
        <section className="px-4 pt-6 pb-2">
          <h2 className="mb-3 font-display text-[16px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {t("learnGrowTitle")}
          </h2>
          <div className="space-y-2.5">
            {LEARN_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="card-interactive flex items-center gap-3.5 rounded-2xl bg-[var(--color-surface)] p-3.5"
              >
                <div
                  className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br ${item.gradient} shadow-2`}
                >
                  <item.icon className="lucide h-[22px] w-[22px] text-white" strokeWidth={1.85} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
                    {t(`learn.${item.key}Label`)}
                  </span>
                  <p className="text-[12px] text-[var(--color-text-secondary)]">
                    {t(`learn.${item.key}Desc`)}
                  </p>
                </div>
                <ChevronRight className="lucide h-4 w-4 flex-shrink-0 text-[var(--color-text-muted)]" strokeWidth={1.75} />
              </Link>
            ))}
          </div>
        </section>

        {/* ── Mediator banner ───────────────────────────────────────────── */}
        <section className="px-4 pt-6 pb-6">
          <div className="relative overflow-hidden rounded-2xl gradient-brand grain-overlay p-5 shadow-3">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-40 blur-2xl"
              style={{ background: "radial-gradient(circle, #FBBF24 0%, transparent 70%)" }}
            />

            <div className="relative flex items-center gap-3.5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Users className="lucide h-6 w-6 text-white" strokeWidth={1.85} />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-[15px] font-extrabold text-white">
                  {t("mediator.title")}
                </h3>
                <p className="text-[12px] text-white/75">{t("mediator.subtitle")}</p>
              </div>
            </div>
            <Link
              href="/mediator"
              className="relative mt-3.5 inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-[13px] font-extrabold text-[var(--color-brand-700)] shadow-3 transition-all active:scale-[0.97]"
            >
              {t("mediator.openDashboard")} <ArrowRight className="lucide h-3.5 w-3.5" strokeWidth={2} />
            </Link>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

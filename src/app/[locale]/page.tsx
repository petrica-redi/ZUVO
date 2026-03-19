import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ChevronRight, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("title"), description: t("description") };
}

// ── Health pillars data ──────────────────────────────────────────────────────
const PILLARS = [
  { id: "prevention", emoji: "🛡️", color: "#16A34A", bg: "#F0FDF4", href: "/learn/prevention" },
  { id: "nutrition",  emoji: "🥗", color: "#2563EB", bg: "#EFF6FF", href: "/learn/nutrition"  },
  { id: "maternal",   emoji: "🤱", color: "#9333EA", bg: "#FAF5FF", href: "/learn/maternal"   },
  { id: "children",   emoji: "👶", color: "#EA580C", bg: "#FFF7ED", href: "/learn/children"   },
  { id: "chronic",    emoji: "💊", color: "#DC2626", bg: "#FEF2F2", href: "/learn/chronic"    },
  { id: "mental",     emoji: "🧠", color: "#0891B2", bg: "#ECFEFF", href: "/learn/mental"     },
] as const;

// ── Roma community regions ───────────────────────────────────────────────────
const REGIONS = [
  { key: "romania",      flag: "🇷🇴", pop: "2.5M" },
  { key: "bulgaria",     flag: "🇧🇬", pop: "700K" },
  { key: "hungary",      flag: "🇭🇺", pop: "700K" },
  { key: "northMacedonia", flag: "🇲🇰", pop: "260K" },
  { key: "slovakia",     flag: "🇸🇰", pop: "500K" },
  { key: "serbia",       flag: "🇷🇸", pop: "600K" },
  { key: "turkey",       flag: "🇹🇷", pop: "500K" },
  { key: "greece",       flag: "🇬🇷", pop: "300K" },
  { key: "albania",      flag: "🇦🇱", pop: "120K" },
  { key: "czech",        flag: "🇨🇿", pop: "250K" },
  { key: "croatia",      flag: "🇭🇷", pop: "40K"  },
  { key: "bosnia",       flag: "🇧🇦", pop: "50K"  },
  { key: "slovenia",     flag: "🇸🇮", pop: "12K"  },
  { key: "kosovo",       flag: "🇽🇰", pop: "35K"  },
] as const;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });
  const tPillars = await getTranslations({ locale, namespace: "pillars" });
  const tRegions = await getTranslations({ locale, namespace: "regions" });

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />

      {/* ── Main scroll area ───────────────────────────────────────────── */}
      <main className="flex-1 pb-28 pt-14">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white px-5 pb-10 pt-10">
          {/* Subtle gradient blob */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #C0392B 0%, transparent 70%)" }}
          />

          <div className="relative mx-auto max-w-lg">
            {/* Pill badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#FADBD8] bg-[#FDF2F2] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C0392B]" />
              <span className="text-xs font-semibold text-[#C0392B]">{t("tagline")}</span>
            </div>

            {/* Headline */}
            <h1
              className="mb-3 text-[2.1rem] font-bold leading-[1.15] tracking-tight text-gray-900"
              style={{ letterSpacing: "-0.03em" }}
            >
              {t("title").split("\n").map((line, i) => (
                <span key={i}>
                  {i === 0 ? (
                    <span
                      style={{
                        background: "linear-gradient(135deg, #C0392B 0%, #E74C3C 60%, #F39C12 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                  {i === 0 && <br />}
                </span>
              ))}
            </h1>

            <p className="mb-7 max-w-xs text-[0.95rem] leading-relaxed text-gray-500">
              {t("subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/learn"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#C0392B] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#A93226] active:scale-95"
              >
                {t("cta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex h-12 items-center gap-1 rounded-full border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 active:scale-95"
              >
                {t("learnMore")}
                <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Stats strip ───────────────────────────────────────────────── */}
        <section className="mx-5 -mt-0.5 grid grid-cols-3 divide-x divide-gray-100 rounded-2xl border border-gray-100 bg-white shadow-sm">
          {[
            { value: "10–12M", label: "Roma in Europe" },
            { value: "15",     label: "Languages" },
            { value: "6",      label: "Health zones" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center py-4">
              <span className="text-lg font-bold text-gray-900">{stat.value}</span>
              <span className="text-[10px] font-medium text-gray-400">{stat.label}</span>
            </div>
          ))}
        </section>

        {/* ── Health zones ──────────────────────────────────────────────── */}
        <section className="mt-8 px-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">{tPillars("title")}</h2>
            <Link
              href="/learn"
              className="flex items-center gap-0.5 text-xs font-semibold text-[#C0392B]"
            >
              See all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.id}
                href={pillar.href}
                className="group flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
              >
                {/* Icon circle */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                  style={{ background: pillar.bg }}
                >
                  {pillar.emoji}
                </div>

                {/* Label */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold leading-tight text-gray-800">
                    {tPillars(pillar.id)}
                  </span>
                  <ChevronRight
                    className="h-4 w-4 flex-shrink-0 text-gray-300 transition-transform group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Region section ────────────────────────────────────────────── */}
        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 px-5">
            <MapPin className="h-4 w-4 text-[#C0392B]" />
            <h2 className="text-base font-bold text-gray-900">{tRegions("title")}</h2>
          </div>
          <p className="mb-4 px-5 text-xs text-gray-400">{tRegions("subtitle")}</p>

          {/* Horizontal scroll row */}
          <div className="scrollbar-none flex gap-2.5 overflow-x-auto px-5 pb-1">
            {REGIONS.map((region) => (
              <Link
                key={region.key}
                href={`/regions/${region.key}`}
                className="flex flex-shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
              >
                <span className="text-2xl leading-none">{region.flag}</span>
                <span className="max-w-[4.5rem] text-center text-[11px] font-semibold leading-tight text-gray-700">
                  {tRegions(region.key as Parameters<typeof tRegions>[0])}
                </span>
                <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                  {region.pop}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Community banner ──────────────────────────────────────────── */}
        <section className="mx-5 mt-8">
          <div
            className="relative overflow-hidden rounded-3xl p-6"
            style={{
              background: "linear-gradient(135deg, #C0392B 0%, #922B21 100%)",
            }}
          >
            {/* Decorative circle */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5"
            />

            <p className="relative text-xs font-semibold uppercase tracking-widest text-red-200">
              Health Mediators
            </p>
            <h3 className="relative mt-1 text-lg font-bold text-white">
              Are you a health mediator?
            </h3>
            <p className="relative mt-1 text-sm text-red-100">
              Access professional tools to support your community.
            </p>
            <Link
              href="/mediator"
              className="relative mt-4 inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-semibold text-[#C0392B] transition-all hover:bg-red-50 active:scale-95"
            >
              Mediator dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}

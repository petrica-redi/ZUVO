import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import {
  Search, Stethoscope, Syringe, Navigation, BookOpen,
  MapPin, Shield, User, Settings, ChevronRight, Heart, Activity,
  Scale, GraduationCap,
} from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "more" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const SECTIONS = [
  {
    id: "tools" as const,
    items: [
      { href: "/scan", icon: Search, key: "scan", gradient: "from-amber-400 to-orange-500" },
      { href: "/symptoms", icon: Activity, key: "symptoms", gradient: "from-red-500 to-rose-600" },
      { href: "/consult", icon: Stethoscope, key: "consult", gradient: "from-violet-500 to-purple-600" },
      { href: "/vaccines", icon: Syringe, key: "vaccines", gradient: "from-emerald-500 to-green-600" },
      { href: "/navigate", icon: Navigation, key: "navigate", gradient: "from-cyan-500 to-blue-600" },
    ],
  },
  {
    id: "learn" as const,
    items: [
      { href: "/learn", icon: BookOpen, key: "topics", gradient: "from-sky-500 to-blue-600" },
      { href: "/students", icon: GraduationCap, key: "students", gradient: "from-teal-500 to-emerald-600" },
      { href: "/quiz", icon: GraduationCap, key: "quiz", gradient: "from-amber-500 to-orange-600" },
      { href: "/glossary", icon: BookOpen, key: "glossary", gradient: "from-teal-500 to-cyan-600" },
      { href: "/rights", icon: Scale, key: "rights", gradient: "from-violet-500 to-purple-600" },
      { href: "/stories", icon: Heart, key: "stories", gradient: "from-rose-500 to-pink-600" },
      { href: "/regions/romania", icon: MapPin, key: "regions", gradient: "from-red-500 to-red-700" },
    ],
  },
  {
    id: "professional" as const,
    items: [
      { href: "/mediator", icon: Shield, key: "mediator", gradient: "from-teal-600 to-cyan-700" },
    ],
  },
  {
    id: "account" as const,
    items: [
      { href: "/profile", icon: User, key: "profile", gradient: "from-gray-500 to-gray-600" },
      { href: "/about", icon: Settings, key: "about", gradient: "from-gray-400 to-gray-500" },
    ],
  },
];

export default async function MorePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "more" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <h1
            className="mb-6 font-display text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] animate-fade-in-up"
            style={{ letterSpacing: "-0.025em" }}
          >
            {t("title")}
          </h1>

          {SECTIONS.map((section, si) => (
            <div
              key={section.id}
              className="mb-6 animate-fade-in-up"
              style={{ animationDelay: `${(si + 1) * 100}ms` }}
            >
              <h2 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-[var(--color-text-muted)]">
                {t(`sections.${section.id}`)}
              </h2>
              <div className="overflow-hidden rounded-3xl bg-[var(--color-surface)] hairline shadow-1">
                {section.items.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-subtle)] ${
                      i > 0 ? "border-t border-[var(--color-border-subtle)]" : ""
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-2`}
                    >
                      <item.icon className="lucide h-5 w-5 text-white" strokeWidth={1.85} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        {t(`items.${item.key}Label`)}
                      </span>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {t(`items.${item.key}Desc`)}
                      </p>
                    </div>
                    <ChevronRight className="lucide h-5 w-5 flex-shrink-0 text-[var(--color-text-muted)]" strokeWidth={1.75} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

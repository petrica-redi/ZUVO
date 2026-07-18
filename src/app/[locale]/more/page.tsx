import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import {
  Search, Stethoscope, Syringe, Navigation, BookOpen,
  MapPin, Shield, User, Settings, ChevronRight, Heart, Activity,
  Scale, GraduationCap, Sparkles,
} from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "more" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

type Tone = "brand" | "ember" | "ink" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  brand: "tile-brand",
  ember: "tile-ember",
  ink: "tile-ink",
  danger: "tile-danger",
};

const SECTIONS = [
  {
    id: "access" as const,
    items: [
      { href: "/help", icon: Heart, key: "help", tone: "danger" as Tone },
      { href: "/providers", icon: MapPin, key: "providers", tone: "brand" as Tone },
      { href: "/navigate", icon: Navigation, key: "navigate", tone: "brand" as Tone },
    ],
  },
  {
    id: "tools" as const,
    items: [
      { href: "/scan", icon: Search, key: "scan", tone: "ember" as Tone },
      { href: "/symptoms", icon: Activity, key: "symptoms", tone: "danger" as Tone },
      { href: "/consult", icon: Stethoscope, key: "consult", tone: "ink" as Tone },
      { href: "/vaccines", icon: Syringe, key: "vaccines", tone: "brand" as Tone },
      { href: "/navigate", icon: Navigation, key: "navigate", tone: "brand" as Tone },
    ],
  },
  {
    id: "learn" as const,
    items: [
      { href: "/learn", icon: BookOpen, key: "topics", tone: "ink" as Tone },
      { href: "/students", icon: GraduationCap, key: "students", tone: "brand" as Tone },
      { href: "/quiz", icon: GraduationCap, key: "quiz", tone: "ember" as Tone },
      { href: "/glossary", icon: BookOpen, key: "glossary", tone: "ink" as Tone },
      { href: "/rights", icon: Scale, key: "rights", tone: "ink" as Tone },
      { href: "/stories", icon: Heart, key: "stories", tone: "danger" as Tone },
      { href: "/regions/romania", icon: MapPin, key: "regions", tone: "brand" as Tone },
    ],
  },
  {
    id: "professional" as const,
    items: [
      { href: "/mediator", icon: Shield, key: "mediator", tone: "brand" as Tone },
      { href: "/demo", icon: Sparkles, key: "demo", tone: "ember" as Tone },
    ],
  },
  {
    id: "account" as const,
    items: [
      { href: "/profile", icon: User, key: "profile", tone: "ink" as Tone },
      { href: "/about", icon: Settings, key: "about", tone: "ink" as Tone },
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
            className="font-headline mb-6 text-3xl text-[var(--color-text-primary)] animate-fade-in-up"
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
              <div className="overflow-hidden rounded-3xl bg-[var(--color-surface)] hairline shadow-2">
                {section.items.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`press group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-[var(--color-surface-hover)] active:bg-[var(--color-surface-subtle)] ${
                      i > 0 ? "border-t border-[var(--color-border-subtle)]" : ""
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${TONE_CLASS[item.tone]} transition-transform duration-200 group-hover:scale-[1.06]`}
                    >
                      <item.icon className="lucide h-5 w-5 text-white" strokeWidth={1.9} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        {t(`items.${item.key}Label`)}
                      </span>
                      <p className="truncate text-xs text-[var(--color-text-secondary)]">
                        {t(`items.${item.key}Desc`)}
                      </p>
                    </div>
                    <ChevronRight className="lucide h-5 w-5 flex-shrink-0 text-[var(--color-text-muted)] transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={1.75} />
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

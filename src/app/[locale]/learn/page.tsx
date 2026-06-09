import type { Metadata } from "next";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { LearnProgressClient } from "@/components/LearnProgressClient";
import { getPillar } from "@/data/content";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pillars" });
  return { title: t("title"), description: t("title") };
}

const PILLARS = [
  { id: "prevention", emoji: "🛡️", color: "#16A34A", href: "/learn/prevention" },
  { id: "nutrition",  emoji: "🥗", color: "#2563EB", href: "/learn/nutrition"  },
  { id: "maternal",   emoji: "🤱", color: "#9333EA", href: "/learn/maternal"   },
  { id: "children",   emoji: "👶", color: "#EA580C", href: "/learn/children"   },
  { id: "chronic",    emoji: "💊", color: "#DC2626", href: "/learn/chronic"    },
  { id: "mental",     emoji: "🧠", color: "#0891B2", href: "/learn/mental"     },
] as const;

export default async function LearnPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pillars" });
  const tLearn = await getTranslations({ locale, namespace: "learn" });

  const pillarsWithCounts = PILLARS.map((p) => ({
    ...p,
    total: getPillar(p.id)?.modules.length ?? 0,
  }));

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-8">
          <h1 className="mb-2 text-2xl font-bold text-[var(--color-text-primary)]">{t("title")}</h1>
          <p className="mb-6 text-sm text-[var(--color-text-secondary)]">{tLearn("continueLabel")}</p>
          <LearnProgressClient pillars={pillarsWithCounts} pillarNames={PILLARS.map(p => t(p.id))} continueLabel={tLearn("continueLabel")} progressLabel={tLearn("progressLabel")} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

import type { Metadata } from "next";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { getPillar, PILLARS } from "@/data/content";

const VALID = ["prevention", "nutrition", "maternal", "children", "chronic", "mental"] as const;

type Props = {
  params: Promise<{ locale: string; pillar: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, pillar } = await params;
  if (!VALID.includes(pillar as (typeof VALID)[number])) return {};
  const t = await getTranslations({ locale, namespace: "pillars" });
  return { title: t(pillar as (typeof VALID)[number]) };
}

export async function generateStaticParams() {
  return VALID.map((pillar) => ({ pillar }));
}

export default async function PillarPage({ params }: Props) {
  const { locale, pillar: pillarId } = await params;
  if (!VALID.includes(pillarId as (typeof VALID)[number])) notFound();

  const pillar = getPillar(pillarId);
  if (!pillar) notFound();

  const t = await getTranslations({ locale, namespace: "pillars" });
  const tLearn = await getTranslations({ locale, namespace: "learn" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const tKey = (key: string) => {
    const stripped = key.replace("learn.", "");
    return tLearn(stripped);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pb-2">
        <div className="px-5 py-6">
          {/* Back */}
          <Link
            href="/learn"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("title")}
          </Link>

          {/* Pillar header */}
          <div
            className="mb-6 rounded-2xl p-5"
            style={{ backgroundColor: pillar.bg, borderColor: pillar.borderColor, borderWidth: 1 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{pillar.emoji}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t(pillarId as (typeof VALID)[number])}</h1>
                <p className="mt-1 text-sm text-gray-600">{tKey(pillar.descriptionKey.replace("learn.", ""))}</p>
              </div>
            </div>
          </div>

          {/* Module list */}
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
            {tLearn("allModules")} ({pillar.modules.length})
          </h2>
          <div className="flex flex-col gap-2">
            {pillar.modules.map((mod, i) => (
              <Link
                key={mod.id}
                href={`/learn/${pillarId}/${mod.id}`}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl text-xl" style={{ backgroundColor: pillar.bg }}>
                  {mod.emoji}
                </span>
                <div className="flex-1">
                  <span className="font-semibold text-gray-800">
                    {tKey(mod.titleKey.replace("learn.", ""))}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {mod.durationMin} {tCommon("minutes")}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

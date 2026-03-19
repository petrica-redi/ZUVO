/**
 * Module detail page — /learn/[pillar]/[module]
 *
 * Renders the full learning module with:
 *  - Header with pillar color accent
 *  - Description
 *  - Key tips (with icons)
 *  - Did-you-know fact
 *  - Action step
 *  - Mark as complete button
 */
import type { Metadata } from "next";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronLeft, Clock, CheckCircle2, Lightbulb, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { getPillar, getModule, getModuleIndex } from "@/data/content";

type Props = {
  params: Promise<{ locale: string; pillar: string; module: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, pillar, module: moduleId } = await params;
  const mod = getModule(pillar, moduleId);
  if (!mod) return {};
  const t = await getTranslations({ locale, namespace: "learn" });
  return { title: t(mod.titleKey.replace("learn.", "")) };
}

export async function generateStaticParams() {
  const { PILLARS } = await import("@/data/content");
  return PILLARS.flatMap((p) =>
    p.modules.map((m) => ({ pillar: p.id, module: m.id }))
  );
}

export default async function ModulePage({ params }: Props) {
  const { locale, pillar: pillarId, module: moduleId } = await params;

  const pillar = getPillar(pillarId);
  const mod = getModule(pillarId, moduleId);
  if (!pillar || !mod) notFound();

  const moduleIdx = getModuleIndex(pillarId, moduleId);
  const nextModule = pillar.modules[moduleIdx + 1];

  const t = await getTranslations({ locale, namespace: "learn" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  // Strip "learn." prefix for translation lookup
  const tKey = (key: string) => {
    const stripped = key.replace("learn.", "");
    return t(stripped);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pb-28 pt-14">
        <div className="mx-auto max-w-lg px-5 py-6">
          {/* Back link */}
          <Link
            href={`/learn/${pillarId}`}
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
            {tKey(`${pillarId}.description`).slice(0, 30)}...
          </Link>

          {/* Module header */}
          <div
            className="mb-6 rounded-2xl p-6"
            style={{ backgroundColor: pillar.bg, borderColor: pillar.borderColor, borderWidth: 1 }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="text-3xl">{mod.emoji}</span>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{tKey(mod.titleKey.replace("learn.", ""))}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{mod.durationMin} {tCommon("minutes")}</span>
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {tKey(mod.descriptionKey.replace("learn.", ""))}
            </p>
          </div>

          {/* Key tips */}
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-full text-sm" style={{ backgroundColor: pillar.bg }}>
              💡
            </span>
            {tCommon("keyTips")}
          </h2>
          <div className="mb-6 flex flex-col gap-2">
            {mod.tips.map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <span className="mt-0.5 text-xl">{tip.icon}</span>
                <p className="flex-1 text-sm leading-relaxed text-gray-700">
                  {tKey(tip.textKey.replace("learn.", ""))}
                </p>
              </div>
            ))}
          </div>

          {/* Did you know */}
          <div className="mb-6 rounded-xl border-l-4 bg-amber-50 p-4" style={{ borderColor: "#EAB308" }}>
            <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-amber-800">
              <Lightbulb className="h-4 w-4" />
              {tCommon("didYouKnow")}
            </h3>
            <p className="text-sm leading-relaxed text-amber-900">
              {tKey(mod.factKey.replace("learn.", ""))}
            </p>
          </div>

          {/* Action step */}
          <div className="mb-8 rounded-xl bg-white p-4 shadow-sm border-2" style={{ borderColor: pillar.color }}>
            <h3 className="mb-1 flex items-center gap-2 text-sm font-bold" style={{ color: pillar.color }}>
              <CheckCircle2 className="h-4 w-4" />
              {tCommon("actionStep")}
            </h3>
            <p className="text-sm leading-relaxed text-gray-700">
              {tKey(mod.actionKey.replace("learn.", ""))}
            </p>
          </div>

          {/* Mark complete button */}
          <MarkCompleteButton
            pillarId={pillarId}
            moduleId={moduleId}
            completeLabel={tCommon("markComplete")}
            completedLabel={tCommon("completed")}
            pillarColor={pillar.color}
          />

          {/* Next module link */}
          {nextModule && (
            <Link
              href={`/learn/${pillarId}/${nextModule.id}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3 text-sm font-medium text-gray-600 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              {tCommon("next")}: {nextModule.emoji} {tKey(nextModule.titleKey.replace("learn.", ""))}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

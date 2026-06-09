"use client";

import { useState } from "react";
import { ArrowLeft, Heart, Quote, BookOpen, Stethoscope, Scale, MessageCircle, Syringe } from "lucide-react";
import { useTranslations } from "next-intl";
import { STORIES, CATEGORY_CONFIG, CATEGORY_NEXT_STEPS, type Story } from "@/data/stories";
import { useRouter } from "@/navigation";

const STEP_ICONS = {
  vaccineGuide: Syringe,
  askZuvo: MessageCircle,
  explainPrescription: BookOpen,
  navigateToCare: Stethoscope,
  knowYourRights: Scale,
  learnPrevention: BookOpen,
  checkSymptoms: Stethoscope,
  learnMentalHealth: BookOpen,
} as const;

type CategoryKey = keyof typeof CATEGORY_CONFIG;

export function CommunityStories() {
  const t = useTranslations("stories");
  const tc = useTranslations("common");
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const router = useRouter();

  const filtered = activeCategory === "all" ? STORIES : STORIES.filter((s) => s.category === activeCategory);

  if (activeStory) {
    const config = CATEGORY_CONFIG[activeStory.category];
    const entry = t.raw(`entries.${activeStory.id}`) as { name: string; age: number; country: string; title: string; story: string; lesson: string };
    const nextSteps = CATEGORY_NEXT_STEPS[activeStory.category];

    return (
      <div className="animate-fade-in">
        <button onClick={() => setActiveStory(null)} className="mb-4 flex items-center gap-1 text-[13px] font-semibold text-gray-500">
          <ArrowLeft className="h-4 w-4" /> {t("backToStories")}
        </button>

        <div className="rounded-2xl bg-white p-5 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-4xl">{activeStory.avatar}</span>
            <div>
              <h2 className="text-[16px] font-black text-gray-900">{entry.name}, {entry.age}</h2>
              <p className="text-[12px] text-gray-500">{activeStory.flag} {entry.country}</p>
            </div>
          </div>

          <h3 className="mb-3 text-[15px] font-bold text-gray-900">{entry.title}</h3>

          <div className="relative mb-4 rounded-xl bg-gray-50 p-4">
            <Quote className="absolute -top-2 -left-1 h-6 w-6 text-gray-200" />
            <p className="text-[14px] leading-relaxed text-gray-700">{entry.story}</p>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: config.color + "10", border: `1px solid ${config.color}25` }}>
            <p className="text-[11px] font-black uppercase tracking-wider mb-1" style={{ color: config.color }}>
              {config.emoji} {t("lessonLearned")}
            </p>
            <p className="text-[13px] font-bold leading-relaxed text-gray-800">{entry.lesson}</p>
          </div>

          {nextSteps && (
            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">{t("whatToDoNext")}</p>
              <div className="flex flex-wrap gap-2">
                {nextSteps.map((step) => {
                  const Icon = STEP_ICONS[step.key as keyof typeof STEP_ICONS] ?? BookOpen;
                  return (
                    <button
                      key={step.href}
                      onClick={() => router.push(step.href)}
                      className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                      {t(`nextSteps.${step.key}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center animate-fade-in-up">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-xl shadow-rose-500/25">
          <Heart className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-[22px] font-black text-gray-900">{t("title")}</h1>
        <p className="mt-2 text-[13px] text-gray-500">{t("subtitle")}</p>
      </div>

      <div className="scrollbar-none mb-4 -mx-4 flex gap-2 overflow-x-auto px-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold ${
            activeCategory === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-600"
          }`}
          style={activeCategory !== "all" ? { border: "1px solid rgba(0,0,0,0.06)" } : undefined}
        >
          {tc("all")}
        </button>
        {(Object.keys(CATEGORY_CONFIG) as CategoryKey[]).map((key) => {
          const config = CATEGORY_CONFIG[key];
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold ${
                activeCategory === key ? "text-white" : "bg-white text-gray-600"
              }`}
              style={activeCategory === key ? { backgroundColor: config.color } : { border: "1px solid rgba(0,0,0,0.06)" }}
            >
              {config.emoji} {t(`categories.${key}`)}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.map((story) => {
          const config = CATEGORY_CONFIG[story.category];
          const entry = t.raw(`entries.${story.id}`) as { name: string; age: number; country: string; title: string; story: string };
          return (
            <button
              key={story.id}
              onClick={() => setActiveStory(story)}
              className="card-hover w-full rounded-2xl bg-white p-4 text-left shadow-sm"
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div className="mb-2 flex items-center gap-3">
                <span className="text-3xl">{story.avatar}</span>
                <div className="flex-1">
                  <span className="text-[14px] font-bold text-gray-900">{entry.name}, {entry.age}</span>
                  <p className="text-[11px] text-gray-400">{story.flag} {entry.country}</p>
                </div>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: config.color + "15", color: config.color }}>
                  {t(`categories.${story.category}`)}
                </span>
              </div>
              <p className="text-[14px] font-bold text-gray-800">{entry.title}</p>
              <p className="mt-1 text-[12px] text-gray-500 line-clamp-2">{entry.story}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

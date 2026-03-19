"use client";

import { useState } from "react";
import { ArrowLeft, Heart, Quote } from "lucide-react";
import { STORIES, CATEGORY_CONFIG, type Story } from "@/data/stories";

type CategoryKey = keyof typeof CATEGORY_CONFIG;

export function CommunityStories() {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");

  const filtered = activeCategory === "all" ? STORIES : STORIES.filter((s) => s.category === activeCategory);

  if (activeStory) {
    const config = CATEGORY_CONFIG[activeStory.category];
    return (
      <div className="animate-fade-in">
        <button onClick={() => setActiveStory(null)} className="mb-4 flex items-center gap-1 text-[13px] font-semibold text-gray-500">
          <ArrowLeft className="h-4 w-4" /> Back to stories
        </button>

        <div className="rounded-2xl bg-white p-5 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-4xl">{activeStory.avatar}</span>
            <div>
              <h2 className="text-[16px] font-black text-gray-900">{activeStory.name}, {activeStory.age}</h2>
              <p className="text-[12px] text-gray-500">{activeStory.flag} {activeStory.country}</p>
            </div>
          </div>

          <h3 className="mb-3 text-[15px] font-bold text-gray-900">{activeStory.title}</h3>

          <div className="relative mb-4 rounded-xl bg-gray-50 p-4">
            <Quote className="absolute -top-2 -left-1 h-6 w-6 text-gray-200" />
            <p className="text-[14px] leading-relaxed text-gray-700">{activeStory.story}</p>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: config.color + "10", border: `1px solid ${config.color}25` }}>
            <p className="text-[11px] font-black uppercase tracking-wider mb-1" style={{ color: config.color }}>
              {config.emoji} Lesson learned
            </p>
            <p className="text-[13px] font-bold leading-relaxed text-gray-800">{activeStory.lesson}</p>
          </div>
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
        <h1 className="text-[22px] font-black text-gray-900">Community Stories</h1>
        <p className="mt-2 text-[13px] text-gray-500">
          Real experiences from Roma communities. Learn from others.
        </p>
      </div>

      {/* Category pills */}
      <div className="scrollbar-none mb-4 -mx-4 flex gap-2 overflow-x-auto px-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold ${
            activeCategory === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-600"
          }`}
          style={activeCategory !== "all" ? { border: "1px solid rgba(0,0,0,0.06)" } : undefined}
        >
          All
        </button>
        {(Object.entries(CATEGORY_CONFIG) as [CategoryKey, typeof CATEGORY_CONFIG[CategoryKey]][]).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold ${
              activeCategory === key ? "text-white" : "bg-white text-gray-600"
            }`}
            style={activeCategory === key ? { backgroundColor: config.color } : { border: "1px solid rgba(0,0,0,0.06)" }}
          >
            {config.emoji} {config.label}
          </button>
        ))}
      </div>

      {/* Story cards */}
      <div className="space-y-3">
        {filtered.map((story) => {
          const config = CATEGORY_CONFIG[story.category];
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
                  <span className="text-[14px] font-bold text-gray-900">{story.name}, {story.age}</span>
                  <p className="text-[11px] text-gray-400">{story.flag} {story.country}</p>
                </div>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: config.color + "15", color: config.color }}>
                  {config.label}
                </span>
              </div>
              <p className="text-[14px] font-bold text-gray-800">{story.title}</p>
              <p className="mt-1 text-[12px] text-gray-500 line-clamp-2">{story.story}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

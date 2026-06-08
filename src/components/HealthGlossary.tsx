"use client";

import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { GLOSSARY, CATEGORY_CONFIG } from "@/data/glossary";

type CategoryKey = keyof typeof CATEGORY_CONFIG;

export function HealthGlossary() {
  const t = useTranslations("glossary");
  const tc = useTranslations("common");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = GLOSSARY.filter((entry) => {
    const term = t(`entries.${entry.id}.term`).toLowerCase();
    const simple = t(`entries.${entry.id}.simple`).toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch = !search || term.includes(q) || simple.includes(q);
    const matchesCategory = activeCategory === "all" || entry.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-5 text-center animate-fade-in-up">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-xl shadow-teal-500/25">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-[22px] font-black text-gray-900">{t("title")}</h1>
        <p className="mt-2 text-[13px] text-gray-500">{t("subtitle")}</p>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
        <Search className="h-5 w-5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t("searchAria")}
          placeholder={t("searchPlaceholder")}
          className="flex-1 bg-transparent text-[14px] focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-[12px] font-bold text-[#C0392B]">{tc("clear")}</button>
        )}
      </div>

      <div className="scrollbar-none mb-4 -mx-4 flex gap-2 overflow-x-auto px-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all ${
            activeCategory === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-600"
          }`}
          style={activeCategory !== "all" ? { border: "1px solid rgba(0,0,0,0.06)" } : undefined}
        >
          {t("allCount", { count: GLOSSARY.length })}
        </button>
        {(Object.keys(CATEGORY_CONFIG) as CategoryKey[]).map((key) => {
          const config = CATEGORY_CONFIG[key];
          const count = GLOSSARY.filter((e) => e.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all ${
                activeCategory === key ? "text-white" : "bg-white text-gray-600"
              }`}
              style={activeCategory === key ? { backgroundColor: config.color } : { border: "1px solid rgba(0,0,0,0.06)" }}
            >
              {t(`categories.${key}`)} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-[14px] text-gray-400">{t("noResults")}</p>
          </div>
        )}
        {filtered.map((entry) => {
          const config = CATEGORY_CONFIG[entry.category];
          const term = t(`entries.${entry.id}.term`);
          return (
            <button
              key={entry.id}
              onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
              className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition-all active:scale-[0.99]"
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{entry.emoji}</span>
                <div className="flex-1">
                  <span className="text-[15px] font-bold text-gray-900">{term}</span>
                  <span className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${config.bg} ${config.border}`} style={{ color: config.color }}>
                    {t(`categories.${entry.category}`)}
                  </span>
                </div>
              </div>
              {expanded === entry.id && (
                <div className="mt-3 rounded-xl bg-gray-50 p-3 animate-fade-in">
                  <p className="text-[13px] leading-relaxed text-gray-700">{t(`entries.${entry.id}.simple`)}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

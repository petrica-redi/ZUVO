"use client";

import { useState } from "react";
import { Search, BookOpen } from "lucide-react";
import { GLOSSARY, CATEGORY_CONFIG, type GlossaryEntry } from "@/data/glossary";

type CategoryKey = keyof typeof CATEGORY_CONFIG;

export function HealthGlossary() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = GLOSSARY.filter((entry) => {
    const matchesSearch = !search || entry.term.toLowerCase().includes(search.toLowerCase()) || entry.simple.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || entry.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-5 text-center animate-fade-in-up">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-xl shadow-teal-500/25">
          <BookOpen className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-[22px] font-black text-gray-900">Health Glossary</h1>
        <p className="mt-2 text-[13px] text-gray-500">
          Medical terms explained in simple words.
        </p>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.04)" }}>
        <Search className="h-5 w-5 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="flex-1 bg-transparent text-[14px] focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-[12px] font-bold text-[#C0392B]">Clear</button>
        )}
      </div>

      {/* Category pills */}
      <div className="scrollbar-none mb-4 -mx-4 flex gap-2 overflow-x-auto px-4">
        <button
          onClick={() => setActiveCategory("all")}
          className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold transition-all ${
            activeCategory === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-600"
          }`}
          style={activeCategory !== "all" ? { border: "1px solid rgba(0,0,0,0.06)" } : undefined}
        >
          All ({GLOSSARY.length})
        </button>
        {(Object.entries(CATEGORY_CONFIG) as [CategoryKey, typeof CATEGORY_CONFIG[CategoryKey]][]).map(([key, config]) => {
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
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Results */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-[14px] text-gray-400">No terms found. Try a different search.</p>
          </div>
        )}
        {filtered.map((entry) => {
          const config = CATEGORY_CONFIG[entry.category];
          return (
            <button
              key={entry.term}
              onClick={() => setExpanded(expanded === entry.term ? null : entry.term)}
              className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition-all active:scale-[0.99]"
              style={{ border: "1px solid rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{entry.emoji}</span>
                <div className="flex-1">
                  <span className="text-[15px] font-bold text-gray-900">{entry.term}</span>
                  <span className={`ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${config.bg} ${config.border}`} style={{ color: config.color }}>
                    {config.label}
                  </span>
                </div>
              </div>
              {expanded === entry.term && (
                <div className="mt-3 rounded-xl bg-gray-50 p-3 animate-fade-in">
                  <p className="text-[13px] leading-relaxed text-gray-700">{entry.simple}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

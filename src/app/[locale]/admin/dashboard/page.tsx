"use client";

import { useEffect, useState } from "react";
import { getPlatformConfig, savePlatformConfig, logoutAdmin } from "@/lib/admin/actions";
import {
  FONT_DISPLAY_OPTIONS,
  FONT_EDITORIAL_OPTIONS,
  FONT_SANS_OPTIONS,
} from "@/lib/admin/fonts";
import { LogOut, Save, Image as ImageIcon, Type, Code } from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [config, setConfig] = useState({
    logoUrl: "",
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    heroLayout: "split",
    fontSans: "",
    fontDisplay: "",
    fontEditorial: "",
    customCss: "",
  });

  useEffect(() => {
    getPlatformConfig().then((data) => {
      if (data) {
        setConfig({
          logoUrl: data.logoUrl || "",
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          heroImage: data.heroImage || "",
          heroLayout: data.heroLayout || "split",
          fontSans: data.fontSans || "",
          fontDisplay: data.fontDisplay || "",
          fontEditorial: data.fontEditorial || "",
          customCss: data.customCss || "",
        });
      }
      setLoading(false);
    });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    const res = await savePlatformConfig(config);
    if (res.success) {
      setMessage({ type: "success", text: "Settings saved! Refresh the site to see font changes." });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save settings." });
    }
    setSaving(false);
  }

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F9FF] to-[#ECFDF5] pb-20">
      <header className="border-b border-[var(--color-border-subtle)] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">
            Platform CMS
          </h1>
          <button
            onClick={() => logoutAdmin()}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-5xl px-6">
        {message.text && (
          <div
            className={`mb-6 rounded-lg p-4 ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <ImageIcon className="h-5 w-5 text-[var(--color-blue-600)]" />
              Global Branding
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Logo Image URL</label>
              <input
                type="text"
                value={config.logoUrl}
                onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png (leave blank for default)"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Type className="h-5 w-5 text-[var(--color-brand-600)]" />
              Typography
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Body font (UI)</label>
                <select
                  value={config.fontSans}
                  onChange={(e) => setConfig({ ...config, fontSans: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Default (Inter)</option>
                  {FONT_SANS_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Display font (headings)</label>
                <select
                  value={config.fontDisplay}
                  onChange={(e) => setConfig({ ...config, fontDisplay: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Default (Geist)</option>
                  {FONT_DISPLAY_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Editorial font (hero)</label>
                <select
                  value={config.fontEditorial}
                  onChange={(e) => setConfig({ ...config, fontEditorial: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Default (Fraunces)</option>
                  {FONT_EDITORIAL_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Type className="h-5 w-5 text-[var(--color-blue-600)]" />
              Hero Section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hero Title Override</label>
                <input
                  type="text"
                  value={config.heroTitle}
                  onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                  placeholder="Leave blank to use translations"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hero Subtitle Override</label>
                <textarea
                  value={config.heroSubtitle}
                  onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                  placeholder="Leave blank to use translations"
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hero Background Image URL</label>
                <input
                  type="text"
                  value={config.heroImage}
                  onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                  placeholder="/images/ai/ai-hero-wellbeing.png"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hero Layout</label>
                <select
                  value={config.heroLayout}
                  onChange={(e) => setConfig({ ...config, heroLayout: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="split">Split (Text left, Image right/bg)</option>
                  <option value="center">Centered</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Code className="h-5 w-5 text-gray-500" />
              Advanced CSS
            </h2>
            <textarea
              value={config.customCss}
              onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
              placeholder=":root { --color-accent: #2563EB; }"
              rows={5}
              className="mt-1 w-full font-mono text-sm rounded-md border border-gray-300 p-2"
            />
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full gradient-brand px-6 py-3 font-semibold text-white shadow-brand disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

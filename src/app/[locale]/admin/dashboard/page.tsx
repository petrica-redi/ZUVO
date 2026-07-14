"use client";

import { useEffect, useState } from "react";
import { getPlatformConfig, savePlatformConfig, logoutAdmin } from "@/lib/admin/actions";
import {
  FONT_DISPLAY_OPTIONS,
  FONT_EDITORIAL_OPTIONS,
  FONT_SANS_OPTIONS,
} from "@/lib/admin/fonts";
import { AdminPersonaSwitcher } from "@/components/admin/AdminPersonaSwitcher";
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
      setMessage({ type: "success", text: "Settings saved! Refresh the site to see changes." });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save settings." });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-canvas)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-blue-600)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-canvas)] pb-20">
      <header className="sticky top-0 z-30 border-b border-[var(--color-border-subtle)] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-display text-xl font-extrabold text-[var(--color-text-primary)]">
              Admin CMS
            </h1>
            <p className="text-xs text-[var(--color-text-muted)]">Redi Health platform configuration</p>
          </div>
          <button
            type="button"
            onClick={() => logoutAdmin()}
            className="flex items-center gap-2 rounded-xl border border-[var(--color-border-subtle)] px-4 py-2 text-sm font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-neutral-50)]"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-5xl space-y-8 px-6">
        <AdminPersonaSwitcher />

        {message.text && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "bg-[#ECFDF5] text-[#065F46]"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <section className="rounded-3xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2">
            <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-extrabold text-[var(--color-text-primary)]">
              <ImageIcon className="h-5 w-5 text-[var(--color-blue-600)]" />
              Branding
            </h2>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
              Logo URL
            </label>
            <input
              type="url"
              value={config.logoUrl}
              onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
              placeholder="https://… (leave blank for default)"
              className="mt-2 w-full rounded-xl border border-[var(--color-border-default)] px-4 py-3 text-sm focus:border-[var(--color-blue-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-600)]/20"
            />
          </section>

          <section className="rounded-3xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2">
            <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-extrabold text-[var(--color-text-primary)]">
              <Type className="h-5 w-5 text-[var(--color-brand-600)]" />
              Typography
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { key: "fontSans" as const, label: "Body font", options: FONT_SANS_OPTIONS, fallback: "Inter" },
                { key: "fontDisplay" as const, label: "Headings", options: FONT_DISPLAY_OPTIONS, fallback: "Geist" },
                { key: "fontEditorial" as const, label: "Hero / editorial", options: FONT_EDITORIAL_OPTIONS, fallback: "Fraunces" },
              ].map(({ key, label, options, fallback }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)]">{label}</label>
                  <select
                    value={config[key]}
                    onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-[var(--color-border-default)] px-3 py-2.5 text-sm"
                  >
                    <option value="">Default ({fallback})</option>
                    {options.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2">
            <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-extrabold text-[var(--color-text-primary)]">
              <Type className="h-5 w-5 text-[var(--color-blue-600)]" />
              Hero section
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Title override</label>
                <input
                  type="text"
                  value={config.heroTitle}
                  onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[var(--color-border-default)] px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Subtitle override</label>
                <textarea
                  value={config.heroSubtitle}
                  onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-[var(--color-border-default)] px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Hero image URL</label>
                <input
                  type="text"
                  value={config.heroImage}
                  onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[var(--color-border-default)] px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Layout</label>
                <select
                  value={config.heroLayout}
                  onChange={(e) => setConfig({ ...config, heroLayout: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-[var(--color-border-default)] px-3 py-2.5 text-sm"
                >
                  <option value="split">Split</option>
                  <option value="center">Centered</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--color-border-subtle)] bg-white p-6 shadow-2">
            <h2 className="mb-5 flex items-center gap-2 font-display text-lg font-extrabold text-[var(--color-text-primary)]">
              <Code className="h-5 w-5 text-[var(--color-text-muted)]" />
              Custom CSS
            </h2>
            <textarea
              value={config.customCss}
              onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
              rows={5}
              className="w-full rounded-xl border border-[var(--color-border-default)] px-4 py-3 font-mono text-sm"
            />
          </section>

          <div className="flex justify-end pb-8">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#059669] px-8 py-3.5 font-bold text-white shadow-brand disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

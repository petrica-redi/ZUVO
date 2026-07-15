"use client";

import { useEffect, useState } from "react";
import { getPlatformConfig, savePlatformConfig, logoutAdmin } from "@/lib/admin/actions";
import {
  FONT_DISPLAY_OPTIONS,
  FONT_EDITORIAL_OPTIONS,
  FONT_SANS_OPTIONS,
} from "@/lib/admin/fonts";
import { AdminPersonaSwitcher } from "@/components/admin/AdminPersonaSwitcher";
import { AdminShellOptOut } from "@/components/admin/AdminShellOptOut";
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
    getPlatformConfig()
      .then((data) => {
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
      })
      .catch(() => {
        setMessage({ type: "error", text: "Could not load platform settings. You can still edit and save." });
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    const res = await savePlatformConfig(config);
    if (res.success) {
      setMessage({ type: "success", text: "Settings saved. Refresh the site to see changes." });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save settings." });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="admin-cms-page flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-ink-900)] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AdminShellOptOut />
      <div className="admin-cms-page min-h-screen pb-24">
        <header className="sticky top-0 z-40 border-b border-[var(--color-border-subtle)] bg-white/92 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Redi Health
              </p>
              <h1 className="font-headline text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                Platform CMS
              </h1>
            </div>
            <button
              type="button"
              onClick={() => logoutAdmin()}
              className="admin-btn-secondary inline-flex cursor-pointer items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </header>

        <main className="mx-auto mt-8 max-w-5xl space-y-6 px-6">
          <AdminPersonaSwitcher />

          {message.text ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "border-[var(--color-success-border)] bg-[var(--color-success-bg)] text-[var(--color-success-text)]"
                  : "border-[var(--color-danger-border)] bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]"
              }`}
            >
              {message.text}
            </div>
          ) : null}

          <form onSubmit={handleSave} className="space-y-6">
            <section className="admin-cms-section">
              <h2 className="admin-cms-section__title">
                <ImageIcon className="h-5 w-5 text-[var(--color-text-secondary)]" />
                Branding
              </h2>
              <label className="admin-cms-label">Logo URL</label>
              <input
                type="url"
                value={config.logoUrl}
                onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                placeholder="https://… (leave blank for default)"
                className="glass-input mt-2 w-full rounded-2xl px-4 py-3 text-sm"
              />
            </section>

            <section className="admin-cms-section">
              <h2 className="admin-cms-section__title">
                <Type className="h-5 w-5 text-[var(--color-text-secondary)]" />
                Typography
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { key: "fontSans" as const, label: "Body font", options: FONT_SANS_OPTIONS, fallback: "Inter" },
                  { key: "fontDisplay" as const, label: "Headings", options: FONT_DISPLAY_OPTIONS, fallback: "Geist" },
                  { key: "fontEditorial" as const, label: "Hero / editorial", options: FONT_EDITORIAL_OPTIONS, fallback: "Lora" },
                ].map(({ key, label, options, fallback }) => (
                  <div key={key}>
                    <label className="admin-cms-label">{label}</label>
                    <select
                      value={config[key]}
                      onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                      className="glass-input mt-2 w-full cursor-pointer rounded-2xl px-3 py-2.5 text-sm"
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

            <section className="admin-cms-section">
              <h2 className="admin-cms-section__title">
                <Type className="h-5 w-5 text-[var(--color-text-secondary)]" />
                Hero section
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="admin-cms-label">Title override</label>
                  <input
                    type="text"
                    value={config.heroTitle}
                    onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                    className="glass-input mt-2 w-full rounded-2xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="admin-cms-label">Subtitle override</label>
                  <textarea
                    value={config.heroSubtitle}
                    onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                    rows={3}
                    className="glass-input mt-2 w-full rounded-2xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="admin-cms-label">Hero image URL</label>
                  <input
                    type="text"
                    value={config.heroImage}
                    onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                    className="glass-input mt-2 w-full rounded-2xl px-4 py-3 text-sm"
                  />
                </div>
                <div>
                  <label className="admin-cms-label">Layout</label>
                  <select
                    value={config.heroLayout}
                    onChange={(e) => setConfig({ ...config, heroLayout: e.target.value })}
                    className="glass-input mt-2 w-full cursor-pointer rounded-2xl px-3 py-2.5 text-sm"
                  >
                    <option value="split">Split</option>
                    <option value="center">Centered</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="admin-cms-section">
              <h2 className="admin-cms-section__title">
                <Code className="h-5 w-5 text-[var(--color-text-secondary)]" />
                Custom CSS
              </h2>
              <textarea
                value={config.customCss}
                onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
                rows={5}
                className="glass-input w-full rounded-2xl px-4 py-3 font-mono text-sm"
              />
            </section>

            <div className="flex justify-end pb-4">
              <button
                type="submit"
                disabled={saving}
                className="admin-btn-primary inline-flex cursor-pointer items-center gap-2 px-8 py-3.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-5 w-5" />
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getPlatformConfig, savePlatformConfig, logoutAdmin } from "@/lib/admin/actions";
import { LogOut, Save, LayoutTemplate, Image as ImageIcon, Type, Code } from "lucide-react";

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
      setMessage({ type: "success", text: "Settings saved successfully! (Note: Requires DB migration to be applied)" });
    } else {
      setMessage({ type: "error", text: res.error || "Failed to save settings." });
    }
    setSaving(false);
  }

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">Platform Configuration</h1>
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
          <div className={`mb-6 rounded-lg p-4 ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Global Settings */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <ImageIcon className="h-5 w-5 text-blue-500" />
              Global Branding
            </h2>
            <div className="space-y-4">
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
            </div>
          </section>

          {/* Hero Section */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Type className="h-5 w-5 text-blue-500" />
              Hero Section (Landing Page)
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hero Title Override</label>
                <input
                  type="text"
                  value={config.heroTitle}
                  onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                  placeholder="Leave blank to use translations"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hero Subtitle Override</label>
                <textarea
                  value={config.heroSubtitle}
                  onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                  placeholder="Leave blank to use translations"
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hero Background Image URL</label>
                <input
                  type="text"
                  value={config.heroImage}
                  onChange={(e) => setConfig({ ...config, heroImage: e.target.value })}
                  placeholder="/images/ai/ai-hero-wellbeing.png"
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hero Layout</label>
                <select
                  value={config.heroLayout}
                  onChange={(e) => setConfig({ ...config, heroLayout: e.target.value })}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="split">Split (Text left, Image right/bg)</option>
                  <option value="center">Centered</option>
                </select>
              </div>
            </div>
          </section>

          {/* Advanced */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Code className="h-5 w-5 text-gray-500" />
              Advanced CSS
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Custom CSS Overrides</label>
              <textarea
                value={config.customCss}
                onChange={(e) => setConfig({ ...config, customCss: e.target.value })}
                placeholder=".mobile-shell { background: red; }"
                rows={5}
                className="mt-1 w-full font-mono text-sm rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </section>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow hover:bg-blue-700 disabled:opacity-50"
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

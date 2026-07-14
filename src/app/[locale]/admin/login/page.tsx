"use client";

import { useState } from "react";
import { Link, useRouter } from "@/navigation";
import { loginAdmin } from "@/lib/admin/actions";
import { Lock, LogIn, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const res = await loginAdmin(formData);
    if (res.success) {
      router.push("/admin/dashboard");
    } else {
      setError(res.error || "Login failed");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-canvas)] px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>

        <div className="overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-white shadow-3">
          <div className="bg-gradient-to-r from-[#1D4ED8] to-[#059669] px-8 py-7 text-center text-white">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <Lock className="h-7 w-7" strokeWidth={2} />
            </div>
            <h1 className="font-display text-2xl font-extrabold">Admin login</h1>
            <p className="mt-2 text-sm text-white/85">
              Sign in to manage content and preview the platform as any role
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-8">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text-secondary)]">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-xl border border-[var(--color-border-default)] px-4 py-3 text-sm transition-colors focus:border-[var(--color-blue-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-500)]/20"
                placeholder="petrica@redi-ngo.eu"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text-secondary)]">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-xl border border-[var(--color-border-default)] px-4 py-3 text-sm transition-colors focus:border-[var(--color-blue-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-500)]/20"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#059669] py-3.5 font-bold text-white shadow-brand transition-transform hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
            >
              <LogIn className="h-5 w-5" />
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

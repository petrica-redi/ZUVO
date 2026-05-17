"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTranslations } from "next-intl";

type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "sastipe_theme";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  return "system";
}

export function ThemeToggle() {
  const t = useTranslations("theme");
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setTheme(readStoredTheme());
      setMounted(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const cycle = () => {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    applyTheme(next);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label={t("ariaLabel")}
        className="h-9 w-9 rounded-xl bg-[var(--color-surface-subtle)] hairline"
      />
    );
  }

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const label =
    theme === "light" ? t("light") : theme === "dark" ? t("dark") : t("system");

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={t("switchTo", { label })}
      title={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-surface-subtle)] text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] active:scale-95 hairline"
    >
      <Icon className="lucide h-[18px] w-[18px]" strokeWidth={1.75} />
    </button>
  );
}

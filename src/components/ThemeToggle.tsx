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
  if (typeof window === "undefined") return "dark";
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* ignore */
  }
  // Aurora navy is the brand default when no preference is stored.
  return "dark";
}

export function ThemeToggle() {
  const t = useTranslations("theme");
  const [theme, setTheme] = useState<Theme>("dark");
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
      localStorage.setItem(STORAGE_KEY, next);
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
        className="glass-btn h-9 w-9 rounded-full"
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
      className="glass-btn flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
    >
      <Icon className="lucide h-[18px] w-[18px]" strokeWidth={1.75} />
    </button>
  );
}

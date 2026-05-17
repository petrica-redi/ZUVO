"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Share, Plus, X } from "lucide-react";

/**
 * Cross-platform install prompt.
 *
 * - Android / Chromium: listens for `beforeinstallprompt`, shows our native CTA.
 * - iOS Safari: detects iOS + non-standalone + non-WebView, surfaces the
 *   "Share -> Add to Home Screen" instructions (iOS does not expose a
 *   programmatic install API).
 * - Once installed (display-mode: standalone), the component renders nothing.
 *
 * Dismissal is sticky — we set `localStorage.sastipe_install_dismissed` so we
 * don't badger users who explicitly closed the prompt. They can re-trigger it
 * any time from /more.
 */

import { useTranslations } from "next-intl";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "sastipe_install_dismissed";
const DISMISS_TTL_DAYS = 30;

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // iPadOS 13+ reports as Mac; detect via touch-capable Mac as iPad fallback.
  const isIPad =
    /Mac/.test(ua) &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(ua) || isIPad;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  // iOS-specific
  return Boolean((navigator as unknown as { standalone?: boolean }).standalone);
}

function isInWebView(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  // Capacitor / Cordova / Twitter / Facebook in-app browsers.
  return (
    ua.includes("capacitor") ||
    ua.includes("cordova") ||
    ua.includes("fbav") ||
    ua.includes("instagram") ||
    ua.includes("line/") ||
    ua.includes("wv)")
  );
}

function readDismissed(): boolean {
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    if (!v) return false;
    const at = parseInt(v, 10);
    if (Number.isNaN(at)) return false;
    const ageDays = (Date.now() - at) / (1000 * 60 * 60 * 24);
    return ageDays < DISMISS_TTL_DAYS;
  } catch {
    return false;
  }
}

export function InstallPrompt() {
  const t = useTranslations("install");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fired = useRef(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (isStandalone() || isInWebView() || readDismissed()) {
        setMounted(true);
        return;
      }
      if (isIOS()) {
        // Only show on Safari (not in Chrome iOS WebKit shell).
        const ua = navigator.userAgent;
        if (/Safari/.test(ua) && !/CriOS|FxiOS/.test(ua)) {
          setShowIosHint(true);
        }
      }
      setMounted(true);
    }, 0);

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    const onInstalled = () => {
      setDeferredPrompt(null);
      setShowIosHint(false);
    };
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!mounted) return null;
  if (!deferredPrompt && !showIosHint) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* private mode — ignore */
    }
    setDeferredPrompt(null);
    setShowIosHint(false);
  };

  const triggerNativeInstall = async () => {
    if (!deferredPrompt || fired.current) return;
    fired.current = true;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "dismissed") dismiss();
    } finally {
      setDeferredPrompt(null);
    }
  };

  return (
    <div
      className="fixed inset-x-0 bottom-[88px] z-[60] mx-auto w-full max-w-md px-4 animate-fade-in-up"
      role="region"
      aria-label={t("installApp")}
    >
      <div className="glass-surface relative rounded-3xl p-4 shadow-3">
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismissAria")}
          className="absolute right-2 top-2 rounded-full p-1.5 text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
        >
          <X className="lucide h-4 w-4" strokeWidth={1.85} />
        </button>

        <div className="flex items-start gap-3 pr-6">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl gradient-brand grain-overlay shadow-brand">
            <Download className="lucide h-5 w-5 text-white" strokeWidth={1.85} />
          </div>
          <div className="flex-1 text-sm leading-snug">
            {deferredPrompt ? (
              <>
                <div className="font-display font-extrabold text-[var(--color-text-primary)]">
                  {t("installApp")}
                </div>
                <p className="mt-0.5 text-[var(--color-text-secondary)]">
                  {t("offlineAccess")}
                </p>
                <button
                  type="button"
                  onClick={triggerNativeInstall}
                  className="mt-3 inline-flex h-9 items-center gap-2 rounded-xl gradient-brand grain-overlay px-4 text-xs font-extrabold text-white shadow-brand active:scale-[0.97]"
                >
                  <Download className="lucide h-3.5 w-3.5" strokeWidth={2} />
                  {t("installButton")}
                </button>
              </>
            ) : (
              <>
                <div className="font-display font-extrabold text-[var(--color-text-primary)]">
                  {t("addToHome")}
                </div>
                <p className="mt-0.5 text-[var(--color-text-secondary)]">
                  {t("tap")}{" "}
                  <span
                    className="inline-flex h-5 w-5 -translate-y-px items-center justify-center rounded-md bg-[var(--color-surface-subtle)] align-middle"
                    aria-hidden
                  >
                    <Share className="lucide h-3 w-3" strokeWidth={1.85} />
                  </span>{" "}
                  {t("then")}{" "}
                  <span
                    className="inline-flex h-5 items-center gap-0.5 rounded-md bg-[var(--color-surface-subtle)] px-1.5 align-middle"
                    aria-hidden
                  >
                    <Plus className="lucide h-3 w-3" strokeWidth={1.85} />
                    {t("add")}
                  </span>{" "}
                  {t("toInstall")}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

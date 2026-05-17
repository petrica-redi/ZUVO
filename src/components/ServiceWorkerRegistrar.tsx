"use client";

import { useEffect } from "react";

/**
 * Registers the service worker after first paint so it never blocks hydration.
 *
 * - Skips registration in development (HMR conflicts with sw caching).
 * - Skips inside Capacitor / Cordova WebViews — those run from
 *   `capacitor://` or `file://` schemes which can't host a service worker
 *   and ship their own offline assets via the bundler.
 * - Detects worker updates and quietly activates them on next navigation.
 */
function isCapacitorWebView(): boolean {
  if (typeof window === "undefined") return false;
  // Capacitor injects a global; fall back to UA sniff.
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } })
    .Capacitor;
  if (cap?.isNativePlatform?.()) return true;
  return /capacitor|cordova/i.test(navigator.userAgent);
}

export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof navigator === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (isCapacitorWebView()) return;

    const id = window.setTimeout(() => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          registration.addEventListener("updatefound", () => {
            const sw = registration.installing;
            if (!sw) return;
            sw.addEventListener("statechange", () => {
              if (sw.state === "installed" && navigator.serviceWorker.controller) {
                // A new worker is waiting — let it take over on next reload.
              }
            });
          });
        })
        .catch(() => {
          /* sw is best-effort; swallow registration errors */
        });
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  return null;
}

"use client";

import { useEffect } from "react";
import { isNative } from "@/lib/native/bridge";

/**
 * One-time bootstrap for native shells.
 *
 * - Configures status bar + splash screen so the app feels native from launch.
 * - Hides the launch splash after first paint.
 * - Wires Android hardware-back to history navigation, with a fallback exit
 *   when the back stack is empty.
 *
 * Renders nothing; mount once in the root layout.
 */
export function CapacitorBootstrap() {
  useEffect(() => {
    if (!isNative()) return;

    let backHandler: { remove: () => void } | null = null;

    void (async () => {
      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#4F46E5" });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch {
        /* plugin not linked yet — non-fatal */
      }

      try {
        const { SplashScreen } = await import("@capacitor/splash-screen");
        // Give first paint a beat, then dismiss.
        window.setTimeout(() => {
          void SplashScreen.hide({ fadeOutDuration: 250 });
        }, 250);
      } catch {
        /* ignore */
      }

      try {
        const { App } = await import("@capacitor/app");
        backHandler = await App.addListener("backButton", ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            void App.exitApp();
          }
        });
      } catch {
        /* ignore */
      }
    })();

    return () => {
      backHandler?.remove?.();
    };
  }, []);

  return null;
}

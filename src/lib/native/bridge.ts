/**
 * Capacitor bridge — typed, defensive, web-safe.
 *
 * All helpers lazy-load the underlying plugin so the web bundle does not pull
 * native code, and every helper falls back gracefully when running in a plain
 * browser. UI code can call these unconditionally.
 *
 * Usage:
 *   import { isNative, hapticTap, openExternal } from "@/lib/native/bridge";
 *   if (await isNative()) hapticTap();
 */

type CapacitorWindow = {
  Capacitor?: {
    isNativePlatform?: () => boolean;
    getPlatform?: () => "ios" | "android" | "web";
  };
};

function getCapacitor():
  | { isNativePlatform: () => boolean; getPlatform: () => "ios" | "android" | "web" }
  | null {
  if (typeof window === "undefined") return null;
  const cap = (window as unknown as CapacitorWindow).Capacitor;
  if (!cap?.isNativePlatform) return null;
  return cap as {
    isNativePlatform: () => boolean;
    getPlatform: () => "ios" | "android" | "web";
  };
}

export function isNative(): boolean {
  return getCapacitor()?.isNativePlatform() === true;
}

export function getPlatform(): "ios" | "android" | "web" {
  return getCapacitor()?.getPlatform() ?? "web";
}

/** Light haptic on tap (e.g. completing a lesson, submitting a quiz). */
export async function hapticTap(): Promise<void> {
  if (!isNative()) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* plugin missing — silent on web */
  }
}

/** Heavier haptic for celebration moments (level up, badge unlock). */
export async function hapticSuccess(): Promise<void> {
  if (!isNative()) return;
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    /* ignore */
  }
}

/** Warning haptic for emergency / red-flag UI. */
export async function hapticWarning(): Promise<void> {
  if (!isNative()) return;
  try {
    const { Haptics, NotificationType } = await import("@capacitor/haptics");
    await Haptics.notification({ type: NotificationType.Warning });
  } catch {
    /* ignore */
  }
}

/**
 * Open an external URL.
 * On native, uses an in-app SafariViewController / Custom Tab — better UX
 * than yanking the user out of the app to the system browser.
 */
export async function openExternal(url: string): Promise<void> {
  if (isNative()) {
    try {
      const { Browser } = await import("@capacitor/browser");
      await Browser.open({ url });
      return;
    } catch {
      /* fall through to web open */
    }
  }
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

/** Native share sheet, with a clipboard / Web Share API fallback. */
export async function shareSheet(opts: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<{ shared: boolean }> {
  if (isNative()) {
    try {
      const { Share } = await import("@capacitor/share");
      await Share.share(opts);
      return { shared: true };
    } catch {
      /* fall through */
    }
  }
  if (typeof navigator !== "undefined" && "share" in navigator) {
    try {
      await (navigator as Navigator & { share: (data: ShareData) => Promise<void> })
        .share(opts);
      return { shared: true };
    } catch {
      return { shared: false };
    }
  }
  if (opts.url && typeof navigator !== "undefined") {
    const nav = navigator as Navigator & { clipboard?: { writeText: (s: string) => Promise<void> } };
    if (nav.clipboard?.writeText) {
      try {
        await nav.clipboard.writeText(opts.url);
        return { shared: true };
      } catch {
        return { shared: false };
      }
    }
  }
  return { shared: false };
}

/**
 * Subscribe to network status changes.
 * Returns an unsubscribe function. On the web, falls back to `online`/`offline`
 * window events, so callers don't need to branch.
 */
export async function onNetworkChange(
  cb: (status: { connected: boolean }) => void,
): Promise<() => void> {
  if (isNative()) {
    try {
      const { Network } = await import("@capacitor/network");
      const handle = await Network.addListener("networkStatusChange", cb);
      return () => handle.remove();
    } catch {
      /* fall through */
    }
  }
  if (typeof window === "undefined") return () => {};
  const onOnline = () => cb({ connected: true });
  const onOffline = () => cb({ connected: false });
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);
  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
}

/**
 * Persistent key-value storage that uses native Preferences (NSUserDefaults /
 * SharedPreferences) when available, falling back to localStorage on the web.
 * Useful for a small amount of cross-platform state that must survive WebView
 * cache clears (e.g. anonymous user id, locale preference).
 */
export async function storageGet(key: string): Promise<string | null> {
  if (isNative()) {
    try {
      const { Preferences } = await import("@capacitor/preferences");
      const { value } = await Preferences.get({ key });
      return value;
    } catch {
      /* fall through */
    }
  }
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export async function storageSet(key: string, value: string): Promise<void> {
  if (isNative()) {
    try {
      const { Preferences } = await import("@capacitor/preferences");
      await Preferences.set({ key, value });
      return;
    } catch {
      /* fall through */
    }
  }
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore quota / private mode */
  }
}

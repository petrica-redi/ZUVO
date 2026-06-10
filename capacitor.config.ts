import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration.
 *
 * MODES
 * -----
 * 1. **Hybrid (server-mode, default for production):**
 *    `server.url` points to your deployed Next.js domain
 *    (e.g. `https://redi.healthcare`). The shipped binary is a thin shell
 *    that loads the live site, so backend, auth, AI, i18n, and analytics
 *    all work as in the web build. Releases are over-the-air — no store
 *    review needed for content updates.
 *
 *    Required env to override at build time:
 *      CAP_SERVER_URL=https://redi.healthcare
 *
 * 2. **Native fallback shell:**
 *    `npm run mobile:export` creates a lightweight `out/` fallback page for
 *    Capacitor's required `webDir`. The actual app loads from `server.url`.
 *    A fully bundled static export is not compatible with this app while it
 *    contains Next.js Route Handlers (`/api/*`).
 *
 * Allowed navigation domains include staging, preview, and the Vercel
 * project domain so QA links open inside the app shell.
 */
const SERVER_URL =
  process.env.CAP_SERVER_URL?.trim() ||
  "https://redi.healthcare";

const serverHost = (() => {
  try {
    return new URL(SERVER_URL).hostname;
  } catch {
    return "redi.healthcare";
  }
})();

const extraNavigation = (process.env.CAP_ALLOW_NAVIGATION ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const config: CapacitorConfig = {
  // App ID kept stable to avoid breaking existing installs migrating from
  // the Sastipe namespace. Display name + production server URL move to
  // Redi Health / redi.healthcare. Change appId only with a forced reinstall.
  appId: "org.sastipe.app",
  appName: "Redi Health",
  webDir: "out",

  server: {
    url: SERVER_URL,
    androidScheme: "https",
    cleartext: false,
    allowNavigation: Array.from(new Set([serverHost, ...extraNavigation])),
  },

  ios: {
    contentInset: "always",
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
    backgroundColor: "#F3F8F6",
    preferredContentMode: "mobile",
  },

  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: process.env.NODE_ENV !== "production",
    backgroundColor: "#F3F8F6",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#0E8074",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      iosSpinnerStyle: "small",
      spinnerColor: "#FFFFFF",
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0E8074",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
    App: {
      // Deep links: web+redihealth://lesson/local/intro (legacy web+sastipe is also accepted).
      // Universal links + App Links should be configured in Apple App Site
      // Association / Android assetlinks.json after the domain (`redi.healthcare`) is live.
    },
  },
};

export default config;

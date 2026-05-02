import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration.
 *
 * MODES
 * -----
 * 1. **Hybrid (server-mode, default for production):**
 *    `server.url` points to your deployed Next.js domain
 *    (e.g. `https://app.sastipe.org`). The shipped binary is a thin shell
 *    that loads the live site, so backend, auth, AI, i18n, and analytics
 *    all work as in the web build. Releases are over-the-air — no store
 *    review needed for content updates.
 *
 *    Required env to override at build time:
 *      CAP_SERVER_URL=https://app.sastipe.org
 *
 * 2. **Bundled (offline-capable, for App Store screenshots / dev):**
 *    Set `CAP_BUNDLE=1` and run `npm run mobile:export`. That produces a
 *    static `out/` directory which Capacitor packages directly. Best for
 *    teams that want an "appears installed" feel without depending on the
 *    server. AI / DB endpoints are still hit at runtime over HTTPS.
 *
 * Allowed navigation domains include staging, preview, and the Vercel
 * project domain so QA links open inside the app shell.
 */
const SERVER_URL =
  process.env.CAP_SERVER_URL?.trim() ||
  "https://app.sastipe.org";

const BUNDLE_MODE = process.env.CAP_BUNDLE === "1";

const config: CapacitorConfig = {
  appId: "org.sastipe.app",
  appName: "Sastipe",
  webDir: "out",

  server: BUNDLE_MODE
    ? {
        androidScheme: "https",
        cleartext: false,
      }
    : {
        url: SERVER_URL,
        androidScheme: "https",
        cleartext: false,
        allowNavigation: [
          "*.sastipe.org",
          "*.vercel.app",
          "*.supabase.co",
          "*.openai.com",
          "*.sentry.io",
          "*.posthog.com",
          "*.upstash.io",
        ],
      },

  ios: {
    contentInset: "always",
    scrollEnabled: true,
    limitsNavigationsToAppBoundDomains: false,
    backgroundColor: "#F4F6FB",
    preferredContentMode: "mobile",
  },

  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: process.env.NODE_ENV !== "production",
    backgroundColor: "#F4F6FB",
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: "#4F46E5",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      iosSpinnerStyle: "small",
      spinnerColor: "#FFFFFF",
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#4F46E5",
      overlaysWebView: false,
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
    App: {
      // Deep links: web+sastipe://lesson/local/intro -> in-app route.
      // Universal links + App Links should be configured in
      // Apple App Site Association / Android assetlinks.json after deploy.
    },
  },
};

export default config;

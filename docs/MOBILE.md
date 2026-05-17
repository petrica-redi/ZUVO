# Mobile (Android + iOS)

Sastipe ships as a single Next.js codebase that runs three ways:

1. **Mobile-optimized web** — works on any phone browser, no install.
2. **Installable PWA** — Add to Home Screen on Android Chrome and iOS Safari, with offline fallback, app shortcuts, and a share target.
3. **Native iOS / Android binary** — wrapped via [Capacitor](https://capacitorjs.com/), publishable to the App Store and Google Play.

You don't need separate codebases. The same React UI renders in all three modes; native-only features (haptics, status bar, native share sheet, network listener) degrade gracefully on the web.

---

## Quick reference

| Output | Command | When to use |
|---|---|---|
| Web preview | `npm run dev` | Day-to-day development |
| PWA-ready production build | `npm run build && npm start` | Lighthouse / PWA audit |
| Capacitor fallback shell | `npm run mobile:export` | Generate `/out` for hybrid native builds |
| Add iOS native project | `npm run mobile:init:ios` | First time only |
| Add Android native project | `npm run mobile:init:android` | First time only |
| Push web changes into native | `npm run mobile:sync` | After every web update |
| Open Xcode | `npm run mobile:open:ios` | Build / archive / submit |
| Open Android Studio | `npm run mobile:open:android` | Build / sign / submit |
| Generate icons + splash screens | `npm run mobile:assets` | When the brand mark changes |

---

## Layer 1 — Installable PWA (no native toolchain needed)

This already works against the deployed Vercel build. No further code changes required.

### What's wired

- `public/manifest.json` — name, icons, app shortcuts (Academy, Ask, Symptoms, SOS), share target (`/scan` accepts shared text/URL), protocol handlers (`web+sastipe://...`), categories (health/education/medical), edge side panel.
- `public/sw.js` — network-first navigations, stale-while-revalidate static assets, runtime cache trimming, offline page fallback. API requests are never cached.
- `<InstallPrompt />` — Android Chromium fires `beforeinstallprompt`; we surface a native CTA. iOS Safari shows the "Share → Add to Home Screen" hint. Dismissals are sticky for 30 days.
- `<head>` meta — `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, mask icon, multiple `apple-touch-icon` sizes, MS tile color.
- Theme color flips between light (`#F4F6FB`) and dark (`#0A0F1F`).

### How to install on a phone

**Android (Chrome / Edge / Samsung Internet):**
1. Open the deployed URL.
2. The install banner appears automatically; otherwise: menu (⋮) → "Install app" / "Add to Home screen".

**iOS (Safari):**
1. Open the deployed URL **in Safari** (Chrome iOS does not support installing PWAs).
2. Tap the Share button (square with arrow).
3. Scroll down → "Add to Home Screen" → "Add".

After install, the app launches fullscreen with the Sastipe icon, supports the four shortcuts (long-press the icon), and works offline against cached pages.

---

## Layer 2 — Native iOS / Android via Capacitor

Capacitor wraps the existing site in a `WKWebView` (iOS) / `WebView` (Android) and exposes native APIs via plugins. We have two operating modes.

### Mode A — Hybrid (production default)

The native shell points at your production URL (e.g. `https://app.sastipe.org`). Updates ship over the air via standard web deploys; the store binary only needs re-submission for native API changes (a few times a year).

```bash
# Optionally override the live URL the shell loads
export CAP_SERVER_URL="https://app.sastipe.org"

npm run mobile:init:ios       # one-time
npm run mobile:init:android   # one-time
npm run mobile:sync
npm run mobile:assets         # generate iOS/Android icons + splash from /public/icon-512.svg
```

### Mode B — Bundled static export (not enabled)

The current app uses Next.js Route Handlers (`/api/*`) for AI, progress, health checks, exports, and deletion. That means a full `output: "export"` static bundle is not a faithful build of the product and is not supported in this branch.

`npm run mobile:export` instead generates Capacitor's required `/out` directory with a branded fallback shell. The native app still loads the production URL configured in `CAP_SERVER_URL` / `capacitor.config.ts`.

```bash
npm run mobile:export         # writes /out/index.html fallback shell
npm run mobile:sync
```

If you later want a real offline-first binary, split the backend into a separate hosted API and convert all app routes to static-compatible pages.

---

## iOS publishing checklist

Requires macOS + Xcode 15+ and an Apple Developer Program membership ($99/yr).

1. `npm run mobile:init:ios` — creates `/ios` folder. Commit it to git.
2. `npm run mobile:assets` — generates AppIcon set + Launch Storyboard images.
3. `npm run mobile:open:ios` — opens `ios/App/App.xcworkspace` in Xcode.
4. **Signing & Capabilities** → set Team to your Apple Dev account, Bundle Identifier to `org.sastipe.app` (matches `capacitor.config.ts`).
5. **Capabilities** to enable: Background Modes (Audio playback if needed), Associated Domains (for universal links → `applinks:app.sastipe.org`), Push Notifications (later).
6. Bump `CFBundleVersion` and `CFBundleShortVersionString` in `Info.plist`.
7. Product → Archive → Distribute App → App Store Connect → Upload.
8. In **App Store Connect**:
   - Create app record, primary language EN.
   - Add screenshots (6.5", 5.5"). The hero, lesson, and quiz screens are great picks.
   - Privacy Policy URL → `/privacy` page on the production domain.
   - App Privacy → declare data types (we collect: anonymous ID, locale, AI conversation contents while in session). Reference [`docs/PRIVACY.md`](./PRIVACY.md).
   - **Health & Fitness** category, secondary **Medical** or **Education**.
   - Age rating: 12+ (medical info, references to STIs, etc.).
   - Submit for review. First review usually < 24 h once metadata is complete.

### Apple-specific gotchas

- App Review will look for clear medical disclaimers in the UI and App Store metadata. Our app has the disclaimer banner on hub + every lesson, plus an emergency CTA — keep that visible at first launch.
- Don't claim diagnosis. The copy already uses "guidance" / "education" language; keep it that way in App Store description too.
- Provide working test credentials (or note "no login required, anonymous").

---

## Android publishing checklist

Requires Android Studio Hedgehog+ and a Google Play Console account ($25 one-time).

1. `npm run mobile:init:android`.
2. `npm run mobile:assets` — generates `mipmap-*` icons and splash drawables.
3. `npm run mobile:open:android` — opens `/android` in Android Studio.
4. **Module signing**: generate a keystore (`keytool -genkey -v -keystore sastipe-release.keystore -alias sastipe -keyalg RSA -keysize 2048 -validity 10000`). Store the keystore + passwords in your secret manager.
5. In `android/app/build.gradle` configure `signingConfigs.release`.
6. Bump `versionCode` and `versionName` in `android/app/build.gradle`.
7. **Build → Generate Signed Bundle / APK → Android App Bundle (.aab)**.
8. Upload `.aab` to Play Console → Internal testing track first.
9. Fill out:
   - Privacy policy URL → `/privacy`.
   - Data safety form — same data types as iOS.
   - Target audience / content rating questionnaire.
   - **Health** category.
10. Promote to Production after internal QA passes.

### Android-specific gotchas

- Play requires `android:targetSdkVersion` ≥ current year - 1 (35 in 2026). Capacitor 8 ships with that already.
- App Links: drop `/.well-known/assetlinks.json` on the production domain so deep links open the app instead of the browser.
- Mid-2025+ Play requires a new app to be tested by ≥ 12 testers for ≥ 14 days before going live.

---

## What works natively today

- ✅ Status bar styling (`#4F46E5`, dark icons).
- ✅ Splash screen (auto-hides after 1.5 s).
- ✅ Hardware back button on Android (history → exit).
- ✅ Native haptics on quiz / lesson / SOS interactions (helpers in `src/lib/native/bridge.ts`).
- ✅ In-app browser for external links (SafariViewController on iOS, Custom Tabs on Android) instead of yanking users out.
- ✅ Native share sheet for sources / lesson share, falling back to Web Share API.
- ✅ Network status awareness, falling back to `online`/`offline` window events.
- ✅ Persistent storage that survives WebView cache clears.

## What's intentionally not native (web is enough)

- Auth / Supabase — the web flow already works inside the WebView.
- AI calls — pure HTTPS, no native SDK needed.
- Service worker — native WebViews cannot rely on the web service-worker lifecycle the same way as browsers, so we skip SW registration inside Capacitor and package a small fallback shell instead.

## Common commands cheat sheet

```bash
# After every code change:
npm run build && npm run mobile:export && npm run mobile:sync

# After changing icons / brand mark:
npm run mobile:assets && npm run mobile:sync

# Quick run on connected device / emulator:
npm run mobile:run:ios        # iOS Simulator
npm run mobile:run:android    # Android Emulator

# Open IDE for archive / signing:
npm run mobile:open:ios
npm run mobile:open:android
```

---

## CSP notes

`next.config.ts` already allows Capacitor schemes (`capacitor://localhost`, `ionic://localhost`, `https://localhost`) in `default-src`, `script-src`, `style-src`, and `connect-src`. No further CSP changes are required when wrapping the site in Capacitor.

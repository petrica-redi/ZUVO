import type { ReactNode } from "react";
import type { Viewport } from "next";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { getAppConfig } from "@/lib/env";
import { getPlatformConfig } from "@/lib/admin/actions";
import { buildFontStyles } from "@/lib/admin/fonts";
import { sanitizeCustomCss } from "@/lib/admin/sanitize-css";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { CapacitorBootstrap } from "@/components/CapacitorBootstrap";
import { ProtocolRouteHandler } from "@/components/ProtocolRouteHandler";

const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek"],
  variable: "--font-source-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fraunces",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  // Dual-mode theme color: matches the canvas in light, deep teal-ink in dark mode.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E8F2EF" },
    { media: "(prefers-color-scheme: dark)", color: "#041614" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const cfg = getAppConfig();
  const hdrs = await headers();
  const shellModeHeader =
    hdrs.get("x-redi-shell-mode") ?? hdrs.get("x-sastipe-shell-mode");
  const shellMode = shellModeHeader === "mobile" ? "mobile" : "desktop";

  const platformConfig = await getPlatformConfig();
  const customCss = sanitizeCustomCss(platformConfig?.customCss || "");
  const fontStyles = buildFontStyles({
    fontSans: platformConfig?.fontSans,
    fontDisplay: platformConfig?.fontDisplay,
    fontEditorial: platformConfig?.fontEditorial,
  });

  return (
    <html
      lang={locale}
      data-shell-mode={shellMode}
      className={`${sourceSans.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* PWA manifest + Android Chrome */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content={cfg.appName} />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS / iPadOS PWA — apple-mobile-web-app-* drive home-screen install */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={cfg.appName} />
        <meta name="format-detection" content="telephone=no" />

        {/* Apple touch icons — multiple sizes ensure crisp rendering across devices.
            iOS auto-rounds the corners; we provide a non-precomposed version. */}
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.svg" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.svg" />
        <link rel="mask-icon" href="/icon-512.svg" color="#0B655C" />

        {/* Microsoft tile (for installs from Edge / Windows) */}
        <meta name="msapplication-TileColor" content="#0B655C" />
        <meta name="msapplication-TileImage" content="/icon-192.svg" />

        {fontStyles.linkHref && (
          <link rel="stylesheet" href={fontStyles.linkHref} />
        )}
        {(fontStyles.css || customCss) && (
          <style
            dangerouslySetInnerHTML={{
              __html: [fontStyles.css, customCss].filter(Boolean).join("\n"),
            }}
          />
        )}

        {/* Inline theme bootstrapper to avoid flash of unstyled content. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sastipe_theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ServiceWorkerRegistrar />
        <CapacitorBootstrap />
        <ProtocolRouteHandler />
        <div className="mobile-shell" role="application" aria-label={`${cfg.appName} app`}>
          {children}
        </div>
      </body>
    </html>
  );
}

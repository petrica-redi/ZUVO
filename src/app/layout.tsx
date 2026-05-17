import type { ReactNode } from "react";
import type { Viewport } from "next";
import { getLocale } from "next-intl/server";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { InstallPrompt } from "@/components/InstallPrompt";
import { CapacitorBootstrap } from "@/components/CapacitorBootstrap";
import { ProtocolRouteHandler } from "@/components/ProtocolRouteHandler";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  // Dual-mode theme color: matches the canvas in light, deep navy in dark mode.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F6FB" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F1F" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${geist.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* PWA manifest + Android Chrome */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Sastipe" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS / iPadOS PWA — apple-mobile-web-app-* drive home-screen install */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sastipe" />
        <meta name="format-detection" content="telephone=no" />

        {/* Apple touch icons — multiple sizes ensure crisp rendering across devices.
            iOS auto-rounds the corners; we provide a non-precomposed version. */}
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icon-192.svg" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icon-512.svg" />
        <link rel="mask-icon" href="/icon-512.svg" color="#4F46E5" />

        {/* Microsoft tile (for installs from Edge / Windows) */}
        <meta name="msapplication-TileColor" content="#4F46E5" />
        <meta name="msapplication-TileImage" content="/icon-192.svg" />

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
        <div className="mobile-shell" role="application" aria-label="Sastipe Health App">
          {children}
        </div>
        <InstallPrompt />
      </body>
    </html>
  );
}

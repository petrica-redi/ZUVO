import type { ReactNode } from "react";
import type { Viewport } from "next";
import { getLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext", "greek"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#c0392b",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sastipe" />
      </head>
      <body className="app-body font-sans antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <ServiceWorkerRegistrar />
        <div className="mobile-shell" role="application" aria-label="Sastipe Health App">
          {children}
        </div>
      </body>
    </html>
  );
}

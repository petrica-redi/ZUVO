import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getAppConfig } from "@/lib/env";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const { appName, appUrl } = getAppConfig();
const baseUrl = appUrl ? new URL(appUrl) : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: "Health literacy tools built for Roma communities. Learn, track, and be well.",
  openGraph: {
    title: appName,
    description: "Health literacy tools built for Roma communities.",
    url: baseUrl.toString(),
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description: "Health literacy tools built for Roma communities.",
  },
  alternates: {
    canonical: baseUrl.toString(),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sq"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

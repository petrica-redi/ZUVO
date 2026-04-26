import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { MisinfoScanner } from "@/components/MisinfoScanner";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Fact Check — Sastipe", description: "Check health claims against evidence" };
}

export default async function ScanPage({ params }: Props) {
  const { locale } = await params;

  // These labels should be in the i18n files — hardcoded for now, Cursor should extract them
  const labels = {
    title: "Check a health claim",
    subtitle: "Paste something you saw on Facebook, TikTok, or WhatsApp. We'll tell you the truth.",
    placeholder: "Paste the claim here...\n\nExample: \"Vaccines change your DNA\"",
    checkButton: "Check this",
    checking: "Checking...",
    shareButton: "Share the truth",
    recentChecks: "Recent checks",
    orDescribe: "or describe what you heard",
    verdictVerified: "Verified",
    verdictMisleading: "Misleading",
    verdictFalse: "False",
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-5 py-6">
          <MisinfoScanner labels={labels} locale={locale} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

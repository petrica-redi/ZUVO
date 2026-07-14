import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { KnowYourRights } from "@/components/KnowYourRights";

export const metadata: Metadata = {
  title: "Know Your Rights — Redi Health",
  description: "Patient rights, discrimination help, and legal contacts for Roma communities",
};

export default function RightsPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <SosButton />
      <main id="main-content" className="flex-1 pb-2">
        <div className="px-4 py-4">
          <KnowYourRights />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { KnowYourRights } from "@/components/KnowYourRights";

export const metadata: Metadata = {
  title: "Know Your Rights — Zuvo",
  description: "Patient rights, discrimination help, and legal contacts for Roma communities",
};

export default function RightsPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main className="flex-1 pb-2">
        <div className="px-4 py-4">
          <KnowYourRights />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

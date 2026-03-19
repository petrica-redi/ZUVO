import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { SosButton } from "@/components/SosButton";
import { CommunityStories } from "@/components/CommunityStories";

export const metadata: Metadata = {
  title: "Community Stories — Zuvo",
  description: "Real health experiences from Roma communities across Europe",
};

export default function StoriesPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F5F5F7]">
      <Header />
      <SosButton />
      <main className="flex-1 pb-2">
        <div className="px-4 py-4">
          <CommunityStories />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

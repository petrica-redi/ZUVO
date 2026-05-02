import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/ui";

/**
 * Locale-level loading UI. Streams while the page resolves.
 * Uses brand-aware skeletons so the perceived performance remains polished.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-[#F5F5F7] via-white to-[#F5F5F7]">
      <Header />
      <main id="main-content" className="flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-3xl space-y-5">
          <Skeleton className="h-44 w-full" rounded="xl" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Skeleton className="h-24 w-full" rounded="xl" />
            <Skeleton className="h-24 w-full" rounded="xl" />
          </div>
          <Skeleton className="h-32 w-full" rounded="xl" />
          <div className="space-y-3">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-44 w-full" rounded="xl" />
            <Skeleton className="h-44 w-full" rounded="xl" />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

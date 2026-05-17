import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { Skeleton } from "@/components/ui";

/**
 * Locale-level loading UI. Streams while the page resolves.
 * Uses route-shaped skeletons so the perceived performance feels polished.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex-1 px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto max-w-3xl space-y-5">
          {/* Hero skeleton */}
          <div className="relative overflow-hidden rounded-[28px] bg-[var(--color-surface)] hairline shadow-2 p-6">
            <Skeleton className="mb-3 h-5 w-32" rounded="full" />
            <Skeleton className="mb-2 h-9 w-3/4" rounded="lg" />
            <Skeleton className="mb-4 h-9 w-2/3" rounded="lg" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="mt-2 h-4 w-4/6" />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[var(--color-surface)] hairline p-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 py-2">
                <Skeleton className="h-4 w-4" rounded="full" />
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-2 w-16" />
              </div>
            ))}
          </div>

          {/* Quick action grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[var(--color-surface)] hairline p-3.5">
                <Skeleton className="mx-auto h-12 w-12" rounded="xl" />
                <Skeleton className="mx-auto mt-3 h-3 w-16" />
              </div>
            ))}
          </div>

          {/* Section header + cards */}
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

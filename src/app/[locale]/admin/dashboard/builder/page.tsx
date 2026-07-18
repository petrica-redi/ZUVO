import { verifyAdmin, getPlatformConfig } from "@/lib/admin/actions";
import { AdminShellOptOut } from "@/components/admin/AdminShellOptOut";
import { PageBuilder } from "@/components/admin/PageBuilder";
import { Link } from "@/navigation";
import { ArrowLeft } from "lucide-react";

export default async function BuilderAdminPage() {
  await verifyAdmin();
  const config = await getPlatformConfig();

  return (
    <>
      <AdminShellOptOut />
      <div className="admin-cms-page min-h-screen pb-24">
        <header className="sticky top-0 z-40 border-b border-[var(--color-border-subtle)] bg-white/92 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Redi Health
              </p>
              <h1 className="font-headline text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                Page builder
              </h1>
            </div>
            <Link
              href="/admin/dashboard"
              className="admin-btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to CMS
            </Link>
          </div>
        </header>

        <main className="mx-auto mt-8 max-w-5xl px-6">
          <PageBuilder initial={config?.pageBlocks ?? null} />
        </main>
      </div>
    </>
  );
}

import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Compass, Home, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "errors" });

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl gradient-brand grain-overlay shadow-brand">
            <Compass className="lucide h-8 w-8 text-white" strokeWidth={1.85} />
          </div>
          <div
            className="font-display text-[64px] font-extrabold leading-none tracking-tighter text-[var(--color-neutral-200)]"
            style={{ letterSpacing: "-0.04em" }}
            aria-hidden
          >
            404
          </div>
          <h1
            className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-3xl"
            style={{ letterSpacing: "-0.025em" }}
          >
            {t("notFoundTitle")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {t("notFoundBody")}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl gradient-brand grain-overlay px-5 text-sm font-extrabold text-white shadow-brand transition-all active:scale-[0.97]"
            >
              <Home className="lucide h-4 w-4" strokeWidth={1.85} />
              {t("goHome")}
            </Link>
            <Link
              href="/students"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--color-border-default)] bg-[var(--color-surface)] px-5 text-sm font-extrabold text-[var(--color-text-primary)] transition-all hover:border-[var(--color-border-strong)] active:scale-[0.97]"
            >
              <Search className="lucide h-4 w-4" strokeWidth={1.85} />
              {t("exploreAcademy")}
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

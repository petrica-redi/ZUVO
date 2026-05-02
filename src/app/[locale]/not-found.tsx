import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Compass, Home, Search } from "lucide-react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-[#F5F5F7] via-white to-[#F5F5F7]">
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
            <Compass className="h-8 w-8 text-white" />
          </div>
          <div className="text-[64px] font-black leading-none tracking-tighter text-gray-200">
            404
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
            {t("notFoundTitle")}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {t("notFoundBody")}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition active:scale-[0.97]"
            >
              <Home className="h-4 w-4" />
              {t("goHome")}
            </Link>
            <Link
              href="/students"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-gray-300 active:scale-[0.97]"
            >
              <Search className="h-4 w-4" />
              {t("exploreAcademy")}
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}

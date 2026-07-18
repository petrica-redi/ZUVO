import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";
import { Header } from "@/components/Header";
import { verifyStaffEmail } from "@/lib/staff/actions";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "staffAuth" });
  return { title: t("verifyMetaTitle") };
}

export default async function VerifyEmailPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { token } = await searchParams;
  const t = await getTranslations({ locale, namespace: "staffAuth" });
  const result = token ? await verifyStaffEmail(token) : { success: false, error: "Missing token" };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-2 md:p-8">
          {result.success ? (
            <div className="space-y-3">
              <h1 className="font-headline text-2xl font-extrabold text-[var(--color-text-primary)]">
                {t("verifySuccessTitle")}
              </h1>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {t("verifySuccessLead")}
              </p>
              <Link
                href="/auth/pending"
                className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-ink-900)] px-5 text-sm font-bold text-white"
              >
                {t("verifyContinue")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <h1 className="font-headline text-2xl font-extrabold text-[var(--color-text-primary)]">
                {t("verifyErrorTitle")}
              </h1>
              <p className="text-sm text-red-700">{result.error || t("verifyErrorLead")}</p>
              <Link href="/auth/register" className="font-bold text-[var(--color-brand-700)] underline">
                {t("registerLink")}
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

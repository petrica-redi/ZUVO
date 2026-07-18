import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/navigation";
import { Header } from "@/components/Header";
import { FieldLoginForm } from "@/components/field/FieldLoginForm";
import { getFieldSession, isFieldRosterReady } from "@/lib/field/actions";
import { isAdminAuthenticated } from "@/lib/admin/actions";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fieldAuth" });
  return { title: t("metaTitle"), description: t("lead") };
}

export default async function MediatorLoginPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "fieldAuth" });
  const tStaff = await getTranslations({ locale, namespace: "staffAuth" });

  const [session, admin, rosterReady] = await Promise.all([
    getFieldSession(),
    isAdminAuthenticated(),
    isFieldRosterReady(),
  ]);

  if (session || admin) {
    redirect(`/${locale}/mediator`);
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--color-bg-canvas)]">
      <Header />
      <main id="main-content" className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-4 rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6 shadow-2 md:p-8">
          {rosterReady ? (
            <FieldLoginForm
              rosterReady={rosterReady}
              labels={{
                title: t("title"),
                lead: t("lead"),
                email: t("email"),
                password: t("password"),
                submit: t("submit"),
                rosterMissing: t("rosterMissing"),
                errorGeneric: t("errorGeneric"),
              }}
            />
          ) : (
            <div className="space-y-3">
              <h1 className="font-headline text-xl font-extrabold text-[var(--color-text-primary)]">
                {t("title")}
              </h1>
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
                {t("rosterMissing")}
              </p>
            </div>
          )}

          <div className="border-t border-[var(--color-border-subtle)] pt-4">
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {tStaff("fieldAltLead")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/auth/register"
                className="inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-ink-900)] px-4 text-sm font-bold text-white"
              >
                {tStaff("createAccountCta")}
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--color-border-default)] px-4 text-sm font-bold"
              >
                {tStaff("staffLoginCta")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

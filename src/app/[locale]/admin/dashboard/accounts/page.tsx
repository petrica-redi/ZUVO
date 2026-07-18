import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Link } from "@/navigation";
import { AccountApprovalPanel } from "@/components/admin/AccountApprovalPanel";
import { isAdminAuthenticated } from "@/lib/admin/actions";

export default async function AdminAccountsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!(await isAdminAuthenticated())) {
    redirect(`/${locale}/admin/login`);
  }

  const t = await getTranslations("staffAuth");

  return (
    <div className="admin-cms-page min-h-screen bg-[var(--color-bg-canvas)] text-[var(--color-text-primary)]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Admin
            </p>
            <h1 className="mt-2 font-headline text-3xl font-extrabold tracking-tight">
              {t("adminAccountsTitle")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-secondary)]">
              {t("adminAccountsLead")}
            </p>
          </div>
          <Link
            href="/admin/dashboard"
            className="text-sm font-bold text-[var(--color-brand-700)] underline-offset-2 hover:underline"
          >
            ← Dashboard
          </Link>
        </div>

        <AccountApprovalPanel
          labels={{
            pendingTitle: t("pendingTitle"),
            nonePending: t("nonePending"),
            approve: t("approve"),
            reject: t("reject"),
            approved: t("approvedToast"),
            rejected: t("rejectedToast"),
            allTitle: t("allTitle"),
            refresh: t("refresh"),
            colName: t("colName"),
            colEmail: t("colEmail"),
            colStatus: t("colStatus"),
            colRole: t("colRole"),
            colProvider: t("colProvider"),
            verified: t("verified"),
            loadError: t("loadError"),
          }}
        />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState, useTransition } from "react";
import {
  approveStaffAccount,
  listStaffAccounts,
  rejectStaffAccount,
  type StaffAccountRow,
} from "@/lib/staff/actions";
import type { StaffRole } from "@/lib/staff/types";
import { STAFF_ROLES } from "@/lib/staff/types";

const ROLE_LABELS: Record<StaffRole, string> = {
  professor: "Professor",
  mediator: "Mediator",
  nurse: "Nurse",
  doctor: "Doctor",
  manager: "Manager",
  administrator: "Administrator",
};

export function AccountApprovalPanel({ labels }: { labels: Record<string, string> }) {
  const [accounts, setAccounts] = useState<StaffAccountRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [roleDraft, setRoleDraft] = useState<Record<string, StaffRole>>({});
  const [pending, startTransition] = useTransition();

  function refresh() {
    startTransition(async () => {
      try {
        const rows = await listStaffAccounts();
        setAccounts(rows);
        setError(null);
      } catch {
        setError(labels.loadError ?? "Could not load accounts.");
      }
    });
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function approve(id: string) {
    const role = roleDraft[id] ?? "mediator";
    startTransition(async () => {
      const form = new FormData();
      form.set("id", id);
      form.set("role", role);
      const result = await approveStaffAccount(form);
      if (!result.success) {
        setError(result.error ?? labels.loadError ?? "Approve failed");
        return;
      }
      setMessage(labels.approved ?? "Account approved.");
      setError(null);
      refresh();
    });
  }

  function reject(id: string) {
    startTransition(async () => {
      const form = new FormData();
      form.set("id", id);
      const result = await rejectStaffAccount(form);
      if (!result.success) {
        setError(result.error ?? labels.loadError ?? "Reject failed");
        return;
      }
      setMessage(labels.rejected ?? "Account rejected.");
      setError(null);
      refresh();
    });
  }

  const pendingAccounts = accounts.filter((a) => a.status === "pending_approval");
  const others = accounts.filter((a) => a.status !== "pending_approval");

  return (
    <div className="space-y-8">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-headline text-lg font-extrabold text-[var(--color-text-primary)]">
          {labels.pendingTitle ?? "Pending approval"} ({pendingAccounts.length})
        </h2>
        {pendingAccounts.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {labels.nonePending ?? "No accounts waiting."}
          </p>
        ) : (
          <ul className="space-y-3">
            {pendingAccounts.map((account) => (
              <li
                key={account.id}
                className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-1"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">
                      {account.displayName}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">{account.email}</p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                      {account.authProvider}
                      {account.emailVerifiedAt
                        ? ` · ${labels.verified ?? "email verified"}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className="rounded-xl border border-[var(--color-border-default)] bg-white px-3 py-2 text-sm"
                      value={roleDraft[account.id] ?? account.role ?? "mediator"}
                      onChange={(e) =>
                        setRoleDraft((prev) => ({
                          ...prev,
                          [account.id]: e.target.value as StaffRole,
                        }))
                      }
                    >
                      {STAFF_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => approve(account.id)}
                      className="rounded-xl bg-[var(--color-ink-900)] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
                    >
                      {labels.approve ?? "Approve"}
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => reject(account.id)}
                      className="rounded-xl border border-[var(--color-border-default)] px-4 py-2 text-sm font-bold text-[var(--color-text-primary)] disabled:opacity-60"
                    >
                      {labels.reject ?? "Reject"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-headline text-lg font-extrabold text-[var(--color-text-primary)]">
            {labels.allTitle ?? "All accounts"} ({others.length})
          </h2>
          <button
            type="button"
            onClick={refresh}
            disabled={pending}
            className="text-sm font-bold text-[var(--color-brand-700)]"
          >
            {labels.refresh ?? "Refresh"}
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)] text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3">{labels.colName ?? "Name"}</th>
                <th className="px-4 py-3">{labels.colEmail ?? "Email"}</th>
                <th className="px-4 py-3">{labels.colStatus ?? "Status"}</th>
                <th className="px-4 py-3">{labels.colRole ?? "Role"}</th>
                <th className="px-4 py-3">{labels.colProvider ?? "Provider"}</th>
              </tr>
            </thead>
            <tbody>
              {others.map((account) => (
                <tr
                  key={account.id}
                  className="border-b border-[var(--color-border-subtle)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">
                    {account.displayName}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                    {account.email}
                  </td>
                  <td className="px-4 py-3">{account.status}</td>
                  <td className="px-4 py-3">
                    {account.role && account.role in ROLE_LABELS
                      ? ROLE_LABELS[account.role as StaffRole]
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{account.authProvider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import {
  listRecentInvites,
  previewStaffInvites,
  sendStaffInvites,
  type InvitePreview,
} from "@/lib/staff/invite";

const SAMPLE = `email,name,role,country,region
ana.popescu@dsp.ro,Ana Popescu,mediator,RO,B
marco.rossi@asl.it,Marco Rossi,nurse,IT,LAZ
dr.ionescu@spital.ro,Dr Ionescu,doctor,RO,IF`;

export function BulkInvitePanel() {
  const [csv, setCsv] = useState(SAMPLE);
  const [preview, setPreview] = useState<InvitePreview[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<
    Awaited<ReturnType<typeof listRecentInvites>>
  >([]);
  const [pending, startTransition] = useTransition();

  function runPreview() {
    startTransition(async () => {
      const result = await previewStaffInvites(csv);
      if (!result.success) {
        setError(result.error ?? "Preview failed");
        setPreview([]);
        return;
      }
      setPreview(result.rows ?? []);
      setError(null);
      setMessage(`${result.rows?.length ?? 0} rows ready to invite`);
    });
  }

  function send() {
    startTransition(async () => {
      const result = await sendStaffInvites(csv);
      if (!result.success) {
        setError(result.error ?? "Send failed");
        return;
      }
      setMessage(`Sent ${result.sent} invite emails`);
      setError(null);
      const rows = await listRecentInvites();
      setRecent(rows);
    });
  }

  function refreshRecent() {
    startTransition(async () => {
      setRecent(await listRecentInvites());
    });
  }

  return (
    <section className="platform-glass-panel mb-8 space-y-4">
      <div>
        <h2 className="font-headline text-lg font-extrabold text-[var(--color-text-primary)]">
          Bulk invite (up to 500)
        </h2>
        <p className="mt-1 text-sm font-medium text-[var(--color-text-secondary)]">
          CSV: email, name, role (mediator/nurse/doctor/manager), country (RO/IT),
          region (județ or ASL code).
        </p>
      </div>

      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        rows={8}
        className="w-full rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface)] p-3 font-mono text-xs text-[var(--color-text-primary)]"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={runPreview}
          disabled={pending}
          className="platform-cta-secondary !flex-none"
        >
          Preview
        </button>
        <button
          type="button"
          onClick={send}
          disabled={pending || preview.length === 0}
          className="platform-cta-primary !flex-none disabled:opacity-50"
        >
          Send invites
        </button>
        <button
          type="button"
          onClick={refreshRecent}
          disabled={pending}
          className="platform-tool-chip"
        >
          Refresh recent
        </button>
      </div>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {message}
        </p>
      ) : null}

      {preview.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)]">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-[var(--color-surface-subtle)] text-[var(--color-text-muted)]">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Country</th>
                <th className="px-3 py-2">Region</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((r) => (
                <tr key={r.email} className="border-t border-[var(--color-border-subtle)]">
                  <td className="px-3 py-2 font-semibold">{r.email}</td>
                  <td className="px-3 py-2">{r.displayName}</td>
                  <td className="px-3 py-2">{r.role}</td>
                  <td className="px-3 py-2">{r.countryCode}</td>
                  <td className="px-3 py-2">{r.regionCode || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {recent.length > 0 ? (
        <div>
          <h3 className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[var(--color-text-muted)]">
            Recent invites
          </h3>
          <ul className="space-y-1 text-xs text-[var(--color-text-secondary)]">
            {recent.slice(0, 12).map((r) => (
              <li key={r.id}>
                {r.email} · {r.role} · {r.countryCode}
                {r.acceptedAt ? " · accepted" : " · pending"}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

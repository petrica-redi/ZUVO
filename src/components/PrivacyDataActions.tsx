"use client";

import { useState } from "react";
import { Download, ShieldOff, Loader2, AlertTriangle } from "lucide-react";
import { Button, Card, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

type Props = {
  title: string;
  subtitle: string;
  exportLabel: string;
  exportHint: string;
  deleteLabel: string;
  deleteHint: string;
  deleteConfirmTitle: string;
  deleteConfirmBody: string;
  deleteConfirmCta: string;
  deleteCancel: string;
  authRequired: string;
  unavailable: string;
  successDeleted: string;
};

export function PrivacyDataActions({
  title,
  subtitle,
  exportLabel,
  exportHint,
  deleteLabel,
  deleteHint,
  deleteConfirmTitle,
  deleteConfirmBody,
  deleteConfirmCta,
  deleteCancel,
  authRequired,
  unavailable,
  successDeleted,
}: Props) {
  const toast = useToast();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const headers: Record<string, string> = (() => {
    if (typeof window === "undefined") return {};
    const id = localStorage.getItem("sastipe_anon_id");
    const out: Record<string, string> = {};
    if (id) out["x-anonymous-id"] = id;
    return out;
  })();

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/me/export", { headers });
      if (res.status === 401) {
        toast.warning(authRequired);
        return;
      }
      if (!res.ok) {
        toast.danger(unavailable);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sastipe-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.danger(unavailable);
    } finally {
      setExporting(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/me/delete", {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "DELETE" }),
      });
      if (res.status === 401) {
        toast.warning(authRequired);
        return;
      }
      if (!res.ok) {
        toast.danger(unavailable);
        return;
      }
      // Clear local state too
      try {
        localStorage.removeItem("sastipe_progress");
        localStorage.removeItem("sastipe_checkin");
        localStorage.removeItem("sastipe_student_health");
        localStorage.removeItem("sastipe_anon_id");
      } catch {
        /* private mode */
      }
      toast.success(successDeleted);
      setConfirmOpen(false);
    } catch {
      toast.danger(unavailable);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card variant="elevated" className="overflow-hidden">
      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="info">GDPR</Badge>
          <h2 className="text-base font-black tracking-tight text-gray-900">{title}</h2>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-gray-600">{subtitle}</p>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="flex flex-col gap-2 rounded-2xl border-2 border-gray-100 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md disabled:cursor-wait disabled:opacity-60"
          >
            <div className="flex items-center gap-2">
              {exporting ? (
                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
              ) : (
                <Download className="h-5 w-5 text-indigo-500" />
              )}
              <span className="text-sm font-black text-gray-900">{exportLabel}</span>
            </div>
            <span className="text-xs leading-relaxed text-gray-500">{exportHint}</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={deleting}
            className="flex flex-col gap-2 rounded-2xl border-2 border-rose-100 bg-rose-50/40 p-4 text-left transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-md disabled:cursor-wait disabled:opacity-60"
          >
            <div className="flex items-center gap-2">
              <ShieldOff className="h-5 w-5 text-rose-500" />
              <span className="text-sm font-black text-rose-900">{deleteLabel}</span>
            </div>
            <span className="text-xs leading-relaxed text-rose-700/80">{deleteHint}</span>
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 id="delete-title" className="text-base font-black text-gray-900">
                {deleteConfirmTitle}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-600">{deleteConfirmBody}</p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                size="md"
                fullWidth
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
              >
                {deleteCancel}
              </Button>
              <Button
                type="button"
                variant="danger"
                size="md"
                fullWidth
                loading={deleting}
                onClick={handleDelete}
              >
                {deleteConfirmCta}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Search, Share2, AlertTriangle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FrostPanel } from "@/components/ui/FrostPanel";
import { pageEnter, staggerContainer, staggerItem } from "@/lib/motion-variants";

type Verdict = {
  verdict: "verified" | "misleading" | "false";
  emoji: string;
  headline: string;
  explanation: string;
  shareText: string;
  source: string;
};

type Labels = {
  legalTitle: string;
  legalBody: string;
  claimTextareaAria: string;
  placeholder: string;
  checkButton: string;
  checking: string;
  shareButton: string;
  recentChecks: string;
  verdictVerified: string;
  verdictMisleading: string;
  verdictFalse: string;
};

const VERDICT_STYLES = {
  verified: {
    bg: "bg-green-50/80 backdrop-blur-sm",
    border: "border-emerald-200/80",
    text: "text-emerald-900",
    icon: CheckCircle2,
    iconColor: "text-white",
    gradient: "from-emerald-500 to-teal-600",
  },
  misleading: {
    bg: "bg-amber-50/80 backdrop-blur-sm",
    border: "border-amber-200/80",
    text: "text-amber-900",
    icon: AlertTriangle,
    iconColor: "text-white",
    gradient: "from-amber-500 to-orange-600",
  },
  false: {
    bg: "bg-red-50/80 backdrop-blur-sm",
    border: "border-red-200/80",
    text: "text-red-900",
    icon: XCircle,
    iconColor: "text-white",
    gradient: "from-red-500 to-rose-700",
  },
};

export function MisinfoScanner({ labels, locale }: { labels: Labels; locale: string }) {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Verdict | null>(null);
  const [history, setHistory] = useState<{ claim: string; verdict: Verdict }[]>([]);

  const handleScan = async () => {
    if (!claim.trim() || loading) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: claim.trim(), locale }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        setHistory((prev) => [{ claim: claim.trim(), verdict: data.data }, ...prev].slice(0, 10));
      }
    } catch {
      // offline fallback
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!result) return;
    const text = `${result.emoji} ${result.headline}\n\n${result.shareText}\n\n— Checked by Sastipe Health Advisor`;

    if (navigator.share) {
      navigator.share({ title: "Health Fact Check", text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleScan();
    }
  };

  const verdictKey = result?.verdict;
  const verdictLabel =
    result &&
    (result.verdict === "verified"
      ? labels.verdictVerified
      : result.verdict === "misleading"
        ? labels.verdictMisleading
        : labels.verdictFalse);

  return (
    <motion.div {...pageEnter} className="space-y-4">
      <FrostPanel padding="md" className="border-amber-200/50">
        <p className="text-xs font-extrabold uppercase tracking-wider text-amber-900/90">{labels.legalTitle}</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-amber-950/85">{labels.legalBody}</p>
      </FrostPanel>

      <div className="surface-frosted overflow-hidden rounded-2xl border border-white/70 bg-white/75 p-1 shadow-[0_4px_24px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/30 backdrop-blur-md transition-shadow focus-within:shadow-[0_8px_32px_rgba(192,57,43,0.1)] focus-within:ring-2 focus-within:ring-[#C0392B]/15">
        <div className="flex items-center gap-2 border-b border-slate-100/80 bg-slate-50/50 px-3 py-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-[#C0392B] text-white shadow-inner shadow-black/10">
            <Search className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Claim</span>
        </div>
        <textarea
          value={claim}
          onChange={(e) => {
            setClaim(e.target.value);
            setResult(null);
          }}
          onKeyDown={handleKeyDown}
          aria-label={labels.claimTextareaAria}
          placeholder={labels.placeholder}
          rows={4}
          className="w-full resize-none border-none bg-transparent px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        <div className="flex items-center justify-end border-t border-slate-100/80 px-3 py-2.5">
          <button
            type="button"
            onClick={() => void handleScan()}
            disabled={!claim.trim() || loading}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C0392B] to-[#E74C3C] px-6 py-2.5 text-sm font-bold text-white shadow-[0_6px_20px_rgba(192,57,43,0.3)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {labels.checking}
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                {labels.checkButton}
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result && verdictKey && (
          <motion.div
            key={verdictKey}
            initial={{ opacity: 0, y: 12, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className={`overflow-hidden rounded-3xl border-2 ${VERDICT_STYLES[verdictKey].border} ${VERDICT_STYLES[verdictKey].bg} shadow-[0_8px_40px_rgba(15,23,42,0.08)]`}
          >
            <div className={`flex items-center gap-3 bg-gradient-to-r ${VERDICT_STYLES[verdictKey].gradient} px-5 py-4`}>
              {(() => {
                const Icon = VERDICT_STYLES[verdictKey].icon;
                return <Icon className={`h-6 w-6 ${VERDICT_STYLES[verdictKey].iconColor}`} />;
              })()}
              <span className="text-sm font-black uppercase tracking-wider text-white drop-shadow-sm">
                {verdictLabel}
              </span>
            </div>

            <div className="p-4">
              <h3 className={`mb-2 text-base font-bold ${VERDICT_STYLES[verdictKey].text}`}>
                {result.emoji} {result.headline}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-slate-700">{result.explanation}</p>
              <p className="mb-3 text-xs text-slate-400">Source: {result.source}</p>

              <button
                type="button"
                onClick={handleShare}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/90 py-3.5 text-sm font-bold text-slate-800 shadow-sm backdrop-blur-sm transition-all active:scale-[0.99]"
              >
                <Share2 className="h-4 w-4 text-[#C0392B]" />
                {labels.shareButton}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {history.length > 0 && !result && (
        <div>
          <h3 className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {labels.recentChecks}
          </h3>
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-2.5"
          >
            {history.map((h, i) => (
              <motion.li key={`${h.claim.slice(0, 24)}-${i}`} variants={staggerItem}>
                <button
                  type="button"
                  onClick={() => {
                    setClaim(h.claim);
                    setResult(h.verdict);
                  }}
                  className="surface-frosted flex w-full items-start gap-3 rounded-2xl border border-white/60 bg-white/80 p-3.5 text-left shadow-sm backdrop-blur-md transition-transform active:scale-[0.99]"
                >
                  <span className="mt-0.5 text-lg">{h.verdict.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{h.claim}</p>
                    <p className="text-xs text-slate-500">{h.verdict.headline}</p>
                  </div>
                </button>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}
    </motion.div>
  );
}

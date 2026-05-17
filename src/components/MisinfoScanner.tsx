"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Mic, Share2, AlertTriangle, CheckCircle2, XCircle, Loader2, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSpeechRecognition, speakText } from "@/lib/voice";
import { ToolHero } from "@/components/ui";

type Verdict = {
  verdict: "verified" | "misleading" | "false";
  emoji: string;
  headline: string;
  explanation: string;
  shareText: string;
  source: string;
};

type Labels = {
  title: string;
  subtitle: string;
  placeholder: string;
  checkButton: string;
  checking: string;
  shareButton: string;
  recentChecks: string;
  orDescribe: string;
  verdictVerified: string;
  verdictMisleading: string;
  verdictFalse: string;
};

function isVerdict(v: unknown): v is Verdict {
  if (!v || typeof v !== "object") return false;
  const x = v as Record<string, unknown>;
  return (
    (x.verdict === "verified" || x.verdict === "misleading" || x.verdict === "false") &&
    typeof x.emoji === "string" &&
    typeof x.headline === "string" &&
    typeof x.explanation === "string" &&
    typeof x.shareText === "string" &&
    typeof x.source === "string"
  );
}

const VERDICT_STYLES = {
  verified: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    gradient: "from-green-500 to-emerald-600",
  },
  misleading: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    gradient: "from-amber-500 to-orange-600",
  },
  false: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: XCircle,
    iconColor: "text-red-500",
    gradient: "from-red-500 to-red-700",
  },
};

export function MisinfoScanner({ labels, locale }: { labels: Labels; locale: string }) {
  const tScan = useTranslations("scan");
  const tVoice = useTranslations("voice");
  const searchParams = useSearchParams();
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Verdict | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ claim: string; verdict: Verdict }[]>([]);

  const { isListening, supported: voiceSupported, toggleListening } = useSpeechRecognition({
    onResult: useCallback((text) => setClaim((prev) => prev + " " + text), [])
  });

  useEffect(() => {
    const shared = [
      searchParams.get("text"),
      searchParams.get("url"),
      searchParams.get("title"),
    ]
      .filter(Boolean)
      .join("\n")
      .trim();
    if (shared) setClaim((current) => current || shared.slice(0, 1200));
  }, [searchParams]);

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
      if (res.ok && data?.success === true && isVerdict(data?.data)) {
        setResult(data.data);
        setHistory((prev) => [{ claim: claim.trim(), verdict: data.data as Verdict }, ...prev].slice(0, 10));
      } else {
        setError(
          typeof data?.error === "string" ? data.error : tScan("errors.analyze"),
        );
      }
    } catch {
      setError(tScan("errors.network"));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (!result) return;
    const text = `${result.emoji} ${result.headline}\n\n${result.shareText}\n\n— ${tScan("shareTagline")}`;

    if (navigator.share) {
      navigator.share({ title: tScan("shareTitle"), text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleScan();
    }
  };

  return (
    <div>
      <ToolHero
        icon={Search}
        accent="ember"
        eyebrow={tScan("eyebrow")}
        title={labels.title}
        subtitle={labels.subtitle}
      />

      {/* Input area */}
      <div className="mb-4 rounded-2xl border-2 border-gray-200 bg-white p-1 shadow-sm focus-within:border-[#C0392B] focus-within:ring-4 focus-within:ring-[#C0392B]/10 transition-all">
        <textarea
          value={claim}
          onChange={(e) => { setClaim(e.target.value); setResult(null); }}
          onKeyDown={handleKeyDown}
          aria-label={tScan("inputAria")} placeholder={labels.placeholder}
          rows={3}
          className="w-full resize-none rounded-xl border-none bg-transparent px-4 py-3 text-sm focus:outline-none"
        />
        <div className="flex items-center justify-between px-3 pb-2">
          {voiceSupported ? (
            <button
              onClick={toggleListening}
              className={`rounded-full p-2 transition-all ${
                isListening 
                  ? "bg-red-100 text-red-600 animate-pulse" 
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
              aria-label={isListening ? tVoice("stop") : tVoice("start")}
            >
              <Mic className="h-4 w-4" />
            </button>
          ) : (
            <div className="w-8" />
          )}
          <button
            onClick={handleScan}
            disabled={!claim.trim() || loading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C0392B] to-[#E74C3C] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
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

      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600 animate-scale-in">
          {error}
        </div>
      )}

      {/* Result card */}
      {result && (
        <div className={`mb-6 overflow-hidden rounded-3xl border-2 ${VERDICT_STYLES[result.verdict].border} ${VERDICT_STYLES[result.verdict].bg} shadow-lg animate-scale-in`}>
          {/* Verdict badge */}
          <div className={`flex items-center gap-3 bg-gradient-to-r ${VERDICT_STYLES[result.verdict].gradient} px-5 py-4`}>
            {(() => {
              const Icon = VERDICT_STYLES[result.verdict].icon;
              return <Icon className="h-6 w-6 text-white" />;
            })()}
            <span className="text-base font-black uppercase tracking-wider text-white">
              {result.verdict === "verified" ? labels.verdictVerified :
               result.verdict === "misleading" ? labels.verdictMisleading :
               labels.verdictFalse}
            </span>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between">
              <h3 className={`mb-2 text-base font-bold ${VERDICT_STYLES[result.verdict].text}`}>
                {result.emoji} {result.headline}
              </h3>
              <button 
                onClick={() => speakText(result.explanation, locale)}
                className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"
                aria-label={tVoice("readExplanationAloud")}
              >
                <Volume2 className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-gray-700">
              {result.explanation}
            </p>
            <p className="mb-3 text-xs text-gray-400">
              {tScan("sourceLabel")}: {result.source}
            </p>

            {/* Share button */}
            <button
              onClick={handleShare}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all active:scale-[0.98]"
            >
              <Share2 className="h-4 w-4" />
              {labels.shareButton}
            </button>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && !result && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {labels.recentChecks}
          </h3>
          <div className="flex flex-col gap-2">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => { setClaim(h.claim); setResult(h.verdict); }}
                className="flex items-start gap-3 rounded-xl bg-white p-3 text-left shadow-sm ring-1 ring-gray-100 transition-all active:scale-[0.99]"
              >
                <span className="mt-0.5 text-lg">{h.verdict.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">{h.claim}</p>
                  <p className="text-xs text-gray-400">{h.verdict.headline}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

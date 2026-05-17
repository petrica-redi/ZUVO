"use client";

import { useRef, useState } from "react";
import {
  FileText, Search, Loader2, Heart, AlertTriangle, Pill,
  HelpCircle, Lightbulb, Siren, ChevronDown, ChevronUp,
  Camera, Upload, X, ImageIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import NextImage from "next/image";

const MAX_DIMENSION = 2048;
const MAX_OUTPUT_BYTES = 5_000_000; // 5 MB binary post-base64
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"] as const;
type AcceptedMime = (typeof ACCEPTED_MIME)[number];

type PreparedImage = {
  /** Plain base64 (no `data:` prefix), as required by the API schema. */
  base64: string;
  mediaType: AcceptedMime;
  /** Data URL for preview rendering. */
  previewUrl: string;
  approxBytes: number;
};

/**
 * Load a file as a HTMLImageElement, downscale onto a canvas if either
 * dimension exceeds MAX_DIMENSION, and return JPEG-encoded base64. Keeps
 * upload payloads small and uniform regardless of phone camera quality.
 */
async function prepareImage(file: File): Promise<PreparedImage | { error: string }> {
  if (!ACCEPTED_MIME.includes(file.type as AcceptedMime)) {
    return { error: "Unsupported file type. Please use JPG, PNG, or WEBP." };
  }

  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);

  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight),
  );
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { error: "Browser cannot resize image" };
  ctx.drawImage(img, 0, 0, width, height);

  // Re-encode as JPEG at q=0.85 — best size/quality tradeoff for documents.
  let q = 0.85;
  let outDataUrl = canvas.toDataURL("image/jpeg", q);
  while (estimateBytes(outDataUrl) > MAX_OUTPUT_BYTES && q > 0.4) {
    q -= 0.1;
    outDataUrl = canvas.toDataURL("image/jpeg", q);
  }
  if (estimateBytes(outDataUrl) > MAX_OUTPUT_BYTES) {
    return { error: "Image is too large after compression. Try a smaller photo." };
  }

  const commaIdx = outDataUrl.indexOf(",");
  if (commaIdx < 0) return { error: "Failed to encode image" };

  return {
    base64: outDataUrl.slice(commaIdx + 1),
    mediaType: "image/jpeg",
    previewUrl: outDataUrl,
    approxBytes: estimateBytes(outDataUrl),
  };
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image failed to load"));
    img.src = src;
  });
}

function estimateBytes(dataUrl: string): number {
  const commaIdx = dataUrl.indexOf(",");
  const b64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
  // Base64 expands by ~4/3.
  return Math.floor((b64.length * 3) / 4);
}

type Medication = {
  name: string;
  whatItDoes: string;
  howToTake: string;
  sideEffects: string;
  neverDo: string;
};

type ExplainResult = {
  diagnosis: {
    name: string;
    simpleExplanation: string;
    whyItMatters: string;
    whatHappensIfIgnored: string;
  };
  medications: Medication[];
  questionsForDoctor: string[];
  dailyTips: string[];
  emergencySigns: string[];
};

const EXAMPLES = [
  "Hipertensiune arteriala",
  "Diabet tip 2",
  "Anemie",
  "Astm bronsic",
  "Metformin 500mg",
  "Enalapril 10mg",
];

export function PrescriptionExplainer({ locale }: { locale: string }) {
  const t = useTranslations("explain");
  const tErrors = useTranslations("errors");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [expandedMed, setExpandedMed] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<PreparedImage | null>(null);
  const [preparing, setPreparing] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const onFilePicked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset the input so picking the same file twice still fires `change`.
    e.target.value = "";
    if (!file) return;

    setPreparing(true);
    setError(null);
    try {
      const prepared = await prepareImage(file);
      if ("error" in prepared) {
        setError(prepared.error);
      } else {
        setImage(prepared);
        setResult(null);
      }
    } catch {
      setError(t("imageFailed"));
    } finally {
      setPreparing(false);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleExplain = async (text?: string) => {
    const query = text ?? input.trim();
    // Either text OR image is required.
    if (!query && !image) return;
    if (loading) return;
    if (text) setInput(text);

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const body: Record<string, unknown> = { locale };
      if (query) body.input = query;
      if (image) {
        body.image = { mediaType: image.mediaType, base64: image.base64 };
      }
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(tErrors("analyzeFailed"));
      }
    } catch {
      setError(tErrors("connectionError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <div className="relative mb-5 aspect-[21/11] w-full overflow-hidden rounded-3xl shadow-xl">
          <NextImage
            src="/images/ai/ai-spot-prescription.png"
            alt={t("heroArtAlt")}
            fill
            className="object-cover object-[center_42%]"
            sizes="(max-width:768px) 100vw, 42rem"
            priority
          />
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25">
            <FileText className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">{t("heroTitle")}</h1>
          <p className="mt-2 max-w-md text-sm text-gray-500">{t("heroSubtitle")}</p>
        </div>
      </div>

      {/* Camera + Upload row */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => cameraInputRef.current?.click()}
          disabled={preparing || loading}
          className="group flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--color-brand-300)] bg-[var(--color-brand-50)]/60 px-4 py-3.5 text-sm font-extrabold text-[var(--color-brand-800)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-brand-500)] hover:bg-[var(--color-brand-50)] disabled:cursor-wait disabled:opacity-60"
          style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
        >
          <Camera className="lucide h-4 w-4" strokeWidth={2} />
          {t("takePhoto")}
        </button>
        <button
          type="button"
          onClick={() => uploadInputRef.current?.click()}
          disabled={preparing || loading}
          className="group flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-3.5 text-sm font-extrabold text-[var(--color-text-primary)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-text-primary)] disabled:cursor-wait disabled:opacity-60"
          style={{ transitionTimingFunction: "var(--ease-emphasized)" }}
        >
          <Upload className="lucide h-4 w-4" strokeWidth={2} />
          {t("uploadImage")}
        </button>
        {/* Hidden inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="sr-only"
          aria-label={t("takePhoto")}
          onChange={onFilePicked}
        />
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          aria-label={t("uploadImage")}
          onChange={onFilePicked}
        />
      </div>

      {/* Image preview */}
      {preparing && (
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-[var(--color-surface-subtle)] px-4 py-3 text-sm text-[var(--color-text-secondary)] shadow-1 hairline animate-fade-in">
          <Loader2 className="lucide h-4 w-4 animate-spin text-[var(--color-brand-700)]" strokeWidth={2} />
          {t("preparingImage")}
        </div>
      )}

      {image && !preparing && (
        <div className="mb-3 flex items-start gap-3 rounded-2xl border border-[var(--color-brand-200)] bg-[var(--color-brand-50)]/40 p-3 shadow-1 animate-fade-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.previewUrl}
            alt={t("imagePreviewAlt")}
            className="h-16 w-16 flex-shrink-0 rounded-xl object-cover ring-1 ring-[var(--color-border-subtle)]"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[var(--color-brand-700)]">
              <ImageIcon className="lucide h-3 w-3" strokeWidth={2} />
              {t("imageReady")}
            </div>
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {t("imageReadyBody")}
            </p>
            <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
              {(image.approxBytes / 1024).toFixed(0)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={removeImage}
            disabled={loading}
            aria-label={t("imageRemove")}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-[var(--color-text-muted)] shadow-1 transition-colors hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger-text)] disabled:opacity-50"
          >
            <X className="lucide h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="mb-4 rounded-2xl border-2 border-gray-200 bg-white p-1 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
        <textarea
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(null); }}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleExplain(); } }}
          placeholder={image ? t("placeholderWithImage") : t("placeholder")}
          aria-label={t("inputAria")}
          rows={3}
          className="w-full resize-none rounded-xl border-none bg-transparent px-4 py-3 text-sm focus:outline-none"
        />
        <div className="flex items-center justify-end px-3 pb-2">
          <button
            type="button"
            onClick={() => handleExplain()}
            disabled={(!input.trim() && !image) || loading || preparing}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {t("ctaAnalyzing")}</>
            ) : (
              <><Search className="h-4 w-4" /> {t("cta")}</>
            )}
          </button>
        </div>
      </div>

      {/* Quick examples */}
      {!result && !loading && (
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
            {t("examplesHeading")}
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => handleExplain(ex)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 active:scale-95"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-16 animate-fade-in">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-100 border-t-blue-500" />
          <p className="text-sm font-semibold text-gray-500">{t("loading")}</p>
          <div className="mx-auto h-2 w-48 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-full animate-shimmer rounded-full" />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-4 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          {/* Diagnosis card */}
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3">
              <Heart className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white">
                {result.diagnosis.name}
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                  {t("sections.whatThisMeans")}
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {result.diagnosis.simpleExplanation}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-600">
                  {t("sections.whyItMatters")}
                </p>
                <p className="text-sm leading-relaxed text-gray-700">
                  {result.diagnosis.whyItMatters}
                </p>
              </div>
              <div className="rounded-xl bg-red-50 p-3">
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-red-600">
                  <AlertTriangle className="h-3 w-3" /> {t("sections.ifIgnored")}
                </p>
                <p className="text-sm leading-relaxed text-red-700">
                  {result.diagnosis.whatHappensIfIgnored}
                </p>
              </div>
            </div>
          </div>

          {/* Medications */}
          {result.medications.length > 0 && (
            <div>
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900">
                <Pill className="h-4 w-4 text-indigo-500" /> {t("sections.medicationsTitle")}
              </h3>
              <div className="space-y-2">
                {result.medications.map((med, i) => (
                  <div key={i} className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <button
                      onClick={() => setExpandedMed(expandedMed === i ? null : i)}
                      className="flex w-full items-center justify-between p-4 text-left"
                    >
                      <div>
                        <span className="text-sm font-semibold text-gray-900">{med.name}</span>
                        <p className="mt-0.5 text-xs text-gray-500">{med.whatItDoes}</p>
                      </div>
                      {expandedMed === i ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    {expandedMed === i && (
                      <div className="space-y-2 border-t border-gray-50 px-4 pb-4 pt-2">
                        <div className="rounded-lg bg-green-50 p-2">
                          <p className="text-xs font-semibold text-green-700">{t("sections.howToTake")}</p>
                          <p className="text-xs text-green-600">{med.howToTake}</p>
                        </div>
                        <div className="rounded-lg bg-amber-50 p-2">
                          <p className="text-xs font-semibold text-amber-700">{t("sections.sideEffects")}</p>
                          <p className="text-xs text-amber-600">{med.sideEffects}</p>
                        </div>
                        <div className="rounded-lg bg-red-50 p-2">
                          <p className="text-xs font-semibold text-red-700">{t("sections.neverDo")}</p>
                          <p className="text-xs text-red-600">{med.neverDo}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions for doctor */}
          {result.questionsForDoctor.length > 0 && (
            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-purple-800">
                <HelpCircle className="h-4 w-4" /> {t("sections.questionsTitle")}
              </h3>
              <ul className="space-y-1.5">
                {result.questionsForDoctor.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-purple-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-[10px] font-bold text-purple-800">
                      {i + 1}
                    </span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Daily tips */}
          {result.dailyTips.length > 0 && (
            <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-green-800">
                <Lightbulb className="h-4 w-4" /> {t("sections.tipsTitle")}
              </h3>
              <ul className="space-y-1.5">
                {result.dailyTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Emergency signs */}
          {result.emergencySigns.length > 0 && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-red-800">
                <Siren className="h-4 w-4" /> {t("sections.emergencyTitle")}
              </h3>
              <ul className="space-y-1.5">
                {result.emergencySigns.map((sign, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Try another */}
          <button
            type="button"
            onClick={() => { setResult(null); setInput(""); setImage(null); }}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-600 shadow-sm transition-all active:scale-[0.98]"
          >
            {t("anotherCta")}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * POST /api/voice/transcribe
 *
 * Accepts a single audio blob (any of webm/ogg/mp3/wav up to ~10 MB) and
 * returns Deepgram's transcript plus the auto-detected language. The mic
 * button in the chat advisor uses this so we get real multilingual STT —
 * including languages where Chrome's WebSpeech engine is poor or missing
 * (Albanian, Romani, Bulgarian, etc.).
 *
 * Form-data shape:
 *   audio:        File  — required, the recorded audio blob
 *   language:     str   — optional ISO-639-1 hint ("ro", "sq", "en"…)
 *   translateTo:  str   — optional target language for translation
 *
 * Responses:
 *   200  { transcript, detectedLanguage, translation, confidence, source }
 *   400  invalid form / missing audio / file too large
 *   429  rate-limited
 *   503  Deepgram not configured on this deploy
 *   502  Deepgram call failed
 */
import { NextRequest, NextResponse } from "next/server";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { deepgramTranscribe, getDeepgramConfig } from "@/lib/ai/deepgram";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_PREFIXES = ["audio/"] as const;
const LANG_RE = /^[a-z]{2,3}(-[A-Z]{2})?$/;

export async function POST(req: NextRequest) {
  const rate = await applyRateLimitAsync(req, {
    namespace: "voice-transcribe",
    limit: 20,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  if (!getDeepgramConfig()) {
    return NextResponse.json(
      { success: false, error: "voice_unavailable", message: "Voice transcription is not configured." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid form data" },
      { status: 400 },
    );
  }

  const audio = form.get("audio");
  if (!(audio instanceof File)) {
    return NextResponse.json(
      { success: false, error: "Missing `audio` field" },
      { status: 400 },
    );
  }
  if (audio.size === 0) {
    return NextResponse.json(
      { success: false, error: "Audio file is empty" },
      { status: 400 },
    );
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { success: false, error: "Audio is too large (max 10 MB)" },
      { status: 400 },
    );
  }
  const contentType = (audio.type || "audio/webm").toLowerCase();
  if (!ALLOWED_PREFIXES.some((p) => contentType.startsWith(p))) {
    return NextResponse.json(
      { success: false, error: "Unsupported audio content type" },
      { status: 400 },
    );
  }

  const languageHint = form.get("language");
  const language = typeof languageHint === "string" && LANG_RE.test(languageHint)
    ? languageHint
    : undefined;

  const translateToRaw = form.get("translateTo");
  const translateTo = typeof translateToRaw === "string" && LANG_RE.test(translateToRaw)
    ? translateToRaw
    : undefined;

  const bytes = new Uint8Array(await audio.arrayBuffer());

  const result = await deepgramTranscribe(bytes, {
    contentType,
    language,
    translateTo,
  });
  if (!result) {
    return NextResponse.json(
      { success: false, error: "transcription_failed", message: "Could not transcribe audio." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      transcript: result.transcript,
      detectedLanguage: result.detectedLanguage,
      translation: result.translation,
      confidence: result.confidence,
      source: "deepgram",
    },
    { status: 200 },
  );
}

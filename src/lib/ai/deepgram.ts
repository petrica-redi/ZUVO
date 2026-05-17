/**
 * Deepgram client wrapper.
 *
 * The key lives only in `DEEPGRAM_API_KEY` (server-side env). The wrapper is
 * defensive: when the key is missing it returns `null` so callers can short
 * circuit with a 503 instead of crashing the build or leaking errors.
 */

const DEEPGRAM_LISTEN_URL = "https://api.deepgram.com/v1/listen";

export type DeepgramConfig = {
  apiKey: string;
};

export function getDeepgramConfig(): DeepgramConfig | null {
  const apiKey = process.env.DEEPGRAM_API_KEY?.trim();
  if (!apiKey) return null;
  return { apiKey };
}

export type DeepgramTranscribeOptions = {
  /** MIME of the uploaded audio (e.g. `audio/webm`, `audio/ogg;codecs=opus`). */
  contentType: string;
  /** Force a language; when omitted the API auto-detects multilingual audio. */
  language?: string;
  /** Optional translation target (e.g. "en"). Uses Deepgram's `translate=` param. */
  translateTo?: string;
  /** Optional Deepgram model override. Defaults to `nova-3` for multilingual. */
  model?: string;
};

export type DeepgramTranscribeResult = {
  transcript: string;
  /** ISO-639-1 code reported by Deepgram, if any. */
  detectedLanguage: string | null;
  /** Translated text when `translateTo` was set and Deepgram returned a translation. */
  translation: string | null;
  /** Confidence 0..1 of the top alternative, if reported. */
  confidence: number | null;
};

type DeepgramApiResponse = {
  results?: {
    channels?: Array<{
      detected_language?: string;
      alternatives?: Array<{
        transcript?: string;
        confidence?: number;
        translations?: Array<{ language?: string; translation?: string }>;
      }>;
    }>;
  };
};

/**
 * Send raw audio bytes to Deepgram's pre-recorded transcription endpoint.
 *
 * Returns `null` when the call fails — the caller is expected to translate
 * that into a user-facing 502/503 without leaking provider details.
 */
export async function deepgramTranscribe(
  audio: ArrayBuffer | Uint8Array | Buffer,
  opts: DeepgramTranscribeOptions,
): Promise<DeepgramTranscribeResult | null> {
  const config = getDeepgramConfig();
  if (!config) return null;

  const query = new URLSearchParams();
  query.set("model", opts.model ?? "nova-3");
  query.set("smart_format", "true");
  query.set("punctuate", "true");
  if (opts.language) {
    query.set("language", opts.language);
  } else {
    // Nova multilingual handles 30+ languages; let Deepgram auto-detect when
    // the caller does not constrain it.
    query.set("detect_language", "true");
  }
  if (opts.translateTo) {
    query.set("translate", opts.translateTo);
  }

  const url = `${DEEPGRAM_LISTEN_URL}?${query.toString()}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${config.apiKey}`,
        "Content-Type": opts.contentType,
      },
      body: audio as BodyInit,
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;

  let json: DeepgramApiResponse;
  try {
    json = (await res.json()) as DeepgramApiResponse;
  } catch {
    return null;
  }

  const channel = json.results?.channels?.[0];
  const alternative = channel?.alternatives?.[0];
  const transcript = alternative?.transcript?.trim() ?? "";
  const detectedLanguage = channel?.detected_language?.trim() || null;
  const confidence = typeof alternative?.confidence === "number" ? alternative.confidence : null;
  const translation =
    alternative?.translations?.find((t) => !opts.translateTo || t.language === opts.translateTo)
      ?.translation?.trim() ?? null;

  return {
    transcript,
    detectedLanguage,
    translation,
    confidence,
  };
}

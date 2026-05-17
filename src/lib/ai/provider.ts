/**
 * AI provider abstraction.
 *
 * Picks Anthropic (Claude) when `ANTHROPIC_API_KEY` is set, otherwise
 * falls back to OpenAI when `OPENAI_API_KEY` is set, otherwise returns
 * `null` so routes can degrade to 503.
 *
 * Both providers return the same normalized SSE wire format on the
 * client side: `data: {"text":"..."}` chunks terminated by `data: [DONE]`.
 *
 * Models are picked from env so we can switch without code changes:
 *   - `ANTHROPIC_MODEL`  (default: claude-sonnet-4-5)
 *   - `OPENAI_MODEL`     (default: gpt-4o)
 */

/** Supported image media types — kept narrow to match both providers. */
export type ImageMediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

export type MessagePart =
  | { type: "text"; text: string }
  | { type: "image"; mediaType: ImageMediaType; base64: string };

export type ChatMessage = {
  role: "user" | "assistant";
  /** Text shorthand, or a multimodal list of parts. */
  content: string | MessagePart[];
};

export type ChatOptions = {
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  /** Per-call abort signal. Defaults to a 30s timeout if omitted. */
  signal?: AbortSignal;
};

function hasAnyImage(messages: ChatMessage[]): boolean {
  return messages.some(
    (m) => Array.isArray(m.content) && m.content.some((p) => p.type === "image"),
  );
}

/* ============================================================
 *  Per-provider message serialization
 * ============================================================ */

type AnthropicContentBlock =
  | { type: "text"; text: string }
  | {
      type: "image";
      source: { type: "base64"; media_type: ImageMediaType; data: string };
    };

type AnthropicMessage = {
  role: "user" | "assistant";
  content: string | AnthropicContentBlock[];
};

function toAnthropicMessages(messages: ChatMessage[]): AnthropicMessage[] {
  return messages.map((m) => {
    if (typeof m.content === "string") {
      return { role: m.role, content: m.content };
    }
    const blocks: AnthropicContentBlock[] = m.content.map((p) =>
      p.type === "text"
        ? { type: "text", text: p.text }
        : {
            type: "image",
            source: { type: "base64", media_type: p.mediaType, data: p.base64 },
          },
    );
    return { role: m.role, content: blocks };
  });
}

type OpenAIContentPart =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

type OpenAIMessage = {
  role: "system" | "user" | "assistant";
  content: string | OpenAIContentPart[];
};

function toOpenAiMessages(
  system: string,
  messages: ChatMessage[],
): OpenAIMessage[] {
  const out: OpenAIMessage[] = [{ role: "system", content: system }];
  for (const m of messages) {
    if (typeof m.content === "string") {
      out.push({ role: m.role, content: m.content });
      continue;
    }
    const parts: OpenAIContentPart[] = m.content.map((p) =>
      p.type === "text"
        ? { type: "text", text: p.text }
        : {
            type: "image_url",
            image_url: { url: `data:${p.mediaType};base64,${p.base64}` },
          },
    );
    out.push({ role: m.role, content: parts });
  }
  return out;
}

export type AiProvider = "anthropic" | "openai";

export class ProviderUnavailableError extends Error {
  constructor() {
    super("AI service not configured");
    this.name = "ProviderUnavailableError";
  }
}

export function getActiveProvider(): AiProvider | null {
  if (process.env.ANTHROPIC_API_KEY?.trim()) return "anthropic";
  if (process.env.OPENAI_API_KEY?.trim()) return "openai";
  return null;
}

function getAnthropicModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-4-5";
}

function getOpenAiModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o";
}

/* ============================================================
 *  Non-streaming text completion (for routes returning JSON)
 * ============================================================ */

export async function completeText(opts: ChatOptions): Promise<string> {
  const provider = getActiveProvider();
  if (!provider) throw new ProviderUnavailableError();

  // Structured-JSON routes can return up to ~2000 tokens and Claude is
  // sometimes slower than GPT for these long deterministic outputs.
  // 60s gives reasonable headroom while still failing fast on bad upstreams.
  const signal = opts.signal ?? AbortSignal.timeout(60_000);
  if (provider === "anthropic") return completeAnthropic(opts, signal);
  return completeOpenAi(opts, signal);
}

async function completeAnthropic(opts: ChatOptions, signal: AbortSignal): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY!.trim();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: getAnthropicModel(),
      max_tokens: opts.maxTokens ?? 800,
      temperature: opts.temperature ?? 0.4,
      system: opts.system,
      messages: toAnthropicMessages(opts.messages),
    }),
    signal,
  });
  if (!res.ok) throw new ProviderHttpError(res.status, await safeText(res));
  const data = (await res.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  return (data.content ?? [])
    .filter((b) => b.type === "text" && typeof b.text === "string")
    .map((b) => b.text as string)
    .join("");
}

async function completeOpenAi(opts: ChatOptions, signal: AbortSignal): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY!.trim();
  // OpenAI uses different model fields for vision; force gpt-4o (or the
  // configured model) which supports image_url input.
  const model = hasAnyImage(opts.messages) ? getOpenAiModel() : getOpenAiModel();
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: opts.maxTokens ?? 800,
      temperature: opts.temperature ?? 0.4,
      messages: toOpenAiMessages(opts.system, opts.messages),
    }),
    signal,
  });
  if (!res.ok) throw new ProviderHttpError(res.status, await safeText(res));
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

/* ============================================================
 *  Streaming chat — normalized SSE for /api/chat
 * ============================================================ */

/**
 * Returns a `ReadableStream<Uint8Array>` already encoded as our wire
 * format: `data: {"text":"…"}\n\n` chunks plus a final `data: [DONE]`.
 */
export async function streamText(opts: ChatOptions): Promise<ReadableStream<Uint8Array>> {
  const provider = getActiveProvider();
  if (!provider) throw new ProviderUnavailableError();

  const signal = opts.signal ?? AbortSignal.timeout(60_000);
  if (provider === "anthropic") return streamAnthropic(opts, signal);
  return streamOpenAi(opts, signal);
}

async function streamAnthropic(
  opts: ChatOptions,
  signal: AbortSignal,
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.ANTHROPIC_API_KEY!.trim();
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: getAnthropicModel(),
      max_tokens: opts.maxTokens ?? 800,
      temperature: opts.temperature ?? 0.4,
      system: opts.system,
      messages: toAnthropicMessages(opts.messages),
      stream: true,
    }),
    signal,
  });

  if (!upstream.ok) {
    throw new ProviderHttpError(upstream.status, await safeText(upstream));
  }

  return translateAnthropicStream(upstream.body);
}

async function streamOpenAi(
  opts: ChatOptions,
  signal: AbortSignal,
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENAI_API_KEY!.trim();
  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: getOpenAiModel(),
      max_tokens: opts.maxTokens ?? 800,
      temperature: opts.temperature ?? 0.4,
      stream: true,
      messages: toOpenAiMessages(opts.system, opts.messages),
    }),
    signal,
  });

  if (!upstream.ok) {
    throw new ProviderHttpError(upstream.status, await safeText(upstream));
  }

  return translateOpenAiStream(upstream.body);
}

/* ============================================================
 *  Stream translators — provider-specific SSE → ours
 * ============================================================ */

const encoder = new TextEncoder();

function emit(controller: ReadableStreamDefaultController<Uint8Array>, text: string) {
  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
}

function emitDone(controller: ReadableStreamDefaultController<Uint8Array>) {
  controller.enqueue(encoder.encode("data: [DONE]\n\n"));
}

function emitInterrupt(controller: ReadableStreamDefaultController<Uint8Array>) {
  emit(controller, "\n\nThe AI stream was interrupted. Please try again.");
}

function translateOpenAiStream(
  body: ReadableStream<Uint8Array> | null,
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              emitDone(controller);
              continue;
            }
            try {
              const parsed = JSON.parse(data) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const text = parsed.choices?.[0]?.delta?.content;
              if (text) emit(controller, text);
            } catch {
              /* skip malformed chunk */
            }
          }
        }
      } catch {
        emitInterrupt(controller);
      } finally {
        controller.close();
      }
    },
  });
}

function translateAnthropicStream(
  body: ReadableStream<Uint8Array> | null,
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = body?.getReader();
      if (!reader) {
        controller.close();
        return;
      }
      const decoder = new TextDecoder();
      let buffer = "";

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          // Anthropic SSE alternates `event: …` and `data: …` lines. We
          // only care about `data:` lines; the event name is duplicated
          // inside the JSON payload as `type`.
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (!data) continue;
            try {
              const parsed = JSON.parse(data) as {
                type?: string;
                delta?: { type?: string; text?: string };
              };
              if (
                parsed.type === "content_block_delta" &&
                parsed.delta?.type === "text_delta" &&
                typeof parsed.delta.text === "string"
              ) {
                emit(controller, parsed.delta.text);
              } else if (parsed.type === "message_stop") {
                emitDone(controller);
              }
            } catch {
              /* skip malformed chunk */
            }
          }
        }
      } catch {
        emitInterrupt(controller);
      } finally {
        controller.close();
      }
    },
  });
}

/* ============================================================
 *  Errors / helpers
 * ============================================================ */

export class ProviderHttpError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string) {
    super(`AI provider returned HTTP ${status}`);
    this.name = "ProviderHttpError";
    this.status = status;
    this.body = body;
  }
}

async function safeText(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 1024);
  } catch {
    return "";
  }
}

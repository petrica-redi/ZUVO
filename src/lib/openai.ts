import { getOpenAIConfig, type OpenAIConfig } from "@/lib/env";
import { traceAsync } from "@/lib/langfuse";

export const DEFAULT_OPENAI_BASE = "https://api.openai.com/v1";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

type ChatCompletionsRequest = {
  max_tokens: number;
  temperature: number;
  stream?: boolean;
  messages: ChatMessage[];
};

/**
 * Resolves OpenAI (or OpenAI-compatible) config. Returns null if API key missing.
 */
export function getOpenAIClientConfig(): (OpenAIConfig & { baseUrl: string; model: string }) | null {
  const c = getOpenAIConfig();
  if (!c) return null;
  return { ...c, baseUrl: c.baseUrl.replace(/\/$/, "") };
}

/**
 * Non-streaming chat completion. Traced with Langfuse when configured.
 */
export async function openaiChatCompletion(
  request: ChatCompletionsRequest,
  traceName: string,
  traceMeta?: Record<string, unknown>,
): Promise<Response> {
  const cfg = getOpenAIClientConfig();
  if (!cfg) {
    return new Response(JSON.stringify({ error: { message: "not configured" } }), { status: 503 });
  }

  const url = `${cfg.baseUrl}/chat/completions`;
  return traceAsync(
    { name: traceName, metadata: { model: cfg.model, ...traceMeta } },
    async () => {
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cfg.apiKey}`,
        },
        body: JSON.stringify({
          model: cfg.model,
          max_tokens: request.max_tokens,
          temperature: request.temperature,
          stream: request.stream ?? false,
          messages: request.messages,
        }),
      });
      return r;
    },
  );
}


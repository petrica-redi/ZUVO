/**
 * POST /api/chat — Redi Health advisor conversation.
 *
 * Accepts: { messages: [{ role, content }], locale: string }
 * Returns: SSE stream — `data: {"text":"…"}` chunks, terminated by `data: [DONE]`.
 *
 * Provider is picked at runtime in `@/lib/ai/provider` — Anthropic
 * (Claude) when `ANTHROPIC_API_KEY` is set, otherwise OpenAI.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SYSTEM_PROMPT, CHAT_CONFIG } from "@/lib/ai/system-prompt";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { aiBudgetExceededResponse, checkAiBudget, sanitizeAiInput } from "@/lib/api/ai-budget";
import { buildEmergencyConsultSummary, detectEmergencyRedFlag } from "@/lib/health/red-flags";
import {
  getActiveProvider,
  ProviderHttpError,
  ProviderUnavailableError,
  streamText,
} from "@/lib/ai/provider";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(12),
  locale: z.string().trim().min(2).max(16).optional(),
});

function sseChunk(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function POST(req: NextRequest) {
  const rate = await applyRateLimitAsync(req, {
    namespace: "chat",
    limit: 12,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsedBody = await parseJsonBody(req, chatRequestSchema);
  if (!parsedBody.success) return parsedBody.response;

  const { messages, locale } = parsedBody.data;
  const latestText = messages.map((m) => m.content).join("\n");
  const redFlag = detectEmergencyRedFlag(latestText);
  if (redFlag) {
    const summary = buildEmergencyConsultSummary(redFlag);
    const text = `${summary.title}\n\n${summary.whatToDo}\n\n${summary.assessment}`;
    return new Response(`${sseChunk({ text })}data: [DONE]\n\n`, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Redi-Safety-Override": "true",
      },
    });
  }

  if (!getActiveProvider()) {
    return NextResponse.json(
      { success: false, error: "AI service not configured" },
      { status: 503 },
    );
  }

  const budget = await checkAiBudget(req);
  if (!budget.allowed) return aiBudgetExceededResponse(budget);

  const localeInstruction = locale
    ? `\n\nIMPORTANT: The user's preferred language is "${locale}". Respond in this language. If they write in a different language, respond in the language they wrote in.`
    : "";
  const sanitizedMessages = messages.slice(-10).map((m) => ({
    role: m.role,
    content: sanitizeAiInput(m.content),
  }));

  try {
    const readable = await streamText({
      system: SYSTEM_PROMPT + localeInstruction,
      messages: sanitizedMessages,
      maxTokens: CHAT_CONFIG.maxTokens,
      temperature: CHAT_CONFIG.temperature,
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Redi-Provider": getActiveProvider() ?? "none",
      },
    });
  } catch (err) {
    if (err instanceof ProviderUnavailableError) {
      return NextResponse.json(
        { success: false, error: "AI service not configured" },
        { status: 503 },
      );
    }
    if (err instanceof ProviderHttpError) {
      return new Response(
        JSON.stringify({ success: false, error: "AI service temporarily unavailable" }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(
      JSON.stringify({ success: false, error: "AI service temporarily unavailable" }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}

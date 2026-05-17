/**
 * POST /api/chat — Zuvo health advisor conversation
 *
 * Accepts: { messages: [{ role, content }], locale: string }
 * Returns: streaming text response from OpenAI
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SYSTEM_PROMPT, CHAT_CONFIG } from "@/lib/ai/system-prompt";
import { parseJsonBody } from "@/lib/api/validation";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { aiBudgetExceededResponse, checkAiBudget, sanitizeAiInput } from "@/lib/api/ai-budget";
import { buildEmergencyConsultSummary, detectEmergencyRedFlag } from "@/lib/health/red-flags";

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
        "X-Sastipe-Safety-Override": "true",
      },
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: "AI service not configured" }, { status: 503 });
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

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: CHAT_CONFIG.model,
      max_tokens: CHAT_CONFIG.maxTokens,
      temperature: CHAT_CONFIG.temperature,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT + localeInstruction },
        ...sanitizedMessages,
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    return new Response(
      JSON.stringify({ success: false, error: "AI service temporarily unavailable" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  // Stream the response back to the client
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      const reader = response.body?.getReader();
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
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const text = parsed.choices?.[0]?.delta?.content;
                if (text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              } catch {
                // Skip non-JSON lines
              }
            }
          }
        }
      } catch {
        controller.enqueue(encoder.encode(sseChunk({ text: "\n\nThe AI stream was interrupted. Please try again." })));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/**
 * POST /api/chat — Zuvo health advisor conversation
 *
 * Accepts: { messages: [{ role, content }], locale: string }
 * Returns: streaming text response from OpenAI
 */
import { NextRequest } from "next/server";
import { SYSTEM_PROMPT, CHAT_CONFIG } from "@/lib/ai/system-prompt";

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "AI service not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }

  const body = await req.json();
  const { messages, locale } = body as {
    messages: { role: "user" | "assistant"; content: string }[];
    locale?: string;
  };

  if (!messages || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "No messages provided" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const localeInstruction = locale
    ? `\n\nIMPORTANT: The user's preferred language is "${locale}". Respond in this language. If they write in a different language, respond in the language they wrote in.`
    : "";

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
        ...messages.slice(-10),
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("OpenAI API error:", err);
    return new Response(
      JSON.stringify({ error: "AI service temporarily unavailable" }),
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
      } catch (err) {
        console.error("Stream error:", err);
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

import { NextRequest, NextResponse } from "next/server";
import { CONSULT_SYSTEM_PROMPT } from "@/lib/ai/consult-prompt";
import { openaiChatCompletion } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { messages, locale } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    locale?: string;
  };

  if (!messages?.length) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  const localeNote = locale
    ? `\nThe user's preferred language is "${locale}". Respond in that language.`
    : "";

  const response = await openaiChatCompletion(
    {
      max_tokens: 1000,
      temperature: 0.4,
      messages: [
        { role: "system", content: CONSULT_SYSTEM_PROMPT + localeNote },
        ...messages.slice(-8),
      ],
    },
    "consult.turn",
    { locale },
  );

  if (response.status === 503) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }
  if (!response.ok) {
    return NextResponse.json({ error: "AI service error" }, { status: 502 });
  }

  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? "";

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({
      success: true,
      data: { stage: "gathering", message: content, questionsAsked: 1 },
    });
  }
}

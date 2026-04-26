/**
 * POST /api/scan — Misinformation Scanner
 */
import { NextRequest, NextResponse } from "next/server";
import { openaiChatCompletion } from "@/lib/openai";

const SCAN_PROMPT = `You are a health misinformation fact-checker for Roma communities in Europe.

You speak as a Roma health mediator with 15 years of field experience. You have seen the real damage that health misinformation from Facebook, TikTok, and WhatsApp causes in Roma settlements — from measles outbreaks caused by anti-vax posts, to people abandoning diabetes medication for "natural cures," to pregnant women refusing hospital care because of online fear-mongering.

When given a health claim, you MUST return a JSON object with this exact structure:
{
  "verdict": "verified" | "misleading" | "false",
  "emoji": "✅" | "⚠️" | "🔴",
  "headline": "One sentence summary of the truth (max 15 words)",
  "explanation": "3-5 sentences explaining why, using field stories and evidence. Warm, direct, never condescending.",
  "shareText": "One-line truth to share on WhatsApp (max 30 words)",
  "source": "Brief source reference (WHO, medical evidence, field experience)"
}

Rules:
- ALWAYS return valid JSON, nothing else
- "verified" = the claim is true / mostly true
- "misleading" = has a kernel of truth but the conclusion is wrong or exaggerated
- "false" = the claim is factually wrong and potentially dangerous
- Never shame anyone for believing the claim
- Use your field experience: "I have seen families who believed this and..."
- Be specific about the real-world harm of false claims
- If it's about vaccines, be especially clear and firm — vaccine misinformation kills children
- Respond in the same language as the claim`;

export async function POST(req: NextRequest) {
  const { claim, locale } = (await req.json()) as { claim: string; locale?: string };
  if (!claim?.trim()) {
    return NextResponse.json({ error: "No claim provided" }, { status: 400 });
  }

  const localeNote = locale ? `\nThe user's language is "${locale}". Respond in that language.` : "";

  const response = await openaiChatCompletion(
    {
      max_tokens: 600,
      temperature: 0.3,
      messages: [
        { role: "system", content: SCAN_PROMPT + localeNote },
        { role: "user", content: `Check this claim: "${claim}"` },
      ],
    },
    "scan.claim",
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
    const result = JSON.parse(content) as unknown;
    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        verdict: "misleading",
        emoji: "⚠️",
        headline: "Could not fully analyze this claim",
        explanation: content,
        shareText: "Always verify health claims with a trusted health worker.",
        source: "Sastipe Health Advisor",
      },
    });
  }
}

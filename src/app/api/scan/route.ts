/**
 * POST /api/scan — Misinformation Scanner
 *
 * Takes a health claim and returns a verdict with explanation.
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody, validationErrorResponse } from "@/lib/api/validation";
import { parseAiJson } from "@/lib/ai/json";
import { applyRateLimitAsync, getClientIp } from "@/lib/api/rate-limit";
import { aiBudgetExceededResponse, checkAiBudget, sanitizeAiInput } from "@/lib/api/ai-budget";
import { traceAsync } from "@/lib/langfuse";
import {
  completeText,
  getActiveProvider,
  ProviderHttpError,
  ProviderUnavailableError,
} from "@/lib/ai/provider";

const scanRequestSchema = z.object({
  claim: z.string().trim().min(3).max(1200),
  locale: z.string().trim().max(12).optional(),
});

const scanResponseSchema = z.object({
  verdict: z.enum(["verified", "misleading", "false"]),
  emoji: z.string().max(8),
  headline: z.string().min(1).max(180),
  explanation: z.string().min(1).max(1400),
  shareText: z.string().min(1).max(320),
  source: z.string().min(1).max(240),
});

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
  const rate = await applyRateLimitAsync(req, {
    namespace: "scan",
    limit: 20,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, scanRequestSchema);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  if (!getActiveProvider()) {
    return NextResponse.json(
      { success: false, error: "AI service not configured" },
      { status: 503 },
    );
  }
  const { claim, locale } = parsed.data;

  const budget = await checkAiBudget(req);
  if (!budget.allowed) return aiBudgetExceededResponse(budget);

  const cleanClaim = sanitizeAiInput(claim);
  const localeNote = locale
    ? `\nThe user's language is "${locale}". Respond in that language.`
    : "";

  return traceAsync(
    {
      name: "ai.scan",
      tags: ["api", "scan", locale ?? "unknown"],
      metadata: { clientId: getClientIp(req), claimLength: cleanClaim.length },
    },
    async () => {
      let content: string;
      try {
        content = await completeText({
          system: SCAN_PROMPT + localeNote,
          messages: [{ role: "user", content: `Check this claim: "${cleanClaim}"` }],
          maxTokens: 600,
          temperature: 0.3,
        });
      } catch (err) {
        if (err instanceof ProviderUnavailableError) {
          return NextResponse.json(
            { success: false, error: "AI service not configured" },
            { status: 503 },
          );
        }
        if (err instanceof ProviderHttpError) {
          return NextResponse.json(
            { success: false, error: "AI service error" },
            { status: 502 },
          );
        }
        throw err;
      }

      const parsedAi = parseAiJson(content, scanResponseSchema);
      if (!parsedAi.success) {
        return NextResponse.json({
          success: true,
          data: {
            verdict: "misleading",
            emoji: "⚠️",
            headline: "Could not fully analyze this claim",
            explanation:
              "The AI service did not return a structured fact-check. Please verify the claim with a trusted health source.",
            shareText: "Always verify health claims with a trusted health worker.",
            source: "Sastipe Health Advisor",
          },
          fallback: true,
        });
      }

      return NextResponse.json(
        { success: true, data: parsedAi.data },
        {
          headers: {
            "X-Sastipe-Budget-Remaining": String(budget.remainingUserCalls),
            "X-Sastipe-Provider": getActiveProvider() ?? "none",
          },
        },
      );
    },
  );
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody, validationError } from "@/lib/api/validation";
import { parseAiJson } from "@/lib/ai/json";
import { buildEmergencyConsultSummary, detectEmergencyRedFlag } from "@/lib/health/red-flags";

const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const consultRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(12),
  locale: z.string().trim().min(2).max(16).optional(),
});

const consultGatheringSchema = z.object({
  stage: z.literal("gathering"),
  message: z.string().min(1).max(1600),
  questionsAsked: z.number().int().min(0).max(5).default(1),
});

const consultSummarySchema = z.object({
  stage: z.literal("summary"),
  severity: z.enum(["green", "amber", "red"]),
  title: z.string().min(1).max(120),
  assessment: z.string().min(1).max(1200),
  whatToDo: z.string().min(1).max(1200),
  watchFor: z.string().min(1).max(1000),
  homeRemedies: z.string().max(1000).optional(),
  doctorVisitSummary: z.string().min(1).max(1200),
});

const consultResponseSchema = z.union([consultGatheringSchema, consultSummarySchema]);

const CONSULT_PROMPT = `You are a Roma health mediator conducting a guided health consultation. You have 15 years of field experience in Roma communities across Europe. You are NOT a doctor. You NEVER diagnose. You help people understand their symptoms and decide what to do next.

You are having a multi-turn conversation. Based on the conversation so far, do ONE of the following:

## If this is the START of the consultation (user just described their main concern):
Ask 2-3 specific follow-up questions to understand better. Ask them one at a time in a natural conversational way. Keep questions simple and direct.

Return JSON:
{
  "stage": "gathering",
  "message": "Your follow-up question(s) in natural conversational tone",
  "questionsAsked": 1
}

## If you have enough information (after 2-3 exchanges):
Provide your assessment. NEVER diagnose. Use traffic light severity.

Return JSON:
{
  "stage": "summary",
  "severity": "green" | "amber" | "red",
  "title": "Brief title of the situation (5-8 words)",
  "assessment": "2-3 sentences explaining what you think is happening, from your field experience. Never say 'you have X disease'. Say 'based on what you describe, this sounds like it could be related to...'",
  "whatToDo": "Specific action steps. For GREEN: home care instructions. For AMBER: see a doctor within 1-3 days + what to tell them. For RED: go to hospital NOW.",
  "watchFor": "Signs that would make this more serious — when to escalate",
  "homeRemedies": "Safe home care tips (if applicable). Only evidence-based remedies.",
  "doctorVisitSummary": "A 3-4 sentence summary of the patient's concern that they can show to a doctor. Written in medical-friendly language but still simple. Include: main symptom, duration, severity, relevant details."
}

Rules:
- GREEN = manage at home safely
- AMBER = see a doctor within 1-3 days, not an emergency but needs professional attention
- RED = go to hospital or call 112 NOW. Put this instruction FIRST.
- Be warm, direct, never condescending
- Use field experience: "I have seen this many times in our communities..."
- If someone mentions chest pain, difficulty breathing, heavy bleeding, or suicidal thoughts → immediately return RED severity
- ALWAYS return valid JSON, nothing else
- Respond in the same language the user writes in`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  const parsed = await parseJsonBody(req, consultRequestSchema);
  if (!parsed.success) return validationError(parsed.error);

  const { messages, locale } = parsed.data;
  const redFlag = detectEmergencyRedFlag(messages.map((m) => m.content).join("\n"));
  if (redFlag) {
    return NextResponse.json({
      success: true,
      data: buildEmergencyConsultSummary(redFlag),
      safetyOverride: true,
    });
  }

  const localeNote = locale
    ? `\nThe user's preferred language is "${locale}". Respond in that language.`
    : "";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 1000,
      temperature: 0.4,
      messages: [
        { role: "system", content: CONSULT_PROMPT + localeNote },
        ...messages.slice(-8),
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AI service error" }, { status: 502 });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  const result = parseAiJson(content, consultResponseSchema);
  if (!result.success) {
    return NextResponse.json({
      success: true,
      data: {
        stage: "gathering",
        message: "I need one more detail to answer safely. What is the main symptom, how long has it been happening, and is there any trouble breathing, chest pain, heavy bleeding, fainting, or suicidal thoughts?",
        questionsAsked: 1,
      },
      fallback: true,
    });
  }

  return NextResponse.json({ success: true, data: result.data });
}

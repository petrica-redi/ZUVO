import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api/validation";
import { parseAiJson } from "@/lib/ai/json";
import { applyRateLimitAsync } from "@/lib/api/rate-limit";
import { aiBudgetExceededResponse, checkAiBudget, sanitizeAiInput } from "@/lib/api/ai-budget";
import { buildEmergencyConsultSummary, detectEmergencyRedFlag } from "@/lib/health/red-flags";

const VISIT_CARD_PROMPT = `You are a Roma health mediator helping someone prepare for a doctor visit. Generate a clear, professional patient summary card that the person can show to their doctor.

Given the patient's concern, symptoms, and language, return a JSON object:
{
  "patientSummary": "A 4-6 sentence summary of the patient's concern written in clear, medical-friendly language. Include: main complaint, duration, severity, relevant context. Written so a doctor can quickly understand the situation.",
  "keySymptoms": ["List of 3-5 key symptoms in medical-friendly terms"],
  "duration": "How long the problem has been going on",
  "severity": "mild | moderate | severe",
  "questionsToAsk": ["3-4 important questions the patient should ask the doctor"],
  "whatToBring": ["List of things to bring to the appointment"],
  "patientRights": ["2-3 key patient rights relevant to Roma communities (right to interpreter, right to refuse, right to second opinion)"]
}

Rules:
- Write the patientSummary in the NATIONAL LANGUAGE of the country (the language doctors speak), not necessarily the patient's language
- Write questionsToAsk and patientRights in the PATIENT'S language so they can understand
- Be professional but accessible
- ALWAYS return valid JSON`;

const visitCardRequestSchema = z.object({
  concern: z.string().trim().min(1).max(1600),
  symptoms: z.string().trim().max(1600).optional(),
  country: z.string().trim().max(80).optional(),
  locale: z.string().trim().min(2).max(16).optional(),
});

const visitCardResponseSchema = z.object({
  patientSummary: z.string().min(1).max(1600),
  keySymptoms: z.array(z.string().min(1).max(200)).max(8),
  duration: z.string().min(1).max(200),
  severity: z.enum(["mild", "moderate", "severe"]),
  questionsToAsk: z.array(z.string().min(1).max(300)).max(8),
  whatToBring: z.array(z.string().min(1).max(200)).max(8),
  patientRights: z.array(z.string().min(1).max(300)).max(8),
});

export async function POST(req: NextRequest) {
  const rate = await applyRateLimitAsync(req, {
    namespace: "visit-card",
    limit: 20,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rate.response;

  const parsed = await parseJsonBody(req, visitCardRequestSchema);
  if (!parsed.success) return parsed.response;
  const { concern, symptoms, country, locale } = parsed.data;

  const redFlag = detectEmergencyRedFlag([concern, symptoms].filter(Boolean).join("\n"));
  if (redFlag) {
    const summary = buildEmergencyConsultSummary(redFlag);
    return NextResponse.json({
      success: true,
      data: {
        patientSummary: `Emergency concern: ${summary.doctorVisitSummary}`,
        keySymptoms: [summary.title],
        duration: "Unknown",
        severity: "severe",
        questionsToAsk: ["What emergency care do I need right now?"],
        whatToBring: ["ID card", "Medication list, if available"],
        patientRights: ["You have the right to emergency care", "You have the right to understand what is happening"],
      },
      safetyOverride: true,
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: "AI service not configured" }, { status: 503 });
  }

  const budget = await checkAiBudget(req);
  if (!budget.allowed) return aiBudgetExceededResponse(budget);

  const context = [
    `Patient concern: ${sanitizeAiInput(concern)}`,
    symptoms && `Additional symptoms: ${sanitizeAiInput(symptoms)}`,
    country && `Country: ${sanitizeAiInput(country)}`,
    locale && `Patient's language: ${locale}`,
  ].filter(Boolean).join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 800,
      temperature: 0.3,
      messages: [
        { role: "system", content: VISIT_CARD_PROMPT },
        { role: "user", content: context },
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AI service error" }, { status: 502 });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";

  const ai = parseAiJson(content, visitCardResponseSchema);
  if (ai.success) return NextResponse.json({ success: true, data: ai.data });

  return NextResponse.json({
    success: true,
    data: {
      patientSummary: content || "Please describe your concern again in a few simple sentences.",
      keySymptoms: [],
      duration: "Unknown",
      severity: "moderate",
      questionsToAsk: ["Can you explain my diagnosis in simple words?"],
      whatToBring: ["ID card", "Health insurance card", "List of current medications"],
      patientRights: ["You have the right to an interpreter", "You have the right to understand your treatment"],
    },
    fallback: true,
  });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api/validation";
import { parseAiJson } from "@/lib/ai/json";
import { detectRedFlag, redFlagSymptomResult } from "@/lib/health/red-flags";
import { checkRateLimit, getClientIp, rateLimitExceeded } from "@/lib/api/rate-limit";

const SYMPTOM_PROMPT = `You are a Roma health mediator with 15 years of field experience conducting a symptom triage. You are NOT a doctor. You NEVER diagnose. You help people understand how serious their symptoms might be and what to do next.

Given a body area and symptoms, return a JSON object with this EXACT structure:
{
  "severity": "green" | "amber" | "red",
  "title": "Brief description (5-8 words)",
  "assessment": "2-3 sentences about what this could be related to. NEVER say 'you have X'. Say 'this sounds like it could be related to...' Use field experience.",
  "immediateAction": "What to do RIGHT NOW. For RED: 'Call 112 immediately.' For AMBER: 'See a doctor within 1-3 days.' For GREEN: specific home care steps.",
  "homeCare": ["List of 3-4 specific home care tips if applicable"],
  "warningSignsToEscalate": ["3-4 signs that mean they should go to hospital immediately"],
  "commonCauses": ["2-3 most common causes in simple language"],
  "preventionTips": ["2-3 tips to prevent this in the future"]
}

Severity rules:
- GREEN: Can be safely managed at home. Common, not dangerous.
- AMBER: Needs professional attention within 1-3 days. Not immediately dangerous but should not be ignored.
- RED: EMERGENCY. Go to hospital or call 112 NOW. Life-threatening or potentially life-threatening.

ALWAYS RED for: chest pain + shortness of breath, heavy bleeding, loss of consciousness, severe allergic reaction, signs of stroke, suicidal thoughts, child not breathing.

Rules:
- ALWAYS return valid JSON, nothing else
- Be warm and direct, never condescending
- Use field experience: "I have seen this many times..."
- Give SPECIFIC home care instructions, not vague advice
- Respond in the user's language`;

export async function POST(req: NextRequest) {
  const rate = checkRateLimit({
    key: `symptom:${getClientIp(req)}`,
    limit: 15,
    windowMs: 60_000,
  });
  if (!rate.allowed) return rateLimitExceeded(rate);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
  }

  const parsed = await parseJsonBody(req, symptomRequestSchema);
  if (!parsed.success) return parsed.response;
  const { bodyArea, symptoms, age, gender, locale } = parsed.data;

  const redFlag = detectRedFlag([bodyArea, symptoms, age, gender].filter(Boolean).join(" "));
  if (redFlag) {
    return NextResponse.json({ success: true, data: redFlagSymptomResult(redFlag) });
  }

  const localeNote = locale ? `\nRespond in the user's language: "${locale}".` : "";
  const demographics = [age && `Age: ${age}`, gender && `Gender: ${gender}`].filter(Boolean).join(", ");

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
        { role: "system", content: SYMPTOM_PROMPT + localeNote },
        {
          role: "user",
          content: `Body area: ${bodyArea}\nSymptoms: ${symptoms}${demographics ? `\n${demographics}` : ""}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "AI service error" }, { status: 502 });
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? "";
  const result = parseAiJson(content, symptomResultSchema);
  if (result.success) {
    return NextResponse.json({ success: true, data: result.data });
  }

  return NextResponse.json({
    success: true,
    data: {
      severity: "amber",
      title: "Could not fully assess",
      assessment: content || "Please describe your symptoms in more detail.",
      immediateAction: "If you feel very unwell, call 112.",
      homeCare: [],
      warningSignsToEscalate: ["Difficulty breathing", "Severe pain", "Loss of consciousness"],
      commonCauses: [],
      preventionTips: [],
    },
  });
}

const symptomRequestSchema = z.object({
  bodyArea: z.string().trim().min(1).max(80),
  symptoms: z.string().trim().min(1).max(1500),
  age: z.string().trim().max(40).optional(),
  gender: z.string().trim().max(40).optional(),
  locale: z.string().trim().max(12).optional(),
});

const symptomResultSchema = z.object({
  severity: z.enum(["green", "amber", "red"]),
  title: z.string().min(1).max(120),
  assessment: z.string().min(1).max(1200),
  immediateAction: z.string().min(1).max(1000),
  homeCare: z.array(z.string().max(300)).max(6).default([]),
  warningSignsToEscalate: z.array(z.string().max(300)).max(8).default([]),
  commonCauses: z.array(z.string().max(300)).max(6).default([]),
  preventionTips: z.array(z.string().max(300)).max(6).default([]),
});

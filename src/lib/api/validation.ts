import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const anonymousIdSchema = z
  .string()
  .trim()
  .min(12)
  .max(80)
  .regex(/^[A-Za-z0-9_-]+$/);

export const localeSchema = z
  .string()
  .trim()
  .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/)
  .optional();

export function getAnonymousId(req: NextRequest): string | null {
  const parsed = anonymousIdSchema.safeParse(req.headers.get("x-anonymous-id"));
  return parsed.success ? parsed.data : null;
}

export function invalidAnonymousIdResponse() {
  return NextResponse.json(
    { success: false, error: "Missing or invalid anonymous session id" },
    { status: 400 }
  );
}

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    "unknown"
  );
}

export async function parseJsonBody<T>(
  req: NextRequest,
  schema: z.ZodType<T>
): Promise<
  | { success: true; ok: true; data: T }
  | {
      success: false;
      ok: false;
      error: z.ZodError | Error;
      response: NextResponse<{ success: false; error: string; issues?: unknown }>;
    }
> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    const error = new Error("Invalid JSON body");
    return {
      success: false,
      ok: false,
      error,
      response: NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 }
      ),
    };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return {
      success: false,
      ok: false,
      error: parsed.error,
      response: NextResponse.json(
        {
          success: false,
          error: "Invalid request body",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      ),
    };
  }

  return { success: true, ok: true, data: parsed.data };
}

export function validationErrorResponse(error: z.ZodError | Error) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request body",
        issues: error.flatten(),
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { success: false, error: error.message || "Invalid request body" },
    { status: 400 }
  );
}

export const validationError = validationErrorResponse;

export function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found");
    return JSON.parse(match[0]);
  }
}

export function parseAiJson<T>(raw: string, schema: z.ZodType<T>): T | null {
  try {
    const parsed = schema.safeParse(extractJsonObject(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

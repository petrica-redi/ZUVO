import { z } from "zod";

export function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Empty AI response");

  try {
    return JSON.parse(trimmed);
  } catch {
    const jsonMatch = trimmed.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON object found in AI response");
    return JSON.parse(jsonMatch[0]);
  }
}

export function parseAiJson<T>(
  raw: string,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; error: z.ZodError | Error } {
  try {
    const parsed = schema.safeParse(extractJsonObject(raw));
    if (parsed.success) return { success: true, data: parsed.data };
    return { success: false, error: parsed.error };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error : new Error("Invalid AI JSON") };
  }
}

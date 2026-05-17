import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const configSchema = z.object({
  logoUrl: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroImage: z.string().optional(),
  heroLayout: z.enum(["split", "center"]).optional(),
  customCss: z.string().optional(),
});

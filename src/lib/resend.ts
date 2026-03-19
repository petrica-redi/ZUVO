import { Resend } from "resend";
import { getResendConfig } from "./env";

let singleton: Resend | null | undefined;

export function getResend(): Resend | null {
  if (singleton !== undefined) return singleton;

  const cfg = getResendConfig();
  if (!cfg) {
    singleton = null;
    return singleton;
  }

  singleton = new Resend(cfg.apiKey);
  return singleton;
}

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  /**
   * Optional analytics tags (Resend uses `{ name, value }`).
   */
  tags?: Array<{ name: string; value: string }>;
};

/**
 * Send a transactional email. Returns `null` when Resend is not configured.
 */
export async function sendEmail(input: SendEmailInput): Promise<{ id: string } | null> {
  const resend = getResend();
  if (!resend) return null;

  const cfg = getResendConfig();
  if (!cfg) return null;

  const res = await resend.emails.send({
    from: cfg.fromEmail,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    tags: input.tags,
  });

  if (res.error || !res.data) return null;
  return { id: res.data.id };
}


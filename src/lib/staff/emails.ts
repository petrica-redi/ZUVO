import { sendEmail } from "@/lib/resend";
import { getAppConfig } from "@/lib/env";

function appBaseUrl(): string {
  return getAppConfig().appUrl?.replace(/\/$/, "") || "https://redi.healthcare";
}

export async function sendVerificationEmail(input: {
  to: string;
  displayName: string;
  token: string;
  locale?: string;
}): Promise<{ id: string } | null> {
  const locale = input.locale || "ro";
  const verifyUrl = `${appBaseUrl()}/${locale}/auth/verify?token=${encodeURIComponent(input.token)}`;
  const name = input.displayName || input.to;

  return sendEmail({
    to: input.to,
    subject: "Confirmă adresa de email — Redi Health",
    text: `Salut ${name},\n\nConfirmă emailul pentru contul Redi Health:\n${verifyUrl}\n\nLinkul expiră în 48 de ore.\n\n— Redi Health`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#0A1220">
        <h1 style="font-size:22px;margin:0 0 12px">Confirmă emailul</h1>
        <p style="line-height:1.55">Salut ${escapeHtml(name)},</p>
        <p style="line-height:1.55">Apasă butonul de mai jos pentru a verifica adresa și a trimite contul spre aprobare.</p>
        <p style="margin:28px 0">
          <a href="${verifyUrl}" style="display:inline-block;background:#0A1220;color:#fff;text-decoration:none;padding:14px 22px;border-radius:999px;font-weight:700">
            Verifică emailul
          </a>
        </p>
        <p style="font-size:13px;color:#64748b;line-height:1.5">Linkul expiră în 48 de ore. Dacă nu ai cerut acest cont, ignoră mesajul.</p>
      </div>
    `,
    tags: [{ name: "purpose", value: "staff_email_verify" }],
  });
}

export async function sendAdminNewRegistrationEmail(input: {
  applicantEmail: string;
  displayName: string;
  provider: string;
}): Promise<{ id: string } | null> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || "petrica@redi-ngo.eu";
  const reviewUrl = `${appBaseUrl()}/ro/admin/dashboard/accounts`;

  return sendEmail({
    to: adminEmail,
    subject: `Cont nou de aprobat: ${input.displayName}`,
    text: `Un nou cont așteaptă aprobare.\n\nNume: ${input.displayName}\nEmail: ${input.applicantEmail}\nProvider: ${input.provider}\n\nAprobă aici: ${reviewUrl}\n`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#0A1220">
        <h1 style="font-size:20px">Cont nou de aprobat</h1>
        <p><strong>${escapeHtml(input.displayName)}</strong> (${escapeHtml(input.applicantEmail)})</p>
        <p>Provider: ${escapeHtml(input.provider)}</p>
        <p><a href="${reviewUrl}">Deschide panoul de conturi</a></p>
      </div>
    `,
    tags: [{ name: "purpose", value: "staff_admin_notify" }],
  });
}

export async function sendAccountApprovedEmail(input: {
  to: string;
  displayName: string;
  role: string;
}): Promise<{ id: string } | null> {
  const loginUrl = `${appBaseUrl()}/ro/auth/login`;
  return sendEmail({
    to: input.to,
    subject: "Contul tău Redi Health a fost aprobat",
    text: `Salut ${input.displayName},\n\nContul tău a fost aprobat cu rolul: ${input.role}.\nAutentifică-te: ${loginUrl}\n`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:24px;color:#0A1220">
        <h1 style="font-size:22px">Cont aprobat</h1>
        <p>Salut ${escapeHtml(input.displayName)},</p>
        <p>Contul tău a fost aprobat cu rolul <strong>${escapeHtml(input.role)}</strong>.</p>
        <p><a href="${loginUrl}" style="display:inline-block;background:#0E8074;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700">Intră în platformă</a></p>
      </div>
    `,
    tags: [{ name: "purpose", value: "staff_approved" }],
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

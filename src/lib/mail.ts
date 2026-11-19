import type { ReactElement } from "react";
import { Resend } from "resend";

const DEFAULT_FROM_ADDRESS = "noreply@xteonlyone.my.id";

type EmailContent =
  | { react: ReactElement; html?: never }
  | { html: string; react?: never };

type SendEmailOptions = EmailContent & {
  fromName?: string;
  to: string;
  subject: string;
  replyTo?: string;
};

function resolveFromHeader(fromName: string): string {
  const configured = process.env.RESEND_FROM_EMAIL?.trim();
  if (!configured) {
    return `${fromName} <${DEFAULT_FROM_ADDRESS}>`;
  }
  if (configured.includes("<") && configured.includes(">")) {
    return configured;
  }
  return `${fromName} <${configured}>`;
}

/**
 * Send a transactional email via Resend with centralized sender and reply-to handling.
 */
export async function sendEmail({
  fromName = "A-1412",
  to,
  subject,
  replyTo,
  ...content
}: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false as const, error: "RESEND_API_KEY is not configured" };
  }

  const resend = new Resend(apiKey);
  const resolvedReplyTo = replyTo ?? process.env.ADMIN_EMAIL?.trim();

  const { error } = await resend.emails.send({
    from: resolveFromHeader(fromName),
    to,
    subject,
    ...(resolvedReplyTo ? { replyTo: resolvedReplyTo } : {}),
    ...content,
  });

  if (error) {
    console.error("Resend email error:", error);
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
}

type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/**
 * Optional Resend transport. Returns false when RESEND_API_KEY is missing
 * so callers can fall back to Supabase Auth email.
 */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false;

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Putthink Data Room <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[email] Resend failed", res.status, body);
    return false;
  }
  return true;
}

export function magicLinkEmail(opts: {
  organization: string;
  magicLink: string;
}): { subject: string; html: string; text: string } {
  const subject = "Putthink Data Room access";
  const text = [
    `Your Putthink Data Room access request for ${opts.organization} was approved.`,
    "",
    "Open this one-time magic link to sign in (expires soon):",
    opts.magicLink,
    "",
    "If you did not request access, ignore this email.",
    "— NASAEM / Putthink",
  ].join("\n");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:520px;line-height:1.6;color:#111">
      <p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#888;margin:0 0 12px">Putthink Data Room</p>
      <h1 style="font-size:22px;margin:0 0 16px">Access approved</h1>
      <p style="margin:0 0 16px">Your request for <strong>${escapeHtml(opts.organization)}</strong> was approved. Use the button below to sign in. The link is one-time and expires shortly.</p>
      <p style="margin:24px 0">
        <a href="${escapeAttr(opts.magicLink)}" style="display:inline-block;background:#0a0a0a;color:#f3f1eb;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600">Open Data Room</a>
      </p>
      <p style="font-size:13px;color:#666;margin:24px 0 0">If the button does not work, paste this URL into your browser:<br/>
        <span style="word-break:break-all">${escapeHtml(opts.magicLink)}</span>
      </p>
      <p style="font-size:12px;color:#999;margin:28px 0 0">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  return { subject, html, text };
}

export function adminNotifyEmail(opts: {
  email: string;
  organization: string;
  role: string | null;
  message: string | null;
  adminUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `[Data Room] New request — ${opts.organization}`;
  const text = [
    "New Putthink Data Room access request:",
    `Email: ${opts.email}`,
    `Organization: ${opts.organization}`,
    `Role: ${opts.role ?? "(none)"}`,
    `Message: ${opts.message ?? "(none)"}`,
    "",
    `Review: ${opts.adminUrl}`,
  ].join("\n");

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:520px;line-height:1.6;color:#111">
      <p style="font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#888">Data Room</p>
      <h1 style="font-size:20px;margin:0 0 12px">New access request</h1>
      <ul style="padding-left:18px;margin:0 0 16px">
        <li><strong>Email:</strong> ${escapeHtml(opts.email)}</li>
        <li><strong>Organization:</strong> ${escapeHtml(opts.organization)}</li>
        <li><strong>Role:</strong> ${escapeHtml(opts.role ?? "—")}</li>
        <li><strong>Message:</strong> ${escapeHtml(opts.message ?? "—")}</li>
      </ul>
      <p><a href="${escapeAttr(opts.adminUrl)}">Open review console</a></p>
    </div>
  `;

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/'/g, "&#39;");
}

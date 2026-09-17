import type { SupabaseClient } from "@supabase/supabase-js";
import { dataRoomPath, siteOrigin } from "@/lib/data-room";
import { magicLinkEmail, sendEmail } from "@/lib/email";

/**
 * Send a one-time magic link only after human approval.
 *
 * Prefer branded Resend mail with an admin-generated link.
 * If Resend is not configured, fall back to Supabase Auth OTP email.
 */
export async function sendDataRoomMagicLink(opts: {
  sb: SupabaseClient;
  email: string;
  organization: string;
  req?: Request;
}): Promise<{ ok: true; via: "resend" | "supabase" } | { ok: false; error: string }> {
  const origin = siteOrigin(opts.req);
  const next = dataRoomPath();
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;

  // 1) Try generateLink + Resend (full control over copy / from-address)
  const { data: linkData, error: linkError } =
    await opts.sb.auth.admin.generateLink({
      type: "magiclink",
      email: opts.email,
      options: { redirectTo },
    });

  const actionLink = linkData?.properties?.action_link;
  if (!linkError && actionLink) {
    const mail = magicLinkEmail({
      organization: opts.organization,
      magicLink: actionLink,
    });
    const sent = await sendEmail({
      to: opts.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (sent) return { ok: true, via: "resend" };
  }

  // 2) Fallback: Supabase sends its Auth email template
  const { error: otpError } = await opts.sb.auth.signInWithOtp({
    email: opts.email,
    options: {
      emailRedirectTo: redirectTo,
      shouldCreateUser: true,
    },
  });

  if (otpError) {
    return {
      ok: false,
      error:
        otpError.message ||
        linkError?.message ||
        "Failed to send magic link",
    };
  }

  return { ok: true, via: "supabase" };
}

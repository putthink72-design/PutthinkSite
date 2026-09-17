import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { dataRoomPath, siteOrigin } from "@/lib/data-room";
import { magicLinkEmail, sendEmail } from "@/lib/email";

export type MagicLinkSendResult =
  | {
      ok: true;
      via: "resend" | "supabase" | "manual";
      actionLink: string | null;
      emailWarning?: string;
    }
  | { ok: false; error: string; actionLink?: string | null };

/**
 * Send a one-time magic link only after human approval.
 *
 * 1) Always generate an action link (admin can copy if mail fails).
 * 2) Resend if configured.
 * 3) Else Supabase Auth email via anon client OTP (service role OTP is unreliable).
 */
export async function sendDataRoomMagicLink(opts: {
  sb: SupabaseClient;
  email: string;
  organization: string;
  req?: Request;
}): Promise<MagicLinkSendResult> {
  const origin = siteOrigin(opts.req);
  const next = dataRoomPath();
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
  const hasResend = Boolean(process.env.RESEND_API_KEY?.trim());

  const { data: linkData, error: linkError } =
    await opts.sb.auth.admin.generateLink({
      type: "magiclink",
      email: opts.email,
      options: { redirectTo },
    });

  const actionLink = linkData?.properties?.action_link ?? null;

  if (hasResend && actionLink) {
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
    if (sent) {
      return { ok: true, via: "resend", actionLink };
    }
  }

  // Built-in Supabase mail: use anon client (not service role).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anon) {
    const publicSb = createClient(url, anon, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error: otpError } = await publicSb.auth.signInWithOtp({
      email: opts.email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });

    if (!otpError) {
      return { ok: true, via: "supabase", actionLink };
    }

    // Mail failed, but admin can still copy the generated link.
    if (actionLink) {
      return {
        ok: true,
        via: "manual",
        actionLink,
        emailWarning: otpError.message,
      };
    }

    return {
      ok: false,
      error: otpError.message || linkError?.message || "Failed to send magic link",
      actionLink,
    };
  }

  if (actionLink) {
    return {
      ok: true,
      via: "manual",
      actionLink,
      emailWarning:
        "Email transport not configured. Copy the magic link and send it manually.",
    };
  }

  return {
    ok: false,
    error: linkError?.message || "Failed to generate magic link",
    actionLink,
  };
}

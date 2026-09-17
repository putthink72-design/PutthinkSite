import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
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
 * Build a first-party confirm URL so App Router can verifyOtp and set cookies.
 * Do not hand users the raw supabase.co/verify link — it often fails to create
 * a session on www.putthink.com.
 */
function buildConfirmLink(opts: {
  origin: string;
  hashedToken: string;
  next: string;
}): string {
  const u = new URL("/auth/confirm", opts.origin);
  u.searchParams.set("token_hash", opts.hashedToken);
  u.searchParams.set("type", "magiclink");
  u.searchParams.set("next", opts.next);
  return u.toString();
}

/**
 * After human approval:
 * 1) generateLink → site /auth/confirm link (admin can copy).
 * 2) If RESEND_API_KEY is set, email that link.
 * 3) Optional Supabase OTP mail when DATA_ROOM_USE_SUPABASE_EMAIL=1.
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
  const useSupabaseEmail =
    process.env.DATA_ROOM_USE_SUPABASE_EMAIL === "1";

  const { data: linkData, error: linkError } =
    await opts.sb.auth.admin.generateLink({
      type: "magiclink",
      email: opts.email,
      options: { redirectTo },
    });

  const hashedToken = linkData?.properties?.hashed_token ?? null;
  const actionLink = hashedToken
    ? buildConfirmLink({ origin, hashedToken, next })
    : null;

  if (!actionLink) {
    return {
      ok: false,
      error: linkError?.message || "Failed to generate magic link",
      actionLink: null,
    };
  }

  if (hasResend) {
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

  if (useSupabaseEmail) {
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
      return {
        ok: true,
        via: "manual",
        actionLink,
        emailWarning: otpError.message,
      };
    }
  }

  return {
    ok: true,
    via: "manual",
    actionLink,
    emailWarning: hasResend
      ? "Resend send failed. Copy the link below and email it yourself."
      : "Automatic email is off until RESEND_API_KEY is set. Copy the link and send it to the requester.",
  };
}

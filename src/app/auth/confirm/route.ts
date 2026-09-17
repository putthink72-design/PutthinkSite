import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

/**
 * Email magic-link landing for App Router.
 * Supabase admin.generateLink hashed_token must be verified here so cookies
 * are set on putthink.com (the supabase.co/verify redirect often leaves no session).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const token_hash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "magiclink") as EmailOtpType;
  const nextRaw = searchParams.get("next") ?? "/en/data-room";
  const next = nextRaw.startsWith("/") ? nextRaw : `/${nextRaw}`;

  const fail = (reason: string) => {
    const url = new URL("/en/data-room/request", origin);
    url.searchParams.set("need", "login");
    url.searchParams.set("auth_error", reason);
    return NextResponse.redirect(url);
  };

  if (!token_hash) {
    return fail("missing_token");
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return fail("not_configured");
  }

  const response = NextResponse.redirect(new URL(next, origin));
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    return fail(error.message);
  }

  return response;
}

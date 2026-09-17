import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

function safeNext(raw: string | null): string {
  const next = raw ?? "/";
  return next.startsWith("/") ? next : `/${next}`;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "magiclink") as EmailOtpType;
  const next = safeNext(searchParams.get("next"));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const failToRequest = () => {
    const dest = new URL("/ko/data-room/request", origin);
    dest.searchParams.set("need", "login");
    return NextResponse.redirect(dest);
  };

  if (!url || !key) {
    return NextResponse.redirect(new URL(next, origin));
  }

  if (token_hash) {
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
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) return response;
    return failToRequest();
  }

  if (code) {
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
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return response;
    return failToRequest();
  }

  // No code/token — often means hash-based redirect that the server never sees.
  return failToRequest();
}

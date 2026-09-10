import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  LOCALE_COOKIE,
  isLanguageOption,
  isLocale,
  resolveLocale,
  type LanguageOption,
} from "@/i18n/config";

function preferenceFromCookie(req: NextRequest): LanguageOption | null {
  const raw = req.cookies.get(LOCALE_COOKIE)?.value;
  if (!raw || !isLanguageOption(raw)) return null;
  return raw;
}

async function withSupabaseSession(req: NextRequest, res: NextResponse) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });
  await supabase.auth.getUser();
  return res;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/i/") ||
    pathname.startsWith("/.well-known") ||
    pathname.includes(".")
  ) {
    const res = NextResponse.next();
    if (pathname.startsWith("/auth")) {
      return withSupabaseSession(req, res);
    }
    return res;
  }

  const segment = pathname.split("/")[1];
  const hasLocale = isLocale(segment ?? "");
  const preference = preferenceFromCookie(req);
  const detected = resolveLocale(
    preference,
    req.headers.get("accept-language"),
  );

  if (!hasLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${detected}${pathname === "/" ? "" : pathname}`;
    const res = NextResponse.redirect(url);
    if (!preference) {
      res.cookies.set(LOCALE_COOKIE, "system", {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return withSupabaseSession(req, res);
  }

  const res = NextResponse.next();
  res.headers.set("x-putthink-locale", segment!);
  return withSupabaseSession(req, res);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};

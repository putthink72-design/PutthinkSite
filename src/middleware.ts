import { NextRequest, NextResponse } from "next/server";
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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // favicon, public assets
  ) {
    return NextResponse.next();
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
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("x-putthink-locale", segment!);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};

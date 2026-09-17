import { NextResponse } from "next/server";
import { assertAdminSecret } from "@/lib/data-room";
import {
  adminSessionCookieOptions,
  clearAdminSessionCookie,
  createAdminSessionToken,
  getAdminSessionSigningKey,
  isValidAdminCredential,
} from "@/lib/data-room-admin-session";

/** Check whether the browser already has a valid admin session cookie. */
export async function GET(req: Request) {
  if (!assertAdminSecret(req)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

/**
 * Exchange admin secret OR password for a 30-day HttpOnly cookie.
 * Body: { secret?: string, password?: string } — either field may carry the value.
 */
export async function POST(req: Request) {
  const signingKey = getAdminSessionSigningKey();
  if (!signingKey) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: { secret?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const credential = String(body.secret ?? body.password ?? "").trim();
  if (!isValidAdminCredential(credential)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const token = createAdminSessionToken(signingKey);
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", adminSessionCookieOptions(token));
  return res;
}

/** Clear admin session cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearAdminSessionCookie());
  return res;
}

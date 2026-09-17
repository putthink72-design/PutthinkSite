import { createHmac, timingSafeEqual } from "crypto";

export const DR_ADMIN_COOKIE = "putthink_dr_admin";

/** How long the admin stays signed in after unlocking once. */
const SESSION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export function getAdminSecret(): string | null {
  return process.env.DATA_ROOM_ADMIN_SECRET?.trim() || null;
}

/** Memorable password alternative to the long secret. Either unlocks admin. */
export function getAdminPassword(): string | null {
  return process.env.DATA_ROOM_ADMIN_PASSWORD?.trim() || null;
}

/** Prefer secret as HMAC key; fall back to password if only password is set. */
export function getAdminSessionSigningKey(): string | null {
  return getAdminSecret() ?? getAdminPassword();
}

function safeEqualString(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  try {
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

/** True if value matches configured secret and/or password. */
export function isValidAdminCredential(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  const secret = getAdminSecret();
  const password = getAdminPassword();
  if (secret && safeEqualString(v, secret)) return true;
  if (password && safeEqualString(v, password)) return true;
  return false;
}

export function createAdminSessionToken(
  signingKey: string,
  now = Date.now(),
): string {
  const exp = now + SESSION_MS;
  const payload = String(exp);
  const sig = createHmac("sha256", signingKey)
    .update(`dr-admin:${payload}`)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(
  signingKey: string,
  token: string,
  now = Date.now(),
): boolean {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const exp = Number(payload);
  if (!Number.isFinite(exp) || now > exp) return false;
  const expected = createHmac("sha256", signingKey)
    .update(`dr-admin:${payload}`)
    .digest("hex");
  return safeEqualString(sig, expected);
}

export function readCookie(req: Request, name: string): string | null {
  const raw = req.headers.get("cookie") ?? "";
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    if (k !== name) continue;
    return decodeURIComponent(part.slice(idx + 1).trim());
  }
  return null;
}

export function adminSessionCookieOptions(token: string): string {
  const maxAge = Math.floor(SESSION_MS / 1000);
  const secure =
    process.env.NODE_ENV === "production" ||
    (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https");
  const parts = [
    `${DR_ADMIN_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function clearAdminSessionCookie(): string {
  const secure =
    process.env.NODE_ENV === "production" ||
    (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https");
  const parts = [
    `${DR_ADMIN_COOKIE}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

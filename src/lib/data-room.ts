import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createServiceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function siteOrigin(req?: Request): string {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (req) {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    if (host) return `${proto}://${host}`;
  }
  return "http://localhost:3000";
}

/** Default landing after magic-link login (locale-prefixed). */
export function dataRoomPath(): string {
  const path = (process.env.DATA_ROOM_LOGIN_PATH ?? "/ko/data-room").trim();
  return path.startsWith("/") ? path : `/${path}`;
}

export function dataRoomRequestPath(locale: string = "ko"): string {
  const loc = locale === "en" || locale === "ja" || locale === "ko" ? locale : "ko";
  return `/${loc}/data-room/request`;
}

export function dataRoomNotifyEmail(): string {
  return (
    process.env.DATA_ROOM_NOTIFY_EMAIL?.trim() ||
    process.env.PRIVACY_OFFICER_EMAIL?.trim() ||
    "goriccc@gmail.com"
  );
}

export function assertAdminSecret(req: Request): boolean {
  const expected = process.env.DATA_ROOM_ADMIN_SECRET?.trim();
  if (!expected) return false;
  const header = req.headers.get("authorization") ?? "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const alt = req.headers.get("x-data-room-admin-secret")?.trim() ?? "";
  return bearer === expected || alt === expected;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function isApprovedDataRoomEmail(
  sb: SupabaseClient,
  email: string,
): Promise<boolean> {
  const normalized = normalizeEmail(email);
  const { data, error } = await sb
    .from("data_room_requests")
    .select("id")
    .eq("status", "approved")
    .ilike("email", normalized)
    .limit(1)
    .maybeSingle();
  if (error) return false;
  return Boolean(data?.id);
}

export type DataRoomRequestRow = {
  id: string;
  email: string;
  organization: string;
  phone: string | null;
  role: string | null;
  message: string | null;
  status: "pending" | "approved" | "denied";
  approved_at: string | null;
  magic_link_sent_at: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
};

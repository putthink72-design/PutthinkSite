import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim();
    const organization = String(body.organization ?? "").trim();
    const role = String(body.role ?? "").trim() || null;
    const message = String(body.message ?? "").trim() || null;
    if (!email || !organization) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    const sb = admin();
    if (!sb) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }
    const { error } = await sb.from("data_room_requests").insert({
      email,
      organization,
      role,
      message,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

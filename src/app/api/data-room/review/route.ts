import { NextResponse } from "next/server";
import {
  assertAdminSecret,
  createServiceClient,
  type DataRoomRequestRow,
} from "@/lib/data-room";
import { sendDataRoomMagicLink } from "@/lib/data-room-magic-link";

export async function GET(req: Request) {
  if (!assertAdminSecret(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const sb = createServiceClient();
  if (!sb) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "pending";
  let q = sb
    .from("data_room_requests")
    .select(
      "id,email,organization,phone,role,message,status,approved_at,magic_link_sent_at,reviewed_at,review_note,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (status !== "all") {
    q = q.eq("status", status);
  }

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ requests: (data ?? []) as DataRoomRequestRow[] });
}

export async function POST(req: Request) {
  if (!assertAdminSecret(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const sb = createServiceClient();
  if (!sb) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let body: {
    id?: string;
    action?: string;
    note?: string;
    resend?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const id = String(body.id ?? "").trim();
  const action = String(body.action ?? "").trim();
  const note = String(body.note ?? "").trim() || null;
  const resend = Boolean(body.resend);

  if (!id || (action !== "approve" && action !== "deny" && action !== "resend")) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { data: row, error: fetchError } = await sb
    .from("data_room_requests")
    .select(
      "id,email,organization,phone,role,message,status,approved_at,magic_link_sent_at,reviewed_at,review_note,created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !row) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const now = new Date().toISOString();

  if (action === "deny") {
    const { error } = await sb
      .from("data_room_requests")
      .update({
        status: "denied",
        reviewed_at: now,
        review_note: note,
        approved_at: null,
      })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, status: "denied" });
  }

  // approve or resend magic link
  if (action === "approve" && row.status !== "approved") {
    const { error } = await sb
      .from("data_room_requests")
      .update({
        status: "approved",
        approved_at: now,
        reviewed_at: now,
        review_note: note,
      })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (action === "resend" && row.status !== "approved") {
    return NextResponse.json(
      { error: "not_approved", message: "Approve before resending the magic link." },
      { status: 400 },
    );
  } else if (action === "approve" && row.status === "approved" && !resend && row.magic_link_sent_at) {
    return NextResponse.json({
      ok: true,
      status: "approved",
      already: true,
      message: "Already approved. Pass resend:true to send another magic link.",
    });
  }

  const send = await sendDataRoomMagicLink({
    sb,
    email: row.email,
    organization: row.organization,
    req,
  });

  if (!send.ok) {
    return NextResponse.json(
      {
        error: "magic_link_failed",
        message: send.error,
        status: "approved",
        actionLink: send.actionLink ?? null,
      },
      { status: 502 },
    );
  }

  await sb
    .from("data_room_requests")
    .update({ magic_link_sent_at: now })
    .eq("id", id);

  return NextResponse.json({
    ok: true,
    status: "approved",
    via: send.via,
    actionLink: send.actionLink,
    emailWarning: send.emailWarning ?? null,
  });
}

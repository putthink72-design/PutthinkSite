import { NextResponse } from "next/server";
import {
  createServiceClient,
  dataRoomNotifyEmail,
  siteOrigin,
} from "@/lib/data-room";
import { adminNotifyEmail, sendEmail } from "@/lib/email";

function admin() {
  return createServiceClient();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim();
    const organization = String(body.organization ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const role = String(body.role ?? "").trim() || null;
    const message = String(body.message ?? "").trim() || null;
    if (!email || !organization || !phone) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    if (phone.length < 7 || phone.length > 40) {
      return NextResponse.json({ error: "invalid_phone" }, { status: 400 });
    }
    const sb = admin();
    if (!sb) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    // Never create as approved — magic link is sent only after human review.
    const { data, error } = await sb
      .from("data_room_requests")
      .insert({
        email,
        organization,
        phone,
        role,
        message,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const origin = siteOrigin(req);
    const adminUrl = `${origin}/ko/data-room/admin`;
    const notify = adminNotifyEmail({
      email,
      organization,
      phone,
      role,
      message,
      adminUrl,
    });
    // Best-effort; request is already stored even if mail fails.
    void sendEmail({
      to: dataRoomNotifyEmail(),
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
      replyTo: email,
    }).catch(() => undefined);

    return NextResponse.json({ ok: true, id: data?.id ?? null });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

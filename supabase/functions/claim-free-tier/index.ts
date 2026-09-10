// Putthink Edge Function: claim-free-tier
// Device + account first claim. Invite code → referred_by (self-invite blocked).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const device_claim_token =
      body.device_claim_token ?? body.device_keychain_id;
    const invite_code =
      typeof body.invite_code === "string"
        ? body.invite_code.trim()
        : null;
    const local_balance = body.local_balance;

    if (!device_claim_token || typeof device_claim_token !== "string") {
      return new Response(
        JSON.stringify({ error: "device_claim_token required" }),
        {
          status: 400,
          headers: { ...cors, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const uid = userData.user.id;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .maybeSingle();

    if (profile?.free_tier_claimed) {
      return new Response(
        JSON.stringify({
          free_runs_balance: profile.free_runs_balance,
          free_tier_source: profile.free_tier_source,
          referred_by: profile.referred_by,
          already_claimed: true,
        }),
        { headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const { data: deviceHit } = await supabase
      .from("profiles")
      .select("id")
      .eq("device_claim_token", device_claim_token)
      .maybeSingle();
    if (deviceHit && deviceHit.id !== uid) {
      return new Response(JSON.stringify({ error: "device_already_claimed" }), {
        status: 409,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    let referredBy: string | null = null;
    if (invite_code && /^[0-9A-Za-z]{8}$/.test(invite_code)) {
      const { data: inviteRow } = await supabase
        .from("invite_codes")
        .select("user_id")
        .eq("code", invite_code)
        .maybeSingle();
      if (inviteRow?.user_id) {
        // Self-invite (same Apple account)
        if (inviteRow.user_id === uid) {
          referredBy = null;
        } else {
          // Self-invite via same device previously claimed by inviter
          const { data: inviterProfile } = await supabase
            .from("profiles")
            .select("device_claim_token")
            .eq("id", inviteRow.user_id)
            .maybeSingle();
          if (
            inviterProfile?.device_claim_token &&
            inviterProfile.device_claim_token === device_claim_token
          ) {
            referredBy = null;
          } else {
            referredBy = inviteRow.user_id;
          }
        }
      }
    }

    const invited = referredBy != null;
    let balance =
      typeof local_balance === "number" ? Math.max(0, Math.floor(local_balance)) : null;
    if (balance === null) {
      balance = invited ? 6 : 3;
    }
    // If local said invited (6) but server rejected invite → clamp organic max 3 unless local lower
    if (!invited && typeof local_balance === "number" && local_balance > 3) {
      balance = 3;
    }

    const { data: updated, error } = await supabase
      .from("profiles")
      .upsert({
        id: uid,
        free_runs_balance: balance,
        device_claim_token,
        free_tier_claimed: true,
        free_tier_source: invited ? "invited" : "organic",
        referred_by: referredBy,
      })
      .select("free_runs_balance, free_tier_source, referred_by")
      .single();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        free_runs_balance: updated.free_runs_balance,
        free_tier_source: updated.free_tier_source,
        referred_by: updated.referred_by,
        already_claimed: false,
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});

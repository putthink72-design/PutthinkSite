// Putthink Edge Function: consume-free-run
// Deduct 1 when guidance readout succeeds. Skip if caller is subscribed (client sends flag;
// server should also verify StoreKit ASSN / entitlements table when available).
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    const body = await req.json().catch(() => ({}));
    const isSubscribed = Boolean(body.is_subscribed);

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

    if (isSubscribed) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("free_runs_balance")
        .eq("id", uid)
        .maybeSingle();
      return new Response(
        JSON.stringify({
          skipped: true,
          free_runs_balance: profile?.free_runs_balance ?? 0,
        }),
        { headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("free_runs_balance")
      .eq("id", uid)
      .maybeSingle();
    const current = profile?.free_runs_balance ?? 0;
    if (current <= 0) {
      return new Response(JSON.stringify({ error: "no_balance", free_runs_balance: 0 }), {
        status: 402,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const next = current - 1;
    const { error } = await supabase
      .from("profiles")
      .update({ free_runs_balance: next })
      .eq("id", uid);
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ skipped: false, free_runs_balance: next }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});

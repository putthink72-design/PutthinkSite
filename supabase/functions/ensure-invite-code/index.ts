// Putthink Edge Function: ensure-invite-code
// Auth required (Sign in with Apple → Supabase user). Returns lifelong 8-char code.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function randomCode(len = 8): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < len; i++) {
    out += ALPHABET[bytes[i]! % ALPHABET.length]!;
  }
  return out;
}

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

    // Ensure profile row exists
    await supabase.from("profiles").upsert({ id: uid }, { onConflict: "id" });

    const { data: existing } = await supabase
      .from("invite_codes")
      .select("code")
      .eq("user_id", uid)
      .maybeSingle();

    if (existing?.code) {
      return new Response(
        JSON.stringify({
          code: existing.code,
          url: `https://putthink.com/i/${existing.code}`,
        }),
        { headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    for (let attempt = 0; attempt < 12; attempt++) {
      const code = randomCode(8);
      const { data: inserted, error } = await supabase
        .from("invite_codes")
        .insert({ code, user_id: uid })
        .select("code")
        .maybeSingle();
      if (!error && inserted?.code) {
        return new Response(
          JSON.stringify({
            code: inserted.code,
            url: `https://putthink.com/i/${inserted.code}`,
          }),
          { headers: { ...cors, "Content-Type": "application/json" } },
        );
      }
      // unique violation → retry
    }

    return new Response(JSON.stringify({ error: "code_generation_failed" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});

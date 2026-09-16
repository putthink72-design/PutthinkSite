// Putthink Edge Function: delete-account
// Deletes Showcase rows/files + profile + auth user for the caller (Guideline 5.1.1(v)).
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

    const { data: showcases } = await supabase
      .from("putt_showcase")
      .select("id, video_url")
      .eq("user_id", uid);

    for (const row of showcases ?? []) {
      await supabase.from("showcase_likes").delete().eq("showcase_id", row.id);
      const url = typeof row.video_url === "string" ? row.video_url : "";
      const marker = "/putt-showcase/";
      const idx = url.indexOf(marker);
      if (idx >= 0) {
        const path = url.slice(idx + marker.length).split("?")[0];
        if (path) {
          await supabase.storage.from("putt-showcase").remove([path]);
        }
      }
    }
    await supabase.from("putt_showcase").delete().eq("user_id", uid);
    await supabase.from("invite_codes").delete().eq("user_id", uid);
    await supabase.from("profiles").delete().eq("id", uid);

    const { error: delErr } = await supabase.auth.admin.deleteUser(uid);
    if (delErr) {
      return new Response(JSON.stringify({ error: delErr.message }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});

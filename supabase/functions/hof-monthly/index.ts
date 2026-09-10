// Deno Edge Function — deploy with Supabase CLI, not Next.js build.
// Schedule monthly (KST 1st ~00:05): call with Authorization: Bearer $HOF_CRON_SECRET
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const auth = req.headers.get("Authorization");
  const cronSecret = Deno.env.get("HOF_CRON_SECRET");
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(url, key);

  const nowKst = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
  );
  const prev = new Date(nowKst.getFullYear(), nowKst.getMonth() - 1, 1);
  const y = prev.getFullYear();
  const m = String(prev.getMonth() + 1).padStart(2, "0");
  const period = `${y}-${m}-01`;

  const { data, error } = await supabase.rpc("induct_hof_month", {
    p_month: period,
  });

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, period, hof_id: data });
});

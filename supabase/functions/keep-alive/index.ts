import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (_req: Request) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Lightweight ping - just count one row to keep the project active
  const { error } = await supabase
    .from("analytics_events")
    .select("id", { count: "exact", head: true });

  if (error) {
    console.error("Keep-alive ping failed:", error.message);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }

  console.log("Keep-alive ping succeeded:", new Date().toISOString());
  return new Response(JSON.stringify({ ok: true, timestamp: new Date().toISOString() }), { status: 200 });
});

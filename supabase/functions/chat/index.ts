import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ─── Allowed origins ───────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = new Set([
  "https://jenjeng.com",
  "https://www.jenjeng.com",
  "https://jenjeng-portfolio.pages.dev",
  "http://localhost:5173",
  "http://localhost:4173",
]);

// ─── Rate limiting config ──────────────────────────────────────────────────────
const RATE_LIMIT_MAX = 20;          // max messages per window
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours in ms

// ─── Input size cap ────────────────────────────────────────────────────────────
const MAX_INPUT_CHARS = 4000;

// ─── CORS headers (tightened to jenjeng.com) ──────────────────────────────────
function getCorsHeaders(origin: string) {
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://jenjeng.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
    "Vary": "Origin",
  };
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  const corsHeaders = getCorsHeaders(origin);

  // ── Handle CORS preflight ────────────────────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // ── Layer 1: Origin check ─────────────────────────────────────────────────────
  if (!ALLOWED_ORIGINS.has(origin)) {
    console.warn(`Blocked request from disallowed origin: "${origin}"`);
    return new Response(
      JSON.stringify({ error: "Forbidden: origin not allowed" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // ── Layer 2: Input size cap ────────────────────────────────────────────────
    const body = await req.json();
    const { messages, systemPrompt } = body;

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Bad request: messages must be an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const totalInputChars = messages.reduce((sum: number, m: { content: string }) => {
      return sum + (typeof m.content === "string" ? m.content.length : 0);
    }, 0);

    if (totalInputChars > MAX_INPUT_CHARS) {
      console.warn(`Blocked oversized input: ${totalInputChars} chars from origin ${origin}`);
      return new Response(
        JSON.stringify({ error: "Bad request: message content too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Layer 3: Rate limiting (IP-based, 20 msgs / 24h) ──────────────────────
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const now = new Date();

    const { data: rateRow } = await supabase
      .from("rate_limits")
      .select("*")
      .eq("ip", ip)
      .maybeSingle();

    if (rateRow) {
      const windowStart = new Date(rateRow.window_start);
      const windowExpired = now.getTime() - windowStart.getTime() > RATE_LIMIT_WINDOW_MS;

      if (windowExpired) {
        // Reset the window
        await supabase
          .from("rate_limits")
          .update({ count: 1, window_start: now.toISOString() })
          .eq("ip", ip);
      } else if (rateRow.count >= RATE_LIMIT_MAX) {
        console.warn(`Rate limit hit for IP: ${ip} (${rateRow.count} requests in window)`);
        return new Response(
          JSON.stringify({
            error: "Too many requests. You've reached the limit of 20 messages per 24 hours. Please try again tomorrow.",
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        // Increment count
        await supabase
          .from("rate_limits")
          .update({ count: rateRow.count + 1 })
          .eq("ip", ip);
      }
    } else {
      // First request from this IP — create row
      await supabase
        .from("rate_limits")
        .insert({ ip, count: 1, window_start: now.toISOString() });
    }

    // ── Call Anthropic API ─────────────────────────────────────────────────────
    const anthropicApiKey = Deno.env.get("ANTHROPIC_API_KEY");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicApiKey!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "API error", details: JSON.stringify(data), status: response.status }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ content: data.content, model: data.model, stop_reason: data.stop_reason }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

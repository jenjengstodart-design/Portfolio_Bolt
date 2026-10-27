import { buildSystemPrompt } from '../../src/lib/systemPrompt';

// Chat proxy for the jenjeng.com AI assistant.
//
// This used to be a Supabase Edge Function. That Supabase project was on the
// free tier, auto-paused while idle, and was eventually deleted - its ref now
// returns NXDOMAIN, which took the chat widget offline silently. A Cloudflare
// Pages Function ships with the site itself, so there is no second project to
// keep alive and nothing that can be paused out from under the site.

interface RateLimitStore {
  get(key: string, type: 'json'): Promise<RateRecord | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface Env {
  ANTHROPIC_API_KEY?: string;
  // Optional KV namespace. Bind one named CHAT_RATE_LIMIT in the Cloudflare
  // Pages project to get rate limiting that holds across edge locations.
  CHAT_RATE_LIMIT?: RateLimitStore;
}

type RateRecord = { count: number; windowStart: number };

const ALLOWED_ORIGINS = new Set([
  'https://jenjeng.com',
  'https://www.jenjeng.com',
  'https://jenjeng-portfolio.pages.dev',
  'http://localhost:5173',
  'http://localhost:4173',
]);

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_INPUT_CHARS = 4000;
const MAX_MESSAGES = 40;

// Best-effort fallback when no KV namespace is bound. Scoped to one isolate, so
// it will not catch a distributed abuser - it only blunts a single hot client.
const localBuckets = new Map<string, RateRecord>();

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://jenjeng.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function json(body: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

async function checkRateLimit(env: Env, ip: string): Promise<boolean> {
  const now = Date.now();
  const key = `rl:${ip}`;
  const ttl = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);

  if (env.CHAT_RATE_LIMIT) {
    const record = await env.CHAT_RATE_LIMIT.get(key, 'json');
    if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
      await env.CHAT_RATE_LIMIT.put(key, JSON.stringify({ count: 1, windowStart: now }), {
        expirationTtl: ttl,
      });
      return true;
    }
    if (record.count >= RATE_LIMIT_MAX) return false;
    await env.CHAT_RATE_LIMIT.put(
      key,
      JSON.stringify({ count: record.count + 1, windowStart: record.windowStart }),
      { expirationTtl: ttl }
    );
    return true;
  }

  const local = localBuckets.get(key);
  if (!local || now - local.windowStart > RATE_LIMIT_WINDOW_MS) {
    localBuckets.set(key, { count: 1, windowStart: now });
    return true;
  }
  if (local.count >= RATE_LIMIT_MAX) return false;
  local.count += 1;
  return true;
}

export async function onRequestOptions(context: { request: Request }): Promise<Response> {
  const origin = context.request.headers.get('origin') ?? '';
  return new Response(null, { status: 200, headers: corsHeaders(origin) });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const origin = request.headers.get('origin') ?? '';

  // Same-origin page calls send an Origin header; anything else is rejected.
  if (!ALLOWED_ORIGINS.has(origin)) {
    return json({ error: 'Forbidden: origin not allowed' }, 403, origin);
  }

  let messages: Array<{ role: string; content: string }>;
  try {
    const body = (await request.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) {
      return json({ error: 'Bad request: messages must be an array' }, 400, origin);
    }
    messages = body.messages as Array<{ role: string; content: string }>;
  } catch {
    return json({ error: 'Bad request: invalid JSON' }, 400, origin);
  }

  if (messages.length > MAX_MESSAGES) {
    return json({ error: 'Bad request: too many messages' }, 400, origin);
  }

  const valid = messages.every(
    (m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string'
  );
  if (!valid) {
    return json({ error: 'Bad request: malformed message' }, 400, origin);
  }

  const totalChars = messages.reduce((sum, m) => sum + m.content.length, 0);
  if (totalChars > MAX_INPUT_CHARS) {
    return json({ error: 'Bad request: message content too long' }, 400, origin);
  }

  if (!env.ANTHROPIC_API_KEY) {
    // Surfaced plainly so a missing secret looks like a configuration problem
    // rather than a broken chatbot.
    return json(
      { error: 'The assistant is not configured yet. Please contact Jen directly.' },
      503,
      origin
    );
  }

  const ip = request.headers.get('cf-connecting-ip') ?? 'unknown';
  if (!(await checkRateLimit(env, ip))) {
    return json(
      {
        error:
          "Too many requests. You've reached the limit of 20 messages per 24 hours. Please try again tomorrow.",
      },
      429,
      origin
    );
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5-5',
        max_tokens: 1024,
        system: buildSystemPrompt(),
        messages,
      }),
    });

    const data = (await upstream.json()) as {
      content?: unknown;
      model?: string;
      stop_reason?: string;
      error?: { message?: string };
    };

    if (!upstream.ok) {
      // Log upstream detail, return something generic - the raw error can carry
      // account and key information.
      console.error('Anthropic API error', upstream.status, JSON.stringify(data));
      return json({ error: 'The assistant is temporarily unavailable.' }, 502, origin);
    }

    return json(
      { content: data.content, model: data.model, stop_reason: data.stop_reason },
      200,
      origin
    );
  } catch (error) {
    console.error('Chat proxy failure', error);
    return json({ error: 'The assistant is temporarily unavailable.' }, 502, origin);
  }
}

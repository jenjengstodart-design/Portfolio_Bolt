# AI Chat Setup

How the chat assistant on jenjeng.com works, and the one thing you need to set
for it to run.

---

## Architecture

```
Browser (ChatWidget.tsx)
   │  POST /api/chat   { messages: [...] }
   ▼
Cloudflare Pages Function  (functions/api/chat.ts)
   │  - checks the Origin header
   │  - validates and size-caps the input
   │  - rate limits per IP
   │  - builds the system prompt server-side
   │  - adds the Anthropic key
   ▼
api.anthropic.com/v1/messages   (claude-sonnet-5-5)
```

The function ships with the site, so there's no second service to keep alive.

**Why it moved.** This used to be a Supabase Edge Function. That project sat on
the free tier, auto-paused whenever it went idle, and was eventually deleted.
Its ref stopped resolving in DNS, so every message failed before it reached any
code, and nothing alerted anyone. A keep-alive cron was written to prevent the
pausing but was never committed, so it never ran. A Pages Function removes that
whole class of failure: same deploy as the site, nothing separate to expire.

---

## The one required setting

`ANTHROPIC_API_KEY` as an environment variable on the Cloudflare Pages project.

1. Get a key at https://console.anthropic.com → API Keys → Create Key
2. Cloudflare dashboard → Workers & Pages → `jenjeng-portfolio` → Settings →
   Environment variables
3. Add `ANTHROPIC_API_KEY` for **Production**. Add it to **Preview** too if you
   want preview deploys to answer.
4. Redeploy. Env var changes only apply to builds made after you save them.

Until that's set, the assistant replies "The assistant is not configured yet"
rather than failing silently. That's deliberate - a missing secret should look
like a config problem, not a broken chatbot.

**Never prefix this key with `VITE_` and never put it in `.env`.** Vite inlines
every `VITE_*` variable into the public JavaScript bundle, so that would publish
your key to anyone who views source.

---

## Recommended: rate limiting that actually holds

The function limits each IP to 20 messages per 24 hours. Without a KV namespace
it keeps that count in memory, which means the count is per edge isolate and
resets often - it blunts one noisy client but won't stop a determined one.

To make it real:

1. Cloudflare dashboard → Storage & Databases → KV → Create a namespace
   (call it `chat-rate-limit`)
2. Workers & Pages → `jenjeng-portfolio` → Settings → Bindings → KV namespace
3. Variable name must be exactly `CHAT_RATE_LIMIT`
4. Redeploy

The function picks it up automatically when it's bound.

This matters because the endpoint is public and spends your Anthropic credits.

---

## Running it locally

```bash
npm run build
npx wrangler pages dev dist --binding ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Then open the printed localhost URL. `localhost:5173` and `localhost:4173` are
both in the allowed-origins list, as are `jenjeng.com`, `www.jenjeng.com` and
`jenjeng-portfolio.pages.dev`.

`npm run dev` alone runs Vite without the function, so the chat won't answer.

---

## Responses the function can return

| Status | Meaning |
|---|---|
| 200 | Success. `{ content, model, stop_reason }` |
| 400 | Malformed input, too many messages, or over 4000 characters |
| 403 | Origin not in the allow-list |
| 429 | Rate limit reached (20 per IP per 24h) |
| 503 | `ANTHROPIC_API_KEY` isn't set |
| 502 | Anthropic returned an error, or the request failed |

Upstream errors are logged in full but returned generically, so account and key
detail never reaches the browser. Check the Pages Function logs in the
Cloudflare dashboard when you need the real reason.

---

## Troubleshooting

**"The assistant is not configured yet"** - `ANTHROPIC_API_KEY` isn't set on the
Pages project, or it was added after the current deploy was built. Add it and
redeploy.

**"The assistant is temporarily unavailable"** - Anthropic rejected the call.
Usually an invalid key or exhausted credits. The real error is in the Pages
Function logs.

**403 on every message** - the browser's Origin header isn't in
`ALLOWED_ORIGINS` in `functions/api/chat.ts`. Add the hostname you're serving
from.

**Chat answers but nothing is logged** - expected. Transcript logging and
analytics go to Supabase, which is optional and currently not connected. The
assistant doesn't depend on it.

---

## What Supabase is still for

Analytics events, chat transcripts, and the contact form's send-email function.
All optional as far as the assistant is concerned. The original project was
deleted, so these are inert until a new project is wired up. The site and the
assistant both work without it.

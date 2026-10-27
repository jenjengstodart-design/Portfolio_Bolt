# 📌 Source of Truth: Jen Jeng Portfolio Website

> **The GitHub repository is the definitive version of this website.**
> Local folders are working copies only - never assume they are the latest.

> ⚠️ **This only holds if you push.** On 2026-10-27 eight files were found live
> on jenjeng.com but absent from GitHub, deployed straight from a local `dist`
> with `wrangler pages deploy`. Anyone pulling main and deploying would have
> silently reverted the site. If you deploy with wrangler, commit and push the
> same change.

---

## ✅ Canonical Source

| | Detail |
|---|---|
| **GitHub Repo** | https://github.com/jenjengstodart-design/Portfolio_Bolt |
| **Live Site** | https://jenjeng.com |
| **Hosting** | Cloudflare Pages, project `jenjeng-portfolio`. **Direct upload - there is no Git integration, so pushing to GitHub does NOT deploy.** Deploys happen with `wrangler` (step 4 below). Verified 2026-10-27: the repo has zero GitHub deployments. |
| **Database/AI** | Supabase project: `jenjengstodart-portfolio` |
| **Last verified** | 2026-10-27 |

---

## ⚠️ What is NOT the source of truth

These local folders exist for reference only. Do NOT edit them directly or treat them as up-to-date:

| Folder | Status |
|---|---|
| `website-versions/jenjeng-portfolio/` | ✅ Working copy — sync with GitHub before editing |
| `website-versions/claude-jenjeng-portfolio/` | 📚 Notes/docs only — not live code |
| `website-versions/coordination-lab-vBuilder/` | ❌ Different project — unrelated |
| `website-versions/coordination-lab-vConsulting/` | ❌ Different project — unrelated |

---

## 🔄 Workflow: How to make changes

```
1. Pull latest from GitHub first:
   git pull origin main

2. Make your changes locally in:
   /Users/jenjeng/Claude/CC Projects/website-versions/jenjeng-portfolio/

3. Commit and push to GitHub:
   git add .
   git commit -m "describe what changed"
   git push origin main

4. Build and deploy (this is what actually updates the live site):
   npm run build
   npx wrangler pages deploy dist --project-name jenjeng-portfolio
```

**Steps 3 and 4 are both required.** Pushing alone changes nothing on the live
site, and deploying alone leaves GitHub behind production. Skipping step 3 is
exactly how eight files ended up live but uncommitted.

---

## 🤖 AI Chatbot (Jen's AI Assistant)

The chat widget posts to **`/api/chat`**, a **Cloudflare Pages Function** at
`functions/api/chat.ts`. It deploys with the site, so there's nothing separate
to keep alive.

- Anthropic key: `ANTHROPIC_API_KEY` env var on the Cloudflare Pages project (server-side only)
- Model: `claude-sonnet-5-5`
- Rate limit: 20 messages per IP per 24h (bind a KV namespace `CHAT_RATE_LIMIT` to make it hold across edge locations)
- Full setup: `AI_CHAT_SETUP.md`

### ⚡ If the chatbot stops working

1. "The assistant is not configured yet" → `ANTHROPIC_API_KEY` isn't set on the
   Pages project, or it was added after the current deploy. Set it and redeploy.
2. "The assistant is temporarily unavailable" → Anthropic rejected the call.
   Usually an invalid key or spent credits. Real reason is in the Pages Function
   logs in the Cloudflare dashboard.
3. Anything else → check the Pages Function logs first.

### ⚠️ History

The assistant previously ran on a Supabase Edge Function. That project was on
the free tier, auto-paused while idle, and was eventually **deleted** - its ref
`jrdasiwkmwsxmghlwjnh` stopped resolving in DNS, so every message failed at the
network layer and nothing alerted anyone. The keep-alive GitHub Action written
to prevent the pausing was never committed, so it never ran once.

Supabase is now optional and carries analytics, chat transcripts, and the
contact form's send-email function only. Those are inert until a new project is
wired up. **The contact form's send path is still broken** for the same reason.

## 🗓️ Change Log

| Date | Change | Who |
|---|---|---|
| 2026-02-12 | Services page, project labels, contact email updated | Jen + Claude Code |
| 2026-04-27 | Supabase reactivated; keep-alive Action written (but never committed, so it never ran); SOURCE_OF_TRUTH.md created | Jen + Antigravity |
| 2026-10-27 | Chat assistant moved off the deleted Supabase project to a Cloudflare Pages Function at `/api/chat`; system prompt moved server-side; repo synced with production | Jen + Claude Code |

---

*This file is maintained in the GitHub repo and should be updated whenever significant changes are made.*

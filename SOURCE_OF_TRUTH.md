# 📌 Source of Truth: Jen Jeng Portfolio Website

> **The GitHub repository is ALWAYS the definitive, latest version of this website.**
> Local folders are working copies only — never assume they are the latest.

---

## ✅ Canonical Source

| | Detail |
|---|---|
| **GitHub Repo** | https://github.com/jenjengstodart-design/Portfolio_Bolt |
| **Live Site** | https://jenjeng.com |
| **Hosting** | Cloudflare Pages (auto-deploys from `main` branch on GitHub) |
| **Database/AI** | Supabase project: `jenjengstodart-portfolio` |
| **Last verified** | 2026-04-27 |

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

4. Cloudflare Pages auto-deploys → jenjeng.com updates within ~2 minutes
```

---

## 🤖 AI Chatbot (Jen's AI Assistant)

The chat widget on jenjeng.com uses:
- **Supabase Edge Function** (`/functions/v1/chat`) to proxy calls to Anthropic Claude
- **Anthropic API key** stored as a Supabase Secret (never in `.env`)
- **keep-alive** function (GitHub Action scheduled daily) to prevent Supabase auto-pausing

### ⚡ If the chatbot stops working:
1. Check https://supabase.com/dashboard → project `jenjengstodart-portfolio`
2. If status shows "Paused" → click **Resume project**
3. Wait ~2 minutes → chatbot will be live again
4. The GitHub Action keep-alive should prevent this in future

---

## 🗓️ Change Log

| Date | Change | Who |
|---|---|---|
| 2026-02-12 | Services page, project labels, contact email updated | Jen + Claude Code |
| 2026-04-27 | Supabase reactivated; keep-alive GitHub Action added; SOURCE_OF_TRUTH.md created | Jen + Antigravity |

---

*This file is maintained in the GitHub repo and should be updated whenever significant changes are made.*

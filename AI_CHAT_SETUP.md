# AI Chat Setup Guide

Complete guide to enable the AI-powered chat assistant on Jen Jeng's portfolio website.

## Quick Setup (3 Steps)

### 1️⃣ Get Your Anthropic API Key

1. Visit **https://console.anthropic.com**
2. Create an account or sign in
3. Click on **"API Keys"** in the left sidebar
4. Click **"Create Key"**
5. Give it a name (e.g., "Portfolio Website")
6. Copy the key (starts with `sk-ant-...`)

**Important**: Keep this key secure and never commit it to version control!

### 2️⃣ Add API Key to Supabase Secrets

The API key is stored securely in Supabase Edge Function secrets, not in your `.env` file.

1. Go to your **Supabase Dashboard**
2. Navigate to **Edge Functions** → **Secrets** (in settings)
3. Click **"New Secret"**
4. Enter:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: Your complete API key (starts with `sk-ant-...`)
5. Click **"Save Secret"**

Do **NOT** add this to your `.env` file. The Edge Function automatically reads it from Supabase Secrets.

### 3️⃣ Verify the Setup

The chat widget will start working immediately once the secret is saved. No restart needed!

**That's it!** The AI chat is now fully functional.

## Testing the AI Chat

1. Look for the red chat button in the bottom-right corner
2. Click it to open the chat widget
3. Try asking questions like:
   - "Tell me about yourself"
   - "What services do you offer?"
   - "What's your experience with AI?"
   - "Tell me about the Mars project"
   - "What are you looking for in your next role?"

## How the AI Chat Works

### Intelligent Context
The AI assistant has access to:
- ✅ Complete profile information
- ✅ All skills and certifications
- ✅ Work experience and achievements
- ✅ All 8 project case studies
- ✅ Service offerings and deliverables
- ✅ Pre-written FAQ answers

### Behavior Rules
The AI follows these critical rules:
- **Never oversells** - honest and direct
- **Admits gaps** - says "I don't have that information" when needed
- **First person** - speaks as Jen ("I have experience...")
- **Evidence-based** - references specific projects
- **Professional** - conversational but business-appropriate

### Data Storage
All conversations are stored in Supabase:
- Chat sessions tracked
- Messages saved for reference
- Popular questions identified
- Analytics for insights

## API Costs

Anthropic Claude pricing (as of 2024):
- **Claude 3.5 Sonnet**: ~$3 per million input tokens, $15 per million output tokens
- Average chat message: ~500-1000 tokens
- Estimated cost: **$0.01-0.02 per conversation**

Very affordable for a portfolio website!

## Troubleshooting

### "I'm a demo AI assistant..." message appears

**Problem**: API key not configured in Supabase Secrets
**Solution**:
1. Go to Supabase Dashboard → Edge Functions → Secrets
2. Verify `ANTHROPIC_API_KEY` secret is set with your full API key
3. Hard refresh browser (Ctrl+Shift+R)
4. Check browser console for error details

### "Error processing your message"

**Problem**: API request failed
**Solutions**:
1. Check API key is valid
2. Verify you have API credits in Anthropic account
3. Check browser console for detailed error
4. Ensure internet connection is stable

### Chat not appearing

**Problem**: Widget not rendering
**Solutions**:
1. Check browser console for JavaScript errors
2. Ensure Supabase connection is working
3. Try clearing browser cache

## Security Notes

### Server-Side API Key Protection
The API key is securely stored in Supabase Edge Function Secrets and is **never** exposed to the browser. This is the recommended approach and suitable for:
- Personal portfolio websites
- Small business websites
- Production applications
- Any public-facing website

### How It Works
1. Chat requests go to the Supabase Edge Function (`/functions/chat`)
2. The Edge Function reads the API key from Supabase Secrets
3. Requests to Anthropic are made server-side
4. Only the response is sent back to the browser
5. The API key never leaves Supabase infrastructure

### Why This Is Secure
✅ API key never exposed to browser
✅ API key never stored in `.env` or version control
✅ Suitable for production applications
✅ Can handle any traffic level
✅ Better cost control and rate limiting

## Customizing AI Behavior

### Update FAQ Answers
Edit `/src/content/faq.json`:
```json
{
  "faq": [
    {
      "question": "Your question here",
      "answer": "Your pre-written answer here"
    }
  ]
}
```

### Modify Behavior Rules
Edit the `aiBehaviorRules` array in `/src/content/faq.json`:
```json
{
  "aiBehaviorRules": [
    "Never oversell me",
    "Your custom rule here"
  ]
}
```

### Change AI Model
Edit `/src/components/ChatWidget.tsx`, line ~178:
```typescript
model: 'claude-3-5-sonnet-20241022',  // Current model
// Options:
// - 'claude-3-5-sonnet-20241022' (recommended, balanced)
// - 'claude-3-opus-20240229' (most capable, expensive)
// - 'claude-3-haiku-20240307' (fastest, cheapest)
```

### Adjust Response Length
Edit `/src/components/ChatWidget.tsx`, line ~179:
```typescript
max_tokens: 1024,  // Current: ~750 words max
// Increase for longer responses
// Decrease for shorter, quicker answers
```

## Analytics & Insights

View chat analytics in Supabase:

### Popular Questions
```sql
SELECT question, ask_count, last_asked
FROM popular_questions
ORDER BY ask_count DESC
LIMIT 10;
```

### Total Conversations
```sql
SELECT COUNT(*) as total_conversations
FROM chat_conversations;
```

### Messages Per Day
```sql
SELECT DATE(timestamp) as date, COUNT(*) as messages
FROM chat_messages
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

## Support

If you encounter issues:
1. Check this guide first
2. Review browser console for errors
3. Verify `ANTHROPIC_API_KEY` secret is set in Supabase
4. Ensure all dependencies are installed: `npm install`

For Anthropic API issues:
- Anthropic Documentation: https://docs.anthropic.com
- Anthropic Support: support@anthropic.com

For Supabase Edge Function issues:
- Supabase Docs: https://supabase.com/docs/guides/functions
- Check Edge Function logs in Supabase Dashboard

---

**Ready to chat?** Add your API key to Supabase Secrets and start conversing!

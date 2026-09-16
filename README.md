# Lady Denily Trading Academy — Ad Bot

A Telegram bot for running ads for Lady Denily Legendary Trading Academy.
On `/start`, it sends a welcome message with a button. Every tap is logged
(overall + per ad campaign), then the user is sent to:
`https://t.me/fxladytguild`

No CLI needed — everything below is GitHub web UI + Vercel dashboard.

## 1. Upload to GitHub
Create a new repo (e.g. `lady-denily-bot`) and upload all these files
through the GitHub web UI, keeping the `api/` folder structure intact.

## 2. Import into Vercel
Vercel dashboard → **Add New → Project** → import the repo. Deploy once
with defaults — it'll fail to work fully until env vars are set (next step),
but the build itself will succeed.

## 3. Add a KV database (for click tracking)
In your Vercel project → **Storage** tab → **Create Database** → **KV**
(Upstash) → connect it to this project. Vercel auto-injects
`KV_REST_API_URL` and `KV_REST_API_TOKEN` — you don't need to touch these.

## 4. Add environment variables
Project → **Settings → Environment Variables**:

| Name | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | the token from @BotFather |
| `ADMIN_KEY` | any secret string you make up, used to view stats |

Redeploy after adding these (Deployments tab → ⋯ → Redeploy).

## 5. Point Telegram at your bot
Once deployed, grab your project's domain, e.g. `lady-denily-bot.vercel.app`.
Set the webhook by visiting this URL once in your browser (replace both
placeholders):

```
https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/setWebhook?url=https://<YOUR_VERCEL_DOMAIN>/api/webhook
```

You should see `{"ok":true,"result":true,...}`.

## 6. Test it
Open your bot in Telegram and send `/start`. You should get the welcome
message with a "🚀 Join FX Lady Guild" button that lands you in the guild.

## 7. Running ads with campaign tracking
For each ad/placement, use a different deep link so clicks are tracked
separately:

```
https://t.me/<YourBotUsername>?start=fb_ad1
https://t.me/<YourBotUsername>?start=tiktok_promo
https://t.me/<YourBotUsername>?start=ig_story
```

Anyone who taps `/start` with no payload counts under `direct`.

## 8. Viewing click stats
Visit:

```
https://<YOUR_VERCEL_DOMAIN>/api/stats?key=<YOUR_ADMIN_KEY>
```

Returns JSON like:

```json
{ "total": 142, "breakdown": { "direct": 30, "fb_ad1": 80, "tiktok_promo": 32 } }
```

## Later: the web app
When you're ready to build the web app, `api/go.js` is the natural place
to extend — e.g. redirect through a landing page instead of straight to
the guild link, while keeping the same click-tracking logic.

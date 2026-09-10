# LUNE Agency — deploy-ready landing page

Premium Russian-language recruitment landing page for an 18+ TikTok LIVE creator program.

## Included

- responsive desktop/mobile experience;
- clear cold-audience hero and objection handling;
- first-7-days onboarding timeline;
- transparent LIVE scenario calculator (range, not guaranteed income);
- creator support / boundaries / FAQ / referral blocks;
- 1-minute application form;
- UTM + referral attribution capture;
- optional Telegram Bot delivery through a Vercel serverless function;
- Telegram fallback when the API is not configured;
- Privacy / Terms starter pages;
- basic security headers, favicon, manifest and robots.txt.

## Local preview

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

The application form will use Telegram fallback locally unless `/api/apply` is running.

## Configure Telegram lead delivery

1. Create a bot with `@BotFather`.
2. Add it to your private LUNE admin chat/group.
3. Set these environment variables on Vercel:

```text
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
TELEGRAM_THREAD_ID=...   # optional
```

The bot token is never exposed in browser code.

For the fallback button, update the body attribute in `index.html`:

```html
<body data-telegram-admin="YOUR_TELEGRAM_USERNAME">
```

Use the admin username without `@`.

## Telegram / channel attribution

Use a different URL for every placement. Example:

```text
https://YOUR-DOMAIN.com/?utm_source=telegram&utm_campaign=warsaw_models&utm_content=post_a
```

Referral example:

```text
https://YOUR-DOMAIN.com/?ref=friend_username
```

The source/campaign/content/referral values are forwarded with each application.

## Deploy on Vercel

The folder is already compatible with Vercel. Import this repository, add the Telegram environment variables, and deploy. `api/apply.js` will become `/api/apply` automatically.

## Before paid traffic

- Replace the Telegram placeholder.
- Keep `$5K+` / `$100K` only if these are LUNE's own verifiable cases.
- Replace starter Privacy/Terms with final legal text for the entity/jurisdiction operating LUNE.
- Add real creator stories only when they are genuine and permissioned.
- Add analytics/pixels only after deciding the tracking/privacy setup.

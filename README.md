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
<body data-telegram-admin="luneagency">
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

- Verify delivery in your Telegram bot admin chat if bot delivery is enabled.
- Keep `$5K+` / `$100K` only if these are LUNE's own verifiable cases.
- Replace starter Privacy/Terms with final legal text for the entity/jurisdiction operating LUNE.
- Add real creator stories only when they are genuine and permissioned.
- Add analytics/pixels only after deciding the tracking/privacy setup.

## Media and contact update

Production domain: https://lovelune.live/ (also www.lovelune.live). Direct contact: https://t.me/luneagency. If bot delivery fails or is unavailable, the form offers a Telegram draft with the applicant contacts and attribution, requiring the visitor to press Send. No bot token is needed for this path.

Hero images `assets/creator-live-640.webp` and `assets/creator-live-1024.webp` and social preview `assets/creator-social.jpg` are AI-generated illustrative photography, not a real creator testimonial. Generated with built-in Imagegen: adult creator hosting a livestream at home, cream knit top, warm rose/cream interior, natural window light, vertical framing, no text/logos/platform UI.

Social preview v3 uses a dedicated landscape illustration (`assets/lune-social-v3.jpg`, 1200×630), preserving the full face instead of automatically cropping the portrait. OG and Twitter text match in Russian. The versioned image path avoids reusing the previous cached image URL. Existing messenger cards may retain a cached preview.

## Approved offer and selected photo

User confirmed free training, a personal manager, prepared LIVE topics and support for every LIVE at the start. The user supplied the $1,000–3,000 first-month results; page copy presents these as individual participant results, dependent on involvement, not guaranteed pay. Dark Studio is selected for both hero and social preview. Social preview uses `assets/lune-dark-social-v4.jpg`; responsive hero uses `assets/dark-studio-640.webp` and `assets/dark-studio-1280.webp`.

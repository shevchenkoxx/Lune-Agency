const clean = (value, max = 300) => String(value ?? '').trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});

  // Honeypot: bots often fill invisible fields. Return success without forwarding spam.
  if (clean(body.website, 80)) return res.status(200).json({ ok: true });

  const age = Number(body.age);
  const city = clean(body.city, 120);
  const social = clean(body.social, 300);
  const telegram = clean(body.telegram, 120);
  const consent = Boolean(body.consent);

  if (!Number.isFinite(age) || age < 18 || age > 99 || !city || !social || !telegram || !consent) {
    return res.status(400).json({ ok: false, error: 'Invalid application' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const threadId = process.env.TELEGRAM_THREAD_ID;

  if (!token || !chatId) {
    return res.status(503).json({ ok: false, error: 'Telegram integration is not configured' });
  }

  const lines = [
    '🌙 Новая кандидатка — LUNE',
    '',
    `Возраст: ${age}`,
    `Город / страна: ${city}`,
    `Instagram / TikTok: ${social}`,
    `Telegram: ${telegram}`,
    '',
    clean(body.utm_source, 100) ? `Source: ${clean(body.utm_source, 100)}` : '',
    clean(body.utm_campaign, 100) ? `Campaign: ${clean(body.utm_campaign, 100)}` : '',
    clean(body.utm_content, 100) ? `Content: ${clean(body.utm_content, 100)}` : '',
    clean(body.referral, 100) ? `Referral: ${clean(body.referral, 100)}` : '',
    clean(body.referrer, 300) ? `Referrer: ${clean(body.referrer, 300)}` : ''
  ].filter(Boolean);

  const payload = {
    chat_id: chatId,
    text: lines.join('\n'),
    disable_web_page_preview: true
  };
  if (threadId) payload.message_thread_id = Number(threadId);

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await tg.json();
    if (!tg.ok || !data.ok) throw new Error(data.description || `Telegram HTTP ${tg.status}`);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('LUNE application delivery failed:', error.message);
    return res.status(502).json({ ok: false, error: 'Delivery failed' });
  }
}

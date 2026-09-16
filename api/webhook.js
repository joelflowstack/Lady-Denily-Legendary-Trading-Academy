// api/webhook.js
// Handles incoming Telegram updates (set as your bot's webhook URL).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('OK');
  }

  try {
    const update = req.body;
    const message = update.message;

    if (message && message.text && message.text.startsWith('/start')) {
      const chatId = message.chat.id;

      // Deep-link payload: t.me/YourBot?start=ad1 -> "ad1"
      const parts = message.text.trim().split(' ');
      const campaign = parts[1] || 'direct';

      const host = req.headers['x-forwarded-host'] || req.headers.host;
      const redirectUrl = `https://${host}/api/go?ref=${encodeURIComponent(campaign)}`;

      const welcomeText =
        `📈 *Welcome to Lady Denily Legendary Trading Academy!*\n\n` +
        `Tap the button below to join our official FX Lady Guild for ` +
        `exclusive trading signals, mentorship, and community support.`;

      await sendMessage(chatId, welcomeText, {
        inline_keyboard: [[{ text: '🚀 Join FX Lady Guild', url: redirectUrl }]],
      });
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('webhook error:', err);
    // Always respond 200 so Telegram doesn't hammer retries
    res.status(200).send('OK');
  }
}

async function sendMessage(chatId, text, replyMarkup) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      reply_markup: replyMarkup,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    console.error('Telegram sendMessage failed:', resp.status, body);
  }
}

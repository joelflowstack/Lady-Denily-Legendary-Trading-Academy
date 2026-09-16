// api/go.js
// Every tap on the bot's "Join FX Lady Guild" button hits this endpoint first,
// so we can count clicks (overall and per ad campaign) before redirecting.

import { kv } from '@vercel/kv';

const GUILD_LINK = 'https://t.me/fxladytguild';

export default async function handler(req, res) {
  const campaign = (req.query.ref || 'direct').toString();

  try {
    await kv.incr('clicks:total');
    await kv.incr(`clicks:${campaign}`);
    await kv.sadd('campaigns', campaign);
  } catch (err) {
    // Never block the redirect just because tracking failed
    console.error('KV tracking error:', err);
  }

  res.writeHead(302, { Location: GUILD_LINK });
  res.end();
}

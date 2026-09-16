// api/stats.js
// View click counts: /api/stats?key=YOUR_ADMIN_KEY

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (!process.env.ADMIN_KEY || req.query.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const total = (await kv.get('clicks:total')) || 0;
    const campaigns = (await kv.smembers('campaigns')) || [];

    const breakdown = {};
    for (const campaign of campaigns) {
      breakdown[campaign] = (await kv.get(`clicks:${campaign}`)) || 0;
    }

    res.status(200).json({ total, breakdown });
  } catch (err) {
    console.error('stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
}

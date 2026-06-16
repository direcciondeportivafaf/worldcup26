import type { VercelRequest, VercelResponse } from '@vercel/node';

const FOOTBALL_DATA_KEY = process.env.FOOTBALL_DATA_KEY || 'df0c6a66a425424a95e1e1a4fa187135';
const FOOTBALL_DATA_BASE = 'https://api.football-data.org/v4';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const limit = req.query.limit || '20';
    const response = await fetch(`${FOOTBALL_DATA_BASE}/competitions/WC/scorers?limit=${limit}`, {
      headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `football-data.org error: ${response.status}` });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Scorers API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

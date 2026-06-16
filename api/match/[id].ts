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

  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ error: 'Match ID required' });
  }

  try {
    const response = await fetch(`${FOOTBALL_DATA_BASE}/matches/${id}`, {
      headers: { 'X-Auth-Token': FOOTBALL_DATA_KEY },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `football-data.org error: ${response.status}` });
    }

    const data = await response.json();
    // Cache finished match details for 1 hour (they don't change)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Match detail API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

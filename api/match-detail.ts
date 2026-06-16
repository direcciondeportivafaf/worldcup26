import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { t1, t2 } = req.query;
  if (!t1 || !t2 || Array.isArray(t1) || Array.isArray(t2)) {
    return res.status(400).json({ error: 'Team names required: ?t1=X&t2=Y' });
  }

  try {
    const sbRes = await fetch('https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard');
    if (!sbRes.ok) throw new Error(`ESPN scoreboard: ${sbRes.status}`);
    const sb = await sbRes.json();
    const events = sb.events || [];

    const t1Lower = t1.toLowerCase();
    const t2Lower = t2.toLowerCase();

    const event = events.find((e: any) => {
      const competitors = e.competitions?.[0]?.competitors || [];
      const names = competitors.map((c: any) => (c.team?.displayName || '').toLowerCase());
      return names.includes(t1Lower) && names.includes(t2Lower);
    });

    if (!event) {
      return res.status(404).json({ error: 'Match not found on ESPN', t1, t2 });
    }

    const sumRes = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${event.id}`
    );
    if (!sumRes.ok) throw new Error(`ESPN summary: ${sumRes.status}`);
    const summary = await sumRes.json();

    const goals = (summary.keyEvents || [])
      .filter((ke: any) => {
        const t = ke.type?.type;
        return t === 'goal' || t === 'penalty-goal' || t === 'own-goal';
      })
      .map((ke: any) => ({
        minute: Math.floor((ke.clock?.value || 0) / 60),
        injuryTime: null,
        type: ke.type?.type === 'penalty-goal' ? 'PENALTY' :
               ke.type?.type === 'own-goal' ? 'OWN_GOAL' : 'REGULAR',
        team: { id: 0, name: ke.team?.displayName || '' },
        scorer: { id: 0, name: ke.participants?.[0]?.athlete?.displayName || ke.shortText?.replace(' Goal', '') || '' },
        assist: ke.participants?.[1]?.athlete
          ? { id: 0, name: ke.participants[1].athlete.displayName }
          : null,
        score: { home: 0, away: 0 },
      }));

    const bookings = (summary.keyEvents || [])
      .filter((ke: any) => {
        const t = ke.type?.type;
        return t === 'yellow-card' || t === 'red-card' || t === 'yellow-red-card';
      })
      .map((ke: any) => ({
        minute: Math.floor((ke.clock?.value || 0) / 60),
        player: { id: 0, name: ke.participants?.[0]?.athlete?.displayName || '' },
        card: ke.type?.type === 'red-card' ? 'RED' : ke.type?.type === 'yellow-red-card' ? 'YELLOW_RED' : 'YELLOW',
      }));

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json({ goals, bookings, penalties: [] });
  } catch (error) {
    console.error('Match detail error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

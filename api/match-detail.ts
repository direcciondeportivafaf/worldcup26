import type { VercelRequest, VercelResponse } from '@vercel/node';

// Normalize: remove accents and lowercase for matching
function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Spanish name → ESPN English displayName mapping
const NAME_MAP: Record<string, string> = {
  'méxico': 'mexico',
  'estados unidos': 'united states',
  'canadá': 'canada',
  'corea del sur': 'south korea',
  'chequia': 'czechia',
  'sudáfrica': 'south africa',
  'japón': 'japan',
  'países bajos': 'netherlands',
  'bosnia y herzegovina': 'bosnia & herzegovina',
  'bosnia y herzegovina': 'bosnia & herzegovina',
  'costa de marfil': 'ivory coast',
  'nueva zelanda': 'new zealand',
  'arabia saudí': 'saudi arabia',
  'arabia saudi': 'saudi arabia',
  'irán': 'iran',
  'españa': 'spain',
  'brasil': 'brazil',
  'francia': 'france',
  'alemania': 'germany',
  'inglaterra': 'england',
  'argelia': 'algeria',
  'jordania': 'jordan',
  'rd del congo': 'dr congo',
  'irak': 'iraq',
  'marruecos': 'morocco',
  'senegal': 'senegal',
  'túnez': 'tunisia',
  'turquía': 'turkey',
  'australia': 'australia',
  'paraguay': 'paraguay',
  'ecuador': 'ecuador',
  'suecia': 'sweden',
  'egipto': 'egypt',
  'bélgica': 'belgium',
  'uruguay': 'uruguay',
  'croacia': 'croatia',
  'ghana': 'ghana',
  'panamá': 'panama',
  'colombia': 'colombia',
  'portugal': 'portugal',
  'suiza': 'switzerland',
  'catar': 'qatar',
  'haití': 'haiti',
  'curazao': 'curacao',
  'noruega': 'norway',
  'austria': 'austria',
  'uzbekistán': 'uzbekistan',
  'cabo verde': 'cape verde',
};

// Reverse map: normalized English → our team ID
const ESPN_TO_ID: Record<string, string> = {};
const TEAM_IDS: Record<string, string> = {
  'méxico': 'mex', 'corea del sur': 'kor', 'chequia': 'cze', 'sudáfrica': 'rsa',
  'suiza': 'sui', 'canadá': 'can', 'catar': 'qat', 'bosnia y herzegovina': 'bih',
  'escocia': 'sco', 'marruecos': 'mar', 'brasil': 'bra', 'haití': 'hai',
  'estados unidos': 'usa', 'australia': 'aus', 'turquía': 'tur', 'paraguay': 'par',
  'alemania': 'ger', 'costa de marfil': 'civ', 'ecuador': 'ecu', 'curazao': 'cuw',
  'suecia': 'swe', 'japón': 'jpn', 'países bajos': 'ned', 'túnez': 'tun',
  'egipto': 'egy', 'bélgica': 'bel', 'irán': 'irn', 'nueva zelanda': 'nzl',
  'cabo verde': 'cpv', 'arabia saudí': 'ksa', 'españa': 'esp', 'uruguay': 'ury',
  'francia': 'fra', 'irak': 'irq', 'noruega': 'nor', 'senegal': 'sen',
  'argelia': 'alg', 'argentina': 'arg', 'jordania': 'jor', 'austria': 'aut',
  'rd del congo': 'cod', 'colombia': 'col', 'portugal': 'por', 'uzbekistán': 'uzb',
  'inglaterra': 'eng', 'ghana': 'gha', 'croacia': 'cro', 'panamá': 'pan',
};
for (const [esName, id] of Object.entries(TEAM_IDS)) {
  ESPN_TO_ID[norm(esName)] = id;
}

function resolveTeamId(espnDisplayName: string): string {
  return ESPN_TO_ID[norm(espnDisplayName)] || '';
}

function matchTeamName(ourName: string, espnName: string): boolean {
  const a = norm(ourName);
  const b = norm(espnName);
  // Direct normalized match
  if (a === b) return true;
  // Check name map
  const mapped = NAME_MAP[a];
  if (mapped && norm(mapped) === b) return true;
  // Reverse: check if ESPN name maps to our name
  for (const [key, val] of Object.entries(NAME_MAP)) {
    if (norm(val) === b && norm(key) === a) return true;
  }
  // Partial match (first 3 chars at least)
  if (a.length >= 3 && b.length >= 3 && a.slice(0, 3) === b.slice(0, 3)) return true;
  return false;
}

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
    // Fetch ALL tournament matches with date range (entire tournament)
    const sbRes = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719'
    );
    if (!sbRes.ok) throw new Error(`ESPN scoreboard: ${sbRes.status}`);
    const sb = await sbRes.json();
    const events = sb.events || [];

    console.log(`[match-detail] Looking for: ${t1} vs ${t2} (${events.length} events)`);

    // Find matching event by team display names (accent-insensitive)
    const event = events.find((e: any) => {
      const competitors = e.competitions?.[0]?.competitors || [];
      const names = competitors.map((c: any) => c.team?.displayName || '');
      return (
        (matchTeamName(t1, names[0] || '') && matchTeamName(t2, names[1] || '')) ||
        (matchTeamName(t1, names[1] || '') && matchTeamName(t2, names[0] || ''))
      );
    });

    if (!event) {
      // Log some event names for debugging
      const sampleNames = events.slice(0, 5).map((e: any) =>
        e.competitions?.[0]?.competitors?.map((c: any) => c.team?.displayName).join(' vs ')
      );
      console.log(`[match-detail] Not found. Sample events:`, sampleNames);
      return res.status(404).json({ error: 'Match not found on ESPN', t1, t2, sampleEvents: sampleNames });
    }

    const eventName = event.competitions?.[0]?.competitors?.map((c: any) => c.team?.displayName).join(' vs ');
    console.log(`[match-detail] Found event: ${eventName} (id=${event.id})`);

    // The scoreboard response already includes goal details in the `details` array
    const details = event.competitions?.[0]?.details || [];

    // Also try summary endpoint for richer data (keyEvents with participants)
    let goals: any[] = [];
    let bookings: any[] = [];

    try {
      const sumRes = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${event.id}`
      );
      if (sumRes.ok) {
        const summary = await sumRes.json();
        const keyEvents = summary.keyEvents || [];

        goals = keyEvents
          .filter((ke: any) => {
            const t = ke.type?.type;
            return t === 'goal' || t === 'penalty-goal' || t === 'own-goal';
          })
          .map((ke: any) => ({
            minute: Math.floor((ke.clock?.value || 0) / 60),
            injuryTime: null,
            type: ke.type?.type === 'penalty-goal' ? 'PENALTY' :
                   ke.type?.type === 'own-goal' ? 'OWN_GOAL' : 'REGULAR',
            team: { id: resolveTeamId(ke.team?.displayName || ''), name: ke.team?.displayName || '' },
            scorer: { id: 0, name: ke.participants?.[0]?.athlete?.displayName || '' },
            assist: ke.participants?.[1]?.athlete
              ? { id: 0, name: ke.participants[1].athlete.displayName }
              : null,
            score: { home: 0, away: 0 },
          }));

        bookings = keyEvents
          .filter((ke: any) => {
            const t = ke.type?.type;
            return t === 'yellow-card' || t === 'red-card' || t === 'yellow-red-card';
          })
          .map((ke: any) => ({
            minute: Math.floor((ke.clock?.value || 0) / 60),
            player: { id: 0, name: ke.participants?.[0]?.athlete?.displayName || '' },
            card: ke.type?.type === 'red-card' ? 'RED' : ke.type?.type === 'yellow-red-card' ? 'YELLOW_RED' : 'YELLOW',
          }));

        console.log(`[match-detail] Summary: ${goals.length} goals, ${bookings.length} bookings`);
      }
    } catch (e) {
      console.log(`[match-detail] Summary failed, using scoreboard details`);
    }

    // Fallback: parse goals from scoreboard details if summary didn't provide them
    if (goals.length === 0 && details.length > 0) {
      console.log(`[match-detail] Using ${details.length} scoreboard details`);
      // Build team ID → name lookup from competitors
      const competitors = event.competitions?.[0]?.competitors || [];
      const teamNameById: Record<string, string> = {};
      competitors.forEach((c: any) => {
        if (c.team?.id && c.team?.displayName) {
          teamNameById[c.team.id] = c.team.displayName;
        }
      });

      goals = details
        .filter((d: any) => d.scoringPlay && d.type?.id)
        .map((d: any) => {
          const text = d.type?.text || '';
          const minute = Math.floor((d.clock?.value || 0) / 60);
          const isPenalty = text.toLowerCase().includes('penalty');
          const isOwnGoal = text.toLowerCase().includes('own goal') || text.toLowerCase().includes('own-goal');
          const scorer = d.athletesInvolved?.[0];
          const teamId = String(d.team?.id || '');
          const teamName = teamNameById[teamId] || teamId;

          return {
            minute,
            injuryTime: null,
            type: isPenalty ? 'PENALTY' : isOwnGoal ? 'OWN_GOAL' : 'REGULAR',
            team: { id: resolveTeamId(teamName), name: teamName },
            scorer: { id: 0, name: scorer?.displayName || '' },
            assist: d.athletesInvolved?.[1]
              ? { id: 0, name: d.athletesInvolved[1].displayName }
              : null,
            score: { home: 0, away: 0 },
          };
        });
      console.log(`[match-detail] Parsed ${goals.length} goals from details`);
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json({ goals, bookings, penalties: [] });
  } catch (error) {
    console.error('Match detail error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

function norm(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

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

const NAME_MAP: Record<string, string> = {
  'méxico': 'mexico', 'estados unidos': 'united states', 'canadá': 'canada',
  'corea del sur': 'south korea', 'chequia': 'czechia', 'sudáfrica': 'south africa',
  'japón': 'japan', 'países bajos': 'netherlands',
  'bosnia y herzegovina': 'bosnia & herzegovina',
  'costa de marfil': 'ivory coast', 'nueva zelanda': 'new zealand',
  'arabia saudí': 'saudi arabia', 'irán': 'iran', 'españa': 'spain',
  'brasil': 'brazil', 'francia': 'france', 'alemania': 'germany',
  'inglaterra': 'england', 'argelia': 'algeria', 'jordania': 'jordan',
  'rd del congo': 'dr congo', 'irak': 'iraq', 'marruecos': 'morocco',
  'senegal': 'senegal', 'túnez': 'tunisia', 'turquía': 'turkey',
  'australia': 'australia', 'paraguay': 'paraguay', 'ecuador': 'ecuador',
  'suecia': 'sweden', 'egipto': 'egypt', 'bélgica': 'belgium',
  'uruguay': 'uruguay', 'croacia': 'croatia', 'ghana': 'ghana',
  'panamá': 'panama', 'colombia': 'colombia', 'portugal': 'portugal',
  'suiza': 'switzerland', 'catar': 'qatar', 'haití': 'haiti',
  'curazao': 'curacao', 'noruega': 'norway', 'austria': 'austria',
  'uzbekistán': 'uzbekistan', 'cabo verde': 'cape verde',
};

function resolveTeamId(espnName: string): string {
  const n = norm(espnName);
  for (const [es, id] of Object.entries(TEAM_IDS)) {
    if (norm(es) === n) return id;
  }
  // Try via NAME_MAP reverse
  for (const [es, en] of Object.entries(NAME_MAP)) {
    if (norm(en) === n) return TEAM_IDS[es] || '';
  }
  return '';
}

function matchTeamName(ourName: string, espnName: string): boolean {
  const a = norm(ourName);
  const b = norm(espnName);
  if (a === b) return true;
  const mapped = NAME_MAP[a];
  if (mapped && norm(mapped) === b) return true;
  for (const [key, val] of Object.entries(NAME_MAP)) {
    if (norm(val) === b && norm(key) === a) return true;
  }
  if (a.length >= 3 && b.length >= 3 && a.slice(0, 3) === b.slice(0, 3)) return true;
  return false;
}

/** Parse minute from displayValue like "9'", "90'+2'", "45'+1'" */
function parseMinute(displayValue: string): number {
  const match = displayValue.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Parse injury time from displayValue like "90'+2'" */
function parseInjuryTime(displayValue: string): number | null {
  const match = displayValue.match(/^(\d+)'\+(\d+)/);
  return match ? parseInt(match[2], 10) : null;
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
    const sbRes = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719'
    );
    if (!sbRes.ok) throw new Error(`ESPN scoreboard: ${sbRes.status}`);
    const sb = await sbRes.json();
    const events = sb.events || [];

    console.log(`[match-detail] Looking for: ${t1} vs ${t2} (${events.length} events)`);

    const event = events.find((e: any) => {
      const competitors = e.competitions?.[0]?.competitors || [];
      const names = competitors.map((c: any) => c.team?.displayName || '');
      return (
        (matchTeamName(t1, names[0] || '') && matchTeamName(t2, names[1] || '')) ||
        (matchTeamName(t1, names[1] || '') && matchTeamName(t2, names[0] || ''))
      );
    });

    if (!event) {
      const sampleNames = events.slice(0, 5).map((e: any) =>
        e.competitions?.[0]?.competitors?.map((c: any) => c.team?.displayName).join(' vs ')
      );
      console.log(`[match-detail] Not found. Samples:`, sampleNames);
      return res.status(404).json({ error: 'Match not found', t1, t2 });
    }

    const eventName = event.competitions?.[0]?.competitors?.map((c: any) => c.team?.displayName).join(' vs ');
    console.log(`[match-detail] Found: ${eventName}`);

    // Build team ID → name lookup from competitors
    const competitors = event.competitions?.[0]?.competitors || [];
    const teamNameById: Record<string, string> = {};
    competitors.forEach((c: any) => {
      if (c.team?.id && c.team?.displayName) {
        teamNameById[c.team.id] = c.team.displayName;
      }
    });

    // Use scoreboard details directly — they have ALL goals with correct data
    const details: any[] = event.competitions?.[0]?.details || [];

    const goals = details
      .filter((d: any) => d.scoringPlay && d.type?.id)
      .map((d: any) => {
        const text: string = d.type?.text || '';
        const displayClock: string = d.clock?.displayValue || '';
        const minute = parseMinute(displayClock);
        const injuryTime = parseInjuryTime(displayClock);
        const isPenalty = text.toLowerCase().includes('penalty');
        const isOwnGoal = text.toLowerCase().includes('own goal') || text.toLowerCase().includes('own-goal');
        const scorer = d.athletesInvolved?.[0];
        const assist = d.athletesInvolved?.[1];
        const teamEspnId = String(d.team?.id || '');
        const teamName = teamNameById[teamEspnId] || '';
        const teamId = resolveTeamId(teamName);

        return {
          minute,
          injuryTime,
          type: isPenalty ? 'PENALTY' : isOwnGoal ? 'OWN_GOAL' : 'REGULAR',
          team: { id: teamId, name: teamName },
          scorer: { id: 0, name: scorer?.displayName || '' },
          assist: assist ? { id: 0, name: assist.displayName } : null,
          score: { home: 0, away: 0 },
        };
      });

    const bookings = details
      .filter((d: any) => !d.scoringPlay && d.type?.id)
      .filter((d: any) => {
        const t = d.type?.text?.toLowerCase() || '';
        return t.includes('yellow') || t.includes('red');
      })
      .map((d: any) => {
        const displayClock: string = d.clock?.displayValue || '';
        const text: string = d.type?.text || '';
        const player = d.athletesInvolved?.[0];
        return {
          minute: parseMinute(displayClock),
          player: { id: 0, name: player?.displayName || '' },
          card: text.toLowerCase().includes('red') && !text.toLowerCase().includes('yellow')
            ? 'RED' : 'YELLOW',
        };
      });

    console.log(`[match-detail] ${goals.length} goals, ${bookings.length} bookings`);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json({ goals, bookings, penalties: [] });
  } catch (error) {
    console.error('Match detail error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

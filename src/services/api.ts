import { Match, Team, teams as staticTeams } from '../data/matches';

// In development, call APIs directly. In production (Vercel), use serverless proxy.
const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = isDev ? '' : '';  // Same origin in production (Vercel proxy)

const FOOTBALL_DATA_KEY = 'df0c6a66a425424a95e1e1a4fa187135';
const FOOTBALL_DATA_DIRECT = 'https://api.football-data.org/v4';
const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';

// ========== football-data.org types ==========
interface FDTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

interface FDScore {
  winner: string | null;
  duration: string;
  fullTime: { home: number | null; away: number | null };
  halfTime: { home: number | null; away: number | null };
  penalties?: { home: number | null; away: number | null };
}

interface FDMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  homeTeam: FDTeam | null;
  awayTeam: FDTeam | null;
  score: FDScore;
  lastUpdated: string;
}

interface FDStandingTeam {
  team: FDTeam;
  points: number;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  position: number;
}

// ========== ESPN types ==========
interface ESPNCompetitor {
  team: { displayName: string; abbreviation: string; logo?: string };
  score: string;
  homeAway: string;
}

interface ESPNEvent {
  name: string;
  date: string;
  status: { type: { description: string } };
  competitions: [{
    competitors: ESPNCompetitor[];
  }];
}

// ========== Mapping constants ==========
const STAGE_MAP: Record<string, string> = {
  'GROUP_STAGE': 'Fase de Grupos',
  'ROUND_OF_32': 'Dieciseisavos',
  'LAST_32': 'Dieciseisavos',
  'ROUND_OF_16': 'Octavos',
  'LAST_16': 'Octavos',
  'QUARTER_FINALS': 'Cuartos',
  'SEMI_FINALS': 'Semifinales',
  'THIRD_PLACE': 'Tercer Lugar',
  'FINAL': 'Final',
};

const GROUP_LETTERS = 'ABCDEFGHIJKL'.split('');

// ========== Team lookup ==========
const teamByCode: Record<string, Team> = {};
staticTeams.forEach(t => { teamByCode[t.code] = t; });

// Fallback TLA mappings for API codes that differ from our static data
const TLA_OVERRIDES: Record<string, string> = {
  'URU': 'URY',
  'RSA': 'RSA',
  'SCO': 'SCO',
  'ENG': 'ENG',
};

function resolveTeam(tla: string): Team | undefined {
  const upper = tla.toUpperCase();
  const lower = tla.toLowerCase();
  // 1. Direct match by code
  if (teamByCode[upper]) return teamByCode[upper];
  // 2. Override mapping
  const mapped = TLA_OVERRIDES[upper];
  if (mapped && teamByCode[mapped]) return teamByCode[mapped];
  // 3. Match by lowercase ID
  const byId = staticTeams.find(t => t.id === lower);
  if (byId) return byId;
  return undefined;
}

function getTeamFlag(tla: string): string {
  return resolveTeam(tla)?.flag || '🏳️';
}

function getTeamName(tla: string): string {
  return resolveTeam(tla)?.name || tla;
}

// ========== Status mapping ==========
function mapFDStatus(status: string): 'completed' | 'live' | 'upcoming' {
  if (status === 'FINISHED') return 'completed';
  if (['IN_PLAY', 'PAUSED', 'HALFTIME', 'AWARDING'].includes(status)) return 'live';
  return 'upcoming';
}

function mapESPNStatus(description: string): 'completed' | 'live' | 'upcoming' {
  const d = description.toLowerCase();
  if (d.includes('final')) return 'completed';
  if (d.includes('progress') || d.includes('halftime') || d.includes('end of period') || d.includes('extra time') || d.includes('penalty')) return 'live';
  return 'upcoming';
}

// ========== Transform football-data.org match ==========
function transformFDMatch(fd: FDMatch, allMatches: FDMatch[]): Match {
  const date = fd.utcDate.split('T')[0];
  const time = fd.utcDate.split('T')[1]?.slice(0, 5) || '00:00';
  const idx = allMatches.findIndex(m => m.id === fd.id);

  const homeTla = fd.homeTeam?.tla?.toLowerCase() || 'tbd';
  const awayTla = fd.awayTeam?.tla?.toLowerCase() || 'tbd';

  return {
    id: idx >= 0 ? idx + 1 : fd.id,
    round: STAGE_MAP[fd.stage] || fd.stage,
    group: fd.group ? fd.group.replace('GROUP_', '') : undefined,
    team1: homeTla,
    team2: awayTla,
    date,
    time,
    city: '',
    country: 'USA',
    score1: fd.score.fullTime.home ?? undefined,
    score2: fd.score.fullTime.away ?? undefined,
    status: mapFDStatus(fd.status),
    extraTime: fd.score.duration === 'EXTRA_TIME' || fd.score.duration === 'PENALTY_SHOOTOUT',
    penalties: fd.score.penalties
      ? `${fd.score.penalties.home}-${fd.score.penalties.away}`
      : undefined,
  };
}

// ========== Transform ESPN event ==========
function transformESPNMatch(espn: ESPNEvent, allEvents: ESPNEvent[]): Match {
  const date = espn.date.split('T')[0];
  const time = espn.date.split('T')[1]?.slice(0, 5) || '00:00';
  const competitors = espn.competitions?.[0]?.competitors || [];
  const home = competitors.find(c => c.homeAway === 'home') || competitors[0];
  const away = competitors.find(c => c.homeAway === 'away') || competitors[1];
  const idx = allEvents.findIndex(e => e.name === espn.name && e.date === espn.date);

  return {
    id: idx >= 0 ? idx + 1 : Math.abs(hashStr(espn.name + espn.date)) % 10000,
    round: 'Fase de Grupos',
    group: undefined,
    team1: (home?.team?.abbreviation || 'tbd').toLowerCase(),
    team2: (away?.team?.abbreviation || 'tbd').toLowerCase(),
    date,
    time,
    city: '',
    country: 'USA',
    score1: home ? parseInt(home.score) || undefined : undefined,
    score2: away ? parseInt(away.score) || undefined : undefined,
    status: mapESPNStatus(espn.status?.type?.description || 'Scheduled'),
  };
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h;
}

// ========== API: Matches ==========
async function fetchFDMatches(): Promise<Match[]> {
  // In production, use Vercel serverless proxy. In dev, call directly.
  const cacheBuster = `_t=${Date.now()}`;
  const url = isDev
    ? `${FOOTBALL_DATA_DIRECT}/competitions/WC/matches`
    : `/api/matches?${cacheBuster}`;

  const headers: Record<string, string> = isDev
    ? { 'X-Auth-Token': FOOTBALL_DATA_KEY }
    : {};

  const res = await fetch(url, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`football-data.org: ${res.status}`);
  const data = await res.json();
  const fdMatches: FDMatch[] = data.matches || [];
  return fdMatches.map(m => transformFDMatch(m, fdMatches));
}

async function fetchESPNMatches(): Promise<Match[]> {
  const res = await fetch(`${ESPN_BASE}/scoreboard`);
  if (!res.ok) throw new Error(`ESPN: ${res.status}`);
  const data = await res.json();
  const events: ESPNEvent[] = data.events || [];
  return events.map(e => transformESPNMatch(e, events));
}

// ========== API: Standings ==========
export interface ApiStanding {
  teamId: string;
  teamName: string;
  teamFlag: string;
  teamCrest: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
  position: number;
}

async function fetchFDStandings(): Promise<Record<string, ApiStanding[]>> {
  const cacheBuster = `_t=${Date.now()}`;
  const url = isDev
    ? `${FOOTBALL_DATA_DIRECT}/competitions/WC/standings`
    : `/api/standings?${cacheBuster}`;

  const headers: Record<string, string> = isDev
    ? { 'X-Auth-Token': FOOTBALL_DATA_KEY }
    : {};

  const res = await fetch(url, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`football-data.org standings: ${res.status}`);
  const data = await res.json();

  const result: Record<string, ApiStanding[]> = {};
  let groupIdx = 0;

  for (const standing of data.standings || []) {
    if (standing.type !== 'TOTAL') continue;
    const letter = GROUP_LETTERS[groupIdx] || String(groupIdx + 1);
    result[letter] = standing.table.map((t: FDStandingTeam) => ({
      teamId: t.team.tla.toLowerCase(),
      teamName: getTeamName(t.team.tla),
      teamFlag: getTeamFlag(t.team.tla),
      teamCrest: t.team.crest,
      played: t.playedGames,
      won: t.won,
      drawn: t.draw,
      lost: t.lost,
      goalsFor: t.goalsFor,
      goalsAgainst: t.goalsAgainst,
      goalDiff: t.goalDifference,
      points: t.points,
      position: t.position,
    }));
    groupIdx++;
  }

  return result;
}

// ========== Public API ==========
export async function fetchMatches(): Promise<Match[]> {
  try {
    const matches = await fetchFDMatches();
    if (matches.length > 0) {
      console.log(`[API] football-data.org: ${matches.length} matches`);
      return matches;
    }
    throw new Error('Empty response');
  } catch (err) {
    console.warn('[API] football-data.org failed, trying ESPN...', err);
    try {
      const matches = await fetchESPNMatches();
      if (matches.length > 0) {
        console.log(`[API] ESPN: ${matches.length} matches (today only, no group data)`);
        return matches;
      }
      throw new Error('Empty ESPN response');
    } catch (err2) {
      console.error('[API] Both APIs failed, using empty array (static fallback in components)', err2);
      return [];
    }
  }
}

export async function fetchStandings(): Promise<Record<string, ApiStanding[]>> {
  try {
    const standings = await fetchFDStandings();
    console.log(`[API] Standings: ${Object.keys(standings).length} groups`);
    return standings;
  } catch (err) {
    console.warn('[API] Standings failed', err);
    return {};
  }
}

// ========== Scorers ==========
export interface Scorer {
  player: {
    id: number;
    name: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    nationality?: string;
    position?: string;
  };
  team: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  goals: number;
  assists: number | null;
  penalties: number | null;
}

async function fetchFDScorers(): Promise<Scorer[]> {
  const cacheBuster = `_t=${Date.now()}`;
  const url = isDev
    ? `${FOOTBALL_DATA_DIRECT}/competitions/WC/scorers?limit=30`
    : `/api/scorers?limit=30&${cacheBuster}`;

  const headers: Record<string, string> = isDev
    ? { 'X-Auth-Token': FOOTBALL_DATA_KEY }
    : {};

  const res = await fetch(url, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`football-data.org scorers: ${res.status}`);
  const data = await res.json();
  return data.scorers || [];
}

export async function fetchScorers(): Promise<Scorer[]> {
  try {
    const scorers = await fetchFDScorers();
    console.log(`[API] Scorers: ${scorers.length} players`);
    return scorers;
  } catch (err) {
    console.warn('[API] Scorers failed', err);
    return [];
  }
}

// ========== Match Detail ==========
export interface MatchGoal {
  minute: number;
  injuryTime: number | null;
  type: 'REGULAR' | 'PENALTY' | 'OWN_GOAL';
  team: { id: number; name: string };
  scorer: { id: number; name: string };
  assist: { id: number; name: string } | null;
  score: { home: number; away: number };
}

export interface MatchDetail {
  id: number;
  goals: MatchGoal[];
  penalties: { player: { id: number; name: string }; scored: boolean }[];
  bookings: { minute: number; player: { id: number; name: string }; card: string }[];
}

export async function fetchMatchDetail(matchId: number, team1Name: string, team2Name: string): Promise<MatchDetail | null> {
  try {
    const url = `/api/match-detail?t1=${encodeURIComponent(team1Name)}&t2=${encodeURIComponent(team2Name)}&_t=${Date.now()}`;

    console.log(`[API] Fetching match goals: ${team1Name} vs ${team2Name}`);
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`[API] Match goals failed: ${res.status}`, errText);
      throw new Error(`Match detail: ${res.status}`);
    }
    const data = await res.json();
    console.log(`[API] Match goals loaded: ${data.goals?.length || 0} goals`);
    return {
      id: matchId,
      goals: data.goals || [],
      penalties: data.penalties || [],
      bookings: data.bookings || [],
    };
  } catch (err) {
    console.warn(`[API] Match goals failed for ${team1Name} vs ${team2Name}`, err);
    return null;
  }
}

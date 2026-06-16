export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  group: string;
}

export interface City {
  name: string;
  country: 'USA' | 'Canada' | 'Mexico';
  timezone: string;
  stadium: string;
}

export interface Match {
  id: number;
  round: string;
  group?: string;
  team1: string;
  team2: string;
  date: string; // ISO date
  time: string; // HH:MM UTC
  city: string;
  country: 'USA' | 'Canada' | 'Mexico';
  score1?: number;
  score2?: number;
  status?: 'completed' | 'live' | 'upcoming';
  extraTime?: boolean;
  penalties?: string; // "5-3" format
}

export const hostCities: City[] = [
  { name: 'Los Ángeles', country: 'USA', timezone: 'America/Los_Angeles', stadium: 'SoFi Stadium' },
  { name: 'Estadio Azteca', country: 'Mexico', timezone: 'America/Mexico_City', stadium: 'Estadio Azteca' },
  { name: 'Miami Gardens', country: 'USA', timezone: 'America/New_York', stadium: 'Hard Rock Stadium' },
  { name: 'Nueva York/NJ', country: 'USA', timezone: 'America/New_York', stadium: 'MetLife Stadium' },
  { name: 'Boston', country: 'USA', timezone: 'America/New_York', stadium: 'Gillette Stadium' },
  { name: 'Filadelfia', country: 'USA', timezone: 'America/New_York', stadium: 'Lincoln Financial Field' },
  { name: 'Atlanta', country: 'USA', timezone: 'America/New_York', stadium: 'Mercedes-Benz Stadium' },
  { name: 'Dallas', country: 'USA', timezone: 'America/Chicago', stadium: 'AT&T Stadium' },
  { name: 'Houston', country: 'USA', timezone: 'America/Chicago', stadium: 'NRG Stadium' },
  { name: 'Kansas City', country: 'USA', timezone: 'America/Chicago', stadium: 'GEHA Field at Arrowhead' },
  { name: 'San Francisco Bay', country: 'USA', timezone: 'America/Los_Angeles', stadium: 'Levi\'s Stadium' },
  { name: 'Toronto', country: 'Canada', timezone: 'America/Toronto', stadium: 'BMO Field' },
  { name: 'Vancouver', country: 'Canada', timezone: 'America/Vancouver', stadium: 'BC Place' },
  { name: 'Guadalajara', country: 'Mexico', timezone: 'America/Mexico_City', stadium: 'Estadio Akron' },
  { name: 'Monterrey', country: 'Mexico', timezone: 'America/Monterrey', stadium: 'Estadio BBVA' },
];

export const teams: Team[] = [
  // Group A
  { id: 'mex', name: 'México', code: 'MEX', flag: '🇲🇽', group: 'A' },
  { id: 'kor', name: 'Corea del Sur', code: 'KOR', flag: '🇰🇷', group: 'A' },
  { id: 'cze', name: 'Chequia', code: 'CZE', flag: '🇨🇿', group: 'A' },
  { id: 'rsa', name: 'Sudáfrica', code: 'RSA', flag: '🇿🇦', group: 'A' },
  // Group B
  { id: 'sui', name: 'Suiza', code: 'SUI', flag: '🇨🇭', group: 'B' },
  { id: 'can', name: 'Canadá', code: 'CAN', flag: '🇨🇦', group: 'B' },
  { id: 'qat', name: 'Catar', code: 'QAT', flag: '🇶🇦', group: 'B' },
  { id: 'bih', name: 'Bosnia y Herzegovina', code: 'BIH', flag: '🇧🇦', group: 'B' },
  // Group C
  { id: 'sco', name: 'Escocia', code: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'C' },
  { id: 'mar', name: 'Marruecos', code: 'MAR', flag: '🇲🇦', group: 'C' },
  { id: 'bra', name: 'Brasil', code: 'BRA', flag: '🇧🇷', group: 'C' },
  { id: 'hai', name: 'Haití', code: 'HAI', flag: '🇭🇹', group: 'C' },
  // Group D
  { id: 'usa', name: 'Estados Unidos', code: 'USA', flag: '🇺🇸', group: 'D' },
  { id: 'aus', name: 'Australia', code: 'AUS', flag: '🇦🇺', group: 'D' },
  { id: 'tur', name: 'Turquía', code: 'TUR', flag: '🇹🇷', group: 'D' },
  { id: 'par', name: 'Paraguay', code: 'PAR', flag: '🇵🇾', group: 'D' },
  // Group E
  { id: 'ger', name: 'Alemania', code: 'GER', flag: '🇩🇪', group: 'E' },
  { id: 'civ', name: 'Costa de Marfil', code: 'CIV', flag: '🇨🇮', group: 'E' },
  { id: 'ecu', name: 'Ecuador', code: 'ECU', flag: '🇪🇨', group: 'E' },
  { id: 'cuw', name: 'Curazao', code: 'CUW', flag: '🇨🇼', group: 'E' },
  // Group F
  { id: 'swe', name: 'Suecia', code: 'SWE', flag: '🇸🇪', group: 'F' },
  { id: 'jpn', name: 'Japón', code: 'JPN', flag: '🇯🇵', group: 'F' },
  { id: 'ned', name: 'Países Bajos', code: 'NED', flag: '🇳🇱', group: 'F' },
  { id: 'tun', name: 'Túnez', code: 'TUN', flag: '🇹🇳', group: 'F' },
  // Group G
  { id: 'egy', name: 'Egipto', code: 'EGY', flag: '🇪🇬', group: 'G' },
  { id: 'bel', name: 'Bélgica', code: 'BEL', flag: '🇧🇪', group: 'G' },
  { id: 'irn', name: 'Irán', code: 'IRN', flag: '🇮🇷', group: 'G' },
  { id: 'nzl', name: 'Nueva Zelanda', code: 'NZL', flag: '🇳🇿', group: 'G' },
  // Group H
  { id: 'cpv', name: 'Cabo Verde', code: 'CPV', flag: '🇨🇻', group: 'H' },
  { id: 'ksa', name: 'Arabia Saudí', code: 'KSA', flag: '🇸🇦', group: 'H' },
  { id: 'esp', name: 'España', code: 'ESP', flag: '🇪🇸', group: 'H' },
  { id: 'ury', name: 'Uruguay', code: 'URY', flag: '🇺🇾', group: 'H' },
  // Group I
  { id: 'fra', name: 'Francia', code: 'FRA', flag: '🇫🇷', group: 'I' },
  { id: 'irq', name: 'Irak', code: 'IRQ', flag: '🇮🇶', group: 'I' },
  { id: 'nor', name: 'Noruega', code: 'NOR', flag: '🇳🇴', group: 'I' },
  { id: 'sen', name: 'Senegal', code: 'SEN', flag: '🇸🇳', group: 'I' },
  // Group J
  { id: 'alg', name: 'Argelia', code: 'ALG', flag: '🇩🇿', group: 'J' },
  { id: 'arg', name: 'Argentina', code: 'ARG', flag: '🇦🇷', group: 'J' },
  { id: 'jor', name: 'Jordania', code: 'JOR', flag: '🇯🇴', group: 'J' },
  { id: 'aut', name: 'Austria', code: 'AUT', flag: '🇦🇹', group: 'J' },
  // Group K
  { id: 'cod', name: 'RD del Congo', code: 'COD', flag: '🇨🇩', group: 'K' },
  { id: 'col', name: 'Colombia', code: 'COL', flag: '🇨🇴', group: 'K' },
  { id: 'por', name: 'Portugal', code: 'POR', flag: '🇵🇹', group: 'K' },
  { id: 'uzb', name: 'Uzbekistán', code: 'UZB', flag: '🇺🇿', group: 'K' },
  // Group L
  { id: 'eng', name: 'Inglaterra', code: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'L' },
  { id: 'gha', name: 'Ghana', code: 'GHA', flag: '🇬🇭', group: 'L' },
  { id: 'cro', name: 'Croacia', code: 'CRO', flag: '🇭🇷', group: 'L' },
  { id: 'pan', name: 'Panamá', code: 'PAN', flag: '🇵🇦', group: 'L' },
];

// Mapping for API TLA codes that differ from our team IDs
const OLD_ID_MAP: Record<string, string> = {
  'new': 'nzl',  // New Zealand
  'ira': 'irn',  // Iran
  'ara': 'ksa',  // Saudi Arabia
  'uru': 'ury',  // Uruguay (API may use URU instead of URY)
};

export function getTeam(id: string): Team {
  // 1. Direct lookup by id
  const byId = teams.find(t => t.id === id);
  if (byId) return byId;

  // 2. Lookup by code (uppercase)
  const upperId = id.toUpperCase();
  const byCode = teams.find(t => t.code === upperId);
  if (byCode) return byCode;

  // 3. Try mapping old IDs
  const mappedId = OLD_ID_MAP[id];
  if (mappedId) {
    const mapped = teams.find(t => t.id === mappedId);
    if (mapped) return mapped;
  }

  // 4. Try matching by lowercase id against team codes
  const lowerId = id.toLowerCase();
  const byLowerCode = teams.find(t => t.code.toLowerCase() === lowerId);
  if (byLowerCode) return byLowerCode;

  // 5. Fallback
  return { id, name: id.toUpperCase(), code: id.toUpperCase(), flag: '🏳️', group: '?' };
}

// All 104 matches of the tournament (fallback when API unavailable)
// Status is dynamically calculated based on current date/time
function calcMatchStatus(date: string, time: string): 'completed' | 'upcoming' {
  const matchEnd = new Date(`${date}T${time}:00Z`);
  matchEnd.setHours(matchEnd.getHours() + 2); // 2h match duration
  return matchEnd < new Date() ? 'completed' : 'upcoming';
}

const _matches: Match[] = [
  // ===== GROUP STAGE =====
  // Group A
  { id: 1, round: 'Fase de Grupos', group: 'A', team1: 'mex', team2: 'rsa', date: '2026-06-11', time: '19:00', city: 'Estadio Azteca', country: 'Mexico', status: 'completed', score1: 2, score2: 0 },
  { id: 2, round: 'Fase de Grupos', group: 'A', team1: 'kor', team2: 'cze', date: '2026-06-12', time: '02:00', city: 'Guadalajara', country: 'Mexico', status: 'completed', score1: 2, score2: 1 },
  { id: 25, round: 'Fase de Grupos', group: 'A', team1: 'cze', team2: 'rsa', date: '2026-06-18', time: '16:00', city: 'Monterrey', country: 'Mexico', status: 'upcoming' },
  { id: 28, round: 'Fase de Grupos', group: 'A', team1: 'mex', team2: 'kor', date: '2026-06-19', time: '01:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
  { id: 53, round: 'Fase de Grupos', group: 'A', team1: 'cze', team2: 'mex', date: '2026-06-25', time: '01:00', city: 'Monterrey', country: 'Mexico', status: 'upcoming' },
  { id: 54, round: 'Fase de Grupos', group: 'A', team1: 'rsa', team2: 'kor', date: '2026-06-25', time: '01:00', city: 'Guadalajara', country: 'Mexico', status: 'upcoming' },
  // Group B
  { id: 3, round: 'Fase de Grupos', group: 'B', team1: 'can', team2: 'bih', date: '2026-06-12', time: '19:00', city: 'Los Ángeles', country: 'USA', status: 'completed', score1: 1, score2: 1 },
  { id: 5, round: 'Fase de Grupos', group: 'B', team1: 'qat', team2: 'sui', date: '2026-06-13', time: '19:00', city: 'San Francisco Bay', country: 'USA', status: 'completed', score1: 1, score2: 1 },
  { id: 26, round: 'Fase de Grupos', group: 'B', team1: 'sui', team2: 'bih', date: '2026-06-18', time: '19:00', city: 'Houston', country: 'USA', status: 'upcoming' },
  { id: 27, round: 'Fase de Grupos', group: 'B', team1: 'can', team2: 'qat', date: '2026-06-18', time: '22:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 49, round: 'Fase de Grupos', group: 'B', team1: 'sui', team2: 'can', date: '2026-06-24', time: '19:00', city: 'San Francisco Bay', country: 'USA', status: 'upcoming' },
  { id: 50, round: 'Fase de Grupos', group: 'B', team1: 'bih', team2: 'qat', date: '2026-06-24', time: '19:00', city: 'Houston', country: 'USA', status: 'upcoming' },
  // Group C
  { id: 6, round: 'Fase de Grupos', group: 'C', team1: 'bra', team2: 'mar', date: '2026-06-13', time: '22:00', city: 'Toronto', country: 'Canada', status: 'completed', score1: 1, score2: 1 },
  { id: 7, round: 'Fase de Grupos', group: 'C', team1: 'hai', team2: 'sco', date: '2026-06-14', time: '01:00', city: 'Vancouver', country: 'Canada', status: 'completed', score1: 0, score2: 1 },
  { id: 30, round: 'Fase de Grupos', group: 'C', team1: 'sco', team2: 'mar', date: '2026-06-19', time: '22:00', city: 'Nueva York/NJ', country: 'USA', status: 'upcoming' },
  { id: 31, round: 'Fase de Grupos', group: 'C', team1: 'bra', team2: 'hai', date: '2026-06-20', time: '00:30', city: 'Toronto', country: 'Canada', status: 'upcoming' },
  { id: 51, round: 'Fase de Grupos', group: 'C', team1: 'mar', team2: 'hai', date: '2026-06-24', time: '22:00', city: 'Vancouver', country: 'Canada', status: 'upcoming' },
  { id: 52, round: 'Fase de Grupos', group: 'C', team1: 'sco', team2: 'bra', date: '2026-06-24', time: '22:00', city: 'Toronto', country: 'Canada', status: 'upcoming' },
  // Group D
  { id: 4, round: 'Fase de Grupos', group: 'D', team1: 'usa', team2: 'par', date: '2026-06-13', time: '01:00', city: 'Estadio Azteca', country: 'Mexico', status: 'completed', score1: 4, score2: 1 },
  { id: 8, round: 'Fase de Grupos', group: 'D', team1: 'aus', team2: 'tur', date: '2026-06-14', time: '04:00', city: 'Dallas', country: 'USA', status: 'completed', score1: 2, score2: 0 },
  { id: 29, round: 'Fase de Grupos', group: 'D', team1: 'usa', team2: 'aus', date: '2026-06-19', time: '19:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
  { id: 32, round: 'Fase de Grupos', group: 'D', team1: 'tur', team2: 'par', date: '2026-06-20', time: '03:00', city: 'Miami Gardens', country: 'USA', status: 'upcoming' },
  { id: 59, round: 'Fase de Grupos', group: 'D', team1: 'tur', team2: 'usa', date: '2026-06-26', time: '02:00', city: 'Dallas', country: 'USA', status: 'upcoming' },
  { id: 60, round: 'Fase de Grupos', group: 'D', team1: 'par', team2: 'aus', date: '2026-06-26', time: '02:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
  // Group E
  { id: 9, round: 'Fase de Grupos', group: 'E', team1: 'ger', team2: 'cuw', date: '2026-06-14', time: '17:00', city: 'Guadalajara', country: 'Mexico', status: 'completed', score1: 7, score2: 1 },
  { id: 11, round: 'Fase de Grupos', group: 'E', team1: 'civ', team2: 'ecu', date: '2026-06-14', time: '23:00', city: 'Filadelfia', country: 'USA', status: 'completed', score1: 1, score2: 0 },
  { id: 34, round: 'Fase de Grupos', group: 'E', team1: 'ger', team2: 'civ', date: '2026-06-20', time: '20:00', city: 'Boston', country: 'USA', status: 'upcoming' },
  { id: 35, round: 'Fase de Grupos', group: 'E', team1: 'ecu', team2: 'cuw', date: '2026-06-21', time: '00:00', city: 'Filadelfia', country: 'USA', status: 'upcoming' },
  { id: 55, round: 'Fase de Grupos', group: 'E', team1: 'ecu', team2: 'ger', date: '2026-06-25', time: '20:00', city: 'Guadalajara', country: 'Mexico', status: 'upcoming' },
  { id: 56, round: 'Fase de Grupos', group: 'E', team1: 'cuw', team2: 'civ', date: '2026-06-25', time: '20:00', city: 'Boston', country: 'USA', status: 'upcoming' },
  // Group F
  { id: 10, round: 'Fase de Grupos', group: 'F', team1: 'ned', team2: 'jpn', date: '2026-06-14', time: '20:00', city: 'San Francisco Bay', country: 'USA', status: 'completed', score1: 2, score2: 2 },
  { id: 12, round: 'Fase de Grupos', group: 'F', team1: 'swe', team2: 'tun', date: '2026-06-15', time: '02:00', city: 'Atlanta', country: 'USA', status: 'completed', score1: 5, score2: 1 },
  { id: 33, round: 'Fase de Grupos', group: 'F', team1: 'ned', team2: 'swe', date: '2026-06-20', time: '17:00', city: 'San Francisco Bay', country: 'USA', status: 'upcoming' },
  { id: 36, round: 'Fase de Grupos', group: 'F', team1: 'tun', team2: 'jpn', date: '2026-06-21', time: '04:00', city: 'Nueva York/NJ', country: 'USA', status: 'upcoming' },
  { id: 57, round: 'Fase de Grupos', group: 'F', team1: 'tun', team2: 'ned', date: '2026-06-25', time: '23:00', city: 'Atlanta', country: 'USA', status: 'upcoming' },
  { id: 58, round: 'Fase de Grupos', group: 'F', team1: 'jpn', team2: 'swe', date: '2026-06-25', time: '23:00', city: 'San Francisco Bay', country: 'USA', status: 'upcoming' },
  // Group G
  { id: 14, round: 'Fase de Grupos', group: 'G', team1: 'bel', team2: 'egy', date: '2026-06-15', time: '19:00', city: 'Monterrey', country: 'Mexico', status: 'upcoming' },
  { id: 16, round: 'Fase de Grupos', group: 'G', team1: 'irn', team2: 'nzl', date: '2026-06-16', time: '01:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 38, round: 'Fase de Grupos', group: 'G', team1: 'bel', team2: 'irn', date: '2026-06-21', time: '19:00', city: 'Miami Gardens', country: 'USA', status: 'upcoming' },
  { id: 40, round: 'Fase de Grupos', group: 'G', team1: 'nzl', team2: 'egy', date: '2026-06-22', time: '01:00', city: 'Monterrey', country: 'Mexico', status: 'upcoming' },
  { id: 65, round: 'Fase de Grupos', group: 'G', team1: 'nzl', team2: 'bel', date: '2026-06-27', time: '03:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 66, round: 'Fase de Grupos', group: 'G', team1: 'egy', team2: 'irn', date: '2026-06-27', time: '03:00', city: 'Miami Gardens', country: 'USA', status: 'upcoming' },
  // Group H
  { id: 13, round: 'Fase de Grupos', group: 'H', team1: 'esp', team2: 'cpv', date: '2026-06-15', time: '16:00', city: 'Vancouver', country: 'Canada', status: 'upcoming' },
  { id: 15, round: 'Fase de Grupos', group: 'H', team1: 'ksa', team2: 'ury', date: '2026-06-15', time: '22:00', city: 'Nueva York/NJ', country: 'USA', status: 'upcoming' },
  { id: 37, round: 'Fase de Grupos', group: 'H', team1: 'esp', team2: 'ksa', date: '2026-06-21', time: '16:00', city: 'Vancouver', country: 'Canada', status: 'upcoming' },
  { id: 39, round: 'Fase de Grupos', group: 'H', team1: 'ury', team2: 'cpv', date: '2026-06-21', time: '22:00', city: 'Houston', country: 'USA', status: 'upcoming' },
  { id: 63, round: 'Fase de Grupos', group: 'H', team1: 'ury', team2: 'esp', date: '2026-06-27', time: '00:00', city: 'Nueva York/NJ', country: 'USA', status: 'upcoming' },
  { id: 64, round: 'Fase de Grupos', group: 'H', team1: 'cpv', team2: 'ksa', date: '2026-06-27', time: '00:00', city: 'Vancouver', country: 'Canada', status: 'upcoming' },
  // Group I
  { id: 17, round: 'Fase de Grupos', group: 'I', team1: 'fra', team2: 'sen', date: '2026-06-16', time: '19:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
  { id: 18, round: 'Fase de Grupos', group: 'I', team1: 'irq', team2: 'nor', date: '2026-06-16', time: '22:00', city: 'San Francisco Bay', country: 'USA', status: 'upcoming' },
  { id: 42, round: 'Fase de Grupos', group: 'I', team1: 'fra', team2: 'irq', date: '2026-06-22', time: '21:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
  { id: 43, round: 'Fase de Grupos', group: 'I', team1: 'nor', team2: 'sen', date: '2026-06-23', time: '00:00', city: 'Filadelfia', country: 'USA', status: 'upcoming' },
  { id: 61, round: 'Fase de Grupos', group: 'I', team1: 'nor', team2: 'fra', date: '2026-06-26', time: '19:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
  { id: 62, round: 'Fase de Grupos', group: 'I', team1: 'sen', team2: 'irq', date: '2026-06-26', time: '19:00', city: 'San Francisco Bay', country: 'USA', status: 'upcoming' },
  // Group J
  { id: 19, round: 'Fase de Grupos', group: 'J', team1: 'arg', team2: 'alg', date: '2026-06-17', time: '01:00', city: 'Atlanta', country: 'USA', status: 'upcoming' },
  { id: 20, round: 'Fase de Grupos', group: 'J', team1: 'aut', team2: 'jor', date: '2026-06-17', time: '04:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 41, round: 'Fase de Grupos', group: 'J', team1: 'arg', team2: 'aut', date: '2026-06-22', time: '17:00', city: 'Dallas', country: 'USA', status: 'upcoming' },
  { id: 44, round: 'Fase de Grupos', group: 'J', team1: 'jor', team2: 'alg', date: '2026-06-23', time: '03:00', city: 'Atlanta', country: 'USA', status: 'upcoming' },
  { id: 71, round: 'Fase de Grupos', group: 'J', team1: 'jor', team2: 'arg', date: '2026-06-28', time: '02:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 72, round: 'Fase de Grupos', group: 'J', team1: 'alg', team2: 'aut', date: '2026-06-28', time: '02:00', city: 'Dallas', country: 'USA', status: 'upcoming' },
  // Group K
  { id: 21, round: 'Fase de Grupos', group: 'K', team1: 'por', team2: 'cod', date: '2026-06-17', time: '17:00', city: 'Monterrey', country: 'Mexico', status: 'upcoming' },
  { id: 24, round: 'Fase de Grupos', group: 'K', team1: 'uzb', team2: 'col', date: '2026-06-18', time: '02:00', city: 'Miami Gardens', country: 'USA', status: 'upcoming' },
  { id: 45, round: 'Fase de Grupos', group: 'K', team1: 'por', team2: 'uzb', date: '2026-06-23', time: '17:00', city: 'Kansas City', country: 'USA', status: 'upcoming' },
  { id: 48, round: 'Fase de Grupos', group: 'K', team1: 'col', team2: 'cod', date: '2026-06-24', time: '02:00', city: 'Monterrey', country: 'Mexico', status: 'upcoming' },
  { id: 69, round: 'Fase de Grupos', group: 'K', team1: 'col', team2: 'por', date: '2026-06-27', time: '23:30', city: 'Miami Gardens', country: 'USA', status: 'upcoming' },
  { id: 70, round: 'Fase de Grupos', group: 'K', team1: 'cod', team2: 'uzb', date: '2026-06-27', time: '23:30', city: 'Kansas City', country: 'USA', status: 'upcoming' },
  // Group L
  { id: 22, round: 'Fase de Grupos', group: 'L', team1: 'eng', team2: 'cro', date: '2026-06-17', time: '20:00', city: 'Vancouver', country: 'Canada', status: 'upcoming' },
  { id: 23, round: 'Fase de Grupos', group: 'L', team1: 'gha', team2: 'pan', date: '2026-06-17', time: '23:00', city: 'Toronto', country: 'Canada', status: 'upcoming' },
  { id: 46, round: 'Fase de Grupos', group: 'L', team1: 'eng', team2: 'gha', date: '2026-06-23', time: '20:00', city: 'Vancouver', country: 'Canada', status: 'upcoming' },
  { id: 47, round: 'Fase de Grupos', group: 'L', team1: 'pan', team2: 'cro', date: '2026-06-23', time: '23:00', city: 'Toronto', country: 'Canada', status: 'upcoming' },
  { id: 67, round: 'Fase de Grupos', group: 'L', team1: 'pan', team2: 'eng', date: '2026-06-27', time: '21:00', city: 'Toronto', country: 'Canada', status: 'upcoming' },
  { id: 68, round: 'Fase de Grupos', group: 'L', team1: 'cro', team2: 'gha', date: '2026-06-27', time: '21:00', city: 'Vancouver', country: 'Canada', status: 'upcoming' },

  // ===== ROUND OF 32 (Dieciseisavos) =====
  { id: 73, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-06-28', time: '19:00', city: 'Atlanta', country: 'USA', status: 'upcoming' },
  { id: 74, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-06-29', time: '17:00', city: 'Dallas', country: 'USA', status: 'upcoming' },
  { id: 75, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-06-29', time: '20:30', city: 'Houston', country: 'USA', status: 'upcoming' },
  { id: 76, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-06-30', time: '01:00', city: 'Miami Gardens', country: 'USA', status: 'upcoming' },
  { id: 77, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-06-30', time: '17:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 78, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-06-30', time: '21:00', city: 'Nueva York/NJ', country: 'USA', status: 'upcoming' },
  { id: 79, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-07-01', time: '01:00', city: 'Filadelfia', country: 'USA', status: 'upcoming' },
  { id: 80, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-07-01', time: '16:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
  { id: 81, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-07-01', time: '20:00', city: 'Kansas City', country: 'USA', status: 'upcoming' },
  { id: 82, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-07-02', time: '00:00', city: 'San Francisco Bay', country: 'USA', status: 'upcoming' },
  { id: 83, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-07-02', time: '19:00', city: 'Boston', country: 'USA', status: 'upcoming' },
  { id: 84, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-07-02', time: '23:00', city: 'Toronto', country: 'Canada', status: 'upcoming' },
  { id: 85, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-07-03', time: '03:00', city: 'Guadalajara', country: 'Mexico', status: 'upcoming' },
  { id: 86, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-07-03', time: '18:00', city: 'Monterrey', country: 'Mexico', status: 'upcoming' },
  { id: 87, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-07-03', time: '22:00', city: 'Vancouver', country: 'Canada', status: 'upcoming' },
  { id: 88, round: 'Dieciseisavos', team1: 'tbd', team2: 'tbd', date: '2026-07-04', time: '01:30', city: 'Atlanta', country: 'USA', status: 'upcoming' },

  // ===== ROUND OF 16 (Octavos) =====
  { id: 89, round: 'Octavos', team1: 'tbd', team2: 'tbd', date: '2026-07-04', time: '17:00', city: 'Atlanta', country: 'USA', status: 'upcoming' },
  { id: 90, round: 'Octavos', team1: 'tbd', team2: 'tbd', date: '2026-07-04', time: '21:00', city: 'Nueva York/NJ', country: 'USA', status: 'upcoming' },
  { id: 91, round: 'Octavos', team1: 'tbd', team2: 'tbd', date: '2026-07-05', time: '20:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 92, round: 'Octavos', team1: 'tbd', team2: 'tbd', date: '2026-07-06', time: '00:00', city: 'Houston', country: 'USA', status: 'upcoming' },
  { id: 93, round: 'Octavos', team1: 'tbd', team2: 'tbd', date: '2026-07-06', time: '19:00', city: 'Dallas', country: 'USA', status: 'upcoming' },
  { id: 94, round: 'Octavos', team1: 'tbd', team2: 'tbd', date: '2026-07-07', time: '00:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
  { id: 95, round: 'Octavos', team1: 'tbd', team2: 'tbd', date: '2026-07-07', time: '16:00', city: 'Filadelfia', country: 'USA', status: 'upcoming' },
  { id: 96, round: 'Octavos', team1: 'tbd', team2: 'tbd', date: '2026-07-07', time: '20:00', city: 'Kansas City', country: 'USA', status: 'upcoming' },

  // ===== QUARTERFINALS (Cuartos) =====
  { id: 97, round: 'Cuartos', team1: 'tbd', team2: 'tbd', date: '2026-07-09', time: '20:00', city: 'Nueva York/NJ', country: 'USA', status: 'upcoming' },
  { id: 98, round: 'Cuartos', team1: 'tbd', team2: 'tbd', date: '2026-07-10', time: '19:00', city: 'Atlanta', country: 'USA', status: 'upcoming' },
  { id: 99, round: 'Cuartos', team1: 'tbd', team2: 'tbd', date: '2026-07-11', time: '21:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 100, round: 'Cuartos', team1: 'tbd', team2: 'tbd', date: '2026-07-12', time: '01:00', city: 'Dallas', country: 'USA', status: 'upcoming' },

  // ===== SEMIFINALS (Semifinales) =====
  { id: 101, round: 'Semifinales', team1: 'tbd', team2: 'tbd', date: '2026-07-14', time: '19:00', city: 'Miami Gardens', country: 'USA', status: 'upcoming' },
  { id: 102, round: 'Semifinales', team1: 'tbd', team2: 'tbd', date: '2026-07-15', time: '19:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },

  // ===== THIRD PLACE (Tercer Lugar) =====
  { id: 103, round: 'Tercer Lugar', team1: 'tbd', team2: 'tbd', date: '2026-07-18', time: '21:00', city: 'Boston', country: 'USA', status: 'upcoming' },

  // ===== FINAL =====
  { id: 104, round: 'Final', team1: 'tbd', team2: 'tbd', date: '2026-07-19', time: '19:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
];

// Dynamically recalculate status based on current date/time
// This ensures old completed matches don't show as 'upcoming' in the static fallback
export const matches: Match[] = _matches.map(m => ({
  ...m,
  status: m.score1 !== undefined && m.status === 'completed'
    ? 'completed' as const
    : calcMatchStatus(m.date, m.time),
}));

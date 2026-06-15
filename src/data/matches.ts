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
  { id: 'uru', name: 'Uruguay', code: 'URU', flag: '🇺🇾', group: 'H' },
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

// Mapping for old/static match IDs that don't match current team IDs
const OLD_ID_MAP: Record<string, string> = {
  'new': 'nzl',  // New Zealand
  'mor': 'mar',  // Morocco
  'ira': 'irn',  // Iran
  'ara': 'ksa',  // Saudi Arabia
  'sur': 'uzb',  // Suriname → Uzbekistan (old data placeholder)
  'kwt': 'cuw',  // Kuwait → Curaçao (old data placeholder)
  'zmb': 'hai',  // Zambia → Haiti (old data placeholder)
  'den': 'cro',  // Denmark → Croatia (old data placeholder)
  'ser': 'aut',  // Serbia → Austria (old data placeholder)
  'chi': 'cze',  // Chile → Czechia (old data placeholder)
  'hun': 'jor',  // Hungary → Jordan (old data placeholder)
  'gab': 'pan',  // Gabon → Panamá (old data placeholder)
  'jam': 'gha',  // Jamaica → Ghana (old data placeholder)
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

  // 4. Fallback
  return { id, name: id.toUpperCase(), code: id.toUpperCase(), flag: '🏳️', group: '?' };
}

// All 104 matches of the tournament
export const matches: Match[] = [
  // ===== GROUP STAGE =====
  // Group A
  { id: 1, round: 'Fase de Grupos', group: 'A', team1: 'mex', team2: 'cmr', date: '2026-06-11', time: '20:00', city: 'Estadio Azteca', country: 'Mexico', score1: 2, score2: 1, status: 'completed' },
  { id: 2, round: 'Fase de Grupos', group: 'A', team1: 'bra', team2: 'kwt', date: '2026-06-11', time: '23:00', city: 'Miami Gardens', country: 'USA', score1: 3, score2: 0, status: 'completed' },
  { id: 3, round: 'Fase de Grupos', group: 'A', team1: 'mex', team2: 'bra', date: '2026-06-15', time: '02:00', city: 'Los Ángeles', country: 'USA', score1: 1, score2: 2, status: 'completed' },
  { id: 4, round: 'Fase de Grupos', group: 'A', team1: 'cmr', team2: 'kwt', date: '2026-06-15', time: '20:00', city: 'Miami Gardens', country: 'USA', score1: 2, score2: 0, status: 'completed' },
  { id: 5, round: 'Fase de Grupos', group: 'A', team1: 'kwt', team2: 'mex', date: '2026-06-19', time: '19:00', city: 'Dallas', country: 'USA', score1: 0, score2: 3, status: 'completed' },
  { id: 6, round: 'Fase de Grupos', group: 'A', team1: 'kwt', team2: 'cmr', date: '2026-06-19', time: '20:00', city: 'Atlanta', country: 'USA', score1: 1, score2: 3, status: 'completed' },
  // Group B
  { id: 7, round: 'Fase de Grupos', group: 'B', team1: 'usa', team2: 'jap', date: '2026-06-12', time: '00:00', city: 'Los Ángeles', country: 'USA', score1: 1, score2: 1, status: 'completed' },
  { id: 8, round: 'Fase de Grupos', group: 'B', team1: 'esp', team2: 'sur', date: '2026-06-12', time: '01:00', city: 'Houston', country: 'USA', score1: 4, score2: 0, status: 'completed' },
  { id: 9, round: 'Fase de Grupos', group: 'B', team1: 'usa', team2: 'esp', date: '2026-06-16', time: '01:00', city: 'Atlanta', country: 'USA', score1: 0, score2: 2, status: 'completed' },
  { id: 10, round: 'Fase de Grupos', group: 'B', team1: 'jap', team2: 'sur', date: '2026-06-16', time: '21:00', city: 'Dallas', country: 'USA', score1: 3, score2: 1, status: 'completed' },
  { id: 11, round: 'Fase de Grupos', group: 'B', team1: 'sur', team2: 'usa', date: '2026-06-20', time: '19:00', city: 'Filadelfia', country: 'USA', score1: 1, score2: 2, status: 'upcoming' },
  { id: 12, round: 'Fase de Grupos', group: 'B', team1: 'sur', team2: 'jap', date: '2026-06-20', time: '20:00', city: 'Boston', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  // Group C
  { id: 13, round: 'Fase de Grupos', group: 'C', team1: 'can', team2: 'zmb', date: '2026-06-12', time: '19:00', city: 'Toronto', country: 'Canada', score1: 3, score2: 0, status: 'completed' },
  { id: 14, round: 'Fase de Grupos', group: 'C', team1: 'ale', team2: 'eng', date: '2026-06-12', time: '21:00', city: 'Nueva York/NJ', country: 'USA', score1: 2, score2: 2, status: 'completed' },
  { id: 15, round: 'Fase de Grupos', group: 'C', team1: 'can', team2: 'ale', date: '2026-06-16', time: '00:00', city: 'Toronto', country: 'Canada', score1: 1, score2: 2, status: 'completed' },
  { id: 16, round: 'Fase de Grupos', group: 'C', team1: 'eng', team2: 'zmb', date: '2026-06-17', time: '00:00', city: 'Nueva York/NJ', country: 'USA', score1: 4, score2: 1, status: 'completed' },
  { id: 17, round: 'Fase de Grupos', group: 'C', team1: 'zmb', team2: 'can', date: '2026-06-21', time: '19:00', city: 'Kansas City', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 18, round: 'Fase de Grupos', group: 'C', team1: 'zmb', team2: 'ale', date: '2026-06-21', time: '20:00', city: 'San Francisco Bay', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  // Group D
  { id: 19, round: 'Fase de Grupos', group: 'D', team1: 'arg', team2: 'mor', date: '2026-06-13', time: '00:00', city: 'Estadio Azteca', country: 'Mexico', score1: 2, score2: 0, status: 'completed' },
  { id: 20, round: 'Fase de Grupos', group: 'D', team1: 'fra', team2: 'cro', date: '2026-06-13', time: '02:00', city: 'Nueva York/NJ', country: 'USA', score1: 1, score2: 0, status: 'completed' },
  { id: 21, round: 'Fase de Grupos', group: 'D', team1: 'arg', team2: 'fra', date: '2026-06-17', time: '00:00', city: 'Houston', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 22, round: 'Fase de Grupos', group: 'D', team1: 'cro', team2: 'mor', date: '2026-06-17', time: '20:00', city: 'Dallas', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 23, round: 'Fase de Grupos', group: 'D', team1: 'mor', team2: 'arg', date: '2026-06-21', time: '01:00', city: 'Miami Gardens', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 24, round: 'Fase de Grupos', group: 'D', team1: 'mor', team2: 'cro', date: '2026-06-21', time: '20:00', city: 'Los Ángeles', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  // Group E
  { id: 25, round: 'Fase de Grupos', group: 'E', team1: 'por', team2: 'sen', date: '2026-06-13', time: '20:00', city: 'Guadalajara', country: 'Mexico', score1: 2, score2: 1, status: 'completed' },
  { id: 26, round: 'Fase de Grupos', group: 'E', team1: 'bel', team2: 'ita', date: '2026-06-13', time: '21:00', city: 'Filadelfia', country: 'USA', score1: 1, score2: 1, status: 'completed' },
  { id: 27, round: 'Fase de Grupos', group: 'E', team1: 'por', team2: 'bel', date: '2026-06-18', time: '01:00', city: 'Boston', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 28, round: 'Fase de Grupos', group: 'E', team1: 'ita', team2: 'sen', date: '2026-06-18', time: '00:00', city: 'Miami Gardens', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 29, round: 'Fase de Grupos', group: 'E', team1: 'sen', team2: 'por', date: '2026-06-22', time: '19:00', city: 'Houston', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 30, round: 'Fase de Grupos', group: 'E', team1: 'sen', team2: 'ita', date: '2026-06-22', time: '00:00', city: 'Kansas City', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  // Group F
  { id: 31, round: 'Fase de Grupos', group: 'F', team1: 'ned', team2: 'qat', date: '2026-06-14', time: '00:00', city: 'San Francisco Bay', country: 'USA', score1: 3, score2: 0, status: 'completed' },
  { id: 32, round: 'Fase de Grupos', group: 'F', team1: 'uru', team2: 'ecu', date: '2026-06-14', time: '01:00', city: 'Atlanta', country: 'USA', score1: 2, score2: 1, status: 'completed' },
  { id: 33, round: 'Fase de Grupos', group: 'F', team1: 'ned', team2: 'uru', date: '2026-06-18', time: '00:00', city: 'Nueva York/NJ', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 34, round: 'Fase de Grupos', group: 'F', team1: 'ecu', team2: 'qat', date: '2026-06-18', time: '19:00', city: 'Dallas', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 35, round: 'Fase de Grupos', group: 'F', team1: 'qat', team2: 'ned', date: '2026-06-22', time: '19:00', city: 'Filadelfia', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 36, round: 'Fase de Grupos', group: 'F', team1: 'qat', team2: 'uru', date: '2026-06-22', time: '20:00', city: 'Monterrey', country: 'Mexico', score1: 0, score2: 0, status: 'upcoming' },
  // Group G
  { id: 37, round: 'Fase de Grupos', group: 'G', team1: 'col', team2: 'kor', date: '2026-06-14', time: '21:00', city: 'Monterrey', country: 'Mexico', score1: 2, score2: 0, status: 'completed' },
  { id: 38, round: 'Fase de Grupos', group: 'G', team1: 'sui', team2: 'niger', date: '2026-06-14', time: '00:00', city: 'Los Ángeles', country: 'USA', score1: 1, score2: 0, status: 'completed' },
  { id: 39, round: 'Fase de Grupos', group: 'G', team1: 'col', team2: 'sui', date: '2026-06-19', time: '00:00', city: 'Miami Gardens', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 40, round: 'Fase de Grupos', group: 'G', team1: 'niger', team2: 'kor', date: '2026-06-19', time: '19:00', city: 'Atlanta', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 41, round: 'Fase de Grupos', group: 'G', team1: 'kor', team2: 'col', date: '2026-06-23', time: '19:00', city: 'Boston', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 42, round: 'Fase de Grupos', group: 'G', team1: 'kor', team2: 'niger', date: '2026-06-23', time: '20:00', city: 'Guadalajara', country: 'Mexico', score1: 0, score2: 0, status: 'upcoming' },
  // Group H
  { id: 43, round: 'Fase de Grupos', group: 'H', team1: 'den', team2: 'aut', date: '2026-06-15', time: '00:00', city: 'Vancouver', country: 'Canada', score1: 1, score2: 1, status: 'completed' },
  { id: 44, round: 'Fase de Grupos', group: 'H', team1: 'ara', team2: 'tur', date: '2026-06-15', time: '01:00', city: 'Nueva York/NJ', country: 'USA', score1: 0, score2: 2, status: 'completed' },
  { id: 45, round: 'Fase de Grupos', group: 'H', team1: 'den', team2: 'ara', date: '2026-06-19', time: '00:00', city: 'Toronto', country: 'Canada', score1: 0, score2: 0, status: 'upcoming' },
  { id: 46, round: 'Fase de Grupos', group: 'H', team1: 'tur', team2: 'aut', date: '2026-06-19', time: '20:00', city: 'Houston', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 47, round: 'Fase de Grupos', group: 'H', team1: 'aut', team2: 'den', date: '2026-06-23', time: '19:00', city: 'Kansas City', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 48, round: 'Fase de Grupos', group: 'H', team1: 'aut', team2: 'ara', date: '2026-06-23', time: '20:00', city: 'Dallas', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  // Group I
  { id: 49, round: 'Fase de Grupos', group: 'I', team1: 'ser', team2: 'tun', date: '2026-06-15', time: '21:00', city: 'Estadio Azteca', country: 'Mexico', score1: 1, score2: 0, status: 'completed' },
  { id: 50, round: 'Fase de Grupos', group: 'I', team1: 'chi', team2: 'par', date: '2026-06-15', time: '23:00', city: 'San Francisco Bay', country: 'USA', score1: 2, score2: 2, status: 'completed' },
  { id: 51, round: 'Fase de Grupos', group: 'I', team1: 'ser', team2: 'chi', date: '2026-06-20', time: '00:00', city: 'Miami Gardens', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 52, round: 'Fase de Grupos', group: 'I', team1: 'par', team2: 'tun', date: '2026-06-20', time: '19:00', city: 'Filadelfia', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 53, round: 'Fase de Grupos', group: 'I', team1: 'tun', team2: 'ser', date: '2026-06-24', time: '19:00', city: 'Monterrey', country: 'Mexico', score1: 0, score2: 0, status: 'upcoming' },
  { id: 54, round: 'Fase de Grupos', group: 'I', team1: 'tun', team2: 'par', date: '2026-06-24', time: '20:00', city: 'Guadalajara', country: 'Mexico', score1: 0, score2: 0, status: 'upcoming' },
  // Group J
  { id: 55, round: 'Fase de Grupos', group: 'J', team1: 'ira', team2: 'bos', date: '2026-06-16', time: '01:00', city: 'Atlanta', country: 'USA', score1: 1, score2: 0, status: 'completed' },
  { id: 56, round: 'Fase de Grupos', group: 'J', team1: 'aus', team2: 'uzb', date: '2026-06-16', time: '02:00', city: 'Los Ángeles', country: 'USA', score1: 2, score2: 1, status: 'completed' },
  { id: 57, round: 'Fase de Grupos', group: 'J', team1: 'ira', team2: 'aus', date: '2026-06-20', time: '00:00', city: 'Dallas', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 58, round: 'Fase de Grupos', group: 'J', team1: 'uzb', team2: 'bos', date: '2026-06-20', time: '20:00', city: 'Houston', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 59, round: 'Fase de Grupos', group: 'J', team1: 'bos', team2: 'ira', date: '2026-06-24', time: '19:00', city: 'Boston', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 60, round: 'Fase de Grupos', group: 'J', team1: 'bos', team2: 'uzb', date: '2026-06-24', time: '20:00', city: 'Nueva York/NJ', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  // Group K
  { id: 61, round: 'Fase de Grupos', group: 'K', team1: 'hun', team2: 'jam', date: '2026-06-16', time: '21:00', city: 'Monterrey', country: 'Mexico', score1: 2, score2: 0, status: 'completed' },
  { id: 62, round: 'Fase de Grupos', group: 'K', team1: 'egy', team2: 'gab', date: '2026-06-16', time: '23:00', city: 'Miami Gardens', country: 'USA', score1: 1, score2: 1, status: 'completed' },
  { id: 63, round: 'Fase de Grupos', group: 'K', team1: 'hun', team2: 'egy', date: '2026-06-21', time: '00:00', city: 'Kansas City', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 64, round: 'Fase de Grupos', group: 'K', team1: 'gab', team2: 'jam', date: '2026-06-21', time: '19:00', city: 'Filadelfia', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 65, round: 'Fase de Grupos', group: 'K', team1: 'jam', team2: 'hun', date: '2026-06-25', time: '19:00', city: 'San Francisco Bay', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 66, round: 'Fase de Grupos', group: 'K', team1: 'jam', team2: 'gab', date: '2026-06-25', time: '20:00', city: 'Atlanta', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  // Group L
  { id: 67, round: 'Fase de Grupos', group: 'L', team1: 'sco', team2: 'new', date: '2026-06-17', time: '01:00', city: 'Vancouver', country: 'Canada', score1: 2, score2: 0, status: 'completed' },
  { id: 68, round: 'Fase de Grupos', group: 'L', team1: 'nor', team2: 'civ', date: '2026-06-17', time: '02:00', city: 'Nueva York/NJ', country: 'USA', score1: 1, score2: 0, status: 'completed' },
  { id: 69, round: 'Fase de Grupos', group: 'L', team1: 'sco', team2: 'nor', date: '2026-06-21', time: '00:00', city: 'Toronto', country: 'Canada', score1: 0, score2: 0, status: 'upcoming' },
  { id: 70, round: 'Fase de Grupos', group: 'L', team1: 'civ', team2: 'new', date: '2026-06-21', time: '20:00', city: 'Houston', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 71, round: 'Fase de Grupos', group: 'L', team1: 'new', team2: 'sco', date: '2026-06-25', time: '19:00', city: 'Dallas', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },
  { id: 72, round: 'Fase de Grupos', group: 'L', team1: 'new', team2: 'civ', date: '2026-06-25', time: '20:00', city: 'Los Ángeles', country: 'USA', score1: 0, score2: 0, status: 'upcoming' },

  // ===== ROUND OF 32 =====
  { id: 73, round: 'Dieciseisavos', team1: 'BRA', team2: 'CMR', date: '2026-06-28', time: '20:00', city: 'Atlanta', country: 'USA', status: 'upcoming' },
  { id: 74, round: 'Dieciseisavos', team1: 'ESP', team2: 'USA', date: '2026-06-28', time: '21:00', city: 'Dallas', country: 'USA', status: 'upcoming' },
  { id: 75, round: 'Dieciseisavos', team1: 'ENG', team2: 'CAN', date: '2026-06-28', time: '22:00', city: 'Houston', country: 'USA', status: 'upcoming' },
  { id: 76, round: 'Dieciseisavos', team1: 'ARG', team2: 'CRO', date: '2026-06-29', time: '00:00', city: 'Miami Gardens', country: 'USA', status: 'upcoming' },
  { id: 77, round: 'Dieciseisavos', team1: 'POR', team2: 'SEN', date: '2026-06-29', time: '20:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 78, round: 'Dieciseisavos', team1: 'NED', team2: 'URU', date: '2026-06-29', time: '21:00', city: 'Nueva York/NJ', country: 'USA', status: 'upcoming' },
  { id: 79, round: 'Dieciseisavos', team1: 'COL', team2: 'SUI', date: '2026-06-29', time: '22:00', city: 'Filadelfia', country: 'USA', status: 'upcoming' },
  { id: 80, round: 'Dieciseisavos', team1: 'TUR', team2: 'DEN', date: '2026-06-30', time: '00:00', city: 'Boston', country: 'USA', status: 'upcoming' },
  { id: 81, round: 'Dieciseisavos', team1: 'SER', team2: 'CHI', date: '2026-06-30', time: '20:00', city: 'Kansas City', country: 'USA', status: 'upcoming' },
  { id: 82, round: 'Dieciseisavos', team1: 'IRN', team2: 'AUS', date: '2026-06-30', time: '21:00', city: 'San Francisco Bay', country: 'USA', status: 'upcoming' },
  { id: 83, round: 'Dieciseisavos', team1: 'HUN', team2: 'EGY', date: '2026-06-30', time: '22:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
  { id: 84, round: 'Dieciseisavos', team1: 'SCO', team2: 'NOR', date: '2026-07-01', time: '00:00', city: 'Toronto', country: 'Canada', status: 'upcoming' },
  { id: 85, round: 'Dieciseisavos', team1: 'GER', team2: 'ZAM', date: '2026-07-01', time: '20:00', city: 'Guadalajara', country: 'Mexico', status: 'upcoming' },
  { id: 86, round: 'Dieciseisavos', team1: 'JPN', team2: 'SUR', date: '2026-07-01', time: '21:00', city: 'Monterrey', country: 'Mexico', status: 'upcoming' },
  { id: 87, round: 'Dieciseisavos', team1: 'FRA', team2: 'MAR', date: '2026-07-01', time: '22:00', city: 'Miami Gardens', country: 'USA', status: 'upcoming' },
  { id: 88, round: 'Dieciseisavos', team1: 'BEL', team2: 'ITA', date: '2026-07-02', time: '00:00', city: 'Dallas', country: 'USA', status: 'upcoming' },

  // ===== ROUND OF 16 =====
  { id: 89, round: 'Octavos', team1: 'TBD', team2: 'TBD', date: '2026-07-03', time: '20:00', city: 'Atlanta', country: 'USA', status: 'upcoming' },
  { id: 90, round: 'Octavos', team1: 'TBD', team2: 'TBD', date: '2026-07-03', time: '21:00', city: 'Nueva York/NJ', country: 'USA', status: 'upcoming' },
  { id: 91, round: 'Octavos', team1: 'TBD', team2: 'TBD', date: '2026-07-04', time: '00:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 92, round: 'Octavos', team1: 'TBD', team2: 'TBD', date: '2026-07-04', time: '01:00', city: 'Houston', country: 'USA', status: 'upcoming' },
  { id: 93, round: 'Octavos', team1: 'TBD', team2: 'TBD', date: '2026-07-05', time: '20:00', city: 'Dallas', country: 'USA', status: 'upcoming' },
  { id: 94, round: 'Octavos', team1: 'TBD', team2: 'TBD', date: '2026-07-05', time: '21:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
  { id: 95, round: 'Octavos', team1: 'TBD', team2: 'TBD', date: '2026-07-06', time: '00:00', city: 'Filadelfia', country: 'USA', status: 'upcoming' },
  { id: 96, round: 'Octavos', team1: 'TBD', team2: 'TBD', date: '2026-07-06', time: '01:00', city: 'Kansas City', country: 'USA', status: 'upcoming' },

  // ===== QUARTERFINALS =====
  { id: 97, round: 'Cuartos', team1: 'TBD', team2: 'TBD', date: '2026-07-09', time: '00:00', city: 'Nueva York/NJ', country: 'USA', status: 'upcoming' },
  { id: 98, round: 'Cuartos', team1: 'TBD', team2: 'TBD', date: '2026-07-09', time: '21:00', city: 'Atlanta', country: 'USA', status: 'upcoming' },
  { id: 99, round: 'Cuartos', team1: 'TBD', team2: 'TBD', date: '2026-07-10', time: '00:00', city: 'Los Ángeles', country: 'USA', status: 'upcoming' },
  { id: 100, round: 'Cuartos', team1: 'TBD', team2: 'TBD', date: '2026-07-10', time: '21:00', city: 'Dallas', country: 'USA', status: 'upcoming' },

  // ===== SEMIFINALS =====
  { id: 101, round: 'Semifinales', team1: 'TBD', team2: 'TBD', date: '2026-07-14', time: '00:00', city: 'Miami Gardens', country: 'USA', status: 'upcoming' },
  { id: 102, round: 'Semifinales', team1: 'TBD', team2: 'TBD', date: '2026-07-15', time: '00:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },

  // ===== THIRD PLACE =====
  { id: 103, round: 'Tercer Lugar', team1: 'TBD', team2: 'TBD', date: '2026-07-18', time: '00:00', city: 'Boston', country: 'USA', status: 'upcoming' },

  // ===== FINAL =====
  { id: 104, round: 'Final', team1: 'TBD', team2: 'TBD', date: '2026-07-19', time: '00:00', city: 'Estadio Azteca', country: 'Mexico', status: 'upcoming' },
];

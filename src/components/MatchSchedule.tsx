import { matches as staticMatches, hostCities } from '../data/matches';
import { Match } from '../data/matches';
import MatchCard from './MatchCard';
import DualClock from './DualClock';

const rounds = [
  { key: 'Fase de Grupos', label: '📋 Fase de Grupos', icon: '📋' },
  { key: 'Dieciseisavos', label: '⚔️ Dieciseisavos de Final', icon: '⚔️' },
  { key: 'Octavos', label: '🔥 Octavos de Final', icon: '🔥' },
  { key: 'Cuartos', label: '⚡ Cuartos de Final', icon: '⚡' },
  { key: 'Semifinales', label: '💎 Semifinales', icon: '💎' },
  { key: 'Tercer Lugar', label: '🥉 Tercer Lugar', icon: '🥉' },
  { key: 'Final', label: '🏆 Final', icon: '🏆' },
];

export default function MatchSchedule({ matches: apiMatches, selectedRound, onRoundSelect, selectedGroup, onGroupSelect }: {
  matches: Match[];
  selectedRound: string;
  onRoundSelect: (r: string) => void;
  selectedGroup: string;
  onGroupSelect: (g: string) => void;
}) {
  const hasGroupStageMatches = apiMatches.some(m => m.round === 'Fase de Grupos');
  const matches = apiMatches.length > 0 && hasGroupStageMatches ? apiMatches : staticMatches;

  const filteredMatches = matches.filter(m => {
    if (m.round !== selectedRound) return false;
    if (selectedRound === 'Fase de Grupos' && selectedGroup && m.group !== selectedGroup) return false;
    return true;
  }).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  const firstMatch = filteredMatches[0];
  const cityInfo = firstMatch ? hostCities.find(c => c.name === firstMatch.city) : null;

  return (
    <div>
      {/* Round selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {rounds.map(r => (
          <button
            key={r.key}
            onClick={() => onRoundSelect(r.key)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap ${
              selectedRound === r.key
                ? 'bg-green-500 text-white shadow-lg scale-105'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Group filter for group stage */}
      {selectedRound === 'Fase de Grupos' && (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          <button
            onClick={() => onGroupSelect('')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              !selectedGroup
                ? 'bg-white text-green-700 shadow'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Todos
          </button>
          {groups.map(g => (
            <button
              key={g}
              onClick={() => onGroupSelect(g)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedGroup === g
                  ? 'bg-white text-green-700 shadow'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Grupo {g}
            </button>
          ))}
        </div>
      )}

      {/* Clocks */}
      {firstMatch && cityInfo && (
        <div className="mb-8">
          <DualClock
            matchCityTimezone={cityInfo.timezone}
            matchCityName={`${firstMatch.city} (${firstMatch.country === 'USA' ? '🇺🇸' : firstMatch.country === 'Canada' ? '🇨🇦' : '🇲🇽'})`}
          />
        </div>
      )}

      {/* Matches */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16 text-white/50">
            <div className="text-6xl mb-4">⚽</div>
            <p className="text-xl">No hay partidos en esta fase aún</p>
          </div>
        ) : (
          filteredMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))
        )}
      </div>
    </div>
  );
}

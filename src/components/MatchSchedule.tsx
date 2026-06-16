import { useState, useMemo } from 'react';
import { matches as staticMatches, hostCities, teams } from '../data/matches';
import { Match } from '../data/matches';
import MatchCard from './MatchCard';
import FlagImg from './FlagImg';

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
  const [teamSearch, setTeamSearch] = useState('');

  const searchResults = useMemo(() => {
    if (!teamSearch.trim()) return [];
    const q = teamSearch.toLowerCase().trim();
    return teams.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  }, [teamSearch]);

  const searchTeam = useMemo(() => {
    if (searchResults.length === 1) return searchResults[0];
    return null;
  }, [searchResults]);

  const hasGroupStageMatches = apiMatches.some(m => m.round === 'Fase de Grupos');
  const matches = apiMatches.length > 0 && hasGroupStageMatches ? apiMatches : staticMatches;

  const filteredMatches = useMemo(() => {
    let result = matches;

    // Team search filter
    if (searchTeam) {
      result = result.filter(m => m.team1 === searchTeam.id || m.team2 === searchTeam.id);
    } else {
      // Round/group filter only when not searching by team
      result = result.filter(m => {
        if (m.round !== selectedRound) return false;
        if (selectedRound === 'Fase de Grupos' && selectedGroup && m.group !== selectedGroup) return false;
        return true;
      });
    }

    return result.sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  }, [matches, searchTeam, selectedRound, selectedGroup]);

  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  return (
    <div>
      {/* Team search */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <input
            type="text"
            value={teamSearch}
            onChange={e => { setTeamSearch(e.target.value); }}
            placeholder="🔍 Busca partidos de una selección..."
            className="w-full px-5 py-3 pl-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 text-base"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        </div>
        {teamSearch.trim() && searchResults.length > 0 && !searchTeam && (
          <div className="mt-2 bg-gray-900/95 border border-white/15 rounded-xl shadow-xl max-h-48 overflow-y-auto">
            {searchResults.map(team => (
              <button
                key={team.id}
                onClick={() => setTeamSearch(team.name)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-all text-left"
              >
                <FlagImg teamId={team.id} emoji={team.flag} size="sm" />
                <div>
                  <span className="text-white font-medium text-sm">{team.name}</span>
                  <span className="text-white/40 text-xs ml-2">Grupo {team.group}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Round selector - hidden when searching by team */}
      {!searchTeam && (
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
      )}

      {/* Group filter for group stage - hidden when searching by team */}
      {!searchTeam && selectedRound === 'Fase de Grupos' && (
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

      {/* Team header when searching */}
      {searchTeam && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 bg-white/10 rounded-2xl px-6 py-3 border border-white/15">
            <FlagImg teamId={searchTeam.id} emoji={searchTeam.flag} size="lg" />
            <div className="text-left">
              <h3 className="text-xl font-black text-white">{searchTeam.name}</h3>
              <span className="text-white/50 text-sm">Grupo {searchTeam.group} · {filteredMatches.length} partidos</span>
            </div>
          </div>
        </div>
      )}

      {/* Matches */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16 text-white/50">
            <div className="text-6xl mb-4">⚽</div>
            <p className="text-xl">
              {searchTeam
                ? `No hay partidos de ${searchTeam.name} aún`
                : 'No hay partidos en esta fase aún'}
            </p>
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

import { useState, useMemo } from 'react';
import { Match, teams, getTeam } from '../data/matches';
import FlagImg from './FlagImg';

export default function SearchBar({ matches }: { matches: Match[] }) {
  const [query, setQuery] = useState('');

  const filteredTeams = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return teams.filter(
      t => t.name.toLowerCase().includes(q) ||
           t.code.toLowerCase().includes(q) ||
           t.id.toLowerCase().includes(q)
    );
  }, [query]);

  const selectedTeam = filteredTeams.length === 1 ? filteredTeams[0] : null;

  const teamMatches = useMemo(() => {
    if (!selectedTeam) return [];
    return matches
      .filter(m => m.team1 === selectedTeam.id || m.team2 === selectedTeam.id)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });
  }, [selectedTeam, matches]);

  const formatTime = (date: string, time: string) => {
    const d = new Date(`${date}T${time}:00Z`);
    return d.toLocaleTimeString('es-ES', {
      timeZone: 'Europe/Madrid',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      timeZone: 'Europe/Madrid',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">🔍 Buscar equipo</h2>

      {/* Search input */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Escribe el nombre de un país..."
            className="w-full px-5 py-3 pl-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 text-lg"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
        </div>
      </div>

      {/* Multiple matches - show team cards */}
      {query.trim() && filteredTeams.length > 1 && (
        <div className="max-w-md mx-auto">
          <p className="text-white/50 text-sm mb-3 text-center">{filteredTeams.length} equipos encontrados:</p>
          <div className="grid grid-cols-2 gap-2">
            {filteredTeams.map(team => (
              <button
                key={team.id}
                onClick={() => setQuery(team.name)}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all text-left"
              >
                <FlagImg teamId={team.id} emoji={team.flag} size="lg" />
                <div>
                  <span className="text-white font-medium text-sm block">{team.name}</span>
                  <span className="text-white/40 text-xs">Grupo {team.group}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {query.trim() && filteredTeams.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">😕</div>
          <p className="text-white/50">No se encontró ningún equipo con "{query}"</p>
        </div>
      )}

      {/* Selected team - show matches */}
      {selectedTeam && (
        <div className="max-w-2xl mx-auto">
          {/* Team header */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-6 border border-white/15 text-center mb-4">
            <div className="mb-2"><FlagImg teamId={selectedTeam.id} emoji={selectedTeam.flag} size="xl" /></div>
            <h3 className="text-2xl font-black text-white">{selectedTeam.name}</h3>
            <span className="text-white/50 text-sm">Grupo {selectedTeam.group}</span>
          </div>

          {/* Team matches */}
          <h4 className="text-lg font-bold text-white mb-3">📅 Partidos ({teamMatches.length})</h4>
          <div className="space-y-2">
            {teamMatches.map(match => {
              const isTeam1 = match.team1 === selectedTeam.id;
              const opponent = getTeam(isTeam1 ? match.team2 : match.team1);
              const score = isTeam1
                ? `${match.score1 ?? '-'} : ${match.score2 ?? '-'}`
                : `${match.score2 ?? '-'} : ${match.score1 ?? '-'}`;
              const isWin = match.status === 'completed' && (
                (isTeam1 && (match.score1 ?? 0) > (match.score2 ?? 0)) ||
                (!isTeam1 && (match.score2 ?? 0) > (match.score1 ?? 0))
              );
              const isDraw = match.status === 'completed' && match.score1 === match.score2;
              const isLoss = match.status === 'completed' && !isWin && !isDraw;

              return (
                <div
                  key={match.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    isWin ? 'bg-green-500/10 border-green-500/30' :
                    isDraw ? 'bg-yellow-500/10 border-yellow-500/30' :
                    isLoss ? 'bg-red-500/10 border-red-500/30' :
                    'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="text-center min-w-[70px]">
                    <div className="text-white/60 text-xs">{formatDate(match.date)}</div>
                    <div className="text-white font-bold text-sm">{formatTime(match.date, match.time)}</div>
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-3">
                    <div className="text-right flex-1">
                      <span className="text-white font-medium text-sm">{selectedTeam.name}</span>
                    </div>
                    <div className={`px-3 py-1 rounded text-center min-w-[60px] font-bold text-sm ${
                      match.status === 'completed'
                        ? isWin ? 'bg-green-500/30 text-green-400' :
                          isDraw ? 'bg-yellow-500/30 text-yellow-400' :
                          'bg-red-500/30 text-red-400'
                        : 'bg-white/10 text-white/50'
                    }`}>
                      {match.status === 'completed' ? score : 'VS'}
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-1">
                        <FlagImg teamId={opponent.id} emoji={opponent.flag} size="md" />
                        <span className="text-white font-medium text-sm">{opponent.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right min-w-[60px]">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      match.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {match.status === 'completed' ? 'Jugado' : match.round}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick team grid when no search */}
      {!query.trim() && (
        <div>
          <p className="text-white/50 text-sm mb-3 text-center">O selecciona un equipo:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {teams.sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name)).map(team => (
              <button
                key={team.id}
                onClick={() => setQuery(team.name)}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/10 transition-all text-left"
              >
                <FlagImg teamId={team.id} emoji={team.flag} size="sm" />
                <div>
                  <span className="text-white text-xs font-medium block truncate">{team.name}</span>
                  <span className="text-white/30 text-xs">Grupo {team.group}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

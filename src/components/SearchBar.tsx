import { useState, useMemo, useEffect } from 'react';
import { Match, teams, getTeam } from '../data/matches';
import { ApiStanding } from '../services/api';
import FlagImg from './FlagImg';

export default function SearchBar({ matches, standings: apiStandings }: { matches: Match[]; standings: Record<string, ApiStanding[]> }) {
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Next match countdown
  const teamNextMatch = teamMatches
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => new Date(`${a.date}T${a.time}:00Z`).getTime() - new Date(`${b.date}T${b.time}:00Z`).getTime())[0] || null;

  const teamCountdown = teamNextMatch
    ? (() => {
        const diff = new Date(`${teamNextMatch.date}T${teamNextMatch.time}:00Z`).getTime() - now.getTime();
        if (diff <= 0) return null;
        return {
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
          match: teamNextMatch,
        };
      })()
    : null;

  // Group standings
  const teamGroupStandings = useMemo(() => {
    if (!selectedTeam) return null;
    const group = selectedTeam.group;
    if (apiStandings[group]) return apiStandings[group];

    // Fallback: calculate from matches
    const groupTeams = teams.filter(t => t.group === group);
    const results = groupTeams.map(t => ({
      teamId: t.id, teamName: t.name, teamFlag: t.flag, teamCrest: '',
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0, position: 0,
    }));
    const groupMatches = matches.filter(m => m.group === group && m.status === 'completed');
    groupMatches.forEach(match => {
      const t1 = results.find(r => r.teamId === match.team1);
      const t2 = results.find(r => r.teamId === match.team2);
      if (t1 && t2 && match.score1 !== undefined && match.score2 !== undefined) {
        t1.played++; t2.played++;
        t1.goalsFor += match.score1!; t1.goalsAgainst += match.score2!;
        t2.goalsFor += match.score2!; t2.goalsAgainst += match.score1!;
        t1.goalDiff = t1.goalsFor - t1.goalsAgainst;
        t2.goalDiff = t2.goalsFor - t2.goalsAgainst;
        if (match.score1 > match.score2) { t1.won++; t1.points += 3; t2.lost++; }
        else if (match.score1 < match.score2) { t2.won++; t2.points += 3; t1.lost++; }
        else { t1.drawn++; t2.drawn++; t1.points++; t2.points++; }
      }
    });
    results.sort((a, b) => b.points - a.points || b.goalDiff - a.goalDiff || b.goalsFor - a.goalsFor);
    return results;
  }, [selectedTeam, apiStandings, matches]);

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

  const formatSpainDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      timeZone: 'Europe/Madrid',
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

      {/* Selected team */}
      {selectedTeam && (
        <div className="max-w-2xl mx-auto">
          {/* Team header */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-6 border border-white/15 text-center mb-4">
            <div className="mb-2"><FlagImg teamId={selectedTeam.id} emoji={selectedTeam.flag} size="xl" /></div>
            <h3 className="text-2xl font-black text-white">{selectedTeam.name}</h3>
            <span className="text-white/50 text-sm">Grupo {selectedTeam.group}</span>
          </div>

          {/* Next match countdown */}
          {teamCountdown && (
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/10 rounded-2xl p-5 border border-blue-500/30 mb-4 text-center">
              <div className="text-white/60 text-sm mb-2">⏱️ Próximo partido</div>
              <div className="flex items-center justify-center gap-3 mb-3">
                {(() => {
                  const t1 = getTeam(teamCountdown.match.team1);
                  const t2 = getTeam(teamCountdown.match.team2);
                  return (
                    <>
                      <div className="text-center">
                        {t1 ? <FlagImg teamId={t1.id} emoji={t1.flag} size="lg" /> : <span className="text-3xl">❓</span>}
                        <span className="text-white font-bold text-xs block mt-0.5">{t1?.name || teamCountdown.match.team1}</span>
                      </div>
                      <span className="text-white/40 text-lg font-bold">VS</span>
                      <div className="text-center">
                        {t2 ? <FlagImg teamId={t2.id} emoji={t2.flag} size="lg" /> : <span className="text-3xl">❓</span>}
                        <span className="text-white font-bold text-xs block mt-0.5">{t2?.name || teamCountdown.match.team2}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="text-white/40 text-xs mb-3">
                {formatSpainDate(teamCountdown.match.date)} · {formatTime(teamCountdown.match.date, teamCountdown.match.time)} 🇪🇸 · {teamCountdown.match.city}
              </div>
              <div className="flex items-center justify-center gap-2">
                {[
                  { value: teamCountdown.days, label: 'Días' },
                  { value: teamCountdown.hours, label: 'Horas' },
                  { value: teamCountdown.minutes, label: 'Min' },
                  { value: teamCountdown.seconds, label: 'Seg' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/10 rounded-lg px-3 py-2 min-w-[55px]">
                    <div className="text-xl font-mono font-black text-white">{String(item.value).padStart(2, '0')}</div>
                    <div className="text-[10px] text-white/50">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group standings */}
          {teamGroupStandings && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4">
              <h4 className="text-sm font-bold text-white/70 mb-3 text-center">📊 Clasificación · Grupo {selectedTeam.group}</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-white/50 text-[10px] uppercase">
                      <th className="py-1.5 px-1.5 text-left">#</th>
                      <th className="py-1.5 px-1.5 text-left">Equipo</th>
                      <th className="py-1.5 px-1.5 text-center">PJ</th>
                      <th className="py-1.5 px-1.5 text-center">G</th>
                      <th className="py-1.5 px-1.5 text-center">E</th>
                      <th className="py-1.5 px-1.5 text-center">P</th>
                      <th className="py-1.5 px-1.5 text-center">DG</th>
                      <th className="py-1.5 px-1.5 text-center font-bold">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamGroupStandings.map((s, idx) => {
                      const isCurrentTeam = s.teamId === selectedTeam.id;
                      const isQualified = idx < 2;
                      return (
                        <tr
                          key={s.teamId}
                          className={`border-t border-white/5 transition-colors ${
                            isCurrentTeam ? 'bg-green-500/15' : isQualified ? 'bg-green-500/5' : ''
                          }`}
                        >
                          <td className="py-2 px-1.5 text-xs">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                              isQualified ? 'bg-green-500 text-white' : 'bg-white/10 text-white/50'
                            }`}>{idx + 1}</span>
                          </td>
                          <td className="py-2 px-1.5">
                            <div className="flex items-center gap-1.5">
                              <FlagImg teamId={s.teamId} emoji={s.teamFlag} size="sm" />
                              <span className={`text-xs font-medium ${isCurrentTeam ? 'text-green-400 font-bold' : 'text-white/80'}`}>
                                {s.teamName}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-1.5 text-center text-white/60 text-xs">{s.played}</td>
                          <td className="py-2 px-1.5 text-center text-white/60 text-xs">{s.won}</td>
                          <td className="py-2 px-1.5 text-center text-white/60 text-xs">{s.drawn}</td>
                          <td className="py-2 px-1.5 text-center text-white/60 text-xs">{s.lost}</td>
                          <td className={`py-2 px-1.5 text-center text-xs font-medium ${
                            s.goalDiff > 0 ? 'text-green-400' : s.goalDiff < 0 ? 'text-red-400' : 'text-white/50'
                          }`}>{s.goalDiff > 0 ? '+' : ''}{s.goalDiff}</td>
                          <td className="py-2 px-1.5 text-center">
                            <span className="bg-white/10 text-white font-bold px-2 py-0.5 rounded text-xs">{s.points}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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

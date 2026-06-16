import { useState, useEffect } from 'react';
import Standings from './components/Standings';
import MatchSchedule from './components/MatchSchedule';
import Stadiums from './components/Stadiums';
import TournamentStats from './components/TournamentStats';
import Countdown from './components/Countdown';
import SearchBar from './components/SearchBar';
import TopScorers from './components/TopScorers';
import FlagImg from './components/FlagImg';
import { matches as staticMatches, teams, getTeam, Match } from './data/matches';
import { useLiveMatches } from './hooks/useLiveMatches';

type Tab = 'inicio' | 'partidos' | 'clasificacion' | 'goleadores' | 'sedes' | 'estadisticas' | 'buscar';

const APP_VERSION = '2.1.0';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [selectedRound, setSelectedRound] = useState('Fase de Grupos');
  const [selectedGroup, setSelectedGroup] = useState('');

  const { matches: apiMatches, standings, scorers, loading, error, lastUpdated, refresh, dataSource } = useLiveMatches();

  // Use API data when available, fall back to static
  const matches = apiMatches.length > 0 ? apiMatches : staticMatches;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'inicio', label: 'Inicio', icon: '🏠' },
    { key: 'buscar', label: 'Buscar', icon: '🔍' },
    { key: 'partidos', label: 'Partidos', icon: '⚽' },
    { key: 'clasificacion', label: 'Clasificación', icon: '📊' },
    { key: 'goleadores', label: 'Goleadores', icon: '🏆' },
    { key: 'sedes', label: 'Sedes', icon: '🏟️' },
    { key: 'estadisticas', label: 'Estadísticas', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Header */}
      <header className="relative z-10">
        <div className="bg-gradient-to-r from-green-800/80 via-green-700/60 to-green-800/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Logo and title */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-5xl">🏆</div>
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  FIFA World Cup 2026
                </h1>
                <p className="text-white/60 text-sm mt-1">
                  🇺🇸 USA · 🇨🇦 Canadá · 🇲🇽 México · 11 Jun - 19 Jul
                </p>
              </div>
              <div className="text-5xl">⚽</div>
            </div>

            {/* Live clocks */}
            <div className="mb-4">
              <HeaderClocks />
            </div>

            {/* API Status */}
            <div className="flex items-center justify-center gap-3 text-xs text-white/50 flex-wrap">
              {loading ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  Cargando datos en vivo...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${dataSource === 'api' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
                  {dataSource === 'api' ? 'En vivo (API)' : '⚠️ Datos locales'}
                </span>
              )}
              {lastUpdated && (
                <span>· {lastUpdated.toLocaleTimeString('es-ES')}</span>
              )}
              <span className="text-white/30">· v{APP_VERSION}</span>
              <button
                onClick={() => refresh()}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg transition-all flex items-center gap-1"
                title="Forzar actualización"
              >
                🔄 Actualizar
              </button>
            </div>

            {/* Error display */}
            {error && !loading && (
              <div className="mt-3 bg-red-500/20 border border-red-500/40 rounded-lg px-4 py-2 text-center">
                <span className="text-red-300 text-xs">⚠️ Error: {error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="bg-gray-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
                    flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2
                    ${activeTab === tab.key
                      ? 'border-green-400 text-green-400 bg-green-500/10'
                      : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'inicio' && (
          <HomePage matches={matches} standings={standings} />
        )}
        {activeTab === 'buscar' && (
          <SearchBar matches={matches} standings={standings} />
        )}
        {activeTab === 'partidos' && (
          <MatchSchedule
            matches={matches}
            selectedRound={selectedRound}
            onRoundSelect={setSelectedRound}
            selectedGroup={selectedGroup}
            onGroupSelect={setSelectedGroup}
          />
        )}
        {activeTab === 'clasificacion' && (
          <Standings
            standings={standings}
            matches={matches}
            selectedGroup={selectedGroup || 'A'}
            onGroupSelect={setSelectedGroup}
          />
        )}
        {activeTab === 'goleadores' && <TopScorers scorers={scorers} />}
        {activeTab === 'sedes' && <Stadiums />}
        {activeTab === 'estadisticas' && <TournamentStats matches={matches} />}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-white/40 text-sm">
            🏆 Copa Mundial de la FIFA 2026 · 🇺🇸🇨🇦🇲🇽 · 48 equipos · 104 partidos · 16 ciudades
          </p>
          <p className="text-white/20 text-xs mt-2">
            Aplicación no oficial · Datos en vivo via football-data.org
          </p>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ matches, standings: apiStandings }: { matches: typeof staticMatches; standings: Record<string, import('../services/api').ApiStanding[]> }) {
  const [homeQuery, setHomeQuery] = useState('');
  const [selectedHomeTeam, setSelectedHomeTeam] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const completed = matches.filter(match => match.status === 'completed');
  const liveMatches = matches.filter(match => match.status === 'live');
  const upcoming = matches
    .filter(match => match.status === 'upcoming')
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  const next3Matches = upcoming.slice(0, 3);

  const homeFilteredTeams = homeQuery.trim()
    ? teams.filter(t =>
        t.name.toLowerCase().includes(homeQuery.toLowerCase().trim()) ||
        t.code.toLowerCase().includes(homeQuery.toLowerCase().trim())
      )
    : [];

  const homeSelectedTeam = selectedHomeTeam
    ? teams.find(t => t.id === selectedHomeTeam) || null
    : homeFilteredTeams.length === 1 ? homeFilteredTeams[0] : null;

  const homeTeamMatches = homeSelectedTeam
    ? matches
        .filter(m => m.team1 === homeSelectedTeam.id || m.team2 === homeSelectedTeam.id)
        .sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.time.localeCompare(b.time);
        })
    : [];

  // Team's next upcoming match + countdown
  const teamNextMatch = homeTeamMatches
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00Z`);
      const dateB = new Date(`${b.date}T${b.time}:00Z`);
      return dateA.getTime() - dateB.getTime();
    })[0] || null;

  const teamCountdown = teamNextMatch
    ? (() => {
        const matchDate = new Date(`${teamNextMatch.date}T${teamNextMatch.time}:00Z`);
        const diff = matchDate.getTime() - now.getTime();
        if (diff <= 0) return null;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds, match: teamNextMatch };
      })()
    : null;

  // Group standings for selected team
  const teamGroupStandings = (() => {
    if (!homeSelectedTeam) return null;
    const group = homeSelectedTeam.group;

    // Prefer API standings
    if (apiStandings[group]) {
      return apiStandings[group];
    }

    // Fallback: calculate from matches
    const groupTeams = teams.filter(t => t.group === group);
    const results = groupTeams.map(t => ({
      teamId: t.id,
      teamName: t.name,
      teamFlag: t.flag,
      teamCode: t.code,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0,
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

    results.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });

    return results;
  })();

  const formatSpainTime = (date: string, time: string) => {
    const d = new Date(`${date}T${time}:00Z`);
    return d.toLocaleTimeString('es-ES', {
      timeZone: 'Europe/Madrid',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
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
    <div className="space-y-10">
      {/* Hero section */}
      <div className="text-center py-10">
        {/* Search bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              value={homeQuery}
              onChange={e => { setHomeQuery(e.target.value); setSelectedHomeTeam(null); }}
              onFocus={() => setSelectedHomeTeam(null)}
              placeholder="🔍 Busca tu selección..."
              className="w-full px-5 py-3 pl-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 text-base"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
          </div>
          {/* Dropdown suggestions */}
          {homeQuery.trim() && homeFilteredTeams.length > 0 && !homeSelectedTeam && (
            <div className="mt-2 bg-gray-900/95 border border-white/15 rounded-xl shadow-xl max-h-48 overflow-y-auto">
              {homeFilteredTeams.map(team => (
                <button
                  key={team.id}
                  onClick={() => { setSelectedHomeTeam(team.id); setHomeQuery(team.name); }}
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

        {/* Live matches */}
        {!homeSelectedTeam && liveMatches.length > 0 && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-full text-sm mb-3">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              En vivo · {liveMatches.length} partido{liveMatches.length > 1 ? 's' : ''} en juego
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              {liveMatches.map((match) => {
                const t1 = getTeam(match.team1);
                const t2 = getTeam(match.team2);
                return (
                  <div key={match.id} className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <div className="flex items-center justify-center gap-3">
                      <div className="text-center min-w-[60px]">
                        {t1 ? <FlagImg teamId={t1.id} emoji={t1.flag} size="lg" /> : <span className="text-2xl">❓</span>}
                        <span className="text-white font-bold text-xs block mt-0.5">{t1?.name || match.team1}</span>
                      </div>
                      <div className="text-center px-2">
                        <div className="text-xl font-black text-white">
                          {match.score1 ?? '-'} : {match.score2 ?? '-'}
                        </div>
                        <div className="flex items-center gap-1 justify-center mt-0.5">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                          <span className="text-red-400 text-xs font-bold">EN VIVO</span>
                        </div>
                      </div>
                      <div className="text-center min-w-[60px]">
                        {t2 ? <FlagImg teamId={t2.id} emoji={t2.flag} size="lg" /> : <span className="text-2xl">❓</span>}
                        <span className="text-white font-bold text-xs block mt-0.5">{t2?.name || match.team2}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!homeSelectedTeam && (
          <>
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              En progreso · {completed.length} partidos jugados de {matches.length}
            </div>
            <Countdown matches={matches} />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              La Copa del Mundo más
              <span className="block bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                grande de la historia
              </span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              48 selecciones, 16 ciudades, 3 países. La primera Copa del Mundo con 48 equipos,
              organizada conjuntamente por Estados Unidos, Canadá y México.
            </p>
          </>
        )}
      </div>

      {/* Home search results */}
      {homeSelectedTeam && (
        <div className="max-w-2xl mx-auto">
          {/* Team header */}
          <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-6 border border-white/15 text-center mb-4">
            <div className="mb-2"><FlagImg teamId={homeSelectedTeam.id} emoji={homeSelectedTeam.flag} size="xl" /></div>
            <h3 className="text-2xl font-black text-white">{homeSelectedTeam.name}</h3>
            <span className="text-white/50 text-sm">Grupo {homeSelectedTeam.group}</span>
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
                {formatSpainDate(teamCountdown.match.date)} · {formatSpainTime(teamCountdown.match.date, teamCountdown.match.time)} 🇪🇸 · {teamCountdown.match.city}
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
              <h4 className="text-sm font-bold text-white/70 mb-3 text-center">📊 Clasificación · Grupo {homeSelectedTeam.group}</h4>
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
                      const isCurrentTeam = s.teamId === homeSelectedTeam.id || s.team?.id === homeSelectedTeam.id;
                      const isQualified = idx < 2;
                      return (
                        <tr
                          key={s.teamId || s.team?.id}
                          className={`border-t border-white/5 transition-colors ${
                            isCurrentTeam ? 'bg-green-500/15' : isQualified ? 'bg-green-500/5' : ''
                          }`}
                        >
                          <td className="py-2 px-1.5 text-xs">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                              isQualified ? 'bg-green-500 text-white' : 'bg-white/10 text-white/50'
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-2 px-1.5">
                            <div className="flex items-center gap-1.5">
                              <FlagImg teamId={s.teamId} emoji={s.teamFlag || s.team?.flag || '🏳️'} size="sm" />
                              <span className={`text-xs font-medium ${isCurrentTeam ? 'text-green-400 font-bold' : 'text-white/80'}`}>
                                {s.teamName || s.team?.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 px-1.5 text-center text-white/60 text-xs">{s.played}</td>
                          <td className="py-2 px-1.5 text-center text-white/60 text-xs">{s.won}</td>
                          <td className="py-2 px-1.5 text-center text-white/60 text-xs">{s.drawn}</td>
                          <td className="py-2 px-1.5 text-center text-white/60 text-xs">{s.lost}</td>
                          <td className={`py-2 px-1.5 text-center text-xs font-medium ${
                            s.goalDiff > 0 ? 'text-green-400' : s.goalDiff < 0 ? 'text-red-400' : 'text-white/50'
                          }`}>
                            {s.goalDiff > 0 ? '+' : ''}{s.goalDiff}
                          </td>
                          <td className="py-2 px-1.5 text-center">
                            <span className="bg-white/10 text-white font-bold px-2 py-0.5 rounded text-xs">
                              {s.points}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Matches */}
          <h4 className="text-lg font-bold text-white mb-3">📅 Partidos ({homeTeamMatches.length})</h4>
          <div className="space-y-2">
            {homeTeamMatches.map(match => {
              const isTeam1 = match.team1 === homeSelectedTeam.id;
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
                    <div className="text-white/60 text-xs">{formatSpainDate(match.date)}</div>
                    <div className="text-white font-bold text-sm">{formatSpainTime(match.date, match.time)}</div>
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-3">
                    <div className="text-right flex-1">
                      <span className="text-white font-medium text-sm">{homeSelectedTeam.name}</span>
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
                        {opponent ? <FlagImg teamId={opponent.id} emoji={opponent.flag} size="md" /> : <span className="text-lg">🏳️</span>}
                        <span className="text-white font-medium text-sm">{opponent?.name || match.team2}</span>
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

      {/* Stats grid */}
      {!homeSelectedTeam && (
        <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/10 rounded-2xl p-6 border border-green-500/20 text-center hover:border-green-500/40 transition-all">
          <div className="text-4xl mb-2">🌍</div>
          <div className="text-3xl font-black text-white">48</div>
          <div className="text-xs text-white/50 mt-1">Selecciones</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/10 rounded-2xl p-6 border border-blue-500/20 text-center hover:border-blue-500/40 transition-all">
          <div className="text-4xl mb-2">⚽</div>
          <div className="text-3xl font-black text-white">104</div>
          <div className="text-xs text-white/50 mt-1">Partidos</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/10 rounded-2xl p-6 border border-purple-500/20 text-center hover:border-purple-500/40 transition-all">
          <div className="text-4xl mb-2">🏟️</div>
          <div className="text-3xl font-black text-white">16</div>
          <div className="text-xs text-white/50 mt-1">Ciudades sede</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-600/10 rounded-2xl p-6 border border-yellow-500/20 text-center hover:border-yellow-500/40 transition-all">
          <div className="text-4xl mb-2">📅</div>
          <div className="text-3xl font-black text-white">39</div>
          <div className="text-xs text-white/50 mt-1">Días de competición</div>
        </div>
      </div>

      {/* Next 3 matches */}
      {next3Matches.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">⏭️ Próximos partidos</h3>
          <div className="space-y-3">
            {next3Matches.map((match) => {
              const t1 = teams.find(team => team.id === match.team1);
              const t2 = teams.find(team => team.id === match.team2);
              return (
                <div key={match.id} className="bg-gradient-to-r from-white/10 to-white/5 rounded-2xl p-4 border border-white/15">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center min-w-[80px]">
                      {t1 ? <FlagImg teamId={t1.id} emoji={t1.flag} size="lg" /> : <span className="text-3xl">❓</span>}
                      <span className="text-white font-bold block mt-1 text-xs">{t1?.name || match.team1}</span>
                    </div>
                    <div className="text-center px-3">
                      <div className="text-lg font-black text-white/40">VS</div>
                      <div className="text-green-400 font-bold text-sm mt-1">
                        {formatSpainTime(match.date, match.time)}
                      </div>
                      <div className="text-white/40 text-xs mt-0.5">
                        {formatSpainDate(match.date)}
                      </div>
                      <div className="text-white/30 text-xs mt-0.5">{match.city}</div>
                    </div>
                    <div className="text-center min-w-[80px]">
                      {t2 ? <FlagImg teamId={t2.id} emoji={t2.flag} size="lg" /> : <span className="text-3xl">❓</span>}
                      <span className="text-white font-bold block mt-1 text-xs">{t2?.name || match.team2}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Host countries */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">🌎 Países anfitriones</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl p-6 border border-blue-500/20 text-center">
            <div className="text-5xl mb-3">🇺🇸</div>
            <h4 className="text-white font-bold text-lg">Estados Unidos</h4>
            <p className="text-white/50 text-sm mt-2">11 ciudades sede</p>
            <div className="mt-3 flex flex-wrap gap-1 justify-center">
              {['Los Ángeles', 'Miami', 'Nueva York', 'Atlanta', 'Dallas', 'Houston', 'Boston', 'Filadelfia', 'Kansas City', 'San Francisco Bay'].map(city => (
                <span key={city} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{city}</span>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-2xl p-6 border border-red-500/20 text-center">
            <div className="text-5xl mb-3">🇨🇦</div>
            <h4 className="text-white font-bold text-lg">Canadá</h4>
            <p className="text-white/50 text-sm mt-2">2 ciudades sede</p>
            <div className="mt-3 flex flex-wrap gap-1 justify-center">
              {['Toronto', 'Vancouver'].map(city => (
                <span key={city} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{city}</span>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl p-6 border border-green-500/20 text-center">
            <div className="text-5xl mb-3">🇲🇽</div>
            <h4 className="text-white font-bold text-lg">México</h4>
            <p className="text-white/50 text-sm mt-2">3 ciudades sede</p>
            <div className="mt-3 flex flex-wrap gap-1 justify-center">
              {['Estadio Azteca', 'Guadalajara', 'Monterrey'].map(city => (
                <span key={city} className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full">{city}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Groups overview */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">📋 Equipos por Grupo</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {teams.sort((a, b) => a.group.localeCompare(b.group)).map((team) => (
            <div key={team.name} className="bg-white/5 rounded-lg p-3 border border-white/10 text-center hover:bg-white/10 transition-all">
              <FlagImg teamId={team.id} emoji={team.flag} size="lg" />
              <span className="text-white text-xs font-medium block mt-1 truncate">{team.name}</span>
              <span className="text-white/30 text-xs">Grupo {team.group}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Format explanation */}
      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">📖 Formato del Torneo 2026</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-green-400 font-bold">🟢 Fase de Grupos</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2"><span>•</span> 12 grupos de 4 equipos cada uno</li>
              <li className="flex items-start gap-2"><span>•</span> 6 partidos por grupo, 72 en total</li>
              <li className="flex items-start gap-2"><span>•</span> Los 2 primeros de cada grupo clasifican (24 equipos)</li>
              <li className="flex items-start gap-2"><span>•</span> Los 8 mejores terceros también clasifican</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-yellow-400 font-bold">🟡 Fase Eliminatoria</h4>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2"><span>•</span> 32 equipos → 16 de 32</li>
              <li className="flex items-start gap-2"><span>•</span> 16 de 32 → 8 de 16</li>
              <li className="flex items-start gap-2"><span>•</span> 8 de 16 → 4 de 8 (Cuartos)</li>
              <li className="flex items-start gap-2"><span>•</span> 4 de 8 → 2 de 4 (Semifinales)</li>
              <li className="flex items-start gap-2"><span>•</span> Tercer lugar y Gran Final</li>
              <li className="flex items-start gap-2"><span>🏆</span> Final el 19 de julio en el Estadio Azteca</li>
            </ul>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}

function HeaderClocks() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const clocks = [
    { tz: 'America/New_York', flag: '🇺🇸', label: 'New York', color: 'from-blue-600 to-indigo-800', border: 'border-blue-400' },
    { tz: 'America/Toronto', flag: '🇨🇦', label: 'Toronto', color: 'from-red-600 to-red-800', border: 'border-red-400' },
    { tz: 'America/Mexico_City', flag: '🇲🇽', label: 'CDMX', color: 'from-green-600 to-emerald-800', border: 'border-green-400' },
    { tz: 'Europe/Madrid', flag: '🇪🇸', label: 'España', color: 'from-yellow-500 to-red-600', border: 'border-yellow-300' },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center">
      {clocks.map(c => {
        const time = now.toLocaleTimeString('es-ES', {
          timeZone: c.tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const date = now.toLocaleDateString('es-ES', {
          timeZone: c.tz,
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        });
        const offset = now.toLocaleTimeString('en-US', {
          timeZone: c.tz,
          timeZoneName: 'shortOffset',
        }).split(' ').pop() || '';
        return (
          <div key={c.tz} className={`bg-gradient-to-br ${c.color} rounded-xl px-4 py-2 shadow-lg border-2 ${c.border} min-w-[130px] text-center`}>
            <div className="flex items-center justify-center gap-1.5 mb-0.5">
              <span className="text-sm">{c.flag}</span>
              <span className="text-white font-bold text-xs uppercase tracking-wider">{c.label}</span>
            </div>
            <div className="text-xl font-mono font-bold text-white drop-shadow">{time}</div>
            <div className="text-[10px] text-white/60 mt-0.5">{date} · {offset}</div>
          </div>
        );
      })}
    </div>
  );
}

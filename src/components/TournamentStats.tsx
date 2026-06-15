import { matches as staticMatches, teams, Match } from '../data/matches';

export default function TournamentStats({ matches: apiMatches }: { matches: Match[] }) {
  const matches = apiMatches.length > 0 ? apiMatches : staticMatches;
  const groupMatches = matches.filter(m => m.round === 'Fase de Grupos');
  const completedMatches = matches.filter(m => m.status === 'completed');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');

  const totalGoals = completedMatches.reduce((sum, m) => sum + (m.score1 || 0) + (m.score2 || 0), 0);
  const avgGoals = completedMatches.length > 0 ? (totalGoals / completedMatches.length).toFixed(2) : '0';

  const goalsByTeam: Record<string, number> = {};
  completedMatches.forEach(m => {
    goalsByTeam[m.team1] = (goalsByTeam[m.team1] || 0) + (m.score1 || 0);
    goalsByTeam[m.team2] = (goalsByTeam[m.team2] || 0) + (m.score2 || 0);
  });

  const topScorers = Object.entries(goalsByTeam)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([teamId, goals]) => {
      const team = teams.find(t => t.id === teamId);
      return { team: team || { name: teamId, flag: '❓', id: teamId }, goals };
    });

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">📊 Estadísticas del Torneo</h2>
        <p className="text-white/60">Resumen y datos del Mundial 2026</p>
      </div>

      {/* General stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-5 border border-green-500/20 text-center">
          <div className="text-3xl mb-2">⚽</div>
          <div className="text-3xl font-black text-white">{matches.length}</div>
          <div className="text-xs text-white/60 mt-1">Total de partidos</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-5 border border-blue-500/20 text-center">
          <div className="text-3xl mb-2">🌍</div>
          <div className="text-3xl font-black text-white">{teams.length}</div>
          <div className="text-xs text-white/60 mt-1">Equipos participantes</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-5 border border-purple-500/20 text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-black text-white">{completedMatches.length}</div>
          <div className="text-xs text-white/60 mt-1">Partidos jugados</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl p-5 border border-yellow-500/20 text-center">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-3xl font-black text-white">{upcomingMatches.length}</div>
          <div className="text-xs text-white/60 mt-1">Partidos pendientes</div>
        </div>
      </div>

      {/* Tournament format */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">📋 Fase de Grupos</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Grupos</span>
              <span className="text-white font-bold">12 (A-L)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Equipos por grupo</span>
              <span className="text-white font-bold">4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Partidos por grupo</span>
              <span className="text-white font-bold">6</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Partidos totales</span>
              <span className="text-white font-bold">{groupMatches.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Clasifican (1° y 2°)</span>
              <span className="text-green-400 font-bold">24 equipos</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Mejores 3° clasificados</span>
              <span className="text-yellow-400 font-bold">8 equipos</span>
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">🏆 Fase Eliminatoria</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Dieciseisavos</span>
              <span className="text-white font-bold">16 partidos</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Octavos</span>
              <span className="text-white font-bold">8 partidos</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Cuartos</span>
              <span className="text-white font-bold">4 partidos</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Semifinales</span>
              <span className="text-white font-bold">2 partidos</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Tercer Lugar</span>
              <span className="text-white font-bold">1 partido</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Final</span>
              <span className="text-yellow-400 font-bold">🏆 1 partido</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dates & Schedule */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-10">
        <h3 className="text-lg font-bold text-white mb-4">📅 Calendario del Torneo</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">11 Jun</div>
            <span className="text-white/70 text-sm">Inicio - Fase de Grupos</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold">25 Jun</div>
            <span className="text-white/70 text-sm">Final de Fase de Grupos</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-bold">28 Jun</div>
            <span className="text-white/70 text-sm">Dieciseisavos de Final</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold">3 Jul</div>
            <span className="text-white/70 text-sm">Octavos de Final</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-bold">9 Jul</div>
            <span className="text-white/70 text-sm">Cuartos de Final</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">14 Jul</div>
            <span className="text-white/70 text-sm">Semifinales</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">19 Jul</div>
            <span className="text-white font-bold text-sm">🏆 GRAN FINAL - Estadio Azteca</span>
          </div>
        </div>
      </div>

      {/* Goals stats */}
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-10">
        <h3 className="text-lg font-bold text-white mb-4">⚽ Estadísticas de Goles</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-black text-white">{totalGoals}</div>
            <div className="text-xs text-white/50">Total goles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-white">{avgGoals}</div>
            <div className="text-xs text-white/50">Goles/partido</div>
          </div>
        </div>
      </div>

      {/* Teams by goals */}
      {topScorers.length > 0 && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-4">🥇 Equipos con más goles</h3>
          <div className="space-y-2">
            {topScorers.map((item, idx) => (
              <div key={item.team.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/5">
                <span className={`w-6 text-center font-bold text-sm ${
                  idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-white/40'
                }`}>
                  {idx + 1}
                </span>
                <span className="text-xl">{item.team.flag}</span>
                <span className="text-white text-sm flex-1">{item.team.name}</span>
                <span className="bg-white/10 text-white px-2 py-0.5 rounded-full text-sm font-bold">
                  {item.goals} goles
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

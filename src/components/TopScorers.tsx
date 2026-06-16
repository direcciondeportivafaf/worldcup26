import { Scorer } from '../services/api';
import { teams } from '../data/matches';
import FlagImg from './FlagImg';

// Map API team TLA to our team IDs for flag lookup
const TLA_TO_ID: Record<string, string> = {};
teams.forEach(t => { TLA_TO_ID[t.code] = t.id; });

function getTeamId(tla: string): string {
  return TLA_TO_ID[tla] || tla.toLowerCase();
}

export default function TopScorers({ scorers }: { scorers: Scorer[] }) {
  if (scorers.length === 0) {
    return (
      <div className="text-center py-16 text-white/50">
        <div className="text-6xl mb-4">⚽</div>
        <p className="text-xl">No hay datos de goleadores aún</p>
        <p className="text-sm mt-2">Los goleadores aparecerán cuando comiencen los partidos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">🏆 Goleadores del Torneo</h2>

      {/* Top 3 podium */}
      {scorers.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd place */}
          <div className="text-center">
            <div className="mb-2"><FlagImg teamId={getTeamId(scorers[1].team.tla)} emoji="🏳️" size="lg" /></div>
            <div className="bg-gradient-to-br from-gray-300 to-gray-500 rounded-xl px-4 py-3 shadow-lg border-2 border-gray-300 min-w-[120px]">
              <div className="text-2xl font-black text-white">🥈</div>
              <div className="text-white font-bold text-sm mt-1">{scorers[1].player.name}</div>
              <div className="text-white/70 text-xs">{scorers[1].team.shortName}</div>
              <div className="text-3xl font-black text-white mt-1">{scorers[1].goals}</div>
              <div className="text-white/60 text-[10px]">goles</div>
            </div>
          </div>
          {/* 1st place */}
          <div className="text-center">
            <div className="mb-2"><FlagImg teamId={getTeamId(scorers[0].team.tla)} emoji="🏳️" size="xl" /></div>
            <div className="bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl px-5 py-4 shadow-lg border-2 border-yellow-300 min-w-[140px]">
              <div className="text-3xl font-black text-white">🥇</div>
              <div className="text-white font-bold mt-1">{scorers[0].player.name}</div>
              <div className="text-yellow-100 text-xs">{scorers[0].team.shortName}</div>
              <div className="text-4xl font-black text-white mt-1">{scorers[0].goals}</div>
              <div className="text-yellow-100 text-[10px]">goles</div>
            </div>
          </div>
          {/* 3rd place */}
          <div className="text-center">
            <div className="mb-2"><FlagImg teamId={getTeamId(scorers[2].team.tla)} emoji="🏳️" size="lg" /></div>
            <div className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl px-4 py-3 shadow-lg border-2 border-amber-600 min-w-[120px]">
              <div className="text-2xl font-black text-white">🥉</div>
              <div className="text-white font-bold text-sm mt-1">{scorers[2].player.name}</div>
              <div className="text-white/70 text-xs">{scorers[2].team.shortName}</div>
              <div className="text-3xl font-black text-white mt-1">{scorers[2].goals}</div>
              <div className="text-white/60 text-[10px]">goles</div>
            </div>
          </div>
        </div>
      )}

      {/* Full scorers table */}
      <div className="overflow-x-auto rounded-xl shadow-xl">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-white/10 text-white/90">
              <th className="py-3 px-2 text-left text-xs">#</th>
              <th className="py-3 px-2 text-left text-xs">Jugador</th>
              <th className="py-3 px-2 text-left text-xs">Equipo</th>
              <th className="py-3 px-2 text-center text-xs font-bold">Goles</th>
              <th className="py-3 px-2 text-center text-xs">Asist.</th>
              <th className="py-3 px-2 text-center text-xs">Pen.</th>
            </tr>
          </thead>
          <tbody>
            {scorers.map((scorer, idx) => {
              const teamId = getTeamId(scorer.team.tla);
              return (
                <tr
                  key={`${scorer.player.id}-${idx}`}
                  className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                    idx === 0 ? 'bg-yellow-500/10' : idx === 1 ? 'bg-gray-500/10' : idx === 2 ? 'bg-amber-700/10' : ''
                  }`}
                >
                  <td className="py-3 px-2 text-sm">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      idx === 0 ? 'bg-yellow-500 text-white' :
                      idx === 1 ? 'bg-gray-400 text-white' :
                      idx === 2 ? 'bg-amber-700 text-white' :
                      'bg-white/10 text-white/50'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div>
                      <span className="text-white font-semibold text-sm">{scorer.player.name}</span>
                      {scorer.player.nationality && (
                        <span className="text-white/40 text-xs ml-2">{scorer.player.nationality}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <FlagImg teamId={teamId} emoji="🏳️" size="sm" />
                      <span className="text-white/70 text-sm">{scorer.team.shortName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="bg-green-500/20 text-green-400 font-bold px-3 py-1 rounded-full text-sm">
                      {scorer.goals}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center text-white/60 text-sm">
                    {scorer.assists ?? '-'}
                  </td>
                  <td className="py-3 px-2 text-center text-white/60 text-sm">
                    {scorer.penalties ?? '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { Match, getTeam, hostCities } from '../data/matches';

export default function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const t1 = match.team1 === 'TBD' ? { id: 'TBD', name: 'Por definir', code: 'TBD', flag: '❓', group: '' } : getTeam(match.team1);
  const t2 = match.team2 === 'TBD' ? { id: 'TBD', name: 'Por definir', code: 'TBD', flag: '❓', group: '' } : getTeam(match.team2);

  const cityInfo = hostCities.find(c => c.name === match.city);
  const localTz = cityInfo?.timezone || 'America/New_York';
  const localCityName = `${match.city}, ${match.country === 'USA' ? '🇺🇸' : match.country === 'Canada' ? '🇨🇦' : '🇲🇽'}`;

  const matchDate = new Date(`${match.date}T${match.time}:00Z`);
  const localTimeStr = matchDate.toLocaleTimeString('es-ES', {
    timeZone: localTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateStr = new Date(match.date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  });

  const isFinal = match.round === 'Final';
  const isSemiFinal = match.round === 'Semifinales';
  const isQuarterFinal = match.round === 'Cuartos';
  const isKnockout = match.round !== 'Fase de Grupos';

  if (compact) {
    return (
      <div className={`
        flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/10
        ${isFinal ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30' : ''}
        ${isSemiFinal ? 'bg-purple-500/10 border border-purple-500/20' : ''}
        ${isQuarterFinal ? 'bg-blue-500/10 border border-blue-500/20' : ''}
      `}>
        <div className="text-center min-w-[60px]">
          <div className="text-white/60 text-xs">{dateStr}</div>
          <div className="text-white font-bold text-sm">{localTimeStr}</div>
        </div>
        <div className="flex-1 flex items-center justify-between px-2">
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-sm font-medium text-white text-right flex-1">{t1.name}</span>
            <span className="text-lg">{t1.flag}</span>
          </div>
          <div className={`px-3 py-1 rounded-lg text-center min-w-[60px] ${
            match.status === 'completed'
              ? 'bg-white/20 text-white font-bold'
              : match.status === 'live'
              ? 'bg-red-500/30 text-red-300 font-bold animate-pulse'
              : 'bg-white/5 text-white/50'
          }`}>
            {match.score1 !== undefined ? `${match.score1} - ${match.score2}` : 'VS'}
            {match.penalties && <div className="text-xs mt-0.5">({match.penalties})</div>}
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-lg">{t2.flag}</span>
            <span className="text-sm font-medium text-white flex-1">{t2.name}</span>
          </div>
        </div>
        <div className="text-right min-w-[80px]">
          <div className="text-xs text-white/50">{match.round}</div>
          <div className="text-xs text-white/40">{localCityName.split(',')[0]}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] border
      ${isFinal ? 'border-yellow-500/40 bg-gradient-to-br from-yellow-500/10 to-amber-600/10' : ''}
      ${isSemiFinal ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-600/10' : ''}
      ${isQuarterFinal ? 'border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-600/10' : ''}
      ${!isKnockout ? 'border-white/10 bg-white/5' : ''}
      ${match.status === 'live' ? 'border-red-500/50 ring-2 ring-red-500/30' : ''}
    `}>
      <div className="px-4 py-2 bg-white/5 flex items-center justify-between">
        <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
          {isFinal ? '🏆 FINAL' : isSemiFinal ? '⚡ SEMIFINAL' : isQuarterFinal ? '🔥 CUARTOS' : `📋 ${match.round}`}
        </span>
        <div className="flex items-center gap-2">
          {match.status === 'live' && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">EN VIVO</span>}
          {match.status === 'completed' && <span className="text-xs bg-green-500/30 text-green-400 px-2 py-0.5 rounded-full">Finalizado</span>}
          {match.status === 'upcoming' && <span className="text-xs bg-blue-500/30 text-blue-400 px-2 py-0.5 rounded-full">Pendiente</span>}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 text-right pr-4">
            <span className="text-4xl block mb-2">{t1.flag}</span>
            <span className="text-white font-bold text-lg">{t1.name}</span>
          </div>

          <div className="text-center px-4">
            <div className={`text-4xl font-black tracking-wider ${
              match.score1 !== undefined ? 'text-white' : 'text-white/40'
            }`}>
              {match.score1 !== undefined ? (
                <span>
                  {match.score1} <span className="text-white/30 mx-1">:</span> {match.score2}
                </span>
              ) : (
                'VS'
              )}
            </div>
            {match.extraTime && <div className="text-xs text-yellow-400 mt-1">Prórroga</div>}
            {match.penalties && <div className="text-xs text-white/60 mt-1">Penaltis: {match.penalties}</div>}
          </div>

          <div className="flex-1 text-left pl-4">
            <span className="text-4xl block mb-2">{t2.flag}</span>
            <span className="text-white font-bold text-lg">{t2.name}</span>
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span>📅</span>
            <span className="text-white/70">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>🕐</span>
            <span className="text-white/70">{localTimeStr}</span>
            <span className="text-white/40">Hora local</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>📍</span>
            <span className="text-white/70">{localCityName}</span>
          </div>
          {match.group && (
            <div className="flex items-center gap-2 text-sm">
              <span>🏷️</span>
              <span className="text-white/70">Grupo {match.group}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

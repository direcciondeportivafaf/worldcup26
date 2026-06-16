import { useState } from 'react';
import { Match, getTeam, hostCities } from '../data/matches';
import { fetchMatchDetail, MatchGoal } from '../services/api';
import FlagImg from './FlagImg';

function GoalIcon({ type }: { type: string }) {
  if (type === 'PENALTY') return <span className="text-yellow-400" title="Penalti">⚽</span>;
  if (type === 'OWN_GOAL') return <span className="text-red-400" title="Autogol">⚽</span>;
  return <span className="text-green-400">⚽</span>;
}

export default function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const [showGoals, setShowGoals] = useState(false);
  const [goals, setGoals] = useState<MatchGoal[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [goalError, setGoalError] = useState('');

  const t1 = match.team1 === 'TBD' ? { id: 'TBD', name: 'Por definir', code: 'TBD', flag: '❓', group: '' } : getTeam(match.team1);
  const t2 = match.team2 === 'TBD' ? { id: 'TBD', name: 'Por definir', code: 'TBD', flag: '❓', group: '' } : getTeam(match.team2);

  const cityInfo = hostCities.find(c => c.name === match.city);
  const localTz = cityInfo?.timezone || 'America/New_York';
  const localCityName = `${match.city}, ${match.country === 'USA' ? '🇺🇸' : match.country === 'Canada' ? '🇨🇦' : '🇲🇽'}`;

  const matchDate = new Date(`${match.date}T${match.time}:00Z`);

  const spainTimeStr = matchDate.toLocaleTimeString('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const localTimeStr = matchDate.toLocaleTimeString('es-ES', {
    timeZone: localTz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateStr = matchDate.toLocaleDateString('es-ES', {
    timeZone: 'Europe/Madrid',
    day: 'numeric',
    month: 'short',
  });

  const isFinal = match.round === 'Final';
  const isSemiFinal = match.round === 'Semifinales';
  const isQuarterFinal = match.round === 'Cuartos';
  const isKnockout = match.round !== 'Fase de Grupos';

  const handleToggleGoals = async () => {
    if (showGoals) {
      setShowGoals(false);
      return;
    }
    if (goals.length > 0) {
      setShowGoals(true);
      return;
    }
    setLoadingGoals(true);
    setGoalError('');
    try {
      const detail = await fetchMatchDetail(match.id, t1.name, t2.name);
      if (detail) {
        setGoals(detail.goals);
        if (detail.goals.length === 0) setGoalError('No hay datos de goles para este partido');
      } else {
        setGoalError('No se pudo cargar la información del partido');
      }
      setShowGoals(true);
    } catch (e) {
      setGoalError('Error al cargar los goles');
      setShowGoals(true);
    } finally {
      setLoadingGoals(false);
    }
  };

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
          <div className="text-white font-bold text-sm">{spainTimeStr}</div>
        </div>
        <div className="flex-1 flex items-center justify-between px-2">
          <div className="flex items-center gap-2 flex-1 justify-end">
            <span className="text-sm font-medium text-white text-right flex-1">{t1.name}</span>
            <FlagImg teamId={t1.id} emoji={t1.flag} size="md" />
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
            <FlagImg teamId={t2.id} emoji={t2.flag} size="md" />
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
            <div className="mb-2"><FlagImg teamId={t1.id} emoji={t1.flag} size="xl" /></div>
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
            <div className="mb-2"><FlagImg teamId={t2.id} emoji={t2.flag} size="xl" /></div>
            <span className="text-white font-bold text-lg">{t2.name}</span>
          </div>
        </div>

        {/* Goal scorers section */}
        {match.status === 'completed' && match.score1 !== undefined && (
          <div className="mb-3">
            <button
              onClick={handleToggleGoals}
              disabled={loadingGoals}
              className="w-full text-center text-xs text-white/50 hover:text-white/80 transition-colors py-1"
            >
              {loadingGoals ? '⏳ Cargando...' : showGoals ? '▲ Ocultar goles' : '▼ Ver goleadores'}
            </button>
            {showGoals && goals.length > 0 && (
              <div className="mt-2 space-y-1">
                {goals.map((goal, idx) => {
                  const isHome = goal.team.id === getTeam(match.team1).id;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm bg-white/5 rounded-lg px-3 py-1.5">
                      <span className="text-white/40 text-xs w-8 text-right">{goal.minute}'{goal.injuryTime ? `+${goal.injuryTime}` : ''}</span>
                      <GoalIcon type={goal.type} />
                      <span className="text-white font-medium flex-1">{goal.scorer.name}</span>
                      {goal.assist && (
                        <span className="text-white/40 text-xs">({goal.assist.name})</span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${isHome ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>
                        {isHome ? t1.name : t2.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {showGoals && goals.length === 0 && !loadingGoals && (
              <div className="mt-2 text-center text-white/30 text-xs">{goalError || 'No hay datos de goles disponibles'}</div>
            )}
          </div>
        )}

        <div className="bg-white/5 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <span>📅</span>
            <span className="text-white/70">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>🇪🇸</span>
            <span className="text-white/70 font-semibold">{spainTimeStr}</span>
            <span className="text-white/40">Hora España</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>🕐</span>
            <span className="text-white/50">{localTimeStr}</span>
            <span className="text-white/40">Hora local ({match.city})</span>
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

import { useState, useEffect, useCallback } from 'react';
import {
  subscribeLogs,
  getLogEntries,
  getRequestsPerMinute,
  getTotalRequests,
  getSuccessRate,
  getAvgResponseTime,
  getConnectedClients,
  getAllUniqueClients,
  getClientId,
} from '../services/apiLogger';

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function timeAgo(date: Date): string {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 5) return 'ahora';
  if (secs < 60) return `hace ${secs}s`;
  if (secs < 3600) return `hace ${Math.floor(secs / 60)}m`;
  return `hace ${Math.floor(secs / 3600)}h`;
}

function timeAgoDate(ts: number): string {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return 'ahora';
  if (secs < 3600) return `hace ${Math.floor(secs / 60)}m`;
  if (secs < 86400) return `hace ${Math.floor(secs / 3600)}h`;
  return `hace ${Math.floor(secs / 86400)}d`;
}

interface RefreshStatus {
  [key: string]: 'idle' | 'loading' | 'done' | 'error';
}

export default function ConsoleDashboard() {
  const [, forceUpdate] = useState(0);
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>({});
  const [showAllClients, setShowAllClients] = useState(false);
  const [matchGoalProgress, setMatchGoalProgress] = useState('');
  const clientId = getClientId();

  useEffect(() => {
    const unsub = subscribeLogs(() => forceUpdate(n => n + 1));
    const interval = setInterval(() => forceUpdate(n => n + 1), 2000);
    return () => { unsub(); clearInterval(interval); };
  }, []);

  const triggerRefresh = useCallback(async (key: string, fn: () => Promise<unknown>) => {
    setRefreshStatus(prev => ({ ...prev, [key]: 'loading' }));
    try {
      await fn();
      setRefreshStatus(prev => ({ ...prev, [key]: 'done' }));
      setTimeout(() => setRefreshStatus(prev => ({ ...prev, [key]: 'idle' })), 2000);
    } catch {
      setRefreshStatus(prev => ({ ...prev, [key]: 'error' }));
      setTimeout(() => setRefreshStatus(prev => ({ ...prev, [key]: 'idle' })), 3000);
    }
  }, []);

  const handleRefreshMatches = () => triggerRefresh('matches', async () => {
    const { fetchMatches } = await import('../services/api');
    await fetchMatches();
  });

  const handleRefreshStandings = () => triggerRefresh('standings', async () => {
    const { fetchStandings } = await import('../services/api');
    await fetchStandings();
  });

  const handleRefreshScorers = () => triggerRefresh('scorers', async () => {
    const { fetchScorers } = await import('../services/api');
    await fetchScorers();
  });

  const handleRefreshAll = () => triggerRefresh('all', async () => {
    const api = await import('../services/api');
    await Promise.all([api.fetchMatches(), api.fetchStandings(), api.fetchScorers()]);
  });

  const handleLoadAllGoals = async () => {
    triggerRefresh('goals', async () => {
      const { fetchMatches, fetchMatchDetail } = await import('../services/api');
      const { getTeam } = await import('../data/matches');
      const matches = await fetchMatches();
      const completed = matches.filter(m => m.status === 'completed' && m.score1 !== undefined);
      setMatchGoalProgress(`0/${completed.length}`);
      for (let i = 0; i < completed.length; i++) {
        setMatchGoalProgress(`${i + 1}/${completed.length}`);
        try {
          const t1 = getTeam(completed[i].team1);
          const t2 = getTeam(completed[i].team2);
          await fetchMatchDetail(completed[i].id, t1.name, t2.name);
        } catch {}
        // Rate limit: max 10 calls/min on free tier, wait 7s between calls
        if (i < completed.length - 1) {
          await new Promise(r => setTimeout(r, 7000));
        }
      }
      setMatchGoalProgress('');
    });
  };

  const entries = getLogEntries();
  const rpm = getRequestsPerMinute();
  const total = getTotalRequests();
  const successRate = getSuccessRate();
  const avgTime = getAvgResponseTime();
  const clients = getConnectedClients();
  const allClients = getAllUniqueClients();

  const statusColor = (s: string) => {
    if (s === 'loading') return 'bg-yellow-500 text-white cursor-wait';
    if (s === 'done') return 'bg-green-500 text-white';
    if (s === 'error') return 'bg-red-500 text-white';
    return 'bg-white/10 text-white hover:bg-white/20';
  };

  const statusLabel = (s: string) => {
    if (s === 'loading') return '⏳...';
    if (s === 'done') return '✅ OK';
    if (s === 'error') return '❌ Error';
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-green-400">🖥️ API Console</h1>
            <p className="text-white/40 text-sm mt-1">World Cup 2026 Dashboard · Client: {clientId}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-sm">Activo</span>
          </div>
        </div>

        {/* Refresh buttons */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-8">
          <h3 className="text-sm font-bold text-white/70 mb-3">🔄 Acciones manuales</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRefreshMatches}
              disabled={refreshStatus.matches === 'loading'}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusColor(refreshStatus.matches || 'idle')}`}
            >
              {refreshStatus.matches === 'idle' ? '⚽ Actualizar partidos' : statusLabel(refreshStatus.matches)}
            </button>
            <button
              onClick={handleRefreshStandings}
              disabled={refreshStatus.standings === 'loading'}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusColor(refreshStatus.standings || 'idle')}`}
            >
              {refreshStatus.standings === 'idle' ? '📊 Actualizar clasificación' : statusLabel(refreshStatus.standings)}
            </button>
            <button
              onClick={handleRefreshScorers}
              disabled={refreshStatus.scorers === 'loading'}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusColor(refreshStatus.scorers || 'idle')}`}
            >
              {refreshStatus.scorers === 'idle' ? '🏆 Actualizar goleadores' : statusLabel(refreshStatus.scorers)}
            </button>
            <button
              onClick={handleRefreshAll}
              disabled={refreshStatus.all === 'loading'}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusColor(refreshStatus.all || 'idle')}`}
            >
              {refreshStatus.all === 'idle' ? '🚀 Actualizar todo' : statusLabel(refreshStatus.all)}
            </button>
            <button
              onClick={handleLoadAllGoals}
              disabled={refreshStatus.goals === 'loading'}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusColor(refreshStatus.goals || 'idle')}`}
            >
              {refreshStatus.goals === 'idle' ? '🥅 Cargar goles de todos los partidos' :
               refreshStatus.goals === 'loading' ? `⏳ ${matchGoalProgress}` :
               statusLabel(refreshStatus.goals)}
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-white/40 text-xs mb-1">Peticiones/min</div>
            <div className="text-2xl font-bold text-green-400">{rpm}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-white/40 text-xs mb-1">Total peticiones</div>
            <div className="text-2xl font-bold text-blue-400">{total}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-white/40 text-xs mb-1">Tasa éxito</div>
            <div className={`text-2xl font-bold ${successRate >= 90 ? 'text-green-400' : successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
              {successRate}%
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-white/40 text-xs mb-1">Tiempo medio</div>
            <div className="text-2xl font-bold text-purple-400">{formatDuration(avgTime)}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-white/40 text-xs mb-1">Conectados ahora</div>
            <div className="text-2xl font-bold text-cyan-400">{clients.length}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-white/40 text-xs mb-1">Visitantes únicos</div>
            <div className="text-2xl font-bold text-orange-400">{allClients.length}</div>
          </div>
        </div>

        {/* Clients section */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-8">
          <button
            onClick={() => setShowAllClients(!showAllClients)}
            className="w-full flex items-center justify-between text-sm font-bold text-white/70 hover:text-white/90 transition-colors"
          >
            <span>📡 Clientes · {clients.length} conectados · {allClients.length} únicos</span>
            <span>{showAllClients ? '▲' : '▼'}</span>
          </button>

          {showAllClients && (
            <div className="mt-4 space-y-4">
              {/* Active clients */}
              <div>
                <h4 className="text-xs text-green-400 font-bold mb-2">🟢 Conectados ahora ({clients.length})</h4>
                <div className="space-y-1">
                  {clients.map(c => (
                    <div key={c.id} className="flex items-center gap-3 text-sm bg-white/5 rounded-lg px-3 py-1.5">
                      <span className={`w-2 h-2 rounded-full ${c.id === clientId ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                      <span className="text-white/60 font-mono">{c.id}</span>
                      {c.id === clientId && <span className="text-green-400 text-xs">(este cliente)</span>}
                      <span className="text-white/30 text-xs flex-1 truncate hidden md:block">{c.userAgent}</span>
                    </div>
                  ))}
                  {clients.length === 0 && <p className="text-white/30 text-xs">No hay clientes activos</p>}
                </div>
              </div>

              {/* All unique clients */}
              <div>
                <h4 className="text-xs text-orange-400 font-bold mb-2">📋 Todos los visitantes ({allClients.length})</h4>
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {allClients.map(c => (
                    <div key={c.id} className="flex items-center gap-3 text-sm bg-white/5 rounded-lg px-3 py-1.5">
                      <span className={`w-2 h-2 rounded-full ${c.id === clientId ? 'bg-green-400' : Date.now() - c.lastSeen < 15000 ? 'bg-blue-400' : 'bg-white/20'}`}></span>
                      <span className="text-white/60 font-mono">{c.id}</span>
                      {c.id === clientId && <span className="text-green-400 text-xs">(este)</span>}
                      <span className="text-white/30 text-xs">{c.visits} visita{c.visits > 1 ? 's' : ''}</span>
                      <span className="text-white/30 text-xs flex-1 truncate hidden md:block">{c.userAgent}</span>
                      <span className="text-white/20 text-xs whitespace-nowrap">{timeAgoDate(c.lastSeen)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Request log */}
        <div className="bg-white/5 rounded-xl border border-white/10">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white/70">📋 Log de peticiones ({entries.length})</h3>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Limpiar
            </button>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {entries.length === 0 ? (
              <div className="p-8 text-center text-white/30">
                <p>No hay peticiones registradas todavía.</p>
                <p className="text-xs mt-1">Usa los botones de arriba o navega la app para generar tráfico.</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-white/40 border-b border-white/5">
                    <th className="px-4 py-2 text-left">Hora</th>
                    <th className="px-4 py-2 text-left">Método</th>
                    <th className="px-4 py-2 text-left">Endpoint</th>
                    <th className="px-4 py-2 text-center">Status</th>
                    <th className="px-4 py-2 text-right">Tiempo</th>
                    <th className="px-4 py-2 text-right">Tamaño</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => {
                    const endpoint = entry.url
                      .replace(/.*\/api\//, '/api/')
                      .replace(/\?.*$/, '')
                      .replace('https://api.football-data.org/v4', '[FD]');
                    return (
                      <tr
                        key={entry.id}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                          !entry.success ? 'bg-red-500/5' : ''
                        }`}
                      >
                        <td className="px-4 py-2 text-white/50 whitespace-nowrap">{timeAgo(entry.timestamp)}</td>
                        <td className="px-4 py-2">
                          <span className={`font-bold ${
                            entry.method === 'GET' ? 'text-green-400' : 'text-yellow-400'
                          }`}>{entry.method}</span>
                        </td>
                        <td className="px-4 py-2 text-white/80 max-w-[300px] truncate" title={entry.url}>
                          {endpoint}
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span className={`font-bold ${
                            !entry.status ? 'text-red-400' :
                            entry.status < 300 ? 'text-green-400' :
                            entry.status < 400 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {entry.status || 'ERR'}
                          </span>
                        </td>
                        <td className={`px-4 py-2 text-right ${
                          entry.duration > 3000 ? 'text-red-400' :
                          entry.duration > 1000 ? 'text-yellow-400' :
                          'text-white/60'
                        }`}>
                          {formatDuration(entry.duration)}
                        </td>
                        <td className="px-4 py-2 text-right text-white/40">
                          {formatSize(entry.responseSize)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  subscribeLogs,
  getLogEntries,
  getRequestsPerMinute,
  getTotalRequests,
  getSuccessRate,
  getAvgResponseTime,
  getConnectedClients,
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

export default function ConsoleDashboard() {
  const [, forceUpdate] = useState(0);
  const clientId = getClientId();

  useEffect(() => {
    const unsub = subscribeLogs(() => forceUpdate(n => n + 1));
    const interval = setInterval(() => forceUpdate(n => n + 1), 2000);
    return () => { unsub(); clearInterval(interval); };
  }, []);

  const entries = getLogEntries();
  const rpm = getRequestsPerMinute();
  const total = getTotalRequests();
  const successRate = getSuccessRate();
  const avgTime = getAvgResponseTime();
  const clients = getConnectedClients();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-mono">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
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

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
            <div className="text-white/40 text-xs mb-1">Clientes activos</div>
            <div className="text-2xl font-bold text-cyan-400">{clients.length}</div>
          </div>
        </div>

        {/* Clients list */}
        {clients.length > 1 && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-8">
            <h3 className="text-sm font-bold text-white/70 mb-3">📡 Clientes conectados ({clients.length})</h3>
            <div className="space-y-2">
              {clients.map(c => (
                <div key={c.id} className="flex items-center gap-3 text-sm">
                  <span className={`w-2 h-2 rounded-full ${c.id === clientId ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                  <span className="text-white/60 font-mono">{c.id}</span>
                  {c.id === clientId && <span className="text-green-400 text-xs">(este cliente)</span>}
                  <span className="text-white/30 text-xs flex-1 truncate">{c.userAgent}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request log */}
        <div className="bg-white/5 rounded-xl border border-white/10">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white/70">📋 Log de peticiones ({entries.length})</h3>
            <button
              onClick={() => { if (confirm('¿Borrar todo el log?')) window.location.reload(); }}
              className="text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              Limpiar
            </button>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {entries.length === 0 ? (
              <div className="p-8 text-center text-white/30">
                <p>No hay peticiones registradas todavía.</p>
                <p className="text-xs mt-1">Navega por la app para ver las peticiones aquí.</p>
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

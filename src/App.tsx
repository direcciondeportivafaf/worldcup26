import { useState, useEffect } from 'react';
import DualClock from './components/DualClock';
import Standings from './components/Standings';
import MatchSchedule from './components/MatchSchedule';
import Stadiums from './components/Stadiums';
import TournamentStats from './components/TournamentStats';
import Countdown from './components/Countdown';
import SearchBar from './components/SearchBar';
import { matches as staticMatches, teams } from './data/matches';
import { useLiveMatches } from './hooks/useLiveMatches';

type Tab = 'inicio' | 'partidos' | 'clasificacion' | 'sedes' | 'estadisticas' | 'buscar';

// Current app version - bump on each deploy to force cache refresh
const APP_VERSION = '2.1.0';

function useVersionCheck() {
  const [newVersion, setNewVersion] = useState<string | null>(null);

  useEffect(() => {
    // Check for new version every 60 seconds
    const check = async () => {
      try {
        const res = await fetch(`/index.html?t=${Date.now()}`, { cache: 'no-store' });
        const html = await res.text();
        const match = html.match(/app-version" content="([^"]+)"/);
        if (match && match[1] !== APP_VERSION) {
          setNewVersion(match[1]);
        }
      } catch {}
    };
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, []);

  const applyUpdate = () => {
    window.location.reload();
  };

  return { newVersion, applyUpdate };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [selectedRound, setSelectedRound] = useState('Fase de Grupos');
  const [selectedGroup, setSelectedGroup] = useState('');

  const { matches: apiMatches, standings, loading, lastUpdated, refresh, dataSource } = useLiveMatches();
  const { newVersion, applyUpdate } = useVersionCheck();

  // Use API data when available, fall back to static
  const matches = apiMatches.length > 0 ? apiMatches : staticMatches;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'inicio', label: 'Inicio', icon: '🏠' },
    { key: 'buscar', label: 'Buscar', icon: '🔍' },
    { key: 'partidos', label: 'Partidos', icon: '⚽' },
    { key: 'clasificacion', label: 'Clasificación', icon: '📊' },
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
              <DualClock
                matchCityTimezone="America/Mexico_City"
                matchCityName="Estadio Azteca 🇲🇽"
              />
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

            {/* New version banner */}
            {newVersion && (
              <div className="mt-3 bg-green-500/20 border border-green-500/40 rounded-lg px-4 py-2 flex items-center justify-center gap-3">
                <span className="text-green-300 text-sm">✨ Nueva versión disponible</span>
                <button
                  onClick={applyUpdate}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-green-400 transition-colors"
                >
                  Actualizar ahora
                </button>
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
          <HomePage matches={matches} />
        )}
        {activeTab === 'buscar' && (
          <SearchBar matches={matches} />
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

function HomePage({ matches }: { matches: typeof staticMatches }) {
  const completed = matches.filter(match => match.status === 'completed');
  const upcoming = matches
    .filter(match => match.status === 'upcoming')
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.time.localeCompare(b.time);
    });
  const next3Matches = upcoming.slice(0, 3);

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
      </div>

      {/* Stats grid */}
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
                      <span className="text-3xl block">{t1?.flag || '❓'}</span>
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
                      <span className="text-3xl block">{t2?.flag || '❓'}</span>
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
              <span className="text-2xl block">{team.flag}</span>
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
    </div>
  );
}

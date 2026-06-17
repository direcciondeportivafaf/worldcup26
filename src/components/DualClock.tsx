import { useState, useEffect } from 'react';
import CountryFlag from './CountryFlag';

interface DualClockProps {
  matchCityTimezone?: string;
  matchCityName?: string;
  country?: string;
}

export default function DualClock({ matchCityTimezone, matchCityName, country }: DualClockProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const spainTime = now.toLocaleTimeString('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const spainDate = now.toLocaleDateString('es-ES', {
    timeZone: 'Europe/Madrid',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const localTz = matchCityTimezone || 'America/New_York';
  const localTime = now.toLocaleTimeString('es-ES', {
    timeZone: localTz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const localDate = now.toLocaleDateString('es-ES', {
    timeZone: localTz,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const spainOffset = now.toLocaleTimeString('en-US', {
    timeZone: 'Europe/Madrid',
    timeZoneName: 'shortOffset',
  }).split(' ').pop() || '';

  const localOffset = now.toLocaleTimeString('en-US', {
    timeZone: localTz,
    timeZoneName: 'shortOffset',
  }).split(' ').pop() || '';

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center">
      <div className="bg-gradient-to-br from-yellow-400 to-red-600 rounded-xl px-5 py-3 shadow-lg border-2 border-yellow-300 min-w-[200px] text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <CountryFlag country="Spain" size="md" />
          <span className="text-white font-bold text-sm uppercase tracking-wider">Hora de España</span>
        </div>
        <div className="text-3xl font-mono font-bold text-white drop-shadow">{spainTime}</div>
        <div className="text-xs text-yellow-200 mt-1">{spainDate} · {spainOffset}</div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl px-5 py-3 shadow-lg border-2 border-blue-400 min-w-[200px] text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          {country ? <CountryFlag country={country} size="md" /> : <span className="text-lg">🌎</span>}
          <span className="text-white font-bold text-sm uppercase tracking-wider">
            {matchCityName || 'Sede del partido'}
          </span>
        </div>
        <div className="text-3xl font-mono font-bold text-white drop-shadow">{localTime}</div>
        <div className="text-xs text-blue-200 mt-1">{localDate} · {localOffset}</div>
      </div>
    </div>
  );
}

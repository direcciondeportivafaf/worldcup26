import { useState, useEffect } from 'react';
import CountryFlag from './CountryFlag';

interface SimpleClockProps {
  timezone: string;
  label: string;
  country?: string;
  flag?: string;
}

export default function SimpleClock({ timezone, label, country, flag }: SimpleClockProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString('es-ES', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const date = now.toLocaleDateString('es-ES', {
    timeZone: timezone,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        {country ? <CountryFlag country={country} size="md" /> : <span className="text-lg">{flag}</span>}
        <span className="text-white/60 text-xs uppercase">{label}</span>
      </div>
      <div className="text-2xl font-mono font-bold text-white">{time}</div>
      <div className="text-xs text-white/40">{date}</div>
    </div>
  );
}

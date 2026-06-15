import { useState, useEffect } from 'react';
import { matches as staticMatches, Match } from '../data/matches';

export default function Countdown({ matches: apiMatches }: { matches?: Match[] }) {
  const matches = apiMatches && apiMatches.length > 0 ? apiMatches : staticMatches;
  const [now, setNow] = useState(new Date());

  const nextMatch = matches
    .filter(m => m.status === 'upcoming')
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}:00Z`);
      const dateB = new Date(`${b.date}T${b.time}:00Z`);
      return dateA.getTime() - dateB.getTime();
    })[0];

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!nextMatch) {
    return (
      <div className="text-center py-4">
        <div className="text-2xl text-white/50">🏆 ¡Torneo finalizado!</div>
      </div>
    );
  }

  const matchDate = new Date(`${nextMatch.date}T${nextMatch.time}:00Z`);
  const diff = matchDate.getTime() - now.getTime();

  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

  return (
    <div className="text-center py-6">
      <div className="text-white/60 text-sm mb-3">⏱️ Cuenta atrás para el próximo partido</div>
      <div className="flex items-center justify-center gap-3">
        {[
          { value: days, label: 'Días' },
          { value: hours, label: 'Horas' },
          { value: minutes, label: 'Min' },
          { value: seconds, label: 'Seg' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white/10 rounded-xl px-4 py-3 min-w-[70px]">
            <div className="text-3xl font-mono font-black text-white">{String(item.value).padStart(2, '0')}</div>
            <div className="text-xs text-white/50">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

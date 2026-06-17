import { hostCities, matches } from '../data/matches';
import SimpleClock from './SimpleClock';
import DualClock from './DualClock';
import CountryFlag from './CountryFlag';

export default function Stadiums() {
  const countryGroups = {
    'USA': hostCities.filter(c => c.country === 'USA'),
    'Canada': hostCities.filter(c => c.country === 'Canada'),
    'Mexico': hostCities.filter(c => c.country === 'Mexico'),
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">🏟️ Sedes del Mundial 2026</h2>
        <p className="text-white/60">16 ciudades en 3 países</p>
      </div>

      {(['USA', 'Canada', 'Mexico'] as const).map(country => (
        <div key={country} className="mb-10">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CountryFlag country={country} size="lg" />
            {country}
            <span className="text-sm font-normal text-white/50">
              ({countryGroups[country].length} ciudades)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countryGroups[country].map(city => {
              const cityMatches = matches.filter(m => m.city === city.name);
              return (
                <div key={city.name} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-white/30 transition-all hover:bg-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-bold text-lg">{city.name}</h4>
                      <p className="text-white/50 text-sm">{city.stadium}</p>
                    </div>
                    <CountryFlag country={country} size="lg" />
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <div>
                      <span className="text-xs text-white/40">Partidos</span>
                      <div className="text-white font-bold">{cityMatches.length}</div>
                    </div>
                    <div>
                      <span className="text-xs text-white/40">Zona horaria</span>
                      <div className="text-white/70 text-sm">{city.timezone}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Live clocks for all three countries */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <h3 className="text-xl font-bold text-white mb-6 text-center">🕐 Relojes de las Sedes en Tiempo Real</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-600/30 to-blue-800/20 rounded-xl px-5 py-6 shadow-lg border border-blue-400/20">
            <SimpleClock timezone="America/New_York" label="USA (Este)" country="USA" />
          </div>
          <div className="bg-gradient-to-br from-red-600/30 to-red-800/20 rounded-xl px-5 py-6 shadow-lg border border-red-400/20">
            <SimpleClock timezone="America/Toronto" label="Canadá" country="Canada" />
          </div>
          <div className="bg-gradient-to-br from-green-600/30 to-green-800/20 rounded-xl px-5 py-6 shadow-lg border border-green-400/20">
            <SimpleClock timezone="America/Mexico_City" label="México" country="Mexico" />
          </div>
        </div>
        <div className="mt-6">
          <DualClock matchCityTimezone="America/Mexico_City" matchCityName="Estadio Azteca" country="Mexico" />
        </div>
      </div>
    </div>
  );
}

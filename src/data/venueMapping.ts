// Venue mapping for the 2026 World Cup
// The API doesn't provide venue data, so we maintain this static mapping.
// Groups are distributed across host countries:
//   USA: Groups B, D, F, H, J, L + some knockout rounds
//   Canada: Groups C, some knockout rounds
//   Mexico: Groups A, E, G, I, K + Final

import { hostCities } from './matches';

interface VenueInfo {
  city: string;
  country: 'USA' | 'Canada' | 'Mexico';
}

// Group-stage venue assignment by group
// Each group plays in 2-3 specific venues
const GROUP_VENUES: Record<string, VenueInfo[]> = {
  'A': [
    { city: 'Estadio Azteca', country: 'Mexico' },
    { city: 'Guadalajara', country: 'Mexico' },
    { city: 'Monterrey', country: 'Mexico' },
  ],
  'B': [
    { city: 'Los Ángeles', country: 'USA' },
    { city: 'San Francisco Bay', country: 'USA' },
    { city: 'Houston', country: 'USA' },
  ],
  'C': [
    { city: 'Toronto', country: 'Canada' },
    { city: 'Vancouver', country: 'Canada' },
    { city: 'Nueva York/NJ', country: 'USA' },
  ],
  'D': [
    { city: 'Estadio Azteca', country: 'Mexico' },
    { city: 'Dallas', country: 'USA' },
    { city: 'Miami Gardens', country: 'USA' },
  ],
  'E': [
    { city: 'Guadalajara', country: 'Mexico' },
    { city: 'Filadelfia', country: 'USA' },
    { city: 'Boston', country: 'USA' },
  ],
  'F': [
    { city: 'San Francisco Bay', country: 'USA' },
    { city: 'Atlanta', country: 'USA' },
    { city: 'Nueva York/NJ', country: 'USA' },
  ],
  'G': [
    { city: 'Monterrey', country: 'Mexico' },
    { city: 'Los Ángeles', country: 'USA' },
    { city: 'Miami Gardens', country: 'USA' },
  ],
  'H': [
    { city: 'Atlanta', country: 'USA' },
    { city: 'Vancouver', country: 'Canada' },
    { city: 'Houston', country: 'USA' },
  ],
  'I': [
    { city: 'Estadio Azteca', country: 'Mexico' },
    { city: 'San Francisco Bay', country: 'USA' },
    { city: 'Filadelfia', country: 'USA' },
  ],
  'J': [
    { city: 'Atlanta', country: 'USA' },
    { city: 'Los Ángeles', country: 'USA' },
    { city: 'Dallas', country: 'USA' },
  ],
  'K': [
    { city: 'Monterrey', country: 'Mexico' },
    { city: 'Miami Gardens', country: 'USA' },
    { city: 'Kansas City', country: 'USA' },
  ],
  'L': [
    { city: 'Vancouver', country: 'Canada' },
    { city: 'Toronto', country: 'Canada' },
    { city: 'Nueva York/NJ', country: 'USA' },
  ],
};

// Knockout round venues by stage
const KNOCKOUT_VENUES: Record<string, VenueInfo[]> = {
  'Dieciseisavos': [
    { city: 'Atlanta', country: 'USA' },
    { city: 'Dallas', country: 'USA' },
    { city: 'Houston', country: 'USA' },
    { city: 'Miami Gardens', country: 'USA' },
    { city: 'Los Ángeles', country: 'USA' },
    { city: 'Nueva York/NJ', country: 'USA' },
    { city: 'Estadio Azteca', country: 'Mexico' },
    { city: 'Kansas City', country: 'USA' },
    { city: 'Boston', country: 'USA' },
    { city: 'Filadelfia', country: 'USA' },
    { city: 'San Francisco Bay', country: 'USA' },
    { city: 'Toronto', country: 'Canada' },
    { city: 'Guadalajara', country: 'Mexico' },
    { city: 'Monterrey', country: 'Mexico' },
    { city: 'Vancouver', country: 'Canada' },
  ],
  'Octavos': [
    { city: 'Atlanta', country: 'USA' },
    { city: 'Nueva York/NJ', country: 'USA' },
    { city: 'Los Ángeles', country: 'USA' },
    { city: 'Houston', country: 'USA' },
    { city: 'Dallas', country: 'USA' },
    { city: 'Estadio Azteca', country: 'Mexico' },
    { city: 'Filadelfia', country: 'USA' },
    { city: 'Kansas City', country: 'USA' },
  ],
  'Cuartos': [
    { city: 'Nueva York/NJ', country: 'USA' },
    { city: 'Atlanta', country: 'USA' },
    { city: 'Los Ángeles', country: 'USA' },
    { city: 'Dallas', country: 'USA' },
  ],
  'Semifinales': [
    { city: 'Miami Gardens', country: 'USA' },
    { city: 'Estadio Azteca', country: 'Mexico' },
  ],
  'Tercer Lugar': [
    { city: 'Boston', country: 'USA' },
  ],
  'Final': [
    { city: 'Estadio Azteca', country: 'Mexico' },
  ],
};

// Counter for venue assignment within each round/group
const venueCounters: Record<string, number> = {};

/**
 * Get venue info for a match based on its group, round, and match order
 */
export function getVenue(
  group: string | undefined,
  round: string,
  matchIndexInGroup: number,
): VenueInfo {
  if (group && GROUP_VENUES[group]) {
    const venues = GROUP_VENUES[group];
    return venues[matchIndexInGroup % venues.length];
  }

  // Knockout match
  const venues = KNOCKOUT_VENUES[round];
  if (venues) {
    const key = `knockout_${round}`;
    const idx = venueCounters[key] || 0;
    venueCounters[key] = idx + 1;
    return venues[idx % venues.length];
  }

  return { city: 'Estadio Azteca', country: 'Mexico' };
}

/**
 * Apply venue data to a list of matches (mutates in place)
 */
export function applyVenueToMatch(
  match: { city: string; country: string; group?: string; round: string },
  groupMatchIndex: number,
): void {
  const venue = getVenue(match.group, match.round, groupMatchIndex);
  match.city = venue.city;
  match.country = venue.country;
}

/**
 * Find host city info for a given city name
 */
export function getHostCityInfo(cityName: string) {
  return hostCities.find(c => c.name === cityName);
}

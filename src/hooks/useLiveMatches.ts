import { useState, useEffect, useCallback, useRef } from 'react';
import { Match, matches as staticMatches } from '../data/matches';
import { fetchMatches, ApiStanding, fetchStandings } from '../services/api';
import { applyVenueToMatch } from '../data/venueMapping';

const REFRESH_INTERVAL = 30_000; // 30 seconds

interface UseLiveMatchesResult {
  matches: Match[];
  standings: Record<string, ApiStanding[]>;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  dataSource: 'api' | 'static';
}

/**
 * Group matches by group and assign venue indices for proper city assignment
 */
function assignVenues(matches: Match[]): Match[] {
  // Count matches per group for venue assignment
  const groupCounters: Record<string, number> = {};

  return matches.map(m => {
    const copy = { ...m };
    if (copy.group) {
      const key = copy.group;
      groupCounters[key] = (groupCounters[key] || 0);
      const idx = groupCounters[key];
      groupCounters[key]++;
      applyVenueToMatch(copy, idx);
    } else {
      // For knockout matches, we use a simple counter by round
      applyVenueToMatch(copy, 0);
    }
    return copy;
  });
}

export function useLiveMatches(): UseLiveMatchesResult {
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Record<string, ApiStanding[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<'api' | 'static'>('static');
  const mountedRef = useRef(true);

  const loadData = useCallback(async () => {
    try {
      setError(null);

      // Fetch matches independently - this is critical
      let apiMatches: Match[] = [];
      let matchesOk = false;
      try {
        apiMatches = await fetchMatches();
        const hasGroupStage = apiMatches.some(m => m.round === 'Fase de Grupos' && m.group);
        if (hasGroupStage && apiMatches.length > 0) {
          matchesOk = true;
        }
      } catch (e) {
        console.error('[API] fetchMatches failed:', e);
      }

      if (!mountedRef.current) return;

      if (matchesOk) {
        const matchesWithVenues = assignVenues(apiMatches);
        setMatches(matchesWithVenues);
        setDataSource('api');
        console.log(`[API] Using live data: ${apiMatches.length} matches`);
      } else {
        console.warn('[API] API data invalid, using static fallback');
        setMatches(staticMatches);
        setDataSource('static');
        setError('No se pudieron obtener datos de la API');
      }

      // Fetch standings independently - don't let this break matches
      try {
        const standingsData = await fetchStandings();
        if (mountedRef.current) setStandings(standingsData);
      } catch (e) {
        console.error('[API] fetchStandings failed:', e);
      }

      if (mountedRef.current) setLastUpdated(new Date());
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('[API] Unexpected error:', err);
      setMatches(staticMatches);
      setDataSource('static');
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadData();

    const interval = setInterval(() => {
      if (mountedRef.current) loadData();
    }, REFRESH_INTERVAL);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [loadData]);

  return { matches, standings, loading, error, lastUpdated, refresh: loadData, dataSource };
}

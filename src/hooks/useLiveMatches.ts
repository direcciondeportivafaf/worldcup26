import { useState, useEffect, useCallback, useRef } from 'react';
import { Match } from '../data/matches';
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
  const mountedRef = useRef(true);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [rawMatches, standingsData] = await Promise.all([
        fetchMatches(),
        fetchStandings(),
      ]);

      if (!mountedRef.current) return;

      const matchesWithVenues = assignVenues(rawMatches);
      setMatches(matchesWithVenues);
      setStandings(standingsData);
      setLastUpdated(new Date());
    } catch (err) {
      if (!mountedRef.current) return;
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

  return { matches, standings, loading, error, lastUpdated, refresh: loadData };
}

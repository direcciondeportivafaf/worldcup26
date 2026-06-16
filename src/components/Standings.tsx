import { useState, useMemo } from 'react';
import { matches as staticMatches, teams, Match } from '../data/matches';
import { ApiStanding } from '../services/api';
import FlagImg from './FlagImg';

interface TeamStanding {
  team: typeof teams[0];
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

function calculateStandingsFromMatches(matches: Match[]): Record<string, TeamStanding[]> {
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  const groupMatches = matches.filter(m => m.group && m.status === 'completed');

  const standings: Record<string, TeamStanding[]> = {};

  groups.forEach(group => {
    const groupTeams = teams.filter(t => t.group === group);
    standings[group] = groupTeams.map(team => ({
      team,
      played: 0, won: 0, drawn: 0, lost: 0,
      goalsFor: 0, goalsAgainst: 0, goalDiff: 0, points: 0,
    }));

    const teamMatches = groupMatches.filter(m => m.group === group);
    teamMatches.forEach(match => {
      const t1 = standings[group]?.find(s => s.team.id === match.team1);
      const t2 = standings[group]?.find(s => s.team.id === match.team2);

      if (t1 && t2 && match.score1 !== undefined && match.score2 !== undefined) {
        t1.played++; t2.played++;
        t1.goalsFor += match.score1!; t1.goalsAgainst += match.score2!;
        t2.goalsFor += match.score2!; t2.goalsAgainst += match.score1!;
        t1.goalDiff = t1.goalsFor - t1.goalsAgainst;
        t2.goalDiff = t2.goalsFor - t2.goalsAgainst;

        if (match.score1 > match.score2) {
          t1.won++; t1.points += 3; t2.lost++;
        } else if (match.score1 < match.score2) {
          t2.won++; t2.points += 3; t1.lost++;
        } else {
          t1.drawn++; t2.drawn++; t1.points++; t2.points++;
        }
      }
    });

    standings[group].sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      return b.goalsFor - a.goalsFor;
    });
  });

  return standings;
}

export default function Standings({ standings: apiStandings, matches: apiMatches, selectedGroup, onGroupSelect }: {
  standings: Record<string, ApiStanding[]>;
  matches: Match[];
  selectedGroup: string;
  onGroupSelect: (g: string) => void;
}) {
  const [teamSearch, setTeamSearch] = useState('');
  const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  const searchResults = useMemo(() => {
    if (!teamSearch.trim()) return [];
    const q = teamSearch.toLowerCase().trim();
    return teams.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  }, [teamSearch]);

  const handleSearchSelect = (team: typeof teams[0]) => {
    setTeamSearch(team.name);
    onGroupSelect(team.group);
  };

  // Use API standings if available, otherwise calculate from matches
  const hasApiStandings = Object.keys(apiStandings).length > 0;
  const hasGroupStageMatches = apiMatches.some(m => m.round === 'Fase de Grupos');
  const matches = apiMatches.length > 0 && hasGroupStageMatches ? apiMatches : staticMatches;

  return (
    <div>
      {/* Team search */}
      <div className="max-w-md mx-auto mb-6">
        <div className="relative">
          <input
            type="text"
            value={teamSearch}
            onChange={e => setTeamSearch(e.target.value)}
            placeholder="🔍 Busca tu selección..."
            className="w-full px-5 py-3 pl-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 text-base"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
        </div>
        {teamSearch.trim() && searchResults.length > 0 && (
          <div className="mt-2 bg-gray-900/95 border border-white/15 rounded-xl shadow-xl max-h-48 overflow-y-auto">
            {searchResults.map(team => (
              <button
                key={team.id}
                onClick={() => handleSearchSelect(team)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/10 transition-all text-left"
              >
                <FlagImg teamId={team.id} emoji={team.flag} size="sm" />
                <div>
                  <span className="text-white font-medium text-sm">{team.name}</span>
                  <span className="text-white/40 text-xs ml-2">Grupo {team.group}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {groups.map(g => (
          <button
            key={g}
            onClick={() => onGroupSelect(g)}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              selectedGroup === g
                ? 'bg-green-500 text-white shadow-lg scale-105'
                : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
            }`}
          >
            Grupo {g}
          </button>
        ))}
      </div>

      {groups.map(group => {
        if (selectedGroup !== group) return null;

        if (hasApiStandings && apiStandings[group]) {
          // Group is complete when all 4 teams have played 3 matches each
          const isGroupComplete = apiStandings[group].every(s => s.played >= 3);
          // Render from API standings
          return (
            <div key={group} className="mb-6">
              <h3 className="text-xl font-bold text-white mb-3 text-center">📊 Grupo {group}</h3>
              <div className="overflow-x-auto rounded-xl shadow-xl">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="bg-white/10 text-white/90">
                      <th className="py-3 px-2 text-left text-xs">#</th>
                      <th className="py-3 px-2 text-left text-xs">Equipo</th>
                      <th className="py-3 px-2 text-center text-xs">PJ</th>
                      <th className="py-3 px-2 text-center text-xs">G</th>
                      <th className="py-3 px-2 text-center text-xs">E</th>
                      <th className="py-3 px-2 text-center text-xs">P</th>
                      <th className="py-3 px-2 text-center text-xs">GF</th>
                      <th className="py-3 px-2 text-center text-xs">GC</th>
                      <th className="py-3 px-2 text-center text-xs">DG</th>
                      <th className="py-3 px-2 text-center text-xs font-bold">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiStandings[group].map((standing, idx) => {
                      const isQualified = isGroupComplete && idx < 2;
                      const isMaybeQualified = isGroupComplete && idx >= 2 && idx <= 3;
                      return (
                        <tr
                          key={standing.teamId}
                          className={`
                            ${idx < apiStandings[group].length - 1 ? 'border-b border-white/10' : ''}
                            ${isQualified ? 'bg-green-500/10' : ''}
                            ${isMaybeQualified ? 'bg-yellow-500/5' : ''}
                            hover:bg-white/5 transition-colors
                          `}
                        >
                          <td className="py-3 px-2 text-sm">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                              isQualified ? 'bg-green-500 text-white' : isMaybeQualified ? 'bg-yellow-500 text-white' : 'bg-white/10 text-white/60'
                            }`}>
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <FlagImg teamId={standing.teamId} emoji={standing.teamFlag} size="md" />
                              <div>
                                <span className="text-white font-semibold text-sm">{standing.teamName}</span>
                                {isQualified && <span className="ml-2 text-green-400 text-xs">✓ Clasificado</span>}
                                {isMaybeQualified && <span className="ml-2 text-yellow-400 text-xs">? Top 12</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.played}</td>
                          <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.won}</td>
                          <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.drawn}</td>
                          <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.lost}</td>
                          <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.goalsFor}</td>
                          <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.goalsAgainst}</td>
                          <td className={`py-3 px-2 text-center text-sm font-medium ${
                            standing.goalDiff > 0 ? 'text-green-400' : standing.goalDiff < 0 ? 'text-red-400' : 'text-white/60'
                          }`}>
                            {standing.goalDiff > 0 ? '+' : ''}{standing.goalDiff}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className="bg-white/10 text-white font-bold px-3 py-1 rounded-full text-sm">
                              {standing.points}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        // Fallback: calculate from matches
        const calculatedStandings = calculateStandingsFromMatches(matches);
        const groupData = calculatedStandings[group];
        if (!groupData) return null;

        // Group is complete when all 6 group matches have been played
        const groupMatchCount = matches.filter(m => m.group === group && m.round === 'Fase de Grupos').length;
        const groupCompletedCount = matches.filter(m => m.group === group && m.round === 'Fase de Grupos' && m.status === 'completed').length;
        const isGroupComplete = groupCompletedCount >= groupMatchCount && groupMatchCount > 0;

        return (
          <div key={group} className="mb-6">
            <h3 className="text-xl font-bold text-white mb-3 text-center">📊 Grupo {group}</h3>
            <div className="overflow-x-auto rounded-xl shadow-xl">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-white/10 text-white/90">
                    <th className="py-3 px-2 text-left text-xs">#</th>
                    <th className="py-3 px-2 text-left text-xs">Equipo</th>
                    <th className="py-3 px-2 text-center text-xs">PJ</th>
                    <th className="py-3 px-2 text-center text-xs">G</th>
                    <th className="py-3 px-2 text-center text-xs">E</th>
                    <th className="py-3 px-2 text-center text-xs">P</th>
                    <th className="py-3 px-2 text-center text-xs">GF</th>
                    <th className="py-3 px-2 text-center text-xs">GC</th>
                    <th className="py-3 px-2 text-center text-xs">DG</th>
                    <th className="py-3 px-2 text-center text-xs font-bold">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {groupData.map((standing, idx) => {
                    const isQualified = isGroupComplete && idx < 2;
                    const isMaybeQualified = isGroupComplete && idx >= 2 && idx <= 3;
                    return (
                      <tr
                        key={standing.team.id}
                        className={`
                          ${idx < groupData.length - 1 ? 'border-b border-white/10' : ''}
                          ${isQualified ? 'bg-green-500/10' : ''}
                          ${isMaybeQualified ? 'bg-yellow-500/5' : ''}
                          hover:bg-white/5 transition-colors
                        `}
                      >
                        <td className="py-3 px-2 text-sm">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            isQualified ? 'bg-green-500 text-white' : isMaybeQualified ? 'bg-yellow-500 text-white' : 'bg-white/10 text-white/60'
                          }`}>
                            {idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                              <FlagImg teamId={standing.team.id} emoji={standing.team.flag} size="md" />
                            <div>
                              <span className="text-white font-semibold text-sm">{standing.team.name}</span>
                              {isQualified && <span className="ml-2 text-green-400 text-xs">✓ Clasificado</span>}
                              {isMaybeQualified && <span className="ml-2 text-yellow-400 text-xs">? Top 12</span>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.played}</td>
                        <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.won}</td>
                        <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.drawn}</td>
                        <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.lost}</td>
                        <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.goalsFor}</td>
                        <td className="py-3 px-2 text-center text-white/80 text-sm">{standing.goalsAgainst}</td>
                        <td className={`py-3 px-2 text-center text-sm font-medium ${
                          standing.goalDiff > 0 ? 'text-green-400' : standing.goalDiff < 0 ? 'text-red-400' : 'text-white/60'
                        }`}>
                          {standing.goalDiff > 0 ? '+' : ''}{standing.goalDiff}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <span className="bg-white/10 text-white font-bold px-3 py-1 rounded-full text-sm">
                            {standing.points}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { useMemo } from 'react';
// Dashboard component
import StatsCard from '../components/StatsCard';
import TournamentCard from '../components/TournamentCard';
import PlayerCard from '../components/PlayerCard';
import type { Player, Tournament } from '../types';

interface DashboardProps {
  players: Player[];
  tournaments: Tournament[];
  onViewTournament: (tournament: Tournament) => void;
}

export default function Dashboard({ players, tournaments, onViewTournament }: DashboardProps) {
  const stats = useMemo(() => {
    const activeTournaments = tournaments.filter(t => t.status === 'active').length;
    const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming').length;
    const completedTournaments = tournaments.filter(t => t.status === 'completed').length;
    const totalPlayers = players.length;
    const avgRating = players.length > 0
      ? Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length)
      : 0;

    return {
      activeTournaments,
      upcomingTournaments,
      completedTournaments,
      totalPlayers,
      avgRating,
    };
  }, [tournaments, players]);

  const topPlayers = useMemo(() => {
    return [...players]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [players]);

  const recentTournaments = useMemo(() => {
    return [...tournaments]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 3);
  }, [tournaments]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to Galactic Gambits</h1>
        <p className="text-gray-400">Manage your chess tournaments and track player rankings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Tournaments"
          value={stats.activeTournaments}
          icon="trophy"
        />
        <StatsCard
          title="Total Players"
          value={stats.totalPlayers}
          change="+5 this month"
          icon="users"
        />
        <StatsCard
          title="Average Rating"
          value={stats.avgRating}
          icon="trending"
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingTournaments}
          icon="calendar"
        />
      </div>

      {/* Top Players */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Top Players</h2>
          <button className="text-chess-gold hover:text-white transition-colors">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {topPlayers.map((player, index) => (
            <PlayerCard key={player.id} player={player} rank={index + 1} />
          ))}
        </div>
      </div>

      {/* Recent Tournaments */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Tournaments</h2>
          <button className="text-chess-gold hover:text-white transition-colors">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recentTournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              onClick={() => onViewTournament(tournament)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
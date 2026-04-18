import { useState, useMemo } from 'react';
import { Search, Filter, Trophy } from 'lucide-react';
import TournamentCard from '../components/TournamentCard';
import type { Tournament } from '../types';

interface TournamentsProps {
  tournaments: Tournament[];
  onViewTournament: (tournament: Tournament) => void;
}

export default function Tournaments({ tournaments, onViewTournament }: TournamentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'upcoming' | 'active' | 'completed'>('All');

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((tournament) => {
      const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tournament.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || tournament.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tournaments, searchTerm, statusFilter]);

  const tournamentCounts = useMemo(() => {
    return {
      all: tournaments.length,
      upcoming: tournaments.filter(t => t.status === 'upcoming').length,
      active: tournaments.filter(t => t.status === 'active').length,
      completed: tournaments.filter(t => t.status === 'completed').length,
    };
  }, [tournaments]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tournaments</h1>
          <p className="text-gray-400">Browse and manage all chess tournaments</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Trophy className="text-chess-gold" size={20} />
          <span className="text-white">{filteredTournaments.length} tournaments</span>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | 'upcoming' | 'active' | 'completed')}
              className="input-field"
            >
              <option value="All">All Status ({tournamentCounts.all})</option>
              <option value="upcoming">Upcoming ({tournamentCounts.upcoming})</option>
              <option value="active">Active ({tournamentCounts.active})</option>
              <option value="completed">Completed ({tournamentCounts.completed})</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tournaments Grid */}
      {filteredTournaments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
              onClick={() => onViewTournament(tournament)}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Trophy className="mx-auto text-chess-accent mb-4" size={48} />
          <p className="text-gray-400 text-lg">No tournaments found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
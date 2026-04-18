import { Trophy, Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import type { Tournament } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
  onClick: () => void;
}

const statusColors = {
  upcoming: 'bg-blue-500',
  active: 'bg-green-500',
  completed: 'bg-gray-500',
};

const formatLabels = {
  swiss: 'Swiss System',
  'round-robin': 'Round Robin',
  knockout: 'Knockout',
};

export default function TournamentCard({ tournament, onClick }: TournamentCardProps) {
  return (
    <div
      onClick={onClick}
      className="card p-6 cursor-pointer hover:border-chess-gold transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${statusColors[tournament.status]}`}>
              {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
            </span>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-chess-accent text-gray-300">
              {formatLabels[tournament.format]}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-chess-gold transition-colors">
            {tournament.name}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{tournament.description}</p>
        </div>
        <div className="w-12 h-12 bg-chess-accent rounded-lg flex items-center justify-center">
          <Trophy className="text-chess-gold" size={24} />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-400">
          <Calendar size={16} className="mr-2" />
          <span>{tournament.startDate} - {tournament.endDate}</span>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <MapPin size={16} className="mr-2" />
          <span>{tournament.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <Users size={16} className="mr-2" />
          <span>{tournament.registeredPlayers.length} / {tournament.maxPlayers} Players</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-chess-accent">
        <div>
          <span className="text-sm text-gray-400">Prize Pool: </span>
          <span className="text-lg font-bold text-chess-gold">{tournament.prizePool}</span>
        </div>
        <div className="flex items-center text-chess-gold group-hover:translate-x-1 transition-transform"
        >
          <span className="text-sm font-medium">View Details</span>
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}
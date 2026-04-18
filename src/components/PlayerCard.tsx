import { Mail, MapPin, TrendingUp, Award } from 'lucide-react';
import type { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  rank?: number;
}

export default function PlayerCard({ player, rank }: PlayerCardProps) {
  const totalGames = player.wins + player.losses + player.draws;
  const winRate = totalGames > 0 ? ((player.wins / totalGames) * 100).toFixed(1) : '0';

  return (
    <div className="card p-6 hover:border-chess-gold transition-colors duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {rank && (
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
              rank === 1 ? 'bg-yellow-500 text-black' :
              rank === 2 ? 'bg-gray-400 text-black' :
              rank === 3 ? 'bg-orange-600 text-white' :
              'bg-chess-accent text-white'
            }`}>
              #{rank}
            </div>
          )}
          <div className="w-14 h-14 bg-gradient-to-br from-chess-gold to-red-600 rounded-full flex items-center justify-center text-2xl">
            {player.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{player.name}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-400 mt-1">
              <span className="flex items-center space-x-1">
                <MapPin size={14} />
                <span>{player.country}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail size={14} />
                <span>{player.email}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center space-x-2">
            <Award className="text-chess-gold" size={20} />
            <span className="text-2xl font-bold text-white">{player.rating}</span>
            <span className="text-sm text-gray-400">Elo</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-chess-accent">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">{player.wins}</p>
          <p className="text-xs text-gray-400">Wins</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">{player.draws}</p>
          <p className="text-xs text-gray-400">Draws</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-400">{player.losses}</p>
          <p className="text-xs text-gray-400">Losses</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1">
            <TrendingUp size={16} className="text-chess-gold" />
            <p className="text-2xl font-bold text-white">{winRate}%</p>
          </div>
          <p className="text-xs text-gray-400">Win Rate</p>
        </div>
      </div>
    </div>
  );
}
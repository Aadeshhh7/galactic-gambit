import { useState, useMemo } from 'react';
import { Search, Users, Plus, Mail, MapPin, Award } from 'lucide-react';
import type { Player } from '../types';

interface PlayersProps {
  players: Player[];
  onAddPlayer: (player: Omit<Player, 'id' | 'joinDate' | 'wins' | 'losses' | 'draws'>) => void;
}

export default function Players({ players, onAddPlayer }: PlayersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlayer, setNewPlayer] = useState({
    name: '',
    email: '',
    rating: 1500,
    country: '',
  });

  const filteredPlayers = useMemo(() => {
    return players.filter((player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.country.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [players, searchTerm]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlayer(newPlayer);
    setNewPlayer({ name: '', email: '', rating: 1500, country: '' });
    setShowAddModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Players</h1>
          <p className="text-gray-400">Manage tournament participants</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Player</span>
        </button>
      </div>

      {/* Search */}
      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search players by name or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Players</p>
              <p className="text-3xl font-bold text-white">{players.length}</p>
            </div>
            <Users className="text-chess-gold" size={32} />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Average Rating</p>
              <p className="text-3xl font-bold text-white">
                {players.length > 0 ? Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length) : 0}
              </p>
            </div>
            <Award className="text-chess-gold" size={32} />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Countries</p>
              <p className="text-3xl font-bold text-white">
                {new Set(players.map(p => p.country)).size}
              </p>
            </div>
            <MapPin className="text-chess-gold" size={32} />
          </div>
        </div>
      </div>

      {/* Players Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-chess-accent">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Rank</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Player</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Country</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Rating</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-300">W</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-300">D</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-300">L</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-300">Games</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chess-accent">
              {filteredPlayers
                .sort((a, b) => b.rating - a.rating)
                .map((player, index) => (
                  <tr key={player.id} className="hover:bg-chess-accent/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'text-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-chess-gold to-red-600 rounded-full flex items-center justify-center font-bold text-white">
                          {player.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{player.name}</p>
                          <p className="text-sm text-gray-400">{player.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <MapPin size={14} />
                        <span>{player.country}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-lg font-bold text-chess-gold">{player.rating}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-green-400 font-medium">{player.wins}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-yellow-400 font-medium">{player.draws}</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-red-400 font-medium">{player.losses}</span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-400">
                      {player.wins + player.draws + player.losses}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {filteredPlayers.length === 0 && (
          <div className="p-12 text-center">
            <Users className="mx-auto text-chess-accent mb-4" size={48} />
            <p className="text-gray-400 text-lg">No players found</p>
          </div>
        )}
      </div>

      {/* Add Player Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div className="card w-full max-w-md">
            <div className="p-6 border-b border-chess-accent flex items-center justify-between"
            >
              <h2 className="text-xl font-bold text-white">Add New Player</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddPlayer} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter player name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    required
                    value={newPlayer.email}
                    onChange={(e) => setNewPlayer({ ...newPlayer, email: e.target.value })}
                    className="input-field w-full pl-10"
                    placeholder="player@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Rating</label>
                <input
                  type="number"
                  min={0}
                  max={3000}
                  value={newPlayer.rating}
                  onChange={(e) => setNewPlayer({ ...newPlayer, rating: parseInt(e.target.value) })}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={newPlayer.country}
                  onChange={(e) => setNewPlayer({ ...newPlayer, country: e.target.value })}
                  className="input-field w-full"
                  placeholder="Enter country"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Add Player
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
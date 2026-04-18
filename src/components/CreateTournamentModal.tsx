import { useState } from 'react';
import { X } from 'lucide-react';
import type { Tournament } from '../types';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (tournament: Omit<Tournament, 'id' | 'registeredPlayers' | 'matches'>) => void;
}

export default function CreateTournamentModal({ isOpen, onClose, onCreate }: CreateTournamentModalProps) {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    format: 'swiss' | 'round-robin' | 'knockout';
    maxPlayers: number;
    rounds: number;
    prizePool: string;
  }>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: 'Online',
    format: 'swiss',
    maxPlayers: 32,
    rounds: 9,
    prizePool: '$10,000',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      status: 'upcoming',
      currentRound: 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-chess-accent flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Create New Tournament</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Tournament Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field w-full"
              placeholder="Enter tournament name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field w-full h-20 resize-none"
              placeholder="Brief description of the tournament"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Format</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as 'swiss' | 'round-robin' | 'knockout' })}
                className="input-field w-full"
              >
                <option value="swiss">Swiss System</option>
                <option value="round-robin">Round Robin</option>
                <option value="knockout">Knockout</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="input-field w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Max Players</label>
              <input
                type="number"
                min={2}
                max={256}
                value={formData.maxPlayers}
                onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Rounds</label>
              <input
                type="number"
                min={1}
                max={20}
                value={formData.rounds}
                onChange={(e) => setFormData({ ...formData, rounds: parseInt(e.target.value) })}
                className="input-field w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Prize Pool</label>
            <input
              type="text"
              value={formData.prizePool}
              onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
              className="input-field w-full"
              placeholder="e.g., $10,000"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Create Tournament
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
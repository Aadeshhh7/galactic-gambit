import { useState, useMemo } from 'react';
import { ArrowLeft, Trophy, Calendar, MapPin, Users, Award, ChevronRight, Check } from 'lucide-react';
import type { Tournament, Player, Match } from '../types';

interface TournamentDetailProps {
  tournament: Tournament;
  players: Player[];
  onBack: () => void;
  onUpdateTournament: (tournament: Tournament) => void;
}

export default function TournamentDetail({ tournament, players, onBack, onUpdateTournament }: TournamentDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'pairings' | 'standings'>('overview');

  const registeredPlayers = useMemo(() => {
    return players.filter(p => tournament.registeredPlayers.includes(p.id));
  }, [tournament.registeredPlayers, players]);

  const availablePlayers = useMemo(() => {
    return players.filter(p => !tournament.registeredPlayers.includes(p.id));
  }, [tournament.registeredPlayers, players]);

  const generatePairings = () => {
    const shuffled = [...registeredPlayers].sort(() => Math.random() - 0.5);
    const newMatches: Match[] = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      if (shuffled[i + 1]) {
        newMatches.push({
          id: `match-${Date.now()}-${i}`,
          round: tournament.currentRound + 1,
          player1Id: shuffled[i].id,
          player2Id: shuffled[i + 1].id,
          player1Name: shuffled[i].name,
          player2Name: shuffled[i + 1].name,
          result: null,
          completed: false,
        });
      }
    }

    const updatedTournament = {
      ...tournament,
      currentRound: tournament.currentRound + 1,
      status: tournament.currentRound === 0 ? 'active' : tournament.status,
      matches: [...tournament.matches, ...newMatches],
    };

    onUpdateTournament(updatedTournament);
  };

  const registerPlayer = (playerId: string) => {
    const updatedTournament = {
      ...tournament,
      registeredPlayers: [...tournament.registeredPlayers, playerId],
    };
    onUpdateTournament(updatedTournament);
  };

  const updateMatchResult = (matchId: string, result: '1-0' | '0-1' | '1/2-1/2') => {
    const updatedMatches = tournament.matches.map(m =>
      m.id === matchId ? { ...m, result, completed: true } : m
    );
    onUpdateTournament({ ...tournament, matches: updatedMatches });
  };

  const getStandings = () => {
    const standings: Record<string, { player: Player; points: number; wins: number; draws: number; losses: number }> = {};

    registeredPlayers.forEach(p => {
      standings[p.id] = { player: p, points: 0, wins: 0, draws: 0, losses: 0 };
    });

    tournament.matches.filter(m => m.completed).forEach(match => {
      if (match.result === '1-0') {
        standings[match.player1Id].points += 1;
        standings[match.player1Id].wins += 1;
        standings[match.player2Id].losses += 1;
      } else if (match.result === '0-1') {
        standings[match.player2Id].points += 1;
        standings[match.player2Id].wins += 1;
        standings[match.player1Id].losses += 1;
      } else if (match.result === '1/2-1/2') {
        standings[match.player1Id].points += 0.5;
        standings[match.player2Id].points += 0.5;
        standings[match.player1Id].draws += 1;
        standings[match.player2Id].draws += 1;
      }
    });

    return Object.values(standings).sort((a, b) => b.points - a.points);
  };

  const currentRoundMatches = tournament.matches.filter(m => m.round === tournament.currentRound);
  const standings = getStandings();

  const statusColors = {
    upcoming: 'bg-blue-500',
    active: 'bg-green-500',
    completed: 'bg-gray-500',
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Tournaments</span>
      </button>

      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className={`px-3 py-1 rounded text-sm font-semibold text-white ${statusColors[tournament.status]}`}>
                {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
              </span>
              <span className="px-3 py-1 rounded text-sm font-semibold bg-chess-accent text-gray-300">
                {tournament.format === 'swiss' ? 'Swiss System' :
                 tournament.format === 'round-robin' ? 'Round Robin' : 'Knockout'}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{tournament.name}</h1>
            <p className="text-gray-400 mb-4">{tournament.description}</p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Calendar size={16} />
                <span>{tournament.startDate} - {tournament.endDate}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin size={16} />
                <span>{tournament.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Users size={16} />
                <span>{tournament.registeredPlayers.length} / {tournament.maxPlayers} Players</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <Trophy className="text-chess-gold" size={24} />
              <span className="text-2xl font-bold text-white">{tournament.prizePool}</span>
            </div>
            <p className="text-gray-400 text-sm">Prize Pool</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-chess-accent">
          <div className="flex flex-wrap gap-2">
            {['overview', 'players', 'pairings', 'standings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-chess-gold text-white'
                    : 'bg-chess-accent text-gray-400 hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current Round</p>
                <p className="text-3xl font-bold text-white">{tournament.currentRound} / {tournament.rounds}</p>
              </div>
              <div className="w-12 h-12 bg-chess-accent rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Matches</p>
                <p className="text-3xl font-bold text-white">{tournament.matches.length}</p>
              </div>
              <div className="w-12 h-12 bg-chess-accent rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚔️</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Completed</p>
                <p className="text-3xl font-bold text-white">
                  {tournament.matches.filter(m => m.completed).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Check className="text-green-400" size={24} />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Leader</p>
                <p className="text-lg font-bold text-white truncate">
                  {standings[0]?.player.name || 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Award className="text-yellow-400" size={24} />
              </div>
            </div>
          </div>

          {tournament.status === 'active' && tournament.currentRound < tournament.rounds && (
            <div className="md:col-span-2 lg:col-span-4">
              <button
                onClick={generatePairings}
                className="btn-primary w-full py-4 text-lg"
              >
                Generate Round {tournament.currentRound + 1} Pairings
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'players' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Registered Players ({registeredPlayers.length})</h3>
            <div className="space-y-3">
              {registeredPlayers.map((player) => (
                <div key={player.id} className="card p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-chess-gold to-red-600 rounded-full flex items-center justify-center font-bold text-white">
                      {player.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{player.name}</p>
                      <p className="text-sm text-gray-400">{player.country} • {player.rating} Elo</p>
                    </div>
                  </div>
                  <span className="text-chess-gold">✓</span>
                </div>
              ))}
            </div>
          </div>

          {tournament.status === 'upcoming' && registeredPlayers.length < tournament.maxPlayers && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Available Players</h3>
              <div className="space-y-3">
                {availablePlayers.map((player) => (
                  <div key={player.id} className="card p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-chess-accent rounded-full flex items-center justify-center font-bold text-white">
                        {player.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{player.name}</p>
                        <p className="text-sm text-gray-400">{player.country} • {player.rating} Elo</p>
                      </div>
                    </div>
                    <button
                      onClick={() => registerPlayer(player.id)}
                      className="btn-secondary text-sm"
                    >
                      Register
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pairings' && (
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Round {tournament.currentRound} Pairings</h3>

          {currentRoundMatches.length > 0 ? (
            <div className="space-y-3">
              {currentRoundMatches.map((match) => (
                <div key={match.id} className="card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-center justify-end space-x-4">
                      <div className="text-right">
                        <p className="font-bold text-white">{match.player1Name}</p>
                        <p className="text-sm text-gray-400">White</p>
                      </div>
                      <div className="w-10 h-10 bg-chess-accent rounded-full flex items-center justify-center font-bold text-white">
                        {match.player1Name.charAt(0)}
                      </div>
                    </div>

                    <div className="px-6">
                      {match.completed ? (
                        <span className="text-xl font-bold text-chess-gold">{match.result}</span>
                      ) : (
                        <span className="text-gray-500">vs</span>
                      )}
                    </div>

                    <div className="flex-1 flex items-center space-x-4">
                      <div className="w-10 h-10 bg-chess-accent rounded-full flex items-center justify-center font-bold text-white">
                        {match.player2Name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{match.player2Name}</p>
                        <p className="text-sm text-gray-400">Black</p>
                      </div>
                    </div>
                  </div>

                  {!match.completed && tournament.status === 'active' && (
                    <div className="flex justify-center space-x-2 mt-4 pt-4 border-t border-chess-accent">
                      <button
                        onClick={() => updateMatchResult(match.id, '1-0')}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                      >
                        1-0
                      </button>
                      <button
                        onClick={() => updateMatchResult(match.id, '1/2-1/2')}
                        className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30"
                      >
                        ½-½
                      </button>
                      <button
                        onClick={() => updateMatchResult(match.id, '0-1')}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                      >
                        0-1
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-gray-400">No pairings generated yet</p>
              {tournament.status === 'active' && tournament.currentRound < tournament.rounds && (
                <button onClick={generatePairings} className="btn-primary mt-4">
                  Generate Pairings
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'standings' && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-chess-accent">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Rank</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-300">Player</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-300">Points</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-300">W</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-300">D</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-300">L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chess-accent">
              {standings.map((entry, index) => (
                <tr key={entry.player.id} className="hover:bg-chess-accent/50"
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
                        {entry.player.name.charAt(0)}
                      </div>
                      <span className="font-medium text-white">{entry.player.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="text-xl font-bold text-chess-gold">{entry.points}</span>
                  </td>
                  <td className="py-4 px-6 text-center text-green-400">{entry.wins}</td>
                  <td className="py-4 px-6 text-center text-yellow-400">{entry.draws}</td>
                  <td className="py-4 px-6 text-center text-red-400">{entry.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {standings.length === 0 && (
            <div className="p-12 text-center">
              <Award className="mx-auto text-chess-accent mb-4" size={48} />
              <p className="text-gray-400">No standings yet. Complete some matches to see results.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
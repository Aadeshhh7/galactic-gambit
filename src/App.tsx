import { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Tournaments from './pages/Tournaments';
import Players from './pages/Players';
import TournamentDetail from './pages/TournamentDetail';
import CreateTournamentModal from './components/CreateTournamentModal';
import { getPlayers, getTournaments, saveTournaments, addPlayer as addPlayerToStorage } from './utils/storage';
import type { Player, Tournament } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    setPlayers(getPlayers());
    setTournaments(getTournaments());
  }, []);

  const handleViewTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setCurrentView('tournament-detail');
  };

  const handleBackFromDetail = () => {
    setSelectedTournament(null);
    setCurrentView('tournaments');
  };

  const handleCreateTournament = (tournamentData: Omit<Tournament, 'id' | 'registeredPlayers' | 'matches'>) => {
    const newTournament: Tournament = {
      ...tournamentData,
      id: uuidv4(),
      registeredPlayers: [],
      matches: [],
    };

    const updatedTournaments = [...tournaments, newTournament];
    setTournaments(updatedTournaments);
    saveTournaments(updatedTournaments);
  };

  const handleUpdateTournament = (updatedTournament: Tournament) => {
    const updatedTournaments = tournaments.map(t =>
      t.id === updatedTournament.id ? updatedTournament : t
    );
    setTournaments(updatedTournaments);
    setSelectedTournament(updatedTournament);
    saveTournaments(updatedTournaments);
  };

  const handleAddPlayer = (playerData: Omit<Player, 'id' | 'joinDate' | 'wins' | 'losses' | 'draws'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: uuidv4(),
      joinDate: new Date().toISOString().split('T')[0],
      wins: 0,
      losses: 0,
      draws: 0,
    };

    addPlayerToStorage(newPlayer);
    setPlayers(getPlayers());
  };

  return (
    <div className="min-h-screen bg-chess-dark">
      <Header
        currentView={currentView}
        setView={(view) => {
          setCurrentView(view);
          setSelectedTournament(null);
        }}
        onCreateTournament={() => setIsCreateModalOpen(true)}
      />

      <main>
        {currentView === 'dashboard' && (
          <Dashboard
            players={players}
            tournaments={tournaments}
            onViewTournament={handleViewTournament}
          />
        )}

        {currentView === 'tournaments' && (
          <Tournaments
            tournaments={tournaments}
            onViewTournament={handleViewTournament}
          />
        )}

        {currentView === 'players' && (
          <Players
            players={players}
            onAddPlayer={handleAddPlayer}
          />
        )}

        {currentView === 'tournament-detail' && selectedTournament && (
          <TournamentDetail
            tournament={selectedTournament}
            players={players}
            onBack={handleBackFromDetail}
            onUpdateTournament={handleUpdateTournament}
          />
        )}
      </main>

      <CreateTournamentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTournament}
      />
    </div>
  );
}

export default App
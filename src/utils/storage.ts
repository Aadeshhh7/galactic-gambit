import type { Player, Tournament } from '../types';
import { mockPlayers, mockTournaments } from '../data/mockData';

const PLAYERS_KEY = 'gg_players';
const TOURNAMENTS_KEY = 'gg_tournaments';

export const getPlayers = (): Player[] => {
  const stored = localStorage.getItem(PLAYERS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(mockPlayers));
  return mockPlayers;
};

export const savePlayers = (players: Player[]): void => {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
};

export const getTournaments = (): Tournament[] => {
  const stored = localStorage.getItem(TOURNAMENTS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(mockTournaments));
  return mockTournaments;
};

export const saveTournaments = (tournaments: Tournament[]): void => {
  localStorage.setItem(TOURNAMENTS_KEY, JSON.stringify(tournaments));
};

export const addPlayer = (player: Player): void => {
  const players = getPlayers();
  players.push(player);
  savePlayers(players);
};

export const updatePlayer = (updatedPlayer: Player): void => {
  const players = getPlayers();
  const index = players.findIndex(p => p.id === updatedPlayer.id);
  if (index !== -1) {
    players[index] = updatedPlayer;
    savePlayers(players);
  }
};

export const deletePlayer = (playerId: string): void => {
  const players = getPlayers();
  const filtered = players.filter(p => p.id !== playerId);
  savePlayers(filtered);
};

export const addTournament = (tournament: Tournament): void => {
  const tournaments = getTournaments();
  tournaments.push(tournament);
  saveTournaments(tournaments);
};

export const updateTournament = (updatedTournament: Tournament): void => {
  const tournaments = getTournaments();
  const index = tournaments.findIndex(t => t.id === updatedTournament.id);
  if (index !== -1) {
    tournaments[index] = updatedTournament;
    saveTournaments(tournaments);
  }
};

export const deleteTournament = (tournamentId: string): void => {
  const tournaments = getTournaments();
  const filtered = tournaments.filter(t => t.id !== tournamentId);
  saveTournaments(filtered);
};
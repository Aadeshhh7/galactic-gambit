export interface Player {
  id: string;
  name: string;
  email: string;
  rating: number;
  country: string;
  joinDate: string;
  avatar?: string;
  wins: number;
  losses: number;
  draws: number;
}

export interface Match {
  id: string;
  round: number;
  player1Id: string;
  player2Id: string;
  player1Name: string;
  player2Name: string;
  result: '1-0' | '0-1' | '1/2-1/2' | null;
  completed: boolean;
}

export type TournamentStatus = 'upcoming' | 'active' | 'completed';
export type TournamentFormat = 'swiss' | 'round-robin' | 'knockout';

export interface Tournament {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  format: TournamentFormat;
  status: TournamentStatus;
  maxPlayers: number;
  registeredPlayers: string[];
  rounds: number;
  currentRound: number;
  matches: Match[];
  prizePool: string;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  buchholz: number;
}
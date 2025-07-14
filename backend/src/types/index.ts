export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string;
  isOnline: boolean;
  stats: UserStats;
  createdAt: Date;
  lastLogin?: Date;
  twoFactorEnabled: boolean;
  oauthProviders?: string[];
}

export interface UserStats {
  wins: number;
  losses: number;
  totalGames: number;
  winRate: number;
  rank: number;
  highestScore: number;
  currentStreak: number;
  longestStreak: number;
}

export interface MatchHistory {
  id: string;
  player1Id: string;
  player2Id: string;
  player1Score: number;
  player2Score: number;
  winnerId: string;
  duration: number;
  playedAt: Date;
  gameMode: 'classic' | 'tournament';
}

export interface Tournament {
  id: string;
  name: string;
  players: string[];
  status: 'waiting' | 'active' | 'finished';
  bracket: TournamentMatch[];
  winner?: string;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  player1Id: string;
  player2Id: string;
  winnerId?: string;
  score?: { player1: number; player2: number };
  round: number;
  playedAt?: Date;
}

export interface GameRoom {
  id: string;
  player1: string;
  player2?: string;
  status: 'waiting' | 'playing' | 'finished';
  gameState: GameState;
  createdAt: Date;
}

export interface GameState {
  ball: {
    x: number;
    y: number;
    vx: number;
    vy: number;
  };
  paddles: {
    player1: { y: number };
    player2: { y: number };
  };
  score: {
    player1: number;
    player2: number;
  };
  lastUpdate: Date;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}
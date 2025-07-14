export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  stats: UserStats;
  createdAt: string;
  lastLogin?: string;
  twoFactorEnabled: boolean;
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

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}
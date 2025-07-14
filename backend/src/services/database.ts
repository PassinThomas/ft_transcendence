import { User, MatchHistory, Tournament } from '../types/index.js';
import bcrypt from 'bcrypt';
class DatabaseService {
  private users: Map<string, User> = new Map();
  private matches: Map<string, MatchHistory> = new Map();
  private tournaments: Map<string, Tournament> = new Map();

  constructor() {
    this.seedData();
  }

  private async seedData() {
    // Utilisateurs de test
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const playerPasswordHash = await bcrypt.hash('player123', 10);
    const player2PasswordHash = await bcrypt.hash('player234', 10);
    
    this.users.set('1', {
      id: '1',
      username: 'admin',
      email: 'admin@transcendence.com',
      password: adminPasswordHash,  //Mot de passe: admin123
      isOnline: true,
      twoFactorEnabled: false,
      stats: {
        wins: 15,
        losses: 5,
        totalGames: 20,
        winRate: 750,
        rank: 1,
        highestScore: 11,
        currentStreak: 3,
        longestStreak: 8
      },
      createdAt: new Date(),
      lastLogin: new Date()
    });

    this.users.set('2', {
      id: '2',
      username: 'player1',
      email: 'player1@transcendence.com',
      password: playerPasswordHash,  // Mot de passe: player123
      isOnline: true,
      twoFactorEnabled: false,
      stats: {
        wins: 8,
        losses: 12,
        totalGames: 20,
        winRate: 40,
        rank: 5,
        highestScore: 9,
        currentStreak: 0,
        longestStreak: 4
      },
      createdAt: new Date(),
      lastLogin: new Date()
    });

    this.users.set('3', {
      id: '3',
      username: 'player2',
      email: 'player1@transcendence.com',
      password: player2PasswordHash,  // Mot de passe: player123
      isOnline: true,
      twoFactorEnabled: false,
      stats: {
        wins: 8,
        losses: 12,
        totalGames: 20,
        winRate: 40,
        rank: 5,
        highestScore: 9,
        currentStreak: 0,
        longestStreak: 4
      },
      createdAt: new Date(),
      lastLogin: new Date()
    });

    // Historique de match de test
    this.matches.set('1', {
      id: '1',
      player1Id: '1',
      player2Id: '2',
      player1Score: 11,
      player2Score: 7,
      winnerId: '1',
      duration: 180,
      playedAt: new Date(),
      gameMode: 'classic'
    });
  }

  // Users
  async findUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'stats' | 'isOnline' | 'twoFactorEnabled'>): Promise<User> {
    const id = (this.users.size + 1).toString();
    const user: User = {
      id,
      ...userData,
      isOnline: false,
      twoFactorEnabled: false,
      stats: {
        wins: 0,
        losses: 0,
        totalGames: 0,
        winRate: 0,
        rank: this.users.size + 1,
        highestScore: 0,
        currentStreak: 0,
        longestStreak: 0
      },
      createdAt: new Date()
    };

    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Match History
  async getMatchHistory(userId: string): Promise<MatchHistory[]> {
    const matches = [];
    for (const match of this.matches.values()) {
      if (match.player1Id === userId || match.player2Id === userId) {
        matches.push(match);
      }
    }
    return matches.sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime());
  }

  async createMatch(matchData: Omit<MatchHistory, 'id'>): Promise<MatchHistory> {
    const id = (this.matches.size + 1).toString();
    const match: MatchHistory = {
      id,
      ...matchData
    };

    this.matches.set(id, match);
    return match;
  }

  // Tournaments 
  async getAllTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values());
  }

  async getTournamentById(id: string): Promise<Tournament | null> {
    return this.tournaments.get(id) || null;
  }

  async createTournament(tournamentData: Omit<Tournament, 'id' | 'createdAt'>): Promise<Tournament> {
    const id = (this.tournaments.size + 1).toString();
    const tournament: Tournament = {
      id,
      ...tournamentData,
      createdAt: new Date()
    };

    this.tournaments.set(id, tournament);
    return tournament;
  }
}

export const db = new DatabaseService();
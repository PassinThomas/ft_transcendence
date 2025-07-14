import { GameState } from '../types/game.js';

export class GameService {
  private games: Map<string, GameState> = new Map();
  private playerInputs: Map<string, 'up' | 'down' | 'stop'> = new Map();
  
  private readonly GAME_WIDTH = 800;
  private readonly GAME_HEIGHT = 400;
  private readonly PADDLE_WIDTH = 10;
  private readonly PADDLE_HEIGHT = 80;
  private readonly BALL_RADIUS = 8;
  private readonly PADDLE_SPEED = 5;
  private readonly BALL_SPEED = 4;

  createGame(player1Id: string): GameState {
    const gameId = this.generateGameId();
    
    const game: GameState = {
      id: gameId,
      player1Id,
      player2Id: null,
      ball: {
        x: this.GAME_WIDTH / 2,
        y: this.GAME_HEIGHT / 2,
        vx: Math.random() > 0.5 ? this.BALL_SPEED : -this.BALL_SPEED,
        vy: (Math.random() - 0.5) * this.BALL_SPEED,
        radius: this.BALL_RADIUS
      },
      paddles: {
        player1: {
          x: 20,
          y: this.GAME_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
          width: this.PADDLE_WIDTH,
          height: this.PADDLE_HEIGHT
        },
        player2: {
          x: this.GAME_WIDTH - 30,
          y: this.GAME_HEIGHT / 2 - this.PADDLE_HEIGHT / 2,
          width: this.PADDLE_WIDTH,
          height: this.PADDLE_HEIGHT
        }
      },
      score: { player1: 0, player2: 0 },
      status: 'waiting',
      gameWidth: this.GAME_WIDTH,
      gameHeight: this.GAME_HEIGHT,
      lastUpdate: Date.now()
    };

    this.games.set(gameId, game);
    console.log(`🎮 Created game ${gameId} for player ${player1Id}`);
    return game;
  }

  joinGame(gameId: string, player2Id: string): GameState | null {
    const game = this.games.get(gameId);
    if (!game || game.player2Id) {
      console.log(`❌ Cannot join game ${gameId}: ${!game ? 'not found' : 'already full'}`);
      return null;
    }

    game.player2Id = player2Id;
    game.status = 'playing';
    console.log(`✅ Player ${player2Id} joined game ${gameId} - Game starting!`);
    return game;
  }

  updatePlayerInput(gameId: string, playerId: string, direction: 'up' | 'down' | 'stop'): void {
    const key = `${gameId}_${playerId}`;
    this.playerInputs.set(key, direction);
  }

  updateGame(gameId: string): GameState | null {
    const game = this.games.get(gameId);
    if (!game || game.status !== 'playing') return null;

    const now = Date.now();
    const deltaTime = Math.min((now - game.lastUpdate) / 16, 2); // Cap delta time

    // Update paddles based on player input
    this.updatePaddles(game, deltaTime);
    
    // Update ball physics
    this.updateBall(game, deltaTime);
    
    game.lastUpdate = now;
    return game;
  }

  private updatePaddles(game: GameState, deltaTime: number): void {
    // Player 1 paddle
    const player1Input = this.playerInputs.get(`${game.id}_${game.player1Id}`) || 'stop';
    if (player1Input === 'up') {
      game.paddles.player1.y = Math.max(0, game.paddles.player1.y - this.PADDLE_SPEED * deltaTime);
    } else if (player1Input === 'down') {
      game.paddles.player1.y = Math.min(
        game.gameHeight - game.paddles.player1.height,
        game.paddles.player1.y + this.PADDLE_SPEED * deltaTime
      );
    }

    // Player 2 paddle
    if (game.player2Id) {
      const player2Input = this.playerInputs.get(`${game.id}_${game.player2Id}`) || 'stop';
      if (player2Input === 'up') {
        game.paddles.player2.y = Math.max(0, game.paddles.player2.y - this.PADDLE_SPEED * deltaTime);
      } else if (player2Input === 'down') {
        game.paddles.player2.y = Math.min(
          game.gameHeight - game.paddles.player2.height,
          game.paddles.player2.y + this.PADDLE_SPEED * deltaTime
        );
      }
    }
  }

  private updateBall(game: GameState, deltaTime: number): void {
    // Move ball
    game.ball.x += game.ball.vx * deltaTime;
    game.ball.y += game.ball.vy * deltaTime;

    // Bounce off top and bottom walls
    if (game.ball.y <= game.ball.radius || game.ball.y >= game.gameHeight - game.ball.radius) {
      game.ball.vy = -game.ball.vy;
      game.ball.y = Math.max(game.ball.radius, Math.min(game.gameHeight - game.ball.radius, game.ball.y));
    }

    // Check paddle collisions
    this.checkPaddleCollision(game);

    // Check scoring
    if (game.ball.x <= 0) {
      game.score.player2++;
      this.resetBall(game);
      console.log(`⚽ Player 2 scored! Score: ${game.score.player1}-${game.score.player2}`);
    } else if (game.ball.x >= game.gameWidth) {
      game.score.player1++;
      this.resetBall(game);
      console.log(`⚽ Player 1 scored! Score: ${game.score.player1}-${game.score.player2}`);
    }
  }

  private checkPaddleCollision(game: GameState): void {
    const ball = game.ball;
    
    // Player 1 paddle collision
    if (ball.vx < 0 && // Ball moving left
        ball.x - ball.radius <= game.paddles.player1.x + game.paddles.player1.width &&
        ball.x + ball.radius >= game.paddles.player1.x &&
        ball.y >= game.paddles.player1.y &&
        ball.y <= game.paddles.player1.y + game.paddles.player1.height) {
      
      ball.vx = Math.abs(ball.vx);
      ball.x = game.paddles.player1.x + game.paddles.player1.width + ball.radius;
      
      // Add spin based on where the ball hit the paddle
      const relativeIntersectY = (ball.y - (game.paddles.player1.y + game.paddles.player1.height / 2));
      const normalizedRelativeIntersection = relativeIntersectY / (game.paddles.player1.height / 2);
      ball.vy = normalizedRelativeIntersection * this.BALL_SPEED;
    }

    // Player 2 paddle collision
    if (ball.vx > 0 && // Ball moving right
        ball.x + ball.radius >= game.paddles.player2.x &&
        ball.x - ball.radius <= game.paddles.player2.x + game.paddles.player2.width &&
        ball.y >= game.paddles.player2.y &&
        ball.y <= game.paddles.player2.y + game.paddles.player2.height) {
      
      ball.vx = -Math.abs(ball.vx);
      ball.x = game.paddles.player2.x - ball.radius;
      
      // Add spin based on where the ball hit the paddle
      const relativeIntersectY = (ball.y - (game.paddles.player2.y + game.paddles.player2.height / 2));
      const normalizedRelativeIntersection = relativeIntersectY / (game.paddles.player2.height / 2);
      ball.vy = normalizedRelativeIntersection * this.BALL_SPEED;
    }
  }

  private resetBall(game: GameState): void {
    game.ball.x = game.gameWidth / 2;
    game.ball.y = game.gameHeight / 2;
    game.ball.vx = Math.random() > 0.5 ? this.BALL_SPEED : -this.BALL_SPEED;
    game.ball.vy = (Math.random() - 0.5) * this.BALL_SPEED;
  }

  getAllGames(): GameState[] {
    return Array.from(this.games.values());
  }

  getGame(gameId: string): GameState | null {
    return this.games.get(gameId) || null;
  }

  getAvailableGames(): GameState[] {
    return Array.from(this.games.values()).filter(game => game.status === 'waiting');
  }

  removeGame(gameId: string): void {
    const removed = this.games.delete(gameId);
    if (removed) {
      console.log(`🗑️ Removed game ${gameId}`);
    }
    
    // Clean up player inputs
    for (const key of this.playerInputs.keys()) {
      if (key.startsWith(gameId)) {
        this.playerInputs.delete(key);
      }
    }
  }

  private generateGameId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

export const gameService = new GameService();
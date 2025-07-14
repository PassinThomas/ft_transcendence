import { FastifyPluginAsync } from 'fastify';
import { gameService } from '../services/gameService.js';
import { GameState } from '../types/game.js';

const gameRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    let playerId: string | null = null;
    let gameId: string | null = null;

    console.log('✅ New WebSocket connection established');

    // In Fastify WebSocket, the connection IS the socket
    const socket = connection.socket || connection;

    socket.on('message', async (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('📨 Received WebSocket message:', data);
        
        switch (data.type) {
          case 'join_game':
            try {
              playerId = data.playerId;
              console.log(`🎮 Player ${playerId} attempting to join game`);
              
              const availableGames = gameService.getAvailableGames();
              let game: GameState | null = null;
              
              if (availableGames.length > 0 && playerId) {
                // Join existing game
                game = gameService.joinGame(availableGames[0].id, playerId);
                gameId = availableGames[0].id;
                
                if (game) {
                  console.log(`✅ Player ${playerId} joined existing game ${gameId}`);
                  
                  // Notify all clients that the game has started
                  broadcastToAll({
                    type: 'game_started',
                    data: game
                  });
                }
              } else if (playerId) {
                // Create new game
                game = gameService.createGame(playerId);
                gameId = game.id;
                
                console.log(`🎯 Player ${playerId} created new game ${gameId}`);
                
                // Send response to this player
                socket.send(JSON.stringify({
                  type: 'waiting_for_player',
                  data: game
                }));
                
                console.log('✅ Sent waiting_for_player response');
              }
            } catch (error) {
              console.error('❌ Error in join_game:', error);
              socket.send(JSON.stringify({
                type: 'error',
                data: { message: 'Failed to join game' }
              }));
            }
            break;

          case 'player_input':
            if (gameId && playerId) {
              console.log(`🎮 Player ${playerId} input: ${data.direction}`);
              gameService.updatePlayerInput(gameId, playerId, data.direction);
            }
            break;

          case 'leave_game':
            if (gameId && playerId) {
              console.log(`👋 Player ${playerId} leaving game ${gameId}`);
              gameService.removeGame(gameId);
              
              // Notify other players
              broadcastToAll({
                type: 'player_left',
                data: { gameId }
              });
            }
            break;

          default:
            console.log('❓ Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('❌ WebSocket message processing error:', error);
      }
    });

    socket.on('close', () => {
      console.log(`❌ WebSocket connection closed for player ${playerId}`);
      if (gameId) {
        gameService.removeGame(gameId);
      }
    });

    socket.on('error', (error: Error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    // Store the socket for broadcasting
    socket.playerId = playerId;
    socket.gameId = gameId;
  });

  // Function to broadcast to all connected clients
  function broadcastToAll(message: any) {
    const messageStr = JSON.stringify(message);
    console.log('📡 Broadcasting to all clients:', message.type);
    
    if (fastify.websocketServer && fastify.websocketServer.clients) {
      fastify.websocketServer.clients.forEach((client: any) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          try {
            client.send(messageStr);
          } catch (error) {
            console.error('❌ Failed to send to client:', error);
          }
        }
      });
    }
  }

  // Game loop - Updates game state and broadcasts to clients
  let gameLoopInterval: NodeJS.Timeout;
  
  const startGameLoop = () => {
    console.log('🔄 Starting game loop...');
    gameLoopInterval = setInterval(() => {
      try {
        const allGames = gameService.getAllGames();
        
        allGames.forEach(game => {
          if (game.status === 'playing') {
            const updatedGame = gameService.updateGame(game.id);
            if (updatedGame) {
              // Broadcast game state update
              broadcastToAll({
                type: 'game_update',
                data: updatedGame
              });
            }
          }
        });
      } catch (error) {
        console.error('❌ Game loop error:', error);
      }
    }, 16); // ~60 FPS
  };

  // Start the game loop when the plugin loads
  startGameLoop();

  // Clean up on server shutdown
  fastify.addHook('onClose', () => {
    if (gameLoopInterval) {
      clearInterval(gameLoopInterval);
      console.log('🛑 Game loop stopped');
    }
  });

  // REST endpoints for testing
  fastify.get('/active', async (request, reply) => {
    try {
      const games = gameService.getAvailableGames();
      return reply.send(games);
    } catch (error) {
      console.error('❌ Failed to get active games:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });

  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const game = gameService.getGame(id);
      
      if (!game) {
        return reply.code(404).send({ error: 'Game not found' });
      }
      
      return reply.send(game);
    } catch (error) {
      console.error('❌ Failed to get game:', error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
};

export default gameRoutes;
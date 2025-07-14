import { FastifyPluginAsync } from 'fastify';
import { authController } from '../controllers/authController.js';
import { db } from '../services/database.js';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: { type: 'string', minLength: 3, maxLength: 20 },
          password: { type: 'string', minLength: 6 }
        }
      }
    }
  }, authController.login);

  fastify.post('/register', {
    schema: {
      body: {
        type: 'object',
        required: ['username', 'email', 'password'],
        properties: {
          username: { 
            type: 'string', 
            minLength: 3, 
            maxLength: 20,
            pattern: '^[a-zA-Z0-9_]+$'
          },
          email: { 
            type: 'string', 
            format: 'email' 
          },
          password: { 
            type: 'string', 
            minLength: 8
          }
        }
      }
    }
  }, authController.register);

  fastify.get('/me', {
    preHandler: [fastify.authenticate]
  }, authController.getCurrentUser);

  // Endpoint pour l'historique des matchs de l'utilisateur connecté
  fastify.get('/me/matches', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const userId = request.user.userId;
      const matches = await db.getMatchHistory(userId);
      
      const transformedMatches = matches.map(match => ({
        id: match.id,
        opponent: match.player1Id === userId ? match.player2Id : match.player1Id,
        score: {
          player: match.player1Id === userId ? match.player1Score : match.player2Score,
          opponent: match.player1Id === userId ? match.player2Score : match.player1Score
        },
        result: match.winnerId === userId ? 'win' : 'loss',
        date: match.playedAt.toISOString(),
        duration: match.duration
      }));

      return reply.send(transformedMatches);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error',
        message: 'Failed to get match history' 
      });
    }
  });

  fastify.post('/logout', {
    preHandler: [fastify.authenticate]
  }, authController.logout);
};

export default authRoutes;
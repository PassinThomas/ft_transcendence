import { FastifyPluginAsync } from 'fastify';
import { db } from '../services/database.js';

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const user = await db.findUserById(id);
      
      if (!user) {
        return reply.code(404).send({ 
          error: 'Not Found',
          message: 'User not found' 
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      return reply.send(userWithoutPassword);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ 
        error: 'Internal Server Error',
        message: 'Failed to get user profile' 
      });
    }
  });

  fastify.get('/:id/matches', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const matches = await db.getMatchHistory(id);
      
      // Transform pour le frontend
      const transformedMatches = matches.map(match => ({
        id: match.id,
        opponent: match.player1Id === id ? match.player2Id : match.player1Id,
        score: {
          player: match.player1Id === id ? match.player1Score : match.player2Score,
          opponent: match.player1Id === id ? match.player2Score : match.player1Score
        },
        result: match.winnerId === id ? 'win' : 'loss',
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
};

export default userRoutes;
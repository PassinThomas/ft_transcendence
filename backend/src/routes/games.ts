import { FastifyPluginAsync } from 'fastify';

const gameRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/rooms', async (request, reply) => {
    return reply.send({ message: 'Game rooms endpoint' });
  });

  fastify.post('/rooms', async (request, reply) => {
    return reply.send({ message: 'Create game room endpoint' });
  });
};

export default gameRoutes;
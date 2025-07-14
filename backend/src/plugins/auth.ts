import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      userId: string;
      username: string;
    };
    user: {
      userId: string;
      username: string;
    };
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      // request.user est maintenant typé correctement grâce à la déclaration de module
    } catch (err) {
      reply.code(401).send({ 
        error: 'Unauthorized', 
        message: 'Invalid or missing token' 
      });
    }
  });
};

export default fp(authPlugin);
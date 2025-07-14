import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import websocket from '@fastify/websocket';
import authPlugin from './plugins/auth.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import gameRoutes from './routes/game.js';

export const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  }
});

// WebSocket support - Register this FIRST and ONLY ONCE
await app.register(websocket);

// CORS
await app.register(cors, {
  origin: [
    'http://localhost:3000',
    'http://localhost:8080',
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// JWT
await app.register(jwt, {
  secret: process.env.JWT_SECRET || 'supersecret-change-in-production'
});

// Swagger documentation
await app.register(swagger, {
  swagger: {
    info: {
      title: 'ft_transcendence API',
      description: 'API for the ultimate Pong experience',
      version: '1.0.0'
    }
  }
});

await app.register(swaggerUI, {
  routePrefix: '/docs'
});

// Auth plugin
await app.register(authPlugin);

// Health check
app.get('/health', async () => {
  return { 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
});

// Routes
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(userRoutes, { prefix: '/api/users' });
await app.register(gameRoutes, { prefix: '/api/game' });

// Error handler
app.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  
  reply.code(500).send({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : error.message
  });
});